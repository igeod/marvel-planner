import { Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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
  const clearRef = useRef<HTMLElement>(null);
  const shouldMoveFocus = useRef(false);

  // The pressed button disappears, so focus goes to the first button of the new state
  // ("Cancel" in the confirmation, the delete button after cancelling).
  useEffect(() => {
    if (!shouldMoveFocus.current) return;
    shouldMoveFocus.current = false;
    clearRef.current?.querySelector("button")?.focus();
  }, [isConfirming]);

  const toggleConfirm = (value: boolean) => {
    shouldMoveFocus.current = true;
    setIsConfirming(value);
  };

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
      <section className="privacy-section" aria-labelledby="privacy-consent">
        <h3 id="privacy-consent">{t("cookiePage.noBannerHeading")}</h3>
        <p>{t("cookiePage.noBannerBody")}</p>
      </section>

      <section className="privacy-section" aria-labelledby="privacy-stored">
        <h3 id="privacy-stored">{t("cookiePage.tableCaption")}</h3>
        <StorageTable />
      </section>

      <section className="privacy-section" ref={clearRef} aria-labelledby="privacy-clear">
        <h3 id="privacy-clear">{t("privacySettings.clearHeading")}</h3>
        <p>{t("privacySettings.clearBody")}</p>
        {isConfirming ? (
          <div className="privacy-confirm">
            <p role="alert">{t("privacySettings.clearQuestion")}</p>
            <div className="dialog__actions">
              <Button variant="soft" onClick={() => toggleConfirm(false)}>
                {t("common.cancel")}
              </Button>
              <Button variant="danger" onClick={clearAndReload}>
                {t("privacySettings.clearConfirm")}
              </Button>
            </div>
          </div>
        ) : (
          <div className="dialog__actions">
            <Button
              variant="soft"
              icon={<Trash2 aria-hidden />}
              onClick={() => toggleConfirm(true)}
            >
              {t("privacySettings.clearButton")}
            </Button>
          </div>
        )}
      </section>
    </Modal>
  );
}
