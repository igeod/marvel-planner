from addlib import *
import html as _h
# funzioni di scena dal generatore del Planner (solo le definizioni, senza scrivere la pagina)
_ns={}
exec(open(f'{S}/dsn/p_planner.py').read().split('\nS=[]')[0],_ns)
shell=_ns['shell']; compact=_ns['compact']; search=_ns['search']; filters=_ns['filters']; phone=_ns['phone']

KS=('planner.jump.lastShort','planner.jump.topShort')
SHORT={'planner.jump.lastShort':dict(it='Ultimo visto',en='Last watched',fr='Dernier vu',es='Último visto',de='Zuletzt gesehen'),
       'planner.jump.topShort':dict(it='Inizio',en='Top',fr='Haut',es='Inicio',de='Nach oben')}
def S_(k,lang='it'): return esc(SHORT[k][lang])

CSS='''<style>
html{scroll-behavior:auto}
.sc{position:fixed;z-index:10;display:flex;gap:var(--sp-2)}
.sc .btn{background:var(--panel);color:var(--on-dark);box-shadow:var(--shadow-pop);min-height:var(--hit);padding:0 var(--sp-4);gap:var(--sp-2);white-space:nowrap}
.sc .btn svg{width:20px;height:20px}
.sc--seg{gap:0;background:var(--panel);border-radius:var(--r-pill);box-shadow:var(--shadow-pop)}
.sc--seg .btn{box-shadow:none;background:transparent}
.sc--seg .btn+.btn{border-left:1px solid var(--raised-3);border-radius:0 var(--r-pill) var(--r-pill) 0}
.sc--seg .btn:first-child{border-radius:var(--r-pill) 0 0 var(--r-pill)}
.sc.is-hidden{opacity:0;transform:translateY(var(--sp-4));pointer-events:none}
.dock{display:flex;align-items:center;gap:var(--sp-2)}
.dock .ico{display:grid;place-items:center;width:var(--hit);height:var(--hit);border-radius:var(--r-pill);background:var(--panel-2);color:var(--on-dark);border:0;pointer-events:auto}
.dock .ico svg{width:20px;height:20px}
.floating-progress__row{align-items:center}
.sc-fp{pointer-events:none}
</style>'''

def lastbtn(lang='it'): return btn('','%s'%S_(KS[0],lang),'sm','','locate-fixed')
def topbtn(lang='it'): return btn('','%s'%S_(KS[1],lang),'sm','','arrow-up')
def fp(extra='',h=''):
    return (f'<div class="floating-progress on-panel" data-visible="true"><div class="floating-progress__row"><span class="floating-progress__label">{L("planner.watchedCount",done=12,total=34)}</span>'
            f'<span class="dock"><span class="floating-progress__percent">35%</span>{extra}</span></div><progress value="12" max="34"></progress></div>')
RW=[('Iron Man',1),('The Incredible Hulk',1),('Iron Man 2',1),('Thor',1),('The Avengers',1),('Iron Man 3',0),('Thor: The Dark World',0),('Captain America: The Winter Soldier',0)]
def lst():
    rows=''.join(row(n,'%s, 20%02d'%(L('planner.types.film'),8+i),bool(w)) for i,(n,w) in enumerate(RW))
    ph=lambda: f'<details class="phase card" open="open"><summary class="phase__summary"><span class="phase__heading"><h3 class="phase__name">{L("catalog.phases.1")}</h3><span class="phase__years muted">2008 – 2012</span></span><span class="phase__count">{L("common.ofCount",done=5,total=8)}</span>{CHEV}</summary><ol class="phase__titles">{rows}</ol></details>'
    return f'<section class="saga">{ph()}{ph()}</section>'
def scene_body(mobile):
    if mobile:
        return f'<div class="planner"><div class="planner__body"><div class="planner__list">{lst()}</div></div></div>'
    return (f'<div class="planner"><div class="planner__body"><div class="planner__rail"><div class="planner__rail-content">{compact()}{search()}{filters()}</div></div>'
            f'<div class="planner__list">{lst()}</div></div></div>')
