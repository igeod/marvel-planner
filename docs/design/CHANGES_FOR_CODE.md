# CHANGES_FOR_CODE.md (quarto giro)

Confrontato con `igeod/marvel-planner@8a4c146`. Solo differenze nuove. Una riga per modifica: componente | file | attuale nel codice | nuovo | token.
Correzione al terzo giro: `--bar-h-lg` è eliminato (nel codice non c'è nessuna barra da 16px). La barra dell'hero resta `--bar-h` (10px). Non creare `--bar-h-lg`.

## 1. Larghezze con testo ingrandito
Regola: ciò che contiene testo ha larghezza in `rem` (o `ch` per la prosa) e cresce con il testo; ciò che disegna un oggetto resta in px (icone, poster, avatar, interruttore, barre, `--content-max`, bordi). Resta in px anche la parte `100vw − …` dei `min()`/`calc()`: è un margine dal bordo dello schermo. Le aree cliccabili di sole icone usano `--hit` (44px), non `--tap`: non devono crescere col testo. I popup e il profilo passano al layout compatto con i breakpoint in `em` (a 200% su uno schermo da 1280 px il layout compatto è già attivo).

| Componente | File | Attuale | Nuovo | Token |
|---|---|---|---|---|
| Tooltip | Tooltip.less:28 | `max-width: 240px` | `15rem` | — |
| Tooltip warning | Tooltip.less:72 | `max-width: 320px` | `20rem` | — |
| Field | Field.less:7 `.form` | `max-width: 480px` | `30rem` | — |
| Select, lista | SelectField.less:115 | `min-width: 260px` | `16.25rem` (resta `max-width: calc(100vw - 16px)`) | — |
| Popup | Modal.less:7 | `min(560px, calc(100vw - 32px))` | `min(35rem, calc(100vw - 32px))` | — |
| Popup grande | Modal.less:23 | `min(720px, calc(100vw - 32px))` | `min(45rem, calc(100vw - 32px))` | — |
| Popup, padding | Modal.less `.dialog__header`, `.dialog__body` | `28px … 32px`, `8px 32px 32px` | `1.75rem … 2rem`, `.5rem 2rem 2rem` (mobile `1.5rem`) | `--pad-popup` |
| ConfirmDialog | ConfirmDialog.less:4 | `min(480px, calc(100vw - 16px))` | `min(30rem, calc(100vw - 16px))` | — |
| Profilo, finestra | AccountSettings.less:6 | `width: 800px` | `width: 50rem` | — |
| Profilo, barra laterale | AccountSettings.less:41 | `width: 260px` | `16.25rem` | — |
| Profilo, altezza | AccountSettings.less:7 | `height: 640px` | `height: min(40rem, calc(100dvh - 64px))` | — |
| Prerequisiti | BeforeYouWatch.less (desktop) | `grid-template-columns: 110px …` | `6.875rem …` | — |
| Elimina account, campo | DeleteAccountSection.less:20 | `160px` | `10rem` | — |
| Poster di condivisione | PlannerSummary.less `.share-poster` | `width: 250px` | `15.625rem` | — |
| Admin | AdminDashboard.less:7 | `max-width: 880px` | `55rem` | — |
| Aree di sole icone | Modal.less `.dialog__close`, Field.less `.field__button`, TitleItem.less `.title-row__check`, InfoTip.less `.info-tip__trigger` | `width/height: var(--tap)` o `44px` | `var(--hit)` | `--hit` (nuovo, 44px) |
| Quadrati e icone | tutti | px | invariati | — |

### Card "Condividi il tuo planner" e percentuale
| Componente | File | Attuale | Nuovo | Token |
|---|---|---|---|---|
| Contenitore progresso | PlannerSummary.less `.progress-card__main` | — | `container-type: inline-size` | — |
| Percentuale | PlannerSummary.less `.progress-card__percent` | `font-size: 5.5rem` (desktop `10.5rem`) | `clamp(5.5rem, 45cqi, 10.5rem)`: mai più larga di metà colonna | — |
| Poster di condivisione | PlannerSummary.less `.progress-card` | affiancato, `flex: none` | `flex-wrap: wrap`; `.progress-card__main { flex: 1 1 20rem }`: sotto 20rem di colonna il poster passa sotto, rotazione compresa | — |
| Pulsante condividi | PlannerSummary.less `.progress-card__share` | `min-height: 60px`, etichetta su una riga | `min-height: 3.75rem`; etichetta con `flex-wrap` (va a capo, il sottotesto non sparisce) | — |
| Riga "Saved on this device / Reset" | PlannerSummary.less `.progress-card__footer` | senza a capo | `flex-wrap: wrap` | — |
Soglia: 20rem di larghezza della colonna principale, non una soglia di schermo. Non ho potuto riprodurre la sovrapposizione che vedi con il testo grande: il Planner del design ora segue queste regole, ma verifica nel browser.

## 2. Riga titolo: chiusura e apertura (sequenza in `Title row`)
| Componente | File | Attuale | Nuovo | Token |
|---|---|---|---|---|
| Spazio sopra il contenuto | TitleItem.less `.title-row__content` | `margin-top: var(--sp-3h)` | `padding-top: var(--sp-3h)` dentro il box animato; `display: flow-root` resta | `--sp-3h` |
| Fase, distanza testata-righe | PhaseSection.less `.phase[open] > .phase__summary` | `margin-bottom: var(--sp-1h)` (fuori dal box animato) | togliere; `.phase__titles { padding-top: var(--sp-1h); display: flow-root }` | `--sp-1h` |
| Fase vuota | PhaseSection.less `.phase__empty` | `padding: 8px 20px 16px` | invariato, già dentro il box animato | — |
| Durate | motion.less | altezza `--dur-enter` / `--dur-ui` | invariate (aperta 240, chiusa 180); opacità `--dur-hover` / `--dur-press`; spostamento 4px come l'altezza | — |

## 3. Elementi confrontati
| Componente | File | Design | Codice | Cosa cambiare |
|---|---|---|---|---|
| Bottone chiudi | Modal.less | 44, hover `--row-hover`, premuto `--row-press`, scala .94 | uguale | nessuna differenza di colori e scala; solo `var(--tap)` → `var(--hit)` (sez. 1) |
| Ombra del popup | Modal.less:15 | `--shadow-pop` | `var(--shadow-popup)` (token eliminato al primo giro) | `box-shadow: var(--shadow-pop)` |
| Compact pill | MarkWatchedButton.less | altezza visibile 34, area 44, hover `--raised-2`, premuto `--raised-3`; guardato: sfondo `--panel-2` | uguale; `height: 34px` / `44px` | `min-height: 2.125rem` e `2.75rem` (altezza con testo) |
| Compact pill, "Watched" | MarkWatchedButton.less | solo la spunta diventa `--highlight` (design allineato) | uguale | nessuna |
| Ghost gold | BeforeYouWatch.less `.why-toggle` | 44, padding 0 12, gap 8, `--r-row`, hover sfondo del pannello, premuto `--raised-2` | hover `var(--row-hover)` (nel pannello vale `--panel-2`), premuto `--raised-2` | nessuna (design allineato) |

## 4. Token
| Token | Valore | Dove |
|---|---|---|
| `--bar-h-lg` | eliminato | non usarlo |
| `--hit` | `44px` (nuovo) | aree cliccabili di sole icone (sez. 1) |
| `--soft-press` | `color-mix(in srgb, var(--disabled), var(--ink) 14%)` (nuovo, un solo punto in tokens.less, vale per chiaro e scuro) | Button.less `.btn--soft` pressione: `.tones(var(--disabled), var(--soft-press))` |

Note: l'hover delle righe (PlannerSearch e TitleItem) usa già la stessa mixin `.on-hover`, nessuna regola nuova. `scrollbar-gutter: stable` ripetuto in `.sheet-surface()` e in `.profile__inner`: tienilo come è (stesso valore, due contesti), l'eccezione `auto` sul dialog profilo resta.

## 5. Apertura del sito: frame lunghi
I tre frame (82, 60, 50 ms a 965–1190 ms) sono accettabili perché la splash è opaca: il minimo di 450 ms e il tetto di 2000 ms non li coprono se non c'è la condizione sotto.

| Componente | File | Attuale | Nuovo | Token |
|---|---|---|---|---|
| Quando il Planner è pronto | planner page, `useSplashReady("planner", …)` | pronto al primo render | pronto dopo il primo commit e due `requestAnimationFrame` | — |
| Lavoro dopo l'uscita | PhaseSection / lista fasi | tutto renderizzato insieme | fasi sotto la prima schermata in `startTransition` o con `content-visibility: auto`; compaiono senza animazione | — |
| Spazio riservato | PhaseSection.less | altezza del contenuto | `contain-intrinsic-size: auto 4.5rem` sulla testata della fase finché non c'è il contenuto | — |
| Budget | — | — | nessun frame oltre 100 ms dopo l'uscita; sotto 16 ms durante l'intro; se superato: meno elementi in cascata, mai una splash più lunga | — |
