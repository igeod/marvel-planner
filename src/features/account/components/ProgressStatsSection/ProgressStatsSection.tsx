import { RotateCw, Share2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "../../../../components/ui/Button";
import { Chevron } from "../../../../components/ui/Chevron";
import { useI18n } from "../../../../i18n/useI18n";
import { MEDIA_TYPE_KEYS } from "../../../planner/data/labels";
import { useResolvedCatalog } from "../../../planner/hooks/useResolvedCatalog";
import { apiProgressRepository } from "../../../planner/services/apiProgressRepository";
import type { Progress } from "../../../planner/types";
import { ShareDialog } from "../../../share/components/ShareDialog";
import { computeStats } from "../../utils/stats";

type State =
  { status: "loading" } | { status: "error" } | { status: "ready"; watched: Set<string> };

function useAccountProgress(): [State, () => void] {
  const [state, setState] = useState<State>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);
  const retry = useCallback(() => {
    setState({ status: "loading" });
    setAttempt((count) => count + 1);
  }, []);

  useEffect(() => {
    let isActive = true;
    apiProgressRepository
      .load()
      .then((ids) => isActive && setState({ status: "ready", watched: new Set(ids) }))
      .catch(() => isActive && setState({ status: "error" }));
    return () => {
      isActive = false;
    };
  }, [attempt]);

  return [state, retry];
}

interface GroupProps {
  title: string;
  rows: { key: string; name: string; progress: Progress }[];
  isOpen?: boolean;
  className?: string;
}

function ProgressSkeleton() {
  const { t } = useI18n();

  return (
    <section className="progress-stats" aria-busy="true">
      <p className="visually-hidden" role="status">
        {t("account.stats.loading")}
      </p>
      <div className="progress-skeleton__card" aria-hidden="true" />
      {[0, 1, 2].map((group) => (
        <div key={group} className="progress-skeleton__group" aria-hidden="true" />
      ))}
    </section>
  );
}

function ProgressGroup({ title, rows, isOpen, className }: GroupProps) {
  const { t } = useI18n();
  const sum = rows.reduce(
    (total, row) => ({
      done: total.done + row.progress.done,
      total: total.total + row.progress.total,
    }),
    { done: 0, total: 0 },
  );

  return (
    <details className={`progress-group${className ? ` ${className}` : ""}`} open={isOpen}>
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
  const [state, retry] = useAccountProgress();
  const [isShareOpen, setIsShareOpen] = useState(false);
  const stats = useMemo(
    () => (state.status === "ready" ? computeStats(catalog, state.watched) : null),
    [catalog, state],
  );

  if (state.status === "loading") return <ProgressSkeleton />;
  if (state.status === "error") {
    return (
      <section className="progress-state" role="alert">
        <p>{t("account.stats.error")}</p>
        <Button variant="soft" icon={<RotateCw aria-hidden />} onClick={retry}>
          {t("common.retry")}
        </Button>
      </section>
    );
  }
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
        <Button
          variant="ink"
          size="lg"
          className="progress-total__share"
          icon={<Share2 aria-hidden />}
          onClick={() => setIsShareOpen(true)}
        >
          {t("account.stats.share")}
        </Button>
        <ShareDialog
          isOpen={isShareOpen}
          progress={stats.overall}
          onClose={() => setIsShareOpen(false)}
        />
      </div>

      {done === 0 && <p role="status">{t("account.stats.empty")}</p>}

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
        className="progress-group--year"
        title={t("account.stats.byYear")}
        rows={stats.byYear.map(({ year, ...progress }) => ({ key: year, name: year, progress }))}
      />
    </section>
  );
}
