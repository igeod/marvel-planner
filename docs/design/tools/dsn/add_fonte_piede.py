"""Blocco della pagina «Fonti e suggerimenti»: la riga della fonte come piede del riquadro Trama (voce 21).
Scritto a mano nel canvas: `python add_fonte_piede.py` lo inserisce in canvas/Fonti e suggerimenti.dc.html (una volta sola).
Non dipende da lib2. Una rigenerazione di p_fonti.py lo cancella."""
import html as _h
from add_fonte_riga import tag, ul, tbl, sec, PARAS
V='''html{overflow:hidden}body{margin:0;padding:16px;background:var(--panel)}
.spoiler-box--plot{height:460px}
.v-now .plot__source{position:sticky;bottom:0;margin:var(--sp-3) 0 0;padding-top:var(--sp-3);background:var(--panel-2);font-size:var(--fs-caption);color:var(--muted-on-dark)}
.v-now .plot__source::before{content:"";position:absolute;inset-inline:0;bottom:100%;height:var(--sp-6);background:linear-gradient(to top,var(--panel-2),transparent);pointer-events:none}
.spoiler-box__foot{font-size:var(--fs-caption);color:var(--muted-on-dark)}
.spoiler-box__foot[data-hidden]{filter:blur(8px);user-select:none}
.plot__source a,.spoiler-box__foot a{color:var(--highlight)}
.mk{position:absolute;font:800 11px/16px var(--font-body);background:var(--highlight);color:var(--ink-static);padding:0 5px;border-radius:var(--r-tiny);white-space:nowrap}
.ml{position:absolute;border-top:1px dashed var(--highlight);opacity:.7}'''
SCRIPT='''var c=document.querySelector(".spoiler-box__content"),a=document.querySelector("article"),h=document.querySelector(".spoiler-box__head"),f=document.querySelector(".plot__source,.spoiler-box__foot");
c.scrollTop=%d;
function L(y){var d=document.createElement("div");d.className="ml";d.style.cssText="left:"+(a.getBoundingClientRect().left+24)+"px;width:"+(a.offsetWidth-48)+"px;top:"+y+"px";document.body.appendChild(d)}
function M(y,t){var d=document.createElement("div");d.className="mk";d.textContent=t;d.style.cssText="top:"+(y-8)+"px;left:0";document.body.appendChild(d);d.style.left=(a.getBoundingClientRect().right-24-d.offsetWidth)+"px"}
var cr=c.getBoundingClientRect(),hr=h.getBoundingClientRect(),fr=f.getBoundingClientRect();
if(%s){L(cr.top);L(cr.bottom);M((hr.bottom+cr.top)/2,Math.round(cr.top-hr.bottom)+" px");var g=Math.round(fr.top-cr.bottom);M(g>0?(cr.bottom+fr.top)/2:cr.bottom,(g>0?g:Math.round(cr.bottom-fr.bottom))+" px")}'''
def frame(label,v,theme,w,scroll,hidden=False,blurfoot=False,marks=True,src=None):
    text=''.join(f'<p>{p}</p>' for p in PARAS)
    s=src or 'Fonte: <a href="#">Wikipedia</a>, <a href="#">licenza CC BY-SA 4.0</a>'
    hid=' data-hidden="true" aria-hidden="true"' if hidden else ''
    if v=='now': body=f'<div class="plot">{text}</div><p class="plot__source">{s}</p>'; foot=''
    else: body=f'<div class="plot">{text}</div>'; foot=f'<div class="spoiler-box__foot"{" data-hidden=\"true\"" if (hidden and blurfoot) else ""}><p>{s}</p></div>'
    eye='<button type="button" class="spoiler-box__eye" aria-expanded="%s" aria-label="%s"><svg class="lucide" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg></button>'%('false' if hidden else 'true','Mostra la trama' if hidden else 'Nascondi la trama')
    art=f'<article class="spoiler-box spoiler-box--plot v-{v}" style="width:{w}px"><div class="spoiler-box__head"><h3 class="section-title">Trama</h3>{eye}</div><div class="spoiler-box__content" role="region"{hid}>{body}</div>{foot}</article>'
    doc=(f'<!doctype html><html lang="it" data-theme="{theme}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="tokens.css"><link rel="stylesheet" href="app.css">'
         f'<link href="https://fonts.googleapis.com/css2?family=Anton&family=Hanken+Grotesk:wght@400;500;600;700;800&display=swap" rel="stylesheet"><style>{V}</style></head><body>{art}<script>{SCRIPT%(scroll,"true" if marks else "false")}</script></body></html>')
    return (f'<div class="dc-fw"><div class="dc-fl">{label}</div><iframe title="{label}" srcdoc="{_h.escape(doc.replace("viewBox","viewbox"),quote=True)}" '
            f'style="width:{w+32}px;height:500px;border:0;border-radius:var(--r-md);display:block;max-width:100%"></iframe></div>')
