# Prompt per la sessione Code: pagina Crediti (voce 31)

Sei la sessione **Code** di Marvel Planner. Questo prompt è autosufficiente: non vedi la chat di Design. Il canvas con scene, misure e alternative sta in `docs/design/canvas/Crediti.dc.html` (pagina nuova, chip «proposta · non implementata»); la voce 31 è in `docs/design/HANDOFF.md` §2 e in `CHANGELOG.md`. **I testi sono già scritti, in cinque lingue, in `docs/design/TESTI_CREDITI.md`**: copiali, non riscriverli (scrittura-ux; sono testi di attribuzione e licenza: li rilegge il committente, fr/es/de un madrelingua). Dove il canvas e il codice su `main` differiscono vale il codice. **Dipende dalla voce 27** (`PROMPT_CODE_PAGINE_TESTO.md`: classi `.text-page`, `.text-head`, `.text-section`, `.text-page__facts`): fai prima quella, o crea le stesse classi.

## Regole (CLAUDE.md di radice, valgono sempre)

- Lavora su `main`, niente branch nuovi. Commit e push solo se richiesti.
- Cambia il minimo che risolve. Riusa quello che esiste (`.card`, `.muted`, `BackToTop`, le classi della voce 27). **Solo token esistenti.**
- CSP rigida: niente stili inline, script inline o risorse di altri domini (il logo TMDB è `AppFooter/tmdb-logo.svg`, già nostro). Icone solo Lucide, `aria-hidden`. Mai anello di focus rosso.
- Ogni testo visibile in it, en, fr, es, de. Chiaro e scuro, 390, 1280 e 320 px, contrasto forzato.
- Prima di dire «fatto»: `npm run lint`, `npm test`, `npm run build`, `npm run format:check`.

## Cosa fare

Una pagina `/crediti` che dice da dove arriva ogni dato, immagine, carattere e software, con la licenza. **Si aggiunge** all'attribuzione dove si usa il contenuto (le trame di Wikipedia continuano ad avere sotto il link all'articolo e alla licenza CC BY-SA 4.0; il piè di pagina continua a citare il TMDB con il logo): non sostituisce niente. Stessa famiglia delle pagine Privacy e Accessibilità: intestazione da saga, poi quattro schede numerate (Dati e immagini · Scritto da noi · Caratteri e icone · Software libero).

```tsx
// src/app/paths.ts: credits: "/crediti"; src/app/routes (stessa forma di accessibility); usePageTitle("credits.title")
// src/pages/CreditsPage/CreditsPage.tsx + .less: riusa .text-page, .text-head, .text-section, .text-page__facts (voce 27)
<article className="text-page" aria-labelledby="tp-title">
  <header className="text-head">
    <p className="text-head__kicker muted">{t("footer.legal")}</p>
    <h1 id="tp-title">{t("credits.title")}</h1>
    <p className="text-head__meta muted">{t("footer.disclaimer")}</p>
    <p className="text-head__intro">{t("credits.intro")}</p>
  </header>
  <div className="text-page__body">
    <section className="card text-section" aria-labelledby="h-data">
      <h2 id="h-data"><span className="text-section__n" aria-hidden="true">1</span>{t("credits.data.heading")}</h2>
      <dl className="text-page__facts">
        <div><dt><a href="https://www.themoviedb.org" rel="noreferrer">TMDB</a></dt>
             <dd>{t("credits.data.tmdb")}<div className="credit-tmdb"><img src={tmdbLogo} alt="" /><p lang="en">This product uses the TMDB API but is not endorsed or certified by <a …>TMDB</a>.</p></div></dd></div>
        <div><dt>JustWatch</dt><dd>{t("credits.data.justwatch")}</dd></div>
        <div><dt>Wikipedia</dt><dd>{rich("credits.data.wikipedia", { license: <a href=CC_BY_SA>{t("footer.creditsLicense")}</a> })}</dd></div>
        <div><dt>Wikidata</dt><dd>{t("credits.data.wikidata")}</dd></div>
      </dl>
    </section>
    …schede 2 (Scritto da noi), 3 (Caratteri e icone: footer.fonts + credits.type.icons), 4 (Software libero: credits.software.body con {list})
  </div>
</article>

// AppFooter: nella riga dei link legali, tra Accessibilità e Preferenze privacy: <Link to={PATHS.credits}>{t("footer.creditsLink")}</Link>; via la riga dei caratteri.
// La riga del logo (nuovo, solo questo):
.credit-tmdb { display: flex; align-items: center; gap: var(--sp-4); margin-top: var(--sp-3); font-size: var(--fs-label); color: var(--ink-2); p { margin: 0; } img { flex: none; display: block; width: 6rem; } }
// forced-colors.less: nessuna aggiunta (.card ha già il contorno; .text-section__n è della voce 27)
```

## Piè di pagina (con la voce 29, `PROMPT_CODE_FOOTER_ADMIN.md`)

Link «Crediti» (`footer.creditsLink`) tra Accessibilità e Preferenze privacy; via la riga dei caratteri dal piè di pagina (passa nella scheda 3 della pagina, stessa chiave `footer.fonts`/`footer.fontsLicense`). Il TMDB con il logo e l'avviso resta nel piè di pagina.

## Da verificare prima di pubblicare (Design non l'ha fatto)

- **Le licenze e i link dei progetti.** Design ha scritto da memoria: React, React Router, Hono, Better Auth, Zod, qrcode MIT; Drizzle ORM Apache-2.0; Lucide ISC; Anton e Hanken Grotesk SIL OFL 1.1. Controlla `package.json` e `node_modules/*/package.json` (campo `license`) e correggi la pagina se qualcosa non torna. Se il committente vuole l'elenco completo con i testi delle licenze, generalo a build da `package.json`, non a mano.
- Il logo TMDB è quello del piè di pagina (su pannello scuro): su sfondo chiaro della scheda l'ho visto leggibile, ma **non verificato** che sia la versione da usare; se il TMDB ne fornisce una per sfondi chiari, usa quella.
- Verifica a mano: 390, 1280 e 320 px (nessuno scorrimento orizzontale), chiaro e scuro, cinque lingue (de: «Quellen und Lizenzen» a 390 px), tastiera (Tab: tutti i link in ordine), contrasto forzato, zoom al 200 %. **Non verificato da Design:** Safari e Firefox, VoiceOver e NVDA.

## DESIGN.md e HANDOFF

- **Aggiungi** in `DESIGN.md`, «Deviazioni»: `Crediti | CreditsPage | pagina di lettura come Privacy e Accessibilità (voce 27) | voce 31 di HANDOFF §2`.
- **README:** «Fonti dei dati» (il logo TMDB non è più aperto) e la struttura delle pagine.
- Poi cancella la voce 31 da HANDOFF §2, riportala in §5, metti il chip «implementata · main <commit>» nella pagina del canvas.
