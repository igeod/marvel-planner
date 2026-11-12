from parts import *
CHEV='<svg class="lucide chevron" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>'
def poster(): return f'<div class="poster-thumb"><div class="poster-image"><span class="poster-image__state" role="img" aria-label="{L("poster.missing")}">{icon("image-off")}</span></div></div>'
def row(name,meta,watched=False,state='',open_=False):
    cls='title-row'+(' title-row--open' if open_ else '')+(f' {state}' if state else '')
    nm=f'<s>{name}</s>' if watched and not open_ else name
    chk='' if open_ else (f'<label class="title-row__check"><input type="checkbox"{" checked=\"checked\"" if watched else ""} aria-label="{L("planner.markWatched",name=name)}"><span class="title-row__box" aria-hidden="true">{icon("check")}</span></label>')
    content=''
    if open_:
        content=(f'<div class="title-row__content"><div class="mark-watched"><button type="button" class="mark-watched__button"><span class="mark-watched__pill">{icon("check")}{L("planner.next.markWatched")}</span></button></div>'
                 f'<div class="title-row__actions"><a class="btn btn--primary" href="#">{L("details.open")}{icon("maximize-2")}</a></div></div>')
    return (f'<li class="{cls}">{chk}{poster()}<details class="title-row__details"{" open=\"open\"" if open_ else ""}><summary class="title-row__summary"><span class="title-row__heading"><span lang="en" class="title-row__name">{nm}</span><span class="title-row__meta">{meta}</span></span>{CHEV}</summary>{content}</details></li>')
ACT=f'<div class="phase__actions"><button type="button" class="btn btn--text btn--sm">{icon("check-check")}{L("planner.phase.markAll")}</button></div>'
PCHK=f'<label class="title-row__check phase__check"><input type="checkbox" aria-label="{L("planner.phase.markAll")}"><span class="title-row__box" aria-hidden="true" style="color:var(--ink)">{icon("minus").replace("<svg","<svg style=\"opacity:1\"",1)}</span></label>'
def phase(open_=True,state='',rows=''):
    c='phase card'+(f' {state}' if False else '')
    sm='phase__summary'+(f' {state}' if state else '')
    body=''
    if open_: body=f'<ol class="phase__titles">{rows}</ol>'
    return (f'<details class="{c}"{" open=\"open\"" if open_ else ""}><summary class="{sm}">{PCHK}<span class="phase__heading"><h3 class="phase__name">{L("catalog.phases.1")}</h3><span class="phase__years muted">2008 – 2012</span></span><span class="phase__count">{L("common.ofCount",done=2,total=6)}</span>{CHEV}</summary>{body}</details>')
def guide(chrono=False,alt=True,open_=True):
    names=dict(chrono=f'<strong>{L("planner.order.chronological")}</strong>',release=f'<strong>{L("planner.order.release")}</strong>',tag=f'<strong>{L("planner.tags.alternate")}</strong>',filter=f'<strong>{L("planner.filters.showAlternate")}</strong>')
    def rich(k): 
        s=L(k)
        for n,v in names.items(): s=s.replace('{'+n+'}',v)
        return s
    items=f'<div><h3>{L("planner.guide.orderTerm")}</h3><p>{rich("planner.guide.orderTextChrono" if chrono else "planner.guide.orderText")}</p></div>'
    if alt: items+=f'<div><h3>{L("planner.guide.alternateTerm")}</h3><p>{rich("planner.guide.alternateText")}</p></div>'
    body=f'<div class="planner-guide__items">{items}</div>' if open_ else ''
    return f'<details class="phase card planner-guide"{" open=\"open\"" if open_ else ""}><summary class="phase__summary"><h2 class="phase__name phase__heading">{L("planner.guide.title")}</h2>{CHEV}</summary>{body}</details>'
