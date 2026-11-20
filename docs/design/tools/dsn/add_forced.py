"""Blocco della pagina «Accessibility»: contrasto forzato (voce 28, F1).
`python add_forced.py` scrive i documenti di prova in $TEMP/sc (ff_*.html), inserisce il blocco in canvas/Accessibility.dc.html
(una volta; --force lo sostituisce). Le immagini (canvas/assets/forzato-*.png) le fa `forced_shots.js` con l'emulazione
`forcedColors: active` di Chromium. Scritto a mano: una rigenerazione di p_a11y.py lo cancella.
CUR_CSS = forced-colors.less di 4bfbea4 (il CSS del canvas non lo include); PROP_CSS = la proposta."""
import sys, os
import html as _h
from add_pc_lib import *
from parts import btn

CUR_CSS = '''@media (forced-colors: active) {
  .floating-progress,.compact-progress,.toast,.card,.film__card,dialog.dialog,dialog.filters-sheet,dialog.menu-panel,.select-field--popover .select-field__list { border: 1px solid CanvasText; }
  .planner-search__field,.field__control input,.field__control textarea,.select-field__trigger { border: 1px solid ButtonBorder; }
  :focus-visible,.planner-search__field:focus-within { outline-color: Highlight; }
  progress,.floating-progress progress,.compact-progress progress { forced-color-adjust: none; background: Canvas; outline: 1px solid CanvasText; }
  progress::-webkit-progress-bar { background: Canvas; }
  progress::-webkit-progress-value { background: Highlight; }
  .title-row__box { forced-color-adjust: none; border-color: ButtonText; background: Canvas; }
  .title-row__check input:checked + .title-row__box { border-color: Highlight; background: Highlight; color: HighlightText; }
  .title-row__check input:indeterminate + .title-row__box { border-color: ButtonText; background: Canvas; color: CanvasText; }
}'''

PROP_CSS = '''@media (forced-colors: active) {
  /* fascia e legenda: tre stati, tre forme (pieno, vuoto con bordo spesso e triangolo, vuoto) */
  .phase-strip__cell, .phase-strip__swatch { forced-color-adjust: none; box-sizing: border-box; border: 1px solid ButtonText; background: Canvas; color: CanvasText; }
  .phase-strip__cell--watched { background: Highlight; border-color: Highlight; color: HighlightText; }
  .phase-strip__cell--next { border: 2px solid Highlight; }
  /* pulsanti: pieni (azione), con contorno (secondari), sottolineati (testo) */
  .btn:not(.btn--text) { border: 1px solid ButtonText; }
  .btn--primary, .btn--accent, .btn--ink, .btn--dark, .btn--danger { forced-color-adjust: none; background: ButtonText; color: ButtonFace; }
  .btn--soft, .btn--surface, .btn--panel { background: ButtonFace; color: ButtonText; }
  .btn:disabled, .btn[aria-disabled="true"]:not([aria-busy="true"]) { forced-color-adjust: none; background: ButtonFace; color: GrayText; border: 1px dashed GrayText; }
  @media (hover: hover) and (pointer: fine) {
    .btn:not(.btn--text):hover:not(:disabled):not([aria-disabled="true"]) { forced-color-adjust: none; background: Highlight; color: HighlightText; border-color: Highlight; }
  }
  /* scelte e interruttori */
  .choice__face { border: 1px solid ButtonText; }
  .choice__input:checked + .choice__face { forced-color-adjust: none; background: Highlight; color: HighlightText; border-color: Highlight; }
  .switch__track { forced-color-adjust: none; box-sizing: border-box; border: 2px solid ButtonText; background: Canvas; }
  .switch__track::after { background: ButtonText; }
  .switch__input:checked + .switch__track { background: Highlight; border-color: Highlight; }
  .switch__input:checked + .switch__track::after { background: HighlightText; }
  /* biglietto, pillola dell'account, avatar */
  .share-poster, .account-pill { border: 1px solid CanvasText; }
  .avatar { forced-color-adjust: none; background: Canvas; color: CanvasText; border: 1px solid CanvasText; }
}'''

