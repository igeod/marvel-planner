import { use, useEffect, useId, useRef, useState, type FormEvent } from "react";
import { Button } from "../../../../components/ui/Button";
import { FormError } from "../../../../components/ui/FormError";
import { PasswordField } from "../../../../components/ui/Field";
import { Status } from "../../../../components/ui/Status";
import type { TranslationKey } from "../../../../i18n/types";
import { useI18n } from "../../../../i18n/useI18n";
import { type FieldErrors } from "../../../../lib/validation";
import { isLongEnough } from "../../../../../shared/passwordPolicy";
import { PasswordRequirement } from "../../../auth/components/PasswordRequirement";
import { usePasswordPolicy } from "../../../auth/hooks/usePasswordPolicy";
import { useAuth } from "../../../auth/hooks/useAuth";
import { useAuthAction } from "../../../auth/hooks/useAuthAction";
import { RevealContext, useReportDirty, useReportPending } from "../../hooks/useReportDirty";

const EMPTY_FORM = { currentPassword: "", newPassword: "", confirmation: "" };

type PasswordField = keyof typeof EMPTY_FORM;

const FIELDS: PasswordField[] = ["currentPassword", "newPassword", "confirmation"];

// Server answers that belong to a field; any other answer goes in the form's error row.
const FIELD_FOR_ERROR: Partial<Record<TranslationKey, PasswordField>> = {
  "auth.errors.wrongPassword": "currentPassword",
  "auth.errors.passwordShort": "newPassword",
  "auth.errors.passwordWeak": "newPassword",
  "auth.errors.passwordLong": "newPassword",
};

interface PasswordSectionProps {
  // The Password tab is the visible one; leaving it clears the success message.
  isActive: boolean;
}

export function PasswordSection({ isActive }: PasswordSectionProps) {
  const { t } = useI18n();
  const { changePassword } = useAuth();
  const reveal = use(RevealContext);
  const [form, setForm] = useState(EMPTY_FORM);
  const policy = usePasswordPolicy();
  const [isVisible, setIsVisible] = useState(false);
  const ids = { currentPassword: useId(), newPassword: useId(), confirmation: useId() };
  const noteId = useId();
  const requirementId = useId();
  const actionsRef = useRef<HTMLDivElement>(null);
  // New password and its confirmation share one eye; the current password has its own.
  const controls = `${ids.newPassword} ${ids.confirmation}`;
  const [errors, setErrors] = useState<FieldErrors<PasswordField>>({});
  // The cross shows only after blur or submit with fewer characters than required, then stays live.
  const [isNewFailed, setIsNewFailed] = useState(false);
  // The mismatch error appears at the first blur of the confirmation or on submit, then stays live.
  const [isConfirmTouched, setIsConfirmTouched] = useState(false);
  const action = useAuthAction(changePassword, () => {
    setForm(EMPTY_FORM);
    setIsVisible(false);
    setIsNewFailed(false);
    setIsConfirmTouched(false);
  });
  const { reset, isPending, errorCode, resultId } = action;
  const meetsLength = isLongEnough(policy, form.newPassword);
  // A password the server found too short turns the requirement row into the error, like the client check.
  const isLengthFailed = !meetsLength && (isNewFailed || errorCode === "auth.errors.passwordShort");
  const mismatch = form.confirmation !== form.newPassword;
  const isValid =
    Boolean(form.currentPassword) && meetsLength && form.confirmation === form.newPassword;

  useReportDirty("password", Object.values(form).some(Boolean));
  useReportPending("password", isPending);

  useEffect(() => {
    if (!isActive && !isPending) reset();
  }, [isActive, isPending, reset]);

  useEffect(() => {
    if (resultId > 0) reveal(actionsRef.current);
  }, [resultId, reveal]);

  const serverField = errorCode ? FIELD_FOR_ERROR[errorCode] : undefined;

  // A server answer on a field: the focus goes there.
  useEffect(() => {
    if (!errorCode) return;
    const field = FIELD_FOR_ERROR[errorCode];
    if (!field) return;
    document.getElementById(ids[field])?.focus();
    // ids never change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorCode]);

  const update = (field: PasswordField) => (value: string) => {
    reset();
    if (field === "newPassword" && isLongEnough(policy, value)) setIsNewFailed(false);
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

  const labels: Record<PasswordField, string> = {
    currentPassword: t("account.password.current"),
    newPassword: t("account.password.next"),
    confirmation: t("account.password.confirm"),
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isPending) return;
    const found = validate();
    setErrors(found);
    setIsConfirmTouched(true);
    if (!meetsLength) setIsNewFailed(true);
    // Every invalid field shows its own message; the focus goes to the first one.
    const firstInvalid = FIELDS.find((field) => found[field]);
    if (firstInvalid) return document.getElementById(ids[firstInvalid])?.focus();
    void action.run({ currentPassword: form.currentPassword, newPassword: form.newPassword });
  };

  // The message under a field: the live client check, or the server's answer for that field.
  // A password that is too short has no message here: its requirement row is the error.
  const fieldError = (field: PasswordField) => {
    const key = errors[field] && validate()[field];
    if (key && !(field === "newPassword" && key === "auth.errors.passwordShort")) {
      return t(key, { min: policy.minLength });
    }
    if (serverField !== field) return null;
    // Too short while the live check says it is long enough (the rule changed): say it here.
    if (errorCode === "auth.errors.passwordShort" && !meetsLength) return null;
    return errorCode === "auth.errors.wrongPassword"
      ? t("account.password.errors.currentWrong")
      : action.error;
  };

  const formError = action.error && !serverField ? action.error : null;
  // The empty-field message and the length row never show together.
  const isNewRequired = Boolean(errors.newPassword) && !form.newPassword;

  return (
    <section className="password-section">
      <form className="form" onSubmit={handleSubmit} noValidate>
        <PasswordField
          label={labels.currentPassword}
          name="currentPassword"
          id={ids.currentPassword}
          toggleLabel={t("account.password.showCurrent")}
          autoComplete="current-password"
          required
          value={form.currentPassword}
          onChange={update("currentPassword")}
          onBlur={validateOnBlur("currentPassword")}
          error={fieldError("currentPassword")}
        />
        <div className="password-section__pair">
          <PasswordField
            label={labels.newPassword}
            name="newPassword"
            id={ids.newPassword}
            isVisible={isVisible}
            onToggleVisible={() => setIsVisible(!isVisible)}
            controls={controls}
            toggleLabel={t("account.password.showNew")}
            invalid={isLengthFailed}
            describedBy={requirementId}
            after={
              isNewRequired ? undefined : (
                <PasswordRequirement
                  id={requirementId}
                  met={meetsLength}
                  failed={isLengthFailed}
                  minLength={policy.minLength}
                />
              )
            }
            autoComplete="new-password"
            required
            minLength={policy.minLength}
            value={form.newPassword}
            onChange={update("newPassword")}
            onBlur={() => {
              if (form.newPassword && !meetsLength) setIsNewFailed(true);
            }}
            error={fieldError("newPassword")}
          />
          <PasswordField
            label={labels.confirmation}
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
            onBlur={() => setIsConfirmTouched(true)}
            error={isConfirmTouched && mismatch ? t("account.password.mismatch") : null}
          />
        </div>
        {formError && <FormError>{formError}</FormError>}
        <div className="password-section__actions" ref={actionsRef}>
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
          <Status tone="success" resultKey={resultId}>
            {action.isDone ? t("account.password.changed") : ""}
          </Status>
        </div>
      </form>
    </section>
  );
}
