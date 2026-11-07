import { describe, expect, it } from "vitest";
import { errorCode } from "../src/lib/errorCode";

describe("errorCode", () => {
  it("has the E- prefix and five base36 characters", () => {
    expect(errorCode(new Error("boom"), "/")).toMatch(/^E-[0-9A-Z]{5}$/);
  });

  it("is stable for the same error and page", () => {
    expect(errorCode(new TypeError("x"), "/a")).toBe(errorCode(new TypeError("x"), "/a"));
  });

  it("changes with the message or the page", () => {
    const base = errorCode(new Error("one"), "/a");
    expect(errorCode(new Error("two"), "/a")).not.toBe(base);
    expect(errorCode(new Error("one"), "/b")).not.toBe(base);
  });

  it("accepts values that are not Error objects", () => {
    expect(errorCode("plain text", "/")).toMatch(/^E-[0-9A-Z]{5}$/);
  });
});
