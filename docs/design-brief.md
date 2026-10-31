# Marvel Planner: brief per Claude Design

Questo documento descrive tutto ciò che il sito fa oggi, come è fatto e che cosa serve dal design. Non contiene scelte di stile (colori, tipografia, tono, tema, forme, animazioni): quelle le prende il proprietario del progetto e vanno chieste a lui, non proposte di default.

## 1. Il prodotto

**Marvel Planner** è un sito per pianificare e tracciare la visione dei titoli del Marvel Cinematic Universe (MCU): 71 titoli tra film, serie e speciali, raggruppati in 2 saghe e 6 fasi. L'utente segna ciò che ha visto, vede quanto manca, e riceve un consiglio su cosa guardare dopo e cosa conviene aver visto prima di ogni titolo.

- **Non ufficiale**: non è affiliato a Marvel Studios né a The Walt Disney Company. Lo dice il footer.
- **Pubblico**: appassionati di ogni livello, anche chi comincia ora e teme spoiler. Su telefono si usa molto (spesso davanti alla TV).
- **Lingue**: italiano (base), inglese, francese, spagnolo, tedesco. Tutto il sito è tradotto; i **titoli delle opere restano sempre in inglese** (sono marcati `lang="en"`). Francese e tedesco hanno testi più lunghi dell'italiano: i layout devono reggerli.
- **Stato**: il codice è completo e verificato (73 test automatici). Il sito è in manutenzione finché l'amministratore non lo apre, quindi non è ancora pubblico. Il design è l'ultima fase.

## 2. Principi non negoziabili

1. **Prima la funzione, poi l'aspetto.** L'HTML è già semantico e senza stili. Il design lo veste: non deve richiedere di riscrivere la struttura. Se serve cambiarla, va motivato e concordato.
2. **Spoiler sotto controllo.** Trame, scene dopo i titoli di coda, scene chiave e motivazioni dei prerequisiti sono nascoste dietro un pulsante con l'icona dell'occhio e un avviso. Nulla di ciò che rivela la storia deve vedersi per sbaglio (anche nelle anteprime, nei tooltip, nei testi alternativi).
3. **Accessibilità** (almeno WCAG 2.2 AA): navigazione completa da tastiera, focus sempre visibile, ordine di tab logico, contrasto sufficiente, bersagli touch comodi, `prefers-reduced-motion` rispettato, lettori di schermo (annunci con `role="status"` e `role="alert"` già presenti), nessuna informazione affidata solo al colore (es. visto/non visto ha anche icona e testo).
4. **Mobile-first**, con 16 px di margine laterale e nessuno scorrimento orizzontale. Desktop deve restare comodo, non una colonna stretta in mezzo al vuoto.
5. **Onestà sui dati**: fonti sempre dichiarate (vedi sezione 8). Dove non c'è una fonte affidabile, il sito non inventa: mostra meno, ma vero.
6. **Rispetto della privacy**: nessun tracciamento, nessuna risorsa di terzi caricata senza un gesto esplicito dell'utente.

## 3. Vincoli tecnici (cosa il design può e non può fare)

