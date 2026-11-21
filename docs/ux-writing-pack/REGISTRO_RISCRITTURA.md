# Registro della riscrittura dei testi

Un passo per riga, in ordine di data. Si aggiorna a ogni passo: chi lavora scrive prima la riga (stato «proposto»), poi la porta a «applicato» con il commit. Regole e processo: `scrittura-ux/SKILL.md`. Le proposte di ogni passo stanno nel documento citato.

Stati: **proposto** (nel documento, file di lingua non toccati) · **approvato** (ok del committente) · **applicato** (nei file di lingua, con commit) · **da rileggere** (privacy, accessibilità, note legali: regola 8).

## Passi

| #   | Data   | Area                                | Chiavi                                                  | Cosa                                                                                                                                                                                                                                   | Stato                                                                                     | Documento / commit                          |
| --- | ------ | ----------------------------------- | ------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------- |
| 1   | 21 nov | Fascia delle fasi                   | `planner.strip.heading` (it, en, fr, es, de)            | «Tutti i 65 titoli» diventa «Tutti i 65 titoli usciti» (e le forme equivalenti): il 65 conta solo gli usciti, i filtri contano le 71 righe                                                                                             | applicato                                                                                 | `da53154`, riga in `DESIGN.md` (Deviazioni) |
| 2   | 21 nov | Popup Profilo, prima revisione      | `account.*`, `auth.name`, `auth.nameHint`               | Revisione di tutte le chiavi: 4 errori da correggere, 5 da uniformare, 2 da accorciare, il resto da tenere                                                                                                                             | fatto                                                                                     | `docs/design/TESTI_PROFILO_2026-11-21.md`   |
| 3   | 21 nov | Popup Profilo, applicazione         | 11 chiavi in `account.*` (tabella sotto), cinque lingue | Scelte lasciate a Claude dal committente: it e en dalla proposta, fr, es, de dall'intento. Tolta la chiave non usata `account.stats.overall`. «Scarta le modifiche» annullato lo stesso giorno: troppo lungo per i pulsanti (regola 7) | applicato (non ancora committato); `delete.warning` e `signedOut` da rileggere (regola 8) | `src/i18n/locales/*.ts`                     |
| 4   | 21 nov | Tutto il sito, controlli automatici | 625 chiavi in 5 lingue                                  | Controlli: chiavi e segnaposto allineati (nessuna differenza), pulsanti e etichette troppo lunghi, maschile generico, errori senza azione, frasi lunghe, doppioni. Corrette 13 voci (tabella «Passo 4»)                                | applicato (non ancora committato); le voci di privacy da rileggere (regola 8)             | `src/i18n/locales/*.ts`                     |

## Passo 3: cosa è cambiato

Decisioni prese: la scheda resta «Account»; il francese resta in «vous» (da annotare nel glossario); «Soddisfatto/Non soddisfatto» → «Rispettato/Non rispettato» in it e fr, en «Met/Not met», es «Cumplido» e de «Erfüllt» restano.

