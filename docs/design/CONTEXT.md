# Contesto di lavoro: canvas di design di Marvel Planner

Stato al 12 novembre 2026, riferimento `main` **8b15e60**. Da leggere all'inizio di una nuova sessione, insieme a `CLAUDE.md`, `HANDOFF.md` e `tools/README.md`.

## Chi e cosa
Diego (sviluppatore, italiano) fa evolvere il design di **Marvel Planner**: web app React 19 + Less su Cloudflare Workers, cinque lingue (it/en/fr/es/de), chiaro e scuro. Il design vive in `docs/design/`: 27 pagine `.dc.html` in `canvas/`, `HANDOFF.md` (cosa il codice non ha ancora, scostamenti), `CHANGELOG.md`. Le pagine sono generate da `tools/dsn/` (Python) e si pubblicano anche come artefatto (`https://claude.ai/code/artifact/712252da-dd69-46bd-a8bc-d04b21af345f`, ultima versione 44).

## Come si lavora
1. Diego chiede una variante o una decisione (spesso con screenshot). Si risponde con proposta + verdetto.
2. Si aggiunge un blocco "proposta · non implementata" nella pagina giusta, si aggiornano CHANGELOG e HANDOFF, si rigenera, si pubblica, si consegna la cartella `canvas/`.
3. Quando Diego dice "applicato in main <commit>", si rigenera da quel commit, si marcano le voci "implementata · main <commit>", si tolgono dalla §2 di HANDOFF, si ricalcolano i numeri di riga (`tools/dsn/remap.py`) e si annotano gli scostamenti (§6).
Regola suprema: vale il codice su main; file e riga citati; mai valori inventati; "non verificato" quando non si legge.

## Stato attuale
- Applicate su main (fino a 8b15e60): voci 4, 7, 15, 16, 17, 18, 20, 21b, 30b, 31, 32, 33, 34, 35, 36, 37 e la casella tri-stato sulla fase.
- Ancora da fare (HANDOFF §2): 1 recupero password lato server; 2 pagina di manutenzione HTML. Funzione 20 (episodi) rimandata.
- Scostamenti noti (§6): 10, tra cui `--bar-lift` che alza toast e pillole anche tra 40em e 64em.

## Decisioni di design recenti (tutte su main)
- Pillole "Ultimo visto" / "Torna su": restano sopra i toast (`--toasts-lift` misurata, `translate` 240 ms su / 180 ms giù); su mobile "Torna su" è solo la freccia da 44px; `width: max-content`, `nowrap`.
- Fascia delle fasi su mobile: `<details class="phase phase-strip-accordion card">` con `usePhaseMotion`, chiusa 60px, titolo `--fs-title` peso 700.
- Barra di avanzamento su telefono: stessa larghezza e raggio dei toast (`min(440px, calc(100% - 1rem))`, `--r-row`), padding `--sp-3h --sp-4 --sp-3`, toast 8px sopra. Diego preferiva i bordi dei toast: la barra si adegua a loro, non il contrario.
- Numero che sale (`useCountUp`): 900 ms al primo arrivo, 400 ms a ogni cambio.
- Regia su mobile: riga sotto "Cast".

## Cose da sapere
- `Colors.dc.html` e `Progress.dc.html` si modificano a mano in `tools/dsn/out/`; non rigenerare `p_colors.py` e `p_progress.py`. Non lanciare `p_scorciatoie.py`, `p_fascia.py`, `p_guida.py`.
- Nel runtime del canvas gli iframe `srcdoc` richiedono `viewbox` in minuscolo negli SVG.
- Token usati spesso: `--dur-enter` 240, `--dur-ui` 180, `--hit` 44px, `--r-xl` 32, `--r-lg` 28, `--r-md` 24, `--r-row` 22, `--row-h` 3.5rem, `--fs-title` 1.125rem.
- Chip delle voci: "proposta · non implementata", "implementata · main <commit>", "solo canvas · non implementato", "rimandata", "sostituita".

## Non verificato (da controllare su dispositivo vero)
- Desktop e dispositivi reali per pillole, barra e fascia; wordmark su due righe con "?" e Menu su mobile con il font Anton; supporto `cqw`; larghezza delle etichette delle pillole a 360px in tedesco; controlli di overflow non rieseguiti dopo gli ultimi cambi.
- Il Planner generato non è stato riaperto a occhio dopo l'ultima rigenerazione (v44).
