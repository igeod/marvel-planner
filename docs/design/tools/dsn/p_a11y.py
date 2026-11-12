from parts import *
import tokparse as TP
def tv(t,th):
    v=TP.val(t,th); return f'<code>{v[0]}</code> <span class="ln">r.{v[1]}</span>'
S=[]
S.append(h1('Accessibility','Focus, area di tocco, movimento ridotto, annunci e pannelli: come il codice li garantisce.'))
S.append(hdr('Anello di focus, aree di tocco, movimento ridotto, ruoli e live region, skip link, pannelli modali',
 'src/styles/tokens.less e base.less (focus, alert), src/components/layout/SkipLink/, componenti ui/ per ruoli e aria',
 'Tutti i componenti; i rapporti di contrasto sono nella pagina Colors'))
S.append(sec('Anello di focus','Un solo anello “a filo”: spessore e distanza uguali ovunque, colore diverso per tema. Mai rosso.',
 tbl(['Token','Chiaro','Scuro'],[
  ['<code>--focus-color</code>',tv('--focus-color','light'),tv('--focus-color','dark')],
  ['<code>--focus-on-inverse</code>',tv('--focus-on-inverse','light'),tv('--focus-on-inverse','dark')],
  ['<code>--focus</code>',tv('--focus','light'),'invariato'],
  ['<code>--focus-offset</code>',tv('--focus-offset','light'),'invariato']])
 +spec('styles/base.less',r'focus-visible')))
S.append(sec('Aree di tocco','',tbl(['Token','Valore'],[[f'<code>{t}</code>',tv(t,'light')] for t in ('--tap','--hit','--row-h')])+'<p class="dc-note">Misure per componente: nelle pagine Buttons, Switch e ChoiceGroup, Navigation.</p>'))
S.append(sec('Movimento ridotto','Con <code>prefers-reduced-motion: reduce</code> restano colore e opacità a 80 ms al massimo; trasformazioni, altezze e keyframe stanno nei blocchi <code>no-preference</code>. Valori nella pagina Motion.',''))
S.append(sec('Ruoli e annunci','',tbl(['Dove','Ruolo / attributo','File'],[
 ['Messaggio di campo (errore)','<code>role="alert"</code>','Field.tsx r.60'],
 ['Messaggio di campo (aiuto)','<code>role="status"</code>','Field.tsx r.67'],
 ['Stack dei toast','<code>aria-live="polite"</code>','ToastProvider.tsx r.123'],
 ['Tooltip','<code>role="tooltip"</code>','Tooltip.tsx r.127'],
 ['Popup','<code>aria-modal="true"</code>','Modal.tsx r.50'],
 ['Spoiler nascosto','<code>inert</code> finché è nascosto','SpoilerBox.tsx r.73'],
 ['Errori di caricamento e form','<code>role="alert"</code>','LoadError.tsx r.33, r.48; FormError.tsx r.15, r.25'],
 ['Requisiti password','<code>role="status"</code>','PasswordRequirement.tsx r.17'],
 ['Stato di caricamento','<code>role="status"</code>','Status.tsx r.22'],
])))
S.append(sec('Testo degli alert','',spec('styles/base.less',r'role="alert"')))
S.append(sec('Skip link','',spec('components/layout/SkipLink/SkipLink.less')+'<p class="dc-note">Testo: chiave <code>nav.skipToContent</code>; target <code>MAIN_CONTENT_ID</code> (SkipLink.tsx r.9).</p>'))
S.append(sec('Testi nelle 5 lingue','',tbl(['Lingua','nav.skipToContent'],[[l,L('nav.skipToContent',l)] for l in LANGS])))
S.append(sec('Contrasto','Tabella dei rapporti WCAG nella pagina Colors: non è ripetuta qui.',''))
S.append(prima_dopo([
 ['Focus','pagina con valori scritti a mano','token letti da tokens.less','tokens.less r.23-24, r.66, r.82, r.170-171'],
 ['Contrasti','tabella duplicata','solo in Colors','tokens.less'],
 ['Ruoli','elenco generico','ruoli con file e riga dal codice','componenti ui/'],
]))
write('Accessibility.dc.html','Accessibility','\n'.join(S))
