# Prompt per la sessione Code: popup «Preferenze privacy» (voce 25)

Sei la sessione **Code** di Marvel Planner. Questo prompt è autosufficiente: non vedi la chat di Design. Il canvas con disegni, misure e alternative sta in `docs/design/canvas/Popup generici.dc.html` (sezione «Decisione · Preferenze privacy: elenco a schede, una sola introduzione e cancellazione (voce 25)», chip «proposta · non implementata»); la voce 25 è in `docs/design/HANDOFF.md` §2 e in `CHANGELOG.md`. Dove il canvas e il codice su `main` differiscono vale il codice.

## Regole (CLAUDE.md di radice, valgono sempre)

- Lavora su `main`, niente branch nuovi. Commit e push solo se richiesti.
- Cambia il minimo che risolve. Niente astrazioni, opzioni, dipendenze non richieste.
- **Solo token esistenti** (`src/styles/tokens.less`). Qui non serve nessun valore nuovo.
- CSP rigida: niente stili inline, script inline, risorse esterne. Icone solo Lucide. Elementi nascosti con `hidden`.
- Ogni testo visibile è tradotto in it, en, fr, es, de. **Mai anello di focus rosso.** Chiaro e scuro, 390 e 1280 px (e 320), contrasto forzato.
- I dati (`STORAGE_INVENTORY`, `src/features/privacy/data/storageInventory.ts`) e la logica (`clearDeviceData`, `usePrivacySettings`) **non cambiano**.
- Prima di dire «fatto»: `npm run lint`, `npm test`, `npm run build`, `npm run format:check`.

Stato di partenza: il codice letto da Design è quello di 4bfbea4 (`Modal` con `useSheetDrag`, `StorageTable` con scorrimento laterale). **4bfbea4 non è su `main`** quando questo prompt è stato scritto: se manca, parti da lì o chiedilo al committente. I numeri di riga sotto sono di 4bfbea4.

## Cosa fare, nell'ordine

### 1 · `StorageTable`: da tabella a elenco di schede

File: `src/features/privacy/components/StorageTable/StorageTable.tsx` e `.less`.

Perché: la tabella a 4 colonne scorre di 63 px a 390 (133 a 320) e, anche nel popup da 35 rem su desktop, la colonna del nome è larga 75-79 px: ogni nome va su 3-6 righe («mcu-/planner/-/languag/e»). Misurato con Playwright (Chromium).

Costruisci (il nome del componente resta o diventa `StorageList`, a tua scelta; una cartella, `.tsx` + `.less`, riga in `index.less` se cambia nome):

```tsx
<ul className="storage-list" aria-labelledby="privacy-stored">
  {STORAGE_INVENTORY.map((item) => (
    <li key={item.id} className="storage-card">
      <code className="storage-card__name">{item.name}</code>
      <p>{t(`cookiePage.${item.id}.purpose`)}</p>
      <dl>
        <div><dt>{t("cookiePage.columns.kind")}</dt><dd>{t(`cookiePage.${item.id}.kind`)}</dd></div>
        <div><dt>{t("cookiePage.columns.duration")}</dt><dd>{t(`cookiePage.${item.id}.duration`)}</dd></div>
      </dl>
    </li>
  ))}
</ul>
```

```less
.storage-list { display: flex; flex-direction: column; gap: var(--sp-2); margin: 0; padding: 0; list-style: none; }
.storage-card {
  display: flex; flex-direction: column; gap: var(--sp-1h);
  padding: var(--sp-3h) var(--sp-4);
  border: 1px solid transparent;   // si vede solo nel contrasto forzato: non toglierlo
  border-radius: var(--r-sm);
  background: var(--row);
  font-size: var(--fs-label);
  p { margin: 0; }
  dl { display: grid; grid-template-columns: auto 1fr; gap: 2px var(--sp-3); margin: var(--sp-1) 0 0; color: var(--ink-2); }
  dl > div { display: contents; }
  dd { margin: 0; }
}
.storage-card__name { font-weight: 700; overflow-wrap: break-word; }   // break-word, non anywhere
```

Via: il contenitore `.storage-table__scroll`, `.scroll-x`, `role="region"`, `tabIndex`, `<table>`, `<caption>` e tutto `.storage-table`. Le chiavi `cookiePage.columns.name` e `.purpose` non servono più (lasciale, vedi sotto). Nessuna riga in `forced-colors.less`.

### 2 · `PrivacySettingsDialog`: tre sezioni

File: `src/features/privacy/components/PrivacySettingsDialog/PrivacySettingsDialog.tsx` (r.28-60).

1. Togli il paragrafo in apertura (`privacySettings.intro`) e tieni una sola sezione **«Nessun consenso da dare»** (`h3` `cookiePage.noBannerHeading`, un paragrafo). Il testo lo accorcia la sessione di scrittura (vedi «Testi»): intanto lascia `cookiePage.noBannerBody`.
2. **«Cookie e dati salvati nel browser»**: `h3#privacy-stored` con `cookiePage.tableCaption` (al posto di `cookiePage.intro`), poi l'elenco del punto 1.
3. **«Dati su questo dispositivo»** (`privacySettings.clearHeading`): `clearBody`, poi il pulsante o la conferma. Togli la sezione «Come gestirli» (`manageHeading`, `manageBody`): la frase sul cookie di sessione e sulle impostazioni del browser va, in una frase, dentro `clearBody` (testo: vedi «Testi»).

