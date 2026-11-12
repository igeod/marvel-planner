from addlib import *
def box(inner,style=''): return f'<div style="background:var(--surface);border-radius:var(--r-md);padding:var(--sp-3) var(--sp-4);{style}">{inner}</div>'
def keys(prefix_rows,**kw):
    return txt([(k,T(*[L(k,l,**{a:b for a,b in kw.items()}) if True else '' for l in LANGS])) for k in prefix_rows])
def keysraw(rows):
    """rows: list of key; placeholders left as {name}"""
    out=[]
    for k in rows:
        out.append((k,T(*[L(k,l) for l in LANGS])))
    return txt(out)
IMPLNOTE='Letto dal codice su main c520ab1; i valori non sono scritti a mano.'
# ===================== Popup di accesso: unione (f16) =====================
def merge_dlg(sel='merge',lang='it',err=False,pending=False):
    opts=[('merge',L('merge.optMerge',lang),L('merge.optMergeHint',lang,result=41)),
          ('cloud',L('merge.optCloud',lang),L('merge.optCloudHint',lang,onlyLocal=3)),
          ('device',L('merge.optDevice',lang),L('merge.optDeviceHint',lang,onlyCloud=7))]
    o=''
    for v,t,h in opts:
        b=f'<span class="merge-choice__badge">{L("merge.recommended",lang)}</span>' if v=='merge' else ''
        o+=(f'<label class="merge-choice__option"{" style=\"box-shadow:inset 0 0 0 2px var(--ink)\"" if v==sel else ""}><input type="radio" name="mc{lang}{sel}{err}{pending}" value="{v}"{" checked=\"checked\"" if v==sel else ""}{" disabled=\"disabled\"" if pending else ""}>'
            f'<span class="merge-choice__text"><strong>{t}{b}</strong><span>{h}</span></span></label>')
    e=f'<p role="alert">{L("merge.error",lang)}</p>' if err else ''
    var='primary' if sel=='merge' else 'danger'
    lab=L('merge.continue',lang) if sel=='merge' else dict((v,t) for v,t,h in opts)[sel]
    if pending: lab=L('merge.pending',lang)
    bt=btn(var,lab,'lg','is-loading' if pending else '')
    body=f'<p>{L("merge.body",lang,local=44,cloud=38)}</p><div class="merge-choice" role="radiogroup" aria-label="{L("merge.title",lang)}">{o}</div>{e}{bt}'
    return modal(L('merge.title',lang),body,'md',close=False)
MK=['merge.title','merge.body','merge.optMerge','merge.optMergeHint','merge.optCloud','merge.optCloudHint','merge.optDevice','merge.optDeviceHint','merge.recommended','merge.continue','merge.pending','merge.error','merge.toast']
add('Popup di accesso',
 block('Unione dei planner dopo l\'accesso (funzione 16, variante A)',IMPL,
  'Dopo l\'accesso, se dispositivo e account hanno titoli visti che l\'altro non ha, compare <code>MergeChoiceDialog</code> (MergeChoiceDialog.tsx r.13-95). È un <code>Modal</code> <b>senza X</b> (<code>showClose={false}</code>, r.56): si esce scegliendo, oppure con Esc/clic fuori quando non è in corso il salvataggio (r.57). Tre carte radio; la scelta iniziale è <b>Unisci entrambi</b> (r.15), con la targhetta “Consigliato”. '+IMPLNOTE,
  '<div class="dc-row">'+fr('light','560px',merge_dlg('merge'),'Unisci · scelta iniziale')+fr('dark','560px',merge_dlg('cloud'),'Scuro · “Tieni quelli dell\'account”')+'</div>'
  +'<div class="dc-fl">Altri stati</div><div class="dc-row">'+fr('light','560px',merge_dlg('device'),'“Usa quelli di questo dispositivo”')+fr('light','560px',merge_dlg('merge',pending=True),'In salvataggio · carte disattivate')+fr('light','560px',merge_dlg('merge',err=True),'Errore di salvataggio (<code>role="alert"</code>)')+'</div>'
  +sec('Valori letti dal codice','',tbl(['Elemento','Valore','File'],[
   ['Carta (<code>.merge-choice__option</code>)','sfondo <code>--bg</code>, raggio <code>--r-row</code>, padding <code>--sp-3</code> <code>--sp-4</code>, intera carta cliccabile; il radio nativo è invisibile ma resta per tastiera e lettori','MergeChoiceDialog.less r.11-38'],
   ['Carta scelta','contorno interno 2px <code>--ink</code> (<code>:has(input:checked)</code>), nessun colore di accento','MergeChoiceDialog.less r.20-22'],
   ['Focus','<code>outline: var(--focus)</code> con <code>--focus-offset</code> sulla carta (<code>:has(input:focus-visible)</code>)','MergeChoiceDialog.less r.24-27'],
   ['Testo secondario','<code>--ink-2</code>, <code>--fs-label</code>, spazio <code>--sp-1</code>','MergeChoiceDialog.less r.40-49'],
   ['Targhetta “Consigliato”','sfondo <code>--primary</code>, testo <code>--on-primary</code>, <code>--fs-caption</code>, peso 800, padding 2px 10px, margine sinistro <code>--sp-2</code>','MergeChoiceDialog.less r.51-59'],
   ['Pulsante','<code>lg</code>; con “Unisci” <b>primario</b> e testo “Continua”; con le altre due scelte <b>pericolo</b> (<code>danger</code>) e testo uguale al titolo della scelta; in salvataggio mostra “Sto unendo…”','MergeChoiceDialog.tsx r.84-92'],
   ['Conteggi nei testi','unione = titoli account + solo dispositivo; “tieni account” perde i solo dispositivo; “usa dispositivo” toglie i solo account','MergeChoiceDialog.tsx r.21-37'],
  ])+'<p class="dc-note">I numeri nelle demo (44, 38, 41, 3, 7) sono d\'esempio: nell\'app vengono da <code>DeviceConflict</code> (progressSync.ts).</p>')
  +sec('Esito: toast','Dopo la scelta compare un toast di conferma <b>senza “Annulla”</b>: l\'azione non si può annullare dal toast. Testo letto dalla chiave <code>merge.toast</code>.',
     tstack(toast_el('info',L('merge.toast',result=41)))+'<div class="dc-fl">Testo nelle 5 lingue</div>'+tbl(['Lingua','merge.toast'],[[l,esc(L('merge.toast',l,result='N'))] for l in LANGS]))
  +'<div class="dc-fl">Testi nelle 5 lingue</div>'+txt([(k,T(*[L(k,l) for l in LANGS])) for k in MK[:-1]])
  +'<p class="dc-note">Varianti scartate: B e C (non implementate).</p>'),
)
# ===================== Planner: guida "?" (f30 B) =====================
def gnames(lang):
    return dict(chrono=f'<strong>{esc(L("planner.order.chronological",lang))}</strong>',tag=f'<strong>{esc(L("planner.tags.alternate",lang))}</strong>',filter=f'<strong>{esc(L("planner.filters.showAlternate",lang))}</strong>')
