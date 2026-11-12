from parts import *
def tip(text,place='top',tone='neutral',panel=False):
    b=f'<div class="tooltip__bubble" role="tooltip" data-placement="{place}">{text}</div>'
    return f'<span class="tooltip tooltip--{tone}" style="flex-direction:column;align-items:flex-start;gap:var(--sp-3)">{b}</span>' if place=='top' else f'<span class="tooltip tooltip--{tone}" style="flex-direction:column-reverse;align-items:flex-start;gap:var(--sp-3)">{b}</span>'
def infotrig(tone='info',state=''):
    ic='triangle-alert' if tone=='warning' else 'info'
    return f'<button type="button" class="info-tip__trigger info-tip__trigger--{tone} {state}" aria-label="{L("details.watch.attribution")}">{icon(ic)}</button>'
w=L('prerequisites.warning'); a=L('details.watch.attribution')+' JustWatch.'
S=[]
S.append(h1('Tooltip','Un solo suggerimento a fumetto, <code>Tooltip</code>, e la sua scorciatoia con icona, <code>InfoTip</code>.'))
S.append(hdr('Tooltip e InfoTip: fumetto, toni, posizioni, attivazione, movimento',
 'src/components/ui/Tooltip/ (Tooltip.tsx, placement.ts, Tooltip.less), src/components/ui/InfoTip/; movimento in src/styles/motion.less; usi in features/planner (BeforeYouWatch, EasterEggs, KeyScenes, WhereToWatch)',
 'Icone Info e TriangleAlert (Lucide)'))
S.append(sec('Fumetto','Fondo <code>--ink</code>, testo <code>--bg</code> (inverso del tema); su pannello e nella zona spoiler fondo <code>--on-dark</code>. Il tono “warning” usa <code>--highlight</code> con testo <code>--ink-static</code> ed è più largo (20rem invece di 15rem). Freccia 10px ruotata di 45°.',
 both('520px',f'<div class="demo-tip" style="display:flex;flex-direction:column;gap:var(--sp-5)">{tip(L("details.easterEggs.source"))}{tip(w,"top","warning")}</div>','Neutro · warning')
 +frame('dark','520px',f'<div class="on-panel demo-tip" style="background:var(--panel);padding:var(--sp-4);border-radius:var(--r-md);display:flex;flex-direction:column;gap:var(--sp-5)">{tip(L("details.keyScenes.editorial"))}{tip(w,"top","warning")}</div>','Su pannello')))
S.append(sec('Posizioni','<code>placement</code> = top (predefinita), bottom, left, right; il codice (<code>placement.ts</code>) la inverte se manca spazio e sposta la freccia con <code>--tip-arrow</code>.',
 both('520px',f'<div class="demo-tip" style="display:flex;gap:var(--sp-6);padding-top:var(--sp-3)">{tip(L("details.easterEggs.source"),"top")}{tip(L("details.easterEggs.source"),"bottom")}</div>','Sopra · sotto')))
S.append(sec('InfoTip','Il trigger è un pulsante tondo da <code>--hit</code> (44px) con icona da 20px, tratto 2,2. Colore <code>--ink-2</code> (su pannello <code>--muted-on-dark</code>); warning <code>--highlight</code>. Testo del codice (WhereToWatch): <code>details.watch.attribution</code> + “JustWatch.”',
 both('520px',f'<div class="demo-tip" style="display:flex;gap:var(--sp-5);align-items:center">{infotrig()}{infotrig("info","is-focus")}{infotrig("warning")}</div>','Info · info con focus · warning')
 +both('520px',f'<div class="demo-tip" style="display:flex;flex-direction:column;gap:var(--sp-2)">{tip(a)}{infotrig()}</div>','Aperto')))
S.append(sec('Quando si apre','',ul(['Mouse: dopo <code>--delay-tooltip</code> (400ms; 0 con movimento ridotto) al passaggio; chiude dopo 100ms (<code>HOVER_CLOSE_DELAY_MS</code>), o subito se il puntatore entra nel fumetto.',
 'Tastiera: subito al focus, chiude al blur; Esc chiude. Tocco: apre solo se <code>opensOnTap</code> (InfoTip e KeyScenes); un tocco fuori lo chiude.',
 'Il fumetto è un <code>popover="manual"</code> a <code>position: fixed</code>: sta sopra a tutto e non viene tagliato dagli overflow.'])))
S.append(sec('Valori nel codice: Tooltip.less','',spec('components/ui/Tooltip/Tooltip.less')))
S.append(sec('Valori nel codice: InfoTip.less','',spec('components/ui/InfoTip/InfoTip.less')))
S.append(sec('Movimento','Entrata 120ms (<code>--dur-hover</code>), uscita 80ms (<code>--dur-press</code>), scarto di 4px verso la direzione di apertura (−4px se sotto).',spec('styles/motion.less',r'tooltip')))
S.append(sec('Testi nelle 5 lingue','',tbl(['Lingua','prerequisites.warning','details.easterEggs.source','details.keyScenes.editorial','details.watch.attribution'],[[l]+[L(k,l) for k in ('prerequisites.warning','details.easterEggs.source','details.keyScenes.editorial','details.watch.attribution')] for l in LANGS])))
S.append(prima_dopo([
 ['Tooltip','valori e posizioni dichiarati a mano','larghezza 15rem (20rem warning), padding <code>--sp-2h</code> <code>--sp-3h</code>, raggio <code>--r-xs</code>','Tooltip.less'],
 ['Ritardo di apertura','non verificato','<code>--delay-tooltip</code> 400ms','tokens.less, Tooltip.tsx'],
 ['InfoTip','pagina a parte','assorbito qui','InfoTip.less'],
]))
write('Tooltip.dc.html','Tooltip','\n'.join(S))