- **Stack**: React 19 + TypeScript + Vite; routing con react-router. Il CSS è l'unico strato di presentazione: oggi esiste un solo file strutturale (`src/styles/layout.css`) con la barra di avanzamento fissa e i margini inferiori.
- **Sicurezza (CSP)**: sono vietati stili inline (`style=""`), script inline e risorse da altri domini. Quindi: fogli di stile esterni, **font ospitati da noi** (niente Google Fonts né CDN), immagini solo dal nostro dominio.
- **Icone**: libreria **Lucide** (già in uso, con `aria-hidden`). Solo librerie gratuite e open source.
- **Immagini dei titoli**: locandine e sfondi arrivano da TMDB ma passano dal nostro server (`/api/images/w342/...` per le locandine, `/api/images/w780/...` per gli sfondi). Alcuni titoli possono non averle: serve sempre uno stato "senza immagine".
- **Finestre**: sono elementi nativi `<dialog>` aperti con `showModal()` (focus intrappolato, chiusura con Esc o clic sullo sfondo). Possono essere nidificate (il trailer si apre sopra i dettagli). Il design deve stilare il dialog e il suo `::backdrop`.
- **Elementi nascosti** con l'attributo `hidden` (non con classi): il CSS non deve riattivarli per errore.
- **Accordion**: sono `<details>/<summary>` nativi (fasi e titoli).
- **Progresso durante lo scorrimento**: su telefono, barra fissa in basso; su desktop, una scheda compatta in cima alla colonna destra (sticky), con conteggio, percentuale, barra e prossimo titolo. Entrambe compaiono quando il riquadro "I tuoi progressi" esce dallo schermo e spariscono quando entra il footer. Sotto, il dettaglio della barra mobile: esiste già la logica (compare quando il "Completati" generale esce dall'alto della pagina, sparisce quando entra il footer); `.floating-progress` è nascosta con `hidden`, centrata in basso, con margine inferiore che include la zona sicura dei telefoni. L'ultimo titolo non deve mai restare coperto: il padding inferiore della lista (`--floating-progress-clearance`) va mantenuto se si cambia l'altezza della barra.
- **Temi**: da decidere con il proprietario (chiaro, scuro, o entrambi).

## 4. Mappa del sito

| Percorso        | Contenuto                                                                                        |
| --------------- | ------------------------------------------------------------------------------------------------ |
| `/`             | Il planner (pagina principale)                                                                   |
| `/s/:codice`    | Il planner con sopra il popup "Planner condiviso" (importazione dei titoli di un altro utente)   |
| `/privacy`      | Informativa sulla privacy (testo lungo + tabella dei dati salvati nel browser)                   |
| `/admin`        | Dashboard dell'amministratore (solo per l'amministratore; per gli altri appare la pagina 404)    |
| qualsiasi altro | Pagina "Pagina non trovata" con link per tornare al planner                                      |
| (stato)         | Pagina "Sito in manutenzione", mostrata al posto del contenuto quando l'amministratore la attiva |
| (errore)        | Pagina di errore imprevisto                                                                      |

Finestre (popup): accesso, registrazione, account, preferenze privacy, dettagli del titolo, trailer, condivisione, importazione, conferme (azzeramento progressi, attivazione manutenzione, cancellazione dati/account).

## 5. Struttura comune a tutte le pagine

1. **Link "Salta al contenuto"** (primo elemento focalizzabile).
2. **Header** con navigazione:
   - nome del sito (link alla home);
   - **selettore di lingua** (5 lingue, nomi nelle rispettive lingue: Italiano, English, Français, Español, Deutsch);
   - **menu account**: da anonimo, icona di accesso (apre il popup di login); da connesso, pulsante con il nome da supereroe (apre il popup account), link "Amministrazione" (solo admin) e pulsante di uscita.
3. **Contenuto principale** (`<main>`).
4. **Footer** (id `site-footer`, osservato dalla barra fissa):
   - link "offrimi un caffè" (oggi **disattivato**: appare solo se verrà impostato un indirizzo; prevedere il posto);
   - disclaimer "sito non ufficiale";
   - avviso TMDB: _"This product uses the TMDB API but is not endorsed or certified by TMDB."_ (obbligatorio, **in inglese**, con link);
   - crediti: dati sulla disponibilità da **JustWatch**, trame da **Wikipedia** con licenza **CC BY-SA 4.0** (link);
   - navigazione legale: link "Privacy" e pulsante "Preferenze privacy" (con icona scudo).
5. Le finestre globali (accesso/registrazione/account e preferenze privacy) vivono nel layout.

## 6. La pagina principale (`/`), blocco per blocco, in questo ordine