TMP = os.environ.get('TEMP', '/tmp') + '/sc'


def cells(n, w, nx, tod):
    out = '<span class="phase-strip__cell phase-strip__cell--watched"></span>' * w
    out += ('<span class="phase-strip__cell phase-strip__cell--next">' + icon('play') + '</span>') * nx
    out += '<span class="phase-strip__cell phase-strip__cell--todo"></span>' * tod
    return out


def showcase(theme, forced_css=''):
    tok = open(os.path.join(CANVAS, 'tokens.css'), encoding='utf-8').read() + open(os.path.join(CANVAS, 'app.css'), encoding='utf-8').read()
    swatch = lambda s: f'<li><span class="phase-strip__swatch phase-strip__cell--{s}">' + (icon('play') if s == 'next' else '') + '</span>' + {'watched': 'Visti', 'next': 'Prossimo', 'todo': 'Da vedere'}[s] + '</li>'
    strip = ('<section class="phase-strip card"><div class="phase-strip__header"><h2 class="section-title">Fascia e legenda</h2>'
             f'<ul class="phase-strip__legend muted" aria-hidden="true">{swatch("watched")}{swatch("next")}{swatch("todo")}</ul></div>'
             '<div class="fs-col"><div class="phase-strip__phase"><div class="phase-strip__cells" aria-hidden="true">' + cells(6, 5, 1, 0) + '</div><div class="phase-strip__label"><span class="phase-strip__name">Telefono · 24 px</span><span>5 di 6</span></div></div>'
             '<div class="phase-strip__phase desk"><div class="phase-strip__cells" aria-hidden="true">' + cells(12, 4, 1, 7) + '</div><div class="phase-strip__label"><span class="phase-strip__name">Desktop · 32 px</span><span>4 di 12</span></div></div>'
             '<div class="phase-strip__phase desk"><div class="phase-strip__cells" aria-hidden="true">' + cells(40, 20, 1, 19) + '</div><div class="phase-strip__label"><span class="phase-strip__name">Celle strette · 8 px</span><span>20 di 40</span></div></div></div></section>')
    B = lambda v, t, size='lg', ic=None, attrs='': btn(v, t, size, '', ic, attrs)
    row = lambda *x: '<div class="fs-row">' + ''.join(x) + '</div>'
    buttons = ('<section class="card"><h2 class="section-title">Pulsanti</h2>'
               + row(B('primary', 'Primario'), B('accent', 'Accento'), B('ink', 'Ink'), B('danger', 'Pericolo'))
               + row(B('soft', 'Soft'), B('surface', 'Surface'), B('text', 'Testo', 'sm'), B('soft', '', 'lg btn--icon', 'settings', 'aria-label="Impostazioni"'))
               + row(B('primary', 'Disattivato', 'lg', None, 'disabled'), B('soft', 'Disattivato', 'lg', None, 'disabled'), B('primary', 'In corso', 'lg', None, 'aria-busy="true"'))
               + '<div class="card card--panel on-panel fs-row">' + B('panel', 'Panel') + B('dark', 'Dark') + B('accent', 'Accento') + '</div></section>')
    choice = lambda t, c='': f'<label class="choice"><input class="choice__input" type="radio" name="o"{c}><span class="choice__face">{t}</span></label>'
    sw = lambda t, c='': f'<div class="switch"><span>{t}</span><label class="switch__control"><input class="switch__input" type="checkbox" role="switch"{c} aria-label="{t}"><span class="switch__track" aria-hidden="true"></span></label></div>'
    ctrl = ('<section class="card"><h2 class="section-title">Scelte e interruttori</h2><div class="fs-row">' + choice('Per uscita', ' checked') + choice('Cronologico') + '</div>'
            + sw('Mostra continuità alternativa', ' checked') + sw('Mostra i non ancora usciti') + '</section>')
    acc = ('<section class="card fs-row"><button type="button" class="account-pill"><span class="avatar" aria-hidden="true">D</span><span>Diego</span></button>'
           '<div class="share-poster" style="width:11rem"><span>Condividi il tuo planner</span></div></section>')
    css = ('body{margin:0;padding:12px;background:var(--bg);color:var(--ink);font-family:var(--font-body);font-size:var(--fs-body);line-height:1.5;width:496px}'
           'body>section{margin-bottom:var(--sp-3)}.fs-row{display:flex;flex-wrap:wrap;gap:var(--sp-2);align-items:center;margin-top:var(--sp-3)}.fs-col{display:flex;flex-direction:column;gap:var(--sp-3)}'
           '.desk .phase-strip__cell{flex:1 0 8px;width:auto;height:32px}.desk .phase-strip__cells{flex-wrap:nowrap}'
           '.phase-strip__cells svg{fill:currentColor;stroke:none}.phase-strip__cell--next svg{fill:currentColor;stroke:none}'
           '.fs-row .choice{flex:1}.card--panel{padding:var(--sp-3)}.switch{display:flex;justify-content:space-between;align-items:center;min-height:3rem}')
    return f'<!doctype html><html lang="it" data-theme="{theme}"><head><meta charset="utf-8"><meta name="viewport" content="width=520"><style>{tok}{css}{forced_css}</style></head><body>{strip}{buttons}{ctrl}{acc}</body></html>'


