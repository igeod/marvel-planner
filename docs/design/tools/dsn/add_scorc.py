from addlib import *
_p={}; exec(open(f'{S}/dsn/p_planner.py').read().split('\nS=[]')[0],_p)
_f={}; exec(open(f'{S}/dsn/p_film.py').read().split('\nH=dict')[0],_f)
phone=_p['phone']; compact=_p['compact']; search=_p['search']; filters=_p['filters']; shell=_p['shell']
LAST=T('Ultimo visto','Last watched','Dernier vu','Último visto','Zuletzt gesehen')
TOP=T('Torna su','Back to top','Haut de page','Volver arriba','Nach oben')
CSS='''<style>
.sc{position:fixed;z-index:10;left:50%;transform:translateX(-50%);display:flex;gap:var(--sp-2)}
.sc .btn{background:var(--panel);color:var(--on-dark);box-shadow:var(--shadow-pop);min-height:var(--hit);padding:0 var(--sp-4);gap:var(--sp-2);white-space:nowrap}
.sc .btn svg{width:20px;height:20px}
</style>'''
def pill(ic,t): return f'<button type="button" class="btn btn--sm">{icon(ic)}{esc(t)}</button>'
def pills(last=True,top=True,bottom='bottom:calc(var(--floating-progress-clearance) + var(--sp-4))'):
    return f'<div class="sc" style="{bottom}">'+(pill('locate-fixed',LAST['it']) if last else '')+(pill('arrow-up',TOP['it']) if top else '')+'</div>'
def fpbar():
    return (f'<div class="floating-progress on-panel" data-visible="true"><div class="floating-progress__row"><span class="floating-progress__label">{L("planner.watchedCount",done=12,total=34)}</span>'
            f'<span class="floating-progress__percent">35%</span></div><progress value="12" max="34"></progress></div>')
RW=[('Iron Man',1),('The Incredible Hulk',1),('Iron Man 2',1),('Thor',1),('The Avengers',1),('Iron Man 3',0),('Thor: The Dark World',0)]
def lst(found=None):
    rows=''
    for i,(n,w) in enumerate(RW):
        if found is not None: w=1 if i<2 else 0
        r=row(n,'%s, 20%02d'%(L('planner.types.film'),8+i),bool(w))
        if found is not None and n=='The Incredible Hulk':
            a=found
            r=r.replace('class="title-row"',f'class="title-row title-row--found" style="box-shadow:0 0 0 3px color-mix(in srgb, var(--highlight) {a}%, transparent);background-image:linear-gradient(color-mix(in srgb, var(--highlight) {round(a*0.22)}%, transparent),color-mix(in srgb, var(--highlight) {round(a*0.22)}%, transparent))"',1)
        rows+=r
    return f'<section class="saga"><details class="phase card" open="open"><summary class="phase__summary"><span class="phase__heading"><h3 class="phase__name">{L("catalog.phases.1")}</h3><span class="phase__years muted">2008 – 2012</span></span><span class="phase__count">{L("common.ofCount",done=5,total=8)}</span>{CHEV}</summary><ol class="phase__titles">{rows}</ol></details></section>'
def body(mobile,found=None):
    if mobile: return f'<div class="planner"><div class="planner__body"><div class="planner__list">{lst(found)}</div></div></div>'
    return f'<div class="planner"><div class="planner__body"><div class="planner__rail"><div class="planner__rail-content">{compact()}{search()}{filters()}</div></div><div class="planner__list">{lst(found)}</div></div></div>'
def sc_(theme,mobile,label,pl,bar,found=None,h=None):
    inner=CSS+f'<div class="site-shell"><main class="site-main">{body(mobile,found)}</main></div>'+pl+(fpbar() if bar else '')
    return phone(inner,theme,h or (600 if mobile else 520),390 if mobile else 1100,label)
def grid(*c): return '<div class="dc-row" style="align-items:flex-start">'+''.join(c)+'</div>'
def film_scene(theme):
    inner=CSS+_f['view']()+'<script>addEventListener("load",function(){scrollTo(0,760)})</script>'+pills(False,True,'bottom:calc(var(--sp-4) + env(safe-area-inset-bottom, 0px))')
    return phone(inner,theme,640,390,'Pagina film · mobile · '+('chiaro' if theme=='light' else 'scuro'))

