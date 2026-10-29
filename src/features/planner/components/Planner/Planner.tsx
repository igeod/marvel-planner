import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { FOOTER_ID } from "../../../../app/dom";
import { PATHS } from "../../../../app/paths";
import { ConfirmDialog } from "../../../../components/ui/ConfirmDialog";
import { useIsDesktopWithReset } from "../../../../components/ui/useMediaQuery";
import { useI18n } from "../../../../i18n/useI18n";
import { STORAGE_KEYS } from "../../../../lib/storageKeys";
import { usePersistentState } from "../../../../lib/usePersistentState";
import { ImportSharedDialog, type ImportMode } from "../../../share/components/ImportSharedDialog";
import { ShareDialog } from "../../../share/components/ShareDialog";
import { useCollapsedPhases } from "../../hooks/useCollapsedPhases";
import { useFloatingProgressVisibility } from "../../hooks/useFloatingProgressVisibility";
import { useResolvedCatalog } from "../../hooks/useResolvedCatalog";
import { useWatched } from "../../hooks/useWatched";
import type { Title } from "../../types";
import {
  countActiveFilters,
  DEFAULT_FILTERS,
  filterCatalog,
  flattenTitles,
  isFilters,
  matchesFilters,
} from "../../utils/filters";
import { findNextTitle, findPhaseNumber } from "../../utils/nextTitle";
import { chronologicalTitles, isViewOrder, titlesInOrder } from "../../utils/order";
import { computeProgress } from "../../utils/progress";
import { buildPhaseStrip } from "../../utils/strip";
import { ChronologicalList } from "../ChronologicalList";
import { CompactProgress } from "../CompactProgress";
import { CollapseToggle } from "../CollapseToggle";
import { FiltersSheet } from "../FiltersSheet";
import { FloatingProgress } from "../FloatingProgress";
import { MobileToolbar } from "../MobileToolbar";
import { NextToWatch } from "../NextToWatch";
import { PhaseStrip } from "../PhaseStrip";
import { PlannerFilters } from "../PlannerFilters";
import { PlannerGuide } from "../PlannerGuide";
import { PlannerSearch } from "../PlannerSearch";
import { PlannerSummary } from "../PlannerSummary";
import { SagaSection } from "../SagaSection";

const BULK_STAGGER_MS = 600;

interface PlannerProps {
  shareCode?: string;
}

