from addlib import *
C_='2b5e07a'
# ---------------- TOAST ----------------
dem=both('480px',tstack(toast_el('info',L('planner.list.added'),'',L('common.undo'),close=True),toast_el('error',L('errors.save.title'),L('errors.save.body'),L('common.retry'),close=True)),'Prima: X sempre presente')
dem2=both('480px',tstack(toast_el('info',L('planner.list.added'),'',L('common.undo'),close=False),toast_el('info',L('planner.list.savedOnDevice'),'',L('nav.login'),close=False),toast_el('info',L('error.codeCopied'),'',None,close=False),toast_el('error',L('errors.save.title'),L('errors.save.body'),L('common.retry'),close=True)),'Dopo: X solo sul toast persistente')
add('Toast',
 block('Annulla, Accedi e Riprova chiudono il toast',CONF+' '+CORR,'Confermato: dopo il clic il toast si chiude (<code>ToastProvider.tsx</code> r.43-51: <code>runAction</code> esegue <code>await item.action?.onClick()</code> e nel <code>finally</code> chiama <code>onDismiss(id)</code>). Corretto un dettaglio: la chiusura avviene <b>dopo</b> l\'attesa, non al clic. Se l\'azione fallisce e rimette in coda un toast con lo stesso <code>id</code> (caso Riprova sul salvataggio), il <code>finally</code> chiude anche quello nuovo: l\'errore sparisce subito (non verificato nel browser). Regola decisa sotto.',
  tbl(['Pulsante','Dove','Effetto oggi','Effetto deciso'],[
   ['Annulla','<code>planner.list.added/removed</code> (useWatched.ts)','esegue l\'azione, poi chiude','chiude <b>al clic</b>, poi esegue l\'azione'],
   ['Accedi','<code>planner.list.savedOnDevice</code>','apre il popup di accesso, poi chiude','chiude al clic, poi apre il popup'],
   ['Riprova','<code>errors.save.*</code> (toast persistente)','riprova, poi chiude (anche l\'errore nuovo)','chiude al clic; se fallisce di nuovo ne compare uno nuovo'],
  ])),
 block('Decisione · X o Annulla, e durate',DECI,'<b>Decisione:</b> la X e l\'azione sono due cose diverse (rinunciare / fare), ma sul toast che si chiude da solo la X è rumore: l\'azione chiude già il toast, il timer fa il resto, Esc chiude da tastiera. <b>La X resta solo sul toast persistente</b> (errore con Riprova): lì non c\'è timer e serve un modo per rinunciare. Durate: info 4 s, con azione 6 s (erano 6 s e 8 s). Restano la pausa con puntatore o focus e il minimo di 4 s.',
  dem+dem2+tbl(['Caso','X','Durata','Perché'],[
   ['Info senza azione (<code>auth.login.done</code>, <code>error.codeCopied</code>)','no','4 s','una riga si legge in meno di 3 s'],
   ['Info con azione (Annulla, Accedi)','no','6 s','il tempo di accorgersi e toccare; la pausa su puntatore o focus resta (WCAG 2.2.1 rispettato dalla pausa)'],
   ['Errore persistente con Riprova','sì','nessun timer','una scelta in sospeso non deve sparire'],
  ])+
  pd([
   ['Pulsante di chiusura','sempre presente (<code>.toast__close</code>)','solo se <code>persistent</code>','ToastProvider.tsx; Toast.less r.74'],
   ['Durata base','<code>DEFAULT_DURATION = 6000</code>','4000','ToastProvider.tsx'],
   ['Durata con azione','<code>ACTION_DURATION = 8000</code>','6000','ToastProvider.tsx'],
   ['Chiusura dopo l\'azione','nel <code>finally</code>, dopo l\'attesa','prima dell\'<code>await</code>; <code>isPending</code> non serve più','ToastProvider.tsx r.45-48'],
   ['Larghezza con pulsante di chiusura','spazio riservato per la X','senza X il testo guadagna 44px','Toast.less r.68-74'],
  ])),
)
# ---------------- ACCESSIBILITY ----------------
def tap_rows():
    return tbl(['Input','Apertura (menu o popup)','Chiusura','Anello sul pulsante di origine'],[
     ['Tastiera','il focus va al titolo (<code>h2 tabindex="-1"</code>) o al primo controllo; nessun anello sul titolo','il focus torna al pulsante di origine','<b>sì</b> (<code>:focus-visible</code>)'],
     ['Tocco o mouse','come sopra','il focus può tornare al pulsante ma <b>senza anello e senza stato persistente</b>: <code>focus({ focusVisible: false })</code>','<b>no</b>'],
     ['Lettore di schermo','come sopra','il focus torna sempre al pulsante (serve per non perdere la posizione)','segue l\'input'],
    ])
