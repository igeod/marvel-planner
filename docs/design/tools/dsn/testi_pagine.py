"""Testi riscritti con la skill scrittura-ux per le pagine Privacy e Accessibilità (voce 27).
`python testi_pagine.py` aggiunge la chiave 'proposed' a locales_pagine.json e scrive docs/design/TESTI_PAGINE.md.
Regola 8 della skill: privacy e accessibilità non si addolciscono né si accorciano senza rilettura: qui si rende più chiaro,
si tolgono ripetizioni e si segnala ogni modifica (colonna «Verdetto»). Riferimenti di legge, durate e soggetti: invariati."""
import json, os
D = os.path.dirname(os.path.abspath(__file__))
L = ['it', 'en', 'fr', 'es', 'de']
T = {}   # chiave -> {lingua: testo}


def add(key, it, en, fr, es, de):
    T[key] = dict(zip(L, (it, en, fr, es, de)))


# ---------------- Privacy (solo le chiavi che cambiano; le altre: tenere) ----------------
add('privacy.data.accountText',
    "nome da supereroe (un nickname di fantasia, non il tuo nome reale), email e password. La password è salvata solo cifrata (hash): nessuno può leggerla.",
    "superhero name (a made-up nickname, not your real name), email and password. The password is stored only encrypted (hash): nobody can read it.",
    "nom de super-héros (un pseudo de fantaisie, pas votre vrai nom), e-mail et mot de passe. Le mot de passe n'est conservé que chiffré (hash) : personne ne peut le lire.",
    "nombre de superhéroe (un apodo inventado, no tu nombre real), correo electrónico y contraseña. La contraseña solo se guarda cifrada (hash): nadie puede leerla.",
    "Superheldenname (ein ausgedachter Spitzname, nicht dein echter Name), E-Mail und Passwort. Das Passwort wird nur verschlüsselt (Hash) gespeichert: Niemand kann es lesen.")
add('privacy.data.technicalText',
    "indirizzo IP e tipo di browser delle sessioni di accesso, più contatori che limitano i tentativi di accesso ripetuti.",
    "IP address and browser type of sign-in sessions, plus counters that limit repeated sign-in attempts.",
    "adresse IP et type de navigateur des sessions de connexion, plus des compteurs qui limitent les tentatives de connexion répétées.",
    "dirección IP y tipo de navegador de las sesiones de acceso, y contadores que limitan los intentos de acceso repetidos.",
    "IP-Adresse und Browsertyp der Anmeldesitzungen sowie Zähler, die wiederholte Anmeldeversuche begrenzen.")
add('privacy.data.deviceText',
    "senza account i progressi, la lingua e i filtri restano solo nel tuo browser (localStorage) e non vengono inviati a noi. Puoi cancellarli quando vuoi da {link}.",
    "without an account, your progress, language and filters stay only in your browser (localStorage) and are not sent to us. You can delete them any time from {link}.",
    "sans compte, votre progression, la langue et les filtres restent uniquement dans votre navigateur (localStorage) et ne nous sont pas transmis. Vous pouvez les supprimer à tout moment depuis {link}.",
    "sin cuenta, tu progreso, el idioma y los filtros se quedan solo en tu navegador (localStorage) y no se nos envían. Puedes borrarlos cuando quieras desde {link}.",
    "ohne Konto bleiben dein Fortschritt, die Sprache und die Filter nur in deinem Browser (localStorage) und werden nicht an uns übermittelt. Du kannst sie jederzeit unter {link} löschen.")
add('privacy.data.shareText',
    "se attivi la condivisione, chiunque abbia il link vede il tuo nome da supereroe e i titoli che hai visto, fino alla scadenza che scegli o finché non lo disattivi. Il link contiene un codice casuale, non il tuo identificativo.",
    "if you turn on sharing, anyone with the link sees your superhero name and the titles you have watched, until the expiry you choose or until you turn it off. The link contains a random code, not your identifier.",
    "si vous activez le partage, toute personne disposant du lien voit votre nom de super-héros et les titres que vous avez vus, jusqu'à l'expiration choisie ou jusqu'à la désactivation. Le lien contient un code aléatoire, pas votre identifiant.",
    "si activas la opción de compartir, cualquiera que tenga el enlace ve tu nombre de superhéroe y los títulos que has visto, hasta la caducidad que elijas o hasta que lo desactives. El enlace contiene un código aleatorio, no tu identificador.",
    "wenn du das Teilen aktivierst, sehen alle mit dem Link deinen Superheldennamen und die Titel, die du gesehen hast – bis zum gewählten Ablauf oder bis du es deaktivierst. Der Link enthält einen zufälligen Code, nicht deine Kennung.")
