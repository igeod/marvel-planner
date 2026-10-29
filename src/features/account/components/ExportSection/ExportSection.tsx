import { Download } from "lucide-react";
import { useId, useState } from "react";
import { Button } from "../../../../components/ui/Button";
import { useI18n } from "../../../../i18n/useI18n";

const EXPORT_FILE_NAME = "marvel-planner-data.json";

export function ExportSection() {
  const { t } = useI18n();
  const [isPending, setIsPending] = useState(false);
  const [hasFailed, setHasFailed] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const headingId = useId();

  const download = async () => {
    setHasFailed(false);
    setIsDone(false);
    setIsPending(true);
    try {
      const response = await fetch("/api/account/export", { credentials: "same-origin" });
      if (!response.ok) throw new Error(String(response.status));
      const url = URL.createObjectURL(await response.blob());
      const link = document.createElement("a");
      link.href = url;
      link.download = EXPORT_FILE_NAME;
      link.click();
      URL.revokeObjectURL(url);
      setIsDone(true);
    } catch {
      setHasFailed(true);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <section className="export-section" aria-labelledby={headingId}>
      <h3 id={headingId}>{t("account.export.heading")}</h3>
      <p>{t("account.export.description")}</p>
      {hasFailed && <p role="alert">{t("account.export.error")}</p>}
      {isDone && <p role="status">{t("account.export.done")}</p>}
      <Button
        variant="soft"
        icon={<Download aria-hidden />}
        isLoading={isPending}
        loadingLabel={t("account.export.pending")}
        onClick={download}
      >
        {t("account.export.button")}
      </Button>
    </section>
  );
}
