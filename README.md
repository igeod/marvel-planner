# Marvel Planner

Planner per tenere traccia di film e serie del Marvel Cinematic Universe.
Frontend React + TypeScript (Vite), backend TypeScript su Cloudflare Workers con database D1.

## Primo avvio

```bash
npm install
cp .dev.vars.example .dev.vars   # poi imposta BETTER_AUTH_SECRET con una stringa casuale
npm run db:migrate:local
npm run dev                      # sito e API su http://localhost:5173
```

## Comandi

```bash
npm run dev                 # sviluppo: frontend + Worker + D1 locale
npm run build               # type-check e build di produzione in dist/
npm run lint                # ESLint
npm test                    # test automatici (Vitest)
npm run format              # Prettier
npm run db:generate         # genera una migrazione da worker/db/schema.ts
npm run db:migrate:local    # applica le migrazioni al database locale
npm run db:migrate:remote   # applica le migrazioni al database di produzione
```

## Struttura

```
src/                        # frontend
├── app/                    # bootstrap: App, router, percorsi
├── pages/                  # una pagina per rotta (planner, privacy, cookie, errori)
├── components/
│   ├── layout/             # header, footer, layout comune
│   └── ui/                 # componenti generici riutilizzabili
├── features/
│   ├── planner/            # catalogo, filtri, progressi
│   ├── auth/               # sessione e popup di accesso e registrazione
│   ├── privacy/            # elenco di cookie e archiviazione locale, preferenze privacy
│   └── account/            # profilo, cambio password, eliminazione account
└── lib/                    # storage locale, client API

shared/                     # tipi e dati condivisi tra frontend e backend (abbinamenti TMDB)

worker/                     # backend
├── index.ts                # app Hono: monta /api/auth e /api/progress
├── auth.ts                 # configurazione Better Auth
├── db/                     # schema Drizzle e client D1
├── middleware/             # contesto per richiesta, utente obbligatorio
└── routes/                 # endpoint API

migrations/                 # migrazioni SQL generate da drizzle-kit
```

## Stili (LESS)

Ogni componente React sta in una cartella con lo stesso nome, che contiene il `.tsx` e il suo `.less` (import diretto: `../ui/Button/Button`, senza `index.ts`). Ogni gruppo di cartelle ha un `index.less` che importa i `.less` dei suoi componenti, e `src/styles/index.less` importa tutti i gruppi.

```
src/styles/
├── variables.less          # breakpoint, raggi, altezza header
├── mixins.less             # .desktop(), .on-hover(), .pill(), .block()...
├── tokens.less             # colori chiaro/scuro come variabili CSS, font
├── base.less               # reset, elementi nativi, utilità (.card, .muted, .visually-hidden)
└── index.less              # importa tokens, base e gli index dei componenti

src/components/ui/Button/   # Button.tsx, Button.less
src/components/ui/index.less
```

Un nuovo componente: creare la cartella con `.tsx`, `.less` (inizia con `@import (reference) "mixins";`), poi aggiungere una riga all'`index.less` del gruppo. Eccezioni senza stile proprio (nessun `.less`): `main.tsx`, `App`, `router` e i Provider. Qualche `.less` di wrapper (`AdminPage`, `PlannerPage`, `AuthDialogs`...) è vuoto perché lo stile sta nei componenti che contengono.

Colori e tema: le variabili in `tokens.less`; il tema (sistema, chiaro, scuro) è l'attributo `data-theme` su `<html>`, salvato in locale e applicato prima del primo rendering. Le icone sono solo Lucide. Niente stili inline né risorse esterne (CSP): le larghezze proporzionali della striscia dei progressi usano classi `phase-strip__phase--size-N`.

**Caratteri**: Anton e Hanken Grotesk, entrambi con licenza SIL Open Font License 1.1 (uso commerciale consentito), ospitati da noi tramite i pacchetti `@fontsource`. Il testo delle licenze è in `public/licenses/fonts-OFL.txt` ed è linkato dal footer: va mantenuto se si ridistribuiscono i file dei caratteri.

## API