def row(*f): return '<div class="dc-row">'+''.join(f)+'</div>'
def col(*r): return '<div style="display:flex;flex-direction:column;gap:var(--sp-5)">'+''.join(r)+'</div>'
MID=100; END=99999
def build():
    chip=tag('proposta · non implementata','k2')
    why=('<b>Raccomandazione 1: D, il piede del riquadro.</b> La causa che il committente ha trovato è giusta: la scrollbar è del contenitore e la riga sticky sta dentro, quindi a fine scorrimento il cursore arriva fino alla fonte (0 px di stacco); in alto sotto il titolo lo stacco è 16 px. Con D la riga esce dall\'area che scorre: la scrollbar finisce <code>--sp-4</code> (16 px) sopra la fonte, simmetrica a quella in alto, e non servono più sticky, sfumatura e margini. '
         '<b>Perché non (a):</b> la guida della scrollbar occupa sempre tutto il contenitore: <code>padding-bottom</code> e <code>scrollbar-gutter</code> non la accorciano; solo Chromium permette un margine su <code>::-webkit-scrollbar-track</code>, Firefox no (qui usa <code>scrollbar-width: thin</code>). '
         '<b>Punto 2: la riga resta nitida, non sfocata.</b> È come la testata del riquadro (titolo e occhio restano nitidi): l\'attribuzione non è lo spoiler e, nitida, è visibile anche prima di premere l\'occhio. Costa meno codice: nessun filtro, nessun <code>inert</code> né <code>aria-hidden</code> sul piede. Se il committente la vuole sfocata, è una variante piccola (sotto); il parere è mio, la scelta sua. '
         '<b>Punto 3:</b> <code>footer</code> è facoltativo: Scene chiave, Easter egg e Scene dopo i titoli non lo passano e non cambiano (nessun elemento, nessun gap in più).')
    A=row(frame('Oggi (main b9d4c12) · inizio','now','light',550,0),frame('Oggi · metà','now','light',550,MID),frame('Oggi · fine: lo stacco in fondo è 0 px','now','light',550,END))
    B=row(frame('Proposta D · inizio','foot','light',550,0),frame('Proposta D · metà','foot','light',550,MID),frame('Proposta D · fine: 16 px come in alto','foot','light',550,END))
    C=row(frame('Proposta D · fine · scuro','foot','dark',550,END),frame('Proposta D · trama nascosta · chiaro (fonte nitida)','foot','light',550,0,hidden=True),frame('Proposta D · trama nascosta · scuro','foot','dark',550,0,hidden=True))
    Dv=row(frame('Variante: piede sfocato con la trama · chiaro','foot','light',550,0,hidden=True,blurfoot=True),frame('Variante: piede sfocato · scuro','foot','dark',550,0,hidden=True,blurfoot=True))
    T=row(frame('Telefono 390 px (riquadro 334 px) · fine · chiaro','foot','light',334,END),frame('Telefono · metà · scuro','foot','dark',334,MID),frame('Telefono stretto (riquadro 250 px): la fonte va a capo, 39 px','foot','dark',250,MID))
    meas=tbl(['Misura (riquadro 460 px, testo italiano)','Oggi (sticky)','Proposta D'],[
      ['Stacco sopra la scrollbar (testata → area che scorre)','16 px','16 px (invariato)'],
      ['Stacco sotto la scrollbar (area che scorre → fonte)','<b>0 px</b> (la fonte sta dentro)','<b>16 px</b> (<code>gap: var(--sp-4)</code> del riquadro)'],
      ['Fonte → bordo del riquadro','24 px','24 px (<code>--sp-6</code>, invariato)'],
      ['Altezza dell\'area che scorre','352 px','317 px con la fonte su una riga (−35), 297 px su due (−55)'],
      ['Testo visibile a metà scorrimento','320 px (352 − riga da 32 px)','317 px (−3)'],
      ['Altezza della fonte','32 px (20 + 12 di padding-top), 51 px su due righe','20 px, 39 px su due righe'],
      ['Scrollbar (<code>--sb-size</code>)','12 px','12 px']])
    thr=tbl(['Lingua','it','de','en','es','fr'],[['Riquadro minimo per una riga (px), oggi','285','286','293','296','297'],['Riquadro minimo per una riga (px), proposta D','273','274','281','284','285']])
    return (f'<div class="dc-sec"><h2 class="dc-h2">Revisione · la riga della fonte come piede del riquadro Trama (scrollbar con lo stacco in fondo)</h2><div>{chip}</div>'
      '<p class="dc-sub">Riferimento: main b9d4c12, con la riga della voce 20 già nel codice (sfumatura inclusa). Sostituisce la raccomandazione di “Decisione · la riga della fonte nel riquadro Trama” più sopra: la sfumatura sistema il taglio del testo ma non lo stacco della scrollbar. Misurato nel browser con il CSS del canvas e i font veri; le etichette gialle dentro le cornici sono le distanze misurate. Le larghezze 550 / 334 / 250 sono di <b>prova</b>; la larghezza vera del riquadro nella pagina intera non è misurata.</p>'
      f'<div class="dc-box"><div class="dc-fl">Scelta · variante preferita e perché</div><p>{why}</p></div>'
      +sec('Oggi: la scrollbar arriva alla fonte','A fine scorrimento il cursore scende fino all\'altezza della riga sticky.',col(A))
      +sec('Proposta D: inizio, metà e fine','La riga non scorre e non è sticky: sta sotto l\'area che scorre, a <code>--sp-4</code>.',col(B))
      +sec('Chiaro, scuro e trama nascosta','Nascosta, il testo è sfocato e inerte; il piede resta nitido, come la testata.',col(C))
      +sec('Variante, se il committente vuole la fonte sfocata','Il piede prende <code>data-hidden</code>, <code>aria-hidden</code> e <code>inert</code> come il contenuto, e lo stesso filtro. Non raccomandata: più codice, e l\'attribuzione sparisce proprio quando non si legge il testo.',col(Dv))
      +sec('Telefono','Riquadro 334 px: la fonte sta su una riga in tutte le lingue. Con D il piede ha tutta la larghezza del riquadro, senza i 12 px della scrollbar: una riga da 285 px in su (francese) invece di 297.',col(T)+thr)
      +sec('Misure',' ',meas)
      +sec('Regola per Code','Stato di partenza: main b9d4c12. Solo token esistenti.',
        '<pre><code>// SpoilerBox.tsx: prop facoltativa, dopo il contenuto\ninterface SpoilerBoxProps {\n  …\n  // Sotto l\'area che scorre, sempre visibile e nitido (la fonte della trama).\n  footer?: ReactNode;\n}\n…\n  {children &amp;&amp; (&lt;div … className="spoiler-box__content"&gt;…&lt;/div&gt;)}\n  {footer &amp;&amp; &lt;div className="spoiler-box__foot"&gt;{footer}&lt;/div&gt;}\n\n// SpoilerBox.less (il gap var(--sp-4) del riquadro dà lo stacco)\n.spoiler-box__foot {\n  font-size: var(--fs-caption);\n  color: var(--muted-on-dark);\n\n  a { color: var(--highlight); }\n}\n\n// PlotSection.tsx: PlotSource esce dai figli e va in footer\n&lt;SpoilerBox … footer={&lt;PlotSource plot={hasSeasons ? null : details.plot} /&gt;}&gt;\n  {(isHidden) =&gt; &lt;div className="plot"&gt;…&lt;/div&gt;}\n&lt;/SpoilerBox&gt;\n\n// PlotSection.less: via tutta la regola .plot__source (sticky, margine, padding, ::before)</code></pre>'
        +ul(['Nessun valore nuovo: <code>--fs-caption</code>, <code>--muted-on-dark</code>, <code>--highlight</code>, e il <code>gap: var(--sp-4)</code> che il riquadro ha già.','<code>PlotSource</code> torna un <code>&lt;p&gt;</code> senza classe (o con <code>plot__source</code> senza regole: tolgila). Il piede esiste solo quando c\'è la trama o la stagione; con trama mancante il riquadro usa <code>intro</code> e non passa <code>footer</code>.','Non toccati: <code>KeyScenes</code>, <code>EasterEggs</code>, <code>PostCreditsInfo</code> (non passano <code>footer</code>: stesso DOM di oggi); <code>.spoiler-box--plot { height: 460px }</code>; <code>.plot</code>.','Se il committente sceglie la fonte sfocata: <code>data-hidden={isHidden || undefined}</code>, <code>aria-hidden</code> e <code>inert</code> sul piede, e <code>.spoiler-box__foot[data-hidden] { overflow: hidden; filter: blur(8px); user-select: none; transition: filter var(--dur-enter) var(--ease-out); }</code> con la stessa riga <code>prefers-reduced-motion</code> del contenuto.','Test: nessuno nuovo. Il progetto non ha test di componenti (<code>tests/</code> è logica pura, senza jsdom né testing-library) e il cambio è markup e CSS; verifica a mano: a fine scorrimento 16 px tra scrollbar e fonte, trama nascosta con la fonte nitida, Scene chiave ed Easter egg invariati.','Non verificato: la larghezza vera del riquadro, Safari e Firefox, trame vere più lunghe.','Deviazioni di DESIGN.md: «Fonte della trama: sta in un piede di <code>SpoilerBox</code> (<code>footer</code>, <code>.spoiler-box__foot</code>) sotto l\'area che scorre, fissa e nitida (non sfocata con la trama), non più <code>sticky</code> con sfumatura; la scrollbar finisce <code>--sp-4</code> sopra la fonte, come in alto sotto il titolo.»']))
      +sec('Prima, dopo, file','',tbl(['Cosa','Prima','Dopo','File'],[['Posizione della fonte','dentro l\'area che scorre, <code>sticky; bottom: 0</code>','piede di <code>SpoilerBox</code>, sotto l\'area che scorre','SpoilerBox.tsx, PlotSection.tsx'],['Stacco della scrollbar in fondo','0 px','16 px (<code>--sp-4</code>)','SpoilerBox.less'],['Sfumatura, margine, padding-top','<code>::before</code> <code>--sp-6</code>, <code>margin</code> e <code>padding-top</code> <code>--sp-3</code>','tolti','PlotSection.less'],['Trama nascosta','fonte sfocata e inerte','fonte nitida (variante sfocata a parte)','SpoilerBox.tsx']]))
      +'</div>')
if __name__=='__main__':
    p='../../canvas/Fonti e suggerimenti.dc.html'
    t=open(p,encoding='utf-8',newline='').read()
    if 'la riga della fonte come piede del riquadro Trama' in t: raise SystemExit('già inserito')
    old='Decisione · la riga della fonte nel riquadro Trama: sfumatura, respiro, fine dello scorrimento'
    assert t.count(old)==1
    t=t.replace(old,old+' (superata dalla revisione in fondo alla pagina)')
    end='\n</div>\n</x-dc>'; assert t.count(end)==1
    open(p,'w',encoding='utf-8',newline='').write(t.replace(end,'\n'+build()+end,1)); print('ok')
