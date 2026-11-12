from comp import *
import html as _h
PL='features/planner/components/'
def vp(inner,theme,w,h,label=''):
    return phone(inner,theme,h,w,label)
def shell(main,theme_header=True):
    return f'<div class="site-shell">{header(True,guide=True)}<main class="site-main">{main}</main>{footer()}</div>'
def pct_card(desktop=True):
    share=f'<aside class="share-poster" aria-labelledby="sp"><div><h2 id="sp" class="share-poster__title">{L("planner.sharePoster.title")}</h2><p>{L("planner.sharePoster.text")}</p></div>{btn("dark",L("share.open"),"lg","","share-2")}</aside>' if desktop else ''
    mob='' if desktop else f'<button type="button" class="progress-card__share"><span class="progress-card__share-label">{icon("share-2")}{L("planner.sharePoster.title")}</span></button>'
    return (f'<section class="progress-card card card--panel on-panel"><div class="progress-card__main"><h1 class="section-title">{L("planner.progressHeading")}</h1>'
      f'<p class="progress-card__percent" aria-hidden="true"><span class="progress-card__percent-width">100%</span><span class="progress-card__percent-value">35%</span></p><p class="progress-card__count">{L("planner.watchedCount",done=12,total=34)}</p>{mob}'
      f'<div class="progress-card__footer"><p class="progress-card__note muted">{L("planner.storage.device")}</p>{btn("text",L("planner.toolbar.reset"),"","","rotate-ccw")}</div></div>{share}</section>')

def toast_demo():
    def t(title,act): return (f'<div class="toast toast--info" role="status"><span class="toast__badge" aria-hidden="true">{icon("check")}</span><div class="toast__text"><strong>{title}</strong></div>'
        f'{btn("panel",act,"sm","","","").replace("btn btn--panel","btn btn--panel toast__action")}<button type="button" class="toast__close" aria-label="{L("common.close")}">{icon("x")}</button></div>')
    return '<div style="display:flex;flex-direction:column;gap:var(--sp-2);width:min(440px,100%)">'+t(L("planner.list.added"),L("common.undo"))+t(L("planner.list.savedOnDevice"),L("nav.login"))+'</div>'
def next_card():
    return (f'<section class="next-card card"><h2 class="section-title">{L("planner.next.heading")}</h2><div class="next-card__swap"><p class="next-card__title" lang="en">Iron Man 2</p>'
      f'<p class="next-card__meta">{L("planner.types.film")}, 2010, {L("catalog.phases.1")}</p></div>'
      f'<div class="next-card__actions">{btn("accent",L("planner.next.markWatched"),"lg","","check")}<a href="#" class="btn btn--text">{L("planner.next.details")}{icon("maximize-2")}</a></div></section>')
def strip(variant='card',open_=False):
    data=[(1,['watched']*5+['next']),(2,['todo']*5),(3,['todo']*6)]
    leg=''.join(f'<li><span class="phase-strip__swatch phase-strip__cell--{s}">{icon("play") if s=="next" else ""}</span>{L(k)}</li>' for s,k in [('watched','planner.strip.legendWatched'),('next','planner.strip.legendNext'),('todo','planner.strip.legendTodo')])
    cols=''.join('<div class="phase-strip__phase phase-strip__phase--size-%d"><div class="phase-strip__cells" aria-hidden="true">%s</div><p class="phase-strip__label"><span class="phase-strip__name">%s</span><span class="muted">%s</span></p></div>'%(len(c),''.join(f'<span class="phase-strip__cell phase-strip__cell--{x}">{icon("play") if x=="next" else ""}</span>' for x in c),L('planner.strip.phase',number=n),L('common.ofCount',done=c.count('watched'),total=len(c))) for n,c in data)
    head=L("planner.strip.heading",total=17)
    columns=f'<div class="phase-strip__columns">{cols}</div>'
    if variant=='acc':
        return (f'<section class="phase-strip card"><h2 class="phase-strip__toggle-heading"><button type="button" class="phase-strip__toggle" aria-expanded="{"true" if open_ else "false"}">{head}{CHEV}</button></h2>'
                f'<div class="phase-strip__body"{"" if open_ else " hidden"}><ul class="phase-strip__legend muted" aria-hidden="true">{leg}</ul>{columns}</div></section>')
    return f'<section class="phase-strip card"><div class="phase-strip__header"><h2 class="section-title">{head}</h2><ul class="phase-strip__legend muted" aria-hidden="true">{leg}</ul></div>{columns}</section>'
