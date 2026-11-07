import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router";
import { PATHS } from "../../../../app/paths";
import { Button } from "../../../../components/ui/Button";
import { Modal } from "../../../../components/ui/Modal";
import { useMediaQuery } from "../../../../components/ui/useMediaQuery";
import type { TranslationKey } from "../../../../i18n/types";
import { useI18n } from "../../../../i18n/useI18n";
import { AccountSettings, PROFILE_TITLE_ID } from "../../../account/components/AccountSettings";
import type { AuthDialogPayload, AuthDialogView } from "../../context/AuthDialogContext";
import { useAuth } from "../../hooks/useAuth";
import { useAuthDialog } from "../../hooks/useAuthDialog";
import { useViewTransition } from "../../hooks/useViewTransition";
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

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

export function AuthDialogs() {
  const { t, rich } = useI18n();
  const { user, status, requestPasswordReset } = useAuth();
  const { view, payload, open, close } = useAuthDialog();
  const reducedMotion = useMediaQuery(REDUCED_MOTION);

  // The height of the old view, taken just before the new one replaces it.
  const viewRef = useRef<HTMLDivElement>(null);
  const heightBefore = useRef<number | null>(null);
  const hasSwapped = useRef(false);

  const { shown, leaving, direction } = useViewTransition<AuthDialogView, AuthDialogPayload>(
    view,
    payload,
    {
      // Back means arriving at the sign-in view; the profile popup and a reopened popup have no motion.
      isBack: (_from, to) => to === "login",
      isInstant: (from, to) => from === null || from === "account" || to === "account",
      onBeforeSwap: () => {
        hasSwapped.current = true;
        heightBefore.current = reducedMotion ? null : (viewRef.current?.offsetHeight ?? null);
      },
    },
  );

  // The popup grows or shrinks to the new view instead of jumping; the focus moves at once.
  useLayoutEffect(() => {
    const element = viewRef.current;
    if (!element || !hasSwapped.current) return;
    hasSwapped.current = false;
    element.querySelector<HTMLElement>("input")?.focus({ preventScroll: true });

    const from = heightBefore.current;
    heightBefore.current = null;
    if (from === null || from === element.offsetHeight) return;
    const to = element.offsetHeight;
    const clear = () => {
      element.style.height = "";
      element.style.overflow = "";
      element.style.overflowClipMargin = "";
      element.style.transition = "";
    };
    element.style.height = `${from}px`;
    // clip with a margin, not hidden: the 3px focus ring of the first field must not be cut.
    element.style.overflow = "clip";
    element.style.overflowClipMargin = "4px";
    element.getBoundingClientRect();
    element.style.transition = "height var(--dur-ui) var(--ease-out)";
    element.style.height = `${to}px`;
    element.addEventListener("transitionend", clear, { once: true });
    // A transition that never ends (tab in the background) must not leave the height fixed.
    const fallback = setTimeout(clear, 400);
    return () => clearTimeout(fallback);
  }, [shown.view]);

  const isAccountWithoutUser = view === "account" && !user;
  const isOpen = view !== null && !(isAccountWithoutUser && status === "anonymous");
  const currentView: AuthDialogView = shown.view ?? "login";
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

  const content = (
    <>
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
          <p>{backToLogin(shown.payload.email)}</p>
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
                onClick={() => open("login", { email: shown.payload.email })}
              >
                {t("auth.reset.backToLogin")}
              </Button>
              <ResendButton
                onResend={() => requestPasswordReset(shown.payload.email ?? "")}
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
        (shown.payload.token ? (
          <>
            <p>{t("auth.reset.new.intro")}</p>
            <ResetPasswordForm token={shown.payload.token} />
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
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      title={t(TITLE_KEYS[currentView])}
      size={currentView === "account" ? "profile" : "md"}
      titleId={currentView === "account" ? PROFILE_TITLE_ID : AUTH_TITLE_ID}
      viewMotion={currentView === "account" ? undefined : { leaving, direction }}
      onClose={() => requestClose()()}
    >
      {currentView === "account" ? (
        user && <AccountSettings user={user} onClose={close} closeRef={accountClose} />
      ) : (
        <div
          ref={viewRef}
          key={currentView}
          className="auth-view view-motion"
          data-dir={direction}
          data-phase={leaving ? "out" : "in"}
        >
          {content}
        </div>
      )}
    </Modal>
  );
}
