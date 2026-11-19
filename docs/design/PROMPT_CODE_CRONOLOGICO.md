# Prompt per la sessione Code: ordine cronologico del planner (voce 22)

Riferimento: main c0fd530. Testo autosufficiente: non serve la chat di Design. Il codice su `main` vince sul canvas; dove differiscono, vale il codice e lo scostamento va in `DESIGN.md`, sezione "Deviazioni".

**Prima di cominciare**

1. Design: `docs/design/canvas/Planner.dc.html`, blocco "Decisione · Ordine cronologico: intestazione, fonte, fascia e movimento (voce 22)" (in fondo alla pagina). Ha le cornici (desktop 1280 e telefono 390, chiaro e scuro), la prova dal vivo del movimento e la tabella dei tempi.
2. **Il committente non ha ancora scelto** tra le raccomandazioni e le alternative (A–H nel blocco). Se non ti ha detto altro, implementa le raccomandazioni; se sceglie diversamente, il blocco dice cosa cambia. **Prima della fonte (punto 2): il committente deve far verificare che la riga fissa sotto il titolo basti per la licenza CC BY-SA 4.0 della linea temporale** (la verifica già fatta riguardava la Trama). Finché non c'è l'ok, implementa lo stesso e segnalalo.
3. Regole di sempre (`CLAUDE.md`): lavora su `main`, niente branch, commit solo se richiesto. Solo token esistenti, niente stili inline, niente risorse di terzi, ogni testo nelle cinque lingue. `npm run lint`, `npm test`, `npm run build`, `npm run format:check` devono passare. Un test per la logica nuova (la fascia).

## 1. Intestazione e sezioni (A, C)