def search(query=''):
    return (f'<form class="planner-search" role="search"><label class="planner-search__field">{icon("search",None,2.4)}<input aria-label="{L("planner.search.label")}" type="search" placeholder="{L("planner.search.placeholder")}" value="{query}"/></label></form>')

def filters():
    fs=grp(L('planner.order.heading'),2,ch(L('planner.order.release'),'radio',True,name='vo')+ch(L('planner.order.chronological'),'radio',False,name='vo'))
    fs+=grp(L('planner.filters.type'),3,ch(L('planner.types.film'),'checkbox',True)+ch(L('planner.types.serie'),'checkbox',True)+ch(L('planner.types.special'),'checkbox',True))
    sws=f'<div class="filters-fields__switches">{sw(L("planner.filters.showAlternate"),True)}{sw(L("planner.filters.showUpcoming"),True)}</div>'
    return f'<section class="filters-card card"><div class="filters-card__header"><h2 class="filters-card__title">{L("planner.filters.heading")}</h2></div><div class="filters-fields">{fs}{sws}</div><p class="muted" role="status">{L("planner.filters.results",shown=34,total=34)}</p></section>'
def collapse(icon_only=False):
    lab=L('planner.toolbar.collapseAll')
    if icon_only: return btn('surface','','lg','','chevrons-down-up',f'aria-label="{lab}"')
    return btn('surface',lab,'lg','','chevrons-down-up')
def saga(rows_open=True):
    return (f'<section class="saga"><div class="saga__header"><h2 class="saga__title">{L("catalog.sagas.infinity")}</h2><p class="saga__count muted">{L("planner.watchedCount",done=12,total=34)}</p></div>'
      +phase(True,rows=row('Iron Man','%s, 2008'%L('planner.types.film'),True)+row('The Incredible Hulk','%s, 2008'%L('planner.types.film'),True)+row('Iron Man 2','%s, 2010'%L('planner.types.film')))
      +phase(False)+'</section>')
def mtool():
    return (f'<div class="mobile-toolbar"><button type="button" class="btn btn--surface btn--lg mobile-toolbar__filters" aria-haspopup="dialog"><span class="mobile-toolbar__label">{icon("list-filter")}{L("planner.filters.heading")}</span>'
      f'<span class="mobile-toolbar__count muted" aria-hidden="true">{L("planner.filters.resultsShort",shown=34,total=34)}</span></button>{collapse(True)}</div>')
def compact(v=12,m=34,nxt='Iron Man 2'):
    pct=round(v/m*100); n=L('planner.compact.nextUp').replace('{title}',f'<strong lang="en">{nxt}</strong>')
    return (f'<div class="compact-progress-wrap" data-visible="true"><div class="compact-progress-clip"><section class="compact-progress on-panel" role="status" aria-label="{L("planner.progressHeading")}">'
      f'<div class="compact-progress__row"><span class="compact-progress__count">{L("planner.watchedCount",done=v,total=m)}</span><span class="compact-progress__percent">{pct}%</span></div><progress value="{v}" max="{m}"></progress><p class="compact-progress__next">{n}</p></section></div></div>')
def desk_view(guide_open=True):
    body=(f'<div class="planner"><div class="planner__hero">{pct_card(True)}{next_card()}</div>{strip()}'
      f'<div class="planner__body"><div class="planner__rail"><div class="planner__rail-content">{compact()}{search()}{filters()}{collapse()}</div></div><div class="planner__list">{saga()}</div></div></div>')
    return shell(body)
def mob_view(guide_open=False):
    body=(f'<div class="planner"><div class="planner__hero">{pct_card(False)}{next_card()}</div>{strip("acc")}'
      f'<div class="planner__body">{search()}{mtool()}<div class="planner__list">{saga()}</div></div></div>')
    return shell(body)