def rich_(key,lang):
    s=esc(L(key,lang)); n=gnames(lang)
    for k,v in n.items(): s=s.replace('{'+k+'}',v)
    return s
def guide_items(lang='it',chrono=False,alt=True):
    h=f'<div><h3>{esc(L("planner.guide.startTerm",lang))}</h3><p>{esc(L("planner.guide.startText",lang))}</p></div>'
    if not chrono: h+=f'<div><h3>{esc(L("planner.guide.orderTerm",lang))}</h3><p>{rich_("planner.guide.orderText",lang)}</p></div>'
    if alt: h+=f'<div><h3>{esc(L("planner.guide.alternateTerm",lang))}</h3><p>{rich_("planner.guide.alternateText",lang)}</p></div>'
    return f'<div class="guide-help__items">{h}</div>'
def helpbtn(lang='it'):
    return f'<button type="button" class="btn btn--soft btn--icon guide-help__button" aria-label="{esc(L("planner.guide.help",lang))}" aria-haspopup="dialog">{icon("circle-help")}</button>'
def callout(lang='it'):
    return (f'<div class="guide-help__callout" role="status" style="position:relative;top:auto;right:auto;animation:none"><p>{esc(L("planner.guide.callout",lang))}</p>'
            f'<div class="guide-help__actions">{btn("primary",esc(L("planner.guide.calloutOpen",lang)),"sm")}{btn("text",esc(L("planner.guide.calloutDismiss",lang)),"sm")}</div></div>')
def searchrow(lang='it'):
    return (f'<div class="planner__search-row"><form class="planner-search" role="search"><label class="planner-search__field">{icon("search",None,2.4)}<input aria-label="{esc(L("planner.search.label",lang))}" type="search" placeholder="{esc(L("planner.search.placeholder",lang))}"/></label></form><div class="guide-help">{helpbtn(lang)}</div></div>')
