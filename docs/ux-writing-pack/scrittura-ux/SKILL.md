---
name: scrittura-ux
description: Scrive e rivede i testi dell'interfaccia di Marvel Planner (pulsanti, etichette, errori, stati vuoti, conferme, tooltip, privacy) e le traduzioni en/fr/es/de. Usala per rivedere `src/i18n/locales`, accorciare frasi, scegliere le parole dei pulsanti, controllare che le traduzioni siano naturali e non letterali, e tenere il glossario coerente. Da usare a fine lavoro, dopo grafica e funzioni.
---

# Scrittura UX per Marvel Planner

Pacchetto che unisce quattro skill pubbliche di UX writing (cartella `fonti/`, testi originali non modificati, con licenze) e le adatta a questo progetto. Le regole sotto valgono prima delle regole generiche delle fonti.

## Quando usarla

- Revisione di tutti i testi di `src/i18n/locales/it.ts`.
- Testi nuovi per una funzione (pulsanti, errori, stati vuoti, conferme).
- Traduzione o revisione di en, fr, es, de.
- Controllo di coerenza dei termini (glossario) e delle lunghezze.

Non decide l'aspetto (lo decide Design) e non cambia la logica.

## Da fare per prime

1. **Pagina Accessibilità** (`a11y.*`): da riscrivere come dichiarazione (conformità WCAG 2.2 AA, data della verifica, limiti noti, contatto, data di aggiornamento).
2. **Pagina Privacy** (`privacy.*`): frasi più corte, niente ripetizioni, undici sezioni più brevi.
3. **Popup Preferenze privacy** (`privacySettings.*`, `cookiePage.*`): una sola introduzione, didascalia della tabella corretta, testo breve per ogni voce.

Per queste tre vale la regola 8 qui sotto: si rende più chiaro, non si cambia il significato legale, e ogni modifica si segnala per la rilettura del committente e di un esperto.

## Regole del progetto (vincono su tutto)

1. **Lingua base: italiano, in "tu".** Le altre quattro non sono traduzioni letterali: si parte dall'**intento** del testo, poi si scrive come lo direbbe un madrelingua in quel punto dell'interfaccia. Il registro (tu/du/tú/you) segue l'italiano; per il francese serve una scelta del committente (tu o vous) da annotare nel glossario.
2. **Maiuscole:** i testi nei file di lingua si scrivono in minuscolo normale (la maiuscola dei titoli grandi è un effetto grafico del design). Nessun testo scritto tutto in maiuscolo nei file.
3. **Titoli delle opere:** restano in inglese con `lang="en"`; non si traducono né si inseriscono dentro frasi che ne cambierebbero la forma.
4. **Spoiler:** nessuna frase, nemmeno un tooltip o un testo alternativo, deve rivelare la storia fuori dal pulsante spoiler.
5. **Una cosa sola per posto:** se una frase o un termine esiste già in un'altra chiave, si riusa la chiave. Prima di scrivere, cercare nei file.
6. **Chiavi:** si modifica `src/i18n/locales/*.ts` (stesse chiavi in tutte e cinque le lingue); niente testi nel `.tsx`. Per i link nelle frasi si usa `rich()` con segnaposto, mai frasi spezzate e incollate: l'ordine delle parole cambia da lingua a lingua.
7. **Lunghezza:** francese e tedesco sono più lunghi dell'italiano; il layout deve reggerli, quindi pulsanti e etichette si scrivono corti in tutte le lingue.
8. **Privacy, accessibilità, note legali:** non si "addolciscono" né si accorciano senza che il committente rilegga; si possono solo rendere più chiari. Ogni modifica va segnalata.

## Come adattare le fonti (sono scritte per l'inglese)

Le fonti sono pensate per l'inglese. Cosa vale e cosa no:

