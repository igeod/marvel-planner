import type { I18nContextValue } from "../../../i18n/I18nContext";

const IMAGE_BASE_URL = "/api/images";

const YEAR_MONTH = /^\d{4}-\d{2}$/;
const FULL_DATE = /^\d{4}-\d{2}-\d{2}$/;
const APPROXIMATE = /^(\d{4})-(mid|late)$/;

// w154 for the 44px row thumbnail, w342 for the larger poster of an open row.
export function posterUrl(path: string, size: "w154" | "w342" = "w342"): string {
  return `${IMAGE_BASE_URL}/${size}${path}`;
}

export function backdropUrl(path: string): string {
  return `${IMAGE_BASE_URL}/w780${path}`;
}

export function formatRelease(
  release: string,
  { t, formatDate }: Pick<I18nContextValue, "t" | "formatDate">,
): string {
  const approximate = APPROXIMATE.exec(release);
  if (approximate) {
    const [, year, position] = approximate;
    return t(position === "mid" ? "catalog.release.mid" : "catalog.release.late", { year });
  }
  if (FULL_DATE.test(release)) return formatDate(release);
  if (YEAR_MONTH.test(release)) return formatDate(`${release}-01`, "month");
  return release;
}
