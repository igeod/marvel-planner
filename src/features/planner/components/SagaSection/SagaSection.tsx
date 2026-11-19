import { useId } from "react";
import { useI18n } from "../../../../i18n/useI18n";
import type { PhaseNumber, Saga } from "../../types";
import { computeProgress } from "../../utils/progress";
import { SagaHeader } from "./SagaHeader";
import { PhaseSection } from "../PhaseSection/PhaseSection";

interface SagaSectionProps {
  saga: Saga;
  watched: ReadonlySet<string>;
  collapsed: ReadonlySet<number>;
  onPhaseCollapsedChange: (phase: PhaseNumber, isCollapsed: boolean) => void;
  onToggleTitle: (id: string) => void;
  onSetPhase: (ids: string[], isWatched: boolean, label: string) => void;
}

export function SagaSection({
  saga,
  watched,
  collapsed,
  onPhaseCollapsedChange,
  onToggleTitle,
  onSetPhase,
}: SagaSectionProps) {
  const { t } = useI18n();
  const headingId = useId();
  const progress = computeProgress(
    saga.phases.flatMap((phase) => phase.titles),
    watched,
  );

  return (
    <section className="saga" aria-labelledby={headingId}>
      <SagaHeader headingId={headingId} title={t(`catalog.sagas.${saga.id}`)} progress={progress} />
      {saga.phases.map((phase) => (
        <PhaseSection
          key={phase.number}
          phase={phase}
          watched={watched}
          isCollapsed={collapsed.has(phase.number)}
          onCollapsedChange={(isCollapsed) => onPhaseCollapsedChange(phase.number, isCollapsed)}
          onToggleTitle={onToggleTitle}
          onSetPhase={onSetPhase}
        />
      ))}
    </section>
  );
}
