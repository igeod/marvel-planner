import { STORAGE_KEYS } from "./storageKeys";

const PROBE_KEY = "__storage_probe__";

export const isStorageAvailable = (() => {
  try {
    localStorage.setItem(PROBE_KEY, PROBE_KEY);
    localStorage.removeItem(PROBE_KEY);
    return true;
  } catch {
    return false;
  }
})();

export function readJson<T>(key: string, fallback: T): T {
  if (!isStorageAvailable) return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

export function writeJson(key: string, value: unknown): void {
  if (!isStorageAvailable) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    return;
  }
}

export function clearDeviceData(): void {
  if (!isStorageAvailable) return;
  Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
}
