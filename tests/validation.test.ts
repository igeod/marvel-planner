import { describe, expect, it } from "vitest";
import { isValidEmail, suggestEmail } from "../src/lib/validation";

describe("isValidEmail", () => {
  it("accepts ordinary addresses", () => {
    expect(isValidEmail("name@example.com")).toBe(true);
    expect(isValidEmail(" a.b+c@sub.example.co.uk ")).toBe(true);
  });

  it("rejects malformed addresses", () => {
    for (const bad of [
      "",
      "name",
      "name@",
      "name@example",
      "name@.com",
      "name@exa..com",
      "a b@x.com",
      "a@b@x.com",
      "name@example.c",
    ]) {
      expect(isValidEmail(bad)).toBe(false);
    }
  });
});

describe("suggestEmail", () => {
  it("fixes one-letter slips in common domains", () => {
    expect(suggestEmail("mario@gmial.com")).toBe("mario@gmail.com");
  });

  it("stays quiet for correct or unknown domains", () => {
    expect(suggestEmail("mario@gmail.com")).toBeNull();
    expect(suggestEmail("mario@mycompany.io")).toBeNull();
  });
});
