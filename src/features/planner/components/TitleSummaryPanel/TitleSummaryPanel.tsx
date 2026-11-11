import { useI18n } from "../../../../i18n/useI18n";
import { WithTitleDetails } from "../WithTitleDetails/WithTitleDetails";

interface TitleSummaryPanelProps {
  titleId: string;
}

export function TitleSummaryPanel({ titleId }: TitleSummaryPanelProps) {
  const { t } = useI18n();

  return (
    <WithTitleDetails titleId={titleId}>
      {(details) => <p className="title-summary">{details.synopsis || t("details.noSynopsis")}</p>}
    </WithTitleDetails>
  );
}
