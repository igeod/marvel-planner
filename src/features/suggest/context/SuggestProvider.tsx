import { useCallback, useMemo, useState, type ReactNode } from "react";
import { Button } from "../../../components/ui/Button/Button";
import { Modal } from "../../../components/ui/Modal/Modal";
import { useI18n } from "../../../i18n/useI18n";
import { useAuth } from "../../auth/hooks/useAuth";
import { useAuthDialog } from "../../auth/hooks/useAuthDialog";
import { SuggestForm } from "../components/SuggestForm/SuggestForm";
import { draftKey } from "../draftKey";
import { SuggestContext, type SuggestContextValue, type SuggestTarget } from "./SuggestContext";

export function SuggestProvider({ children }: { children: ReactNode }) {
  const { t } = useI18n();
  const { user } = useAuth();
  const { view, open: openAuthDialog } = useAuthDialog();
  const [target, setTarget] = useState<SuggestTarget | null>(null);
  // A guest who went to sign in: the form opens again once they have.
  const [awaiting, setAwaiting] = useState<SuggestTarget | null>(null);
  const [previousUser, setPreviousUser] = useState(user);
  const [previousView, setPreviousView] = useState(view);

  // Adjusted while rendering, not in an effect: the form comes back after a sign-in, and the wait
  // ends if the sign-in dialog is closed without one.
  if (user !== previousUser) {
    setPreviousUser(user);
    if (user && awaiting) {
      setTarget(awaiting);
      setAwaiting(null);
    }
  }
  if (view !== previousView) {
    setPreviousView(view);
    if (view === null && !user && awaiting) setAwaiting(null);
  }

  const open = useCallback((next: SuggestTarget) => setTarget(next), []);
  const value = useMemo<SuggestContextValue>(() => ({ open }), [open]);

  return (
    <SuggestContext value={value}>
      {children}
      <Modal isOpen={target !== null} title={t("suggest.title")} onClose={() => setTarget(null)}>
        {target &&
          (user ? (
            <SuggestForm key={draftKey(target)} target={target} onDone={() => setTarget(null)} />
          ) : (
            <>
              <p>{t("suggest.guest")}</p>
              <div className="dialog__actions">
                <Button
                  variant="primary"
                  onClick={() => {
                    setAwaiting(target);
                    setTarget(null);
                    openAuthDialog("login");
                  }}
                >
                  {t("nav.login")}
                </Button>
              </div>
            </>
          ))}
      </Modal>
    </SuggestContext>
  );
}
