"""Blocchi del canvas: footer (voce 29, P10) in «Navigation» e Admin (voce 30, P9) in «Admin».
`python add_footer_admin.py` li inserisce una volta sola (con --force li sostituisce). Scritto a mano: una rigenerazione
di p_nav.py / p_admin.py li cancella. Testi nuovi dell'Admin: testi_admin.py (scrittura-ux), tabella nel blocco."""
import sys
import html as _h
from add_pc_lib import *
from parts import btn

E = lambda s: _h.escape(s, quote=False)
sc = lambda x: f'<div class="dc-scroll">{x}</div>'
PROP = tag('proposta · non implementata', 'k2')

# =============================================================== FOOTER
TMDB = '<img class="site-footer__tmdb-logo" src="assets/tmdb-logo.svg" alt="">'
TMDB_TXT = 'This product uses the TMDB API but is not endorsed or certified by <a href="#">TMDB</a>.'
DISC = 'Sito non ufficiale, non affiliato a Marvel Studios o The Walt Disney Company.'
CREDITS = 'Dati sulla disponibilità: <a href="#">JustWatch</a>. Trame: <a href="#">Wikipedia</a>, <a href="#">licenza CC BY-SA 4.0</a>.'
FONTS = 'Caratteri Anton e Hanken Grotesk, <a href="#">licenza SIL OFL 1.1</a>.'
COFFEE = f'<p class="coffee-link"><a href="#">{icon("coffee")}Se ti sono stato utile, offrimi un caffè</a></p>'


def footer_old():
    return (f'<footer class="site-footer on-panel"><div class="site-footer__columns"><div class="site-footer__about"><p class="wordmark wordmark--large">Marvel Planner</p>'
            f'<p class="muted">{DISC}</p><p class="muted">{CREDITS}</p><p class="muted">{FONTS}</p></div>'
            f'<div class="site-footer__tmdb">{TMDB}<p class="muted">{TMDB_TXT}</p></div></div>'
            f'<nav class="site-footer__legal" aria-label="Informazioni legali"><a href="#">Privacy</a><a href="#">Accessibilità</a><button type="button" class="btn btn--text">Preferenze privacy</button>{COFFEE}'
            '<span class="site-footer__made" lang="en">Made in Italy</span></nav></footer>')


COFFEE2 = (f'<p class="coffee-link coffee-card"><a href="#"><span class="coffee-card__art" aria-hidden="true">{icon("coffee")}</span>'
          f'<span class="coffee-card__text">Se ti sono stato utile, offrimi un caffè</span><span class="coffee-card__go" aria-hidden="true">{icon("arrow-up-right")}</span></a></p>')


def footer_new():
    return (f'<footer class="site-footer on-panel ft2"><div class="ft2__top"><div class="ft2__about"><div><p class="wordmark wordmark--large">Marvel Planner</p><p class="ft2__version">Versione 1.4.2</p></div><p class="ft2__disc">{DISC}</p></div>'
            f'{COFFEE2}</div>'
            '<div class="ft2__bottom">'
            f'<div class="ft2__info"><div class="ft2__tmdb">{TMDB}<p lang="en">{TMDB_TXT}</p></div><p>{FONTS}</p><p class="ft2__copy">© 2026 Marvel Planner</p></div>'
            '<nav class="ft2__legal" aria-label="Informazioni legali"><a href="#">Privacy</a><a href="#">Accessibilità</a><button type="button" class="btn btn--text">Preferenze privacy</button></nav>'
            '<span class="site-footer__made ft2__made" lang="en">Made in Italy</span></div></footer>')


FT_CSS = (
    # il footer nuovo: in alto identità e riquadro del caffè · linea · in basso le note a sinistra, i link legali e «Made in Italy» a destra
    '.ft2{gap:var(--sp-10)}'
    '.ft2__top{display:grid;gap:var(--sp-8)}'
    '@media (min-width:64em){.ft2__top{grid-template-columns:1fr auto;column-gap:var(--sp-10);align-items:center}}'
    '.ft2__about{display:flex;flex-direction:column;gap:var(--sp-3);max-width:36rem}'
    '.ft2__disc,.ft2__version{margin:0;color:var(--muted-on-dark)}.ft2__version{font-size:var(--fs-label);margin-top:var(--sp-1)}'
    '.ft2 .coffee-card{margin:0;max-width:26rem;border-radius:var(--r-xl);background:var(--highlight)}'
    '.ft2 .coffee-card a{display:flex;align-items:center;gap:var(--sp-4);min-height:var(--hit);padding:var(--sp-5,1.25rem) var(--sp-6);color:var(--ink-static);text-decoration:none}'
    '.ft2 .coffee-card a:focus-visible{outline:var(--focus-on-inverse);outline-offset:3px}'
    '.coffee-card__art{flex:none;display:grid;place-items:center;width:4.5rem;height:4.5rem;border-radius:var(--r-pill);background:var(--ink-static);color:var(--highlight)}.coffee-card__art svg{width:2rem;height:2rem}'
    '.coffee-card__text{font-family:var(--font-display);font-weight:400;text-transform:uppercase;letter-spacing:.02em;font-size:var(--fs-h3);line-height:1.15}@media (min-width:48em){.coffee-card__text{font-size:var(--fs-h4);line-height:1.1}}'
    '.coffee-card__go{flex:none;margin-left:auto}.coffee-card__go svg{width:1.5rem;height:1.5rem}'
    '.ft2 .coffee-card a:hover .coffee-card__text{text-decoration:underline}'
    '.ft2__bottom{display:grid;grid-template-areas:"legal" "info" "made";gap:var(--sp-6) var(--sp-10);padding-top:var(--sp-8);border-top:1px solid var(--panel-2);font-size:var(--fs-label)}'
    '@media (min-width:48em){.ft2__bottom{grid-template-columns:1fr auto;grid-template-areas:"info legal" "info made"}}'
    '.ft2__info{grid-area:info;display:flex;flex-direction:column;gap:var(--sp-3);color:var(--muted-on-dark)}.ft2__info p{margin:0}'
    '.ft2__tmdb{display:flex;align-items:center;gap:var(--sp-4);max-width:32rem}'
    '.ft2__legal{grid-area:legal;display:flex;flex-wrap:wrap;gap:0 var(--sp-6)}@media (min-width:48em){.ft2__legal{justify-content:flex-end}}'
    '.ft2__legal a,.ft2__legal .btn{display:inline-flex;align-items:center;min-height:var(--hit);padding:0;font-size:var(--fs-label);font-weight:600;color:var(--on-dark);text-decoration:underline}'
    '.ft2__made{grid-area:made;justify-self:end;align-self:end;margin:0;white-space:nowrap}'
    '.ft2 .wordmark:hover{color:inherit}')


