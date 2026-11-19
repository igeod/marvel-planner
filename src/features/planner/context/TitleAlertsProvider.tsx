import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useToast } from "../../../components/ui/Toast/useToast";
import { useI18n } from "../../../i18n/useI18n";
import { useAuth } from "../../auth/hooks/useAuth";
import { useAuthDialog } from "../../auth/hooks/useAuthDialog";
import { memoryTitleAlertsRepository } from "../services/titleAlertsRepository";
import { withAlert, type AlertTitle } from "../utils/titleAlertsState";
import { TitleAlertsContext, type TitleAlertsContextValue } from "./TitleAlertsContext";

const ALERT_TOAST_ID = "title-alert";
const NO_ALERTS: ReadonlySet<string> = new Set();
const repository = memoryTitleAlertsRepository;

interface Actions {
  activate: (title: AlertTitle, email: string, isAfterSignIn: boolean) => Promise<void>;
  deactivate: (title: AlertTitle) => Promise<void>;
}

export function TitleAlertsProvider({ children }: { children: ReactNode }) {
  const { t, rich } = useI18n();
  const toast = useToast();
  const { user } = useAuth();
  const { view, open } = useAuthDialog();
  const latest = useRef<Actions | null>(null);
  const [loaded, setLoaded] = useState<ReadonlySet<string>>(NO_ALERTS);
  const [pendingTitle, setPendingTitle] = useState<AlertTitle | null>(null);
  // Without an account there are no alerts: what was loaded for the last one is not shown.
  const ids = user ? loaded : NO_ALERTS;
  const userId = user?.id;

  useEffect(() => {
    if (!userId) return;
    let isActive = true;
    repository
      .list()
      .then((list) => isActive && setLoaded(new Set(list)))
      .catch(() => undefined);
    return () => {
      isActive = false;
    };
  }, [userId]);

  // A guest who closes the sign-in dialog drops the action (adjusted while rendering, not in an effect).
  const [previousView, setPreviousView] = useState(view);
  if (view !== previousView) {
    setPreviousView(view);
    if (view === null) setPendingTitle(null);
  }

  const failed = useCallback(
    (retry: () => void) =>
      toast.show({
        id: "title-alert-error",
        tone: "error",
        persistent: true,
        title: t("errors.save.title"),
        message: t("errors.save.body"),
        action: { label: t("common.retry"), onClick: retry },
      }),
    [toast, t],
  );

  // Turns it on or off. Returns whether the repository accepted it; the caller decides the toast.
  const apply = useCallback(async (titleId: string, isOn: boolean): Promise<boolean> => {
    setLoaded((current) => withAlert(current, titleId, isOn));
    try {
      await repository.set(titleId, isOn);
      return true;
    } catch {
      setLoaded((current) => withAlert(current, titleId, !isOn));
      return false;
    }
  }, []);

  const activate = useCallback(
    async (title: AlertTitle, email: string, isAfterSignIn: boolean) => {
      const loginToast = () => toast.show({ tone: "info", title: t("auth.login.done") });
      if (!(await apply(title.id, true))) {
        if (isAfterSignIn) loginToast();
        failed(() => void latest.current?.activate(title, email, false));
        return;
      }
      const activated = t("titleAlerts.activated", { email });
      toast.show({
        id: ALERT_TOAST_ID,
        tone: "info",
        // After a sign-in the two toasts are one: a single gesture, a single message.
        title: isAfterSignIn ? t("auth.login.done") : activated,
        message: isAfterSignIn ? activated : undefined,
        action: { label: t("common.undo"), onClick: () => void apply(title.id, false) },
      });
    },
    [apply, failed, toast, t],
  );

  const deactivate = useCallback(
    async (title: AlertTitle) => {
      if (!(await apply(title.id, false))) {
        failed(() => void latest.current?.deactivate(title));
        return;
      }
      toast.show({ id: ALERT_TOAST_ID, tone: "info", title: t("titleAlerts.deactivated") });
    },
    [apply, failed, toast, t],
  );

  // A retry runs the latest version of each action.
  useEffect(() => {
    latest.current = { activate, deactivate };
  }, [activate, deactivate]);

  // Read by resumeAfterAuth, which a form calls from its own callback.
  const pendingRef = useRef(pendingTitle);
  useEffect(() => {
    pendingRef.current = pendingTitle;
  }, [pendingTitle]);

  const value = useMemo<TitleAlertsContextValue>(
    () => ({
      isOn: (titleId) => ids.has(titleId),
      toggle: (title) => {
        if (!user) {
          setPendingTitle(title);
          open(
            "login",
            undefined,
            rich("titleAlerts.loginNote", { title: <span lang="en">{title.name}</span> }),
          );
          return;
        }
        void (ids.has(title.id) ? deactivate(title) : activate(title, user.email, false));
      },
      resumeAfterAuth: (email) => {
        const title = pendingRef.current;
        if (!title) return false;
        setPendingTitle(null);
        void activate(title, email, true);
        return true;
      },
    }),
    [ids, user, open, rich, activate, deactivate],
  );

  return <TitleAlertsContext value={value}>{children}</TitleAlertsContext>;
}
