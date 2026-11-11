# Changelog del canvas

## 11 novembre 2026 · riscrittura completa

Il canvas è stato riprogettato come un progetto di design: 27 pagine, ogni cosa definita una volta sola, ogni valore letto dal codice di `main` (commit **111347c**) con file e riga. Prima c'erano le pagine del giro (decisioni, roadmap, proposte), che sono state assorbite e tolte: la storia sta in questo file.

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

| Punto | Che cosa era | Dove sta ora nel canvas | Nel codice (111347c) |
|---|---|---|---|
| 1.1 | Marchio: favicon.svg, apple-touch-icon, og-image | **Icone e immagini** (marchio e file di `public/`) | sì: `public/favicon.svg`, `apple-touch-icon.png`, `og-image.png` |
| 1.2 | Header sul tablet (768–1023px): controlli estesi da 768px | **Navigation** (barra: controlli da `@tablet` 48em, menu a icona sotto) | sì |
| 1.3 | Film su mobile: barra sticky con Trailer e Dove guardare | **Superato da 2.2**: la proposta con la barra sticky non è stata adottata (2.2 dice “nessuna barra sticky”). Il comportamento adottato sta in **Pagina Film** | la barra sticky non esiste, come da 2.2 |
| 1.4 | Zona spoiler a due colonne e scheda “Informazioni” sticky | **Superato da 2.3** (riga da 460px invariata, credits adattivo): **Pagina Film** e **Spoiler box**. La scheda sticky è scartata (“solo canvas · scartata”, vedi HANDOFF §3) | credits adattivo sì; sticky no, scartata |
| 1.5 | Tracce delle barre di avanzamento a 3:1 | **Progress** (token `--track-*`, totale su oro) e **Colors** | sì |
| 1.6 | Anello di focus in ink in chiaro | **Accessibility** (token `--focus*`) e **Colors** | sì |
| 1.8 | Una sola scala tipografica | **Typography** | sì (nove token non usati: HANDOFF §4) |
| 1.9 | Spinner e pulsazioni | **Motion** (durate e keyframe), **Buttons** e **Progress** (spinner 0,8 s / 1,6 s con movimento ridotto) | sì |
| 1.10 | Colore dell'azione principale (rosso in chiaro, oro in scuro) | **Buttons** e **Colors** (`--primary`) | sì |
| 1.11 | Variante e taglia dei 22 pulsanti | **Buttons** (regola: variante per ruolo, `lg` solo per l'azione principale). La tabella per posizione non è nel canvas: era una checklist per il codice | verificati su main: manutenzione (danger/soft), copia candidato (primary/soft), cancellazione dati e importazione; gli altri non riletti uno per uno |
| 1.12 | Momento al 100% (“Multiverso completato”) | **Non sta in nessuna pagina** | **non esiste nel codice** (nessun `completed-seen`): va deciso se riportarlo o scartarlo |
| 1.13 | Testi lunghi a 360px nelle 5 lingue | Era una verifica, non una decisione: l'overflow a 360/820/1440 di tutte le pagine è nell'Audit sotto | n/a |
| 2.1 | Anello di 2px in `--ink-static` sul pulsante oro della carta rossa | **Planner** (carta “Prossimo da guardare”) | sì: `NextToWatch.less` r.96-98 |
| 2.2 | Film su mobile: “Dove guardare” chiuso nel vetro | **Pagina Film** (sezione Dove guardare, con testi di `details.watch.toggle` nelle 5 lingue) | sì: `WhereToWatch.tsx` r.68 |
| 2.3 | Credits adattivo (stessa riga da 460px) | **Pagina Film** e **Spoiler box** | sì: `TitleDetailsPanel.less` r.298-311 |
| 2.4 | Sottotesto del cast a 14px | **Pagina Film** (cast) | sì: `TitleDetailsPanel.less` r.236-242 |
| 2.5 | Area di tocco del wordmark (`::after`, `inset: -7px -4px`) | **Navigation** | sì |
| 2.6 | Regola delle ombre a tre livelli | **Colors** (livelli), applicata in **System states**, **Popup generici**, **Pagine di errore** | quasi: restano due ombre (HANDOFF §2, punto 3) |
| 2.7 | “Riprova” nel dialog del planner condiviso: riquadro fermo, pulsante in attesa | **Popup generici** (importazione, errore di caricamento) | sì: `ImportSharedDialog.tsx`, `useSharedPlanner.ts` (`isRetrying`) |
| 2.8 | Cover del film (`inset: 0 0 -1px`) | **Pagina Film** | sì |
| 2.9 | `favicon.ico` 16/32/48 | **Icone e immagini** | sì: `public/favicon.ico` |
| 2.10 | Valori già decisi (spinner 0,8 s, 1,6 s ridotto, `pulse` 1,4 s, `overflow: clip`) | **Motion**, **Buttons**, **Progress**, **Accordion**, **Select** | sì |
| Immagini | err-shared, empty-filters, empty-search, err-toast e le altre quattro | **Icone e immagini** (elenco degli 8 file e dimensioni). I prompt di generazione non sono riportati: le immagini sono tutte importate nel codice | sì: tutte importate |
| 1.7 | Admin: richiesta di schermate per l'audit | **Nessuna pagina**: le schermate admin non sono tra le 27 del piano | n/a |

**Punti che non stanno in nessuna pagina:** 1.12 (momento al 100%, non nel codice: da decidere) e 1.7 (schermate admin, fuori piano). 1.3 e 1.4 non sono nel canvas nella forma originale perché superati da 2.2 e 2.3.

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

**Valori scritti a mano che non sono token:** nelle 27 pagine restano 372 dichiarazioni inline, tutte di anteprima e non valori del design:
- 255 sono larghezze e altezze dei riquadri di anteprima (390, 820, 1100…: finestre di prova, non misure del design);
- 96 sono l'anello di 1px dei campioni di colore (`inset 0 0 0 1px var(--line)`) e 12 il bordo di 1px dei campioni di spaziatura;
- 9 sono lo `letter-spacing: .02em` del carattere display (mixin `.display-font()` in `mixins.less`, senza token).
Colori scritti a mano fuori dalla pagina Colors: nessuno nelle definizioni; la pagina Splash cita i fallback letterali di `index.html` (`#c8202b`, `#fff`) e Pagina Film e Scrollbar citano valori `rgba` del codice nelle tabelle di valori (HANDOFF §5).

**Overflow orizzontale (27 pagine, React attivo):** a 360px, 820px e 1440px nessuna pagina supera la larghezza della finestra e nessun elemento sporge fuori da un contenitore scorrevole. Le anteprime a larghezza fissa (390/840/1100px) scorrono dentro il loro riquadro.

**Contrasti (WCAG 2.2, calcolati dai token di `tokens.css`):** testi 4,5:1, componenti grafici e anello di focus 3:1. Tutte le coppie di testo, pulsanti, focus e tracce passano. Sotto soglia, in 6 casi su 6, il riempimento delle barre contro la propria traccia (✗ in tabella); il valore è sempre anche scritto come testo, quindi non è bloccante (HANDOFF §5). Il margine più stretto tra quelli che passano: testo `--muted-on-dark` sul pannello in scuro, 4,55:1.

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

**Token:** i 127 token del canvas coincidono con quelli di `tokens.less`; nove non sono usati dal codice (HANDOFF §4).
