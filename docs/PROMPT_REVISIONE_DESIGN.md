# Prompt: revisione e consolidamento del design system di Marvel Planner

Incolla il testo qui sotto in Claude Design, insieme a `marvel-planner-completo.zip`. La cartella `docs/design/` del repository contiene le pagine originali del design system: allegala anche quella, perché lo zip completo contiene solo i file presenti sul disco di Claude Design e manca di pagine come `Toast`, `Textfield`, `Motion`, `Colors`, `Typography`, `Spacing`, `Progress`, `Spoiler box`.

---

## 0. Perché ti scrivo

Negli ultimi giri ogni richiesta ha prodotto **pagine nuove** invece di correggere quelle esistenti. Il canvas ha oggi 14 pagine "di giro" (Accesso animazioni, Accesso recupero, Accesso roadmap, Accesso stati, Decisioni, Decisioni 2, Errori, Errori roadmap, Informativa planner, Pagina Film ritocchi, Pagine errore, Revisione codice, Stati inline, Vuoti e condivisi) accanto alle pagine originali del design system. Lo stesso componente è descritto in più posti con valori diversi, e io (Claude Code) non so più quale versione implementare. Questo giro **non aggiunge funzioni**: riduce, unifica e rende il canvas una fonte unica e affidabile.

Ruolo che ti chiedo: **responsabile del design system**, non autore di mockup. Il tuo lavoro è mantenere poche pagine corrette, non produrne molte.

## 1. Fonti di verità, in ordine

1. `tokens.css`: unica fonte dei valori. Nessuna pagina ripete un valore: lo cita per nome di token.
2. Le **pagine originali del design system** (fondamenta e componenti): sono la specifica. Se un componente esiste già lì, **aggiorna quella pagina**.
3. Il **codice** (repository `igeod/marvel-planner`, ramo `main`): dice cosa è davvero implementato. Quando il canvas e il codice divergono, la divergenza va dichiarata, non risolta in silenzio.
4. Le pagine "di giro" sono **registri temporanei**: sono dei log, non specifiche. Vanno assorbite e poi tolte.

## 2. Regole di lavoro (valgono per tutta la sessione)

1. **Non creare nuove pagine `.dc.html`.** Se pensi che serva una pagina nuova, scrivi perché e aspetta il mio sì. Le uniche eccezioni autorizzate sono: `Componenti` (catalogo, punto 4a) e `Archivio` (punto 4c).
2. **Prima di toccare un componente, riapri la sua pagina esistente** e leggi cosa dice. Se la modifica è piccola, correggi quella pagina. Una correzione non è mai una pagina nuova.
3. **Una pagina = una cosa.** Ogni pagina ha in testa quattro righe: "Fonte di verità per: …", "Implementato in: file del repository", "Differenze dal codice: nessuna | elenco", "Ultima modifica: data".
4. **Non inventare.** Se un valore non è in `tokens.css`, segnalalo come "token mancante" invece di scriverlo a mano. Se non hai verificato qualcosa, scrivi "Non verificato" e fermati lì.
5. **Non riaprire le decisioni chiuse** (elenco nel punto 6). Se pensi che una sia sbagliata, dimmelo in una riga con il motivo, e non cambiarla.
6. **Lavora a passi con punto di controllo.** Dopo ogni passo del punto 5 fermati, riassumi cosa hai cambiato e cosa hai tolto, e aspetta il mio "vai".
7. **Ogni modifica è un confronto**: scrivi "prima → dopo" con i valori, e il file di codice che cambia. Niente descrizioni vaghe.
8. **Usa i controlli diretti per i ritocchi piccoli** (spaziatura, colore, testo) e la chat per i cambi di struttura. Non rigenerare una pagina intera per un valore.
9. **Quando finisci, criticati**: rileggi il canvas come se fossi me, e scrivi i dubbi che hai su ciò che hai consegnato.
10. Sii economico: l'inventario (passo 1) non modifica nulla e costa poco; fallo per primo.

