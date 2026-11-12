from parts import *
import tokparse as TP, subprocess, os
SRC='@REPO@/src'
def uses(tok):
    out=subprocess.run(['grep','-rlF',f'var({tok})','--include=*.less',SRC],capture_output=True,text=True).stdout.split()
    return sorted(set(os.path.basename(p).replace('.less','') for p in out))
def usestr(t):
    u=uses(t); 
    return ', '.join(u[:5])+(f' … (+{len(u)-5})' if len(u)>5 else '') if u else '<i>non usato nei .less</i>'
def tv(t):
    v=TP.val(t,'light'); return f'<code>{v[0]}</code> <span class="ln">r.{v[1]}</span>'
SP=['--sp-1','--sp-1h','--sp-2','--sp-2h','--sp-3','--sp-3h','--sp-4','--sp-5','--sp-6','--sp-8','--sp-10','--sp-14']
R=['--r-hair','--r-tiny','--r-chip','--r-xs','--r-input','--r-sm','--r-row','--r-md','--r-lg','--r-xl','--r-pill']
M=['--gap','--page-margin','--content-max','--pad-popup','--pad-hero','--pad-card','--row-h','--header-h','--tap','--hit','--bar-h','--sb-size']
S=[]
S.append(h1('Spacing e layout','Scala di spaziatura, raggi, misure fisse e griglia della pagina.'))
S.append(hdr('Token di spaziatura e raggi con dove si usano, misure fisse, breakpoint, margini di pagina, contenitore',
 'src/styles/tokens.less, src/styles/variables.less (breakpoint), src/styles/mixins.less (.tablet / .desktop), src/styles/base.less, src/components/layout/',
 'Tutti i componenti e le schermate'))
bars=lambda t:f'<span style="display:block;height:var(--sp-3);width:var({t});background:var(--primary);border-radius:var(--r-hair)"></span>'
S.append(sec('Scala di spaziatura','',f'<div class="dc-scroll">{tbl(["Token","Valore","Barra","Usato da"],[[f"<code>{t}</code>",tv(t),bars(t),usestr(t)] for t in SP])}</div>'))
box=lambda t:f'<span style="display:block;width:var(--sp-14);height:var(--sp-10);background:var(--row);border:1px solid var(--line);border-radius:var({t})"></span>'
S.append(sec('Raggi','',f'<div class="dc-scroll">{tbl(["Token","Valore","Anteprima","Usato da"],[[f"<code>{t}</code>",tv(t),box(t),usestr(t)] for t in R])}</div>'))
S.append(sec('Misure fisse e margini','Le misure con unità fissa (<code>--hit</code>, <code>--bar-h</code>, <code>--tap</code>…) sono token: qui è l\'unico posto dove i loro valori sono scritti.',
 f'<div class="dc-scroll">{tbl(["Token","Valore","Usato da"],[[f"<code>{t}</code>",tv(t),usestr(t)] for t in M])}</div>'))
S.append(sec('Breakpoint','Due soglie, in <code>variables.less</code>; i mixin <code>.tablet()</code> e <code>.desktop()</code> aprono un <code>@media (min-width)</code>. I margini di pagina cambiano con <code>max-width</code> in tokens.less.',
 tbl(['Nome','Valore','Effetto','Fonte'],[
  ['<code>@tablet</code>','<code>48em</code>','mixin <code>.tablet()</code> (mobile first)','variables.less r.1'],
  ['<code>@desktop</code>','<code>64em</code>','mixin <code>.desktop()</code>; <code>--floating-progress-clearance</code> torna a 0','variables.less r.2, tokens.less r.212'],
  ['sotto 64em (<code>63.9375em</code>)','<code>--page-margin: 2rem</code>','','tokens.less r.216-220'],
  ['sotto 40em (<code>39.9375em</code>)','<code>--page-margin: 1rem</code>','','tokens.less r.222-226'],
 ])+NOVERIF.join(['','']) if False else tbl(['Nome','Valore','Effetto','Fonte'],[
  ['<code>@tablet</code>','<code>48em</code>','mixin <code>.tablet()</code> (mobile first)','variables.less r.1'],
  ['<code>@desktop</code>','<code>64em</code>','mixin <code>.desktop()</code>; <code>--floating-progress-clearance</code> torna a 0','variables.less r.2, tokens.less r.212'],
  ['sotto 64em','<code>--page-margin: 2rem</code>','vale anche per i layout tablet','tokens.less r.216-220'],
  ['sotto 40em','<code>--page-margin: 1rem</code>','','tokens.less r.222-226'],
 ])))
S.append(sec('Struttura della pagina','Guscio, header, contenuto e footer.',
 spec('styles/base.less',r'site-shell|site-main|\.card|\.section-title|\.muted')+spec('components/layout/AppHeader/AppHeader.less',r'site-header__bar|^\.site-header$')))
S.append(prima_dopo([
 ['Spacing','scala scritta a mano nella pagina','token letti da tokens.less con i componenti che li usano','tokens.less'],
 ['Layout grid','pagina separata','assorbita: breakpoint, margini, contenitore, guscio','variables.less, base.less'],
 ['Misure fisse','sparse nelle pagine delle schermate','solo qui (token)','tokens.less'],
]))
write('Spacing e layout.dc.html','Spacing e layout','\n'.join(S))
