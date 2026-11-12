from lib2 import *
VAR=[('primary','Primario','Azione principale. Rosso in chiaro, oro in scuro.'),('accent','Accento','Oro in entrambi i temi.'),('ink','Ink','Fondo ink, testo --bg.'),('dark','Dark','Scuro in entrambi i temi: sta sopra l\'adesivo oro.'),('danger','Pericolo','Rosso in entrambi i temi: conferma distruttiva.'),('surface','Surface','Secondario su sfondo --bg.'),('soft','Soft','Secondario nei dialog.'),('panel','Panel','Su superfici scure.'),('text','Testo','Solo testo, sottolineato.')]
def b(v,label,size='',state='',extra='',ic=None,attrs=''):
    cls=f'btn btn--{v}'+(f' btn--{size}' if size else '')+(f' {state}' if state else '')+(f' {extra}' if extra else '')
    i=icon(ic) if ic else ''
    return f'<button type="button" class="{cls}" {attrs}>{i}{label}</button>'
def loading(v,label,size=''):
    cls=f'btn btn--{v}'+(f' btn--{size}' if size else '')
    return (f'<button type="button" class="{cls}" aria-busy="true" aria-disabled="true"><span class="btn__stack"><span class="btn__content btn__content--hidden">{label}</span>'
            f'<span class="btn__content">{icon("loader-circle",cls="btn__spinner")}{label}</span></span></button>')
STATES=[('Normale',''),('Hover','is-hover'),('Premuto','is-active'),('Focus tastiera','is-focus')]
def matrix(ctx_attr='',ctx_cls='',bg='var(--surface)'):
    rows=''
    for v,name,use in VAR:
        cells=''
        for lab,st in STATES:
            cells+=f'<td>{b(v,"Etichetta","",st)}</td>'
        cells+=f'<td>{b(v,"Etichetta","","",attrs="disabled=\"disabled\"")}</td><td>{loading(v,"Etichetta")}</td>'
        rows+=f'<tr><td><b>{name}</b><br><code>btn--{v}</code></td>{cells}</tr>'
    head=''.join(f'<th>{h}</th>' for h in ['Variante']+[s[0] for s in STATES]+['Disabilitato','In corso'])
    return f'<div class="dc-scroll"><table class="dc-tbl"><thead><tr>{head}</tr></thead><tbody>{rows}</tbody></table></div>'
def ctxbox(theme,inner,cls='',bg='var(--surface)'):
    return f'<div data-theme="{theme}" class="dc-fr {cls}" style="background:{bg};padding:var(--sp-4)">{inner}</div>'

S=[]
S.append(h1('Buttons','Un solo componente <code>Button</code> con nove varianti, tre misure e gli stati: normale, hover, premuto, focus, disabilitato, in corso. Questa pagina assorbe le parti sui pulsanti di Revisione codice, Accesso animazioni e Decisioni.'))
S.append(hdr('i pulsanti pill del planner, le loro varianti, misure e stati (hover, premuto, focus, disabilitato, caricamento) e il movimento che li accompagna',
  'src/components/ui/Button/ (Button.tsx, Button.less, buttonClass.ts); movimento in src/styles/motion.less; mixin in src/styles/mixins.less',
  'nessun altro componente. Icone Lucide (vedi Icone e immagini)'))
# matrix light + dark + panel
S.append(sec('Matrice degli stati, tema chiaro','Ogni cella è il pulsante vero con la classe di stato forzata (<code>is-hover</code>, <code>is-active</code>, <code>is-focus</code> esistono solo nel canvas, per mostrare la pseudo-classe in una pagina statica).',
   ctxbox('light',matrix())))
S.append(sec('Matrice degli stati, tema scuro','',ctxbox('dark',matrix())))
panel=ctxbox('dark','<div class="on-panel" style="display:flex;flex-wrap:wrap;gap:var(--sp-3);background:var(--panel);padding:var(--sp-4);border-radius:var(--r-md)">'+''.join(b(v,n,'', 'is-focus') for v,n,_ in VAR)+'</div>',bg='var(--bg)')
S.append(sec('Su superfici scure: anello oro','Dentro <code>.on-panel</code> e <code>.title-row--open</code> la variabile <code>--btn-ring</code> diventa <code>--highlight</code> e i pulsanti primari usano <code>--primary-hover-on-panel</code>. Qui sono tutti con il focus forzato.',panel))
# sizes
sizes=''.join(cell(l,b('primary',t,s)) for l,t,s in [('sm','Piccolo','sm'),('md (default)','Medio',''),('lg','Grande','lg')])
sizes+=cell('icona sola',f'<button type="button" class="btn btn--soft btn--icon" aria-label="{L("common.close")}">{icon("x")}</button>')
sizes+=cell('con icona',b('primary',L('common.retry'),'','',ic='rotate-ccw'))
S.append(sec('Misure e icona','Le misure sono nel .less (tabella sotto): <code>sm</code>, predefinita, <code>lg</code>, e <code>btn--icon</code> quando non c\'è testo.',row(frame('light','auto','<div style="display:flex;gap:var(--sp-4);flex-wrap:wrap;align-items:flex-start">'+sizes+'</div>','Misure'))))
# loading
S.append(sec('Caricamento','Il pulsante in corso (<code>aria-busy="true"</code> con <code>aria-disabled</code>) mantiene colore e larghezza: mostra l\'etichetta normale per <code>--delay-pending</code>, poi lo spinner. Il tasto è ignorato. In questa pagina gira dal vivo.',
   row(frame('light','auto','<div style="display:flex;gap:var(--sp-3);flex-wrap:wrap">'+loading('primary',L('common.loading'))+loading('soft',L('common.loading'),'lg')+'</div>','Chiaro'),frame('dark','auto','<div style="display:flex;gap:var(--sp-3);flex-wrap:wrap">'+loading('primary',L('common.loading'))+loading('soft',L('common.loading'),'lg')+'</div>','Scuro'))
   +ul(['<b>Spinner:</b> <code>btn-spin</code> ruota in <b>0,8 s</b> con <code>prefers-reduced-motion: no-preference</code>. Con movimento ridotto gira a <b>1,6 s</b>, metà velocità: il codice lo dichiara voluto (“the spinner is a status, so it turns under reduced motion too, at half the speed”).',
        'Disabilitato: fondo <code>--disabled</code> e testo <code>--on-disabled</code> piatti, mai opacità; il pulsante testuale resta trasparente.'])))
