"""Blocco Planner: biglietto «Condividi il tuo planner» tra 1024 e 1142 px (voce 19).
Scritto a mano nel canvas: `python add_share.py` inserisce il blocco in canvas/Planner.dc.html (una volta sola).
Non è in add.py: una rigenerazione di p_planner.py lo cancellerebbe."""
from addlib import *
import html as _h, re
SB=12  # barra di scorrimento del sito (--sb-size), solo con mouse
def card(vw,desktop):
    share=(f'<aside class="share-poster" aria-labelledby="sp"><div><h2 id="sp" class="share-poster__title">{L("planner.sharePoster.title")}</h2><p>{L("planner.sharePoster.text")}</p></div>{btn("dark",L("share.open"),"lg","","share-2")}</aside>' if desktop else '')
    mob='' if desktop else f'<button type="button" class="progress-card__share"><span class="progress-card__share-label">{icon("share-2")}{L("planner.sharePoster.title")}</span></button>'
    return (f'<section class="progress-card card card--panel on-panel"><div class="progress-card__main"><h1 class="section-title">{L("planner.progressHeading")}</h1>'
      f'<p class="progress-card__percent" aria-hidden="true"><span class="progress-card__percent-width">100%</span><span class="progress-card__percent-value">35%</span></p><p class="progress-card__count">{L("planner.watchedCount",done=12,total=34)}</p>{mob}'
      f'<div class="progress-card__footer"><p class="progress-card__note muted">{L("planner.storage.device")}</p>{btn("text",L("planner.toolbar.reset"),"","","rotate-ccw")}</div></div>{share}</section>')
def hero(vw):
    nxt='<section class="card card--panel on-panel"><h2 class="section-title">Prossimo da vedere</h2><p class="muted">(segnaposto: la scheda vera sta a fianco)</p></section>'
    return f'<main class="site-main"><div class="planner__hero">{card(vw,vw>=1024)}{nxt}</div></main>'
FIX='@media (min-width:64em){.progress-card{flex-wrap:nowrap}}'
def fx(vw,h,theme,label,after=False):
    css='html{overflow:hidden}body{margin:0;padding-right:%dpx;box-sizing:border-box}'%(SB if vw>=768 else 0)+(FIX if after else '')
    doc=(f'<!doctype html><html lang="it" data-theme="{theme}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="tokens.css"><link rel="stylesheet" href="app.css">'
         f'<link href="https://fonts.googleapis.com/css2?family=Anton&family=Hanken+Grotesk:wght@400;500;600;700;800&display=swap" rel="stylesheet"><style>{css}</style></head><body>{hero(vw)}</body></html>')
    return (f'<div class="dc-fw"><div class="dc-fl">{label}</div><div class="dc-scroll"><iframe title="{label}" srcdoc="{_h.escape(doc.replace("viewBox","viewbox"),quote=True)}" '
            f'style="width:{vw}px;height:{h}px;border:0;border-radius:var(--r-md);display:block"></iframe></div></div>')
def cw(vw):  # larghezza della scheda dei progressi: Planner.less r.9-17, AppLayout.less r.13-18
    c=min(vw-SB,1440)
    if vw>=1024: return (c-64-8)*1.7/2.7
    if vw>=768: return (c-16-8)*1.3/2.3
    return c-16
def r(vw,note,prima,dopo):
    w=cw(vw); return [f'{vw}',f'{round(w)}',note,prima,dopo]
ROWS=[
 ['390 (telefono, senza barra)','374','nessun biglietto: il riquadro “Condividi” sta dentro la colonna del testo','invariato','invariato'],
 ['768 (tablet)',f'{round(cw(768))}','nessun biglietto (il codice lo monta solo da 64em): riquadro dentro la colonna','invariato','invariato'],
 ['1023 (ultimo pixel del tablet)',f'{round(cw(1023))}','nessun biglietto','invariato','invariato'],
 ['<b>1024</b> (parte il desktop)',f'{round(cw(1024))}','biglietto 250 px','va a capo sotto la percentuale; scheda alta 661 px','a destra; colonna del testo 246 px; scheda alta 354 px'],
 ['1130',f'{round(cw(1130))}','biglietto 250 px','va a capo; scheda alta 628 px','a destra; colonna 293 px; scheda alta 381 px'],
 ['<b>1142</b> (soglia attuale, con barra da 12 px; 1130 senza barra)',f'{round(cw(1142))}','biglietto 250 px','da qui sta a destra (666 = 320 + 24 + 250 + 72)','invariato'],
 ['1152',f'{round(cw(1152))}','biglietto 250 px','a destra; colonna 326 px; scheda alta 386 px','invariato'],
 ['1280',f'{round(cw(1280))}','biglietto 250 px','a destra; scheda alta 406 px','invariato'],
 ['1440',f'{round(cw(1440))}','biglietto 250 px','a destra; scheda alta 385 px','invariato'],
 ['1600 (contenuto fermo a 1440)',f'{round(cw(1600))}','biglietto 250 px','a destra','invariato'],
]
TIT=[['it','Condividi il tuo planner','2','nessuna','400','2','—'],
     ['en','Share your planner','2','nessuna','331','2','—'],
     ['fr','Partagez votre planificateur','<b>3</b>','<b>«planificateur» 227 px su 206: 21 px fuori dalla riga, tocca il bordo del biglietto</b>','491','2','—'],
     ['es','Comparte tu planificador','<b>3</b>','<b>«planificador» 214 px su 206: 8 px fuori</b>','435','2','—'],
     ['de','Teile deinen Planer','2','nessuna','319','2','—']]
