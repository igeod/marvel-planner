# Prompt per la sessione Code: /admin, contenuti da completare e date di uscita

Riferimento: main 559f8bb. Design: `docs/design/canvas/Admin.dc.html` (pagina Admin, stati in chiaro e scuro, 390px e 880px). Questo testo è autosufficiente. Il committente deve prima scegliere le raccomandazioni o le alternative qui sotto.

## Perché

La guida "Prima di guardarlo" di VisionQuest era stata scritta prima dell'uscita e il titolo non ha post credits né scene chiave. La data tecnica si aggiorna da sola (cron giornaliero → `title_release`), i contenuti scritti a mano no. Non si generano testi: l'admin deve **sapere** cosa manca e cosa è da rivedere. Solo interfaccia in `/admin`; niente di nuovo per l'utente comune.

## Cosa costruire (nell'ordine)

### 1. Sezione "Contenuti da completare" (id `da-completare`, dopo Candidati)
- Una riga (`.admin-row.candidate`) per ogni titolo **uscito**, dal più recente. Testata: titolo (`lang="en"`), sottoriga "Tipo · uscita <data> · Fase". Sotto, quattro pillole in una griglia `.adm-kinds`: Guida, Post credits, Scene chiave, Easter egg.
- Stati della pillola (testo + icona, mai solo colore): **Presente** `admin-pill--ok` + `Check`; **Manca** `admin-pill--late` + `CircleDashed`; **Verificato** `admin-pill--never` + `Minus` (controllato, niente da aggiungere); **Da rivedere** `admin-pill--late` + `RefreshCw` (solo guida).
- Azioni di riga: **Apri nel planner** (`/titolo/:id`, `btn--soft`, `Maximize2` dopo il testo); **Copia modello** (`Copy`, `btn--primary`; copia nel codice la scheda vuota dei soli contenuti che mancano, come `buildCatalogSnippet`; etichetta "Modello copiato" per 2 s; se la copia fallisce, mostra il codice; **campi vuoti, nessun testo di trama**); **Segna verificato…** (`btn--text`, `ListChecks`, solo se c'è almeno un contenuto opzionale mancante o verificato).
- Popup **Segna verificato** (`Modal`, titolo "Verificato: niente da aggiungere"): `ChoiceGroup` a spunte con **Post credits, Scene chiave, Easter egg**; la spunta = verificato; i già verificati arrivano spuntati e si tolgono togliendo la spunta; "Annulla" (soft) e "Salva" (primary). La **guida non è verificabile come "niente"**: o c'è o manca.
- Filtro: `ChoiceGroup` radio, legenda "Mostra", tre voci: "Da completare (n)" (predefinito), "Guide da rivedere (n)", "Tutti i titoli usciti (n)". Riepilogo `admin-note`: "12 titoli da completare su 64 usciti". Si mostrano 10 righe, poi "Mostra altri 10" (`btn--soft`).
- Stato vuoto come `.candidates__empty` (`Check`): "Tutto completo: i 64 titoli usciti hanno tutti i contenuti o sono stati verificati." Con il filtro guide: "Nessuna guida da rivedere."
- Nessun testo di trama, scena o motivo dei prerequisiti in questa sezione (se mai servisse: dietro `SpoilerBox`).

### 2. "Guida da rivedere"
- Si accende se: titolo uscito **e** la guida ha `prerequisites.provisional` **e** non c'è una revisione registrata. Si spegne anche togliendo `provisional` dal codice.
- Nella riga: pillola `admin-pill--late` + `RefreshCw` "Guida da rivedere" a destra della testata, riga `admin-note` "La guida è stata scritta prima dell'uscita: l'elenco dei prerequisiti era provvisorio.", pulsante **Rivista** (`btn--primary`, `Check`, primo delle azioni; "Copia modello" diventa soft). "Rivista" registra la revisione (topic `guide`), non tocca i testi.
- Solo admin. Facoltativo: `CandidatesNotice` può aggiungere "N guide da rivedere" con link a `#da-completare`.

### 3. Sezione "Date di uscita" (id `date`, dopo la precedente)
- Elenca solo i titoli con una data da controllare, in righe come sopra: pillola **Senza data**, **Solo l'anno** (`CircleDashed`, late), **Corretta a mano** (`Pencil`, ok), **TMDB ha cambiato la data** (`RefreshCw`, late). Sottoriga: "TMDB: … · Manuale: … · In uso: …". Azione: **Modifica data** (`btn--soft`, `CalendarClock`). In fondo `btn--text` "Modifica la data di un altro titolo": stesso popup con un `SelectField` dei titoli sopra il campo.
- Riga "TMDB ha cambiato la data dopo la tua correzione": "TMDB ora dice 20 gen 2026 · La tua data: 13 gen 2026", azioni **Tieni la mia** (primary) e **Usa TMDB** (soft).
- Popup **Data di uscita · <titolo>** (`Modal`): `dl.adm-sources` con tre righe (TMDB, Scritta a mano, In uso: "20 ott 2026 (a mano)", vince la scritta a mano); `TextField` "Data scritta a mano", **solo AAAA-MM-GG** (testo, placeholder "AAAA-MM-GG"); sotto il campo, valida, la data in lettere ("20 ottobre 2026 · formato AAAA-MM-GG"); azioni `.dialog__actions`: "Torna alla data di TMDB" (`btn--text`, `Undo2`, classe `.adm-revert`, solo se esiste una data a mano), "Annulla" (soft), "Salva" (primary).
- Errori: formato o data inesistente "Data non valida. Scrivila come AAAA-MM-GG, per esempio 2026-10-13."; campo vuoto "Scrivi una data oppure usa “Torna alla data di TMDB”."; server `admin.actionError` (già nel codice).
- Conferma (`ConfirmDialog`, `tone="warning"`, `TriangleAlert`) **solo se il salvataggio cambia lo stato in arrivo↔uscito**: titolo "Segnare <titolo> come uscito?" (o "…tornare in arrivo?"), messaggio "Con la data <AAAA-MM-GG> il titolo risulta uscito: gli utenti potranno segnarlo come visto e conterà nel totale."; "Annulla" / "Conferma".
- "Torna alla data di TMDB" non chiede conferma: chiude il popup e mostra un toast "Data di TMDB ripristinata" con azione "Annulla" (ripristina la data a mano).
- Il cron giornaliero **non sovrascrive** la data a mano: salva comunque la data di TMDB in `title_release`; se differisce da quella vista all'ultima correzione, accende "TMDB ha cambiato la data".

### 4. Discrepanze tra fonti: **non farle ora** (raccomandazione)
Serve una seconda fonte e una mappa di id Wikidata per 71 titoli; le date Wikidata sono spesso copiate da TMDB o Wikipedia; il problema reale (data mancante o approssimata) lo copre il punto 3. L'alternativa economica è già dentro il punto 3 ("TMDB ha cambiato la data"). Se il committente la vuole comunque: riga `Data diversa` (`TriangleAlert`, late), testo "TMDB 13 ott 2026 · Wikidata 20 ott 2026", azioni "Usa TMDB", "Usa Wikidata" (salvano quella data come data a mano) e "Ignora" (`btn--text`, nasconde la riga finché una fonte non cambia ancora). Il canvas la mostra con chip "proposta · non raccomandata".

### 5. Aggiunta titoli senza codice: **resta lo snippet** (non disegnato)
Catalogo, `shared/tmdbRefs.ts` e guide sono dati nel codice, con test e legati ai link condivisi; un modulo non scrive le guide, quindi il codice si aprirebbe comunque; con 3-5 titoli l'anno il guadagno è piccolo. Se servirà: brief a parte (spostare il catalogo su D1 è architettura).

## Dati e server

**`shared/admin.ts`**: estendere `AdminOverview` con
```ts
type ContentKind = "guide" | "postCredits" | "keyScenes" | "easterEggs";
type ContentState = "present" | "missing" | "verifiedNone";
interface AdminTitle {
  id: string;                      // id del catalogo
  name: string;                    // titolo inglese
  type: "film" | "serie" | "special" | "animated" | "shorts";
  phase: number;
  releaseDate: string | null;      // data in uso (AAAA-MM-GG)
  releaseSource: "tmdb" | "manual" | "none";
  tmdbDate: string | null;
  manualDate: string | null;
  isReleased: boolean;             // calcolato come oggi (planner/utils/releases)
  content: Record<ContentKind, ContentState>;  // guide: solo present|missing
  guideToReview: boolean;          // uscito + provisional + nessuna revisione
  dateIssue: null | "none" | "yearOnly" | "tmdbChanged";   // "mismatch" solo se si fa il punto 4
}
// AdminOverview.titles: AdminTitle[]
```
Il worker calcola `content` importando staticamente `data/guides`, `data/postCredits.ts`, `data/keyScenes`, `data/easterEggs.ts` (se non sono importabili dal worker, generare un elenco in fase di build); `verifiedNone` viene dalla tabella sotto.

**`worker/db/schema.ts`** (migrazione Drizzle): `title_review(title_id, topic, checked_at)` con `topic` in `postCredits | keyScenes | easterEggs | guide`; `title_release_override(title_id PK, release_date, tmdb_date_at_override, set_at)`. `title_release` resta com'è.

**`worker/routes/admin.ts`** (admin + Origin/Sec-Fetch-Site già applicati, input con Zod):
- `PUT /admin/titles/:id/verified` `{ topics: ("postCredits"|"keyScenes"|"easterEggs")[] }`: imposta l'insieme dei verificati (toglie gli altri tre).
- `POST /admin/titles/:id/guide-reviewed`.
- `PUT /admin/titles/:id/release-date` `{ date: "AAAA-MM-GG" }` (regex + data reale); `DELETE` la toglie (risposta con la data di TMDB per il toast Annulla).
- `POST /admin/titles/:id/release-date/keep` (tiene la manuale e azzera "TMDB ha cambiato").
Dove oggi si legge la data di un titolo (`worker/services/releases.ts` e il resto) deve vincere `title_release_override`.

**`src/features/admin`**: `adminService.ts` (le quattro chiamate), `useAdminOverview.ts` (azioni con aggiornamento locale e `hasActionFailed`), nuovi componenti `ContentTodoSection` e `ReleaseDatesSection` (una cartella ciascuno con `.tsx` e `.less`, una riga in `components/index.less`), `AdminDashboard.tsx` (montarli dopo Candidati; aggiungerli anche a `AdminSkeleton`). Riusare `Modal`, `ConfirmDialog`, `ChoiceGroup`, `TextField`, `SelectField`, `Toast`, `buildCatalogSnippet` come modello per "Copia modello".

**Locale** `src/i18n/locales/it|en|fr|es|de.ts`, blocco `admin`: titoli sezioni, intro, riepilogo, pillole, azioni, popup, errori, conferma, toast (testi italiani sopra; le altre lingue le traduce il committente). I titoli delle opere restano in inglese con `lang="en"`.

**Stili** (solo token, già verificati): `.adm-kinds` = grid `repeat(auto-fit, minmax(8.5rem, 1fr))`, gap `--sp-2` righe e `--sp-3` colonne (4 colonne su desktop, 2 su telefono); `.adm-kind` colonna gap `--sp-1`; `.adm-kind__label` `--fs-caption`, peso 800, `--ink-2`; `.adm-sources` `dl` a due colonne `auto 1fr`, gap `--sp-1` `--sp-4`, `--fs-label`, `dt` `--ink-2`, "In uso" peso 800; `.adm-revert` `margin-inline-end: auto`. Il resto riusa `.admin-row`, `.admin-pill--*`, `.candidate__*`, `.candidates__empty`, `.dialog__actions`. Nessuna ombra, colore o durata nuovi.

**Test** (`tests/`): calcolo di `content` e `guideToReview`; override che vince sulla data di TMDB nel cron; regex della data (valide e `2026-13-40`, `20/10/2026`, `2026-02-30`); cambio di stato in arrivo↔uscito.

**Deviazioni (riga per `DESIGN.md`)**
`Admin | AdminDashboard.tsx, ContentTodoSection, ReleaseDatesSection | sezioni nuove dal canvas (pagina Admin), sezione con padding 1.25rem sotto 40em (il canvas la mostra a 1.5rem) | voce 17 di HANDOFF §2, decisa da Design`

## Scelte per il committente (raccomandazione · alternative)
1. Elenco: righe con quattro pillole, solo titoli con qualcosa da fare · tabella a colonne (troppo larga, si spezza sul telefono); raggruppare per tipo (un titolo compare tre volte).
2. Guida da rivedere: solo admin · segnale anche all'utente (sconsigliato).
3. Data a mano: solo AAAA-MM-GG · B anche AAAA-MM (conta come fine mese); C "metà/fine anno" (più testi, e non fa scattare da sola in arrivo/uscito).
4. Discrepanze: non ora · "TMDB ha cambiato la data" (già dentro il punto 3), oppure Wikidata come da canvas.
5. Titoli senza codice: resta lo snippet · brief a parte per il catalogo su D1.

Prima di dire fatto: `npm run lint`, `npm test`, `npm run build`, `npm run format:check`.
