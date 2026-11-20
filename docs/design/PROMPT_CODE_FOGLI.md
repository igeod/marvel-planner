# Prompt per la sessione Code: fogli in basso e regola di chiusura dei popup (voce 26)

Sei la sessione **Code** di Marvel Planner. Questo prompt è autosufficiente: non vedi la chat di Design. Il canvas con scene, tabelle e alternative sta in `docs/design/canvas/Popup generici.dc.html` (sezione «Decisione · fogli in basso e regola di chiusura dei popup (voce 26)», chip «proposta · non implementata»); la voce 26 è in `docs/design/HANDOFF.md` §2 e in `CHANGELOG.md`. Dove il canvas e il codice su `main` differiscono vale il codice.

## Regole (CLAUDE.md di radice, valgono sempre)

- Lavora su `main`, niente branch nuovi. Commit e push solo se richiesti.
- Cambia il minimo che risolve. Niente astrazioni, opzioni, dipendenze non richieste.
- **Solo token esistenti** (`src/styles/tokens.less`), con **una** eccezione proposta: `--sheet-gap` (vedi sotto). Se non è approvata dal committente, usa `3rem` dove serve e fermati.
- CSP rigida: niente stili inline o script inline; `style.setProperty` da codice (come in `AccountSettings.tsx` r.142-154) è ammesso. Icone solo Lucide.
- **Mai anello di focus rosso.** Chiaro e scuro, 390 e 1280 px, contrasto forzato (`forced-colors.less`).
- Nessun testo nuovo. Prima di dire «fatto»: `npm run lint`, `npm test`, `npm run build`, `npm run format:check`.

Stato di partenza: il codice letto da Design è quello di 4bfbea4 (`Modal` con `useSheetDrag`). **4bfbea4 non è su `main`** quando questo prompt è stato scritto: se manca, parti da lì o chiedilo al committente. I numeri di riga sono di 4bfbea4.

## Cosa fare, nell'ordine

### 1 · Token e altezza dei fogli

File: `src/styles/tokens.less`, `src/components/ui/Modal/Modal.less` (r.104 e r.108, dentro `@media (max-width: 39.9375em)`), `src/features/planner/components/FiltersSheet/FiltersSheet.less` (r.7), `src/features/account/components/AccountSettings/AccountSettings.less` (r.24-25).

```less
// tokens.less (NUOVO): il 48 px di oggi, scritto a mano in tre file, con un nome e il margine di sicurezza in alto
--sheet-gap: max(3rem, calc(env(safe-area-inset-top, 0px) + var(--sp-2)));
```

- Modal (sotto 40em): `dialog.dialog` e `.dialog__scroll` → `max-height: calc(var(--viewport-height, 100dvh) - var(--sheet-gap));`
- Filtri: `max-height: calc(var(--viewport-height, 100dvh) - var(--sheet-gap));` (era `100dvh - 24px`: i Filtri passano da 24 a 48 px dal bordo alto).
- Account: stessa espressione, mantenendo il tetto: `height: min(760px, calc(var(--viewport-height, 100dvh) - var(--sheet-gap)));` e `max-height` come sopra. **Il tetto da 760 px resta** (la scheda ha altezza fissa; a 844 px lascia 84 px, a 932 px 172: è voluto).
- `--viewport-height` oggi la imposta solo `AccountSettings.tsx` (r.142-154, `window.visualViewport`). Estrai quel codice in un gancio comune (`useViewportHeight(getDialog, isEnabled)`) e usalo da `Modal` (sotto 40em, a popup aperto), da `FiltersSheet` e da `AccountSettings`. Nessuna logica nuova: solo spostata.

