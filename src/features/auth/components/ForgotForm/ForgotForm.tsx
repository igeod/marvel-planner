import { Send } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Button } from "../../../../components/ui/Button/Button";
import { TextField } from "../../../../components/ui/Field/Field";
import { useI18n } from "../../../../i18n/useI18n";
import { isValidEmail } from "../../../../lib/validation";
import { useAuth } from "../../hooks/useAuth";
import { useAuthAction } from "../../hooks/useAuthAction";
import { useAuthDialog } from "../../hooks/useAuthDialog";
import { AuthFormError } from "../AuthFormError/AuthFormError";

export function ForgotForm() {
  const { t } = useI18n();
  const { requestPasswordReset } = useAuth();
  const { open, payload } = useAuthDialog();
  const { run, error, errorCode, isPending, isBlocked } = useAuthAction(requestPasswordReset);
  const [email, setEmail] = useState(payload.email ?? "");
  const [fieldError, setFieldError] = useState<
    "auth.errors.required" | "auth.errors.invalidEmail" | null
  >(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const address = email.trim();
    const found = !address
      ? "auth.errors.required"
      : !isValidEmail(address)
        ? "auth.errors.invalidEmail"
        : null;
    setFieldError(found);
    if (found) return event.currentTarget.querySelector("input")?.focus();
    if (await run(address)) open("forgotSent", { email: address });
  };

  return (
    <form className="form" onSubmit={(event) => void handleSubmit(event)} noValidate>
      {error && <AuthFormError error={error} code={errorCode} />}
      <TextField
        label={t("auth.email")}
        name="email"
        type="email"
        autoComplete="email"
        required
        disabled={isBlocked}
        value={email}
        onChange={setEmail}
        error={fieldError && t(fieldError)}
      />
      <Button
        type="submit"
        variant="primary"
        size="lg"
        icon={<Send aria-hidden />}
        isLoading={isPending}
        loadingLabel={t("auth.reset.request.pending")}
        disabled={isBlocked}
      >
        {t("auth.reset.request.button")}
      </Button>
    </form>
  );
}
