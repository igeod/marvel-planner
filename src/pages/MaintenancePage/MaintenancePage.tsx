import { LogIn } from "lucide-react";
import errArt from "../../assets/err-maintenance.webp";
import { Button } from "../../components/ui/Button/Button";
import { StatusPage } from "../../components/ui/StatusPage/StatusPage";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { useAuthDialog } from "../../features/auth/hooks/useAuthDialog";
import { useI18n } from "../../i18n/useI18n";
import { usePageTitle } from "../../i18n/usePageTitle";

export function MaintenancePage() {
  usePageTitle("maintenance.title");
  const { t } = useI18n();
  const { user } = useAuth();
  const { open } = useAuthDialog();

  return (
    <main className="status-screen">
      <StatusPage
        art={errArt}
        title={t("maintenance.title")}
        actions={
          !user && (
            <Button
              variant="soft"
              size="lg"
              icon={<LogIn aria-hidden />}
              aria-haspopup="dialog"
              onClick={() => open("login")}
            >
              {t("maintenance.adminLogin")}
            </Button>
          )
        }
      >
        {t("maintenance.body")}
      </StatusPage>
    </main>
  );
}
