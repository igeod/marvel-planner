import { describe, expect, it } from "vitest";
import { addToast, MAX_VISIBLE, type ToastItem } from "../src/components/ui/Toast/toastQueue";

const toast = (id: string, persistent = false): ToastItem => ({
  id,
  tone: persistent ? "error" : "info",
  title: id,
  persistent,
});
const ids = (items: ToastItem[]) => items.map((item) => item.id);

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
});
