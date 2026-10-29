import { Link } from "react-router";
import { PATHS } from "../../../../app/paths";
import { Modal } from "../../../../components/ui/Modal";
import type { TranslationKey } from "../../../../i18n/types";
import { useI18n } from "../../../../i18n/useI18n";
import { AccountSettings, PROFILE_TITLE_ID } from "../../../account/components/AccountSettings";
import type { AuthDialogView } from "../../context/AuthDialogContext";
import { useAuth } from "../../hooks/useAuth";
import { useAuthDialog } from "../../hooks/useAuthDialog";
import { LoginForm } from "../LoginForm";
import { RegisterForm } from "../RegisterForm";

const TITLE_KEYS: Record<AuthDialogView, TranslationKey> = {
  login: "auth.login.title",
  register: "auth.register.title",
  account: "account.title",
};

export function AuthDialogs() {
  const { t, rich } = useI18n();
  const { user, status } = useAuth();
  const { view, open, close } = useAuthDialog();

  const isAccountWithoutUser = view === "account" && !user;
  const isOpen = view !== null && !(isAccountWithoutUser && status === "anonymous");
  const currentView: AuthDialogView = view ?? "login";

  return (
    <Modal
      isOpen={isOpen}
      title={t(TITLE_KEYS[currentView])}
      size={currentView === "account" ? "profile" : "md"}
      titleId={currentView === "account" ? PROFILE_TITLE_ID : undefined}
      onClose={close}
    >
      {currentView === "login" && (
        <>
          <p>{t("auth.login.intro")}</p>
          <LoginForm />
          <p>
            {rich("auth.login.noAccount", {
              link: (
                <button type="button" className="link-button" onClick={() => open("register")}>
                  {t("auth.login.registerLink")}
                </button>
              ),
            })}
          </p>
        </>
      )}

      {currentView === "register" && (
        <>
          <p>{t("auth.register.intro")}</p>
          <RegisterForm />
          <p>
            {rich("auth.register.privacyNotice", {
              link: (
                <Link to={PATHS.privacy} onClick={close}>
                  {t("auth.register.privacyLink")}
                </Link>
              ),
            })}
          </p>
          <p>
            {rich("auth.register.haveAccount", {
              link: (
                <button type="button" className="link-button" onClick={() => open("login")}>
                  {t("auth.register.loginLink")}
                </button>
              ),
            })}
          </p>
        </>
      )}

      {currentView === "account" && user && <AccountSettings user={user} onClose={close} />}
    </Modal>
  );
}
