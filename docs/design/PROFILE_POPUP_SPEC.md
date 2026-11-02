# Profile popup: specifica esatta

Fonte di verità: `Profile Popup.dc.html`. Valori misurati con `getBoundingClientRect` / `getComputedStyle` sul dialog desktop alto 640px, tema chiaro, scrollbar assente. Coordinate `@x,y` relative all'angolo in alto a sinistra del dialog. Tolleranza: 0px. Ogni colore è un token di `tokens.css` (tema chiaro in parentesi). Mai valori a mano se esiste il token.

Token usati: `--ink` #14171F, `--ink-2` #4D5465, `--surface` #F7F8FA, `--bg` #E9ECF1, `--row-hover` #DCE0E8, `--disabled` #CDD2DC, `--accent` #C8202B, `--highlight` #F2B01E, `--ink-static` #14171F, `--on-dark` #F2F4F8, `--white` #FFF, `--line` rgba(20,23,31,.12). Font: Anton (titoli, numeri, iniziale), Hanken Grotesk (resto). Raggi: `--r-pill` 999, `--r-xl` 32, `--r-md` 24, `--r-input` 16, `--r-row` 22, `--r-sm`, `--r-hair`. Spazi: `--sp-1` 4, `--sp-2` 8, `--sp-3` 12, `--sp-4` 16, `--sp-5` 20, `--sp-6` 24, `--sp-8` 32, `--pad-popup` 28.

## 1. Dialog (desktop ≥ 640px di larghezza viewport)

- 800×640 (max `calc(100vw − 32px)` × `calc(100vh − 64px)`), riga: sidebar + contenuto. Sfondo `--surface`, testo `--ink`, raggio `--r-xl`, `overflow:hidden`, ombra `0 24px 64px rgba(20,23,31,.28)` (tema scuro: nessuna).
- `role="dialog"`, `aria-modal="true"`, `aria-labelledby="pf-t"`, `tabindex="-1"`.
- Velo: `inset:0`, `rgba(20,23,31,.6)` (scuro `rgba(0,0,0,.55)`), contenuto centrato, padding `32px 16px`. Clic sul velo chiude, clic nel dialog no (`stopPropagation`).
- Entrata/uscita: velo opacità 180ms, dialog `translateY(8px) scale(.96)` → none in 200ms, entrambi `cubic-bezier(.23,1,.32,1)`. Chiuso: `visibility:hidden` con ritardo 200ms, `pointer-events:none`, nessun elemento raggiungibile con Tab.

## 2. Sidebar

- `aside` @0,0 260×640, `--bg`, padding 24px 16px, colonna con gap 24px (`--sp-6`).
- Intestazione @16,24 228×107: padding `0 8px`, colonna, gap 12px.
  - Avatar @24,24 64×64, cerchio `--accent`, iniziale in maiuscolo Anton 30px/400 `--white`, centrata (`aria-hidden`).
  - Nome @24,100: Anton 28px/400, maiuscolo, `letter-spacing:.01em`, interlinea 1.1, `overflow-wrap:break-word` (id `pf-t`). Valore: "CAPTAIN PIZZA" (testo "Captain Pizza" con `text-transform:uppercase`).
- Nav `aria-label="Profile sections"` @16,155 228×204, colonna, gap 4px (`--sp-1`).
- Tab: @16,155 / 207 / 259 / 311, ognuna 228×48, padding `0 16px`, gap 12px, pill, testo 15px/700 (`--fs-button`), icona Lucide 20px stroke 2.2 round, `aria-current="page"` sulla attiva. Testo nel tab a x=64.
  - Etichette e icone: **Progress** (`M3 3v18h18M7 15l4-4 3 3 5-6`), **Profile** (`M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z`), **Password** (`M5 11h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2zM7 11V7a5 5 0 0 1 10 0v4`), **Account** (`M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9`).
  - Stati: normale sfondo trasparente, testo `--ink-2`; hover `--row-hover` + `--ink`; selezionata `--ink` + `--surface`; selezionata in hover `color-mix(in srgb,var(--ink) 82%,#000)` + `--surface`; focus `outline:var(--focus)` offset `--focus-offset`; active `scale(.98)`. Transizione `background-color 120ms, transform 100ms`.
