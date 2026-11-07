import { useCallback, useEffect, useRef, useState } from "react";
import { useToast } from "../../../components/ui/Toast";
import { useI18n } from "../../../i18n/useI18n";
import type { TranslationKey } from "../../../i18n/types";
import { isStorageAvailable } from "../../../lib/storage";
import { useAuth } from "../../auth/hooks/useAuth";
import type { AuthStatus } from "../../auth/types";
import type { ProgressStorage } from "../types";
import { apiProgressRepository } from "../services/apiProgressRepository";
import { localProgressRepository } from "../services/localProgressRepository";
import { mergeDeviceProgressIntoAccount } from "../services/progressSync";

const LOAD_ERROR: TranslationKey = "planner.loadError";
const SAVE_TOAST_ID = "save-error";

function withTitle(set: ReadonlySet<string>, id: string, isWatched: boolean): ReadonlySet<string> {
  const next = new Set(set);
  if (isWatched) next.add(id);
  else next.delete(id);
  return next;
}

export function useWatched() {
  const { status } = useAuth();
  const isAccount = status === "authenticated";
  const repository = isAccount ? apiProgressRepository : localProgressRepository;

  const [watched, setWatched] = useState<ReadonlySet<string>>(new Set());
  const [loadedFor, setLoadedFor] = useState<AuthStatus | null>(null);
  const [error, setError] = useState<TranslationKey | null>(null);
  const { t } = useI18n();
  const toast = useToast();
  // Retry runs the latest version of each action, so it sees the watched set as the revert left it.
  const latest = useRef<{
    toggle: (id: string) => Promise<void>;
    reset: () => Promise<void>;
    importTitles: (ids: ReadonlySet<string>, mode: "merge" | "replace") => Promise<void>;
  } | null>(null);

  const saved = useCallback(() => {
    setError(null);
    toast.dismiss(SAVE_TOAST_ID);
  }, [toast]);

  const failedToSave = useCallback(
    (retry: () => Promise<void>) =>
      toast.show({
        id: SAVE_TOAST_ID,
        tone: "error",
        persistent: true,
        title: t("errors.save.title"),
        message: t("errors.save.body"),
        action: { label: t("common.retry"), onClick: retry },
      }),
    [toast, t],
  );

  useEffect(() => {
    if (status === "loading") return;
    let isActive = true;
    const load = isAccount ? mergeDeviceProgressIntoAccount() : localProgressRepository.load();
    load
      .then((ids) => {
        if (!isActive) return;
        setWatched(new Set(ids));
        setError(null);
      })
      .catch(() => isActive && setError(LOAD_ERROR))
      .finally(() => isActive && setLoadedFor(status));
    return () => {
      isActive = false;
    };
  }, [status, isAccount]);

  const toggle = useCallback(
    async (id: string) => {
      const wasWatched = watched.has(id);
      setWatched((current) => withTitle(current, id, !wasWatched));
      try {
        if (wasWatched) await repository.remove(id);
        else await repository.add([id]);
        saved();
      } catch {
        setWatched((current) => withTitle(current, id, wasWatched));
        failedToSave(() => latest.current!.toggle(id));
      }
    },
    [watched, repository, saved, failedToSave],
  );

  const reset = useCallback(async () => {
    const previous = watched;
    setWatched(new Set());
    try {
      await repository.clear();
      saved();
    } catch {
      setWatched(previous);
      failedToSave(() => latest.current!.reset());
    }
  }, [watched, repository, saved, failedToSave]);

  const importTitles = useCallback(
    async (ids: ReadonlySet<string>, mode: "merge" | "replace") => {
      setWatched(mode === "replace" ? new Set(ids) : new Set([...watched, ...ids]));
      try {
        if (mode === "replace") await repository.clear();
        if (ids.size > 0) await repository.add([...ids]);
        saved();
      } catch {
        failedToSave(() => latest.current!.importTitles(ids, mode));
        setWatched(new Set(await repository.load().catch(() => watched)));
      }
    },
    [watched, repository, saved, failedToSave],
  );

  useEffect(() => {
    latest.current = { toggle, reset, importTitles };
  });

  const storage: ProgressStorage = isAccount ? "account" : isStorageAvailable ? "device" : "none";

  return { watched, isLoading: loadedFor !== status, error, storage, toggle, reset, importTitles };
}
