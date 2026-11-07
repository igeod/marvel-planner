import { useRef } from "react";
import { Link } from "react-router";
import { PATHS } from "../../../../app/paths";
import { Button } from "../../../../components/ui/Button";
import { Modal } from "../../../../components/ui/Modal";
import type { TranslationKey } from "../../../../i18n/types";
import { useI18n } from "../../../../i18n/useI18n";
import { AccountSettings, PROFILE_TITLE_ID } from "../../../account/components/AccountSettings";
import type { AuthDialogView } from "../../context/AuthDialogContext";
import { useAuth } from "../../hooks/useAuth";
import { useAuthDialog } from "../../hooks/useAuthDialog";
import { AUTH_TITLE_ID, AuthResult } from "../AuthResult";
import { ForgotForm } from "../ForgotForm";
import { LoginForm } from "../LoginForm";
import { RegisterForm } from "../RegisterForm";
import { ResendButton } from "../ResendButton";
import { ResetPasswordForm } from "../ResetPasswordForm";

const TITLE_KEYS: Record<AuthDialogView, TranslationKey> = {
  login: "auth.login.title",
  register: "auth.register.title",
  account: "account.title",
  forgot: "auth.reset.request.title",
  forgotSent: "auth.reset.sent.title",
  resetPassword: "auth.reset.new.title",
  resetDone: "auth.reset.done.title",
  resetInvalid: "auth.reset.invalid.title",
};

export function AuthDialogs() {
  const { t, rich } = useI18n();
  const { user, status } = useAuth();
  const { view, payload, open, close } = useAuthDialog();
  const { requestPasswordReset } = useAuth();

  const isAccountWithoutUser = view === "account" && !user;
  const isOpen = view !== null && !(isAccountWithoutUser && status === "anonymous");
  const currentView: AuthDialogView = view ?? "login";
  // The profile popup registers its own close, which asks about unsaved changes first.
  const accountClose = useRef<(() => void) | null>(null);
  const requestClose = () => (currentView === "account" && accountClose.current) || close;

  const backToLogin = (email?: string) => (
    <button type="button" className="link-button" onClick={() => open("login", { email })}>
      {t("auth.reset.backToLogin")}
    </button>
  );

  const resetInvalid = (
    <AuthResult
      actions={
        <Button variant="primary" size="lg" onClick={() => open("forgot")}>
          {t("auth.reset.invalid.button")}
        </Button>
      }
      links={<p>{backToLogin()}</p>}
    >
      {t("auth.reset.invalid.body")}
    </AuthResult>
  );

  return (
    <Modal
      isOpen={isOpen}
      title={t(TITLE_KEYS[currentView])}
      size={currentView === "account" ? "profile" : "md"}
      titleId={currentView === "account" ? PROFILE_TITLE_ID : AUTH_TITLE_ID}
      onClose={() => requestClose()()}
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

      {currentView === "forgot" && (
        <>
          <p>{t("auth.reset.request.intro")}</p>
          <ForgotForm />
          <p>{backToLogin(payload.email)}</p>
        </>
      )}

      {currentView === "forgotSent" && (
        <AuthResult
          tick
          actions={
            <>
              <Button
                variant="primary"
                size="lg"
                onClick={() => open("login", { email: payload.email })}
              >
                {t("auth.reset.backToLogin")}
              </Button>
              <ResendButton
                onResend={() => requestPasswordReset(payload.email ?? "")}
                label={t("auth.reset.sent.resend")}
                waitText={t("auth.reset.sent.wait")}
                doneText={t("auth.reset.sent.resent")}
              />
            </>
          }
        >
          {t("auth.reset.sent.body")}
        </AuthResult>
      )}

      {currentView === "resetPassword" &&
        (payload.token ? (
          <>
            <p>{t("auth.reset.new.intro")}</p>
            <ResetPasswordForm token={payload.token} />
          </>
        ) : (
          resetInvalid
        ))}

      {currentView === "resetDone" && (
        <AuthResult
          tick
          actions={
            <Button variant="primary" size="lg" onClick={() => open("login")}>
              {t("auth.login.button")}
            </Button>
          }
        >
          {t("auth.reset.done.body")}
        </AuthResult>
      )}

      {currentView === "resetInvalid" && resetInvalid}

      {currentView === "account" && user && (
        <AccountSettings user={user} onClose={close} closeRef={accountClose} />
      )}
    </Modal>
  );
}
