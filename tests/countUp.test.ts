import { describe, expect, it } from "vitest";
import { countUpValue, easeOutCubic } from "../src/features/planner/hooks/useCountUp";

describe("countUpValue", () => {
  it("starts at the origin and ends at the target", () => {
    expect(countUpValue(0, 80, 0)).toBe(0);
    expect(countUpValue(0, 80, 1)).toBe(80);
    expect(countUpValue(0, 80, 5)).toBe(80);
  });

  it("decelerates: more than half way in the first half of the time", () => {
    expect(countUpValue(0, 100, 0.5)).toBe(88);
  });

  it("counts down as well", () => {
    expect(countUpValue(60, 0, 1)).toBe(0);
    expect(countUpValue(60, 0, 0.5)).toBe(8);
  });
});

// The strip's battery (motion.less) lights cell c when the number passes (c+1)/n of its final value:
// t = 1 − (1 − (c+1)/n)^(1/3), the inverse of easeOutCubic. The two must stay in step.
describe("la fascia a batteria segue il numero", () => {
  it("la formula del ritardo è l'inversa della curva del numero", () => {
    for (const n of [1, 5, 16, 71]) {
      for (let c = 0; c < n; c++) {
        const share = (c + 1) / n;
        const t = 1 - (1 - share) ** (1 / 3);
        expect(easeOutCubic(t)).toBeCloseTo(share, 10);
      }
    }
  });

  it("l'ultima barretta finisce quando finisce il numero", () => {
    expect(1 - (1 - 71 / 71) ** (1 / 3)).toBe(1);
  });
});
