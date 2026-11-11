import { Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "../../../../components/ui/Button/Button";
import { Modal } from "../../../../components/ui/Modal/Modal";
import { useI18n } from "../../../../i18n/useI18n";
import { clearDeviceData } from "../../../../lib/storage";
import { usePrivacySettings } from "../../hooks/usePrivacySettings";
import { StorageTable } from "../StorageTable/StorageTable";

export function PrivacySettingsDialog() {
  const { t } = useI18n();
  const { isOpen, close } = usePrivacySettings();
  const [isConfirming, setIsConfirming] = useState(false);

  const closeAndReset = () => {
    setIsConfirming(false);
    close();
  };

  const clearAndReload = () => {
    clearDeviceData();
    window.location.reload();
  };

  return (
    <Modal isOpen={isOpen} title={t("privacySettings.title")} onClose={closeAndReset}>
      <p>{t("privacySettings.intro")}</p>

      <section aria-labelledby="privacy-consent">
        <h3 id="privacy-consent">{t("cookiePage.noBannerHeading")}</h3>
        <p>{t("cookiePage.noBannerBody")}</p>
      </section>

      <section aria-labelledby="privacy-stored">
        <h3 id="privacy-stored">{t("cookiePage.intro")}</h3>
        <StorageTable />
      </section>

      <section aria-labelledby="privacy-manage">
        <h3 id="privacy-manage">{t("cookiePage.manageHeading")}</h3>
        <p>{t("cookiePage.manageBody")}</p>
      </section>

      <section aria-labelledby="privacy-clear">
        <h3 id="privacy-clear">{t("privacySettings.clearHeading")}</h3>
        <p>{t("privacySettings.clearBody")}</p>
        {isConfirming ? (
          <div className="privacy-confirm" role="alert">
            <p>{t("privacySettings.clearQuestion")}</p>
            <Button variant="soft" onClick={() => setIsConfirming(false)}>
              {t("common.cancel")}
            </Button>
            <Button variant="danger" onClick={clearAndReload}>
              {t("privacySettings.clearConfirm")}
            </Button>
          </div>
        ) : (
          <Button
            variant="soft"
            icon={<Trash2 aria-hidden />}
            onClick={() => setIsConfirming(true)}
          >
            {t("privacySettings.clearButton")}
          </Button>
        )}
      </section>
    </Modal>
  );
}
