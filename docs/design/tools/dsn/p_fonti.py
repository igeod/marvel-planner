from addlib import *
import os, html as _hh

# Pagina «Fonti e suggerimenti». Rigenerabile con: python p_fonti.py (nessun blocco a mano altrove).
COMMIT_REF = '559f8bb'
CSSF = '''<style>
body{margin:0;padding:var(--sp-4);background:var(--bg);color:var(--ink);font-family:var(--font-body);font-size:var(--fs-body);line-height:1.5}
.stk{display:flex;flex-direction:column;gap:var(--sp-5)}
.cap{margin:0 0 var(--sp-1);font-size:var(--fs-caption);font-weight:800;text-transform:uppercase;letter-spacing:.06em;color:var(--ink-2)}
.pan{background:var(--panel);color:var(--on-dark);padding:var(--sp-4);border-radius:var(--r-md)}
.spoiler-box{height:auto!important;min-height:0!important}
.spoiler-box.fix{height:310px!important}
.spoiler-box .btn--text{color:inherit}
/* proposta: l'«i» nella testata del riquadro scuro */
.spoiler-box .info-tip__trigger{color:var(--muted-on-dark)}
/* proposta C: riga fissa in fondo al riquadro, sfocata con il testo */
.source-pin{position:sticky;bottom:0;margin:var(--sp-3) 0 0;padding-top:var(--sp-2);background:var(--panel-2);font-size:var(--fs-caption);color:var(--muted-on-dark)}
.source-pin a,.source-first a{color:inherit;text-decoration:underline;text-underline-offset:4px}
.source-first{margin:0 0 var(--sp-3);font-size:var(--fs-caption);color:var(--muted-on-dark)}
/* proposta B: popover aperto (statico nella scena) */
.pop{position:relative;width:max-content;max-width:100%;margin:0;padding:var(--sp-2h) var(--sp-3h);border-radius:var(--r-xs);background:var(--on-dark);color:var(--panel);font-size:var(--fs-label);font-weight:600;line-height:1.35}
.pop a{color:inherit;text-decoration:underline;text-underline-offset:4px}
</style>'''

def eye(shown=False): return f'<button type="button" class="spoiler-box__eye" aria-expanded="{"true" if shown else "false"}" aria-label="{L("details.plot.show") if not shown else L("details.plot.hide")}">{icon("eye-off" if shown else "eye")}</button>'
def itip(label): return f'<button type="button" class="info-tip__trigger" aria-label="{label}">{icon("info")}</button>'
def sbox(title, body, extra='', hidden=True, show=True, cls='', intro=''):
    h = ' data-hidden="true" aria-hidden="true"' if (show and hidden) else ''
    e = eye(not hidden) if show else ''
    cont = f'<div class="spoiler-box__content" role="region"{h}>{body}</div>' if body else ''
    return f'<article class="spoiler-box {cls}"><div class="spoiler-box__head"><h3 class="section-title">{title}</h3>{extra}{e}</div>{intro}{cont}</article>'

PARAS = ['Tony Stark, miliardario e inventore, viene rapito durante una dimostrazione di armi in Afghanistan.',
         'Nella grotta in cui è prigioniero costruisce la prima armatura e fugge, deciso a cambiare il proprio destino.',
         'Tornato a casa, annuncia che la sua azienda non costruirà più armi e lavora a una versione perfezionata dell\'armatura.',
         'Intanto un socio di lunga data prepara in segreto un\'armatura più grande, per riprendersi l\'azienda.',
         'Lo scontro finale avviene sul tetto della sede, mentre la città guarda.']
TXT = ''.join(f'<p>{p}</p>' for p in PARAS)
SRC_W = 'Fonte: <a href="#">Wikipedia</a>, <a href="#">licenza CC BY-SA 4.0</a>'

