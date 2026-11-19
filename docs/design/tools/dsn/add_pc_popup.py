"""Blocchi delle pagine «Popup generici» (voce 22: struttura, scrollbar, padding, pulsante principale)
e «Popup di accesso» (voce 23: popup di accesso unificati, riga del perché).
Scritto a mano nel canvas: `python add_pc_popup.py` li inserisce una volta sola. Una rigenerazione di p_dialogs.py/p_access.py li cancella.
Le misure scritte nelle didascalie dei riquadri sono prese dal browser quando la pagina si apre (getBoundingClientRect)."""
import sys, re
from add_pc_lib import *

CAPJS = '''function C(el,txt){var p=document.createElement("p");p.className="mcap";p.textContent=txt;el.appendChild(p)}
function R(e){return e.getBoundingClientRect()}
document.fonts.ready.then(function(){setTimeout(function(){
document.querySelectorAll("[data-m]").forEach(function(w){var d=w.querySelector("dialog"),s=w.querySelector(".dialog__scroll"),t=w.querySelector("textarea,.field input"),dr=R(d);
var sb=s.offsetWidth-s.clientWidth,k=w.getAttribute("data-m");
if(k==="gutter"){C(w,"corpo: sinistra "+Math.round(R(t).left-dr.left)+" px · destra "+Math.round(dr.right-R(t).right)+" px · barra "+sb+" px · popup alto "+Math.round(dr.height)+" px")}
if(k==="note"){var h=w.querySelector("h2"),n=w.querySelector(".auth-dialog__note"),v=w.querySelector(".auth-view"),m=[];
if(n){m.push("titolo → riga "+Math.round(R(n).top-R(h).bottom)+" px");if(v)m.push("riga → modulo "+Math.round(R(v).top-R(n).bottom)+" px")}else{m.push("titolo → modulo "+Math.round(R(v).top-R(h).bottom)+" px")}
C(w,m.join(" · "))}
if(k==="btn"){var bb=w.querySelector(".btn"),bd=w.querySelector(".dialog__body"),br=R(bd),pl=parseFloat(getComputedStyle(bd).paddingLeft);C(w,"pulsante: sinistra "+Math.round(R(bb).left-br.left-pl)+" px · destra "+Math.round(br.right-pl-R(bb).right)+" px dal bordo utile · largo "+Math.round(R(bb).width)+" px su "+Math.round(br.width-2*pl)+" px utili")}
})},300)});'''
FX = ('.row3{display:flex;gap:24px;align-items:flex-start;padding:8px}.row3>div{flex:none}.row3 dialog.dialog{width:560px}'
      '.mcap{margin:8px 0 0;font:700 12px/16px var(--font-body);color:#fff;background:#14171f;display:inline-block;padding:2px 8px;border-radius:var(--r-tiny)}'
      'body{background:var(--scrim)}.g-auto .dialog__scroll{scrollbar-gutter:auto}.g-stable .dialog__scroll{scrollbar-gutter:stable}'
      '.pop-fixed{display:flex;flex-direction:column;min-height:0}.pop-fixed .dialog__header{flex:none;border-bottom:1px solid var(--line)}.pop-fixed .dialog__scroll{min-height:0}.g-fixed .dialog.dialog{overflow:hidden}')
FXP = FX.replace('.row3 dialog.dialog{width:560px}', '') + 'dialog.dialog{position:static!important;margin:0!important}'


def sugg(full=False, ctx='Trama'):
    f = fld('Cosa va corretto?', '', ta=3, ph='Scrivi la correzione', cnt='0/500', msg='Scrivi la correzione')
    send = f'<button type="submit" class="btn btn--primary{" btn--lg" if full else ""}">{icon("send")}Invia</button>'
    act = f'<div style="margin-top:var(--sp-4);display:flex;flex-direction:column">{send}</div>' if full else f'<div class="dialog__actions">{send}</div>'
    return (f'<form><p class="suggest__context" style="margin-bottom:var(--sp-4);font-size:var(--fs-label);color:var(--ink-2)">{ctx}</p>{f}{act}</form>')


def many(n=14):
    return ''.join(f'<p>Altro testo del popup, riga {i}.</p>' for i in range(n))


def wrap(kind, cls, pop):
    return f'<div data-m="{kind}" class="{cls}">{pop}</div>'


def scrolls(f):
    return f'<div class="dc-scroll">{f}</div>'


