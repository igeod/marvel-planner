import { useId } from "react";
import { useI18n } from "../../../../i18n/useI18n";
import { CHRONOLOGY_SOURCE_URL } from "../../data/chronology";
import { LICENSE_URL } from "../../data/sources";
import type { PhaseNumber, Title } from "../../types";
import { computeProgress } from "../../utils/progress";
import { SagaHeader } from "../SagaSection/SagaHeader";
import { TitleItem } from "../TitleItem/TitleItem";

interface ChronologicalListProps {
  placed: Title[];
  unplaced: Title[];
  watched: ReadonlySet<string>;
  phaseOf: ReadonlyMap<string, PhaseNumber>;
  onToggleTitle: (id: string) => void;
}

interface TitleListProps {
  titles: Title[];
  watched: ReadonlySet<string>;
  phaseOf: ReadonlyMap<string, PhaseNumber>;
  onToggleTitle: (id: string) => void;
}

function TitleList({ titles, watched, phaseOf, onToggleTitle }: TitleListProps) {
  return (
    <ol className="title-list">
      {titles.map((title) => (
        <TitleItem
          key={title.id}
          title={title}
          phase={phaseOf.get(title.id)}
          isWatched={watched.has(title.id)}
          watched={watched}
          onToggle={onToggleTitle}
        />
      ))}
    </ol>
  );
}

// The order as two sections with the same header as a saga: the titles on the timeline we follow,
// then the ones it does not mention (not placed at random).
export function ChronologicalList({
  placed,
  unplaced,
  watched,
  phaseOf,
  onToggleTitle,
}: ChronologicalListProps) {
  const { t } = useI18n();
  const headingId = useId();
  const unplacedHeadingId = useId();

  return (
    <>
      <section className="saga" aria-labelledby={headingId}>
        <SagaHeader
          headingId={headingId}
          title={t("planner.order.chronologicalHeading")}
          progress={computeProgress(placed, watched)}
          note={
            <>
              {t("details.plot.sourceLabel")}{" "}
              <a href={CHRONOLOGY_SOURCE_URL} rel="noreferrer">
                {t("details.plot.sourceLink")}
              </a>
              , <a href={LICENSE_URL}>{t("details.plot.license")}</a>
            </>
          }
        />
        <TitleList
          titles={placed}
          watched={watched}
          phaseOf={phaseOf}
          onToggleTitle={onToggleTitle}
        />
      </section>

      {unplaced.length > 0 && (
        <section className="saga" aria-labelledby={unplacedHeadingId}>
          <SagaHeader
            headingId={unplacedHeadingId}
            title={t("planner.order.unplacedHeading")}
            progress={computeProgress(unplaced, watched)}
            note={t("planner.order.unplacedNote")}
          />
          <TitleList
            titles={unplaced}
            watched={watched}
            phaseOf={phaseOf}
            onToggleTitle={onToggleTitle}
          />
        </section>
      )}
    </>
  );
}