GH=['planner.guide.help','planner.guide.callout','planner.guide.calloutOpen','planner.guide.calloutDismiss','planner.guide.title','planner.guide.startTerm','planner.guide.startText','planner.guide.orderTerm','planner.guide.orderText','planner.guide.alternateTerm','planner.guide.alternateText']
add('Planner',
 block('“Come leggere il planner”: pulsante “?” e invito alla prima visita (funzione 30, variante B)',IMPL,
  'Il blocco in fondo alla pagina (<code>PlannerGuide</code>) non c\'è più. Accanto alla ricerca c\'è un “?” (<code>GuideHelp</code>, GuideHelp.tsx r.20-108) che apre un <code>Modal</code> con la guida. <b>Alla prima visita</b> (con o senza accesso) compare, una volta, un invito accanto al “?” (r.25, r.65-84): non chiede nulla, sparisce al primo tocco, tasto o scroll fuori dall\'invito (r.27-41) e non torna (flag <code>mcu-planner-guide-seen</code>, <code>STORAGE_KEYS.guideSeen</code>). L\'invito aspetta che la pagina sia disegnata (<code>isReady</code>, r.13). '+IMPLNOTE,
  '<div class="dc-row">'+fr('light','100%',f'<div style="position:relative;padding-bottom:9rem">{searchrow()}<div style="position:absolute;right:0;top:calc(var(--row-h) + var(--sp-2))">{callout()}</div></div>','Prima visita · invito sotto il “?”')+fr('dark','100%',f'<div style="position:relative;padding-bottom:9rem">{searchrow()}<div style="position:absolute;right:0;top:calc(var(--row-h) + var(--sp-2))">{callout()}</div></div>','Scuro')+'</div>'
  +'<div class="dc-fl">Popup della guida: voci condizionali</div><div class="dc-row">'
  +fr('light','520px',modal(esc(L('planner.guide.title')),guide_items('it',False,True)),'Ordine di uscita, alternativa visibile: 3 voci')
  +fr('light','520px',modal(esc(L('planner.guide.title')),guide_items('it',True,True)),'Ordine cronologico: senza “Vuoi seguire la storia?”')
  +fr('light','520px',modal(esc(L('planner.guide.title')),guide_items('it',False,False)),'Alternativa spenta nei filtri: senza “Continuità alternativa”')+'</div>'
  +sec('Valori letti dal codice','',tbl(['Elemento','Valore','File'],[
   ['Riga ricerca + “?”','flex, gap <code>--sp-2</code>; il “?” è centrato sul campo di ricerca: <code>margin-top: calc((var(--row-h) - var(--hit)) / 2)</code>','GuideHelp.less r.3-19'],
   ['Pulsante “?”','<code>btn btn--soft btn--icon</code>, largo e alto <code>--hit</code>; icona <code>CircleHelp</code>; <code>aria-haspopup="dialog"</code>; apre il popup e segna la guida come vista','GuideHelp.tsx r.52-63; GuideHelp.less r.21-26'],
   ['Invito','<code>.panel-surface()</code> (scuro in entrambi i temi), raggio <code>--r-md</code>, ombra <code>--shadow-pop</code>, larghezza <code>min(18rem, 100vw − 2rem)</code>, <code>z-index: 6</code>, sotto il “?” (<code>top: calc(100% + var(--sp-2))</code>, <code>right: 0</code>); <code>role="status"</code>','GuideHelp.less r.28-45'],
   ['Azioni dell\'invito','“Leggi” primario <code>sm</code> + “Non ora” testo <code>sm</code>','GuideHelp.tsx r.69-81'],
   ['Movimento','<code>reveal-in</code> per <code>--dur-enter</code> solo con <code>prefers-reduced-motion: no-preference</code>','GuideHelp.less r.42-44'],
   ['Chiusura dell\'invito','pointerdown o tasto o scroll fuori dall\'invito; “Leggi” e “?” aprono il popup e chiudono l\'invito','GuideHelp.tsx r.27-41'],
   ['Popup','<code>Modal</code> con titolo <code>planner.guide.title</code>; voci in colonna, gap <code>--sp-4</code>, titoli <code>h3</code> <code>--fs-title</code> peso 800','GuideHelp.tsx r.86-105; GuideHelp.less r.53-63'],
   ['Voci condizionali','“Da dove iniziare”: sempre. “Vuoi seguire la storia?”: solo se l\'ordine <b>non</b> è cronologico. “Continuità alternativa”: solo se il filtro delle alternative è acceso','GuideHelp.tsx r.88-103'],
  ]))
  +sec('Nomi di scheda e filtro: dalle chiavi dell\'app','I nomi in grassetto non sono scritti nel testo della guida: vengono dalle chiavi <code>planner.order.chronological</code> (scheda), <code>planner.tags.alternate</code> (etichetta) e <code>planner.filters.showAlternate</code> (filtro) e si traducono con l\'app (GuideHelp.tsx r.43-48). Se un\'etichetta cambia, la guida resta giusta.',
     tbl(['Segnaposto','Chiave','it','en','fr','es','de'],[[f'<code>{{{p}}}</code>',f'<code>{k}</code>']+[esc(L(k,l)) for l in LANGS] for p,k in [('chrono','planner.order.chronological'),('tag','planner.tags.alternate'),('filter','planner.filters.showAlternate')]]))
  +'<div class="dc-fl">Testi nelle 5 lingue (segnaposto non risolti)</div>'+txt([(k,T(*[L(k,l) for l in LANGS])) for k in GH])
  +'<p class="dc-note">Varianti scartate: A (popup che si apre da solo) e C (pannello laterale). Anteprima del popup nelle altre lingue: <b>EN</b> '+'</p>'
  +'<div class="dc-fl">Popup in inglese, francese, spagnolo, tedesco</div><div class="dc-row">'+''.join(fr('light','420px',modal(esc(L('planner.guide.title',l)),guide_items(l,False,True)),l.upper()) for l in LANGS[1:])+'</div>'
  +pd([['Posizione','accordion in fondo alla pagina (<code>PlannerGuide</code>)','“?” accanto alla ricerca + popup','GuideHelp.tsx; Planner.tsx r.216, r.244'],['Prima visita','aperto solo senza titoli visti','invito una volta, non bloccante','GuideHelp.tsx r.25-41'],['Voci','2 voci','“Da dove iniziare” + 2 condizionali','GuideHelp.tsx r.88-103'],['Nomi di scheda/filtro','scritti nel testo','dalle chiavi dell\'app','GuideHelp.tsx r.44-48']],sub='Per ogni voce: com\'era nel codice 2b5e07a (prima), com\'è su main c520ab1 (dopo), file.')),
)
# ===================== Planner: vai all'ultimo visto / torna su / segna fase (f21, f22) =====================
def jump_btn(lang='it'): return btn('text',esc(L('planner.jump.last',lang)),'','','locate-fixed')
def top_btn(lang='it'): return f'<button type="button" class="back-to-top" aria-label="{esc(L("planner.jump.top",lang))}" style="position:relative;right:auto;bottom:auto;animation:none">{icon("arrow-up")}</button>'
def phase_actions(all_=False,lang='it'):
    return f'<div class="phase__actions">{btn("text",esc(L("planner.phase.unmarkAll" if all_ else "planner.phase.markAll",lang)),"sm","","undo-2" if all_ else "check-check")}</div>'