FT_BASE = 'body{margin:0;padding:0;background:var(--bg)}.site-footer{margin:0!important}.coffee-link{margin:0}.coffee-link a{display:inline-flex;align-items:center;gap:var(--sp-2);min-height:var(--hit);color:var(--on-dark);text-decoration:underline}.coffee-link svg{width:20px;height:20px}'


def ffr(label, theme, w, h, inner, extra=''):
    return fr(label, theme, w, h, inner, FT_BASE + FT_CSS + extra)


def build_footer():
    old_d = ffr('Oggi · 1280 px · chiaro', 'light', 1100, 440, footer_old())
    old_m = ffr('Oggi · 390 px · chiaro', 'light', 390, 560, footer_old())
    new_d = ffr('Proposta · 1280 px · chiaro', 'light', 1100, 440, footer_new())
    new_m = ffr('Proposta · 390 px · chiaro', 'light', 390, 690, footer_new())
    new_dd = ffr('Proposta · 1280 px · scuro', 'dark', 1100, 440, footer_new())
    new_md = ffr('Proposta · 390 px · scuro', 'dark', 390, 690, footer_new())
    HD, HM, CH = '436 (+6 %)', '687 (+9 %)', "112 px di altezza (oggi 44), giallo; a destra del nome (1280) o a tutta larghezza sotto l'avviso (390)"
    why = ("<b>1 · Impostazione del riferimento, con una sola regola di spazio.</b> Oggi il piè di pagina mette nello stesso flusso l'avviso, i crediti, i caratteri, il TMDB, i link legali, «Offrimi un caffè» e «Made in Italy»: «Privacy» si trova dopo quattro paragrafi. "
           "Proposta, due fasce divise da una linea sottile (<code>--panel-2</code>): <b>in alto</b> a sinistra l'identità (nome, <b>versione sotto il nome</b>, avviso «Sito non ufficiale…»), a destra il <b>riquadro del caffè</b>; <b>in basso</b> a sinistra le note in piccolo (TMDB, licenza dei caratteri, «© 2026 Marvel Planner»), a destra i <b>link legali</b> in linea (Privacy · Accessibilità · Preferenze privacy, sottolineati, righe da 44 px) e, <b>sotto i link, in basso a destra, «Made in Italy»</b>, come un marchio di qualità. "
           "<b>Spazi (la versione di prima era «sporca» perché ne aveva cinque diversi):</b> tra le due fasce e dentro ciascuna fascia solo <code>--sp-10</code> (40 px) tra zone e <code>--sp-8</code> sopra e sotto la linea; dentro un gruppo di testo sempre <code>--sp-3</code> (12 px). Nient'altro. Sul telefono, nell'ordine: identità, caffè, linea, link legali, note, «Made in Italy» a destra. "
           "<b>Scartate:</b> (a) le colonne di link del riferimento: abbiamo tre link legali, non quindici; (b) i link legali in colonna in alto; (c) una seconda linea tra TMDB e riga di chiusura (più linee = più rumore); (d) «Made in Italy» nella stessa riga dei link, come nella versione precedente (era la riga più affollata).")
    why2 = ("<b>2 · «©» e «Tutti i diritti riservati».</b> Raccomando: <b>niente «Tutti i diritti riservati»</b>, e il «©» solo se il committente conferma. Perché: il sito mostra cose che non sono nostre (nomi e personaggi Marvel, locandine e dati del TMDB, trame di Wikipedia sotto licenza CC BY-SA 4.0, che si possono riusare). Una frase che rivendica tutto contraddice sia la licenza delle trame sia l'avviso «non ufficiale». «© 2026 Marvel Planner» dichiara soltanto l'autore del sito (codice e grafica) ed è la formula comune; il diritto d'autore esiste anche senza il simbolo. "
            "<b>Non sono un legale:</b> è una scelta da far vedere a un esperto insieme ai testi di Privacy e Accessibilità. Se si toglie, la riga resta com'è (link a destra, firma). Da decidere: l'anno è fisso («2026») o dalla data della build; il nome è un nome proprio, quindi la stessa stringa nelle cinque lingue (<code>footer.copyright</code> con <code>{year}</code>).")
    why5 = ("<b>5 · Il riquadro del caffè conta di più.</b> Era un link con una tazza; ora è una scheda: gialla (<code>--highlight</code>, come il biglietto dell'Accessibilità), con angoli <code>--r-xl</code> come le schede del sito, un tondo scuro (<code>--ink-static</code>) con la tazza gialla a sinistra, la frase in Anton maiuscolo (<code>--fs-h3</code> sul telefono, <code>--fs-h4</code> da 48 em) (lo stesso carattere dei titoli) e una freccia in alto a destra che dice «si apre altrove». Tutta la scheda è il link (altezza oltre 44 px). A 1280 sta a destra del nome, larga al massimo 26 rem; a 390 occupa tutta la larghezza sotto l'avviso. "
            "<b>Il posto per la tua immagine:</b> il tondo di 72 px a sinistra. Se arriva un'illustrazione, prende quel posto (quadrata o con angoli <code>--r-md</code>, 72-96 px, <code>alt=\"\"</code> perché la frase già dice tutto, file nostro in <code>/assets</code> o <code>public/</code>, mai di un altro dominio per la CSP); finché non c'è, resta la tazza. Se l'immagine ha colori vivaci, il giallo sotto va riguardato insieme. Nessuna animazione nuova: solo la sottolineatura al passaggio del mouse. Il testo è invariato (<code>footer.coffee</code>).")
    why3 = ("<b>3 · JustWatch e Wikipedia escono dal piè di pagina: sono già dichiarate dove si usano.</b> Hai ragione: i dati sulla disponibilità sono attribuiti in «Dove guardarlo» (<code>WhereToWatch.tsx</code> r.70-72, «Dati sulla disponibilità forniti da JustWatch», nel suggerimento accanto al titolo) e le trame hanno la riga di fonte con link all'articolo e alla licenza CC BY-SA 4.0 (<code>PlotSection.tsx</code> r.11-24). La regola di CLAUDE.md è questa: attribuzione dove si usa il testo. Nel piè di pagina restano le cose che non hanno un altro posto: il TMDB (richiesto in tutto il sito) e i caratteri (SIL OFL). "
            "<b>Da decidere col committente:</b> il suggerimento di «Dove guardarlo» è un tooltip, quindi l'attribuzione di JustWatch la vede solo chi lo apre; se i termini del TMDB la vogliono sempre in vista, va resa visibile lì, non nel piè di pagina. Si toglie la chiave <code>footer.credits</code> (cinque lingue); nessun altro testo viene riscritto. Testi nuovi: «Versione {version}» (it · en «Version» · fr «Version» · es «Versión» · de «Version») e «© {year} Marvel Planner»; la versione viene dal <code>package.json</code> a build (<code>define</code> di Vite, BACKLOG §5).")
    why4 = ("<b>4 · Piccole correzioni del BACKLOG §5.</b> <b>Titolo che cambia colore al mouse:</b> <code>.wordmark:hover</code> colpisce anche il <code>&lt;p class=\"wordmark wordmark--large\"&gt;</code> del piè di pagina, che non è un link: l'hover si limita al logo dell'intestazione (<code>.site-header .wordmark</code>). "
            "<b>Testo TMDB:</b> <code>lang=\"en\"</code> (oggi senza). <b>Bersagli:</b> i link legali sono righe da 44 px (<code>--hit</code>), il caffè è un solo link da 48 px; i link dentro le frasi del TMDB sono in linea (WCAG 2.5.8 li esclude), a 14 px in <code>--muted-on-dark</code>: contrasto 8,26 chiaro e 4,55 scuro (soglia 4,5, al limite nel tema scuro: non scurire il pannello). Testo del caffè: <code>--ink-static</code> su <code>--highlight</code>, come il biglietto giallo dell'Accessibilità.")
    meas = tbl(['Misura (Chromium, Playwright)', 'Oggi', 'Proposta'], [
        ['Altezza del piè di pagina, 1280 px', '412 px', '<b>' + HD + ' px</b>'],
        ['Altezza, 390 px', '631 px (con «Offrimi un caffè»)', '<b>' + HM + ' px</b>'],
        ['Riquadro del caffè', 'link da 44 px nella riga legale', CH],
        ['Link legali', 'riga che va a capo, tra caffè e «Made in Italy»', 'in linea in alto a destra della fascia bassa; righe da 44 px'],
        ['«Made in Italy»', 'in fila coi link', 'sotto i link, in basso a destra'],
        ['Spazi usati', 'vari', '<code>--sp-3</code>, <code>--sp-8</code>, <code>--sp-10</code>'],
        ['Scorrimento orizzontale a 390 e 1280 px', 'nessuno', 'nessuno']])
    code = """// AppFooter.tsx: due fasce
<footer id={FOOTER_ID} className="site-footer on-panel">
  <div className="site-footer__top">
    <div className="site-footer__about">
      <div><p className="wordmark wordmark--large">{SITE.name}</p><p>{t("footer.version", { version: __APP_VERSION__ })}</p></div>
      <p>{t("footer.disclaimer")}</p>
    </div>
    <CoffeeLink />
  </div>
  <div className="site-footer__bottom">
    <div className="site-footer__info">
      <div className="site-footer__tmdb">logo + <p lang="en">…</p></div>
      <p>{fonts}</p>
      <p>{t("footer.copyright", { year })}</p>
    </div>
    <nav className="site-footer__legal" aria-label={t("footer.legal")}>Privacy · Accessibilità · Preferenze privacy</nav>
    <span className="site-footer__made" lang="en">Made in Italy</span>
  </div>
</footer>

// CoffeeLink.tsx: stessa <p><a>, dentro tre <span>: tondo con la tazza, testo, freccia (ArrowUpRight, aria-hidden)
<p className="coffee-card"><a href={SITE.coffeeUrl} target="_blank" rel="noreferrer">
  <span className="coffee-card__art" aria-hidden><Coffee /></span>
  <span className="coffee-card__text">{t("footer.coffee")}</span>
  <span className="coffee-card__go" aria-hidden><ArrowUpRight /></span>
</a></p>

// CoffeeLink.less (sostituisce .coffee-link)
.coffee-card { margin: 0; max-width: 26rem; border-radius: var(--r-xl); background: var(--highlight); a { display: flex; align-items: center; gap: var(--sp-4); min-height: var(--hit); padding: var(--sp-5) var(--sp-6); color: var(--ink-static); text-decoration: none; &:focus-visible { outline: var(--focus-on-inverse); outline-offset: 3px; } &:hover .coffee-card__text { text-decoration: underline; } } }
.coffee-card__art { flex: none; display: grid; place-items: center; width: 4.5rem; height: 4.5rem; border-radius: var(--r-pill); background: var(--ink-static); color: var(--highlight); svg { width: 2rem; height: 2rem; } }   // qui va l'immagine, se arriva
.coffee-card__text { .display-font(); font-size: var(--fs-h3); line-height: 1.15; .desktop({ font-size: var(--fs-h4); line-height: 1.1; }); }
.coffee-card__go { flex: none; margin-left: auto; svg { width: 1.5rem; height: 1.5rem; } }

// AppFooter.less (sostituisce .site-footer__columns e .site-footer__legal; .site-footer resta panel con il suo padding e il posto per le pillole)
.site-footer { gap: var(--sp-10); }
.site-footer__top { display: grid; gap: var(--sp-8); .desktop({ grid-template-columns: 1fr auto; column-gap: var(--sp-10); align-items: center; }); }
.site-footer__about { display: flex; flex-direction: column; gap: var(--sp-3); max-width: 36rem; p { margin: 0; color: var(--muted-on-dark); } }
.site-footer__bottom { display: grid; grid-template-areas: "legal" "info" "made"; gap: var(--sp-6) var(--sp-10); padding-top: var(--sp-8); border-top: 1px solid var(--panel-2); font-size: var(--fs-label); @media (min-width: 48em) { grid-template-columns: 1fr auto; grid-template-areas: "info legal" "info made"; } }
.site-footer__info { grid-area: info; display: flex; flex-direction: column; gap: var(--sp-3); color: var(--muted-on-dark); p { margin: 0; } }
.site-footer__tmdb { display: flex; align-items: center; gap: var(--sp-4); max-width: 32rem; }
.site-footer__legal { grid-area: legal; display: flex; flex-wrap: wrap; gap: 0 var(--sp-6); @media (min-width: 48em) { justify-content: flex-end; } a, .btn { display: inline-flex; align-items: center; min-height: var(--hit); padding: 0; font-size: var(--fs-label); font-weight: 600; color: var(--on-dark); text-decoration: underline; } }
.site-footer__made { grid-area: made; justify-self: end; align-self: end; margin: 0; white-space: nowrap; }   // perde il margin-left: auto di oggi

// motion.less: l'hover del titolo solo sul logo dell'intestazione
.site-header .wordmark:hover { … }   // al posto di .wordmark:hover"""
    rule = ('<pre><code>' + E(code) + '</code></pre>'
            + ul(['Nessun valore nuovo. <code>--panel-2</code> per la linea (esiste); <code>--r-xl</code>, <code>--r-pill</code>, <code>--sp-5</code>, <code>--focus-on-inverse</code>, <code>--fs-h3</code>, <code>--fs-h4</code>, <code>--highlight</code>, <code>--ink-static</code>, <code>--muted-on-dark</code>, <code>--on-dark</code>, <code>--hit</code>, <code>--fs-label</code>, <code>--sp-*</code>, <code>--r-md</code>.',
                  '<code>vite.config.ts</code>: <code>define: { __APP_VERSION__: JSON.stringify(pkg.version) }</code> e la dichiarazione di tipo; chiavi <code>footer.version</code> («Versione {version}», «Version {version}», «Version {version}», «Versión {version}», «Version {version}») e <code>footer.copyright</code> («© {year} Marvel Planner» uguale in tutte). Via <code>footer.credits</code>.',
                  '<b>Test:</b> nessun test di componente. Verifica a mano a 390 e 1280 px (e 320), chiaro e scuro, cinque lingue (fr e de: l\'avviso e il TMDB vanno a capo senza uscire); con e senza <code>coffeeUrl</code>; tastiera (Tab: caffè, TMDB, licenza caratteri, Privacy, Accessibilità, Preferenze privacy); contrasto forzato: la scheda gialla perde lo sfondo: in <code>forced-colors.less</code> <code>.coffee-card { border: 1px solid ButtonText; }</code> e il tondo <code>.coffee-card__art { forced-color-adjust: none; border: 1px solid ButtonText; background: Canvas; color: CanvasText; }</code>, e il pannello non ha bordo oggi (aggiungerlo se si vuole).',
                  '<b>Non verificato:</b> Safari e Firefox, lettori di schermo, il contrasto 4,55 del testo piccolo nel tema scuro su schermi reali.']))
    pd = tbl(['Cosa', 'Prima', 'Dopo', 'File'], [
        ['Struttura', 'avviso, crediti, caratteri, TMDB, poi link legali con caffè e «Made in Italy»', 'due fasce: in alto identità e scheda del caffè; sotto la linea note a sinistra, link legali e «Made in Italy» a destra', 'AppFooter.tsx r.17-63'],
        ['Link legali', 'riga che va a capo in fondo, con il caffè', 'in linea a destra della riga di chiusura, 44 px di altezza', 'AppFooter.less r.60-71'],
        ['Caffè', 'link nudo nella riga legale', 'scheda gialla: tondo con la tazza (o la tua immagine), frase in Anton, freccia', 'CoffeeLink.tsx/.less'],
        ['Crediti JustWatch e Wikipedia', 'riga nel piè di pagina', 'tolta: restano dove si usano (Dove guardarlo, trame)', 'AppFooter.tsx; <code>footer.credits</code>'],
        ['«Made in Italy»', 'in fila coi link', 'in basso a destra, ultimo elemento', 'AppFooter.less'],
        ['Titolo «Marvel Planner»', 'cambia colore al mouse', 'non cambia (non è un link)', 'motion.less (<code>.wordmark:hover</code>)'],
        ['Testo TMDB', 'senza <code>lang</code>', '<code>lang="en"</code>', 'AppFooter.tsx r.38-45'],
        ['Versione e ©', 'assenti', '«Versione {version}» sotto il nome; «© {year} Marvel Planner» in basso a sinistra', 'vite.config.ts; AppFooter.tsx; locale']])
    return (f'<div class="dc-sec"><h2 class="dc-h2">Decisione · piè di pagina: due fasce, scheda del caffè e «Made in Italy» come marchio (voce 29, P10)</h2><div>{PROP}</div>'
            '<p class="dc-sub">Riferimento: <code>AppFooter.tsx/.less</code> di 4bfbea4 (letto con <code>git show</code>; <b>4bfbea4 non è su <code>main</code></b>). Cornici con le classi vere del piè di pagina (<code>.site-footer</code>, <code>.wordmark--large</code>, <code>.site-footer__tmdb</code>) e il logo TMDB; «Offrimi un caffè» compare in entrambe (nel codice c\'è solo se <code>coffeeUrl</code> è impostato). <b>Non verificato:</b> Safari e Firefox, lettori di schermo.</p>'
            + box('Scelta · raccomandazione e alternative per punto', f'<p>{why}</p><p>{why2}</p><p>{why5}</p><p>{why3}</p><p>{why4}</p>')
            + sec('Oggi', 'Il piè di pagina com\'è: i link legali sono in fondo, dopo quattro paragrafi.', sc(row(old_d, old_m)))
            + sec('Proposta · chiaro', 'In alto identità e scheda del caffè · linea · in basso note a sinistra, link legali e «Made in Italy» a destra.', sc(row(new_d, new_m)))
            + sec('Proposta · scuro', 'Il pannello cambia tinta con il tema; la linea sottile e il testo piccolo restano leggibili.', sc(row(new_dd, new_md)))
            + sec('Misure', 'Prese con Playwright (Chromium) sulle classi dell\'app.', f'<div class="dc-scroll">{meas}</div>')
            + sec('Regola per Code', 'Il prompt completo è in <code>docs/design/PROMPT_CODE_FOOTER_ADMIN.md</code>.', rule)
            + sec('Prima, dopo, file', '', pd) + '</div>')


