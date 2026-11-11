import { beforeEach, describe, expect, it, vi } from "vitest";

const api = vi.hoisted(() => ({ load: vi.fn(), add: vi.fn(), clear: vi.fn() }));
const local = vi.hoisted(() => ({ load: vi.fn(), clear: vi.fn() }));
vi.mock("../src/features/planner/services/apiProgressRepository", () => ({
  apiProgressRepository: api,
}));
vi.mock("../src/features/planner/services/localProgressRepository", () => ({
  localProgressRepository: local,
}));

import {
  resolveDeviceConflict,
  syncDeviceProgress,
} from "../src/features/planner/services/progressSync";

beforeEach(() => {
  vi.resetAllMocks();
});

describe("titoli del dispositivo quando si apre un account", () => {
  it("li aggiunge all'account senza chiedere se l'account è vuoto, e li toglie dal dispositivo", async () => {
    api.load.mockResolvedValue([]);
    local.load.mockResolvedValue(["iron-man", "thor"]);

    expect(await syncDeviceProgress()).toEqual({ ids: ["iron-man", "thor"], conflict: null });
    expect(api.add).toHaveBeenCalledWith(["iron-man", "thor"]);
    // Left on the device, the list would bring back what the account removes later.
    expect(local.clear).toHaveBeenCalledOnce();
  });

  it("non tocca nulla se il dispositivo non ha titoli", async () => {
    api.load.mockResolvedValue(["iron-man"]);
    local.load.mockResolvedValue([]);

    expect(await syncDeviceProgress()).toEqual({ ids: ["iron-man"], conflict: null });
    expect(api.add).not.toHaveBeenCalled();
    expect(local.clear).not.toHaveBeenCalled();
  });

  it("se i titoli del dispositivo sono già nell'account, li toglie dal dispositivo e basta", async () => {
    api.load.mockResolvedValue(["iron-man", "thor"]);
    local.load.mockResolvedValue(["thor"]);

    expect(await syncDeviceProgress()).toEqual({ ids: ["iron-man", "thor"], conflict: null });
    expect(api.add).not.toHaveBeenCalled();
    expect(local.clear).toHaveBeenCalledOnce();
  });

  it("chiede cosa fare, senza cambiare nulla, se ciascuno ha titoli che l'altro non ha", async () => {
    api.load.mockResolvedValue(["iron-man", "hulk"]);
    local.load.mockResolvedValue(["iron-man", "thor"]);

    const result = await syncDeviceProgress();
    expect(result.ids).toEqual(["iron-man", "hulk"]);
    expect(result.conflict).toEqual({
      local: ["iron-man", "thor"],
      cloud: ["iron-man", "hulk"],
      onlyLocal: ["thor"],
      onlyCloud: ["hulk"],
    });
    expect(api.add).not.toHaveBeenCalled();
    expect(local.clear).not.toHaveBeenCalled();
  });

  it("non svuota il dispositivo se il salvataggio sull'account fallisce", async () => {
    api.load.mockResolvedValue([]);
    local.load.mockResolvedValue(["thor"]);
    api.add.mockRejectedValue(new Error("offline"));

    await expect(syncDeviceProgress()).rejects.toThrow("offline");
    expect(local.clear).not.toHaveBeenCalled();
  });
});

describe("scelta tra dispositivo e account", () => {
  const conflict = {
    local: ["iron-man", "thor"],
    cloud: ["iron-man", "hulk"],
    onlyLocal: ["thor"],
    onlyCloud: ["hulk"],
  };

  it("unisci: aggiunge i titoli del dispositivo e li toglie da lì", async () => {
    expect(await resolveDeviceConflict("merge", conflict)).toEqual(["iron-man", "hulk", "thor"]);
    expect(api.add).toHaveBeenCalledWith(["thor"]);
    expect(api.clear).not.toHaveBeenCalled();
    expect(local.clear).toHaveBeenCalledOnce();
  });

  it("tieni l'account: non scrive nulla e svuota il dispositivo", async () => {
    expect(await resolveDeviceConflict("cloud", conflict)).toEqual(["iron-man", "hulk"]);
    expect(api.add).not.toHaveBeenCalled();
    expect(local.clear).toHaveBeenCalledOnce();
  });

  it("usa il dispositivo: l'account diventa uguale al dispositivo", async () => {
    expect(await resolveDeviceConflict("device", conflict)).toEqual(["iron-man", "thor"]);
    expect(api.clear).toHaveBeenCalledOnce();
    expect(api.add).toHaveBeenCalledWith(["iron-man", "thor"]);
    expect(local.clear).toHaveBeenCalledOnce();
  });

  it("se il salvataggio fallisce, il dispositivo resta com'è", async () => {
    api.add.mockRejectedValue(new Error("offline"));
    await expect(resolveDeviceConflict("merge", conflict)).rejects.toThrow("offline");
    expect(local.clear).not.toHaveBeenCalled();
  });
});
