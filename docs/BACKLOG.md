# Marvel Planner: cosa manca da vedere e da fare

Documento di lavoro (20 novembre 2026), scritto dopo un controllo del sito. **Non è un file di design.** Qui sta tutto ciò che sta dietro la grafica: regole, sicurezza, accessibilità tecnica, testi, dati, funzioni. Come appaiono le cose lo decide **Claude Design** (vedi §10): Code scrive le richieste e il codice, non disegna.

I difetti trovati provando il sito (popup su Safari iPhone, tabella tagliata, Admin, numeri che non tornano…) sono in `docs/AUDIT.md`. Il pacchetto delle skill di scrittura, da installare alla fine, è in `docs/ux-writing-pack/` (vedi §6).

Stato di ogni voce: **da fare** · **da verificare** (serve un controllo a mano o uno strumento) · **da decidere** (serve il committente).

---

## 1. Contrasto forzato (Windows)

Verificato dalle schermate del committente: **da fare**.

- **Causa:** con `forced-colors: active` Windows cancella i colori di sfondo. Le celle della fascia e i pallini della legenda (`PhaseStrip.less`: `.phase-strip__cell--watched/--next/--todo`, `.phase-strip__swatch`) si distinguono solo per lo sfondo, quindi spariscono. Le miniature dei poster mostrano solo l'icona di immagine mancante.
- **Già coperto** in `src/styles/forced-colors.less`: bordi di schede e popup, campi, barre di avanzamento, caselle, opzioni del menu a tendina.
- **Manca:** fascia e legenda, marcatori di stato che non dipendano dal colore, controllo di ogni componente (popup, tooltip, tag, interruttori, Switch, ChoiceGroup, toast).
- **Regola:** nessuna informazione solo nel colore di sfondo; in contrasto forzato si usano colori di sistema (`Canvas`, `CanvasText`, `Highlight`, `ButtonText`) e `forced-color-adjust: none` solo dove serve.
- **Come si prova:** emulazione `forced-colors` nel browser, poi a mano su Windows (Impostazioni → Accessibilità → Temi a contrasto). Il tema a contrasto non è il tema scuro: sul sito vanno confrontati entrambi.
- **Chiedere a Design:** come si distinguono visto / prossimo / da vedere con soli colori di sistema.

## 2. Accessibilità

- **Pagina Accessibilità → dichiarazione di accessibilità** (da fare). Oggi `a11y.missing` dice «Stiamo ancora controllando lo zoom al 400%…»: è superata (320 px senza scorrimento orizzontale, verificato). Deve contenere: livello dichiarato (WCAG 2.2 AA), data dell'ultima verifica, limiti noti, contatto per segnalare ostacoli, data di aggiornamento. Resta pagina (URL stabile). Riferimenti da controllare con un esperto: European Accessibility Act, allegato V; non è verificato se l'attività rientri nell'obbligo; le fonti consultate non concordano se la norma citata sia WCAG 2.1 o 2.2 (EN 301 549 v3.2.1 / v4.1.1). Si punta a 2.2 AA.
- **Bersagli** (da fare): i link del footer (JustWatch, Wikipedia, CC BY-SA, OFL, TMDB) e il campo di ricerca sono sotto 24 px (WCAG 2.2, 2.5.8); `DESIGN.md` promette 44 px.
- **Lettori di schermo** (da verificare con NVDA, gratuito): fascia delle fasi, percentuale, annunci quando si segna un titolo, popup, `h2 «Accedi»` nel DOM della pagina principale (titoli di popup chiusi).
- **Contrasti numerici** (da verificare): giallo su rosso, grigio su `--row`, tema chiaro e scuro, con uno strumento di misura.
- **Zoom/riflusso:** verificato a 320 px (home). Da ripetere su Privacy, Accessibilità, Admin, TitlePage e popup.

## 3. Privacy e preferenze privacy

Base normativa: le linee guida del Garante del 10 giugno 2021 (doc. web 9677876) confermano che i soli cookie tecnici non richiedono né banner né consenso, ma l'**informativa resta obbligatoria**. Aggiornamenti successivi non verificati.

- **Popup «Preferenze privacy»** (da fare):
  - l'introduzione e «Nessun consenso da dare» dicono la stessa cosa: tenerne una;
  - il titolo «Questa pagina elenca tutto ciò che…» è un `h3` che dovrebbe essere la didascalia della tabella, e dice «pagina» dentro un popup;
  - la tabella su telefono spezza i nomi tecnici (`better-auth.session_token`, `mcu-planner-v1`) a metà parola e schiaccia le colonne: serve una scheda per voce sotto 40em (disegno: Design).
