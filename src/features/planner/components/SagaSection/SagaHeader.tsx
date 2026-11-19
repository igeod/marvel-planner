import type { ReactNode } from "react";
import { useI18n } from "../../../../i18n/useI18n";
import type { Progress } from "../../types";

interface SagaHeaderProps {
  headingId: string;
  title: string;
  progress: Progress;
  // A small line under the title (the source of an order, or what a section is): the saga has none.
  note?: ReactNode;
}

// The title of a section of the list with its count: used by the sagas and by the chronological order.
export function SagaHeader({ headingId, title, progress, note }: SagaHeaderProps) {
  const { t } = useI18n();

  return (
    <div className="saga__head">
      <div className="saga__header">
        <h2 id={headingId} className="saga__title">
          {title}
        </h2>
        <p className="saga__count muted">
          {t("planner.watchedCount", { done: progress.done, total: progress.total })}
        </p>
      </div>
      {note && <p className="saga__source muted">{note}</p>}
    </div>
  );
}
