# Marvel Planner: handoff per Claude Code

Riferimento: `main`, commit **111347c**. Il canvas descrive il codice com'è su quel commit; dove canvas e codice differiscono, vale il codice. I numeri di riga sono quelli di `main` attuale (per i file citati qui `main` coincide con 111347c).

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
| 3 | Ombre residue | `.card` ha `box-shadow: var(--shadow-card)` (`styles/base.less` r.274); `TitleDetailsPanel.less` r.45 ha lo stesso | Togliere l'ombra: regola a tre livelli (0 piatto per tutto ciò che sta nel flusso; 1 `--shadow-card` solo per StatusPage; 2 `--shadow-pop` per ciò che si sovrappone) | Colors (regola), System states, Pagina Film |

## 3. Decisioni scartate (non implementare)

- **Colonna sticky “Informazioni” nella pagina film** (e colonna di testo sticky mentre scorre il cast): decisione presa, non si implementa. Nel canvas è marcata “solo canvas · scartata” (Pagina Film). Il codice non ha `position: sticky` in `TitleDetailsPanel.less` e resta così.

## 4. Token definiti ma non usati dal codice

Nove token di `styles/tokens.less` non hanno nessun uso in `src/` (cercati con `--nome` in tutti i file tranne `tokens.less`). Per ciascuno: dove usarlo, oppure toglierlo da `tokens.less` (e dal canvas, che si rigenera dal codice).

| Token | Valore | Riga in tokens.less | Proposta |
|---|---|---|---|
| `--content-max` | `1440px` | r.128 | **Usarlo.** Il codice scrive `1440px` a mano in `AppHeader.less` r.43, `AppFooter.less` r.13 e `AppLayout.less` r.13: sostituire con `var(--content-max)` |
| `--pad-card` | `0.5rem` | r.132 | **Usarlo** in `PhaseSection.less` r.4 (`.phase.card { padding: 0.5rem }`); `AppLayout.less` r.15 ha lo stesso valore ma è il padding del contenitore, non di una card: non toccarlo |
| `--fs-display` | `clamp(3rem, 8vw, 6rem)` | r.129 | **Toglierlo.** Il titolo del film usa clamp propri basati sulla larghezza del contenitore (`TitleDetailsPanel.less` r.126 e r.269): non seguono la scala |
| `--fs-overline` | `0.8125rem` | r.168 | **Toglierlo.** Ha lo stesso valore di `--fs-caption` e nessun overline lo usa |
| `--gap-section` | `2rem` (1.5rem sotto 40em) | r.126 e override r.232 | **Toglierlo** insieme all'override. Il ritmo verticale usa `--sp-8` (`AppLayout.less` r.29, `StatusPage.less` r.37) |
| `--pad-strip` | `1.5rem 2.25rem` | r.131 | **Toglierlo.** Nessuna striscia lo usa |
| `--popover-w` | `360px` | r.178 | **Toglierlo.** Il popover del Select usa `min-width: 16.25rem` e `max-width: calc(100vw - 16px)` (`SelectField.less` r.116-117) |
| `--popover-gap` | `8px` | r.179 | **Toglierlo** (stesso motivo; se il posizionamento in JS usa uno scarto di 8, leggere il token invece del numero) |
| `--sp-12` | `3rem` | r.121 | **Toglierlo.** I `3rem` del codice sono altezze di controlli (`Button.less` r.15, `SelectField.less` r.28), non spaziature; la scala resta con `--sp-10` e `--sp-14` |

Dopo la rimozione, `tokens.css` del canvas scende da 127 a 120 token (sette tolti, due da usare).

## 5. Altre note emerse dall'audit

- **`index.html` (splash):** lo stile della splash ha fallback letterali (`var(--accent, #c8202b)`, `var(--white, #fff)`, padding `24px`) perché deve funzionare prima del CSS. È documentato nella pagina Splash come “valore nel file, non in un .less”; se cambia `--accent`, va cambiato anche lì.
- **Contrasto riempimento/traccia delle barre:** la traccia ha 3:1 contro lo sfondo (decisione 1.5, rispettata), ma il riempimento contro la traccia sta sotto 3:1 in 6 casi su 6 (tabella nel CHANGELOG, sezione Audit). Il valore è sempre scritto anche come testo (“24 di 60”), quindi non è bloccante; decidete voi se alzare il contrasto del riempimento.
- **Documentazione nel repo:** i commenti in `tokens.less` e la cartella `docs/design` (se esiste) vanno sostituiti da questo canvas, che diventa l'unica descrizione dei valori.

## 6. Già nel codice

Tutto il resto: le 27 pagine descrivono il codice com'è su 111347c, nessuna azione. Le correzioni emerse nel giro precedente sono già su `main`: anello di focus del Select (ink in chiaro, oro in scuro, oro anche sul pannello scuro nella variante in linea), grassetto del Toast solo sul titolo, spinner dei poster a 0,8 s con movimento normale e 1,6 s con movimento ridotto, tutte le illustrazioni importate.

Voci marcate “non verificato” (non trovate nel sorgente, da controllare se servono): dimensioni delle icone dove non c'è una regola `.lucide`/`svg` (Icone e immagini), dimensioni di visualizzazione delle illustrazioni (Icone e immagini), menu mobile (Navigation), pollice della scrollbar (Scrollbar), selezione su pannello dello ChoiceGroup (Switch e ChoiceGroup), ritardo di apertura del tooltip (Tooltip), lingua dei titoli originali e formato di date e numeri (Typography).
