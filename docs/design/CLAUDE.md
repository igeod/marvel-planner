# Canvas di design (docs/design)

Si applica a tutto il lavoro in questa cartella: canvas `.dc.html`, `HANDOFF.md`, `CHANGELOG.md`, `tools/`.
Qui valgono queste regole, in aggiunta a quelle del `CLAUDE.md` nella radice (vedi la nota sui branch in fondo).

## Skill obbligatoria
**Per ogni lavoro di design (nuove proposte, varianti, revisioni, correzioni del canvas) usa sempre la skill `design-suite`**, leggendo prima il `GUIDE.md` del modulo adatto. Se il progetto ha un proprio sistema di design (`DESIGN.md`, token), quello vale per primo.

## Regola suprema
- Il codice su `main` vince sul canvas. Dove differiscono, vale il codice e lo scostamento va in `HANDOFF.md` §6.
- Ogni dato derivato dal codice cita file e riga (`File.tsx r.N`). Non inventare valori: se non si riesce a leggere, scrivere "non verificato".
- Quello che il codice non ha ma si tiene nel canvas: "solo canvas · non implementato".
- Ombre: regola a tre livelli. Mai anello di focus rosso.
- Le pagine si aprono dal disco, senza rete (i font arrivano da Google Fonts quando c'è).
- Lingue: it, en, fr, es, de, chiaro e scuro.

## Flusso
1. Decisione o variante → blocco nella pagina giusta (di solito Planner) con chip "proposta · non implementata".
2. Voce in `CHANGELOG.md` (in testa, data, commit di riferimento) e riga in `HANDOFF.md` §2.
3. Rigenera le pagine (`tools/README.md`), controlla a 390px e 1280px, chiaro e scuro.
4. Quando il codice applica la voce: chip "implementata · main <commit>", via dalla §2 di HANDOFF, aggiungila alla §5, ricalcola le righe con `remap.py`.
5. Consegna: UNA cartella `canvas/` (pagine, `tokens.css`, `app.css`, `support.js`, `assets/`) più `HANDOFF.md` e `CHANGELOG.md`.

## Misure
Prima di scrivere una distanza o una larghezza, misurala (Playwright, `getBoundingClientRect`) o citala dal `.less`. Mai a occhio.

## Rispondere a Diego
In italiano, diretto e conciso, con un verdetto chiaro. Dire cosa non è stato verificato.

## Nota sui branch
Il `CLAUDE.md` della radice dice: lavorare su `main`, niente branch, commit e push solo su richiesta. Vale anche per i file di design.
