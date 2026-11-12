from addlib import *
import re
_p={}; exec(open(f'{S}/dsn/p_planner.py').read().split('\nS=[]')[0],_p)
phone=_p['phone']; pct_card=_p['pct_card']; next_card=_p['next_card']; strip_old=_p['strip']
CH=CHEV
D71=[(1,['watched']*6),(2,['watched']*6),(3,['watched']*11),(4,['watched']*18),(5,['watched']*9+['next']+['todo']*7),(6,['todo']*13)]
D='@media (min-width:64em)'; M='@media (max-width:63.99em)'
CSS_D=f'''<style>
.phase-strip__cell--watched svg,.phase-strip__swatch.phase-strip__cell--watched svg{{display:none}}
.phase-strip__cell{{container-type:inline-size}}.phase-strip__cell--next svg{{width:clamp(10px,60cqw,16px);height:clamp(10px,60cqw,16px)}}
{D}{{.phase-strip__cell{{height:32px}}.phase-strip__swatch{{width:16px;height:16px}}.phase-strip__swatch svg{{width:12px;height:12px}}}}
{M}{{.phase-strip__cell{{width:24px;height:24px}}.phase-strip__swatch{{width:16px;height:16px}}.phase-strip__swatch svg{{width:12px;height:12px}}}}
</style>'''
def mark(x): return icon("play") if x=="next" else ""
def parts(data,total):
    leg=''.join(f'<li><span class="phase-strip__swatch phase-strip__cell--{s}">{mark(s)}</span>{L(k)}</li>' for s,k in [('watched','planner.strip.legendWatched'),('next','planner.strip.legendNext'),('todo','planner.strip.legendTodo')])
    cols=''.join('<div class="phase-strip__phase phase-strip__phase--size-%d"><div class="phase-strip__cells" aria-hidden="true">%s</div><p class="phase-strip__label"><span class="phase-strip__name">%s</span><span class="muted">%s</span></p></div>'%(len(c),''.join(f'<span class="phase-strip__cell phase-strip__cell--{x}">{mark(x)}</span>' for x in c),L('planner.strip.phase',number=n),L('common.ofCount',done=sum(x=='watched' for x in c),total=len(c))) for n,c in data)
    return leg,cols
def desk_card(data,total):
    leg,cols=parts(data,total)
    return f'<section class="phase-strip card"><div class="phase-strip__header"><h2 class="section-title">{L("planner.strip.heading",total=total)}</h2><ul class="phase-strip__legend muted" aria-hidden="true">{leg}</ul></div><div class="phase-strip__columns">{cols}</div></section>'
def acc_card(data,total,open_):
    leg,cols=parts(data,total)
    return (f'<section class="phase-strip card"><h2 class="phase-strip__toggle-heading"><button type="button" class="phase-strip__toggle" aria-expanded="{"true" if open_ else "false"}">{L("planner.strip.heading",total=total)}{CH}</button></h2>'
            f'<div class="phase-strip__body"{"" if open_ else " hidden"}><ul class="phase-strip__legend muted" aria-hidden="true">{leg}</ul><div class="phase-strip__columns">{cols}</div></div></section>')
def fix71(h): return h.replace('35%','70%').replace(L('planner.watchedCount',done=12,total=34),L('planner.watchedCount',done=50,total=71)).replace(L('planner.strip.heading',total=34),L('planner.strip.heading',total=71))
def nottoggle(h): return re.sub(r'<button type="button" class="progress-card__toggle".*?</button>','',h,flags=re.S)
def nojump(h): return re.sub(r'<button type="button" class="btn btn--text" >(?:(?!</button>).)*?'+re.escape(L('planner.jump.last'))+r'</button>','',h,flags=re.S)
def sc_desktop(theme,label,h=190):
    return phone(CSS_D+f'<div style="padding:var(--sp-4)">{desk_card(D71,71)}</div>',theme,h,1100,label)
