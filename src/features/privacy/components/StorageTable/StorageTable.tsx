import { useI18n } from "../../../../i18n/useI18n";
import { STORAGE_INVENTORY } from "../../data/storageInventory";

export function StorageTable() {
  const { t } = useI18n();

  return (
    // Scrolls sideways where the four columns do not fit (phones narrower than ~420px), instead of
    // being cut off by the dialog. Focusable so the keyboard can scroll it.
    <div
      className="storage-table__scroll scroll-x"
      role="region"
      aria-label={t("cookiePage.tableCaption")}
      tabIndex={0}
    >
      <table className="storage-table">
        <caption>{t("cookiePage.tableCaption")}</caption>
        <thead>
          <tr>
            <th scope="col">{t("cookiePage.columns.name")}</th>
            <th scope="col">{t("cookiePage.columns.kind")}</th>
            <th scope="col">{t("cookiePage.columns.purpose")}</th>
            <th scope="col">{t("cookiePage.columns.duration")}</th>
          </tr>
        </thead>
        <tbody>
          {STORAGE_INVENTORY.map((item) => (
            <tr key={item.id}>
              <th scope="row">
                <code>{item.name}</code>
              </th>
              <td>{t(`cookiePage.${item.id}.kind`)}</td>
              <td>{t(`cookiePage.${item.id}.purpose`)}</td>
              <td>{t(`cookiePage.${item.id}.duration`)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
