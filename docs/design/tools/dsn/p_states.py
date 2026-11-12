from parts import *
def art(n,sz=96,folder='images'): return f'<img src="assets/{folder+"/" if folder else ""}{n}.webp" alt="" aria-hidden="true" width="{sz}" height="{sz}">'
BARS='<svg viewBox="0 0 96 96" aria-hidden="true"><g fill="currentColor" opacity="0.28"><rect x="10" y="54" width="16" height="30" rx="3"/><rect x="32" y="38" width="16" height="46" rx="3"/><rect x="54" y="24" width="16" height="60" rx="3"/><rect x="76" y="46" width="10" height="38" rx="3"/></g><path d="M8 90 88 16" stroke="currentColor" stroke-width="5" stroke-linecap="round" fill="none"/></svg>'
def sbox(a,title,text,actions='',role='status',layout='card'):
    ac=f'<div class="state-box__actions">{actions}</div>' if actions else ''
    return f'<div class="state-box state-box--{layout}" role="{role}"><div class="state-box__art" aria-hidden="true">{a}</div><div class="state-box__body"><h3>{title}</h3><p>{text}</p>{ac}</div></div>'
def lerr(inline=False):
    if not inline: return sbox(BARS,L('loadError.title'),L('loadError.body'),btn('soft',L('common.retry'),'','','rotate-ccw'),'alert')
    return f'<div class="load-error load-error--inline" role="alert">{icon("triangle-alert",24,None,"load-error__icon")}<div class="load-error__text"><strong>{L("loadError.title")}</strong><p>{L("loadError.body")}</p></div>{btn("soft",L("common.retry"),"sm","","rotate-ccw")}</div>'
def spage(img,title,body,actions):
    return f'<section class="status-page"><img class="status-art" src="assets/{img}.webp" alt="" aria-hidden="true" width="640" height="640"><div class="status-page__body"><h1 style="all:unset"></h1><div role="presentation" class="dc-h1x" style="display:none"></div></div></section>'
def spage(img,title,body,actions):
    return (f'<section class="status-page"><img class="status-art" src="assets/{img}.webp" alt="" aria-hidden="true" width="640" height="640"><div class="status-page__body">'
            f'<div role="presentation" class="status-title">{title}</div><p>{body}</p><div class="status-page__actions">{actions}</div></div></section>')
S=[]
S.append(h1('System states','Vuoto, errore di caricamento e pagina di stato: tre componenti, uno schema.'))
S.append(hdr('StateBox (vuoto, scaduto, errore di caricamento), LoadError (blocco e in linea), StatusPage (404, errore, manutenzione), scheletri',
 'src/components/ui/StateBox/, LoadError/, StatusPage/; scheletri in src/styles/motion.less (.skeleton); illustrazioni in src/assets/*.webp; usi in features/planner, features/share, pages/',
 'Button (soft, primary), illustrazioni webp'))
S.append(sec('StateBox: vuoto (card)','Card <code>--surface</code>, raggio <code>--r-xl</code>, <b>senza ombra</b>; illustrazione 96px a sinistra, titolo <code>--fs-title</code> 800, frase <code>--ink-2</code>, azioni. <code>role="status"</code> per una lista vuota. Misura 96px: '+NOTOKEN,
 both('720px',f'<div style="display:flex;flex-direction:column;gap:var(--sp-3)">{sbox(art("empty-filters"),L("planner.empty.filters.title"),L("planner.empty.filters.body"),btn("soft",L("planner.filters.clear"),"","","filter-x"))}{sbox(art("empty-search"),L("planner.empty.search.title",q="thor"),L("planner.empty.search.body"),btn("soft",L("planner.empty.search.action"),"","","x"))}</div>','Filtri vuoti · ricerca senza risultati')))
S.append(sec('StateBox: errore di caricamento (blocco)','Stessa card con <code>role="alert"</code>; illustrazione a barre in SVG. Il titolo resta ink anche se l\'alert è rosso per <code>base.less</code> (commento in StateBox.less).',
 both('720px',lerr(False),'LoadError block')))
S.append(sec('LoadError in linea','Riga <code>--surface</code>, raggio <code>--r-row</code>, altezza minima <code>--row-h</code>, icona di avviso <code>--danger-text</code> 24px e pulsante “Riprova” piccolo.',
 both('720px',lerr(True),'LoadError inline')))
S.append(sec('StateBox: layout “dialog”','Senza card: colonna con illustrazione 112px, titolo in font display <code>--fs-h4</code>, azioni a tutta larghezza. Usata nel popup di condivisione. Misura 112px: '+NOTOKEN,
 both('420px',sbox(art("err-shared",112),L("share.invalid.title"),L("share.invalid.body"),btn("primary",L("common.close"),"lg"),'status','dialog'),'Link non valido')))
S.append(sec('StatusPage','Pagina intera: card <code>--surface</code> con <code>--shadow-card</code> (livello 1), illustrazione 15rem, titolo h1 in font display <code>--fs-h1</code>, frase max 44ch. Nel tema scuro l\'illustrazione ha un contorno <code>drop-shadow</code> ink. Le pagine reali (404, errore, manutenzione) sono nella pagina Pagine di errore.',
 both('1000px',spage("err-404",L("notFound.title"),L("notFound.body"),btn("primary",L("notFound.back"),"lg")),'404')))
S.append(sec('Scheletri','Blocchi <code>.skeleton</code>: altezza 1,5rem, raggio <code>--r-xs</code>, nascosti finché non passa <code>--delay-pending</code> (200ms); poi pulse di 1,4s. Oltre il tetto della splash compaiono subito.',
 both('420px','<div class="demo-sk" style="display:flex;flex-direction:column;gap:var(--sp-2)"><span class="skeleton" style="width:60%"></span><span class="skeleton"></span><span class="skeleton" style="width:80%"></span></div>','')))
S.append(sec('Testi nelle 5 lingue','',tbl(['Lingua','loadError.title','loadError.body','planner.empty.filters.title','share.invalid.title','notFound.title'],[[l]+[L(k,l) for k in ('loadError.title','loadError.body','planner.empty.filters.title','share.invalid.title','notFound.title')] for l in LANGS])))
S.append(sec('Valori nel codice: StateBox.less','',spec('components/ui/StateBox/StateBox.less')))
S.append(sec('Valori nel codice: LoadError.less','',spec('components/ui/LoadError/LoadError.less')))
S.append(sec('Valori nel codice: StatusPage.less','',spec('components/ui/StatusPage/StatusPage.less')))
S.append(sec('Valori nel codice: scheletro','',spec('styles/motion.less',r'skeleton')))
S.append(prima_dopo([
 ['StateBox','ombra in alcune varianti','nessuna ombra','StateBox.less'],
 ['Ombre','non regolate','StateBox 0, StatusPage livello 1 (<code>--shadow-card</code>)','StatusPage.less'],
 ['Testi','esempi','chiavi reali dei file locale','locales/*.ts'],
]))
write('System states.dc.html','System states','\n'.join(S))
