import { X } from "lucide-react";
import { useId } from "react";
import { Button } from "../../../../components/ui/Button";
import { useI18n } from "../../../../i18n/useI18n";
import type { Filters, ViewOrder } from "../../types";
import { areDefaultFilters, DEFAULT_FILTERS } from "../../utils/filters";
import { FiltersFields } from "../FiltersFields";

interface PlannerFiltersProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
  viewOrder: ViewOrder;
  onViewOrderChange: (order: ViewOrder) => void;
  shown: number;
  total: number;
}

export function PlannerFilters({
  filters,
  onChange,
  viewOrder,
  onViewOrderChange,
  shown,
  total,
}: PlannerFiltersProps) {
  const { t } = useI18n();
  const headingId = useId();

  return (
    <section className="filters-card card" aria-labelledby={headingId}>
      <div className="filters-card__header">
        <h2 id={headingId} className="filters-card__title">
          {t("planner.filters.heading")}
        </h2>
        {!areDefaultFilters(filters) && (
          <Button
            variant="text"
            className="filters-card__clear"
            icon={<X aria-hidden />}
            onClick={() => onChange(DEFAULT_FILTERS)}
          >
            {t("planner.filters.remove")}
          </Button>
        )}
      </div>
      <FiltersFields
        filters={filters}
        onChange={onChange}
        viewOrder={viewOrder}
        onViewOrderChange={onViewOrderChange}
      />
      <p className="muted" role="status">
        {t("planner.filters.results", { shown, total })}
      </p>
    </section>
  );
}
