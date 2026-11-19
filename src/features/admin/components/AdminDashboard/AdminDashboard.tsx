import { useEffect, useRef } from "react";
import { useLocation } from "react-router";
import { LoadError } from "../../../../components/ui/LoadError/LoadError";
import { useI18n } from "../../../../i18n/useI18n";
import { useMemo } from "react";
import { CATALOG } from "../../../planner/data/catalog";
import { todayIso } from "../../../planner/utils/releases";
import { useAdminOverview } from "../../hooks/useAdminOverview";
import { buildAdminTitles } from "../../utils/adminTitles";
import { ContentTodoSection } from "../ContentTodoSection/ContentTodoSection";
import { SuggestionsSection } from "../SuggestionsSection/SuggestionsSection";
import { ReleaseDatesSection } from "../ReleaseDatesSection/ReleaseDatesSection";
import { AutomationSection } from "../AutomationSection/AutomationSection";
import { CandidatesSection } from "../CandidatesSection/CandidatesSection";
import { MaintenanceSection } from "../MaintenanceSection/MaintenanceSection";
import { UsersSection } from "../UsersSection/UsersSection";

function AdminSkeleton() {
  const { t } = useI18n();
  const titles = [
    "admin.todo.heading",
    "admin.dates.heading",
    "admin.suggestions.heading",
    "admin.maintenance.heading",
    "admin.automation.heading",
    "admin.users.heading",
    "admin.heading",
  ] as const;

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
          <MaintenanceSection isOn={state.overview.maintenance} onChange={toggleMaintenance} />
          <AutomationSection
            lastRuns={state.overview.lastRuns}
            tmdbConfigured={state.overview.tmdbConfigured}
          />
          <UsersSection users={state.overview.users} />
        </>
      )}
    </div>
  );
}
