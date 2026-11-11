import { useCallback, useEffect, useRef, useState } from "react";
import { useToast } from "../../../components/ui/Toast/useToast";
import { useI18n } from "../../../i18n/useI18n";
import type { TranslationKey } from "../../../i18n/types";
import { isStorageAvailable } from "../../../lib/storage";
import { useAuth } from "../../auth/hooks/useAuth";
import { useAuthDialog } from "../../auth/hooks/useAuthDialog";
import type { AuthStatus } from "../../auth/types";
import type { ProgressStorage } from "../types";
import { apiProgressRepository } from "../services/apiProgressRepository";
import { localProgressRepository } from "../services/localProgressRepository";
import {
  resolveDeviceConflict,
  syncDeviceProgress,
  type ConflictChoice,
  type DeviceConflict,
} from "../services/progressSync";

const LOAD_ERROR: TranslationKey = "planner.loadError";
const SAVE_TOAST_ID = "save-error";
const LIST_TOAST_ID = "list-change";

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
  const [conflict, setConflict] = useState<DeviceConflict | null>(null);
  const { t } = useI18n();
  const toast = useToast();
  const { open: openAuthDialog } = useAuthDialog();
  // Writes run one after the other: a quick tap and untap must reach the server in that order.
  const queue = useRef<Promise<unknown>>(Promise.resolve());
  const enqueue = useCallback(<T>(task: () => Promise<T>): Promise<T> => {
    const run = queue.current.then(task, task);
    queue.current = run.catch(() => undefined);
    return run;
  }, []);
  // Retry runs the latest version of each action, so it sees the watched set as the revert left it.
  const latest = useRef<{
    toggle: (id: string, isSilent?: boolean) => Promise<void>;
    setMany: (
      ids: readonly string[],
      isWatched: boolean,
      label: string,
      isSilent?: boolean,
    ) => Promise<void>;
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
    const load = isAccount
      ? syncDeviceProgress()
      : localProgressRepository.load().then((ids) => ({ ids, conflict: null }));
    load
      .then((result) => {
        if (!isActive) return;
        setWatched(new Set(result.ids));
        setConflict(result.conflict);
        setError(null);
      })
      .catch(() => isActive && setError(LOAD_ERROR))
      .finally(() => isActive && setLoadedFor(status));
    return () => {
      isActive = false;
    };
  }, [status, isAccount]);

  const toggle = useCallback(
    async (id: string, isSilent = false) => {
      const wasWatched = watched.has(id);
      setWatched((current) => withTitle(current, id, !wasWatched));
      try {
        await enqueue(() => (wasWatched ? repository.remove(id) : repository.add([id])));
        saved();
      } catch {
        setWatched((current) => withTitle(current, id, wasWatched));
        failedToSave(() => latest.current!.toggle(id, isSilent));
        return;
      }
      if (isSilent) return;
      const undo = { label: t("common.undo"), onClick: () => latest.current!.toggle(id, true) };
      // A guest's list lives on the device: the action points to sign-in instead of undo.
      const isGuestAdd = !wasWatched && !isAccount;
      toast.show({
        id: LIST_TOAST_ID,
        tone: "info",
        title: t(
          wasWatched
            ? "planner.list.removed"
            : isAccount
              ? "planner.list.added"
              : "planner.list.savedOnDevice",
        ),
        action: isGuestAdd
          ? { label: t("nav.login"), onClick: () => openAuthDialog("login") }
          : undo,
      });
    },
    [watched, repository, isAccount, enqueue, saved, failedToSave, toast, t, openAuthDialog],
  );

  // A whole phase at once: one write on the queue, one toast; Undo restores exactly what changed.
  const setMany = useCallback(
    async (ids: readonly string[], isWatchedNext: boolean, label: string, isSilent = false) => {
      const changed = ids.filter((id) => watched.has(id) !== isWatchedNext);
      if (changed.length === 0) return;
      const apply = (isOn: boolean) =>
        setWatched((current) => {
          const next = new Set(current);
          for (const id of changed) {
            if (isOn) next.add(id);
            else next.delete(id);
          }
          return next;
        });
      apply(isWatchedNext);
      try {
        await enqueue(() =>
          isWatchedNext ? repository.add(changed) : repository.removeMany(changed),
        );
        saved();
      } catch {
        apply(!isWatchedNext);
        failedToSave(() => latest.current!.setMany(ids, isWatchedNext, label, isSilent));
        return;
      }
      if (isSilent) return;
      const undo = {
        label: t("common.undo"),
        onClick: () => latest.current!.setMany(changed, !isWatchedNext, label, true),
      };
      // A guest's list lives on the device: the action points to sign-in instead of undo.
      const isGuestAdd = isWatchedNext && !isAccount;
      toast.show({
        id: LIST_TOAST_ID,
        tone: "info",
        title: isWatchedNext
          ? t("planner.phase.markedToast", { phase: label, count: changed.length })
          : t("planner.phase.unmarkedToast", { phase: label }),
        action: isGuestAdd
          ? { label: t("nav.login"), onClick: () => openAuthDialog("login") }
          : undo,
      });
    },
    [watched, repository, isAccount, enqueue, saved, failedToSave, toast, t, openAuthDialog],
  );

  // Rejects when saving fails, so the dialog can say so; nothing has changed then.
  const resolveConflict = useCallback(
    async (choice: ConflictChoice) => {
      if (!conflict) return;
      const ids = await resolveDeviceConflict(choice, conflict);
      setWatched(new Set(ids));
      setConflict(null);
      if (choice === "merge") {
        toast.show({
          id: LIST_TOAST_ID,
          tone: "info",
          title: t("merge.toast", { result: ids.length }),
        });
      }
    },
    [conflict, toast, t],
  );

  const reset = useCallback(async () => {
    const previous = watched;
    setWatched(new Set());
    try {
      await enqueue(() => repository.clear());
      saved();
    } catch {
      setWatched(previous);
      failedToSave(() => latest.current!.reset());
    }
  }, [watched, repository, enqueue, saved, failedToSave]);

  const importTitles = useCallback(
    async (ids: ReadonlySet<string>, mode: "merge" | "replace") => {
      setWatched(mode === "replace" ? new Set(ids) : new Set([...watched, ...ids]));
      try {
        await enqueue(async () => {
          if (mode === "replace") await repository.clear();
          if (ids.size > 0) await repository.add([...ids]);
        });
        saved();
      } catch {
        failedToSave(() => latest.current!.importTitles(ids, mode));
        setWatched(new Set(await repository.load().catch(() => watched)));
      }
    },
    [watched, repository, enqueue, saved, failedToSave],
  );

  useEffect(() => {
    latest.current = { toggle, setMany, reset, importTitles };
  });

  const storage: ProgressStorage = isAccount ? "account" : isStorageAvailable ? "device" : "none";

  return {
    watched,
    isLoading: loadedFor !== status,
    error,
    storage,
    conflict,
    toggle,
    setMany,
    reset,
    importTitles,
    resolveConflict,
  };
}