add('privacy.data.suggestionsText',
    "se invii un suggerimento conserviamo il testo che scrivi (è testo libero: non scrivere dati personali), il titolo e la parte della pagina a cui si riferisce, la data e il tuo nome da supereroe. Li vediamo solo noi e vengono eliminati con l'account.",
    "if you send a suggestion we keep the text you write (it is free text: do not write personal data), the title and the part of the page it refers to, the date and your superhero name. Only we can see them, and they are deleted with your account.",
    "si vous envoyez une suggestion, nous conservons le texte que vous écrivez (c'est un texte libre : n'y mettez pas de données personnelles), le titre et la partie de la page concernée, la date et votre nom de super-héros. Nous seuls les voyons, et ils sont supprimés avec le compte.",
    "si envías una sugerencia, guardamos el texto que escribes (es texto libre: no escribas datos personales), el título y la parte de la página a la que se refiere, la fecha y tu nombre de superhéroe. Solo nosotros los vemos y se eliminan con tu cuenta.",
    "wenn du einen Vorschlag sendest, speichern wir den Text, den du schreibst (es ist freier Text: schreibe keine personenbezogenen Daten), den Titel und den Teil der Seite, auf den er sich bezieht, das Datum und deinen Superheldennamen. Nur wir sehen sie, und sie werden mit deinem Konto gelöscht.")
add('privacy.cookies.body',
    "Usiamo solo cookie tecnici, necessari al funzionamento: un cookie di sessione, che ti mantiene connesso. Non usiamo cookie di analisi, pubblicità o profilazione né cookie di terze parti, salvo quelli che YouTube può impostare se avvii tu un trailer. Per questo non serve il tuo consenso (art. 122 del Codice privacy, direttiva ePrivacy, linee guida del Garante del 10 giugno 2021). L'elenco completo è in {link}.",
    "We only use technical cookies, needed for the service to work: a session cookie that keeps you signed in. We do not use analytics, advertising or profiling cookies, nor third-party ones, except those YouTube may set if you start a trailer. That is why we do not need your consent (art. 122 of the Italian Privacy Code, the ePrivacy Directive and the Italian Garante's guidelines of 10 June 2021). The full list is in the {link}.",
    "Nous n'utilisons que des cookies techniques, nécessaires au fonctionnement : un cookie de session, qui vous maintient connecté. Nous n'utilisons aucun cookie d'analyse, de publicité ou de profilage, ni cookie tiers, sauf ceux que YouTube peut déposer si vous lancez une bande-annonce. Votre consentement n'est donc pas requis (art. 122 du Code italien de la vie privée, directive ePrivacy et lignes directrices du Garante du 10 juin 2021). La liste complète figure dans {link}.",
    "Solo usamos cookies técnicas, necesarias para el funcionamiento: una cookie de sesión que te mantiene conectado. No usamos cookies de analítica, publicidad ni elaboración de perfiles, ni de terceros, salvo las que YouTube pueda establecer si inicias un tráiler. Por eso no se requiere tu consentimiento (art. 122 del Código de privacidad italiano, Directiva ePrivacy y directrices del Garante de 10 de junio de 2021). La lista completa está en la {link}.",
    "Wir verwenden nur technische Cookies, die für den Betrieb nötig sind: ein Sitzungs-Cookie, das dich angemeldet hält. Wir setzen keine Analyse-, Werbe- oder Profiling-Cookies und keine Cookies von Dritten ein, außer solchen, die YouTube setzen kann, wenn du einen Trailer startest. Deshalb ist keine Einwilligung nötig (Art. 122 des italienischen Datenschutzkodex, ePrivacy-Richtlinie und Leitlinien des Garante vom 10. Juni 2021). Die vollständige Liste findest du unter {link}.")
