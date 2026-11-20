# Design system: Marvel Planner

Fonte dei valori: `src/styles/tokens.less` (codice). Il canvas in `docs/design/canvas/` lo descrive e si rigenera dal codice: `tokens.css` e `app.css` sono compilati da `src/styles`. Questo file non ripete i valori: dice **come usarli** e cosa evitare.

Leggere nell'ordine: `docs/design/HANDOFF.md` (cosa il codice non ha ancora, decisioni scartate), `docs/design/canvas/Index.dc.html` (una pagina per tema o componente, con file e righe del codice), `docs/design/CHANGELOG.md` (storia delle decisioni). Dove canvas e codice differiscono vale il codice; una decisione nuova arriva da Design in HANDOFF, §"Da implementare", e dopo l'implementazione il canvas si rigenera dal nuovo commit.

## Identità

Sito per appassionati del MCU, spesso aperto da telefono davanti alla TV. Carattere: **poster cinematografico, scuro e deciso**, ma ordinato come uno strumento. Rosso Marvel come accento, giallo come evidenza (nel tema scuro il giallo diventa il colore primario). Non è un sito ufficiale e non deve sembrare uno: niente loghi, caratteri o rettangoli rossi che imitano il marchio Marvel.

## Principi

1. **Prima la funzione.** L'HTML è semantico; il design lo veste, non lo riscrive.
2. **Spoiler sotto controllo.** Nulla che riveli la storia si vede per sbaglio (anteprime, tooltip, testi alternativi inclusi).
3. **Accessibilità WCAG 2.2 AA:** tastiera completa, focus sempre visibile, contrasto, bersagli da 44px, `prefers-reduced-motion`, niente informazione affidata al solo colore.
4. **Mobile-first**, margine laterale 16px, nessuno scorrimento orizzontale. Su desktop il contenuto non resta una colonna stretta nel vuoto.
5. **Onestà sui dati:** se manca una fonte affidabile si mostra meno, non si inventa.

## Tipografia

- **Anton** (display): titoli e numeri grandi, maiuscolo, `letter-spacing: .01em`.
- **Hanken Grotesk** (corpo): tutto il resto.
- Dimensioni solo da `--fs-*`. Il testo contenitore cresce con il testo dell'utente: larghezze in `rem` (o `ch` per la prosa); restano in px solo oggetti disegnati (icone, poster, avatar, barre, bordi).
- I titoli dei fogli in basso (popup, Filtri, Account) sono Hanken 800 `--fs-h4`: Anton non entra nei titoli lunghi di fr e de.
- I titoli delle opere restano in inglese (`lang="en"`). Francese e tedesco sono più lunghi dell'italiano: il layout deve reggerli.

## Colore e temi

- Temi: sistema, chiaro, scuro, tramite `data-theme` su `<html>`. Ogni colore passa dai token semantici (`--bg`, `--surface`, `--row`, `--ink`, `--ink-2`, `--accent`, `--primary`, `--danger`...), mai da un esadecimale nel componente.
- `--primary` è il rosso nel chiaro e il giallo nello scuro: usalo per l'azione principale, non `--accent` direttamente.
- Testo su sfondo: usa la coppia prevista (`--on-primary`, `--on-danger`, `--on-dark`, `--on-disabled`).

## Forma, spazio, ombre

- Spazi da `--sp-*`, raggi da `--r-*` (dal più morbido `--r-xl` al `--r-hair`), ombre `--shadow-card` e `--shadow-pop`.
- Breakpoint in `em` (64em, 40em): con il testo ingrandito il layout compatto arriva prima.
- Aree cliccabili di sole icone: `--hit` (44px), che non cresce col testo.

## Movimento

Una sola curva (`--ease-out`), cinque durate (`--dur-press/hover/ui/enter/progress`), nessun `ease-in`. L'uscita dura un gradino meno dell'entrata (240→180, 180→120, 120→80). Con `prefers-reduced-motion` restano solo cambi di colore e opacità, brevi: transform, altezze e keyframe vivono in blocchi `no-preference`. Spinner e skeleton compaiono solo dopo `--delay-pending` (200ms), così i caricamenti rapidi non lampeggiano.

## Componenti

Stato, misure e comportamento di ogni componente stanno nella sua pagina di `docs/design/canvas/` (una pagina per componente, nessun duplicato). Icone: solo Lucide, `aria-hidden`. Ogni elenco o immagine ha lo stato vuoto e quello "senza immagine".

## Riferimenti di ispirazione

Qui si annotano i siti da cui prendere **principi** (non stili da copiare). Una riga ciascuno: cosa prendiamo e cosa no.

