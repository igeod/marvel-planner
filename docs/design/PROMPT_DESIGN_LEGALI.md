# Prompt per la sessione Design: pagine Privacy e Accessibilità, popup Preferenze privacy

Sei la sessione **Design** di Marvel Planner. Questo prompt è autosufficiente: non vedi la chat di Code. Le scelte grafiche sono **tue**; Code non le ha anticipate e non le anticiperà (in `DESIGN.md` c'è solo un tampone temporaneo, vedi sotto). Prima di rispondere o disegnare usa la skill `design-suite` e segui `docs/design/CLAUDE.md` (flusso: canvas, `CHANGELOG.md`, `HANDOFF.md` §2; il codice su `main` vince sul canvas; misura invece di stimare).

## Cosa devi rivedere (tutto insieme, come una famiglia)

1. **Pagina Privacy** (`/privacy`): `src/pages/PrivacyPage/PrivacyPage.tsx` e `.less`.
2. **Pagina Accessibilità** (`/accessibilita`): `src/pages/AccessibilityPage/AccessibilityPage.tsx` e `.less`.
3. **Popup «Preferenze privacy»** (si apre dal footer): `src/features/privacy/components/PrivacySettingsDialog/PrivacySettingsDialog.tsx` e `.less`, con la tabella `StorageTable/StorageTable.tsx` e `.less`. È l'unico posto in cui la tabella compare.

Il committente non capisce perché le due pagine si vedano **come una scheda (box)** su sfondo diverso. Risposta, verificata nel canvas: l'ha disegnata Design. `Accessibility.dc.html`, sezione «Pagina “Accessibilità” del sito (funzione 23)», dice «una colonna su scheda», «stessa famiglia della pagina Privacy». **Una pagina Privacy nel canvas non esiste**: nessun file la disegna (cercato in tutti i `.dc.html` e in `Index.dc.html`); esiste solo nel codice. Oggi `.privacy-page` e `.accessibility-page` usano `.block()` + `background: var(--surface)`, `max-width: 800px`, `margin: 1rem auto`, padding 1.5rem 1rem (40px 48px da desktop) (`PrivacyPage.less` r.3-13, `AccessibilityPage.less` r.4-14). Sono pagine **di lettura** (documenti), non schermate di strumento come il Planner. **Decidi tu** se devono restare schede o diventare pagine di lettura (testo sul fondo della pagina, larghezza di lettura, ritmo dei titoli); motiva la scelta e usa lo stesso schema per le due pagine e per le 404/errori se serve.

## Evidenze trovate provando il sito (20 novembre 2026, `docs/AUDIT.md`)

- **Posizione verticale incoerente** (P6): la 404 sta centrata, Privacy e Accessibilità in alto, con distanze dal header e dal footer diverse. Fissa una regola per le pagine di testo.
- **Privacy** (P7, `privacy.*` in `src/i18n/locales/it.ts`): undici sezioni (`h2`) in una colonna lunga, nessun indice; la riga «Ultimo aggiornamento» sta subito sotto il titolo. Valuta un indice di ancore o altro modo di orientarsi. **I testi li riscrivi tu con la skill `scrittura-ux`** (vedi «Testi» sotto); il significato legale non cambia e ogni modifica va segnalata per la rilettura del committente con un esperto. Punta a testi **più brevi di oggi** (frasi corte, niente ripetizioni, titoli chiari).
- **Accessibilità** (P8): oggi è un elenco di cinque paragrafi, l'ultimo dice «Stiamo ancora controllando lo zoom al 400%…» (superato: verificato a 320 px). Deve diventare una **dichiarazione di accessibilità**: livello di conformità dichiarato (WCAG 2.2 AA), data dell'ultima verifica, limiti noti, come segnalare un ostacolo (contatto), data di aggiornamento. Disegna con segnaposto realistici; i testi li scrivi tu con la skill `scrittura-ux` e li rivede il committente.
- **Popup «Preferenze privacy»** (D2, D3 e altre): è già disegnato in `Popup generici.dc.html` («Impostazioni privacy (PrivacySettingsDialog)» e «Tabella dati (StorageTable.less)»), identico al codice com'è, compresi i difetti sotto. Il canvas **non ha una variante stretta** per la tabella.
  - l'introduzione («Questo sito non usa cookie…») e la sezione «Nessun consenso da dare» dicono la stessa cosa: tieni una sola voce;
  - «Questa pagina elenca tutto ciò che…» è un `h3` ma dovrebbe essere la didascalia della tabella (e dice «pagina» dentro un popup);
  - **la tabella a quattro colonne (Nome, Tipo, Finalità, Durata) non entra sotto ~420 px**: a 390 px è larga 414, a 320 px mancano 94 px (colonna «Durata» tagliata, WCAG 1.4.10). Misurato con Playwright in WebKit (iPhone SE/13) e Chromium. **Tampone attuale di Code:** la tabella scorre di lato in un contenitore focalizzabile (riga in `DESIGN.md`, «Deviazioni»). **Disegna la versione definitiva**: ad esempio una scheda per voce sotto 40em (nome, tipo, finalità, durata impilati), tabella da 40em in su. Decide tu;
  - i nomi tecnici (`better-auth.session_token`, `mcu-planner-v1`, `mcu-planner-language`…) vanno a capo a metà parola anche su desktop: regola per i nomi lunghi (a capo solo dopo `-`/`.`/`_`, o riga a sé);
  - il popup contiene anche «Cancella i dati di questo dispositivo» con conferma in riga (`.privacy-confirm`): disegna i due stati e che cosa succede dopo (ricarica la pagina).
- **Trattino e X nei popup generici** (D1, D8): `Popup generici.dc.html` descrive già il foglio mobile come «raggio solo in alto, maniglia, larghezza piena, **trascinabile (`useSheetDrag`)**» e dice che «la maniglia di trascinamento resta» anche nei popup di decisione (blocco «Decisione · quando la X c'è e quando no», segnato «implementata · main c520ab1»). **Il codice non lo fa**: `Modal.less` disegna il trattino (`.dialog__header::before`) ma `Modal.tsx` non ha alcun trascinamento (`useSheetDrag` è usato solo da Filtri e Account). Quindi trattino + X, e il trattino non chiude. **Scegli**: (a) confermi quanto scritto nel canvas e Code aggiunge `useSheetDrag` a `Modal` (la X resta, non dipende da un gesto); (b) correggi il canvas e il trattino sparisce dai popup che non si trascinano. Aggiorna di conseguenza il blocco «implementata» che oggi non corrisponde al codice.
- **Safari su iPhone** (D4/D5, non ancora verificati sul telefono): bordo inferiore che si stacca durante lo scorrimento del popup; nessun margine di sicurezza in alto e ai lati (`index.html` ha `viewport-fit=cover`, ma il codice usa solo `env(safe-area-inset-bottom)`). Per i fogli in basso decidi altezza massima, distanza dal bordo alto (oggi 48 px nel generico, 24 nei Filtri, 87 nell'Account su 844 di altezza) e margini di sicurezza; Code li implementa dopo una prova su iPhone reale.

## Vincoli del sistema (non negoziabili)

- Solo token (`src/styles/tokens.less`): nessun colore, spazio, durata o curva nuovi. Se serve un valore nuovo, **proponilo** nel canvas con il motivo, non usarlo di nascosto.
- Tipografia da `--fs-*`; testo che cresce con il testo dell'utente (larghezze in `rem` o `ch`); francese e tedesco sono più lunghi: il layout deve reggerli. Larghezza di lettura per la prosa in `ch`.
- WCAG 2.2 AA: bersagli da 44 px (`--hit`), focus sempre visibile (**mai anello rosso**), nessuna informazione solo nel colore, `prefers-reduced-motion`. **Contrasto forzato** (`src/styles/forced-colors.less`): disegna anche come si vede in contrasto forzato (schede senza sfondo hanno bisogno di un contorno).
- CSP rigida: niente stili inline o risorse esterne. Icone solo Lucide, `aria-hidden`. Elementi nascosti con `hidden`.
- Cinque lingue (it, en, fr, es, de), chiaro e scuro, 390 px e 1280 px; controlla anche 320 px (zoom 400%).
- Ogni testo nuovo o riscritto va nelle cinque lingue (it, en, fr, es, de) nelle pagine «Testi nelle 5 lingue» del canvas; Code poi lo copia in `src/i18n/locales` senza cambiarlo.

## Testi: li scrivi tu, con la skill `scrittura-ux`

Le tre superfici (Accessibilità, Privacy, Preferenze privacy) vanno riscritte da **te** con la skill di scrittura che sta in `docs/ux-writing-pack/scrittura-ux/` (non serve installarla: leggi `SKILL.md`, `glossario.md` e, quando serve, le cartelle in `fonti/`; in alternativa installa lo zip `docs/ux-writing-pack/scrittura-ux.zip`). Le regole di `SKILL.md` vincono su quelle generiche delle fonti, che sono scritte per l'inglese.

- Fai prima il **giro di revisione** del testo attuale (`it.ts`, chiavi `a11y.*`, `privacy.*`, `privacySettings.*`, `cookiePage.*`): per ogni testo un verdetto (tenere, accorciare, riscrivere, togliere, unire) con il motivo.
- Poi scrivi i testi nuovi in italiano e nelle altre quattro lingue **dall'intento**, non per traduzione letterale, usando il glossario (`glossario.md`: completalo; il registro del francese, tu o vous, va deciso con il committente).
- **Il significato legale non cambia**: si rende più chiaro, non si toglie né si aggiunge un obbligo. Segna ogni modifica di sostanza in una tabella «prima, dopo, perché» per la rilettura del committente e di un esperto.
- Il disegno e i testi si decidono insieme: lunghezze e a capo dipendono dalle parole. Controlla fr e de a 320 e 390 px.
- Code non riscrive niente: copia nei file di lingua ciò che consegni.

## Cosa deve uscire dal tuo lavoro

1. Pagine del canvas (nuove o aggiornate: «Pagine di testo» o simile, e «Popup generici») con gli stati in chiaro e scuro, 390 e 1280 px (e 320 per la tabella), più la vista in contrasto forzato.
2. Una **proposta chiara** per ognuna delle decisioni sopra (scheda o pagina di lettura, indice, tabella o schede, trattino sì/no, margini di sicurezza), con una raccomandazione e le alternative scartate.
3. Voce in `CHANGELOG.md`, riga in `HANDOFF.md` §2 (numero progressivo) e le righe di «Da implementare».
4. Un **prompt per Code** nello stesso formato di `docs/design/PROMPT_CODE_*.md` (file e righe, misure, cosa costruire nell'ordine, cosa verificare), autosufficiente. Code non decide l'aspetto: gli servono valori e struttura già pronti.

## Cosa NON fare

- Non cambiare la logica, i dati (`STORAGE_INVENTORY`, `src/features/privacy/data/storageInventory.ts`) né i testi legali di Privacy e Accessibilità: la formula resta del committente.
- Non disegnare un nuovo componente se ne esiste uno simile: estendi quello (`Modal`, `.block()`, `Button`).
- Non toccare il Planner, l'Admin o gli altri popup se non per la regola di chiusura e i margini di sicurezza dei fogli in basso.

## Domande per il committente (se non puoi decidere da solo)

1. Privacy e Accessibilità: scheda sì o no?
2. Indice con ancore in cima alla Privacy (undici sezioni)?
3. Trattino sì/no nei popup, se il trascinamento diventa generale?

## Dove guardare

`docs/AUDIT.md` (P6, P7, P8, D1-D8, F6, F7, F8), `docs/BACKLOG.md` (§2 Accessibilità, §3 Privacy, §4 Coerenza), `DESIGN.md` (Deviazioni), `src/components/ui/Modal/Modal.tsx` e `.less`, `src/styles/forced-colors.less`. Canvas (aperti e verificati il 20 novembre): `Popup generici.dc.html` (Modal, ConfirmDialog, ShareDialog, ImportSharedDialog, **PrivacySettingsDialog con la tabella**, regola della X), `Accessibility.dc.html` (fondamenta di accessibilità: anello di focus, aree di tocco, contrasto; più la sezione «Pagina Accessibilità, funzione 23»; contiene ancora la frase «Stiamo ancora controllando lo zoom al 400%»), `Pagine di errore.dc.html` (solo 404, errore imprevisto, manutenzione e errori in linea: serve soltanto per la regola di posizione della 404, P6). Per la Privacy non c'è alcuna pagina.
