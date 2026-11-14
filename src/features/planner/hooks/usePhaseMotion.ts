import { useLayoutEffect, useRef } from "react";

// Animates a phase (data-open on its root) on every browser. CSS (motion.less) owns durations and
// easing; this hook measures the closed/open heights and sets data-motion while the animation runs.
// The height is animated only for a single click. Collapse all / Expand all (inside
// .planner__list--bulk) and a close that would leave the page shorter than where it is scrolled
// change the height at once: animating it moves the scrollbar frame by frame.
export function usePhaseMotion(isCollapsed: boolean) {
  const ref = useRef<HTMLDivElement>(null);
  const previous = useRef(isCollapsed);
  const run = useRef(0);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || previous.current === isCollapsed) return;
    previous.current = isCollapsed;
    const id = ++run.current;
    const closing = isCollapsed;
    const isBulk = Boolean(el.closest(".planner__list--bulk"));

    delete el.dataset.motion;
    el.style.removeProperty("--phase-h0");
    el.style.removeProperty("--phase-h1");
    el.dataset.open = "false";
    const closedHeight = el.offsetHeight;
    el.dataset.open = "true";
    const openHeight = el.offsetHeight;

    if (closing) {
      // The shorter page may not reach the current scroll position: the browser would clamp it.
      const isTooShort =
        window.scrollY >
        document.documentElement.scrollHeight - (openHeight - closedHeight) - window.innerHeight;
      if (isBulk || isTooShort) {
        el.dataset.open = "false";
        return;
      }
    }

    if (!isBulk) {
      el.style.setProperty("--phase-h0", `${closedHeight}px`);
      el.style.setProperty("--phase-h1", `${openHeight}px`);
    }
    el.dataset.motion = closing ? "closing" : "opening";

    const animations = el.getAnimations({ subtree: true });
    void Promise.allSettled(animations.map((animation) => animation.finished)).then(() => {
      if (run.current !== id) return;
      delete el.dataset.motion;
      el.style.removeProperty("--phase-h0");
      el.style.removeProperty("--phase-h1");
      if (closing) el.dataset.open = "false";
    });
  }, [isCollapsed]);

  return ref;
}
