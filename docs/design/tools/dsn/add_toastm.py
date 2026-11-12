from addlib import *
import add_scorc as S0, add_toastpills as TP, add_mobile2 as M2
phone=S0.phone
CSS_T='''<style>
@media (max-width:39.9375em){
 body:has(.floating-progress[data-visible="true"]) .toasts{bottom:var(--toasts-bottom,max(16px,env(safe-area-inset-bottom)))}
 .floating-progress{width:min(440px,calc(100% - 1rem));margin-inline:auto;border-radius:var(--r-row);padding:var(--sp-3h) var(--sp-4) var(--sp-3)}
}
</style>'''
JS_T='<script>(function(){var b=document.querySelector(".floating-progress"),t=document.querySelector(".toasts");function f(){var r=b.getBoundingClientRect();t.style.setProperty("--toasts-bottom",(innerHeight-r.top+8)+"px")}f();addEventListener("load",f);addEventListener("resize",f);addEventListener("scroll",f,{passive:true});new ResizeObserver(f).observe(b);document.fonts&&document.fonts.ready.then(f);setTimeout(f,400)})()</script>'
def sc(theme,kind,n,label,pills=False):
    bar=S0.fpbar()
    body=S0.body(True,None); body=body[:-6]+bar+'</div>'
    toasts=TP.toasts(n)
    inner=S0.CSS+(CSS_T if kind!='before' else '')+f'<div class="site-shell"><main class="site-main" style="padding-top:0">{body}</main></div>'
    if kind=='before':
        inner+=toasts.replace('class="toasts"','class="toasts" style="bottom:calc(var(--floating-progress-height) + var(--floating-progress-gap) + max(16px, env(safe-area-inset-bottom)))"')
    else:
        inner+=toasts+JS_T
        if pills:
            inner+=M2.CSS_P.replace('bottom:var(--pills-bottom,calc(var(--floating-progress-clearance) + var(--sp-4)))','')+TP.CSSX+f'<div class="jump-pills">{M2.pill("locate-fixed",S0.LAST["it"])}{M2.pill("arrow-up",S0.TOP["it"],True)}</div>'+TP.JS.replace("var rest=innerHeight-parseFloat(getComputedStyle(p).bottom)","var rest=innerHeight-parseFloat(getComputedStyle(p).bottom)")
    return phone(inner,theme,640,390,label)
def grid(*c): return '<div class="dc-row" style="align-items:flex-start">'+''.join(c)+'</div>'
add('Planner',
 block('Barra di avanzamento su telefono: gli stessi bordi dei toast',PROP,
  'I bordi dei toast vanno bene; è la barra di avanzamento che non li segue. Misurati a 390px: il toast va da 16 a 374px (<code>min(440px, 100vw − 32px)</code>, raggio 22px), la barra da 8 a 382px (tutta la colonna, raggio 32px); sopra la barra ci sono 20px di vuoto (il toast sta a un’altezza fissa, calcolata su una barra di 5rem che non esiste). Decisione del 12 novembre: sotto i 40em la <b>barra prende larghezza, bordi e raggio dei toast</b>, e il toast le sta appoggiato sopra a <code>--sp-2</code>. I toast non cambiano.',
  grid(sc('dark','before',1,'Prima · 390px · scuro'),sc('dark','after',1,'Dopo · 390px · scuro'),sc('light','after',2,'Dopo · due toast e pillole · chiaro',True))
  +tbl(['Misura (390px)','Prima','Dopo','Perché'],[
   ['Larghezza e bordi della barra','tutta la colonna: 8 / 382px','<code>width: min(440px, calc(100% − 1rem)); margin-inline: auto</code>: 16 / 374px, la stessa larghezza del toast (<code>min(440px, 100vw − 32px)</code>) anche oltre i 472px','i due oggetti impilati hanno lo stesso rettangolo; la barra resta <code>sticky</code> nella colonna'],
   ['Raggio della barra','<code>@radius-block</code> 32px','<code>--r-row</code> 22px, come il toast','con i bordi allineati, due raggi diversi si leggono come un errore'],
   ['Rientro interno della barra','14px sopra, 20px ai lati, 16px sotto','<code>--sp-3h</code> sopra, <code>--sp-4</code> (16px) ai lati, <code>--sp-3</code> sotto','il toast ha 12px a sinistra più il tondo da 36px; 16px dà alla barra lo stesso respiro senza stringerla'],
   ['Distanza toast → barra','20px: posizione fissa <code>--floating-progress-height + --floating-progress-gap + 16px</code> (barra da 5rem)','<code>--sp-2</code> (8px) sopra la barra, misurata: <code>bottom = innerHeight − barra.top + --sp-2</code>','la barra vera è alta circa 62px; è la stessa misura delle pillole (proposta “Pillole su mobile”)'],
   ['Toast','<code>min(440px, 100vw − 32px)</code>, raggio <code>--r-row</code>, padding sinistro 12px','invariato','decisione di Diego'],
   ['Senza barra','<code>bottom: max(16px, env(safe-area-inset-bottom))</code>','invariato','la barra compare dopo la scheda dei progressi'],
   ['Più toast e pillole','pila con <code>gap: --sp-2</code>','invariato; le pillole salgono sopra la pila','ordine dal basso: barra, toast, pillole, ognuno a <code>--sp-2</code>'],
   ['Da 64em','la barra non c’è; i toast restano centrati, 440px','invariato','nessun bordo da allineare'],
  ])
  +pd([['Larghezza e raggio della barra su mobile','colonna intera, <code>@radius-block</code>','<code>min(440px, 100% − 1rem)</code> centrata, <code>--r-row</code>','FloatingProgress.less r.5-19'],['Rientro interno della barra','14 / 20 / 16px','<code>--sp-3h</code> / <code>--sp-4</code> / <code>--sp-3</code>','FloatingProgress.less r.12-18'],['Altezza del toast sopra la barra','calcolata su 5rem fissi','misurata dalla barra, <code>--sp-2</code> sopra','Toast.less r.6-8; BackToTop.tsx (misura condivisa)']],sub='Per ogni voce: com’è su main b7ddfe3 (prima), che cosa decide questa pagina (dopo), file.')))
