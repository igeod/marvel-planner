import { useEffect, useState, type RefObject } from "react";
import { FOOTER_ID } from "../../../app/dom";

const GONE_MARGIN_PX = 40;

export function useFloatingProgressVisibility(progressRef: RefObject<HTMLElement | null>): {
  isPastProgress: boolean;
  isFooterVisible: boolean;
} {
  const [hasScrolledPastProgress, setHasScrolledPastProgress] = useState(false);
  const [isFooterVisible, setIsFooterVisible] = useState(false);

  useEffect(() => {
    const progress = progressRef.current;
    if (!progress) return;

    // Shows the card once the number is almost gone (its box is a bit taller than the glyphs).
    const update = () =>
      setHasScrolledPastProgress(progress.getBoundingClientRect().bottom < GONE_MARGIN_PX);
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    const footer = document.getElementById(FOOTER_ID);
    const footerObserver = new IntersectionObserver((entries) =>
      setIsFooterVisible(entries[entries.length - 1].isIntersecting),
    );
    if (footer) footerObserver.observe(footer);
    return () => {
      footerObserver.disconnect();
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [progressRef]);

  return { isPastProgress: hasScrolledPastProgress, isFooterVisible };
}
