import { LogOut, Settings } from "lucide-react";
import { Link } from "react-router";
import { PATHS } from "../../../../app/paths";
import { buttonClass, Button } from "../../../../components/ui/Button";
import { useI18n } from "../../../../i18n/useI18n";
import { useSiteStatus } from "../../../site/hooks/useSiteStatus";
import { useAuth } from "../../hooks/useAuth";
import { useAuthDialog } from "../../hooks/useAuthDialog";
import { initials } from "../../utils/initials";

export function AccountMenu() {
  const { t } = useI18n();
  const { user, status, logout } = useAuth();
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
        </span>
        <span>{user.name}</span>
      </button>
      {isAdmin && (
        <Link
          to={PATHS.admin}
          className={buttonClass("panel", "md", true)}
          title={t("nav.admin")}
          aria-label={t("nav.admin")}
        >
          <Settings aria-hidden />
        </Link>
      )}
      <Button
        variant="panel"
        icon={<LogOut aria-hidden />}
        aria-label={t("nav.logout")}
        title={t("nav.logout")}
        onClick={logout}
      />
    </div>
  );
}