def build_struct():
    short = sugg()
    scroll = sugg() + many(8)
    T = 'Suggerisci una modifica'
    cap3 = ('<div class="row3" style="padding-top:0"><span class="mcap" style="width:560px">1 · Prima: <code>stable</code>, popup corto</span>'
            '<span class="mcap" style="width:560px">2 · Dopo: <code>auto</code>, popup corto</span>'
            '<span class="mcap" style="width:560px">3 · Dopo: <code>auto</code>, il popup scorre</span></div>')
    A = fr('1280 px · chiaro · prima, dopo e quando scorre', 'light', 1820, 480,
           '<div class="row3">' + wrap('gutter', 'g-stable', popup(T, short)) + wrap('gutter', 'g-auto', popup(T, short))
           + wrap('gutter', 'g-auto', popup(T, scroll, scroll_h=330)) + '</div>' + cap3, FX, CAPJS)
    Bd = fr('1280 px · scuro · dopo', 'dark', 1260, 480,
            '<div class="row3">' + wrap('gutter', 'g-auto', popup(T, short)) + wrap('gutter', 'g-auto', popup(T, scroll, scroll_h=330)) + '</div>', FX, CAPJS)
    fixed = fr('1280 px · variante (a): titolo e X fissi, scorre solo il corpo · chiaro e scuro', 'light', 1260, 480,
               '<div class="row3 g-fixed g-auto">' + wrap('gutter', '', popup(T, scroll, scroll_h=265, fixed_head=True))
               + '<div data-theme="dark" style="background:var(--surface);color:var(--ink);--field-bg:var(--bg);border-radius:var(--r-xl)">'
               + wrap('gutter', '', popup(T, scroll, scroll_h=265, fixed_head=True)) + '</div></div>', FX, CAPJS)
    P1 = fr('390 px · bottom sheet · corto · chiaro', 'light', 390, 440, wrap('gutter', 'g-auto', popup(T, short)), FXP, CAPJS)
    P2 = fr('390 px · scorre (finestra stretta con il mouse) · chiaro', 'light', 390, 440, wrap('gutter', 'g-auto', popup(T, scroll, scroll_h=350)), FXP, CAPJS)
    P3 = fr('390 px · scorre · scuro', 'dark', 390, 440, wrap('gutter', 'g-auto', popup(T, scroll, scroll_h=350)), FXP, CAPJS)
    return A, Bd, fixed, (P1, P2, P3)


def build_btn():
    css = FX.replace('.row3 dialog.dialog{width:560px}', '') + '.row3 dialog.dialog{width:520px}'
    fld_name = ('<div class="field"><div class="field__label"><label>Nome da supereroe</label><span class="field__counter">5/24</span></div>'
                '<div class="field__control"><input type="text" value="Peter"></div><p class="field__message">Scegli un nome di fantasia: non serve il tuo nome reale.</p></div>')
    st = '<p class="status" style="flex:1 1 200px;margin:0"></p>'
    sv = '<button type="submit" class="btn btn--primary">Salva</button>'
    prof_now = f'<form class="profile-section">{fld_name}<div class="profile-section__actions">{sv}{st}</div></form>'
    prof_new = f'<form class="profile-section">{fld_name}<div class="profile-section__actions" style="justify-content:flex-end">{st}{sv}</div></form>'
    two = lambda a: ('<div class="row3" style="padding-top:0"><span class="mcap" style="width:520px">Oggi</span><span class="mcap" style="width:520px">Proposta</span></div>')
    F = fr('Suggerisci · oggi (Invia a destra) e proposta (Invia a tutta larghezza)', 'light', 1160, 440,
           '<div class="row3">' + wrap('btn', '', popup('Suggerisci una modifica', sugg())) + wrap('btn', '', popup('Suggerisci una modifica', sugg(True))) + '</div>' + two(0), css, CAPJS)
    G = fr('Account · Profilo · oggi (Salva a sinistra) e proposta (Salva a destra)', 'light', 1160, 400,
           '<div class="row3">' + wrap('btn', '', popup('Il tuo profilo', prof_now)) + wrap('btn', '', popup('Il tuo profilo', prof_new)) + '</div>' + two(0), css, CAPJS)
    return F, G


