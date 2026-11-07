import { Search, SearchX, X } from "lucide-react";
import { useId, useRef } from "react";
import { Button } from "../../../../components/ui/Button";
import { StateBox } from "../../../../components/ui/StateBox";
import { useI18n } from "../../../../i18n/useI18n";

interface PlannerSearchProps {
  query: string;
  onQueryChange: (query: string) => void;
  // Titles left in the planner after the search, announced to assistive tech.
  resultCount: number;
}

// The query filters the planner lists themselves; there is no results panel.
export function PlannerSearch({ query, onQueryChange, resultCount }: PlannerSearchProps) {
  const { t } = useI18n();
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  const clear = () => {
    onQueryChange("");
    inputRef.current?.focus();
  };

  return (
    <form className="planner-search" role="search" onSubmit={(event) => event.preventDefault()}>
      <label className="planner-search__field" htmlFor={inputId}>
        <Search strokeWidth={2.4} aria-hidden />
        <input
          id={inputId}
          ref={inputRef}
          aria-label={t("planner.search.label")}
          enterKeyHint="search"
          type="search"
          autoComplete="off"
          spellCheck={false}
          placeholder={t("planner.search.placeholder")}
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key !== "Escape") return;
            if (query) onQueryChange("");
            else event.currentTarget.blur();
          }}
        />
        {query && (
          <button
            type="button"
            className="planner-search__clear"
            aria-label={t("planner.search.clear")}
            onClick={clear}
          >
            <X aria-hidden />
          </button>
        )}
      </label>
      <p className="visually-hidden" role="status">
        {query.trim() && t("planner.search.results", { count: resultCount })}
      </p>
    </form>
  );
}

interface SearchNoResultsProps {
  query: string;
  onClear: () => void;
}

export function SearchNoResults({ query, onClear }: SearchNoResultsProps) {
  const { t } = useI18n();

  return (
    <StateBox
      art={<SearchX strokeWidth={1.5} />}
      title={t("planner.empty.search.title", { q: query.trim() })}
      actions={
        <Button variant="soft" icon={<X aria-hidden />} onClick={onClear}>
          {t("planner.empty.search.action")}
        </Button>
      }
    >
      {t("planner.empty.search.body")}
    </StateBox>
  );
}
