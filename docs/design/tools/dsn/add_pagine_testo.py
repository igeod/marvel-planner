"""Pagina nuova del canvas «Pagine di testo» (voce 27): Privacy e Accessibilità come pagine di lettura.
Scritto a mano: `python add_pagine_testo.py` crea canvas/Pagine di testo.dc.html e la registra in Index (una volta; --force rigenera).
Testi: locales_pagine.json (privacy, a11y, footer dei cinque file di lingua di main 4bfbea4). I testi della dichiarazione di
accessibilità sono SEGNAPOSTO (la riscrittura la fa Code con scrittura-ux). Misure: Playwright (Chromium), tabella «Misure»."""
import sys, json
import html as _h
from add_pc_lib import *
from lib2 import page, h1, hdr

D = os.path.dirname(os.path.abspath(__file__))
PG = json.load(open(os.path.join(D, 'locales_pagine.json'), encoding='utf-8'))
E = lambda s: _h.escape(s, quote=False)
MAIL = 'igeod.dev@gmail.com'   # SITE.contactEmail (site.ts)


def tx(l, path):
    v = PG[l]
    for k in path.split('.'):
        v = v[k]
    return v


def tp(l, path, prop):
    """Testo riscritto (chiave 'proposed' di locales_pagine.json) se esiste e se prop, altrimenti quello di 4bfbea4."""
    if prop and path in PG[l].get('proposed', {}):
        return PG[l]['proposed'][path]
    return tx(l, path)


def fill(l, s, **kw):
    s = E(s)
    for k, v in kw.items():
        s = s.replace('{' + k + '}', v)
    return s


EM = f'<a href="mailto:{MAIL}">{MAIL}</a>'
LB = lambda t: f'<button type="button" class="link-button">{t}</button>'

# ------------------------------------------------------------------ Privacy: contenuto (PrivacyPage.tsx r.45-120)
SECTIONS = ['controller', 'data', 'purposes', 'cookies', 'providers', 'retention', 'rights', 'other', 'minors', 'changes']


def privacy_sections(l, ids=False, prop=False):
    P = lambda k: tp(l, 'privacy.' + k, prop)
    out = []
    for s in SECTIONS:
        h = E(P(s + '.heading'))
        idattr = f' id="p-{s}"' if ids else ''
        if s == 'controller':
            b = f'<p>{fill(l, P("controller.body"), name="Marvel Planner", email=EM)}</p>'
        elif s == 'data':
            items = ''.join(f'<li><strong>{E(P("data." + k + "Label"))}</strong>: {fill(l, P("data." + k + "Text"), link=LB(E(tx(l, "footer.privacySettings"))))}</li>' for k in ['account', 'progress', 'technical', 'device', 'share', 'suggestions'])
            b = f'<ul>{items}</ul>'
        elif s == 'purposes':
            b = '<ul>' + ''.join(f'<li>{E(P("purposes." + k))}</li>' for k in ['service', 'security', 'suggestions']) + f'</ul><p>{E(P("purposes.noProfiling"))}</p>'
        elif s == 'cookies':
            b = f'<p>{fill(l, P("cookies.body"), link=LB(E(tx(l, "footer.privacySettings") if prop else P("cookies.link"))))}</p>'
        elif s == 'rights':
            b = f'<p>{fill(l, P("rights.body"), email=EM, account=LB(E(P("rights.accountLink"))), garante="<a href=https://www.garanteprivacy.it>garanteprivacy.it</a>")}</p>'
        elif s in ('other',):
            b = f'<p>{fill(l, P(s + ".body"), email=EM)}</p>'
        elif s == 'changes':
            b = f'<p>{fill(l, P(s + ".body"), email=EM)}</p>'
        else:
            b = f'<p>{fill(l, P(s + ".body"), email=EM)}</p>'
        out.append((s, h, f'<section{idattr} aria-labelledby="h-{s}"><h2 id="h-{s}">{h}</h2>{b}</section>'))
    return out


def date_it(l):
    return {'it': '19 novembre 2026', 'en': '19 November 2026', 'fr': '19 novembre 2026', 'es': '19 de noviembre de 2026', 'de': '19. November 2026'}[l]


def card_page(l):
    """Oggi: article.privacy-page su scheda (PrivacyPage.less)."""
    secs = ''.join(s[2] for s in privacy_sections(l))
    return (f'<article class="privacy-page"><h1>{E(tx(l, "privacy.title"))}</h1><p>{fill(l, tx(l, "privacy.updated"), date=date_it(l))}</p>{secs}</article>')


