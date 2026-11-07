import { LogIn } from "lucide-react";
import { useId, useRef, useState, type FormEvent } from "react";
import { Button } from "../../../../components/ui/Button";
import { PasswordField, TextField } from "../../../../components/ui/Field";
import { useToast } from "../../../../components/ui/Toast";
import { useI18n } from "../../../../i18n/useI18n";
import {
  focusFirstInvalidField,
  hasErrors,
  isValidEmail,
  type FieldErrors,
} from "../../../../lib/validation";
import { useAuth } from "../../hooks/useAuth";
import { useAuthAction } from "../../hooks/useAuthAction";
import { useAuthDialog } from "../../hooks/useAuthDialog";
import { PASSWORD_RESET_ENABLED } from "../../passwordReset";
import { AuthFormError } from "../AuthFormError";

type LoginField = "email" | "password";

export function LoginForm() {
  const { t } = useI18n();
  const { login } = useAuth();
  const { close, open } = useAuthDialog();
  const toast = useToast();
  const { run, reset, error, errorCode, isPending, isBlocked } = useAuthAction(login, () => {
    close();
    toast.show({ tone: "info", title: t("auth.login.done") });
  });
  const formRef = useRef<HTMLFormElement>(null);
  const passwordId = useId();
  // Wrong credentials belong to both fields and to neither alone: one message, under the password.
  const isCredentialsError = errorCode === "auth.errors.invalidCredentials";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FieldErrors<LoginField>>({});

  const validate = (): FieldErrors<LoginField> => ({
    ...(!email.trim()
      ? { email: "auth.errors.required" as const }
      : !isValidEmail(email)
        ? { email: "auth.errors.invalidEmail" as const }
        : {}),
    ...(!password ? { password: "auth.errors.required" as const } : {}),
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const found = validate();
    setErrors(found);
    if (hasErrors(found)) return focusFirstInvalidField(event.currentTarget, found);
    // A wrong answer leaves the password filled in and puts the focus back on it.
    if (!(await run({ email: email.trim(), password }))) {
      (formRef.current?.elements.namedItem("password") as HTMLInputElement | null)?.focus();
    }
  };

  return (
    <form ref={formRef} className="form" onSubmit={(event) => void handleSubmit(event)} noValidate>
      {error && !isCredentialsError && <AuthFormError error={error} code={errorCode} />}
      <TextField
        label={t("auth.email")}
        name="email"
        type="email"
        autoComplete="email"
        required
        disabled={isBlocked}
        value={email}
        onChange={(value) => {
          reset();
          setEmail(value);
        }}
        error={errors.email && t(errors.email)}
        invalid={isCredentialsError}
        describedBy={isCredentialsError ? `${passwordId}-message` : undefined}
      />
      <PasswordField
        label={t("auth.password")}
        name="password"
        id={passwordId}
        autoComplete="current-password"
        required
        disabled={isBlocked}
        value={password}
        onChange={(value) => {
          reset();
          setPassword(value);
        }}
        invalid={isCredentialsError}
        error={errors.password ? t(errors.password) : isCredentialsError ? error : null}
        labelAction={
          PASSWORD_RESET_ENABLED ? (
            <button
              type="button"
              className="link-button"
              onClick={() => open("forgot", { email: email.trim() })}
            >
              {t("auth.login.forgotLink")}
            </button>
          ) : undefined
        }
      />
      <Button
        type="submit"
        variant="primary"
        size="lg"
        icon={<LogIn aria-hidden />}
        isLoading={isPending}
        loadingLabel={t("auth.login.pending")}
        disabled={isBlocked}
      >
        {t("auth.login.button")}
      </Button>
    </form>
  );
}