- Tab iniziale: Progress.

## 3. Pulsante Close (solo desktop)

`<button type="button" aria-label="Close">` @744,12 44×44, pill, sfondo `--bg`, icona X 20px, `stroke-width:2.4`, `stroke-linecap:round`, percorso `M6 6l12 12M18 6L6 18`. Hover `--row-hover`; active `scale(.94)`; focus `outline:var(--focus)` offset `--focus-offset`; transizione `background-color 120ms, transform 100ms`. Nel DOM sta **dopo** il contenuto (ordine Tab: sidebar, contenuto, Close), posizionato `absolute; top:12px; right:12px` nella sezione contenuto. Su mobile è visibile, stessa posizione `top:12px; right:12px` ma relativa al dialog (la sezione contenuto è `position:static` su mobile).

## 4. Area contenuto

Sezione @260,0 540×640, `position:relative`. Contenitore interno: padding `--pad-popup` (28px), colonna, gap 24px, `flex:1; min-height:0`. Contenuto utile @288,28, larghezza 484.
- Ogni h2: 24px/800, interlinea 1.2 (altezza 29px), margine 0, `padding-right:48px`.
- Profile, Password e Account hanno `overflow: hidden auto` (scorrono solo se il viewport è più basso di 704px). Progress ha `overflow:hidden` e scorre solo la sua lista interna.
- Scrollbar: da `tokens.css`, senza frecce (`::-webkit-scrollbar-button{display:none}`); le proprietà standard `scrollbar-width/color` solo in `@supports (-moz-appearance:none)`.

## 5. Scheda Progress

h2 "Your progress" @288,28 484×29. Sotto (gap 16px): contenitore a scorrimento `.scroll-y` @288,73 484×539, padding 2px, gap 16px, `scrollbar-gutter:stable`, `overscroll-behavior:contain`.

**Card riepilogo** @290,75 (larghezza 468), sfondo `--highlight`, testo `--ink-static`, raggio `--r-md` (24), padding 24px, gap 16px.
- Riga 1 (flex, `align-items:flex-end`, `justify-content:space-between`, gap 16px): a sinistra "Titles watched" 14px/700, sotto Anton 64px/400 "49" seguito da `<span>` Anton 32px " / 71"; a destra Anton 40px/400 "69%". Interlinea 1.
- Barra `role="progressbar"` `aria-valuenow="69"` `aria-valuemin="0"` `aria-valuemax="100"` `aria-label="Overall progress"` @314,200 420×12, pill. Traccia `--ink-static` opacità .18, riempimento `--ink-static` larghezza 69% (290px), pill.
- Riga 3 (flex, wrap, gap 16px, `align-items:center`): testo "Send friends a link to what you have watched." 16px/500, `flex:1 1 160px`; pulsante "Share progress" @530,228 204×56, pill, `--ink-static`, testo `--on-dark` 18px/800 (`--fs-title`), padding 0 24px, gap 10px, icona condividi 22px stroke 2.4 (`<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 10.6l6.8-4M8.6 13.4l6.8 4"/>`). Hover `--panel-2`; active `translateY(1px)`; focus outline 3px `--ink-static` offset 3px; transizione `background-color 120ms, transform 100ms`.
- Messaggio `role="status" aria-live="polite"` 14px/700 `overflow-wrap:anywhere`. Dopo il clic: copia negli appunti e mostra "Link copied: https://marvelplanner.app/u/captain-pizza".

