import { Check, TriangleAlert } from "lucide-react";
import { useId, useState } from "react";
import { ConfirmDialog } from "../../../../components/ui/ConfirmDialog";
import { useI18n } from "../../../../i18n/useI18n";
import { useSiteStatus } from "../../../site/hooks/useSiteStatus";

interface MaintenanceSectionProps {
  isOn: boolean;
  onChange: (enabled: boolean) => void;
}

export function MaintenanceSection({ isOn, onChange }: MaintenanceSectionProps) {
  const { t } = useI18n();
  const { refresh } = useSiteStatus();
  const [isConfirming, setIsConfirming] = useState(false);
  const headingId = useId();

  const apply = (enabled: boolean) => {
    setIsConfirming(false);
    onChange(enabled);
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
          <p className="muted">{t("admin.maintenance.description")}</p>
        </div>
        <button
          type="button"
          className={`btn ${isOn ? "btn--primary" : "btn--soft"}`}
          onClick={() => (isOn ? apply(false) : setIsConfirming(true))}
        >
          {isOn ? t("admin.maintenance.disable") : t("admin.maintenance.enable")}
        </button>
      </div>

      <ConfirmDialog
        isOpen={isConfirming}
        title={t("admin.maintenance.confirmTitle")}
        message={t("admin.maintenance.confirmMessage")}
        confirmLabel={t("admin.maintenance.enable")}
        cancelLabel={t("common.cancel")}
        onConfirm={() => apply(true)}
        onCancel={() => setIsConfirming(false)}
      />
    </section>
  );
}
