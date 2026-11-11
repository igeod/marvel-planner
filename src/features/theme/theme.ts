import { readJson, writeJson } from "../../lib/storage";
import { STORAGE_KEYS } from "../../lib/storageKeys";

export type Theme = "system" | "light" | "dark";

export const THEMES: Theme[] = ["system", "light", "dark"];

const isTheme = (value: unknown): value is Theme => THEMES.includes(value as Theme);

export function readStoredTheme(): Theme {
  const stored = readJson<unknown>(STORAGE_KEYS.theme, null);
  return isTheme(stored) ? stored : "system";
}

export function storeTheme(theme: Theme): void {
  writeJson(STORAGE_KEYS.theme, theme);
}

export function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  if (theme === "system") delete root.dataset.theme;
  else root.dataset.theme = theme;
}

export function nextTheme(theme: Theme): Theme {
  return THEMES[(THEMES.indexOf(theme) + 1) % THEMES.length];
}
