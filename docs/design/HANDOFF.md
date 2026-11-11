# Marvel Planner: handoff per Claude Code

Riferimento: `main`, commit **2b5e07a**. Il canvas descrive il codice com'è su quel commit; dove canvas e codice differiscono, vale il codice. I numeri di riga sono quelli di 2b5e07a.

## 1. Come leggere il canvas

- La cartella `canvas/` contiene 27 pagine `.dc.html` (un Indice più 26 pagine: 6 fondamenta, 14 componenti, 6 schermate), `tokens.css`, `app.css`, `support.js` e `assets/`.
- Si parte da `canvas/Index.dc.html`: per ogni pagina dice che cosa descrive, quali componenti usa e dove sta nel codice. Le pagine si aprono dal disco; i font arrivano da Google Fonts e senza rete la pagina usa quelli di sistema.
- `tokens.css` e `app.css` sono compilati con `lessc` dal codice di `src/styles` e dei componenti: nessuna pagina scrive valori propri.
- Ogni cosa è definita in una sola pagina. I componenti si descrivono una volta (pagine B); le schermate (pagine C) li usano e definiscono solo le proprie parti.
- Etichette nelle pagine: **solo canvas** = idea nel canvas che il codice non ha; **non verificato** = non trovato nel sorgente; **valore senza token** = valore letterale del codice, annotato nella tabella del componente.
- Ogni pagina ha in testa quattro righe (che cosa descrive, cartella del codice, componenti che usa, ultima modifica) e in fondo la tabella “Prima, dopo, file”.

## 2. Da implementare (il codice non lo ha)

