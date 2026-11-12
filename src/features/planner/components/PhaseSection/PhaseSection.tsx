import { Check, Minus } from "lucide-react";
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
  const isAllWatched = progress.total > 0 && progress.done === progress.total;
  const isPartial = progress.done > 0 && !isAllWatched;
  // "Mixed" has no HTML attribute: it is a property, read by assistive technology as aria-checked="mixed".
  const checkRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (checkRef.current) checkRef.current.indeterminate = isPartial;
  }, [isPartial]);

  return (
    <details
      ref={ref}
      className="phase card"
      open={!isCollapsed}
      onToggle={(event) => {
        // Ignore toggles caused by the animation; react only to native ones (e.g. find in page).
        const details = event.currentTarget;
        if (details.dataset.motion || details.open === !isCollapsed) return;
        onCollapsedChange(!details.open);
      }}
    >
      <summary
        className="phase__summary"
        onClick={(event) => {
          // State drives open/closed so the close can animate before the attribute is removed.
          event.preventDefault();
          onCollapsedChange(!isCollapsed);
        }}
      >
        {phase.titles.length > 0 && (
          // Marks or unmarks the titles shown. It does not open or close the phase.
          <label
            className="title-row__check phase__check"
            onClick={(event) => event.stopPropagation()}
          >
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
        <span className="phase__heading">
          <h3 className="phase__name">{phaseName}</h3>
          <span className="phase__years muted">{phase.years}</span>
        </span>
        <span className="phase__count">
          {t("common.ofCount", { done: progress.done, total: progress.total })}
        </span>
        <Chevron />
      </summary>

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
    </details>
  );
}
