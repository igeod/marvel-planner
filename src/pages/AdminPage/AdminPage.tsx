import { AdminDashboard } from "../../features/admin/components/AdminDashboard/AdminDashboard";
import { useSiteStatus } from "../../features/site/hooks/useSiteStatus";
import { useI18n } from "../../i18n/useI18n";
import { usePageTitle } from "../../i18n/usePageTitle";
import { NotFoundPage } from "../NotFoundPage/NotFoundPage";

export function AdminPage() {
  usePageTitle("admin.title");
  const { t } = useI18n();
  const { isAdmin, isLoading } = useSiteStatus();

  if (isLoading) return <p role="status">{t("common.loading")}</p>;
  if (!isAdmin) return <NotFoundPage />;
  return <AdminDashboard />;
}
