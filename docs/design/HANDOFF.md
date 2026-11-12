# Marvel Planner: handoff per Claude Code

Riferimento: `main`, commit **b7ddfe3** (le decisioni del 12 novembre sono state applicate in 456fa17 e rifinite fino a b7ddfe3). Il canvas descrive il codice com'è su quel commit; dove canvas e codice differiscono, vale il codice. I numeri di riga sono quelli di b7ddfe3; le sezioni “implementata · main c520ab1” sono state verificate su c520ab1 e i file citati non sono cambiati.

## 1. Come leggere il canvas

- La cartella `canvas/` contiene 27 pagine `.dc.html` (un Indice più 26 pagine: 6 fondamenta, 14 componenti, 6 schermate), `tokens.css`, `app.css`, `support.js` e `assets/`.
- Si parte da `canvas/Index.dc.html`: per ogni pagina dice che cosa descrive, quali componenti usa e dove sta nel codice. Le pagine si aprono dal disco; i font arrivano da Google Fonts e senza rete la pagina usa quelli di sistema.
- `tokens.css` e `app.css` sono compilati con `lessc` dal codice di `src/styles` e dei componenti: nessuna pagina scrive valori propri.
- Ogni cosa è definita in una sola pagina. I componenti si descrivono una volta (pagine B); le schermate (pagine C) li usano e definiscono solo le proprie parti.
- Etichette nelle pagine: **solo canvas** = idea nel canvas che il codice non ha; **non verificato** = non trovato nel sorgente; **valore senza token** = valore letterale del codice, annotato nella tabella del componente.
- Ogni pagina ha in testa quattro righe (che cosa descrive, cartella del codice, componenti che usa, ultima modifica) e in fondo la tabella “Prima, dopo, file”.

## 2. Da implementare (il codice non lo ha)

Elenco aggiornato a b7ddfe3. Le voci già riportate nel codice non ci sono più (vedi §5). La numerazione è quella degli elenchi precedenti, così si ritrovano.

| # | Cosa | Stato nel codice | Da fare / file | Pagina del canvas |
|---|---|---|---|---|
| 1 | Recupero password, lato server | Il client c'è: viste, rotta `/reset-password` e collegamento “Password dimenticata?”, tutto dietro `VITE_PASSWORD_RESET === "true"` (`features/auth/passwordReset.ts` r.3, `app/router.tsx` r.37, `LoginForm.tsx` r.92). Il commento del file dice: spento finché il server non sa inviare l'e-mail (servizio, durata del link, finestra di reinvio) | Server: invio dell'e-mail con il link, durata del link, attesa tra due invii (risposta 429, che il pulsante “Reinvia” già legge). Poi impostare `VITE_PASSWORD_RESET=true` | Popup di accesso |
| 2 | Pagina di manutenzione HTML | Oggi la manutenzione è la pagina React `MaintenancePage` (`pages/MaintenancePage/MaintenancePage.tsx`) | Pagina HTML statica servita dal Worker con stato **503** e `<meta name="robots" content="noindex">` | Pagine di errore |

Note sulle voci:
- **1** resta in attesa del server; il collegamento “Password dimenticata?” è già nel client dietro il flag (`LoginForm.tsx` r.91-101).
- **Funzione 20 (episodi, spunta per episodio):** rimandata. Resta nel canvas (Planner) con chip “rimandata”, non da implementare ora.

## 3. Decisioni scartate (non implementare)

- **Colonna sticky “Informazioni” nella pagina film** (e colonna di testo sticky mentre scorre il cast): decisione presa, non si implementa. Nel canvas è marcata “solo canvas · scartata” (Pagina Film). Il codice non ha `position: sticky` in `TitleDetailsPanel.less` e resta così.

## 4. Altre note emerse dall'audit

