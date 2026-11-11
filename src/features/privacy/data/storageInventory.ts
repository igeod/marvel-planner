import { STORAGE_KEYS } from "../../../lib/storageKeys";

export type StorageItemId =
  | "session"
  | "progress"
  | "language"
  | "filters"
  | "viewOrder"
  | "theme"
  | "completedSeen"
  | "sound"
  | "guideSeen";

export const STORAGE_INVENTORY: { id: StorageItemId; name: string }[] = [
  { id: "session", name: "better-auth.session_token" },
  { id: "progress", name: STORAGE_KEYS.progress },
  { id: "language", name: STORAGE_KEYS.language },
  { id: "filters", name: STORAGE_KEYS.filters },
  { id: "viewOrder", name: STORAGE_KEYS.viewOrder },
  { id: "theme", name: STORAGE_KEYS.theme },
  { id: "completedSeen", name: STORAGE_KEYS.completedSeen },
  { id: "sound", name: STORAGE_KEYS.sound },
  { id: "guideSeen", name: STORAGE_KEYS.guideSeen },
];
