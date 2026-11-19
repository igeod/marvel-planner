# Prompt per la sessione Code: popup, popup di accesso, campi di testo (voci 22, 23, 24)

Sei la sessione **Code** di Marvel Planner. Questo prompt è autosufficiente: non vedi la chat di Design. Il canvas con disegni, misure e alternative sta in `docs/design/canvas/` (pagine **Popup generici**, **Popup di accesso**, **Textfield**, sezioni in fondo, chip «proposta · non implementata»); le voci 22, 23, 24 sono in `docs/design/HANDOFF.md` §2 e in `CHANGELOG.md`. Dove il canvas e il codice su `main` differiscono vale il codice.

## Regole (CLAUDE.md di radice, valgono sempre)

- Lavora su `main`, niente branch nuovi. Commit e push solo se richiesti.
- Cambia il minimo che risolve. Niente astrazioni, opzioni, dipendenze non richieste.
- **Solo token esistenti** (`src/styles/tokens.less`): nessun colore, spazio, durata o curva scritti a mano. Qui non serve nessun valore nuovo; se pensi che serva, fermati e chiedilo a Design.
- CSP rigida: niente stili inline, script inline, risorse esterne. Icone solo Lucide. Elementi nascosti con `hidden`.
- Ogni testo visibile è tradotto in it, en, fr, es, de (`src/i18n/locales`). **Questo lavoro non aggiunge testi.**
- **Mai anello di focus rosso.** Chiaro e scuro, 390 px e 1280 px, contrasto alto (`forced-colors.less`).
- Prima di dire «fatto»: `npm run lint`, `npm test`, `npm run build`, `npm run format:check`.
- A fine lavoro: aggiungi in `DESIGN.md`, «Deviazioni del codice dal design», le righe qui sotto (e cancella la riga «Popup (`Modal.less`, `.dialog__scroll`) … da confermare con Design»), poi cancella le voci 22-24 da HANDOFF §2 e riportale in §5 («Già nel codice»), con chip «implementata · main <commit>» nelle tre pagine del canvas.

Stato di partenza: `main` 3dfc873 **più le modifiche non ancora committate** della cartella di lavoro `design-suite-architecture-41e77f` (popup di accesso unificati con `note`, `scrollbar-gutter: auto` in `Modal.less`). Se questa sessione non le ha, partono da lì: i numeri di riga sotto si riferiscono a quel stato.

---

## Voce 22 · Popup: gutter, padding, pulsante principale

File: `src/components/ui/Modal/Modal.less`, `Modal.tsx`, `src/styles/base.less` (r.56-61 `.scroll-y`), `src/components/ui/ConfirmDialog/ConfirmDialog.less` (r.78-85), `src/features/suggest/components/SuggestForm/SuggestForm.tsx` e `.less`, `src/features/account/components/ProfileSection/ProfileSection.tsx` e `.less`.

Misurato nel browser (Chromium, barra da 12 px come su Windows): con `scrollbar-gutter: stable` (ereditato da `.scroll-y`) il corpo ha 32 px a sinistra e **44 a destra** anche senza scorrimento (390 px: 24 / 36); con `auto` 32 / 32. La X **non scorre** (è fratella di `.dialog__scroll`, `Modal.tsx` r.209-219, a 12 px da sopra e da destra, 44 × 44 px): scorre solo il titolo, insieme al corpo.