# ---------- Trama: oggi e tre proposte ----------
def plot_now(hidden): return sbox('Trama', f'<div class="plot">{TXT}<p>Testo tratto da <a href="#" rel="noreferrer">Wikipedia</a>, <a href="#">licenza CC BY-SA 4.0</a></p></div>', hidden=hidden, cls='fix')
def plot_A(hidden): return sbox('Trama', f'<div class="plot"><p class="source-first">{SRC_W}</p>{TXT}</div>', hidden=hidden, cls='fix')
def plot_B(hidden, open_=False):
    pop = f'<div class="pop" role="status">{SRC_W}</div>' if open_ else ''
    return sbox('Trama', f'<div class="plot">{pop}{TXT}</div>', extra=itip('Fonte della trama'), hidden=hidden, cls='fix')
def plot_C(hidden): return sbox('Trama', f'<div class="plot">{TXT}</div><p class="source-pin">{SRC_W}</p>', hidden=hidden, cls='fix')
def case(n, title, body): return f'<div><p class="cap">{n} · {title}</p>{body}</div>'
def stack(*c): return CSSF + f'<div class="stk">{"".join(c)}</div>'
def pair(inner, h, w, label):
    return phone(inner, 'light', h, w, label + ' · chiaro') + phone(inner, 'dark', h, w, label + ' · scuro')
H = {k: int(os.environ.get('H_' + k, d)) for k, d in dict(PLOT=1530, PLOTH=1115, OTHER=1375, OTHERN=740, SUG=880, MODAL=2340, WIDE=530).items()}

PLOTS = stack(case('Oggi', 'riga in fondo al testo scorrevole: si vede solo arrivando in fondo', plot_now(False)),
              case('A', 'riga in cima al testo, dentro lo spoiler', plot_A(False)),
              case('B', '«i» nella testata, il popover si apre al clic (componente nuovo)', plot_B(False, True)),
              case('C ★ scelta', 'riga fissa in fondo al riquadro, sfocata insieme al testo', plot_C(False)))
PLOTS_H = stack(case('A · chiuso', 'testo e riga sfocati', plot_A(True)), case('B · chiuso', 'si vede solo l\'«i»', plot_B(True)), case('C · chiuso', 'testo e riga sfocati', plot_C(True)))

# ---------- le altre sezioni ----------
def eggs(now):
    li = '<li class="spoiler-item"><span><strong>Cameo di Stan Lee:</strong> Un invitato al gala che Tony Stark scambia per Hugh Hefner.</span>%s</li>'
    if now:
        b = f'<a class="spoiler-item__source" href="#" aria-label="{L("details.easterEggs.source")}">{icon("info")}</a>'
        return sbox('Easter egg e cameo', f'<ul class="spoiler-list">{li % b}{li % b}</ul>', hidden=False)
    b = (f'<span style="display:flex;flex:none;gap:var(--sp-1)"><a class="spoiler-item__source" href="#" aria-label="Fonte: Wikipedia" style="margin:-0.5rem 0">{icon("external-link")}</a>'
         f'<button type="button" class="spoiler-item__source" aria-label="Suggerisci una modifica: cameo di Stan Lee">{icon("message-square-plus")}</button></span>')
    return sbox('Easter egg e cameo', f'<ul class="spoiler-list">{li % b}{li % b}</ul>', hidden=False)
SCN = ['Tony Stark costruisce la prima armatura in una grotta', 'Il confronto finale sul tetto']
def scenes(now):
    if now:
        b = f'<button type="button" class="spoiler-item__source" aria-label="{L("details.keyScenes.source")}">{icon("info")}</button>'
        return sbox('Scene chiave', '<ul class="spoiler-list spoiler-list--grid">' + ''.join(f'<li class="spoiler-item"><span>{s}</span>{b}</li>' for s in SCN) + '</ul>', hidden=False)
    li = ''.join(f'<li class="spoiler-item"><span>{s}</span><button type="button" class="spoiler-item__source" aria-label="Suggerisci una modifica: {s}">{icon("message-square-plus")}</button></li>' for s in SCN)
    return sbox('Scene chiave', f'<ul class="spoiler-list spoiler-list--grid">{li}</ul>', hidden=False)
