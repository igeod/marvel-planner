import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { StateBox } from "../src/components/ui/StateBox/StateBox";

type Props = Parameters<typeof StateBox>[0];
const render = (extra: Partial<Props> = {}) =>
  renderToStaticMarkup(
    createElement(StateBox, {
      art: createElement("svg"),
      title: "Titolo",
      children: "Una frase.",
      ...extra,
    }),
  );

describe("riquadro di stato", () => {
  it("è una card con ruolo status, titolo h3 e una frase", () => {
    const html = render();
    expect(html).toContain('class="state-box state-box--card"');
    expect(html).toContain('role="status"');
    expect(html).toContain("<h3>Titolo</h3>");
    expect(html).toContain("<p>Una frase.</p>");
  });

  it("l'illustrazione è decorativa", () => {
    expect(render()).toContain('class="state-box__art" aria-hidden="true"');
  });

  it("per un errore il ruolo è alert e nel popup il layout è a colonna", () => {
    const html = render({ role: "alert", layout: "dialog" });
    expect(html).toContain('role="alert"');
    expect(html).toContain("state-box--dialog");
  });

  it("le azioni compaiono solo se ci sono", () => {
    expect(render()).not.toContain("state-box__actions");
    expect(render({ actions: createElement("button", null, "Chiudi") })).toContain(
      '<div class="state-box__actions"><button>Chiudi</button></div>',
    );
  });
});