add('Planner',
 block('“Vai all\'ultimo titolo visto” e “Torna all\'inizio” (funzioni 21 e 22, variante A)',IMPL,
  'Due scorciatoie per una lista lunga. <b>Vai all\'ultimo titolo visto</b> è un pulsante testo con icona <code>LocateFixed</code> nella scheda “I tuoi progressi” (PlannerSummary.tsx r.83-87): compare solo se c\'è almeno un titolo visto (<code>useJumpToLastWatched</code> restituisce <code>null</code> altrimenti, r.39). <b>Torna all\'inizio</b> è un cerchio scuro fisso in basso a destra che compare dopo 1,5 schermate di scroll (BackToTop.tsx r.5-17). '+IMPLNOTE,
  '<div class="dc-row">'+fr('light','360px',box(jump_btn()),'Pulsante nella scheda dei progressi')+fr('light','360px',f'<div style="display:flex;justify-content:flex-end;padding:var(--sp-4)">{top_btn()}</div>','Torna all\'inizio · chiaro')+fr('dark','360px',f'<div style="display:flex;justify-content:flex-end;padding:var(--sp-4)">{top_btn()}</div>','Torna all\'inizio · scuro')+'</div>'
  +sec('Valori letti dal codice','',tbl(['Elemento','Valore','File'],[
   ['Ultimo titolo visto','l\'ultimo visto <b>nell\'ordine in uso</b> (uscita o cronologico): <code>titlesInOrder(catalog, order)</code> al contrario','useJumpToLastWatched.ts r.15-17'],
   ['Fase chiusa','solo con ordine di uscita: la fase si apre, si aspetta <code>420 ms</code> (<code>UNFOLD_MS</code>, durata dell\'animazione) e poi si centra la riga','useJumpToLastWatched.ts r.6, r.24-36'],
   ['Scroll','<code>scrollIntoView({ block: "center" })</code>, <code>smooth</code> salvo movimento ridotto (<code>auto</code>)','useJumpToLastWatched.ts r.30-31'],
   ['Focus','dopo lo scroll il focus va al primo controllo della riga (<code>input, summary</code>) con <code>preventScroll</code>: il lettore di schermo la annuncia','useJumpToLastWatched.ts r.32-33'],
   ['Torna all\'inizio: soglia','compare con <code>scrollY &gt; 1,5 × innerHeight</code>, sparisce in cima; ascolto <code>scroll</code> passivo','BackToTop.tsx r.8-17'],
   ['Torna all\'inizio: aspetto','cerchio <code>--hit</code>, sfondo <code>--panel</code>, icona <code>ArrowUp</code> 20px in <code>--on-dark</code>, ombra <code>--shadow-pop</code>, <code>z-index: 10</code>, toni <code>--panel-2</code> / <code>--raised-3</code>','BackToTop.less r.4-22'],
   ['Torna all\'inizio: posizione','<code>right: --sp-4</code>; <code>bottom: calc(var(--floating-progress-clearance) + var(--sp-3))</code> (su desktop la barra non riserva spazio: clearance 0)','BackToTop.less r.3-8'],
   ['Torna all\'inizio: movimento','ingresso <code>fade-in</code> per <code>--dur-ui</code> solo senza movimento ridotto; lo scroll è <code>smooth</code> salvo movimento ridotto','BackToTop.less r.24-26; BackToTop.tsx r.20-21'],
  ]))
  +'<div class="dc-fl">Testi nelle 5 lingue</div>'+txt([(k,T(*[L(k,l) for l in LANGS])) for k in ('planner.jump.last','planner.jump.top')])
  +pd([['Salto all\'ultimo visto','assente','pulsante nella scheda dei progressi, solo con almeno un visto','PlannerSummary.tsx r.83-87; useJumpToLastWatched.ts; Planner.tsx r.114'],['Torna su','assente','cerchio scuro fisso dopo 1,5 schermate','BackToTop.tsx; Planner.tsx r.333']],sub='Per ogni voce: com\'era nel codice 2b5e07a (prima), com\'è su main c520ab1 (dopo), file.')),
 block('“Segna tutta la fase come vista” (funzioni 21 e 22, variante A)',IMPL,
  'Sotto il sommario di ogni fase con titoli compare una riga azione (<code>.phase__actions</code>, PhaseSection.tsx r.72-90) con un pulsante testo <code>sm</code>: <b>Segna tutta la fase come vista</b> (icona <code>CheckCheck</code>) oppure, se la fase è già tutta vista, <b>Togli la spunta a tutta la fase</b> (icona <code>Undo2</code>). Agisce <b>sui titoli mostrati</b>: con i filtri attivi segna solo ciò che si vede (r.40-41). '+IMPLNOTE,
  '<div class="dc-row">'+fr('light','420px',box(phase_actions(False)),'Fase non completa')+fr('light','420px',box(phase_actions(True)),'Fase completa')+fr('dark','420px',box(phase_actions(False)),'Scuro')+'</div>'
  +'<div class="dc-fl">Conferma: toast con “Annulla”</div>'+tstack(toast_el('info',L('planner.phase.markedToast',phase=L('catalog.phases.1'),count=6),'',L('common.undo')),toast_el('info',L('planner.phase.unmarkedToast',phase=L('catalog.phases.1')),'',L('common.undo')))
  +sec('Valori letti dal codice','',tbl(['Elemento','Valore','File'],[
   ['Riga azione','<code>display: flex</code>, padding <code>--sp-1</code> <code>--sp-3</code> 0','PhaseSection.less r.7-10'],
   ['Quando c\'è','solo se la fase ha titoli (<code>phase.titles.length &gt; 0</code>)','PhaseSection.tsx r.72'],
   ['Azione','<code>onSetPhase(ids, !isAllWatched, phaseName)</code> → <code>setMany</code> (un solo salvataggio, una sola conferma)','PhaseSection.tsx r.76-83; useWatched.ts r.135-196'],
   ['Annulla','il toast di conferma porta “Annulla”, che ripristina i soli titoli cambiati','useWatched.ts r.156-162'],
  ]))
  +'<div class="dc-fl">Testi nelle 5 lingue</div>'+txt([(k,T(*[L(k,l) for l in LANGS])) for k in ('planner.phase.markAll','planner.phase.unmarkAll','planner.phase.markedToast','planner.phase.unmarkedToast')],phase='{phase}',count='{count}')),
)
# ===================== Planner: popup di completamento (f24 A) =====================
def conf(n=28):
    cols=['var(--accent)','var(--highlight)','var(--ink)']
    o=''
    for i in range(1,n+1):
        o+=f'<span style="position:absolute;top:{(i*53)%40*2}%;left:{(i*37)%100}%;width:8px;height:14px;border-radius:2px;background:{cols[(i-1)%3]};transform:rotate({(180+(i*71)%360)}deg);opacity:.9"></span>'
    return f'<div aria-hidden="true" style="position:absolute;inset:calc(var(--sp-6)*-1) calc(var(--sp-6)*-1) 0;overflow:hidden;pointer-events:none">{o}</div>'