def scene(floating,theme,mobile,label,bar=True,h=None,desk_bar=False):
    w=390 if mobile else 1100
    h=h or (640 if mobile else 560)
    inner=CSS+f'<div class="site-shell"><main class="site-main">{scene_body(mobile)}</main></div>'+floating
    if mobile and bar: inner+=fp()
    if not mobile: inner+=fp()
    return phone(inner,theme,h,w,label)
BOT='bottom:calc(var(--floating-progress-clearance) + var(--sp-3))'
DBOT='bottom:calc(var(--floating-progress-height) + var(--floating-progress-gap) + var(--sp-3))'
LC='left:calc((100% - 352px)/2)'   # centro della colonna dell'elenco (rail 320px + spazio)
def A_(mobile):
    return f'<button type="button" class="back-to-top" aria-label="{L("planner.jump.top")}">{icon("arrow-up")}</button>'
def B_(mobile,hidden=False):
    pos=(f'left:50%;transform:translateX(-50%);{BOT}' if mobile else f'left:50%;transform:translateX(-50%);{DBOT}')
    return f'<div class="sc{" is-hidden" if hidden else ""}" style="{pos}">{lastbtn()}{topbtn()}</div>'
def C_(mobile):
    pos=(f'left:var(--sp-4);{BOT}' if mobile else f'left:var(--sp-6);{DBOT}')
    return f'<div class="sc sc--seg" role="group" style="{pos}">{lastbtn()}{topbtn()}</div>'
def D_dock():
    return (f'<button type="button" class="ico" aria-label="{L("planner.jump.last")}" title="{L("planner.jump.last")}">{icon("locate-fixed")}</button>'
            f'<button type="button" class="ico" aria-label="{L("planner.jump.top")}" title="{L("planner.jump.top")}">{icon("arrow-up")}</button>')
def scene_D(theme,mobile,label):
    w=390 if mobile else 1100; h=640 if mobile else 560
    inner=CSS+f'<div class="site-shell"><main class="site-main">{scene_body(mobile)}</main></div>'+fp(D_dock())
    return phone(inner,theme,h,w,label)
def lab(t): return f'<div class="dc-fl">{t}</div>'
def grid(*c): return '<div class="dc-row" style="align-items:flex-start">'+''.join(c)+'</div>'

S_=S_  # noqa
P=[]
P.append(h1('Scorciatoie del planner','Cinque modi di rivedere “Vai all’ultimo titolo visto” e “Torna all’inizio”: dove stanno, come si leggono, quanto spazio tolgono. Tutte le scene sono vere pagine con il CSS dell’app (le scorciatoie fisse sono ancorate alla finestra della scena, come in produzione).'))
P.append(hdr('Proposte per riposizionare i due pulsanti di scorrimento del Planner: dove stanno, etichette, comparsa, rapporto con barra fluttuante e toast',
 'src/features/planner/components/ (BackToTop, PlannerSummary, FloatingProgress, Planner), src/features/planner/hooks/useJumpToLastWatched.ts',
 'Buttons (btn, btn--sm), Progress (FloatingProgress), Toast, Planner (rail dei filtri)','12 novembre 2026'))
P.append(sec('Che cosa non convince oggi','Letto dal codice (main '+COMMIT+') e dalle schermate del 12 novembre.',ul([
 '“Vai all’ultimo titolo visto” è un link di testo nella scheda dei progressi (PlannerSummary.tsx r.83-87?): sta in cima alla pagina, piccolo, e sparisce appena si scende, cioè quando serve.',
 '“Torna all’inizio” è un cerchio da 44px senza testo, <code>right: --sp-4</code>, <code>bottom: calc(var(--floating-progress-clearance) + var(--sp-3))</code> (BackToTop.less r.7-13). Su desktop, dove la barra fluttuante è centrata e <code>--floating-progress-clearance</code> vale 0, il cerchio cade sopra la colonna destra dei filtri, già la zona più affollata; in scuro il cerchio <code>--panel</code> (#3a4260) è poco distinto dallo sfondo.',
 'I due pulsanti non si somigliano né nella posizione né nella forma: uno è un link, l’altro un cerchio. Chi vede il cerchio non sa che c’è anche l’altro.'])))
