import { useEffect, useState, type RefObject } from "react";

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

    const progressObserver = new IntersectionObserver((entries) => {
      const entry = entries[entries.length - 1];
      setHasScrolledPastProgress(!entry.isIntersecting && entry.boundingClientRect.top < 0);
    });
    const footerObserver = new IntersectionObserver((entries) => {
      setIsFooterVisible(entries[entries.length - 1].isIntersecting);
    });

    progressObserver.observe(progress);
    footerObserver.observe(footer);
    return () => {
      progressObserver.disconnect();
      footerObserver.disconnect();
    };
  }, [progressRef, footerId]);

  return { isPastProgress: hasScrolledPastProgress, isFooterVisible };
}
