import { ListFilter } from "lucide-react";
import { Button } from "../../../../components/ui/Button";
import { useI18n } from "../../../../i18n/useI18n";
import { CollapseToggle } from "../CollapseToggle";

interface MobileToolbarProps {
  activeFilters: number;
  shown: number;
  total: number;
  canCollapse: boolean;
  areAllCollapsed: boolean;
  onOpenFilters: () => void;
  onToggleAll: () => void;
}

export function MobileToolbar({
  activeFilters,
  shown,
  total,
  canCollapse,
  areAllCollapsed,
  onOpenFilters,
  onToggleAll,
}: MobileToolbarProps) {
  const { t } = useI18n();

  return (
    <div className="mobile-toolbar">
      <p className="visually-hidden" role="status">
        {t("planner.filters.results", { shown, total })}
      </p>
      <Button
        variant="surface"
        size="lg"
        className="mobile-toolbar__filters"
        aria-haspopup="dialog"
        onClick={onOpenFilters}
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
      {canCollapse && (
        <CollapseToggle
          size="lg"
          iconOnly
          areAllCollapsed={areAllCollapsed}
          onToggleAll={onToggleAll}
        />
      )}
    </div>
  );
}
