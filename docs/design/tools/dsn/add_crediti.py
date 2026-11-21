"""Pagina nuova del canvas «Crediti» (voce 31): da dove arriva ogni dato, immagine, carattere e software.
`python add_crediti.py` crea canvas/Crediti.dc.html e la registra in Index (una volta; --force rigenera la pagina).
Testi nuovi in CR (cinque lingue, scrittura-ux) e in docs/design/TESTI_CREDITI.md. Fatti da README «Fonti dei dati» e package.json."""
import sys
from add_pagine_testo import *   # CSS della famiglia «pagine di testo», cornici, testata, schede
from add_pc_lib import *
import add_pagine_testo as APT

L5 = ['it', 'en', 'fr', 'es', 'de']
CR = {}


def add(key, it, en, fr_, es, de):
    CR[key] = dict(zip(L5, (it, en, fr_, es, de)))


add('credits.title', 'Crediti', 'Credits', 'Crédits', 'Créditos', 'Quellen und Lizenzen')
add('credits.intro',
    "Marvel Planner usa dati, immagini, caratteri e software fatti da altri. Qui trovi da dove arriva ogni cosa e con quale licenza.",
    "Marvel Planner uses data, images, fonts and software made by others. Here is where each one comes from and under which license.",
    "Marvel Planner utilise des données, des images, des polices et des logiciels créés par d'autres. Voici d'où vient chaque élément et sous quelle licence.",
    "Marvel Planner usa datos, imágenes, tipografías y software de otras personas. Aquí ves de dónde viene cada cosa y con qué licencia.",
    "Marvel Planner nutzt Daten, Bilder, Schriften und Software von anderen. Hier steht, woher alles stammt und unter welcher Lizenz.")
add('credits.data.heading', 'Dati e immagini', 'Data and images', 'Données et images', 'Datos e imágenes', 'Daten und Bilder')
add('credits.data.tmdb',
    "Titoli, date, cast, regia, sinossi, locandine, sfondi, durata e riassunti degli episodi.",
    "Titles, dates, cast, directors, synopses, posters, backdrops, runtimes and episode summaries.",
    "Titres, dates, distribution, réalisation, synopsis, affiches, images de fond, durées et résumés d'épisodes.",
    "Títulos, fechas, reparto, dirección, sinopsis, carteles, fondos, duración y resúmenes de episodios.",
    "Titel, Daten, Besetzung, Regie, Inhaltsangaben, Poster, Hintergrundbilder, Laufzeiten und Episodenzusammenfassungen.")
add('credits.data.justwatch',
    "Dove guardare ogni titolo. Ci arrivano tramite TMDB.",
    "Where to watch each title. It reaches us through TMDB.",
    "Où regarder chaque titre. Les données nous viennent par TMDB.",
    "Dónde ver cada título. Nos llega a través de TMDB.",
    "Wo du jeden Titel sehen kannst. Die Daten kommen über TMDB zu uns.")
add('credits.data.wikipedia',
    "Trame, scene dopo i titoli di coda, cameo di Stan Lee, fasi e linea temporale. Le trame sono sotto {license}: sotto ogni testo c'è il link all'articolo.",
    "Plots, post-credits scenes, Stan Lee cameos, phases and timeline. The plots are under the {license}: each text links to its article.",
    "Résumés complets, scènes après le générique, caméos de Stan Lee, phases et chronologie. Les résumés sont sous {license} : chaque texte renvoie à son article.",
    "Tramas, escenas tras los créditos, cameos de Stan Lee, fases y cronología. Las tramas tienen {license}: cada texto enlaza a su artículo.",
    "Handlungen, Szenen nach dem Abspann, Cameos von Stan Lee, Phasen und Zeitleiste. Die Handlungen stehen unter der {license}: Unter jedem Text steht der Link zum Artikel.")
add('credits.data.wikidata',
    "Collega ogni film al suo articolo di Wikipedia.",
    "Links each film to its Wikipedia article.",
    "Relie chaque film à son article Wikipédia.",
    "Vincula cada película con su artículo de Wikipedia.",
    "Verknüpft jeden Film mit seinem Wikipedia-Artikel.")
