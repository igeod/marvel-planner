import { Check, Eye } from "lucide-react";
import { useId, useState } from "react";
import { Tooltip } from "../../../../components/ui/Tooltip/Tooltip";
import { useI18n } from "../../../../i18n/useI18n";
import { SuggestButton } from "../../../suggest/components/SuggestButton/SuggestButton";
import { TITLES_BY_ID } from "../../data/catalog";
import { getGuide } from "../../data/guides";
import type { Localized, PrerequisiteLevel } from "../../data/guides/types";
import type { Title } from "../../types";

const LEVELS: PrerequisiteLevel[] = ["essential", "recommended", "optional"];

interface BeforeYouWatchProps {
  title: Title;
  watched: ReadonlySet<string>;
}

// One list for both kinds: a title in this planner (it has a state) and one outside it (it has none).
interface Row {
  key: string;
  level: PrerequisiteLevel;
  name: string;
  reason: Localized;
  // Undefined for a title outside the planner: it cannot be marked.
  isWatched?: boolean;
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
  const rows: Row[] = [
    ...guide.prerequisites.map((item) => ({
      key: item.id,
      level: item.level,
      name: nameOf(item.id),
      reason: item.reason,
      isWatched: watched.has(item.id),
    })),
    ...(guide.outside ?? []).map((item) => ({ key: `outside-${item.name}`, ...item })),
  ];
  const ordered = LEVELS.flatMap((level) => rows.filter((row) => row.level === level));
  const reasonIds = ordered.map((row) => `${reasonsId}-${row.key}`).join(" ");

  // Nothing to watch first, here or outside: one reassuring box instead of the heading and the list.
  if (rows.length === 0) {
    return (
      <section className="before-you-watch" aria-label={t("prerequisites.heading")}>
        {title.status === "upcoming" && (
          <p className="before-you-watch__status muted">{t("prerequisites.provisional")}</p>
        )}
        <p className="prereq-none">
          <Check aria-hidden />
          <strong>{t("prerequisites.standalone")}</strong>
        </p>
        <div className="before-you-watch__suggest">
          <SuggestButton variant="text" target={{ titleId: title.id, section: "guide" }} />
        </div>
      </section>
    );
  }

  return (
    <section className="before-you-watch" aria-labelledby={headingId}>
      <div className="before-you-watch__header">
        <h5 id={headingId} className="section-title">
          {t("prerequisites.heading")}
        </h5>
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
              <Eye aria-hidden />
              {t("prerequisites.why")}
            </button>
          )}
        </Tooltip>
      </div>

      {title.status === "upcoming" && (
        <p className="before-you-watch__status muted">{t("prerequisites.provisional")}</p>
      )}

      <ul className="before-you-watch__list">
        {ordered.map((row) => (
          <li key={row.key} className="prereq">
            <span className="prereq__level muted">{t(`prerequisites.levels.${row.level}`)}</span>
            <span lang="en" className="prereq__name">
              {row.name}
            </span>
            {row.isWatched === undefined ? (
              <span className="prereq__state prereq__state--outside">
                {t("prerequisites.outside")}
              </span>
            ) : (
              <span className={`prereq__state prereq__state--${row.isWatched ? "done" : "todo"}`}>
                {row.isWatched && <Check aria-hidden />}
                {t(row.isWatched ? "prerequisites.watched" : "prerequisites.notWatched")}
              </span>
            )}
            <p
              id={`${reasonsId}-${row.key}`}
              className="prereq__reason"
              hidden={!areReasonsRevealed}
            >
              {row.reason[language]}
            </p>
          </li>
        ))}
      </ul>
      <div className="before-you-watch__suggest">
        <SuggestButton variant="text" target={{ titleId: title.id, section: "guide" }} />
      </div>
    </section>
  );
}
