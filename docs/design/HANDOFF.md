# Marvel Planner: handoff per Claude Code

Riferimento: `main`, commit **326d261**. Il canvas descrive il codice com'è su quel commit; dove canvas e codice differiscono, vale il codice. I numeri di riga sono quelli di 326d261.

## 1. Come leggere il canvas

- La cartella `canvas/` contiene 27 pagine `.dc.html` (un Indice più 26 pagine: 6 fondamenta, 14 componenti, 6 schermate), `tokens.css`, `app.css`, `support.js` e `assets/`.
- Si parte da `canvas/Index.dc.html`: per ogni pagina dice che cosa descrive, quali componenti usa e dove sta nel codice. Le pagine si aprono dal disco; i font arrivano da Google Fonts e senza rete la pagina usa quelli di sistema.
- `tokens.css` e `app.css` sono compilati con `lessc` dal codice di `src/styles` e dei componenti: nessuna pagina scrive valori propri.
- Ogni cosa è definita in una sola pagina. I componenti si descrivono una volta (pagine B); le schermate (pagine C) li usano e definiscono solo le proprie parti.
- Etichette nelle pagine: **solo canvas** = idea nel canvas che il codice non ha; **non verificato** = non trovato nel sorgente; **valore senza token** = valore letterale del codice, annotato nella tabella del componente.
- Ogni pagina ha in testa quattro righe (che cosa descrive, cartella del codice, componenti che usa, ultima modifica) e in fondo la tabella “Prima, dopo, file”.

## 2. Da implementare (il codice non lo ha)

| # | Cosa | Stato nel codice | Da fare | Pagina del canvas |
|---|---|---|---|---|
| 1 | Recupero password, lato server | Il client c'è: viste, rotta `/reset-password` e collegamento “Password dimenticata?”, tutto dietro `VITE_PASSWORD_RESET === "true"` (`features/auth/passwordReset.ts` r.2, `app/router.tsx` r.28, `LoginForm.tsx` r.92). Il commento del file dice: spento finché il server non sa inviare l'e-mail (servizio, durata del link, finestra di reinvio) | Server: invio dell'e-mail con il link, durata del link, attesa tra due invii (risposta 429, che il pulsante “Reinvia” già legge). Poi impostare `VITE_PASSWORD_RESET=true` | Popup di accesso |
| 2 | Pagina di manutenzione HTML | Oggi la manutenzione è la pagina React `MaintenancePage` (`pages/MaintenancePage/MaintenancePage.tsx`) | Pagina HTML statica servita dal Worker con stato **503** e `<meta name="robots" content="noindex">` | Pagine di errore |

## 3. Decisioni scartate (non implementare)

- **Colonna sticky “Informazioni” nella pagina film** (e colonna di testo sticky mentre scorre il cast): decisione presa, non si implementa. Nel canvas è marcata “solo canvas · scartata” (Pagina Film). Il codice non ha `position: sticky` in `TitleDetailsPanel.less` e resta così.

## 4. Altre note emerse dall'audit

- **`index.html` (splash):** lo stile della splash ha fallback letterali (`var(--accent, #c8202b)`, `var(--white, #fff)`, padding `24px`) perché deve funzionare prima del CSS. È documentato nella pagina Splash come “valore nel file, non in un .less”; se cambia `--accent`, va cambiato anche lì.
- **Contrasto riempimento/traccia delle barre: accettato.** La traccia ha 3:1 contro lo sfondo (decisione 1.5, rispettata); il riempimento contro la propria traccia sta sotto 3:1 in 6 celle, in 4 righe (riga accent in chiaro 1,54; riga highlight in scuro 2,70; barra flottante 2,79 in chiaro e 1,58 in scuro; totale sull'oro 2,85 in entrambi; tabella nel CHANGELOG, sezione Audit). Decisione: si lascia così, perché il valore è sempre scritto anche come testo (“24 di 60”). Nessuna azione.

## 5. Già nel codice

Tutto il resto: le 27 pagine descrivono il codice com'è su 326d261, nessuna azione. Sono già su `main`: i sette token tolti (`--fs-display`, `--fs-overline`, `--gap-section`, `--pad-strip`, `--popover-w`, `--popover-gap`, `--sp-12`), `--content-max` e `--pad-card` usati dal codice, `.card` e il pannello del film senza `box-shadow`, l'adesivo «Multiverso completato» (`CompletionSticker`, flag `mcu-planner-completed-seen`, decisione 1.12) e le correzioni del giro precedente: anello di focus del Select (ink in chiaro, oro in scuro, oro anche sul pannello scuro nella variante in linea), grassetto del Toast solo sul titolo, spinner dei poster a 0,8 s con movimento normale e 1,6 s con movimento ridotto, tutte le illustrazioni importate.

Voci marcate “non verificato” (non trovate nel sorgente, da controllare se servono): dimensioni delle icone dove non c'è una regola `.lucide`/`svg` (Icone e immagini), dimensioni di visualizzazione delle illustrazioni (Icone e immagini), menu mobile (Navigation), pollice della scrollbar (Scrollbar), selezione su pannello dello ChoiceGroup (Switch e ChoiceGroup), ritardo di apertura del tooltip (Tooltip), lingua dei titoli originali e formato di date e numeri (Typography).
