# Marvel Planner: report Fase A (solo analisi, nessuna pagina modificata)

Metodo: ho letto tokens.css, le 34 pagine .dc.html della radice, tokens.less, motion.less, mixins.less, SelectField.less, Tooltip.less, Modal.less. Ho fatto grep su durate, curve, ombre ed esadecimali in tutte le pagine e in tutto src/.
Non ho ancora confrontato riga per riga Pagina Film, Profile Popup e Buttons con i loro .less: dove lo dico, è "da confermare".

Premessa: le pagine sono 34, non 33 (la 34ª è `Spec Riga Aperta Hover`, che non carica nemmeno tokens.css).

## Il problema in una frase
Il progetto ha **due sistemi di valori** che si fanno concorrenza:
- **Sistema A** (tokens.css, Motion, Select, Tooltip, Popup, Accordion): ease `.23,1,.32,1`, hover 120ms, chevron 180ms.
- **Sistema B** (Planner.dc.html, Spec Riga Aperta Hover, tokens.less e motion.less del codice): ease `.22,1,.36,1`, hover 200ms, riga 350ms, chevron 400ms, reveal 380ms.

In più ci sono **5 copie di tokens.css** e 4 cartelle `handoff_*` con copie di pagine. Claude Code può leggere una copia vecchia.

---

## 1. Tabella delle pagine

Legenda "scritti a mano": HEX = colori esadecimali distinti (occorrenze totali tra parentesi se alte), OMBRA = stringa di `--shadow-card` ricopiata a mano, MS = durate o curve letterali.

| Pagina | Cosa definisce | Duplica | Troppo vaga? Cosa manca | Scritti a mano |
|---|---|---|---|---|
| Index | indice | elenca pagine che non esistono come guide (Components) | sì: nessun valore, va generato | 0 |
| Typography | font, scala, regole testo | scala già in tokens.css (`--fs-*`) | no | 0 |
| Colors | palette chiaro/scuro, contrasti | token già in tokens.css | manca scuro per badge/chip/barre; mancano `--primary*`, `--row-press`, `--scrim` | HEX 22 (legittimo: è la definizione) |
| Spacing | scala spazi, raggi, forma, mini-demo | raggi ripetuti in Radius e Boxes; padding ripetuto in Boxes | no, ma è la più grande delle fondamenta (26 KB) | OMBRA ×14, MS (100/120/180/240) |
| Radius | scala raggi 2→999 | Spacing, Boxes | no | 0 |
| Boxes | tipi di box, padding, margini | Spacing, Radius | regola padding in conflitto con Radius (C13) | HEX 4 (`#fff` per "card chiara") |
| Layout grid | 12/8/4 colonne, gutter 8 | Responsive (margini 48/32/16) | sì: solo 6 righe, nessun esempio | 0 |
| Responsive | breakpoint 640/1024 | Layout grid, tokens.css (`--page-margin`) | sì: non dice cosa cambia per componente | 0 |
| Buttons | bottoni, switch, spunta, spinner | Select (trigger), States | no (36 KB, ma contiene anche switch e check che non sono bottoni) | HEX 18, OMBRA ×7, MS (80…800) |
| States | stati interattivi generici | Buttons, Select, Textfield: ogni componente ha già i suoi stati | sì: stati senza componente | HEX 5, MS (150, 700) |
| Textfield | campo, label, errore | Components | no | MS (1) |
| Select | trigger, lista, opzioni, compatta | Components ("Select"), Planner/Profile (lista rifatta a mano) | sì: manca scuro, manca ombra lista, manca scroll, manca touch | HEX 10, OMBRA ×4, MS + curva inline |
| Accordion | fase, testata, contenuto, spunta | Components ("Accordion"), Lists (riga), Spec Riga | no, ma durate proprie (C4) | HEX 9 (31 occ.), OMBRA ×6, MS (150/220) |
| Tooltip | InfoTip, tono, posizioni | Components ("Tooltip") | no | OMBRA ×3 |
| Toast | toast + stato vuoto | System states ("Successo", "Vuoto") | due cose in una pagina | OMBRA ×4, MS (140) |
| Popup | dialog, sheet, 9 varianti messaggio | Components ("Popup"), Profile Popup | no (55 KB, 690 `var()`) | OMBRA ×19, scrim `rgba(20,23,31,.6)` ripetuto, MS |
| Profile Popup | schermata di riferimento | usa Popup, Textfield, Select | da confermare | 0 HEX (ottimo) |
| Planner | schermata di riferimento + select lingua | rifà header, select, riga, fase a mano | sì: i valori sono quelli del Sistema B | HEX 20, MS `.2s/.35s/.4s/.38s`, curva `.22,1,.36,1` |
| Pagina Film | schermata di riferimento | rifà accordion e blur spoiler | da confermare | HEX 3, MS 220ms |
| Components | riepilogo input/select/accordion/tooltip/toast/popup | **duplica 6 pagine** e le contraddice (C9, C10, C11, C12) | da eliminare | HEX 3 |
| Examples | demo dal vivo | Planner, Buttons | duplicato di Planner | HEX 4, OMBRA, MS 150 |
| Navigation | header, voci, menu mobile | Planner (header rifatto) | sì: manca scuro, manca stato attivo mobile, manca menu aperto con motion | HEX 5, MS 150 |
| Badges | badge, tag fase, contatore | — | sì: tabelle in HEX solo chiaro, nessun esempio, nessun scuro | HEX 7 |
| Progress | barra, etichetta, ARIA | Motion (600/240), Planner | sì: nessun scuro in token, nessuna anteprima | HEX 3, MS 600 |
| Lists | riga, chip filtro | Accordion, Spec Riga | sì: solo tabella JSON | HEX 3 |
| System states | vuoto, skeleton, errore, offline | Toast (vuoto), Popup (offline) | sì: skeleton 1.2s in conflitto (C8) | HEX 3 |
| Images | rapporti poster, placeholder | — | sì: tabella senza esempi | HEX 3, MS 200 |
| Icons | set Lucide | — | no | 0 |
| Scrollbar | token e implementazione | tokens.css e base.less | no, ma strategia diversa dal codice (C16) | HEX 1 |
| Motion | durate, curva, schede overlay, mappa vecchio→nuovo | **tutte le pagine** che citano durate | è la pagina madre, ma 55 KB e non copre il Select | 0 HEX, ms nel demo |
| Accessibility | requisiti minimi, tono testi | Content | accorpa due temi | 0 |
| Content | formati dati | Accessibility ("Numeri e date") | sì: poche righe | 0 |
| Spec Riga Aperta Hover | gradiente sul bordo della riga aperta | Accordion, Lists | non carica tokens.css, 17 HEX (90 occ.), tutto a mano | HEX 17, MS 80/200/350 |

