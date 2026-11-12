from addlib import *
import re
_p={}; exec(open(f'{S}/dsn/p_planner.py').read().split('\nS=[]')[0],_p)
import add_impl as AI
phone=_p['phone']; pct_card=_p['pct_card']; next_card=_p['next_card']; strip=_p['strip']; compact=_p['compact']; filters=_p['filters']; saga=_p['saga']; mtool=_p['mtool']
theme_btn=_p['theme_btn']; lang_trigger=_p['lang_trigger']; acct=_p['acct']
SHORT=T('Guida','Guide','Guide','Guía','Hilfe')
def noguide(h): return re.sub(r'<div class="guide-help">.*?</div></div>','</div>',h,flags=re.S)
def nojump(h): return re.sub(r'<button type="button" class="btn btn--text" >(?:(?!</button>).)*?'+re.escape(L('planner.jump.last'))+r'</button>','',h,flags=re.S)
def search_plain():
    return noguide(_p['search']())
def hbtn(label=False):
    if label: return btn('panel',esc(SHORT['it']),'','','circle-help',f'aria-haspopup="dialog"')
    return btn('panel','','','','circle-help',f'aria-label="{L("planner.guide.help")}" aria-haspopup="dialog"')
def site_header(help_html='',mobile=False):
    menu=btn('panel','','','','menu','aria-label="'+L('nav.menu')+'"').replace('btn btn--panel','btn btn--panel site-header__menu-button',1)
    acts='' if mobile else f'<div class="site-header__actions">{theme_btn()}{lang_trigger()}{acct()}</div>'
    return f'<header class="site-header" style="position:relative"><nav class="site-header__bar" aria-label="{L("nav.main")}"><a href="#" class="wordmark">Marvel Planner</a><div class="site-header__end"><div class="site-header__help">{help_html}</div>{acts}{menu}</div></nav></header>'
def planner_(mobile,rail_help=False,card_help=False):
    srch=_p['search']() if rail_help else search_plain()
    pc=nojump(pct_card(not mobile))
    if card_help:
        pc=pc.replace('class="progress-card card card--panel on-panel"','class="progress-card card card--panel on-panel" style="position:relative"',1)
        pc=pc.replace('</section>',f'<button type="button" class="btn btn--panel btn--icon" style="position:absolute;top:var(--sp-4);right:var(--sp-4);box-shadow:inset 0 0 0 2px var(--on-dark);color:var(--on-dark);background:transparent" aria-label="{L("planner.guide.help")}" aria-haspopup="dialog">{icon("circle-help")}</button></section>',1) if False else pc
    if mobile:
        return f'<div class="planner"><div class="planner__hero">{pc}{next_card()}</div><div class="planner__body">{srch}{mtool()}<div class="planner__list">{saga()}</div></div></div>'
    return (f'<div class="planner"><div class="planner__hero">{pc}{next_card()}</div>{strip()}<div class="planner__body"><div class="planner__rail"><div class="planner__rail-content">{compact()}{srch}{filters()}</div></div><div class="planner__list">{saga()}</div></div></div>')
def items(): return AI.guide_items('it',False,True)
def close_btn(): return f'<button type="button" class="btn btn--soft btn--icon btn--sm" aria-label="{L("common.close")}">{icon("x")}</button>'
def popover(mobile):
    r='var(--sp-2)' if mobile else '2rem'
    return (f'<div class="card guide-pop" role="dialog" aria-labelledby="gt" style="position:absolute;z-index:30;top:calc(var(--header-h) - var(--sp-1));right:{r};width:min(24rem,calc(100vw - 2rem));padding:var(--sp-5);box-shadow:var(--shadow-pop);border-radius:var(--r-md)">'
            f'<span aria-hidden="true" style="position:absolute;top:-6px;right:{"3.9rem" if mobile else "5.2rem"};width:12px;height:12px;transform:rotate(45deg);background:inherit;border-radius:2px 0 0 0"></span>'
            f'<div style="display:flex;justify-content:space-between;align-items:center;gap:var(--sp-3);margin-bottom:var(--sp-4)"><h2 id="gt" class="section-title" style="margin:0">{esc(L("planner.guide.title"))}</h2>{close_btn()}</div>{items()}</div>')
def modal_scene(mobile):
    return f'<div style="position:fixed;inset:0;z-index:40;background:var(--scrim);display:grid;place-items:center;padding:var(--sp-4)"><div style="width:min(32rem,100%)">{modal(esc(L("planner.guide.title")),items(),"md")}</div></div>'