export function Planner({ shareCode }: PlannerProps) {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const isDesktop = useIsDesktopWithReset(() => setIsFiltersOpen(false));
  const [filters, setFilters] = usePersistentState(
    STORAGE_KEYS.filters,
    DEFAULT_FILTERS,
    isFilters,
  );
  const [viewOrder, setViewOrder] = usePersistentState(
    STORAGE_KEYS.viewOrder,
    "release",
    isViewOrder,
  );
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const previousListKeyRef = useRef<string | null>(null);
  const [isBulkToggle, setIsBulkToggle] = useState(false);

  const catalog = useResolvedCatalog();
  const sagas = useMemo(() => filterCatalog(catalog, filters), [catalog, filters]);
  const { watched, isLoading, error, storage, toggle, reset, importTitles } = useWatched();
  const { collapsed, areAllCollapsed, setPhaseCollapsed, toggleAll } = useCollapsedPhases();
  const { isPastProgress, isFooterVisible } = useFloatingProgressVisibility(progressRef, FOOTER_ID);

  const allTitles = flattenTitles(catalog);
  const overall = computeProgress(allTitles, watched);
  const shownCount = flattenTitles(sagas).length;
  const knownIds = useMemo(
    () => new Set(flattenTitles(catalog).map((title) => title.id)),
    [catalog],
  );
  const nextTitle = findNextTitle(titlesInOrder(catalog, viewOrder), watched);
  const strip = useMemo(
    () => buildPhaseStrip(catalog, watched, nextTitle?.id ?? null),
    [catalog, watched, nextTitle?.id],
  );
  const chronological = useMemo(() => {
    const { placed, unplaced } = chronologicalTitles(catalog);
    const isShown = (title: Title) => matchesFilters(title, filters);
    return { placed: placed.filter(isShown), unplaced: unplaced.filter(isShown) };
  }, [catalog, filters]);

  // Fades the new list in when filters or order really change (not when stored ones load).
  const listKey = `${viewOrder}${JSON.stringify(filters)}`;
  useEffect(() => {
    const list = listRef.current;
    const previous = previousListKeyRef.current;
    previousListKeyRef.current = listKey;
    if (!list || previous === null || previous === listKey) return;
    list.classList.remove("planner__list--swap");
    void list.offsetWidth;
    list.classList.add("planner__list--swap");
  }, [listKey]);

  // The flag only enables the 30ms phase stagger for Collapse all / Expand all.
  const toggleAllPhases = () => {
    setIsBulkToggle(true);
    toggleAll();
    window.setTimeout(() => setIsBulkToggle(false), BULK_STAGGER_MS);
  };

  const canCollapse = viewOrder === "release";
  const openShare = () => setIsShareDialogOpen(true);

  const confirmReset = () => {
    setIsResetDialogOpen(false);
    void reset();
  };

  const closeImport = () => navigate(PATHS.home, { replace: true });

  const importShared = (ids: ReadonlySet<string>, mode: ImportMode) => {
    void importTitles(ids, mode);
    closeImport();
  };

  return (
    <div className="planner">
      <div className="planner__hero">
        <PlannerSummary
          progress={overall}
          storage={storage}
          error={error}
          progressRef={progressRef}
          strip={strip}
          isDesktop={isDesktop}
          onShare={openShare}
          onReset={() => setIsResetDialogOpen(true)}
        />

        {!isLoading && (
          <NextToWatch
            title={nextTitle}
            phase={nextTitle ? findPhaseNumber(catalog, nextTitle.id) : null}
            isHiddenByFilters={nextTitle !== null && !matchesFilters(nextTitle, filters)}
            onMarkWatched={toggle}
          />
        )}
      </div>

      {isDesktop && <PhaseStrip phases={strip} variant="card" />}

      <div className="planner__body">
        {isDesktop ? (
          <>
            <div className="planner__rail">
              <div className="planner__rail-content">
                <CompactProgress
                  progress={overall}
                  nextTitle={nextTitle}
                  isVisible={isPastProgress}
                />
                <PlannerSearch />
                <PlannerFilters
                  filters={filters}
                  onChange={setFilters}
                  viewOrder={viewOrder}
                  onViewOrderChange={setViewOrder}
                  shown={shownCount}
                  total={allTitles.length}
                />
                {canCollapse && (
                  <CollapseToggle
                    size="lg"
                    areAllCollapsed={areAllCollapsed}
                    onToggleAll={toggleAllPhases}
                  />
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            <PlannerSearch />
            <MobileToolbar
              activeFilters={countActiveFilters(filters)}
              shown={shownCount}
              total={allTitles.length}
              canCollapse={canCollapse}
              areAllCollapsed={areAllCollapsed}
              onOpenFilters={() => setIsFiltersOpen(true)}
              onToggleAll={toggleAllPhases}
            />
            <FiltersSheet
              isOpen={isFiltersOpen}
              onClose={() => setIsFiltersOpen(false)}
              filters={filters}
              onChange={setFilters}
              viewOrder={viewOrder}
              onViewOrderChange={setViewOrder}
              shown={shownCount}
            />
          </>
        )}

        <div
          ref={listRef}
          className={`planner__list${isBulkToggle ? " planner__list--bulk" : ""}`}
          aria-busy={isLoading}
        >
          {viewOrder === "release" ? (
            sagas.map((saga) => (
              <SagaSection
                key={saga.id}
                saga={saga}
                watched={watched}
                collapsed={collapsed}
                onPhaseCollapsedChange={setPhaseCollapsed}
                onToggleTitle={toggle}
              />
            ))
          ) : (
            <ChronologicalList
              placed={chronological.placed}
              unplaced={chronological.unplaced}
              watched={watched}
              onToggleTitle={toggle}
            />
          )}
        </div>

        <PlannerGuide />
      </div>

      {!isDesktop && (
        <FloatingProgress progress={overall} isVisible={isPastProgress && !isFooterVisible} />
      )}

      <ShareDialog
        isOpen={isShareDialogOpen}
        progress={overall}
        onClose={() => setIsShareDialogOpen(false)}
      />

      {shareCode && (
        <ImportSharedDialog
          code={shareCode}
          watched={watched}
          knownIds={knownIds}
          storage={storage}
          isLoading={isLoading}
          onImport={importShared}
          onClose={closeImport}
        />
      )}

      <ConfirmDialog
        isOpen={isResetDialogOpen}
        title={t("planner.reset.title")}
        message={t("planner.reset.message")}
        confirmLabel={t("planner.reset.confirm")}
        cancelLabel={t("common.cancel")}
        onConfirm={confirmReset}
        onCancel={() => setIsResetDialogOpen(false)}
      />
    </div>
  );
}
