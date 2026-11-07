import { describe, expect, it } from "vitest";
import { planViewChange } from "../src/features/auth/utils/viewChange";

type View = "login" | "register" | "forgot" | "account";
const rules = {
  isBack: (_from: View, to: View) => to === "login",
  isInstant: (from: View | null, to: View) =>
    from === null || from === "account" || to === "account",
};
const plan = (from: View | null, to: View | null) => planViewChange(from, to, rules);

describe("cambio di vista del popup", () => {
  it("non fa nulla se la vista non cambia o il popup si chiude", () => {
    expect(plan("login", "login")).toEqual({ kind: "none" });
    expect(plan("login", null)).toEqual({ kind: "none" });
  });

  it("riaprendo il popup, o passando dal profilo, cambia subito", () => {
    expect(plan(null, "login")).toEqual({ kind: "instant" });
    expect(plan("account", "login")).toEqual({ kind: "instant" });
    expect(plan("login", "account")).toEqual({ kind: "instant" });
  });

  it("andare avanti scorre in avanti, tornare all'accesso scorre indietro", () => {
    expect(plan("login", "register")).toEqual({ kind: "animate", direction: "forward" });
    expect(plan("login", "forgot")).toEqual({ kind: "animate", direction: "forward" });
    expect(plan("forgot", "login")).toEqual({ kind: "animate", direction: "back" });
  });

  it("da chiuso mostra la vista subito anche se la regola non lo dice", () => {
    const strict = { isBack: () => false, isInstant: () => false };
    expect(planViewChange<View>(null, "register", strict)).toEqual({ kind: "instant" });
  });
});
