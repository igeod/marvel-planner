# CHANGES_FOR_CODE.md (secondo giro: solo modifiche nuove)

Nota: la cartella `marvel-planner/` che vedo è ancora lo stato precedente al tuo primo giro (tokens.less ha ancora `--dur-hover: 200ms`, `--dur-row`, `--ease-out .22`). I riferimenti `file:riga` sono di quel snapshot: se hai già spostato le righe, cerca per nome.
Una riga per modifica: componente | file | valore attuale | valore nuovo | token.

## 1. Correzioni ai valori che avevi già applicato

| Componente | File | Attuale | Nuovo | Token |
|---|---|---|---|---|
| Tooltip, testo base | Tooltip.less (`.tooltip`) | `--tip-fg: var(--on-dark)` se l'hai applicato | **`--tip-fg: var(--bg)`** (il mio file era sbagliato: in scuro `--ink` e `--on-dark` coincidono, 1:1). Resta `--tip-bg: var(--ink)` | `--tip-bg`, `--tip-fg` |
| Tooltip, contrasti | — | — | base 15.1:1 chiaro / 17.6:1 scuro; su pannello (`--on-dark` su `--panel`) 16.3 / 9.0; warning (`--highlight` su `--ink-static`) 9.4 / 9.4 | — |
| Select, direzione ingresso | SelectField.less (blocco popover del primo giro) | `translateY(4px)` sempre | sotto: `translateY(-4px)`; sopra: `translateY(4px)`. `transform-origin`: sotto `top right`, sopra `bottom right` | — |
| Select, placement | SelectField.tsx | `computeListPosition` restituisce `placement` ma non si usa | `list.dataset.placement = result.placement` in `position()`; CSS: `.select-field--popover .select-field__list { --pop-from: -4px; transform-origin: top right } [data-placement="above"] { --pop-from: 4px; transform-origin: bottom right }` e `translateY(var(--pop-from))` | — |
| Select, gutter | SelectField.less (lista popover) | `scrollbar-gutter: stable` nello snapshot, `auto` per te | **`auto`** (decisione: la lista non usa `.scroll-y`; resta `overflow-y: auto`, `overscroll-behavior: contain`) | — |
| Select inline, opacità in entrata | motion.less (pannello inline) | 200ms | `--dur-hover` (120ms). Resta: altezza/padding/margin `--dur-enter` in, `--dur-ui` out; opacità out `--dur-press` | `--dur-hover` |
| Select, chevron con reduced motion | motion.less (`.chevron`) | transition solo in `no-preference` | **invariato**: il chevron cambia posizione subito (nessuna rotazione animata); non va nascosto né lasciato fermo | — |
| Select, opzione selezionata | SelectField.less | `.tones(var(--ink-hover), var(--ink-press))`, testo `var(--bg)` | invariato: contrasti 15.1 / 10.8 / 7.1 (chiaro) e 17.6 / 14.0 / 10.8 (scuro), tutti ≥ 4.5:1 | `--ink-hover`, `--ink-press` |
| Campo di testo, offset focus | base.less `input[type=…]:focus-visible` | `outline-offset: 2px` | `var(--focus-offset)` (3px) | `--focus-offset` |
| Popup di conferma, scheda icona | ConfirmDialog.less | 40×40, `--danger` / `--highlight` | **invariato** (il design si è allineato: 40, icona 20, larghezza 480) | — |
| Commento | motion.less:1 | `(README section 11)` | togliere: il README non esiste. Non c'è in tokens.css né nelle pagine di design | — |

## 2. Nuove modifiche

| Componente | File | Attuale | Nuovo | Token |
|---|---|---|---|---|
| Tab selezionata, hover | AccountSettings.less:248 | `color-mix(in srgb, var(--ink) 82%, #000)` | `var(--ink-hover)` | `--ink-hover` |
| Pulsante elimina account, hover | DeleteAccountSection.less:94 | `color-mix(in srgb, var(--danger) 88%, #000)` | usare `.btn--danger` (`--accent-hover` / `--accent-active`) | `--accent-hover`, `--accent-active` |
| Switch, hover | Switch.less:73, :77 | `color-mix(... #000 12%)` | **eliminare** il cambio colore in hover (nessun token nuovo); resta focus ring | — |
| Barra compatta, uscita | CompactProgress.less:11-14 | `--dur-enter` in entrambe le direzioni | entra `--dur-enter`, esce `--dur-ui` (nello stato chiuso) | `--dur-ui` |
| Barra di progresso | base.less:233, CompactProgress.less:53,58 | `height: 10px`, `min-width: 10px` | `var(--sp-2h)` | `--sp-2h` |
| Barra di progresso | base.less:230-253 | `--red` / `--surface` | invariato: `<progress>` nativo confermato, il design si è adattato | — |

