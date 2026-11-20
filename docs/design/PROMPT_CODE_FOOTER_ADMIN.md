# Prompt per la sessione Code: piè di pagina (voce 29, P10) e Admin (voce 30, P9)

Sei la sessione **Code** di Marvel Planner. Questo prompt è autosufficiente: non vedi la chat di Design. Il canvas con cornici, misure e alternative sta in `docs/design/canvas/Navigation.dc.html` (piè di pagina) e `Admin.dc.html` (Admin), blocchi «Decisione · …», chip «proposta · non implementata»; le voci 29 e 30 sono in `docs/design/HANDOFF.md` §2 e in `CHANGELOG.md`. **I testi nuovi sono già scritti in cinque lingue in `docs/design/TESTI_ADMIN.md`** (anche `footer.version`): copiali, non riscriverli. Dove il canvas e il codice su `main` differiscono vale il codice.

## Regole (CLAUDE.md di radice, valgono sempre)

- Lavora su `main`, niente branch nuovi. Commit e push solo se richiesti.
- Cambia il minimo che risolve. **Riusa**: `.phase.card` (fisarmonica), `.card`, `Button`, `ConfirmDialog`, `todo.more` («Mostra altri 10»). Nessuna dipendenza.
- **Solo token esistenti** (`src/styles/tokens.less`). Nessun valore nuovo. CSP rigida, icone solo Lucide `aria-hidden`.
- Ogni testo visibile è tradotto in it, en, fr, es, de. **Mai anello di focus rosso.** Chiaro e scuro, 390 e 1280 px, contrasto forzato.
- Nessuna nuova scrittura in `localStorage` (il popup Preferenze privacy ne elenca tutte).
- Prima di dire «fatto»: `npm run lint`, `npm test`, `npm run build`, `npm run format:check`.

Stato di partenza: il codice letto da Design è quello di 4bfbea4 (**non è su `main`** quando questo prompt è stato scritto: se manca, parti da lì o chiedilo al committente). Numeri di riga di 4bfbea4.

---

## Voce 29 · Piè di pagina: due fasce, scheda del caffè, «Made in Italy» come marchio

File: `src/components/layout/AppFooter/AppFooter.tsx` (r.17-63) e `.less`, `CoffeeLink/CoffeeLink.tsx` e `.less`, `src/styles/motion.less` (hover del titolo), `vite.config.ts`, `forced-colors.less`, locale. Misurato nel canvas: oggi 412 px a 1280 e 631 a 390 (con il caffè), proposta 436 e 687.

Impostazione (riferimento scelto dal committente, adattato): **due fasce divise da una linea** `--panel-2`. **In alto:** a sinistra l'identità (nome non cliccabile, **versione sotto il nome**, avviso «Sito non ufficiale…»); a destra **«Offrimi un caffè» come scheda** (gialla `--highlight`, angoli `--r-xl`, tondo `--ink-static` con la tazza, frase in Anton, freccia `ArrowUpRight`; tutta la scheda è il link; solo se `coffeeUrl` c'è). Il tondo è il **posto per l'immagine** che il committente vuole aggiungere: file nostro (CSP), `alt=""`, 72-96 px. **In basso:** a sinistra le note in piccolo (TMDB, licenza caratteri, «© {year} Marvel Planner»); a destra i link legali in linea (Privacy, Accessibilità, Preferenze privacy, sottolineati, righe da `--hit`) e **sotto i link, in basso a destra, «Made in Italy»** come un marchio. **Spazi: solo `--sp-3` dentro un gruppo, `--sp-8` sopra e sotto la linea, `--sp-10` tra le zone** (la versione precedente ne usava cinque). Sul telefono: identità, caffè, linea, link legali, note, «Made in Italy» a destra. **Via la riga `footer.credits`** (JustWatch e Wikipedia): sono già attribuiti dove si usano (`WhereToWatch.tsx` r.70-72, `PlotSection.tsx` r.11-24). Testi nuovi: `footer.version` e `footer.copyright` (`TESTI_ADMIN.md`).

