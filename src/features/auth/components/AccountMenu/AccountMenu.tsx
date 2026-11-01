import { Button } from "../../../../components/ui/Button";
import { useI18n } from "../../../../i18n/useI18n";
import { useAuth } from "../../hooks/useAuth";
import { useAuthDialog } from "../../hooks/useAuthDialog";
import { initials } from "../../utils/initials";

export function AccountMenu() {
  const { t } = useI18n();
  const { user, status } = useAuth();
  const { open } = useAuthDialog();

  if (status === "loading") return null;

  if (!user) {
    return (
      <Button variant="ink" aria-haspopup="dialog" onClick={() => open("login")}>
        {t("nav.login")}
      </Button>
    );
  }

  return (
    <div className="account-menu">
      <button
        type="button"
        className="account-pill"
        aria-haspopup="dialog"
        title={t("nav.account")}
        onClick={() => open("account")}
      >
        <span className="avatar" aria-hidden="true">
          {initials(user.name)}
        </span>
        <span>{user.name}</span>
      </button>
    </div>
  );
}