def credits(now):
    li = '<li class="spoiler-item"><p>Nick Fury appare a casa di Tony Stark.</p>%s</li>'
    b = '' if now else f'<button type="button" class="spoiler-item__source" aria-label="Suggerisci una modifica: Nick Fury appare a casa di Tony Stark">{icon("message-square-plus")}</button>'
    return sbox('Scene dopo i titoli', f'<ol class="spoiler-list">{li % b}</ol>', hidden=False)
def prima(now):
    rows = ''.join(f'<li class="prereq"><span class="prereq__level muted">{lv}</span><span lang="en" class="prereq__name">{n}</span><span class="prereq__state prereq__state--todo">Da vedere</span></li>' for lv, n in [('Essenziale', 'Captain America: The First Avenger'), ('Consigliato', 'The Avengers')])
    sug = '' if now else f'<div style="display:flex;justify-content:flex-end;margin-top:var(--sp-2)">{btn("text","Suggerisci","","","message-square-plus")}</div>'
    return f'<section class="before-you-watch"><div class="before-you-watch__header"><h5 class="section-title">Prima di guardarlo</h5><button type="button" class="why-toggle">{icon("eye")}Perché?</button></div><ul class="before-you-watch__list">{rows}</ul>{sug}</section>'
OTHER_NOW = stack(case('Easter egg', 'oggi: una «i»-link per voce, tutte allo stesso indirizzo', eggs(True)), case('Scene chiave', 'oggi: una «i» per scena, un bottone che apre solo il tooltip', scenes(True)))
OTHER_NEW = stack(case('Easter egg', 'la fonte resta sulla voce, con l’icona di uscita; accanto, «Suggerisci»', eggs(False)), case('Scene chiave', 'nessuna fonte (le scene sono nel film, la scelta è nostra); «Suggerisci» per voce', scenes(False)),
                  case('Scene dopo i titoli', 'nessuna fonte per ora; «Suggerisci» per voce', credits(False)), case('Prima di guardarlo', 'nessuna voce da suggerire: un solo pulsante di testo', prima(False)))

# ---------- Suggerisci: modulo, ospite, toast ----------
CTX = '<p class="muted" style="margin:0">Scene chiave · «Tony Stark costruisce la prima armatura in una grotta»</p>'
def m_body(err=False, rate=False, val='', disabled=False):
    fe = formerror('Non siamo riusciti a inviarlo. Riprova tra poco.') if err else (formerror('Hai inviato troppi suggerimenti. Riprova tra qualche minuto.', rate=True, title='Un momento') if rate else '')
    return CTX + tf('Cosa va corretto?', val, ph='Scrivi la correzione', counter=f'{len(val)} / 500') + fe + f'<div class="dialog__actions">{btn("primary","Invia","","","send",("disabled" if disabled else ""))}</div>'
def guest():
    return modal('Suggerisci una modifica', '<p style="margin:0 0 var(--sp-3)">Per suggerire una modifica devi accedere. Dopo l’accesso si riapre il modulo.</p>' + f'<div class="dialog__actions">{btn("primary","Accedi")}</div>', 'md')
VAL = 'La scena è all’inizio, non alla fine.'
def mcase(t, d, h, m): return case(t, d, f'<div style="position:relative;min-height:{h}px;display:grid;place-items:center">{m}</div>')
MODALS = stack(
    mcase('Vuoto', 'Invia spento finché non c’è testo', 330, modal('Suggerisci una modifica', m_body(disabled=True), 'md')),
    mcase('Con testo', 'la voce corretta è già citata', 330, modal('Suggerisci una modifica', m_body(val=VAL), 'md')),
    mcase('Errore', 'dentro il modulo, il testo resta', 400, modal('Suggerisci una modifica', m_body(err=True, val=VAL), 'md')),
    mcase('Troppi invii', 'usa il messaggio già esistente', 440, modal('Suggerisci una modifica', m_body(rate=True, val=VAL), 'md')),
    mcase('Ospite', 'il pulsante resta; il clic porta all’accesso', 260, guest()),
    case('Dopo l’invio', 'il modulo si chiude; toast già nel codice (X sempre presente)', tstack(toast_el('info', 'Grazie, l’abbiamo ricevuto.', '', None))))