def parts_table(path,only=None): return spec(PL+path,only)
S=[]
S.append(h1('Planner','La pagina principale: avanzamento, prossimo da vedere, guida, ricerca, filtri e l\'elenco delle saghe e delle fasi.'))
S.append(hdr('Pagina Planner (e il suo link condiviso): ordine delle regioni, comportamento su desktop e su mobile, stati, testi',
 'src/pages/PlannerPage/, src/features/planner/components/ (Planner, PlannerSummary, NextToWatch, PhaseStrip, GuideHelp, BackToTop, CompletionDialog, MergeChoiceDialog, PlannerSearch, PlannerFilters, FiltersFields, SagaSection, PhaseSection, TitleItem, MobileToolbar, CompactProgress, FloatingProgress, CollapseToggle)',
 'Navigation (intestazione, piè di pagina), Buttons, Accordion (fase, riga del titolo, guida), Switch e ChoiceGroup, Progress (CompactProgress, FloatingProgress), Badges (contatore filtri), System states (vuoti), Toast, Popup generici (azzeramento, condivisione)'))
S.append(sec('Desktop (da 64em)','Hero a due colonne (avanzamento su pannello scuro + prossimo da vedere), fascia delle fasi, poi l\'elenco a sinistra e una colonna fissa da 320px a destra (progress compatto, ricerca, filtri, comprimi tutto). Dati dimostrativi; testi veri dai file locale.',
  vp(desk_view(True),'light',1100,2360,'Chiaro')+vp(desk_view(False),'dark',1100,2210,'Scuro')))
S.append(sec('Mobile (sotto 40em)','Sotto il desktop l\'avanzamento mostra “Condividi” e “Fasi” come pulsanti, la fascia delle fasi è un accordion a sé dopo “Prossimo da guardare”, ricerca e barra strumenti (Filtri, comprimi tutto) passano sopra l\'elenco; i filtri si aprono in un foglio. In fondo compare la barra di avanzamento sticky, solo su mobile (pagina Progress).',
  vp(mob_view(False),'light',390,2230,'Chiaro')+vp(mob_view(False),'dark',390,2230,'Scuro')))
S.append(sec('Ordine delle regioni','',tbl(['#','Regione','Componente','Desktop','Mobile'],[
 ['1','Avanzamento','PlannerSummary (<code>.progress-card</code>)','sì, con scheda “Condividi”','sì, con pulsanti Condividi e Fasi'],
 ['2','Prossimo da vedere','NextToWatch (<code>.next-card</code>)','sì','sì'],
 ['3','Fascia delle fasi','PhaseStrip (<code>.phase-strip</code>)','scheda a sé, sempre aperta','accordion a sé (chiuso all\'inizio), dopo “Prossimo da guardare”'],
 ['4','Guida “?”','GuideHelp, portale su <code>#header-help-slot</code> (AppHeader.tsx r.21; Planner.tsx r.337)','header, a sinistra del pulsante del tema, solo su <code>/</code> e <code>/s/:code</code>','header, a sinistra di Menu'],
 ['—','Scorciatoie “Ultimo visto” e “Torna su”','BackToTop (Planner.tsx r.343)','due pillole centrate in basso (“Torna su” dopo 1,5 schermate; “Ultimo visto” se la riga non è in vista)','idem, alzate sopra la barra solo quando è attaccata al bordo basso'],
 ['5','Ricerca, filtri, comprimi tutto','PlannerSearch, PlannerFilters, CollapseToggle','colonna fissa a destra (320px, sticky)','ricerca + MobileToolbar + FiltersSheet'],
 ['6','Elenco','SagaSection > PhaseSection > TitleItem (o ChronologicalList)','a sinistra','sotto'],
 ['7','Barra fluttuante','FloatingProgress (r.312)','no (<code>{!isDesktop &amp;&amp; …}</code>, Planner.tsx r.317)','sì: <code>position: sticky</code> in basso nella sezione, angoli <code>@radius-block</code>, si ferma prima del footer'],
])))
S.append(sec('Guida, scorciatoie e completamento','Non sono più blocchi della pagina: il “?” sta nell\'header e apre la guida in un popup, ci sono due pillole flottanti (“Ultimo visto”, “Torna su”), una casella tri-stato su ogni fase e un popup al 100%. Descritti nelle sezioni “implementata” in fondo a questa pagina (main 456fa17 per le voci 21b, 30b, 31, 32, 33 e la casella della fase; c520ab1 per il resto).',''))
S.append(sec('Parti proprie di questa schermata','Non sono componenti condivisi: esistono solo qui, quindi i loro valori stanno qui.',''))
for title,path,only in [
 ('Avanzamento (PlannerSummary)','PlannerSummary/PlannerSummary.less',None),
 ('Guida (GuideHelp)','GuideHelp/GuideHelp.less',None),
 ('Torna all\'inizio (BackToTop)','BackToTop/BackToTop.less',None),
 ('Completamento (CompletionDialog)','CompletionDialog/CompletionDialog.less',None),
 ('Unione dei planner (MergeChoiceDialog)','MergeChoiceDialog/MergeChoiceDialog.less',None),
 ('Prossimo da vedere (NextToWatch)','NextToWatch/NextToWatch.less',None),
 ('Fascia delle fasi (PhaseStrip)','PhaseStrip/PhaseStrip.less',None),
 ('Ricerca (PlannerSearch)','PlannerSearch/PlannerSearch.less',None),
 ('Filtri (PlannerFilters)','PlannerFilters/PlannerFilters.less',None),
 ('Barra strumenti mobile (MobileToolbar)','MobileToolbar/MobileToolbar.less',None),
 ('Saga e elenco (SagaSection)','SagaSection/SagaSection.less',None),
]:
    S.append(sec(title,'',parts_table(path,only)))
