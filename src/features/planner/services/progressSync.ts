import { apiProgressRepository } from "./apiProgressRepository";
import { localProgressRepository } from "./localProgressRepository";

export async function mergeDeviceProgressIntoAccount(): Promise<string[]> {
  const [accountIds, deviceIds] = await Promise.all([
    apiProgressRepository.load(),
    localProgressRepository.load(),
  ]);
  const accountSet = new Set(accountIds);
  const missing = deviceIds.filter((id) => !accountSet.has(id));
  if (missing.length > 0) await apiProgressRepository.add(missing);
  // Merged once: left on the device, the list would bring back what the account later removed.
  if (deviceIds.length > 0) await localProgressRepository.clear();
  return [...accountIds, ...missing];
}
