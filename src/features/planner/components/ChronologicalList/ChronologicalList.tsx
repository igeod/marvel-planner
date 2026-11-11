import { useId } from "react";
import { useI18n } from "../../../../i18n/useI18n";
import { CHRONOLOGY_SOURCE_URL } from "../../data/chronology";
import type { Title } from "../../types";
import { TitleItem } from "../TitleItem/TitleItem";

interface ChronologicalListProps {
  placed: Title[];
  unplaced: Title[];
  watched: ReadonlySet<string>;
  onToggleTitle: (id: string) => void;
}

interface TitleListProps {
  titles: Title[];
  watched: ReadonlySet<string>;
  onToggleTitle: (id: string) => void;
}

function TitleList({ titles, watched, onToggleTitle }: TitleListProps) {
  return (
    <ol className="title-list">
      {titles.map((title) => (
        <TitleItem
          key={title.id}
          title={title}
          isWatched={watched.has(title.id)}
          watched={watched}
          onToggle={onToggleTitle}
        />
      ))}
    </ol>
  );
}

export function ChronologicalList({
  placed,
  unplaced,
  watched,
  onToggleTitle,
}: ChronologicalListProps) {
  const { t } = useI18n();
  const headingId = useId();
  const unplacedHeadingId = useId();

  return (
    <>
      <section className="chrono" aria-labelledby={headingId}>
        <h2 id={headingId}>{t("planner.order.chronologicalHeading")}</h2>
        <p>
          {t("planner.order.chronologicalNote")}{" "}
          <a href={CHRONOLOGY_SOURCE_URL} rel="noreferrer">
            {t("planner.order.sourceLink")}
          </a>
        </p>
        <TitleList titles={placed} watched={watched} onToggleTitle={onToggleTitle} />
      </section>

      {unplaced.length > 0 && (
        <section className="chrono" aria-labelledby={unplacedHeadingId}>
          <h2 id={unplacedHeadingId}>{t("planner.order.unplacedHeading")}</h2>
          <p>{t("planner.order.unplacedNote")}</p>
          <TitleList titles={unplaced} watched={watched} onToggleTitle={onToggleTitle} />
        </section>
      )}
    </>
  );
}
