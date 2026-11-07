import { useEffect, useRef, useState } from "react";

export type ViewDirection = "forward" | "back";

interface Options<V> {
  // The profile popup and a popup that was just closed swap at once, with no motion.
  isInstant: (from: V | null, to: V) => boolean;
  isBack: (from: V, to: V) => boolean;
  // Runs right before the new view replaces the old one: the moment to measure the old height.
  onBeforeSwap?: () => void;
}

// How long the old view takes to leave: the same token the CSS uses, so both always agree.
function exitMs(): number {
  const raw = getComputedStyle(document.documentElement).getPropertyValue("--dur-hover");
  return Number.parseFloat(raw) || 0;
}

// Keeps the old view on screen while it leaves, then shows the new one. `shown` is what to render.
export function useViewTransition<V, P>(view: V | null, payload: P, options: Options<V>) {
  const [shown, setShown] = useState<{ view: V | null; payload: P }>({ view, payload });
  const [previous, setPrevious] = useState(view);
  const [leaving, setLeaving] = useState(false);
  const [direction, setDirection] = useState<ViewDirection | undefined>();
  const latest = useRef({ view, payload, onBeforeSwap: options.onBeforeSwap });

  useEffect(() => {
    latest.current = { view, payload, onBeforeSwap: options.onBeforeSwap };
  });

  // The view changed: either swap at once or start the old one leaving.
  if (view !== previous) {
    setPrevious(view);
    if (view !== null) {
      if (options.isInstant(previous, view)) {
        setShown({ view, payload });
        setLeaving(false);
        setDirection(undefined);
      } else if (previous !== null) {
        setDirection(options.isBack(previous, view) ? "back" : "forward");
        setLeaving(true);
      }
    }
  } else if (view !== null && !leaving && payload !== shown.payload) {
    // Same view, new data (an email carried over): no motion.
    setShown({ view, payload });
  }

  useEffect(() => {
    if (!leaving) return;
    const timer = setTimeout(() => {
      const next = latest.current;
      next.onBeforeSwap?.();
      if (next.view !== null) setShown({ view: next.view, payload: next.payload });
      setLeaving(false);
    }, exitMs());
    return () => clearTimeout(timer);
  }, [leaving]);

  return { shown, leaving, direction };
}
