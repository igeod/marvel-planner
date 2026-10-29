import { Search, X } from "lucide-react";
import { useId, useMemo, useState } from "react";
import { Link } from "react-router";
import { titlePath } from "../../../../app/paths";
import { useI18n } from "../../../../i18n/useI18n";
import { MEDIA_TYPE_KEYS } from "../../data/labels";
import { useResolvedCatalog } from "../../hooks/useResolvedCatalog";
import { flattenTitles } from "../../utils/filters";
import { formatRelease } from "../../utils/format";

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

// Searches the whole catalog on purpose: filters and watched state do not apply.
export function PlannerSearch() {
  const i18n = useI18n();
  const { t } = i18n;
  const catalog = useResolvedCatalog();
  const [query, setQuery] = useState("");
  const inputId = useId();
  const needle = normalize(query);

  const results = useMemo(
    () =>
      needle
        ? flattenTitles(catalog).filter((title) => normalize(title.name).includes(needle))
        : [],
    [catalog, needle],
  );

  return (
    <div className="planner-search">
      <label className="planner-search__field" htmlFor={inputId}>
        <Search aria-hidden />
        <span className="visually-hidden">{t("planner.search.label")}</span>
        <input
          id={inputId}
          type="search"
          autoComplete="off"
          spellCheck={false}
          placeholder={t("planner.search.placeholder")}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Escape") setQuery("");
          }}
        />
        {query && (
          <button
            type="button"
            className="planner-search__clear"
            aria-label={t("planner.search.clear")}
            onClick={() => setQuery("")}
          >
            <X aria-hidden />
          </button>
        )}
      </label>
      {needle && (
        <div className="planner-search__panel card">
          <p className="muted" role="status">
            {results.length > 0
              ? t("planner.search.results", { count: results.length })
              : t("planner.search.none")}
          </p>
          {results.length > 0 && (
            <ul
              className="planner-search__list scroll-y"
              role="region"
              tabIndex={0}
              aria-label={t("planner.search.label")}
            >
              {results.map((title) => (
                <li key={title.id}>
                  <Link to={titlePath(title.id)}>
                    <span lang="en" className="planner-search__name">
                      {title.name}
                    </span>
                    <span className="muted">
                      {[t(MEDIA_TYPE_KEYS[title.type]), formatRelease(title.release, i18n)]
                        .filter(Boolean)
                        .join(", ")}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