## 3. Cosa c'è, cosa manca, cosa si contraddice (fatti verificati sul codice e sullo zip)

### 3.1 Lo stesso componente descritto in più posti

| Componente                  | Dove è descritto oggi                                                                                                                                                                                                                                           | Problema                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Toast**                   | `Toast` originale (non nello zip), `ERRORI_SPEC.md` §4, `Stati inline`, `Vuoti e condivisi` (punto 4), `Accesso roadmap` ("Toast informativo"), `Accesso animazioni`, `Decisioni 2`                                                                             | L'originale definisce già: superficie ink in entrambi i temi, raggio 22px, altezza minima 56px, testo 16px/600, azione a pillola da 44px in oro, in basso al centro a 16px dal bordo (sopra la barra di avanzamento su mobile), 6s (8s con azione), pausa su hover e focus, `role="status"`, errori con `role="alert"` che restano fino alla chiusura; più i messaggi "Undo" per la lista e le varianti ospite/account. Le pagine nuove l'hanno ridisegnato con `--panel`, larghezza 440px, pila di 3, icona da 36px, spunta nel cerchio oro. Non è chiaro quale sia lo stato finale. |
| **Stato vuoto / errore**    | `System states` (nessuna illustrazione, titolo `--fs-h3` 800, centrato, padding `--sp-12`), `Toast` originale (tile icona 56px, titolo 20px/800), `Vuoti e condivisi` (riquadro con illustrazione 96px, `--r-xl`, senza ombra), `Stati inline`, `Pagine errore` | Tre stili di stato vuoto in tre pagine. Il codice usa il terzo (`StateBox`).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| **Spinner dei pulsanti**    | `Buttons` ("lo spinner gira per 1,6 s"), `Decisioni`/`Decisioni 2` (800ms), `Motion`                                                                                                                                                                            | 1,6s contro 800ms. Il codice usa 800ms (1,6s solo con movimento ridotto).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| **Anello di focus**         | `tokens.css` (`--focus` = `--accent`, rosso, `outline-offset` 3px), `Decisioni 2` (ink in tema chiaro), `Revisione codice` (offset 0 sui campi di testo)                                                                                                        | Tre definizioni. Il codice: `--focus-color` (ink in chiaro, oro in scuro) e offset 0 sui campi.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| **Spaziatura dei campi**    | `Accesso roadmap` (etichetta 6px, messaggio 4px, gap 12px), `Revisione codice` (8px e 8px), `Textfield` originale                                                                                                                                               | Il codice usa 8px/8px, gap 8px, 36px da campo a etichetta, 16px al pulsante.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| **Ombre**                   | `Decisioni 2` (livello 0 piatto, 1 `--shadow-card` solo StatusPage, 2 `--shadow-pop`), `ERRORI_SPEC.md`, `Pagine errore`, `Stati inline`                                                                                                                        | Il codice ha ancora `--shadow-card` su `.card` (base.less) e sulla card del film.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| **Messaggi sotto il campo** | `Accesso roadmap`, `Accesso stati`, `Revisione codice`                                                                                                                                                                                                          | Errore, avviso e suggerimento sono tutti 14px/20px con icona da 18px nel codice; le pagine più vecchie li danno a 13px per suggerimenti e avviso.                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| **Documenti di consegna**   | `HANDOFF.md`, `CHANGES_FOR_CODE.md` (quattro giri), `DA_IMPLEMENTARE.md` (tre round), `ERRORI_SPEC.md`, `PROFILE_POPUP_SPEC.md`, `REPORT_FASE_A.md`, `LEGGIMI.txt`, `PROMPT_CLAUDE_CODE.md`                                                                     | Otto documenti che si sovrappongono.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |

### 3.2 `tokens.css` è indietro rispetto alle decisioni e al codice

