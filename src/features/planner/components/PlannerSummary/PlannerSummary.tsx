import { RotateCcw, Share2 } from "lucide-react";
import type { Ref } from "react";
import { Button } from "../../../../components/ui/Button/Button";
import { useMediaQuery } from "../../../../components/ui/useMediaQuery";
import type { TranslationKey } from "../../../../i18n/types";
import { useI18n } from "../../../../i18n/useI18n";
import { STORAGE_KEYS } from "../../../../lib/storageKeys";
import { usePersistentState } from "../../../../lib/usePersistentState";
import type { Progress, ProgressStorage } from "../../types";
import { CompletionDialog } from "../CompletionDialog/CompletionDialog";
import { useCountUp } from "../../hooks/useCountUp";

const COUNT_INITIAL_MS = 900;
const COUNT_CHANGE_MS = 400;

const isBoolean = (value: unknown): value is boolean => typeof value === "boolean";

const STORAGE_NOTE_KEYS: Record<ProgressStorage, TranslationKey> = {
  account: "planner.storage.account",
  device: "planner.storage.device",
  none: "planner.storage.none",
};

interface PlannerSummaryProps {
  progress: Progress;
  storage: ProgressStorage;
  error: TranslationKey | null;
  progressRef: Ref<HTMLParagraphElement>;
  isDesktop: boolean;
  onShare: () => void;
  onReset: () => void;
}

export function PlannerSummary({
  progress,
  storage,
  error,
  progressRef,
  isDesktop,
  onShare,
  onReset,
}: PlannerSummaryProps) {
  const { t } = useI18n();
  const percent = progress.total > 0 ? Math.round((progress.done / progress.total) * 100) : 0;
  const isMotionAllowed = useMediaQuery("(prefers-reduced-motion: no-preference)");
  const shownPercent = useCountUp(percent, {
    initialMs: COUNT_INITIAL_MS,
    changeMs: COUNT_CHANGE_MS,
    enabled: isMotionAllowed,
  });
  // Shown once, when every title is watched; the flag in local storage keeps it from coming back.
  const [isCompletionSeen, setIsCompletionSeen] = usePersistentState(
    STORAGE_KEYS.completedSeen,
    false,
    isBoolean,
  );
  const showCompletion =
    progress.total > 0 && progress.done === progress.total && !isCompletionSeen;

  return (
    <section className="progress-card card card--panel on-panel" aria-labelledby="planner-title">
      <CompletionDialog
        isOpen={showCompletion}
        onClose={() => setIsCompletionSeen(true)}
        onShare={onShare}
      />
      <div className="progress-card__main">
        <h1 id="planner-title" className="section-title">
          {t("planner.progressHeading")}
        </h1>
        <p className="progress-card__percent" aria-hidden="true" ref={progressRef}>
          {/* Hidden "100%" reserves the final width, so the digits do not push the layout. */}
          <span className="progress-card__percent-width">100%</span>
          <span className="progress-card__percent-value">{shownPercent}%</span>
        </p>
        <p className="progress-card__count">
          {t("planner.watchedCount", { done: progress.done, total: progress.total })}
        </p>
        <progress
          className="visually-hidden"
          aria-label={t("planner.completed")}
          value={progress.done}
          max={Math.max(progress.total, 1)}
        />

        {!isDesktop && (
          <button type="button" className="progress-card__share" onClick={onShare}>
            <span className="progress-card__share-label">
              <Share2 aria-hidden />
              {t("planner.sharePoster.title")}
            </span>
          </button>
        )}

        <div className="progress-card__footer">
          <p className="progress-card__note muted">
            {t(STORAGE_NOTE_KEYS[storage])}
            {error && (
              <>
                {" "}
                <span role="alert">{t(error)}</span>
              </>
            )}
          </p>
          <Button variant="text" icon={<RotateCcw aria-hidden />} onClick={onReset}>
            {t("planner.toolbar.reset")}
          </Button>
        </div>
      </div>

      {isDesktop && (
        <aside className="share-poster" aria-labelledby="share-poster-title">
          <div>
            <h2 id="share-poster-title" className="share-poster__title">
              {t("planner.sharePoster.title")}
            </h2>
            <p>{t("planner.sharePoster.text")}</p>
          </div>
          <Button variant="dark" size="lg" icon={<Share2 aria-hidden />} onClick={onShare}>
            {t("share.open")}
          </Button>
        </aside>
      )}
    </section>
  );
}
