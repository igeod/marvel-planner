import { KeyRound } from "lucide-react";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { Button } from "../../../../components/ui/Button";
import { PasswordField } from "../../../../components/ui/Field";
import type { TranslationKey } from "../../../../i18n/types";
import { useI18n } from "../../../../i18n/useI18n";
import { isLongEnough } from "../../../../../shared/passwordPolicy";
import { useAuth } from "../../hooks/useAuth";
import { useAuthAction } from "../../hooks/useAuthAction";
import { useAuthDialog } from "../../hooks/useAuthDialog";
import { usePasswordPolicy } from "../../hooks/usePasswordPolicy";
import { AuthFormError } from "../AuthFormError";
import { PasswordRequirement } from "../PasswordRequirement";

// Server answers that belong to the new password; any other answer goes in the error row.
const PASSWORD_ERRORS: TranslationKey[] = [
  "auth.errors.passwordShort",
  "auth.errors.passwordWeak",
  "auth.errors.passwordLong",
];

export function ResetPasswordForm({ token }: { token: string }) {
  const { t } = useI18n();
  const { resetPassword } = useAuth();
  const { open } = useAuthDialog();
  const policy = usePasswordPolicy();
  const formRef = useRef<HTMLFormElement>(null);
  const ids = { password: useId(), confirmation: useId() };
  const requirementId = useId();
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isRequired, setIsRequired] = useState(false);
  // The cross shows after a failed attempt or blur with too few characters, then stays live.
  const [isLengthTried, setIsLengthTried] = useState(false);
  // The mismatch shows at the first blur of the confirmation or on submit, then stays live.
  const [isConfirmTouched, setIsConfirmTouched] = useState(false);
  const { run, reset, error, errorCode, isPending, isBlocked } = useAuthAction(
    (newPassword: string) => resetPassword(token, newPassword),
  );

  const meetsLength = isLongEnough(policy, password);
  const mismatch = confirmation !== password;
  const isPasswordServerError = errorCode !== null && PASSWORD_ERRORS.includes(errorCode);
  const isLengthFailed =
    !meetsLength && (isLengthTried || errorCode === "auth.errors.passwordShort");
  // Too short has no message here: its requirement row is the error.
  const passwordError =
    isRequired && !password
      ? t("auth.errors.required")
      : isPasswordServerError && errorCode !== "auth.errors.passwordShort"
        ? error
        : null;

  // Expired, used or unknown token: the same view for all three.
  useEffect(() => {
    if (errorCode === "auth.reset.invalid.body") open("resetInvalid");
  }, [errorCode, open]);

  // A server answer on the password puts the focus there; any other, on the submit button.
  useEffect(() => {
    if (!errorCode || errorCode === "auth.reset.invalid.body") return;
    if (errorCode === "auth.errors.tooManyRequests") return;
    const target = isPasswordServerError
      ? document.getElementById(ids.password)
      : formRef.current?.querySelector('button[type="submit"]');
    (target as HTMLElement | null)?.focus();
    // ids never change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorCode]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isPending) return;
    setIsRequired(true);
    setIsConfirmTouched(true);
    if (!password) return document.getElementById(ids.password)?.focus();
    if (!meetsLength) {
      setIsLengthTried(true);
      return document.getElementById(ids.password)?.focus();
    }
    if (mismatch) return document.getElementById(ids.confirmation)?.focus();
    if (await run(password)) open("resetDone");
  };

  const controls = `${ids.password} ${ids.confirmation}`;

  return (
    <form ref={formRef} className="form" onSubmit={(event) => void handleSubmit(event)} noValidate>
      {error && !isPasswordServerError && <AuthFormError error={error} code={errorCode} />}
      <PasswordField
        label={t("account.password.next")}
        name="newPassword"
        id={ids.password}
        isVisible={isVisible}
        onToggleVisible={() => setIsVisible(!isVisible)}
        controls={controls}
        toggleLabel={t("account.password.showNew")}
        invalid={isLengthFailed}
        describedBy={requirementId}
        after={
          <PasswordRequirement
            id={requirementId}
            met={meetsLength}
            failed={isLengthFailed}
            minLength={policy.minLength}
          />
        }
        autoComplete="new-password"
        required
        disabled={isBlocked}
        minLength={policy.minLength}
        value={password}
        onChange={(value) => {
          reset();
          if (isLongEnough(policy, value)) setIsLengthTried(false);
          setPassword(value);
        }}
        onBlur={() => {
          if (password && !meetsLength) setIsLengthTried(true);
        }}
        error={passwordError}
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
        disabled={isBlocked}
        value={confirmation}
        onChange={setConfirmation}
        onBlur={() => setIsConfirmTouched(true)}
        error={isConfirmTouched && confirmation && mismatch ? t("account.password.mismatch") : null}
      />
      <Button
        type="submit"
        variant="primary"
        size="lg"
        icon={<KeyRound aria-hidden />}
        isLoading={isPending}
        loadingLabel={t("auth.reset.new.pending")}
        disabled={isBlocked}
      >
        {t("auth.reset.new.button")}
      </Button>
    </form>
  );
}