def admin_mock():
    def item(title, pill, who, voce, text, done):
        acts = f'<a class="btn btn--soft" href="#">{icon("external-link")}Apri il film</a>' + ('' if done else f'<button type="button" class="btn btn--primary">{icon("check")}Segna come fatto</button><button type="button" class="btn btn--text">Scarta</button>')
        return (f'<li class="admin-row candidate"><div class="candidate__head"><strong class="candidate__title">{title}</strong>{pill}</div>'
                f'<p class="admin-note candidate__meta">{who}</p><p class="admin-note" style="margin:0">Voce: «{voce}»</p><p style="margin:0">{text}</p><div class="candidate__actions">{acts}</div></li>')
    new = '<span class="admin-pill admin-pill--late">Nuovo</span>'
    ok = f'<span class="admin-pill admin-pill--ok">{icon("check")}Fatto il 18 novembre</span>'
    ul_ = '<ul class="candidates__list">' + item('Iron Man · Scene chiave', new, 'Da Giulia · 19 novembre', 'Tony Stark costruisce la prima armatura in una grotta', 'La scena è all’inizio del film, non alla fine.', False) + item('Loki · Prima di guardarlo', ok, 'Da Marco · 17 novembre', 'Thor: The Dark World', 'Manca un livello consigliato.', True) + '</ul>'
    return f'<section><h2 style="margin:0 0 var(--sp-3);font-size:var(--fs-h2);font-weight:800">Suggerimenti</h2>{ul_}</section>'


def icon_cmp():
    cand=[('info','Info','oggi'),('external-link','ExternalLink','★ raccomandata'),('book-open','BookOpen','alternativa'),('link','Link',''),('quote','Quote',''),('file-text','FileText',''),('library','Library',''),('globe','Globe','')]
    def cell_(ic,name,note):
        b=f'<span style="display:inline-flex;gap:var(--sp-1)"><span class="spoiler-item__source" style="margin:0">{icon(ic)}</span><span class="spoiler-item__source" style="margin:0">{icon("message-square-plus")}</span></span>'
        return f'<div style="display:flex;flex-direction:column;gap:var(--sp-1);align-items:flex-start"><div class="spoiler-box" style="padding:var(--sp-2) var(--sp-3);border-radius:var(--r-md)">{b}</div><span class="cap" style="margin:0">{name}</span><span style="font-size:var(--fs-caption);color:var(--ink-2)">{note}</span></div>'
    return CSSF+'<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:var(--sp-4)">'+''.join(cell_(*c) for c in cand)+'</div>'

# ---------- il prompt per Code ----------
PROMPT = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'prompt_fonti.txt'), encoding='utf-8').read().replace('@COMMIT@', COMMIT_REF)

# ---------- pagina ----------
S = [h1('Fonti e suggerimenti', 'Dove mostrare la fonte di un dato (poche volte, dove serve) e come suggerire una correzione ai contenuti nostri, dentro il sito.')]
S.append(hdr('Tre proposte per la fonte della trama e dove mettere le altre; «Suggerisci una modifica» con modulo interno, ospite, errori e vista dell’admin',
             'features/planner/components/ (PlotSection, EasterEggs, KeyScenes, WhereToWatch, ChronologicalList, BeforeYouWatch, PostCreditsInfo); src/components/ui/SpoilerBox/, Modal/, Toast/; features/admin/components/CandidatesSection/. Riferimento: main ' + COMMIT_REF,
             'SpoilerBox, Tooltip, Modal, Toast, Button, Field, FormError; classi admin esistenti; icone ExternalLink, MessageSquarePlus, Send (Lucide)',
             '22 novembre 2026'))
