import { useEffect, useMemo, useState } from "react";
import { Chevron } from "../../../../components/ui/Chevron";
import { useI18n } from "../../../../i18n/useI18n";
import { MEDIA_TYPE_KEYS } from "../../../planner/data/labels";
import { useResolvedCatalog } from "../../../planner/hooks/useResolvedCatalog";
import { apiProgressRepository } from "../../../planner/services/apiProgressRepository";
import type { Progress } from "../../../planner/types";
import { computeStats } from "../../utils/stats";

type State =
  { status: "loading" } | { status: "error" } | { status: "ready"; watched: Set<string> };

function useAccountProgress(): State {
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    let isActive = true;
    apiProgressRepository
      .load()
      .then((ids) => isActive && setState({ status: "ready", watched: new Set(ids) }))
      .catch(() => isActive && setState({ status: "error" }));
    return () => {
      isActive = false;
    };
  }, []);

  return state;
}

interface GroupProps {
  title: string;
  rows: { key: string; name: string; progress: Progress }[];
  isOpen?: boolean;
}

function ProgressGroup({ title, rows, isOpen }: GroupProps) {
  const { t } = useI18n();
  const sum = rows.reduce(
    (total, row) => ({
      done: total.done + row.progress.done,
      total: total.total + row.progress.total,
    }),
    { done: 0, total: 0 },
  );

  return (
    <details className="progress-group" open={isOpen}>
      <summary className="progress-group__summary">
        <span>{title}</span>
        <span className="progress-group__sum">{t("common.ofCount", sum)}</span>
        <Chevron />
      </summary>
      <ul className="progress-group__rows">
        {rows.map(({ key, name, progress }) => (
          <li
            key={key}
            className={`progress-row${progress.done === progress.total ? " progress-row--done" : ""}`}
          >
            <span className="progress-row__head">
              <span>{name}</span>
              <span>{t("common.ofCount", { done: progress.done, total: progress.total })}</span>
            </span>
            <span className="progress-row__bar" aria-hidden="true">
              <span style={{ width: `${(progress.done / Math.max(progress.total, 1)) * 100}%` }} />
            </span>
          </li>
        ))}
      </ul>
    </details>
  );
}

export function ProgressStatsSection() {
  const { t } = useI18n();
  const catalog = useResolvedCatalog();
  const state = useAccountProgress();
  const stats = useMemo(
    () => (state.status === "ready" ? computeStats(catalog, state.watched) : null),
    [catalog, state],
  );

  if (state.status === "loading") return <p role="status">{t("common.loading")}</p>;
  if (state.status === "error") return <p role="alert">{t("account.stats.error")}</p>;
  if (!stats) return null;

  const { done, total } = stats.overall;
  const percent = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <section className="progress-stats">
      <div className="progress-total">
        <div className="progress-total__row">
          <div>
            <p className="progress-total__label">{t("account.stats.watched")}</p>
            <p className="progress-total__count">
              {done}
              <span> / {total}</span>
            </p>
          </div>
          <p className="progress-total__percent">{percent}%</p>
        </div>
        <div
          className="progress-total__bar"
          role="progressbar"
          aria-label={t("account.stats.watched")}
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <span style={{ width: `${percent}%` }} />
        </div>
      </div>

      <ProgressGroup
        isOpen
        title={t("account.stats.byPhase")}
        rows={stats.byPhase.map(({ number, ...progress }) => ({
          key: String(number),
          name: `${number} · ${t(`catalog.phases.${number}`)}`,
          progress,
        }))}
      />
      <ProgressGroup
        title={t("account.stats.byType")}
        rows={stats.byType.map(({ type, ...progress }) => ({
          key: type,
          name: t(MEDIA_TYPE_KEYS[type]),
          progress,
        }))}
      />
      <ProgressGroup
        title={t("account.stats.byYear")}
        rows={stats.byYear.map(({ year, ...progress }) => ({ key: year, name: year, progress }))}
      />
    </section>
  );
}
