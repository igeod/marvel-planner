import { useMediaQuery } from "../../../../components/ui/useMediaQuery";
import { useI18n } from "../../../../i18n/useI18n";
import { useCountUp } from "../../hooks/useCountUp";
import type { Progress } from "../../types";

interface FloatingProgressProps {
  progress: Progress;
  isVisible: boolean;
}

export function FloatingProgress({ progress, isVisible }: FloatingProgressProps) {
  const { t } = useI18n();
  const percent = progress.total > 0 ? Math.round((progress.done / progress.total) * 100) : 0;

  // The number counts only when it changes.
  const shownPercent = useCountUp(percent, {
    changeMs: 400,
    enabled: useMediaQuery("(prefers-reduced-motion: no-preference)"),
  });

  return (
    <div className="floating-progress on-panel" aria-hidden="true" data-visible={isVisible}>
      <div className="floating-progress__row">
        <span className="floating-progress__label">
          {t("planner.watchedCount", { done: progress.done, total: progress.total })}
        </span>
        <span className="floating-progress__percent">{shownPercent}%</span>
      </div>
      <progress value={progress.done} max={Math.max(progress.total, 1)} tabIndex={-1} />
    </div>
  );
}