DEMO_PROPS=[('1024','Prima'),]
def build():
    a=[]
    a.append(fx(1024,700,'light','Prima · finestra 1024 px · scheda 592 px: il biglietto va a capo (661 px di altezza)'))
    a.append(fx(1130,670,'light','Prima · finestra 1130 px · scheda 659 px: il biglietto va a capo, vuoto a destra (628 px)'))
    a.append(fx(1152,460,'light','Prima · finestra 1152 px · scheda 672 px: a destra (386 px)'))
    d=[]
    d.append(fx(1024,400,'light','Dopo · finestra 1024 px · scheda 592 px: a destra, colonna del testo 246 px (354 px)',True))
    d.append(fx(1024,400,'dark','Dopo · 1024 px · scuro',True))
    d.append(fx(1130,430,'light','Dopo · finestra 1130 px · scheda 659 px: colonna 293 px (381 px)',True))
    d.append(fx(1280,430,'light','Dopo · finestra 1280 px · scheda 753 px (invariato)',True))
    d.append(fx(1440,430,'light','Dopo · finestra 1440 px · scheda 854 px (invariato)',True))
    m=[fx(390,570,'light','Telefono · 390 px (invariato)'),fx(768,480,'light','Tablet · 768 px (invariato)')]
    why_=('<b>Raccomandazione: (a), il biglietto resta a destra e la colonna del testo si stringe.</b> Il desktop parte a 64em con una scheda di 592 px: il biglietto da 250 px non è mai troppo largo per una scheda che ne ha almeno 520 dentro il padding, mentre la colonna del testo ha il suo punto di rottura molto più in basso: a 246 px la percentuale (<code>clamp(5,5rem, 45cqi, 10,5rem)</code>) scende a 111 px da sola, il titolo resta su una riga nelle cinque lingue e le altre righe vanno a capo. '
          'Non c\'è nessuna soglia nuova da difendere: sul desktop la riga non va mai a capo, quindi non esiste una larghezza “di pochi pixel” in cui il layout cambia. '
          '<b>Perché non (b):</b> un biglietto più stretto fa andare il titolo su tre righe già in italiano (a 40 px la parola più lunga è 151 px). '
          '<b>Perché non (c):</b> un biglietto sotto la percentuale, a tutta larghezza e orizzontale, è un secondo layout da disegnare, mantenere e tradurre per una fascia di 118 px (1024-1142); e sul telefono la funzione la fa già il riquadro dentro la scheda.')
    return block('Decisione · biglietto “Condividi” tra 1024 e 1142 px',DECI,
      'Tra l\'inizio del desktop (1024 px) e la scheda da 666 px il biglietto (<code>.share-poster</code>, 250 px) va a capo sotto la percentuale, lascia il lato destro vuoto e rende la scheda quasi il doppio di “Prossimo da vedere”. Misurato nel browser con il CSS del canvas e i font veri (Anton, Hanken Grotesk). Le finestre sotto sono iframe larghi quanto la finestra, con 12 px di barra di scorrimento simulati a destra.',
      f'<div class="dc-box"><div class="dc-fl">Scelta · variante preferita e perché</div><p>{why_}</p></div>'
      +sec('La regola','Una riga di LESS in <code>PlannerSummary.less</code>.',
        '<pre><code>.progress-card {\n  display: flex;\n  flex-wrap: wrap;            // telefono e tablet: il riquadro Condividi sta nella colonna\n  gap: 1.5rem;\n  padding: 1.5rem 1.25rem;\n\n  .desktop({ padding: 32px 36px; flex-wrap: nowrap; });   // dal desktop il biglietto non va mai a capo\n}</code></pre>'
        +ul(['<code>.progress-card__main</code> resta <code>flex: 1 1 20rem; min-width: 0</code>: con <code>nowrap</code> il basis si riduce da solo (<code>flex-shrink: 1</code>) e la colonna prende lo spazio che resta. Nessun valore nuovo, nessun token nuovo.',
              '<code>.share-poster</code> resta <code>flex: none; width: 15.625rem</code> (valore senza token, già così).',
              'Non serve toccare <code>Planner.less</code>: la griglia dell\'hero (<code>1,7fr 1fr</code> da 64em) resta quella.',
              'Il nuovo limite inferiore è la scheda a 1024 px di finestra: 592 px (599 senza barra), colonna del testo 246 px. Sotto i 1024 px il biglietto non c\'è.']))
      +sec('2 · Il biglietto a tutte le larghezze','Scheda = (contenuto − 64 − 8) × 1,7 / 2,7 dal desktop (Planner.less r.17, AppLayout.less r.13-18: padding laterale 32 px, spazio fra le due schede 8 px); tablet (contenuto − 16 − 8) × 1,3 / 2,3. La formula riproduce i due valori misurati dal committente (≈660 a 1130, 672 a 1152). Altezze misurate con il testo italiano. <b>La soglia è 1142 px di finestra (1130 senza barra di scorrimento), cioè scheda da 666 px: è la somma 320 + 24 + 250 + 72.</b>',
        tbl(['Finestra (px)','Scheda progressi (px)','Biglietto','Prima (main 559f8bb)','Dopo'],ROWS))
      +sec('Prima: le larghezze critiche','Finestre vere (media query del codice). A 1024 e 1130 il biglietto è sotto la percentuale e la scheda è alta il doppio.','<div style="display:flex;flex-direction:column;gap:var(--sp-6)">'+''.join(a)+'</div>')
      +sec('Dopo: le stesse larghezze con la regola','Chiaro e scuro; 1280 e 1440 non cambiano.','<div style="display:flex;flex-direction:column;gap:var(--sp-6)">'+''.join(d)+'</div>')
      +sec('Telefono e tablet (non cambiano)','Il biglietto non esiste: <code>isDesktop</code> monta il riquadro <code>.progress-card__share</code> dentro la colonna.','<div style="display:flex;flex-direction:column;gap:var(--sp-6)">'+''.join(m)+'</div>')
      +sec('3 · Il titolo del biglietto: due righe, ma francese e spagnolo escono dalla riga',
        'Il biglietto da 250 px ha 206 px di larghezza utile (22 px di padding per lato). Una riga sola non è possibile: servirebbe un biglietto da 340 a 535 px (titolo + 44 px di padding), più largo della colonna del testo. <b>Il titolo resta su due righe.</b> Ma a 40 px (<code>--fs-xl</code>) due parole sono più larghe della riga: nel codice di oggi, a qualsiasi larghezza di scheda.',
        tbl(['Lingua','Titolo','Righe a 40 px','Parola fuori misura','Una riga a 40 px servirebbe (px)','Righe a 28 px (<code>--fs-h2</code>)','Fuori misura a 28 px'],[[x[0],x[1]]+x[2:] for x in TIT])
        +'<p class="dc-sub"><b>Raccomandazione:</b> titolo del biglietto a <code>--fs-h2</code> (28 px) in tutte le lingue: due righe ovunque, parola più lunga 159 px (fr) su 206, nessun caso particolare per lingua. Alternativa: lasciare 40 px e accettare che «planificateur» e «planificador» tocchino il bordo (non raccomandato). <code>--fs-h4</code> (24 px) porta en e de su una riga ma non it, fr, es.</p>'
        +'<pre><code>.share-poster__title {\n  .display-font();\n  font-size: var(--fs-h2);   // era var(--fs-xl)\n  line-height: 0.95;\n  margin-bottom: 0.75rem;\n}</code></pre>')
      +pd([['Riga dei contenuti della scheda dei progressi','<code>flex-wrap: wrap</code> a tutte le larghezze','<code>flex-wrap: nowrap</code> da 64em','PlannerSummary.less r.3-8'],
           ['Biglietto fra 1024 e 1142 px','sotto la percentuale, vuoto a destra, scheda 628-661 px','a destra, scheda 354-381 px','—'],
           ['Titolo del biglietto','<code>--fs-xl</code> (40 px): fr e es fuori dalla riga','<code>--fs-h2</code> (28 px), due righe in tutte le lingue','PlannerSummary.less r.111-116'],
           ['Griglia dell\'hero','<code>1,7fr 1fr</code> da 64em','invariata','Planner.less r.17']],
        sub='Ogni riga: com\'è nel codice su main 559f8bb, che cosa decide questa voce, file da toccare. Numeri di riga da PlannerSummary.less letti il 22 novembre; non rimappati.'))
if __name__=='__main__':
    p='../../canvas/Planner.dc.html'
    t=open(p,encoding='utf-8').read()
    if 'biglietto “Condividi” tra 1024' in t: raise SystemExit('già inserito')
    end='\n</div>\n</x-dc>'
    assert end in t
    t=t.replace(end,'\n'+build()+end,1)
    open(p,'w',encoding='utf-8').write(t)
    print('ok',len(t))
