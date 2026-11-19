// The port for "tell me by e-mail when it is out". The server does not exist yet: the only
// implementation lives in memory and always succeeds. A real one replaces it without touching the UI.
export interface TitleAlertsRepository {
  list(): Promise<string[]>;
  set(titleId: string, isOn: boolean): Promise<void>;
}

const stored = new Set<string>();

export const memoryTitleAlertsRepository: TitleAlertsRepository = {
  list: () => Promise.resolve([...stored]),
  set: (titleId, isOn) => {
    if (isOn) stored.add(titleId);
    else stored.delete(titleId);
    return Promise.resolve();
  },
};
