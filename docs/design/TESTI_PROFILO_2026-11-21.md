# Revisione dei testi: popup del Profilo (21 novembre 2026)

Skill: `docs/ux-writing-pack/scrittura-ux/SKILL.md`. Chiavi: `account.*` (più `auth.name` e `auth.nameHint`, usate nella scheda Profilo). Come previsto dal processo (passo 4) **nessun file di lingua è stato modificato**: questo è il documento da approvare. Dopo l'ok si scrive prima `it`, poi en, fr, es, de dall'intento.

Il glossario (`glossario.md`) ha le colonne en/fr/es/de ancora vuote: le proposte sotto vanno aggiunte lì prima di tradurre.

## Da correggere (errori veri)

| Chiave | Problema | Proposta |
| --- | --- | --- |
| `account.delete.warning` (en) | Dice altro rispetto all'italiano: «hero name and all watched marks» (nome da supereroe, spunte) e «Enter your password to confirm», mentre it/fr/es/de parlano di account, progressi e sessioni. Il testo che spiega una cancellazione definitiva non può cambiare da una lingua all'altra | Riscrivere en dall'intento di `it`: «Your account, saved progress and all active sessions will be permanently deleted. This can't be undone.» **Regola 8: la rilegge il committente** |
| `account.delete.button` (it, en) | In fr, es, de il pulsante dice «definitivamente» (Supprimer définitivement, Eliminar definitivamente, Endgültig löschen); in it e en è solo «Elimina account» / «Delete account», uguale al titolo della sezione | it «Elimina definitivamente», en «Delete permanently» (il pulsante dice la conseguenza) |
| `account.password.changed`, `account.password.signedOut` (it) | «Sei stato disconnesso» e «verrai disconnesso»: maschile per tutti | «Ti abbiamo disconnesso dagli altri dispositivi.» / «Ti disconnetteremo dagli altri dispositivi.» |
| `account.password.showConfirm` (it, en) | it «Mostra la conferma della password» è contorto; en «Show confirm password» non è una frase corretta | it «Mostra la password di conferma», en «Show password confirmation» |

## Da uniformare (una parola per concetto)

| Chiave | Testo attuale | Problema | Proposta |
| --- | --- | --- | --- |
| `profile.save` / `profile.emailSave` | «Salva nome» / «Aggiorna email» | Due verbi per la stessa azione, nello stesso pannello | «Salva nome» / «Salva email» |
| `profile.saved` / `profile.emailSaved` | «Nome aggiornato» / «Email aggiornata» | Seguono i pulsanti | «Nome salvato» / «Email salvata» |
| `export.button` | «Esporta JSON» | Il testo sopra dice «Scarica», il messaggio dopo dice «Download»; il README dice «Scarica i miei dati» | «Scarica i dati» (la nota già dice che è un file JSON) |
| `dialog.discard` | «Scarta» | **Tenuto.** L'oggetto lo dice la frase sopra («Hai modifiche non salvate.»); l'etichetta lunga rompeva la regola 7 (pulsanti corti) e il canvas usa la forma breve | nessuna modifica |
| `stats.overall` | «Titoli visti: {done} / {total}» | Stessa informazione di `planner.watchedCount` («{done} di {total} visti») in due forme. Prima di cambiare: controllare dove è usata | Riusare `planner.watchedCount` (regola 5) se la chiave è ancora usata |

## Da accorciare o chiarire

| Chiave | Testo attuale | Proposta |
| --- | --- | --- |
| `profile.nothingToSave` | «Non ci sono modifiche da salvare.» | «Nessuna modifica da salvare.» |
| `password.requirements.met` / `notMet` | «Soddisfatto» / «Non soddisfatto» (letti dal lettore di schermo per ogni requisito) | «Rispettato» / «Non rispettato» |

## Da tenere

`account.title`, `tabs.*`, `logout.heading`, `logout.note`, `stats.*` (tranne `overall`), `export.heading`, `export.description`, `export.error`, `export.done`, `profile.errors.*`, `password.current`, `password.next`, `password.confirm`, `password.mismatch`, `password.errors.currentWrong`, `dialog.unsaved`, `dialog.keep`, `dialog.invalidDelete`, `dialog.typeLabel`, `delete.heading`, `delete.confirm`. Voce coerente col sito (diretta, in «tu»); nessun testo rivela la trama.

## Da decidere

- **Nome della scheda «Account»**: contiene «Esci», «I tuoi dati» e «Elimina account». Non propongo un cambio (le schede mobili sono strette), ma il nome dice poco; se serve un'alternativa breve: «Dati». Scelta del committente.
- **Registro del francese** (tu o vous): oggi è «vous» in tutto il popup. Va annotato nel glossario.
- **Il testo di cancellazione** (`delete.warning`, `delete.confirm`) e quello su sessioni e dispositivi (`password.signedOut`) toccano privacy e sicurezza: regola 8, rilettura del committente prima di ogni modifica.

## Non verificato

Non ho misurato le nuove lunghezze nei punti stretti (pulsanti, banner delle modifiche non salvate, schede a 320 px) e non ho controllato fr, es, de con un madrelingua.