P.append(sec('Regole comuni a tutte le varianti','Quello che non cambia scegliendo una o l’altra.',ul([
 '<b>Quando compaiono:</b> “Ultimo visto” solo se c’è almeno un titolo visto (come oggi, <code>useJumpToLastWatched</code> restituisce <code>null</code> altrimenti, r.39); “Inizio” dopo 1,5 schermate di scroll (BackToTop.tsx r.56-86). Il comportamento di scroll resta quello di oggi (420 ms di apertura della fase, <code>smooth</code> salvo movimento ridotto).',
 '<b>Area di tocco:</b> 44px (<code>--hit</code>), come <code>.btn--sm</code>. Il testo visibile è anche il nome accessibile (WCAG 2.5.3): niente <code>aria-label</code> diverso dall’etichetta.',
 '<b>Colori:</b> sfondo <code>--panel</code>, testo e icona <code>--on-dark</code>, ombra <code>--shadow-pop</code> (in scuro include l’anello interno da 1px già nel token). Nessun valore nuovo.',
 '<b>Sovrapposizioni:</b> restano sotto i toast (<code>z-index: 20</code> contro 10, <code>.toasts</code> centrato in basso). Proposta: mentre c’è un toast le scorciatoie al centro (B, C, E) si nascondono, così il pulsante “Annulla” del toast non è mai coperto.',
 '<b>Movimento:</b> ingresso <code>fade-in</code> per <code>--dur-ui</code> solo senza movimento ridotto (come oggi). Con movimento ridotto compaiono e spariscono senza traslazione.',
 '<b>Testi:</b> le etichette lunghe esistenti (<code>planner.jump.last</code>, <code>planner.jump.top</code>) restano per l’accessibilità e i tooltip; per le pillole servono due chiavi brevi nuove, nella tabella in fondo.'])))

# A
P.append(block('Variante A · Com’è oggi (riferimento)',IMPL,'Il link nella scheda e il cerchio in basso a destra. Mostrato per confronto, scrollato a metà elenco.',
 grid(scene(A_(True),'light',True,'Mobile · chiaro'),scene(A_(True),'dark',True,'Mobile · scuro'))
 +grid(scene(A_(False),'light',False,'Desktop · chiaro',desk_bar=False,h=520))))
# B
P.append(block('Variante B · Due pillole descrittive, in basso al centro',PROP+' '+PREF,
 'Due pulsanti flottanti con icona e testo, affiancati e centrati sopra la barra dell’avanzamento. Su desktop stanno sopra la barra, sullo stesso asse (la barra è centrata, 560px), quindi lontano dalla colonna dei filtri a destra. Il link nella scheda dei progressi si toglie (sarebbe un doppione).',
 grid(scene(B_(True),'light',True,'Mobile · chiaro'),scene(B_(True),'dark',True,'Mobile · scuro'))
 +grid(scene(B_(False),'light',False,'Desktop · chiaro'))
 +grid(scene(B_(False),'dark',False,'Desktop · scuro'))
 +'<div class="dc-row"><div class="dc-box" style="flex:1 1 20rem"><div class="dc-fl">Pro</div>'+ul(['Etichette parlanti: si capisce che sono due azioni diverse.','Al centro, dove cade l’occhio, e fuori dalla zona filtri.','Stesso linguaggio dei pulsanti dell’app: <code>.btn.btn--sm</code> pillola, nessun componente nuovo.'])+'</div>'
 '<div class="dc-box" style="flex:1 1 20rem"><div class="dc-fl">Contro</div>'+ul(['Su mobile tolgono 44px + <code>--sp-3</code> in più sopra la barra: circa 56px di lista coperti, sempre.','Con un toast visibile vanno nascoste (regola sopra).','Due testi in più da tradurre.'])+'</div></div>'))