def sc_mobile(theme,label,open_,h):
    hero=fix71(nojump(nottoggle(pct_card(False))))
    inner=CSS_D+f'<div class="planner" style="padding:var(--sp-4)"><div class="planner__hero">{hero}{next_card()}</div><div style="margin-top:var(--sp-4)">{acc_card(D71,71,open_)}</div></div>'
    return phone(inner,theme,h,390,label)
def sc_today(theme,label,h):
    leg,cols=parts_old()
    return ''
def parts_old():
    return '',''
def today_scene(theme,label,h):
    ic=lambda x: icon("check",None,4) if x=="watched" else (icon("play") if x=="next" else "")
    leg=''.join(f'<li><span class="phase-strip__swatch phase-strip__cell--{s}">{ic(s)}</span>{L(k)}</li>' for s,k in [('watched','planner.strip.legendWatched'),('next','planner.strip.legendNext'),('todo','planner.strip.legendTodo')])
    cols=''.join('<div class="phase-strip__phase phase-strip__phase--size-%d"><div class="phase-strip__cells" aria-hidden="true">%s</div><p class="phase-strip__label"><span class="phase-strip__name">%s</span><span class="muted">%s</span></p></div>'%(len(c),''.join(f'<span class="phase-strip__cell phase-strip__cell--{x}">{ic(x)}</span>' for x in c),L('planner.strip.phase',number=n),L('common.ofCount',done=sum(x=='watched' for x in c),total=len(c))) for n,c in D71)
    hero=fix71(nojump(pct_card(False))).replace('class="progress-card__toggle" aria-expanded="false"','class="progress-card__toggle" aria-expanded="true"')
    hero=hero.replace('</button><div class="progress-card__footer">','</button><div class="phase-strip phase-strip--inline"><ul class="phase-strip__legend muted" aria-hidden="true">'+leg+'</ul><div class="phase-strip__columns">'+cols+'</div></div><div class="progress-card__footer">',1) if '</button><div class="progress-card__footer">' in hero else hero
    return phone(f'<div class="planner" style="padding:var(--sp-4)"><div class="planner__hero">{hero}</div></div>',theme,h,390,label)
