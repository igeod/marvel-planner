# Prompt per la sessione Code: pagine Privacy e Accessibilità (voce 27)

Sei la sessione **Code** di Marvel Planner. Questo prompt è autosufficiente: non vedi la chat di Design. Il canvas con scene, misure e alternative sta in `docs/design/canvas/Pagine di testo.dc.html` (pagina nuova, chip «proposta · non implementata»); la voce 27 è in `docs/design/HANDOFF.md` §2 e in `CHANGELOG.md`. **I testi sono già scritti, in cinque lingue, in `docs/design/TESTI_PAGINE.md`**: copiali, non riscriverli (riscritti con la skill `scrittura-ux`; privacy e accessibilità: li deve rileggere il committente con un esperto prima della produzione). Dove il canvas e il codice su `main` differiscono vale il codice.

## Regole (CLAUDE.md di radice, valgono sempre)

- Lavora su `main`, niente branch nuovi. Commit e push solo se richiesti.
- Cambia il minimo che risolve. Niente astrazioni, opzioni, dipendenze non richieste. **Riusa quello che esiste:** `.card`, `.display-font()`, `.muted`, `buttonClass("ink", "lg")`, `BackToTop`.
- **Solo token esistenti** (`src/styles/tokens.less`). Nessun valore nuovo.
- CSP rigida: niente stili inline o script inline. Icone solo Lucide, `aria-hidden`.
- Ogni testo visibile è tradotto in it, en, fr, es, de. **Mai anello di focus rosso.** Chiaro e scuro, 390, 1280 e 320 px, contrasto forzato.
- Non cambiare la logica, i dati né i riferimenti di legge, le durate e i soggetti dei testi di Privacy.
- Prima di dire «fatto»: `npm run lint`, `npm test`, `npm run build`, `npm run format:check`.

Stato di partenza: il codice letto da Design è quello di 4bfbea4; `PrivacyPage` e `AccessibilityPage` sono uguali a `main`. Numeri di riga di 4bfbea4.

## Idea (terza versione, dopo il parere del committente)

Oggi le due pagine sono **una scheda grigia lunga come la pagina** (`.block()`, `--surface`, 800 px, 103 caratteri per riga). Il committente vuole la **pagina bianca**, gestita meglio, senza copiare il Planner: **intestazione come quella di una saga** (titolo Anton sul fondo, una riga sopra e una sotto), **una scheda numerata per sezione** (i «box 1, 2, 3» che gli piacciono), e nell'Accessibilità il **biglietto giallo dritto** per la segnalazione. **Niente indice, niente eroe scuro, niente numero gigante, niente inclinazione.** La pagina parte a 8 px dall'intestazione come il Planner (regola P6: le pagine con schede partono lì; le pagine di stato come la 404 restano centrate, `AppLayout.less` r.28-32 invariato).

## Cosa fare, nell'ordine

### 1 · Struttura e stile delle due pagine

File: `src/pages/PrivacyPage/PrivacyPage.tsx` e `.less` (r.3-13 del `.less`), `src/pages/AccessibilityPage/AccessibilityPage.tsx` e `.less` (r.4-14). Una sola classe per le due pagine (nome libero; una cartella condivisa `TextPage/` o due `.less` uguali: scegli il minimo). Via: `.block()`, `--surface`, `max-width: 800px`, `margin`, `padding`, `display: flex; gap` della scheda.

```tsx
<article className="text-page" aria-labelledby="tp-title">
  <header className="text-head">
    <p className="text-head__kicker muted">{t("footer.legal")}</p>          {/* «Informazioni legali»: esiste già */}
    <h1 id="tp-title">…</h1>
    <p className="text-head__meta muted">{t("privacy.updated", { date })}</p>
    {/* solo Accessibilità: <p className="text-head__intro">{t("a11y.intro")}</p> */}
  </header>
  <div className="text-page__body">
    <section className="card text-section" aria-labelledby="h-controller">
      <h2 id="h-controller"><span className="text-section__n" aria-hidden="true">1</span>{titolo}</h2>
      …corpo…
    </section>
    …
  </div>
</article>
```

Il numero è l'indice dell'array, `aria-hidden`. **Ogni `<h2>` ha un `id="h-<nome>"`** (oggi alcune `section` usano `aria-label` senza `id`: `PrivacyPage.tsx` r.78-84 e r.111-117): le ancore dirette (`/privacy#h-rights`) restano, senza nessun indice.