add('credits.ours.heading', 'Scritto da noi', 'Written by us', 'Écrit par nous', 'Escrito por nosotros', 'Von uns geschrieben')
add('credits.ours.body',
    "Le guide ai titoli, le scene chiave, le traduzioni e i testi legali sono scritti da noi. Non vengono da una fonte esterna.",
    "The title guides, the key scenes, the translations and the legal texts are written by us. They do not come from an outside source.",
    "Les guides des titres, les scènes clés, les traductions et les textes juridiques sont rédigés par nous. Ils ne viennent pas d'une source externe.",
    "Las guías de cada título, las escenas clave, las traducciones y los textos legales los escribimos nosotros. No vienen de una fuente externa.",
    "Die Titelguides, die Schlüsselszenen, die Übersetzungen und die Rechtstexte schreiben wir selbst. Sie stammen nicht aus einer externen Quelle.")
add('credits.type.heading', 'Caratteri e icone', 'Fonts and icons', 'Polices et icônes', 'Tipografías e iconos', 'Schriften und Icons')
add('credits.type.icons',
    "Icone {lucide}, licenza ISC.",
    "{lucide} icons, ISC license.",
    "Icônes {lucide}, licence ISC.",
    "Iconos {lucide}, licencia ISC.",
    "Icons von {lucide}, ISC-Lizenz.")
add('credits.software.heading', 'Software libero', 'Free software', 'Logiciels libres', 'Software libre', 'Freie Software')
add('credits.software.body',
    "Marvel Planner è costruito con software libero: {list}. Ognuno ha la sua licenza, che trovi nel suo progetto.",
    "Marvel Planner is built with free software: {list}. Each one has its own license, which you can find in its project.",
    "Marvel Planner est construit avec des logiciels libres : {list}. Chacun a sa licence, que vous trouverez dans son projet.",
    "Marvel Planner está hecho con software libre: {list}. Cada uno tiene su licencia, que encuentras en su proyecto.",
    "Marvel Planner basiert auf freier Software: {list}. Jedes Projekt hat seine eigene Lizenz, die du dort findest.")
add('footer.creditsLink', 'Crediti', 'Credits', 'Crédits', 'Créditos', 'Quellen und Lizenzen')

SOFT = [('React', 'https://react.dev'), ('React Router', 'https://reactrouter.com'), ('Hono', 'https://hono.dev'),
        ('Drizzle ORM', 'https://orm.drizzle.team'), ('Better Auth', 'https://www.better-auth.com'), ('Zod', 'https://zod.dev'),
        ('qrcode', 'https://github.com/soldair/node-qrcode')]
TMDB_NOTICE = 'This product uses the TMDB API but is not endorsed or certified by <a href="#">TMDB</a>.'
TMDB_IMG = '<img src="assets/tmdb-logo.svg" alt="" width="96" height="48">'
A = lambda t, u='#': f'<a href="{u}">{t}</a>'


def cr(l, k, **kw):
    s = E(CR[k][l])
    for a, b in kw.items():
        s = s.replace('{' + a + '}', b)
    return s


def read_credits(l='it'):
    lic = A(E(tx(l, 'footer.creditsLicense')), 'https://creativecommons.org/licenses/by-sa/4.0/')
    row_ = lambda name, body: f'<div><dt>{name}</dt><dd>{body}</dd></div>'
    data = ('<dl class="text-page__facts">'
            + row_(A('TMDB', 'https://www.themoviedb.org'), cr(l, 'credits.data.tmdb') + f'<div class="credit-tmdb">{TMDB_IMG}<p lang="en">{TMDB_NOTICE}</p></div>')
            + row_(A('JustWatch', 'https://www.justwatch.com'), cr(l, 'credits.data.justwatch'))
            + row_(A('Wikipedia', 'https://www.wikipedia.org'), cr(l, 'credits.data.wikipedia', license=lic))
            + row_(A('Wikidata', 'https://www.wikidata.org'), cr(l, 'credits.data.wikidata')) + '</dl>')
    ours = f'<p>{cr(l, "credits.ours.body")}</p>'
    fonts = E(tx(l, 'footer.fonts')).replace('{license}', A(E(tx(l, 'footer.fontsLicense')), 'https://openfontlicense.org'))
    typ = f'<ul><li>{fonts}</li><li>{cr(l, "credits.type.icons", lucide=A("Lucide", "https://lucide.dev"))}</li></ul>'
    soft = f'<p>{cr(l, "credits.software.body", list=", ".join(A(n, u) for n, u in SOFT))}</p>'
    secs = [('data', cr(l, 'credits.data.heading'), data), ('ours', cr(l, 'credits.ours.heading'), ours),
            ('type', cr(l, 'credits.type.heading'), typ), ('soft', cr(l, 'credits.software.heading'), soft)]
    body = cards(secs)
    intro = f'<p class="text-head__intro">{cr(l, "credits.intro")}</p>'
    return (f'<article class="text-page" aria-labelledby="tp-title">{head(l, cr(l, "credits.title"), E(tx(l, "footer.disclaimer")), intro)}'
            f'<div class="text-page__body">{body}</div></article>')


