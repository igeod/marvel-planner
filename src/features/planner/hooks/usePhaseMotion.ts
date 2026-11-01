import { useLayoutEffect, useRef } from "react";

// Animates a phase <details> on every browser. CSS (motion.less) owns durations and easing; this hook only
// measures the closed/open heights and sets data-motion while the animation runs. On close the "open"
// attribute is kept until the animation ends.
export function usePhaseMotion(isCollapsed: boolean) {
  const ref = useRef<HTMLDetailsElement>(null);
  const previous = useRef(isCollapsed);
  const run = useRef(0);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || previous.current === isCollapsed) return;
    previous.current = isCollapsed;
    const id = ++run.current;
    const closing = isCollapsed;

    delete el.dataset.motion;
    el.open = false;
    const closedHeight = el.offsetHeight;
    el.open = true;
    const openHeight = el.offsetHeight;
    el.style.setProperty("--phase-h0", `${closedHeight}px`);
    el.style.setProperty("--phase-h1", `${openHeight}px`);
    el.dataset.motion = closing ? "closing" : "opening";

    const animations = el.getAnimations({ subtree: true });
    void Promise.allSettled(animations.map((animation) => animation.finished)).then(() => {
      if (run.current !== id) return;
      delete el.dataset.motion;
      el.style.removeProperty("--phase-h0");
      el.style.removeProperty("--phase-h1");
      if (closing) el.open = false;
    });
  }, [isCollapsed]);

  return ref;
}