def comp_dlg(lang='it',sound=False,reduced=False):
    chip='<p class="completion__chip" style="display:inline-block">100%</p>' if reduced else ''
    cf='' if reduced else conf()
    s=sw(L('planner.completion.sound',lang),sound)
    body=(f'<div class="completion">{cf}{chip}<p>{esc(L("planner.completion.line",lang))}</p>{btn("primary",esc(L("planner.completion.share",lang)),"lg","","share-2")}'
          f'<div class="completion__sound">{s}<p class="muted">{esc(L("planner.completion.soundHint",lang))}</p></div></div>')
    return modal(esc(L('planner.completion.title',lang)),body)
CK=['planner.completion.title','planner.completion.line','planner.completion.share','planner.completion.sound','planner.completion.soundHint']
add('Planner',
 block('Popup “Multiverso completato” (funzione 24, variante A)',IMPL,
  'Quando tutti i titoli sono visti compare <code>CompletionDialog</code> (CompletionDialog.tsx r.34-75), <b>una sola volta</b>: il flag <code>mcu-planner-completed-seen</code> (<code>STORAGE_KEYS.completedSeen</code>) si imposta alla chiusura (PlannerSummary.tsx r.50-56, r.61-65). L\'adesivo sotto “I tuoi progressi” (<code>CompletionSticker</code>) non c\'è più. Dentro: riga di testo, azione primaria <b>Condividi il tuo planner</b> (chiude il popup e apre la condivisione, r.50-60) e, sotto un filetto, l\'interruttore <b>Suono</b> con la nota. '+IMPLNOTE,
  '<div class="dc-row">'+fr('light','520px',comp_dlg('it',False),'Chiaro · suono spento (predefinito)')+fr('dark','520px',comp_dlg('it',True),'Scuro · suono acceso')+'</div>'
  +'<div class="dc-fl">Movimento ridotto</div>'+both('520px',comp_dlg('it',False,True),'Niente coriandoli: compare la targhetta “100%”')
  +sec('Valori letti dal codice','',tbl(['Elemento','Valore','File'],[
   ['Coriandoli','28 pezzi (<code>PIECES</code>), 8 × 14 px, raggio 2px, colori a rotazione <code>--accent</code> / <code>--highlight</code> / <code>--ink</code>; <code>aria-hidden</code>, <code>pointer-events: none</code>, mai focus','CompletionDialog.tsx r.11-25; CompletionDialog.less r.29-70'],
   ['Posizione e ritardo','da aritmetica sull\'indice: <code>x = (i·37) mod 100 %</code>, ritardo <code>(i·53 mod 40)·10 ms</code>, rotazione <code>180 + (i·71 mod 360)°</code>: nessun casuale','CompletionDialog.less r.47-58'],
   ['Caduta','<code>confetti-fall</code> 1,8 s, <code>--ease-out</code>, da −12 px a +360 px, opacità 1 → 0; solo con <code>no-preference</code>','CompletionDialog.less r.72-98'],
   ['Movimento ridotto','coriandoli non disegnati; compare <code>.completion__chip</code> “100%” (sfondo <code>--highlight</code>, testo <code>--ink-static</code>, peso 800)','CompletionDialog.less r.10-19, r.82-86'],
   ['Suono','spento di default (<code>STORAGE_KEYS.sound</code>, flag <code>mcu-planner-sound</code>); chi l\'ha acceso lo sente una volta all\'apertura; acceso dall\'interruttore suona subito','CompletionDialog.tsx r.36-42, r.62-69'],
   ['Il suono','due note sinusoidali, 262 Hz e 392 Hz (a 0 e 0,18 s), guadagno fino a 0,18, meno di 1 s, con Web Audio API: nessun file; in assenza di audio il popup funziona uguale','celebrationSound.ts r.1-26'],
   ['Sezione suono','colonna, gap <code>--sp-1</code>, filetto <code>1px --line</code> sopra, padding sopra <code>--sp-3</code>','CompletionDialog.less r.21-27'],
  ]))
  +'<div class="dc-fl">Testi nelle 5 lingue</div>'+txt([(k,T(*[L(k,l) for l in LANGS])) for k in CK])
  +pd([['Completamento','adesivo (<code>CompletionSticker</code>)','popup una volta, con azione Condividi','CompletionDialog.tsx; PlannerSummary.tsx r.50-65'],['Suono','assente','interruttore nel popup, spento di default','CompletionDialog.tsx; celebrationSound.ts'],['Inventario privacy','<code>mcu-planner-completed-seen</code>','+ <code>mcu-planner-sound</code>, <code>mcu-planner-guide-seen</code>','storageKeys.ts; storageInventory.ts']],sub='Per ogni voce: com\'era nel codice 2b5e07a (prima), com\'è su main c520ab1 (dopo), file.')
  +'<p class="dc-note">Varianti scartate: B (popup con “100%” grande) e C (solo toast).</p>'),
)
# ===================== Accessibility: pagina del sito (f23) =====================
AK=[('a11y.title',),('a11y.intro',),('a11y.vision.heading',),('a11y.vision.body',),('a11y.hearing.heading',),('a11y.hearing.body',),('a11y.motion.heading',),('a11y.motion.body',),('a11y.keyboard.heading',),('a11y.keyboard.body',),('a11y.missing.heading',),('a11y.missing.body',)]
def a11y_page(lang='it'):
    secs=''.join(f'<section><h2>{esc(L(h,lang))}</h2><p>{esc(L(b,lang))}</p></section>' for h,b in [('a11y.vision.heading','a11y.vision.body'),('a11y.hearing.heading','a11y.hearing.body'),('a11y.motion.heading','a11y.motion.body'),('a11y.keyboard.heading','a11y.keyboard.body'),('a11y.missing.heading','a11y.missing.body')])
    return f'<article class="accessibility-page" aria-labelledby="a11y-t" style="margin:0"><h1 id="a11y-t">{esc(L("a11y.title",lang))}</h1><p>{esc(L("a11y.intro",lang))}</p>{secs}</article>'
