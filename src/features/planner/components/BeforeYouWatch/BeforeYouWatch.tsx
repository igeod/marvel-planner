import { Check, Eye } from "lucide-react";
import { useId, useState } from "react";
import { Tooltip } from "../../../../components/ui/Tooltip";
import { useI18n } from "../../../../i18n/useI18n";
import { TITLES_BY_ID } from "../../data/catalog";
import { getGuide } from "../../data/guides";
import type { PrerequisiteLevel } from "../../data/guides/types";
import type { Title } from "../../types";

const LEVELS: PrerequisiteLevel[] = ["essential", "recommended", "optional"];

interface BeforeYouWatchProps {
  title: Title;
  watched: ReadonlySet<string>;
}

function nameOf(id: string): string {
  return TITLES_BY_ID[id]?.name ?? id;
}

export function BeforeYouWatch({ title, watched }: BeforeYouWatchProps) {
  const { t, language } = useI18n();
  const [areReasonsRevealed, setAreReasonsRevealed] = useState(false);
  const headingId = useId();
  const reasonsId = useId();

  const guide = getGuide(title.id);
  const reasonIds = guide.prerequisites.map((item) => `${reasonsId}-${item.id}`).join(" ");
  const ordered = LEVELS.flatMap((level) =>
    guide.prerequisites.filter((item) => item.level === level),
  );

  return (
    <section className="before-you-watch" aria-labelledby={headingId}>
      <div className="before-you-watch__header">
        <h5 id={headingId} className="section-title">
          {t("prerequisites.heading")}
        </h5>
        {guide.prerequisites.length > 0 && (
          <Tooltip tone="warning" content={t("prerequisites.warning")}>
            {(describedBy) => (
              <button
                type="button"
                className="why-toggle"
                aria-expanded={areReasonsRevealed}
                aria-controls={reasonIds}
                aria-describedby={describedBy}
                onClick={() => setAreReasonsRevealed(!areReasonsRevealed)}
              >
                <Eye data-tooltip-anchor aria-hidden />
                {t("prerequisites.why")}
              </button>
            )}
          </Tooltip>
        )}
      </div>

      {title.status === "upcoming" && (
        <p className="before-you-watch__status muted">{t("prerequisites.provisional")}</p>
      )}

      {guide.prerequisites.length === 0 && (
        <p className="before-you-watch__status muted">{t("prerequisites.standalone")}</p>
      )}

      {ordered.length > 0 && (
        <ul className="before-you-watch__list">
          {ordered.map((item) => {
            const isWatched = watched.has(item.id);
            return (
              <li key={item.id} className="prereq">
                <span className="prereq__level muted">
                  {t(`prerequisites.levels.${item.level}`)}
                </span>
                <span lang="en" className="prereq__name">
                  {nameOf(item.id)}
                </span>
                <span className={`prereq__state prereq__state--${isWatched ? "done" : "todo"}`}>
                  {isWatched && <Check aria-hidden />}
                  {t(isWatched ? "prerequisites.watched" : "prerequisites.notWatched")}
                </span>
                <p
                  id={`${reasonsId}-${item.id}`}
                  className="prereq__reason"
                  hidden={!areReasonsRevealed}
                >
                  {item.reason[language]}
                </p>
              </li>
            );
          })}
        </ul>
      )}

      {guide.outside && (
        <p className="before-you-watch__outside">
          <strong>{t("prerequisites.outside")}:</strong> {guide.outside[language]}
        </p>
      )}
    </section>
  );
}
