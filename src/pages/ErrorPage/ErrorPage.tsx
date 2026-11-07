import { RotateCcw } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useLocation, useRouteError } from "react-router";
import { PATHS } from "../../app/paths";
import errArt from "../../assets/err-500.webp";
import { Button, buttonClass } from "../../components/ui/Button";
import { ErrorCode } from "../../components/ui/ErrorCode";
import { StatusPage } from "../../components/ui/StatusPage";
import { errorCode } from "../../lib/errorCode";
import { useI18n } from "../../i18n/useI18n";
import { usePageTitle } from "../../i18n/usePageTitle";

export function ErrorPage({ standalone = false }: { standalone?: boolean }) {
  const { t } = useI18n();
  usePageTitle("error.title");
  const error = useRouteError();
  const { pathname } = useLocation();
  const code = useMemo(() => errorCode(error, pathname), [error, pathname]);

  useEffect(() => {
    console.error(code, pathname, error);
  }, [code, pathname, error]);

  const page = (
    <StatusPage
      art={errArt}
      title={t("error.title")}
      autoFocusTitle
      extra={<ErrorCode code={code} />}
      actions={
        <>
          <Button
            variant="primary"
            size="lg"
            icon={<RotateCcw aria-hidden />}
            onClick={() => window.location.reload()}
          >
            {t("common.retry")}
          </Button>
          {/* A full reload on purpose: it leaves a broken state behind. */}
          {!standalone && (
            <a href={PATHS.home} className={buttonClass("soft", "lg")}>
              {t("error.home")}
            </a>
          )}
        </>
      }
    >
      {t("error.body")}
    </StatusPage>
  );

  return standalone ? <main className="status-screen">{page}</main> : page;
}
