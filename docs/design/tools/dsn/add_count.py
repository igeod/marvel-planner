from addlib import *
import re
_p={}; exec(open(f'{S}/dsn/p_planner.py').read().split('\nS=[]')[0],_p)
phone=_p['phone']; pct_card=_p['pct_card']
def ease(t): return 1-(1-t)**3
ts=[0,.1,.2,.35,.5,.75,1]
seq=' · '.join(str(round(35*ease(t))) for t in ts)
seq2=' · '.join(str(round(35+1*ease(t))) if False else str(round(35+ (36-35)*ease(t),0)) for t in ts)
def demo():
    h=pct_card(False)
    h=re.sub(r'<button type="button" class="progress-card__toggle".*?</button>','',h,flags=re.S)
    h=re.sub(r'<button type="button" class="btn btn--text" >(?:(?!</button>).)*?'+re.escape(L('planner.jump.last'))+r'</button>','',h,flags=re.S)
    h=h.replace('<span class="progress-card__percent-value">35%</span>','<span class="progress-card__percent-value" id="pv">0%</span>')
    h=h.replace(L('planner.watchedCount',done=12,total=34),'<span id="cnt">0 di 34 visti</span>')
    btns=''.join(f'<button type="button" class="btn btn--soft btn--sm" id="{i}">{t}</button>' for i,t in [('b0','Ricarica la pagina'),('b1','Segna un titolo'),('b2','Segna una fase (+6)'),('b3','Azzera')])
    js='''<script>
(function(){var T=34,done=12,shown=0,raf=0;var pv=document.getElementById('pv'),cnt=document.getElementById('cnt');
var reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
function pct(d){return Math.round(d/T*100)}
function set(n){pv.textContent=n+'%'}
function go(to,ms){cancelAnimationFrame(raf);cnt.textContent=done+' di '+T+' visti';if(reduced||ms===0){shown=to;set(to);return}
var from=shown,t0=performance.now();(function f(now){var t=Math.min(1,(now-t0)/ms),e=1-Math.pow(1-t,3);shown=Math.round(from+(to-from)*e);set(shown);if(t<1)raf=requestAnimationFrame(f)})(t0)}
document.getElementById('b0').onclick=function(){shown=0;set(0);setTimeout(function(){go(pct(done),900)},150)};
document.getElementById('b1').onclick=function(){done=Math.min(T,done+1);go(pct(done),400)};
document.getElementById('b2').onclick=function(){done=Math.min(T,done+6);go(pct(done),400)};
document.getElementById('b3').onclick=function(){done=0;go(0,400)};
set(0);setTimeout(function(){go(pct(done),900)},300);
})();
</script>'''
    inner=f'<div class="planner" style="padding:var(--sp-4);display:flex;flex-direction:column;gap:var(--sp-3)"><div class="planner__hero">{h}</div><div style="display:flex;flex-wrap:wrap;gap:var(--sp-2)">{btns}</div></div>{js}'
    return phone(inner,'dark',620,390,'Prova viva · scuro (si avvia da sola; i pulsanti la rilanciano)')+phone(inner.replace('<script>','<script>',1),'light',620,390,'Prova viva · chiaro')
add('Planner',
 block('Numero che sale nei tuoi progressi',PROP,
  'Il grande numero percentuale della scheda “I tuoi progressi” conta fino al valore, invece di comparire già finito. Decisione del 12 novembre. Provalo: le due schede qui sotto usano le regole scritte nella tabella.',
  '<div class="dc-row" style="align-items:flex-start">'+demo()+'</div>'
  +tbl(['Aspetto','Regola','Note'],[
   ['Che cosa conta','solo la percentuale grande (<code>.progress-card__percent</code>, PlannerSummary.tsx r.70-72); “12 di 34 visti” cambia di colpo; la barra compatta e la barra fluttuante non contano','il numero è già <code>aria-hidden</code>: i lettori di schermo leggono sempre il valore finale (conteggio, <code>progress</code> nascosto)'],
   ['Quando parte','<b>all’arrivo</b>: da 0 al valore, dopo il primo disegno (<code>hasPainted</code>, Planner.tsx r.105-111) e alla fine della splash; vale anche sul link condiviso','non riparte a ogni render: solo al montaggio'],
   ['Quando cambia il valore','da quello mostrato al nuovo (35 → 36, o 35 → 53 con la casella della fase); anche al ribasso con “Azzera” (da 35 a 0)','se arriva un nuovo valore a metà conteggio, parte da quello che si vede'],
   ['Durata','<b>900 ms</b> da 0 al valore iniziale; <b>400 ms</b> a ogni cambio, qualunque sia la differenza','esiste già <code>--dur-progress</code> (600 ms, 0 con movimento ridotto) per la barra: il conteggio è più lungo di proprio, perché il numero è grande e va letto mentre sale'],
   ['Curva','uscita decelerata, <code>1 − (1 − t)³</code>: parte veloce e si ferma piano sul valore finale; i passaggi sono interi, mai decimali','la <code>--ease-out</code> dell’app è una cubic-bezier: in JavaScript si usa la formula equivalente'],
   ['Passi del conteggio','da 0 a 35 in 900 ms: '+seq+' (a 0, 10, 20, 35, 50, 75, 100% del tempo)','con un solo punto di differenza (35 → 36) si vede un solo cambio'],
   ['Larghezza','il numero è in una griglia con “100%” invisibile per riservare la larghezza, cifre tabulari (<code>tabular-nums</code>): il numero non fa “ballare” il resto della scheda','senza questa riserva “5%” e “35%” hanno larghezze diverse'],
   ['Movimento ridotto','nessun conteggio: il valore finale compare subito (conta come movimento: <code>prefers-reduced-motion</code>)','motion.less r.1-3: i keyframe e il movimento si saltano, colore e opacità no'],
   ['Altri contatori grandi (b7ddfe3)','scheda piccola nella colonna dei filtri (<code>CompactProgress</code>, desktop) e barra flottante (<code>FloatingProgress</code>, mobile): contano solo a ogni cambio (400 ms), alla prima apertura e alla riapertura mostrano subito il valore. Account, “Titoli visti” (<code>ProgressStatsSection</code>): “51” e “72%” da 0 in 900 ms la prima volta che la pagina si apre nella sessione, poi solo ai cambi. Non contano i conteggi piccoli nel testo','senza <code>initialMs</code> il numero parte dal valore; stessa curva, passi interi, <code>tabular-nums</code>, nessun conteggio con movimento ridotto, <code>aria-hidden</code> dove il testo equivalente è già letto'],
   ['Valore 0 o invariato','nessuna animazione','—'],
   ['100%','il conteggio e il popup “Multiverso completato” partono insieme: il popup non aspetta','il numero finisce dietro il popup'],
   ['Implementazione','hook <code>useCountUp(target, { initialMs?, changeMs, enabled })</code> con <code>requestAnimationFrame</code>, annullato a ogni nuovo valore e allo smontaggio; nessuna libreria','nuovo file nel Planner; PlannerSummary.tsx r.70-72; PlannerSummary.less (<code>.progress-card__percent</code>)'],
  ])
  +pd([['Percentuale “I tuoi progressi”','compare già al valore finale','conta da 0 (900 ms) e ad ogni cambio (400 ms), tranne con movimento ridotto','PlannerSummary.tsx r.70-72; nuovo hook <code>useCountUp</code>; PlannerSummary.less'],['Larghezza del numero','variabile','riservata con “100%” invisibile e cifre tabulari','PlannerSummary.less r.23-29']],sub='Per ogni voce: com’è su main c520ab1 (prima), che cosa decide questa pagina (dopo), file.')))
