import { Trash2 } from "lucide-react";
import { useId, useState, type FormEvent } from "react";
import { Button } from "../../../../components/ui/Button";
import { ConfirmDialog } from "../../../../components/ui/ConfirmDialog";
import { PasswordField } from "../../../../components/ui/Field";
import { useI18n } from "../../../../i18n/useI18n";
import { focusFirstInvalidField } from "../../../../lib/validation";
import { useAuth } from "../../../auth/hooks/useAuth";
import { useAuthAction } from "../../../auth/hooks/useAuthAction";

export function DeleteAccountSection() {
  const { t } = useI18n();
  const { deleteAccount } = useAuth();
  const { run, error, isPending } = useAuthAction(deleteAccount);
  const [password, setPassword] = useState("");
  const [isPasswordMissing, setIsPasswordMissing] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const headingId = useId();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const isMissing = !password;
    setIsPasswordMissing(isMissing);
    if (isMissing) return focusFirstInvalidField(event.currentTarget, { password: true });
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
          onChange={setPassword}
          error={isPasswordMissing && !password ? t("auth.errors.required") : null}
        />
        <div className="delete-account__actions">
          {error && <p role="alert">{error}</p>}
          <Button
            type="submit"
            variant="soft"
            className="delete-account__button"
            icon={<Trash2 aria-hidden />}
            isLoading={isPending}
            loadingLabel={t("account.delete.pending")}
            disabled={!password}
          >
            {t("account.delete.button")}
          </Button>
        </div>
      </form>
      <ConfirmDialog
        isOpen={isConfirming}
        title={t("account.delete.heading")}
        message={t("account.delete.confirm")}
        confirmLabel={t("account.delete.button")}
        cancelLabel={t("common.cancel")}
        onConfirm={confirm}
        onCancel={() => setIsConfirming(false)}
      />
    </section>
  );
}