Respiro (visto dal committente: «tutto appiccicato»): oggi `.dialog__body h3` non ha margine e il corpo spazia solo le sezioni (gap 1,25 rem), quindi titolo e contenuto sono a 0 px. Dai a ogni `<section>` la classe `privacy-section` e in `PrivacySettingsDialog.less`: `.privacy-section { display: flex; flex-direction: column; gap: var(--sp-3); }` (titolo → contenuto 12 px) e `.privacy-section + .privacy-section { margin-top: var(--sp-2); }` (28 px tra le sezioni: 20 del corpo + 8). Tra le schede restano 8 px (`--sp-2`). Misurato nel canvas, 390 px.

### 3 · Cancellazione: due stati

Stesso file, r.48-67, e `PrivacySettingsDialog.less`.

- A riposo: `<div className="dialog__actions"><Button variant="soft" icon={<Trash2 aria-hidden />} …>…</Button></div>` (a destra su desktop, a tutta larghezza sotto 40 em: la regola `.dialog__actions` è già generale in `ConfirmDialog.less` r.78-85).
- Conferma: `<div className="privacy-confirm"><p role="alert">{domanda}</p><div className="dialog__actions"><Button variant="soft">Annulla</Button><Button variant="danger">Cancella i dati</Button></div></div>`. **`role="alert"` solo sulla domanda** (oggi è sul blocco intero e legge anche i pulsanti). La domanda è già grassetta e rossa per `[role="alert"]` in `base.less` r.270-273: non aggiungere stili.
- `PrivacySettingsDialog.less`: **sostituisci** la regola `.privacy-confirm` con `.privacy-confirm { display: flex; flex-direction: column; gap: var(--sp-3); p { margin: 0; } }` (via `flex-wrap`, `align-items: center` e `p { flex-basis: 100% }`).
- **Focus** (comportamento, non aspetto): quando compare la conferma il pulsante premuto sparisce e il focus cade sul corpo: sposta il focus su «Annulla» (`ref` + `useEffect` sul cambio di stato); quando si annulla, riportalo sul pulsante di cancellazione. Nessun cambiamento a `Modal`.
- Dopo «Cancella i dati»: `clearDeviceData()` e ricarica, **come oggi**. Nessun toast, nessun terzo stato (servirebbe ricordare il gesto in `sessionStorage`, cioè un dato nuovo nella tabella che il popup elenca).

## Testi (già riscritti da Design con la skill `scrittura-ux`; vanno riletti dal committente e da un esperto prima di andare in produzione)

Regola 8 della skill: sono testi di privacy, quindi rilettura obbligatoria; fr, es, de da far leggere a un madrelingua. Il francese resta in «vous» come nei file di oggi (la scelta tu/vous è ancora del committente). Il canvas ha la tabella con verdetto e motivo per ogni chiave. **Copia questi testi nei cinque file di lingua** (non riscriverli: se vuoi cambiarli, rifai il giro con la skill).

**noBannerBody** (`cookiePage.noBannerBody`)

- it: Usiamo solo strumenti tecnici, necessari al servizio che chiedi: accesso, lingua, progressi, filtri. Per questi la normativa non richiede né consenso né banner. Non usiamo cookie di analisi, pubblicità o profilazione. L'unica risorsa di terzi è il video del trailer: YouTube lo carica solo se premi “Avvia il trailer”. Se un giorno questo cambierà, ti chiederemo prima il consenso.
- en: We only use technical tools, needed for the service you ask for: sign-in, language, progress, filters. The law requires neither consent nor a banner for these. We use no analytics, advertising or profiling cookies. The only third-party resource is the trailer video: YouTube loads it only if you press “Play the trailer”. If that ever changes, we will ask for your consent first.
- fr: Nous n'utilisons que des outils techniques, nécessaires au service que vous demandez : connexion, langue, progression, filtres. Pour ceux-ci, la réglementation n'exige ni consentement ni bandeau. Nous n'utilisons aucun cookie d'analyse, de publicité ou de profilage. La seule ressource tierce est la vidéo de la bande-annonce : YouTube ne la charge que si vous appuyez sur « Lancer la bande-annonce ». Si cela change un jour, nous vous demanderons d'abord votre consentement.
- es: Solo usamos herramientas técnicas, necesarias para el servicio que pides: inicio de sesión, idioma, progreso y filtros. Para ellas la normativa no exige consentimiento ni banner. No usamos cookies de analítica, publicidad ni elaboración de perfiles. El único recurso de terceros es el vídeo del tráiler: YouTube lo carga solo si pulsas «Reproducir el tráiler». Si algún día cambia, te pediremos antes tu consentimiento.
- de: Wir nutzen nur technische Mittel, die für den gewünschten Dienst nötig sind: Anmeldung, Sprache, Fortschritt, Filter. Dafür verlangt das Recht weder Einwilligung noch Banner. Wir setzen keine Analyse-, Werbe- oder Profiling-Cookies ein. Die einzige Ressource von Dritten ist das Trailer-Video: YouTube lädt es nur, wenn du auf „Trailer abspielen“ klickst. Sollte sich das ändern, fragen wir vorher nach deiner Einwilligung.

