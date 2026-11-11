import { X } from "lucide-react";
import { useCallback, useId, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "../../../../components/ui/Button/Button";
import { useDialog } from "../../../../components/ui/useDialog";
import { useSheetDrag } from "../../../../components/ui/useSheetDrag";
import { useI18n } from "../../../../i18n/useI18n";
import type { Filters, ViewOrder } from "../../types";
import { areDefaultFilters, DEFAULT_FILTERS } from "../../utils/filters";
import { FiltersFields } from "../FiltersFields/FiltersFields";

interface FiltersSheetProps {
  isOpen: boolean;
  onClose: () => void;
  filters: Filters;
  onChange: (filters: Filters) => void;
  viewOrder: ViewOrder;
  onViewOrderChange: (order: ViewOrder) => void;
  // Matches for a set of filters, so the Apply button can show the count before applying.
  countFor: (filters: Filters) => number;
}

export function FiltersSheet({
  isOpen,
  onClose,
  filters,
  onChange,
  viewOrder,
  onViewOrderChange,
  countFor,
}: FiltersSheetProps) {
  const dialogRef = useDialog(isOpen);
  const titleId = useId();
  // The sheet follows the finger from the header or from content scrolled to the top.
  useSheetDrag(
    useCallback(() => dialogRef.current, [dialogRef]),
    onClose,
    isOpen,
  );

  return createPortal(
    <dialog
      ref={dialogRef}
      className="filters-sheet"
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      {isOpen && (
        <FiltersSheetBody
          titleId={titleId}
          onClose={onClose}
          filters={filters}
          onChange={onChange}
          viewOrder={viewOrder}
          onViewOrderChange={onViewOrderChange}
          countFor={countFor}
        />
      )}
    </dialog>,
    document.body,
  );
}

interface FiltersSheetBodyProps extends Omit<FiltersSheetProps, "isOpen"> {
  titleId: string;
}

// Edits a draft: results change on Apply; the close button, Esc and the backdrop discard it.
function FiltersSheetBody({
  titleId,
  onClose,
  filters,
  onChange,
  viewOrder,
  onViewOrderChange,
  countFor,
}: FiltersSheetBodyProps) {
  const { t } = useI18n();
  const [draft, setDraft] = useState(filters);
  const [draftOrder, setDraftOrder] = useState(viewOrder);

  const apply = () => {
    onChange(draft);
    onViewOrderChange(draftOrder);
    onClose();
  };

  return (
    <div className="filters-sheet__body">
      <div className="filters-sheet__header">
        <h2 id={titleId} className="filters-sheet__title">
          {t("planner.filters.heading")}
        </h2>
        <Button
          variant="soft"
          icon={<X aria-hidden />}
          aria-label={t("common.close")}
          onClick={onClose}
        />
      </div>
      <FiltersFields
        filters={draft}
        onChange={setDraft}
        viewOrder={draftOrder}
        onViewOrderChange={setDraftOrder}
      />
      <div className="filters-sheet__actions">
        <Button
          variant="soft"
          size="lg"
          aria-disabled={areDefaultFilters(draft)}
          onClick={() => !areDefaultFilters(draft) && setDraft(DEFAULT_FILTERS)}
        >
          {t("planner.filters.clear")}
        </Button>
        <Button variant="primary" size="lg" onClick={apply}>
          {t("planner.filters.show", { count: countFor(draft) })}
        </Button>
      </div>
    </div>
  );
}