- **Trailer YouTube** (da decidere): se YouTube imposta cookie quando si avvia il trailer, il testo lo dice solo tra parentesi. Opzioni: metterlo in evidenza e/o usare l'embed `youtube-nocookie.com` con avviso prima del caricamento.
- **Revisione legale una tantum** (da decidere): un avvocato o consulente privacy rivede i testi (privacy + cookie). Strumenti come iubenda sono modelli di testo, non una garanzia; il loro script incorporato contraddice la regola «nessuna risorsa di terzi» (CSP): se mai, si copia il testo come pagina statica. Prezzi non verificati.
- **Se un giorno si aggiunge qualunque strumento di analisi, pubblicità o integrazione di terzi:** consenso preventivo e informativa aggiornata prima (regola di CLAUDE.md).

## 4. Coerenza di pagine e popup

**Da verificare** (audit con un browser a 320, 768, 1280 px, confrontando con `src/styles/tokens.less`):

- padding e margini di ogni pagina: Planner, Titolo, Privacy, Accessibilità, Admin, Errore, Manutenzione, 404;
- titolo, larghezza di lettura e distanza dal footer uguali nelle pagine di testo (oggi Privacy e Accessibilità hanno una struttura diversa dalle altre);
- popup: `Modal.less` e le viste che lo usano (accesso, profilo, suggerimenti, condivisione, conferma, preferenze privacy): stessa testata, stessi padding, stesse azioni;
- il risultato va in un elenco di scostamenti per Design (`DESIGN.md`, «Deviazioni»), non in correzioni di stile fatte da Code.

## 5. Footer

- **Titolo «Marvel Planner» che cambia colore al passaggio del mouse** (da fare): `.wordmark` ha un hover per il logo dell'header (`AppHeader.less`) che si applica anche al `<p class="wordmark wordmark--large">` del footer, che non è un link. Limitare l'hover al logo dell'header.
- **Testo TMDB** in inglese senza `lang="en"` (da fare); il logo TMDB c'è.
- **Versione del planner** (da fare): da `package.json` a build (`define` in Vite), mostrata nel footer.
- **Riordino** (da decidere con Design): il footer oggi mescola avviso, crediti dati, caratteri, TMDB, link legali, «Offrimi un caffè» e «Made in Italy». Serve un ordine (cosa è legale, cosa è attribuzione, cosa è altro), non solo meno testo. Come lo si impagina lo decide Design.

## 6. Testi e traduzioni

**Da fare.**

