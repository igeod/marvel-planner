import { useEffect, useState, type RefObject } from "react";

const GONE_MARGIN_PX = 40;

export function useFloatingProgressVisibility(progressRef: RefObject<HTMLElement | null>): {
  isPastProgress: boolean;
} {
  const [hasScrolledPastProgress, setHasScrolledPastProgress] = useState(false);

  useEffect(() => {
    const progress = progressRef.current;
    if (!progress) return;

    // Shows the card once the number is almost gone (its box is a bit taller than the glyphs).
    const update = () =>
      setHasScrolledPastProgress(progress.getBoundingClientRect().bottom < GONE_MARGIN_PX);
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [progressRef]);

  return { isPastProgress: hasScrolledPastProgress };
}
