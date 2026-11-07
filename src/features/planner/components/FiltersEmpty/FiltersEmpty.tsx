import { Button } from "../../../../components/ui/Button";
import { useI18n } from "../../../../i18n/useI18n";

// The filters left nothing on the list: say so once, with the way out, instead of one line per phase.
export function FiltersEmpty({ onReset }: { onReset: () => void }) {
  const { t } = useI18n();

  return (
    <div className="planner-search__empty card">
      <p role="status">
        <strong>{t("planner.empty.title")}</strong>
      </p>
      <p className="muted">{t("planner.empty.body")}</p>
      <Button variant="soft" onClick={onReset}>
        {t("planner.filters.clear")}
      </Button>
    </div>
  );
}