- **Splash (`public/splash.css`):** lo stile della splash sta in un file CSS statico, caricato da `index.html` prima del bundle, con fallback letterali (`var(--accent, #c8202b)`, `var(--white, #fff)`, padding `24px`) perché deve funzionare prima dei token. È documentato nella pagina Splash; se cambia `--accent`, va cambiato anche lì.
- **Contrasto riempimento/traccia delle barre: accettato.** La traccia ha 3:1 contro lo sfondo (decisione 1.5, rispettata); il riempimento contro la propria traccia sta sotto 3:1 in 6 celle, in 4 righe (riga accent in chiaro 1,54; riga highlight in scuro 2,70; barra flottante 2,79 in chiaro e 1,58 in scuro; totale sull'oro 2,85 in entrambi; tabella nel CHANGELOG, sezione Audit). Decisione: si lascia così, perché il valore è sempre scritto anche come testo (“24 di 60”). Nessuna azione.

## 5. Già nel codice

**Riportato nel codice dopo b7ddfe3 (voci 34-37):** 34 pillole sopra i toast (`--toasts-lift` misurata in `BackToTop.tsx`, `translate` con transizione, niente più `display: none` sotto un toast); 35 pillole su mobile (“Torna su” solo freccia sotto 40em, `width: max-content`, `nowrap`, distanza dalla barra misurata con `--bar-lift`); 36 fascia delle fasi su mobile come `<details class="phase phase-strip-accordion card">` con `usePhaseMotion`, chiusa 60px; 37 barra di avanzamento su telefono con i bordi dei toast (`width: min(440px, calc(100% - 1rem))`, `--r-row`, padding `--sp-3h` / `--sp-4` / `--sp-3`), toast a `--sp-2` sopra la barra (`bottom` da `--bar-lift`), toast invariati.

**Riportato su `main` fino a b7ddfe3 (voci 4, 7, 15, 16, 17, 18, 20, 21b, 30b, 31, 32, 33 e casella tri-stato sulla fase):** nel canvas sono marcate “implementata · main 456fa17” (Planner, Pagina Film, Accessibility, Buttons, Motion). 4 focus dopo un tocco (`useDialog.ts`, `ToastProvider.tsx`); 7 `ButtonLink` con `icon`/`iconEnd`, `Maximize2` su “Apri scheda” e “Dettagli”; 15 cascata `data-intro` su planner e film; 16 “Prossimo da guardare” sempre montato con scheletro; 17 nessuna modifica; 18 barra di avanzamento sticky su mobile; 20 altezza minima della lista via CSSOM; 21b pillole “Ultimo visto” e “Torna su”; 30b “?” nell'header; 31 fascia delle fasi (solo play sul prossimo, celle 32/24px, accordion su mobile); 32 numero che sale (anche nella scheda piccola, 7c7eb6a, `useCountUp` con `isActive`); 33 regia su mobile; casella tri-stato sulla fase al posto di “Segna tutta la fase come vista” (il blocco del pulsante è “sostituita”).

**Riportato su `main` fino a c520ab1:** funzioni 16 (popup di unione, variante A, con toast “Planner uniti: N titoli visti” senza Annulla), 21 e 22 (“Vai all'ultimo titolo visto”, “Torna all'inizio”, “Segna tutta la fase come vista”, variante A), 23 (pagina Accessibilità su `/accessibilita`, link nel footer), 24 (popup “Multiverso completato” con suono, variante A), 30 (“?” con invito alla prima visita, variante B; nomi di scheda e filtro dalle chiavi `planner.order.chronological`, `planner.tags.alternate`, `planner.filters.showAlternate`); e le decisioni 3, 5, 6, 8-14, 19, 21-24 dell'elenco precedente (toast, X dei popup, importazione, switch, select, footer, logo, Dove guardare, copertina, Regia/Cast, indicatore visto, saga, titoli di serie, accesso, profilo). Il campo in errore (25) era già giusto. Il canvas le descrive come “implementata · main c520ab1”.

Tutto il resto: le 27 pagine descrivono il codice com'è su c520ab1, nessuna azione. Sono già su `main`: i sette token tolti (`--fs-display`, `--fs-overline`, `--gap-section`, `--pad-strip`, `--popover-w`, `--popover-gap`, `--sp-12`), `--content-max` e `--pad-card` usati dal codice, `.card` e il pannello del film senza `box-shadow`, il toast «Aggiunto alla tua lista» con Annulla (da ospite «Salvato su questo dispositivo» con Accedi), l'adesivo «Multiverso completato» (`CompletionSticker`, flag `mcu-planner-completed-seen`, decisione 1.12) e le correzioni del giro precedente: anello di focus del Select (ink in chiaro, oro in scuro, oro anche sul pannello scuro nella variante in linea), grassetto del Toast solo sul titolo, spinner dei poster a 0,8 s con movimento normale e 1,6 s con movimento ridotto, tutte le illustrazioni importate.

Voci marcate “non verificato” (non trovate nel sorgente, da controllare se servono): dimensioni delle icone dove non c'è una regola `.lucide`/`svg` (Icone e immagini), dimensioni di visualizzazione delle illustrazioni (Icone e immagini), menu mobile (Navigation), pollice della scrollbar (Scrollbar), selezione su pannello dello ChoiceGroup (Switch e ChoiceGroup), ritardo di apertura del tooltip (Tooltip), lingua dei titoli originali e formato di date e numeri (Typography).

## 6. Scostamenti dal design e da controllare (da main 456fa17, vale il codice)

1. **Cascata con movimento ridotto:** il canvas chiede la sola dissolvenza, il codice non anima nulla (il blocco `data-intro` esiste solo con movimento normale).
2. **Barra sticky su mobile:** non è a tutta larghezza fino al bordo, sta nella colonna con tutti gli angoli arrotondati (`@radius-block`). Su desktop non c'è (`!isDesktop`).
3. **Evidenziazione dell'ultimo visto:** velo al 22% scritto a mano (`color-mix`), valore senza token. Parte a fine scorrimento (`scrollend`, attesa massima 700 ms): piena 1,6 s, sfuma in 0,8 s; con movimento ridotto anello fisso 2,4 s.
4. **Regia su mobile:** nessuna misura di font propria, eredita il corpo; il testo “mancante” usa `--fs-label`.
5. **Casella della fase:** riusa `.title-row__box` con `margin-top: 0` (selettore `.phase__summary .phase__check`); sommario con `padding-left` 12px (8px da 64em).
6. **Pillole flottanti:** a `--sp-4` dal bordo, sopra la barra (`--sp-2`) solo quando è attaccata al bordo basso (`--bar-lift`, misurata con `getBoundingClientRect`); sopra i toast di `--toasts-lift`; il footer ha un `padding-bottom` in più (`+ --hit`), anche nelle pagine senza pillole.
7. **Altezza minima della lista filtrata:** impostata da JS con `style.minHeight` (CSSOM, ammesso dalla CSP).
8. **Fascia su mobile:** ora è un `<details>` come le fasi (voce 36).
9. **Da controllare:** pagina film con dati reali (non provata in locale: manca il backend TMDB); l'invito del “?” su mobile copre in parte la scheda dei progressi finché non viene chiuso; “Ultimo visto” compare solo se c'è un titolo visto e la sua riga non è nella finestra.
