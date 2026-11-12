from comp import *
import sys
PL='features/planner/components/'
def shell(main): return f'<div class="site-shell">{header(True)}<main class="site-main">{main}</main>{footer()}</div>'
def eye(shown,lab): return f'<button type="button" class="spoiler-box__eye" aria-expanded="{"true" if shown else "false"}" aria-label="{lab}">{icon("eye-off" if shown else "eye")}</button>'
def sbox(title,cls,body,show=None,hidden=True,intro=''):
    eyeb=eye(not hidden,show) if show else ''
    hid=' data-hidden="true" aria-hidden="true"' if (show and hidden) else ''
    cont=f'<div class="spoiler-box__content" role="region"{hid}>{body}</div>' if body else ''
    return f'<article class="spoiler-box {cls}"><div class="spoiler-box__head"><h3 class="section-title">{title}</h3>{eyeb}</div>{intro}{cont}</article>'
def missing(txt,ic='info',tone='dark'): return f'<p class="missing-note missing-note--{tone}">{icon(ic)}{txt}</p>'
def item(txt,src=True): return f'<li class="spoiler-item"><span>{txt}</span>'+(f'<button type="button" class="spoiler-item__source" aria-label="{L("details.keyScenes.source")}">{icon("info")}</button>' if src else '')+'</li>'
SCN=['Tony Stark costruisce la prima armatura in una grotta','Il confronto finale sul tetto'] # dati dimostrativi
def episodes():
    return '<ol class="episodes">'+''.join(f'<li class="episode"><button type="button" class="episode__head"><span class="episode__number">E{i}</span><span class="episode__title{" is-empty" if not t else ""}">{t or L("details.plot.noEpisodeTitle")}</span>{CHEV}</button></li>' for i,t in [(1,'Pilot'),(2,''),(3,'Episodio')])+'</ol>'
def film(state='loaded',series=False):
    back=f'<div class="film__bar"><button type="button" class="film__back">{icon("arrow-left")}{L("details.back")}</button></div>'
    if state=='skeleton':
        return back+'<div class="film__main film-skeleton" aria-hidden="true"><div class="film-skeleton__hero skeleton"></div><div class="film-skeleton__body"><div class="film-skeleton__lines"><span class="skeleton"></span><span class="skeleton"></span><span class="skeleton film-skeleton__short"></span></div><div class="film-skeleton__lines"><span class="skeleton"></span><span class="skeleton"></span><span class="skeleton"></span></div></div><div class="film-skeleton__spoiler skeleton"></div></div>'
    wtw=(f'<section class="where-to-watch"><div class="where-to-watch__panel" data-open="true"><div class="where-to-watch__head"><div class="where-to-watch__title"><h2>{L("details.watch.heading")}</h2></div>'
         f'<button type="button" class="where-to-watch__toggle" aria-label="{L("details.watch.toggle")}" aria-expanded="true">{icon("chevron-down")}</button>'
         f'<div class="select-field select-field--popover"><button type="button" class="select-field__trigger">{icon("globe")}<span>Italia</span>{CHEV}</button></div></div>'
         f'<div class="where-to-watch__body"><ul class="where-to-watch__list"><li>Disney+</li><li>Apple TV</li></ul><a class="where-to-watch__all" href="#">{L("details.watch.all")}{icon("external-link")}</a></div></div></section>')
    trailer=f'<button type="button" class="btn btn--accent btn--lg trailer-button"><span class="trailer-button__disc">{icon("play")}</span>{L("details.trailer.open")}</button>'
    hero=(f'<div class="film__hero"><div class="film__cover" aria-hidden="true"></div><div class="film__cover-missing">{missing(L("details.missing.cover"),"image-off")}</div>'
          f'<div class="film__hero-inner"><div class="film__heading"><h1 lang="en">Iron Man</h1><div class="film__meta"><span>30 aprile 2008</span><span>{L("details.minutes",count=126)}</span></div></div>'
          f'<div class="film__glass on-panel">{trailer}{wtw}</div></div></div>')
    cast=''.join(f'<li><span>{n}</span><small>{c}</small></li>' for n,c in [('Robert Downey Jr.','Tony Stark'),('Gwyneth Paltrow','Pepper Potts')])
    body=(f'<div class="film__body"><div class="film__story"><section class="synopsis"><h2 class="visually-hidden">{L("details.synopsis")}</h2><p>{L("details.noSynopsis")}</p></section>'
          f'<section class="film__credit"><h2>{L("details.director")}</h2><p>Jon Favreau</p></section></div><section class="film__cast"><h2>{L("details.cast")}</h2><ul>{cast}</ul></section></div>')
    plot=sbox(L('details.plot.heading'),'spoiler-box--plot',episodes(),L('details.plot.show')) if series else sbox(L('details.plot.heading'),'spoiler-box--plot','',None,intro=missing(L('details.missing.plot')))
    pc=sbox(L('postCredits.heading'),'spoiler-box--credits','',None,intro=f'<p class="spoiler-note">{L("postCredits.none")}</p>')
    eggs=sbox(L('details.easterEggs.heading'),'spoiler-box--eggs','',None,intro=missing(L('details.missing.eggs')))
    scenes=sbox(L('details.keyScenes.heading'),'spoiler-box--scenes',f'<ul class="spoiler-list spoiler-list--grid">{"".join(item(s) for s in SCN)}</ul>',L('details.keyScenes.show'))
    zone=(f'<section class="spoiler-zone"><div class="spoiler-zone__stripes" aria-hidden="true"></div><div class="spoiler-zone__inner"><h2>{L("details.spoilerZone")}</h2><div class="spoiler-zone__boxes"><div class="spoiler-zone__grid">{plot}<div class="spoiler-zone__side">{pc}{eggs}</div></div>{scenes}</div></div></section>')
    return back+f'<div class="film__main"><section class="film__card">{hero}{body}</section>{zone}</div>'