def build_popups():
    prop = tag('proposta · non implementata', 'k2')
    A, Bd, fixed, (P1, P2, P3) = build_struct()
    F, G = build_btn()
    why = ('<b>(a) Titolo e X: come oggi.</b> La premessa va corretta: la X <b>non scorre</b>, è fratella di <code>.dialog__scroll</code>, fissa a 12 px da sopra e da destra (<code>Modal.tsx</code> r.209-219, <code>Modal.less</code> r.46-52, misurata 44 × 44 px); scorre solo il titolo, insieme al corpo. '
           '<b>Raccomandazione: lasciare che scorra anche il titolo.</b> Un popup scorre solo con la finestra bassa (tetto <code>calc(100dvh − 64px)</code>, <code>Modal.less</code> r.8 e r.27: 736 px con 800 px di finestra) e i popup con campi sono bassi (Suggerisci: 350 px, misurato); fissare il titolo costa una struttura nuova in <code>Modal.tsx</code> (testata fuori da <code>.dialog__scroll</code>), un filo <code>--line</code> fisso sotto il titolo (nessun token di ombra per una testata) e 65 px in meno di corpo proprio quando manca spazio. '
           '<b>Alternativa (a), disegnata:</b> titolo e X fissi, scorre solo il corpo; la barra parte sotto la testata e non attraversa più l\'angolo da 32 px in alto. <b>«Barra sul solo corpo con il margine del popup intorno»</b> non si ottiene uguale in tutti i browser: la barra sta sul bordo del contenitore che scorre (solo Chromium accetta un margine su <code>::-webkit-scrollbar-track</code>, Firefox no: lo stesso limite della voce 21); l\'unico modo è un contenitore con margine, che restringe il testo di 12-16 px sempre.')
    why2 = ('<b>(b) <code>scrollbar-gutter: auto</code>: confermato</b> (<code>Modal.less</code> r.26-31, non ancora su main). Misurato: con <code>stable</code> (ereditato da <code>.scroll-y</code>, <code>base.less</code> r.56-61) il corpo ha 32 px a sinistra e <b>44 px a destra</b> anche senza scorrimento; con <code>auto</code> 32 e 32. Quando il popup scorre davvero la barra (12 px) occupa la fascia a destra: 32 px dal contenuto alla barra, 44 dal bordo del popup. È la simmetria giusta (il contenuto ha lo stesso respiro dai suoi due lati) e il salto di 12 px compare solo se serve. '
            '<b>Alternativa</b> <code>stable both-edges</code>: 44 e 44 sempre, corpo più stretto di 24 px: scartata. <b>Non verificato:</b> <code>.sheet-surface()</code> (FiltersSheet, HeaderMenu: <code>mixins.less</code> r.78) ha ancora <code>stable</code>: stesso effetto di 12 px a destra, da guardare.')
    why3 = ('<b>(c) Padding: invariato.</b> Corpo <code>0.5rem 2rem 2rem</code> (<code>Modal.less</code> r.83-87), sotto 40em <code>0.5rem 1.5rem calc(1.5rem + safe-area)</code> (r.126-128); testata con <code>1.75rem</code> sopra, 2 rem (1,5 rem) a sinistra e <code>--tap + 0.75rem + --sp-3</code> (68 px) a destra per la X (r.33-37, r.111-113). Misurato: barra assente 32/32 (24/24); barra presente 32 dal contenuto alla barra (24); X a 12 px dal bordo; titolo a 68 px dal bordo destro (80 con la barra). Larghezza utile del corpo con <code>--md</code> (560 px): 496 px senza barra, 484 con (calcolo). '
            'I valori coincidono con <code>--sp-8</code>, <code>--sp-6</code> e <code>--pad-popup</code> (1,75 rem): scriverli coi token è facoltativo, stesso risultato. <b>Telefono:</b> col tocco la barra è overlay (la regola <code>::-webkit-scrollbar</code> vale solo con <code>(hover: hover) and (pointer: fine)</code>, <code>base.less</code> r.11): niente fascia, 24/24 sempre; la barra da 12 px si vede solo in una finestra stretta con il mouse (disegnata).')
    why4 = ('<b>(d) Pulsante principale: una regola sola, in fondo.</b> Oggi (misurato a 1280 e a 390 px): accesso, registrazione, recupero, nuova password, Condividi, Importa, completamento 100%: <b>a tutta larghezza</b>, <code>lg</code>; Suggerisci «Invia»: <b>a destra</b>, piccolo (<code>.dialog__actions</code>, <code>justify-content: flex-end</code>); conferme (ConfirmDialog) e Admin: coppia a destra; Account · Profilo «Salva»: <b>a sinistra</b>; Account · Password «Cambia»: a destra, nota a sinistra. '
            '<b>Regola:</b> (1) popup con modulo o una sola azione: pulsante principale <code>lg</code> a tutta larghezza, ultimo nel corpo; (2) popup di decisione con due azioni: <code>.dialog__actions</code> a destra, la secondaria a sinistra della principale, che è sempre l\'ultima (a destra, in basso quando va in colonna; la colonna sotto 40em oggi vale solo per <code>.dialog--confirm</code>, <code>ConfirmDialog.less</code> r.78-85: estenderla a ogni <code>.dialog__actions</code>); (3) sezioni dell\'Account: azione a destra, stato o nota a sinistra (come Password). '
            'Cambiano solo due punti: <b>Suggerisci</b> (da <code>.dialog__actions</code> a <code>Button size="lg"</code> a tutta larghezza) e <b>Profilo</b> (stato a sinistra, «Salva» a destra). <b>Alternative:</b> tutto a destra, accesso compreso (scartata: cambia sette popup e rimpicciolisce il bersaglio sul telefono); tutto a tutta larghezza, conferme comprese (scartata: perde la coppia Annulla / Conferma).')
    meas = tbl(['Caso (Chromium, barra classica da 12 px come su Windows)', 'Corpo a sinistra', 'Corpo a destra (dal bordo del popup)', 'Barra'], [
        ['1280 · prima (<code>stable</code>) · corto', '32 px', '<b>44 px</b>', '12 px riservati'],
        ['1280 · prima · scorre', '32 px', '44 px', '12 px'],
        ['1280 · dopo (<code>auto</code>) · corto', '32 px', '<b>32 px</b>', '0'],
        ['1280 · dopo · scorre', '32 px', '44 px (32 dalla barra)', '12 px'],
        ['390 · prima · corto', '24 px', '<b>36 px</b>', '12 px riservati'],
        ['390 · dopo · corto / scorre', '24 px', '24 px / 36 px', '0 / 12 px'],
        ['X · titolo · testata', 'X 44 × 44 px a 12 px da sopra e da destra', 'titolo a 68 px dal bordo destro (80 con la barra)', 'testata alta 65 px']])
    surv = tbl(['Popup', 'Azione principale', 'Posizione oggi (misurata)', 'Regola proposta'], [
        ['Accesso, Registrazione, Recupero, Nuova password', 'Button primario <code>lg</code>', 'a tutta larghezza', 'invariato'],
        ['Condividi · Importa (scelta) · Completamento 100%', 'Button primario <code>lg</code>', 'a tutta larghezza (Importa: dentro il riquadro, 50 px per lato)', 'invariato'],
        ['Suggerisci una modifica', '«Invia», dimensione normale', 'a destra, largo 75 px (<code>.dialog__actions</code>)', '<b>a tutta larghezza, <code>lg</code></b>'],
        ['Conferme (ConfirmDialog) · Admin (Segna verificato, Date)', 'Annulla + azione', 'coppia a destra; telefono: colonna a tutta larghezza solo nelle conferme', 'invariato a destra; colonna sotto 40em per tutti'],
        ['Account · Profilo', '«Salva»', 'a sinistra, stato a destra', '<b>a destra</b>, stato a sinistra'],
        ['Account · Password', '«Cambia»', 'a destra, nota a sinistra', 'invariato']])
    rule = ('<pre><code>// SuggestForm.tsx: il form diventa una colonna; l\'invio non sta più in .dialog__actions\n&lt;form className="suggest" …&gt;\n  …campi…\n  &lt;Button type="submit" variant="primary" size="lg" icon={&lt;Send aria-hidden /&gt;} …&gt;{t("suggest.send")}&lt;/Button&gt;\n&lt;/form&gt;\n\n// SuggestForm.less\n.suggest { display: flex; flex-direction: column; gap: var(--sp-4); }   // .suggest__context resta com\'è\n\n// ConfirmDialog.less r.78-85: la colonna sotto 40em per ogni .dialog__actions\n@media (max-width: 39.9375em) {\n  .dialog__actions { flex-direction: column; flex-wrap: nowrap; .btn { width: 100%; } }\n}\n\n// ProfileSection.tsx: lo stato prima del pulsante; .profile-section__actions { justify-content: flex-end }\n\n// Modal.less (già nella cartella di lavoro): .dialog__scroll { scrollbar-gutter: auto; }</code></pre>'
            + ul(['Nessun valore nuovo. <b>Non toccati:</b> padding del corpo, X, tetto di altezza, testata.',
                  'Misurare di nuovo dopo la modifica: Suggerisci corto (32/32), con barra (32 dalla barra), e Profilo con lo stato lungo (va a capo: lo stato ha <code>flex: 1 1 200px</code>).',
                  'Test: nessuno nuovo (CSS e markup, il progetto non ha test di componenti). Verifica a mano a 390 e a 1280 px, chiaro e scuro.',
                  'Non verificato: Safari e Firefox (barra e <code>scrollbar-gutter</code>), il pannello dei filtri e il menu (stesso <code>stable</code> di <code>.sheet-surface()</code>), l\'Account con stato lungo.',
                  'Deviazioni di DESIGN.md: «Popup | <code>Modal.less</code> | <code>scrollbar-gutter: auto</code> in <code>.dialog__scroll</code> (era <code>stable</code>): padding 2 rem / 1,5 rem simmetrico senza scorrimento | voce 22 di HANDOFF §2». La riga della cartella di lavoro («da confermare con Design») si cancella.']))
    pd = tbl(['Cosa', 'Prima', 'Dopo', 'File'], [
        ['Gutter del popup', '<code>stable</code>: 32 / 44 px', '<code>auto</code>: 32 / 32 px (barra solo se serve)', 'Modal.less r.26-31'],
        ['Titolo e X', 'titolo scorre, X fissa', 'invariato (la variante (a) è disegnata, non raccomandata)', 'Modal.tsx r.193-219'],
        ['Padding del corpo', '2 rem / 1,5 rem', 'invariato', 'Modal.less r.83-87, r.126-128'],
        ['Suggerisci · Invia', 'a destra, piccolo', 'a tutta larghezza, <code>lg</code>', 'SuggestForm.tsx, SuggestForm.less'],
        ['Profilo · Salva', 'a sinistra', 'a destra, stato a sinistra', 'ProfileSection.tsx / .less'],
        ['Colonna sotto 40em', 'solo <code>.dialog--confirm</code>', 'ogni <code>.dialog__actions</code>', 'ConfirmDialog.less r.78-85']])
    return (f'<div class="dc-sec"><h2 class="dc-h2">Revisione · struttura, scrollbar, padding e pulsante principale dei popup (voce 22)</h2><div>{prop}</div>'
            '<p class="dc-sub">Riferimento: main 3dfc873 più la modifica non ancora su main (<code>scrollbar-gutter: auto</code> in <code>Modal.less</code>, nella cartella di lavoro <code>design-suite-architecture-41e77f</code>, non committata). Misurato nel browser (Chromium) con il CSS del canvas e i font veri; le etichette nere sotto i riquadri sono misure prese dalla pagina quando si apre. Gli esempi usano il popup «Suggerisci una modifica» (campo, contatore e «Invia» sono l\'esempio del committente). Nessun testo nuovo.</p>'
            + box('Scelta · raccomandazione e alternative per punto', f'<p>{why}</p><p>{why2}</p><p>{why3}</p><p>{why4}</p>')
            + sec('Scrollbar presente e assente (b, c)', '1: com\'era (32 / 44 px, la barra è riservata anche se non serve); 2 e 3: con <code>auto</code>. Il riquadro 3 scorre perché il contenuto supera il tetto di altezza.', col(scrolls(A), scrolls(Bd)))
            + sec('Variante (a): titolo e X fissi, scorre solo il corpo', 'Chiaro e scuro. Il corpo scorre sotto un filo <code>--line</code> da 1 px; la barra parte sotto la testata. Non raccomandata (vedi sopra): vuole una testata fuori da <code>.dialog__scroll</code>.', scrolls(fixed))
            + sec('Telefono, 390 px', 'Bottom sheet, padding 24 px. Su un telefono vero la barra è overlay e non occupa spazio; i due riquadri a destra mostrano la barra da 12 px che compare in una finestra stretta usata con il mouse.', row(P1, P2, P3))
            + sec('Pulsante principale (d)', 'Oggi e proposta per i due popup che cambiano. Le etichette nere sotto sono la posizione misurata del pulsante nel corpo.', col(scrolls(F), scrolls(G)) + surv)
            + sec('Misure', '', meas)
            + sec('Regola per Code', 'Stato di partenza: main 3dfc873 più la modifica non committata. Il prompt completo è in <code>docs/design/PROMPT_CODE_POPUP_CAMPI.md</code>.', rule)
            + sec('Prima, dopo, file', '', pd) + '</div>')


