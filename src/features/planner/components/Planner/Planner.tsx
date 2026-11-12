import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useSplashReady } from "../../../../app/splash";
import { PATHS } from "../../../../app/paths";
import { ConfirmDialog } from "../../../../components/ui/ConfirmDialog/ConfirmDialog";
import { useIsDesktopWithReset } from "../../../../components/ui/useMediaQuery";
import { useI18n } from "../../../../i18n/useI18n";
import { STORAGE_KEYS } from "../../../../lib/storageKeys";
import { usePersistentState } from "../../../../lib/usePersistentState";
import {
  ImportSharedDialog,
  type ImportMode,
} from "../../../share/components/ImportSharedDialog/ImportSharedDialog";
import { ShareDialog } from "../../../share/components/ShareDialog/ShareDialog";
import { useCollapsedPhases } from "../../hooks/useCollapsedPhases";
import { useJumpToLastWatched } from "../../hooks/useJumpToLastWatched";
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
  matchesQuery,
  normalizeQuery,
} from "../../utils/filters";
import { findNextTitle, findPhaseNumber } from "../../utils/nextTitle";
import { chronologicalTitles, isViewOrder, titlesInOrder } from "../../utils/order";
import { computeProgress } from "../../utils/progress";
import { buildPhaseStrip } from "../../utils/strip";
import { ChronologicalList } from "../ChronologicalList/ChronologicalList";
import { CompactProgress } from "../CompactProgress/CompactProgress";
import { CollapseToggle } from "../CollapseToggle/CollapseToggle";
import { FiltersSheet } from "../FiltersSheet/FiltersSheet";
import { BackToTop } from "../BackToTop/BackToTop";
import { FloatingProgress } from "../FloatingProgress/FloatingProgress";
import { MobileToolbar } from "../MobileToolbar/MobileToolbar";
import { MergeChoiceDialog } from "../MergeChoiceDialog/MergeChoiceDialog";
import { NextToWatch } from "../NextToWatch/NextToWatch";
import { PhaseStrip } from "../PhaseStrip/PhaseStrip";
import { PlannerFilters } from "../PlannerFilters/PlannerFilters";
import { GuideHelp } from "../GuideHelp/GuideHelp";
import { FiltersEmpty } from "../FiltersEmpty/FiltersEmpty";
import { PlannerSearch, SearchNoResults } from "../PlannerSearch/PlannerSearch";
import { PlannerSummary } from "../PlannerSummary/PlannerSummary";
import { SagaSection } from "../SagaSection/SagaSection";

const BULK_STAGGER_MS = 600;
const SEARCH_DEBOUNCE_MS = 200;

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
  const progressRef = useRef<HTMLParagraphElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const previousListKeyRef = useRef<string | null>(null);
  const [isBulkToggle, setIsBulkToggle] = useState(false);

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQuery(query), query ? SEARCH_DEBOUNCE_MS : 0);
    return () => window.clearTimeout(timer);
  }, [query]);
  const needle = normalizeQuery(debouncedQuery);

  const catalog = useResolvedCatalog();
  const sagas = useMemo(() => filterCatalog(catalog, filters, needle), [catalog, filters, needle]);
  const {
    watched,
    isLoading,
    error,
    storage,
    conflict,
    toggle,
    setMany,
    reset,
    importTitles,
    resolveConflict,
  } = useWatched();
  // Ready once the list has committed and painted (two frames), so its render cost stays behind the splash.
  const [hasPainted, setHasPainted] = useState(false);
  useEffect(() => {
    if (isLoading) return;
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setHasPainted(true)));
    return () => cancelAnimationFrame(id);
  }, [isLoading]);
  useSplashReady("planner", hasPainted);
  const { collapsed, areAllCollapsed, setPhaseCollapsed, toggleAll } = useCollapsedPhases();
  const { isPastProgress, isFooterVisible } = useFloatingProgressVisibility(progressRef);
  const { lastId, jump: jumpToLast } = useJumpToLastWatched(
    catalog,
    viewOrder,
    watched,
    collapsed,
    setPhaseCollapsed,
  );

  const allTitles = flattenTitles(catalog);
  const overall = computeProgress(allTitles, watched);
  const searchCount = flattenTitles(sagas).length;
  // The filters counter ignores the search text.
  const shownCount = allTitles.filter((title) => matchesFilters(title, filters)).length;
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
    const isShown = (title: Title) => matchesFilters(title, filters) && matchesQuery(title, needle);
    return { placed: placed.filter(isShown), unplaced: unplaced.filter(isShown) };
  }, [catalog, filters, needle]);

  const listKey = `${viewOrder}${JSON.stringify(filters)}`;

  // While the new set is drawn the list keeps the height it had, so the page below does not jump:
  // the minimum is set before paint and released a frame later.
  const listHeightRef = useRef(0);
  const swapKeyRef = useRef(listKey);
  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const previousHeight = listHeightRef.current;
    listHeightRef.current = list.offsetHeight;
    if (swapKeyRef.current === listKey) return;
    swapKeyRef.current = listKey;
    if (previousHeight <= list.offsetHeight) return;
    list.style.minHeight = `${previousHeight}px`;
    const frame = requestAnimationFrame(() => {
      list.style.minHeight = "";
      listHeightRef.current = list.offsetHeight;
    });
    return () => {
      cancelAnimationFrame(frame);
      list.style.minHeight = "";
    };
  });

  // Fades the new list in when filters or order really change (not when stored ones load, and not
  // on every letter typed in the search).
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
          isDesktop={isDesktop}
          onShare={openShare}
          onReset={() => setIsResetDialogOpen(true)}
        />

        <NextToWatch
          title={isLoading ? null : nextTitle}
          phase={nextTitle && !isLoading ? findPhaseNumber(catalog, nextTitle.id) : null}
          isLoading={isLoading}
          isHiddenByFilters={nextTitle !== null && !matchesFilters(nextTitle, filters)}
          onMarkWatched={toggle}
        />
      </div>

      <PhaseStrip phases={strip} isCollapsible={!isDesktop} />

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
                <PlannerSearch query={query} onQueryChange={setQuery} resultCount={searchCount} />
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
            <PlannerSearch query={query} onQueryChange={setQuery} resultCount={searchCount} />
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
              countFor={(next) => allTitles.filter((title) => matchesFilters(title, next)).length}
            />
          </>
        )}

        <div
          ref={listRef}
          className={`planner__list${isBulkToggle ? " planner__list--bulk" : ""}`}
          aria-busy={isLoading}
        >
          {searchCount === 0 ? (
            needle ? (
              <SearchNoResults query={query} onClear={() => setQuery("")} />
            ) : (
              <FiltersEmpty
                onReset={() => {
                  setFilters(DEFAULT_FILTERS);
                  // The list is back: the focus goes to the search box, which stays on screen.
                  document.querySelector<HTMLInputElement>(".planner-search input")?.focus();
                }}
              />
            )
          ) : viewOrder === "release" ? (
            sagas.map((saga) => (
              <SagaSection
                key={saga.id}
                saga={saga}
                watched={watched}
                collapsed={collapsed}
                onPhaseCollapsedChange={setPhaseCollapsed}
                onToggleTitle={toggle}
                onSetPhase={setMany}
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

      <GuideHelp
        isReady={hasPainted}
        isChronological={viewOrder === "chronological"}
        showAlternate={filters.showAlternate}
      />

      <BackToTop lastId={lastId} onJumpToLast={jumpToLast} />

      <MergeChoiceDialog conflict={conflict} onResolve={resolveConflict} />

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