S.append(sec('Verdetto', '', ul([
    '<b>La licenza.</b> La trama dei film viene da Wikipedia, che la pubblica con la licenza CC BY-SA 4.0: in cambio chiede di dire da dove viene il testo e di dare il link alla licenza. Vale solo per la trama; per le altre fonti non c’è nessuna licenza da citare.',
    '<b>Fonti: poche, dove serve, e sulla voce se la fonte è della voce.</b> Via la riga «Fonte» sotto il titolo. Easter egg: la fonte è della voce (un <code>sourceUrl</code> per egg), quindi resta sulla voce, ma con un’icona di uscita al posto della «i». Scene chiave: nessuna fonte, le scene sono nel film e la scelta è nostra. Scene dopo i titoli: nessuna per ora (nei dati non c’è una fonte per voce; se serve, un’icona sulla voce come gli easter egg). Dove guardare e Cronologia non cambiano. Sinossi, cast, locandine, date e guida: nessuna.',
    '<b>L’icona della fonte.</b> La «i» vuol dire «informazione» e oggi è usata per due cose diverse (apre un tooltip, o porta fuori dal sito): non dice che è una fonte. Raccomando <code>ExternalLink</code> sulle voci che hanno un link (come «Vedi tutte le opzioni» in Dove guardare, WhereToWatch.tsx r.101-109, così la stessa forma vuol sempre dire «si esce») con tooltip «Fonte: Wikipedia». Alternativa: <code>BookOpen</code>. Confronto di otto icone sotto. La «i» resta solo dove spiega senza link (Dove guardare).',
    '<b>La trama è l’unico caso con un testo vero.</b> Tre proposte sotto. <b>Scelta del committente: C</b> (riga fissa in fondo al riquadro, sfocata insieme al testo): si vede solo quando si vede il testo, non invita a cliccare, non scorre via. A e B restano come alternative scartate (B solo se la verifica sulla licenza dicesse che basta una «i»: serve un popover cliccabile nuovo). La doppia icona di link sparisce: le due parole sono sottolineate e basta, come oggi.',
    '<b>Metterla sotto lo sfocato non va bene:</b> hai ragione, è rumore prima di aver scelto di leggere. Compare con il testo.',
    '<b>«Suggerisci»: d’accordo, interno al sito</b> (le proposte le implementano gli admin). Mail e GitHub sono scartate. Icona per voce (come nelle tue immagini) dove c’è una lista, pulsante di testo in Prima di guardarlo; solo utenti registrati, e da ospite il clic porta all’accesso. Via «Annulla» (c’è la X e Esc) e via l’e-mail (l’autore è l’account).',
    '<b>Toast:</b> quelli attuali hanno sempre la X, anche con l’azione (ToastProvider.tsx r.138-145, decisione del 14 novembre che ha sostituito «X o Annulla»). Quello del canvas è come il codice. Ma l’errore non va in un toast: sta dentro il modulo, e il testo resta.',
    '<b>Admin:</b> una sezione «Suggerimenti» con lo stesso schema dei candidati (CandidatesSection.tsx r.57-135), disegnata sotto. Da coordinare con la sessione che lavora a /admin.',
    '<b>Da far verificare:</b> la licenza (io non do pareri legali); le scene dopo i titoli (rielaborate dall’elenco di Wikipedia, README r.151); la nota TMDB nel piè di pagina (AppFooter.tsx r.48-53) per sinossi, cast, locandine e date; cosa succede ai suggerimenti quando un utente cancella l’account.'])))
