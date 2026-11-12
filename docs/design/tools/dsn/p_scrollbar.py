from parts import *
rows=''.join(f'<li style="padding:var(--sp-2) var(--sp-3)">{L("catalog.phases."+str(i%6+1))} · {i+1}</li>' for i in range(14))
S=[]
S.append(h1('Scrollbar','Barra di scorrimento a pillola, solo con mouse; su touch resta quella del sistema.'))
S.append(hdr('Scrollbar globale: dimensioni, colori, quando si applica',
 'src/styles/base.less (righe 9-55) e token <code>--sb-*</code> in src/styles/tokens.less; classe <code>.scroll-y</code> in base.less',
 'Nessun componente: vale per ogni elemento scorrevole'))
S.append(sec('Esempio','Elenco scorrevole con la classe <code>.scroll-y</code> (<code>overflow-y: auto</code>, <code>overscroll-behavior: contain</code>, <code>scrollbar-gutter: stable</code>). Il pollice cambia con hover. L\'anteprima di questo canvas è senza mouse fine: la barra a pillola si vede solo in un browser con mouse o trackpad.',
 both('360px',f'<ul class="scroll-y" style="height:12rem;border-radius:var(--r-input);background:var(--surface)">{rows}</ul>','')))
S.append(sec('Quando si applica','',ul(['Solo con <code>(hover: hover) and (pointer: fine)</code>: mouse o trackpad.','Firefox: proprietà standard <code>scrollbar-width: thin</code> e <code>scrollbar-color</code>. Chromium e Safari: <code>::-webkit-scrollbar</code>, senza le proprietà standard (altrimenti torna la barra di sistema con le frecce).','Pulsanti con le frecce: nascosti.'])))
S.append(sec('Valori nel codice: base.less','',spec('styles/base.less',r'^\*$|webkit')))
S.append(sec('Token','',tbl(['Token','Chiaro','Scuro','Fonte'],[['<code>--sb-thumb</code>','rgba(20, 23, 31, 0.5)','rgba(242, 244, 248, 0.5)','tokens.less r.45 / r.87'],['<code>--sb-thumb-hover</code>','rgba(20, 23, 31, 0.7)','rgba(242, 244, 248, 0.75)','tokens.less r.46 / r.88'],['<code>--sb-track</code>','transparent','transparent','tokens.less r.47 / r.89'],['<code>--sb-size</code>','12px (tema indifferente)','12px','tokens.less r.122']])))
S.append(prima_dopo([
 ['Valori','colori scritti nella pagina','solo token <code>--sb-*</code>','tokens.less, base.less'],
 ['Pollice','non verificato','bordo trasparente 3px con <code>background-clip: content-box</code>, raggio <code>--r-pill</code>','base.less r.32-42'],
]))
write('Scrollbar.dc.html','Scrollbar','\n'.join(S))
