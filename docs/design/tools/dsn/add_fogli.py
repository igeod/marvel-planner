"""Blocco della pagina «Popup generici»: regola di chiusura e fogli in basso (voce 26).
Scritto a mano nel canvas: `python add_fogli.py` lo inserisce una volta sola (con --force lo sostituisce).
Una rigenerazione di p_dialogs.py lo cancella. Geometria: dai .less di 4bfbea4 (citati) e dall'audit; nessuna misura su dispositivo."""
import sys
import html as _h
from add_pc_lib import *
from parts import btn

W, H = 390, 844   # iPhone 13/14: finestra di riferimento dell'audit
SG = 48           # distanza dal bordo alto oggi nel foglio generico (Modal.less r.104-108) e proposta (--sheet-gap)

# ---- scena: pagina sotto, velo, foglio ancorato al fondo ------------------------------------------
CSS = ('body{padding:0!important;height:%dpx;position:relative;overflow:hidden;background:var(--bg)}' % H +
       '.pg{position:absolute;inset:0;padding:64px 16px;color:var(--ink-2);font-size:14px}.pg i{display:block;height:44px;border-radius:var(--r-row);background:var(--row);margin-bottom:8px}'
       '.scrim{position:absolute;inset:0;background:var(--scrim)}'
       '.sh{position:absolute;left:0;right:0;bottom:0;background:var(--surface);color:var(--ink);border-radius:var(--r-lg) var(--r-lg) 0 0;box-shadow:var(--shadow-pop);overflow:hidden}'
       '.sh .hd{position:absolute;top:12px;left:calc(50% - 20px);width:40px;height:5px;border-radius:var(--r-hair);background:var(--disabled)}'
       '.sh h2{margin:0;padding:28px 76px 8px 24px;font-size:var(--fs-h4);font-weight:800;line-height:1.2}'
       '.sh h2.anton{font-family:var(--font-display);font-size:var(--fs-h1-sm);font-weight:400;line-height:1;text-transform:uppercase;padding-top:24px}'
       '.sh .x{position:absolute;top:12px;right:12px;width:44px;height:44px;border-radius:999px;background:var(--bg);display:flex;align-items:center;justify-content:center}'
       '.sh .x.in{top:20px;right:24px;background:var(--row)}'
       '.sh .ln{margin:12px 24px;height:14px;border-radius:7px;background:var(--row)}'
       '.sh .act{position:absolute;left:24px;right:24px;display:flex;gap:8px}.sh .act .btn{flex:1}'
       '.mh{position:absolute;left:0;right:0;border-top:2px dashed var(--highlight);z-index:9}'
       '.mk{position:absolute;left:8px;z-index:10}'
       '.nt{position:absolute;top:11px;left:calc(50% - 63px);width:126px;height:37px;border-radius:19px;background:#000;z-index:12}'
       '.hb{position:absolute;bottom:8px;left:calc(50% - 67px);width:134px;height:5px;border-radius:3px;background:var(--ink);z-index:12}'
       '.zs{position:absolute;left:0;right:0;z-index:8;background:repeating-linear-gradient(135deg,rgba(220,40,60,.28) 0 6px,transparent 6px 12px)}')


def lines(n):
    return ''.join('<div class="ln"></div>' for _ in range(n))


