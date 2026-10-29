import { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { PATHS } from "../../app/paths";
import { SITE } from "../../app/site";
import { useResolvedCatalog } from "../../features/planner/hooks/useResolvedCatalog";
import { TitleDetailsPanel } from "../../features/planner/components/TitleDetailsPanel";
import { flattenTitles } from "../../features/planner/utils/filters";
import { NotFoundPage } from "../NotFoundPage";

export function TitlePage() {
  const { id = "" } = useParams();
  const catalog = useResolvedCatalog();
  const navigate = useNavigate();
  const { key } = useLocation();
  const title = flattenTitles(catalog).find((candidate) => candidate.id === id);
  const name = title?.name;

  useEffect(() => {
    if (name) document.title = `${name} · ${SITE.name}`;
  }, [name]);

  if (!title) return <NotFoundPage />;

  // A fresh visit (no history inside the app) goes home instead of leaving the site.
  const goBack = () => (key === "default" ? navigate(PATHS.home) : navigate(-1));

  return <TitleDetailsPanel titleId={title.id} onBack={goBack} />;
}