**Gruppi** (colonna, gap 8px = `--gap`). Tre `<details>`, il primo `open`. Ognuno: sfondo `--bg`, raggio `--r-xl` (32), padding 10px.
- `<summary>` 448×65 (min-height 64 + 1), flex, `align-items:center`, gap 14px, padding `10px 16px 10px 18px`, raggio `--r-row` (22), hover `--row-hover`, transizione `background-color var(--dur-micro)`. Contiene: blocco testo `flex:1` con titolo `--fs-h3`/800 interlinea 1.2 (altezza 24) e sottotitolo `--fs-label` `--ink-2` (altezza 21); somma a destra 16px/700 `tabular-nums` (es. "49 of 71"); chevron 24px stroke 2.6 `stroke-linecap:square`, `M6 9l6 6 6-6`, ruota 180° quando aperto con `transition: transform var(--dur-std) var(--ease-out)`.
- `<ul>` margine-top 6px, `list-style:none`, griglia `repeat(auto-fit, minmax(min(100%, 300px), 1fr))` (By year: 200px), gap 6px. Riga `li` 448×71 (a 1 colonna): sfondo `--surface`, raggio 22, padding `12px 16px 14px`, colonna gap 10px. Riga 1: nome `--fs-title`/800 a sinistra, "x of y" 16px/700 `tabular-nums` a destra (gap 12px). Riga 2: barra 8px pill `--row-hover` con riempimento `--accent` (o `--highlight` se x = y), larghezza percentuale arrotondata.
- Dati:
  - **By phase**, sottotitolo "6 phases", somma "49 of 71": "1 · Phase One" 6 of 6; "2 · Phase Two" 6 of 6; "3 · Phase Three" 11 of 11; "4 · Phase Four" 18 of 18; "5 · Phase Five" 8 of 17; "6 · Phase Six" 0 of 13.
  - **By type**, "3 types", "49 of 71": Movies 33 of 40; Series 14 of 28; Special 2 of 3.
  - **By year**, "18 years", "49 of 71": 2008 2/2; 2010 1/1; 2011 2/2; 2012 1/1; 2013 2/2; 2014 2/2; 2015 2/2; 2016 2/2; 2017 3/3; 2018 3/3; 2019 3/3; 2021 9/9; 2022 9/9; 2023 7/7; 2024 1/5; 2025 0/8; 2026 0/7; 2027 0/3 (scritti "x of y").
- **Caricamento** (`dataState = loading`): stesso titolo; contenitore `aria-busy="true"`; testo nascosto `role="status"` "Loading your progress…"; resto `aria-hidden`. Card `--row-hover` con blocchi `--disabled` (112×14, 176×56, 72×40, barra 12px, riga 16px + pulsante 56px pill); tre gruppi `--bg` raggio 32 padding 10px con summary 64px e blocchi `--row-hover` (larghezze 180, 140, 210 × 20, sotto 96×14, a destra 48×16). Animazione `pf-pulse` 1.4s `ease-in-out` infinita (`50%{opacity:.55}`), azzerata con `prefers-reduced-motion`.

## 6. Scheda Profile

Colonna gap 24px. h2 "Profile".

**Form nome** @288,81 484×177, colonna, gap 8px:
- Riga etichetta @288,81 484×21 (flex, `justify-content:space-between`, gap 12px): `<label for="pf-hero">` "Superhero name" 14px/600; contatore `{n}/30` 14px/400 `--ink-2` `tabular-nums` (valore iniziale "13/30").
- `input#pf-hero` @288,110 484×48: `type="text" maxlength="30" autocomplete="nickname" spellcheck="false" aria-describedby="pf-hh"`, sfondo `--bg`, raggio 16, padding `0 16px`, 16px, nessun bordo, valore iniziale "Captain Pizza". Hover `box-shadow: inset 0 0 0 2px var(--row-hover)`; focus `outline:var(--focus); outline-offset:2px`.
- `div#pf-hh` @288,166 484×20: 13px/400 `--ink-2`: "Use a nickname, not your real name. It appears on your profile and shared links."
- Riga pulsante @288,209 (margin-top 16px = `--sp-4`), flex, gap 12px: `<button type="submit">` "Save name" 127×48, pill, padding 0 24, 16px/800. Messaggio `role="status"` 14px `--ink-2` che segue (nascosto se vuoto): "Name saved."
- Abilitato solo se il nome (trim) ha ≥ 3 caratteri ed è diverso dal salvato. Disabilitato: sfondo `--disabled`, testo `--ink-2`, `cursor:not-allowed`. Abilitato: tema chiaro `--accent` + `--white`; scuro `--highlight` + `--deepest`.