| Metodo   | Percorso                     | Descrizione                                |
| -------- | ---------------------------- | ------------------------------------------ |
| `*`      | `/api/auth/*`                | Registrazione, login, logout, sessione     |
| `GET`    | `/api/account/export`        | Copia dei dati dell'utente (JSON)          |
| `GET`    | `/api/images/:size/:file`    | Locandine e sfondi TMDB, dal nostro server |
| `GET`    | `/api/releases`              | Date di uscita aggiornate da TMDB          |
| `GET`    | `/api/progress`              | Titoli visti dall'utente                   |
| `POST`   | `/api/progress`              | Segna come visti `{ "titleIds": [...] }`   |
| `DELETE` | `/api/progress/:titleId`     | Rimuove un titolo dai visti                |
| `DELETE` | `/api/progress`              | Azzera i progressi                         |
| `GET`    | `/api/titles/:titleId`       | Dettagli di un titolo (`?lang=`)           |
| `GET`    | `/api/titles/:titleId/watch` | Dove guardare, per paese (TMDB/JustWatch)  |
| `GET`    | `/api/share`                 | Link di condivisione attivo dell'utente    |
| `POST`   | `/api/share`                 | Crea o rigenera il link `{ days: 7         | 30  | null }` |
| `DELETE` | `/api/share`                 | Disattiva il link                          |
| `GET`    | `/api/shared/:code`          | Planner condiviso (pubblico, `no-store`)   |

Gli endpoint `/api/progress` richiedono una sessione valida e operano solo sui dati dell'utente autenticato.
Al login, i progressi salvati sul dispositivo vengono uniti a quelli dell'account.

## Condivisione del planner

Solo gli utenti registrati possono creare un link (`/s/<codice>`). Il codice è casuale (128 bit), non l'id dell'utente: si può disattivare o rigenerare, e scade dopo 7 giorni, 30 giorni o mai. Chi apre il link vede nome da supereroe e titoli visti, e può unirli ai propri o sostituirli; senza account l'importazione resta nel browser. Dalla finestra di condivisione si scarica anche un'immagine verticale (1080×1920) con percentuale e codice QR.

## Test

`npm test` esegue i test in `tests/`: filtri, progresso, date di uscita, prontezza, importazione, coerenza di catalogo e traduzioni, e (in `tests/worker/`) la logica di condivisione e pulizia su un database SQLite in memoria con le migrazioni reali.

## Sicurezza