def view(**k): return shell(f'<div class="film">{film(**k)}</div>')
def vp(inner,theme,w,h,label=''): return phone(inner,theme,h,w,label)
H=dict(d=int(sys.argv[1]) if len(sys.argv)>1 else 1800)
S=[]
S.append(h1('Pagina Film','La scheda di un titolo: copertina, trailer, dove guardarlo, sinossi, cast e la zona spoiler.'))
S.append(hdr('Pagina del titolo (/titolo/:id): barra di ritorno, scheda con copertina, trailer, dove guardare, sinossi, regia, cast; zona spoiler con trama, scene post credits, easter egg, scene chiave; stato di caricamento e dati mancanti',
 'src/pages/TitlePage/, src/features/planner/components/ (TitleDetailsPanel, WithTitleDetails, TitleDetailsSkeleton, TrailerButton, WhereToWatch, SynopsisSection, PlotSection, PostCreditsInfo, EasterEggs, KeyScenes, MissingNote)',
 'Navigation, Buttons (accent, primary), Select, Tooltip e InfoTip, Spoiler box, Accordion (episodi), System states (pagina non trovata), Popup generici (Modal del trailer), Progress (skeleton)'))
S.append(sec('Desktop','Scheda con copertina a tutta larghezza e vetro con trailer e “Dove guardare”; sotto sinossi, regia e cast; poi la zona spoiler. Dati dimostrativi; la copertina viene da TMDB, nel canvas si vede lo stato “copertina non disponibile”. La sinossi mostra il testo vero di “non disponibile” (<code>details.noSynopsis</code>).',
 vp(view(),'light',1100,2090,'Chiaro')+vp(view(),'dark',1100,2090,'Scuro')))
S.append(sec('Mobile','Sotto i 40em “Dove guardare” si piega dietro la freccia fino a che non la premi; le colonne passano in pila.',
 vp(view(series=True),'light',390,2700,'Serie TV: la trama mostra gli episodi')+vp(view(state='skeleton'),'dark',390,1810,'Caricamento (skeleton)')))