def sheet(top, title, *, anton=False, xin=False, handle=True, body=6, actions=None, act_bottom=24, label=None, zs_top=None, zs_bottom=None, notch=False, x=True):
    """top = distanza dal bordo alto della finestra in px; il foglio sta ancorato al fondo."""
    h = H - top
    acts = ''
    if actions:
        acts = f'<div class="act" style="bottom:{act_bottom}px">{actions}</div>'
    mk = f'<div class="mh" style="top:{top}px"></div><span class="mk" style="top:{max(top - 20, 0)}px;font:800 11px/16px var(--font-body);background:var(--highlight);color:var(--ink-static);padding:0 5px;border-radius:var(--r-tiny)">{label or str(top) + " px"}</span>'
    z = ''
    if zs_top:
        z += f'<div class="zs" style="top:0;height:{zs_top}px"></div>'
    if zs_bottom:
        z += f'<div class="zs" style="bottom:0;height:{zs_bottom}px"></div>'
    extra = ('<div class="nt"></div><div class="hb"></div>' if notch else '')
    return ('<div class="pg">' + '<i></i>' * 14 + '</div><div class="scrim"></div>'
            f'<div class="sh" style="height:{h}px">{"<span class=hd></span>" if handle else ""}<h2 class="{"anton" if anton else ""}">{title}</h2>'
            f'{"<span class=" + chr(34) + "x" + (" in" if xin else "") + chr(34) + ">" + icon("x") + "</span>" if x else ""}{lines(body)}{acts}</div>{mk}{z}{extra}')


def frm(label, theme, html_, w=W, h=H, extra=''):
    return fr(label, theme, w, h, html_, CSS + extra)


def acts_filters():
    return btn('soft', 'Cancella filtri', 'lg') + btn('primary', 'Mostra 71 titoli', 'lg')


