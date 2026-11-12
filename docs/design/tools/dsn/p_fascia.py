from addlib import *
_p={}; exec(open(f'{S}/dsn/p_planner.py').read().split('\nS=[]')[0],_p)
phone=_p['phone']
D='@media (min-width:64em)'; M='@media (max-width:63.99em)'
VAR={
'A':'',
'B':f'''{D}{{.phase-strip__cell svg{{width:16px;height:16px}}.phase-strip__cell--watched svg{{stroke-width:3}}.phase-strip__cell{{container-type:inline-size}}}}
@container (max-width:17px){{.phase-strip__cell svg{{display:none}}}}
{M}{{.phase-strip__cell{{width:24px;height:24px}}.phase-strip__cell svg{{width:14px;height:14px}}}}''',
'C':f'''{D}{{.phase-strip__cell{{height:32px;container-type:inline-size}}.phase-strip__cell svg{{width:clamp(10px,60cqw,16px);height:clamp(10px,60cqw,16px)}}.phase-strip__cell--watched svg{{stroke-width:3}}.phase-strip__swatch{{width:16px;height:16px}}.phase-strip__swatch svg{{width:12px;height:12px}}}}
{M}{{.phase-strip__cell{{width:24px;height:24px}}.phase-strip__cell svg{{width:14px;height:14px}}.phase-strip__swatch{{width:16px;height:16px}}.phase-strip__swatch svg{{width:12px;height:12px}}}}''',
'D':f'''.phase-strip__cell--watched svg,.phase-strip__swatch.phase-strip__cell--watched svg{{display:none}}
{D}{{.phase-strip__cell--next svg{{width:16px;height:16px}}.phase-strip__cell{{height:32px}}}}
{M}{{.phase-strip__cell--next svg{{width:14px;height:14px}}}}''',
'E':f'''.phase-strip__cells{{gap:4px}}.phase-strip__cell{{flex:0 0 28px;width:28px;height:28px}}.phase-strip__cell svg{{width:16px;height:16px}}.phase-strip__cell--watched svg{{stroke-width:3}}
.phase-strip__swatch{{width:16px;height:16px}}.phase-strip__swatch svg{{width:12px;height:12px}}''',
}
def sstrip(data,total):
    ic=lambda x: icon("check",None,4) if x=="watched" else (icon("play") if x=="next" else "")
    leg=''.join(f'<li><span class="phase-strip__swatch phase-strip__cell--{s}">{ic(s)}</span>{L(k)}</li>' for s,k in [('watched','planner.strip.legendWatched'),('next','planner.strip.legendNext'),('todo','planner.strip.legendTodo')])
    cols=''.join('<div class="phase-strip__phase phase-strip__phase--size-%d"><div class="phase-strip__cells" aria-hidden="true">%s</div><p class="phase-strip__label"><span class="phase-strip__name">%s</span><span class="muted">%s</span></p></div>'%(len(c),''.join(f'<span class="phase-strip__cell phase-strip__cell--{x}">{ic(x)}</span>' for x in c),L('planner.strip.phase',number=n),L('common.ofCount',done=sum(x=='watched' for x in c),total=len(c))) for n,c in data)
    return f'<section class="phase-strip card"><div class="phase-strip__header"><h2 class="section-title">{L("planner.strip.heading",total=total)}</h2><ul class="phase-strip__legend muted" aria-hidden="true">{leg}</ul></div><div class="phase-strip__columns">{cols}</div></section>'
D17=[(1,['watched']*5+['next']),(2,['todo']*5),(3,['todo']*6)]
D34=[(1,['watched']*6),(2,['watched']*5),(3,['watched']+['next']+['todo']*9),(4,['todo']*12)]
def sc(v,theme,mobile,data,total,label,h):
    inner=f'<style>{VAR[v]}</style><div style="padding:var(--sp-4)">{sstrip(data,total)}</div>'
    return phone(inner,theme,h,390 if mobile else 1100,label)
def grid(*c): return '<div class="dc-row" style="align-items:flex-start">'+''.join(c)+'</div>'
def hh(v,desk17=190,desk34=190,mob=520):
    if v=='E': desk17,desk34,mob=190,250,560
    return (grid(sc(v,'dark',False,D17,17,'Desktop · scuro · 17 titoli (come nello screenshot)',desk17),sc(v,'dark',False,D34,34,'Desktop · scuro · 34 titoli',desk34))
           +grid(sc(v,'light',False,D34,34,'Desktop · chiaro · 34 titoli',desk34),sc(v,'dark',True,D34,34,'Mobile · scuro · 34 titoli',mob)))
def pc(pro,con): return '<div class="dc-row"><div class="dc-box" style="flex:1 1 20rem"><div class="dc-fl">Pro</div>'+ul(pro)+'</div><div class="dc-box" style="flex:1 1 20rem"><div class="dc-fl">Contro</div>'+ul(con)+'</div></div>'
P=[]
P.append(h1('Fascia delle fasi','Come sistemare le icone dentro le celle della fascia delle fasi (“Tutti i 34 titoli”): cinque varianti, provate con 17 e con 34 titoli, desktop e mobile.'))
P.append(hdr('Proposte per le icone (spunta e play) nelle celle della fascia delle fasi di PhaseStrip e nella sua legenda',
 'src/features/planner/components/PhaseStrip/ (PhaseStrip.tsx, PhaseStrip.less)','Planner (fascia delle fasi, legenda)','12 novembre 2026'))
