import { apiProgressRepository } from "./apiProgressRepository";
import { localProgressRepository } from "./localProgressRepository";

export interface DeviceConflict {
  local: string[];
  cloud: string[];
  onlyLocal: string[];
  onlyCloud: string[];
}

export type ConflictChoice = "merge" | "cloud" | "device";

// Called when an account is open. Titles marked as a guest are added to the account without a
// question, unless the account already has titles and the device has some it lacks: then the person
// chooses (a conflict) and nothing changes until they do.
export async function syncDeviceProgress(): Promise<{
  ids: string[];
  conflict: DeviceConflict | null;
}> {
  const [cloud, local] = await Promise.all([
    apiProgressRepository.load(),
    localProgressRepository.load(),
  ]);
  if (local.length === 0) return { ids: cloud, conflict: null };

  const cloudSet = new Set(cloud);
  const onlyLocal = local.filter((id) => !cloudSet.has(id));
  if (cloud.length > 0 && onlyLocal.length > 0) {
    const localSet = new Set(local);
    const onlyCloud = cloud.filter((id) => !localSet.has(id));
    return { ids: cloud, conflict: { local, cloud, onlyLocal, onlyCloud } };
  }

  // Merged once: left on the device, the list would bring back what the account later removes.
  if (onlyLocal.length > 0) await apiProgressRepository.add(onlyLocal);
  await localProgressRepository.clear();
  return { ids: [...cloud, ...onlyLocal], conflict: null };
}

export async function resolveDeviceConflict(
  choice: ConflictChoice,
  conflict: DeviceConflict,
): Promise<string[]> {
  let ids = conflict.cloud;
  if (choice === "merge") {
    await apiProgressRepository.add(conflict.onlyLocal);
    ids = [...conflict.cloud, ...conflict.onlyLocal];
  } else if (choice === "device") {
    await apiProgressRepository.clear();
    await apiProgressRepository.add(conflict.local);
    ids = conflict.local;
  }
  await localProgressRepository.clear();
  return ids;
}