def invite(mobile):
    r='var(--sp-2)' if mobile else '2rem'
    return f'<div class="guide-help__callout" role="status" style="position:absolute;top:calc(var(--header-h) - var(--sp-1));right:{r};animation:none"><p>{esc(L("planner.guide.callout"))}</p><div class="guide-help__actions">{btn("primary",esc(L("planner.guide.calloutOpen")),"sm")}{btn("text",esc(L("planner.guide.calloutDismiss")),"sm")}</div></div>'
def drawer(mobile):
    head=f'<div style="display:flex;justify-content:space-between;align-items:center;gap:var(--sp-3);margin-bottom:var(--sp-4)"><h2 class="section-title" style="margin:0">{esc(L("planner.guide.title"))}</h2>{close_btn()}</div>'
    if mobile:
        return f'<div class="card" role="dialog" style="position:fixed;z-index:30;left:0;right:0;bottom:0;max-height:78%;overflow:auto;padding:var(--sp-5);border-radius:var(--r-lg) var(--r-lg) 0 0;box-shadow:var(--shadow-pop)"><div aria-hidden="true" style="width:2.5rem;height:4px;border-radius:2px;background:var(--row-press);margin:0 auto var(--sp-3)"></div>{head}{items()}</div>'
    return f'<aside class="card" role="complementary" style="position:fixed;z-index:30;top:0;right:0;bottom:0;width:22rem;overflow:auto;padding:var(--sp-5);border-radius:var(--r-lg) 0 0 var(--r-lg);box-shadow:var(--shadow-pop)">{head}{items()}</aside>'
def scene(variant,theme,mobile,label,state=''):
    helph=''; extra=''; rail=False; card=False
    if variant=='A': rail=True
    if variant in 'BC': helph=hbtn()
    if variant=='D': helph=hbtn(not mobile)
    if variant=='F': card=True
    if variant=='B' and state=='open': extra=modal_scene(mobile)
    if variant=='C' and state=='open': extra=popover(mobile)
    if variant=='C' and state=='invite': extra=invite(mobile)
    if variant=='D' and state=='open': extra=popover(mobile)
    if variant=='E' and state=='open': extra=drawer(mobile); helph=hbtn()
    if variant=='E' and not state: helph=hbtn()
    body=planner_(mobile,rail,card)
    if card:
        body=body.replace('</section><aside class="share-poster"',f'<button type="button" class="btn btn--panel btn--icon" style="position:absolute;top:var(--sp-4);right:var(--sp-4);box-shadow:inset 0 0 0 2px var(--on-dark);color:var(--on-dark);background:transparent" aria-label="{L("planner.guide.help")}" aria-haspopup="dialog">{icon("circle-help")}</button></section><aside class="share-poster"',1) if False else body
        body=re.sub(r'(<section class="progress-card card card--panel on-panel" style="position:relative">)',r'\1'+f'<button type="button" class="btn btn--panel btn--icon" style="position:absolute;top:var(--sp-3);right:var(--sp-3);box-shadow:inset 0 0 0 2px var(--on-dark);color:var(--on-dark);background:transparent;z-index:2" aria-label="{L("planner.guide.help")}" aria-haspopup="dialog">{icon("circle-help")}</button>',body,count=1)
    inner=f'<div class="site-shell" style="position:relative">{site_header(helph,mobile)}<main class="site-main">{body}</main>{extra}</div>'
    return phone(inner,theme,640 if mobile else (720 if state=='open' else 600),390 if mobile else 1100,label)
def grid(*c): return '<div class="dc-row" style="align-items:flex-start">'+''.join(c)+'</div>'
def pc(pro,con): return '<div class="dc-row"><div class="dc-box" style="flex:1 1 20rem"><div class="dc-fl">Pro</div>'+ul(pro)+'</div><div class="dc-box" style="flex:1 1 20rem"><div class="dc-fl">Contro</div>'+ul(con)+'</div></div>'

P=[]
P.append(h1('Guida del planner','Dove mettere il “?” che spiega come leggere il planner, e come aprirlo: sei varianti confrontate su desktop e mobile. Le scene sono pagine vere con il CSS dell’app.'))
P.append(hdr('Proposte per spostare il pulsante “Come leggere il planner” (GuideHelp) e per scegliere come si apre: popup, popover o pannello',
 'src/features/planner/components/GuideHelp/ (GuideHelp.tsx, GuideHelp.less), src/components/layout/AppHeader/, src/components/layout/AppLayout/',
 'Buttons (panel, soft, icon), Navigation (AppHeader), Popup generici (Modal), Select (popover), Toast','12 novembre 2026'))