**Separatore** @288,281 484×1, `--line`.

**Form email** @288,306 484×157, colonna gap 8px:
- `label for="pf-email"` "Email" 14px/600.
- Contenitore @288,335 484×48 (`position:relative`, raggio 16, hover `inset 0 0 0 2px var(--row-hover)`), dentro `input#pf-email` `type="email" inputmode="email" autocomplete="email" autocapitalize="none" spellcheck="false"`, padding `0 56px 0 16px`, valore iniziale "steve.rogers@example.com", `aria-invalid`, `aria-describedby="pf-eh"`; pulsante "Clear email" @726,337 44×44 (`top:2px; right:2px`), pill, icona X 18px stroke 2.4 round, colore `--ink-2`, hover sfondo `--row-hover` + `--ink`, active `scale(.94)`, focus outline offset 0; visibile solo con testo; svuota il campo e riporta il focus sul campo.
- `div#pf-eh` `role="status"` 13px, altezza 0 se vuoto; errore: "! Enter your email." oppure "! Use an address like name@example.com." Sfondo errore del campo `color-mix(in srgb,var(--accent) 12%,var(--bg))`, validazione al blur, `aria-invalid="true"`.
- Riga pulsante @288,415 (margin-top 16px): "Update email" 144×48, stesso stile di "Save name"; messaggio "Email updated." Abilitato solo con email valida e diversa (trim).

## 7. Scheda Password

Un solo `<form>` @288,28 484×482, colonna, gap 20px (`--sp-5`). h2 "Password".
- Campo 1 @288,77 484×77 (gap 8px): label "Current password" @288,77; contenitore @288,106 484×48; `input#pf-p0` `autocomplete="current-password"`; occhio @726,108 44×44 `aria-label="Show current password"`.
- Campo 2 @288,174 484×160: label "New password"; `input#pf-p1` `autocomplete="new-password"` @288,203; occhio "Show new password"; elenco `ul#pf-rules` @288,259 484×67 (gap 4px, `list-style:none`), tre `li` 20px (icona 16px + testo 13px, gap 8px): "At least 8 characters", "A letter", "A number". Icona: non soddisfatta trattino `M7 12h10` `--ink-2`, soddisfatta spunta `M5 12l5 5L20 7` `--ink`, stroke 2.6 round; accanto, testo nascosto "Not met"/"Met". `div#pf-caps` `role="status"` 13px: "! Caps Lock is on." (altezza 0 se vuoto).
- Campo 3 @288,353 484×85: label "Confirm new password"; `input#pf-p2`; occhio "Show confirm password"; `div#pf-p2h` `role="status"`: "! Passwords do not match." (al blur, sfondo errore, `aria-invalid`).
- Tutti i campi: `autocapitalize="none" spellcheck="false"`, padding `0 56px 0 16px`. Occhi: pill 44×44 a `top:2px; right:2px`, `aria-pressed`, `aria-controls="pf-p0 pf-p1 pf-p2"`, icona occhio (`M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z` + cerchio r3) quando nascosta, occhio barrato quando visibile; stato condiviso tra i tre campi; stili come "Clear email".
- Testo di aiuto `p#pf-so` 13px `--ink-2`, sopra la riga del pulsante: "After you change your password, you will be signed out of your other devices." Il pulsante ha `aria-describedby="pf-so"`.
- Riga pulsante (dopo il testo di aiuto): "Change password" 177×48, messaggio "Password changed. You have been signed out of your other devices." Abilitato con password attuale non vuota, nuova ≥ 8 caratteri con una lettera e un numero, conferma uguale. Dopo l'invio i campi si svuotano e tornano nascosti.

