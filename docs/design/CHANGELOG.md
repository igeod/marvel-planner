# Changelog del canvas

## 12 novembre 2026 · bordo di barra e scheda in tema scuro (proposta, main 8b15e60)

- **Progress · “Bordo di barra e scheda in tema scuro” (proposta):** la barra del telefono (FloatingProgress.less r.13) e la scheda piccola desktop (CompactProgress.less r.43) in scuro non hanno bordo: `--panel` #3a4260 fa 1,97 su `--bg`, 1,65 su `--surface`, 1,28 su `--row` (calcolato dai token, non misurato nel browser). Proposta: anello 1px `--ink-2` (5,13 contro `--panel`) come il toast; barra con `--toast-shadow` (galleggia), scheda col solo anello; nuovo token `--panel-ring` (scuro `0 0 0 1px var(--ink-2)`, chiaro `none`) che `--toast-shadow` compone con `--shadow-pop`. Nessun valore nuovo, tema chiaro invariato, mai anello di focus rosso.
- **Barra in `position: fixed`:** accettata dal design se esce con `--dur-ui` e il footer tiene il `padding-bottom` in più. Su main 8b15e60 è ancora `sticky` (FloatingProgress.less r.6): non verificato. Stessa cosa per la riga aggiornata di DESIGN.md e per i toast che scattano senza animazione: non sono su main.
- **Scostamento trovato:** nella pagina Progress le tabelle “Valori nel codice” di FloatingProgress.less sono ferme a 450fbb9 (`@radius-block`, padding `1.25rem 1rem`); main ha `--r-row`, `--sp-3h --sp-4 --sp-3` e `width: min(440px, calc(100% - 1rem))` (r.12-19). Da ricalcolare con `remap.py` / a mano (la pagina si modifica a mano).

## 12 novembre 2026 · toast su telefono e conteggi (main b7ddfe3)

- **Planner · “Barra di avanzamento su telefono: gli stessi bordi dei toast” (proposta):** i toast non cambiano (16 / 374px a 390px, raggio 22px); la barra, che oggi è tutta la colonna (8 / 382px, raggio 32px), sotto 40em prende la loro larghezza (`min(440px, calc(100% − 1rem))`, centrata), il loro raggio (`--r-row`) e un rientro interno di `--sp-4`; il toast le sta a `--sp-2` sopra (oggi 20px, posizione fissa su una barra da 5rem), misurata. Ordine dal basso: barra, toast, pillole, a `--sp-2`.
- **Conteggio del numero esteso a tutti i contatori grandi (voce 32, main b7ddfe3):** “I tuoi progressi” da 0 in 900 ms e poi 400 ms; scheda piccola (desktop) e barra flottante (mobile) solo a ogni cambio; Account, “Titoli visti”: “51” e “72%” da 0 in 900 ms alla prima apertura della pagina nella sessione. Non contano i conteggi piccoli nel testo. `useCountUp(target, { initialMs?, changeMs, enabled })`; l'opzione `isActive` non c'è più. Il blocco è aggiornato.
- Nelle scene del Planner con la barra e i toast la barra sta ora dentro la colonna (come nel codice), non a tutta larghezza.

## 12 novembre 2026 · pillole su mobile e accordion della fascia (proposte)

- **Planner · “Pillole su mobile: solo ‘Ultimo visto’ con testo, e più vicine alla barra”:** sotto 40em “Torna su” è solo la freccia (cerchio da `--hit`, testo visivamente nascosto ma nel DOM) e “Ultimo visto” resta con testo; `width: max-content`, `nowrap`; la distanza dalla barra è misurata (`bottom = innerHeight − barra.top + --sp-2`) invece del `--floating-progress-clearance` da 5rem (la barra vera è ~62px). Prove a 390px (it) e 360px (de).
- **Planner · “Fascia delle fasi su mobile: lo stesso accordion delle fasi”:** `<details class="phase card">` con `usePhaseMotion` riusato (altezza 240/180 ms, contenuto, chevron) al posto del pulsante con `hidden`; titolo `--fs-title` peso 700, `min-height: --hit`: chiuso 60px (oggi 84px, una fase 80px). Prova viva con la stessa animazione.

## 12 novembre 2026 · pillole sopra i toast (proposta)

