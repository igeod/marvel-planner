import { ListFilter, X } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Button } from "../../../../components/ui/Button";
import { useI18n } from "../../../../i18n/useI18n";
import type { Filters, ViewOrder } from "../../types";
import { areDefaultFilters, countActiveFilters, DEFAULT_FILTERS } from "../../utils/filters";
import { FiltersFields } from "../FiltersFields";

interface PlannerFiltersProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
  viewOrder: ViewOrder;
  onViewOrderChange: (order: ViewOrder) => void;
  shown: number;
  total: number;
}

const POPOVER_GAP = 8;

// Desktop filters: a button with a popover under it. Results update live, with no backdrop.
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
  const wrapRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const activeFilters = countActiveFilters(filters);

  const position = useCallback(() => {
    const anchor = wrapRef.current;
    const popover = popoverRef.current;
    if (!anchor || !popover) return;
    const rect = anchor.getBoundingClientRect();
    popover.style.top = `${rect.bottom + POPOVER_GAP}px`;
    popover.style.left = `${rect.left}px`;
    popover.style.width = `${rect.width}px`;
    popover.style.maxHeight = `${window.innerHeight - rect.bottom - POPOVER_GAP * 2}px`;
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    position();
    window.addEventListener("resize", position);
    window.addEventListener("scroll", position, true);
    return () => {
      window.removeEventListener("resize", position);
      window.removeEventListener("scroll", position, true);
    };
  }, [isOpen, position]);

  return (
    <div className="filters-popover-wrap" ref={wrapRef}>
      <Button
        variant="surface"
        size="lg"
        className="mobile-toolbar__filters"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        onClick={() => popoverRef.current?.togglePopover()}
      >
        <span className="mobile-toolbar__label">
          <ListFilter aria-hidden />
          {t("planner.filters.heading")}
          {activeFilters > 0 && (
            <span className="badge">
              {activeFilters}
              <span className="visually-hidden">
                {" "}
                {t("planner.filters.activeCount", { count: activeFilters })}
              </span>
            </span>
          )}
        </span>
        <span className="mobile-toolbar__count muted" aria-hidden="true">
          {t("planner.filters.resultsShort", { shown, total })}
        </span>
      </Button>
      <div
        ref={popoverRef}
        popover="auto"
        role="dialog"
        aria-labelledby={headingId}
        className="filters-popover card"
        onToggle={(event) => setIsOpen(event.newState === "open")}
      >
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
      </div>
    </div>
  );
}