## 8. Scheda Account

Colonna gap 24px, @288,28 484×505. h2 "Account".
- **Log out** @288,81 484×48 (flex, `justify-content:space-between`, gap 16px, `align-items:center`, wrap): testo "Log out" 16px/800 + "Your progress stays saved on your account." 14px `--ink-2`; pulsante "Log out" @644,81 128×48, pill, sfondo `--ink`, testo `--surface`, 16px/800, padding 0 24, gap 8px, icona 18px stroke 2.2 (`M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9`); hover opacità .88; active `scale(.98)`; focus outline. Messaggio `role="status"` "You have been logged out." (`display:none` se vuoto).
- Separatore @288,153 484×1 `--line`.
- **Your data** @288,178 484×109: riga flex (gap 16px, wrap) con testo "Your data" 16px/800 + "Download your profile, watched titles and settings as a JSON file." 14px `--ink-2`; pulsante "Export JSON" @288,239 169×48 (a capo perché il testo occupa lo spazio), pill, sfondo `--row-hover`, testo `--ink`, 16px/800, icona download 18px (`M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3`), hover `--disabled`, active `scale(.98)`, focus outline. Scarica `marvel-planner-data.json` con `{ exportedAt, profile:{ email }, watched:[], settings:{} }`; messaggio "File marvel-planner-data.json downloaded." oppure "Export failed. Try again."
- **Delete account** `<form role="group" aria-labelledby="pf-dz">` @288,311 484×222, sfondo `--bg`, raggio 24, padding 20px, colonna gap 12px:
  - Riga titolo @308,331 444×40, gap 12px: cerchio 40×40 `--accent` con icona cestino 20px bianca (`M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14`, stroke 2.2) + `div#pf-dz` "Delete account" 20px/800 (`--fs-h3`), interlinea 1.2.
  - Testo @308,383 444×45: 15px (`--fs-button`) `--ink-2`: "Your account, hero name and all watched marks will be removed. This cannot be undone. Enter your password to confirm."
  - Label "Password" 14px/600 @308,440 444×21 (gap con il campo 8px).
  - Riga @308,465 444×48, flex, gap 12px, wrap: contenitore campo @308,465 274×48 (`flex:1 1 220px`), `input#pf-dp` sfondo `--surface`, padding `0 56px 0 16px`, `autocomplete="current-password"`, occhio "Show password" @536,467; pulsante "Delete account" @594,465 158×48, pill, 16px/800, disabilitato finché il campo è vuoto (`--disabled` + `--ink-2`), abilitato `--accent` + `--white`. Messaggio "Account deleted." sotto (`role="status"`, nascosto se vuoto). Avviso Caps Lock come nella scheda Password.

## 9. Mobile (< 640px)

Dialog `100%` di larghezza, altezza `min(760px, visualViewport.height − 48px)` (ricalcolata al resize di `window` e `visualViewport`, così tastiera e barra del browser non coprono i campi; max `visualViewport.height − 48px`), ancorato in basso, raggio `--r-lg --r-lg 0 0`; colonna. Nessuna maniglia. Intestazione e tab in riga: sidebar padding `28px 12px 8px`, gap 12px; intestazione con `padding-right:52px` per lasciare spazio alla X; avatar 44px (iniziale 22px); nome Anton 22px; tab alte 44px in riga con scorrimento orizzontale (`overflow-x:auto`, `overscroll-behavior-x:contain`); al cambio tab la tab attiva viene centrata con `scrollLeft`. **La X (44×44) è presente.** Swipe-down: su `touchstart`/`touchend` dell'`aside`, se Δy > 70px e |Δx| < 40px, chiude (con la stessa logica di conferma della sez. 12). Contenuto padding `20px 20px calc(20px + env(safe-area-inset-bottom))`; card Progress padding 20px, numero Anton 48px, pulsante "Share progress" `flex:1 1 100%`. Entrata `translateY(100%)`. Velo senza padding.

