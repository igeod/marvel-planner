import { UserPlus } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Button } from "../../../../components/ui/Button/Button";
import { PasswordField, TextField } from "../../../../components/ui/Field/Field";
import { useToast } from "../../../../components/ui/Toast/useToast";
import type { TranslationKey } from "../../../../i18n/types";
import { useI18n } from "../../../../i18n/useI18n";
import {
  focusFirstInvalidField,
  hasErrors,
  isValidEmail,
  suggestEmail,
  type FieldErrors,
} from "../../../../lib/validation";
import { isLongEnough } from "../../../../../shared/passwordPolicy";
import { useAuth } from "../../hooks/useAuth";
import { usePasswordPolicy } from "../../hooks/usePasswordPolicy";
import { useAuthAction } from "../../hooks/useAuthAction";
import { useAuthDialog } from "../../hooks/useAuthDialog";
import { AuthFormError } from "../AuthFormError/AuthFormError";

type RegisterField = "name" | "email" | "password";

// Server answers that belong to a field; any other answer goes in the error row at the top.
const FIELD_FOR_ERROR: Partial<Record<TranslationKey, RegisterField>> = {
  "auth.errors.invalidName": "name",
  "auth.errors.nameTaken": "name",
  "auth.errors.invalidEmail": "email",
  "auth.errors.userExists": "email",
  "auth.errors.passwordShort": "password",
  "auth.errors.passwordWeak": "password",
  "auth.errors.passwordLong": "password",
};

export function RegisterForm() {
  const { t } = useI18n();
  const { register } = useAuth();
  const { close } = useAuthDialog();
  const toast = useToast();
  const { run, reset, error, errorCode, isPending, isBlocked } = useAuthAction(register, () => {
    close();
    toast.show({ tone: "info", title: t("auth.register.done") });
  });
  const formRef = useRef<HTMLFormElement>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FieldErrors<RegisterField>>({});

  const policy = usePasswordPolicy();
  const suggestion = suggestEmail(email);
  const serverField = errorCode ? FIELD_FOR_ERROR[errorCode] : undefined;

  // A server answer on a field puts the focus there; any other answer, on the submit button.
  useEffect(() => {
    if (!errorCode || errorCode === "auth.errors.tooManyRequests") return;
    const target = serverField
      ? formRef.current?.elements.namedItem(serverField)
      : formRef.current?.querySelector('button[type="submit"]');
    (target as HTMLElement | null)?.focus();
  }, [errorCode, serverField]);

  const validate = (): FieldErrors<RegisterField> => ({
    ...(!name.trim() ? { name: "auth.errors.required" as const } : {}),
    ...(!email.trim()
      ? { email: "auth.errors.required" as const }
      : !isValidEmail(email)
        ? { email: "auth.errors.invalidEmail" as const }
        : {}),
    ...(!password
      ? { password: "auth.errors.required" as const }
      : !isLongEnough(policy, password)
        ? { password: "auth.errors.passwordShort" as const }
        : {}),
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const found = validate();
    setErrors(found);
    if (hasErrors(found)) return focusFirstInvalidField(event.currentTarget, found);
    void run({ name: name.trim(), email: email.trim(), password });
  };

  const fieldError = (field: RegisterField) => {
    const key = errors[field];
    if (key) return t(key, { min: policy.minLength });
    return serverField === field ? error : null;
  };

  const edit = (setter: (value: string) => void) => (value: string) => {
    reset();
    setter(value);
  };

  return (
    <form ref={formRef} className="form" onSubmit={handleSubmit} noValidate>
      {error && !serverField && <AuthFormError error={error} code={errorCode} />}
      <TextField
        label={t("auth.name")}
        name="name"
        autoComplete="nickname"
        required
        disabled={isBlocked}
        maxLength={30}
        value={name}
        onChange={edit(setName)}
        hint={t("auth.nameHint")}
        error={fieldError("name")}
      />
      <TextField
        label={t("auth.email")}
        name="email"
        type="email"
        autoComplete="email"
        required
        disabled={isBlocked}
        value={email}
        onChange={edit(setEmail)}
        hint={suggestion ? t("auth.emailSuggestion", { email: suggestion }) : undefined}
        error={fieldError("email")}
      />
      <PasswordField
        label={t("auth.password")}
        name="password"
        autoComplete="new-password"
        required
        disabled={isBlocked}
        minLength={policy.minLength}
        value={password}
        onChange={edit(setPassword)}
        hint={t("auth.passwordHint", { min: policy.minLength })}
        error={fieldError("password")}
      />
      <Button
        type="submit"
        variant="primary"
        size="lg"
        icon={<UserPlus aria-hidden />}
        isLoading={isPending}
        loadingLabel={t("auth.register.pending")}
        disabled={isBlocked}
      >
        {t("auth.register.button")}
      </Button>
    </form>
  );
}
