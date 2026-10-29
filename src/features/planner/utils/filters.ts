import type { Filters, MediaType, Saga, Title } from "../types";

export const DEFAULT_FILTERS: Filters = {
  types: ["film", "serie", "special"],
  showAlternate: true,
  showUpcoming: true,
};

export function matchesFilters(title: Title, filters: Filters): boolean {
  if (!filters.types.includes(title.type)) return false;
  if (!filters.showAlternate && title.continuity === "alternate") return false;
  if (!filters.showUpcoming && title.status === "upcoming") return false;
  return true;
}

export function normalizeQuery(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

// `needle` comes from normalizeQuery; an empty one matches everything.
export function matchesQuery(title: Title, needle: string): boolean {
  return !needle || normalizeQuery(title.name).includes(needle);
}

export function areDefaultFilters(filters: Filters): boolean {
  return (
    DEFAULT_FILTERS.types.every((type) => filters.types.includes(type)) &&
    filters.showAlternate === DEFAULT_FILTERS.showAlternate &&
    filters.showUpcoming === DEFAULT_FILTERS.showUpcoming
  );
}

export function countActiveFilters(filters: Filters): number {
  const differsInTypes =
    DEFAULT_FILTERS.types.length !== filters.types.length ||
    !DEFAULT_FILTERS.types.every((type) => filters.types.includes(type));
  return [differsInTypes, !filters.showAlternate, !filters.showUpcoming].filter(Boolean).length;
}

export function filterCatalog(catalog: Saga[], filters: Filters, needle = ""): Saga[] {
  return catalog.map((saga) => ({
    ...saga,
    phases: saga.phases.map((phase) => ({
      ...phase,
      titles: phase.titles.filter(
        (title) => matchesFilters(title, filters) && matchesQuery(title, needle),
      ),
    })),
  }));
}

export function flattenTitles(catalog: Saga[]): Title[] {
  return catalog.flatMap((saga) => saga.phases.flatMap((phase) => phase.titles));
}

const MEDIA_TYPES: MediaType[] = ["film", "serie", "special"];

export function isFilters(value: unknown): value is Filters {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return (
    Array.isArray(candidate.types) &&
    candidate.types.every((type) => MEDIA_TYPES.includes(type as MediaType)) &&
    typeof candidate.showAlternate === "boolean" &&
    typeof candidate.showUpcoming === "boolean"
  );
}