P.append(sec('Che cosa non va oggi','Letto dal codice (main '+COMMIT+', GuideHelp.tsx r.22-114, GuideHelp.less r.3-27) e dalla schermata del 12 novembre.',ul([
 'Il “?” sta nella riga della ricerca, nella colonna dei filtri. Spiega l’intera pagina (avanzamento, fasi, ordine, alternativa) ma sta accanto a un campo di ricerca: si legge come “aiuto per cercare”.',
 'Su desktop la colonna è la rail destra, sticky: il pulsante e l’invito della prima visita stanno nell’angolo più affollato, vicino a filtri e barra fluttuante.',
 'Il contenuto è breve (da una a tre voci, a seconda di ordine e alternativa) ma si apre in un popup modale: copre proprio la pagina che la guida spiega, e non si può leggere guardando i filtri o l’avanzamento.'])))
P.append(sec('Quello che la guida è','Per scegliere la forma conta il contenuto.',ul([
 'Da 1 a 3 voci di 2-3 righe: “Vuoi seguire la storia?” (solo con ordine di uscita), “Ordine di uscita e cronologico”, “Continuità alternativa” (solo se l’alternativa è visibile). Si leggono in meno di un minuto.',
 'Cita elementi della pagina: tab, filtro, fasi. Perciò è utile poterla leggere <b>con la pagina in vista</b>.',
 'Si legge una volta, forse due. La prima visita ha già un invito (flag <code>mcu-planner-guide-seen</code>): il “?” deve restare trovabile ma non deve essere in primo piano.',
 'Dipende dallo stato del planner (<code>isChronological</code>, <code>showAlternate</code>): il componente che la apre deve poter leggerlo.'])))
P.append(sec('Criteri','',tbl(['Criterio','Domanda'],[['Contesto','il “?” sta dove l’utente cerca aiuto sulla pagina, non su un campo?'],['Scopribilità','si trova senza che occorra un invito?'],['Lettura','si legge guardando la pagina che spiega?'],['Costo','quanto codice nuovo, quanto rischio?'],['Mobile','funziona a 390px senza coprire controlli?'],['Accessibilità','focus, Esc, nome, ordine di tab']])))

P.append(block('Variante A · Com’è oggi (riferimento)',IMPL,'“?” accanto alla ricerca, popup modale, invito sotto il pulsante.',grid(scene('A','light',False,'Desktop · chiaro'),scene('A','light',True,'Mobile · chiaro'))))
P.append(block('Variante B · Nell’header, icona, popup modale',PROP,
 'Il “?” passa nell’header (solo su planner e link condiviso), a sinistra del tema. Si apre lo stesso <code>Modal</code> di oggi.',
 grid(scene('B','light',False,'Desktop · chiuso'),scene('B','light',False,'Desktop · aperto','open'))+grid(scene('B','light',True,'Mobile · chiuso'),scene('B','dark',True,'Mobile · aperto · scuro','open'))
 +pc(['Il posto giusto per l’aiuto di pagina: l’header è il primo posto dove si guarda.','Cambia solo la posizione: il popup (Modal, focus trap, Esc, scroll) c’è già e funziona.','Su mobile sta accanto a Menu, 44px.'],
     ['Il popup copre la pagina che la guida spiega.','Per un testo da 1-3 voci è un contenitore pesante (scrim, X, focus trap).'])))
P.append(block('Variante C · Nell’header, icona, popover non modale',PROP+' '+PREF,
 'Stessa posizione di B; la guida si apre in una scheda ancorata sotto il pulsante, senza scrim: la pagina resta visibile e cliccabile. Chiude con Esc, clic fuori, X o secondo clic sul “?”. L’invito della prima visita sta sotto lo stesso pulsante.',
 grid(scene('C','light',False,'Desktop · chiaro · aperta','open'),scene('C','dark',False,'Desktop · scuro · aperta','open'))
 +grid(scene('C','light',True,'Mobile · aperta','open'),scene('C','dark',True,'Mobile · scuro · aperta','open'))
 +grid(scene('C','light',False,'Desktop · invito della prima visita','invite'),scene('C','light',True,'Mobile · invito della prima visita','invite'))
 +pc(['Si legge guardando la pagina: la guida cita i filtri e l’avanzamento, che restano in vista.','Pesa quanto il contenuto: una scheda, niente scrim.','Il popover esiste già nell’app (elenco della lingua, SelectField; movimento in motion.less r.5): stessa meccanica di chiusura.','Mobile: larghezza <code>min(24rem, 100vw − 2rem)</code>, nessun foglio dedicato.'],
     ['Un secondo contenitore da mantenere (il popover della guida, oltre a Modal e al popover della lingua).','Va gestito il focus a mano: nel titolo all’apertura, sul “?” alla chiusura; non è modale, quindi niente trap.','Header non sticky: dopo lo scroll il “?” non è raggiungibile. Accettato: la guida serve al primo sguardo.'])))