## 10. Tema scuro e motion

`data-theme="dark"`: stessi nomi di token, valori da `tokens.css`; pulsanti primari `--highlight` + `--deepest`; focus ring `--highlight`; ombra del dialog assente. `prefers-reduced-motion`: transizioni e animazioni a `.01ms`.

## 11. Revisione usabilità e accessibilità (obbligatoria)

Tutte le regole sotto si aggiungono alle sezioni precedenti. Dove c'è conflitto, valgono queste.

**Focus e scroll**
- Aperto: focus sul dialog (`tabindex="-1"`). Tab e Shift+Tab ciclano solo dentro il dialog (focus trap; in produzione usare `inert` sul resto della pagina). Elementi con `tabindex="-1"`, `disabled` o non visibili sono esclusi.
- Mentre è aperto: `document.body.style.overflow='hidden'`; ripristinato alla chiusura e allo smontaggio.
- Alla chiusura il focus torna al pulsante che ha aperto il dialog.
- Mobile: al `focus` di un campo, dopo 250ms il contenitore scorre in modo che il campo sia a ≥16px dai bordi visibili (no `scrollIntoView`).

**Chiusura e modifiche non salvate**
- Si chiude con: X, Esc, clic sul velo, swipe-down (mobile). Tutti passano da `tryClose()`.
- "Dirty" = nome ≠ salvato, email ≠ salvata, oppure password attuale/nuova/conferma/password di eliminazione non vuote. Se dirty, il dialog non si chiude e compare il banner `role="alert"` in basso nel dialog (`left/right/bottom:12px`, sfondo `--ink`, testo `--surface`, raggio 24, padding 16, riga con wrap, gap 12): "You have unsaved changes." + due pulsanti 44px pill: **Keep editing** (sfondo `--surface`, testo `--ink`; chiude il banner e rimette il focus sul dialog) e **Discard** (trasparente, testo `--surface`, bordo `inset 0 0 0 2px --surface`; chiude, ripristina nome/email salvati, svuota password e messaggi). Focus ring `3px --highlight` offset 2.

**Tab (pattern WAI-ARIA tabs)**
- `nav` ha `role="tablist"` e `aria-orientation` (`vertical` desktop, `horizontal` mobile). Ogni tab: `id="pf-tab-{progress|profile|password|account}"`, `role="tab"`, `aria-selected` (non più `aria-current`), roving tabindex (`0` sulla selezionata, `-1` sulle altre).
- Frecce Destra/Giù = successiva, Sinistra/Su = precedente (circolari), Home/End = prima/ultima; la tab si attiva e prende il focus.
- Il contenitore del contenuto ha `role="tabpanel"` e `aria-labelledby` = id della tab attiva.

**Pulsanti di invio non validi**
- Niente `disabled`: si usa `aria-disabled="true"` (restano focalizzabili), stile disabilitato invariato. Se si invia da non valido, si mostra il motivo nel messaggio di stato accanto al pulsante:
  - Save name: "Enter at least 3 characters and a name different from the saved one."
  - Update email: "Enter a valid email different from the current one."
  - Change password: "Fill in all fields. The new password needs 8+ characters, a letter and a number, and both new passwords must match."
  - Delete account: "Enter your password to continue."
- La modifica di un campo azzera i messaggi.

**Regioni live**
- I messaggi `role="status"` di Password, Account (logout, export, eliminazione) restano **sempre nel DOM**. Vuoti sono nascosti visivamente (`position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)`), non con `display:none`. Anche `#pf-eh`, `#pf-caps`, `#pf-p2h` e il messaggio Share restano sempre presenti.

**Share progress**
- Mobile con `navigator.share`: apre la condivisione nativa (`{url, title:'My Marvel Planner progress'}`) e al successo mostra "Shared.". Altrimenti `await navigator.clipboard.writeText(url)` e solo dopo l'esito mostra "Link copied: <url>". Su errore: "Could not copy. Link: <url>". `AbortError` (annullamento) non mostra nulla.