- Il cronologico usa la **stessa intestazione di una saga**: titolo grande + conteggio a destra. La scheda `.chrono` sparisce: le righe stanno nella pagina come sotto una saga.
- Estrai un componente `SagaHeader` (in `SagaSection/`) usato da `SagaSection` e da `ChronologicalList`; non copiare le classi. Struttura:
  ```
  <div class="saga__head">
    <div class="saga__header">
      <h2 class="saga__title">…</h2>
      <p class="saga__count muted">«{done} di {total} visti»</p>
    </div>
    {riga piccola, se c'è: <p class="saga__source muted">…</p>}
  </div>
  ```
  Nelle saghe resta come oggi (nessuna riga; il wrapper non cambia aspetto). `SagaSection.less`: `.saga__head { display: flex; flex-direction: column; }`, `.saga__head .saga__header { padding-bottom: var(--sp-1); }`, `.saga__source { font-size: var(--fs-caption); }`. Il resto di `.saga`, `.saga__header`, `.saga__title`, `.saga__count` non cambia. Misurato: intestazione → riga 0 px (il `padding-bottom` è già nell'intestazione), riga → prima riga del titolo 8 px (il `gap: 0.5rem` di `.saga`).
- `ChronologicalList` = due `<section class="saga" aria-labelledby=…>`: «Ordine cronologico» (titoli collocati) e, se ce ne sono, «Senza collocazione». Il conteggio è `computeProgress(titoli della sezione, watched)`: conta solo i titoli usciti (gli «in arrivo» non entrano, come ovunque). Ogni sezione ha un elenco `.title-list` (resta in `ChronologicalList.less`; il resto di `.chrono` si cancella).
- **Un solo titolo per il filtro e l'intestazione:** il filtro dice «Cronologico» (`planner.order.chronological`, invariato); il titolo è «Ordine cronologico».

## 2. La fonte (B)

- Sotto il titolo della sezione «Ordine cronologico», `<p class="saga__source muted">` con le stesse chiavi della fonte della Trama: `details.plot.sourceLabel` («Fonte:»), `details.plot.sourceLink` («Wikipedia», link a `CHRONOLOGY_SOURCE_URL`) e `details.plot.license` (link alla licenza). Due link sottolineati (stile base di `a`), nessuna icona, nessun `--highlight` (la pagina non è un pannello scuro). La stessa costante `LICENSE_URL` oggi sta dentro `PlotSection.tsx`: spostala in un posto solo (per esempio accanto a `CHRONOLOGY_SOURCE_URL`, o `shared/`) e importala dai due.
- **Nessuna icona di info** (scelta del committente). La nota lunga (`planner.order.chronologicalNote`: Disney+, «non è un ordine ufficiale», Loki, What If…?, Werewolf by Night) **si toglie**, con le chiavi `chronologicalNote` nei cinque file: quello che dice dei titoli senza posto lo dice già la sezione «Senza collocazione». Segnalalo nel riepilogo: se il committente vuole tenere «non è un ordine ufficiale», si aggiunge una frase alla riga della fonte, non un controllo.
- Nella sezione «Senza collocazione» la nota (`planner.order.unplacedNote`, testo invariato) sta nello stesso posto: stessa riga piccola `.saga__source` sotto il titolo.
- Via la chiave `planner.order.sourceLink` («Linea temporale su Wikipedia») nei cinque file.

## 3. La fascia «Tutti i N titoli» (D)

- In cronologico la fascia ha **una colonna sola**, con le barrette nell'ordine dell'elenco: prima i titoli collocati, poi i senza collocazione usciti. Stesso titolo («Tutti i {total} titoli», `planner.strip.heading`), stessa legenda, stesse celle e stato («Prossimo» = primo non visto in quell'ordine, già così per `nextId`). I titoli in arrivo non hanno barretta, come oggi.
- **Nessuna etichetta sotto le celle** (scelta del committente: «Ordine cronologico» ripeteva il titolo della sezione sotto). Né nome né «12 di 64»; resta la riga `visually-hidden` con il conteggio, come oggi. Quindi in cronologico non esiste il `<p class="phase-strip__label">`.
- `strip.ts`: aggiungi `buildChronologicalStrip(titles, watched, nextId)` (stessa forma di una colonna di `StripPhase`, senza il numero di fase: rendi `number` facoltativo, o usa un tipo di colonna con `label`). `Planner.tsx` passa a `PhaseStrip` le colonne per fase o la colonna unica a seconda di `viewOrder`. Test in `tests/` (celle nell'ordine cronologico, «next» al primo non visto, nessuna cella per i titoli in arrivo, totale = titoli usciti).
- `PhaseStrip.tsx/.less`: nessuna regola nuova. Una colonna sola a 1280 px è più bassa delle sei perché non ha la riga dell'etichetta (125 px contro 177, misurato; celle 12,8 px larghe, una riga sta fino a 701 px di contenitore); su telefono le 64 celle da 24 px vanno a capo (5 righe, accordion aperto 249 px). `--size-N` esiste fino a 40: con una colonna sola `flex: 1 1 0` basta, non servono classi nuove.
- La batteria (`data-charge`) funziona come oggi all'apertura. **Al cambio di ordine non si rigioca** (`charge` resta `undefined`).

## 4. Le righe (E)

- Solo nel cronologico: la fase in coda al meta, `Film, 2011, Fase 1`. Usa `planner.strip.phase` («Fase {number}»). **Solo virgole, come «Film, 2011»: il committente non vuole il punto di mezzo.** Ordine: tipo e anno, fase, «In arrivo»; anche «In arrivo» passa dal punto a una virgola (`Film, 2026, Fase 6, In arrivo`, stesso testo in grassetto): cambia una cosa che c'è già, annotalo in Deviazioni. Nessun chip, una sola riga di testo (a capo se serve, come oggi). Sotto le saghe le righe non cambiano (la fase è nell'intestazione sopra).
- La fase di un titolo si ricava dal catalogo (`phase.number` del gruppo che lo contiene): passala a `TitleItem` con una prop facoltativa (per esempio `phase?: PhaseNumber`) dal `ChronologicalList`.

## 5. Il movimento al cambio di ordine (F, G, H)

Token esistenti, nessuno nuovo. Ordine **dall'alto in basso**, come l'apertura del planner ma con un passo solo (niente doppio: non c'è la splash):

| Passo | Elemento | Ritardo | Durata |
|---|---|---|---|
| 0 | fascia (`.phase-strip` / `.phase-strip-accordion`) | 0 | `--dur-enter` |
| 1 | intestazioni di sezione (`.saga__head` o `.saga__header` nelle saghe) | `--stagger-step` | `--dur-enter` |
| 2 | corpo della sezione (`.title-list` o le fasi) | `--stagger-step` × 2 (tetto `--stagger-max`) | `--dur-enter` |

Fine a 60 + 240 = **300 ms** (l'apertura ne dura 600). Keyframe `swap-in`, curva `--ease-out`.

- Meccanismo: lo stesso di `:root[data-intro]` in `motion.less`. Al cambio di `viewOrder` (non al montaggio, non quando si caricano le preferenze salvate) `Planner.tsx` imposta `data-order-swap` su `.planner` e lo toglie dopo `--dur-enter` + 2 × `--stagger-step` (o all'`animationend` dell'ultimo). Nel blocco `prefers-reduced-motion: no-preference`: `.planner[data-order-swap]` imposta `--i` 0/1/2 sugli elementi della tabella e usa `animation: swap-in var(--dur-enter) var(--ease-out) backwards; animation-delay: min(calc(var(--stagger-step) * var(--i)), var(--stagger-max));`. Righe: **nessuna cascata per riga**, l'elenco entra come blocco. Per i filtri (che non cambiano l'ordine) resta `.planner__list--swap` com'è; su cambio di ordine non aggiungere quella classe, per non sommare due dissolvenze.
- **Movimento ridotto:** fascia e intestazioni cambiano senza animazione; la lista fa la dissolvenza da 85% di oggi (`list-swap-in`, `--dur-hover`, 80 ms) anche al cambio di ordine, cioè `.planner[data-order-swap] .planner__list { animation: list-swap-in var(--dur-hover) var(--ease-out); }` fuori dal blocco no-preference.
- L'altezza della lista: resta il trucco di oggi (`minHeight` della vecchia altezza per un frame, `Planner.tsx` r.161-185). Nessuna animazione dell'altezza.
- **G.** «Comprimi/Espandi tutto» sta in fondo alla colonna destra (sotto la scheda dei filtri) e resta assente in cronologico, senza transizione: è l'ultimo elemento, non sposta niente (cornici G nel canvas).
- **Colonna destra allineata alla prima riga.** Oggi `.planner__rail` parte a `@saga-header-height + 8px` (`Planner.less`), cioè a livello della prima carta sotto l'intestazione di una saga. In cronologico l'intestazione è più alta (riga della fonte: `--fs-caption` × 1,5 ≈ 19,5 px): senza correzione la colonna parte circa 20 px sopra la prima riga. Aggiungi `data-order` su `.planner__body` e, da 64em, in cronologico `margin-top: calc(@saga-header-height + 8px + var(--fs-caption) * 1.5)`; stessa correzione per `.planner__list > .state-box`. Nel canvas la colonna è allineata (stessa somma: intestazione 54 px, riga 19,5, gap 8): verifica a 1280 e 1024 in it, fr e de (se la riga della fonte va a capo il valore cambia).
- **H.** «Prossimo da guardare» non cambia e non dice «cronologico»: ha già la sua dissolvenza (`.next-card__swap`).
- Su telefono il cambio si fa dentro il foglio dei filtri: la cascata gira dietro il foglio. Va bene così; da vedere a occhio.

## 6. Testi (cinque lingue, `src/i18n/locales`)

| Chiave | it | en | fr | es | de |
|---|---|---|---|---|---|
| `planner.order.chronologicalHeading` (cambia) | Ordine cronologico | Chronological order | Ordre chronologique | Orden cronológico | Chronologische Reihenfolge |
| `planner.order.unplacedHeading` (cambia) | Senza collocazione | No placement | Sans place | Sin ubicación | Ohne Einordnung |

Invariati: `unplacedNote`, `chronological` («Cronologico»). Tolte: `planner.order.sourceLink` e `planner.order.chronologicalNote`. I testi en/fr/es/de sono proposti da Design: se non li ritieni naturali, correggili e dillo. Il titolo è in maiuscolo (Anton): controlla che «Chronologische Reihenfolge» regga su telefono (due righe).

## 7. Verifica

Desktop 1280 e 1024, telefono 390, chiaro e scuro, it/fr/de: intestazione (titolo + conteggio) senza sovrapposizioni; riga della fonte leggibile; fascia a una colonna; cambio di ordine con il planner scorso in basso; movimento ridotto (solo la dissolvenza della lista); tema a contrasto alto (`forced-colors`: nessuna regola nuova, controlla le celle). Dì cosa non hai verificato.

## 8. Riga per `DESIGN.md`, "Deviazioni" (solo se differisci dal blocco)

Se applichi tutto come sopra non serve. Altrimenti, una riga per scostamento nel formato: `Ordine cronologico | file | cosa | perché`. Esempio di partenza: «Ordine cronologico | `ChronologicalList.tsx/.less`, `SagaSection.tsx/.less`, `PhaseStrip.tsx`, `strip.ts`, `Planner.tsx`, `motion.less`, `TitleItem.tsx`, locale | cronologico con l'intestazione delle saghe (`SagaHeader`), fonte in riga piccola senza icona di info né nota lunga, senza etichetta sotto la fascia, titoli senza collocazione come seconda sezione, fascia a una colonna, fase nelle righe, cascata di cambio ordine a 300 ms | voce 22 di HANDOFF §2, scelta del committente da confermare».