P.append(block('Variante D · Nell’header, con etichetta “Guida”',PROP,
 'Come C, ma su desktop il pulsante ha icona e testo (“Guida”, nuova chiave <code>planner.guide.helpShort</code>); su mobile resta l’icona. Più scopribile; l’header diventa più pieno.',
 grid(scene('D','light',False,'Desktop · chiusa'),scene('D','light',False,'Desktop · aperta','open'))+grid(scene('D','light',True,'Mobile · chiusa'))
 +pc(['Dice cos’è senza bisogno di indovinare il “?”.','Nome visibile = nome accessibile (2.5.3).'],['Un pulsante con testo in più accanto a tema (icona), lingua (testo) e account (testo): header affollato a 1100px.','Una chiave nuova in 5 lingue (sotto).','Su mobile non c’è spazio: l’asimmetria desktop/mobile fa pensare a due pulsanti diversi.'])))
P.append(block('Variante E · Pannello laterale (desktop) e foglio dal basso (mobile)',PROP,
 'Il “?” è nell’header; la guida si apre in un pannello a destra (desktop) o in un foglio dal basso (mobile), che il planner già usa per i filtri. Utile se la guida crescesse (immagini, esempi).',
 grid(scene('E','light',False,'Desktop · pannello','open'),scene('E','light',True,'Mobile · foglio','open'))
 +pc(['Spazio per una guida lunga, con esempi.','Su mobile il foglio è un gesto già noto (filtri).'],['Per 1-3 voci è sproporzionato.','Su desktop copre la rail dei filtri, cioè la parte che la guida spiega.','Più codice, più stati (aperto, scroll, focus, chiusura).'])))
P.append(block('Variante F · Accanto al titolo “I tuoi progressi”',PROP,
 'Il “?” nell’angolo della scheda dei progressi, il primo blocco della pagina; stesso popup di A o popover di C.',
 grid(scene('F','light',False,'Desktop · chiaro'),scene('F','light',True,'Mobile · chiaro'))
 +pc(['È dentro il contenuto che spiega, in cima alla pagina.','Non tocca l’header.'],['L’header è il posto dove si cerca l’aiuto: qui è meno prevedibile.','Il pulsante sta sulla scheda scura, vicino a percentuale e Condividi: altro angolo affollato.','Sparisce con lo scroll come l’header, senza il vantaggio dell’header.'])))

P.append(sec('Confronto','',tbl(['','Posto','Apertura','Si legge con la pagina','Codice nuovo','Mobile'],[
 ['A · oggi','riga ricerca','popup modale','no','—','ok'],
 ['B','header','popup modale','no','slot nell’header','ok, accanto a Menu'],
 ['<b>C ★</b>','header','popover','sì','slot + popover','ok, scheda piena larghezza'],
 ['D','header, con testo','popover','sì','come C + 1 chiave','solo icona'],
 ['E','header','pannello / foglio','parziale','slot + pannello + foglio','ok'],
 ['F','scheda progressi','popup o popover','dipende','nessuno nell’header','ok'],
])))
P.append(sec('Regole comuni a B, C, D, E','Valgono qualunque sia la forma scelta.',ul([
 '<b>Solo sul planner:</b> il pulsante compare nell’header sulle rotte <code>/</code> e <code>/s/:code</code> (PATHS.home, PATHS.shared); non su film, privacy, accessibilità, admin. Nome accessibile: <code>planner.guide.help</code> (“Come leggere il planner”), come oggi.',
 '<b>Come arriva nell’header:</b> l’header è condiviso (AppLayout). Il componente <code>GuideHelp</code> resta nel Planner, che conosce <code>isChronological</code> e <code>showAlternate</code>, e si monta nell’header con un portale su un punto d’aggancio (<code>#header-help-slot</code>) dentro <code>.site-header__actions</code> e vicino a Menu. Lo stato non esce dal Planner.',
 '<b>Aspetto del pulsante:</b> <code>btn btn--panel</code> come il pulsante del tema: contorno <code>--ink</code> 2px, icona <code>CircleHelp</code>, 44px (AppHeader.less r.11-15). Nessun pulsante “soft” nell’header.',
 '<b>Invito alla prima visita:</b> uguale a oggi (testo <code>planner.guide.callout</code>, “Leggi” e “Non ora”, flag <code>mcu-planner-guide-seen</code>), ancorato sotto il pulsante dell’header, a destra; sparisce al primo tocco, tasto o scroll fuori.',
 '<b>Header non sticky:</b> la guida si apre solo dall’alto della pagina. Non si cambia l’header per questo.',
 '<b>Mobile, larghezza:</b> wordmark, “?” e Menu su 390px: nell’anteprima il logo va a capo perché il carattere Anton non si carica offline; non verificato con il carattere vero.',
 '<b>Contenuto:</b> invariato (voci condizionali, nomi dalle chiavi dell’app).'])))