S.append(sec('Ordine delle regioni','',tbl(['#','Regione','Componente','Quando non c\'è il dato'],[
 ['1','Barra di ritorno','<code>.film__back</code> (<code>details.back</code>)','torna indietro; a visita diretta va al planner'],
 ['2','Copertina e titolo','<code>.film__hero</code>','MissingNote: <code>details.missing.cover</code>, <code>details.missing.meta</code>'],
 ['3','Trailer','TrailerButton + Modal','MissingNote: <code>details.missing.trailer</code>'],
 ['4','Dove guardare','WhereToWatch (SelectField + elenco)','nota “non trovato in questo Paese”: <code>details.watch.none</code>; errore con Riprova'],
 ['5','Sinossi, regia','SynopsisSection, <code>.film__credit</code>','<code>details.noSynopsis</code>, <code>details.missing.director</code>'],
 ['6','Cast','<code>.film__cast</code>','<code>details.missing.cast</code>'],
 ['7','Zona spoiler','Spoiler box: Trama, Scene post credits, Easter egg, Scene chiave','<code>details.missing.spoilers</code> se manca tutto'],
])))
S.append(sec('Testi mancanti nelle 5 lingue','Ogni dato mancante ha riga con icona e testo, mai un vuoto (<code>MissingNote</code>).',
 tbl(['Lingua','details.missing.cover','details.missing.trailer','details.missing.director','details.missing.cast','details.missing.spoilers','details.noSynopsis'],[[l]+[L(k,l) for k in ('details.missing.cover','details.missing.trailer','details.missing.director','details.missing.cast','details.missing.spoilers','details.noSynopsis')] for l in LANGS])))
S.append(sec('Dove guardare: pulsante nel vetro (sotto 40em)','Sotto 40em l\'elenco sta chiuso dietro la freccia (44px, <code>aria-expanded</code>, <code>aria-controls</code>); da 40em è sempre aperto, e resta aperto anche quando non ci sono servizi per il Paese. Chiave <code>details.watch.toggle</code> (<code>WhereToWatch.tsx</code> r.68).',f'<div class="dc-scroll">{tbl(["Chiave"]+["it","en","fr","es","de"],[["<code>details.watch.toggle</code>"]+[L("details.watch.toggle",l) for l in LANGS]])}</div>'))
S.append(sec('Parti proprie di questa schermata','Esistono solo qui: i loro valori stanno qui.',''))
for t_,p_ in [('Pagina (TitleDetailsPanel)','TitleDetailsPanel/TitleDetailsPanel.less'),('Dove guardare (WhereToWatch)','WhereToWatch/WhereToWatch.less'),('Trailer (TrailerButton)','TrailerButton/TrailerButton.less'),('Sinossi (SynopsisSection)','SynopsisSection/SynopsisSection.less'),('Trama (PlotSection)','PlotSection/PlotSection.less'),('Scene post credits (PostCreditsInfo)','PostCreditsInfo/PostCreditsInfo.less'),('Easter egg (EasterEggs)','EasterEggs/EasterEggs.less'),('Scene chiave (KeyScenes)','KeyScenes/KeyScenes.less'),('Dato mancante (MissingNote)','MissingNote/MissingNote.less'),('Caricamento (TitleDetailsSkeleton)','TitleDetailsSkeleton/TitleDetailsSkeleton.less')]:
    S.append(sec(t_,'',spec(PL+p_)))
S.append(sec('Solo canvas · scartata','Colonna fissa (sticky) con la scheda “Informazioni” (anno, durata, regia, fase) o con la colonna di testo mentre si scorre il cast: decisione presa, non si implementa. Il codice non ha nessuna regola <code>position: sticky</code> in <code>TitleDetailsPanel.less</code> e resta così: la colonna sinistra va bene com\'è.',''))
S.append(prima_dopo([
 ['Altezze dei box spoiler','460 / 262 / 188 / 154 / 80 px scritte nella pagina','valori dal .less, citati sopra','TitleDetailsPanel.less, SpoilerBox.less'],
 ['Pagina “ritocchi”','pagina separata','assorbita qui','—'],
 ['Colonna sticky','descritta come decisione','scartata: solo canvas, non va implementata','TitleDetailsPanel.less'],
 ['Spoiler box','ridefinito nella pagina','usato dalla pagina Spoiler box','SpoilerBox.tsx'],
]))
write('Pagina Film.dc.html','Pagina Film','\n'.join(S))