add('Accessibility',
 block('Pagina “Accessibilità” del sito (funzione 23)',IMPL,
  'Pagina pubblica su <code>/accessibilita</code> (<code>app/paths.ts</code> r.4), con link <b>Accessibilità</b> nel piè di pagina (<code>footer.accessibility</code>). <code>AccessibilityPage</code> (AccessibilityPage.tsx r.14-30) è un <code>article</code> con titolo, introduzione e 5 sezioni fisse: vista, udito, movimento, tastiera, cosa manca. Stessa famiglia della pagina Privacy: una colonna su scheda. '+IMPLNOTE,
  '<div class="dc-row">'+fr('light','880px',a11y_page(),'Chiaro · it',pad='var(--sp-3)')+'</div>'+both('360px',a11y_page('it'),'Mobile (360 px)',pad='0')
  +sec('Valori letti dal codice','',tbl(['Elemento','Valore','File'],[
   ['Scheda','<code>.block()</code>, sfondo <code>--surface</code>, larghezza massima 800px centrata, margine 1rem auto, padding 1,5rem 1rem; da desktop 40px 48px','AccessibilityPage.less r.4-14'],
   ['Colonna','<code>display: flex</code>, gap 1,5rem; ogni sezione gap <code>--sp-2</code>','AccessibilityPage.less r.5-26'],
   ['Titolo h1','<code>.display-font()</code>, <code>--fs-xl</code>, interlinea 1,05','AccessibilityPage.less r.16-20'],
   ['Titoli h2','<code>--fs-h3</code>, peso 800','AccessibilityPage.less r.28-31'],
   ['Titolo del documento','<code>usePageTitle("a11y.title")</code>','AccessibilityPage.tsx r.15'],
  ]))
  +sec('Che cosa dice il sito: già fatto e ancora da fare','La pagina promette solo ciò che il codice garantisce (testi letti dalle chiavi <code>a11y.*</code>).',tbl(['Sezione','Stato','Cosa dice la pagina (it)'],[
   ['Vista','dichiarato dalla pagina',esc(L('a11y.vision.body'))],
   ['Udito','dichiarato dalla pagina',esc(L('a11y.hearing.body'))],
   ['Movimento','dichiarato dalla pagina',esc(L('a11y.motion.body'))],
   ['Tastiera','dichiarato dalla pagina',esc(L('a11y.keyboard.body'))],
   ['Cosa manca','dichiarato: manca',esc(L('a11y.missing.body'))],
  ]))
  +'<div class="dc-fl">Testi nelle 5 lingue</div>'+txt([(k[0],T(*[L(k[0],l) for l in LANGS])) for k in AK])),
)
add('Toast',
 block('Toast “Planner uniti” dopo la scelta di unione (funzione 16)',IMPL,
  'Dopo la scelta nel popup di unione compare un toast informativo con il testo <code>merge.toast</code> (“Planner uniti: N titoli visti”). Nel codice <b>non ha il pulsante “Annulla”</b>: l\'unione non si annulla dal toast. Per le tre scelte (unisci, tieni account, usa dispositivo) il testo è lo stesso, con N = titoli visti dopo la scelta. '+IMPLNOTE,
  both('480px',tstack(toast_el('info',L('merge.toast',result=41))),'Chiaro · scuro')
  +tbl(['Lingua','merge.toast'],[[l,esc(L('merge.toast',l,result='N'))] for l in LANGS])),
)
# ===================== Proposta: casella tri-stato sulla fase =====================
def phase_box(state):
    chk={'none':'','mixed':'','all':' checked="checked"'}[state]
    inner=icon('minus') if state=='mixed' else icon('check')
    stl=' style="border-color:var(--ink);color:var(--ink)"' if state=='mixed' else ''
    svg_on='' if state!='mixed' else ''
    lab=L('planner.phase.unmarkAll') if state=='all' else L('planner.phase.markAll')
    box=f'<span class="title-row__box" aria-hidden="true"{stl}>{inner}</span>'
    if state=='mixed': box=box.replace('aria-hidden="true"','aria-hidden="true"').replace('<svg','<svg style="opacity:1"')
    cnt={'none':0,'mixed':3,'all':6}[state]
    return (f'<div class="phase card" style="padding:0"><div class="phase__summary" style="display:flex;align-items:center;gap:var(--sp-3)">'
            f'<label class="title-row__check"><input type="checkbox"{chk} aria-label="{esc(lab)}"{" aria-checked=\"mixed\"" if state=="mixed" else ""}>{box}</label>'
            f'<span class="phase__heading"><h3 class="phase__name">{L("catalog.phases.1")}</h3><span class="phase__years muted">2008 – 2012</span></span>'
            f'<span class="phase__count">{L("common.ofCount",done=cnt,total=6)}</span>{CHEV}</div></div>')
