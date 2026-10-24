import { useI18n } from "../../../../i18n/useI18n";
import type { Progress } from "../../types";

interface FloatingProgressProps {
  progress: Progress;
  isVisible: boolean;
}

export function FloatingProgress({ progress, isVisible }: FloatingProgressProps) {
  const { t } = useI18n();
  const percent = progress.total > 0 ? Math.round((progress.done / progress.total) * 100) : 0;

  return (
    <div className="floating-progress on-panel" aria-hidden="true" data-visible={isVisible}>
      <div className="floating-progress__row">
        <span className="floating-progress__label">
          {t("planner.watchedCount", { done: progress.done, total: progress.total })}
        </span>
        <span className="floating-progress__percent">{percent}%</span>
      </div>
      <progress value={progress.done} max={Math.max(progress.total, 1)} tabIndex={-1} />
    </div>
  );
}
