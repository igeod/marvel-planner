from addlib import *
import add_scorc as S0, add_fascia as AF
phone=S0.phone
def grid(*c): return '<div class="dc-row" style="align-items:flex-start">'+''.join(c)+'</div>'
# ---------- 1. pillole su mobile ----------
def pill(ic,t,iconly=False,aria=''):
    if iconly: return f'<button type="button" class="btn btn--panel btn--sm jump-pills__pill jump-pills__pill--icon">{icon(ic)}<span class="jump-pills__label">{esc(t)}</span></button>'
    return f'<button type="button" class="btn btn--panel btn--sm jump-pills__pill">{icon(ic)}{esc(t)}</button>'
CSS_P='''<style>
.jump-pills{width:max-content;max-width:calc(100vw - 32px);bottom:var(--pills-bottom,calc(var(--floating-progress-clearance) + var(--sp-4)))}
.jump-pills__pill{white-space:nowrap}
.jump-pills__label{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
@media (min-width:40em){.jump-pills__label{position:static;width:auto;height:auto;overflow:visible;clip-path:none}}
@media (max-width:39.9375em){.jump-pills__pill--icon{width:var(--hit);padding:0;justify-content:center}}
</style>'''
JSP='<script>(function(){var b=document.querySelector(".floating-progress"),p=document.querySelector(".jump-pills");function f(){var r=b.getBoundingClientRect();p.style.setProperty("--pills-bottom",(innerHeight-r.top+8)+"px")}f();addEventListener("load",f);addEventListener("resize",f);addEventListener("scroll",f,{passive:true});new ResizeObserver(f).observe(b);document.fonts&&document.fonts.ready.then(f);setTimeout(f,400)})()</script>'
def sc(theme,lang,mode,w,label):
    last=S0.LAST[lang]; top=S0.TOP[lang]
    if mode=='before':
        pl=f'<div class="jump-pills jump-pills--above-bar">{pill("locate-fixed",last)}{pill("arrow-up",top)}</div>'
        css='';js=''
    else:
        pl=f'<div class="jump-pills">{pill("locate-fixed",last)}{pill("arrow-up",top,True)}</div>'
        css=CSS_P;js=JSP
    inner=S0.CSS.replace('.sc{','.scX{')+css+f'<div class="site-shell"><main class="site-main" style="padding-top:0">{S0.body(True,None)[:-6]+S0.fpbar()+'</div>'}</main></div>'+pl+js
    return phone(inner,theme,380,w,label)