**Tipografia**
- Testi di aiuto/caption (`#pf-hh`, `#pf-eh`, `#pf-so`, righe regole password, avvisi) sono **14px** (prima 13px; sostituisce ogni "13px" delle sezioni 6–8).

**Da fare in produzione (non nel mock)**
- Zona pericolosa: token dedicato "danger" distinto da `--accent` (avatar e barre usano già il rosso) e conferma più forte per eliminare l'account (digitare "DELETE" o secondo passaggio). Verifica della password lato server.
- Stati hover solo con `@media (hover:hover)` per evitare hover appiccicoso su touch.
- Verifica manuale con VoiceOver/TalkBack e solo tastiera.

## 12. Script di verifica

Esegui nella console, per ogni scheda, sul riferimento e sul sito, e confronta l'output riga per riga:

```js
const d=document.querySelector('[role=dialog]'),D=d.getBoundingClientRect();
[...d.querySelectorAll('*')].filter(e=>!(e instanceof SVGElement)).map(e=>{const r=e.getBoundingClientRect(),s=getComputedStyle(e);
return [e.tagName,e.id,(e.getAttribute('aria-label')||''),Math.round(r.left-D.left),Math.round(r.top-D.top),Math.round(r.width),Math.round(r.height),s.fontSize,s.fontWeight,s.color,s.backgroundColor,s.padding,s.borderRadius,s.gap].join('|')})
```


## 13. Decisioni di revisione (stati, password, Delete account, banner, swipe)
- **Indicatore "At least 8 characters"** sotto la nuova password. Tre stati: trattino "–" in --ink-2 (vuoto, o in digitazione sotto 8); spunta in --ink, peso 700, appena si raggiungono gli 8; X in --danger, stroke 2.6, solo dopo blur o invio con meno di 8. Dopo il primo errore la X resta live finché non si raggiungono gli 8. Se si torna sotto 8 durante la digitazione (dopo averli raggiunti) torna il trattino fino al blur. Nessuna animazione: il segno cambia subito. Icona aria-hidden, testo "At least 8 characters" costante e uno span nascosto "met" o "not met" nel role=status.
- **Errore sotto "Confirm new password"**: compare al blur del campo Confirm o all'invio, con fade 180ms. Da quel momento è valutato live su entrambi i campi: sparisce subito appena coincidono (anche modificando l'altro campo) e riappare subito se smettono di coincidere. Prima del primo blur nessun errore.
- **Riquadro Delete account**: padding interno 20px (--sp-5); icona e titolo sulla stessa riga; gap 16px tra titolo e testo, 20px tra testo ed etichetta, 8px tra etichetta e campo; campo e pulsante alti 48px, gap 12px; nessuno spazio riservato sotto: il role=status è l'ultimo elemento e occupa spazio solo quando c'è un messaggio (fade 180ms, nessuna animazione di altezza); padding inferiore 20px. Colori: --danger (#B3261E light, #F2766E dark), testo del pulsante --on-danger (#fff light, #14171F dark).
- **Banner "unsaved changes"**: sfondo --ink e testo --surface in entrambi i temi (invertito: avviso), focus ring --focus-on-inverse (highlight in light, --ink-static in dark; il giallo su banner chiaro non va).
- **Swipe-down mobile**: il popup segue il dito come il foglio filtri. Soglia 80px oppure velocità ≥ 0,5 px/ms con almeno 24px; dall'intestazione (56px), o dal contenuto solo con scrollTop 0 e gesto verso il basso; verso l'alto resistenza max 12px; velo che si schiarisce in proporzione. Rilascio in 180ms ease-out. Superata la soglia con modifiche non salvate: torna a posto e compare il banner.
- **Pulsanti**: aria-disabled = --disabled / --on-disabled, no hover e active, cursor not-allowed, ring visibile; loading = aspetto pieno, aria-busy e aria-disabled, spinner dopo 200ms (--delay-pending).
