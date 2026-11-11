# Marvel Planner

Planner per tracciare film e serie del MCU. React 19 + TypeScript + Vite (LESS), backend Hono su Cloudflare Workers, D1 con Drizzle, login con Better Auth. Cinque lingue (it base, en, fr, es, de). Comandi, struttura, API e privacy: `README.md`. Stile: `DESIGN.md`.

## Regole di lavoro

- **Git:** lavora su `main`. Mai branch nuovi. Commit solo se richiesto, push solo se richiesto.
- **Prima di dire "fatto":** `npm run lint`, `npm test`, `npm run build`, `npm run format:check` devono passare.
- **Cambia il minimo che risolve.** Niente astrazioni, opzioni o dipendenze non richieste. Prima di aggiungere un pacchetto, controlla se lo fa già il progetto o la piattaforma.
- Una cosa sola per posto: se un valore, un testo o una regola esiste già, riusalo e non copiarlo.

## Codice

- Un componente = una cartella con `.tsx`, `.less`, `index.ts`; poi una riga nell'`index.less` del gruppo (dettagli in README, sezione Stili).
- **CSP rigida:** niente stili inline, script inline o risorse di altri domini. Font ospitati da noi, immagini da `/api/images`.
- Icone solo Lucide. Elementi nascosti con l'attributo `hidden`.
- Ogni testo visibile è tradotto nelle cinque lingue (`src/i18n/locales`). I titoli delle opere restano in inglese con `lang="en"`.
- API: input validato con Zod, query solo tramite Drizzle, scritture protette da Origin/Sec-Fetch-Site. Il token TMDB non arriva mai al browser.
- Test in `tests/`; la logica nuova non banale ne ha uno.

## Stile

- La fonte dei valori è `docs/design/tokens.css`; il codice li ha in `src/styles/tokens.less`. Se divergono, vale il design e si annota in `DESIGN.md`, sezione "Deviazioni".
- Il codice **non inventa** colori, spazi, durate o curve: usa i token. Un valore nuovo si chiede al design.
- Spoiler (trame, scene dopo i titoli, motivazioni dei prerequisiti) sempre dietro il pulsante spoiler.

## Privacy e legale (non negoziabili)

- Nessuna analisi, pubblicità o risorsa di terzi. Qualsiasi strumento non tecnico richiede prima consenso preventivo e informativa aggiornata.
- Footer: avviso "non ufficiale" e attribuzione TMDB. Manca ancora il logo TMDB (vedi README, Fonti dei dati).
- Testi Wikipedia: sempre link all'articolo e alla licenza CC BY-SA 4.0.

## Due sessioni

- **Design:** token, `DESIGN.md`, stile dei componenti (`src/styles`, i `.less`). Non tocca la logica.
- **Code:** logica, dati, API, feature. Non cambia l'aspetto: se serve una deviazione, la scrive in `DESIGN.md` e la passa a Design.
- La continuità tra sessioni sta nei file, non nella chat: a fine lavoro aggiorna il file giusto, poi si può fare `/clear`.