```less
.text-page { display: flex; flex-direction: column; gap: var(--sp-4); max-width: 36rem; margin: 0 auto; }

// intestazione: come .saga__header (SagaSection.less r.21-37), con una riga sopra e una sotto
.text-head { display: flex; flex-direction: column; padding: var(--sp-2) 0 var(--sp-1); }
.text-head__kicker { margin: 0; font-size: var(--fs-label); font-weight: 700; }
.text-head h1 { margin: var(--sp-1) 0 0; .display-font(); font-size: var(--fs-h1-sm); line-height: 1.05; overflow-wrap: break-word; hyphens: auto; .desktop({ font-size: var(--fs-xl); }); }
.text-head__meta { margin: var(--sp-2) 0 0; font-size: var(--fs-label); }
.text-head__intro { margin: var(--sp-3) 0 0; }

// una scheda per sezione
.text-page__body { display: flex; flex-direction: column; gap: var(--sp-3); min-width: 0; }
.text-section { .desktop({ padding: 2rem; }); }                    // .card ha già padding 1.5rem, --r-xl, --surface
.text-section h2 { display: flex; align-items: center; gap: var(--sp-3); margin: 0 0 var(--sp-3); font-size: var(--fs-h3); font-weight: 800; line-height: 1.2; scroll-margin-top: var(--sp-4); }
.text-section__n { flex: none; display: grid; place-items: center; width: 2.5rem; height: 2.5rem; border-radius: var(--r-pill); background: var(--panel); color: var(--highlight); .display-font(); font-size: var(--fs-title); text-transform: none; }
.text-section ul { display: flex; flex-direction: column; gap: var(--sp-1h); padding-left: 1.25rem; list-style: disc; }
.text-section p + p, .text-section ul + p, .text-section p + ul { margin-top: var(--sp-3); }
```

Misurato nel canvas: testo di 512 px a 1280 (circa 75 caratteri per riga; oggi 103), 326 px a 390; nessuno scorrimento orizzontale a 390, 1280 e 320 px (it, de, fr). Monta `BackToTop` («Torna su», oggi solo Planner e Film) nelle due pagine: la Privacy è lunga circa 4100 px a 390 px.

### 2 · Accessibilità: dichiarazione

File: `AccessibilityPage.tsx`, chiavi `a11y.*` in `src/i18n/locales/*.ts` (testi in `TESTI_PAGINE.md`). Intestazione con `text-head__intro`. Poi, come schede numerate: **Stato di conformità** (scheda dei fatti), **Cosa puoi usare** (le quattro voci di oggi `a11y.vision/hearing/motion/keyboard.*` come `ul`, `<li><strong>{heading}</strong>: {body}</li>`, testi **invariati**), **Limiti noti** (`limits.contrast`, `limits.title`, `limits.screenReader`). Per ultimo, **non una scheda ma il biglietto giallo, dritto**: **Come segnalare un ostacolo** (numero 4). Via `a11y.missing.*` (superata). La data di verifica è una costante in `src/app/site.ts` (`a11yCheckedAt: "2026-11-20"`) formattata con `formatDate`, come `privacyLastUpdated`. La riga di aggiornamento usa `privacy.updated` o una nuova `a11y.updated` con la stessa frase.

```tsx
<dl className="text-page__facts">
  <div><dt>{t("a11y.conformance.standardLabel")}</dt><dd>{t("a11y.conformance.standard")}</dd></div>
  <div><dt>{t("a11y.conformance.statusLabel")}</dt><dd>{t("a11y.conformance.status")}</dd></div>
  <div><dt>{t("a11y.conformance.checkedLabel")}</dt><dd>{formatDate(SITE.a11yCheckedAt)}</dd></div>
  <div><dt>{t("a11y.conformance.howLabel")}</dt><dd>{t("a11y.conformance.how")}</dd></div>
</dl>

<section className="text-ticket" aria-labelledby="h-report">
  <h2 id="h-report"><span className="text-section__n text-section__n--ink" aria-hidden="true">4</span>{t("a11y.report.heading")}</h2>
  <p>{t("a11y.report.body")}</p>      {/* senza {email} e senza tempi di risposta: l'indirizzo è nel pulsante */}
  <ButtonLink … className={buttonClass("ink", "lg")} href={`mailto:${SITE.contactEmail}`} icon={<Mail aria-hidden />}>{SITE.contactEmail}</ButtonLink>
</section>
```

