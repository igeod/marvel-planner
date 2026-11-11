import { useParams } from "react-router";
import { CandidatesNotice } from "../../features/admin/components/CandidatesNotice/CandidatesNotice";
import { Planner } from "../../features/planner/components/Planner/Planner";
import { usePageTitle } from "../../i18n/usePageTitle";

export function PlannerPage() {
  usePageTitle("planner.title");
  const { code } = useParams();

  return (
    <>
      <CandidatesNotice />
      <Planner shareCode={code} />
    </>
  );
}