**clearBody** (`privacySettings.clearBody`)

- it: Cancella i progressi (se non hai un account), la lingua e i filtri salvati in questo browser. Resti connesso: il cookie di sessione si elimina solo quando esci. Puoi cancellare i dati anche dalle impostazioni del browser.
- en: Deletes the progress (if you have no account), the language and the filters saved in this browser. You stay signed in: the session cookie is removed only when you sign out. You can also delete the data from your browser settings.
- fr: Supprime la progression (si vous n'avez pas de compte), la langue et les filtres enregistrés dans ce navigateur. Vous restez connecté : le cookie de session n'est supprimé que lorsque vous vous déconnectez. Vous pouvez aussi supprimer ces données depuis les réglages du navigateur.
- es: Borra el progreso (si no tienes cuenta), el idioma y los filtros guardados en este navegador. Sigues conectado: la cookie de sesión solo se elimina al cerrar sesión. También puedes borrar los datos desde los ajustes del navegador.
- de: Löscht den Fortschritt (wenn du kein Konto hast), die Sprache und die Filter, die in diesem Browser gespeichert sind. Du bleibst angemeldet: Das Sitzungs-Cookie wird erst beim Abmelden entfernt. Du kannst die Daten auch in den Browsereinstellungen löschen.

**clearQuestion** (`privacySettings.clearQuestion`)

- it: Cancellare i dati di questo dispositivo? Senza un account, i progressi non si recuperano. La pagina si ricarica.
- en: Delete this device's data? Without an account, your progress can't be recovered. The page reloads.
- fr: Supprimer les données de cet appareil ? Sans compte, la progression ne peut pas être récupérée. La page se recharge.
- es: ¿Borrar los datos de este dispositivo? Sin cuenta, el progreso no se puede recuperar. La página se recarga.
- de: Daten dieses Geräts löschen? Ohne Konto lässt sich der Fortschritt nicht wiederherstellen. Die Seite wird neu geladen.

**clearConfirm** (`privacySettings.clearConfirm`)

- it: Cancella i dati
- en: Delete data
- fr: Supprimer les données
- es: Borrar los datos
- de: Daten löschen

- **`privacySettings.intro`**: togliere (fusa in `noBannerBody`: 59 parole in it al posto di 107; en 63, fr 72, es 64, de 60).
- **`cookiePage.manageHeading`, `manageBody`, `cookiePage.intro`, `columns.name`, `columns.purpose`**: togliere dopo aver cercato altri usi.
- **Tenere** `privacySettings.title`, `clearHeading`, `clearButton`, `cookiePage.noBannerHeading`, `tableCaption`, tutte le `.kind`, `.purpose`, `.duration`, `columns.kind` e `columns.duration`.
- Cambia il significato solo dove la frase originale era ambigua: «se in futuro lo faremo» è diventato «se un giorno questo cambierà» (stesso impegno: chiedere il consenso prima di ogni cambio). Va segnalato a chi rilegge.

## Verifica

A mano, in tutte e cinque le lingue, chiaro e scuro: 390 px (nessuno scorrimento orizzontale, «Durata» visibile), 320 px, 1280 px (nomi su una riga), testo al 200 % (nomi spezzati dopo il trattino, mai fuori dal riquadro), contrasto forzato (ogni scheda ha il contorno), tastiera (Tab: nessuna tappa nell'elenco; conferma: focus su «Annulla», Esc chiude il popup, Annulla riporta il focus sul pulsante). Test automatici: nessun test nuovo (markup e CSS).
**Non verificato da Design:** Safari (la `dl` con `display: contents` sui `div`), VoiceOver e NVDA sull'elenco e sulla conferma, il contrasto forzato reale di Windows, il font monospace dei nomi su altri sistemi operativi (`code` non ha un token: la misura di 200 px per il nome più lungo è di Chromium su Windows).

## DESIGN.md e HANDOFF

- **Cancella** da `DESIGN.md`, «Deviazioni», la riga «Tabella dei cookie nelle Preferenze privacy | `StorageTable.tsx` | contenitore con scorrimento orizzontale… tampone…».
- **Aggiungi** (solo se resta una deviazione): `Preferenze privacy | StorageTable, PrivacySettingsDialog | elenco di schede (--row, --r-sm) al posto della tabella; tre sezioni; conferma con focus su Annulla | voce 25 di HANDOFF §2`.
- Poi cancella la voce 25 da HANDOFF §2, riportala in §5 e metti il chip «implementata · main <commit>» nel blocco del canvas.
