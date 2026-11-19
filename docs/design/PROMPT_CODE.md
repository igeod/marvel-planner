# Prompt per la sessione Code: tre consegne di Design (biglietto "Condividi", Fonti e suggerimenti, /admin)

Riferimento: main 559f8bb. Questo testo è autosufficiente: non serve la chat di Design. Il codice su `main` vince sul canvas; dove differiscono, vale il codice e si scrive in `DESIGN.md`, sezione "Deviazioni".

## Prima di cominciare

1. Le tre consegne stanno su tre branch di Design, non ancora su `main`. Verifica che siano unite (`git log --oneline main` deve mostrare i commit "Design: pagina Admin nel canvas…", "Design: Fonti e suggerimenti…" e quello del biglietto "Condividi"). Se mancano, fermati e chiedilo al committente: i file da leggere (canvas e prompt) non esistono altrimenti.
2. Il committente deve aver scelto, per ogni punto, la raccomandazione o un'alternativa. Se non c'è una scelta scritta (nel prompt della consegna o in chat), implementa **la raccomandazione** solo per le voci 1 e 2 sotto; per la voce 3 (Admin) chiedi prima.
3. Regole di sempre (`CLAUDE.md`): lavora su `main`, niente branch nuovi, commit solo se richiesto. Solo token esistenti, niente stili inline, niente risorse di terzi, ogni testo nelle cinque lingue (it scritto da te; en/fr/es/de: valore provvisorio uguale all'italiano e segnalalo, li traduce il committente), titoli delle opere in inglese con `lang="en"`, spoiler dietro il pulsante. Prima di dire "fatto": `npm run lint`, `npm test`, `npm run build`, `npm run format:check`.

## Ordine consigliato

1 → 3 → 2. La voce 2 aggiunge una sezione "Suggerimenti" in `/admin` e tocca gli stessi file della voce 3 (`AdminDashboard.tsx`, `shared/admin.ts`, `worker/routes/admin.ts`, i cinque locale): fai prima l'Admin, poi i Suggerimenti sullo stesso schema, in commit separati.

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

Da non dare per scontato: la parte 2 richiede un server che riceve testo dagli utenti (Zod, Origin/Sec-Fetch-Site, limite di invii, Drizzle) e un'informativa privacy aggiornata. Il committente deve confermare la scelta (modulo interno o l'alternativa) e la verifica sulla licenza CC BY-SA di Wikipedia **prima** di togliere la riga di attribuzione dal testo della trama. Senza conferma fai solo la parte 1 senza toccare la riga della trama, e dillo.

## 3. /admin: contenuti da completare, guida da rivedere, date di uscita

Design: `docs/design/canvas/Admin.dc.html`. Brief completo per Code: `docs/design/PROMPT_CODE_ADMIN.md` (sezioni, componenti, dati nuovi in `AdminOverview`, endpoint, tabelle D1, test, riga per le Deviazioni). Leggilo per intero e seguilo.

File: `src/features/admin`, `shared/admin.ts`, `worker/routes/admin.ts`, `worker/db/schema.ts` (nuove tabelle e migrazione), cron giornaliero (`worker/services/releases.ts`: la data manuale vince su TMDB), locale it/en/fr/es/de.

Il committente sceglie le raccomandazioni di quel brief prima che tu parta. Per il punto "discrepanze tra fonti (Wikidata)" la raccomandazione è **non farlo ora**; per "aggiunta titoli senza codice" è **resta lo snippet**: non implementarli.

## Da non fare

Non cambiare l'aspetto oltre a quanto scritto qui: se serve una deviazione, scrivila in `DESIGN.md` e passala a Design. Nessun commit o push senza richiesta.
