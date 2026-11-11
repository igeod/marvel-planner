# Design system: Marvel Planner

Fonte dei valori: `docs/design/tokens.css` (design) → `src/styles/tokens.less` (codice). Questo file non li ripete: dice **come usarli** e cosa evitare. Le pagine di guida sono in `docs/design/*.dc.html` (indice: `Index.dc.html`), le modifiche richieste al codice in `docs/design/CHANGES_FOR_CODE.md`.

## Identità

Sito per appassionati del MCU, spesso aperto da telefono davanti alla TV. Carattere: **poster cinematografico, scuro e deciso**, ma ordinato come uno strumento. Rosso Marvel come accento, giallo come evidenza (nel tema scuro il giallo diventa il colore primario). Non è un sito ufficiale e non deve sembrare uno: niente loghi, caratteri o rettangoli rossi che imitano il marchio Marvel.

## Principi

1. **Prima la funzione.** L'HTML è semantico; il design lo veste, non lo riscrive.
2. **Spoiler sotto controllo.** Nulla che riveli la storia si vede per sbaglio (anteprime, tooltip, testi alternativi inclusi).
3. **Accessibilità WCAG 2.2 AA:** tastiera completa, focus sempre visibile, contrasto, bersagli da 44px, `prefers-reduced-motion`, niente informazione affidata al solo colore.
4. **Mobile-first**, margine laterale 16px, nessuno scorrimento orizzontale. Su desktop il contenuto non resta una colonna stretta nel vuoto.
5. **Onestà sui dati:** se manca una fonte affidabile si mostra meno, non si inventa.

## Tipografia

- **Anton** (display): titoli e numeri grandi, maiuscolo, `letter-spacing: .01em`.
- **Hanken Grotesk** (corpo): tutto il resto.
- Dimensioni solo da `--fs-*`. Il testo contenitore cresce con il testo dell'utente: larghezze in `rem` (o `ch` per la prosa); restano in px solo oggetti disegnati (icone, poster, avatar, barre, bordi).
- I titoli delle opere restano in inglese (`lang="en"`). Francese e tedesco sono più lunghi dell'italiano: il layout deve reggerli.

## Colore e temi

- Temi: sistema, chiaro, scuro, tramite `data-theme` su `<html>`. Ogni colore passa dai token semantici (`--bg`, `--surface`, `--row`, `--ink`, `--ink-2`, `--accent`, `--primary`, `--danger`...), mai da un esadecimale nel componente.
- `--primary` è il rosso nel chiaro e il giallo nello scuro: usalo per l'azione principale, non `--accent` direttamente.
- Testo su sfondo: usa la coppia prevista (`--on-primary`, `--on-danger`, `--on-dark`, `--on-disabled`).

## Forma, spazio, ombre

- Spazi da `--sp-*`, raggi da `--r-*` (dal più morbido `--r-xl` al `--r-hair`), ombre `--shadow-card` e `--shadow-pop`.
- Breakpoint in `em` (64em, 40em): con il testo ingrandito il layout compatto arriva prima.
- Aree cliccabili di sole icone: `--hit` (44px), che non cresce col testo.

## Movimento

Una sola curva (`--ease-out`), cinque durate (`--dur-press/hover/ui/enter/progress`), nessun `ease-in`. L'uscita dura un gradino meno dell'entrata (240→180, 180→120, 120→80). Con `prefers-reduced-motion` restano solo cambi di colore e opacità, brevi: transform, altezze e keyframe vivono in blocchi `no-preference`. Spinner e skeleton compaiono solo dopo `--delay-pending` (200ms), così i caricamenti rapidi non lampeggiano.

## Componenti

Stato, misure e comportamento di ogni componente stanno nella sua pagina `.dc.html` (una pagina per componente, nessun duplicato). Icone: solo Lucide, `aria-hidden`. Ogni elenco o immagine ha lo stato vuoto e quello "senza immagine".

## Riferimenti di ispirazione

Qui si annotano i siti da cui prendere **principi** (non stili da copiare). Una riga ciascuno: cosa prendiamo e cosa no.

| Sito | Cosa prendiamo | Cosa NO |
| ---- | -------------- | ------- |
|      |                |         |

## Cosa NON fare

Regole fisse, dai principi e dal design esistente:

- Nessun valore scritto a mano (colore, spazio, durata, curva) quando esiste il token.
- Nessuno stile inline, nessuna risorsa o font esterni.
- Nessun `ease-in`, nessuna animazione che ignora `prefers-reduced-motion`.
- Nessun nuovo componente se ne esiste già uno simile: si estende quello.
- Nessuna emoji al posto delle icone; nessuna icona fuori da Lucide.
- Nessuna ombra o gradiente decorativo senza token.

Da completare con i difetti concreti che il proprietario nota nella grafica ("troppo piatto", "generico"...), uno per riga:

-

## Deviazioni del codice dal design

Quando il codice non può seguire il design (o lo supera), si annota qui, una riga: componente | file | cosa | perché. Design le risolve e poi cancella la riga.

Valori presenti nel design ma non ancora usati dal codice (controllati con una ricerca nei sorgenti): `--content-max`, `--fs-display`, `--fs-overline`, `--gap-section`, `--pad-card`, `--pad-strip`, `--popover-gap`, `--popover-w`, `--sp-12`. Vanno applicati dove previsti o tolti dal design.
