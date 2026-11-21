import { useI18n } from "../../../../i18n/useI18n";
import { STORAGE_INVENTORY } from "../../data/storageInventory";

export function StorageTable() {
  const { t } = useI18n();

  return (
    <ul className="storage-list" aria-labelledby="privacy-stored">
      {STORAGE_INVENTORY.map((item) => (
        <li key={item.id} className="storage-card">
          <code className="storage-card__name">{item.name}</code>
          <p>{t(`cookiePage.${item.id}.purpose`)}</p>
          <dl>
            <div>
              <dt>{t("cookiePage.columns.kind")}</dt>
              <dd>{t(`cookiePage.${item.id}.kind`)}</dd>
            </div>
            <div>
              <dt>{t("cookiePage.columns.duration")}</dt>
              <dd>{t(`cookiePage.${item.id}.duration`)}</dd>
            </div>
          </dl>
        </li>
      ))}
    </ul>
  );
}