1. **(a) Titolo e X: come oggi** (il titolo scorre col corpo, la X è fissa). Non toccare `Modal.tsx`. *Alternativa disegnata, non raccomandata:* testata fuori da `.dialog__scroll` con un filo `--line` fisso (65 px di corpo in meno quando manca spazio; la barra su un margine staccato dal bordo non è realizzabile uguale in tutti i browser).
2. **(b) `scrollbar-gutter: auto` su `.dialog__scroll`: confermato.** `Modal.less` r.26-31 resta com'è; il commento nella cartella di lavoro va bene. Con la barra presente il corpo ha 32 px dal contenuto alla barra (44 dal bordo): è voluto. *Alternativa scartata:* `stable both-edges` (44 / 44 sempre).
3. **(c) Padding invariato:** corpo `0.5rem 2rem 2rem` (r.83-87), sotto 40em `0.5rem 1.5rem calc(1.5rem + safe-area)` (r.126-128), testata come ora. I valori coincidono con `--sp-8`, `--sp-6`, `--pad-popup`: usare i token al posto dei rem è facoltativo (stesso risultato), non farlo se allarga il diff.
4. **(d) Regola unica del pulsante principale.**
   - Popup con modulo o con una sola azione: pulsante primario `size="lg"` **a tutta larghezza**, ultimo nel corpo (come accesso, registrazione, recupero, nuova password, Condividi, Importa, completamento 100%: già così).
   - Popup di decisione con due azioni: `.dialog__actions` **a destra**, la secondaria a sinistra della principale, che è sempre l'ultima (a destra; in basso quando va in colonna).
   - Sezioni dell'Account: azione a destra, stato o nota a sinistra (come «Password»).
   - Cambiano due punti. **Suggerisci:** `SuggestForm.tsx` r.81-93: via `<div className="dialog__actions">`, il `<Button type="submit" variant="primary" size="lg" …>` diretto nel form; il form (oggi senza classe, blocco) diventa `className="suggest"` con `.suggest { display: flex; flex-direction: column; gap: var(--sp-4); }` in `SuggestForm.less` (il `.suggest__context` tiene il suo `margin-bottom` o lo perde se il gap basta: misura e tieni uno solo). **Profilo:** in `ProfileSection.tsx` r.162-180 lo `Status` (e la nota `profile-name-nothing`) vanno prima del pulsante e `.profile-section__actions` prende `justify-content: flex-end`.
   - Colonna sotto 40em: la regola di `ConfirmDialog.less` r.78-85 passa da `.dialog--confirm .dialog__actions` a `.dialog__actions` (vale anche per i popup Admin).
   - *Alternative scartate:* tutto a destra, accesso compreso (cambia sette popup, bersaglio più piccolo sul telefono); tutto a tutta larghezza, conferme comprese (si perde la coppia Annulla / Conferma).
5. **Non verificato / da guardare:** `.sheet-surface()` (`mixins.less` r.78, usato da `FiltersSheet` e `HeaderMenu`) ha ancora `scrollbar-gutter: stable`: stesso effetto di 12 px a destra senza scorrimento; verifica e, se si vede, applica lo stesso `auto`. Safari e Firefox non misurati.

Verifica a mano dopo la modifica: Suggerisci corto a 1280 px = 32 / 32 px; con finestra bassa (il popup scorre) = 32 px dal contenuto alla barra; «Invia» largo quanto il campo; Profilo con «Salva» a destra anche con lo stato lungo (a capo, `flex: 1 1 200px`); conferme e Admin a 390 px in colonna.

**Riga per DESIGN.md (Deviazioni):** `Popup | Modal.less, SuggestForm, ProfileSection, ConfirmDialog.less | scrollbar-gutter: auto in .dialog__scroll; «Invia» di Suggerisci a tutta larghezza (lg), «Salva» del Profilo a destra, colonna sotto 40em per ogni .dialog__actions | voce 22 di HANDOFF §2`

---

## Voce 23 · Popup di accesso unificati: la riga del perché

File: `src/features/auth/components/AuthDialogs/AuthDialogs.tsx` (r.233-235) e `.less` (r.26-28), `src/features/planner/components/Planner/Planner.tsx` (r.232-236), `src/features/share/components/ShareDialog/ShareDialog.tsx` (r.233-239), `src/features/suggest/context/SuggestProvider.tsx` (r.17-43, schema da imitare), `src/features/planner/context/TitleAlertsProvider.tsx`.

