import { describe, expect, it } from "vitest";
import {
  addToast,
  dismissToast,
  MAX_VISIBLE,
  removeToast,
  type ToastItem,
} from "../src/components/ui/Toast/toastQueue";

const toast = (id: string, persistent = false): ToastItem => ({
  id,
  tone: persistent ? "error" : "info",
  title: id,
  persistent,
});
// Toasts still on screen; the ones leaving are listed apart.
const ids = (items: ToastItem[]) => items.filter((item) => !item.leaving).map((item) => item.id);
const leaving = (items: ToastItem[]) => items.filter((item) => item.leaving).map((item) => item.id);

describe("pila dei toast", () => {
  it("aggiunge in coda finché c'è posto", () => {
    expect(ids(addToast([toast("a")], toast("b")))).toEqual(["a", "b"]);
  });

  it("lo stesso id aggiorna il toast al suo posto, senza duplicarlo", () => {
    const updated = { ...toast("a", true), title: "nuovo" };
    const result = addToast([toast("a", true), toast("b")], updated);
    expect(ids(result)).toEqual(["a", "b"]);
    expect(result[0].title).toBe("nuovo");
  });

  it(`oltre ${MAX_VISIBLE} esce il più vecchio che non è persistente`, () => {
    const full = [toast("a", true), toast("b"), toast("c")];
    expect(ids(addToast(full, toast("d")))).toEqual(["a", "c", "d"]);
  });

  it("un toast informativo non espelle mai un errore persistente: aspetta", () => {
    const full = [toast("a", true), toast("b", true), toast("c", true)];
    expect(ids(addToast(full, toast("d")))).toEqual(["a", "b", "c"]);
  });

  it("un errore persistente spinge fuori il più vecchio quando sono tutti persistenti", () => {
    const full = [toast("a", true), toast("b", true), toast("c", true)];
    expect(ids(addToast(full, toast("d", true)))).toEqual(["b", "c", "d"]);
  });

  it("chi esce per far posto resta in lista, in uscita, e non conta più", () => {
    const full = [toast("a", true), toast("b"), toast("c")];
    const result = addToast(full, toast("d"));
    expect(leaving(result)).toEqual(["b"]);
    expect(addToast(result, toast("e")).filter((item) => !item.leaving)).toHaveLength(MAX_VISIBLE);
    expect(leaving(addToast(result, toast("e")))).toEqual(["b", "c"]);
  });

  it("dismissToast avvia l'uscita e removeToast toglie il toast", () => {
    const started = dismissToast([toast("a"), toast("b")], "a");
    expect(leaving(started)).toEqual(["a"]);
    expect(ids(removeToast(started, "a"))).toEqual(["b"]);
    expect(removeToast(started, "a")).toHaveLength(1);
  });
});
