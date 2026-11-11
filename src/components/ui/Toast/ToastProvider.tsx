import { Check, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import errToast from "../../../assets/err-toast.webp";
import { useI18n } from "../../../i18n/useI18n";
import { Button } from "../Button/Button";
import { ToastContext, type ToastContextValue, type ToastOptions } from "./ToastContext";
import { addToast, type ToastItem } from "./toastQueue";

// From the design's Toast page: 6 s, 8 s when there is an action to reach.
const DEFAULT_DURATION = 6000;
const ACTION_DURATION = 8000;
let nextId = 0;

interface ToastItemProps {
  item: ToastItem;
  onDismiss: (id: string) => void;
}

function ToastItem({ item, onDismiss }: ToastItemProps) {
  const { t } = useI18n();
  const rootRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<Element | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const { id, persistent, duration } = item;
  const hasAction = Boolean(item.action);

  useEffect(() => {
    if (persistent || isPaused) return;
    // shortcut: the timer restarts in full after a pause, upgrade if a remaining-time timer matters.
    const base = hasAction ? ACTION_DURATION : DEFAULT_DURATION;
    const timer = setTimeout(() => onDismiss(id), Math.max(duration ?? base, 4000));
    return () => clearTimeout(timer);
  }, [id, persistent, duration, hasAction, isPaused, onDismiss]);

  const close = () => {
    const target = previousFocus.current;
    const hadFocus = rootRef.current?.contains(document.activeElement);
    onDismiss(id);
    if (hadFocus && target instanceof HTMLElement && target.isConnected) target.focus();
  };

  const runAction = async () => {
    setIsPending(true);
    try {
      await item.action?.onClick();
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div
      ref={rootRef}
      className={`toast toast--${item.tone}`}
      role={item.tone === "error" ? "alert" : "status"}
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
          isLoading={isPending}
          onClick={() => void runAction()}
        >
          {item.action.label}
        </Button>
      )}
      <button type="button" className="toast__close" aria-label={t("common.close")} onClick={close}>
        <X aria-hidden />
      </button>
    </div>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const dismiss = useCallback(
    (id: string) => setItems((current) => current.filter((item) => item.id !== id)),
    [],
  );

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
      <div className="toasts" aria-live="polite">
        {items.map((item) => (
          <ToastItem key={item.id} item={item} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext>
  );
}