Regola del committente (già implementata nella cartella di lavoro): ogni azione che richiede l'account apre direttamente il popup di accesso, con sopra la riga del perché («Accedi per suggerire una modifica.», «Accedi al tuo account per condividere il tuo planner.», «Accedi per essere avvisato via e-mail quando esce {titolo}.»; titolo in inglese con `lang="en"`). Nessun testo nuovo.

1. **Stile della riga: `.muted`, peso 400, corpo 16 px, nessuna icona** (`--ink-2` su `--surface`: 7,1:1 chiaro, 8,5:1 scuro). Così com'è. *Alternative disegnate, non raccomandate:* in ink con peso 600 (compete con titolo e modulo); con icona `Info` (sembra un avviso).
2. **Spazio sotto la riga: togli il `margin-bottom: var(--sp-4)` di `.auth-dialog__note`.** Misurato a 1280 px: la riga è figlia diretta di `.dialog__body` (colonna flex, gap 1,25 rem): il margine si somma al gap e dalla riga al modulo ci sono **36 px** (titolo → riga 16). Senza margine sono **20 px**, come tra la presentazione e il modulo nella registrazione. La classe resta come aggancio (regola vuota non serve: elimina la regola, tieni la classe nel markup solo se qualcosa la usa).
3. **La riga solo sull'accesso, non sul «registrati»:** `AuthDialogs.tsx` r.233, condizione `currentView === "login"` (oggi `login` o `register`). Motivo: su «Crea un account» il verbo non torna e c'è già la presentazione; la nota resta nello stato (`AuthDialogProvider`, `note ?? current.note`), quindi tornando a «Accedi» riappare; si cancella alla chiusura. *Alternativa:* su entrambe con un testo neutro («Per suggerire una modifica serve un account.»): tre testi nuovi nelle cinque lingue, da chiedere a Design/committente prima.
4. **«Condividi» riprende dopo l'accesso**, come Suggerisci (`SuggestProvider.tsx` r.17-32) e Avvisami: oggi `Planner.tsx` r.232-236 apre l'accesso ma non ricorda di aprire poi `ShareDialog`. Stesso schema: stato di attesa; alla comparsa dell'utente apri la condivisione e chiudi l'attesa; se il popup di accesso si chiude senza utente, chiudi l'attesa (render-time update come nel provider, non in un effect). *Alternativa:* lasciare com'è: rompe la regola «un'azione, un percorso». Se estrai la logica dell'attesa in una funzione pura, scrivi un test in `tests/`; se resta nel componente nessun test (il progetto non ha test di componenti), verifica a mano: ospite → Condividi → accesso → si apre la condivisione; chiusura senza accesso → non si apre nulla.

**Riga per DESIGN.md (Deviazioni):** `Popup di accesso | AuthDialogs.tsx/.less, Planner.tsx | riga del perché solo sull'accesso e senza margine (il gap di .dialog__body la separa dal modulo); «Condividi» riprende dopo l'accesso | voce 23 di HANDOFF §2`

---

## Voce 24 · Campi di testo: un solo contorno a fuoco