1. **Riepilogo**: etichetta sopra il titolo (eyebrow), titolo H1 "Planner di visione", frase introduttiva, **barra "Completati X / 71 · N%"** (sempre sul totale dei 71, mai influenzata dai filtri), nota su dove sono salvati i progressi (account / questo dispositivo / non salvati) ed eventuale messaggio di errore di caricamento o salvataggio.
2. **Avviso admin** (solo amministratore, solo se ci sono nuovi titoli da valutare): "Ci sono N nuovi titoli da valutare" con link alla dashboard.
3. **Prossimo da guardare**: il primo titolo non visto in ordine di visione, saltando i non ancora usciti e la continuità alternativa. Mostra nome, data e tipo, nota "nascosto dai filtri attuali" quando serve, e il pulsante **"Segna come visto"**. Se non c'è nulla da guardare: messaggio "Hai guardato tutto ciò che è uscito nella continuità principale". Appare dopo il caricamento dei progressi.
4. **Ordine di visione** (scelta singola): "Per data di uscita" (predefinito) oppure "Cronologico (storia)".
5. **Filtri** (gruppo con titolo):
   - **Tipo** (caselle multiple): Film, Serie, Speciali. L'utente può spegnerne uno qualunque;
   - **Visibilità** (interruttori con frase positiva): "Mostra continuità alternativa", "Mostra i non ancora usciti" (entrambi attivi di default);
   - **Contatore** con annuncio vocale: "Mostrati 71 di 71";
   - **"Rimuovi filtri"** (con icona), visibile solo se almeno un filtro è attivo. Con zero tipi selezionati la lista è vuota (il contatore dice 0).
   - Su telefono l'idea è un pannello a scomparsa "Filtri (n)", con n = filtri attivi (da progettare).
