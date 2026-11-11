import { beforeEach, describe, expect, it, vi } from "vitest";

const api = vi.hoisted(() => ({ load: vi.fn(), add: vi.fn() }));
const local = vi.hoisted(() => ({ load: vi.fn(), clear: vi.fn() }));
vi.mock("../src/features/planner/services/apiProgressRepository", () => ({
  apiProgressRepository: api,
}));
vi.mock("../src/features/planner/services/localProgressRepository", () => ({
  localProgressRepository: local,
}));

import { mergeDeviceProgressIntoAccount } from "../src/features/planner/services/progressSync";

beforeEach(() => {
  vi.resetAllMocks();
});

describe("unione dei progressi del dispositivo nell'account", () => {
  it("aggiunge all'account solo i titoli mancanti e li toglie dal dispositivo", async () => {
    api.load.mockResolvedValue(["iron-man"]);
    local.load.mockResolvedValue(["iron-man", "thor"]);

    expect(await mergeDeviceProgressIntoAccount()).toEqual(["iron-man", "thor"]);
    expect(api.add).toHaveBeenCalledWith(["thor"]);
    // Left on the device, the list would bring back what the account removes later.
    expect(local.clear).toHaveBeenCalledOnce();
  });

  it("non tocca nulla se il dispositivo non ha titoli", async () => {
    api.load.mockResolvedValue(["iron-man"]);
    local.load.mockResolvedValue([]);

    expect(await mergeDeviceProgressIntoAccount()).toEqual(["iron-man"]);
    expect(api.add).not.toHaveBeenCalled();
    expect(local.clear).not.toHaveBeenCalled();
  });

  it("non svuota il dispositivo se il salvataggio sull'account fallisce", async () => {
    api.load.mockResolvedValue([]);
    local.load.mockResolvedValue(["thor"]);
    api.add.mockRejectedValue(new Error("offline"));

    await expect(mergeDeviceProgressIntoAccount()).rejects.toThrow("offline");
    expect(local.clear).not.toHaveBeenCalled();
  });
});