### Spazi intermedi: sostituzioni (stessa regola, un colpo solo)

`--sp-1h` (6px)
- gap: ChoiceGroup.less:54; Field.less:35; ProgressMeter.less:4; SpoilerBox.less:77; AccountSettings.less:108; ProgressStatsSection.less:110; AdminDashboard.less:54; MaintenanceSection.less:28,39; BeforeYouWatch.less:24; ChronologicalList.less:26; KeyScenes.less:4; MarkWatchedButton.less:23; PhaseSection.less:47; PhaseStrip.less:36,62 e `gap: 6px 16px` (:30) → `var(--sp-1h) var(--sp-4)`; PlotSection.less:19; WhereToWatch.less:63; PrivacyPage.less:35
- margin: SelectField.less:128; SpoilerBox.less:120; ProgressStatsSection.less:104; PhaseSection.less:22; NextToWatch.less:78; TitleDetailsPanel.less:214
- padding: ChoiceGroup.less:56 `6px 12px` → `var(--sp-1h) var(--sp-3)`; MobileToolbar.less:34 `0 6px`; AccountMenu.less:14 `0 16px 0 6px`; Planner.less:43 `padding: 6px; margin: -6px`

`--sp-2h` (10px)
- gap: Button.less:14,79; AccountMenu.less:12; FloatingProgress.less:11; MissingNote.less:4; MobileToolbar.less:20; PlannerSearch.less:12; PlannerSummary.less:15; ProgressStatsSection.less:120; AdminDashboard.less:45; TitleDetailsPanel.less:270,277,283
- padding: AppHeader.less:45,47 (`10px 8px`, `10px 32px`); HeaderMenu.less:23; AccountMenu.less:25; BeforeYouWatch.less:34,41,50,54 (`10px 14px` → `var(--sp-2h) var(--sp-3h)`; `10px 16px` → `var(--sp-2h) var(--sp-4)`); PhaseSection.less:12; PlotSection.less:34,70; ProgressStatsSection.less:71,81,121; StorageTable.less:11; Tooltip.less:29 (`10px 14px`); TitleItem.less:11,33 (`10px 16px …`)
- margin / variabili: NextToWatch.less:72; TitleItem.less:59 (`--pt: 10px`), :201

`--sp-3h` (14px)
- gap: PhaseSection.less:10; PhaseStrip.less:12,54; PlannerSummary.less:18; ProgressStatsSection.less:79; TitleItem.less:290
- padding: FloatingProgress.less:22 (`14px 24px 16px`); MarkWatchedButton.less:25 (`0 14px`); MissingNote.less:23 e SpoilerBox.less:84 (`14px 18px` → `var(--sp-3h) 18px`); TitleDetailsPanel.less:19; TitleItem.less:7, :155 (`--pt: 14px`, `--pr: 14px` a :156-158)
- margin: PhaseStrip.less:20; PlannerSearch.less:83 (`-14px`); TitleItem.less:291

`--sp-10` (40px): AppFooter.less:7,8; PlannerGuide.less:15,16; PrivacyPage.less:13
`--sp-14` (56px): AppFooter.less:11 (`margin-top` desktop)

Non diventano token (non sono spazi): tooltip `width/height 10px` della freccia; `translateY(±6px)` in motion.less:613,620 (offset di movimento); icone 14px (`--badge-icon`); `18px` (padding destro in MissingNote, SpoilerBox, ProgressStatsSection: resta letterale, nessun altro uso).

## 3. Cose che non mi tornano nel codice

| Dove | Cosa | Proposta |
|---|---|---|
| tokens.less / tokens.css | `.scroll-y` ha `scrollbar-gutter: stable` ma `.profile__inner` e altri contenitori lo ripetono a mano (AccountSettings.less:~275, mixins.less:77 `sheet-surface`) | usare `.scroll-y` o il mixin, non righe sparse |
| PlannerSearch.less / TitleItem.less | `.on-hover` e `:has(:hover)` duplicano la logica di hover della riga | un solo mixin per hover delle righe |
| TitleItem.less:74-92 | due gradienti identici (`-webkit-mask-image`, `mask-image`) | `var(--row-open-fade)` (già in tokens.css) |
| base.less input focus | `outline-offset: 2px` mentre tutto il resto usa 3 | `--focus-offset` (già in sezione 1) |
| Progress | l'altezza 10px sta in `base.less` generico `progress`, non in un componente | invariato; solo documentata |

## 4. Fatti da sapere
- Le specifiche admin (AdminDashboard e schermate admin) stavano nelle cartelle `handoff_admin_completo`, `handoff_pagina_admin` e simili: le ho eliminate con la ristrutturazione. Admin resta fuori dal design finché non lo chiedi.
- ProgressStatsSection resta documentata nella schermata Profile Popup (tab Progress), non in una pagina propria.
