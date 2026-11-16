import { CalendarClock, Check, Minus } from "lucide-react";
import { useEffect, useRef } from "react";
import { Chevron } from "../../../../components/ui/Chevron/Chevron";
import { useI18n } from "../../../../i18n/useI18n";
import type { Phase } from "../../types";
import { computeProgress } from "../../utils/progress";
import { usePhaseMotion } from "../../hooks/usePhaseMotion";
import { TitleItem } from "../TitleItem/TitleItem";

interface PhaseSectionProps {
  phase: Phase;
  watched: ReadonlySet<string>;
  isCollapsed: boolean;
  onCollapsedChange: (isCollapsed: boolean) => void;
  onToggleTitle: (id: string) => void;
  onSetPhase: (ids: string[], isWatched: boolean, label: string) => void;
}

export function PhaseSection({
  phase,
  watched,
  isCollapsed,
  onCollapsedChange,
  onToggleTitle,
  onSetPhase,
}: PhaseSectionProps) {
  const { t } = useI18n();
  const progress = computeProgress(phase.titles, watched);
  const phaseName = t(`catalog.phases.${phase.number}`);

  const ref = usePhaseMotion(isCollapsed);
  // Acts on the titles shown: a filtered phase is marked only where it is visible.
  // Titles not out yet are not counted: a phase made only of them has nothing to mark.
  const isAllWatched = progress.total > 0 && progress.done === progress.total;
  const hasNothingOut = phase.titles.length > 0 && progress.total === 0;
  const isPartial = progress.done > 0 && !isAllWatched;
  // "Mixed" has no HTML attribute: it is a property, read by assistive technology as aria-checked="mixed".
  const checkRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (checkRef.current) checkRef.current.indeterminate = isPartial;
  }, [isPartial]);

  return (
    <div ref={ref} className="phase card" data-open={!isCollapsed}>
      <div className="phase__head">
        {hasNothingOut && (
          <span
            className="title-row__check title-row__check--upcoming phase__check"
            aria-hidden="true"
          >
            <CalendarClock />
          </span>
        )}
        {phase.titles.length > 0 && !hasNothingOut && (
          // Marks or unmarks the titles shown. It does not open or close the phase.
          <label className="title-row__check phase__check">
            <input
              ref={checkRef}
              type="checkbox"
              checked={isAllWatched}
              aria-label={isAllWatched ? t("planner.phase.unmarkAll") : t("planner.phase.markAll")}
              onChange={() =>
                onSetPhase(
                  phase.titles.map((title) => title.id),
                  !isAllWatched,
                  phaseName,
                )
              }
            />
            <span className="title-row__box" aria-hidden="true">
              {isAllWatched ? <Check /> : <Minus />}
            </span>
          </label>
        )}
        <h3 className="phase__title">
          <button
            type="button"
            className="phase__toggle"
            aria-expanded={!isCollapsed}
            // State drives open/closed so the close can animate before the content goes away.
            onClick={() => onCollapsedChange(!isCollapsed)}
          >
            <span className="phase__heading">
              <span className="phase__name">{phaseName}</span>{" "}
              <span className="phase__years muted">{phase.years}</span>
            </span>{" "}
            {!hasNothingOut && (
              <span className="phase__count">
                {t("common.ofCount", { done: progress.done, total: progress.total })}
              </span>
            )}
            <Chevron />
          </button>
        </h3>
      </div>

      <progress
        className="visually-hidden"
        aria-label={t("planner.phase.progress", { name: phaseName })}
        value={progress.done}
        max={Math.max(progress.total, 1)}
      />

      {phase.titles.length > 0 ? (
        <ol className="phase__titles">
          {phase.titles.map((title) => (
            <TitleItem
              key={title.id}
              title={title}
              isWatched={watched.has(title.id)}
              watched={watched}
              onToggle={onToggleTitle}
            />
          ))}
        </ol>
      ) : (
        <p className="phase__empty muted">{t("planner.phase.empty")}</p>
      )}
    </div>
  );
}