CRCSS = ('.credit-tmdb{display:flex;align-items:center;gap:var(--sp-4);margin-top:var(--sp-3);font-size:var(--fs-label);color:var(--ink-2)}'
         '.credit-tmdb p{margin:0}.credit-tmdb img{flex:none;display:block}'
         '.text-page__facts dt a{font-weight:700}')


def shell2(inner, l):
    labels = {'it': ('Privacy', 'Accessibilità', 'Crediti', 'Preferenze privacy'), 'en': ('Privacy', 'Accessibility', 'Credits', 'Privacy settings'),
              'fr': ('Confidentialité', 'Accessibilité', 'Crédits', 'Préférences de confidentialité'), 'es': ('Privacidad', 'Accesibilidad', 'Créditos', 'Preferencias de privacidad'),
              'de': ('Datenschutz', 'Barrierefreiheit', 'Quellen und Lizenzen', 'Datenschutzeinstellungen')}[l]
    foot = ('<footer class="site-footer"><div class="site-footer__legal">' + ''.join(f'<a href="#">{x}</a>' for x in labels[:3])
            + f'<button type="button" class="link-button">{labels[3]}</button></div></footer>')
    return f'<div class="shell"><div class="hdr"><span class="wordmark">Marvel Planner</span></div><main class="site-main">{inner}</main>{foot}</div>'


def frm2(label, theme, w, h, l='it', scroll=None):
    js = ''
    if scroll == 'bottom':
        js = 'document.fonts.ready.then(function(){window.scrollTo(0,document.documentElement.scrollHeight)})'
    return fr(label, theme, w, h, shell2(read_credits(l), l), ('html{overflow:auto!important}' if scroll else '') + CSSX + NEWCSS + CRCSS, js, lang=l)


