import { useI18n } from "../../../../i18n/useI18n";
import type { Progress, Title } from "../../types";

interface CompactProgressProps {
  progress: Progress;
  nextTitle: Title | null;
  isVisible: boolean;
}

export function CompactProgress({ progress, nextTitle, isVisible }: CompactProgressProps) {
  const { t, rich } = useI18n();
  const percent = progress.total > 0 ? Math.round((progress.done / progress.total) * 100) : 0;

  return (
    <section
      className="compact-progress on-panel"
      role="status"
      aria-label={t("planner.progressHeading")}
      data-visible={isVisible}
    >
      <div className="compact-progress__row">
        <span className="compact-progress__count">
          {t("planner.watchedCount", { done: progress.done, total: progress.total })}
        </span>
        <span className="compact-progress__percent">{percent}%</span>
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
  );
}