V_page=f'''<div class="dc-pad" style="gap:var(--sp-3)"><h3 class="dc-h3">{esc(T("Accessibilità","Accessibility","Accessibilité","Accesibilidad","Barrierefreiheit")["it"])}</h3><p>{esc(T("Marvel Planner si può usare con tastiera, lettore di schermo e zoom. Qui trovi come, e che cosa ancora manca.","","","","")["it"])}</p>
<div class="phase card"><div class="phase__summary"><h3 class="phase__name">{esc("Se vedi poco o male")}</h3></div></div><div class="phase card"><div class="phase__summary"><h3 class="phase__name">{esc("Se non senti bene")}</h3></div></div><div class="phase card"><div class="phase__summary"><h3 class="phase__name">{esc("Se il movimento ti dà fastidio")}</h3></div></div><div class="phase card"><div class="phase__summary"><h3 class="phase__name">{esc("Tastiera")}</h3></div></div><div class="phase card"><div class="phase__summary"><h3 class="phase__name">{esc("Cosa manca")}</h3></div></div></div>'''
def choice_set(legend,opts,sel_=0):
    return grp(legend,len(opts),''.join(ch(o,'radio',i==sel_) for i,o in enumerate(opts)))
V_panel=f'<div class="dc-pad">{choice_set("Tema",["Come il sistema","Chiaro","Scuro"])}{choice_set("Movimento",["Come il sistema","Ridotto"])}{choice_set("Dimensione del testo",["Normale","Grande","Molto grande"])}{choice_set("Contrasto",["Normale","Alto"])}</div>'
V_over='<div style="position:relative;height:16rem;background:var(--bg)"><button type="button" class="btn btn--dark" style="position:absolute;left:var(--sp-4);bottom:var(--sp-4);width:3.5rem;height:3.5rem;border-radius:50%;padding:0" aria-label="Accessibilità">'+icon('accessibility')+'</button><div class="dc-pad" style="max-width:20rem;margin-left:5rem">'+'<p>(pannello flottante che si sovrappone a ogni pagina)</p></div></div>'
A11Y_TXT=[
 ('a11y.title',T('Accessibilità','Accessibility','Accessibilité','Accesibilidad','Barrierefreiheit')),
 ('a11y.intro',T('Marvel Planner si può usare con tastiera, lettore di schermo e zoom. Qui trovi come, e che cosa ancora manca.','Marvel Planner works with a keyboard, a screen reader and zoom. Here is how, and what is still missing.','Marvel Planner s’utilise au clavier, avec un lecteur d’écran et en zoomant. Voici comment, et ce qui manque encore.','Marvel Planner se puede usar con teclado, lector de pantalla y zoom. Aquí verás cómo, y qué falta todavía.','Marvel Planner lässt sich mit Tastatur, Screenreader und Zoom bedienen. Hier steht, wie – und was noch fehlt.')),
 ('a11y.vision.heading',T('Se vedi poco o male','Low vision','Si vous voyez mal','Si ves poco o mal','Bei Sehbeeinträchtigung')),
 ('a11y.vision.body',T('Puoi scegliere tema chiaro, scuro o come il sistema (menu in alto). Ogni stato ha un’icona o un testo, non solo un colore. I controlli hanno un anello di focus ben visibile.','You can pick the light theme, the dark theme or follow your system (top menu). Every state has an icon or text, not just a colour. Controls have a clearly visible focus ring.','Vous pouvez choisir le thème clair, sombre ou celui du système (menu en haut). Chaque état a une icône ou un texte, pas seulement une couleur. Les contrôles ont un anneau de focus bien visible.','Puedes elegir el tema claro, el oscuro o el del sistema (menú superior). Cada estado tiene un icono o un texto, no solo un color. Los controles tienen un anillo de foco bien visible.','Du kannst das helle oder dunkle Design wählen oder dem System folgen (Menü oben). Jeder Zustand hat ein Symbol oder einen Text, nicht nur eine Farbe. Bedienelemente haben einen gut sichtbaren Fokusrahmen.')),
 ('a11y.hearing.heading',T('Se non senti bene','Hearing loss','Si vous entendez mal','Si no oyes bien','Bei Hörbeeinträchtigung')),
 ('a11y.hearing.body',T('Il sito non usa suoni per darti informazioni. Il trailer parte solo quando lo avvii tu e i sottotitoli dipendono dal video.','The site never uses sound to give you information. The trailer starts only when you start it, and captions depend on the video.','Le site n’utilise jamais le son pour vous informer. La bande-annonce ne démarre que lorsque vous la lancez, et les sous-titres dépendent de la vidéo.','El sitio no usa sonidos para darte información. El tráiler solo empieza cuando tú lo inicias y los subtítulos dependen del vídeo.','Die Seite gibt Informationen nie über Ton. Der Trailer startet nur, wenn du ihn startest; Untertitel hängen vom Video ab.')),
 ('a11y.motion.heading',T('Se il movimento ti dà fastidio','If motion bothers you','Si le mouvement vous gêne','Si el movimiento te molesta','Wenn Bewegung stört')),
 ('a11y.motion.body',T('Se il tuo sistema chiede meno movimento, animazioni e coriandoli si fermano: restano solo cambi di colore e dissolvenze brevi.','If your system asks for reduced motion, animations and confetti stop: only colour changes and short fades remain.','Si votre système demande moins de mouvement, les animations et les confettis s’arrêtent : il ne reste que des changements de couleur et de courts fondus.','Si tu sistema pide menos movimiento, las animaciones y el confeti se detienen: solo quedan cambios de color y fundidos breves.','Wenn dein System weniger Bewegung verlangt, stoppen Animationen und Konfetti: Es bleiben nur Farbwechsel und kurze Überblendungen.')),
 ('a11y.keyboard.heading',T('Tastiera','Keyboard','Clavier','Teclado','Tastatur')),
 ('a11y.keyboard.body',T('Tab per spostarti, Invio o Spazio per attivare, Esc per chiudere popup e messaggi. Al primo Tab compare «Vai al contenuto».','Tab to move, Enter or Space to activate, Esc to close popups and messages. The first Tab shows “Skip to content”.','Tab pour se déplacer, Entrée ou Espace pour activer, Échap pour fermer fenêtres et messages. Le premier Tab affiche « Aller au contenu ».','Tab para moverte, Intro o Espacio para activar, Esc para cerrar ventanas y mensajes. Con el primer Tab aparece «Ir al contenido».','Tab zum Bewegen, Enter oder Leertaste zum Aktivieren, Esc zum Schließen von Fenstern und Meldungen. Beim ersten Tab erscheint „Zum Inhalt springen“.')),
 ('a11y.missing.heading',T('Cosa manca','What is still missing','Ce qui manque encore','Qué falta todavía','Was noch fehlt')),
 ('a11y.missing.body',T('Stiamo ancora controllando lo zoom al 400% e la modalità a contrasto forzato. Se trovi un ostacolo, segnalacelo.','We are still checking 400% zoom and forced-contrast mode. If you find a barrier, tell us.','Nous vérifions encore le zoom à 400 % et le mode contraste forcé. Si vous rencontrez un obstacle, dites-le-nous.','Aún estamos revisando el zoom al 400 % y el modo de contraste forzado. Si encuentras una barrera, avísanos.','Wir prüfen noch 400 % Zoom und den Modus für erzwungenen Kontrast. Wenn du auf eine Barriere stößt, sag uns Bescheid.')),
]
add('Accessibility',
 block('Focus: main, h1 e h2 senza anello, controlli con anello',CONF,'<b>Verifica WCAG 2.4.7 (Focus visibile, AA):</b> la regola vale per ogni interfaccia che si usa da tastiera. <code>main</code> (AppLayout.tsx r.24 e r.43), i titoli h1 di StatusPage e AdminDashboard e l\'h2 del Modal (Modal.tsx r.71) hanno <code>tabIndex={-1}</code>: ricevono il focus solo da codice (cambio pagina, apertura popup), non sono nell\'ordine del Tab e non si attivano. Non sono quindi controlli: il criterio non li riguarda e l\'anello su un titolo darebbe solo rumore. La deroga sta in <code>base.less</code> r.148-153 (<code>main:focus-visible, :is(h1, h2)[tabindex="-1"]:focus-visible { outline: none }</code>) ed è confermata. Ogni altro elemento raggiungibile col Tab mostra l\'anello <code>--focus</code> da 3px. Resta valido anche 2.4.11 (Focus non oscurato): il pannello di avanzamento fisso non copre l\'elemento a fuoco perché <code>scroll-padding-bottom: var(--floating-progress-clearance)</code> (base.less r.71).',
  tbl(['Elemento','Focus da codice','Anello','Perché'],[
   ['<code>main</code>','sì, a ogni cambio pagina','no','non è un controllo; serve a lettore di schermo e a ripartire dall\'alto'],
   ['<code>h1</code> (StatusPage, Admin)','sì','no','idem'],
   ['<code>h2</code> del popup','sì, all\'apertura','no','il lettore annuncia il titolo del popup'],
   ['Pulsanti, link, campi, interruttori, riga del titolo','solo con Tab o clic','sì, 3px <code>--focus</code>','sono controlli: WCAG 2.4.7'],
  ])),
 block('Decisione · focus dopo un tocco',DECI,'Il menu mobile resta “in focus” dopo la chiusura: il pulsante che lo ha aperto riceve il focus dal codice e il browser, quando il focus arriva da script, può mostrare l\'anello anche se l\'input era un tocco. <b>Regola decisa:</b> nessuno stato persistente dopo un tocco. Si ricorda l\'ultimo tipo di input (<code>keydown</code> contro <code>pointerdown</code>); alla chiusura di menu, popup e toast da tocco o mouse il focus torna al pulsante di origine con <code>focus({ focusVisible: false })</code> (con la tastiera e con i lettori di schermo resta l\'anello). Lo stato di pressione esiste solo mentre si tiene premuto (<code>:active</code>, mixins.less r.28 e Button.less r.178) e l\'hover solo con <code>(hover: hover) and (pointer: fine)</code> (mixin <code>.on-hover</code>, mixins.less r.15).',
  tap_rows()+pd([
   ['Focus alla chiusura del menu e dei popup','sempre sul pulsante di origine, con anello se il browser lo decide','dopo tocco o mouse: sul pulsante ma senza anello (<code>focusVisible: false</code>); dopo tastiera: con anello','useDialog.ts (ripristino del focus); ToastProvider.tsx r.36-41'],
   ['Stato dopo un tocco','non definito','nessuno: né anello né hover appiccicato','mixins.less r.15 e r.28; Button.less r.178'],
   ['Da verificare su dispositivo','—','iOS Safari (supporto parziale di <code>focusVisible</code>): se manca, <code>blur()</code> subito dopo <code>focus()</code>','—'],
  ])),
 pd([
  ['Focus da codice','non descritto','regola 2.4.7 scritta e confermata','base.less r.148-153; AppLayout.tsx r.24; Modal.tsx r.71'],
  ['Focus dopo un tocco','non definito','nessuno stato persistente','useDialog.ts'],
  ['Regole vista e udito','assenti','tabella con file e “manca”; pagina Accessibilità (variante A preferita)','—'],
 ]))