Copie fuori radice (rischio per Claude Code):
- `design_handoff_marvel_planner_restyle/design-files/tokens.css` ha `--ease-out .2,.8,.2,1`, `--ease-in .4,0,1,1`, `--dur-micro 150`, `--dur-enter 280`. È **lì** che nasce la curva `.4,0,1,1` che citi.
- `Motion.dc.html` attuale la dichiara già eliminata ("`--ease-in` eliminato").
- Altre copie di tokens.css: `design_handoff_planner_homepage/`, `handoff_feedback_profilo/`, `motion_handoff/`.
- Copie di pagine: `motion_handoff/` (Buttons, Motion, Popup, States), `design_handoff_planner_homepage/` (Accordion, Buttons, Select, Spacing, Tooltip), `motion-update/Planner.dc.html`, `patch/`, `handoff_select_motion/`.

---

## 2. Contraddizioni tra pagine (una per riga: valore A (fonte) ≠ valore B (fonte))

| # | Elemento | Fonte 1 | Fonte 2 |
|---|---|---|---|
| C1 | Curva ease-out | `.23,1,.32,1`: tokens.css, Motion, Select, Popup, Accordion | `.22,1,.36,1`: Planner.dc.html, tokens.less |
| C2 | `--dur-hover` | 120ms: tokens.css, Motion ("colore 120ms") | 200ms: tokens.less; Planner `.2s`; Spec Riga 200ms |
| C3 | Hover colore | 120ms: Motion, Select, Popup | 150ms: States, Examples, Navigation, Buttons (switch) |
| C4 | Accordion: apre/chiude | 240/180ms: Motion | 220ms altezza, 150ms opacità, 220ms transform: Accordion.dc.html |
| C5 | Chevron | 180ms: Motion (accordion) | 150ms: Select; 220ms: Pagina Film; 400ms: tokens.less `--dur-chevron`; `.4s`: Planner |
| C6 | Hover riga titolo | 120ms: Motion; motion.less (commento) | 350ms: Spec Riga, tokens.less `--dur-row`, Planner `.35s` |
| C7 | Spunta "visto" | 180ms: Motion | 200ms: Buttons |
| C8 | Skeleton: durata | 1.4s: Motion, motion.less | 1.2s: System states |
| C9 | Tooltip: ritardo | 400ms: tokens.css `--delay-tooltip`, Motion | 150ms: Tooltip.dc.html |
| C10 | Tooltip: misure | 240px, padding 10/14, 14px: Tooltip, Tooltip.less | 280px, padding 10/16, 13px: Components |
| C11 | Raggio popup | `--r-xl` 32: Modal.less, Popup (anatomia), Boxes | `--r-lg` 28: Popup (6 varianti), Components, Radius ("overlay sempre r-lg") |
| C12 | Padding popup | 28 (`--pad-popup`): Components, Popup | `--sp-6` 24: Popup varianti; 28/32: Modal.less |
| C13 | Padding interno di un box | raggio ÷ 1.5: Boxes | raggio ÷ 2: Radius |
| C14 | Ombra di un overlay | `--shadow-card`: Popup, Select (lista) | `--shadow-pop` (tokens.css) e `--shadow-popup` (tokens.less): 3 ombre per la stessa cosa |
| C15 | Scrim | `rgba(20,23,31,.6)` fisso, anche in scuro: Popup, Components | `.6` chiaro / `.55` scuro (`--scrim`): tokens.less; Popup scuro `rgba(0,0,0,.55)` |
| C16 | Scrollbar: strategia Firefox/Chromium | `@supports (-moz-appearance:none)`: tokens.css, Scrollbar | `@supports selector(::-webkit-scrollbar)`: base.less |
| C17 | Righe lista select | 52px: Select, Planner, SelectField.less | 44px: Components |
| C18 | Fondo lista select | `--surface` `#F7F8FA`: Select, SelectField.less | "card bianca": Components |
| C19 | Badge: testo | overline 12px: Badges | `--fs-overline` 13px: tokens.css |
| C20 | Spinner | 800ms: Buttons, Motion | 700ms: States |
| C21 | Toast: uscita | 180ms: Motion | 140ms: Toast |
| C22 | Press (transform) | `--dur-press` 80ms: Motion, tokens.css | 100ms: Select, Popup |
| C23 | Blur spoiler | `--dur-enter` 240ms: SpoilerBox.less | 220ms: Pagina Film |
| C24 | Colore tooltip testo | `--on-dark` `#F2F4F8`: Tooltip.dc.html | `--bg` `#E9ECF1`: Tooltip.less |
| C25 | Pagine stato "popup di conferma" | primary rosso (chiaro) / giallo (scuro): Popup scuro | tokens.css non ha `--primary`: la regola esiste solo nel codice |