def build():
    prop = tag('proposta · non implementata', 'k2')
    sc = lambda x: f'<div class="dc-scroll">{x}</div>'
    d = frm2('Proposta · 1280 px · chiaro', 'light', 1280, 940)
    dd = frm2('Proposta · 1280 px · scuro', 'dark', 1280, 940)
    m = frm2('Proposta · 390 px · chiaro', 'light', 390, 760)
    md = frm2('Proposta · 390 px · scuro', 'dark', 390, 760)
    m_end = frm2('Proposta · 390 px · fine pagina', 'light', 390, 760, scroll='bottom')
    de = frm2('Proposta · 390 px · de', 'light', 390, 760, l='de')
    fr_ = frm2('Proposta · 1280 px · fr', 'light', 1280, 940, l='fr')
    n320 = frm2('Proposta · 320 px · it', 'light', 320, 760)
    img = lambda f, cap, alt: (f'<div class="dc-fw"><div class="dc-fl">{cap}</div><img src="assets/{f}" alt="{alt}" width="390" style="display:block;max-width:100%;border-radius:var(--r-md)"></div>')
    forced = '<div class="dc-row">' + img('crediti-forced.png', 'Contrasto forzato · 390 px', 'Pagina Crediti con contrasto forzato: schede con contorno, cerchio del numero con contorno, loghi e link visibili') + '</div>'
    why = ("<b>1 · A cosa serve, e perché adesso.</b> È il posto unico per dire da dove arriva ogni cosa e con quale licenza. Oggi le attribuzioni sono sparse: il TMDB e i caratteri nel piè di pagina, JustWatch in un suggerimento di «Dove guardarlo», Wikipedia sotto ogni trama, le icone e il software da nessuna parte. "
           "Alcune licenze (ISC delle icone, MIT di quasi tutte le librerie, SIL OFL dei caratteri) chiedono di riportare l'avviso del titolare: una pagina lo fa in un punto solo e il piè di pagina può restare leggero. "
           "<b>Non sostituisce</b> l'attribuzione dove si usa il contenuto: le trame di Wikipedia (CC BY-SA 4.0) continuano ad avere sotto il link all'articolo e alla licenza, come vuole CLAUDE.md; il piè di pagina continua a dire che il sito è non ufficiale e a citare il TMDB (anche lì, con il logo). La pagina si aggiunge. "
           "Quando arriva l'illustrazione del caffè, il credito dell'autore ha già il suo posto: una riga in «Dati e immagini».")
    why2 = ("<b>2 · Stessa famiglia delle pagine Privacy e Accessibilità (voce 27).</b> Intestazione da saga (riga sopra «Informazioni legali», titolo Anton, riga sotto con l'avviso «Sito non ufficiale…», introduzione), poi <b>quattro schede numerate</b>: <b>Dati e immagini</b> (TMDB con logo e avviso in inglese, JustWatch, Wikipedia con la licenza CC BY-SA 4.0, Wikidata), <b>Scritto da noi</b>, <b>Caratteri e icone</b>, <b>Software libero</b>. Le fonti sono nella stessa scheda dei fatti dell'Accessibilità (nome a sinistra, cosa ci prendiamo a destra; sul telefono una sopra l'altra). Nessun componente nuovo: <code>.text-page</code>, <code>.card</code>, <code>.text-page__facts</code>. Nuova solo la riga del logo TMDB (<code>.credit-tmdb</code>). "
            "<b>Il logo del TMDB</b> sta qui e nel piè di pagina: in README la voce «il logo va aggiunto» è ancora aperta. Il logo è quello già in <code>AppFooter/tmdb-logo.svg</code>, 96 px, su <code>--row</code>. Se serve la versione per sfondo chiaro, la fornisce il TMDB: <b>non verificato</b> che il file attuale sia quello giusto per sfondi chiari.")
    why3 = ("<b>3 · Raggiungerla.</b> Un link nel piè di pagina, nella riga dei link legali, tra «Accessibilità» e «Preferenze privacy»; la rotta è <code>/crediti</code> (come <code>/accessibilita</code>). Il piè di pagina perde la riga dei caratteri (passa in «Caratteri e icone»; la chiave <code>footer.fonts</code> è la stessa) e conserva il TMDB con il logo e l'avviso. "
            "<b>Scartate:</b> (a) una sezione «Crediti» dentro la pagina Privacy (non è un tema di privacy); (b) un popup (un elenco di link che si cita e si condivide è una pagina); (c) l'elenco delle licenze di tutte le librerie con il testo completo: per ora i nomi con il link al progetto, dove il testo si trova; se il committente lo vuole, si genera da <code>package.json</code> con uno strumento a build (non a mano). "
            "<b>Non verificato:</b> le licenze esatte di ogni libreria (React, React Router, Hono, Better Auth, Zod, qrcode: MIT; Drizzle: Apache-2.0; Lucide: ISC) e i link al progetto; Code li controlla da <code>package.json</code> e <code>npm</code> prima di pubblicare.")
    why4 = ("<b>4 · Testi.</b> Nuovi, scritti con scrittura-ux, nelle cinque lingue (<code>docs/design/TESTI_CREDITI.md</code>); si riusano <code>footer.legal</code>, <code>footer.disclaimer</code>, <code>footer.creditsLicense</code>, <code>footer.fonts</code>, <code>footer.fontsLicense</code>. Non si affermano cose nuove sulla proprietà dei marchi: l'avviso «non ufficiale» è quello che c'è già. Regola 8: sono testi di attribuzione e licenza, li rilegge il committente; fr, es, de un madrelingua.")
    meas = tbl(['Misura (Chromium, Playwright)', 'Valore'], [
        ['Altezza della pagina (con intestazione e piè di pagina semplificato), 390 px', '1748 px'],
        ['Altezza della pagina, 1280 px', '1520 px (la colonna è da 36 rem: il testo resta di circa 75 caratteri per riga)'],
        ['Scorrimento orizzontale a 390, 1280 e 320 px; it, de, fr', 'nessuno (misurato su tutte le cornici)'],
        ['Riga della scheda delle fonti a 1280 px', 'nome a sinistra (7 rem), testo a destra, circa 60 caratteri'],
        ['Contrasti', 'gli stessi token delle pagine Privacy e Accessibilità (testo <code>--ink</code> su <code>--surface</code> 16,86 chiaro / 14,79 scuro; <code>--ink-2</code> su <code>--row</code> da verificare per il testo piccolo del TMDB)']])
    code = """// src/app/paths.ts: credits: "/crediti"; src/app/routes (stessa forma di accessibility); usePageTitle("credits.title")
// src/pages/CreditsPage/CreditsPage.tsx + .less: riusa .text-page, .text-head, .text-section, .text-page__facts (voce 27)
<article className="text-page" aria-labelledby="tp-title">
  <header className="text-head">
    <p className="text-head__kicker muted">{t("footer.legal")}</p>
    <h1 id="tp-title">{t("credits.title")}</h1>
    <p className="text-head__meta muted">{t("footer.disclaimer")}</p>
    <p className="text-head__intro">{t("credits.intro")}</p>
  </header>
  <div className="text-page__body">
    <section className="card text-section" aria-labelledby="h-data">
      <h2 id="h-data"><span className="text-section__n" aria-hidden="true">1</span>{t("credits.data.heading")}</h2>
      <dl className="text-page__facts">
        <div><dt><a href="https://www.themoviedb.org" rel="noreferrer">TMDB</a></dt>
             <dd>{t("credits.data.tmdb")}<div className="credit-tmdb"><img src={tmdbLogo} alt="" /><p lang="en">This product uses the TMDB API but is not endorsed or certified by <a …>TMDB</a>.</p></div></dd></div>
        <div><dt>JustWatch</dt><dd>{t("credits.data.justwatch")}</dd></div>
        <div><dt>Wikipedia</dt><dd>{rich("credits.data.wikipedia", { license: <a href=CC_BY_SA>{t("footer.creditsLicense")}</a> })}</dd></div>
        <div><dt>Wikidata</dt><dd>{t("credits.data.wikidata")}</dd></div>
      </dl>
    </section>
    …schede 2 (Scritto da noi), 3 (Caratteri e icone: footer.fonts + credits.type.icons), 4 (Software libero: credits.software.body con {list})
  </div>
</article>

// AppFooter: nella riga dei link legali, tra Accessibilità e Preferenze privacy: <Link to={PATHS.credits}>{t("footer.creditsLink")}</Link>; via la riga dei caratteri.
// La riga del logo (nuovo, solo questo):
.credit-tmdb { display: flex; align-items: center; gap: var(--sp-4); margin-top: var(--sp-3); font-size: var(--fs-label); color: var(--ink-2); p { margin: 0; } img { flex: none; display: block; width: 6rem; } }
// forced-colors.less: nessuna aggiunta (.card ha già il contorno; .text-section__n è della voce 27)"""
    rule = ('<pre><code>' + E(code) + '</code></pre>'
            + ul(['Nessun token nuovo. Il numero dei cerchi è l\'indice dell\'array (<code>aria-hidden</code>), ogni <code>h2</code> ha il suo <code>id</code>, «Torna su» (<code>BackToTop</code>) come nelle altre due pagine. Link esterni con <code>rel="noreferrer"</code>, senza <code>target="_blank"</code> (come oggi nel piè di pagina).',
                  '<b>Testi:</b> <code>docs/design/TESTI_CREDITI.md</code> (cinque lingue): copiali. La chiave <code>footer.creditsLink</code> è il testo del link nel piè di pagina; <code>footer.credits</code> (JustWatch e Wikipedia) si toglie con la voce 29.',
                  '<b>Test:</b> nessun test di componente. Verifica a mano a 390, 1280 e 320 px (nessuno scorrimento orizzontale), chiaro e scuro, cinque lingue (de: «Quellen und Lizenzen» a 390 px), tastiera (Tab: tutti i link in ordine), contrasto forzato, zoom al 200 %.',
                  '<b>DESIGN.md, Deviazioni:</b> «Crediti | CreditsPage | pagina di lettura come Privacy e Accessibilità (voce 27) | voce 31 di HANDOFF §2». <b>README:</b> aggiorna «Fonti dei dati» (il logo TMDB non è più aperto) e la sezione Struttura.',
                  '<b>Non verificato da Design:</b> licenze e link dei progetti, il logo TMDB su sfondo chiaro, Safari e Firefox, VoiceOver e NVDA.']))
    pd = tbl(['Cosa', 'Prima', 'Dopo', 'File'], [
        ['Pagina', 'non esiste', '<code>/crediti</code>: intestazione da saga + quattro schede', 'paths.ts; CreditsPage nuova'],
        ['Attribuzioni', 'TMDB e caratteri nel piè di pagina, JustWatch nel suggerimento, trame sotto il testo', 'tutte anche qui; sotto la trama e nel piè di pagina (TMDB) restano dove sono', 'AppFooter.tsx'],
        ['Piè di pagina', 'riga dei caratteri, nessun link ai crediti', 'link «Crediti» tra i link legali; via la riga dei caratteri', 'AppFooter.tsx/.less'],
        ['Icone e software', 'non citati', 'citati con licenza e link', 'CreditsPage; <code>credits.type.icons</code>, <code>credits.software.body</code>']])
    return ''.join([
        h1('Crediti', 'Da dove arriva ogni dato, immagine, carattere e software, con la sua licenza.'),
        hdr('Pagina /crediti: attribuzioni e licenze in un punto solo, nella stessa famiglia delle pagine Privacy e Accessibilità. Si aggiunge all\'attribuzione dove si usa il contenuto, non la sostituisce.',
            'nuova: src/pages/CreditsPage/ (riferimento 4bfbea4 per README «Fonti dei dati», package.json e AppFooter)',
            'Pagine di testo (voce 27), Navigation (piè di pagina, voce 29), Typography'),
        sec('Decisione · pagina Crediti: attribuzioni e licenze in un punto solo (voce 31)',
            f'<div>{prop}</div>Cornici con le classi vere dell\'app (<code>.card</code>, <code>.text-page</code>, <code>.text-page__facts</code>) e i testi di <code>docs/design/TESTI_CREDITI.md</code>. <b>Non verificato:</b> licenze e link dei progetti, Safari e Firefox, lettori di schermo.'
            + box('Scelta · raccomandazione e alternative per punto', f'<p>{why}</p><p>{why2}</p><p>{why3}</p><p>{why4}</p>')),
        sec('Proposta · desktop', '1280 px, chiaro e scuro.', col(sc(row(d)), sc(row(dd)))),
        sec('Proposta · telefono', '390 px, chiaro, scuro e fine pagina.', sc(row(m, md, m_end))),
        sec('Francese, tedesco, 320 px', 'Titoli più lunghi e la colonna stretta.', sc(row(de, n320)) + sc(row(fr_))),
        sec('Contrasto forzato', 'Emulazione di Chromium (<code>forcedColors: active</code>), 390 px.', sc(forced)),
        sec('Misure', 'Prese con Playwright (Chromium) sulle classi dell\'app.', f'<div class="dc-scroll">{meas}</div>'),
        sec('Regola per Code', 'Il prompt completo è in <code>docs/design/PROMPT_CODE_CREDITI.md</code>.', rule),
        sec('Prima, dopo, file', '', pd)])