block1=block('Pillole su mobile: solo “Ultimo visto” con testo, e più vicine alla barra',PROP,
 'Due problemi nelle prove su telefono: le etichette vanno a capo (<code>.jump-pills</code> è <code>fixed; left: 50%</code> senza larghezza, quindi ha a disposizione mezzo schermo) e le pillole stanno troppo in alto sopra la barra di avanzamento (<code>bottom: calc(var(--floating-progress-clearance) + var(--sp-4))</code> presuppone una barra alta 5rem; quella vera è circa 62px). Decisione del 12 novembre.',
 grid(sc('dark','it','before',390,'Prima · 390px · scuro'),sc('dark','it','after',390,'Dopo · 390px · scuro'),sc('light','de','after',360,'Dopo · 360px · tedesco · chiaro'))
 +tbl(['Aspetto','Regola','Note'],[
  ['Etichette (sotto 40em)','“Ultimo visto” con icona e testo; “Torna su” <b>solo con la freccia</b>, cerchio da <code>--hit</code> (44px). Il testo resta nel DOM (<code>.jump-pills__label</code>, visivamente nascosto), quindi il nome accessibile non cambia','la freccia in su è un gesto noto; “Ultimo visto” no, perché l’icona non lo dice. Torna col testo da 40em in su (c’è spazio)'],
  ['Larghezza','<code>width: max-content; max-width: calc(100vw − 32px)</code> e <code>white-space: nowrap</code> sulle pillole','corregge il testo a capo; la riga più larga (tedesco “Zuletzt gesehen” + freccia) è circa 217px, entra anche a 320px'],
  ['Distanza dalla barra','le pillole stanno a <code>--sp-2</code> sopra la barra, misurata: <code>bottom = innerHeight − barra.top + --sp-2</code> (<code>getBoundingClientRect</code>, la stessa misura con cui <code>BackToTop</code> decide già se la barra è attaccata al bordo, BackToTop.tsx r.21-25). Si ricalcola a scroll e resize','oggi ~24px in più del necessario (la barra non è alta 5rem)'],
  ['Senza barra','<code>bottom: calc(var(--sp-4) + env(safe-area-inset-bottom, 0px))</code>','invariato; con un toast vale la proposta “Pillole flottanti sopra i toast”'],
  ['Lingue','it, en, fr, es, de: le etichette corte (“Dernier vu”, “Último visto”) e lunghe (“Zuletzt gesehen”) stanno su una riga; chiavi <code>planner.jump.last</code> e <code>planner.jump.top</code> invariate','nessuna chiave nuova'],
 ])
 +pd([['Etichetta “Torna su” su mobile','icona + testo','solo icona (testo nascosto visivamente)','BackToTop.tsx; BackToTop.less'],['Larghezza delle pillole','mezzo schermo disponibile: testo a capo','<code>max-content</code>, nowrap','BackToTop.less r.6-26'],['Distanza dalla barra','clearance (5rem) + <code>--sp-4</code>','altezza reale della barra + <code>--sp-2</code>','BackToTop.less r.38-48; BackToTop.tsx']],sub='Per ogni voce: com’è su main 7c7eb6a (prima), che cosa decide questa pagina (dopo), file.'))
# ---------- 2. accordion della fascia ----------
CSS_A='''<style>
.phase--strip .phase__summary{min-height:var(--hit)}
.phase--strip .phase__name{font-size:var(--fs-title);font-weight:700}
</style>'''
def acc_new(open_):
    leg,cols=AF.parts(AF.D71,71)
    return (f'<details class="phase card phase--strip" id="st"{" open" if open_ else ""}><summary class="phase__summary"><span class="phase__heading"><h3 class="phase__name">{L("planner.strip.heading",total=71)}</h3></span>{CHEV}</summary>'
            f'<div class="phase-strip__body"><ul class="phase-strip__legend muted" aria-hidden="true">{leg}</ul><div class="phase-strip__columns">{cols}</div></div></details>')
JSA='''<script>(function(){var el=document.getElementById("st"),sum=el.querySelector("summary"),collapsed=!el.open,run=0;
sum.addEventListener("click",function(e){e.preventDefault();collapsed=!collapsed;var id=++run,closing=collapsed;
delete el.dataset.motion;el.open=false;var h0=el.offsetHeight;el.open=true;var h1=el.offsetHeight;
el.style.setProperty("--phase-h0",h0+"px");el.style.setProperty("--phase-h1",h1+"px");el.dataset.motion=closing?"closing":"opening";
Promise.allSettled(el.getAnimations({subtree:true}).map(function(a){return a.finished})).then(function(){if(run!==id)return;delete el.dataset.motion;el.style.removeProperty("--phase-h0");el.style.removeProperty("--phase-h1");if(closing)el.open=false})})})()</script>'''
def sc2(theme,kind,label,h):
    if kind=='before': inner=AF.CSS_D+f'<div style="padding:var(--sp-4)">{AF.acc_card(AF.D71,71,False)}</div>'
    elif kind=='closed': inner=AF.CSS_D+CSS_A+f'<div style="padding:var(--sp-4)">{acc_new(False)}</div>'+JSA
    else: inner=AF.CSS_D+CSS_A+f'<div style="padding:var(--sp-4);display:flex;flex-direction:column;gap:var(--sp-3)">{acc_new(False)}{phase_ref()}</div>'+JSA
    return phone(inner,theme,h,390,label)
