# Prompt di avvio per la sessione Code: consegne di Design, voci 25-30

Incolla questo testo all'inizio della sessione Code. È autosufficiente: non vedi la chat di Design.

---

Sei la sessione **Code** di Marvel Planner. La sessione Design ha consegnato cinque pezzi di lavoro (voci 25-30 di `docs/design/HANDOFF.md` §2). Sono **proposte approvate dal proprietario**: il tuo compito è implementarle, una alla volta, nell'ordine sotto. Ogni pezzo ha un prompt autosufficiente: leggilo prima di toccare il codice.

## Leggi, in quest'ordine

1. `CLAUDE.md` di radice e `docs/design/CLAUDE.md` (regole di lavoro; valgono sempre).
2. `DESIGN.md` e `docs/design/HANDOFF.md`: §2 (voci 25-30), §6 (scostamenti). Il codice su `main` vince sul canvas.
3. Il prompt del pezzo e il suo canvas (`docs/design/canvas/*.dc.html`, si aprono dal disco; chip «proposta · non implementata»).
4. `docs/design/CHANGELOG.md` (le voci in testa spiegano perché).

## Un avviso prima di cominciare: il commit di riferimento non è su `main`

I numeri di riga dei prompt (`File.tsx r.N`) sono di **4bfbea4**, che sta nel branch `claude/design-suite-architecture-41e77f`, non su `main`. Rispetto a `main` cambia in quattro file di codice: `Modal.tsx`, `useMediaQuery.ts`, `AccountSettings.tsx`, `StorageTable.tsx` (trascinamento dei fogli, tabella privacy che scorre). **Non portare 4bfbea4 su `main` da solo:** chiedi al proprietario. Intanto leggi quei file con `git show 4bfbea4:<percorso>` e controlla il codice vero di `main` prima di fidarti di una riga citata. Se qualcosa non torna, vale il codice di `main` e lo scrivi in `DESIGN.md`, sezione «Deviazioni».

## Ordine e dipendenze

| # | Voce | Prompt | Testi pronti | Note |
|---|------|--------|--------------|------|
| 1 | 26 · Fogli in basso e regola di chiusura | `PROMPT_CODE_FOGLI.md` | nessuno nuovo | Prima: il popup Preferenze usa `Modal`. Nuovo token `--sheet-gap` (proposto da Design, aggiungilo a `tokens.less`). |
| 2 | 25 · Popup Preferenze privacy | `PROMPT_CODE_PRIVACY.md` | in `locales_privacy.json` (chiave `proposed`) e nel prompt | Elenco dei dati a schede, tre sezioni, conferma con «Annulla». |
| 3 | 27 · Pagine Privacy e Accessibilità | `PROMPT_CODE_PAGINE_TESTO.md` | `TESTI_PAGINE.md` | Crea le classi `.text-page…`. In Privacy «Preferenze privacy» diventa un link (`rich` + `footer.privacySettings`); si toglie `privacy.cookies.link`. |
| 4 | 29 · Piè di pagina | `PROMPT_CODE_FOOTER_ADMIN.md` (voce 29) | `TESTI_ADMIN.md` (`footer.version`, `footer.copyright`) | Due fasce, scheda gialla del caffè, «Made in Italy» in basso a destra. Via `footer.credits`. |
| 5 | 30 · Admin | `PROMPT_CODE_FOOTER_ADMIN.md` (voce 30) | `TESTI_ADMIN.md` | «Da fare» e «Stato del sito» in testa, code a fisarmonica. |
| 6 | 28 · Contrasto forzato | `PROMPT_CODE_FORZATO.md` | nessuno | Per ultima: verifica tutto il resto in contrasto forzato; `forced-colors.less` esiste già su `main`, estendilo. |

I testi sono già scritti nelle cinque lingue con la skill `scrittura-ux`: **copiali, non riscriverli**. Le chiavi vanno in `src/i18n/locales/*.ts` (stesse chiavi in tutte e cinque), niente testi nel `.tsx`; per i link nelle frasi usa `rich()` con segnaposto.

## Regole che non si negoziano

- Lavora su `main`, niente branch nuovi. **Commit e push solo se il proprietario li chiede.**
- Cambia il minimo che risolve. Niente astrazioni, opzioni, dipendenze non richieste. Riusa quello che esiste.
- **Solo token esistenti** (`src/styles/tokens.less`); l'unico nuovo è `--sheet-gap` (voce 26). Un valore mancante si chiede a Design, non si inventa.
- CSP rigida: niente stili inline, script inline, risorse di altri domini. Icone solo Lucide, `aria-hidden`. Mai anello di focus rosso.
- Spoiler sempre dietro il pulsante spoiler. Titoli delle opere in inglese con `lang="en"`.
- Prima di dire «fatto», per ogni pezzo: `npm run lint`, `npm test`, `npm run build`, `npm run format:check`. Verifica a mano a 390, 1280 e 320 px, chiaro e scuro, cinque lingue (fr e de più lunghe), contrasto forzato.
- A fine di ogni pezzo: cancella la voce da HANDOFF §2, riportala in §5, metti nella pagina del canvas il chip «implementata · main <commit>», annota le deviazioni in `DESIGN.md`. La continuità tra sessioni sta nei file, non nella chat.

## Cose che NON decidi tu (sono del proprietario o del committente)

- **«© {year} Marvel Planner» nel piè di pagina:** in attesa di conferma del committente con un esperto; senza «Tutti i diritti riservati». L'anno (fisso o dalla build) è da decidere. Implementa la riga, ma segnalala come provvisoria.
- **Testi di Privacy e Accessibilità** (voce 27 e popup della 25): riscritti da Design, **vanno rilette dal committente e da un esperto prima della produzione** (fr, es, de da un madrelingua). Riferimenti di legge, durate e soggetti non sono cambiati.
- **Attribuzione TMDB:** i termini del TMDB (letti il 21 novembre) chiedono l'avviso «in evidenza» in o su l'applicazione, senza un luogo preciso, e il logo meno vistoso del logo del sito. **Il testo dell'avviso che il sito mostra oggi** («This product uses the TMDB API but is not endorsed or certified by TMDB») **non è il modello attuale** («This [website…] uses TMDB and the TMDB APIs but is not endorsed, certified, or otherwise approved by TMDB»). Segnalalo al proprietario e, con il suo ok, allinealo (footer). Non togliere il TMDB dal piè di pagina.
- **JustWatch:** il suggerimento di «Dove guardarlo» è un tooltip; se serve un'attribuzione sempre visibile è una decisione del proprietario. La riga `footer.credits` (JustWatch e Wikipedia) esce dal piè di pagina perché già attribuite dove si usano (`WhereToWatch.tsx`, `PlotSection.tsx`).
- **Pagina «Crediti»:** disegnata e **rimandata**. Non farla. Il materiale sta in `docs/design/rimandato/`.
- **Immagine del caffè:** il proprietario ne aggiungerà una; il tondo con la tazza nella scheda del caffè è il suo posto (file nostro, 72-96 px, `alt=""`). Non inventarne una.

## Quando hai finito un pezzo

Riassumi in poche righe: cosa hai fatto, cosa non hai verificato, cosa è rimasto aperto. Poi passa al successivo. Se un prompt e il codice di `main` si contraddicono in un punto che cambia l'aspetto, **fermati e chiedi**: l'aspetto lo decide Design.