# live
S.append(sec('Dal vivo','Pulsanti veri: passa il mouse, tieni premuto, naviga con Tab.',row(frame('light','auto','<div style="display:flex;gap:var(--sp-3);flex-wrap:wrap">'+b('primary',L('common.retry'),'lg','',ic='rotate-ccw')+b('soft',L('common.cancel'),'lg')+b('text',L('common.close'))+'</div>','Chiaro'),frame('dark','auto','<div style="display:flex;gap:var(--sp-3);flex-wrap:wrap">'+b('primary',L('common.retry'),'lg','',ic='rotate-ccw')+b('soft',L('common.cancel'),'lg')+b('text',L('common.close'))+'</div>','Scuro'))))
# texts
rows=[[l]+[L(k,l) for k in ['common.retry','common.cancel','common.close','common.loading']] for l in LANGS]
S.append(sec('Testi comuni nelle cinque lingue','Chiavi <code>common.retry</code>, <code>common.cancel</code>, <code>common.close</code>, <code>common.loading</code> in <code>src/i18n/locales/</code>.',tbl(['Lingua','Riprova','Annulla','Chiudi','Caricamento'],rows)))
# spec tables
S.append(sec('Valori nel codice: Button.less','Questa tabella è la definizione. Le demo qui sopra usano lo stesso CSS compilato.',spec('components/ui/Button/Button.less')))
S.append(sec('Valori nel codice: movimento dei pulsanti','Da <code>motion.less</code>: solo le regole che nominano <code>.btn</code>.',spec('styles/motion.less',r'\.btn')))
S.append(sec('Mixin usati dai pulsanti','<code>.tones(hover, premuto)</code> imposta lo sfondo in hover (solo con puntatore fine) e da premuto.',spec('styles/mixins.less',r'tones|on-hover|pill|touch-target')))
S.append(ul(['<b>Hover</b> solo con <code>(hover: hover) and (pointer: fine)</code>, mai su tocco.',
  '<b>Premuto</b> (con movimento normale): <code>translateY(1px) scale(0.98)</code>, l\'icona sola <code>scale(0.96)</code>, il testuale non si muove ma sfuma.',
  '<b>Focus</b>: solo <code>:focus-visible</code>, istantaneo, 3px, distanza <code>--focus-offset</code>; il colore è per variante (<code>--btn-ring</code>).',
  'Con movimento ridotto restano solo le variazioni di colore, al massimo 80 ms (token <code>--dur-*</code> in Motion).']) )
S.append(prima_dopo([
 ['Disabilitato','opacità .45','fondo <code>--disabled</code>, testo <code>--on-disabled</code>, opacità 1','Button.less r.37-43'],
 ['Spinner','1,6 s nella demo, 0,8 s nella tabella','0,8 s (movimento normale), 1,6 s (movimento ridotto)','Button.less r.61-69'],
 ['Altezze','da 44 a 56 px','sm 2,75rem, medio 3rem, lg 3,25rem; icona larga 48px','Button.less r.15, 91, 96, 101'],
 ['Focus','rosso in chiaro, oro in scuro, distanza 2-3px','<code>--btn-ring</code> per variante (default <code>--focus-color</code>: ink in chiaro, oro in scuro); distanza <code>--focus-offset</code>','Button.less r.10, 30-33, 55-58'],
 ['Pericolo','<code>--danger</code> su <code>--on-danger</code>','<code>--accent</code> su <code>--white</code>, rosso in entrambi i temi','Button.less r.140-144'],
 ['Pulsante secondario','“Secondary (light surface)” con altezze 44-56','<code>btn--surface</code> e <code>btn--soft</code>, stessa altezza del medio','Button.less r.146-158'],
 ['Ink','testo <code>--surface</code>','testo <code>--bg</code>','Button.less r.132-137'],
]))
write('Buttons.dc.html','Buttons','\n'.join(S))