# C
P.append(block('Variante C · Pillola doppia, ancorata a sinistra',PROP,
 'Un solo oggetto diviso in due metà, con una linea <code>--raised-3</code> in mezzo. A sinistra, lontano da dove si trovano filtri e “Fasi” (a destra) e dal pollice destro che usa Condividi. Su desktop sta a sinistra, sopra la barra.',
 grid(scene(C_(True),'light',True,'Mobile · chiaro'),scene(C_(True),'dark',True,'Mobile · scuro'))
 +grid(scene(C_(False),'light',False,'Desktop · chiaro'))
 +'<div class="dc-row"><div class="dc-box" style="flex:1 1 20rem"><div class="dc-fl">Pro</div>'+ul(['Più compatta di B: un solo ingombro, una sola ombra.','Non invade né il centro (toast) né la destra (filtri).'])+'</div>'
 '<div class="dc-box" style="flex:1 1 20rem"><div class="dc-fl">Contro</div>'+ul(['Un pulsante mezzo-premuto: la metà sinistra e la destra sono due azioni, ma sembrano una sola.','Su mobile con testi lunghi (de: “Zuletzt gesehen”) arriva a circa 260px: stretta con la barra sotto.','Sinistra è meno naturale per chi usa il telefono con la destra.'])+'</div></div>'))
# D
P.append(block('Variante D · Dentro la barra fluttuante dell’avanzamento',PROP,
 'Niente pulsanti in più sullo schermo: due icone da 44px nella barra che già c’è, a destra della percentuale. Una sola fascia in basso, sempre uguale. Non descrittivi: etichetta solo nel tooltip e nel nome accessibile.',
 grid(scene_D('light',True,'Mobile · chiaro'),scene_D('dark',True,'Mobile · scuro'))
 +grid(scene_D('light',False,'Desktop · chiaro'))
 +'<div class="dc-row"><div class="dc-box" style="flex:1 1 20rem"><div class="dc-fl">Pro</div>'+ul(['Zero ingombro aggiunto sopra la barra, nessun conflitto con i toast.','Il cerchio “Torna all’inizio” non c’è più.'])+'</div>'
 '<div class="dc-box" style="flex:1 1 20rem"><div class="dc-fl">Contro</div>'+ul(['Icone senza testo: è la variante meno descrittiva, il contrario di quello che hai chiesto.','La barra cresce di circa 0,5rem: <code>--floating-progress-height</code> (5rem, tokens.less r.188) e la clearance vanno ricalcolati.','La barra è <code>aria-hidden="true"</code> (FloatingProgress.tsx r.22) e ha <code>pointer-events: none</code> (FloatingProgress.less r.15): per contenere pulsanti va resa interattiva e il contenuto informativo nascosto a parte.','La barra compare solo dopo aver superato la scheda dei progressi e sparisce con il piè di pagina in vista (useFloatingProgressVisibility.ts): i pulsanti spariscono con lei, proprio dove “Inizio” serve di più.'])+'</div></div>'))