S.append(sec('1 · Fonti: dove servono', 'Letto dal sorgente su main ' + COMMIT_REF + '.', tbl(['Caso', 'Serve?', 'Perché', 'Cosa si fa'], [
    ['Trama dei film (Wikipedia)', 'Sì', 'la licenza CC BY-SA chiede fonte e link', 'riga di testo: vedi le tre proposte'],
    ['Trama delle serie (TMDB)', 'Sì', 'oggi i riassunti degli episodi non hanno nessuna fonte vicina (PlotSection.tsx r.111-113)', 'stessa riga, «Fonte: TMDB»'],
    ['Dove guardare (JustWatch)', 'Sì', 'attribuzione dei dati (non verificato che sia obbligatoria)', 'resta com’è: «i» con tooltip (WhereToWatch.tsx r.69-72)'],
    ['Cronologia', 'Sì', 'motiva l’ordine, che non è ufficiale', 'resta com’è: link nella frase (ChronologicalList.tsx r.22-26)'],
    ['Easter egg', 'Per voce', 'ogni voce ha il proprio <code>sourceUrl</code> (easterEggs.ts r.8); oggi coincidono, ma la fonte è della voce', 'resta com’è: «i»-link per voce (EasterEggs.tsx r.47-60); «Suggerisci» le sta accanto'],
    ['Scene chiave', 'No', 'le scene sono nel film e la scelta è nostra: la «i» di oggi (KeyScenes.tsx r.40-51) è un bottone che apre solo un tooltip', 'via la «i»; «Suggerisci» prende il suo posto'],
    ['Scene dopo i titoli', 'In attesa', 'rielaborate da Wikipedia (README r.151, r.181): da verificare', 'nessuna per ora'],
    ['Guida, sinossi, cast, locandine, date', 'No', 'nostra (guida) o TMDB nel piè di pagina', 'nessuna modifica'],
])))
S.append(sec('Trama: oggi e tre proposte · telefono (390px), chiaro e scuro', 'Riquadro alto 310px per far vedere lo scorrimento (nel codice è 460px, TitleDetailsPanel.less r.328-330). <b>A</b> riga in cima al testo (scorre via leggendo). <b>B</b> «i» nella testata, popover aperto. <b>C</b> riga fissa in fondo, sfocata con il testo (scelta del committente). Nessuna icona di link: il sottolineato basta.',
    '<div class="dc-row">' + pair(PLOTS, H['PLOT'], 390, 'Aperto') + pair(PLOTS_H, H['PLOTH'], 390, 'Chiuso') + '</div>'))

def wide():
    p = sbox('Trama', f'<div class="plot">{TXT}</div><p class="source-pin">{SRC_W}</p>', hidden=False, cls='fix')
    return CSSF + f'<div style="display:grid;grid-template-columns:3fr 2fr;gap:var(--sp-4);align-items:start">{p}<div class="stk">{credits(False)}{eggs(False)}</div></div>'
S.append(sec('Zona spoiler · scrivania (1280px), proposta C', 'La trama con la fonte fissa in fondo; scene dopo i titoli e easter egg con «Suggerisci» per voce (negli easter egg accanto alla «i»-link).',
    '<div class="dc-row">' + pair(wide(), H['WIDE'], 1280, 'Zona spoiler') + '</div>'))
S.append(sec('Le altre sezioni · telefono (390px), chiaro e scuro', 'Oggi e proposta: negli easter egg la «i»-link resta sulla voce e «Suggerisci» le sta accanto (due icone); nelle scene chiave la «i» va nella testata e «Suggerisci» prende il suo posto.',
    '<div class="dc-row">' + pair(OTHER_NOW, H['OTHERN'], 390, 'Oggi') + pair(OTHER_NEW, H['OTHER'], 390, 'Proposta') + '</div>'))

