import { ArrowUp, LocateFixed } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../../../../components/ui/Button/Button";
import { useI18n } from "../../../../i18n/useI18n";

interface BackToTopProps {
  // Planner only: the last watched title and the jump to its row. Without them only "Back to top" shows.
  lastId?: string | null;
  onJumpToLast?: () => void;
}

const isRowInView = (id: string) => {
  const row = document.getElementById(`title-${id}`);
  if (!row || row.getClientRects().length === 0) return false;
  const { top, bottom } = row.getBoundingClientRect();
  return bottom > 0 && top < window.innerHeight;
};

const root = document.documentElement;

// The progress bar (phone) is sticky: it only needs clearing while it is stuck to the bottom edge, not
// when it rests at the end of the section above the footer. --bar-lift is the distance from the bottom
// of the window to the top of the bar (0 when it is not stuck); toasts and pills sit --sp-2 above it.
function measureBar() {
  const bar = document.querySelector(".floating-progress[data-visible='true']");
  const rect = bar?.getBoundingClientRect();
  const isStuck = rect !== undefined && rect.bottom > window.innerHeight - rect.height;
  root.style.setProperty("--bar-lift", isStuck ? `${window.innerHeight - rect.top}px` : "0px");
}

// How far the pills rise to stay --sp-2 above the pile of toasts (0 with no toast). Measured, not
// guessed: the pills rest where their own rule puts them, the toasts where theirs does.
function measureToastsLift(): number {
  const toasts = document.querySelector(".toasts");
  const pills = document.querySelector(".jump-pills");
  let lift = 0;
  if (toasts && pills && toasts.childElementCount > 0) {
    const gap = parseFloat(getComputedStyle(root).fontSize) * 0.5;
    const pillsEdge = window.innerHeight - parseFloat(getComputedStyle(pills).bottom);
    lift = Math.max(0, pillsEdge - (toasts.getBoundingClientRect().top - gap));
  }
  root.style.setProperty("--toasts-lift", `${lift}px`);
  return lift;
}

// Two floating pills, centred: "Last watched" while that row is out of the window, and "Back to top"
// after a long scroll (1.5 screens). Each goes away on its own when it is no use. On a phone "Back to
// top" is just the arrow (its text stays for screen readers).
export function BackToTop({ lastId = null, onJumpToLast }: BackToTopProps) {
  const { t } = useI18n();
  const [isFar, setIsFar] = useState(false);
  const [isLastOut, setIsLastOut] = useState(false);
  const [isLifted, setIsLifted] = useState(false);
  const showLast = Boolean(onJumpToLast) && isLastOut;
  const hasPills = isFar || showLast;

  useEffect(() => {
    const update = () => {
      setIsFar(window.scrollY > window.innerHeight * 1.5);
      setIsLastOut(lastId !== null && !isRowInView(lastId));
      measureBar();
      setIsLifted(measureToastsLift() > 0);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    // Folding or unfolding a phase moves the row without a scroll; toasts coming and going move the pile.
    const observer = new ResizeObserver(update);
    observer.observe(document.body);
    const toasts = document.querySelector(".toasts");
    const mutations = new MutationObserver(update);
    if (toasts) {
      observer.observe(toasts);
      mutations.observe(toasts, { childList: true });
    }
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      observer.disconnect();
      mutations.disconnect();
      root.style.removeProperty("--bar-lift");
      root.style.removeProperty("--toasts-lift");
    };
    // The pills appearing or going away changes where they rest: measure again then too.
  }, [lastId, hasPills]);

  if (!hasPills) return null;

  const goTop = () => {
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: isReduced ? "auto" : "smooth" });
  };

  return (
    <div className="jump-pills" data-lifted={isLifted}>
      {showLast && (
        <Button
          variant="panel"
          size="sm"
          className="jump-pills__pill"
          icon={<LocateFixed aria-hidden />}
          onClick={onJumpToLast}
        >
          <span className="jump-pills__label">{t("planner.jump.last")}</span>
        </Button>
      )}
      {isFar && (
        <Button
          variant="panel"
          size="sm"
          className="jump-pills__pill jump-pills__pill--top"
          icon={<ArrowUp aria-hidden />}
          onClick={goTop}
        >
          <span className="jump-pills__label">{t("planner.jump.top")}</span>
        </Button>
      )}
    </div>
  );
}
