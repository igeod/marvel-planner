# Prompt per la sessione Code: contrasto forzato, stati e pulsanti (voce 28, F1)

Sei la sessione **Code** di Marvel Planner. Questo prompt è autosufficiente: non vedi la chat di Design. Il canvas con immagini, tabella e alternative sta in `docs/design/canvas/Accessibility.dc.html` (sezione «Decisione · contrasto forzato: stati e pulsanti con soli colori di sistema (voce 28, F1)», chip «proposta · non implementata»); la voce 28 è in `docs/design/HANDOFF.md` §2 e in `CHANGELOG.md`. Dove il canvas e il codice su `main` differiscono vale il codice.

## Regole (CLAUDE.md di radice, valgono sempre)

- Lavora su `main`, niente branch nuovi. Commit e push solo se richiesti.
- Cambia il minimo che risolve. **Solo `src/styles/forced-colors.less`**: nessun componente cambia, nessun colore normale cambia.
- Solo **colori di sistema** dentro `@media (forced-colors: active)`: `Canvas`, `CanvasText`, `ButtonFace`, `ButtonText`, `Highlight`, `HighlightText`, `GrayText`. Mai un colore del tema o un token.
- CSP rigida (qui non cambia nulla). Nessun testo nuovo.
- Prima di dire «fatto»: `npm run lint`, `npm test`, `npm run build`, `npm run format:check`.

Stato di partenza: `forced-colors.less` di 4bfbea4 (copre schede, popup, campi, barre di avanzamento, caselle dei titoli, elenco dei Select). Il CSS del canvas non lo include; nelle immagini «oggi» Design lo aggiunge.

## Il problema (F1 dell'audit, gravità A)

Con il contrasto forzato (Windows) il browser toglie i fondi: le celle e i pallini della fascia delle fasi spariscono (resta il triangolo di «Prossimo»), i pulsanti sembrano testo, **non si vede quale scelta di `ChoiceGroup` è selezionata né se un interruttore è acceso** (stato affidato al solo fondo), il biglietto «Condividi», la pillola dell'account e l'avatar perdono il contorno.

## Cosa aggiungere

Dentro il blocco `@media (forced-colors: active)` che c'è già (non toccare le regole esistenti):

```less
// Fascia e legenda: tre stati, tre forme (pieno / vuoto con bordo spesso e triangolo / vuoto)
.phase-strip__cell,
.phase-strip__swatch { forced-color-adjust: none; box-sizing: border-box; border: 1px solid ButtonText; background: Canvas; color: CanvasText; }
.phase-strip__cell--watched { background: Highlight; border-color: Highlight; color: HighlightText; }
.phase-strip__cell--next { border: 2px solid Highlight; }     // il triangolo c'è già (svg, currentColor)

// Pulsanti: pieni (azione), con contorno (secondari), sottolineati (testo, già)
.btn:not(.btn--text) { border: 1px solid ButtonText; }
.btn--primary, .btn--accent, .btn--ink, .btn--dark, .btn--danger { forced-color-adjust: none; background: ButtonText; color: ButtonFace; }
.btn--soft, .btn--surface, .btn--panel { background: ButtonFace; color: ButtonText; }
.btn:disabled,
.btn[aria-disabled="true"]:not([aria-busy="true"]) { forced-color-adjust: none; background: ButtonFace; color: GrayText; border: 1px dashed GrayText; }   // tratteggio: non solo la tinta
@media (hover: hover) and (pointer: fine) {
  .btn:not(.btn--text):hover:not(:disabled):not([aria-disabled="true"]) { forced-color-adjust: none; background: Highlight; color: HighlightText; border-color: Highlight; }
}

// Scelte e interruttori
.choice__face { border: 1px solid ButtonText; }
.choice__input:checked + .choice__face { forced-color-adjust: none; background: Highlight; color: HighlightText; border-color: Highlight; }
.switch__track { forced-color-adjust: none; box-sizing: border-box; border: 2px solid ButtonText; background: Canvas; }
.switch__track::after { background: ButtonText; }
.switch__input:checked + .switch__track { background: Highlight; border-color: Highlight; }
.switch__input:checked + .switch__track::after { background: HighlightText; }

// Biglietto, pillola dell'account, avatar
.share-poster, .account-pill { border: 1px solid CanvasText; }
.avatar { forced-color-adjust: none; background: Canvas; color: CanvasText; border: 1px solid CanvasText; }
```

I nomi sono quelli del canvas, verificati su 4bfbea4: `PhaseStrip.less` r.96-145, `ChoiceGroup.less` r.50 e r.72, `Switch.less` r.35 e r.55, `PlannerSummary.less` r.95, `AccountMenu.less` r.9 e r.28. **Attenzione alla specificità:** `.on-panel .choice__input:checked + .choice__face` (`ChoiceGroup.less` r.83-94) e `.filters-card .choice__face` (`PlannerFilters.less` r.18) sono più specifici: se vincono, la scelta selezionata prende colori non di sistema; ripeti la regola con quei prefissi. Controlla anche altri punti dove lo **stato è nel solo fondo** (Design non li ha cercati tutti): stesso schema (pieno di `Highlight` contro contorno di `ButtonText`).

Cosa fa ogni stato e perché (tabella completa nel canvas): visto = **pieno**, prossimo = **vuoto con bordo da 2 px e triangolo**, da vedere = **vuoto con bordo da 1 px**: le tre forme si leggono anche in un tema a due colori. I pulsanti pieni (primario, accento, ink, dark, pericolo) restano indistinguibili tra loro in questa modalità: li distingue solo l'etichetta (limite dichiarato).

## Verifica

- Chromium, DevTools, Rendering, «Emulate CSS media feature forced-colors: active», tavolozza chiara e scura (cambia `prefers-color-scheme`); 390 e 1280 px; fascia con 40 titoli in una fase (celle da 8 px). Poi, su Windows, un tema ad alto contrasto vero (Aquatic, Desert, Night sky, bianco e nero).
- Controlla a vista: fascia (tre forme), legenda (stessi segni), pulsanti di ogni variante (anche disattivato, in corso, icona sola), scelta selezionata, interruttore acceso e spento, biglietto, pillola e avatar, **mouse sopra un pulsante** (Design non l'ha visto).
- Con i colori normali nulla deve cambiare (le regole stanno tutte nel `@media`).
**Non verificato da Design:** Windows con un tema vero (le tinte di `Highlight` e `GrayText` cambiano da tema a tema), Firefox, l'hover, l'«Aumenta contrasto» di macOS (è un'altra funzione).

## DESIGN.md e HANDOFF

- **Aggiungi** in `DESIGN.md`, «Deviazioni»: `Contrasto forzato | forced-colors.less | stati e pulsanti con soli colori di sistema (fascia, pulsanti, scelte, interruttori, avatar) | voce 28 di HANDOFF §2`.
- Poi cancella la voce 28 da HANDOFF §2, riportala in §5 e metti il chip «implementata · main <commit>» nel blocco del canvas.
