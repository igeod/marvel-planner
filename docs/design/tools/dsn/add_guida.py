from addlib import *
_g={}
exec(open(f'{S}/dsn/p_guida.py').read().split('\nP=[]')[0],_g)
scene=_g['scene']; grid=_g['grid']
add('Planner',
 block('Guida “Come leggere il planner” nell’header (rivede la funzione 30)',PROP,
  'Il “?” esce dalla riga della ricerca (colonna dei filtri) e passa nell’header, come il pulsante del tema, solo sulla pagina del planner. Si apre lo stesso popup di oggi. Decisione del 12 novembre: per ora così; posizione e forma (popover, pulsante nella scheda dei progressi) si rivedono in futuro. Il blocco “implementata” qui sopra descrive quello che fa main.',
  grid(scene('B','light',False,'Desktop · chiaro'),scene('B','light',False,'Desktop · popup aperto','open'))
  +grid(scene('B','light',True,'Mobile · chiaro'),scene('B','dark',True,'Mobile · scuro · popup aperto','open'))
  +grid(scene('C','light',False,'Desktop · invito della prima visita','invite'),scene('C','light',True,'Mobile · invito della prima visita','invite'))
  +tbl(['Aspetto','Valore','Note'],[
   ['Dove','header, a sinistra del pulsante del tema; su mobile a sinistra di Menu','solo sulle rotte <code>/</code> e <code>/s/:code</code> (PATHS.home, PATHS.shared); non su film, privacy, accessibilità, admin'],
   ['Pulsante','<code>btn btn--panel</code> con icona <code>CircleHelp</code>, 44px, contorno <code>--ink</code> 2px: identico al pulsante del tema','AppHeader.less r.10-14; nome accessibile <code>planner.guide.help</code>; <code>aria-haspopup="dialog"</code>'],
   ['Come arriva nell’header','<code>GuideHelp</code> resta nel Planner (conosce <code>isChronological</code> e <code>showAlternate</code>) e si monta con un portale su <code>#header-help-slot</code>, dentro <code>.site-header__actions</code> e accanto a Menu','AppHeader.tsx; AppLayout.tsx; GuideHelp.tsx'],
   ['Apertura','<code>Modal</code> come oggi: focus trap, Esc, X, segna la guida come vista','GuideHelp.tsx r.52-63'],
   ['Invito della prima visita','stesso testo e azioni (“Leggi”, “Non ora”), flag <code>mcu-planner-guide-seen</code>; ancorato sotto il pulsante dell’header, a destra: <code>top: calc(var(--header-h) - var(--sp-1))</code>, <code>right: 2rem</code> (desktop) o <code>--sp-2</code> (mobile); sparisce al primo tocco, tasto o scroll fuori','GuideHelp.less r.28-45'],
   ['Riga della ricerca','solo ricerca, a tutta larghezza; sparisce <code>.guide-help</code> dalla riga','Planner.tsx r.216, r.244; GuideHelp.less r.3-19'],
   ['Header','non sticky: la guida si apre solo dall’alto della pagina','accettato'],
   ['Mobile','wordmark, “?” e Menu su 390px: non verificato con il carattere Anton (in anteprima offline il logo va a capo)','da controllare in prova'],
  ])
  +pd([['Posto del “?”','riga della ricerca, nella colonna dei filtri','header, solo sul planner','GuideHelp.tsx; AppHeader.tsx; AppLayout.tsx; Planner.tsx r.216, r.244'],['Aspetto','<code>btn--soft btn--icon</code>','<code>btn--panel</code> con contorno <code>--ink</code>','GuideHelp.less r.21-26'],['Invito','sotto il “?” nella rail','sotto il “?” nell’header','GuideHelp.less r.28-45'],['Apertura','<code>Modal</code>','invariata','—']],sub='Per ogni voce: com’è su main c520ab1 (prima), che cosa decide questa pagina (dopo), file.')
  +'<div class="dc-fl">Rimandate</div>'+ul(['Popover non modale ancorato al pulsante (consigliato dal confronto, da rivedere in futuro).','“?” nell’angolo della scheda dei progressi: rischia di spostare “Condividi il tuo planner”.','Wordmark come pulsante della guida: due comportamenti per lo stesso elemento (home sulle altre pagine), scartato.'])))