add('Planner',
 block('Casella sulla fase al posto di “Segna tutta la fase come vista”',PROP,
  'Proposta di Diego (12 novembre). La riga azione sotto il sommario (<code>.phase__actions</code>) sparisce e a sinistra del nome della fase compare la <b>stessa casella dei titoli</b> (<code>.title-row__check</code> / <code>.title-row__box</code>, TitleItem.less r.199-229), con tre stati. Il rosso significa solo “visto”: spenta = non tutta vista, e basta. Il codice di main c520ab1 ha ancora il pulsante (blocco “Segna tutta la fase” sopra, PhaseSection.tsx r.72-90).',
  '<div class="dc-row">'+fr('light','100%',phase_box('none')+'<div style="height:var(--sp-3)"></div>'+phase_box('mixed')+'<div style="height:var(--sp-3)"></div>'+phase_box('all'),'Chiaro · nessuno, parziale, tutta vista')+fr('dark','100%',phase_box('none')+'<div style="height:var(--sp-3)"></div>'+phase_box('mixed')+'<div style="height:var(--sp-3)"></div>'+phase_box('all'),'Scuro')+'</div>'
  +sec('Stati','',tbl(['Stato','Quando','Aspetto','Rosso?'],[
   ['Nessuno','0 titoli visti tra quelli mostrati','contorno 3px <code>--ink</code>, vuota (come un titolo non visto)','no'],
   ['Parziale','da 1 a N−1 visti tra quelli mostrati','contorno 3px <code>--ink</code> con trattino <code>--ink</code> (icona <code>minus</code> 16px, stroke 4); <code>aria-checked="mixed"</code>','no'],
   ['Tutta vista','tutti i titoli mostrati visti','fondo e contorno <code>--primary</code>, spunta <code>--on-primary</code>','sì'],
  ])+'<p class="dc-note">Al passaggio del mouse (solo <code>hover: hover</code> e <code>pointer: fine</code>) la casella vuota o parziale prende il contorno <code>--primary</code>, come i titoli (TitleItem.less r.220-224).</p>')
  +sec('Comportamento','',tbl(['Cosa','Regola'],[
   ['Clic sulla casella','non apre né chiude la fase: <code>stopPropagation</code> e <code>preventDefault</code> sul <code>&lt;summary&gt;</code>, che oggi si apre con <code>onClick</code> (PhaseSection.tsx r.47-51)'],
   ['Azione','nessuno o parziale → segna tutti i titoli mostrati; tutta vista → toglie la spunta a tutti. Stessa funzione di oggi: <code>onSetPhase(ids, !isAllWatched, phaseName)</code> → <code>setMany</code>'],
   ['Filtri attivi','agisce, e calcola lo stato, solo sui titoli mostrati'],
   ['Conferma','invariata: toast con “Annulla” (<code>planner.phase.markedToast</code> / <code>unmarkedToast</code>)'],
   ['Area di tocco','<code>--hit</code> come per i titoli; casella a sinistra del nome, chevron a destra: lontani, per non sbagliare tra “segna” e “apri” su mobile'],
   ['Etichetta accessibile','<code>planner.phase.markAll</code> se non tutta vista, <code>planner.phase.unmarkAll</code> se tutta vista: <b>nessuna chiave nuova</b>; il lettore di schermo annuncia anche il conteggio (<code>planner.phase.progress</code>)'],
   ['Tastiera','Spazio sulla casella spunta; Invio o Spazio sul resto del <code>&lt;summary&gt;</code> apre e chiude; focus con <code>outline: var(--focus)</code>'],
   ['Fase vuota','nessun titolo mostrato: la casella non compare (come la riga azione oggi, PhaseSection.tsx r.72)'],
  ]))
  +'<div class="dc-fl">Testi nelle 5 lingue (chiavi già nell\'app)</div>'+txt([(k,T(*[L(k,l) for l in LANGS])) for k in ('planner.phase.markAll','planner.phase.unmarkAll','planner.phase.progress')],name='{name}')
  +pd([['Segna tutta la fase','riga azione con pulsante testo (implementata, c520ab1)','casella tri-stato nel sommario','PhaseSection.tsx; PhaseSection.less'],['Stato parziale','non visibile','trattino, senza rosso','TitleItem.less r.199-229 (riuso)'],['Spazio','una riga in più per fase','nessuna riga extra','PhaseSection.less r.7-10 (da togliere)']],sub='Per ogni voce: com\'è su main c520ab1 (prima), proposta (dopo), file.')
  +'<p class="dc-note">Rischio noto: una casella piena accanto a “Fase 1” può sembrare solo un indicatore; si attenua con l\'etichetta accessibile e con il fatto che reagisce al hover come i titoli.</p>'),
)
