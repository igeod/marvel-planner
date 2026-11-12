import { describe, expect, it } from "vitest";
import { preferencesSchema } from "../shared/preferences";

describe("preferenze salvate", () => {
  it("accetta l'elenco delle fasi chiuse", () => {
    expect(preferencesSchema.safeParse({ collapsedPhases: [1, 3] }).success).toBe(true);
    expect(preferencesSchema.safeParse({ collapsedPhases: [] }).success).toBe(true);
  });

  it("rifiuta tutto il resto", () => {
    for (const bad of [
      null,
      {},
      { collapsedPhases: ["1"] },
      { collapsedPhases: [1.5] },
      { collapsedPhases: [-1] },
    ])
      expect(preferencesSchema.safeParse(bad).success).toBe(false);
  });
});