# =============================================================== ADMIN
CHEV = icon('chevron-down')
RIGHT = icon('chevron-right')


def row_(label, val, none=False):
    v = (f'<span class="adm-row__n muted" aria-hidden="true">{icon("check")}</span><span class="adm-sr">Niente da fare</span>' if none else f'<span class="adm-row__n"><strong>{val}</strong></span>')
    return f'<li><a class="adm-row" href="#"><span class="adm-row__l">{label}</span>{v}{RIGHT}</a></li>'


def acc(title, sub, count, body='', is_open=False):
    return (f'<details class="phase card"{" open" if is_open else ""}><summary class="phase__summary"><span class="phase__heading"><h3 class="phase__name">{title}</h3>{('<span class="phase__years muted">' + sub + '</span>') if sub else ''}</span>'
            f'<span class="phase__count">{count}</span>{CHEV}</summary>{body}</details>')


def sugg_body():
    it = lambda who, item: (f'<li class="adm-item"><p><span class="adm-new">Nuovo</span> Da {who} · Voce: «{item}»</p><div class="adm-item__act">{btn("soft", "Apri il film", "sm")}{btn("soft", "Segna come fatto", "sm")}{btn("text", "Scarta", "sm")}</div></li>')
    return f'<ul class="adm-items">{it("Lucia", "Trama")}{it("Marco", "Scene dopo i titoli")}</ul>'