| Chiave                                         | Prima (it)                             | Dopo (it)                                                                                   | Lingue | Stato                   |
| ---------------------------------------------- | -------------------------------------- | ------------------------------------------------------------------------------------------- | ------ | ----------------------- |
| `account.delete.warning`                       | solo en non corrispondeva all'italiano | en riscritto dall'intento                                                                   | en     | applicato, da rileggere |
| `account.delete.button`                        | Elimina account                        | Elimina definitivamente                                                                     | it, en | applicato               |
| `account.password.changed`                     | Sei stato disconnesso…                 | Ti abbiamo disconnesso…                                                                     | tutte  | applicato               |
| `account.password.signedOut`                   | verrai disconnesso…                    | Ti disconnetteremo…                                                                         | tutte  | applicato, da rileggere |
| `account.password.showConfirm`                 | Mostra la conferma della password      | Mostra la password di conferma                                                              | it, en | applicato               |
| `account.profile.save` / `emailSave`           | Salva nome / Aggiorna email            | Salva nome / Salva email                                                                    | tutte  | applicato               |
| `account.profile.saved` / `emailSaved`         | Nome aggiornato / Email aggiornata     | Nome salvato / Email salvata                                                                | tutte  | applicato               |
| `account.export.button`                        | Esporta JSON                           | Scarica i dati                                                                              | tutte  | applicato               |
| `account.dialog.discard`                       | Scarta                                 | Scarta (riportato: l'etichetta più lunga rompeva la regola 7, il canvas usa la forma corta) | tutte  | ripristinato            |
| `account.stats.overall`                        | Titoli visti: {done} / {total}         | chiave tolta (non usata)                                                                    | tutte  | applicato               |
| `account.profile.nothingToSave`                | Non ci sono modifiche da salvare.      | Nessuna modifica da salvare.                                                                | tutte  | applicato               |
| `account.password.requirements.met` / `notMet` | Soddisfatto / Non soddisfatto          | Rispettato / Non rispettato                                                                 | tutte  | applicato               |

## Passo 4: cosa è cambiato

| Chiave                                               | Prima                                                        | Dopo                                        | Lingue     | Motivo                                                      |
| ---------------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------- | ---------- | ----------------------------------------------------------- |
| `auth.login.done`                                    | Bentornato, eroe.                                            | Eccoti di nuovo, eroe.                      | it         | maschile generico                                           |
| `auth.register.done`                                 | Account creato. Benvenuto nel team.                          | Account creato. Entri a far parte del team. | it         | maschile generico                                           |
| `cookiePage.session.purpose`                         | Ti mantiene connesso…                                        | Mantiene attivo il tuo accesso.             | it, fr, es | «connesso/connecté/conectado» al maschile; da rileggere     |
| `privacySettings.clearBody`                          | Resti connesso: …                                            | Il tuo accesso resta attivo: …              | it, fr, es | come sopra; da rileggere                                    |
| `privacy.cookies.body`                               | che ti mantiene connesso                                     | che mantiene attivo il tuo accesso          | it, fr, es | come sopra; da rileggere                                    |
| `details.keyScenes.heading`                          | Scènes à suivre de près / Escenas a las que prestar atención | Scènes clés / Escenas clave                 | fr, es     | titolo di 34 caratteri contro 12 dell'italiano (regola 7)   |
| `planner.filters.clear`                              | Réinitialiser les filtres                                    | Effacer les filtres                         | fr         | pulsante corto                                              |
| `auth.reset.new.button`                              | Enregistrer le nouveau mot de passe                          | Enregistrer le mot de passe                 | fr         | pulsante corto                                              |
| `privacy.retention.heading`                          | Wie lange wir sie speichern                                  | Speicherdauer                               | de         | titolo corto, stesso senso; da rileggere                    |
| `maintenance.adminLogin`                             | Acceso de administrador                                      | Acceso admin                                | es         | come it, en, fr, de                                         |
| `admin.todo.copyError`, `admin.candidates.copyError` | Non sono riuscito / Non riesco a copiare                     | Copia non riuscita…                         | it         | maschile e prima persona, gli altri errori sono impersonali |
| `share.imageError`                                   | Non riesco a creare l'immagine.                              | Impossibile creare l'immagine.              | tutte      | prima persona; ora impersonale come gli altri errori        |

**Controllati e senza problemi:** segnaposto uguali in tutte le lingue, nessun punto esclamativo negli errori, nessun testo tutto maiuscolo, nessun pulsante generico («OK», «Invia») a parte `send` («Invia», nel modulo Suggerisci: ha accanto il campo e il titolo).

**Lasciati di proposito:** le frasi lunghe delle pagine Privacy, cookie, fornitori e diritti (regola 8); la battuta «Bel tentativo, soldato» (si aggiunge al messaggio vero, non lo sostituisce); i titoli duplicati tra chiavi (stesso testo in due posti: si uniscono quando si tocca il codice); «Continua a modificare» / «Continuer à modifier» (forma del canvas).

## Prossimi passi (non iniziati)

1. Pagina Accessibilità (`a11y.*`): riscrittura come dichiarazione. Il commit `5f0d6c1` su `main` ha già accorciato Privacy e Accessibilità; da verificare che cosa resta della lista in `SKILL.md`.
2. Pagina Privacy (`privacy.*`).
3. Popup Preferenze privacy (`privacySettings.*`, `cookiePage.*`).
4. Revisione del resto di `it.ts` per sezione, e glossario (colonne en/fr/es/de ancora vuote).