P.append(sec('Che cosa non va oggi','Letto dal codice (main '+COMMIT+', PhaseStrip.less r.89-115, r.54-63).',ul([
 'Su desktop la cella è <code>flex: 1 0 8px</code>, <b>alta 44px</b> e larga quanto lascia la fase: con 17 titoli circa 42px, con 34 titoli circa 26px. L\'icona è <b>10px</b> (r.96-98): un segno piccolissimo dentro un rettangolo alto e stretto, che si perde.',
 'La spunta ha <code>stroke-width: 4</code> (PhaseStrip.tsx r.15?) a 10px: si impasta; il play è pieno a 10px e sembra un puntino.',
 'Le celle hanno <code>overflow: hidden</code> (r.82-87) e una larghezza minima di 8px: con una fase di molti titoli l\'icona da 10px viene tagliata.',
 'Su mobile la cella è 20×20 con icona da 12px (r.74-93): più proporzionata, ma a 20px il segno resta fine.',
 'La legenda usa lo stesso segno: swatch 14px con icona da 10px (r.40-49).',
 'La fascia è <code>aria-hidden</code> e c’è già un riepilogo testuale nascosto (“12 di 34 visti”, r.77): le icone sono solo visive.'])))
P.append(block('Variante A · Com’è oggi (riferimento)',IMPL,'Cella alta 44px, icona 10px.',hh('A')))
P.append(block('Variante B · Icone più grandi, stessa cella',PROP,'Icona a 16px (spunta con tratto 3), play a 14-16px; sotto i 17px di larghezza della cella l’icona sparisce (container query) e resta il colore. Mobile: cella 24px, icona 14px.',
 hh('B')+pc(['Cambia pochissimo: due numeri e una regola.','Il segno si legge subito.'],['Cella 44px alta e 26px larga: l’icona da 16px resta in un rettangolo stretto e alto.','Container query: da verificare sulla compatibilità del browser minimo supportato (non verificato).'])))
P.append(block('Variante C · Icone proporzionali e celle più basse',PROP+' '+PREF,'Cella alta 32px (non 44), icona proporzionale alla larghezza: <code>clamp(10px, 60cqw, 16px)</code>. La cella è più vicina a un quadrato, quindi l’icona sta bene a ogni numero di titoli. Mobile: cella 24px, icona 14px. Legenda: swatch 16px, icona 12px.',
 hh('C')+pc(['Proporzioni più equilibrate a qualsiasi larghezza.','Legge meglio con 34 titoli e con molti di più.','La fascia perde 12px di altezza.'],['Le celle sono meno “barra” e più “mattone”: cambia un poco l’aspetto.','Container query come B.'])))
P.append(block('Variante D · Un solo simbolo: solo il “prossimo”',PROP,'I visti sono oro pieno senza spunta, il prossimo è rosso con il play a 16px, i da vedere sono grigi. Meno segni, il “prossimo” spicca. La legenda toglie la spunta dallo swatch.',
 hh('D')+pc(['La fascia più pulita: un solo punto di attenzione, il prossimo titolo.','Nessun problema di icone piccole: ne esiste una sola.'],['Visti e da vedere si distinguono solo per colore (oro contro grigio): la fascia è già <code>aria-hidden</code> con riepilogo testuale, ma si perde il segno “fatto”.','Cambia il significato della legenda.'])))
P.append(block('Variante E · Celle quadrate che vanno a capo',PROP,'Celle quadrate da 28px con icona da 16px, a capo dentro la fase (le fasi restano proporzionali). Mobile: 28px. La fascia è più alta ma ogni segno è nitido.',
 hh('E')+pc(['Segni sempre nitidi, qualunque sia il numero di titoli.','Le celle sono quadrate come i riquadri delle altre icone.'],['Più alta: le fasi con molti titoli vanno su più righe e si perde la lettura “barra di avanzamento”.','Cambia di più il layout.'])))
P.append(sec('Confronto','',tbl(['','Cella desktop','Icona','Altezza fascia','Rischio'],[
 ['A · oggi','alta 44px, 26-42px larga','10px','—','segno che si perde'],
 ['B','come oggi','16px, nascosta sotto 17px','—','cella stretta e alta'],
 ['<b>C ★</b>','alta 32px','proporzionale 10-16px','−12px','cambia poco l\'aspetto'],
 ['D','alta 32px','solo il play, 16px','−12px','visti e da vedere solo per colore'],
 ['E','28×28, a capo','16px','+ circa 60px','layout diverso'],
])))
P.append(why('<b>C.</b> Il difetto vero è la proporzione: una cella da 26×44 con un segno da 10px. Con celle da 32px e icone che crescono con la cella (fino a 16px) il segno si legge sempre e il resto della fascia resta com’è. D è la più pulita ma toglie il segno “fatto”; E è la più nitida ma cambia il layout. Con C non cambiano né i testi né le chiavi.'))
P.append(sec('C · valori proposti','',tbl(['Aspetto','Valore','File'],[
 ['Altezza della cella (desktop)','<code>32px</code> (oggi 44px)','PhaseStrip.less r.75?'],
 ['Cella: contenitore','<code>container-type: inline-size</code> sulla cella','PhaseStrip.less r.89-96'],
 ['Icona (desktop)','<code>clamp(10px, 60cqw, 16px)</code> (oggi 10px); spunta con <code>strokeWidth={3}</code> (oggi 4)','PhaseStrip.less r.112-115; PhaseStrip.tsx r.15?'],
 ['Cella e icona (mobile)','24px e 14px (oggi 20px e 12px)','PhaseStrip.less r.89-109'],
 ['Legenda','swatch 16px, icona 12px (oggi 14px e 10px)','PhaseStrip.less r.54-63'],
 ['Colori','invariati: oro <code>--highlight</code>, rosso <code>--accent</code> (<code>--accent-on-dark</code> sul pannello), grigio <code>--disabled</code>','PhaseStrip.less r.118-135'],
])))
write('Fascia fasi.dc.html','Fascia delle fasi','\n'.join(P))
