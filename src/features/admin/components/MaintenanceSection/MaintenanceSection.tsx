import { Check, TriangleAlert } from "lucide-react";
import { useId, useState } from "react";
import { Button } from "../../../../components/ui/Button/Button";
import { ConfirmDialog } from "../../../../components/ui/ConfirmDialog/ConfirmDialog";
import { useI18n } from "../../../../i18n/useI18n";
import { useSiteStatus } from "../../../site/hooks/useSiteStatus";

interface MaintenanceSectionProps {
  isOn: boolean;
  onChange: (enabled: boolean) => Promise<boolean>;
}

export function MaintenanceSection({ isOn, onChange }: MaintenanceSectionProps) {
  const { t } = useI18n();
  const { refresh } = useSiteStatus();
  const [isConfirming, setIsConfirming] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [hasFailed, setHasFailed] = useState(false);
  const headingId = useId();

  // The dialog stays open while the request runs; if it fails it stays open with the error.
  const confirm = async () => {
    setIsPending(true);
    setHasFailed(false);
    const ok = await onChange(true);
    setIsPending(false);
    if (ok) {
      setIsConfirming(false);
      refresh();
    } else setHasFailed(true);
  };

  const disable = async () => {
    await onChange(false);
    refresh();
  };

  return (
    <section className="maintenance-section" aria-labelledby={headingId}>
      <h2 id={headingId}>{t("admin.maintenance.heading")}</h2>
      <div className="maintenance-section__row">
        <div className="maintenance-section__text">
          <p role="status">
            {isOn ? (
              <span className="admin-pill admin-pill--late">
                <TriangleAlert aria-hidden />
                {t("admin.maintenance.on")}
              </span>
            ) : (
              <span className="maintenance-section__online">
                <Check aria-hidden />
                {t("admin.maintenance.off")}
              </span>
            )}
          </p>
          <p className="admin-note">{t("admin.maintenance.description")}</p>
        </div>
        {/* Turning maintenance on stops the site: destructive, not a primary action. */}
        <Button
          variant={isOn ? "soft" : "danger"}
          aria-haspopup={isOn ? undefined : "dialog"}
          onClick={() => (isOn ? void disable() : setIsConfirming(true))}
        >
          {isOn ? t("admin.maintenance.disable") : t("admin.maintenance.enable")}
        </Button>
      </div>

      <ConfirmDialog
        isOpen={isConfirming}
        title={t("admin.maintenance.confirmTitle")}
        message={t("admin.maintenance.confirmMessage")}
        confirmLabel={t("admin.maintenance.enable")}
        cancelLabel={t("common.cancel")}
        tone="warning"
        icon={<TriangleAlert />}
        isPending={isPending}
        pendingLabel={t("admin.maintenance.confirmPending")}
        error={hasFailed ? t("admin.actionError") : undefined}
        onConfirm={() => void confirm()}
        onCancel={() => {
          setIsConfirming(false);
          setHasFailed(false);
        }}
      />
    </section>
  );
}