| Regola delle fonti                                                                       | Per noi                                                                                                     |
| ---------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Pulsanti: verbo + oggetto, mai «OK»/«Invia» generici                                     | Vale in tutte le lingue                                                                                     |
| Errori: cosa è successo, perché (solo se aiuta), cosa fare; non dare la colpa all'utente | Vale                                                                                                        |
| Stati vuoti: cosa manca, come iniziare                                                   | Vale                                                                                                        |
| Conferme distruttive: dire la conseguenza, pulsante col verbo                            | Vale                                                                                                        |
| Frasi da 8-14 parole, righe da 40-60 caratteri, livello di lettura «7th grade»           | **Indicativo**: i dati vengono da ricerche sull'inglese; si usano come ordine di grandezza, non come soglia |
| Oxford comma, contrazioni («you're»), «sentence case»                                    | **Non si applicano** all'italiano; per le altre lingue seguire la convenzione tipografica della lingua      |
| Evitare modi di dire e riferimenti culturali                                             | Vale, e vale doppio per le traduzioni: niente battute che non si traducono                                  |
| Tono per stato d'animo (errore: calmo; successo: breve; distruttivo: serio)              | Vale                                                                                                        |
| Esclamazioni: poche                                                                      | Vale, e mai negli errori                                                                                    |

## Voce del sito (bozza, da confermare)

Appassionati del MCU, spesso da telefono davanti alla TV. Voce: **diretta, calda, senza fronzoli**; una battuta ogni tanto solo dove non costa chiarezza. Mai ufficiale né ammiccante verso il marchio Marvel (il sito non è affiliato).

## Processo di revisione dei file di lingua

1. Estrarre tutte le chiavi di `it.ts` per sezione (header, planner, titoli, account, accesso, errori, admin, privacy, accessibilità, footer).
2. Per ogni testo scrivere una riga: **chiave · testo · verdetto · motivo · proposta**. Verdetti: `tenere` · `accorciare` · `riscrivere` · `togliere` · `unire con <chiave>`.
3. Segnalare: frasi sopra le ~25 parole, ripetizioni tra chiavi, pulsanti generici, errori senza «cosa fare», tooltip che ripetono l'etichetta, termini incoerenti (stessa cosa con due nomi), testi che rivelano la trama.
4. Il risultato è un **documento** da far approvare; niente modifiche ai file prima dell'ok del committente.
5. Dopo l'approvazione: it prima, poi en, fr, es, de a partire dall'intento; infine verificare la lunghezza nei punti stretti (pulsanti, etichette, tooltip, tabella privacy a 320 px).

## Glossario

Vedi `glossario.md`: un termine, una traduzione per lingua, usata ovunque. Si aggiorna prima di tradurre, non dopo.

## Cosa leggere nelle fonti, e quando

- Errori e validazione: `fonti/timbogp/references/error-message-patterns.md`, `fonti/content-designer/templates/error-message-template.md`.
- Voce e tono: `fonti/timbogp/references/voice-and-tone.md`, `fonti/content-designer/references/voice-chart-template.md`.
- Stati vuoti: `fonti/content-designer/templates/empty-state-template.md`.
- Accessibilità dei testi (link, pulsanti, errori letti dai lettori di schermo, scrivere per la traduzione, espansione del testo): `fonti/content-designer/references/accessibility-guidelines.md`.
- Valutazione di un testo con punteggio: `fonti/content-designer/references/content-usability-checklist.md`.
- Esempi prima/dopo: `fonti/content-designer/examples/real-world-improvements.md`, `references/patterns-detailed.md`.
- Onboarding: `fonti/content-designer/templates/onboarding-flow-template.md` (il planner ne ha poco: serve solo per la guida iniziale).
- Panoramiche brevi: `fonti/anthropic/ux-copy.md`, `fonti/owl-listener/ux-writing.md`, `fonti/timbogp/ux-copy.md`.

## Limiti

- Le fonti non confrontano un file tradotto con l'originale: quel controllo lo fa questa skill, e va ricontrollato da un madrelingua per fr, es, de se il sito deve essere pubblicato.
- Le soglie numeriche delle fonti (parole per frase, livello di lettura) sono per l'inglese.
- Non sostituisce una revisione legale dei testi di privacy e accessibilità.