def state_card(problem=False, maint=False):
    if maint:
        st = f'<p class="adm-st adm-st--warn">{icon("triangle-alert")}<b>Manutenzione attiva</b></p>'
        bt = btn('primary', 'Disattiva manutenzione', 'sm')
    else:
        st = f'<p class="adm-st">{icon("circle-check")}<b>Sito online</b></p>'
        bt = btn('soft', 'Attiva manutenzione', 'sm')
    weekly = (f'<dd class="adm-warn">{icon("triangle-alert")}In ritardo · 10 nov</dd>' if problem else '<dd>Riuscita · 17 nov</dd>')
    return (f'<section class="card adm-state"><h2 class="section-title">Stato del sito</h2><div class="adm-line">{st}{bt}</div>'
            f'<dl class="adm-facts"><div><dt>Attività giornaliera</dt><dd>Riuscita · 20 nov</dd></div><div><dt>Attività settimanale</dt>{weekly}</div>'
            '<div><dt>Token TMDB</dt><dd>Configurato</dd></div><div><dt>Iscritti</dt><dd>128 · 6 nuovi in 7 giorni</dd></div></dl></section>')


def todo_card():
    return ('<section class="card adm-todo"><h2 class="section-title">Da fare</h2><ul class="adm-list">'
            + row_('Nuovi titoli da valutare', '3') + row_('Contenuti da completare', '12') + row_('Date da controllare', '2') + row_('Suggerimenti da leggere', '2') + '</ul></section>')