- Nel codice ci sono 13 token che `tokens.css` non ha: `--focus-color`, `--toast-shadow`, `--track-panel`, `--track-surface`, `--fs-h4`, `--fs-h1-sm`, `--fs-xl`, `--fs-hero`, `--fs-wordmark`, `--bar-h-lg`, `--floating-progress-clearance`, `--floating-progress-gap`, `--floating-progress-height`.
- `--bar-h-lg` è dichiarato "eliminato" in `CHANGES_FOR_CODE.md` (terzo giro) ma è ancora nel codice. Tienilo fuori dal canvas; lo tolgo io dal codice.
- `--focus` in `tokens.css` vale ancora `var(--accent)` in chiaro: contraddice `Decisioni 2` e il codice.
- I valori che coincidono differiscono solo per formato (maiuscole, spazi): è rumore, non una differenza.
- Rigenera `tokens.css` dal codice (`src/styles/tokens.less`, elenco dei token in `:root`, `.light-tokens` e `.dark-tokens`) e dammi il diff.

### 3.3 Asset

- In `canvas/assets/` restano `err-404.png`, `err-429.png`, `err-hulk.png` (circa 1 MB l'uno) che il codice non usa: `err-hulk` è stato tolto, e i WebP sono quelli giusti. Togli i PNG.
- Le quattro illustrazioni nuove sono in `assets/images/` (`err-shared`, `empty-filters`, `empty-search`, `err-toast`). Hanno già il contorno chiaro `#F2F4F8`: **niente alone scuro** su queste quattro (resta solo su `err-404/429/500/maintenance`).
- Il marchio è in `assets/brand/` (favicon SVG e ICO, apple-touch-icon, og-image) ed è già nel codice.

### 3.4 Cose che il codice fa e il canvas non dice (documentale)

- **Spoiler box**: le fonti (icona con le informazioni) restano sempre visibili; è sfocato solo il testo.
- **Cambio vista del popup di accesso**: uscita 120ms, entrata 180ms con scorrimento di 12px, altezza animata, `overflow: clip` con margine di 4px durante il cambio d'altezza.
- **Toast**: la pila rispetta un massimo di 3, l'errore persistente non viene mai espulso da uno informativo, lo stesso `id` aggiorna sul posto, il timer si ferma su hover e focus, Esc chiude.
- **429 nel login**: il modulo si blocca per il tempo che manda il server (intestazione `Retry-After`/`X-Retry-After`); senza un numero non invento un'attesa.
- **Recupero password**: tutto il client esiste ma è spento da `VITE_PASSWORD_RESET`; mancano email e server.
- **Pagina film su mobile**: "Dove guardare" è chiuso nel pannello di vetro sotto 40em.
- **Informativa del planner (`PlannerGuide`)**: il codice è ancora il vecchio (card in fondo con titolo display da 40px). Il nuovo accordion di `Informativa planner` non è ancora implementato.

## 4. Cosa devi consegnare

**a. `Componenti`: un catalogo** (una sola pagina). Una riga per componente e variante: nome, varianti, taglie, token, stati (normale, hover, press, focus, disabilitato, caricamento, errore), pagina di riferimento, file di codice, e uno stato tra **allineato**, **diverge** (con i valori del codice a fianco), **solo nel canvas**, **solo nel codice**. Includi almeno: Button (variant e size), Field (TextField, PasswordField, messaggio, requisito), FormError, Modal e dialog, Toast, StateBox, LoadError (blocco e riga), StatusPage, ErrorCode, Status, SelectField, Switch, ChoiceGroup, Tooltip e InfoTip, ProgressMeter e le quattro tracce di avanzamento, PosterImage, SpoilerBox, Chevron, AuthResult, ResendButton, PasswordRequirement.

**b. Pagine originali aggiornate** (non nuove), ciascuna con il confronto prima → dopo:

| Pagina           | Cosa assorbe                                                                                                                                                                                                              |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Toast`          | Toast di conferma, errore di salvataggio persistente, messaggi "Undo" e ospite/account, toast informativo dopo accesso e registrazione, icona (`err-toast`), comportamento in pila, posizione con la barra di avanzamento |
| `System states`  | Stato vuoto illustrato (filtri, ricerca), errore di caricamento (blocco e riga), link condiviso non valido o in errore, `StatusPage` (404, 500, manutenzione), regola unica sulle ombre                                   |
| `Buttons`        | Spinner 800ms (1,6s con movimento ridotto), varianti `danger`/`dark`, regola per taglia, i 6 cambi dei pulsanti già decisi                                                                                                |
| `Textfield`      | Spaziatura 8/8/8, anello a filo (offset 0), messaggi 14px/20px/18px, avviso blocco maiuscole con triangolo, errore sui campi per credenziali sbagliate, `labelAction`                                                     |
| `Motion`         | Cambio vista, spinner, un solo keyframe `pulse` a 1,4s, `reveal-in` 6px, durata e curva di ogni movimento                                                                                                                 |
| `Colors` / token | `--focus-color`, `--track-panel`, `--track-surface`, `--toast-shadow`, tracce a 3:1 con i contrasti                                                                                                                       |
| `Typography`     | Cinque token nuovi della scala, con l'elenco dei valori che ciascuno unisce                                                                                                                                               |
| `Progress`       | Le quattro tracce vuote a 3:1                                                                                                                                                                                             |
| `Navigation`     | Header con i controlli estesi da 48em                                                                                                                                                                                     |
| `Spoiler box`    | Box "credits" adattivo (262px solo con due o più scene), fonti sempre visibili                                                                                                                                            |
| `Pagina Film`    | "Dove guardare" ripiegato su mobile                                                                                                                                                                                       |
| `Accessibility`  | Focus in `--ink` in chiaro, bersagli da 44px (wordmark incluso)                                                                                                                                                           |
| `Images`         | Le quattro illustrazioni finali, il marchio, la regola sull'alone                                                                                                                                                         |

**c. `Archivio`**: sposta lì (o elimina) le pagine di giro dopo averle assorbite: `Accesso animazioni`, `Accesso recupero`, `Accesso roadmap`, `Accesso stati`, `Decisioni`, `Decisioni 2`, `Errori`, `Errori roadmap`, `Pagine errore`, `Stati inline`, `Vuoti e condivisi`, `Revisione codice`, `Pagina Film ritocchi`. Eccezioni: **`Informativa planner`** resta come specifica dell'accordion finché non è implementato, e `Accesso *` contiene il flusso di login e recupero password finché non lo assorbi in due pagine pulite (`Popup di accesso`, `Recupero password`, aggiorna l'Index). Per ogni pagina archiviata scrivi dove sono finiti i suoi contenuti.

**d. Un solo `HANDOFF.md` e un solo `CHANGELOG.md`**: il primo descrive lo stato attuale in un posto solo (componenti, token, regole, immagini, differenze aperte con il codice); il secondo è il registro dei giri, dal più recente. Togli `CHANGES_FOR_CODE.md`, `DA_IMPLEMENTARE.md`, `ERRORI_SPEC.md`, `PROFILE_POPUP_SPEC.md`, `REPORT_FASE_A.md`, i `LEGGIMI` e `PROMPT_CLAUDE_CODE.md` dopo averne assorbito il contenuto. Il documento di consegna per Claude Code è una sola cosa: `HANDOFF.md`.

**e. `tokens.css` rigenerato** dal codice, con il diff rispetto a quello di oggi.

**f. Un elenco "Divergenze aperte"** (massimo 15 righe). Per ciascuna: cosa dice il canvas, cosa fa il codice, le due opzioni, la tua raccomandazione e il costo. Sono le sole decisioni che spettano a me.

## 5. Passi, con punto di controllo dopo ciascuno

1. **Inventario (non modificare nulla).** Elenco di tutte le pagine e i documenti; per ogni componente di §4a le pagine che lo descrivono e i valori che dichiarano; tabella delle contraddizioni (parti dalla §3.1 e aggiungine); le pagine che propongo di assorbire e dove. Fermati e aspetta il mio "vai".
2. **Toast e stati** (famiglia 1): aggiorna `Toast` e `System states`; assorbi `Errori`, `Errori roadmap`, `Pagine errore`, `Stati inline`, `Vuoti e condivisi`. Un'unica specifica di toast e un'unica specifica degli stati. Fermati.
3. **Campi, pulsanti, movimento** (famiglia 2): `Textfield`, `Buttons`, `Motion`; assorbi `Revisione codice` e `Accesso animazioni`. Fermati.
4. **Popup di accesso e recupero password**: due pagine pulite, assorbi `Accesso roadmap`, `Accesso stati`, `Accesso recupero`. Fermati.
5. **Layout e film**: `Navigation`, `Pagina Film`, `Spoiler box`, `Progress`; assorbi `Decisioni`, `Decisioni 2`, `Pagina Film ritocchi`. Fermati.
6. **Token, tipografia, immagini, accessibilità**: `tokens.css`, `Colors`, `Typography`, `Images`, `Accessibility`; pulizia degli asset (§3.3). Fermati.
7. **Catalogo, `HANDOFF.md`, `CHANGELOG.md`, `Archivio`**, aggiornamento dell'`Index` (conta le pagine che restano). Autocritica (regola 9).

## 6. Decisioni chiuse (non riaprire)

- Focus: `--ink` in chiaro, oro in scuro; sui campi di testo offset 0 (l'anello sporge 3px).
- Spaziatura dei campi nel popup: etichetta, messaggio e gap 8px; 36px da campo a etichetta successiva; 16px dall'ultimo campo al pulsante.
- Messaggio sotto il campo: 14px, interlinea 20px, icona 18px; errore 700 `--danger-text`, avviso e suggerimento 500 `--ink-2`; l'avviso del blocco maiuscole usa il triangolo.
- Errore di credenziali sbagliate: sui campi, un solo messaggio sotto la password, nessun banner.
- Spinner 800ms lineare (1,6s con movimento ridotto); un solo keyframe `pulse` 1,4s, opacità 0,6; `reveal-in` 6px.
- Ombre: livello 0 piatto, livello 1 `--shadow-card` solo su StatusPage, livello 2 `--shadow-pop` su ciò che si sovrappone; nessuna ombra sui riquadri di stato.
- Colore dell'azione principale: rosso in chiaro, oro in scuro; il pulsante oro sulla carta rossa ha un anello di 2px in `--ink-static`.
- Animazione del cambio vista del popup (120/180ms, 12px) e altezza animata.
- Header: controlli estesi da 48em; progresso e prossimo titolo affiancati da 48em.
- Scala tipografica: i cinque token nuovi e le unioni dei valori; nessun `font-size` numerico fuori da `tokens.css` tranne i `clamp` con `cqi/cqw` dell'hero del film.
- Anello a filo sul campo di ricerca (un solo anello, niente bordo interno).
- Il recupero password resta spento finché non c'è il server; la verifica email è opzionale e non si implementa.
- Immagini: le quattro scelte in `assets/images/`, senza alone scuro; `err-hulk` eliminato.
- Marchio: la "M" a linea spezzata con il nodo oro.

## 7. Verifica prima di consegnare

Per ogni pagina toccata: nessun overflow a 360px, 820px e 1440px; tema chiaro e scuro; le cinque lingue (it, en, fr, es, de; il tedesco è il più lungo); un solo h1 per pagina; contrasto AA con la tabella dei valori; movimento ridotto descritto; stati normale, hover, press, focus, disabilitato, caricamento ed errore dove esistono. Scrivi in coda ciò che **non** hai potuto controllare, con il motivo.

## 8. Come mi rispondi

Dopo ogni passo: (1) cosa hai cambiato (prima → dopo, con i valori e i file di codice), (2) cosa hai tolto o spostato, (3) cosa non è verificato, (4) cosa mi serve da me. Niente altro. Se non capisci qualcosa, chiedi invece di decidere.
