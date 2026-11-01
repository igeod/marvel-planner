import { Check, CircleAlert, Clock, Minus } from "lucide-react";
import { useId, type ReactNode } from "react";
import type { AdminOverview, JobRun } from "../../../../../shared/admin";
import { useI18n } from "../../../../i18n/useI18n";
import { jobStatus, type JobState } from "../../utils/jobStatus";

interface AutomationSectionProps {
  lastRuns: AdminOverview["lastRuns"];
  tmdbConfigured: boolean;
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

export function AutomationSection({ lastRuns, tmdbConfigured }: AutomationSectionProps) {
  const { t, language } = useI18n();
  const headingId = useId();
  const formatter = new Intl.DateTimeFormat(language, { dateStyle: "medium", timeStyle: "short" });

  const label = (state: JobState) =>
    state === "never" ? t("admin.automation.never") : t(`admin.automation.status.${state}`);

  const job = (run: JobRun | null, kind: "daily" | "weekly") => {
    const state = jobStatus(run, kind);
    // The sentence puts the date where {date} is; the date itself becomes a <time> element.
    const [before, after] = t("admin.automation.lastRun", { date: "@@DATE@@" }).split("@@DATE@@");
    return (
      <div className="admin-row automation-section__job">
        <div className="automation-section__head">
          <h3>{t(`admin.automation.${kind}`)}</h3>
          <StatusPill state={state}>{label(state)}</StatusPill>
        </div>
        {run && (
          <p className="muted">
            {before}
            <time dateTime={run.at}>{formatter.format(new Date(run.at))}</time>
            {after}
          </p>
        )}
        {run?.status === "error" && run.error && (
          <p className="automation-section__error">
            {t("admin.automation.error", { message: run.error })}
          </p>
        )}
      </div>
    );
  };

  return (
    <section className="automation-section" aria-labelledby={headingId}>
      <h2 id={headingId}>{t("admin.automation.heading")}</h2>
      {job(lastRuns.daily, "daily")}
      {job(lastRuns.weekly, "weekly")}
      <div className="admin-row automation-section__job">
        <div className="automation-section__head">
          <h3>{t("admin.automation.tmdb")}</h3>
          <StatusPill state={tmdbConfigured ? "ok" : "error"}>
            {tmdbConfigured ? t("admin.automation.configured") : t("admin.automation.missing")}
          </StatusPill>
        </div>
      </div>
    </section>
  );
}
