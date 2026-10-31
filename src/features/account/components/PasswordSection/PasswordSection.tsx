import { Check, Minus, X } from "lucide-react";
import { useId, useState, type FormEvent } from "react";
import { Button } from "../../../../components/ui/Button";
import { PasswordField } from "../../../../components/ui/Field";
import { Status } from "../../../../components/ui/Status";
import { useI18n } from "../../../../i18n/useI18n";
import { focusFirstInvalidField, hasErrors, type FieldErrors } from "../../../../lib/validation";
import { isLongEnough } from "../../../../../shared/passwordPolicy";
import { usePasswordPolicy } from "../../../auth/hooks/usePasswordPolicy";
import { useAuth } from "../../../auth/hooks/useAuth";
import { useAuthAction } from "../../../auth/hooks/useAuthAction";
import { useReportDirty } from "../../hooks/useReportDirty";

const EMPTY_FORM = { currentPassword: "", newPassword: "", confirmation: "" };

type PasswordField = keyof typeof EMPTY_FORM;

export function PasswordSection() {
  const { t } = useI18n();
  const { changePassword } = useAuth();
  const [form, setForm] = useState(EMPTY_FORM);
  const policy = usePasswordPolicy();
  const [isVisible, setIsVisible] = useState(false);
  const ids = { currentPassword: useId(), newPassword: useId(), confirmation: useId() };
  const noteId = useId();
  // New password and its confirmation share one eye; the current password has its own.
  const controls = `${ids.newPassword} ${ids.confirmation}`;
  const [errors, setErrors] = useState<FieldErrors<PasswordField>>({});
  const { run, error, isPending, isDone } = useAuthAction(changePassword, () => {
    setForm(EMPTY_FORM);
    setIsVisible(false);
  });
  const meetsLength = isLongEnough(policy, form.newPassword);
  // A cross shows once the user has typed something too short, or tried to submit.
  const isLengthFailed = !meetsLength && (form.newPassword !== "" || Boolean(errors.newPassword));
  const isValid =
    Boolean(form.currentPassword) && meetsLength && form.confirmation === form.newPassword;

  const [reason, setReason] = useState("");

  useReportDirty("password", Object.values(form).some(Boolean));

  const update = (field: PasswordField) => (value: string) => {
    setReason("");
    setForm((current) => ({ ...current, [field]: value }));
  };

  const validate = (): FieldErrors<PasswordField> => ({
    ...(!form.currentPassword ? { currentPassword: "auth.errors.required" as const } : {}),
    ...(!form.newPassword
      ? { newPassword: "auth.errors.required" as const }
      : !meetsLength
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
    if (hasErrors(found)) {
      setReason(t("account.dialog.invalidPassword", { min: policy.minLength }));
      return focusFirstInvalidField(event.currentTarget, found);
    }
    void run({ currentPassword: form.currentPassword, newPassword: form.newPassword });
  };

  // An error stays only while it still applies: fixing the other field clears a stale mismatch.
  const errorText = (field: PasswordField) => {
    const current = validate()[field];
    return errors[field] && current ? t(current, { min: policy.minLength }) : null;
  };

  return (
    <section className="password-section">
      <form className="form" onSubmit={handleSubmit} noValidate>
        <PasswordField
          label={t("account.password.current")}
          name="currentPassword"
          id={ids.currentPassword}
          toggleLabel={t("account.password.showCurrent")}
          autoComplete="current-password"
          required
          value={form.currentPassword}
          onChange={update("currentPassword")}
          onBlur={validateOnBlur("currentPassword")}
          error={errorText("currentPassword")}
        />
        <div className="password-section__pair">
          <PasswordField
            label={t("account.password.next")}
            name="newPassword"
            id={ids.newPassword}
            isVisible={isVisible}
            onToggleVisible={() => setIsVisible(!isVisible)}
            controls={controls}
            toggleLabel={t("account.password.showNew")}
            after={
              <p
                className="password-requirement"
                data-met={meetsLength || undefined}
                data-failed={isLengthFailed || undefined}
              >
                {meetsLength ? (
                  <Check aria-hidden />
                ) : isLengthFailed ? (
                  <X aria-hidden />
                ) : (
                  <Minus aria-hidden />
                )}
                {t("account.password.requirements.length", { min: policy.minLength })}
                <span className="visually-hidden">
                  {meetsLength
                    ? t("account.password.requirements.met")
                    : t("account.password.requirements.notMet")}
                </span>
              </p>
            }
            autoComplete="new-password"
            required
            minLength={policy.minLength}
            value={form.newPassword}
            onChange={update("newPassword")}
            onBlur={validateOnBlur("newPassword")}
          />
          <PasswordField
            label={t("account.password.confirm")}
            name="confirmation"
            id={ids.confirmation}
            isVisible={isVisible}
            onToggleVisible={() => setIsVisible(!isVisible)}
            controls={controls}
            toggleLabel={t("account.password.showConfirm")}
            autoComplete="new-password"
            required
            value={form.confirmation}
            onChange={update("confirmation")}
            onBlur={validateOnBlur("confirmation")}
            error={errorText("confirmation")}
          />
        </div>
        <div className="password-section__actions">
          <p id={noteId} className="password-section__note">
            {t("account.password.signedOut")}
          </p>
          <Button
            type="submit"
            variant="primary"
            isLoading={isPending}
            loadingLabel={t("account.password.changing")}
            aria-disabled={!isValid}
            aria-describedby={noteId}
          >
            {t("account.password.change")}
          </Button>
          {error && <p role="alert">{error}</p>}
          <Status>{reason || (isDone ? t("account.password.changed") : "")}</Status>
        </div>
      </form>
    </section>
  );
}