File: `src/styles/base.less` (r.187-248), `src/components/ui/Field/Field.less` (r.32-37 anello, r.66-99 pulsante «svuota» / occhio) e `Field.tsx`, `src/components/ui/SelectField/SelectField.less` (r.154-170 trigger), `src/features/planner/components/PlannerSearch/PlannerSearch.less` (r.22-32, l'esempio da imitare), `src/styles/forced-colors.less` (r.367-377).

Causa del «bordo sovrapposto all'anello»: l'hover è `box-shadow: inset 0 0 0 2px var(--row-hover)` (`base.less` r.215) e `:focus-visible` non lo spegne: con il mouse sopra un campo a fuoco l'anello da 3 px (`--focus`, offset 0 in `Field.less` r.34-36) e la riga interna da 2 px sono due contorni contigui. Lo stesso per la riga rossa dell'errore (r.240-248). La ricerca del planner lo evita già (`PlannerSearch.less` r.23: hover solo `:not(:focus-within)`).

**Regola: un solo contorno per volta. A fuoco c'è l'anello e nient'altro dentro il campo.**

1. In `base.less`, il blocco degli `input` / `textarea` / `select`: l'hover diventa `&:not(:focus-visible) { .on-hover({ box-shadow: inset 0 0 0 2px var(--row-hover); }); }` (r.215).
2. Errore a fuoco: dopo le regole di `[aria-invalid="true"]` (r.240-248, **intatte** per riposo e hover), aggiungi `input[aria-invalid="true"]:focus-visible, textarea[aria-invalid="true"]:focus-visible, select[aria-invalid="true"]:focus-visible { box-shadow: none; }`, a specificità uguale o maggiore e **dopo** quelle regole. Restano il fondo (`--danger` al 12%) e il messaggio con icona (l'errore non è affidato al solo colore). Questa regola **supera** la decisione «campo in errore: hover e focus» del canvas per il solo stato invalido + focus.
3. **Anello: distanza 0, invariata** (`Field.less` r.34-36 non si tocca; fuori da `.field__control` resta `--focus-offset` di `base.less` r.217-219). *Alternativa disegnata (V2):* staccato di `--focus-offset` (3 px): l'anello da 6 px arriva a 2 px dall'etichetta e dal messaggio (gap 8 px): scartata.
4. **Bordo a riposo: nessuno, per ora (punto aperto).** Misurato sui token: il campo contro il fondo fa 1,11:1 (chiaro) e 1,19:1 (scuro), sotto il 3:1 di WCAG 1.4.11. È una decisione del **committente**; se la prende, V3: a riposo `box-shadow: inset 0 0 0 1px var(--ink-2)` (7,1:1 / 8,5:1), a hover `2px`, a fuoco nessuna (stessa regola «un contorno»), errore invariato; nessun token nuovo; `forced-colors.less` mette già il bordo 1 px. **Non farlo senza il suo sì.**
5. **Invariati** (misurati): altezza 3 rem (48 px), padding `0 var(--sp-4)`, raggio `--r-input` (16 px); etichetta 21 px, gap 8 px, messaggio `min-height: 1.25rem` (20 px), blocco da 105 px; «svuota» / occhio 44 × 44 px a 2 px da sopra e da destra, `padding-right: 3.5rem`; TextArea: `padding: var(--sp-3) var(--sp-4)`, interlinea 24 px, 3 righe = 96 px, 5 = 144 px; **maniglia (`resize: vertical`) tenuta** (alternativa: `resize: none`, più pulita ma costringe a scorrere dentro le righe); trigger del select: pillola da 52 px su `--row-hover`, anello a 3 px solo con la tastiera, nessun hover: non toccare; ricerca del planner: già a posto.
6. **Contrasto alto:** `forced-colors.less` non cambia. Le ombre sono scartate dal browser: hover e riga rossa spariscono già oggi; resta il messaggio. Non verificato in modalità contrasto alto reale di Windows.

Verifica a mano (chiaro e scuro, pagina e popup, 390 e 1280 px): campo con il mouse sopra e a fuoco = un solo anello, nessuna riga dentro; campo invalido a fuoco = anello, fondo rosato, messaggio rosso sotto; campo invalido a riposo e con hover = come ora; ricerca invariata. Nessun test nuovo (CSS puro).

**Riga per DESIGN.md (Deviazioni):** `Campi di testo | base.less | a fuoco l'ombra interna (hover, errore) è spenta: un solo contorno per volta, come la ricerca del planner; bordo a riposo non deciso (WCAG 1.4.11, V3 nel canvas) | voce 24 di HANDOFF §2`

---

## Cosa non fare

Non toccare altro (`Modal.tsx` resta com'è, nessun valore nuovo, nessun testo nuovo, nessun branch). Se un numero di riga non torna, cerca il selettore: i numeri sono dello stato descritto sopra. Se qualcosa del canvas contraddice il codice, vale il codice: segnalalo in `DESIGN.md`.