add('privacy.providers.body',
    "Il sito e il database sono ospitati da Cloudflare, con il database nell'Europa occidentale. Cloudflare è responsabile del trattamento. Le informazioni sui titoli (sinossi, trame, cast, locandine, sfondi) le chiede il nostro server a TMDB, Wikipedia e Wikidata: il tuo browser non contatta mai questi servizi, quindi non comunica loro il tuo indirizzo IP. Cloudflare ha sede negli Stati Uniti: alcuni dati potrebbero lasciare l'Unione europea, con le garanzie previste dal GDPR (EU-US Data Privacy Framework e clausole contrattuali standard).",
    "The site and the database are hosted by Cloudflare, with the database in Western Europe. Cloudflare is our data processor. Our server requests information about titles (synopses, plots, cast, posters, backdrops) from TMDB, Wikipedia and Wikidata: your browser never contacts these services, so it never gives them your IP address. Cloudflare is based in the United States: some data may leave the European Union, with the safeguards the GDPR provides (EU-US Data Privacy Framework and standard contractual clauses).",
    "Le site et la base de données sont hébergés par Cloudflare, la base de données se trouvant en Europe occidentale. Cloudflare est notre sous-traitant. Notre serveur demande les informations sur les titres (synopsis, intrigues, distribution, affiches, images de fond) à TMDB, Wikipédia et Wikidata : votre navigateur ne contacte jamais ces services et ne leur communique donc pas votre adresse IP. Cloudflare est établi aux États-Unis : certaines données peuvent quitter l'Union européenne, avec les garanties prévues par le RGPD (EU-US Data Privacy Framework et clauses contractuelles types).",
    "El sitio y la base de datos están alojados en Cloudflare, con la base de datos en Europa occidental. Cloudflare es nuestro encargado del tratamiento. Nuestro servidor pide la información sobre los títulos (sinopsis, argumentos, reparto, carteles, imágenes de fondo) a TMDB, Wikipedia y Wikidata: tu navegador nunca contacta con estos servicios, así que no les comunica tu dirección IP. Cloudflare tiene su sede en Estados Unidos: algunos datos podrían salir de la Unión Europea, con las garantías previstas por el RGPD (EU-US Data Privacy Framework y cláusulas contractuales tipo).",
    "Die Seite und die Datenbank werden von Cloudflare gehostet, die Datenbank steht in Westeuropa. Cloudflare ist unser Auftragsverarbeiter. Unser Server fragt die Informationen zu den Titeln (Kurzbeschreibungen, Handlungen, Besetzung, Poster, Hintergrundbilder) bei TMDB, Wikipedia und Wikidata ab: Dein Browser kontaktiert diese Dienste nie und übermittelt ihnen daher deine IP-Adresse nicht. Cloudflare hat seinen Sitz in den Vereinigten Staaten: Einige Daten können die Europäische Union verlassen, mit den Garantien der DSGVO (EU-US Data Privacy Framework und Standardvertragsklauseln).")
