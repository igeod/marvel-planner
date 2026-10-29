import { KeyRound } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Button } from "../../../../components/ui/Button";
import { PasswordField } from "../../../../components/ui/Field";
import { useI18n } from "../../../../i18n/useI18n";
import { focusFirstInvalidField, hasErrors, type FieldErrors } from "../../../../lib/validation";
import { MIN_PASSWORD_LENGTH } from "../../../auth/constants";
import { useAuth } from "../../../auth/hooks/useAuth";
import { useAuthAction } from "../../../auth/hooks/useAuthAction";

const EMPTY_FORM = { currentPassword: "", newPassword: "", confirmation: "" };

type PasswordField = keyof typeof EMPTY_FORM;

export function PasswordSection() {
  const { t } = useI18n();
  const { changePassword } = useAuth();
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<FieldErrors<PasswordField>>({});
  const { run, error, isPending, isDone } = useAuthAction(changePassword, () =>
    setForm(EMPTY_FORM),
  );

  const update = (field: PasswordField) => (value: string) =>
    setForm((current) => ({ ...current, [field]: value }));

  const validate = (): FieldErrors<PasswordField> => ({
    ...(!form.currentPassword ? { currentPassword: "auth.errors.required" as const } : {}),
    ...(!form.newPassword
      ? { newPassword: "auth.errors.required" as const }
      : form.newPassword.length < MIN_PASSWORD_LENGTH
        ? { newPassword: "auth.errors.passwordShort" as const }
        : {}),
    ...(form.confirmation !== form.newPassword
      ? { confirmation: "account.password.mismatch" as const }
      : {}),
  });

  // Validate a field once the user leaves it, only after it has been filled in.
  const validateOnBlur = (field: PasswordField) => () => {
    if (!form[field]) return;
    const found = validate();
    setErrors((current) => ({ ...current, [field]: found[field] }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const found = validate();
    setErrors(found);
    if (hasErrors(found)) return focusFirstInvalidField(event.currentTarget, found);
    void run({ currentPassword: form.currentPassword, newPassword: form.newPassword });
  };

  const errorText = (field: PasswordField) =>
    errors[field] && t(errors[field], { min: MIN_PASSWORD_LENGTH });

  return (
    <section className="password-section">
      <form className="form" onSubmit={handleSubmit} noValidate>
        <PasswordField
          label={t("account.password.current")}
          name="currentPassword"
          autoComplete="current-password"
          required
          value={form.currentPassword}
          onChange={update("currentPassword")}
          onBlur={validateOnBlur("currentPassword")}
          error={errorText("currentPassword")}
        />
        <PasswordField
          label={t("account.password.next")}
          name="newPassword"
          autoComplete="new-password"
          required
          minLength={MIN_PASSWORD_LENGTH}
          value={form.newPassword}
          onChange={update("newPassword")}
          onBlur={validateOnBlur("newPassword")}
          hint={t("account.password.hint", { min: MIN_PASSWORD_LENGTH })}
          error={errorText("newPassword")}
        />
        <PasswordField
          label={t("account.password.confirm")}
          name="confirmation"
          autoComplete="new-password"
          required
          value={form.confirmation}
          onChange={update("confirmation")}
          onBlur={validateOnBlur("confirmation")}
          error={errorText("confirmation")}
        />
        <div className="password-section__actions">
          <Button
            type="submit"
            variant="primary"
            icon={<KeyRound aria-hidden />}
            isLoading={isPending}
            loadingLabel={t("account.password.changing")}
            disabled={!form.currentPassword || !form.newPassword || !form.confirmation}
          >
            {t("account.password.change")}
          </Button>
          {error && <p role="alert">{error}</p>}
          {isDone && <p role="status">{t("account.password.changed")}</p>}
        </div>
      </form>
    </section>
  );
}
