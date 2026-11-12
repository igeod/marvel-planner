import { useMediaQuery } from "../../../../components/ui/useMediaQuery";
import { useI18n } from "../../../../i18n/useI18n";
import { useCountUp } from "../../hooks/useCountUp";
import type { Progress, Title } from "../../types";

interface CompactProgressProps {
  progress: Progress;
  nextTitle: Title | null;
  isVisible: boolean;
}

const COUNT_CHANGE_MS = 400;

export function CompactProgress({ progress, nextTitle, isVisible }: CompactProgressProps) {
  const { t, rich } = useI18n();
  const percent = progress.total > 0 ? Math.round((progress.done / progress.total) * 100) : 0;

  // The number counts only when it changes (reopening the card shows it as it is).
  const shownPercent = useCountUp(percent, {
    changeMs: COUNT_CHANGE_MS,
    enabled: useMediaQuery("(prefers-reduced-motion: no-preference)"),
  });

  return (
    <div className="compact-progress-wrap" data-visible={isVisible}>
      <div className="compact-progress-clip">
        <section
          className="compact-progress on-panel"
          role="status"
          aria-label={t("planner.progressHeading")}
        >
          <div className="compact-progress__row">
            <span className="compact-progress__count">
              {t("planner.watchedCount", { done: progress.done, total: progress.total })}
            </span>
            <span className="compact-progress__percent" aria-hidden="true">
              {/* Hidden "100%" reserves the final width, so the digits do not push the layout. */}
              <span className="compact-progress__percent-width">100%</span>
              <span className="compact-progress__percent-value">{shownPercent}%</span>
            </span>
          </div>
          <progress
            value={progress.done}
            max={Math.max(progress.total, 1)}
            aria-hidden="true"
            tabIndex={-1}
          />
          {nextTitle && (
            <p className="compact-progress__next">
              {rich("planner.compact.nextUp", {
                title: <strong lang="en">{nextTitle.name}</strong>,
              })}
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