add('privacy.retention.body',
    "Conserviamo i dati dell'account finché esiste. Le sessioni scadono dopo 7 giorni; quelle scadute e i link di condivisione scaduti vengono eliminati ogni giorno. I contatori contro gli accessi ripetuti si eliminano dopo un giorno. Le informazioni sui titoli ricevute da terzi restano in cache al massimo 90 giorni. Quando elimini l'account, nome da supereroe, email, progressi e sessioni vengono cancellati subito; le copie di backup tecniche vengono sovrascritte entro 30 giorni.",
    "We keep your account data for as long as the account exists. Sessions expire after 7 days; expired sessions and expired sharing links are deleted every day. The counters against repeated sign-in attempts are deleted after one day. Title information from third parties stays in cache for 90 days at most. When you delete your account, your superhero name, email, progress and sessions are deleted immediately; technical backup copies are overwritten within 30 days.",
    "Nous conservons les données de votre compte tant qu'il existe. Les sessions expirent après 7 jours ; les sessions expirées et les liens de partage expirés sont supprimés chaque jour. Les compteurs contre les connexions répétées sont supprimés après un jour. Les informations sur les titres reçues de tiers restent en cache 90 jours au maximum. Lorsque vous supprimez votre compte, le nom de super-héros, l'e-mail, la progression et les sessions sont supprimés immédiatement ; les copies de sauvegarde techniques sont écrasées sous 30 jours.",
    "Conservamos los datos de tu cuenta mientras exista. Las sesiones caducan a los 7 días; las sesiones y los enlaces para compartir caducados se eliminan cada día. Los contadores contra los accesos repetidos se eliminan al cabo de un día. La información sobre los títulos recibida de terceros permanece en caché 90 días como máximo. Cuando eliminas la cuenta, el nombre de superhéroe, el correo, el progreso y las sesiones se borran de inmediato; las copias de seguridad técnicas se sobrescriben en un plazo de 30 días.",
    "Wir speichern deine Kontodaten, solange dein Konto besteht. Sitzungen laufen nach 7 Tagen ab; abgelaufene Sitzungen und abgelaufene Freigabelinks werden täglich gelöscht. Die Zähler gegen wiederholte Anmeldeversuche werden nach einem Tag gelöscht. Von Dritten erhaltene Titelinformationen bleiben höchstens 90 Tage im Cache. Wenn du dein Konto löschst, werden Superheldenname, E-Mail, Fortschritt und Sitzungen sofort gelöscht; technische Sicherungskopien werden innerhalb von 30 Tagen überschrieben.")
add('privacy.rights.body',
    "Puoi chiedere in qualsiasi momento l'accesso, la rettifica, la cancellazione, la limitazione o la portabilità dei tuoi dati, o opporti al trattamento, scrivendo a {email}. {account}: qui puoi modificare il nome da supereroe, scaricare i tuoi dati in JSON ed eliminare l'account. Non prendiamo decisioni basate su trattamenti automatizzati. Puoi anche presentare reclamo al Garante per la protezione dei dati personali ({garante}).",
    "You can ask at any time for access, rectification, erasure, restriction or portability of your data, or object to the processing, by writing to {email}. {account}: here you can change your superhero name, download your data as JSON and delete your account. We do not take decisions based on automated processing. You can also lodge a complaint with the Italian Data Protection Authority, the Garante ({garante}).",
    "Vous pouvez demander à tout moment l'accès, la rectification, l'effacement, la limitation ou la portabilité de vos données, ou vous opposer au traitement, en écrivant à {email}. {account} : vous pouvez y modifier votre nom de super-héros, télécharger vos données au format JSON et supprimer votre compte. Nous ne prenons aucune décision fondée sur un traitement automatisé. Vous pouvez aussi introduire une réclamation auprès de l'autorité italienne de protection des données, le Garante ({garante}).",
    "Puedes solicitar en cualquier momento el acceso, la rectificación, la supresión, la limitación o la portabilidad de tus datos, u oponerte al tratamiento, escribiendo a {email}. {account}: ahí puedes modificar tu nombre de superhéroe, descargar tus datos en formato JSON y eliminar tu cuenta. No tomamos decisiones basadas en tratamientos automatizados. También puedes presentar una reclamación ante la autoridad italiana de protección de datos, el Garante ({garante}).",
    "Du kannst jederzeit Auskunft, Berichtigung, Löschung, Einschränkung oder Übertragbarkeit deiner Daten verlangen oder der Verarbeitung widersprechen, indem du an {email} schreibst. {account}: Dort kannst du deinen Superheldennamen ändern, deine Daten als JSON herunterladen und dein Konto löschen. Wir treffen keine Entscheidungen auf Grundlage automatisierter Verarbeitung. Du kannst außerdem bei der italienischen Datenschutzbehörde, dem Garante, Beschwerde einlegen ({garante}).")