# ------------------------------------------------------------------ Proposta: pagina di lettura
# ------------------------------------------------------------------ Proposta: pagina bianca, gestita meglio
KICKER = lambda l: E(tx(l, 'footer.legal'))      # «Informazioni legali»: lo stesso gruppo del piè di pagina


def cards(secs):
    out = ''
    for i, (k, h, b) in enumerate(secs):
        out += f'<section class="card text-section" aria-labelledby="h-{k}"><h2 id="h-{k}"><span class="text-section__n" aria-hidden="true">{i + 1}</span>{h}</h2>{b}</section>'
    return out


def head(l, title, meta, intro=''):
    """Come l'intestazione di una saga (.saga__header): titolo Anton sul fondo pagina, con una riga sopra e una sotto."""
    return (f'<header class="text-head"><p class="text-head__kicker muted">{KICKER(l)}</p><h1 id="tp-title">{title}</h1>'
            f'<p class="text-head__meta muted">{meta}</p>{intro}</header>')


def re_body(b):
    i = b.index('</h2>') + 5
    return b[i:b.rindex('</section>')]


def read_privacy(l):
    secs = privacy_sections(l, ids=False, prop=True)
    body = cards([(k, h, re_body(b)) for k, h, b in secs])
    return (f'<article class="text-page" aria-labelledby="tp-title">{head(l, E(tx(l, "privacy.title")), fill(l, tx(l, "privacy.updated"), date=date_it(l)))}'
            f'<div class="text-page__body">{body}</div></article>')


def a11y_sections(l='it'):
    X = lambda k: E(tp(l, 'a11y.' + k, True))
    O = lambda k: E(tx(l, 'a11y.' + k))
    li = lambda a, b: f'<li><strong>{a}</strong>: {b}</li>'
    facts = ('<dl class="text-page__facts">'
             f'<div><dt>{X("conformance.standardLabel")}</dt><dd>{X("conformance.standard")}</dd></div>'
             f'<div><dt>{X("conformance.statusLabel")}</dt><dd>{X("conformance.status")}</dd></div>'
             f'<div><dt>{X("conformance.checkedLabel")}</dt><dd>{X("conformance.checked")}</dd></div>'
             f'<div><dt>{X("conformance.howLabel")}</dt><dd>{X("conformance.how")}</dd></div></dl>')
    use = '<ul>' + ''.join(li(O(k + '.heading'), O(k + '.body')) for k in ['vision', 'hearing', 'motion', 'keyboard']) + '</ul>'
    lim = '<ul>' + ''.join(f'<li>{X("limits." + k)}</li>' for k in ['contrast', 'title', 'screenReader']) + '</ul>'
    return [('conf', X('conformance.heading'), facts), ('use', X('use.heading'), use), ('lim', X('limits.heading'), lim)], X


def read_a11y(l='it'):
    secs, X = a11y_sections(l)
    rep_h, rep_b = X('report.heading'), E(tp(l, 'a11y.report.body', True))
    n = len(secs) + 1
    body = cards(secs) + (f'<section class="text-ticket" aria-labelledby="h-rep"><h2 id="h-rep"><span class="text-section__n text-section__n--ink" aria-hidden="true">{n}</span>{rep_h}</h2>'
                          f'<p>{rep_b}</p><a class="btn btn--ink btn--lg" href="mailto:{MAIL}">{icon("mail")}{MAIL}</a></section>')
    meta = fill(l, tx(l, "privacy.updated"), date=date_a(l))
    return (f'<article class="text-page" aria-labelledby="tp-title">{head(l, E(tp(l, "a11y.title", True)), meta, "<p class=text-head__intro>" + E(tp(l, "a11y.intro", True)) + "</p>")}'
            f'<div class="text-page__body">{body}</div></article>')


def date_a(l):
    return PG[l]['proposed']['a11y.conformance.checked']