def build():
    prop = tag('proposta · non implementata', 'k2')
    good = lambda t: f'<b>{t}</b>'
    # ---------------- scene: oggi / proposta, 844 px -------------------------------------------------
    A1 = sheet(48, 'Condividi il tuo planner', body=22, label='48 px · generico (Modal.less r.104)')
    A2 = sheet(24, 'Filtri', anton=True, xin=True, body=20, label='24 px · Filtri (FiltersSheet.less r.7)', actions=acts_filters())
    A3 = sheet(84, 'Account', body=20, label='84 px · tetto 760 px (AccountSettings.less r.24)')
    B1 = A1.replace('48 px · generico (Modal.less r.104)', '48 px · --sheet-gap')
    B2 = sheet(48, 'Filtri', xin=False, body=18, label='48 px · --sheet-gap', actions=acts_filters(), act_bottom=24)
    B3 = A3.replace('84 px · tetto 760 px (AccountSettings.less r.24)', '84 px · tetto 760 px (eccezione)')
    old = row(frm('Oggi · generico', 'light', A1), frm('Oggi · Filtri', 'light', A2), frm('Oggi · Account', 'light', A3))
    new = row(frm('Proposta · generico', 'light', B1), frm('Proposta · Filtri', 'light', B2), frm('Proposta · Account', 'light', B3))
    newd = row(frm('Proposta · generico · scuro', 'dark', B1), frm('Proposta · Filtri · scuro', 'dark', B2), frm('Proposta · Account · scuro', 'dark', B3))
    # ---------------- zone sicure ---------------------------------------------------------------------
    SAT, SAB = 59, 34   # iPhone con isola dinamica in verticale: valori tipici, non misurati sul telefono
    gap_safe = max(SG, SAT + 8)
    S1 = sheet(SG, 'Filtri', anton=True, xin=True, body=18, actions=acts_filters(), act_bottom=24, label='oggi: 48 px (sotto l\'isola)', zs_top=SAT, zs_bottom=SAB, notch=True)
    S2 = sheet(gap_safe, 'Filtri', body=18, actions=acts_filters(), act_bottom=24 + SAB, label=f'proposta: {gap_safe} px = max(48, inset 59 + 8)', zs_top=SAT, zs_bottom=SAB, notch=True)
    safe = row(frm('Oggi · Filtri con isola e indicatore di Home (strisce = zona non sicura)', 'light', S1),
               frm('Proposta · distanza ≥ inset + 8, Applica sopra l\'indicatore', 'light', S2))
    # ---------------- desktop: X o testo, mai tutti e due ----------------------------------------------
    DK = ('body{padding:16px!important;height:auto;overflow:visible}dialog.dialog{width:520px;max-width:520px}'
          '.row3{display:flex;gap:24px;align-items:flex-start}')
    content = popup('Condividi il tuo planner', '<p>Chi ha il link vede il tuo nome da supereroe e i titoli che hai visto.</p>' + btn('primary', 'Crea link', 'lg'))
    decision = popup('Importa il planner condiviso', '<p>24 titoli visti su 60. Puoi unirlo al tuo planner o sostituirlo.</p>' +
                     '<div class="dialog__actions">' + btn('soft', 'Non importare') + btn('primary', 'Unisci i due planner') + '</div>', close=False)
    dk = fr('Desktop · contenuto: la X · decisione: il pulsante di testo, niente X (nessuna maniglia: >= 40 em)', 'light', 1160, 330,
            f'<div class="row3">{content}{decision}</div>', DK)
    # ---------------- contrasto forzato (immagini) ------------------------------------------------------
    img = lambda f, cap, alt: (f'<div class="dc-fw"><div class="dc-fl">{cap}</div><img src="assets/{f}" alt="{alt}" width="390" style="display:block;max-width:100%;border-radius:var(--r-md)"></div>')
    forced = ('<div class="dc-row">' +
              img('fogli-forced-oggi.png', 'Contrasto forzato · oggi · la maniglia sparisce', 'Foglio in basso con contrasto forzato: il trattino in cima non si vede, restano il contorno del foglio e la X') +
              img('fogli-forced-proposta.png', 'Contrasto forzato · proposta · maniglia in GrayText', 'Foglio in basso con contrasto forzato: il trattino in cima è disegnato con il colore di sistema GrayText') + '</div>')
    # ---------------- tabelle --------------------------------------------------------------------------
    T1 = tbl(['Tipo di popup', 'Esempi', 'Modo visibile per chiudere', 'Maniglia e trascinamento (sotto 40 em)', 'Esc', 'Clic sullo sfondo', 'Uscita con dati non salvati'], [
        ['Contenuto o compito (<code>Modal</code>)', 'Condividi, Privacy, Guida, Trailer, Accesso, Suggerisci, Completamento', 'la <b>X</b> (12 px dall\'alto, 12 dal bordo, 44 × 44)', '<b>sì</b> (<code>Modal.tsx</code> r.45-49)', 'chiude', 'chiude', 'nessuna conferma: Suggerisci tiene la bozza in memoria (<code>SuggestForm.tsx</code> r.15-16)'],
        ['Decisione su <code>Modal</code> (<code>showClose={false}</code>)', 'Importa, Scelta di unione, Admin «Segna verificato»', 'il pulsante di testo («Annulla», «Non importare»)', '<b>sì</b> (stessa <code>Modal</code>)', 'chiude', 'chiude', 'n.a.'],
        ['Conferma (<code>ConfirmDialog</code>, <code>&lt;dialog&gt;</code> proprio)', 'Azzera, Elimina account, Manutenzione', 'il pulsante «Annulla»', '<b>no</b>: nessuna testata, nessun gesto (<code>ConfirmDialog.tsx</code> r.57-65)', 'annulla (ignorato se in corso)', '<b>non chiude</b> (nessun <code>onClick</code> sul dialog): diverso da tutti gli altri', 'n.a.'],
        ['Filtri (foglio)', 'Filtri', 'la X nella testata, a destra del titolo (24 px dal bordo)', '<b>sì</b> (<code>FiltersSheet.tsx</code> r.35-39)', 'chiude', 'chiude', 'la bozza si scarta (dichiarato nel commento r.74)'],
        ['Account (foglio)', 'Profilo, Password, Account', 'la X (12 / 12)', '<b>sì</b> (<code>AccountSettings.tsx</code> r.106)', 'chiude', 'chiude', '<b>la sola conferma</b>: banner «Hai modifiche non salvate» (<code>tryClose</code> r.119-124); nessun gesto chiude durante un invio'],
        ['Menu (pannello dall\'alto)', 'Menu (sotto il tablet)', 'la X nella barra', 'no (si apre dall\'alto)', 'chiude', 'chiude', 'n.a.']])
    T2 = tbl(['Finestra alta', 'Generico (<code>100dvh − 48</code>)', 'Filtri oggi (<code>100dvh − 24</code>)', 'Filtri proposta', 'Account oggi (<code>min(760, vh − 48)</code>)', 'Account proposta'], [
        ['667 px (iPhone SE)', '48', '24', '48', '48', '48 (invariato)'],
        ['844 px (iPhone 13/14)', '48', '24', '48', '84 (l\'audit ha misurato 87: la differenza di 3 px non è spiegata)', '84 (invariato: tetto da 760)'],
        ['932 px (Pro Max)', '48', '24', '48', '172', '172 (invariato)']])
    T3 = tbl(['Dove', 'Oggi (dal codice)', 'Proposta'], [
        ['Margine in alto di ogni foglio', '48 px a mano nel generico e in Account (<code>Modal.less</code> r.104-108, <code>AccountSettings.less</code> r.24-25), 24 px nei Filtri (<code>FiltersSheet.less</code> r.7): nessun <code>env(safe-area-inset-top)</code> da nessuna parte', '<b>nuovo token</b> <code>--sheet-gap: max(3rem, calc(env(safe-area-inset-top, 0px) + var(--sp-2)))</code>: 48 px (il valore di oggi) o, se la zona non sicura è più alta di 40 px, inset + 8 px'],
        ['Altezza massima', '<code>100dvh</code> nel generico e nei Filtri; <code>--viewport-height</code> (viewport visivo, impostata da <code>AccountSettings.tsx</code> r.142-154) solo nell\'Account', 'una sola regola per tutti: <code>calc(var(--viewport-height, 100dvh) − var(--sheet-gap))</code>. Il gancio che imposta <code>--viewport-height</code> si sposta da <code>AccountSettings</code> a un punto comune (<code>Modal</code> e <code>FiltersSheet</code>)'],
        ['In basso (indicatore di Home)', '<code>env(safe-area-inset-bottom)</code> nel corpo di <code>Modal</code> (r.127), Account (r.295, r.370), Toast, barre. <b>Non</b> nei Filtri: «Mostra N titoli» sta a 24 px dal bordo', 'Filtri: <code>padding-bottom: calc(1.5rem + env(safe-area-inset-bottom, 0px))</code>'],
        ['Ai lati', 'mai usato', '<b>non serve per i fogli</b>: un foglio esiste solo sotto 40 em (portrait), dove l\'inset laterale è 0; in orizzontale (≥ 640 px) il popup è centrato e largo al massimo 35 rem. Nessuna modifica'],
        ['Menu (pannello dall\'alto)', 'parte da y = 0, padding in alto 10 px (<code>HeaderMenu.less</code> r.23)', 'padding in alto <code>calc(var(--sp-2h) + env(safe-area-inset-top, 0px))</code>'],
        ['Scorrimento oltre il fondo (D4, causa 3)', '<code>overscroll-behavior: contain</code> solo su <code>.sheet-surface()</code> (Filtri, Menu), non su <code>.dialog__scroll</code>', 'aggiungerlo a <code>.dialog__scroll</code>: il rimbalzo non scopre lo sfondo sotto il foglio'],
        ['Titoli (D7)', 'Filtri: Anton 36 px (<code>--fs-h1-sm</code>, <code>.display-font()</code>); gli altri Hanken 800 24 px (<code>--fs-h4</code>); Menu: il logotipo', 'tutti i fogli: Hanken 800 <code>--fs-h4</code> (Filtri compreso). Il Menu resta col logotipo: è la continuazione dell\'intestazione, non il titolo di un compito'],
        ['X dei Filtri', 'dentro la testata, 24 px dal bordo destro, pulsante <code>soft</code>', 'come negli altri fogli: X a 12 / 12, <code>.dialog__close</code> (stesso componente, stessa posizione)']])
    why = ('<b>1 · Una regola di chiusura, confermata (con due correzioni).</b> Resta quanto già deciso: un solo modo <i>visibile</i> per chiudere (la X nei popup di contenuto; il pulsante di testo nelle decisioni) e i modi invisibili, sempre uguali (Esc, clic sullo sfondo, trascinamento del foglio). Il trascinamento non è l\'unico modo: la X o il pulsante restano (WCAG 2.5.7, alternativa a un gesto di trascinamento). '
           '<b>Correzione A:</b> il canvas dice che la maniglia resta «in tutti e due i casi», ma <code>ConfirmDialog</code> non ha testata, quindi né maniglia né gesto. <b>Regola: la maniglia compare se e solo se il foglio si trascina.</b> Le conferme non si trascinano (due pulsanti, un solo gesto possibile: «Annulla»): restano senza maniglia e il blocco «quando la X c\'è e quando no» va riscritto in questo senso. '
           '<b>Correzione B:</b> il canvas dice che il clic sullo sfondo chiude sempre; <code>ConfirmDialog</code> non lo fa. <b>Raccomandazione: lo faccia</b> (equivale ad «Annulla», che è l\'esito sicuro), tranne mentre una richiesta è in corso. Alternativa scartata: lasciarlo com\'è, perché dimenticare un tocco fuori dal riquadro non perde dati.')
    why2 = ('<b>2 · Una sola conferma di uscita (D8), già nel codice: l\'Account.</b> È l\'unico popup che modifica dati sul server. Suggerisci tiene la bozza in memoria fino al ricaricamento, i Filtri scartano una bozza che si rifà in due tocchi, i moduli di accesso si ricompilano: non meritano una domanda. Non aggiungo conferme. In più: mentre una richiesta è in corso nessun gesto chiude (Account e Conferma già così; verificare Importa).')
    why3 = ('<b>3 · Distanza dal bordo alto (D6): 48 px ovunque, tranne il tetto dell\'Account.</b> 48 px è il valore del generico e dell\'Account sotto i 808 px di altezza, e lascia vedere la pagina sotto il velo (si capisce che è un foglio, non una pagina). I Filtri a 24 px passano a 48: costano 24 px di 844 (3 %). '
           'L\'87 px dell\'Account non è una distanza voluta ma l\'effetto del tetto <code>min(760px, …)</code>: il suo contenuto ha una scheda a altezza fissa (cambiare scheda non deve far saltare il foglio). Il tetto resta, annotato come eccezione. <b>Scartate:</b> 24 px per tutti (il foglio sembra una pagina); un tetto percentuale (non è un token e cambia a ogni telefono).')
    why4 = ('<b>4 · Margini di sicurezza (D5): solo in alto e in basso, con un token nuovo.</b> Lo schema è il margine che già esiste in basso (<code>env(safe-area-inset-bottom)</code> nel corpo), esteso: (a) in alto <code>--sheet-gap</code> (nuovo token, proposto: il valore «48 px» oggi è scritto a mano in tre file e non ha nome); (b) in basso anche nei Filtri, dove oggi manca. Ai lati <b>no</b>: un foglio esiste solo sotto 40 em, cioè in portrait, dove l\'inset laterale è 0; in orizzontale il popup è centrato e largo 35 rem al massimo. '
           'In Safari normale l\'inset in alto vale 0 (la barra di stato sta fuori dalla pagina): serve per la modalità a schermo intero e per un\'eventuale app installata. <b>Valori 59 / 34 px: tipici dell\'iPhone con isola dinamica, non misurati sul telefono.</b>')
    why5 = ('<b>5 · Altezza massima e bordo che si stacca (D4): una causa sola raccomandata, due da provare.</b> Raccomandato: <b>l\'altezza segue il viewport visivo</b> (<code>--viewport-height</code>, come l\'Account) invece di <code>100dvh</code>: quando la barra di Safari si ritira o compare la tastiera, <code>100dvh</code> non è sempre aggiornato mentre il foglio è ancorato in basso (cause 1 e 4 dell\'audit); i popup con campi (Accesso, Suggerisci) hanno lo stesso problema della tastiera che l\'Account ha già risolto. '
           'Da provare sul telefono, uno alla volta: <code>overscroll-behavior: contain</code> su <code>.dialog__scroll</code> (causa 3) e togliere <code>overflow: hidden</code> dal <code>&lt;dialog&gt;</code> mettendo il raggio sul contenitore che scorre (causa 2). <b>Non riproduco il difetto: nessuna prova su iPhone, nessun WebKit qui.</b> Per questo la proposta è un elenco di ipotesi con una prova a testa (vedi «Regola per Code»), non una correzione certa.')
    why6 = ('<b>6 · Titoli e X (D7).</b> Un solo titolo di foglio: Hanken 800 a <code>--fs-h4</code>, come già in sette popup su otto. Anton è per titoli di pagina e numeri grandi (<code>DESIGN.md</code>, Tipografia): a 36 px e in maiuscolo non entrerebbe nei titoli lunghi di fr e de. Il titolo dei Filtri scende da 36 a 24 px e la testata si accorcia di circa 12 px. '
           'La X dei Filtri va allo stesso posto delle altre (12 / 12, <code>.dialog__close</code>): cinque fogli, cinque X, ora in due posti diversi.')
    why7 = ('<b>7 · Contrasto forzato.</b> La maniglia è uno sfondo (<code>--disabled</code>): in contrasto forzato il browser sostituisce gli sfondi e il trattino sparisce (verificato con l\'emulazione di Chromium, immagini sotto). È decorativa e il gesto resta, ma chi lo usa non lo vede. Proposta: <code>forced-color-adjust: none; background: GrayText</code> sulla maniglia, in <code>forced-colors.less</code>. Il contorno del foglio (<code>dialog.dialog</code>, <code>.filters-sheet</code>, <code>.menu-panel</code>) c\'è già.')
    rule = ('<pre><code>// tokens.less (NUOVO, proposto): il 48 px di oggi con un nome, più il margine di sicurezza in alto\n'
            '--sheet-gap: max(3rem, calc(env(safe-area-inset-top, 0px) + var(--sp-2)));\n\n'
            '// Modal.less, sotto 40em (r.104-108)\n'
            'dialog.dialog { max-height: calc(var(--viewport-height, 100dvh) - var(--sheet-gap)); }\n'
            '.dialog__scroll { max-height: calc(var(--viewport-height, 100dvh) - var(--sheet-gap)); overscroll-behavior: contain; }\n\n'
            '// FiltersSheet.less\n'
            'dialog.filters-sheet { max-height: calc(var(--viewport-height, 100dvh) - var(--sheet-gap)); }   // era 100dvh - 24px\n'
            '.filters-sheet__body { padding: 1.25rem var(--sp-6) calc(1.5rem + env(safe-area-inset-bottom, 0px)); }\n'
            '.filters-sheet__title { /* via .display-font() e font-size: --fs-h1-sm */ font-size: var(--fs-h4); font-weight: 800; line-height: 1.2; }\n'
            '// FiltersSheet.tsx: la X come in Modal (.dialog__close a 12 / 12) e la testata con il padding di .dialog__header\n\n'
            '// AccountSettings.less (r.24-25): solo il token al posto di 48px\n'
            'height: min(760px, calc(var(--viewport-height, 100dvh) - var(--sheet-gap)));\n'
            'max-height: calc(var(--viewport-height, 100dvh) - var(--sheet-gap));\n\n'
            '// HeaderMenu.less: .menu-panel__body { padding-top: calc(var(--sp-2h) + env(safe-area-inset-top, 0px)); }\n\n'
            '// forced-colors.less\n'
            '.dialog__header::before { forced-color-adjust: none; background: GrayText; }   // la maniglia\n\n'
            '// useViewportHeight (nuovo gancio, una volta): sposta qui il codice di AccountSettings.tsx r.142-154\n'
            '// e usalo da Modal (sotto 40em, dialog aperto), FiltersSheet e AccountSettings.\n\n'
            '// ConfirmDialog.tsx: aggiungere come in Modal  onClick={(e) =&gt; { if (e.target === e.currentTarget &amp;&amp; !isPending) finish(onCancel)(); }}</code></pre>'
            + ul(['Nessun valore nuovo oltre a <code>--sheet-gap</code> (proposto, da approvare). Nessun testo nuovo.',
                  '<b>Prova su iPhone prima di dire «fatto»</b> (nessuno di questi punti è verificato da Design): (1) aprire Accedi e scorrere con la barra di Safari che si ritira: il bordo inferiore resta attaccato? (2) tastiera aperta su Suggerisci: il campo resta visibile? (3) rimbalzo oltre il fondo: si vede il fondo pagina sotto il foglio? (4) Filtri: «Mostra N titoli» sopra l\'indicatore di Home? Se (1) persiste con <code>--viewport-height</code>, togliere <code>overflow: hidden</code> dal <code>&lt;dialog&gt;</code> (causa 2).',
                  '<b>Test:</b> nessun test di componente nel progetto. Se si estrae il gancio, un test della funzione pura (nessuna logica di calcolo nuova).',
                  '<b>DESIGN.md, Deviazioni:</b> «Fogli in basso | Modal, FiltersSheet, AccountSettings | altezza = viewport visivo − <code>--sheet-gap</code>; Account con tetto 760 px | voce 26 di HANDOFF §2».']))
    pd = tbl(['Cosa', 'Prima', 'Dopo', 'File'], [
        ['Distanza dal bordo alto', '48 / 24 / 48 px scritti a mano; 84 nell\'Account per il tetto', '<code>--sheet-gap</code> (48 px o inset + 8); Account col tetto', 'tokens.less; Modal.less r.104-108; FiltersSheet.less r.7; AccountSettings.less r.24-25'],
        ['Altezza massima', '<code>100dvh</code>; Account col viewport visivo', 'tutti col viewport visivo (<code>--viewport-height</code>)', 'Modal, FiltersSheet, AccountSettings; nuovo gancio'],
        ['Margine in basso dei Filtri', '24 px', '24 px + inset in basso', 'FiltersSheet.less r.17'],
        ['Scorrimento oltre il fondo', 'solo Filtri e Menu', 'anche <code>.dialog__scroll</code>', 'Modal.less r.26-31'],
        ['Titolo e X dei Filtri', 'Anton 36 px, X nella testata a 24 px', 'Hanken 800 24 px, X a 12 / 12', 'FiltersSheet.less/.tsx'],
        ['Clic sullo sfondo nelle conferme', 'non chiude', 'chiude (= Annulla), non se in corso', 'ConfirmDialog.tsx r.57-65'],
        ['Maniglia nel contrasto forzato', 'sparisce', 'GrayText', 'forced-colors.less'],
        ['Canvas «quando la X c\'è e quando no»', '«la maniglia resta in tutti e due i casi»', 'la maniglia c\'è se il foglio si trascina; le conferme non hanno maniglia', 'Popup generici (voce c520ab1)']])
    return (f'<div class="dc-sec"><h2 class="dc-h2">Decisione · fogli in basso e regola di chiusura dei popup (voce 26)</h2><div>{prop}</div>'
            '<p class="dc-sub">Riferimento: codice di 4bfbea4 (letto con <code>git show</code>; <b>non è su <code>main</code></b>: <code>Modal.tsx</code> con <code>useSheetDrag</code> c\'è solo in quel ramo). Le distanze sono calcolate dai <code>.less</code> citati e confrontate con le misure dell\'audit (generico 48, Filtri 24, Account 87 su 844 px); nessuna misura su telefono. '
            'Le scene sono un\'illustrazione della geometria (contenuto semplificato, finestra 390 × 844) con il CSS di tokens e componenti del canvas. <b>Non verificato:</b> Safari su iPhone (bordo che si stacca, tastiera, barra che si ritira, valori degli inset), lettore di schermo.</p>'
            + box('Scelta · raccomandazione e alternative per punto', f'<p>{why}</p><p>{why2}</p><p>{why3}</p><p>{why4}</p><p>{why5}</p><p>{why6}</p><p>{why7}</p>')
            + sec('Chi si chiude come', 'Tabella di tutti i popup, dal codice di 4bfbea4. In grassetto le due righe che cambiano.', f'<div class="dc-scroll">{T1}</div>')
            + sec('Telefono 390 × 844 · oggi', 'Le tre distanze dal bordo alto: 48, 24, 84.', f'<div class="dc-scroll">{old}</div>')
            + sec('Telefono 390 × 844 · proposta, chiaro e scuro', '48 px per il generico e per i Filtri, il tetto dell\'Account invariato. Titolo e X dei Filtri come gli altri fogli.', col(f'<div class="dc-scroll">{new}</div>', f'<div class="dc-scroll">{newd}</div>'))
            + sec('Zone di sicurezza (simulazione)', 'Isola dinamica da 59 px e indicatore di Home da 34 px, valori tipici <b>non misurati sul telefono</b>. A sinistra oggi: il foglio parte a 48 px, sotto l\'isola, e «Mostra N titoli» è a 24 px dal bordo, sopra l\'indicatore. A destra la proposta.', f'<div class="dc-scroll">{safe}</div>')
            + sec('Desktop (1280 px)', 'Nessun foglio: popup centrato da 35 rem. Invariato, salvo la regola di chiusura (X o pulsante di testo, mai tutti e due) e il titolo.', f'<div class="dc-scroll">{dk}</div>')
            + sec('Contrasto forzato', 'Emulazione di Chromium (<code>forcedColors: active</code>), foglio generico. La maniglia in alto: oggi sparisce.', f'<div class="dc-scroll">{forced}</div>')
            + sec('Margine in alto e altezza, a tre altezze di finestra', 'Calcolato dai <code>.less</code>.', f'<div class="dc-scroll">{T2}</div>')
            + sec('Dove cambia il codice', '', f'<div class="dc-scroll">{T3}</div>')
            + sec('Regola per Code', 'Il prompt completo è in <code>docs/design/PROMPT_CODE_FOGLI.md</code>.', rule)
            + sec('Prima, dopo, file', '', pd) + '</div>')


def insert(page, marker, build_fn, force=False):
    p = os.path.join(CANVAS, page + '.dc.html')
    t = open(p, encoding='utf-8', newline='').read()
    if marker in t:
        if not force:
            raise SystemExit(page + ': già inserito (usa --force)')
        i = t.index('<div class="dc-sec"><h2 class="dc-h2">' + marker)
        j = t.index('\n</div>\n</x-dc>')
        # il blocco finisce dove inizia il successivo, oppure a fine pagina
        nxt = t.find('<div class="dc-sec"><h2 class="dc-h2">', i + 10)
        if nxt != -1 and nxt < j:
            t = t[:i] + t[nxt:]
        else:
            t = t[:i].rstrip('\n') + t[j:]
    end = '\n</div>\n</x-dc>'
    assert t.count(end) == 1
    open(p, 'w', encoding='utf-8', newline='').write(t.replace(end, '\n' + build_fn() + end, 1))
    print('ok', page)


if __name__ == '__main__':
    insert('Popup generici', 'Decisione · fogli in basso e regola di chiusura dei popup', build, force='--force' in sys.argv)
