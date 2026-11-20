import { Check, CircleAlert, Clock, Minus } from "lucide-react";
import { useId, type ReactNode } from "react";
import type { AdminOverview, JobRun } from "../../../../../shared/admin";
import { useI18n } from "../../../../i18n/useI18n";
import { jobStatus, type JobState } from "../../utils/jobStatus";
import { MaintenanceSection } from "../MaintenanceSection/MaintenanceSection";

interface SiteStatusProps {
  overview: AdminOverview;
  onChangeMaintenance: (enabled: boolean) => Promise<boolean>;
}

const ICONS = { ok: Check, error: CircleAlert, late: Clock, never: Minus };

function StatusPill({ state, children }: { state: JobState; children: ReactNode }) {
  const Icon = ICONS[state];
  return (
    <span className={`admin-pill admin-pill--${state}`}>
      <Icon aria-hidden />
      {children}
    </span>
  );
}

// Maintenance, the two automatic jobs, the TMDB token and the members, in one card.
export function SiteStatus({ overview, onChangeMaintenance }: SiteStatusProps) {
  const { t, language, formatDate } = useI18n();
  const headingId = useId();
  const formatter = new Intl.DateTimeFormat(language, { dateStyle: "medium", timeStyle: "short" });
  const { lastRuns, tmdbConfigured, users } = overview;

  const label = (state: JobState) =>
    state === "never" ? t("admin.automation.never") : t(`admin.automation.status.${state}`);

  const job = (run: JobRun | null, kind: "daily" | "weekly") => {
    const state = jobStatus(run, kind);
    return (
      <div>
        <dt>{t(`admin.automation.${kind}Title`)}</dt>
        <dd>
          <StatusPill state={state}>{label(state)}</StatusPill>
          {run && <time dateTime={run.at}>{formatter.format(new Date(run.at))}</time>}
          {run?.status === "error" && run.error && (
            <span className="site-status__error">
              {t("admin.automation.error", { message: run.error })}
            </span>
          )}
        </dd>
      </div>
    );
  };

  return (
    <section aria-labelledby={headingId}>
      <h2 id={headingId}>{t("admin.maintenance.heading")}</h2>
      <MaintenanceSection isOn={overview.maintenance} onChange={onChangeMaintenance} />
      <dl className="admin-facts">
        {job(lastRuns.daily, "daily")}
        {job(lastRuns.weekly, "weekly")}
        <div>
          <dt>{t("admin.automation.tmdb")}</dt>
          <dd>
            <StatusPill state={tmdbConfigured ? "ok" : "error"}>
              {tmdbConfigured ? t("admin.automation.configured") : t("admin.automation.missing")}
            </StatusPill>
          </dd>
        </div>
        <div>
          <dt>{t("admin.users.total")}</dt>
          <dd>{users.total}</dd>
        </div>
        <div>
          <dt>{t("admin.users.newWeek")}</dt>
          <dd>{users.newLastWeek}</dd>
        </div>
        <div>
          <dt>{t("admin.users.deleted")}</dt>
          <dd>
            {users.deleted}
            {users.deletedSince && (
              <span className="admin-note">
                {t("admin.users.since", { date: formatDate(users.deletedSince) })}
              </span>
            )}
          </dd>
        </div>
      </dl>
    </section>
  );
}