S.append(sec('Icona della fonte · otto Lucide a 20px, accanto a «Suggerisci»', 'Disegni veri di Lucide, nella stessa area da 44px della voce, sul riquadro scuro. «i»: informazione, ambigua. <code>ExternalLink</code>: dice che si esce dal sito, come negli altri link esterni del progetto. <code>BookOpen</code>: dice «riferimento», ma non che è un link. <code>Link</code> e <code>Quote</code> si confondono con altre azioni; <code>FileText</code>, <code>Library</code>, <code>Globe</code> sono generiche o troppo grandi.', '<div class="dc-row">' + pair(icon_cmp(), 520, 390, 'Icone') + '</div>'))
S.append(sec('2 · «Suggerisci una modifica»: sistema interno', 'Per i contenuti nostri: guida «Prima di guardarlo», scene dopo i titoli, scene chiave, easter egg. Trama, sinossi, cast, locandine e date si correggono alla fonte (le date arrivano da TMDB, README r.156-160).', tbl(['Aspetto', 'Decisione', 'Perché'], [
    ['Dove', 'icona <code>MessageSquarePlus</code> per voce (Scene chiave, Easter egg, Scene dopo i titoli; negli easter egg dopo l’icona della fonte); in Prima di guardarlo un pulsante di testo in fondo alla lista', 'il contesto è la voce: l’admin sa subito cosa si vuole correggere; la guida non ha voci da suggerire una a una'],
    ['Dove no', 'Trama, sinossi, cast, locandine, date, Dove guardare, Cronologia, lista del planner', 'non sono nostri o sono troppi (la lista ha 40 righe e altre azioni)'],
    ['Chi', 'solo utenti registrati; ospite: il pulsante c’è, il clic apre l’accesso e dopo si riapre il modulo', 'niente e-mail da chiedere, niente anonimi da moderare, l’autore è noto; stessa azione in sospeso già decisa per la campanella (voce 15)'],
    ['Modulo', 'Modal con riga di contesto, campo di testo lungo con contatore (0 / 500), un solo «Invia» spento finché non c’è testo; nessun «Annulla»', 'il Modal ha già la X e Esc (Modal.tsx r.84); «Annulla» c’è solo nelle conferme e nelle impostazioni privacy'],
    ['Campo di testo lungo', '<code>textarea</code>: il componente non esiste (Field ha solo TextField); va creato con gli stessi stili', 'nel canvas è disegnato con il campo a una riga'],
    ['Bozza', 'chiudendo con testo scritto la bozza resta in memoria fino al ricaricamento; nessun dialogo di conferma', 'non si perde un testo per un clic sbagliato, senza un passaggio in più'],
    ['Dopo l’invio', 'il modulo si chiude; toast info «Grazie, l’abbiamo ricevuto.» (X sempre presente, 4s: ToastProvider.tsx r.19, r.138-145)', 'è il toast già nel codice'],
    ['Errore', 'dentro il modulo con FormError, il testo resta; troppi invii: messaggio <code>form-error--rate</code> già esistente', 'il modulo è ancora aperto: l’errore sta lì, non in un toast che sparisce'],
    ['L’autore dopo', 'nessuna notifica quando il suggerimento è fatto o scartato', 'servirebbero e-mail o una scheda nell’Account: non nel perimetro'],
    ['Privacy', 'testo libero legato all’account: l’informativa va aggiornata; cosa succede alla cancellazione dell’account (anonimizzare l’autore?) lo decide il committente', 'dati nuovi, anche se piccoli'],
    ['Alternative scartate', 'mail (nessuno stato, non funziona senza un’app di posta); pagina di GitHub (serve un account, è pubblica)', 'le proposte vanno gestite dagli admin dentro il sito'],
])))
S.append(sec('«Suggerisci» nei contenuti · telefono (390px), chiaro e scuro', 'A destra di ogni voce. In Prima di guardarlo un pulsante di testo (stile del tuo screenshot).',
    '<div class="dc-row">' + pair(stack(case('Scene chiave', 'icona per voce', scenes(False)), case('Scene dopo i titoli', 'icona per voce', credits(False)), case('Prima di guardarlo', 'pulsante di testo', prima(False))), H['SUG'], 390, 'Suggerisci') + '</div>'))
S.append(sec('Modulo, ospite e dopo l’invio · telefono (390px), chiaro e scuro', 'Il modulo ha solo la X per chiudere; nessun campo e-mail.', '<div class="dc-row">' + pair(MODALS, H['MODAL'], 390, 'Modulo') + '</div>'))
S.append(sec('Cosa vede l’admin', 'Nuova sezione «Suggerimenti» in /admin con lo schema dei candidati (<code>li.admin-row.candidate</code>, <code>admin-pill</code>, <code>candidate__actions</code>: CandidatesSection.tsx r.57-135). «Apri il film» porta alla scheda; «Segna come fatto» dopo aver modificato i dati; «Scarta» la toglie. Stato vuoto come quello dei candidati. L’avviso in cima al planner solo per l’admin (CandidatesNotice) può contare anche i suggerimenti nuovi. La pagina /admin è di un’altra sessione: da coordinare.',
    both('720px', admin_mock(), 'Sezione «Suggerimenti»')))
