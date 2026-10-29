import { Check, Play } from "lucide-react";
import { useId } from "react";
import { useI18n } from "../../../../i18n/useI18n";
import type { CellState, StripPhase } from "../../utils/strip";

interface PhaseStripProps {
  phases: StripPhase[];
  variant: "card" | "inline";
}

const CELL_STATES: CellState[] = ["watched", "next", "todo"];

function CellMark({ state }: { state: CellState }) {
  if (state === "watched") return <Check strokeWidth={4} aria-hidden />;
  if (state === "next") return <Play aria-hidden />;
  return null;
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

export function PhaseStrip({ phases, variant }: PhaseStripProps) {
  const { t } = useI18n();
  const headingId = useId();
  const total = phases.reduce((sum, phase) => sum + phase.total, 0);
  const done = phases.reduce((sum, phase) => sum + phase.done, 0);
  const summary = <p className="visually-hidden">{t("planner.watchedCount", { done, total })}</p>;

  if (variant === "inline") {
    return (
      <div className="phase-strip phase-strip--inline">
        <Legend />
        {summary}
        <Columns phases={phases} />
      </div>
    );
  }

  return (
    <section className="phase-strip card" aria-labelledby={headingId}>
      <div className="phase-strip__header">
        <h2 id={headingId} className="section-title">
          {t("planner.strip.heading", { total })}
        </h2>
        <Legend />
      </div>
      {summary}
      <Columns phases={phases} />
    </section>
  );
}