Perché: con `100dvh` e il foglio ancorato in basso, quando la barra di Safari si ritira o compare la tastiera la finestra può cambiare senza che il foglio segua (cause 1 e 4 di D4 nell'audit); i popup con campi (Accesso, Suggerisci) hanno lo stesso problema che l'Account ha già risolto.

### 2 · Margini di sicurezza

- Filtri (`FiltersSheet.less` r.17): `padding: 1.25rem var(--sp-6) calc(1.5rem + env(safe-area-inset-bottom, 0px));` (oggi «Mostra N titoli» sta a 24 px dal bordo, sull'indicatore di Home).
- Menu (`HeaderMenu.less` r.23): `padding: calc(var(--sp-2h) + env(safe-area-inset-top, 0px)) 1rem 1.5rem;`
- Ai lati: **nessuna modifica** (un foglio esiste solo sotto 40 em, in portrait, dove l'inset laterale è 0; in orizzontale il popup è centrato, largo al massimo 35 rem).

### 3 · Scorrimento oltre il fondo

`Modal.less`, regola `.dialog__scroll` (r.26-31): aggiungi `overscroll-behavior: contain;` (oggi lo ha solo `.sheet-surface()` in `mixins.less` r.77, cioè Filtri e Menu): il rimbalzo non deve scoprire lo sfondo sotto il foglio.

### 4 · Titolo e X dei Filtri

`.filters-sheet__title` in `FiltersSheet.less` e la testata `.filters-sheet__header` in `FiltersSheet.tsx`: il titolo passa da Anton 36 px (`.display-font()`, `--fs-h1-sm`) a Hanken 800 `--fs-h4`, `line-height: 1.2` (come `.dialog__header h2`); la X va a 12 / 12 dal bordo, 44 × 44, come `.dialog__close` di `Modal.less` r.46-62 (riusa la classe se puoi, altrimenti la stessa regola). Anton è per titoli di pagina e numeri grandi (`DESIGN.md`, Tipografia): non entra nei titoli lunghi di fr e de.

### 5 · Regola di chiusura (ConfirmDialog e canvas)

- `ConfirmDialog.tsx` (r.57-65): il clic sullo sfondo oggi **non** chiude (nessun `onClick` sul `<dialog>`); aggiungi, come in `Modal.tsx`: `onClick={(event) => { if (event.target === event.currentTarget && !isPending) finish(onCancel)(); }}` (equivale ad «Annulla», non si fa mentre una richiesta è in corso).
- Nessuna maniglia né trascinamento nelle conferme (non hanno testata: invariato).
- Nessuna nuova conferma di uscita: resta quella dell'Account (`tryClose`, `AccountSettings.tsx` r.119-124). Suggerisci tiene la bozza in memoria (`SuggestForm.tsx` r.15-16).
- Verifica che `ImportSharedDialog` non si chiuda con Esc, sfondo o trascinamento mentre una richiesta è in corso (come Account e ConfirmDialog).

### 6 · Contrasto forzato

`forced-colors.less`: `.dialog__header::before { forced-color-adjust: none; background: GrayText; }` (la maniglia: oggi, essendo uno sfondo, sparisce; verificato con l'emulazione di Chromium).

## Verifica

**Su iPhone vero, prima di dire «fatto»** (Design non ha potuto provare nulla su Safari): (1) aprire Accedi e scorrere con la barra di Safari che si ritira: il bordo inferiore resta attaccato? (2) tastiera aperta su Suggerisci e su Accedi: il campo resta visibile? (3) rimbalzo oltre il fondo: si vede il fondo pagina sotto il foglio? (4) Filtri: «Mostra N titoli» sopra l'indicatore di Home? Se (1) persiste dopo il punto 1, prova a togliere `overflow: hidden` dal `<dialog>` mettendo il raggio sul contenitore che scorre (causa 2 di D4).
Poi, in Chromium, chiaro e scuro, 390 e 1280 px: i tre fogli (generico, Filtri, Account) a 667, 844 e 932 px di altezza (distanza dal bordo alto 48, 48, 48 / 48 / 84 / 172 per l'Account), titoli dei Filtri in cinque lingue (fr e de non vanno a capo male), trascinamento che chiude ancora tutti i fogli, sfondo che chiude la conferma, contrasto forzato (maniglia visibile).
Test automatici: nessuno nuovo (CSS e un gancio spostato; se estrai il gancio non serve un test).

## DESIGN.md e HANDOFF

- **Aggiungi** in `DESIGN.md`, «Deviazioni»: `Fogli in basso | Modal, FiltersSheet, AccountSettings | altezza = viewport visivo − --sheet-gap; Account con tetto 760 px | voce 26 di HANDOFF §2` e, in Tipografia, che i titoli dei fogli sono Hanken 800 `--fs-h4`.
- Poi cancella la voce 26 da HANDOFF §2, riportala in §5 e metti il chip «implementata · main <commit>» nel blocco del canvas; correggi nel canvas il blocco «quando la X c'è e quando no» (già annotato).