S.append(sec('Toast “Aggiunto alla tua lista”','Segnare o togliere un titolo visto, da una riga dell\'elenco o da “Prossimo da vedere”, mostra un toast in basso al centro (componente Toast, <code>id</code> <code>list-change</code>, 8 s perché ha un\'azione). Con account: “Aggiunto alla tua lista” / “Rimosso dalla tua lista” con <b>Annulla</b>. Da ospite: segnare dà “Salvato su questo dispositivo” con <b>Accedi</b> al posto di Annulla.',
  both('480px',toast_demo(),'Account: aggiunto · ospite: aggiunto')
  +tbl(['Lingua','planner.list.added','planner.list.removed','planner.list.savedOnDevice','common.undo','nav.login'],[[l]+[L(k,l) for k in ('planner.list.added','planner.list.removed','planner.list.savedOnDevice','common.undo','nav.login')] for l in ('it','en','fr','es','de')])
  +'<p class="dc-src">Valori, durata e comportamento: pagina Toast, sezione “Aggiunto o rimosso dalla lista”. Fonte: <code>useWatched.ts</code> r.86-116, chiamato da <code>Planner.tsx</code> r.180 (<code>onMarkWatched</code>) e r.274, r.282 (<code>onToggleTitle</code>).</p>'))
S.append(sec('Layout della pagina','',spec('pages/PlannerPage/PlannerPage.less')+spec('features/planner/components/Planner/Planner.less') if False else spec('pages/PlannerPage/PlannerPage.less')))
S.append(sec('Testi nelle 5 lingue','',tbl(['Lingua','planner.progressHeading','planner.next.heading','planner.next.markWatched','planner.next.details','planner.search.placeholder','planner.filters.heading','planner.toolbar.collapseAll'],[[l]+[L(k,l) for k in ('planner.progressHeading','planner.next.heading','planner.next.markWatched','planner.next.details','planner.search.placeholder','planner.filters.heading','planner.toolbar.collapseAll')] for l in LANGS])))
S.append(prima_dopo([
 ['Come leggere il planner','nota sotto la pagina, prima del footer','popup aperto dal “?” accanto alla ricerca; invito alla prima visita (implementata, c520ab1)','GuideHelp.tsx; Planner.tsx r.216?, r.244?'],
 ['Completamento','—','popup “Multiverso completato” una volta (implementata, c520ab1)','CompletionDialog.tsx'],
 ['Scorciatoie','—','“Vai all\'ultimo titolo visto”, “Torna all\'inizio”, “Segna tutta la fase come vista” (implementate, c520ab1; l’ultima oggi è la casella nel sommario della fase, main 456fa17)','PlannerSummary.tsx; BackToTop.tsx; PhaseSection.tsx'],
 ['Regioni','descritte con valori scritti nella pagina','ordine e visibilità dal codice; valori solo nei .less citati','Planner.tsx'],
 ['Componenti','ridefiniti nella schermata','usati dalle pagine B; qui solo le parti proprie','—'],
]))
write('Planner.dc.html','Planner','\n'.join(S))
