import type { ReactNode } from "react";
import type { TitleDetails } from "../../../../../shared/titleDetails";
import { useI18n } from "../../../../i18n/useI18n";
import { useTitleDetails } from "../../hooks/useTitleDetails";

interface WithTitleDetailsProps {
  titleId: string;
  children: (details: TitleDetails) => ReactNode;
}

export function WithTitleDetails({ titleId, children }: WithTitleDetailsProps) {
  const { t } = useI18n();
  const state = useTitleDetails(titleId);

  if (state.status === "loading") {
    return (
      <div className="details-skeleton" role="status" aria-busy="true">
        <span className="visually-hidden">{t("details.loading")}</span>
        <span className="skeleton" aria-hidden="true" />
        <span className="skeleton" aria-hidden="true" />
        <span className="skeleton details-skeleton__short" aria-hidden="true" />
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="load-error" role="alert">
        <p>{t("details.error")}</p>
        <button type="button" className="btn btn--accent" onClick={state.retry}>
          {t("common.retry")}
        </button>
      </div>
    );
  }

  return <>{children(state.details)}</>;
}
