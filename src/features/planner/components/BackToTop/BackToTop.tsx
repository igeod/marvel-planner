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

// The progress bar (phone) is fixed to the bottom edge. --bar-lift is its height plus its gap from the
// edge (0 while it is hidden); toasts and pills sit --sp-2 above it. Layout sizes, not the bounding
// rect: the rect moves while the bar slides in, and would leave the pills over it. Returns the lift.
function measureBar(): number {
  const bar = document.querySelector<HTMLElement>(".floating-progress[data-visible='true']");
  const lift = bar ? bar.offsetHeight + parseFloat(getComputedStyle(bar).bottom) : 0;
  root.style.setProperty("--bar-lift", `${lift}px`);
  // Tells the toasts to rise (with the longer duration), like the pills do.
  const toasts = document.querySelector<HTMLElement>(".toasts");
  if (toasts) toasts.dataset.lifted = String(lift > 0);
  return lift;
}

// A CSS length (max(), env(), var()) as pixels, resolved by the browser on a hidden fixed box.
function resolveBottom(probe: HTMLElement, length: string): number {
  probe.style.bottom = length;
  return parseFloat(getComputedStyle(probe).bottom);
}

// How far the pills rise to stay --sp-2 above the pile of toasts (0 with no toast). Both rest places
// come from their rules (bar lift, floors), and the pile height from the toasts themselves: the
// rects are in flight while the toasts slide and fold, so they are not read.
function measureToastsLift(barLift: number, probe: HTMLElement): number {
  const toasts = document.querySelectorAll<HTMLElement>(
    ".toast-slot:not([data-leaving='true']) .toast",
  );
  let lift = 0;
  if (toasts.length > 0) {
    const gap = parseFloat(getComputedStyle(root).fontSize) * 0.5;
    const toastsBottom = Math.max(
      resolveBottom(probe, "max(16px, env(safe-area-inset-bottom, 0px))"),
      barLift + gap,
    );
    const pillsBottom = Math.max(
      resolveBottom(probe, "calc(var(--sp-4) + env(safe-area-inset-bottom, 0px))"),
      barLift + gap,
    );
    const pile = Array.from(toasts).reduce((sum, toast) => sum + toast.offsetHeight, 0);
    lift = Math.max(0, toastsBottom + pile + (toasts.length - 1) * gap + gap - pillsBottom);
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
    const probe = document.createElement("div");
    probe.style.position = "fixed";
    probe.style.visibility = "hidden";
    document.body.append(probe);
    const update = () => {
      setIsFar(window.scrollY > window.innerHeight * 1.5);
      setIsLastOut(lastId !== null && !isRowInView(lastId));
      setIsLifted(measureToastsLift(measureBar(), probe) > 0);
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
      // A toast starting to leave leaves the pile at once, though it stays in the DOM a moment.
      mutations.observe(toasts, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["data-leaving"],
      });
    }
    // The bar showing or hiding changes no scroll or size, so listen to its own flag.
    const barFlag = new MutationObserver(update);
    barFlag.observe(document.body, {
      subtree: true,
      attributes: true,
      attributeFilter: ["data-visible"],
    });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      observer.disconnect();
      mutations.disconnect();
      barFlag.disconnect();
      probe.remove();
      root.style.removeProperty("--bar-lift");
      root.style.removeProperty("--toasts-lift");
    };
    // The pills appearing or going away changes where they rest: measure again then too.
  }, [lastId, hasPills]);

  const goTop = () => {
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: isReduced ? "auto" : "smooth" });
  };

  // Both slots stay mounted: each one folds its width and fades (see the less), so a pill coming or
  // going neither snaps nor shoves the other one off-centre.
  return (
    <div className="jump-pills" data-lifted={isLifted}>
      <div className="jump-pills__slot" data-visible={showLast}>
        <div className="jump-pills__inner">
          {onJumpToLast && (
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
        </div>
      </div>
      <div className="jump-pills__slot" data-visible={isFar}>
        <div className="jump-pills__inner">
          <Button
            variant="panel"
            size="sm"
            className="jump-pills__pill jump-pills__pill--top"
            icon={<ArrowUp aria-hidden />}
            onClick={goTop}
          >
            <span className="jump-pills__label">{t("planner.jump.top")}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