def grid(*c): return '<div class="dc-row" style="align-items:flex-start">'+''.join(c)+'</div>'
add('Planner',
 block('Fascia delle fasi: solo il “prossimo” con simbolo, celle più basse, accordion proprio su mobile',PROP,
  'Decisione del 12 novembre. <b>Desktop:</b> variante D della pagina di confronto: i visti sono oro pieno senza spunta, il “prossimo” è rosso con il play, i da vedere grigi; celle da 32px (non 44px). <b>Mobile:</b> la fascia esce dalla scheda dei progressi e diventa un accordion a sé, come le fasi dell’elenco: il pulsante-pillola dentro la scheda, che allargava la scheda stessa, sparisce. Il blocco “implementata” della fascia resta quello di main.',
  '<div class="dc-fl">Che cosa non va oggi su mobile (c520ab1)</div>'+ul([
   '<b>Il contenitore sbagliato cresce.</b> Il pulsante “Tutti i N titoli” (<code>progress-card__toggle</code>, PlannerSummary.tsx r.100-113) sta dentro la scheda dei progressi e, aprendosi, allunga la scheda: sposta in basso l’avviso del salvataggio, “Azzera” e “Prossimo da guardare”. Con 71 titoli la scheda diventa lunga e perde la funzione di riassunto.',
   '<b>Non sembra un accordion.</b> È una pillola come un campo di selezione, e il contenuto compare sotto di lei senza un contenitore proprio: l’accordion, nel resto dell’app (fasi, righe del titolo), è la scheda stessa che si allunga.',
   '<b>I da vedere sono invisibili.</b> <code>PhaseStrip.less</code> r.126 usa <code>var(--strip-on-panel-off)</code>, che non è definito in nessun file (nemmeno <code>tokens.less</code>): il fondo non vale e le celle “da vedere” (e lo swatch “Da vedere” della legenda) restano trasparenti sul pannello. Nello screenshot sono le Fasi 5 e 6 vuote.'])
  +grid(today_scene('dark','Oggi · mobile · scuro · aperta (come nel tuo screenshot)',900))
  +'<div class="dc-fl">Dopo · mobile</div>'
  +grid(sc_mobile('dark','Mobile · scuro · chiusa',False,1010),sc_mobile('dark','Mobile · scuro · aperta',True,1400))
  +grid(sc_mobile('light','Mobile · chiaro · aperta',True,1400))
  +'<div class="dc-fl">Dopo · desktop (71 titoli)</div>'
  +grid(sc_desktop('dark','Desktop · scuro'),sc_desktop('light','Desktop · chiaro'))
  +tbl(['Aspetto','Valore','File'],[
   ['Cella “visto”','oro pieno (<code>--highlight</code>), <b>nessuna icona</b>; non si disegna più <code>Check</code>','PhaseStrip.tsx r.1 e r.14'],
   ['Cella “prossimo”','<code>--accent</code> con play pieno <b>proporzionale alla cella</b>: <code>clamp(10px, 60cqw, 16px)</code> (oggi 10px fisso); la cella è <code>container-type: inline-size</code> perché con 71 titoli è larga circa 11px (play 10px) e con pochi titoli arriva a 16px','PhaseStrip.tsx r.16; PhaseStrip.less r.92-110'],
   ['Cella “da vedere”','<code>--disabled</code> (come oggi sulla scheda)','PhaseStrip.less r.112-114'],
   ['Altezza cella','desktop <b>32px</b> (oggi 44px); mobile <b>24px</b> (oggi 20px); il play segue la cella (14px a 24px)','PhaseStrip.less r.70-89'],
   ['Legenda','swatch 16px; “Visti” senza spunta, “Prossimo” con play 12px, “Da vedere” grigio','PhaseStrip.less r.36-45'],
   ['Mobile: dove sta','scheda a sé dopo “Prossimo da guardare”, nello stesso ordine del desktop (avanzamento, prossimo, fasce, elenco); non più dentro la scheda dei progressi','PlannerSummary.tsx r.98-114; Planner.tsx'],
   ['Mobile: accordion','<code>&lt;details&gt;</code> come <code>PhaseSection</code>: scheda con titolo “Tutti i N titoli”, a destra “X di N” e il chevron; chiusa all’avvio; aprendola si allunga <b>solo</b> la scheda','PhaseStrip.tsx (nuova variante); Accordion'],
   ['Variante <code>inline</code>','si elimina, e con lei <code>--strip-on-panel-off</code> (che non esisteva): la fascia è sempre su <code>.card</code>','PhaseStrip.less r.116-124; PhaseStrip.tsx r.81-89'],
   ['Colori sulla scheda','todo <code>--disabled</code> su <code>--surface</code>: leggibile in chiaro e in scuro (vedi desktop)','—'],
  ])
  +pd([['Fascia su mobile','dentro la scheda dei progressi, pulsante-pillola che allunga la scheda','accordion a sé dopo “Prossimo da guardare”','PlannerSummary.tsx r.47-48, r.98-114; Planner.tsx'],['Celle “da vedere” su pannello','trasparenti (variabile non definita)','non esistono più (nessun pannello)','PhaseStrip.less r.116-124'],['Segni','spunta 10px sui visti, play 10px','solo play, proporzionale','PhaseStrip.tsx r.14-18; PhaseStrip.less r.92-94'],['Altezza celle','44px desktop, 20px mobile','32px desktop, 24px mobile','PhaseStrip.less r.70-89']],sub='Per ogni voce: com’è su main c520ab1 (prima), che cosa decide questa pagina (dopo), file.')
  +'<div class="dc-fl">Alternative valutate per il mobile</div>'+ul(['Righe di avanzamento per fase (una barra sottile per fase, senza celle): più compatta, ma perde il “prossimo” e il legame con i titoli.','Foglio dal basso aperto da un pulsante “Fasi”: la scheda non cresce mai, ma nasconde la fascia dietro un gesto in più. L’accordion proprio è più coerente con le fasi dell’elenco.'])))