def todo_card_empty():
    return ('<section class="card adm-todo"><h2 class="section-title">Da fare</h2><ul class="adm-list">'
            + row_('Nuovi titoli da valutare', '', True) + row_('Contenuti da completare', '', True) + row_('Date da controllare', '', True) + row_('Suggerimenti da leggere', '', True) + '</ul></section>')


def admin_page(problem=False, maint=False, empty=False, opened=False):
    sections = (acc('Nuovi titoli su TMDB', 'Ultima ricerca: 17 nov', '3') + acc('Contenuti da completare', '12 titoli da completare su 65 usciti', '12')
                + acc('Date di uscita', '', '2') + acc('Suggerimenti', '', '2', sugg_body() if opened else '', opened))
    if empty:
        sections = (acc('Nuovi titoli su TMDB', 'Ultima ricerca: 17 nov', '0') + acc('Contenuti da completare', '', '0') + acc('Date di uscita', '', '0') + acc('Suggerimenti', '', '0'))
    t = todo_card_empty() if empty else todo_card()
    return (f'<div class="adm"><h1 class="saga__title">Amministrazione</h1><div class="adm__top">{t}{state_card(problem, maint)}</div><div class="adm__queues">{sections}</div></div>')


AD_CSS = ('body{margin:0;padding:var(--sp-2);background:var(--bg);color:var(--ink);font-family:var(--font-body);font-size:var(--fs-body);line-height:1.5}'
          '.adm{display:flex;flex-direction:column;gap:var(--sp-4);max-width:72rem;margin:0 auto}.adm h1{margin:0;padding:var(--sp-2) 0 0}'
          '.adm__top{display:grid;gap:var(--sp-3)}@media (min-width:64em){.adm__top{grid-template-columns:1fr 1fr;align-items:start}}'
          '.adm__queues{display:flex;flex-direction:column;gap:var(--sp-2)}'
          '.adm-list{list-style:none;margin:var(--sp-2) 0 0;padding:0;display:flex;flex-direction:column}'
          '.adm-row{display:flex;align-items:center;gap:var(--sp-3);min-height:var(--hit);padding:var(--sp-1) var(--sp-3);border-radius:var(--r-sm);color:var(--ink);text-decoration:none}.adm-row:hover{background:var(--row-hover)}'
          '.adm-row svg{flex:none;width:20px;height:20px}.adm-row .adm-row__n{margin-left:auto;display:inline-flex;align-items:center;gap:var(--sp-2)}.adm-row .adm-row__n+svg{margin-left:0}'
          '.adm-line{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:var(--sp-3);margin:var(--sp-3) 0}.adm-st{display:flex;align-items:center;gap:var(--sp-2);margin:0}.adm-st svg{width:20px;height:20px}'
          '.adm-facts{display:flex;flex-direction:column;gap:var(--sp-2);margin:0;padding:var(--sp-3) var(--sp-4);border:1px solid transparent;border-radius:var(--r-sm);background:var(--row);font-size:var(--fs-label)}'
          '.adm-facts>div{display:flex;justify-content:space-between;gap:var(--sp-3)}.adm-facts dt{color:var(--ink-2)}.adm-facts dd{margin:0;font-weight:700;text-align:right}.adm-warn{display:inline-flex;align-items:center;gap:var(--sp-1h)}.adm-warn svg,.adm-st--warn svg{width:16px;height:16px}'
          '.adm-items{list-style:none;margin:var(--sp-3) 0 0;padding:0;display:flex;flex-direction:column;gap:var(--sp-2)}.adm-item{padding:var(--sp-3);border-radius:var(--r-sm);background:var(--row)}.adm-item p{margin:0 0 var(--sp-2)}'
          '.adm-item__act{display:flex;flex-wrap:wrap;gap:var(--sp-2)}.adm-new{font-weight:800;margin-right:var(--sp-1)}'
          '.adm__queues .phase__summary{display:flex;align-items:center;gap:var(--sp-3);cursor:pointer}.adm__queues .phase__heading{flex:1;min-width:0}.adm__queues .phase__summary>svg{flex:none;width:20px;height:20px}'
          '.adm-row__l{flex:1;min-width:0}.adm-row__n{white-space:nowrap}.adm-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)}')