---

## 3. Design contro codice (ipotesi: il design ha ragione)

Eccezioni dove decido io perché il design è in conflitto con sé stesso: **E1** strategia scrollbar (vince il codice), **E2** `--shadow-pop` unico (né Select né tokens.less).

| Componente | Design | Codice | Cosa cambiare nel codice |
|---|---|---|---|
| Curva | `--ease-out: cubic-bezier(.23,1,.32,1)` | `.22,1,.36,1` (tokens.less:162) | usare `.23,1,.32,1` |
| `--dur-hover` | 120ms | 200ms (tokens.less:165) | 120ms; riduzione movimento 80ms resta |
| `--dur-row` | non esiste | 350ms | eliminare; riga: hover 120ms (`--dur-hover`), appena segnata 180ms (`--dur-ui`) |
| `--dur-chevron` | 180ms (`--dur-ui`) | 400ms | eliminare; `.chevron` usa `--dur-ui` |
| `--dur-reveal` | 240ms (`--dur-enter`) | 380ms | eliminare; `reveal-in`, `splash-out` usano `--dur-enter` |
| Commento motion.less riga 64 | "hover 120ms" | usa 350ms | allineare commento e valore |
| Select: apertura lista | 180ms + 4px, esce 120ms (decisione sotto) | `pop-in` `--dur-hover` (=200ms oggi), nessuna animazione d'uscita | entra `--dur-ui`, esce `--dur-hover`; la lista diventa popover con `display/overlay allow-discrete` come il tooltip |
| Select: ombra lista | `--shadow-pop` | nessuna ombra (solo `--surface` piatto) | `box-shadow: var(--shadow-pop)` |
| Select: anello opzione da tastiera | `--focus` (rosso chiaro, giallo scuro) | `var(--red)` fisso (≈2.3:1 su `#1B202C`) | `outline: var(--focus); outline-offset:-3px` |
| Select: trigger tonalità | `--raised` / `--raised-2` / `--raised-3` | `.on-panel` ok; senza `.on-panel` `--surface-2` | verificare dove sta il trigger; nessun cambio se sempre in `.on-panel` |
| Select: touch | nativa su puntatore grosso | **già fatto**: `hasFinePointer` → `NativeSelect` | nessuno (solo `layout="inline"` resta custom, vedi sotto) |
| Select: compatta 44px | pagina Select | non esiste (layout: `popover`, `inline`, `native`) | nessuno: la tolgo dal design |
| Select: opzione/trigger disabilitati | pagina Select | non esistono nel codice | nessuno: li tolgo dal design |
| Ombra overlay | `--shadow-pop` | `--shadow-popup` `0 24px 64px .28`, `none` in scuro | eliminare `--shadow-popup`, Modal.less usa `--shadow-pop` |
| Scrollbar | `--sb-*` | uguali; `base.less` usa `@supports selector(::-webkit-scrollbar)` | tokens.css adotta la strategia del codice (E1); aggiungere `@media (hover:hover) and (pointer:fine)` a entrambi |
| Tooltip: testo | `--on-dark` | `--tip-fg: var(--bg)` | `--tip-fg: var(--on-dark)` (chiaro), `--ink` sulle varianti scure |
| Tooltip: ritardo | `--delay-tooltip` 400ms | da confermare nel .tsx | usare solo `--delay-tooltip` |
| Primary | assente in tokens.css, usato nei popup scuri | `--primary`, `--primary-hover`, `--primary-press`, `--on-primary` | portare i 4 token nel design (token nuovi, sotto) |
| Alias legacy | nomi del design (`--accent`, `--highlight`, `--ink-2`, `--on-accent`) | `--red`, `--gold`, `--muted`, `--red-text`, `--on-gold`, `--on-red`, `--panel-ink`, `--panel-muted`, `--cell-off`, `--surface-2` | rinominare e togliere gli alias |
| Alias deprecati nel design | — | — | nessuno in codice; `--dur-micro` e `--dur-std` sono usati da Planner.dc.html, da togliere |
| Font body | `'Hanken Grotesk'` | `'Hanken Grotesk Variable'` (self-hosted) | il design dichiara solo la famiglia; resta com'è |

