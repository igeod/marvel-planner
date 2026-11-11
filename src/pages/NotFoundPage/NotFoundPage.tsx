import { Link } from "react-router";
import { PATHS } from "../../app/paths";
import errArt from "../../assets/err-404.webp";
import { buttonClass } from "../../components/ui/Button/buttonClass";
import { StatusPage } from "../../components/ui/StatusPage/StatusPage";
import { useI18n } from "../../i18n/useI18n";
import { usePageTitle } from "../../i18n/usePageTitle";

export function NotFoundPage() {
  usePageTitle("notFound.title");
  const { t } = useI18n();

  return (
    <StatusPage
      art={errArt}
      title={t("notFound.title")}
      actions={
        <Link to={PATHS.home} className={buttonClass("primary", "lg")}>
          {t("notFound.back")}
        </Link>
      }
    >
      {t("notFound.body")}
    </StatusPage>
  );
}