DEC=[
 '<b>Forma:</b> la variante B. Due pillole <code>.btn.btn--sm</code> affiancate, centrate, con icona e testo. Il link “Vai all’ultimo titolo visto” nella scheda dei progressi si toglie (PlannerSummary.tsx r.83-87).',
 '<b>Testi:</b> “Ultimo visto” e “Torna su”. “Inizio” era ambiguo (“start”, quasi “inizia”). Solo la freccia l’ho scartata: accanto a “Ultimo visto” sbilancia la coppia e non dice che cosa fa. Si riusano le chiavi <code>planner.jump.last</code> e <code>planner.jump.top</code> cambiando il testo: nessuna chiave nuova.',
 '<b>Quando compaiono:</b> “Torna su” dopo 1,5 schermate (come oggi). “Ultimo visto” solo se c’è un titolo visto <b>e la sua riga non è nella finestra</b>; se la fase è chiusa, la riga non è visibile e il pulsante c’è.',
 '<b>Animazione:</b> entrano con dissolvenza e salita da 16px (<code>--dur-enter</code>, <code>--ease-out</code>), la seconda con ritardo <code>--stagger-step</code>; escono in <code>--dur-ui</code>, come la barra fluttuante (motion.less r.645-660). Con movimento ridotto solo opacità.',
 '<b>Dopo il salto:</b> la riga trovata si evidenzia per 2,4 secondi (anello e velo <code>--highlight</code>), poi si dissolve. Il pulsante “Ultimo visto” scompare da sé, perché la riga adesso è visibile.',
 '<b>Posizione:</b> centrate, <code>bottom: calc(var(--floating-progress-clearance) + var(--sp-4))</code> (oggi <code>--sp-3</code>). Su desktop la barra fluttuante non c’è (indicazione di Diego, 12 novembre), quindi stanno a <code>--sp-4</code> dal bordo.',
 '<b>Toast (superata dalla proposta “Pillole flottanti sopra i toast”):</b> sotto un toast le pillole si nascondono (stessa tecnica di Toast.less r.8: <code>body:has(.toasts .toast)</code>); il toast ha la precedenza.',
 '<b>Pagina del film:</b> solo “Torna su”, stesso componente, senza riserva per la barra.',
]
add('Planner',
 block('Scorciatoie flottanti: “Ultimo visto” e “Torna su” (rivede 21 e 22)',PROP+' '+PREF,
  'Sostituisce il link nella scheda dei progressi e il cerchio con la sola freccia. Scelta dalla pagina di confronto (variante B), con le regole sotto. Il blocco “implementata” qui sopra descrive quello che fa main oggi.',
  '<div class="dc-fl">Decisioni</div>'+ul(DEC)
  +grid(sc_('light',True,'Mobile · chiaro',pills(),True),sc_('dark',True,'Mobile · scuro',pills(),True))
  +grid(sc_('light',False,'Desktop · chiaro · senza barra',pills(bottom='bottom:var(--sp-4)'),False))
  +'<div class="dc-fl">Evidenziazione dopo il salto (The Incredible Hulk: ultimo visto)</div>'
  +grid(sc_('light',True,'Subito dopo lo scroll',pills(False,True),True,found=100,h=470),sc_('light',True,'A metà dissolvenza (circa 2 s)',pills(False,True),True,found=50,h=470),sc_('dark',True,'Scuro · subito dopo lo scroll',pills(False,True),True,found=100,h=470))
  +tbl(['Aspetto','Valore','Note'],[
   ['“Torna su”: visibilità','<code>scrollY &gt; 1,5 × innerHeight</code>','come BackToTop.tsx r.8-17'],
   ['“Ultimo visto”: visibilità','<code>last</code> esiste e riga <code>#title-{id}</code> fuori dalla finestra (<code>IntersectionObserver</code>) o fase chiusa; mai con filtri che escludono il titolo (<code>useJumpToLastWatched</code> restituisce <code>null</code>)','la riga si osserva dopo il montaggio; senza supporto a IntersectionObserver il pulsante resta sempre visibile'],
   ['Ingresso','opacità 0→1 e <code>translate: 0 16px → none</code>, <code>--dur-enter</code>, <code>--ease-out</code>; seconda pillola in ritardo di <code>--stagger-step</code>','<code>@starting-style</code> come la barra'],
   ['Uscita','opacità e <code>translate</code>, <code>--dur-ui</code>, <code>display</code> con <code>allow-discrete</code>','motion.less r.645-660'],
   ['Movimento ridotto','solo opacità; nessun ritardo (<code>--stagger-step: 0ms</code>)','token già ridotti'],
   ['Salto','scroll al centro (<code>block: "center"</code>), fase aperta prima se chiusa (420 ms), il focus va al primo controllo della riga','già così: useJumpToLastWatched.ts r.27-33'],
   ['Evidenziazione','classe <code>title-row--found</code> alla fine dello scroll (<code>scrollend</code>, con attesa massima di 700 ms): anello <code>0 0 0 3px</code> in <code>--highlight</code> e velo dello stesso colore al 22% (valore senza token); resta pieno 1,6 s e si dissolve in 0,8 s; classe tolta a fine animazione','un secondo salto riparte da capo; con movimento ridotto l’anello è fisso per 2,4 s senza dissolvenza'],
   ['Toast','pillole nascoste finché c’è un <code>.toast</code>','<code>body:has(.toasts .toast)</code>'],
   ['Posizione','centrate; <code>bottom: calc(var(--floating-progress-clearance) + var(--sp-4))</code>; <code>z-index: 10</code> (sotto toast 20)','se la voce 18 si fa (barra sticky), la riserva cambia con la barra'],
  ])
  +'<div class="dc-fl">Testi nelle 5 lingue (chiavi esistenti, testo nuovo)</div>'+txt([('planner.jump.last',LAST),('planner.jump.top',TOP)])
  +pd([
   ['Ultimo visto','link <code>btn--text</code> nella scheda dei progressi, sempre visibile in cima','pillola flottante, solo se la riga non si vede; anello sulla riga dopo il salto','PlannerSummary.tsx r.83-87; useJumpToLastWatched.ts; nuovo componente delle scorciatoie'],
   ['Torna su','cerchio 44px con la sola freccia, a destra','pillola con freccia e “Torna su”, centrata, animata','BackToTop.tsx; BackToTop.less r.6-50'],
   ['Etichette','“Vai all’ultimo titolo visto”, “Torna all’inizio”','“Ultimo visto”, “Torna su” (il testo visibile è il nome accessibile)','src/locales'],
   ['Film','nessuna scorciatoia','“Torna su” senza riserva per la barra','TitleDetailsPanel'],
  ],sub='Per ogni voce: com’è su main c520ab1 (prima), che cosa decide questa pagina (dopo), file.')
  +'<div class="dc-fl">Scartate</div>'+ul(['Pillola doppia a sinistra: un solo oggetto, ma due azioni che sembrano una.','Icone dentro la barra fluttuante: non descrittive, e spariscono col piè di pagina.','Comparsa solo risalendo: meno scopribile; resta come ottimizzazione se le pillole risultano invadenti.'])))
add('Pagina Film',
 block('“Torna su” sulla pagina del film',PROP,
  'La pagina dei dettagli è lunga (sinossi, cast, zona spoiler): serve la stessa scorciatoia del planner, senza “Ultimo visto”. Stesso componente, stessa soglia (1,5 schermate), stessa animazione; sotto i 64em non c’è la barra dell’avanzamento, quindi <code>bottom: calc(var(--sp-4) + env(safe-area-inset-bottom, 0px))</code>. Sul desktop resta centrata come nel planner.',
  grid(film_scene('light'),film_scene('dark'))
  +pd([['Scorciatoia','assente','“Torna su” flottante dopo 1,5 schermate','TitleDetailsPanel; componente delle scorciatoie con <code>showLast=false</code> e <code>hasBar=false</code>']],sub='Vedi la pagina Planner per regole e animazione.')))
