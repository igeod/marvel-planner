import { LocateFixed, RotateCcw, Share2 } from "lucide-react";
import { useId, useState, type Ref } from "react";
import { Button } from "../../../../components/ui/Button/Button";
import { Chevron } from "../../../../components/ui/Chevron/Chevron";
import type { TranslationKey } from "../../../../i18n/types";
import { useI18n } from "../../../../i18n/useI18n";
import { STORAGE_KEYS } from "../../../../lib/storageKeys";
import { usePersistentState } from "../../../../lib/usePersistentState";
import type { Progress, ProgressStorage } from "../../types";
import type { StripPhase } from "../../utils/strip";
import { CompletionDialog } from "../CompletionDialog/CompletionDialog";
import { PhaseStrip } from "../PhaseStrip/PhaseStrip";

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
  strip: StripPhase[];
  isDesktop: boolean;
  onShare: () => void;
  onReset: () => void;
  // Absent while nothing is watched: the next title takes its place.
  onJumpToLast: (() => void) | null;
}

export function PlannerSummary({
  progress,
  storage,
  error,
  progressRef,
  strip,
  isDesktop,
  onShare,
  onReset,
  onJumpToLast,
}: PlannerSummaryProps) {
  const { t } = useI18n();
  const [isStripOpen, setIsStripOpen] = useState(false);
  const stripId = useId();
  const percent = progress.total > 0 ? Math.round((progress.done / progress.total) * 100) : 0;
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
          {percent}%
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

        {onJumpToLast && (
          <Button variant="text" icon={<LocateFixed aria-hidden />} onClick={onJumpToLast}>
            {t("planner.jump.last")}
          </Button>
        )}

        {!isDesktop && (
          <button type="button" className="progress-card__share" onClick={onShare}>
            <span className="progress-card__share-label">
              <Share2 aria-hidden />
              {t("planner.sharePoster.title")}
            </span>
          </button>
        )}

        {!isDesktop && (
          <>
            <button
              type="button"
              className="progress-card__toggle"
              aria-expanded={isStripOpen}
              aria-controls={stripId}
              onClick={() => setIsStripOpen(!isStripOpen)}
            >
              {t("planner.strip.heading", { total: progress.total })}
              <Chevron />
            </button>
            <div id={stripId} hidden={!isStripOpen}>
              {isStripOpen && <PhaseStrip phases={strip} variant="inline" />}
            </div>
          </>
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