# E
P.append(block('Variante E · Come B, ma compaiono solo risalendo',PROP,
 'Stesse due pillole di B, con una regola: appaiono quando si scorre verso l’alto (l’intenzione di tornare indietro) e spariscono quando si scorre verso il basso o si è in cima. Quando si legge l’elenco non coprono niente.',
 grid(scene(B_(True),'light',True,'Mobile · risalendo: visibili'),scene(B_(True,True),'light',True,'Mobile · scendendo: nascoste'),scene(B_(True),'dark',True,'Mobile · scuro · risalendo'))
 +tbl(['Situazione','“Ultimo visto”','“Inizio”'],[['In cima (meno di 1,5 schermate)','visibile se c’è un titolo visto, altrimenti no','nascosta'],['Si scende','nascosta (fade-out <code>--dur-ui</code> + 16px in giù)','nascosta'],['Si risale','visibile','visibile'],['Fermo dopo aver risalito','resta visibile','resta visibile finché non si scende'],['Toast visibile','nascosta','nascosta'],['Movimento ridotto','solo opacità, senza traslazione','solo opacità, senza traslazione']])
 +'<div class="dc-row"><div class="dc-box" style="flex:1 1 20rem"><div class="dc-fl">Pro</div>'+ul(['Massima visibilità quando serve, zero ingombro quando si legge.','Si può applicare anche a C.'])+'</div>'
 '<div class="dc-box" style="flex:1 1 20rem"><div class="dc-fl">Contro</div>'+ul(['Va tracciata la direzione dello scroll (un listener passivo come quello di BackToTop, più uno stato).','Meno scopribile: chi non risale non le vede mai (mitigazione: restano visibili 3 secondi dopo il primo scroll oltre la soglia).','Con tastiera o lettore di schermo: devono restare raggiungibili anche quando sono nascoste a vista; da definire.'])+'</div></div>'))
P.append(sec('Confronto','',tbl(['','Etichette','Dove','Ingombro mobile','Impatto sul codice'],[
 ['A · oggi','solo nel link','link in cima, cerchio a destra','44px','—'],
 ['<b>B · due pillole</b>','sì, entrambe','centro, sopra la barra','circa 56px, sempre','BackToTop sostituito da due pillole; link tolto da PlannerSummary; 2 chiavi nuove'],
 ['C · pillola doppia','sì, entrambe','sinistra','circa 56px, sempre','come B, un contenitore in più'],
 ['D · nella barra','no (solo tooltip)','dentro la barra','+0,5rem sulla barra','FloatingProgress (aria-hidden, pointer-events), tokens.less; spariscono col piè di pagina'],
 ['E · come B, a comparsa','sì','centro','0 in lettura, 56px risalendo','come B + rilevamento direzione scroll'],
])))
P.append(sec('Chiavi nuove per le pillole (B, C, E)','Le chiavi lunghe esistenti non cambiano. Sono nuove: <code>planner.jump.lastShort</code> e <code>planner.jump.topShort</code>.',
 txt([(k,T(*[SHORT[k][l] for l in LANGS])) for k in KS])))
P.append(why('<b>B, con la regola di E come rifinitura.</b> Sono le due pillole che ricordavi: parlano, si leggono, stanno al centro invece che sui filtri. Il costo vero è lo spazio su mobile; E lo azzera mentre si legge. D è la più pulita ma è quella che meno risponde a “poco visibili”. C è una buona seconda scelta se B ti sembra pesante. Da decidere prima di implementare: se il link nella scheda dei progressi resta (doppione utile in cima) o si toglie.'))
P.append(sec('Prima, dopo, file','Solo per B, la variante consigliata.',tbl(['Cosa','Prima','Dopo','File'],[
 ['Ultimo visto','link <code>btn--text</code> nella scheda dei progressi','pillola flottante con icona <code>LocateFixed</code> e testo breve','PlannerSummary.tsx r.83-87?; Planner.tsx'],
 ['Inizio','cerchio 44px, solo icona, a destra','pillola con icona <code>ArrowUp</code> e testo breve, accanto all’altra','BackToTop.tsx; BackToTop.less r.7-50'],
 ['Posizione','<code>right: --sp-4</code>','centrata sopra la barra, anche su desktop','BackToTop.less'],
 ['Toast','nessuna regola','nascoste mentre c’è un toast','Toasts (non verificato)'],
 ['Chiavi','—','<code>planner.jump.lastShort</code>, <code>planner.jump.topShort</code> in 5 lingue','src/locales'],
])))
write('Scorciatoie.dc.html','Scorciatoie del planner','\n'.join(P))