add('privacy.other.body',
    "Non vendiamo né condividiamo i tuoi dati personali per pubblicità mirata o altre finalità commerciali. Le stesse tutele valgono anche fuori dall'Unione europea (ad esempio in California, nel Regno Unito o in Brasile): puoi esercitare gli stessi diritti scrivendo a {email}.",
    "We do not sell or share your personal data for targeted advertising or other commercial purposes. The same protections apply outside the European Union (for example in California, the United Kingdom or Brazil): you can exercise the same rights by writing to {email}.",
    "Nous ne vendons ni ne partageons vos données personnelles à des fins de publicité ciblée ou à d'autres fins commerciales. Les mêmes protections s'appliquent en dehors de l'Union européenne (par exemple en Californie, au Royaume-Uni ou au Brésil) : vous pouvez exercer les mêmes droits en écrivant à {email}.",
    "No vendemos ni compartimos tus datos personales para publicidad dirigida ni con otros fines comerciales. Las mismas garantías se aplican fuera de la Unión Europea (por ejemplo, en California, el Reino Unido o Brasil): puedes ejercer los mismos derechos escribiendo a {email}.",
    "Wir verkaufen oder teilen deine personenbezogenen Daten nicht für zielgerichtete Werbung oder andere kommerzielle Zwecke. Dieselben Schutzmaßnahmen gelten außerhalb der Europäischen Union (zum Beispiel in Kalifornien, im Vereinigten Königreich oder in Brasilien): Du kannst dieselben Rechte ausüben, indem du an {email} schreibst.")
add('privacy.changes.body',
    "Se cambia qualcosa, lo pubblichiamo qui e aggiorniamo la data in alto.",
    "If anything changes, we publish it here and update the date at the top.",
    "Si quelque chose change, nous le publions ici et mettons à jour la date en haut.",
    "Si algo cambia, lo publicamos aquí y actualizamos la fecha de arriba.",
    "Wenn sich etwas ändert, veröffentlichen wir es hier und aktualisieren oben das Datum.")
# ---------------- Accessibilità (dichiarazione) ----------------
add('a11y.title', "Dichiarazione di accessibilità", "Accessibility statement", "Déclaration d'accessibilité", "Declaración de accesibilidad", "Erklärung zur Barrierefreiheit")
add('a11y.intro',
    "Marvel Planner si può usare con tastiera, lettore di schermo e zoom. Qui trovi a che punto siamo.",
    "Marvel Planner works with a keyboard, a screen reader and zoom. Here is where we stand.",
    "Marvel Planner s'utilise au clavier, avec un lecteur d'écran et le zoom. Voici où nous en sommes.",
    "Marvel Planner se puede usar con teclado, lector de pantalla y zoom. Aquí tienes en qué punto estamos.",
    "Marvel Planner lässt sich mit Tastatur, Screenreader und Zoom nutzen. Hier siehst du, wo wir stehen.")
add('a11y.conformance.heading', "Stato di conformità", "Conformance status", "État de conformité", "Estado de conformidad", "Konformitätsstatus")
add('a11y.conformance.standardLabel', "Standard", "Standard", "Norme", "Norma", "Standard")
add('a11y.conformance.standard', "WCAG 2.2, livello AA", "WCAG 2.2, level AA", "WCAG 2.2, niveau AA", "WCAG 2.2, nivel AA", "WCAG 2.2, Stufe AA")
add('a11y.conformance.statusLabel', "Stato", "Status", "État", "Estado", "Stand")
add('a11y.conformance.status', "Conformità parziale: vedi i limiti noti", "Partially conformant: see the known limits", "Partiellement conforme : voir les limites connues", "Conformidad parcial: consulta los límites conocidos", "Teilweise konform: siehe bekannte Einschränkungen")
add('a11y.conformance.checkedLabel', "Verificato il", "Checked on", "Vérifié le", "Verificado el", "Geprüft am")
add('a11y.conformance.howLabel', "Come", "How", "Méthode", "Método", "Methode")
add('a11y.conformance.how',
    "Prove con tastiera, zoom al 400%, controllo automatico (axe) e prove manuali su Chromium e WebKit. Non ancora con un lettore di schermo reale.",
    "Keyboard tests, 400% zoom, automated checks (axe) and manual tests on Chromium and WebKit. Not yet with a real screen reader.",
    "Essais au clavier, zoom à 400 %, contrôle automatique (axe) et essais manuels sur Chromium et WebKit. Pas encore avec un vrai lecteur d'écran.",
    "Pruebas con teclado, zoom al 400 %, comprobación automática (axe) y pruebas manuales en Chromium y WebKit. Aún no con un lector de pantalla real.",
    "Tastaturtests, 400 % Zoom, automatische Prüfung (axe) und manuelle Tests in Chromium und WebKit. Noch nicht mit einem echten Screenreader.")
