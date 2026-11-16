import { describe, expect, it } from "vitest";
import { memoryTitleAlertsRepository } from "../src/features/planner/services/titleAlertsRepository";
import { withAlert } from "../src/features/planner/utils/titleAlertsState";

describe("avvisi sui titoli in arrivo", () => {
  it("accende e spegne un titolo senza toccare l'insieme di partenza", () => {
    const start: ReadonlySet<string> = new Set(["a"]);
    const on = withAlert(start, "b", true);
    expect([...on].sort()).toEqual(["a", "b"]);
    expect([...start]).toEqual(["a"]);
    expect([...withAlert(on, "a", false)]).toEqual(["b"]);
  });

  it("la porta provvisoria ricorda gli avvisi accesi", async () => {
    await memoryTitleAlertsRepository.set("x", true);
    expect(await memoryTitleAlertsRepository.list()).toContain("x");
    await memoryTitleAlertsRepository.set("x", false);
    expect(await memoryTitleAlertsRepository.list()).not.toContain("x");
  });
});