def build_access():
    prop = tag('proposta · non implementata', 'k2')
    NOTE = lambda t, icon_=False, cls='muted': f'<p class="{cls} auth-dialog__note">{(icon("info", 18) + "<span>" + t + "</span>") if icon_ else t}</p>'

    def login(note_html):
        pw = (f'<div class="field"><div class="field__label"><label>{L("auth.password")}</label><button type="button" class="link-button">{L("auth.login.forgotLink")}</button></div>'
              f'<div class="field__control"><input type="password" data-clearable="true"><button type="button" class="field__button" aria-label="{L("auth.showPassword")}" aria-pressed="false">{icon("eye")}</button></div><p class="field__message"></p></div>')
        em = fld(L('auth.email'), '', typ='email')
        reg = L("auth.login.noAccount").replace("{link}", f'<button type="button" class="link-button">{L("auth.login.registerLink")}</button>')
        body = (f'<div class="auth-view"><form class="form" novalidate>{em}{pw}<button type="submit" class="btn btn--primary btn--lg">{icon("log-in")}{L("auth.login.button")}</button></form><p>{reg}</p></div>')
        return popup(L('auth.login.title'), note_html + body)

    def reg(note_html):
        body = (f'<div class="auth-view"><p>{L("auth.register.intro")}</p><form class="form" novalidate>{fld(L("auth.name"), "", msg=L("auth.nameHint"))}{fld(L("auth.email"), "", typ="email")}'
                f'<button type="submit" class="btn btn--primary btn--lg">{icon("user-plus")}{L("auth.register.button")}</button></form></div>')
        return popup(L('auth.register.title'), note_html + body)

    N1 = 'Accedi per suggerire una modifica.'
    N2 = 'Accedi al tuo account per condividere il tuo planner.'
    N3 = 'Accedi per essere avvisato via e-mail quando esce <span lang="en">Thor: Ragnarok</span>.'
    css = FX.replace('.row3 dialog.dialog{width:560px}', '') + '.row3 dialog.dialog{width:460px}.mcap{max-width:460px}.fix .auth-dialog__note{margin-bottom:0}'

    def two(label, th, a, b, h, w):
        return fr(label, th, w, h, '<div class="row3">' + wrap('note', '', a) + '<div class="fix">' + wrap('note', '', b) + '</div></div>'
                  '<div class="row3" style="padding-top:0"><span class="mcap" style="width:460px">Oggi</span><span class="mcap" style="width:460px">Proposta</span></div>', css, CAPJS)

    s1 = two('Accesso con la riga · oggi (margine 16 px + gap) e proposta (solo il gap da 20 px) · chiaro', 'light', login(NOTE(N1)), login(NOTE(N1)), 600, 1000)
    s2 = two('Accesso con la riga · oggi e proposta · scuro', 'dark', login(NOTE(N2)), login(NOTE(N2)), 600, 1000)
    bold = NOTE(N3).replace('class="muted auth-dialog__note"', 'class="auth-dialog__note" style="font-weight:600"')
    ico = NOTE(N3, True).replace('class="muted auth-dialog__note"', 'class="muted auth-dialog__note" style="display:flex;gap:var(--sp-2);align-items:flex-start"')
    st = fr('Stile della riga · muted regolare (raccomandato) · in ink con peso 600 · con icona', 'light', 1460, 560,
            '<div class="row3 fix">' + wrap('note', '', login(NOTE(N3))) + wrap('note', '', login(bold)) + wrap('note', '', login(ico)) + '</div>', css + '.row3{gap:16px}', CAPJS)
    rg = fr('Registrati · oggi (riga + presentazione) e proposta (solo la presentazione) · chiaro', 'light', 1000, 700,
            '<div class="row3">' + wrap('note', '', reg(NOTE(N1))) + '<div class="fix">' + wrap('note', '', reg('')) + '</div></div>', css, CAPJS)
    how = ('<b>Regola (confermata): ogni azione che richiede l\'account apre direttamente il popup di accesso</b>, con la riga del perché sopra il modulo. Nel codice (cartella di lavoro <code>design-suite-architecture-41e77f</code>, non committata): <code>open(view, payload, note)</code>, con la nota nello stato del provider, tenuta quando si passa da accedi a registrati e tolta alla chiusura (<code>AuthDialogContext.ts</code> r.19-25, <code>AuthDialogProvider.tsx</code> r.16-27); la riga è disegnata in <code>AuthDialogs.tsx</code> r.233-235; chiamanti: Suggerisci (<code>SuggestProvider.tsx</code> r.35-43), Condividi (<code>Planner.tsx</code> r.232-236; <code>ShareDialog.tsx</code> r.233-239 da ospite non mostra più nulla), avvisi sui titoli (<code>TitleAlertsProvider.tsx</code>).')
    pts = ul([
        '<b>Stile della riga: <code>.muted</code>, peso 400, corpo 16 px, nessuna icona (confermato come oggi).</b> È una frase di contesto sotto il titolo, non uno stato: nei campi l\'icona (18 px) accompagna solo messaggi di stato (suggerimento, avviso, errore) e la presentazione della registrazione («I progressi già salvati…») è un <code>p</code> normale. <code>--ink-2</code> su <code>--surface</code> fa 7,1:1 in chiaro e 8,5:1 in scuro (calcolo). <b>Alternative disegnate:</b> in ink con peso 600 (compete con il titolo e con il modulo) e con icona <code>Info</code> (decorazione: la riga sembra un avviso).',
        '<b>Spazio sotto la riga: togliere il <code>margin-bottom</code> da <code>--sp-4</code> (<code>AuthDialogs.less</code> r.26-28).</b> La riga è figlia diretta di <code>.dialog__body</code>, colonna flex con gap 1,25 rem (<code>Modal.less</code> r.83-87): il margine si somma al gap (in flex non collassa), quindi dalla riga al modulo ci sono <b>36 px</b> (16 + 20) mentre dal titolo alla riga ce ne sono 16. Con il solo gap sono 20 px, come tra la presentazione e il modulo nella registrazione: la riga introduce il modulo invece di staccarsene. Misure nei riquadri.',
        '<b>Sul «registrati»: solo sull\'accedi.</b> Oggi compare su entrambe le viste (<code>AuthDialogs.tsx</code> r.233: <code>login</code> o <code>register</code>). Su «Crea un account» il verbo non torna («Accedi per suggerire una modifica» sotto un titolo che dice «Crea un account») e c\'è già la presentazione («I progressi già salvati su questo dispositivo…»): due paragrafi prima del modulo. Chi ha scelto «Registrati» sa già perché è lì. La nota resta nello stato, quindi tornando a «Accedi» riappare. <b>Alternativa:</b> su entrambe, con un testo neutro che regge su tutte e due le viste («Per suggerire una modifica serve un account.»): tre testi nuovi nelle cinque lingue. Resta fuori dalle altre viste (recupero, nuova password).',
        '<b>Da decidere: dopo l\'accesso «Condividi» non si apre da solo</b> (<code>Planner.tsx</code> r.232-236 non tiene l\'attesa), mentre Suggerisci (<code>SuggestProvider.tsx</code> r.17-32) e gli avvisi sui titoli riprendono l\'azione. <b>Raccomandazione:</b> riprenderla anche per Condividi, con lo stesso schema (attesa, effetto alla comparsa dell\'utente, fine dell\'attesa se il popup si chiude senza accesso). <b>Alternativa:</b> lasciare così: rompe la regola «un\'azione, un percorso».',
        '<b>Testi: nessuno nuovo.</b> Quelli di oggi: <code>suggest.guest</code> «Accedi per suggerire una modifica.» (it.ts r.564), <code>share.loginRequired</code> «Accedi al tuo account per condividere il tuo planner.» (r.225; <code>share.loginButton</code> tolta), <code>titleAlerts.loginNote</code> «Accedi per essere avvisato via e-mail quando esce {titolo}.» (r.570; il titolo resta in inglese con <code>lang="en"</code>). Le versioni in en, fr, es, de sono già nel codice.'])
    meas = tbl(['Misura (a 1280 px, popup <code>--md</code>)', 'Oggi', 'Proposta'], [
        ['Titolo → riga', '16 px (0,5 rem sotto il titolo + 0,5 rem sopra il corpo)', '16 px (invariato)'],
        ['Riga → modulo', '<b>36 px</b> (margine 16 + gap 20)', '<b>20 px</b> (solo il gap)'],
        ['Presentazione → modulo, registrazione', '20 px (gap di <code>.auth-view</code>)', '20 px'],
        ['Riga', '<code>.muted</code>: <code>--ink-2</code>, 16 px, peso 400, interlinea 1,5', 'invariata']])
    rule = ('<pre><code>// AuthDialogs.tsx r.233: la riga solo sull\'accesso\n{note &amp;&amp; currentView === "login" &amp;&amp; (&lt;p className="muted auth-dialog__note"&gt;{note}&lt;/p&gt;)}\n\n// AuthDialogs.less r.26-28: via il margine (il gap 1,25 rem di .dialog__body basta); la classe resta come aggancio\n.auth-dialog__note { margin-bottom: 0; }   // oppure elimina la regola\n\n// Planner.tsx: Condividi riprende dopo l\'accesso, come SuggestProvider.tsx r.17-32</code></pre>'
            + ul(['Nessun valore nuovo.',
                  'Test: nessuno nuovo per la riga (markup e CSS). Se Condividi riprende dopo l\'accesso: un test della funzione pura se si estrae la logica dell\'attesa; altrimenti verifica a mano (ospite → Condividi → accesso → il popup di condivisione si apre; chiusura senza accesso → non si apre nulla).',
                  'Deviazioni di DESIGN.md: «Popup di accesso | <code>AuthDialogs.tsx/.less</code> | riga del perché solo sull\'accesso e senza margine (il gap di <code>.dialog__body</code> la separa dal modulo) | voce 23 di HANDOFF §2».']))
    pd = tbl(['Cosa', 'Prima', 'Dopo', 'File'], [
        ['Condividi da ospite', 'popup «Condividi» con frase e pulsante «Accedi»', 'popup di accesso con la riga', 'Planner.tsx r.232-236; ShareDialog.tsx r.233-239'],
        ['Suggerisci da ospite', 'popup con frase e pulsante «Accedi»', 'popup di accesso con la riga', 'SuggestProvider.tsx r.35-43'],
        ['Avvisami da ospite', 'riga già nel popup di accesso', 'invariato, riga dal provider comune', 'TitleAlertsProvider.tsx'],
        ['Spazio riga → modulo', '36 px', '20 px', 'AuthDialogs.less r.26-28'],
        ['Riga su «Registrati»', 'sì', 'no (resta nello stato)', 'AuthDialogs.tsx r.233']])
    return (f'<div class="dc-sec"><h2 class="dc-h2">Decisione · popup di accesso unificati: la riga del perché (voce 23)</h2><div>{prop}</div>'
            f'<p class="dc-sub">Riferimento: main 3dfc873 più la modifica non ancora su main (popup unificati, nella cartella di lavoro <code>design-suite-architecture-41e77f</code>). {how} Le etichette nere sotto i riquadri sono misure prese dalla pagina quando si apre.</p>'
            + box('Scelta · raccomandazione e alternative per punto', pts)
            + sec('Accesso con la riga: spazio sotto la riga', 'Oggi: 36 px dalla riga al modulo. Proposta: 20 px.', col(scrolls(s1), scrolls(s2)))
            + sec('Stile della riga', 'Tre stili sullo stesso popup (testo «avvisami», titolo in inglese con <code>lang="en"</code>). Tutti con 20 px sotto la riga.', scrolls(st))
            + sec('Registrati: con e senza la riga', 'Oggi la riga sta anche su «Crea un account», sopra la presentazione.', scrolls(rg))
            + sec('Misure', '', meas)
            + sec('Regola per Code', 'Stato di partenza: main 3dfc873 più la modifica non committata.', rule)
            + sec('Prima, dopo, file', '', pd) + '</div>')


def insert(page, marker, build_fn):
    p = os.path.join(CANVAS, page + '.dc.html')
    t = open(p, encoding='utf-8', newline='').read()
    if marker in t:
        raise SystemExit(page + ': già inserito')
    end = '\n</div>\n</x-dc>'
    assert t.count(end) == 1
    open(p, 'w', encoding='utf-8', newline='').write(t.replace(end, '\n' + build_fn() + end, 1))
    print('ok', page)


if __name__ == '__main__':
    if VERIFY:
        src = open(os.path.join(CANVAS, 'Textfield.dc.html'), encoding='utf-8').read()
        st = re.search(r'<helmet>.*?<style>(.*?)</style>', src, re.S).group(1)
        for nm, fn in (('v_popup.html', build_popups), ('v_access.html', build_access)):
            open(os.path.join(S, nm), 'w', encoding='utf-8').write('<!doctype html><meta charset=utf-8><body>' + css() + FONT + f'<style>{st}</style><div class="dc-pg">{fn()}</div>')
        print('verify ok')
    else:
        insert('Popup generici', 'struttura, scrollbar, padding e pulsante principale dei popup', build_popups)
        insert('Popup di accesso', 'popup di accesso unificati: la riga del perché', build_access)