6. **Azioni** (gruppo separato dai filtri): "Comprimi tutto / Espandi tutto" (solo in ordine per uscita), **"Condividi"** (apre il popup di condivisione), **"Azzera"** (distruttivo, separato dagli altri, con finestra di conferma).
7. **Elenco dei titoli**, in due modalità:
   - **Per data di uscita**: 2 saghe ("Saga dell'Infinito" fasi 1–3, "Saga del Multiverso" fasi 4–6), ciascuna con titolo e conteggio visti/totale; dentro, le **6 fasi** come accordion comprimibili (titolo "N · Nome fase", anni, conteggio, barra di avanzamento della fase, poi l'elenco). Lo stato aperto/chiuso vale solo finché la pagina resta aperta.
   - **Cronologico**: una sola lista "In ordine cronologico" con una nota sulla fonte (linea temporale di Disney+ riportata da Wikipedia, con link, e avvertenza che non è un ordine ufficiale definitivo) e una seconda sezione "Senza collocazione cronologica" (8 titoli che la fonte non include) con la sua spiegazione. Nessuna saga/fase in questa modalità.
8. **Guida "Come leggere il planner"**: due voci (Ordine; Continuità alternativa).
9. **Barra di avanzamento fissa** (vedi sezione 3).

### 6.1 Una riga dell'elenco (titolo)

- **Casella "visto"** (con etichetta accessibile "Segna X come visto").
- **Accordion** (`<details>`): nella riga chiusa si leggono il **nome** (barrato se visto), la **data** (anno, oppure data completa per i titoli futuri) e le **etichette**: tipo (Film/Serie/Speciale), "corti" o "animata" quando vale, "Continuità alternativa", "In arrivo".
- **Aperto** mostra (caricamento pigro, con stati "caricamento" ed "errore + riprova"):
  1. **locandina** (342 px) e **sinossi**;
  2. **trama completa** dietro il pulsante-occhio (con avviso spoiler, indicazione della lingua se la trama esiste solo in un'altra, e fonte Wikipedia con licenza); per le serie anche l'elenco degli episodi;
  3. **"Prima di guardarlo"**: stato di preparazione in una frase (titolo autonomo / mancano titoli essenziali: elenco / pronto / ben preparato / completo), eventuale avviso "provvisorio" per i titoli futuri, **elenco dei prerequisiti in tre livelli** (Essenziali, Consigliati, Facoltativi) dove ogni voce mostra il nome e se è già visto (icona + testo), le **motivazioni** nascoste dietro il pulsante-occhio, ed eventuale nota "fuori dall'MCU";
  4. pulsante **"Dettagli completi"** (apre il popup del titolo).

### 6.2 Popup "Dettagli del titolo"

Contiene, in ordine: immagine di sfondo (solo qui; la locandina sta nell'accordion), titolo, titolo originale se diverso, **dati** (uscita, durata, regia o ideatori), pulsante **"Guarda il trailer"** (solo se esiste), sinossi, **cast** (fino a 15 nomi con personaggio), **"Dove guardare"**, trama (spoiler), **scene dopo i titoli di coda** (spoiler), **scene da guardare con attenzione** (spoiler, con pulsante "Fonte di queste indicazioni" che spiega che sono scelte redazionali nostre), **easter egg e camei** (es. cameo di Stan Lee, con link alla fonte).

- **Scene dopo i titoli di coda**: una frase di sintesi sempre visibile (nessuna / solo dopo il film / a metà), poi l'elenco con posizione (prima dei titoli, a metà, durante, alla fine) e descrizione nascosta dietro l'occhio.
- **Dove guardare**: menu del **paese** (preselezionato dalla lingua: it→Italia, en→Stati Uniti, fr→Francia, es→Spagna, de→Germania), poi gruppi "In abbonamento", "Gratis (con pubblicità)", "Noleggio", "Acquisto" con i nomi dei servizi, il link "Vedi tutte le opzioni" (porta alla pagina di TMDB per quel paese: **non esistono link diretti ai singoli servizi**), la citazione "Dati sulla disponibilità forniti da JustWatch" e l'avvertenza che la disponibilità cambia. Se per il paese non c'è nulla: messaggio dedicato, il menu resta. Stati: caricamento, errore + riprova.

### 6.3 Popup "Trailer"

Si apre sopra i dettagli. Prima mostra un avviso ("il video è fornito da YouTube e viene caricato solo quando premi il pulsante: YouTube può ricevere dati come il tuo indirizzo IP") e il pulsante **"Avvia il trailer"**; solo dopo il clic compare il player (iframe YouTube in modalità privacy-enhanced, 16:9, fullscreen consentito). Chiudere il popup ferma il video. **Il contenitore del video è nostro**: si progetta liberamente (proporzioni, bordi, avviso).

### 6.4 Popup "Condividi il tuo planner"

- Da anonimo: invito ad accedere + pulsante "Accedi".
- Da connesso, senza link attivo: spiegazione di cosa vede chi riceve il link (nome da supereroe e titoli visti, nient'altro), scelta della **validità** (7 giorni, 30 giorni, nessuna scadenza) e pulsante "Crea link".
- Con link attivo: campo di testo con il link + "Copia link" (con conferma "Link copiato"), indicazione di scadenza, **codice QR**, sezione **"Immagine per le storie"** con "Scarica immagine" e (sui telefoni che lo supportano) "Condividi immagine", poi scelta validità + **"Rigenera link"** (il precedente smette di funzionare) e **"Disattiva link"**.
- **Immagine per le storie** (generata dal sito, 1080×1920 PNG): oggi è su sfondo bianco, testo nero, con "Marvel Planner", "Il planner di {nome}", percentuale grande, barra, "Completati: X / 71", QR e "Scansiona per vedere il planner". **La grafica è da progettare** (tenendo conto delle zone coperte dall'interfaccia di Instagram in alto e in basso) e dovrà essere riproducibile con il canvas del browser (testo, forme, immagini locali).

### 6.5 Popup "Planner condiviso" (apertura di `/s/:codice`)

Stati: caricamento; **link non valido/scaduto/disattivato**; errore + riprova; planner **vuoto** ("{nome} non ha ancora segnato nessun titolo"). Stato normale: riepilogo "Titoli visti da {nome}: X / 71 (N%)" con barra, quanti titoli ha già l'utente, nota per chi non ha un account ("l'importazione resta solo su questo dispositivo"), e due scelte:

- **"Unisci ai miei titoli"** (non perde nulla; indica quanti se ne aggiungono);
- **"Sostituisci il mio planner"** (se si perderebbe qualcosa, un secondo passaggio mostra l'avviso con il numero di titoli persi e il pulsante "Sì, sostituisci");
- più **"Non importare"**.

## 7. Account, accesso, privacy

- **Accesso** (popup): email, password, pulsante, link "non hai un account? registrati". **Registrazione**: **nome da supereroe** (nickname di fantasia, 2–30 caratteri, non chiediamo il nome reale), email, password (minimo 8 caratteri), avviso sulla privacy con link, link "hai già un account?". Errori di validazione e di accesso già previsti. Il recupero della password e la verifica dell'email **non esistono ancora** (arriveranno con il dominio e un servizio di posta): lasciare spazio nel flusso di accesso.
- **Popup "Il tuo account"**, dall'alto: **"I tuoi progressi"** (totale, per fase, per tipo, per anno: oggi semplici elenchi; è previsto un popup più elaborato in futuro), **Profilo** (email non modificabile, nome da supereroe modificabile), **Password** (cambio con chiusura delle altre sessioni), **"I tuoi dati"** (scarica copia in JSON), **Elimina account** (richiede la password; irreversibile, con conferma).
- **Popup "Preferenze privacy"**: spiega che non c'è nulla da accettare o rifiutare (nessuna analisi, pubblicità o profilazione; l'unica risorsa di terzi è il video YouTube dopo il clic), elenca i dati salvati sul dispositivo e permette di **cancellarli** (con conferma). **Non c'è un banner dei cookie, volutamente**: non serve per legge perché usiamo solo strumenti tecnici.
- **Pagina `/privacy`**: documento lungo con titoli di sezione (titolare, quali dati, perché, cookie e archiviazione locale, dove sono conservati, per quanto tempo, diritti, altre giurisdizioni, minori) e una **tabella** (nome, tipo, scopo, durata) dei dati salvati nel browser. Il nome e il contatto del titolare sono ancora da inserire.

## 8. Fonti e crediti obbligatori (devono restare visibili e leggibili)

| Dato                                           | Fonte                             | Obbligo                                                                                                     |
| ---------------------------------------------- | --------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Titoli, locandine, sfondi, cast, date, trailer | TMDB                              | Avviso in inglese nel footer (testo esatto) e, per i termini TMDB, **logo TMDB** (da aggiungere nel footer) |
| Dove guardare                                  | JustWatch, tramite TMDB           | Citazione "Dati forniti da JustWatch" accanto ai dati e nel footer                                          |
| Trame                                          | Wikipedia / Wikidata              | Licenza CC BY-SA 4.0, link alla pagina d'origine accanto a ogni trama                                       |
| Linea temporale cronologica                    | Wikipedia (ordine di Disney+)     | Nota sulla fonte e avvertenza "non è un ordine ufficiale definitivo"                                        |
| Scene dopo i titoli di coda, scene chiave      | Nostre (redazionali)              | Dichiarate come tali (pulsante "Fonte di queste indicazioni")                                               |
| Easter egg / camei                             | Fonti esterne                     | Link alla fonte per ciascuno                                                                                |
| Trailer                                        | YouTube (video ufficiali su TMDB) | Avviso prima del caricamento                                                                                |

## 9. Pagina admin e altri stati di servizio

- **Dashboard `/admin`** (solo amministratore, funzionale: bassa priorità estetica ma deve essere chiara): sezione **Manutenzione** (stato "Sito online / Manutenzione attiva", pulsante con conferma), sezione **Attività automatiche** (data e ora dell'ultima esecuzione di pulizia giornaliera e ricerca settimanale, presenza del token TMDB), sezione **Nuovi titoli da valutare** (elenco con nome, "nuovo titolo/nuova stagione", data, e per ognuno: "Genera codice" che mostra due righe di codice con pulsante "Copia", "Apri su TMDB", "Ignora").
- **Pagina di manutenzione**: titolo "Sito in manutenzione", una frase e, per chi non ha fatto l'accesso, il pulsante "Accesso amministratori" che apre il popup di accesso. L'header resta visibile. Durante la manutenzione non è possibile registrarsi.
- **404** e **errore imprevisto**: titolo, spiegazione breve, link per tornare al planner.

## 10. Stati e contenuti da stressare nel design

- Elenco di 71 titoli (anche con filtri che lasciano 0 risultati, 1 solo, o tutti).
- Nomi lunghi in inglese (es. "Doctor Strange in the Multiverse of Madness", "Your Friendly Neighborhood Spider-Man — Stagione 1"), nome da supereroe di 30 caratteri, trame di molti paragrafi, cast di 15 voci, elenchi di episodi, liste di servizi di streaming anche di 10 nomi.
- Titoli senza locandina, sfondo, trailer, trama, durata o scene dopo i titoli di coda.
- Titoli futuri (data completa o "metà 2026"), titoli in continuità alternativa, cortometraggi e animazioni.
- Stati di caricamento, errore con "Riprova", vuoto, successo ("Link copiato").
- Tutte e 5 le lingue; schermi da 320 px a desktop ampio; zoom del testo al 200%.
- Chi usa solo la tastiera o un lettore di schermo; chi preferisce meno movimento.

## 11. Che cosa serve da Claude Design

1. **Sistema di componenti** coerente per tutto ciò che sopra è descritto: pulsanti (primario, secondario, distruttivo, solo icona), campi, caselle e interruttori, menu a tendina, schede/sezioni, accordion, etichette (tag), barre di avanzamento, avvisi (informativo, errore, spoiler), pulsante-occhio per gli spoiler, finestre di dialogo e sfondo, elenchi, tabelle.
2. **Layout** per mobile e desktop delle pagine principali: planner (con filtri a scomparsa su mobile), accordion del titolo aperto, popup dei dettagli, trailer, condivisione, importazione, account, preferenze privacy, pagina privacy, admin, manutenzione, 404/errore.
3. **Barra di avanzamento fissa** e gestione dei margini inferiori.
4. **Immagine per le storie** (1080×1920) e **anteprima social** (immagine Open Graph) del sito.
5. **Icona del sito (favicon)** e, se serve, un marchio/wordmark "Marvel Planner" che **non** imiti il logo né i caratteri di Marvel (il sito non è ufficiale).
6. **Posto per il logo TMDB** nel footer, nel rispetto delle sue linee guida.
7. Indicazioni sui **punti di rottura** e sul comportamento di ciascun blocco.
8. Una **lista di ciò che richiede nuove classi o modifiche all'HTML**, con motivazione, così che si possano applicare in modo controllato.

## 12. Che cosa NON fare

- Non scegliere palette, font, tema, forma degli angoli, ombre, animazioni né tono visivo senza chiederli al proprietario: proporre solo alternative quando richiesto.
- Non usare materiali, loghi, caratteri o immagini ufficiali Marvel/Disney, né locandine o frame incorporati nel design (le immagini dei titoli arrivano dal sito).
- Non usare font o risorse da CDN, né stili o script inline.
- Non nascondere informazioni obbligatorie (fonti, avvisi, link legali) né rendere gli spoiler visibili per default.
- Non introdurre banner dei cookie, tracciamento o analisi.
- Non togliere funzioni: ogni elemento di questo documento esiste ed è verificato.

## 13. Glossario

- **Saga / fase**: l'MCU è diviso in Saga dell'Infinito (fasi 1–3) e Saga del Multiverso (fasi 4–6).
- **Continuità alternativa**: titoli ambientati in linee temporali separate dalla principale (es. X-Men '97, What If…?, Marvel Zombies); non obbligatori per la trama principale.
- **Livelli dei prerequisiti**: Essenziali (senza non si capisce), Consigliati, Facoltativi.
- **Scene dopo i titoli di coda**: brevi scene durante o dopo i titoli finali; qui sono indicate con posizione e descrizione (spoiler).
- **Easter egg / cameo**: riferimenti nascosti e apparizioni (es. Stan Lee).
- **Nome da supereroe**: il nickname pubblico dell'utente (nessun nome reale richiesto).
- **Planner condiviso**: copia di sola lettura dei titoli visti da un utente, raggiungibile da un link con scadenza.