S.append(sec('Testi (italiano; le altre quattro lingue le traduce il committente)', '', tbl(['Chiave', 'Italiano'], [
    ['<code>details.plot.sourceLabel</code>', 'Fonte:'], ['<code>details.plot.sourceTmdb</code>', 'Fonte: TMDB'],
    ['<code>details.easterEggs.source</code>', 'Fonte: Wikipedia'],
    ['<code>suggest.label</code>', 'Suggerisci una modifica: {item}'], ['<code>suggest.title</code>', 'Suggerisci una modifica'], ['<code>suggest.button</code>', 'Suggerisci'],
    ['<code>suggest.field</code>', 'Cosa va corretto?'], ['<code>suggest.placeholder</code>', 'Scrivi la correzione'], ['<code>suggest.send</code>', 'Invia'],
    ['<code>suggest.thanks</code>', 'Grazie, l’abbiamo ricevuto.'], ['<code>suggest.error</code>', 'Non siamo riusciti a inviarlo. Riprova tra poco.'],
    ['<code>suggest.rateTitle</code>, <code>suggest.rate</code>', 'Un momento · Hai inviato troppi suggerimenti. Riprova tra qualche minuto.'],
    ['<code>suggest.guest</code>', 'Per suggerire una modifica devi accedere. Dopo l’accesso si riapre il modulo.'],
    ['<code>admin.suggestions.*</code>', 'Suggerimenti · Nuovo · Fatto il {date} · Da {name} · Voce: «{item}» · Apri il film · Segna come fatto · Scarta · Nessun suggerimento da leggere.'],
    ['togliere', '<code>details.plot.sourceBefore</code>, <code>details.keyScenes.source</code>, <code>details.keyScenes.editorial</code>'],
])))
S.append(sec('Non verificato', '', ul([
    'Misure: nessuna distanza è citata; la pagina è guardata a occhio nel browser.',
    'Contrasto a 13px (<code>--fs-caption</code>) di <code>--muted-on-dark</code> sulla riga fissa.',
    'La licenza (vedi il verdetto); che la trama sfocata con la riga fissa basti come attribuzione.',
    'Il popover della proposta B è disegnato statico dentro il testo: posizione, focus e Esc non sono progettati.',
    'Il numero di voci e la lunghezza massima (500) del suggerimento sono un’ipotesi del canvas; le decide Code.'])))
S.append(pd([
    ['Fonte della trama', 'riga in fondo al testo scorrevole (PlotSection.tsx r.22-28)', 'riga fissa in fondo al riquadro, sfocata con il testo (C); per le serie «Fonte: TMDB»', 'PlotSection.tsx'],
    ['Fonte Scene chiave', 'una «i» per scena (KeyScenes.tsx r.40-51)', 'nessuna', 'KeyScenes.tsx'],
    ['Fonte Easter egg', '«i»-link per voce (EasterEggs.tsx r.47-60)', 'icona <code>ExternalLink</code> al posto della «i» (stesso link, stessa posizione)', 'EasterEggs.tsx'],
    ['Dove guardare, Cronologia', 'come oggi', 'nessuna modifica', '—'],
    ['Suggerisci', 'non esiste', 'icona per voce, pulsante di testo in Prima di guardarlo, modulo interno, vista admin', 'nuovi componenti; AdminDashboard; API'],
], sub='Per ogni voce: com’è su main ' + COMMIT_REF + ' (prima), che cosa decide questa pagina (dopo), file.'))
S.append(sec('Prompt per la sessione Code', 'Autosufficiente: va incollato com’è.', '<pre><code>' + _hh.escape(PROMPT, quote=False) + '</code></pre>'))
write('Fonti e suggerimenti.dc.html', 'Fonti e suggerimenti', '\n'.join(S))
if os.environ.get('PROMPT_OUT'):
    open(os.environ['PROMPT_OUT'], 'w', encoding='utf-8').write(PROMPT)