def afr(label, theme, w, h, inner):
    return fr(label, theme, w, h, inner, AD_CSS)


def build_admin():
    old = tbl(['', 'Oggi (audit, 375 px)', 'Proposta (cornici sotto)'], [
        ['Altezza della pagina', '<b>circa 22.000 px</b>', 'tutte le code chiuse: <b>851 px</b> a 390 px; con una coda aperta (due suggerimenti) 1175 px; 807 px a 1280 px (misurato)'],
        ['Dove sta «Stato del sito» (online o manutenzione, attività, iscritti)', 'in fondo, dopo cinque sezioni', '<b>in testa</b>, accanto a «Da fare»'],
        ['Riepilogo in testa', 'nessuno', '«Da fare»: quattro righe con il conteggio, ognuna porta alla sua coda'],
        ['Pulsanti nelle code', '22 in «Contenuti da completare», 69 in «Date di uscita»', 'invariati dentro ogni coda, ma chiusa finché non serve'],
        ['Messaggio sul token TMDB', 'due volte (Nuovi titoli e Attività automatiche)', '<b>una volta</b>, nello Stato del sito'],
        ['Testo «Qui non si scrivono testi: copia il modello e compilalo nel codice»', 'oscuro', 'riscritto (vedi «Testi»)']])
    why = ('<b>1 · Una pagina in due livelli: cosa serve adesso e le code.</b> Oggi <code>/admin</code> è sette sezioni aperte una dopo l\'altra (circa 22.000 px su telefono, 22 pulsanti nei contenuti e 69 nelle date), con la domanda più importante, «il sito sta bene?», <b>in fondo</b>. '
           'Livello 1, in testa: <b>«Da fare»</b> (quattro righe: Nuovi titoli, Contenuti da completare, Date di uscita, Suggerimenti, ciascuna col suo numero e un\'icona di spunta quando non c\'è niente: un tocco apre la coda) e <b>«Stato del sito»</b> (online o manutenzione con il suo pulsante, le due attività automatiche con l\'esito, il token TMDB, gli iscritti). '
           'Livello 2: le <b>quattro code</b> come fisarmoniche chiuse (<code>.phase.card</code>, lo stesso componente delle fasi del Planner: titolo, riga di contesto <code>.phase__years</code>, numero, chevron). Con tutto chiuso la pagina è alta circa 850 px a 390 px (misurato: oggi circa 22.000 px secondo l\'audit). Il contenuto di ogni coda non cambia (stessi pulsanti, stessi popup). '
           '<b>Scartate:</b> (a) schede a tab («Titoli / Date / Suggerimenti / Sistema»): su telefono nascondono quante cose aspettano; (b) tenere tutto aperto con un indice in cima: la pagina resta lunga e l\'indice è un\'altra cosa da leggere; (c) una pagina per sezione: più rotte e più codice, per un\'area usata da una sola persona.')
    why2 = ('<b>2 · «Manutenzione», «Attività automatiche» e «Iscritti» non sono più tre sezioni.</b> Sono tre fatti piccoli (un interruttore, due esiti, tre numeri): stanno in un\'unica scheda «Stato del sito». Il pulsante «Attiva manutenzione» resta e apre la stessa conferma (<code>ConfirmDialog</code>, invariata). Quando qualcosa non va la scheda lo dice <b>con un\'icona e con le parole</b> («In ritardo», «Manutenzione attiva» con <code>triangle-alert</code>), non solo col colore: appare in testa senza dover scorrere. '
            'Il <b>token TMDB mancante</b> si dice una volta sola, qui («Token TMDB: Mancante»); nei «Nuovi titoli» la coda dice solo «Ricerca ferma: vedi lo Stato del sito» (<code>candidates.unreliable.noToken</code> si accorcia, vedi «Testi»).')
    why3 = ('<b>3 · Cosa non è deciso da Design.</b> L\'elenco «Date di uscita» ha 69 pulsanti: dentro la coda va mostrato <b>dieci per volta</b> come «Contenuti da completare» («Mostra altri 10», <code>todo.more</code>: esiste già). Le code aperte non ricordano il loro stato tra una visita e l\'altra (nessun nuovo dato in <code>localStorage</code>: il popup Preferenze privacy ne elenca tutti). Il conteggio dei «Contenuti» usa il numero già calcolato da <code>todo.summary</code>. Il tono dell\'amministrazione (nessun uso di colore come unico segnale) è lo stesso del resto del sito.')
    why4 = ('<b>4 · Su desktop.</b> «Da fare» e «Stato del sito» stanno affiancate (due colonne da 64 em), le code sotto, a tutta larghezza (fino a 72 rem). Nessuna colonna fissa.')
    import testi_admin as TA
    tx = tbl(['Chiave', 'Cosa', 'it', 'en', 'fr', 'es', 'de'], [[f'<code>{k}</code>', v['nota']] + [E(v[l]) for l in ('it', 'en', 'fr', 'es', 'de')] for k, v in TA.T.items()])
    rule = ('<pre><code>// AdminDashboard.tsx: nuovo ordine (il contenuto di ogni sezione resta quello di oggi)\n'
            '&lt;div className="admin"&gt;\n'
            '  &lt;h1 className="saga__title" …&gt;{t("admin.title")}&lt;/h1&gt;\n'
            '  &lt;div className="admin__top"&gt;&lt;AdminTodoSummary … /&gt;&lt;SiteStatus … /&gt;&lt;/div&gt;     // Da fare + Stato del sito (Manutenzione, Automazione e Utenti confluiscono qui)\n'
            '  &lt;div className="admin__queues"&gt;\n'
            '    &lt;AdminQueue id="candidati" title=… context=… count=…&gt;&lt;CandidatesSection … /&gt;&lt;/AdminQueue&gt;   // &lt;details className="phase card"&gt; come PhaseSection\n'
            '    …ContentTodoSection, ReleaseDatesSection (con «Mostra altri 10»), SuggestionsSection\n'
            '  &lt;/div&gt;\n'
            '&lt;/div&gt;\n\n'
            '// AdminDashboard.less\n'
            '.admin { display: flex; flex-direction: column; gap: var(--sp-4); max-width: 72rem; margin: 0 auto; }\n'
            '.admin__top { display: grid; gap: var(--sp-3); .desktop({ grid-template-columns: 1fr 1fr; align-items: start; }); }\n'
            '.admin__queues { display: flex; flex-direction: column; gap: var(--sp-2); }\n'
            '.admin-row { display: flex; align-items: center; gap: var(--sp-3); min-height: var(--hit); padding: var(--sp-1) var(--sp-3); border-radius: var(--r-sm); color: var(--ink); text-decoration: none; .tones(var(--row-hover), var(--row-press)); }\n'
            '.admin-row__n { margin-left: auto; display: inline-flex; align-items: center; gap: var(--sp-2); }   // «N da fare» in grassetto; «Niente da fare» .muted con Check\n'
            '.admin-facts { display: flex; flex-direction: column; gap: var(--sp-2); margin: 0; padding: var(--sp-3) var(--sp-4); border: 1px solid transparent; border-radius: var(--r-sm); background: var(--row); font-size: var(--fs-label); }\n'
            '.admin-facts &gt; div { display: flex; justify-content: space-between; gap: var(--sp-3); } .admin-facts dt { color: var(--ink-2); } .admin-facts dd { margin: 0; font-weight: 700; text-align: right; }</code></pre>'
            + ul(['Nessun valore nuovo. Le code riusano <code>.phase.card</code> (<code>PhaseSection.less</code>), il pulsante «Mostra altri 10» (<code>todo.more</code>) e <code>ConfirmDialog</code> per la manutenzione: <b>nessun componente nuovo</b> oltre a tre piccoli blocchi (riga di «Da fare», scheda dei fatti, riga di stato).',
                  'Una riga di «Da fare» è un link verso la coda (<code>#candidati</code>…): il <code>hash</code> <code>#candidati</code> c\'è già (<code>AdminDashboard.tsx</code> r.~47): la coda si apre quando l\'hash la nomina. Aperta o chiusa non si salva (nessun dato nuovo).',
                  '<b>Test:</b> la logica non cambia; se si estrae una funzione per i conteggi di «Da fare» (<code>buildAdminTitles</code>, <code>todo.summary</code> li calcolano già), un test del conteggio. Verifica a mano a 390 e 1280 px, chiaro e scuro, in tutti gli stati (sito online, manutenzione, attività in ritardo, token mancante, nessuna cosa da fare), tastiera (Tab nelle fisarmoniche, Invio apre).',
                  '<b>Testi nuovi:</b> tutti in <code>docs/design/TESTI_ADMIN.md</code> (cinque lingue), scritti con <code>scrittura-ux</code>.']))
    pd = tbl(['Cosa', 'Prima', 'Dopo', 'File'], [
        ['Struttura', 'sette sezioni aperte in colonna', '«Da fare» + «Stato del sito» in testa, quattro code a fisarmonica chiuse', 'AdminDashboard.tsx r.40-66'],
        ['Stato del sito', 'in fondo: Manutenzione, Attività automatiche, Iscritti in tre sezioni', 'una scheda in testa', 'MaintenanceSection, AutomationSection, UsersSection'],
        ['Token TMDB mancante', 'detto due volte', 'detto una volta (Stato del sito)', 'CandidatesSection.tsx; AutomationSection.tsx; <code>candidates.unreliable.noToken</code>'],
        ['Date di uscita', 'tutte le righe, 69 pulsanti', 'dieci per volta, «Mostra altri 10»', 'ReleaseDatesSection.tsx'],
        ['Testo «Qui non si scrivono testi…»', 'oscuro', 'riscritto', '<code>admin.todo.intro</code>']])
    frames = col(sc(row(afr('Proposta · 390 px · tutto chiuso · chiaro', 'light', 390, 690, admin_page()), afr('Proposta · 390 px · coda aperta · scuro', 'dark', 390, 690, admin_page(opened=True)),
                        afr('Proposta · 390 px · qualcosa non va · chiaro', 'light', 390, 690, admin_page(problem=True, maint=True)))),
                 sc(row(afr('Proposta · 1280 px · chiaro', 'light', 1100, 760, admin_page(opened=True)), afr('Proposta · 1280 px · tutto a posto · scuro', 'dark', 1100, 700, admin_page(empty=True)))))
    return (f'<div class="dc-sec"><h2 class="dc-h2">Decisione · Admin: «Da fare» e «Stato del sito» in testa, code a fisarmonica (voce 30, P9)</h2><div>{PROP}</div>'
            '<p class="dc-sub">Riferimento: <code>AdminDashboard.tsx</code> e le sezioni di 4bfbea4 (letti con <code>git show</code>; <b>4bfbea4 non è su <code>main</code></b>) e l\'audit del 20 novembre (P9: circa 22.000 px su telefono, 22 e 69 pulsanti). Le cornici sono un disegno della struttura con le classi vere (<code>.card</code>, <code>.phase</code>, <code>.btn</code>) e dati di prova; il contenuto delle code non è ridisegnato (resta quello di <code>Admin.dc.html</code>). <b>Non verificato:</b> la pagina vera con dati veri, Safari, Firefox.</p>'
            + box('Scelta · raccomandazione e alternative per punto', f'<p>{why}</p><p>{why2}</p><p>{why3}</p><p>{why4}</p>')
            + sec('Oggi e proposta, in numeri', 'Oggi dai numeri dell\'audit; la proposta dalle cornici.', f'<div class="dc-scroll">{old}</div>')
            + sec('Proposta · stati', 'Tutto chiuso, una coda aperta, qualcosa non va (attività in ritardo e manutenzione attiva), tutto a posto.', frames)
            + sec('Testi', 'Scritti con la skill <code>scrittura-ux</code> (cinque lingue). Cambia anche <code>admin.todo.intro</code> («Qui non si scrivono testi…») e si accorcia <code>candidates.unreliable.noToken</code>.', f'<div class="dc-scroll">{tx}</div>')
            + sec('Regola per Code', 'Il prompt completo è in <code>docs/design/PROMPT_CODE_FOOTER_ADMIN.md</code>.', rule)
            + sec('Prima, dopo, file', '', pd) + '</div>')


def insert(page, marker, build_fn, force=False):
    p = os.path.join(CANVAS, page + '.dc.html')
    t = open(p, encoding='utf-8', newline='').read()
    if marker in t:
        if not force:
            print(page, ': già inserito (usa --force)')
            return
        i = t.index('<div class="dc-sec"><h2 class="dc-h2">' + marker)
        j = t.index('\n</div>\n</x-dc>')
        nxt = t.find('<div class="dc-sec"><h2 class="dc-h2">', i + 10)
        t = (t[:i] + t[nxt:]) if (nxt != -1 and nxt < j) else (t[:i].rstrip('\n') + t[j:])
    end = '\n</div>\n</x-dc>'
    assert t.count(end) == 1, page
    open(p, 'w', encoding='utf-8', newline='').write(t.replace(end, '\n' + build_fn() + end, 1))
    print('ok', page)


if __name__ == '__main__':
    f = '--force' in sys.argv
    insert('Navigation', 'Decisione · piè di pagina:', build_footer, f)
    insert('Admin', 'Decisione · Admin: «Da fare» e «Stato del sito» in testa', build_admin, f)