**Il «©» è in attesa del committente** (con un esperto): non scrivere «Tutti i diritti riservati» (contraddice la licenza CC BY-SA delle trame e l'avviso «non ufficiale»); se il committente toglie il «©» il resto resta uguale. Anno: fisso o dalla data di build, da decidere. Il suggerimento di «Dove guardarlo» è un tooltip: se i termini del TMDB vogliono l'attribuzione JustWatch sempre visibile, va resa visibile lì.

```tsx
// AppFooter.tsx: due fasce
<footer id={FOOTER_ID} className="site-footer on-panel">
  <div className="site-footer__top">
    <div className="site-footer__about">
      <div><p className="wordmark wordmark--large">{SITE.name}</p><p>{t("footer.version", { version: __APP_VERSION__ })}</p></div>
      <p>{t("footer.disclaimer")}</p>
    </div>
    <CoffeeLink />
  </div>
  <div className="site-footer__bottom">
    <div className="site-footer__info">
      <div className="site-footer__tmdb">logo + <p lang="en">…</p></div>
      <p>{fonts}</p>
      <p>{t("footer.copyright", { year })}</p>
    </div>
    <nav className="site-footer__legal" aria-label={t("footer.legal")}>Privacy · Accessibilità · Preferenze privacy</nav>
    <span className="site-footer__made" lang="en">Made in Italy</span>
  </div>
</footer>

// CoffeeLink.tsx: stessa <p><a>, dentro tre <span>: tondo con la tazza, testo, freccia (ArrowUpRight, aria-hidden)
<p className="coffee-card"><a href={SITE.coffeeUrl} target="_blank" rel="noreferrer">
  <span className="coffee-card__art" aria-hidden><Coffee /></span>
  <span className="coffee-card__text">{t("footer.coffee")}</span>
  <span className="coffee-card__go" aria-hidden><ArrowUpRight /></span>
</a></p>

// CoffeeLink.less (sostituisce .coffee-link)
.coffee-card { margin: 0; max-width: 26rem; border-radius: var(--r-xl); background: var(--highlight); a { display: flex; align-items: center; gap: var(--sp-4); min-height: var(--hit); padding: var(--sp-5) var(--sp-6); color: var(--ink-static); text-decoration: none; &:focus-visible { outline: var(--focus-on-inverse); outline-offset: 3px; } &:hover .coffee-card__text { text-decoration: underline; } } }
.coffee-card__art { flex: none; display: grid; place-items: center; width: 4.5rem; height: 4.5rem; border-radius: var(--r-pill); background: var(--ink-static); color: var(--highlight); svg { width: 2rem; height: 2rem; } }   // qui va l'immagine, se arriva
.coffee-card__text { .display-font(); font-size: var(--fs-h3); line-height: 1.15; .desktop({ font-size: var(--fs-h4); line-height: 1.1; }); }
.coffee-card__go { flex: none; margin-left: auto; svg { width: 1.5rem; height: 1.5rem; } }

// AppFooter.less (sostituisce .site-footer__columns e .site-footer__legal; .site-footer resta panel con il suo padding e il posto per le pillole)
.site-footer { gap: var(--sp-10); }
.site-footer__top { display: grid; gap: var(--sp-8); .desktop({ grid-template-columns: 1fr auto; column-gap: var(--sp-10); align-items: center; }); }
.site-footer__about { display: flex; flex-direction: column; gap: var(--sp-3); max-width: 36rem; p { margin: 0; color: var(--muted-on-dark); } }
.site-footer__bottom { display: grid; grid-template-areas: "legal" "info" "made"; gap: var(--sp-6) var(--sp-10); padding-top: var(--sp-8); border-top: 1px solid var(--panel-2); font-size: var(--fs-label); @media (min-width: 48em) { grid-template-columns: 1fr auto; grid-template-areas: "info legal" "info made"; } }
.site-footer__info { grid-area: info; display: flex; flex-direction: column; gap: var(--sp-3); color: var(--muted-on-dark); p { margin: 0; } }
.site-footer__tmdb { display: flex; align-items: center; gap: var(--sp-4); max-width: 32rem; }
.site-footer__legal { grid-area: legal; display: flex; flex-wrap: wrap; gap: 0 var(--sp-6); @media (min-width: 48em) { justify-content: flex-end; } a, .btn { display: inline-flex; align-items: center; min-height: var(--hit); padding: 0; font-size: var(--fs-label); font-weight: 600; color: var(--on-dark); text-decoration: underline; } }
.site-footer__made { grid-area: made; justify-self: end; align-self: end; margin: 0; white-space: nowrap; }   // perde il margin-left: auto di oggi

// motion.less: l'hover del titolo solo sul logo dell'intestazione
.site-header .wordmark:hover { … }   // al posto di .wordmark:hover
```

- **Titolo che cambia colore al mouse** (BACKLOG §5): `.wordmark:hover` (`motion.less`) colpisce anche il `<p class="wordmark wordmark--large">` del piè di pagina, che non è un link: limita l'hover al logo dell'intestazione (`.site-header .wordmark:hover`).
- **`lang="en"`** sul paragrafo TMDB. **Versione:** `vite.config.ts` → `define: { __APP_VERSION__: JSON.stringify(pkg.version) }` + dichiarazione di tipo.
- **Contrasto forzato:** la scheda gialla perde lo sfondo: in `forced-colors.less` `.coffee-card { border: 1px solid ButtonText; }` e `.coffee-card__art { forced-color-adjust: none; border: 1px solid ButtonText; background: Canvas; color: CanvasText; }`.
- Contrasto: `--muted-on-dark` su `--panel` fa 8,26 in chiaro e **4,55** nel tema scuro (soglia 4,5): non scurire il pannello. I link nelle frasi del TMDB e dei caratteri sono in linea (WCAG 2.5.8 li esclude).
- Verifica: 390, 320 e 1280 px, chiaro e scuro, cinque lingue (fr e de), con e senza `coffeeUrl`, tastiera (Tab: caffè, TMDB, licenza caratteri, Privacy, Accessibilità, Preferenze privacy).
- **DESIGN.md:** nessuna deviazione prevista; poi cancella la voce 29 da HANDOFF §2 e riportala in §5.

## Voce 30 · Admin: «Da fare» e «Stato del sito» in testa, code a fisarmonica

File: `src/features/admin/components/AdminDashboard/AdminDashboard.tsx` (r.40-66) e `.less`, `MaintenanceSection`, `AutomationSection`, `UsersSection`, `CandidatesSection`, `ReleaseDatesSection`, locale. **Il contenuto di ogni coda non cambia** (stessi pulsanti, stessi popup); cambia l'ordine e il contenitore.

Perché: `/admin` oggi è sette sezioni aperte in colonna (circa 22.000 px su telefono secondo l'audit, 22 pulsanti nei contenuti e 69 nelle date) con «Stato del sito» **in fondo** e nessun riepilogo. Proposta: due livelli. Misurato nel canvas: tutto chiuso 851 px a 390 px; con una coda aperta 1175 px; 807 px a 1280 px.

1. **«Da fare»** (scheda): quattro righe-link (`<a href="#candidati">`…): «Nuovi titoli da valutare», «Contenuti da completare» (`admin.todo.heading`, esiste), «Date da controllare», «Suggerimenti da leggere», ognuna con il numero in grassetto e il chevron; se il numero è zero, una spunta (`Check`) **e** il testo «Niente da fare» per i lettori di schermo (`admin.summary.none`, visivamente nascosto). I conteggi esistono già (`buildAdminTitles`, `todo.summary`, `candidates`, `suggestions`): nessuna logica nuova, solo un oggetto con i quattro numeri.
2. **«Stato del sito»** (scheda, a destra di «Da fare» da 64 em): `Manutenzione`, `Attività automatiche` e `Iscritti` **non sono più tre sezioni**: una riga «Sito online» / «Manutenzione attiva» col pulsante (stessa conferma `ConfirmDialog` di oggi), poi una scheda dei fatti (`dl`): attività giornaliera (esito e data), attività settimanale, token TMDB, iscritti (totale e nuovi). Quando qualcosa non va lo dice **con icona e parole** (`TriangleAlert`: «In ritardo», «Manutenzione attiva»), non solo col colore.
3. **Le quattro code** (`Nuovi titoli su TMDB` = `admin.heading`, `Contenuti da completare`, `Date di uscita`, `Suggerimenti`) come fisarmoniche chiuse: `<details className="phase card">` come `PhaseSection` (titolo `.phase__name`, riga di contesto `.phase__years` dove c'è già un testo: `candidates.lastSearch`, `todo.summary`; numero `.phase__count`; chevron). L'hash `#candidati` che c'è già apre la coda; aperta o chiusa **non si salva**. **«Date di uscita» mostra dieci righe per volta** con «Mostra altri 10» (`todo.more`).
4. **Token TMDB mancante: una volta sola**, nello «Stato del sito». `candidates.unreliable.noToken` si accorcia («Ricerca ferma: vedi lo Stato del sito.»). `admin.todo.intro` si riscrive (era oscura).

```less
.admin { display: flex; flex-direction: column; gap: var(--sp-4); max-width: 72rem; margin: 0 auto; }
.admin__top { display: grid; gap: var(--sp-3); .desktop({ grid-template-columns: 1fr 1fr; align-items: start; }); }
.admin__queues { display: flex; flex-direction: column; gap: var(--sp-2); }
.admin-row { display: flex; align-items: center; gap: var(--sp-3); min-height: var(--hit); padding: var(--sp-1) var(--sp-3); border-radius: var(--r-sm); color: var(--ink); text-decoration: none; .tones(var(--row-hover), var(--row-press)); }
.admin-row__l { flex: 1; min-width: 0; }
.admin-row__n { white-space: nowrap; }
.admin-facts { display: flex; flex-direction: column; gap: var(--sp-2); margin: 0; padding: var(--sp-3) var(--sp-4); border: 1px solid transparent; border-radius: var(--r-sm); background: var(--row); font-size: var(--fs-label); }
.admin-facts > div { display: flex; justify-content: space-between; gap: var(--sp-3); }
.admin-facts dt { color: var(--ink-2); }
.admin-facts dd { margin: 0; font-weight: 700; text-align: right; }
// le code: .phase.card con il sommario a riga (titolo, contesto, numero, chevron); riusa PhaseSection.less
```

- Titolo della pagina come `.saga__title` (Anton). **Nessun componente nuovo** oltre a tre piccoli blocchi (riga di «Da fare», scheda dei fatti, riga di stato).
- Testi: `TESTI_ADMIN.md` (`admin.summary.heading`, `.candidates`, `.dates`, `.suggestions`, `.none`; `admin.todo.intro` riscritta; `admin.candidates.unreliable.noToken` accorciata). Per «Date da controllare» e «Suggerimenti da leggere» le righe di «Da fare» sono nuove; il resto riusa le chiavi esistenti.
- Verifica: 390 e 1280 px, chiaro e scuro, tutti gli stati (online, manutenzione, attività in ritardo, token mancante, nessuna cosa da fare), tastiera (Tab nelle fisarmoniche, Invio apre; Tab sulle righe di «Da fare»), contrasto forzato (la scheda dei fatti ha un bordo trasparente). Test: un test del conteggio di «Da fare» se estrai una funzione; altrimenti nessuno nuovo.
- **Non verificato da Design:** la pagina vera con dati veri, Safari e Firefox, i lettori di schermo sulle fisarmoniche.
- **DESIGN.md:** riga in «Deviazioni»: `Admin | AdminDashboard | «Da fare» e «Stato del sito» in testa, code a fisarmonica (Manutenzione, Automazione e Utenti confluiti nello Stato) | voce 30 di HANDOFF §2`. Poi cancella la voce 30 da HANDOFF §2 e riportala in §5.
