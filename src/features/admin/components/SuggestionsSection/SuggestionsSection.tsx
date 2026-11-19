import { Check, MessageSquarePlus } from "lucide-react";
import { ExternalLink } from "lucide-react";
import { useId } from "react";
import type { AdminSuggestion } from "../../../../../shared/admin";
import { titlePath } from "../../../../app/paths";
import { useI18n } from "../../../../i18n/useI18n";
import { TITLES_BY_ID } from "../../../planner/data/catalog";
import { SECTION_KEYS } from "../../../suggest/sectionKeys";

interface SuggestionsSectionProps {
  suggestions: AdminSuggestion[];
  onHandle: (id: string, action: "done" | "discard") => Promise<boolean>;
}

export function SuggestionsSection({ suggestions, onHandle }: SuggestionsSectionProps) {
  const { t, formatDate } = useI18n();
  const headingId = useId();

  return (
    <section id="suggerimenti" className="candidates" aria-labelledby={headingId}>
      <h2 id={headingId}>{t("admin.suggestions.heading")}</h2>
      {suggestions.length === 0 ? (
        <div className="candidates__empty">
          <span className="candidates__empty-icon" aria-hidden="true">
            <MessageSquarePlus />
          </span>
          <div className="candidates__empty-text">
            <p>{t("admin.suggestions.empty")}</p>
          </div>
        </div>
      ) : (
        <ul className="candidates__list">
          {suggestions.map((item) => (
            <li key={item.id} className="admin-row candidate">
              <div className="candidate__head">
                <strong className="candidate__title">
                  <span lang="en">{TITLES_BY_ID[item.titleId]?.name ?? item.titleId}</span>
                  {" · "}
                  {t(SECTION_KEYS[item.section])}
                </strong>
                {item.isDone ? (
                  <span className="admin-pill admin-pill--ok">
                    <Check aria-hidden />
                    {t("admin.suggestions.done", {
                      date: formatDate(item.resolvedAt ?? item.createdAt),
                    })}
                  </span>
                ) : (
                  <span className="admin-pill admin-pill--late">{t("admin.suggestions.new")}</span>
                )}
              </div>
              <p className="admin-note candidate__meta">
                {t("admin.suggestions.from", { name: item.authorName })}
                {" · "}
                {formatDate(item.createdAt)}
              </p>
              {item.item && (
                <p className="admin-note">{t("admin.suggestions.item", { item: item.item })}</p>
              )}
              <p className="suggestion__text">{item.text}</p>
              <div className="candidate__actions">
                <a className="btn btn--soft" href={titlePath(item.titleId)}>
                  {t("admin.suggestions.openTitle")}
                  <ExternalLink aria-hidden />
                </a>
                {!item.isDone && (
                  <button
                    type="button"
                    className="btn btn--primary"
                    onClick={() => void onHandle(item.id, "done")}
                  >
                    <Check aria-hidden />
                    {t("admin.suggestions.markDone")}
                  </button>
                )}
                <button
                  type="button"
                  className="btn btn--text"
                  onClick={() => void onHandle(item.id, "discard")}
                >
                  {t("admin.suggestions.discard")}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
