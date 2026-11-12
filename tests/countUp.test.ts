import { describe, expect, it } from "vitest";
import { countUpValue } from "../src/features/planner/hooks/useCountUp";

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
