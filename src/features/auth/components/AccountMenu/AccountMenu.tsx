import { Button } from "../../../../components/ui/Button/Button";
import { useI18n } from "../../../../i18n/useI18n";
import { AdminBadge } from "../../../admin/components/AdminBadge/AdminBadge";
import { useSiteStatus } from "../../../site/hooks/useSiteStatus";
import { useAuth } from "../../hooks/useAuth";
import { useAuthDialog } from "../../hooks/useAuthDialog";
import { initials } from "../../utils/initials";

export function AccountMenu() {
  const { t } = useI18n();
  const { user, status } = useAuth();
  const { open } = useAuthDialog();
  const { isAdmin } = useSiteStatus();

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
          {isAdmin && <AdminBadge />}
        </span>
        <span>{user.name}</span>
        {isAdmin && <span className="visually-hidden">, {t("account.admin.role")}</span>}
      </button>
    </div>
  );
}