- **Planner:** nuova proposta “Pillole flottanti sopra i toast”, con prova viva (aggiungi e chiudi toast), due toast e caso con la barra di avanzamento. Con un toast le pillole non si nascondono più (`body:has(.toasts .toast) .jump-pills`, BackToTop.less r.19-21, regola da togliere): salgono sopra la pila di toast di quanto serve (`--toasts-lift`, misurata con `getBoundingClientRect`, ricalcolata con `ResizeObserver` e `MutationObserver` su `.toasts`), usando `translate` con `--dur-enter` in salita e `--dur-ui` in discesa; con movimento ridotto nessuna transizione. Scartato: spostare i toast sopra le pillole.
- **Bug trovato nel codice (7c7eb6a):** `.jump-pills` è `position: fixed; left: 50%` senza larghezza, quindi disponibile solo metà schermo: a 390px l'etichetta “Ultimo visto” va a capo. Correzione: `width: max-content; max-width: calc(100vw - 32px)`.

## 12 novembre 2026 · allineamento al codice (main 456fa17, aggiornamenti 450fbb9, dabf929 e 7c7eb6a)

Il codice ha applicato le decisioni dei giorni scorsi; il canvas è stato rigenerato da `main` (7c7eb6a) e dove canvas e codice differivano vale il codice.

