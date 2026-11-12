import { Play } from "lucide-react";
import { useId, useState } from "react";
import { usePhaseMotion } from "../../hooks/usePhaseMotion";
import { Chevron } from "../../../../components/ui/Chevron/Chevron";
import { useI18n } from "../../../../i18n/useI18n";
import type { CellState, StripPhase } from "../../utils/strip";

interface PhaseStripProps {
  phases: StripPhase[];
  // On the phone the strip is an accordion of its own, closed at first.
  isCollapsible: boolean;
}

const CELL_STATES: CellState[] = ["watched", "next", "todo"];

// Only the next title carries a symbol; watched cells are plain gold.
function CellMark({ state }: { state: CellState }) {
  return state === "next" ? <Play aria-hidden /> : null;
}

function Legend() {
  const { t } = useI18n();
  const labels: Record<CellState, string> = {
    watched: t("planner.strip.legendWatched"),
    next: t("planner.strip.legendNext"),
    todo: t("planner.strip.legendTodo"),
  };

  return (
    <ul className="phase-strip__legend muted" aria-hidden="true">
      {CELL_STATES.map((state) => (
        <li key={state}>
          <span className={`phase-strip__swatch phase-strip__cell--${state}`}>
            <CellMark state={state} />
          </span>
          {labels[state]}
        </li>
      ))}
    </ul>
  );
}

function Columns({ phases }: { phases: StripPhase[] }) {
  const { t } = useI18n();

  return (
    <div className="phase-strip__columns">
      {phases.map((phase) => (
        <div
          key={phase.number}
          className={`phase-strip__phase phase-strip__phase--size-${phase.total}`}
        >
          <div className="phase-strip__cells" aria-hidden="true">
            {phase.cells.map((state, index) => (
              <span key={index} className={`phase-strip__cell phase-strip__cell--${state}`}>
                <CellMark state={state} />
              </span>
            ))}
          </div>
          <p className="phase-strip__label">
            <span className="phase-strip__name">
              {t("planner.strip.phase", { number: phase.number })}
            </span>
            <span className="muted">
              {t("common.ofCount", { done: phase.done, total: phase.total })}
            </span>
          </p>
        </div>
      ))}
    </div>
  );
}

export function PhaseStrip({ phases, isCollapsible }: PhaseStripProps) {
  const { t } = useI18n();
  const headingId = useId();
  // On the phone the strip is closed at first; it opens and closes like a phase.
  const [isCollapsed, setIsCollapsed] = useState(true);
  const ref = usePhaseMotion(isCollapsed);
  const total = phases.reduce((sum, phase) => sum + phase.total, 0);
  const done = phases.reduce((sum, phase) => sum + phase.done, 0);
  const heading = t("planner.strip.heading", { total });
  const body = (
    <>
      <p className="visually-hidden">{t("planner.watchedCount", { done, total })}</p>
      <Columns phases={phases} />
    </>
  );

  if (isCollapsible) {
    return (
      <details
        ref={ref}
        className="phase phase-strip-accordion card"
        aria-labelledby={headingId}
        open={!isCollapsed}
        onToggle={(event) => {
          // Same as the phases: ignore toggles caused by the animation, react only to native ones.
          const details = event.currentTarget;
          if (details.dataset.motion || details.open === !isCollapsed) return;
          setIsCollapsed(!details.open);
        }}
      >
        <summary
          className="phase__summary"
          onClick={(event) => {
            // State drives open/closed so the close can animate before the attribute is removed.
            event.preventDefault();
            setIsCollapsed(!isCollapsed);
          }}
        >
          <span className="phase__heading">
            <h2 id={headingId} className="phase-strip__name">
              {heading}
            </h2>
          </span>
          <Chevron />
        </summary>
        <div className="phase-strip__body">
          <Legend />
          {body}
        </div>
      </details>
    );
  }

  return (
    <section className="phase-strip card" aria-labelledby={headingId}>
      <div className="phase-strip__header">
        <h2 id={headingId} className="section-title">
          {heading}
        </h2>
        <Legend />
      </div>
      {body}
    </section>
  );
}