- Password salvate solo come hash (scrypt). La regola è solo la lunghezza minima (8 per impostazione predefinita, come consiglia il NIST: niente obbligo di lettere o numeri) e sta nella riga `password_policy` di `site_setting`, quindi vale subito, senza deploy. Le password comparse in una fuga di dati (Have I Been Pwned, inviando solo i primi 5 caratteri dell'impronta) vengono rifiutate; se il servizio non risponde, la registrazione continua:
  `wrangler d1 execute DB --remote --command "UPDATE site_setting SET value = '{\"minLength\":10}' WHERE key = 'password_policy'"`
- Sessioni in cookie `httpOnly`, `secure`, `SameSite=Lax`; ogni scrittura sulle API con `Origin` o `Sec-Fetch-Site` estranei viene rifiutata (403)
- Limite ai tentativi sugli endpoint di autenticazione, salvato su D1
- Input delle API validati con Zod; query parametrizzate tramite Drizzle
- Nome utente normalizzato e limitato a 30 caratteri lato server
- Cambio password con chiusura delle altre sessioni
- Cancellazione dell'account (con password) a cascata su sessioni e progressi
- Segreti in `.dev.vars` (locale, ignorato da git) e nei secret di Cloudflare (produzione); nessun segreto nella cronologia git
- Intestazioni di sicurezza su ogni risposta (CSP senza `unsafe-inline`/`unsafe-eval`, HSTS, `nosniff`, `frame-ancestors 'none'`, Referrer-Policy, Permissions-Policy); l'unico frame ammesso è il player YouTube, caricato solo dopo un clic. Le intestazioni stanno in due posti: il Worker le manda su `/api`, `/film`, `robots.txt` e `sitemap.xml`; `public/_headers` le dà a pagine e file, che arrivano direttamente dagli asset senza passare dal Worker (più veloce e fuori dal limite di richieste del piano gratuito). Un test (`tests/worker/securityHeaders.test.ts`) le tiene uguali. Per la stessa ragione `index.html` non ha script né stili inline, e i font non vengono incorporati nel CSS: la CSP li bloccherebbe, e in locale su HTTP non se ne accorge nessuno (`tests/indexHtml.test.ts`). Gli indirizzi di anteprima di Cloudflare sono spenti (`preview_urls: false`)
- Progressi accettati solo per titoli presenti nel catalogo
- Link di condivisione con codice casuale, scadenza e limite ai tentativi falliti
- Dipendenze controllate con `npm audit` (restano solo avvisi sugli strumenti di sviluppo) e aggiornate da Dependabot

## Dettagli dei titoli

Ogni titolo del catalogo ha un abbinamento in `shared/tmdbRefs.ts` (film, oppure serie con numero di stagione). Aprendo un titolo, il frontend chiama `GET /api/titles/:titleId?lang=it|fr|es|en|de`.

Fonti, tutte interrogate dal Worker (il token TMDB non arriva mai al browser):

- **TMDB**: titolo localizzato, data, locandina, sfondo, cast, regia, sinossi breve; per le serie anche i riassunti degli episodi della stagione.
- **Wikidata + Wikipedia**: trama completa dei film nella lingua scelta (ripiego sull'inglese se la sezione manca o è troppo breve). Testo con licenza CC BY-SA 4.0: la pagina mostra sempre link all'articolo e alla licenza.

**Cache.** Il risultato di ogni coppia titolo/lingua viene salvato in D1 (`title_details_cache`) e riusato senza altre chiamate esterne: per i titoli usciti da più di 30 giorni per sempre, per quelli recenti o non ancora usciti per 24 ore. Se il rinnovo fallisce si serve la copia salvata. Il browser tiene inoltre la risposta in cache per 24 ore.

Aggiungere un titolo: inserirlo in `catalog.ts` e aggiungere la riga corrispondente in `shared/tmdbRefs.ts`.

## Prima di guardarlo

Ogni titolo ha una guida in `src/features/planner/data/guides/` (`infinity.ts`, `multiverse.ts`): l'elenco dei titoli da vedere prima, con livello (`essential`, `recommended`, `optional`) e un motivo nelle cinque lingue. Può avere anche una nota su cosa sta fuori dal planner (ad esempio i film Sony di Spider-Man).

Il pannello confronta la guida con i titoli che l'utente ha spuntato e mostra uno stato (`utils/readiness.ts`): nessun prerequisito, mancano degli essenziali, tutto l'essenziale visto, anche i consigliati, tutto visto. I motivi stanno dietro il pulsante spoiler. Per i titoli non ancora usciti l'elenco è segnalato come provvisorio.

Aggiungere o modificare una guida: scrivere la voce con gli helper `essential`, `recommended`, `optional` e `localized(en, it, fr, es, de)`. Gli id devono esistere nel catalogo.

## Scene dopo i titoli di coda

`src/features/planner/data/postCredits.ts` elenca, per i film e gli speciali, le scene nei titoli di coda: posizione (`before`, `mid`, `credits`, `end`) e una descrizione nelle cinque lingue, nascosta dietro il pulsante spoiler. I minuti non sono indicati: nessuna fonte affidabile li riporta e variano con la versione.

- `credits` significa "durante i titoli di coda" quando le fonti non permettono di dire se la scena è a metà o alla fine.
- Un titolo con `scenes: []` non ha scene; un titolo assente dall'elenco (serie, film non ancora usciti o non verificati) non mostra la sezione, per non dire "nessuna scena" quando non lo sappiamo.
- Fonti: [elenco di Wikipedia](https://en.wikipedia.org/wiki/Mid-credits_and_post-credits_scenes_in_the_Marvel_Cinematic_Universe) e trama dei singoli film.
- La durata del film arriva da TMDB e viene mostrata nei dettagli.

## Date di uscita automatiche

Lo stato "in arrivo" e le date non sono scritti a mano: il Worker legge da TMDB la data di ogni titolo e la salva in D1 (`title_release`). `GET /api/releases` le restituisce e il frontend le confronta con la data di oggi (`utils/releases.ts`).

- L'aggiornamento avviene solo dal cron, mai dalle visite: ogni esecuzione controlla al massimo 30 titoli (limite di sottorichieste di Cloudflare), prima quelli non ancora usciti. Su un database vuoto servono quindi qualche giorno per riempire tutte le date; nel frattempo vale il valore del catalogo.
- Una Cron Trigger giornaliera (`wrangler.jsonc`, `triggers.crons`) aggiorna prima i titoli non ancora usciti (ogni 12 ore al massimo), poi gli altri (ogni 7 giorni), ed elimina i dati scaduti (`services/maintenance.ts`).
- Se TMDB non ha ancora una data (ad esempio una stagione futura), vale il valore del catalogo.
- Cosa resta manuale: aggiungere un **nuovo** titolo (fase, abbinamento TMDB in `shared/tmdbRefs.ts`, guida "Prima di guardarlo", scene dopo i titoli di coda). Date, stato, locandine, cast e trame si aggiornano da soli.

## Privacy e cookie

- Cookie: solo uno tecnico di sessione (`better-auth.session_token`, 7 giorni, `HttpOnly`, `SameSite=Lax`). Nel `localStorage`: progressi (se non si ha un account), lingua, filtri, tema, ordine di vista e un flag che ricorda il messaggio di completamento già visto. Nessuna analisi, pubblicità o profilazione, nessuna risorsa di terze parti: per questo non servono né il consenso né un banner. L'elenco completo, mantenuto in `features/privacy/data/storageInventory.ts`, sta nella finestra "Preferenze privacy" (footer e informativa), insieme alla cancellazione dei dati del dispositivo. Una pagina dedicata non è obbligatoria: serve che l'informazione sia chiara e raggiungibile da ogni pagina.
- Se si aggiunge **qualsiasi** strumento non tecnico (statistiche, pubblicità, incorporamenti di terzi) occorre prima un meccanismo di consenso preventivo e granulare, e va aggiornata l'informativa.
- Le locandine passano da `/api/images` (cache di 30 giorni): il browser non contatta TMDB e non gli comunica l'indirizzo IP.
- I dati ricevuti da TMDB restano in cache al massimo 90 giorni (le condizioni d'uso di TMDB ne vietano più di 6 mesi); le righe oltre 150 giorni vengono eliminate dalla Cron.
- Sessioni scadute, token di verifica scaduti e contatori contro gli accessi ripetuti (oltre un giorno) vengono eliminati ogni giorno.
- Diritti degli utenti: l'account si modifica, si esporta (JSON) e si elimina dal popup account.
- Intestazioni di sicurezza su tutte le risposte (Worker e `public/_headers`), con Content-Security-Policy su HTTPS.
- **Prima di attivare il recupero password** (`VITE_PASSWORD_RESET=true`): le e-mail oggi non sono mai verificate e si possono cambiare senza conferma. Chi sbaglia a scrivere l'indirizzo in registrazione, o scrive quello di un altro, farebbe arrivare il link di recupero a un estraneo, che prenderebbe l'account. Servono prima la verifica dell'e-mail (alla registrazione e al cambio) e un servizio per inviarla.

## Fonti dei dati

| Dato                                                                                               | Fonte                                                                                                                                         | Note                                                                                                     |
| -------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Titoli localizzati, date, cast, regia, sinossi, locandine, sfondi, durata, riassunti degli episodi | TMDB                                                                                                                                          | Database comunitario, usato dal settore. Citazione obbligatoria: la scritta c'è, **il logo va aggiunto** |
| Trama completa dei film                                                                            | Wikipedia (via Wikidata)                                                                                                                      | Licenza CC BY-SA 4.0: link all'articolo e alla licenza sotto ogni testo                                  |
| Scene dopo i titoli di coda                                                                        | [Elenco di Wikipedia](https://en.wikipedia.org/wiki/Mid-credits_and_post-credits_scenes_in_the_Marvel_Cinematic_Universe) e articoli dei film | Posizione "a metà/alla fine" solo dove l'articolo la conferma; altrimenti "durante i titoli di coda"     |
| Cameo di Stan Lee                                                                                  | [Wikipedia, filmografia di Stan Lee](https://en.wikipedia.org/wiki/Stan_Lee_filmography)                                                      | Link alla fonte su ogni voce                                                                             |
| Fasi e saghe                                                                                       | [Wikipedia, Marvel Cinematic Universe](https://en.wikipedia.org/wiki/Marvel_Cinematic_Universe)                                               | Verificate per tutti i film e per le serie delle fasi 5 e 6                                              |
| Guida "Prima di guardarlo", traduzioni, testi legali                                               | Redazionale                                                                                                                                   | Non provengono da fonti esterne: vanno riviste da una persona                                            |

## Scheda dei titoli: dove sta cosa

- **Accordion del titolo** (utile per pianificare): locandina, sinossi, trama (dietro il pulsante spoiler), "Prima di guardarlo", pulsante "Scheda completa".
- **Popup "Scheda completa"**: sfondo, titolo originale, data, durata, regia o ideatori, sinossi, cast, trama, scene dopo i titoli di coda, scene chiave, cameo di Stan Lee.
- Le **scene chiave** (`data/keyScenes/`) sono consigli redazionali, dichiarati come tali nell'interfaccia: non hanno una fonte esterna. Si scrivono solo per i titoli di cui si hanno trame o riassunti affidabili; gli altri non mostrano la sezione.
- I **cameo di Stan Lee** (`data/easterEggs.ts`) hanno un link alla fonte. Altri easter egg vanno aggiunti solo con una fonte solida.

## Amministrazione

La pagina `/admin` è accessibile solo all'utente il cui ID è nel secret `ADMIN_USER_ID` (le API rispondono 403 a chiunque altro). L'ID si legge dall'esportazione dei dati dell'account ("Scarica i miei dati", campo `account.id`) e si imposta con `npx wrangler secret put ADMIN_USER_ID` oppure dal pannello Cloudflare (Workers → marvel-planner → Settings → Variables and secrets); in locale va in `.dev.vars`.

- **Manutenzione**: un interruttore salvato in D1 (`site_setting`). Se attivo, le API rispondono 503 a tutti tranne all'amministratore; restano aperti solo `/api/auth/*` (per poter accedere) e `/api/status`. Il sito mostra una pagina di avviso; l'amministratore, una volta entrato dall'icona di accesso, usa il sito normalmente.
- **Attività automatiche**: data e ora dell'ultima esecuzione dei due cron (giornaliero e settimanale) e presenza del token TMDB.
- **Nuovi titoli**: ogni lunedì un cron cerca su TMDB film e serie Marvel Studios con la parola chiave MCU assenti dal catalogo (esclusi making-of, podcast e simili) e le nuove stagioni di serie già presenti; finiscono in D1 (`catalog_candidate`). Per ognuno la dashboard può generare le righe da incollare in `catalog.ts` e `tmdbRefs.ts`; "Ignora" lo nasconde. L'avviso in cima al planner compare solo all'amministratore.

## Accessibilità e UX

- Link "Vai al contenuto", focus sul contenuto a ogni cambio di pagina, titolo della pagina per ogni rotta, pagina d'errore
- Moduli con `noValidate`: errori nella lingua scelta, collegati ai campi con `aria-describedby`, focus sul primo campo errato, pulsante per mostrare la password
- Conferma delle azioni distruttive con `<dialog>` nativo; filtri ricordati sul dispositivo
- Dopo l'accesso si torna alla pagina da cui si veniva
- Lingue ordinate alfabeticamente per nome nativo, ognuna scritta nella propria lingua

## Lingue

Interfaccia e contenuti sono disponibili in italiano, francese, spagnolo, inglese e tedesco. La lingua iniziale segue il browser (ripiego: inglese) e la scelta viene ricordata sul dispositivo.

- Testi dell'interfaccia: `src/i18n/locales/*.ts`. `it.ts` definisce la forma, gli altri file sono tipizzati su di essa: una chiave mancante in una lingua è un errore di compilazione.
- Nelle traduzioni, `{nome}` è un segnaposto; `rich()` permette di inserire link dentro una frase.
- Aggiungere una lingua: codice in `shared/languages.ts`, file in `locales/`, locale TMDB in `worker/services/tmdb.ts`, intestazioni della trama in `worker/services/wikipedia.ts`.

## Apertura del sito

Dopo le migrazioni il sito **parte in manutenzione** (la migrazione `0007` inserisce l'interruttore su "on"): gli utenti vedono solo la pagina di avviso e le API sono chiuse. Per aprirlo: impostare `ADMIN_USER_ID`, accedere dal pulsante "Accesso amministratori", aprire `/admin` e disattivare la manutenzione. Durante la manutenzione restano aperti solo accesso, uscita, lettura della sessione e stato del sito: non ci si può registrare.

## Pubblicazione

Tutte le richieste passano dal Worker, che serve l'API su `/api/*` e i file del sito tramite il binding `ASSETS`.
A ogni push su `main` Cloudflare esegue `npm run build` e `npx wrangler deploy`; gli altri branch generano un'anteprima.
Quando cambia lo schema del database: `npm run db:generate`, poi `npm run db:migrate:remote` prima del push.

## Dipendenze

Tutte open source con licenze permissive: React, React Router, Vite, Hono, Better Auth, Zod, ESLint, Prettier (MIT), Drizzle ORM, TypeScript (Apache-2.0), Wrangler (MIT/Apache-2.0), [Lucide](https://lucide.dev) per le icone (ISC).