def testi_md():
    md = ['# Testi nuovi: pagina Crediti (voce 31)', '',
          'Scritti da Design con la skill `scrittura-ux` (tu; fr: vous; de: du). **Sono testi di attribuzione e licenza: li rilegge il committente; fr, es, de un madrelingua.** '
          'Si riusano, senza cambiarle: `footer.legal` (riga sopra il titolo), `footer.disclaimer` (riga sotto), `footer.creditsLicense`, `footer.fonts`, `footer.fontsLicense`. '
          'L\'avviso del TMDB resta in inglese (`lang="en"`), com\'è nel piè di pagina. Segnaposto: `{license}` (link a CC BY-SA 4.0), `{lucide}` (link a Lucide), `{list}` (elenco di link ai progetti).', '']
    for k, v in CR.items():
        md += [f'## `{k}`', ''] + [f'- **{l}**: {v[l]}' for l in L5] + ['']
    md += ['## `footer.credits`', '', '*da togliere con la voce 29: JustWatch e Wikipedia sono attribuiti dove si usano (e qui).*', '']
    open(os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'TESTI_CREDITI.md')), 'w', encoding='utf-8').write('\n'.join(md))


def register_index():
    p = os.path.join(CANVAS, 'Index.dc.html')
    t = open(p, encoding='utf-8', newline='').read()
    if '<b>Crediti</b>' in t:
        print('Index: già registrata')
        return
    marker = '<tr><td><b>Pagine di errore</b></td>'
    assert t.count(marker) == 1
    row_ = ('<tr><td><b>Crediti</b></td><td>Pagina /crediti: da dove arriva ogni dato, immagine, carattere e software, con la licenza. Quattro schede numerate nella famiglia delle pagine di testo.</td>'
            '<td>Pagine di testo, Navigation (piè di pagina)</td><td>src/pages/CreditsPage/ (nuova)</td></tr>')
    open(p, 'w', encoding='utf-8', newline='').write(t.replace(marker, row_ + marker, 1))
    print('Index: registrata')


if __name__ == '__main__':
    out = os.path.join(CANVAS, 'Crediti.dc.html')
    if os.path.exists(out) and '--force' not in sys.argv:
        raise SystemExit('già creata (usa --force)')
    open(out, 'w', encoding='utf-8', newline='').write(page('Crediti', build()))
    testi_md()
    print('ok', out)
    register_index()
