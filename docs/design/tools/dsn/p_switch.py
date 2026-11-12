from parts import *
def sw(label,checked=False,state=''):
    c=' checked="checked"' if checked else ''
    f=' is-focus' if state=='focus' else ''
    return (f'<div class="switch"><span>{label}</span><label class="switch__control"><input class="switch__input{f}" type="checkbox" role="switch"{c} aria-label="{label}"/>'
            f'<span class="switch__track" aria-hidden="true"></span></label></div>')
_g=[0]
def ch(label,typ='radio',checked=False,state='',name='x'):
    c=' checked="checked"' if checked else ''
    f=' is-focus' if state=='focus' else ''
    ck=icon('check',16,3.4) if (typ=='checkbox' and checked) else ''
    return f'<label class="choice"><input class="choice__input{f}" type="{typ}"{c}/><span class="choice__face">{ck}{label}</span></label>'
def grp(legend,cols,items): return f'<fieldset class="choice-group"><legend>{legend}</legend><div class="choice-group__options choice-group__options--{cols}">{items}</div></fieldset>'
def status(msg,success=False):
    if success: return f'<p role="status" class="status status--success"><span class="status__inner"><span class="status__mark" aria-hidden="true">{icon("check")}</span><span class="status__text">{msg}</span></span></p>'
    return f'<p role="status">{msg}</p>'
S=[]
S.append(h1('Switch e ChoiceGroup','Tre controlli di scelta: <code>Switch</code> (attivo/non attivo), <code>ChoiceGroup</code> con <code>Choice</code> radio (una sola opzione) e checkbox (più opzioni).'))
S.append(hdr('Switch, ChoiceGroup e Choice: anatomia, stati, uso reale nei filtri del planner e nel selettore del tema',
 'src/components/ui/Switch/, src/components/ui/ChoiceGroup/; movimento in src/styles/motion.less; usi in src/features/planner/components/FiltersFields/ e src/features/theme/ThemeChoice/',
 'Icona Check (Lucide); Status (messaggio di esito) per il confronto'))
S.append(sec('Switch','Solo l\'interruttore è cliccabile, il testo no (<code>Switch.tsx</code>): area tocco 44px con padding e margine negativo uguali, così la riga non cambia altezza. Testi veri: <code>planner.filters.showAlternate</code> e <code>planner.filters.showUpcoming</code>.',
 both('460px',f'<div style="display:flex;flex-direction:column;gap:var(--sp-2)">{sw(L("planner.filters.showAlternate"))}{sw(L("planner.filters.showUpcoming"),True)}{sw(L("planner.filters.showUpcoming"),True,"focus")}</div>','Spento · acceso · acceso con focus tastiera')))
S.append(sec('ChoiceGroup: radio a 2 colonne','Ordine di visione (<code>planner.order.*</code>). Una sola opzione attiva; la selezionata è piena <code>--ink</code>.',
 both('460px',grp(L('planner.order.heading'),2,ch(L('planner.order.release'),'radio',True,name='o1')+ch(L('planner.order.chronological'),'radio',False,name='o1')),'Selezionato · non selezionato')))
S.append(sec('ChoiceGroup: checkbox a 3 colonne','Tipo di titolo (<code>planner.filters.*</code>). La checkbox selezionata mostra la spunta da 16px, tratto 3,4.',
 both('460px',grp(L('planner.filters.type'),3,ch(L('planner.filters.film'),'checkbox',True)+ch(L('planner.filters.serie'),'checkbox',False)+ch(L('planner.filters.special'),'checkbox',True,'focus')),'Selezionato · non selezionato · focus tastiera')))
S.append(sec('Su pannello scuro','Dentro <code>.on-panel</code> (menu, scheda filtri): fondo <code>--panel-2</code>, selezionata oro <code>--highlight</code> e focus oro.',
 frame('dark','460px',f'<div class="on-panel" style="background:var(--panel);padding:var(--sp-4);border-radius:var(--r-md);display:flex;flex-direction:column;gap:var(--sp-4)">{grp(L("theme.label"),3,ch(L("theme.system"),"radio",False,name="t")+ch(L("theme.light"),"radio",True,name="t")+ch(L("theme.dark"),"radio",False,"focus",name="t"))}{sw(L("planner.filters.showAlternate"),True)}</div>','Selettore tema (ThemeChoice) + switch')))
S.append(sec('Testi del tema nelle 5 lingue','Chiavi <code>theme.label</code>, <code>theme.system</code>, <code>theme.light</code>, <code>theme.dark</code>.',
 tbl(['Lingua','label','system','light','dark'],[[l]+[L('theme.'+k,l) for k in ('label','system','light','dark')] for l in LANGS])))
S.append(sec('Testi dei filtri nelle 5 lingue','',tbl(['Lingua','Ordine','Per uscita','Cronologico','Tipo','Mostra alternativa','Mostra non usciti'],
 [[l]+[L(k,l) for k in ('planner.order.heading','planner.order.release','planner.order.chronological','planner.filters.type','planner.filters.showAlternate','planner.filters.showUpcoming')] for l in LANGS])))
S.append(sec('Valori nel codice: Switch.less','',spec('components/ui/Switch/Switch.less')))
S.append(sec('Valori nel codice: ChoiceGroup.less','',spec('components/ui/ChoiceGroup/ChoiceGroup.less')))
S.append(sec('Valori nel codice: movimento','Da <code>motion.less</code>: colore del volto 180ms (<code>--dur-ui</code>), traccia e manopola 180ms; la manopola trasla di 20px.',spec('styles/motion.less',r'choice|switch')))
S.append(sec('Regole','',ul(['Radio per scelte esclusive (ordine), checkbox per scelte multiple (tipo), switch per un singolo on/off immediato (visibilità).',
 'Il focus tastiera è l\'anello a filo <code>--focus</code> con offset <code>--focus-offset</code>: ink in chiaro, oro in scuro e su pannello.',
 'Il testo dello Switch non è una label: va letto dal lettore di schermo tramite <code>aria-labelledby</code>.'])))
S.append(prima_dopo([
 ['Switch','pagina separata dal resto','una sola pagina con ChoiceGroup: stessi stati e stessi token','Switch.less, ChoiceGroup.less'],
 ['Selezionata su pannello','non verificato','oro <code>--highlight</code>, testo <code>--ink-static</code>, peso 800','ChoiceGroup.less (.on-panel)'],
 ['Track','valori scritti a mano','48×28, manopola 20, raggio <code>--r-xs</code>, acceso <code>--accent</code>','Switch.less'],
]))
write('Switch e ChoiceGroup.dc.html','Switch e ChoiceGroup','\n'.join(S))