add('a11y.use.heading', "Cosa puoi usare", "What you can use", "Ce que vous pouvez utiliser", "Qué puedes usar", "Was du nutzen kannst")
add('a11y.limits.heading', "Limiti noti", "Known limits", "Limites connues", "Límites conocidos", "Bekannte Einschränkungen")
add('a11y.limits.contrast',
    "Con il contrasto forzato di Windows i pulsanti e la fascia delle fasi perdono la forma: si leggono, ma non si distinguono dal testo. Lo stiamo correggendo.",
    "With Windows forced colours, buttons and the phase strip lose their shape: you can read them, but they look like plain text. We are fixing this.",
    "Avec le contraste forcé de Windows, les boutons et la bande des phases perdent leur forme : ils se lisent, mais ressemblent à du texte simple. Nous le corrigeons.",
    "Con el contraste forzado de Windows, los botones y la franja de fases pierden su forma: se leen, pero parecen texto simple. Lo estamos corrigiendo.",
    "Bei erzwungenen Farben in Windows verlieren Schaltflächen und der Phasenstreifen ihre Form: Man kann sie lesen, sie sehen aber wie normaler Text aus. Wir arbeiten daran.")
add('a11y.limits.title',
    "Se il servizio dei dati sui titoli non risponde, la pagina di un titolo non ha un titolo di pagina.",
    "If the title-data service does not respond, a title page has no page heading.",
    "Si le service des données sur les titres ne répond pas, la page d'un titre n'a pas de titre de page.",
    "Si el servicio de datos de los títulos no responde, la página de un título no tiene encabezado de página.",
    "Wenn der Dienst für die Titeldaten nicht antwortet, hat die Seite eines Titels keine Seitenüberschrift.")
add('a11y.limits.screenReader',
    "Non abbiamo ancora provato il sito con un lettore di schermo reale (NVDA, VoiceOver).",
    "We have not yet tested the site with a real screen reader (NVDA, VoiceOver).",
    "Nous n'avons pas encore testé le site avec un vrai lecteur d'écran (NVDA, VoiceOver).",
    "Aún no hemos probado el sitio con un lector de pantalla real (NVDA, VoiceOver).",
    "Wir haben die Seite noch nicht mit einem echten Screenreader getestet (NVDA, VoiceOver).")
add('a11y.report.heading', "Come segnalare un ostacolo", "How to report a barrier", "Comment signaler un obstacle", "Cómo comunicar un obstáculo", "Ein Hindernis melden")
add('a11y.report.body',
    "Se trovi un ostacolo, dicci quale pagina, cosa stavi facendo e che strumento usi.",
    "If you run into a barrier, tell us which page, what you were doing and which tool you use.",
    "Si vous rencontrez un obstacle, dites-nous quelle page, ce que vous faisiez et quel outil vous utilisez.",
    "Si encuentras un obstáculo, dinos qué página, qué estabas haciendo y qué herramienta usas.",
    "Wenn du auf ein Hindernis stößt, sag uns, welche Seite, was du gerade getan hast und welches Hilfsmittel du nutzt.")
CHECKED = dict(zip(L, ["20 novembre 2026", "20 November 2026", "20 novembre 2026", "20 de noviembre de 2026", "20. November 2026"]))

