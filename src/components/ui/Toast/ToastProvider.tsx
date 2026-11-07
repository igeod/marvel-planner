import { Check, Hammer, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useI18n } from "../../../i18n/useI18n";
import { Button } from "../Button";
import { ToastContext, type ToastContextValue, type ToastOptions } from "./ToastContext";

type Item = ToastOptions & { id: string };

const MAX_VISIBLE = 3;
const DEFAULT_DURATION = 4000;
let nextId = 0;

interface ToastItemProps {
  item: Item;
  onDismiss: (id: string) => void;
}

function ToastItem({ item, onDismiss }: ToastItemProps) {
  const { t } = useI18n();
  const rootRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<Element | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const { id, persistent, duration } = item;

  useEffect(() => {
    if (persistent || isPaused) return;
    // shortcut: the timer restarts in full after a pause, upgrade if a remaining-time timer matters.
    const timer = setTimeout(() => onDismiss(id), Math.max(duration ?? DEFAULT_DURATION, 4000));
    return () => clearTimeout(timer);
  }, [id, persistent, duration, isPaused, onDismiss]);

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
        <Hammer className="toast__icon" aria-hidden />
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
  const [items, setItems] = useState<Item[]>([]);

  const dismiss = useCallback(
    (id: string) => setItems((current) => current.filter((item) => item.id !== id)),
    [],
  );

  const show = useCallback(
    (options: ToastOptions) => {
      const id = options.id ?? `toast-${++nextId}`;
      setItems((current) => {
        if (current.some((item) => item.id === id)) {
          return current.map((item) => (item.id === id ? { ...options, id } : item));
        }
        const next = [...current, { ...options, id }];
        if (next.length <= MAX_VISIBLE) return next;
        const evictable = next.findIndex((item) => !item.persistent && item.id !== id);
        if (evictable >= 0) return next.filter((_, index) => index !== evictable);
        // Only an error may push another persistent one out; an info toast waits its turn.
        return options.persistent ? next.slice(1) : current;
      });
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
