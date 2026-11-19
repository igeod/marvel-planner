import { useCallback, useMemo, useState, type ReactNode } from "react";
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

  // A guest is sent to sign in; the form opens by itself afterwards.
  const open = useCallback(
    (next: SuggestTarget) => {
      if (user) return setTarget(next);
      setAwaiting(next);
      openAuthDialog("login", undefined, t("suggest.guest"));
    },
    [user, openAuthDialog, t],
  );
  const value = useMemo<SuggestContextValue>(() => ({ open }), [open]);

  return (
    <SuggestContext value={value}>
      {children}
      <Modal
        isOpen={target !== null && user !== null}
        title={t("suggest.title")}
        onClose={() => setTarget(null)}
      >
        {target && user && (
          <SuggestForm key={draftKey(target)} target={target} onDone={() => setTarget(null)} />
        )}
      </Modal>
    </SuggestContext>
  );
}