def phase_ref():
    from comp import phase,row
    return phase(False)
block2=block('Fascia delle fasi su mobile: lo stesso accordion delle fasi',PROP,
 'L’accordion “Tutti i 71 titoli” è un pulsante con il corpo <code>hidden</code> (PhaseStrip.tsx r.81-91): si apre di colpo, senza l’animazione di altezza e di contenuto che hanno le fasi, e la barra del titolo è più alta e più grossa (card con padding 20px 16px + pulsante da 44px + testo 800). Decisione del 12 novembre: <b>è lo stesso accordion delle fasi</b>, stessa animazione, e più compatto. Provalo con un tocco sul titolo.',
 grid(sc2('light','before','Prima · chiuso (nel codice)',120),sc2('light','closed','Dopo · prova viva: tocca il titolo',300),sc2('dark','ref','Dopo · accanto a una fase (stessa animazione)',360))
 +tbl(['Aspetto','Regola','Note'],[
  ['Struttura','<code>&lt;details class="phase card"&gt;</code> con <code>&lt;summary class="phase__summary"&gt;</code> e <code>Chevron</code>, come <code>PhaseSection</code>; il corpo (legenda e colonne) è il contenuto di <code>details</code>. Il pulsante <code>.phase-strip__toggle</code>, <code>hidden</code> e <code>aria-controls</code> si tolgono','il <code>details</code> dà già nome, stato aperto/chiuso e tastiera'],
  ['Animazione','<code>usePhaseMotion(isCollapsed)</code> riusato così com’è: altezza in <code>--dur-enter</code> (240 ms) all’apertura e <code>--dur-ui</code> (180 ms) alla chiusura, contenuto che entra e chevron che gira (motion.less r.281-290, r.388-415)','nessuna regola nuova in motion.less: la card porta la classe <code>.phase</code>. Con movimento ridotto: come le fasi'],
  ['“Comprimi tutto”','non la riguarda: il pulsante agisce solo sulle fasi (<code>planner__list--bulk .phase</code> è dentro la lista)','lo stato aperto/chiuso della fascia resta locale e chiuso all’inizio'],
  ['Titolo','<code>--fs-title</code> (18px), peso 700, come <code>.section-title</code>; niente seconda riga e niente conteggio','prima: 16px peso 800 dentro un pulsante da 44px con padding extra; le fasi hanno <code>--fs-h3</code> 800'],
  ['Altezza chiusa','<code>--pad-card</code> (8px) + <code>min-height: var(--hit)</code> (44px) + 8px = <b>60px</b>; prima 20 + 44 + 20 = 84px; una fase chiusa è 80px','la fascia pesa meno delle fasi, perché non ha sottotitolo'],
  ['Corpo','legenda e colonne come oggi (<code>.phase-strip__body</code>), con padding laterale <code>--sp-3</code>','le colonne restano a 24px di altezza (decisione 31)'],
  ['Solo mobile','da 64em la fascia resta la scheda sempre aperta con intestazione e legenda a destra (<code>PhaseStrip</code> senza <code>isCollapsible</code>)','invariato'],
 ])
 +pd([['Apertura della fascia','di colpo (<code>hidden</code>)','stessa animazione delle fasi','PhaseStrip.tsx r.81-91; usePhaseMotion.ts'],['Titolo','<code>.phase-strip__toggle</code> 16px / 800','<code>.phase__summary</code> con <code>--fs-title</code> / 700','PhaseStrip.less r.8-19; PhaseSection.less'],['Altezza chiusa','84px','60px','PhaseStrip.less r.4-8']],sub='Per ogni voce: com’è su main 7c7eb6a (prima), che cosa decide questa pagina (dopo), file.'))
add('Planner',block1,block2)
