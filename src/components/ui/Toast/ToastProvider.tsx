import { Check, X } from "lucide-react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import errToast from "../../../assets/err-toast.webp";
import { useI18n } from "../../../i18n/useI18n";
import { Button } from "../Button/Button";
import { useMediaQuery } from "../useMediaQuery";
import { restoreFocus } from "../useDialog";
import { ToastContext, type ToastContextValue, type ToastOptions } from "./ToastContext";
import { addToast, dismissToast, removeToast, type ToastItem } from "./toastQueue";

// From the design's Toast page: 4 s, 6 s when there is an action to reach.
const DEFAULT_DURATION = 4000;
const ACTION_DURATION = 6000;
// Safety net: a transition that never runs (hidden tab) must not leave a toast stuck on screen.
const TRANSITION_FALLBACK_MS = 1000;
let nextId = 0;

interface ToastItemProps {
  item: ToastItem;
  onDismiss: (id: string) => void;
  onRemove: (id: string) => void;
}

function ToastItem({ item, onDismiss, onRemove }: ToastItemProps) {
  const { t } = useI18n();
  const rootRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<Element | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const { id, persistent, duration, leaving = false } = item;
  const hasAction = Boolean(item.action);
  // The slot folds open on entry (clipped meanwhile); at rest nothing is clipped, so the shadow shows.
  const hasMotion = useMediaQuery("(prefers-reduced-motion: no-preference)");
  const [isSettled, setIsSettled] = useState(!hasMotion);

  useEffect(() => {
    if (isSettled) return;
    const timer = setTimeout(() => setIsSettled(true), TRANSITION_FALLBACK_MS);
    return () => clearTimeout(timer);
  }, [isSettled]);

  useEffect(() => {
    if (!leaving) return;
    const timer = setTimeout(() => onRemove(id), TRANSITION_FALLBACK_MS);
    return () => clearTimeout(timer);
  }, [leaving, id, onRemove]);

  // However it leaves (timeout, close, Esc, pushed out), focus inside goes back where it was.
  useLayoutEffect(() => {
    if (leaving && rootRef.current?.contains(document.activeElement)) {
      restoreFocus(previousFocus.current);
    }
  }, [leaving]);

  useEffect(() => {
    if (persistent || isPaused || leaving) return;
    // shortcut: the timer restarts in full after a pause, upgrade if a remaining-time timer matters.
    const base = hasAction ? ACTION_DURATION : DEFAULT_DURATION;
    const timer = setTimeout(() => onDismiss(id), Math.max(duration ?? base, 4000));
    return () => clearTimeout(timer);
  }, [id, persistent, duration, hasAction, isPaused, leaving, onDismiss]);

  const close = () => onDismiss(id);

  // The toast closes at the click, before the action runs: an action that fails shows its own
  // toast, and closing after it would remove that one.
  const runAction = async () => {
    onDismiss(id);
    await item.action?.onClick();
  };

  return (
    <div
      className="toast-slot"
      data-leaving={leaving}
      data-settled={isSettled}
      onTransitionEnd={(event) => {
        if (event.target === event.currentTarget && event.propertyName === "grid-template-rows") {
          setIsSettled(true);
        }
      }}
    >
      <div className="toast-slot__clip">
        <div
          ref={rootRef}
          className={`toast toast--${item.tone}`}
          inert={leaving}
          onTransitionEnd={(event) => {
            if (
              leaving &&
              event.target === event.currentTarget &&
              event.propertyName === "opacity"
            ) {
              onRemove(id);
            }
          }}
          onPointerEnter={() => setIsPaused(true)}
          onPointerLeave={() => setIsPaused(false)}
          onFocus={(event) => {
            setIsPaused(true);
            if (!rootRef.current?.contains(event.relatedTarget as Node | null)) {
              previousFocus.current = event.relatedTarget;
            }
          }}
          onBlur={() => setIsPaused(false)}
          onKeyDown={(event) => event.key === "Escape" && close()}
        >
          {item.tone === "error" ? (
            <img className="toast__icon" src={errToast} alt="" aria-hidden width={36} height={36} />
          ) : (
            <span className="toast__badge" aria-hidden>
              <Check />
            </span>
          )}
          <div className="toast__text">
            <strong>{item.title}</strong>
            {item.message && <span>{item.message}</span>}
          </div>
          {item.action && (
            <Button
              variant="panel"
              size="sm"
              className="toast__action"
              onClick={() => void runAction()}
            >
              {item.action.label}
            </Button>
          )}
          <button
            type="button"
            className="toast__close"
            aria-label={t("common.close")}
            onClick={close}
          >
            <X aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const { t } = useI18n();
  const [items, setItems] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => setItems((current) => dismissToast(current, id)), []);
  const remove = useCallback((id: string) => setItems((current) => removeToast(current, id)), []);

  const show = useCallback(
    (options: ToastOptions) => {
      const id = options.id ?? `toast-${++nextId}`;
      setItems((current) => addToast(current, { ...options, id }));
      return () => dismiss(id);
    },
    [dismiss],
  );

  const value = useMemo<ToastContextValue>(() => ({ show, dismiss }), [show, dismiss]);

  return (
    <ToastContext value={value}>
      {children}
      <div
        className="toasts"
        role="region"
        aria-label={t("common.notifications")}
        aria-live="polite"
      >
        {items.map((item) => (
          <ToastItem key={item.id} item={item} onDismiss={dismiss} onRemove={remove} />
        ))}
      </div>
    </ToastContext>
  );
}