Cosa ha il codice e il design non prevede (elenco completo nel CHANGES_FOR_CODE.md della Fase B):
- `--row-press`, `--phase-hover`, `--phase-press`, `--row-open-hover`, `--row-open-press`, `--danger-text`, `--strip-on-panel-off`, `--floating-progress-*`.
- Animazioni: intro con stagger dopo lo splash, `data-motion` sulle fasi con altezza animata, stagger di "Espandi tutto", `list-swap-in`, `theme-ready` crossfade, `check-draw`, `strike-in`, `bar-fill`.
- Componenti: `SpoilerBox`, `CompactProgress`, `floating-progress`, `ChoiceGroup`, `ConfirmDialog`, `Status`, `ProgressStatsSection`, `AdminDashboard`, `filters-sheet` con `useSheetDrag`.

---

## 4. Struttura proposta (da 34 a 26 pagine, ogni valore in un solo posto)

**Fondamenta (9)**
1. **Tipografia** ← Typography
2. **Colori** ← Colors + ombre (`--shadow-card`, `--shadow-pop`), scrim, mappa chiaro/scuro, `--primary*`
3. **Spazio e forma** ← Spacing + Radius + Boxes (una sola regola padding)
4. **Griglia e responsive** ← Layout grid + Responsive
5. **Movimento** ← Motion: solo token, regole generali, riduzione movimento. Niente valori per componente.
6. **Accessibilità** ← Accessibility (senza il tono): focus, tap target, tastiera, ARIA, contrasto
7. **Scrollbar** ← Scrollbar
8. **Testi e dati** ← Content + tono dei testi (da Accessibility)
9. **Icone** ← Icons

