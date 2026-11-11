import { beforeEach, describe, expect, it } from "vitest";
import { isBlocked, recordMiss } from "../../worker/services/missLimit";
import { createTestDatabase } from "./support/testDatabase";

const MINUTE_MS = 60 * 1000;
const start = Date.parse("2026-10-24T10:00:00Z");

let db: ReturnType<typeof createTestDatabase>["db"];

beforeEach(() => {
  db = createTestDatabase().db;
});

const missTimes = async (times: number, client: string, at = start) => {
  for (let index = 0; index < times; index += 1) await recordMiss(db, "shared", client, at);
};

describe("limite sui tentativi falliti", () => {
  it("non blocca chi non ha sbagliato", async () => {
    expect(await isBlocked(db, "shared", "1.1.1.1", start)).toBe(false);
  });

  it("conta anche i tentativi che arrivano insieme", async () => {
    await Promise.all(Array.from({ length: 20 }, () => recordMiss(db, "shared", "3.3.3.3", start)));
    expect(await isBlocked(db, "shared", "3.3.3.3", start)).toBe(true);
  });

  it("blocca dopo 20 tentativi falliti ma solo quel client", async () => {
    await missTimes(19, "1.1.1.1");
    expect(await isBlocked(db, "shared", "1.1.1.1", start)).toBe(false);
    await missTimes(1, "1.1.1.1");
    expect(await isBlocked(db, "shared", "1.1.1.1", start)).toBe(true);
    expect(await isBlocked(db, "shared", "2.2.2.2", start)).toBe(false);
  });

  it("si sblocca dopo 10 minuti senza nuovi tentativi", async () => {
    await missTimes(20, "1.1.1.1");
    expect(await isBlocked(db, "shared", "1.1.1.1", start + 9 * MINUTE_MS)).toBe(true);
    expect(await isBlocked(db, "shared", "1.1.1.1", start + 11 * MINUTE_MS)).toBe(false);
  });

  it("riparte da zero quando la finestra è scaduta", async () => {
    await missTimes(20, "1.1.1.1");
    await recordMiss(db, "shared", "1.1.1.1", start + 11 * MINUTE_MS);
    expect(await isBlocked(db, "shared", "1.1.1.1", start + 11 * MINUTE_MS)).toBe(false);
  });
});
