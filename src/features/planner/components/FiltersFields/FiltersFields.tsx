import { Choice, ChoiceGroup } from "../../../../components/ui/ChoiceGroup/ChoiceGroup";
import { Switch } from "../../../../components/ui/Switch/Switch";
import { useI18n } from "../../../../i18n/useI18n";
import { TYPE_FILTER_OPTIONS } from "../../data/labels";
import type { Filters, MediaType, ViewOrder } from "../../types";

function toggleType(types: MediaType[], type: MediaType, checked: boolean): MediaType[] {
  return checked ? [...types, type] : types.filter((current) => current !== type);
}

interface FiltersFieldsProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
  viewOrder: ViewOrder;
  onViewOrderChange: (order: ViewOrder) => void;
}

export function FiltersFields({
  filters,
  onChange,
  viewOrder,
  onViewOrderChange,
}: FiltersFieldsProps) {
  const { t } = useI18n();

  return (
    <div className="filters-fields">
      <ChoiceGroup legend={t("planner.order.heading")} columns={2}>
        <Choice
          type="radio"
          name="view-order"
          checked={viewOrder === "release"}
          onChange={() => onViewOrderChange("release")}
        >
          {t("planner.order.release")}
        </Choice>
        <Choice
          type="radio"
          name="view-order"
          checked={viewOrder === "chronological"}
          onChange={() => onViewOrderChange("chronological")}
        >
          {t("planner.order.chronological")}
        </Choice>
      </ChoiceGroup>

      <ChoiceGroup legend={t("planner.filters.type")} columns={3}>
        {TYPE_FILTER_OPTIONS.map((option) => (
          <Choice
            key={option.value}
            type="checkbox"
            checked={filters.types.includes(option.value)}
            onChange={() =>
              onChange({
                ...filters,
                types: toggleType(
                  filters.types,
                  option.value,
                  !filters.types.includes(option.value),
                ),
              })
            }
          >
            {t(option.labelKey)}
          </Choice>
        ))}
      </ChoiceGroup>

      <div className="filters-fields__switches">
        <Switch
          label={t("planner.filters.showAlternate")}
          checked={filters.showAlternate}
          onChange={(showAlternate) => onChange({ ...filters, showAlternate })}
        />
        <Switch
          label={t("planner.filters.showUpcoming")}
          checked={filters.showUpcoming}
          onChange={(showUpcoming) => onChange({ ...filters, showUpcoming })}
        />
      </div>
    </div>
  );
}
