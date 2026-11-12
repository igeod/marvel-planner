from addlib import *
import add_scorc as S0
phone=S0.phone
CSSX='''<style>
/* proposta: le pillole salgono sopra i toast (override della regola che oggi le nasconde) */
body:has(.toasts .toast) .jump-pills{display:flex}
.jump-pills{translate:0 calc(var(--toasts-lift,0px) * -1);width:max-content;max-width:calc(100vw - 32px)}
@media (prefers-reduced-motion: no-preference){
 .jump-pills{transition:translate var(--dur-ui) var(--ease-out)}
 .jump-pills[data-lifted]{transition-duration:var(--dur-enter)}
}
</style>'''
def pill(ic,t): return f'<button type="button" class="btn btn--panel btn--sm jump-pills__pill">{icon(ic)}{esc(t)}</button>'
def pillsx(bar): return f'<div class="jump-pills{" jump-pills--above-bar" if bar else ""}">{pill("locate-fixed",S0.LAST["it"])}{pill("arrow-up",S0.TOP["it"])}</div>'
def toasts(n):
    items=[(L('planner.list.added'),L('common.undo')),(L('planner.list.removed'),L('common.undo')),(L('planner.list.savedOnDevice'),L('nav.login'))][:n]
    return '<div class="toasts" aria-live="polite">'+''.join(toast_el('info',t,'',a) for t,a in items)+'</div>'
JS='''<script>
(function(){var t=document.querySelector('.toasts'),p=document.querySelector('.jump-pills');
function lift(){var rest=innerHeight-parseFloat(getComputedStyle(p).bottom);var tr=t.querySelector('.toast')?t.getBoundingClientRect().top:Infinity;
var l=Math.max(0,rest-(tr-8));document.documentElement.style.setProperty('--toasts-lift',l+'px');if(l>0)p.setAttribute('data-lifted','');else p.removeAttribute('data-lifted')}
new ResizeObserver(lift).observe(t);new MutationObserver(lift).observe(t,{childList:true});addEventListener('resize',lift);lift();
var n=0,tpl=t.innerHTML,first=t.firstElementChild?t.firstElementChild.outerHTML:'';
var a=document.getElementById('ta'),r=document.getElementById('tr');
if(a)a.onclick=function(){t.insertAdjacentHTML('beforeend',first||tpl)};
if(r)r.onclick=function(){var x=t.firstElementChild;if(x)x.remove()};
})();
</script>'''
def body_bar(bar):
    b=S0.body(True,None)
    return (b[:-6]+S0.fpbar()+'</div>') if bar else b
def scene(theme,n,bar,label,live=False,h=600):
    btns='<div style="position:fixed;top:var(--sp-3);left:var(--sp-3);display:flex;gap:var(--sp-2);z-index:30"><button type="button" class="btn btn--soft btn--sm" id="ta">Aggiungi toast</button><button type="button" class="btn btn--soft btn--sm" id="tr">Chiudi un toast</button></div>' if live else ''
    inner=S0.CSS+CSSX+f'<div class="site-shell"><main class="site-main" style="padding-top:{"var(--sp-12,3.5rem)" if live else "0"}">{body_bar(bar)}</main></div>'+pillsx(bar)+toasts(n)+btns+JS
    return phone(inner,theme,h,390,label)