- **Marcate “implementata · main 456fa17”** (Planner, Pagina Film, Accessibility, Buttons, Motion): 4 focus dopo un tocco; 7 icone (`ButtonLink`, `Maximize2` su “Apri scheda” e “Dettagli”); 15 cascata d'ingresso (planner e film); 16 “Prossimo da guardare” sempre montato; 17 layout 1098 px (nessuna modifica: il codice era già così); 18 fondo mobile (barra sticky); 20 filtri (altezza minima via CSSOM); 21b scorciatoie flottanti; 30b “?” nell'header; 31 fascia delle fasi; 32 numero che sale; 33 regia su mobile; casella tri-stato sulla fase. Il blocco “Segna tutta la fase come vista” (pulsante) è “sostituita”.
- **Numero che sale anche nella scheda piccola** (CompactProgress, desktop, 7c7eb6a): 900 ms alla prima apertura, 400 ms a ogni cambio, nessuna animazione alla riapertura; hook con opzione `isActive`.
- **Barra di avanzamento:** ora è `position: sticky`, solo su mobile (`!isDesktop`, Planner.tsx r.317). Risolta la questione “c'è su desktop?”: non c'è. Progress aggiornata (tabella dei valori di FloatingProgress.less, descrizione).
- **Scostamenti dal design, annotati nelle pagine:** con movimento ridotto la cascata d'ingresso non anima nulla (il canvas chiedeva la sola dissolvenza); la barra sticky su mobile sta nella colonna con angoli arrotondati; velo di evidenziazione al 22% con valore senza token; riga della regia su mobile senza misure di font proprie; casella della fase con `margin-top: 0` (sommario con `padding-left` 12px, 8px da 64em); pillole a `--sp-4` e alzate solo se la barra è attaccata al bordo basso; footer con `padding-bottom` in più; altezza minima della lista via `style.minHeight`.
- **Canvas ricompilato:** `tokens.css` e `app.css` dal nuovo codice; le anteprime del Planner (header con “?”, scheda dei progressi senza “Vai all'ultimo titolo visto”, fascia come accordion su mobile, casella sulla fase, “Dettagli” con icona) e l'header di tutte le pagine rispecchiano `main`; testi `planner.jump.last/top` aggiornati nelle 5 lingue; numeri di riga ricalcolati sul nuovo codice.

## 12 novembre 2026 · regia su mobile (decisione)

- **Pagina Film:** nuovo blocco “Regia su mobile: una riga nel Cast”. Sotto i 40em la sezione “Regia” (titolo, linee e due spazi da 24px per un nome) si nasconde e la regia diventa una riga sotto il titolo “Cast”: etichetta attenuata + nome in grassetto (“Regia Jon Favreau”, “Ideata da …” per le serie). Da 40em in su resta com'è. Nessuna chiave di traduzione nuova (`details.director`, `details.creator`, `details.missing.director`); la riga è sempre nel markup e si alterna con `.film__credit` solo via CSS, così non viene letta due volte.

## 12 novembre 2026 · numero che sale nei tuoi progressi (proposta)

- **Planner:** nuova proposta “Numero che sale nei tuoi progressi”, con due prove vive (scuro e chiaro) e tabella delle regole. Conta solo la percentuale grande: da 0 al valore in 900 ms all'arrivo, 400 ms a ogni cambio (anche al ribasso con “Azzera”), uscita decelerata `1 − (1 − t)³`, passi interi. Larghezza riservata con “100%” invisibile e `tabular-nums`. Con `prefers-reduced-motion` nessun conteggio. “12 di 34 visti” cambia di colpo. Hook `useCountUp(target, { initialMs, changeMs, enabled })` con `requestAnimationFrame`. Il numero resta `aria-hidden`: lo screen reader legge il valore finale.
- Nota: esiste già `--dur-progress` (600 ms, 0 con movimento ridotto) usato per la barra; il conteggio ha tempi propri, più lunghi.

## 12 novembre 2026 · fascia delle fasi (decisione) e correzione anteprime

- **Planner:** nuova decisione “Fascia delle fasi: solo il ‘prossimo’ con simbolo, celle più basse, accordion proprio su mobile”. Desktop: visti oro senza spunta, play proporzionale `clamp(10px, 60cqw, 16px)` sul prossimo, celle da 32px (oggi 44px). Mobile: la fascia esce dalla scheda dei progressi e diventa un accordion a sé (come le fasi), dopo “Prossimo da guardare”; sparisce la variante `inline`.
- **Bug trovato nel codice (c520ab1):** `PhaseStrip.less` r.126 usa `var(--strip-on-panel-off)`, non definita in nessun file: su mobile le celle “da vedere” sono trasparenti sul pannello. Si risolve eliminando la variante `inline`.
- **Corretto nel canvas:** nelle anteprime a schermo (iframe) le icone comparivano tagliate perché l'attributo `viewBox` andava perso; rigenerate Navigation, Pagina Film, Pagine di errore, Planner, Popup generici, Profile Popup, Select. Nessun effetto sul codice.
- La pagina di confronto “Fascia fasi” (varianti A–E) è stata creata e poi eliminata.

## 12 novembre 2026 · guida nell'header (proposta)

- **Planner:** nuova proposta “Guida ‘Come leggere il planner’ nell'header” (rivede 30): il “?” esce dalla riga della ricerca e va nell'header, come il pulsante del tema, solo sul planner (`/` e `/s/:code`); stesso popup di oggi; invito della prima visita sotto il pulsante. Decisione per ora; popover e pulsante nella scheda dei progressi rimandati. Il blocco “implementata” resta.
- La pagina di confronto “Guida del planner” (varianti A–F) è stata creata e poi eliminata.

## 12 novembre 2026 · scorciatoie flottanti (proposta)

- **Planner:** nuova proposta “Scorciatoie flottanti: Ultimo visto e Torna su” (rivede 21 e 22): due pillole centrate, animate, “Ultimo visto” solo se la riga non è visibile, evidenziazione della riga per 2,4 s dopo il salto, nascoste sotto i toast. Testi “Ultimo visto” / “Torna su” nelle chiavi esistenti. Il link nella scheda dei progressi si toglie. Il blocco “implementata” resta (è ciò che fa main).
- **Pagina Film:** proposta “Torna su” (solo quel pulsante, senza riserva per la barra).
- **Planner, tabella regioni:** barra fluttuante su desktop: c520ab1 la ha (FloatingProgress.less r.17-25), ma secondo Diego sul main attuale non c'è: non verificato.
- La pagina di confronto “Scorciatoie” (varianti A–E) è stata creata e poi eliminata: le decisioni sono nel Planner.

## 11 novembre 2026 · rigenerato da main c520ab1: funzioni implementate

Riferimento `main` **c520ab1**. Nessuna pagina nuova; Planner, Popup di accesso, Accessibility (più Toast, Accordion, Popup generici, Navigation) aggiornate con i valori letti dal codice.

- **Segnate come implementate** (chip “implementata · main c520ab1”, tolto “da implementare”): funzione **16** (popup di unione `MergeChoiceDialog`, variante A; toast `merge.toast` “Planner uniti: N titoli visti”, senza Annulla), **21** e **22** (“Vai all'ultimo titolo visto”, “Torna all'inizio”, “Segna tutta la fase come vista”, variante A), **23** (pagina Accessibilità, `/accessibilita`, link nel footer), **24** (popup “Multiverso completato” con coriandoli e suono, variante A; l'adesivo non c'è più), **30** (“?” accanto alla ricerca con invito alla prima visita, variante B; il blocco in fondo alla pagina non c'è più).
- **Guida:** i nomi di scheda e filtro vengono dalle chiavi dell'app (`planner.order.chronological`, `planner.tags.alternate`, `planner.filters.showAlternate`), non sono scritti nel testo; le voci “Vuoi seguire la storia?” e “Continuità alternativa” sono condizionali. Testi nelle 5 lingue e popup nelle 5 lingue nella pagina Planner.
- **Anche implementate** (stesso chip): X dei popup, importazione del planner condiviso (struttura nuova), toast, switch, select, footer (link Accessibilità, niente icona), logo, Dove guardare, copertina, Regia/Cast, indicatore visto, saga, titoli di serie, accesso senza frase introduttiva, suggerimento e-mail, nota del nome e conferme del profilo. “Password dimenticata?” è nel codice ma spenta di default (flag `VITE_PASSWORD_RESET`). Campo in errore: era già giusto (solo conferma).
- **Implementata in parte:** filtri (dissolvenza da 0,85 e `needle` fuori da `listKey` fatti; manca l'altezza minima).
- **Ancora da implementare:** cascata d'ingresso (15), “Prossimo da guardare” sempre montata (16 dell'elenco HANDOFF), layout 1098 px (17), fondo mobile (18), altezza minima dei filtri (20), icone (7), focus dopo un tocco (4); più recupero password lato server (1) e manutenzione HTML (2).
- **Proposta (12 novembre, non implementata):** casella tri-stato sul sommario della fase al posto del pulsante “Segna tutta la fase come vista” (nessuno / parziale con trattino / tutta vista in rosso), nella pagina Planner. Il blocco del pulsante resta marcato come implementato (è quello che fa main).
- **Rimandata:** funzione 20 (spunta per episodio): resta nel canvas con chip “rimandata”.
- **Inventario privacy:** `mcu-planner-sound`, `mcu-planner-guide-seen` aggiunti alla tabella di Popup generici.
- **Righe citate** rimappate su c520ab1 (diff riga per riga); dove la riga non esiste più è citato solo il file.
- **Rimosso dal canvas:** adesivo `CompletionSticker`, accordion `PlannerGuide` (sezioni di Planner e Accordion).

## 11 novembre 2026 · aggiornamento a main 2b5e07a: conferme, decisioni, nuove funzioni

Riferimento `main` **2b5e07a**. Nessuna pagina nuova: tutto è scritto nelle pagine esistenti, con tabelle “Prima, dopo, file”.

- **A · già fatto da Code:** Toast (Annulla, Accedi, Riprova chiudono: confermato, con la correzione che `finally` chiude anche l'errore rimesso in coda), Focus (WCAG 2.4.7 scritta in Accessibility), Admin manutenzione (confermato), trattino lungo nei titoli di serie (due punti, regola nelle 5 lingue).
- **B · decisioni** (chip “decisione · da implementare”): 1 Toast, 3 X dei popup, 5 icone, 6-8 Dove guardare, 7 copertina, 9 Regia/Cast, 10 footer, 11 select, 12 prossimo da guardare, 13 layout 1098 px, 14 campo in errore, 15 importazione, 17 fondo mobile, 26 logo, 27 indicatore visto, 28 switch, 29 filtri, 31 accesso e registrazione, 32 suggerimento e-mail, 33-34 profilo, 35 saga, 36 testo mancante, 4 cascata d'ingresso. Due voci sono già nel codice e sono confermate invece di cambiate: campo in errore all'hover (`base.less` r.222-228) e cascata d'ingresso esistente (`motion.less` r.448-470, da estendere).
- **C · nuove funzioni** (chip “proposta · non implementata”, 3 varianti ciascuna, stati, testi nelle 5 lingue, preferita e perché): 16 account con dati, 20 episodi, 21 fase intera, 22 salti, 23 accessibilità, 24 completamento, 30 “?” guida. Preferite: 16 A, 20 A, 21 A, 22 A, 23 A (pagina), 24 A (suono spento di default), 30 B.
- **Citazioni rimappate:** `base.less` +7 dopo r.147, `ToastProvider.tsx` +1 dopo r.119.
- **Zip:** `canvas/` (27 pagine), `HANDOFF.md` (§2 con l'elenco per Code), `CHANGELOG.md`. Le quattro immagini (`err-shared`, `empty-search`, `empty-filters`, `err-toast`) restano in `canvas/assets/images/`.

## 11 novembre 2026 · toast della lista, main e0ee94d

- **Toast «Aggiunto/Rimosso dalla tua lista»** (`useWatched.ts` r.86-116): descritto nella pagina **Toast** (sezione “Aggiunto o rimosso dalla lista”: i tre casi, `id` `list-change`, 8 s, Annulla e Accedi, coda delle scritture, testi `planner.list.*`, `common.undo`, `nav.login` nelle 5 lingue) e in **Planner** (sezione “Toast Aggiunto alla tua lista”).
- **Splash:** lo stile e gli script non sono più inline in `index.html` ma in `public/splash.css`, `splash-start.js`, `splash-root.js`; pagina Splash e HANDOFF aggiornati (righe citate dai nuovi file).
- **HANDOFF:** righe del recupero password aggiornate (`passwordReset.ts` r.3, `router.tsx` r.37).
- Nel codice anche: lingue diverse dall'italiano e pagine admin/privacy caricate su richiesta, `qrcode` dinamico: nessun effetto sul canvas.

## 11 novembre 2026 · allineamento a main 326d261 (50b8f34 + punto 1.12)

Il canvas è stato rigenerato dal codice su `main` **e0ee94d** (dopo l'import del canvas e l'applicazione dell'HANDOFF):

- **Token: 127 → 120.** Tolti dal codice `--fs-display`, `--fs-overline`, `--gap-section` (con il suo override sotto 40em), `--pad-strip`, `--popover-w`, `--popover-gap`, `--sp-12`; `--content-max` e `--pad-card` ora sono usati (header, footer, layout, fase). Aggiornate Spacing e layout e Typography; `tokens.css` e `app.css` compilati di nuovo.
- **Ombre.** `.card` (`base.less`) e il pannello del film (`.film__card`, `TitleDetailsPanel.less`) non hanno più `box-shadow`: la regola a tre livelli è ora applicata senza eccezioni (0 componenti, 1 StatusPage, 2 overlay). Aggiornate Colors, Planner, Pagina Film e System states.
- **Righe citate.** Rimappati i numeri di riga di `tokens.less` (da r.121 in poi sono scesi di 1-7) e di `TitleDetailsPanel.less` (da r.45 in poi, -1).
- **HANDOFF.** Tolti il punto “ombre residue” e la sezione “Token non usati”. Restano da implementare solo il recupero password lato server e la pagina HTML di manutenzione 503.
- **Contrasto riempimento/traccia:** accettato (6 celle sotto 3:1, in 4 righe; vedi Audit).
- **1.12 (Multiverso completato al 100%): implementato.** Riportato nel codice (`CompletionSticker.tsx` e `.less`, `PlannerSummary.tsx` r.48-54 e r.72, chiave `mcu-planner-completed-seen`). Descritto nella pagina **Planner** (adesivo, quando compare, movimento, chiusura, testi nelle 5 lingue). Conseguenza: il flag entra nell'inventario di Preferenze privacy (7 voci invece di 6), aggiornato in **Popup generici**.

## 11 novembre 2026 · riscrittura completa

Il canvas è stato riprogettato come un progetto di design: 27 pagine, ogni cosa definita una volta sola, ogni valore letto dal codice di `main` (commit **e0ee94d**) con file e riga. Prima c'erano le pagine del giro (decisioni, roadmap, proposte), che sono state assorbite e tolte: la storia sta in questo file.

### Struttura

- **A · Fondamenta (6):** Colors, Typography, Spacing e layout, Motion, Icone e immagini, Accessibility.
- **B · Componenti (14):** Buttons, Textfield, Select, Switch e ChoiceGroup, Accordion, Badges, Tooltip, Toast, Progress, Spoiler box, Scrollbar, Navigation, Splash, System states.
- **C · Schermate (6):** Planner, Pagina Film, Popup di accesso, Profile Popup, Popup generici, Pagine di errore.
- **Indice:** pagina, componenti usati, cartella del codice.

### Regole applicate

1. Una cosa vive in una sola pagina; le schermate usano i componenti e definiscono solo le proprie parti.
2. Il codice vince sul canvas; ciò che non è nel codice è “solo canvas”, ciò che non si trova è “non verificato”.
3. Testi reali del codice nelle 5 lingue.
4. Nessun file di rumore: niente `uploads/`, niente vecchie immagini, niente documenti duplicati.

### Decisioni e Decisioni 2: dove è finito ogni punto

| Punto | Che cosa era | Dove sta ora nel canvas | Nel codice (e0ee94d) |
|---|---|---|---|
| 1.1 | Marchio: favicon.svg, apple-touch-icon, og-image | **Icone e immagini** (marchio e file di `public/`) | sì: `public/favicon.svg`, `apple-touch-icon.png`, `og-image.png` |
| 1.2 | Header sul tablet (768–1023px): controlli estesi da 768px | **Navigation** (barra: controlli da `@tablet` 48em, menu a icona sotto) | sì |
| 1.3 | Film su mobile: barra sticky con Trailer e Dove guardare | **Superato da 2.2**: la proposta con la barra sticky non è stata adottata (2.2 dice “nessuna barra sticky”). Il comportamento adottato sta in **Pagina Film** | la barra sticky non esiste, come da 2.2 |
| 1.4 | Zona spoiler a due colonne e scheda “Informazioni” sticky | **Superato da 2.3** (riga da 460px invariata, credits adattivo): **Pagina Film** e **Spoiler box**. La scheda sticky è scartata (“solo canvas · scartata”, vedi HANDOFF §3) | credits adattivo sì; sticky no, scartata |
| 1.5 | Tracce delle barre di avanzamento a 3:1 | **Progress** (token `--track-*`, totale su oro) e **Colors** | sì |
| 1.6 | Anello di focus in ink in chiaro | **Accessibility** (token `--focus*`) e **Colors** | sì |
| 1.8 | Una sola scala tipografica | **Typography** | sì (sette token non usati tolti dal codice, due usati: vedi sotto) |
| 1.9 | Spinner e pulsazioni | **Motion** (durate e keyframe), **Buttons** e **Progress** (spinner 0,8 s / 1,6 s con movimento ridotto) | sì |
| 1.10 | Colore dell'azione principale (rosso in chiaro, oro in scuro) | **Buttons** e **Colors** (`--primary`) | sì |
| 1.11 | Variante e taglia dei 22 pulsanti | **Buttons** (regola: variante per ruolo, `lg` solo per l'azione principale). La tabella per posizione non è nel canvas: era una checklist per il codice | verificati su main: manutenzione (danger/soft), copia candidato (primary/soft), cancellazione dati e importazione; gli altri non riletti uno per uno |
| 1.12 | Momento al 100% (“Multiverso completato”) | **Planner** (sezione “Adesivo Multiverso completato”) e **Popup generici** (voce `completedSeen` in Preferenze privacy) | **implementato**: `CompletionSticker.tsx`/`.less`, `PlannerSummary.tsx` r.48-54, r.72, `storageKeys.ts` r.7 |
| 1.13 | Testi lunghi a 360px nelle 5 lingue | Era una verifica, non una decisione: l'overflow a 360/820/1440 di tutte le pagine è nell'Audit sotto | n/a |
| 2.1 | Anello di 2px in `--ink-static` sul pulsante oro della carta rossa | **Planner** (carta “Prossimo da guardare”) | sì: `NextToWatch.less` r.96-98 |
| 2.2 | Film su mobile: “Dove guardare” chiuso nel vetro | **Pagina Film** (sezione Dove guardare, con testi di `details.watch.toggle` nelle 5 lingue) | sì: `WhereToWatch.tsx` r.68 |
| 2.3 | Credits adattivo (stessa riga da 460px) | **Pagina Film** e **Spoiler box** | sì: `TitleDetailsPanel.less` r.297-310 |
| 2.4 | Sottotesto del cast a 14px | **Pagina Film** (cast) | sì: `TitleDetailsPanel.less` r.235-241 |
| 2.5 | Area di tocco del wordmark (`::after`, `inset: -7px -4px`) | **Navigation** | sì |
| 2.6 | Regola delle ombre a tre livelli | **Colors** (livelli), applicata in **System states**, **Popup generici**, **Pagine di errore** | sì: `.card` e il pannello del film non hanno più ombra |
| 2.7 | “Riprova” nel dialog del planner condiviso: riquadro fermo, pulsante in attesa | **Popup generici** (importazione, errore di caricamento) | sì: `ImportSharedDialog.tsx`, `useSharedPlanner.ts` (`isRetrying`) |
| 2.8 | Cover del film (`inset: 0 0 -1px`) | **Pagina Film** | sì |
| 2.9 | `favicon.ico` 16/32/48 | **Icone e immagini** | sì: `public/favicon.ico` |
| 2.10 | Valori già decisi (spinner 0,8 s, 1,6 s ridotto, `pulse` 1,4 s, `overflow: clip`) | **Motion**, **Buttons**, **Progress**, **Accordion**, **Select** | sì |
| Immagini | err-shared, empty-filters, empty-search, err-toast e le altre quattro | **Icone e immagini** (elenco degli 8 file e dimensioni). I prompt di generazione non sono riportati: le immagini sono tutte importate nel codice | sì: tutte importate |
| 1.7 | Admin: richiesta di schermate per l'audit | **Nessuna pagina**: le schermate admin non sono tra le 27 del piano | n/a |

**Punti che non stanno in nessuna pagina:** solo 1.7 (schermate admin, fuori piano). 1.3 e 1.4 non sono nel canvas nella forma originale perché superati da 2.2 e 2.3.

### Altre pagine e documenti: dove sono finiti

| Pagina o documento del giro | Dove è finito |
|---|---|
| Accesso animazioni, Accesso recupero, Accesso roadmap, Accesso stati | **Popup di accesso** |
| Decisioni, Decisioni 2 | tabella qui sopra |
| Errori, Errori roadmap, Pagine errore, Stati inline, ERRORI_SPEC | **Pagine di errore** (gli errori in linea rimandano a **System states**, **Textfield**, **Toast**) |
| Vuoti e condivisi | **System states** (vuoti) e **Popup generici** (link non valido, errore di caricamento) |
| Informativa planner | **Planner** (guida alla lettura come accordion) |
| Pagina Film ritocchi, Pagina Film (vecchia) | **Pagina Film** |
| Planner (vecchia), Title row | **Planner** e **Accordion** (riga del titolo) |
| Popup (vecchia), Profile Popup (vecchia), PROFILE_POPUP_SPEC | **Popup generici** e **Profile Popup** |
| Revisione codice | assorbita nelle pagine dei componenti (ogni valore ora è letto dal codice) |
| Images, Icons, Content, Spacing, Layout grid | **Icone e immagini**, **Spacing e layout** |
| Index (vecchio) | **Indice** |
| CHANGES_FOR_CODE, DA_IMPLEMENTARE, REPORT_FASE_A, github.md | **HANDOFF.md** (solo ciò che il codice non ha) |

### Correzioni al codice recepite

- Anello di focus del Select: ink in chiaro, oro in scuro, oro anche sul pannello scuro nella variante in linea.
- Toast: grassetto solo sul titolo; durata 6 s (8 s con azione), minimo 4 s, pila di 3.
- Spinner: 0,8 s con movimento normale, 1,6 s con movimento ridotto (pulsanti e poster).
- StateBox senza ombra; ombre per livello (componenti 0, StatusPage 1, overlay 2).
- Tutte le illustrazioni importate nel codice.

### Audit finale

**Componenti definiti in più pagine: 0.** Controllati i selettori delle 80 tabelle di valori: 24 comparivano in due o più pagine (per esempio `.badge`, `.skip-link`, `.password-requirement`, `[role="alert"]`); ognuno è rimasto nella pagina del componente.

**Valori scritti a mano che non sono token:** nelle 27 pagine restano 381 dichiarazioni inline, tutte di anteprima e non valori del design:
- 257 sono larghezze e altezze dei riquadri di anteprima (390, 820, 1100…: finestre di prova, non misure del design);
- 96 sono l'anello di 1px dei campioni di colore (`inset 0 0 0 1px var(--line)`) e 12 il bordo di 1px dei campioni di spaziatura;
- 8 sono lo `letter-spacing: .02em` del carattere display (mixin `.display-font()` in `mixins.less`, senza token).
Colori scritti a mano fuori dalla pagina Colors: nessuno nelle definizioni; la pagina Splash cita i fallback letterali di `public/splash.css` (`#c8202b`, `#fff`) e Pagina Film e Scrollbar citano valori `rgba` del codice nelle tabelle di valori (HANDOFF §4).

**Overflow orizzontale (27 pagine, React attivo):** a 360px, 820px e 1440px nessuna pagina supera la larghezza della finestra e nessun elemento sporge fuori da un contenitore scorrevole. Le anteprime a larghezza fissa (390/840/1100px) scorrono dentro il loro riquadro.

**Contrasti (WCAG 2.2, calcolati dai token di `tokens.css`):** testi 4,5:1, componenti grafici e anello di focus 3:1. Tutte le coppie di testo, pulsanti, focus e tracce passano. Sotto soglia, in 6 celle e 4 righe (✗ in tabella), il riempimento delle barre contro la propria traccia: **accettato**, perché il valore è sempre anche scritto come testo (HANDOFF §4). Il margine più stretto tra quelli che passano: testo `--muted-on-dark` sul pannello in scuro, 4,55:1.

| Coppia | Soglia | Chiaro | Scuro |
|---|---|---|---|
| Testo ink su bg | 4,5:1 | 15,13 | 17,65 |
| Testo ink su surface | 4,5:1 | 16,86 | 14,79 |
| Testo ink-2 su bg | 4,5:1 | 6,40 | 10,11 |
| Testo ink-2 su surface | 4,5:1 | 7,13 | 8,47 |
| Testo accent-text su bg | 4,5:1 | 5,85 | 5,87 |
| Testo accent-text su surface | 4,5:1 | 6,52 | 4,92 |
| Testo danger-text su bg | 4,5:1 | 6,51 | 7,03 |
| Testo danger-text su surface | 4,5:1 | 7,25 | 5,89 |
| Pulsante primario: on-primary su primary | 4,5:1 | 5,68 | 10,18 |
| Pulsante pericolo: on-danger su danger | 4,5:1 | 6,54 | 6,48 |
| Pulsante disabilitato: on-disabled su disabled | 4,5:1 | 5,00 | 7,40 |
| Oro: ink-static su highlight | 4,5:1 | 9,39 | 9,39 |
| Pannello: on-dark su panel | 4,5:1 | 16,27 | 8,96 |
| Pannello: muted-on-dark su panel | 4,5:1 | 8,26 | 4,55 |
| Pannello: highlight su panel | 3:1 | 9,39 | 5,17 |
| Non testo: primary su bg (pulsante) | 3:1 | 4,80 | 10,18 |
| Non testo: primary su surface | 3:1 | 5,34 | 8,53 |
| Non testo: focus-color su bg | 3:1 | 15,13 | 10,18 |
| Non testo: focus-color su surface | 3:1 | 16,86 | 8,53 |
| Non testo: focus-on-inverse (highlight/ink-static) su panel | 3:1 | 9,39 | 5,17 |
| Non testo: ink-2 su surface (bordo campo) | 3:1 | 7,13 | 8,47 |
| Traccia: track-panel su panel | 3:1 | 3,37 | 3,28 |
| Traccia: track-surface su surface | 3:1 | 3,47 | 3,17 |
| Traccia totale su oro (ink-static 55%) su highlight | 3:1 | 3,29 (stesso in entrambi) | 3,29 (stesso in entrambi) |
| Riempimento riga (accent) su traccia | 3:1 | 1,54 ✗ | — |
| Riempimento riga (highlight) su traccia | 3:1 | — | 2,70 ✗ |
| Riempimento barra flottante (highlight) su traccia | 3:1 | 2,79 ✗ | 1,58 ✗ |
| Riempimento totale (ink-static) su traccia sull'oro | 3:1 | 2,85 ✗ (stesso in entrambi) | 2,85 ✗ (stesso in entrambi) |

**Token:** i 120 token del canvas coincidono con quelli di `tokens.less` su e0ee94d (verificato dopo aver tolto i sette non usati).
