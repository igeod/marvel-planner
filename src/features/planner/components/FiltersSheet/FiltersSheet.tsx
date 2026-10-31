import { X } from "lucide-react";
import { useId, useRef, useState, type PointerEvent } from "react";
import { createPortal } from "react-dom";
import { Button } from "../../../../components/ui/Button";
import { useDialog } from "../../../../components/ui/useDialog";
import { useI18n } from "../../../../i18n/useI18n";
import type { Filters, ViewOrder } from "../../types";
import { areDefaultFilters, DEFAULT_FILTERS } from "../../utils/filters";
import { FiltersFields } from "../FiltersFields";

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

// Dragging the header down past this distance closes (discards) the sheet.
const DRAG_CLOSE_DISTANCE = 80;

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

  const drag = useRef<{ startY: number; dy: number; dialog: HTMLElement } | null>(null);

  // The sheet follows the finger with no transition; on release it closes or springs back in 180ms.
  const startDrag = (event: PointerEvent<HTMLElement>) => {
    const dialog = event.currentTarget.closest("dialog");
    if (!dialog || (event.target as HTMLElement).closest("button")) return;
    drag.current = { startY: event.clientY, dy: 0, dialog };
    event.currentTarget.setPointerCapture(event.pointerId);
    dialog.style.transition = "none";
  };
  const moveDrag = (event: PointerEvent<HTMLElement>) => {
    const current = drag.current;
    if (!current) return;
    current.dy = Math.max(0, event.clientY - current.startY);
    current.dialog.style.transform = `translateY(${current.dy}px)`;
  };
  const endDrag = () => {
    const current = drag.current;
    drag.current = null;
    if (!current) return;
    current.dialog.style.transition = "";
    current.dialog.style.transform = "";
    if (current.dy > DRAG_CLOSE_DISTANCE) onClose();
  };

  const apply = () => {
    onChange(draft);
    onViewOrderChange(draftOrder);
    onClose();
  };

  return (
    <div className="filters-sheet__body">
      <div
        className="filters-sheet__header"
        onPointerDown={startDrag}
        onPointerMove={moveDrag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
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