def grid(*c): return '<div class="dc-row" style="align-items:flex-start">'+''.join(c)+'</div>'
add('Planner',
 block('Pillole flottanti sopra i toast',PROP,
  'Oggi, quando compare un toast, “Ultimo visto” e “Torna su” si nascondono (<code>body:has(.toasts .toast) .jump-pills { display: none }</code>, BackToTop.less r.6-26): per qualche secondo, dopo un segno di spunta, si perde proprio la scorciatoia che serve. Decisione del 12 novembre: restano e <b>salgono sopra i toast</b>, con un movimento che segue la comparsa e la scomparsa del toast. Provalo con i pulsanti nella prima scheda.',
  grid(scene('dark',1,False,'Prova viva · un toast (i pulsanti aggiungono e chiudono)',True,620),scene('light',2,False,'Due toast · chiaro',False,620),scene('dark',1,True,'Con la barra di avanzamento · scuro',False,620))
  +tbl(['Aspetto','Regola','Note'],[
   ['Quando','le pillole restano sempre dove sono per regola loro (“Torna su” dopo 1,5 schermate, “Ultimo visto” se la riga non è in vista); il toast non le nasconde più','si toglie la regola <code>body:has(.toasts .toast) .jump-pills</code>'],
   ['Dove','le pillole salgono sopra la pila dei toast, con <code>--sp-2</code> di spazio; non si sovrappongono mai ai toast (che hanno <code>z-index: 20</code> contro 10)','i toast restano dove sono (<code>Toast.less</code> r.3-23), sopra la barra di avanzamento quando c’è'],
   ['Quanto salgono','il minimo che serve: <code>lift = max(0, fondoDellePillole − (cimaDeiToast − --sp-2))</code>, misurato con <code>getBoundingClientRect</code> come già fa <code>BackToTop</code> per la barra (BackToTop.tsx r.21-25)','con più toast la pila è più alta e le pillole salgono di più; con la barra di avanzamento il toast è già alto e le pillole salgono solo di poco'],
   ['Quando si ricalcola','a ogni toast che entra o esce (<code>ResizeObserver</code> e <code>MutationObserver</code> su <code>.toasts</code>) e al resize','nessun polling'],
   ['Come si sposta','la proprietà <code>translate</code> del contenitore <code>.jump-pills</code> (<code>0 calc(var(--toasts-lift) × −1)</code>), separata dal <code>transform</code> che le centra e dall’animazione d’ingresso delle singole pillole','nessuna proprietà di layout animata'],
   ['Animazione','salita in <code>--dur-enter</code> (240 ms), discesa in <code>--dur-ui</code> (180 ms), entrambe <code>--ease-out</code>: stessa coppia della comparsa e dell’uscita delle pillole e della barra (motion.less r.645-660)','l’attributo <code>data-lifted</code> sceglie la durata'],
   ['Movimento ridotto','nessuna transizione: le pillole saltano nella nuova posizione (la posizione conta, il movimento no)','motion.less r.1-3'],
   ['Correzione collegata (bug nel codice)','<code>.jump-pills</code> è <code>position: fixed; left: 50%</code> senza larghezza: lo spazio disponibile è metà schermo (195px a 390px), quindi le due pillole non ci stanno affiancate e l’etichetta “Ultimo visto” va a capo su due righe. Si aggiunge <code>width: max-content; max-width: calc(100vw − 32px)</code>','BackToTop.less r.6-26; le prove qui sopra la includono; con 5 lingue (“Zuletzt gesehen”, “Dernier vu”) le due pillole stanno in 358px solo con testo su una riga: da verificare a 360px'],
   ['Se compare un toast mentre le pillole entrano','l’ingresso (dissolvenza e salita 16px) continua; la salita dei toast si somma','le due animazioni usano proprietà diverse'],
   ['Alternativa scartata: spostare i toast sopra le pillole','i toast sono la risposta a un gesto appena fatto e devono restare vicino al punto in cui si guarda; spingerli in alto li allontana','alternativa scartata: restringere le pillole mentre c’è un toast'],
  ])
  +pd([['Pillole con un toast','nascoste per tutta la durata del toast','restano, salgono sopra la pila','BackToTop.less r.6-26 (regola tolta), r.5-14; BackToTop.tsx; Toast.less r.3-17'],['Posizione sopra i toast','—','<code>--toasts-lift</code> misurata in JS, <code>translate</code> con transizione','BackToTop.tsx (nuovo effetto); BackToTop.less']],sub='Per ogni voce: com’è su main 7c7eb6a (prima), che cosa decide questa pagina (dopo), file.')))
