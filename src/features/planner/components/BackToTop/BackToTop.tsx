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

// The progress bar (phone) is sticky: it only needs clearing while it is stuck to the bottom edge, not
// when it rests at the end of the section above the footer.
const isBarStuck = () => {
  const bar = document.querySelector(".floating-progress[data-visible='true']");
  if (!bar) return false;
  const { bottom, height } = bar.getBoundingClientRect();
  return bottom > window.innerHeight - height;
};

// Two floating pills, centred: "Last watched" while that row is out of the window, and "Back to top"
// after a long scroll (1.5 screens). Each goes away on its own when it is no use.
export function BackToTop({ lastId = null, onJumpToLast }: BackToTopProps) {
  const { t } = useI18n();
  const [isFar, setIsFar] = useState(false);
  const [isLastOut, setIsLastOut] = useState(false);
  const [isAboveBar, setIsAboveBar] = useState(false);

  useEffect(() => {
    const update = () => {
      setIsFar(window.scrollY > window.innerHeight * 1.5);
      setIsLastOut(lastId !== null && !isRowInView(lastId));
      setIsAboveBar(isBarStuck());
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    // Folding or unfolding a phase moves the row without a scroll.
    const observer = new ResizeObserver(update);
    observer.observe(document.body);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      observer.disconnect();
    };
  }, [lastId]);

  const showLast = Boolean(onJumpToLast) && isLastOut;
  if (!isFar && !showLast) return null;

  const goTop = () => {
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: isReduced ? "auto" : "smooth" });
  };

  return (
    <div className={`jump-pills${isAboveBar ? " jump-pills--above-bar" : ""}`}>
      {showLast && (
        <Button
          variant="panel"
          size="sm"
          className="jump-pills__pill"
          icon={<LocateFixed aria-hidden />}
          onClick={onJumpToLast}
        >
          {t("planner.jump.last")}
        </Button>
      )}
      {isFar && (
        <Button
          variant="panel"
          size="sm"
          className="jump-pills__pill"
          icon={<ArrowUp aria-hidden />}
          onClick={goTop}
        >
          {t("planner.jump.top")}
        </Button>
      )}
    </div>
  );
}