- **Superfici da fare per prime con la skill `scrittura-ux` (la usa Claude Design, insieme al disegno):** pagina Accessibilità, pagina Privacy, popup Preferenze privacy; poi la rilettura legale. Poi il resto del sito. Code non riscrive: copia i testi consegnati nei file di lingua.
- **Revisione dei testi** di `src/i18n/locales/it.ts`: per ogni voce, tenere / accorciare / togliere / riscrivere; punto di attenzione: frasi lunghe, ripetizioni, pulsanti e call to action.
- **Traduzioni (en, fr, es, de):** non letterali dall'italiano. Si scrive dall'intento con un glossario di termini fissi («Segna come visto», «Fase», «Saga», «Prossimo da guardare», «In arrivo»…), poi si controlla lunghezza (fr e de sono più lunghi) e coerenza. I titoli delle opere restano in inglese con `lang="en"`.
- **Strumenti pubblici trovati** (da valutare e leggere prima di installare; non verificati nel dettaglio e con licenze da controllare): [ux-copy di Anthropic](https://tessl.io/registry/skills/github/anthropics/knowledge-work-plugins/ux-copy/review) (microcopy, errori, stati vuoti, CTA), [content-designer/ux-writing-skill](https://content-designer.github.io/ux-writing-skill) (include scrivere per la traduzione), [TimboGP/ux-copy](https://www.skillsdirectory.com/skills/timbogp-ux-copy) (lavora sui file di traduzione esistenti), [Owl-Listener/designer-skills](https://claudeskills.info/skills/Owl-Listener/designer-skills/ux-writing/). Non ho trovato una skill specifica che confronti un file tradotto con l'originale. Qualunque skill va letta e provata su una copia prima di installarla.
- Spoiler, nomi di tributi e frasi con variabili: niente concatenazioni che presumano l'ordine delle parole.

## 7. Prestazioni e connessioni lente

**Da verificare** (non ancora misurato): Lighthouse con throttling 3G/4G lenta, peso di JS e CSS, font, immagini da `/api/images`, comportamento senza rete, stati di caricamento (`--delay-pending` 200 ms). Obiettivo: planner usabile (elenco e spunte) anche prima che arrivino poster e dettagli.

## 8. Errori

- **Pagina di errore / caricamento** (da verificare): nella schermata del titolo, dopo «Impossibile caricare i dati» resta un grande vuoto nero tra il messaggio e il footer (componenti `LoadError`, `ErrorPage`, `StatusPage`). Chiarire con il committente il caso «quando non c'è un film già visto»: non è chiaro quale stato manchi.

## 9. Admin

**Da fare.** La pagina `/admin` è confusa: dice troppo e niente di preciso. Prima serve un inventario di cosa mostra oggi e a chi serve (candidati, manutenzione, automazione, utenti, contenuti da completare, date di uscita). Poi una richiesta a Design per la struttura. Il lavoro è in parte già descritto in `docs/design/PROMPT_CODE_ADMIN.md` e nella voce 17 di `HANDOFF.md`.

## 10. Funzioni nuove (Design le disegna prima, Code le costruisce)

1. **«Non mi interessa»** (archiviare un titolo che non si vuole vedere). Terzo stato oltre visto/da vedere; escluso da percentuale, fasce e «Prossimo da guardare»; reversibile; da sincronizzare con l'account. È la più piccola e la più utile.
2. **Più planner per lo stesso account** e **planner condiviso con un amico** (le spunte di uno le vede l'altro). Cambia il modello dei dati (tabella planner, appartenenza, permessi) e la privacy (si condividono dati tra due account). Da progettare con calma.
3. **Progresso per episodio nelle serie.** Oggi si traccia il titolo intero; è la mancanza più grossa rispetto ad altri planner.
4. **Percorsi pronti** («Solo l'essenziale», «Prima di Doomsday», «Rewatch veloce»).
5. **«Dove guardarlo»** nella lingua dell'utente (JustWatch c'è già nel footer).
6. **PWA** («Aggiungi alla home», funzionamento senza rete): `manifest` + service worker. Compatibile con la CSP rigida. Non urgente.
7. **Importazione dallo streaming** (da valutare): non risulta (non verificato) un modo ufficiale per leggere la cronologia di Netflix o Disney+; servizi come Trakt o un file esportato sono più realistici. Introduce un servizio di terzi: consenso e informativa prima.
8. **Badge e confronto con gli amici** (opzionale): altri planner li usano come motivo per tornare.

## 11. Altri planner MCU (da riverificare)

Consultati solo tramite motori di ricerca, non aperti uno per uno.

- [MCU Watchlist](https://marvelwatchlist.com/about/): gratuito, con pubblicità, spunte salvate nel browser, senza account.
- [Doomsday Ready](https://www.producthunt.com/products/doomsday-ready/launches): pensato per ripassare prima di _Avengers: Doomsday_; badge e confronto con gli amici.
- [mcu-tracker](https://github.com/samrook/mcu-tracker): open source, locale, a livello di episodio.

Dove Marvel Planner è già avanti: account con sincronizzazione, cinque lingue, nessuna pubblicità né tracciamento, spoiler dietro pulsante, ordine cronologico, condivisione, suggerimenti degli utenti, accessibilità curata.

## 12. Da passare a Claude Design

Il prompt per le voci 2 e 3 (pagine Privacy e Accessibilità, popup Preferenze privacy) è già scritto: `docs/design/PROMPT_DESIGN_LEGALI.md`.

Code non decide l'aspetto. Per ognuna di queste voci Design disegna e Code implementa:

1. Fascia e legenda in contrasto forzato (§1).
2. Pagina Accessibilità come dichiarazione, con struttura uguale a Privacy (§2, §4).
3. Popup «Preferenze privacy» (§3): scheda per voce su telefono, gerarchia dei titoli.
4. Footer: ordine e gerarchia, versione (§5).
5. Pagina Admin (§9).
6. Stato di caricamento/errore a pagina intera (§8).
7. Eventuali nuove schermate per le funzioni di §10 prima di scriverle.

## 13. Non verificato (alla data del documento)

Contrasti numerici · contrasto forzato sul Windows del committente · lettori di schermo · prestazioni su rete lenta · pagina Admin e Titolo a 320 px · aggiornamenti del Garante dopo il 2021 · dettagli e prezzi di strumenti esterni citati.
