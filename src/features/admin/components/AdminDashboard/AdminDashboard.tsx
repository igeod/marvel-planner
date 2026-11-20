import { Check, ChevronRight } from "lucide-react";
import { useEffect, useRef } from "react";
import { useLocation } from "react-router";
import { LoadError } from "../../../../components/ui/LoadError/LoadError";
import { useI18n } from "../../../../i18n/useI18n";
import { useMemo } from "react";
import { CATALOG } from "../../../planner/data/catalog";
import { todayIso } from "../../../planner/utils/releases";
import { useAdminOverview } from "../../hooks/useAdminOverview";
import { buildAdminTitles, filterTodoTitles, titlesWithDates } from "../../utils/adminTitles";
import { ContentTodoSection } from "../ContentTodoSection/ContentTodoSection";
import { SuggestionsSection } from "../SuggestionsSection/SuggestionsSection";
import { ReleaseDatesSection } from "../ReleaseDatesSection/ReleaseDatesSection";
import { CandidatesSection } from "../CandidatesSection/CandidatesSection";
import { SiteStatus } from "../SiteStatus/SiteStatus";

interface TodoRowProps {
  href: string;
  label: string;
  count: number;
}

// A line of "To do": the number, or a tick (with its words for screen readers) when there is nothing.
function TodoRow({ href, label, count }: TodoRowProps) {
  const { t } = useI18n();
  return (
    <a className="admin-todo-row" href={href}>
      <span className="admin-todo-row__label">{label}</span>
      {count === 0 ? (
        <>
          <Check aria-hidden />
          <span className="visually-hidden">{t("admin.summary.none")}</span>
        </>
      ) : (
        <strong>{count}</strong>
      )}
      <ChevronRight aria-hidden />
    </a>
  );
}

function AdminSkeleton() {
  const { t } = useI18n();
  const titles = ["admin.summary.heading", "admin.maintenance.heading"] as const;

  return titles.map((key) => (
    <section key={key} aria-busy="true">
      <h2>{t(key)}</h2>
      <div className="admin-skeleton" />
      <div className="admin-skeleton" />
    </section>
  ));
}

export function AdminDashboard() {
  const { t } = useI18n();
  const { hash } = useLocation();
  const {
    state,
    hasActionFailed,
    toggleMaintenance,
    dismiss,
    markCopied,
    verify,
    reviewGuide,
    setDate,
    clearDate,
    keepDate,
    handleSuggestion,
    reload,
  } = useAdminOverview();
  const overview = state.status === "ready" ? state.overview : null;
  const titles = useMemo(
    () =>
      overview ? buildAdminTitles(CATALOG, overview.releases, overview.reviews, todayIso()) : [],
    [overview],
  );
  const titleRef = useRef<HTMLHeadingElement>(null);
  const wantsCandidates = hash === "#candidati";

  useEffect(() => {
    if (!wantsCandidates) titleRef.current?.focus();
  }, [wantsCandidates]);

  return (
    <div className="admin">
      <h1 id="admin-title" tabIndex={-1} ref={titleRef}>
        {t("admin.title")}
      </h1>

      {state.status === "loading" && <AdminSkeleton />}
      {state.status === "error" && <LoadError onRetry={reload} />}
      {hasActionFailed && <p role="alert">{t("admin.actionError")}</p>}

      {state.status === "ready" && (
        <>
          <div className="admin__top">
            <section aria-labelledby="admin-summary">
              <h2 id="admin-summary">{t("admin.summary.heading")}</h2>
              <nav className="admin__todo" aria-labelledby="admin-summary">
                <TodoRow
                  href="#candidati"
                  label={t("admin.summary.candidates")}
                  count={state.overview.candidates.length}
                />
                <TodoRow
                  href="#da-completare"
                  label={t("admin.todo.heading")}
                  count={filterTodoTitles(titles, "todo").length}
                />
                <TodoRow
                  href="#date"
                  label={t("admin.summary.dates")}
                  count={titlesWithDates(titles).length}
                />
                <TodoRow
                  href="#suggerimenti"
                  label={t("admin.summary.suggestions")}
                  count={state.overview.suggestions.length}
                />
              </nav>
            </section>
            <SiteStatus overview={state.overview} onChangeMaintenance={toggleMaintenance} />
          </div>
          <div className="admin__queues">
            <CandidatesSection
              candidates={state.overview.candidates}
              onDismiss={(key) => void dismiss(key)}
              onCopied={(key) => void markCopied(key)}
              tmdbConfigured={state.overview.tmdbConfigured}
              weeklyRun={state.overview.lastRuns.weekly}
            />
            <ContentTodoSection titles={titles} onVerify={verify} onReviewGuide={reviewGuide} />
            <ReleaseDatesSection
              titles={titles}
              setDate={setDate}
              clearDate={clearDate}
              keepDate={keepDate}
            />
            <SuggestionsSection
              suggestions={overview?.suggestions ?? []}
              onHandle={handleSuggestion}
            />
          </div>
        </>
      )}
    </div>
  );
}
