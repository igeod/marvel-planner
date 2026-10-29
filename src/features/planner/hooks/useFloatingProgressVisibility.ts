import { useEffect, useState, type RefObject } from "react";

const GONE_MARGIN_PX = 40;

export function useFloatingProgressVisibility(
  progressRef: RefObject<HTMLElement | null>,
  footerId: string,
): { isPastProgress: boolean; isFooterVisible: boolean } {
  const [hasScrolledPastProgress, setHasScrolledPastProgress] = useState(false);
  const [isFooterVisible, setIsFooterVisible] = useState(false);

  useEffect(() => {
    const progress = progressRef.current;
    const footer = document.getElementById(footerId);
    if (!progress || !footer || !("IntersectionObserver" in window)) return;

    // Shows the card once the number is almost gone (its box is a bit taller than the glyphs).
    const update = () =>
      setHasScrolledPastProgress(progress.getBoundingClientRect().bottom < GONE_MARGIN_PX);
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    const footerObserver = new IntersectionObserver((entries) => {
      setIsFooterVisible(entries[entries.length - 1].isIntersecting);
    });

    footerObserver.observe(footer);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      footerObserver.disconnect();
    };
  }, [progressRef, footerId]);

  return { isPastProgress: hasScrolledPastProgress, isFooterVisible };
}
