import { Play } from "lucide-react";
import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { onIntro } from "../../../../app/splash";
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
  // The battery: --c is the cell's place among the watched ones, counted across the whole strip (not
  // restarting at each phase); --n is how many there are. "Next" lights up after them all.
  const watchedCount = phases.reduce(
    (sum, phase) => sum + phase.cells.filter((state) => state === "watched").length,
    0,
  );
  let charged = 0;

  return (
    <div className="phase-strip__columns" style={{ "--n": watchedCount } as CSSProperties}>
      {phases.map((phase) => (
        <div
          key={phase.number}
          className={`phase-strip__phase phase-strip__phase--size-${phase.total}`}
        >
          <div className="phase-strip__cells" aria-hidden="true">
            {phase.cells.map((state, index) => (
              <span
                key={index}
                className={`phase-strip__cell phase-strip__cell--${state}`}
                style={state === "watched" ? ({ "--c": charged++ } as CSSProperties) : undefined}
              >
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

// The battery plays once per arrival: on desktop as soon as the entrance (html[data-intro]) is on,
// on the phone the first time the accordion opens. data-charge goes away afterwards, so a cell that
// turns watched later does not start with a delay.
const CHARGE_MS = 1500;

function useCharge(isCollapsible: boolean, isCollapsed: boolean): boolean {
  const [isCharging, setIsCharging] = useState(false);
  const hasPlayed = useRef(false);

  useEffect(() => {
    if (hasPlayed.current || (isCollapsible && isCollapsed)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timer = 0;
    const play = () => {
      hasPlayed.current = true;
      setIsCharging(true);
      timer = window.setTimeout(() => setIsCharging(false), CHARGE_MS);
    };
    // The splash ends after the strip has rendered, so the entrance may start later than the strip.
    // On the phone it is the first opening that counts.
    const stop = isCollapsible ? (play(), () => undefined) : onIntro(play);
    return () => {
      stop();
      window.clearTimeout(timer);
    };
  }, [isCollapsible, isCollapsed]);

  return isCharging;
}

export function PhaseStrip({ phases, isCollapsible }: PhaseStripProps) {
  const { t } = useI18n();
  const headingId = useId();
  // On the phone the strip is closed at first; it opens and closes like a phase.
  const [isCollapsed, setIsCollapsed] = useState(true);
  const ref = usePhaseMotion(isCollapsed);
  const isCharging = useCharge(isCollapsible, isCollapsed);
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
      <div
        ref={ref}
        className="phase phase-strip-accordion card"
        data-open={!isCollapsed}
        data-charge={isCharging || undefined}
      >
        <div className="phase__head">
          <h2 id={headingId} className="phase__title phase-strip__name">
            <button
              type="button"
              className="phase__toggle"
              aria-expanded={!isCollapsed}
              // State drives open/closed so the close can animate before the content goes away.
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              <span className="phase__heading">{heading}</span>
              <Chevron />
            </button>
          </h2>
        </div>
        <div className="phase-strip__body">
          <Legend />
          {body}
        </div>
      </div>
    );
  }

  return (
    <section
      className="phase-strip card"
      aria-labelledby={headingId}
      data-charge={isCharging || undefined}
    >
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
