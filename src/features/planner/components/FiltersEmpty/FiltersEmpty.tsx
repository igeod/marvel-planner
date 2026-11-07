import { FilterX } from "lucide-react";
import { Button } from "../../../../components/ui/Button";
import { StateBox } from "../../../../components/ui/StateBox";
import { useI18n } from "../../../../i18n/useI18n";

// The filters left nothing on the list: say so once, with the way out, instead of one line per phase.
export function FiltersEmpty({ onReset }: { onReset: () => void }) {
  const { t } = useI18n();

  return (
    <StateBox
      art={<FilterX strokeWidth={1.5} />}
      title={t("planner.empty.filters.title")}
      actions={
        <Button variant="soft" icon={<FilterX aria-hidden />} onClick={onReset}>
          {t("planner.filters.clear")}
        </Button>
      }
    >
      {t("planner.empty.filters.body")}
    </StateBox>
  );
}