def write_docs():
    os.makedirs(TMP, exist_ok=True)
    open(f'{TMP}/ff_css_cur.css', 'w', encoding='utf-8').write(CUR_CSS)
    open(f'{TMP}/ff_css_prop.css', 'w', encoding='utf-8').write(PROP_CSS)
    for th in ('light', 'dark'):
        open(f'{TMP}/ff_{th}_prima.html', 'w', encoding='utf-8').write(showcase(th, CUR_CSS))
        open(f'{TMP}/ff_{th}_dopo.html', 'w', encoding='utf-8').write(showcase(th, CUR_CSS + PROP_CSS))
        open(f'{TMP}/ff_{th}_normale.html', 'w', encoding='utf-8').write(showcase(th, ''))


def build():
    prop = tag('proposta · non implementata', 'k2')
    img = lambda f, cap, alt, w=520: (f'<div class="dc-fw"><div class="dc-fl">{cap}</div><img src="assets/{f}" alt="{_h.escape(alt)}" width="{w}" style="display:block;max-width:100%;border-radius:var(--r-md)"></div>')
    sc = lambda x: f'<div class="dc-scroll">{x}</div>'
    pl = lambda f, cap, alt: img(f, cap, alt, 540)
    comp = ('<div class="dc-row">' + img('forzato-chiaro-prima.png', 'Oggi · contrasto forzato · tavolozza chiara', 'Componenti in contrasto forzato oggi: celle della fascia invisibili, pulsanti senza forma') +
            img('forzato-chiaro-dopo.png', 'Proposta · tavolozza chiara', 'Componenti in contrasto forzato con la proposta: celle piene, vuote con triangolo e vuote; pulsanti pieni e con contorno') + '</div>'
            '<div class="dc-row">' + img('forzato-scuro-prima.png', 'Oggi · tavolozza scura', 'Componenti in contrasto forzato oggi con tavolozza scura') +
            img('forzato-scuro-dopo.png', 'Proposta · tavolozza scura', 'Componenti in contrasto forzato con la proposta e tavolozza scura') + '</div>')
    page = ('<div class="dc-row">' + img('forzato-planner-d-prima.png', 'Planner · desktop · oggi (tavolozza scura)', 'Planner in contrasto forzato oggi', 540) +
            img('forzato-planner-d-dopo.png', 'Planner · desktop · proposta', 'Planner in contrasto forzato con la proposta', 540) + '</div>'
            '<div class="dc-row">' + img('forzato-planner-m-prima.png', 'Planner · 390 px · oggi (tavolozza chiara)', 'Planner mobile in contrasto forzato oggi', 390) +
            img('forzato-planner-m-dopo.png', 'Planner · 390 px · proposta', 'Planner mobile in contrasto forzato con la proposta', 390) + '</div>')
    T = tbl(['Elemento', 'Stato', 'Oggi (colori normali)', 'Oggi in contrasto forzato', 'Proposta, solo colori di sistema', 'Cosa lo distingue'], [
        ['Cella della fascia e legenda', 'visto', '<code>--highlight</code> pieno', 'sparisce', 'pieno <code>Highlight</code>', '<b>forma</b>: pieno'],
        ['', 'prossimo', '<code>--accent</code> pieno con triangolo', 'resta solo il triangolo', 'vuoto, bordo <b>2 px</b> <code>Highlight</code>, triangolo', '<b>forma</b>: bordo spesso + triangolo (già nel codice)'],
        ['', 'da vedere', '<code>--disabled</code> pieno', 'sparisce', 'vuoto, bordo 1 px <code>ButtonText</code>', '<b>forma</b>: vuoto, bordo sottile'],
        ['Pulsanti pieni (primario, accento, ink, dark, pericolo)', 'a riposo', 'fondo colorato', 'testo semplice', 'pieno <code>ButtonText</code>, testo <code>ButtonFace</code>', 'riempimento + contorno'],
        ['Pulsanti secondari (soft, surface, panel)', 'a riposo', 'fondo chiaro / scuro', 'testo semplice', 'contorno 1 px <code>ButtonText</code>, fondo <code>ButtonFace</code>', 'contorno'],
        ['Pulsante di testo', 'a riposo', 'rosso sottolineato', 'sottolineato (già)', 'invariato: sottolineato (<code>LinkText</code>)', 'sottolineatura'],
        ['Pulsanti', 'disattivato', 'fondo <code>--disabled</code>', 'testo semplice', 'contorno <b>tratteggiato</b> e testo <code>GrayText</code>', '<b>forma</b>: tratteggio (non solo la tinta di <code>GrayText</code>)'],
        ['Pulsanti', 'mouse sopra', 'tono più scuro', 'nessuno', 'pieno <code>Highlight</code>, testo <code>HighlightText</code>', 'inversione (solo con mouse)'],
        ['Scelta (chip) di <code>ChoiceGroup</code>', 'selezionata', '<code>--ink</code> pieno', '<b>indistinguibile dalle altre</b>', 'pieno <code>Highlight</code>', 'riempimento (le altre: contorno)'],
        ['Interruttore', 'acceso / spento', 'binario rosso / grigio, tondino', 'invisibile', 'binario con bordo 2 px: acceso pieno <code>Highlight</code>, tondino <code>HighlightText</code>; spento vuoto, tondino <code>ButtonText</code>', 'riempimento + posizione del tondino (già)'],
        ['Biglietto, pillola account', '—', 'fondo giallo / scuro', 'nessun contorno', 'contorno 1 px <code>CanvasText</code>', 'contorno'],
        ['Avatar', '—', 'cerchio giallo con iniziale', 'iniziale senza cerchio', 'cerchio con contorno <code>CanvasText</code>', 'contorno']])
    why = ('<b>1 · Tre stati, tre forme: pieno, vuoto con bordo spesso e triangolo, vuoto.</b> Senza colori l\'informazione sta nella forma (WCAG 1.4.1). <b>Visto</b> è pieno di <code>Highlight</code>; <b>prossimo</b> è vuoto con bordo da 2 px e il triangolo che il codice già ha; <b>da vedere</b> è vuoto con bordo da 1 px. '
           'Funziona anche in un tema a due colori (bianco su nero): pieno contro vuoto non dipende dalla tinta. La legenda usa le stesse classi (<code>.phase-strip__swatch</code>): stessi segni nelle due posizioni, e il testo «Visti / Prossimo / Da vedere» c\'è già. '
           '<b>Scartate:</b> (a) tratteggio per «da vedere»: nelle celle da 8 px (fascia con 40 titoli) non si legge; (b) un segno di spunta nelle celle viste: cambierebbe anche i colori normali (le celle oggi sono piene senza icona) per un problema che esiste solo in questa modalità; (c) un motivo a righe con un gradiente: serve un\'immagine e non è un colore di sistema.')
    why2 = ('<b>2 · Pulsanti: pieni, con contorno, sottolineati.</b> Oggi in contrasto forzato <code>.btn</code> non ha bordo (<code>border: 0</code>) e il fondo viene sostituito dal fondo di pagina: sembra testo. I pieni (primario, accento, ink, dark, pericolo) prendono <code>ButtonText</code> con testo <code>ButtonFace</code>; i secondari (soft, surface, panel) un contorno da 1 px; il pulsante di testo resta sottolineato. La gerarchia (azione principale contro secondaria) si legge, come nei colori normali. '
            '<b>Limite dichiarato:</b> primario, accento e pericolo sono lo stesso pulsante pieno: li distingue solo l\'etichetta (che deve dire già l\'azione), non il colore. Disattivato: contorno <b>tratteggiato</b> e testo <code>GrayText</code> (non solo la tinta: cambia la forma); col mouse sopra, inversione in <code>Highlight</code>. Il focus resta l\'anello di sistema (<code>:focus-visible</code> è già in <code>Highlight</code>).')
    why3 = ('<b>3 · Stessa regola per le scelte, gli interruttori e le superfici</b> (stesso difetto, più grave: l\'informazione di stato sparisce). Nelle immagini del Planner di oggi non si vede quale tra «Per uscita» e «Cronologico» è selezionato, né se un interruttore è acceso: stato affidato al solo fondo. Scelta selezionata = piena di <code>Highlight</code>; interruttore con bordo e riempimento; biglietto «Condividi», pillola dell\'account e avatar con un contorno da 1 px. '
            'Le schede, i popup, i campi e le caselle dei titoli hanno già il contorno (<code>forced-colors.less</code>): invariati.')
    rule = ('<pre><code>// src/styles/forced-colors.less: aggiungere dentro il blocco @media (forced-colors: active) esistente (non toccare le regole che ci sono)\n\n'
            + _h.escape(PROP_CSS.replace('@media (forced-colors: active) {\n', '').rstrip('}').replace('\n  ', '\n').strip() + '\n')
            + '</code></pre>'
            + ul(['Nessun valore nuovo e nessun cambiamento ai colori normali: tutto vive in <code>@media (forced-colors: active)</code>, che <code>forced-colors.less</code> importa per ultimo (vince a parità di specificità). Solo <b>colori di sistema</b>: <code>Canvas</code>, <code>CanvasText</code>, <code>ButtonFace</code>, <code>ButtonText</code>, <code>Highlight</code>, <code>HighlightText</code>, <code>GrayText</code>.',
                  '<code>forced-color-adjust: none</code> solo dove serve un riempimento che il browser toglierebbe (celle, pulsanti pieni, scelta selezionata, interruttore, avatar): in quei punti si scelgono noi i colori di sistema, <b>mai</b> un colore del tema.',
                  'Le classi vere (4bfbea4): <code>PhaseStrip.less</code> r.96-145 (<code>.phase-strip__cell</code> r.96, <code>.phase-strip__swatch</code> r.106, <code>--watched</code> r.125, <code>--next</code> r.130, <code>--todo</code> r.140), <code>Button.less</code> (<code>.btn</code>, <code>.btn--*</code>), <code>ChoiceGroup.less</code> r.50 e r.72, <code>Switch.less</code> r.35 e r.55, <code>PlannerSummary.less</code> r.95 (<code>.share-poster</code>), <code>AccountMenu.less</code> r.9 (<code>.account-pill</code>) e r.28 (<code>.avatar</code>). <b>Attenzione alla specificità:</b> <code>.on-panel .choice__input:checked + .choice__face</code> (<code>ChoiceGroup.less</code> r.83-94) e <code>.filters-card .choice__face</code> (<code>PlannerFilters.less</code> r.18) sono più specifici delle regole qui sopra: se vincono, la scelta selezionata prende colori che non sono di sistema; ripeti la regola con quei prefissi.',
                  '<b>Prova:</b> in Chromium con DevTools, Rendering, «Emulate CSS media feature forced-colors: active», e poi su Windows con un tema ad alto contrasto vero (Aquatic, Desert, Night sky, tema bianco e nero). Chiaro e scuro; 390 e 1280 px.',
                  '<b>Test:</b> nessun test di componente nel progetto. <b>DESIGN.md:</b> una riga in «Deviazioni»: «Contrasto forzato | forced-colors.less | stati e pulsanti con soli colori di sistema (fascia, pulsanti, scelte, interruttori, avatar) | voce 28 di HANDOFF §2».']))
    pd = tbl(['Cosa', 'Prima', 'Dopo', 'File'], [
        ['Fascia delle fasi e legenda', 'celle e pallini invisibili (resta il triangolo)', 'pieno / vuoto con bordo spesso e triangolo / vuoto', 'forced-colors.less (da PhaseStrip.less r.101-125)'],
        ['Pulsanti', 'sembrano testo', 'pieni, con contorno, sottolineati; disattivati con contorno tratteggiato', 'forced-colors.less (da Button.less)'],
        ['Scelta selezionata', 'indistinguibile', 'piena di <code>Highlight</code>', 'forced-colors.less'],
        ['Interruttori', 'invisibili', 'bordo + riempimento', 'forced-colors.less'],
        ['Biglietto, pillola, avatar', 'senza contorno', 'contorno 1 px', 'forced-colors.less']])
    return (f'<div class="dc-sec"><h2 class="dc-h2">Decisione · contrasto forzato: stati e pulsanti con soli colori di sistema (voce 28, F1)</h2><div>{prop}</div>'
            '<p class="dc-sub">Riferimento: <code>forced-colors.less</code> di 4bfbea4 (il CSS del canvas non lo include: nelle immagini «oggi» lo aggiungo io, così la prova è quello che fa l\'app). Immagini fatte con l\'emulazione <code>forcedColors: active</code> di Chromium con le palette chiara e scura di Chromium, sulle classi vere del canvas. <b>Non verificato:</b> su Windows con un tema ad alto contrasto vero (le tinte di <code>Highlight</code> e <code>GrayText</code> cambiano da tema a tema), Firefox, il mouse sopra (regola disegnata, non provata a vista), l\'«Aumenta contrasto» di macOS (è un\'altra funzione, non <code>forced-colors</code>).</p>'
            + box('Scelta · raccomandazione e alternative per punto', f'<p>{why}</p><p>{why2}</p><p>{why3}</p>')
            + sec('I componenti, oggi e con la proposta', 'Fascia a tre larghezze (24, 32 e 8 px), legenda, pulsanti (tutte le varianti, disattivato e in corso), scelte, interruttori, pillola dell\'account, avatar e biglietto. Tavolozza chiara e scura.', sc(comp))
            + sec('Il Planner, oggi e con la proposta', 'Le stesse regole sulla pagina vera: desktop in tavolozza scura, telefono in chiara.', sc(page))
            + sec('Stato per stato', 'Cosa distingue ogni stato quando i colori non ci sono.', f'<div class="dc-scroll">{T}</div>')
            + sec('Regola per Code', 'Il prompt completo è in <code>docs/design/PROMPT_CODE_FORZATO.md</code>.', rule)
            + sec('Prima, dopo, file', '', pd) + '</div>')


def insert(page, marker, build_fn, force=False):
    p = os.path.join(CANVAS, page + '.dc.html')
    t = open(p, encoding='utf-8', newline='').read()
    if marker in t:
        if not force:
            raise SystemExit(page + ': già inserito (usa --force)')
        i = t.index('<div class="dc-sec"><h2 class="dc-h2">' + marker)
        j = t.index('\n</div>\n</x-dc>')
        nxt = t.find('<div class="dc-sec"><h2 class="dc-h2">', i + 10)
        t = (t[:i] + t[nxt:]) if (nxt != -1 and nxt < j) else (t[:i].rstrip('\n') + t[j:])
    end = '\n</div>\n</x-dc>'
    assert t.count(end) == 1
    open(p, 'w', encoding='utf-8', newline='').write(t.replace(end, '\n' + build_fn() + end, 1))
    print('ok', page)


if __name__ == '__main__':
    write_docs()
    if '--docs' in sys.argv:
        print('docs scritti in', TMP)
    else:
        insert('Accessibility', 'Decisione · contrasto forzato: stati e pulsanti', build, force='--force' in sys.argv)
