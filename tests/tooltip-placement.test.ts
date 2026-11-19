import { describe, expect, it } from "vitest";
import { computePlacement, referenceRect, type Rect } from "../src/components/ui/Tooltip/placement";

const viewport = { width: 1000, height: 800 };
const box = { width: 200, height: 40 };
const anchorAt = (left: number, top: number): Rect => ({
  left,
  top,
  right: left + 20,
  bottom: top + 20,
});

describe("posizione del tooltip", () => {
  it("sta sopra l'icona quando c'è spazio", () => {
    const result = computePlacement(anchorAt(500, 400), box, viewport, "top");
    expect(result.placement).toBe("top");
    expect(result.top).toBeLessThan(400);
  });

  it("passa sotto quando sopra non c'è posto", () => {
    const result = computePlacement(anchorAt(500, 20), box, viewport, "top");
    expect(result.placement).toBe("bottom");
    expect(result.top).toBeGreaterThan(40);
  });

  it("resta dentro lo schermo con un margine di 8 px", () => {
    const left = computePlacement(anchorAt(0, 400), box, viewport, "top");
    expect(left.left).toBe(8);
    const right = computePlacement(anchorAt(990, 400), box, viewport, "top");
    expect(right.left + box.width).toBe(viewport.width - 8);
  });

  it("la freccia punta al centro dell'icona e non esce dalla bolla", () => {
    const centered = computePlacement(anchorAt(500, 400), box, viewport, "top");
    expect(centered.arrow).toBe(95);
    const edge = computePlacement(anchorAt(0, 400), box, viewport, "top");
    expect(edge.arrow).toBeGreaterThanOrEqual(8);
    expect(edge.arrow).toBeLessThanOrEqual(box.width - 18);
  });

  it("rispetta la posizione preferita laterale quando entra", () => {
    const result = computePlacement(anchorAt(500, 400), box, viewport, "right");
    expect(result.placement).toBe("right");
    expect(result.left).toBeGreaterThan(520);
  });

  it("se nessuna posizione entra usa quella preferita", () => {
    const tiny = { width: 100, height: 60 };
    const result = computePlacement(anchorAt(40, 20), { width: 300, height: 200 }, tiny, "top");
    expect(result.placement).toBe("top");
  });
});

describe("riferimento del tooltip", () => {
  const content: Rect = { left: 100, top: 100, right: 120, bottom: 120 };
  const box: Rect = { left: 88, top: 88, right: 132, bottom: 132 };

  it("senza anello è il contenuto, non l'area di tocco", () => {
    expect(referenceRect(content, box, 0)).toEqual(content);
  });

  it("con l'anello di focus è il box allargato di 6 px per lato", () => {
    expect(referenceRect(content, box, 6)).toEqual({ left: 82, top: 82, right: 138, bottom: 138 });
  });

  it("un'icona da 20 px a sinistra su 390 px: fumetto a 8 px dal bordo, 10 px sopra, freccia sull'icona", () => {
    const icon: Rect = { left: 12, top: 300, right: 32, bottom: 320 };
    const result = computePlacement(
      icon,
      { width: 240, height: 40 },
      { width: 390, height: 800 },
      "top",
    );
    expect(result.left).toBe(8);
    expect(result.top).toBe(300 - 10 - 40);
    expect(result.arrow).toBe(22 - 8 - 5);
  });
});