# ------------------------------------------------------------------ CSS della proposta (solo token esistenti)
NEWCSS = (
    # colonna centrata da 36 rem; la prima cosa parte a 8 px dall'intestazione come nel Planner (.site-main)
    '.text-page{display:flex;flex-direction:column;gap:var(--sp-4);max-width:36rem;margin:0 auto}'
    # intestazione: come .saga__header (titolo Anton sul fondo), con una riga sopra e una sotto
    '.text-head{display:flex;flex-direction:column;padding:var(--sp-2) 0 var(--sp-1)}'
    '.text-head__kicker{margin:0;font-size:var(--fs-label);font-weight:700}'
    '.text-head h1{margin:var(--sp-1) 0 0;font-family:var(--font-display);font-weight:400;text-transform:uppercase;letter-spacing:.02em;font-size:var(--fs-h1-sm);line-height:1.05;overflow-wrap:break-word;hyphens:auto}'
    '@media (min-width:64em){.text-head h1{font-size:var(--fs-xl)}}'
    '.text-head__meta{margin:var(--sp-2) 0 0;font-size:var(--fs-label)}.text-head__intro{margin:var(--sp-3) 0 0}'
    '.muted{color:var(--ink-2)}'
    '.text-page__body{display:flex;flex-direction:column;gap:var(--sp-3);min-width:0}'
    '@media (min-width:64em){.text-section{padding:2rem}}'
    '.text-section h2,.text-ticket h2{display:flex;align-items:center;gap:var(--sp-3);margin:0 0 var(--sp-3);font-size:var(--fs-h3);font-weight:800;line-height:1.2;scroll-margin-top:var(--sp-4)}'
    '.text-section__n{flex:none;display:grid;place-items:center;width:2.5rem;height:2.5rem;border-radius:var(--r-pill);background:var(--panel);color:var(--highlight);font-family:var(--font-display);font-size:var(--fs-title);font-weight:400;letter-spacing:.01em}'
    '.text-section ul{display:flex;flex-direction:column;gap:var(--sp-1h);padding-left:1.25rem;list-style:disc}'
    '.text-section p+p,.text-section ul+p,.text-section p+ul{margin-top:var(--sp-3)}'
    '.text-page__facts{display:flex;flex-direction:column;gap:var(--sp-3);margin:0;padding:var(--sp-4);border:1px solid transparent;border-radius:var(--r-sm);background:var(--row)}'
    '.text-page__facts dt{font-size:var(--fs-label);color:var(--ink-2)}.text-page__facts dd{margin:0}'
    '@media (min-width:40em){.text-page__facts>div{display:grid;grid-template-columns:7rem 1fr;gap:var(--sp-3)}}'
    # biglietto giallo, dritto
    '.text-ticket{display:flex;flex-direction:column;align-items:flex-start;gap:var(--sp-3);padding:var(--sp-6);border-radius:var(--r-md);background:var(--highlight);color:var(--ink-static)}'
    '@media (min-width:64em){.text-ticket{padding:2rem}}'
    '.text-ticket h2{margin:0;font-family:var(--font-display);font-weight:400;text-transform:uppercase;letter-spacing:.02em;font-size:var(--fs-h2);line-height:.95}'
    '.text-ticket p{margin:0}.text-ticket .btn{max-width:100%}.text-section__n--ink{background:var(--ink-static);color:var(--highlight)}'
    '@media (forced-colors:active){.card,.text-ticket{border:1px solid CanvasText}.text-section__n{forced-color-adjust:none;background:Canvas;color:CanvasText;border:1px solid CanvasText}}')
CSSX = ('body{padding:0!important;background:var(--bg)}.hdr{height:var(--header-h);display:flex;align-items:center;padding:0 var(--sp-4)}'
        '.shell{min-height:100vh;display:flex;flex-direction:column}.shell .site-main{flex:1}'
        '.link-button{background:none;border:0;padding:0;color:inherit;text-decoration:underline;font:inherit;cursor:pointer}')


def shell(inner, kind='main'):
    foot = ('<footer class="site-footer"><div class="site-footer__legal"><a href="#">Privacy</a><a href="#">Accessibilità</a><a href="#">Cookie</a>'
            '<button type="button" class="link-button">Preferenze privacy</button></div></footer>')
    return (f'<div class="shell"><div class="hdr"><span class="wordmark">Marvel Planner</span></div><main class="site-main">{inner}</main>{foot}</div>')


def frm(label, theme, w, h, inner, l='it', scroll=None, extra=''):
    js = ''
    if scroll == 'bottom':
        js = 'document.fonts.ready.then(function(){window.scrollTo(0,document.documentElement.scrollHeight)})'
    elif scroll:
        js = f'document.fonts.ready.then(function(){{window.scrollTo(0,{scroll})}})'
    css = ('html{overflow:auto!important}' if scroll else '') + CSSX + NEWCSS + extra
    return fr(label, theme, w, h, shell(inner), css, js, lang=l)


def btn_(v, t, size=''):
    from parts import btn
    return btn(v, t, size)