**Componenti (13, una pagina madre ciascuno)**
Pulsanti (con switch e spunta) ← Buttons · Campo ← Textfield · Select · Accordion (fase) · Riga titolo ← Lists + Spec Riga · Tooltip · Popup · Toast · Progresso · Badge · Header e menu ← Navigation · Poster ← Images · Stati di sistema ← System states (+ "Vuoto" da Toast)

**Schermate di riferimento (4)**: Planner, Pagina Film, Profile Popup, Popup (resta madre del componente Popup)
Le schermate non ridefiniscono nulla: richiamano il componente e basta. Planner passa ai valori del Sistema A.

**Eliminare:** Components, Examples, States (ogni stato va nella pagina del suo componente), Index (si genera da questa lista), Spec Riga Aperta Hover (assorbita), tutte le cartelle `handoff_*`, `motion_handoff`, `motion-update`, `patch`, `design_handoff_*` con le loro copie di tokens.css.

**Dove vive ogni informazione**
- Valori (colore, durata, raggio, spazio, ombra): solo **tokens.css**. Una pagina di fondamenta li spiega; nessun'altra li scrive in HEX o ms.
- Durata/easing di un componente: tabella Motion della pagina del componente, con nomi di token. Movimento (Fondamenta) tiene solo la scala `80/120/180/240/600` e la regola "uscita = un gradino sotto".
- Stati: tabella stati della pagina del componente.

---

## 5. Schema fisso della pagina componente

0. **Scopo e codice**: una riga + file `.tsx/.less` + classi
1. **Anatomia**: disegno con quote, tutte in token (`--sp-*`, `--r-*`, `--tap`)
2. **Varianti**: tabella nome | quando si usa | differenza dal base
3. **Stati**: tabella stato | sfondo | testo | anello | trasformazione | **chiaro** e **scuro** su colonne separate; tutto in token
4. **Movimento**: tabella evento | proprietà | entra (token) | esce (token) | easing (token) | riduzione movimento
5. **Tastiera e accessibilità**: tasti, ruolo ARIA, focus, annuncio
6. **Responsive e touch**: cosa cambia sotto 640/1024 e su puntatore grosso
7. **Casi limite**: testo lungo, lista vuota, errore, molti elementi
8. **Demo dal vivo**: una sola sezione in fondo, legge solo token
9. **Token nuovi** (se ce ne sono): nome | chiaro/scuro | uso

Regole: nessuna pagina ripete un valore di un'altra; si scrive "→ Colori §ombre". Una tabella, una riga per stato. Nessun HEX.

---

# DECISIONI

## Select

| Decisione | Valore finale | Token |
|---|---|---|
| Apertura lista | **180ms**, fade + `translateY(4px→0)` | `--dur-ui` |
| Chiusura lista | **120ms**, fade + `translateY(0→4px)` | `--dur-hover` |
| Chevron | **180ms** in entrambe le direzioni (150 e 400 spariscono) | `--dur-ui` |
| Colori hover/pressed (trigger e opzioni) | **120ms**; il tasto premuto scala in **80ms** | `--dur-hover`, `--dur-press` |
| Riduzione movimento | niente traslazione né rotazione; resta solo la dissolvenza da **80ms** | già in tokens.css |
| Token nuovi per il Select | **nessuno**: i valori esistono tutti | — |

Ragione: la lista è un menu fluttuante come `menu-panel` (180 dentro / 120 fuori). 120/80 è per tooltip, che sono più piccoli.
Attenzione: oggi nel codice `--dur-hover` vale **200ms**, non 120. Finché non si corregge, la lista "a 120ms" nel codice dura 200.

**Ombra della lista**: `var(--shadow-pop)`.
- Chiaro: `0 2px 4px rgba(20,23,31,.08), 0 20px 40px -16px rgba(20,23,31,.32)`.
- Scuro: `inset 0 0 0 1px rgba(242,244,248,.12), 0 20px 40px -16px rgba(0,0,0,.6)`.

