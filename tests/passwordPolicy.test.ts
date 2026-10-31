import { describe, expect, it } from "vitest";
import {
  DEFAULT_PASSWORD_POLICY,
  isLongEnough,
  MAX_PASSWORD_LENGTH,
  parsePasswordPolicy,
} from "../shared/passwordPolicy";

describe("parsePasswordPolicy", () => {
  it("usa il valore predefinito se la riga manca o è rotta", () => {
    expect(parsePasswordPolicy(null)).toEqual(DEFAULT_PASSWORD_POLICY);
    expect(parsePasswordPolicy("non json")).toEqual(DEFAULT_PASSWORD_POLICY);
    expect(parsePasswordPolicy('{"minLength":0}')).toEqual(DEFAULT_PASSWORD_POLICY);
  });

  it("legge la lunghezza e ignora i vecchi campi di composizione", () => {
    expect(parsePasswordPolicy('{"minLength":12,"requireNumber":true}')).toEqual({
      minLength: 12,
    });
  });
});

describe("regole della password", () => {
  it("controlla solo la lunghezza", () => {
    expect(isLongEnough(DEFAULT_PASSWORD_POLICY, "abcdefg")).toBe(false);
    expect(isLongEnough(DEFAULT_PASSWORD_POLICY, "abcdefgh")).toBe(true);
  });

  it("consente almeno 64 caratteri", () => {
    expect(MAX_PASSWORD_LENGTH).toBeGreaterThanOrEqual(64);
  });
});