P.append(sec('C · comportamento del popover','Se si sceglie C.',tbl(['Aspetto','Valore'],[
 ['Posizione','sotto il pulsante, a destra: <code>top: calc(var(--header-h) - var(--sp-1))</code>, <code>right: 2rem</code> (desktop) / <code>--sp-2</code> (mobile); freccia di 12px'],
 ['Aspetto','<code>.card</code>, <code>--r-md</code>, <code>--shadow-pop</code>, padding <code>--sp-5</code>, larghezza <code>min(24rem, 100vw − 2rem)</code>, <code>z-index: 30</code> (sopra header e invito 6, sotto toast 20? da verificare: i toast hanno 20)'],
 ['Apertura','il “?” ha <code>aria-expanded</code> e <code>aria-controls</code>; la scheda è <code>role="dialog"</code> non modale con <code>aria-labelledby</code>; entra con <code>reveal-in</code> <code>--dur-enter</code> (solo senza movimento ridotto)'],
 ['Focus','all’apertura nel titolo (<code>tabIndex=-1</code>); alla chiusura sul “?”; nessuna trappola'],
 ['Chiusura','Esc, X, secondo clic sul “?”, clic fuori; <b>non</b> si chiude con lo scroll (a differenza dell’invito)'],
 ['Apertura e flag','aprire segna la guida come vista (come oggi) e chiude l’invito'],
 ['Cambio filtri aperta','il contenuto si aggiorna (voci condizionali) senza chiudere'],
])))
P.append(sec('Testi nelle 5 lingue','Servono solo se si sceglie D: <code>planner.guide.helpShort</code>. Le altre chiavi della guida non cambiano.',txt([('planner.guide.helpShort',SHORT)])))
P.append(why('<b>C.</b> Il “?” in un header spiega la pagina e non un campo di ricerca; il popover mostra la guida senza coprire ciò che spiega. Il contenuto è di 1-3 voci: un popup modale è sproporzionato. B è la scelta se vuoi cambiare solo la posizione e tenere il popup che c’è (costo minimo, vedi tabella). D ha senso solo se l’header resta largo; E solo se la guida crescesse. Ho scartato anche: voce nel menu (introvabile), tornare al blocco in pagina (era la versione precedente, tolta).'))
P.append(sec('Prima, dopo, file','Per C.',tbl(['Cosa','Prima','Dopo','File'],[
 ['Posto','riga della ricerca, nella rail','header, solo su planner e link condiviso','GuideHelp.tsx; AppHeader.tsx; AppLayout.tsx; Planner.tsx r.216?, r.244?'],
 ['Pulsante','<code>btn--soft btn--icon</code>','<code>btn--panel</code> (contorno <code>--ink</code>), 44px','GuideHelp.less r.5; AppHeader.less r.11-15'],
 ['Apertura','<code>Modal</code> (dialog modale con scrim)','popover non modale ancorato al pulsante','GuideHelp.tsx; nuovo stile popover'],
 ['Invito','sotto il “?” nella rail','sotto il “?” nell’header','GuideHelp.less r.7-27'],
 ['Riga ricerca','ricerca + “?”','solo ricerca, a tutta larghezza','Planner.less; GuideHelp.less r.3'],
])))
write('Guida del planner.dc.html','Guida del planner','\n'.join(P))