`--shadow-card` è per superfici che stanno sulla pagina; una lista galleggia sopra altre cose. Scuro: l'ombra nera non si vede, serve l'anello interno. `--shadow-popup` del codice sparisce e anche i popup usano `--shadow-pop`.

**Easing**: **una curva sola**, `--ease-out: cubic-bezier(.23,1,.32,1)`, per entrata e uscita. **Non aggiungo `--ease-in`.** Un ease-in in uscita parte lento e fa sembrare l'interfaccia in ritardo; l'uscita più veloce (un gradino sotto) basta. `.4,0,1,1` era solo nella copia vecchia di tokens.css e Motion attuale l'ha già eliminata. Va cancellata anche `.22,1,.36,1`.

**Variante compatta 44px**: non serve ora, la rimuovo. Il codice non la implementa (`popover`, `inline`, `native`). L'unico altro uso è `WhereToWatch`, che non ho verificato (da confermare). Si riaggiunge quando c'è una schermata che la usa.

**Opzioni e trigger disabilitati**: stessa cosa, nessun uso nel codice. Rimossi dalla pagina, nessun token.

**Scrollbar a pillola** (vale anche nella lista del Select):

| Parte | Valore | Token |
|---|---|---|
| Larghezza | 12px totali, pollice visibile 6px (bordo trasparente 3px) | `--sb-size` |
| Raggio | pillola | `--r-pill` |
| Traccia | trasparente | `--sb-track` |
| Pollice chiaro | `rgba(20,23,31,.50)`, hover `.70` | `--sb-thumb`, `--sb-thumb-hover` |
| Pollice scuro | `rgba(242,244,248,.50)`, hover `.75` | idem |
| Condizione | solo `@media (hover:hover) and (pointer:fine)`; su touch resta nativa | nuova regola, nessun token |
| Strategia | quella del codice: `@supports selector(::-webkit-scrollbar)` ripristina `scrollbar-width:auto`; Firefox usa `thin` | — |

La lista del Select usa `.scroll-y` (`max-height: min(320px, 100dvh - 16px)`), come già fa il codice.

**Touch: confermo la select nativa** sui puntatori grossi per `layout="popover"` (già nel codice). Eccezione: `layout="inline"` nel menu mobile resta custom. È un'espansione dentro un pannello, non un popover che esce dallo schermo, e il design scuro del menu fa parte della pagina.

---

## Token nuovi per tokens.css (uno per riga)

| Nome | Chiaro | Scuro | Dove si usa |
|---|---|---|---|
| `--primary` | `var(--accent)` | `var(--highlight)` | bottone principale nei popup, CTA |
| `--primary-hover` | `var(--accent-hover)` | `var(--highlight-hover)` | hover del principale |
| `--primary-press` | `var(--accent-active)` (sostituisce `#A81A24`) | `var(--highlight-active)` | pressed del principale |
| `--on-primary` | `var(--white)` | `#0B0D12` (`--deepest`) | testo sul principale |
| `--row-press` | `#CDD2DC` | `#454E70` | pressed righe e opzioni (oggi alias di `--disabled`) |
| `--scrim` | `rgba(20,23,31,.6)` | `rgba(0,0,0,.55)` | sfondo di popup e sheet (sostituisce 20+ `rgba` a mano) |
| `--danger-text` | `#A11F18` | `#F2766E` | testo errore |

Token da **eliminare** dal codice (valori sostituiti): `--dur-row`, `--dur-chevron`, `--dur-reveal`, `--shadow-popup`, `--dur-micro`, `--dur-std`, `--red-text` (= `--accent-text`), tutti gli alias legacy.
Da decidere in Fase B (non li ho ancora toccati): `--row-open-hover/press`, `--phase-hover/press`, `--strip-on-panel-off`, `--floating-progress-*`.

---

## Cosa mi serve da te per partire con la Fase B
1. OK alla struttura (26 pagine) e allo schema del componente.
2. OK alle decisioni sopra. Quelle che cambiano più comportamento nel codice: hover riga 350→120ms, chevron 400→180ms, nessun `--ease-in`, un'ombra unica per gli overlay.
3. Planner e Spec Riga erano scritti in Sistema B (200/350ms). Li porto al Sistema A (120/180ms). Dimmi se il 350ms sulla riga era voluto.
