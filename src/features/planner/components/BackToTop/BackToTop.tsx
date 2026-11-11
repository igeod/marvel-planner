import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useI18n } from "../../../../i18n/useI18n";

// Appears after a long scroll (1.5 screens) and goes away at the top.
export function BackToTop() {
  const { t } = useI18n();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const update = () => setIsVisible(window.scrollY > window.innerHeight * 1.5);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  if (!isVisible) return null;

  const goTop = () => {
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: isReduced ? "auto" : "smooth" });
  };

  return (
    <button
      type="button"
      className="back-to-top"
      aria-label={t("planner.jump.top")}
      onClick={goTop}
    >
      <ArrowUp aria-hidden />
    </button>
  );
}
