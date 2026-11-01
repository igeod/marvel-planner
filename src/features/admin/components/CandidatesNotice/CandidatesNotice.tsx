import { TriangleAlert } from "lucide-react";
import { Link } from "react-router";
import { PATHS } from "../../../../app/paths";
import { useI18n } from "../../../../i18n/useI18n";
import { useSiteStatus } from "../../../site/hooks/useSiteStatus";
import { useAdminOverview } from "../../hooks/useAdminOverview";

function PendingCandidates() {
  const { t } = useI18n();
  const { state } = useAdminOverview();

  if (state.status !== "ready" || state.overview.candidates.length === 0) return null;

  return (
    <p className="candidates-notice" role="status">
      <TriangleAlert aria-hidden />
      {t("admin.notice", { count: state.overview.candidates.length })}{" "}
      <Link to={{ pathname: PATHS.admin, hash: "#candidati" }}>{t("admin.openDashboard")}</Link>
    </p>
  );
}

export function CandidatesNotice() {
  const { isAdmin } = useSiteStatus();
  return isAdmin ? <PendingCandidates /> : null;
}