M=lambda extra='': f'{L("planner.types.film")}, 2008'
S=[]
S.append(h1('Accordion','Un solo schema per tutto ciò che si apre e si chiude: la fase del planner e la riga del titolo. (“Come leggere il planner” non è più un accordion: è un popup, vedi Planner.)'))
S.append(hdr('Accordion: fase (PhaseSection), riga del titolo (TitleItem), movimento di apertura e chiusura',
 'src/features/planner/components/PhaseSection/, TitleItem/, hooks/usePhaseMotion.ts; movimento in src/styles/motion.less',
 'Chevron, Button (primary), PosterImage, MarkWatchedButton; Planner (pagina) li usa'))
S.append(sec('Fase','<code>&lt;details class="phase card"&gt;</code> con la riga di sommario da 4rem: nome, anni, conteggio, chevron. Chiusa e aperta. Testi veri: <code>catalog.phases.1</code>, <code>common.ofCount</code>; anni dal catalogo (<code>catalog.ts</code>).',
 both('720px',f'<div style="display:flex;flex-direction:column;gap:var(--sp-3)">{phase(False)}{phase(True,rows=row("Iron Man",M(),True)+row("The Incredible Hulk",M()))}</div>','Chiusa · aperta')))
S.append(sec('Stati del sommario','Hover, premuto e focus colorano il sommario (<code>.tones(--row-hover, --row-press)</code>); il focus resta dentro il bordo (offset −3px).',
 both('720px','<div style="display:flex;flex-direction:column;gap:var(--sp-3)">'+''.join(f'<details class="phase card"><summary class="phase__summary {s}"><span class="phase__heading"><h3 class="phase__name">{L("catalog.phases.1")}</h3><span class="phase__years muted">2008 – 2012</span></span><span class="phase__count">{L("common.ofCount",done=2,total=6)}</span>{CHEV}</summary></details>' for s in ('is-hover','is-active','is-focus'))+'</div>','Hover · premuto · focus')))
S.append(sec('Riga del titolo','Riga chiusa: segno di visto, locandina 44×64, titolo (lingua originale, <code>lang="en"</code>), meta. Visto = titolo barrato. La riga aperta passa al pannello scuro (<code>--panel</code>) con locandina grande e azioni.',
 both('720px',f'<ol class="phase__titles" style="padding:0">{row("Iron Man",M())}{row("The Incredible Hulk",M(),True)}{row("Iron Man",M(),False,"",True)}</ol>','Normale · vista · aperta')))
S.append(sec('Valori nel codice: PhaseSection.less','',spec('features/planner/components/PhaseSection/PhaseSection.less')))
S.append(sec('Valori nel codice: TitleItem.less','',spec('features/planner/components/TitleItem/TitleItem.less')))
S.append(sec('Movimento: apertura e chiusura','Fase: <code>usePhaseMotion</code> misura l\'altezza chiusa/aperta e imposta <code>data-motion</code>; l\'attributo <code>open</code> resta finché la chiusura non finisce. Durate: apertura <code>--dur-enter</code> 240ms, chiusura <code>--dur-ui</code> 180ms, curva <code>--ease-out</code>; riga del titolo con <code>::details-content</code>. Con movimento ridotto le durate scendono a 80ms.',
 spec('styles/motion.less',r'phase|title-row|details|chevron')))
S.append(sec('Regole','',ul(['Un accordion è un <code>&lt;details&gt;</code> nativo: la ricerca nella pagina lo apre, la tastiera funziona senza JavaScript.',
 'Lo stato (aperto/chiuso) sta in React; il click sul sommario fa <code>preventDefault</code> così la chiusura può animarsi prima di togliere <code>open</code>.'])))
S.append(prima_dopo([
 ['Come leggere il planner','accordion (PlannerGuide)','non è più un accordion: popup aperto dal “?” (vedi Planner)','GuideHelp.tsx'],
 ['Riga azione della fase','assente','sostituita (main 456fa17) dalla casella tri-stato nel sommario (vedi Planner)','PhaseSection.tsx r.101; PhaseSection.less r.5'],
 ['Apertura fase','durate dichiarate nelle pagine','240ms apertura, 180ms chiusura, 80ms con movimento ridotto','motion.less, tokens.less'],
 ['Pagina Title row','pagina separata','assorbita qui','TitleItem.less'],
]))
write('Accordion.dc.html','Accordion','\n'.join(S))