| # | Cosa | Stato nel codice | Da fare / file | Pagina del canvas |
|---|---|---|---|---|
| 1 | Recupero password, lato server | Il client c'è: viste, rotta `/reset-password` e collegamento “Password dimenticata?”, tutto dietro `VITE_PASSWORD_RESET === "true"` (`features/auth/passwordReset.ts` r.3, `app/router.tsx` r.37, `LoginForm.tsx` r.92). Il commento del file dice: spento finché il server non sa inviare l'e-mail (servizio, durata del link, finestra di reinvio) | Server: invio dell'e-mail con il link, durata del link, attesa tra due invii (risposta 429, che il pulsante “Reinvia” già legge). Poi impostare `VITE_PASSWORD_RESET=true` | Popup di accesso |
| 2 | Pagina di manutenzione HTML | Oggi la manutenzione è la pagina React `MaintenancePage` (`pages/MaintenancePage/MaintenancePage.tsx`) | Pagina HTML statica servita dal Worker con stato **503** e `<meta name="robots" content="noindex">` | Pagine di errore |
| 3 | Toast: X solo se persistente; durate 4 s / 6 s; chiusura al clic (prima dell'`await`) | Comportamento precedente: colonna “Prima” della tabella nella pagina | `ToastProvider.tsx` r.10-11, r.43-51, r.91 | Toast |
| 4 | Focus dopo un tocco: `focus({ focusVisible: false })` alla chiusura da tocco o mouse; tastiera con anello | Comportamento precedente: colonna “Prima” della tabella nella pagina | `useDialog.ts`; `ToastProvider.tsx` r.36-41 | Accessibility |
| 5 | Popup: `Modal` con `showClose`; X solo nei popup di contenuto/compito; tolti “Chiudi” ridondanti | Comportamento precedente: colonna “Prima” della tabella nella pagina | `Modal.tsx` r.81-83; `ShareDialog.tsx`; `PrivacySettingsDialog.tsx`; `ImportSharedDialog.tsx` | Popup generici |
| 6 | Importazione: nuova struttura (riepilogo, scelta con numeri, conferma nel secondo passo); testi `import.*` nuovi nelle 5 lingue | Comportamento precedente: colonna “Prima” della tabella nella pagina | `ImportSharedDialog.tsx`/`.less`; locales | Popup generici |
| 7 | Icone: regola sinistra/destra/nessuna; `iconEnd` ovunque a destra; tolta l'icona dal footer | Comportamento precedente: colonna “Prima” della tabella nella pagina | `Button.tsx`; `TitleItem.tsx` r.116; `WhereToWatch.tsx` r.99; `AppFooter.tsx` r.64 | Buttons |
| 8 | Switch: hover (traccia e manopola) | Comportamento precedente: colonna “Prima” della tabella nella pagina | `Switch.less` r.35-55 | Switch e ChoiceGroup |
| 9 | Select: elenco della lingua in sovrapposizione nel menu mobile; chiusura allo scroll; `scroll-margin-block` sulle opzioni | Comportamento precedente: colonna “Prima” della tabella nella pagina | `SelectField.tsx` r.129-140; `SelectField.less` r.133-136; `LanguageSwitcher.tsx` | Select |
| 10 | Footer: “Made in Italy” in display `--on-dark`; blocco TMDB centrato | Comportamento precedente: colonna “Prima” della tabella nella pagina | `AppFooter.tsx`/`.less` | Navigation |
| 11 | Logo “MARVEL PLANNER”: hover e pressione come i pulsanti | Comportamento precedente: colonna “Prima” della tabella nella pagina | `AppHeader.less` r.50-56 | Navigation |
| 12 | Dove guardare: scheletro con altezza minima comune; errore con `LoadError variant="inline"` | Comportamento precedente: colonna “Prima” della tabella nella pagina | `WhereToWatch.tsx` r.35-41; `.less` | Pagina Film |
| 13 | Copertina del film con `PosterImage` (placeholder, errore) | Comportamento precedente: colonna “Prima” della tabella nella pagina | `TitleDetailsPanel.tsx` r.55-65 | Pagina Film |
| 14 | Regia/Cast separati sotto 40em; testo “mancante” a `--fs-label` | Comportamento precedente: colonna “Prima” della tabella nella pagina | `TitleDetailsPanel.tsx` r.108, r.115; `.less` r.202-209 | Pagina Film |
| 15 | Cascata d'ingresso a ogni arrivo su planner e film (`data-intro`), film nella lista | Comportamento precedente: colonna “Prima” della tabella nella pagina | `motion.less` r.448-470; `Planner.tsx`; `AppLayout.tsx` | Motion |
| 16 | Prossimo da guardare: scheda sempre montata, solo la locandina cambia stato | Comportamento precedente: colonna “Prima” della tabella nella pagina | `NextToWatch.tsx` | Planner |
| 17 | Layout 1098 px: pulsante Condividi ultima riga nella scheda, schede a pari altezza | Comportamento precedente: colonna “Prima” della tabella nella pagina | `PlannerSummary.less` r.36-58; `Planner.less` r.16-18 | Planner |
| 18 | Fondo mobile: barra di avanzamento sticky nella sezione, niente `padding-bottom` di riserva | Comportamento precedente: colonna “Prima” della tabella nella pagina | `Planner.less` r.7; `FloatingProgress.less` | Planner |
| 19 | Indicatore visto: non visto = contorno `--ink`; visto = `--primary` + `--on-primary` | Comportamento precedente: colonna “Prima” della tabella nella pagina | `TitleItem.less` r.199-229 | Planner |
| 20 | Filtri: dissolvenza da 0,85; `needle` fuori da `listKey`; altezza minima | Comportamento precedente: colonna “Prima” della tabella nella pagina | `motion.less` r.764-768; `Planner.tsx` r.128-137 | Planner |
| 21 | Saga su mobile: titolo e conteggio allineati in basso | Comportamento precedente: colonna “Prima” della tabella nella pagina | `SagaSection.less` | Planner |
| 22 | Titoli di serie: due punti al posto del trattino lungo (14 titoli); test che gli id restino identici | Comportamento precedente: colonna “Prima” della tabella nella pagina | `catalog.ts` r.14, r.69-93; `shared/slug.ts` | Planner |
| 23 | Accesso: tolta `auth.login.intro`; suggerimento e-mail al blur, animato, con “Usa questo”; “Password dimenticata?” visibile a recupero acceso | Comportamento precedente: colonna “Prima” della tabella nella pagina | `LoginForm.tsx`; `RegisterForm.tsx` r.120; `ProfileSection.tsx` r.192 | Popup di accesso |
| 24 | Profilo: tolta la nota `nameUnchanged`; conferma unica senza ripetere il valore (3 testi) | Comportamento precedente: colonna “Prima” della tabella nella pagina | `ProfileSection.tsx` r.106, r.167, r.172 | Profile Popup |
| 25 | Campo in errore: nessun cambio all'hover (già nel codice), focus standard | Comportamento precedente: colonna “Prima” della tabella nella pagina | `base.less` r.204-228 | Textfield |
| 26 | **Nuove funzioni (solo dopo la scelta di Diego):** 16 account con dati (var. A), 20 episodi (A), 21 fase (A), 22 salti (A), 23 pagina Accessibilità (A), 24 popup completamento (A), 30 “?” guida (B) | Comportamento precedente: colonna “Prima” della tabella nella pagina | vedi pagine | Popup di accesso, Planner, Accessibility |

## 3. Decisioni scartate (non implementare)

- **Colonna sticky “Informazioni” nella pagina film** (e colonna di testo sticky mentre scorre il cast): decisione presa, non si implementa. Nel canvas è marcata “solo canvas · scartata” (Pagina Film). Il codice non ha `position: sticky` in `TitleDetailsPanel.less` e resta così.

## 4. Altre note emerse dall'audit

- **Splash (`public/splash.css`):** lo stile della splash sta in un file CSS statico, caricato da `index.html` prima del bundle, con fallback letterali (`var(--accent, #c8202b)`, `var(--white, #fff)`, padding `24px`) perché deve funzionare prima dei token. È documentato nella pagina Splash; se cambia `--accent`, va cambiato anche lì.
- **Contrasto riempimento/traccia delle barre: accettato.** La traccia ha 3:1 contro lo sfondo (decisione 1.5, rispettata); il riempimento contro la propria traccia sta sotto 3:1 in 6 celle, in 4 righe (riga accent in chiaro 1,54; riga highlight in scuro 2,70; barra flottante 2,79 in chiaro e 1,58 in scuro; totale sull'oro 2,85 in entrambi; tabella nel CHANGELOG, sezione Audit). Decisione: si lascia così, perché il valore è sempre scritto anche come testo (“24 di 60”). Nessuna azione.

## 5. Già nel codice

Tutto il resto: le 27 pagine descrivono il codice com'è su e0ee94d, nessuna azione. Sono già su `main`: i sette token tolti (`--fs-display`, `--fs-overline`, `--gap-section`, `--pad-strip`, `--popover-w`, `--popover-gap`, `--sp-12`), `--content-max` e `--pad-card` usati dal codice, `.card` e il pannello del film senza `box-shadow`, il toast «Aggiunto alla tua lista» con Annulla (da ospite «Salvato su questo dispositivo» con Accedi), l'adesivo «Multiverso completato» (`CompletionSticker`, flag `mcu-planner-completed-seen`, decisione 1.12) e le correzioni del giro precedente: anello di focus del Select (ink in chiaro, oro in scuro, oro anche sul pannello scuro nella variante in linea), grassetto del Toast solo sul titolo, spinner dei poster a 0,8 s con movimento normale e 1,6 s con movimento ridotto, tutte le illustrazioni importate.

Voci marcate “non verificato” (non trovate nel sorgente, da controllare se servono): dimensioni delle icone dove non c'è una regola `.lucide`/`svg` (Icone e immagini), dimensioni di visualizzazione delle illustrazioni (Icone e immagini), menu mobile (Navigation), pollice della scrollbar (Scrollbar), selezione su pannello dello ChoiceGroup (Switch e ChoiceGroup), ritardo di apertura del tooltip (Tooltip), lingua dei titoli originali e formato di date e numeri (Typography).