def status404():
    return ('<div class="status-page"><img class="status-art" src="assets/images/err-404.webp" alt="" aria-hidden="true">'
            '<div class="status-page__body"><h1>Pagina non trovata</h1><p>Questa pagina non esiste o è stata spostata.</p>'
            '<div class="status-page__actions">' + btn_('primary', 'Torna al planner', 'lg') + '</div></div></div>')


def build():
    prop = tag('proposta · non implementata', 'k2')
    sc = lambda x: f'<div class="dc-scroll">{x}</div>'
    old_d = frm('Oggi · Privacy · 1280 px · chiaro (scheda grigia da 800 px)', 'light', 1280, 760, card_page('it'))
    old_m = frm('Oggi · Privacy · 390 px · chiaro', 'light', 390, 760, card_page('it'))
    new_d = frm('Proposta · Privacy · 1280 px · chiaro', 'light', 1280, 860, read_privacy('it'))
    new_dd = frm('Proposta · Privacy · 1280 px · scuro', 'dark', 1280, 860, read_privacy('it'))
    new_m = frm('Proposta · Privacy · 390 px · chiaro', 'light', 390, 760, read_privacy('it'))
    new_md = frm('Proposta · Privacy · 390 px · scuro', 'dark', 390, 760, read_privacy('it'))
    new_end = frm('Proposta · Privacy · 390 px · fine pagina e piè di pagina', 'light', 390, 760, read_privacy('it'), scroll='bottom')
    a_d = frm('Proposta · Accessibilità · 1280 px · chiaro', 'light', 1280, 860, read_a11y())
    a_dd = frm('Proposta · Accessibilità · 1280 px · scuro', 'dark', 1280, 860, read_a11y())
    a_end = frm('Proposta · Accessibilità · 1280 px · il biglietto della segnalazione', 'light', 1280, 760, read_a11y(), scroll='bottom')
    a_m = frm('Proposta · Accessibilità · 390 px · chiaro', 'light', 390, 760, read_a11y())
    a_m2 = frm('Proposta · Accessibilità · 390 px · segnalazione', 'light', 390, 760, read_a11y(), scroll='bottom')
    a_md = frm('Proposta · Accessibilità · 390 px · scuro', 'dark', 390, 760, read_a11y())
    de_m = frm('Proposta · Privacy · 390 px · de', 'light', 390, 760, read_privacy('de'), l='de')
    de_a = frm('Proposta · Accessibilità · 390 px · de', 'light', 390, 760, read_a11y('de'), l='de')
    fr_d = frm('Proposta · Privacy · 1280 px · fr', 'light', 1280, 760, read_privacy('fr'), l='fr')
    narrow = frm('Proposta · Accessibilità · 320 px · zoom 400 %', 'light', 320, 760, read_a11y(), scroll=1500)
    p404d = frm('404 · 1280 × 720 · centrata (invariata)', 'light', 1280, 720, status404(), extra='.shell{min-height:720px}.site-main{display:grid;place-items:center;padding-block:var(--sp-8)}')
    img = lambda f, cap, alt: (f'<div class="dc-fw"><div class="dc-fl">{cap}</div><img src="assets/{f}" alt="{alt}" width="390" style="display:block;max-width:100%;border-radius:var(--r-md)"></div>')
    forced = ('<div class="dc-row">' + img('testo-forced-indice.png', 'Contrasto forzato · Privacy · intestazione e schede', 'Pagina Privacy con contrasto forzato: le schede e il cerchio del numero hanno un contorno') +
              img('testo-forced-fatti.png', 'Contrasto forzato · Accessibilità · scheda dei fatti e biglietto', 'Dichiarazione di accessibilità con contrasto forzato: schede e biglietto con contorno') + '</div>')
    T1 = tbl(['Misura', 'Oggi', 'Proposta'], [
        ['Distanza dall\'intestazione (390 e 1280 px)', 'scheda: 8 + 16 + 24 = 48 px a 390, 8 + 16 + 40 = 64 a 1280', '<b>8 px</b> più il respiro dell\'intestazione di saga: il titolo parte dove parte il Planner (<code>.site-main</code>, <code>AppLayout.less</code> r.9-17)'],
        ['Larghezza del testo, 1280 px', 'scheda 800, testo 704 px: circa <b>103 caratteri</b> per riga', 'colonna 36 rem = 576 px, scheda con padding 2 rem: testo 512 px, circa <b>75 caratteri</b>'],
        ['Telefono, 390 px', 'testo 342 px: 50 caratteri', 'schede da 374 px, testo 326 px: circa <b>47 caratteri</b>'],
        ['Altezza della pagina intera, Privacy (con intestazione e piè di pagina)', '390 px: 3750 px · 1280 px: 2436 px', '390 px: <b>4100 px</b> (+9 %) · 1280 px: <b>3274 px</b> (+34 %: la colonna è più stretta, 512 px contro 704)'],
        ['Scorrimento orizzontale (390, 1280 e 320 px; it, de, fr)', '—', '<b>nessuno</b> (misurato su tutte le cornici)'],
        ['404', 'centrata', 'invariata'],
        ['Contrasti', '—', '<code>--ink-2</code> su <code>--bg</code> (kicker e riga di aggiornamento) 6,40 chiaro / 7,4 scuro; testo nelle schede <code>--ink</code> su <code>--surface</code> 16,86 / 14,79; giallo su <code>--panel</code> nel cerchio 9,39 / 5,17; testo sul biglietto 9,39 (misurati nella versione precedente: stessi token)']])
    why = ('<b>1 · Si torna alla pagina bianca, gestita meglio.</b> Parere del committente: l\'eroe scuro, l\'indice, il numero giallo gigante e il biglietto inclinato facevano «un\'altra app» e «AI-centrico»; la pagina bianca piaceva. Alla prima versione mancavano identità e ritmo, non la pagina bianca. '
           'Ora: <b>l\'intestazione è quella di una saga</b> (<code>.saga__header</code>: titolo Anton sul fondo pagina, <code>--fs-h1-sm</code>, da 64 em <code>--fs-xl</code>) con <b>una riga sopra</b> («Informazioni legali», <code>footer.legal</code>, già nel piè di pagina) e <b>una sotto</b> («Ultimo aggiornamento» e, nell\'Accessibilità, l\'introduzione), entrambe <code>.muted</code>. Niente pannello scuro, niente numero giallo gigante. '
           '<b>I box numerati restano</b>: ogni sezione è una scheda (<code>.card</code>, come le fasi del Planner) con il numero in un cerchio. Se per «box» si intendevano solo i cerchi, la variante è una riga di CSS in meno: <code>.text-section</code> senza <code>.card</code>.')
    why2 = ('<b>2 · L\'indice sparisce.</b> Era una mia aggiunta. Ho messo la colonna a destra perché nel Planner i pannelli stanno a destra, ma i sommari di una pagina di testo si aspettano a sinistra, e sul telefono era un secondo blocco prima del testo. <b>Funziona anche senza</b>: le sezioni sono dieci schede numerate con titoli corti, la pagina è lunga circa 4100 px a 390 px, cinque schermate (oggi 3750: le dieci schede costano il 9 %), e le ancore restano (<code>/privacy#h-rights</code> arriva alla sezione: basta un <code>id</code> sui titoli, nessuna interfaccia in più). Per orientarsi basta «Torna su» (<code>BackToTop</code>, già nel Planner e nel Film). Se dopo la rilettura dei testi la Privacy restasse lunga, l\'indice può tornare, <b>a sinistra</b> e sotto il titolo sul telefono: non serve ora. Meno codice: niente <code>&lt;details&gt;</code>, niente <code>DESKTOP_QUERY</code> da esportare, niente colonna fissa.')
    why3 = ('<b>3 · Colonna e posizione.</b> Una colonna centrata da 36 rem, la stessa per intestazione e schede; il titolo parte a 8 px sotto l\'intestazione come il Planner (P6: le pagine con schede partono lì, le pagine di stato come la 404 restano centrate). Il testo sta in schede con <code>--ink</code> su <code>--surface</code>: circa 75 caratteri per riga a 1280 px (oggi 103).')
    why4 = ('<b>4 · Dichiarazione di accessibilità (P8).</b> Intestazione come sopra, con l\'introduzione; tre schede (<b>Stato di conformità</b> con la scheda dei fatti, <b>Cosa puoi usare</b>, <b>Limiti noti</b>) e il <b>biglietto giallo</b> <b>dritto</b> per la segnalazione (il pulsante scuro è un <code>mailto:</code> con l\'indirizzo). Tolta la frase «Rispondiamo entro 10 giorni lavorativi»: non promette tempi che nessuno ha deciso. L\'«AA» gigante è tolto: lo standard sta nella scheda dei fatti. <b>Testi riscritti con <code>scrittura-ux</code></b> (<code>TESTI_PAGINE.md</code>): da far rileggere dal committente e da un esperto (il livello «Conformità parziale» e i limiti noti sono di chi firma).')
    why5 = ('<b>5 · Cosa non cambia dal disegno precedente.</b> I testi (tranne la frase tolta), i riferimenti di legge, la scheda dei fatti, il cerchio del numero, i token (nessun valore nuovo). Contrasto forzato: <code>.card</code> ha già il contorno; il cerchio del numero e il biglietto vanno aggiunti (vedi «Regola per Code»).')
    rule = ('<pre><code>// una classe per le due pagine (.text-page); PrivacyPage.less e AccessibilityPage.less perdono .block(), --surface, max-width 800, margin e padding della scheda\n'
            '.text-page { display: flex; flex-direction: column; gap: var(--sp-4); max-width: 36rem; margin: 0 auto; }\n\n'
            '// intestazione: come .saga__header (SagaSection.less r.21-37), con una riga sopra e una sotto\n'
            '.text-head { display: flex; flex-direction: column; padding: var(--sp-2) 0 var(--sp-1); }\n'
            '.text-head__kicker { margin: 0; font-size: var(--fs-label); font-weight: 700; }        // classe .muted; testo: footer.legal («Informazioni legali»)\n'
            '.text-head h1 { margin: var(--sp-1) 0 0; .display-font(); font-size: var(--fs-h1-sm); line-height: 1.05; overflow-wrap: break-word; hyphens: auto; .desktop({ font-size: var(--fs-xl); }); }\n'
            '.text-head__meta { margin: var(--sp-2) 0 0; font-size: var(--fs-label); }              // classe .muted; privacy.updated\n'
            '.text-head__intro { margin: var(--sp-3) 0 0; }                                          // solo Accessibilità: a11y.intro\n\n'
            '// una scheda per sezione: &lt;section class="card text-section" aria-labelledby="h-…"&gt;&lt;h2 id="h-…"&gt;&lt;span class="text-section__n" aria-hidden&gt;N&lt;/span&gt;Titolo&lt;/h2&gt;…\n'
            '.text-page__body { display: flex; flex-direction: column; gap: var(--sp-3); min-width: 0; }\n'
            '.text-section { .desktop({ padding: 2rem; }); }                                        // .card ha già padding 1.5rem, --r-xl, --surface\n'
            '.text-section h2 { display: flex; align-items: center; gap: var(--sp-3); margin: 0 0 var(--sp-3); font-size: var(--fs-h3); font-weight: 800; line-height: 1.2; scroll-margin-top: var(--sp-4); }\n'
            '.text-section__n { flex: none; display: grid; place-items: center; width: 2.5rem; height: 2.5rem; border-radius: var(--r-pill); background: var(--panel); color: var(--highlight); .display-font(); font-size: var(--fs-title); text-transform: none; }\n'
            '.text-section ul { display: flex; flex-direction: column; gap: var(--sp-1h); padding-left: 1.25rem; list-style: disc; }\n'
            '.text-section p + p, .text-section ul + p, .text-section p + ul { margin-top: var(--sp-3); }\n\n'
            '// solo Accessibilità: scheda dei fatti e biglietto (dritto)\n'
            '.text-page__facts { display: flex; flex-direction: column; gap: var(--sp-3); margin: 0; padding: var(--sp-4); border: 1px solid transparent; border-radius: var(--r-sm); background: var(--row); }\n'
            '.text-page__facts dt { font-size: var(--fs-label); color: var(--ink-2); } .text-page__facts dd { margin: 0; }\n'
            '@media (min-width: 40em) { .text-page__facts &gt; div { display: grid; grid-template-columns: 7rem 1fr; gap: var(--sp-3); } }\n'
            '.text-ticket { display: flex; flex-direction: column; align-items: flex-start; gap: var(--sp-3); padding: var(--sp-6); border-radius: var(--r-md); background: var(--highlight); color: var(--ink-static); .desktop({ padding: 2rem; }); }\n'
            '.text-ticket h2 { display: flex; align-items: center; gap: var(--sp-3); margin: 0; .display-font(); font-size: var(--fs-h2); line-height: .95; }\n'
            '.text-ticket p { margin: 0; } .text-ticket .btn { max-width: 100%; }\n'
            '.text-section__n--ink { background: var(--ink-static); color: var(--highlight); }\n\n'
            '// forced-colors.less: .text-ticket nell\'elenco dei bordi (.card c\'è già) e, nel blocco @media (forced-colors: active):\n'
            '.text-section__n { forced-color-adjust: none; background: Canvas; color: CanvasText; border: 1px solid CanvasText; }</code></pre>'
            + ul(['Nessun valore nuovo. Il biglietto non ha più <code>transform</code>. Niente indice, niente <code>&lt;details&gt;</code>, niente <code>useMediaQuery</code>.',
                  'Ogni <code>&lt;h2&gt;</code> prende un <code>id</code> (<code>h-…</code>): oggi alcune <code>section</code> usano <code>aria-label</code> senza <code>id</code> (<code>PrivacyPage.tsx</code> r.78-84, r.111-117). Il kicker è <code>footer.legal</code>, il numero dei cerchi è l\'indice dell\'array (<code>aria-hidden</code>). «Torna su»: montare <code>BackToTop</code> nelle due pagine.',
                  '<b>Testi:</b> tutti in <code>docs/design/TESTI_PAGINE.md</code> (cinque lingue, verdetto per chiave): copiali, non riscriverli. <b>Test:</b> nessun test di componente nel progetto. Verifica a mano a 390, 1280 e 320 px (nessuno scorrimento orizzontale), chiaro e scuro, cinque lingue («Datenschutzerklärung» a 390 px va a capo col trattino), contrasto forzato, ancora diretta <code>/privacy#h-rights</code>.',
                  '<b>DESIGN.md, Deviazioni:</b> «Pagine di testo | PrivacyPage, AccessibilityPage | intestazione come una saga, una scheda numerata per sezione, biglietto giallo per la segnalazione | voce 27 di HANDOFF §2». Il blocco «funzione 23» di <code>Accessibility.dc.html</code> si annota «sostituita».']))
    import testi_pagine as TP
    rows = []
    for k, v in TP.T.items():
        before = ''
        if k.startswith('privacy.') or k in ('a11y.title', 'a11y.intro'):
            try:
                before = E(tx('it', k))
            except KeyError:
                before = '—'
        rows.append([f'<code>{k}</code>', TP.VERDICT.get(k, 'nuova'), before or '—', E(v['it'])])
    texts = tbl(['Chiave', 'Verdetto', 'Prima (it)', 'Dopo (it)'], rows)
    pd = tbl(['Cosa', 'Prima', 'Dopo', 'File'], [
        ['Contenitore delle due pagine', 'una scheda grigia lunga come la pagina (<code>.block()</code>, <code>--surface</code>, 800 px)', 'pagina bianca: intestazione come una saga + una scheda numerata per sezione', 'PrivacyPage.less r.3-13; AccessibilityPage.less r.4-14'],
        ['Titolo', 'titolo piccolo dentro la scheda, riga di aggiornamento come paragrafo', 'Anton sul fondo (<code>.saga__header</code>), riga sopra e riga sotto in <code>.muted</code>', 'PrivacyPage.tsx r.45-47'],
        ['Posizione verticale', '48 / 64 px dall\'intestazione (somma implicita)', '8 px, come il Planner', 'PrivacyPage.less, AccessibilityPage.less'],
        ['Accessibilità', 'titolo, introduzione, cinque paragrafi; «stiamo ancora controllando…»', 'dichiarazione: conformità, cosa puoi usare, limiti noti; biglietto giallo dritto col contatto', 'AccessibilityPage.tsx r.5-30; it.ts <code>a11y.*</code>']])
    return ''.join([
        h1('Pagine di testo', 'Privacy e Accessibilità: pagina bianca con intestazione da saga, schede numerate e dichiarazione di accessibilità.'),
        hdr('Pagine /privacy e /accessibilita: da scheda grigia a pagina bianca con intestazione come una saga, una scheda numerata per sezione e, nell\'Accessibilità, il biglietto giallo per la segnalazione. La Privacy non aveva alcun disegno nel canvas. Testi riscritti con scrittura-ux.',
            'src/pages/PrivacyPage/, src/pages/AccessibilityPage/ (riferimento 4bfbea4)',
            'Planner (intestazione di saga, schede delle fasi, biglietto «Condividi»), Navigation (intestazione, piè di pagina), Typography, Buttons (ink), Popup generici (schede della voce 25), Pagine di errore (404)'),
        sec('Decisione · Privacy e Accessibilità: pagina bianca, intestazione da saga, schede numerate (voce 27, terza versione)',
            'Riferimento: codice di 4bfbea4 (<code>PrivacyPage</code>, <code>AccessibilityPage</code>, <code>AppLayout.less</code>); le due pagine non sono cambiate rispetto a <code>main</code>. Cornici con il CSS di tokens e componenti del canvas e le classi vere dell\'app (<code>.card</code>, <code>.btn--ink</code>, <code>.site-main</code>, <code>.status-page</code>, <code>.site-footer</code>), i testi dei cinque file di lingua e un\'intestazione segnaposto della stessa altezza. <b>Non verificato:</b> Safari e Firefox, lettore di schermo, contrasto forzato reale di Windows. Le cornici da 1280 px il canvas le mostra a 1144.' + f'<div>{prop}</div>',
            box('Scelta · raccomandazione e alternative per punto', f'<p>{why}</p><p>{why2}</p><p>{why3}</p><p>{why4}</p><p>{why5}</p>')),
        sec('Oggi · la Privacy su scheda', 'A sinistra desktop, a destra telefono.', sc(row(old_d, old_m))),
        sec('Proposta · Privacy', 'Desktop e telefono, chiaro e scuro; fine pagina e piè di pagina.', col(sc(row(new_d)), sc(row(new_dd)), sc(row(new_m, new_md, new_end)))),
        sec('Proposta · Accessibilità (dichiarazione)', 'Intestazione con introduzione, scheda dei fatti, biglietto dritto per la segnalazione.', col(sc(row(a_d)), sc(row(a_dd)), sc(row(a_end)), sc(row(a_m, a_m2, a_md)))),
        sec('Francese, tedesco, 320 px', 'Titoli più lunghi (de: «Datenschutzerklärung», «Erklärung zur Barrierefreiheit»), e 320 px.', sc(row(de_m, de_a, narrow)) + sc(row(fr_d))),
        sec('404: la regola della posizione', 'Le pagine con schede partono a 8 px dall\'intestazione; le pagine di stato restano centrate.', sc(row(p404d))),
        sec('Contrasto forzato', 'Emulazione di Chromium (<code>forcedColors: active</code>), 390 px.', sc(forced)),
        sec('Misure', 'Prese con Playwright (Chromium) sulle classi dell\'app. I caratteri per riga sono stimati sulla larghezza media di una frase campione (16 px, Hanken Grotesk caricato dal browser di prova: <b>non verificato</b> con i font ospitati). Le cornici da 1280 px il canvas le mostra a 1144: le distanze verticali non cambiano.', f'<div class="dc-scroll">{T1}</div>'),
        sec('Testi', 'Rivisti con la skill <code>scrittura-ux</code> (regole del progetto; verdetti accorciare / unire / riscrivere; le chiavi non elencate: tenere). Privacy: undici chiavi riviste, riferimenti di legge, durate e soggetti invariati. Accessibilità: dichiarazione nuova. <b>Regola 8: testi di privacy e accessibilità, vanno riletti dal committente e da un esperto; fr, es, de da un madrelingua.</b> Le cinque lingue complete di ogni chiave sono in <code>docs/design/TESTI_PAGINE.md</code>.', f'<div class="dc-scroll">{texts}</div>'),
        sec('Regola per Code', 'Il prompt completo è in <code>docs/design/PROMPT_CODE_PAGINE_TESTO.md</code>.', rule),
        sec('Prima, dopo, file', '', pd)])



def register_index(force=False):
    p = os.path.join(CANVAS, 'Index.dc.html')
    t = open(p, encoding='utf-8', newline='').read()
    if 'Pagine di testo' in t:
        print('Index: già registrata')
        return
    row_ = ('<tr><td><b>Pagine di testo</b></td><td>Privacy e Accessibilità: pagine di lettura, indice delle sezioni, dichiarazione di accessibilità, posizione verticale (proposta, voce 27)</td>'
            '<td>Typography, Spacing e layout, Navigation, Popup generici (schede), Pagine di errore (404)</td><td>src/pages/PrivacyPage/, src/pages/AccessibilityPage/</td></tr>')
    marker = '<tr><td><b>Pagine di errore</b></td>'
    assert t.count(marker) == 1
    t = t.replace(marker, row_ + marker, 1)
    open(p, 'w', encoding='utf-8', newline='').write(t)
    print('Index: registrata')


if __name__ == '__main__':
    out = os.path.join(CANVAS, 'Pagine di testo.dc.html')
    if os.path.exists(out) and '--force' not in sys.argv:
        raise SystemExit('già creata (usa --force)')
    open(out, 'w', encoding='utf-8', newline='').write(page('Pagine di testo', build()))
    print('ok', out)
    register_index()