# ---------------- BUTTONS (B5) ----------------
b5=[
 ['Footer · Impostazioni privacy','<code>text</code>, <code>icon</code> ShieldCheck a sinistra','nessuna icona (le altre voci della riga legale non ne hanno)','AppFooter.tsx'],
 ['Riprova (LoadError, ErrorPage, Dove guardare)','<code>icon</code> RotateCcw a sinistra','invariato: verbo d\'azione → icona a sinistra','LoadError.tsx r.37 e r.54; ErrorPage.tsx r.36; WhereToWatch.tsx'],
 ['Copia codice','<code>icon</code> Copy/Check a sinistra','invariato','ErrorCode.tsx r.38'],
 ['Accedi / Registrati / Invia / Nuova password','<code>icon</code> a sinistra (LogIn, UserPlus, Send, KeyRound)','invariato','LoginForm.tsx r.107; RegisterForm.tsx r.151; ForgotForm.tsx r.53; ResetPasswordForm.tsx r.147'],
 ['Condividi, Azzera, Rigenera, Disattiva link, Scarica, Elimina dati','<code>icon</code> a sinistra','invariato','PlannerSummary.tsx r.105 e r.131; ShareDialog.tsx r.201 e r.211; ExportSection.tsx r.46; PrivacySettingsDialog.tsx r.60'],
 ['Cancella ricerca, Rimuovi filtri','<code>icon</code> X a sinistra','invariato (azione con verbo)','PlannerSearch.tsx r.78; FiltersEmpty.tsx r.16'],
 ['Apri scheda del titolo','Maximize2 <b>dopo</b> il testo (<code>TitleItem.tsx</code> r.116, non passa da <code>iconEnd</code>)','invariato: apre altro → icona a destra; si passa da <code>iconEnd</code>','TitleItem.tsx r.117?'],
 ['Dettagli (scheda “Prossimo da guardare”)','nessuna icona (<code>Link</code> con <code>buttonClass("text")</code>); “Apri scheda” nello stesso percorso ha Maximize2 a destra','<b>Maximize2 a destra</b>, come “Apri scheda”: stessa destinazione (<code>/film/:id</code>), stessa regola','NextToWatch.tsx r.126-128; TitleItem.tsx r.113-119'],
 ['Link esterni (JustWatch, candidati)','ExternalLink dopo il testo','invariato: a destra','WhereToWatch.tsx r.108; CandidatesSection.tsx r.102'],
 ['Annulla, Chiudi, Indietro, Non importare','nessuna icona','invariato: azioni neutre senza icona','ConfirmDialog.tsx; ImportSharedDialog.tsx'],
 ['Toast: Annulla, Accedi','nessuna icona','invariato: azioni dentro un toast senza icona','useWatched.ts'],
 ['Menu, Chiudi menu, tema','solo icona, <code>aria-label</code>','invariato: nome sempre nell\'<code>aria-label</code>','HeaderMenu.tsx r.75 e r.100; ThemeSwitcher.tsx r.18'],
]
add('Buttons',
 block('Decisione · icona nelle etichette cliccabili: posizione e quando serve',DECI,'Oggi <code>Button</code> accetta <code>icon</code> (prima del testo) e <code>iconEnd</code> (dopo): <code>iconEnd</code> non è usato da nessun componente (nessuna occorrenza fuori da Button.tsx), le icone a destra sono scritte a mano. <b>Regola:</b> <b>icona a sinistra</b> quando il testo è un verbo d\'azione e l\'icona la riassume; <b>icona a destra</b> solo quando il clic porta altrove o apre un dettaglio (apri scheda, link esterno, chevron di menu e accordion); <b>nessuna icona</b> sulle azioni neutre (Annulla, Chiudi, Indietro), nei toast e nei link della riga legale. Al massimo una icona per pulsante; sul solo-icona il nome sta nell\'<code>aria-label</code>.',
  tbl(['Pulsante','Prima','Dopo','File'],b5)+
  pd([
   ['Dettagli','senza icona, mentre “Apri scheda” (stessa destinazione) ha Maximize2','Maximize2 a destra; un solo componente per i link-pulsante con icona (<code>ButtonLink</code>, con <code>icon</code> e <code>iconEnd</code>), perché <code>Button</code> non si usa per i <code>Link</code> e la regola non si applicava','NextToWatch.tsx r.126-128; Button.tsx; buttonClass.ts'],
   ['Icona a destra','scritta a mano in <code>TitleItem.tsx</code> e nei link','sempre via <code>iconEnd</code>','Button.tsx r.9, r.68; TitleItem.tsx r.117?; WhereToWatch.tsx r.108'],
   ['Footer · Impostazioni privacy','con icona','senza icona','AppFooter.tsx'],
   ['Regola scritta','assente','tre casi: sinistra (verbo), destra (altrove), nessuna (neutro)','questa pagina'],
  ])))