VERDICT = {
 'privacy.data.accountText': 'riscrivere: «mai leggibile» → «nessuno può leggerla»; stesso significato (hash)',
 'privacy.data.technicalText': 'accorciare',
 'privacy.data.deviceText': 'unire: lingua e filtri dentro la stessa frase (prima erano una seconda frase che ripeteva «nello stesso modo»); <b>«Preferenze privacy» diventa un link ({link}) che apre il riquadro, senza virgolette</b>: testo del link = <code>footer.privacySettings</code> (esiste già nelle cinque lingue)',
 'privacy.data.shareText': 'riscrivere: soggetto davanti («chiunque abbia il link vede…»)',
 'privacy.data.suggestionsText': 'riscrivere: minuscola come le altre voci; «film» → «titolo»; «visibili solo a noi» → «li vediamo solo noi»',
 'privacy.cookies.body': 'riscrivere: frase unica sul perché non serve il consenso; stessi riferimenti di legge; <b>il periodo finale usa lo stesso link</b> ({link} = <code>footer.privacySettings</code>, non più «finestra «…»»): <code>privacy.cookies.link</code> si può togliere',
 'privacy.providers.body': 'accorciare: stesse garanzie e stessi soggetti',
 'privacy.retention.body': 'unire: sessioni scadute e link scaduti nella stessa frase; stesse durate (7 giorni, 1 giorno, 90 giorni, 30 giorni)',
 'privacy.rights.body': 'riscrivere: «Dalla pagina Il tuo account» (maiuscola nel mezzo) → «{account}: qui puoi…»; stessi diritti',
 'privacy.other.body': 'tenere quasi uguale; ripete in parte <code>purposes.noProfiling</code> (da valutare con l\'esperto)',
 'privacy.changes.body': 'riscrivere: più breve; stesso impegno (pubblicare e aggiornare la data)',
 'a11y.title': 'riscrivere: da «Accessibilità» a dichiarazione',
 'a11y.intro': 'riscrivere: «Qui trovi come, e che cosa ancora manca» → «Qui trovi a che punto siamo»',
 'a11y.use.heading': 'nuova (le quattro voci di oggi restano uguali: tenere)',
 'a11y.report.body': 'nuova: senza «{email}» (indirizzo nel pulsante) e senza promessa di tempi di risposta',
}


def run():
    p = os.path.join(D, 'locales_pagine.json')
    P = json.load(open(p, encoding='utf-8'))
    for l in L:
        P[l]['proposed'] = {k: v[l] for k, v in T.items()}
        P[l]['proposed']['a11y.conformance.checked'] = CHECKED[l]
    json.dump(P, open(p, 'w', encoding='utf-8'), ensure_ascii=False)
    md = ['# Testi riscritti: Privacy e Accessibilità (voce 27)', '',
          'Riscritti da Design con la skill `scrittura-ux` (regole del progetto, glossario, regola 8). **Sono testi di privacy e accessibilità: li rilegge il committente con un esperto prima di andare in produzione**; fr, es, de da far leggere a un madrelingua. Il francese resta in «vous» come nei file di oggi (scelta tu/vous ancora del committente).',
          '', 'Cosa è stato fatto, per chiave: **tenere** (non compare qui), **accorciare**, **unire**, **riscrivere**. Riferimenti di legge, durate e soggetti sono invariati. Una incoerenza trovata nei file di oggi e corretta: `privacy.data.suggestionsText` in francese era in «tu» (il resto è in «vous»); in tedesco `data.accountText` aveva «Deinen» maiuscolo (le altre «dein»).',
          '', 'Chiavi di Privacy non elencate (titoli, `controller.body`, `progressText`, `purposes.*`, `minors.*`, `cookies.heading`, `updated`): **tenere**. Chiavi di Accessibilità: `a11y.vision/hearing/motion/keyboard.*` tenere (brevi, già naturali); `a11y.missing.*` **togliere** (superata: «Stiamo ancora controllando lo zoom al 400%» è stato verificato a 320 px).',
          '', 'Chiavi nuove (segnaposto sostituiti): la scheda dei fatti e la dichiarazione. `a11y.conformance.checked` è una data (formattata dal codice, `SITE.a11yCheckedAt`): qui l\'esempio per lingua. Il livello («Conformità parziale») e i limiti noti sono **decisioni di chi firma la dichiarazione**; il tempo di risposta non è promesso (tolto su richiesta del committente).', '']
    for k, v in T.items():
        md += [f'## `{k}`', '', f'*{VERDICT.get(k, "nuova")}*'.replace('<code>', '`').replace('</code>', '`'), '']
        md += [f'- **{l}**: {v[l]}' for l in L] + ['']
    md += ['## `a11y.conformance.checked` (esempio)', ''] + [f'- **{l}**: {CHECKED[l]}' for l in L] + ['']
    open(os.path.normpath(os.path.join(D, '..', '..', 'TESTI_PAGINE.md')), 'w', encoding='utf-8').write('\n'.join(md))
    print('ok', len(T), 'chiavi')


if __name__ == '__main__':
    run()