| Sito | Cosa prendiamo | Cosa NO |
| ---- | -------------- | ------- |
|      |                |         |

## Cosa NON fare

Regole fisse, dai principi e dal design esistente:

- Nessun valore scritto a mano (colore, spazio, durata, curva) quando esiste il token.
- Nessuno stile inline, nessuna risorsa o font esterni.
- Nessun `ease-in`, nessuna animazione che ignora `prefers-reduced-motion`.
- Nessun nuovo componente se ne esiste già uno simile: si estende quello.
- Nessuna emoji al posto delle icone; nessuna icona fuori da Lucide.
- Nessuna ombra o gradiente decorativo senza token.

Da completare con i difetti concreti che il proprietario nota nella grafica ("troppo piatto", "generico"...), uno per riga:

-

## Deviazioni del codice dal design

Quando il codice non può seguire il design (o lo supera), si annota qui, una riga: componente | file | cosa | perché. Design la risolve e poi la cancella.

- Pagine di testo | `PrivacyPage`, `AccessibilityPage` | intestazione come una saga, una scheda numerata per sezione, biglietto giallo dritto nell'Accessibilità | voce 27 di HANDOFF §2
- Admin | `AdminDashboard` | «Da fare» e «Stato del sito» in testa, code a fisarmonica (Manutenzione, Automazione e Utenti confluiti nello Stato) | voce 30 di HANDOFF §2
- Contrasto forzato | `forced-colors.less` | stati e pulsanti con soli colori di sistema (fascia, pulsanti, scelte, interruttori, avatar) | voce 28 di HANDOFF §2
- Fogli in basso | `Modal`, `FiltersSheet`, `AccountSettings` | altezza = viewport visivo − `--sheet-gap`; Account con tetto 760 px; titoli dei fogli in Hanken 800 `--fs-h4` | voce 26 di HANDOFF §2
- Header | `LanguageSwitcher.tsx`, `HeaderMenu.tsx`, `AccountSettings.tsx`, `SelectField.less` | nessuna scheda di preferenze nel profilo (la lingua compatta e l'ordine del Menu sono fatti; la scheda "Aspetto e lingua" è rimandata) | voce 11 di HANDOFF §2, decisa da Design il 16 novembre
- Apertura del planner | `useCountUp.ts`, `PlannerSummary.tsx`, `ProgressStatsSection.tsx`, `motion.less` | numero da 900ms al montaggio, fascia a passo costante: tre orologi diversi | voce 13 di HANDOFF §2, decisa da Design il 18 novembre
- Apertura del planner | `tokens.less` (`--dur-progress`) | durata del primo arrivo di numero, fascia a batteria e barre del profilo accorciata da 600ms a 300ms su richiesta del committente (troppo lenta); cambia anche il primo riempimento delle barre dell'Account | da confermare con Design (o tornare a 600ms)
- Titoli in arrivo | `TitleItem.tsx/.less`, `PhaseSection.tsx/.less`, `forced-colors.less` | casella spenta con bordo tratteggiato, tooltip e "In arrivo" nel conteggio della fase invece dell'icona sola | voce 14 rivista di HANDOFF §2, decisa da Design il 20 novembre
- Titoli in arrivo | `TitleItem.tsx`, `PhaseSection.tsx`, `PhaseStrip.less`, `stats.ts` | oltre a quanto deciso: l'Account (stats) esclude i gruppi senza titoli usciti; la colonna della fascia senza celle ha `flex-grow: 1` (era 0); la sottoriga unisce tipo e nota in una frase ("Serie animata", "Serie di cortometraggi") | da confermare con Design
- Avvisi sui titoli in arrivo | `TitleItem.tsx/.less`, `MarkWatchedButton.less`, `TitleDetailsPanel.tsx`, `AuthDialogs`, locale | icona informativa `CalendarClock` invece della campanella "Avvisami via e-mail" | voce 15 di HANDOFF §2, decisa da Design il 21 novembre (spenta dietro VITE_TITLE_ALERTS finché non c'è il server)
- Tooltip | `Tooltip.tsx`, `placement.ts`, `InfoTip.tsx`, `BeforeYouWatch.tsx`, `EasterEggs.tsx`, `KeyScenes.tsx` | ancora sull'icona o sul contenitore da 44px a seconda del punto; il fumetto copre l'anello di focus | voce 16 di HANDOFF §2, decisa da Design il 22 novembre
- Admin | `AdminDashboard.tsx`, `ContentTodoSection`, `ReleaseDatesSection` | sezioni nuove dal canvas (pagina Admin); sezione con padding 1.25rem sotto 40em (il canvas la mostra a 1.5rem); manca la pillola "Senza data" (il catalogo ha sempre almeno l'anno: resta "Solo l'anno") e il campo data non ha il segnaposto AAAA-MM-GG (TextField non lo supporta: c'è la nota "Formato AAAA-MM-GG" sotto il campo) | voce 17 di HANDOFF §2, decisa da Design
- Fonti e suggerimenti | `PlotSection.tsx`, `KeyScenes.tsx`, `EasterEggs.tsx`, `SuggestForm`, `SuggestButton`, `SuggestionsSection`, `base.less` | fonte solo dove serve; «Suggerisci» per voce con modulo interno; testi en/fr/es/de tradotti da Code (non provvisori); `textarea` aggiunta ai selettori dei campi di `base.less` (altezza da `rows`, nessun valore nuovo); il testo del suggerimento si mostra a capo con `white-space: pre-wrap`; non fatta la riga «N suggerimenti» in `CandidatesNotice` (facoltativa) | voce 18 di HANDOFF §2, da confermare con Design
- Fonte della trama | `SpoilerBox.tsx/.less`, `PlotSection.tsx/.less` | sta in un piede di `SpoilerBox` (`footer`, `.spoiler-box__foot`) sotto l'area che scorre, fissa e nitida (non sfocata con la trama), non più `sticky` con sfumatura; la scrollbar finisce `--sp-4` sopra la fonte, come in alto sotto il titolo | voce 20 di HANDOFF §2
- Popup | `Modal.less`, `SuggestForm`, `ProfileSection`, `ConfirmDialog.less` | `scrollbar-gutter: auto` in `.dialog__scroll`; «Invia» di Suggerisci a tutta larghezza (lg), «Salva» del Profilo a destra, colonna sotto 40em per ogni `.dialog__actions` | voce 22 di HANDOFF §2
- Popup di accesso | `AuthDialogs.tsx/.less`, `Planner.tsx` | riga del perché solo sull'accesso e senza margine (il gap di `.dialog__body` la separa dal modulo); «Condividi» riprende dopo l'accesso | voce 23 di HANDOFF §2
- Colonna dei filtri (`.planner__rail-content`) | `Planner.less` | tolto `overscroll-behavior: contain`: con il mouse sopra il pannello, che di solito non scorre, la rotellina non faceva scorrere la pagina; se il pannello scorre (finestra bassa) a fine corsa la pagina riprende a scorrere | da confermare con Design
- Elenco cronologico (`.title-list`) | `ChronologicalList.less` | le righe stanno su una superficie (`--surface`, `--pad-card`, `--r-xl`) come nelle fasi: il canvas le disegna sulla pagina, ma `--row` in chiaro è il colore della pagina (`#e9ecf1`) e senza superficie le righe spariscono | da confermare con Design
- Ordine cronologico | `ChronologicalList.tsx/.less`, `SagaSection.tsx/.less` (`SagaHeader`), `PhaseStrip.tsx`, `strip.ts`, `Planner.tsx/.less`, `motion.less`, `TitleItem.tsx`, `PlotSection.tsx`, locale | cronologico con l'intestazione delle saghe (`SagaHeader`), fonte in riga piccola senza icona di info né nota lunga, senza etichetta sotto la fascia, titoli senza collocazione come seconda sezione, fascia a una colonna, fase nelle righe (solo virgole; anche «In arrivo» passa dal punto alla virgola in tutte le righe), cascata di cambio ordine a 300 ms (movimento ridotto: solo la dissolvenza della lista), colonna destra più bassa della riga della fonte; la licenza CC BY-SA della linea temporale va ancora verificata dal committente | voce 22 di HANDOFF §2, scelta del committente da confermare
- Popup di accesso (`.auth-view .form`) | `AuthDialogs.less` | `max-width: none`: il tetto di 30rem del `.form` generico (nato per i moduli in pagina, 480 px) nel popup da 35rem lasciava 48 px a destra contro 32 a sinistra; ora i campi occupano tutta la larghezza del corpo (32 px per lato) | da confermare con Design
- Campi di testo | `base.less` | a fuoco l'ombra interna (hover, errore) è spenta: un solo contorno per volta, come la ricerca del planner; bordo a riposo 1 px `--ink-2` (2 px a hover, nessuno a fuoco o se disattivo) per il contrasto del campo (WCAG 1.4.11, V3 del canvas, deciso dal committente) | voce 24 di HANDOFF §2
- Biglietto "Condividi" (`.share-poster`) | `PlannerSummary.less` | dal desktop `.progress-card` non va a capo (`flex-wrap: nowrap` da 64em), la colonna del testo scende fino a 246 px a 1024 px di finestra; titolo del biglietto a `--fs-h2` (era `--fs-xl`) | voce 19 di HANDOFF §2
