# Prompt per la sessione Code: biglietto "Condividi" e Fonti e suggerimenti

Riferimento: main 559f8bb. Questo testo è autosufficiente: non serve la chat di Design. Il codice su `main` vince sul canvas; dove differiscono, vale il codice e si scrive in `DESIGN.md`, sezione "Deviazioni".

## Prima di cominciare

1. Le consegne di Design stanno su `main` (canvas in `docs/design/canvas`, prompt in `docs/design/`). Se non le trovi, fermati e chiedilo al committente.
2. Le scelte del committente sono fatte: biglietto con titolo a `--fs-h2` **approvato**; Fonti e suggerimenti con **modulo interno al sito** (server, moderazione, antispam) **confermato** e informativa privacy da aggiornare; la verifica della licenza CC BY-SA di Wikipedia è **già stata fatta**. L'Admin è **già implementato**: non rifarlo.
3. Regole di sempre (`CLAUDE.md`): lavora su `main`, niente branch nuovi, commit solo se richiesto. Solo token esistenti, niente stili inline, niente risorse di terzi, ogni testo nelle cinque lingue (it scritto da te; en/fr/es/de: valore provvisorio uguale all'italiano, segnalalo), titoli delle opere in inglese con `lang="en"`, spoiler dietro il pulsante. Prima di dire "fatto": `npm run lint`, `npm test`, `npm run build`, `npm run format:check`.

## Ordine

1 poi 2. La voce 2 aggiunge una sezione "Suggerimenti" in `/admin`: riusa lo schema delle sezioni Admin già presenti.

## 1. Biglietto "Condividi il tuo planner" tra 1024 e 1142 px (solo CSS)

Design: `docs/design/canvas/Planner.dc.html`, blocco "Decisione · biglietto "Condividi" tra 1024 e 1142 px". File: `src/features/planner/components/PlannerSummary/PlannerSummary.less` (non serve toccare `Planner.less`).

Problema: dal desktop (64em) la scheda dei progressi misura 592 px a 1024 di finestra, ma `.progress-card` è `flex-wrap: wrap` e il biglietto `.share-poster` (250 px) sta a destra solo da 666 px di scheda (320 + 24 + 250 + 72). Sotto, va a capo sotto la percentuale e la scheda diventa alta 628-661 px invece di 354-381.

- In `.progress-card` cambia `.desktop({ padding: 32px 36px; });` in `.desktop({ padding: 32px 36px; flex-wrap: nowrap; });`. Il resto resta: `.progress-card__main` `flex: 1 1 20rem; min-width: 0` si restringe da solo (246 px a 1024 di finestra), `.share-poster` `flex: none; width: 15.625rem`. Telefono e tablet non cambiano (il biglietto non c'è, `isDesktop`).
- In `.share-poster__title` cambia `font-size: var(--fs-xl)` in `var(--fs-h2)`: in francese «planificateur» (227 px) e in spagnolo «planificador» (214 px) superavano i 206 px utili. Se il committente non approva il titolo più piccolo, salta questo punto e dillo.
- Verifica: a finestra 1024, 1130 e 1152 il biglietto sta a destra e la scheda è alta circa quanto "Prossimo da guardare"; titolo su due righe in it, en, fr, es, de.
- `DESIGN.md`, Deviazioni: «Biglietto "Condividi" (`.share-poster`): dal desktop `.progress-card` non va a capo (`flex-wrap: nowrap` da 64em), la colonna del testo scende fino a 246 px a 1024 px di finestra; titolo del biglietto a `--fs-h2` (era `--fs-xl`).»

## 2. Fonti e suggerimenti di modifica

Design: `docs/design/canvas/Fonti e suggerimenti.dc.html`. Brief completo per Code: `docs/design/tools/dsn/prompt_fonti.txt` (parte 1 "Fonti", parte 2 "Suggerisci una modifica", test, riga per le Deviazioni). Leggilo per intero e seguilo.

File: `PlotSection`, `WhereToWatch`, `EasterEggs`, `KeyScenes`, `SynopsisSection`, `BeforeYouWatch`, `PostCreditsInfo`, `ChronologicalList` in `src/features/planner/components/`, locale it/en/fr/es/de, sezione "Suggerimenti" in `/admin`.

Confermato dal committente: modulo interno al sito (la parte 2 richiede un server che riceve testo dagli utenti: Zod, Origin/Sec-Fetch-Site, limite di invii, Drizzle) e **aggiornamento dell'informativa privacy** (testo libero legato all'account, cosa succede alla cancellazione dell'account): fallo, in tutte le lingue. La licenza CC BY-SA è già stata verificata: puoi spostare la riga di attribuzione come da brief.

## Da non fare

Non cambiare l'aspetto oltre a quanto scritto qui: se serve una deviazione, scrivila in `DESIGN.md` e passala a Design. Nessun commit o push senza richiesta.
