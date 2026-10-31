import { Trash2 } from "lucide-react";
import { useId, useState, type FormEvent } from "react";
import { Button } from "../../../../components/ui/Button";
import { ConfirmDialog } from "../../../../components/ui/ConfirmDialog";
import { PasswordField } from "../../../../components/ui/Field";
import { Status } from "../../../../components/ui/Status";
import { useI18n } from "../../../../i18n/useI18n";
import { focusFirstInvalidField } from "../../../../lib/validation";
import { useAuth } from "../../../auth/hooks/useAuth";
import { useAuthAction } from "../../../auth/hooks/useAuthAction";
import { useReportDirty } from "../../hooks/useReportDirty";

// Typed in the confirmation step; the same in every language, like the spec.
const CONFIRM_WORD = "DELETE";

export function DeleteAccountSection() {
  const { t } = useI18n();
  const { deleteAccount } = useAuth();
  const { run, error, isPending } = useAuthAction(deleteAccount);
  const [password, setPassword] = useState("");
  const [reason, setReason] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);
  const headingId = useId();

  useReportDirty("delete", password !== "");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!password) {
      setReason(t("account.dialog.invalidDelete"));
      return focusFirstInvalidField(event.currentTarget, { password: true });
    }
    setIsConfirming(true);
  };

  const confirm = () => {
    setIsConfirming(false);
    void run(password);
  };

  return (
    <section className="delete-account" aria-labelledby={headingId}>
      <div className="delete-account__head">
        <span className="delete-account__icon" aria-hidden="true">
          <Trash2 />
        </span>
        <h3 id={headingId}>{t("account.delete.heading")}</h3>
      </div>
      <p className="muted">{t("account.delete.warning")}</p>
      <form onSubmit={handleSubmit} noValidate>
        <PasswordField
          label={t("auth.password")}
          name="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(value) => {
            setPassword(value);
            setReason("");
          }}
        />
        <div className="delete-account__actions">
          {error && <p role="alert">{error}</p>}
          <Button
            type="submit"
            variant="danger"
            className="delete-account__button"
            isLoading={isPending}
            loadingLabel={t("account.delete.pending")}
            aria-disabled={!password}
          >
            {t("account.delete.button")}
          </Button>
        </div>
        <Status className="delete-account__status">{reason}</Status>
      </form>
      <ConfirmDialog
        isOpen={isConfirming}
        title={t("account.delete.heading")}
        message={t("account.delete.confirm")}
        confirmLabel={t("account.delete.button")}
        cancelLabel={t("common.cancel")}
        requiredText={CONFIRM_WORD}
        requiredLabel={t("account.dialog.typeLabel", { word: CONFIRM_WORD })}
        onConfirm={confirm}
        onCancel={() => setIsConfirming(false)}
      />
    </section>
  );
}