```less
.text-page__facts { display: flex; flex-direction: column; gap: var(--sp-3); margin: 0; padding: var(--sp-4); border: 1px solid transparent; border-radius: var(--r-sm); background: var(--row); }
.text-page__facts dt { font-size: var(--fs-label); color: var(--ink-2); }
.text-page__facts dd { margin: 0; }
@media (min-width: 40em) { .text-page__facts > div { display: grid; grid-template-columns: 7rem 1fr; gap: var(--sp-3); } }

// biglietto: il giallo di «Condividi il tuo planner» (PlannerSummary.less r.95), ma dritto
.text-ticket { display: flex; flex-direction: column; align-items: flex-start; gap: var(--sp-3); padding: var(--sp-6); border-radius: var(--r-md); background: var(--highlight); color: var(--ink-static); .desktop({ padding: 2rem; }); }
.text-ticket h2 { display: flex; align-items: center; gap: var(--sp-3); margin: 0; .display-font(); font-size: var(--fs-h2); line-height: .95; }
.text-ticket p { margin: 0; }
.text-ticket .btn { max-width: 100%; }
.text-section__n--ink { background: var(--ink-static); color: var(--highlight); }
```

### 3 · Privacy: testi

Sostituisci in `src/i18n/locales/*.ts` le undici chiavi di `privacy.*` che `TESTI_PAGINE.md` riporta (`data.accountText`, `technicalText`, `deviceText`, `shareText`, `suggestionsText`, `cookies.body`, `providers.body`, `retention.body`, `rights.body`, `other.body`, `changes.body`). Attenzione a `rights.body`: ora ha il segnaposto `{account}` all'inizio del secondo periodo («{account}: qui puoi…»); il link «Il tuo account» (`rights.accountLink`) resta com'è. `PrivacyPage.tsx` non cambia nella logica.

**«Preferenze privacy» è un link, senza virgolette** (richiesta del committente: una chiamata all'azione che aiuta chi legge). Due frasi la nominano: `data.deviceText` («Puoi cancellarli quando vuoi da {link}.») e l'ultimo periodo di `cookies.body` («L'elenco completo è in {link}.»). In `PrivacyPage.tsx` r.56-58 l'elenco dei dati passa da `t(item.text)` a `rich(item.text, { link })` (le altre voci non hanno segnaposto: invariate), e il `link` è lo stesso bottone che c'è già per i cookie (r.79): `<button type="button" className="link-button" onClick={openPrivacySettings}>{t("footer.privacySettings")}</button>`. Il testo del link riusa **`footer.privacySettings`** (esiste nelle cinque lingue: «Preferenze privacy», «Privacy settings», «Préférences de confidentialité», «Preferencias de privacidad», «Datenschutzeinstellungen»), quindi **si toglie `privacy.cookies.link`** («finestra «Preferenze privacy»»), che ripeteva lo stesso nome con le virgolette. È un cambio di forma, non di contenuto (stesse frasi, stesso rinvio): da far rileggere insieme al resto (regola 8).

### 4 · Contrasto forzato

`forced-colors.less`: aggiungi `.text-ticket` all'elenco dei bordi (`border: 1px solid CanvasText`; `.card` c'è già) e, dentro `@media (forced-colors: active)`: `.text-section__n { forced-color-adjust: none; background: Canvas; color: CanvasText; border: 1px solid CanvasText; }` (il cerchio, essendo uno sfondo, sparirebbe; verificato con l'emulazione di Chromium). Il pulsante «ink» dentro il biglietto perde la forma nel contrasto forzato in tutto il sito: è la voce 28 (`PROMPT_CODE_FORZATO.md`), non qui.

## Verifica

A mano, 390, 1280 e 320 px (nessuno scorrimento orizzontale), chiaro e scuro, in tutte e cinque le lingue (de: «Datenschutzerklärung» a 390 px va a capo col trattino); tastiera (Tab: link nel corpo, pulsante del biglietto; l'ancora `/privacy#h-rights` porta alla sezione con il titolo visibile); contrasto forzato; zoom al 200 % del testo. Test automatici: nessuno nuovo (markup e CSS).
**Non verificato da Design:** Safari e Firefox (`hyphens: auto`), VoiceOver e NVDA, il conteggio dei caratteri con i font ospitati.

## DESIGN.md e HANDOFF

- **Aggiungi** in `DESIGN.md`, «Deviazioni»: `Pagine di testo | PrivacyPage, AccessibilityPage | intestazione come una saga, una scheda numerata per sezione, biglietto giallo dritto nell'Accessibilità | voce 27 di HANDOFF §2`.
- Poi cancella la voce 27 da HANDOFF §2, riportala in §5, metti il chip «implementata · main <commit>» nella pagina del canvas e annota «sostituita · voce 27» sul blocco «funzione 23» di `Accessibility.dc.html`.
