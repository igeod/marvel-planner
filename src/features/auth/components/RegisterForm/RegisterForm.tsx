import { UserPlus } from "lucide-react";
import { useState, type FormEvent } from "react";
import { PasswordField, TextField } from "../../../../components/ui/Field";
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

type RegisterField = "name" | "email" | "password";

export function RegisterForm() {
  const { t } = useI18n();
  const { register } = useAuth();
  const { close } = useAuthDialog();
  const { run, error, isPending } = useAuthAction(register, close);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FieldErrors<RegisterField>>({});

  const policy = usePasswordPolicy();
  const suggestion = suggestEmail(email);

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

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <TextField
        label={t("auth.name")}
        name="name"
        autoComplete="nickname"
        required
        maxLength={30}
        value={name}
        onChange={setName}
        hint={t("auth.nameHint")}
        error={errors.name && t(errors.name)}
      />
      <TextField
        label={t("auth.email")}
        name="email"
        type="email"
        autoComplete="email"
        required
        value={email}
        onChange={setEmail}
        hint={suggestion ? t("auth.emailSuggestion", { email: suggestion }) : undefined}
        error={errors.email && t(errors.email)}
      />
      <PasswordField
        label={t("auth.password")}
        name="password"
        autoComplete="new-password"
        required
        minLength={policy.minLength}
        value={password}
        onChange={setPassword}
        hint={t("auth.passwordHint", { min: policy.minLength })}
        error={errors.password && t(errors.password, { min: policy.minLength })}
      />
      {error && <p role="alert">{error}</p>}
      <button type="submit" className="btn btn--primary btn--lg" disabled={isPending}>
        <UserPlus aria-hidden />
        {isPending ? t("auth.register.pending") : t("auth.register.button")}
      </button>
    </form>
  );
}
