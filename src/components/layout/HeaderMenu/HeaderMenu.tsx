import { LogIn, Menu, X } from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";
import { SITE } from "../../../app/site";
import { Button } from "../../ui/Button";
import { useDialog } from "../../ui/useDialog";
import { TABLET_QUERY, useMediaQueryWithReset } from "../../ui/useMediaQuery";
import { useAuth } from "../../../features/auth/hooks/useAuth";
import { AdminBadge } from "../../../features/admin/components/AdminBadge";
import { useAuthDialog } from "../../../features/auth/hooks/useAuthDialog";
import { initials } from "../../../features/auth/utils/initials";
import { useSiteStatus } from "../../../features/site/hooks/useSiteStatus";
import { ThemeChoice } from "../../../features/theme/ThemeChoice";
import { useI18n } from "../../../i18n/useI18n";
import { LanguageSwitcher } from "../LanguageSwitcher";

function MenuAccount({ onNavigate }: { onNavigate: () => void }) {
  const { t } = useI18n();
  const { user, status } = useAuth();
  const { open } = useAuthDialog();
  const { isAdmin } = useSiteStatus();

  if (status === "loading") return null;

  if (!user) {
    return (
      <Button
        variant="primary"
        size="lg"
        icon={<LogIn aria-hidden />}
        onClick={() => {
          onNavigate();
          open("login");
        }}
      >
        {t("nav.login")}
      </Button>
    );
  }

  return (
    <div className="menu-panel__account">
      <button
        type="button"
        className="account-pill account-pill--wide"
        onClick={() => {
          onNavigate();
          open("account");
        }}
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

export function HeaderMenu() {
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useDialog(isOpen);
  const close = () => setIsOpen(false);
  // The menu button only exists below the tablet width; growing past it closes the panel.
  useMediaQueryWithReset(TABLET_QUERY, close);

  return (
    <>
      <Button
        className="site-header__menu-button"
        variant="panel"
        icon={<Menu aria-hidden />}
        aria-label={t("nav.menu")}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(true)}
      />
      {createPortal(
        <dialog
          ref={dialogRef}
          className="menu-panel on-panel"
          aria-label={t("nav.menu")}
          onCancel={(event) => {
            event.preventDefault();
            close();
          }}
          onClick={(event) => {
            if (event.target === event.currentTarget) close();
          }}
        >
          {isOpen && (
            <div className="menu-panel__body">
              <div className="menu-panel__bar">
                <span className="wordmark">{SITE.name}</span>
                <Button
                  variant="panel"
                  icon={<X aria-hidden />}
                  aria-label={t("common.close")}
                  onClick={close}
                />
              </div>
              <ThemeChoice />
              <div className="menu-panel__language">
                <LanguageSwitcher layout="inline" />
              </div>
              <MenuAccount onNavigate={close} />
            </div>
          )}
        </dialog>,
        document.body,
      )}
    </>
  );
}
