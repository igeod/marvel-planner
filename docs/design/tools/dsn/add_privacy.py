"""Blocco della pagina «Popup generici»: Preferenze privacy, scheda per voce e cancellazione (voce 25).
Scritto a mano nel canvas: `python add_privacy.py` lo inserisce una volta sola (con --force lo sostituisce).
Una rigenerazione di p_dialogs.py lo cancella. Testi: da locales_privacy.json (cookiePage e privacySettings
dei cinque file di lingua di main 4bfbea4). Misure: Playwright (Chromium), vedi la tabella «Misure» nel blocco."""
import sys, re, json
import html as _h
from add_pc_lib import *
from parts import btn

P = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'locales_privacy.json'), encoding='utf-8'))
INV = [('session', 'better-auth.session_token'), ('progress', 'mcu-planner-v1'), ('language', 'mcu-planner-language'), ('filters', 'mcu-planner-filters'),
       ('viewOrder', 'mcu-planner-view-order'), ('theme', 'mcu-planner-theme'), ('completedSeen', 'mcu-planner-completed-seen'), ('sound', 'mcu-planner-sound'),
       ('guideSeen', 'mcu-planner-guide-seen'), ('preferences', 'mcu-planner-preferences')]
def scrolls(f):
    return f'<div class="dc-scroll">{f}</div>'


E = lambda s: _h.escape(s, quote=False)

# --- CSS: oggi (StorageTable.less, PrivacySettingsDialog.less) e proposta ---------------------------
CSS_CUR = ('.storage-table{width:100%;border-collapse:separate;border-spacing:0 4px;font-size:var(--fs-label)}.storage-table th,.storage-table td{padding:var(--sp-2h) .75rem;text-align:left;vertical-align:top}'
           '.storage-table thead th{color:var(--ink-2)}.storage-table tbody tr{background:var(--row-hover)}.storage-table tbody th{border-radius:var(--r-sm) 0 0 var(--r-sm);overflow-wrap:anywhere}'
           '.storage-table tbody td:last-child{border-radius:0 var(--r-sm) var(--r-sm) 0}.storage-table caption{padding-bottom:.5rem;text-align:left;font-weight:700}.scroll-x{overflow-x:auto}'
           '.privacy-confirm{display:flex;flex-wrap:wrap;align-items:center;gap:.5rem}.privacy-confirm p{flex-basis:100%}')
CSS_NEW = ('.dialog__body section{display:flex;flex-direction:column;gap:var(--sp-3)}.dialog__body section+section{margin-top:var(--sp-2)}.storage-list{margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:var(--sp-2)}'
           '.storage-card{display:flex;flex-direction:column;gap:var(--sp-1h);padding:var(--sp-3h) var(--sp-4);border:1px solid transparent;border-radius:var(--r-sm);background:var(--row);font-size:var(--fs-label)}'
           '.storage-card p{margin:0}.storage-card__name{font-weight:700;overflow-wrap:break-word}'
           '.storage-card dl{display:grid;grid-template-columns:auto 1fr;gap:2px var(--sp-3);margin:var(--sp-1) 0 0;color:var(--ink-2)}.storage-card dl>div{display:contents}.storage-card dd{margin:0}'
           '.privacy-confirm{display:flex;flex-direction:column;flex-wrap:nowrap;align-items:stretch;gap:var(--sp-3)}.privacy-confirm p{margin:0;flex-basis:auto}'
           '.dialog__actions{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:.5rem}@media (max-width:39.9375em){.dialog__actions{flex-direction:column;flex-wrap:nowrap}.dialog__actions .btn{width:100%}}')
FRAME = ('body{padding:0;background:var(--bg)}dialog.dialog{margin:0!important}.dialog__scroll{scrollbar-gutter:auto}')
WIDE = 'dialog.dialog{width:560px;max-width:560px}body{padding:16px}'   # desktop: il popup md è 35rem (Modal.less)
EXPAND = 'dialog.dialog,.dialog__scroll{max-height:none!important}'
# scorre fino a un punto del popup (gli iframe mostrano il pezzo che serve)
def JS(sel=None, bottom=False):
    if bottom:
        return 'document.fonts.ready.then(function(){var s=document.querySelector(".dialog__scroll");s.scrollTop=s.scrollHeight})'
    return f'document.fonts.ready.then(function(){{var s=document.querySelector(".dialog__scroll"),t=document.querySelector("{sel}");s.scrollTop=t.getBoundingClientRect().top-s.getBoundingClientRect().top+s.scrollTop-56}})'


def txt(l, k):
    a, b = k.split('.', 1) if '.' in k else (k, None)
    v = P[l][a]
    for part in (b.split('.') if b else []):
        v = v[part]
    return E(v)


def table(l):
    C = lambda *k: txt(l, 'cookiePage.' + '.'.join(k))
    head = ''.join(f'<th scope="col">{C("columns", c)}</th>' for c in ['name', 'kind', 'purpose', 'duration'])
    rows = ''.join(f'<tr><th scope="row"><code>{n}</code></th><td>{C(i, "kind")}</td><td>{C(i, "purpose")}</td><td>{C(i, "duration")}</td></tr>' for i, n in INV)
    return (f'<div class="storage-table__scroll scroll-x" role="region" aria-label="{C("tableCaption")}" tabindex="0"><table class="storage-table"><caption>{C("tableCaption")}</caption>'
            f'<thead><tr>{head}</tr></thead><tbody>{rows}</tbody></table></div>')


def cards(l):
    C = lambda *k: txt(l, 'cookiePage.' + '.'.join(k))
    rows = ''.join(f'<li class="storage-card"><code class="storage-card__name">{n}</code><p>{C(i, "purpose")}</p>'
                   f'<dl><div><dt>{C("columns", "kind")}</dt><dd>{C(i, "kind")}</dd></div><div><dt>{C("columns", "duration")}</dt><dd>{C(i, "duration")}</dd></div></dl></li>' for i, n in INV)
    return f'<ul class="storage-list" aria-labelledby="privacy-stored">{rows}</ul>'


def clear_ui(l, confirm, new):
    T = lambda k: txt(l, 'privacySettings.' + k)
    if confirm:
        q = PT(l, 'clearQuestion') if new else T('clearQuestion')
        if new:
            return (f'<div class="privacy-confirm"><p role="alert">{q}</p><div class="dialog__actions">{btn("soft", E(P[l]["common"]["cancel"]))}{btn("danger", PT(l, "clearConfirm"))}</div></div>')
        return (f'<div class="privacy-confirm" role="alert"><p>{T("clearQuestion")}</p>{btn("soft", E(P[l]["common"]["cancel"]))}{btn("danger", T("clearConfirm"))}</div>')
    b = btn('soft', T('clearButton'), '', '', 'trash-2')
    return f'<div class="dialog__actions">{b}</div>' if new else b


def PT(l, k):
    return E(P[l]['proposed'][k])


def body(l, new, confirm=False):
    C = lambda k: txt(l, 'cookiePage.' + k)
    T = lambda k: txt(l, 'privacySettings.' + k)
    if not new:   # oggi: PrivacySettingsDialog.tsx r.28-60
        return (f'<p>{T("intro")}</p><section aria-labelledby="privacy-consent"><h3 id="privacy-consent">{C("noBannerHeading")}</h3><p>{C("noBannerBody")}</p></section>'
                f'<section aria-labelledby="privacy-stored"><h3 id="privacy-stored">{C("intro")}</h3>{table(l)}</section>'
                f'<section aria-labelledby="privacy-manage"><h3 id="privacy-manage">{C("manageHeading")}</h3><p>{C("manageBody")}</p></section>'
                f'<section aria-labelledby="privacy-clear"><h3 id="privacy-clear">{T("clearHeading")}</h3><p>{T("clearBody")}</p>{clear_ui(l, confirm, False)}</section>')
    # proposta: tre sezioni, testi riscritti con scrittura-ux (locales_privacy.json, chiave 'proposed')
    return (f'<section aria-labelledby="privacy-consent"><h3 id="privacy-consent">{C("noBannerHeading")}</h3><p>{PT(l, "noBannerBody")}</p></section>'
            f'<section aria-labelledby="privacy-stored"><h3 id="privacy-stored">{C("tableCaption")}</h3>{cards(l)}</section>'
            f'<section aria-labelledby="privacy-clear"><h3 id="privacy-clear">{T("clearHeading")}</h3><p>{PT(l, "clearBody")}</p>{clear_ui(l, confirm, True)}</section>')


def pop(l, new, confirm=False):
    return popup(txt(l, 'privacySettings.title'), body(l, new, confirm))


def frm(label, theme, w, h, l, new, wide=False, js='', expand=False, confirm=False):
    extra = (CSS_NEW if new else CSS_CUR) + (WIDE if wide else FRAME) + (EXPAND if expand else '')
    if wide:
        extra += '.dialog__scroll{scrollbar-gutter:auto}'
    return fr(label, theme, w, h, pop(l, new, confirm), extra, js, lang=l)


def meas_table():
    return tbl(['Misura (Chromium, Playwright, CSS del canvas)', 'Oggi (tabella)', 'Proposta (scheda)'], [
        ['Larghezza della tabella o della lista, 390 px (foglio, padding 24 px)', '393 px (it) · 392 (fr) · 401 (de) su 330 utili: <b>scorre di 63 / 62 / 71 px</b>', '330 px: nessun scorrimento'],
        ['Idem a 320 px (zoom 400 %)', 'scorre di 133 / 132 / 141 px (it / fr / de)', '260 px: nessun scorrimento'],
        ['Popup su desktop (560 px, corpo 496 px utili)', 'colonna del nome <b>75-79 px</b>: ogni nome su <b>3-6 righe</b> (it, de), «mcu-/planner/-/languag/e»', 'nome su una riga (200 px il più lungo, a 14 px grassetto)'],
        ['Altezza della lista, 390 px (it · en · fr · es · de)', '1435 · n.m. · 1610 · n.m. · 1489 px', '1568 · 1589 · 1631 · 1631 · 1610 px (+9 % in it)'],
        ['Altezza di una scheda, 390 px', '—', '132-195 px (la più alta in es, la «sessione» con tre righe)'],
        ['Idem a 320 px', '—', '132-237 px; lista 1736-1967 px'],
        ['Testo al 200 % su 320 px (html a 200 %)', '—', 'nessuno scorrimento orizzontale, nomi su 4 righe al massimo, spezzati dopo il trattino'],
        ['Contrasto del testo sulla scheda (<code>--row</code>)', 'su <code>--row-hover</code>: <code>--ink-2</code> 5,73 chiaro · 5,13 scuro', '<code>--ink</code> 15,13 · 11,43; <code>--ink-2</code> <b>6,40</b> chiaro · <b>6,54</b> scuro (soglia 4,5)'],
        ['Scheda sul fondo del popup (<code>--row</code> su <code>--surface</code>)', '—', '1,11 chiaro · 1,29 scuro: la scheda è un raggruppamento, non porta informazione (le righe sono separate da spazio, non dal colore)']])


def build():
    prop = tag('proposta · non implementata', 'k2')
    # --- ragioni
    why = ('<b>1 · Elenco a schede su tutte le larghezze (raccomandato).</b> Una scheda per voce: il nome in <code>code</code> grassetto, la finalità in corpo normale, sotto due righe con etichetta («Tipo», «Durata») in <code>--ink-2</code>. Il difetto non è solo del telefono: '
           'nel popup da 35 rem la colonna del nome vale 75-79 px e <b>ogni nome va su 3-6 righe</b> (misurato, vedi «Misure»), quindi la tabella a quattro colonne non è buona nemmeno su desktop. Una sola struttura e una sola regola, niente punto di rottura. '
           '<b>Scartate:</b> (a) tabella da 40 em e schede sotto: due strutture da tenere uguali e la tabella resta stretta sul desktop del popup (il difetto dei nomi); (b) tabella con scorrimento laterale (il tampone di oggi): per le tabelle WCAG 1.4.10 ammette lo scorrimento, ma «Durata» resta fuori vista e per leggere una riga serve scorrere (63 px a 390, 133 a 320); '
           '(c) tabella a due colonne (nome + finalità, il resto sotto): sposta il problema, la «durata» è la risposta che interessa a chi cancella; (d) popup <code>lg</code> (45 rem) per fare entrare la tabella: non risolve il telefono.')
    why2 = ('<b>2 · Ordine dentro la scheda: nome → finalità → tipo → durata.</b> Le colonne di oggi vanno per gerarchia tecnica (Nome, Tipo, Finalità, Durata); chi legge vuole prima sapere a cosa serve. La finalità è la frase della scheda e non ha etichetta (sarebbe l\'unica ovvia); «Tipo» e «Durata» sì: sono dati secchi e l\'etichetta li rende leggibili da chi non vede il colore e da un lettore di schermo (<code>dl</code>). '
            'Etichette e testi sono quelli di <code>cookiePage.columns.*</code> (nessun testo nuovo). Le etichette stanno in una colonna a larghezza automatica (<code>grid-template-columns: auto 1fr</code>), così i due valori si allineano in tutte le lingue (44 px in it, 56 px in es).')
    why3 = ('<b>3 · Nomi lunghi.</b> Regola: <code>overflow-wrap: break-word</code> (non <code>anywhere</code>), cioè a capo solo dopo il trattino e, solo se un pezzo non entra nella riga, dentro il pezzo. Nella scheda il nome più lungo (<code>mcu-planner-completed-seen</code>, 26 caratteri) è largo 200 px e la scheda ha 228 px utili a 320 px: non si spezza mai a 100 %; '
            'con il testo al 200 % su 320 px si spezza dopo il trattino (al massimo 4 righe) e non esce dal riquadro. <code>anywhere</code> è la causa dei «languag/e» di oggi: conta le parti minime nel calcolo della larghezza della colonna.')
    why4 = ('<b>4 · Una sola introduzione, un solo titolo per l\'elenco.</b> Oggi il popup dice tre volte che non c\'è niente da accettare: il paragrafo in apertura (<code>privacySettings.intro</code>), la sezione «Nessun consenso da dare» e «Come gestirli» (che manda a «Preferenze privacy» da dentro «Preferenze privacy»). '
            'Proposta: tre sezioni, tutte con <code>h3</code>: (1) <b>Nessun consenso da dare</b> con un solo paragrafo, (2) <b>Cookie e dati salvati nel browser</b>, titolo dell\'elenco (è <code>cookiePage.tableCaption</code>, che oggi fa la didascalia della tabella; la frase «Questa pagina elenca tutto…» sparisce: diceva «pagina» in un popup ed era un <code>h3</code> che ripeteva il titolo), '
            '(3) <b>Dati su questo dispositivo</b>, che assorbe «Come gestirli». L\'elenco resta legato al titolo con <code>aria-labelledby</code>: l\'elenco è letto come «Cookie e dati salvati nel browser, elenco di 10 voci». Il paragrafo di (1) è la fusione di <code>intro</code> e <code>noBannerBody</code> riscritta con <code>scrittura-ux</code> (59 parole in it contro 107, vedi «Testi»).')
    why5 = ('<b>5 · Cancellazione: due stati, stessi due pulsanti dei conferma degli altri popup.</b> Stato a riposo: il pulsante soft con <code>Trash2</code>, dentro <code>.dialog__actions</code> (a destra su desktop; a tutta larghezza sotto 40 em, come in ogni popup, <code>ConfirmDialog.less</code> r.78-85): il testo è lungo (de: «Daten auf diesem Gerät löschen») e a 390 px senza larghezza piena andrebbe a capo dentro il pulsante. '
            'Stato di conferma: la domanda sostituisce il pulsante (grassetta e rossa per la regola globale <code>[role="alert"]</code>, <code>base.less</code> r.270-273) e sotto «Annulla» (soft) e «Sì, cancella» (danger) nella stessa riga <code>.dialog__actions</code>: colonna sotto 40 em, riga a destra da 40 em, Annulla prima. La domanda porta la conseguenza: <b>«La pagina si ricarica.»</b> (testo nuovo, vedi «Testi»). '
            'Dopo «Cancella i dati» la pagina si ricarica e il popup sparisce: non si disegna un terzo stato e non si propone un toast di conferma (servirebbe ricordare il gesto in <code>sessionStorage</code>, cioè un nuovo dato nella tabella che il popup stesso elenca). '
            '<b>Per Code, comportamento:</b> <code>role="alert"</code> solo sulla domanda (oggi è sull\'intero blocco e legge anche i pulsanti); il focus va su «Annulla» quando compare la conferma (il pulsante che aveva il focus sparisce: oggi il focus cade sul corpo del popup) e torna sul pulsante di cancellazione quando si annulla. Scartata: scheda con fondo <code>--row</code> attorno alla conferma (un contenitore in più senza motivo).')
    why6 = ('<b>6 · Contrasto forzato.</b> La scheda ha <code>border: 1px solid transparent</code>: con i colori normali non si vede, con il contrasto forzato Chromium la trasforma in un contorno di sistema (verificato con l\'emulazione di Playwright, immagini sotto). Il fondo della scheda sparisce, come previsto: il contorno tiene la separazione tra una voce e l\'altra. Senza il bordo trasparente le schede si fonderebbero in un unico testo. '
            'Non serve nessuna riga in <code>forced-colors.less</code>.')
    # --- frame
    row390 = row(frm('Oggi · 390 px · chiaro', 'light', 390, 780, 'it', False, js=JS('#privacy-stored')),
                 frm('Proposta · 390 px · chiaro', 'light', 390, 780, 'it', True, js=JS('#privacy-stored')))
    row390d = row(frm('Oggi · 390 px · scuro', 'dark', 390, 780, 'it', False, js=JS('#privacy-stored')),
                  frm('Proposta · 390 px · scuro', 'dark', 390, 780, 'it', True, js=JS('#privacy-stored')))
    row320 = row(frm('Proposta · 320 px · de · chiaro (lingua più lunga)', 'light', 320, 780, 'de', True, js=JS('#privacy-stored')),
                 frm('Proposta · 320 px · fr · scuro', 'dark', 320, 780, 'fr', True, js=JS('#privacy-stored')),
                 frm('Oggi · 320 px · de (la tabella scorre di 141 px)', 'light', 320, 780, 'de', False, js=JS('#privacy-stored')))
    rowd = row(frm('Oggi · desktop · popup da 35 rem · chiaro', 'light', 680, 730, 'it', False, wide=True, js=JS('#privacy-stored')),
               frm('Proposta · desktop · popup da 35 rem · chiaro', 'light', 680, 730, 'it', True, wide=True, js=JS('#privacy-stored')))
    rowd2 = row(frm('Proposta · desktop · scuro · es', 'dark', 680, 730, 'es', True, wide=True, js=JS('#privacy-stored')),
                frm('Proposta · desktop · scuro · en', 'dark', 680, 730, 'en', True, wide=True, js=JS('#privacy-stored')))
    full = row(frm('Struttura intera · 390 px · chiaro (mostrata per intero: nel codice scorre)', 'light', 390, 2100, 'it', True, expand=True),
               frm('Struttura intera · desktop · scuro (mostrata per intero)', 'dark', 680, 1890, 'it', True, wide=True, expand=True))
    cf = row(frm('Cancellazione · a riposo · 390 px · chiaro', 'light', 390, 430, 'it', True, js=JS(bottom=True)),
             frm('Cancellazione · conferma · 390 px · chiaro', 'light', 390, 430, 'it', True, js=JS(bottom=True), confirm=True),
             frm('Cancellazione · conferma · 390 px · de · scuro', 'dark', 390, 430, 'de', True, js=JS(bottom=True), confirm=True))
    cf2 = row(frm('Cancellazione · a riposo · desktop · scuro', 'dark', 680, 530, 'it', True, wide=True, js=JS(bottom=True)),
              frm('Cancellazione · conferma · desktop · scuro', 'dark', 680, 530, 'it', True, wide=True, js=JS(bottom=True), confirm=True),
              frm('Oggi · conferma · 390 px · chiaro', 'light', 390, 430, 'it', False, js=JS(bottom=True), confirm=True))
    forced = ('<div class="dc-row"><div class="dc-fw"><div class="dc-fl">Contrasto forzato · scheda per voce · 390 px · tavolozza chiara (Chromium, <code>forcedColors: active</code>)</div><img src="assets/privacy-forced-light.png" alt="Elenco a schede con contrasto forzato, tavolozza chiara: ogni scheda ha un contorno nero su fondo bianco" width="390" style="display:block;max-width:100%;border-radius:var(--r-md)"></div>'
              '<div class="dc-fw"><div class="dc-fl">Contrasto forzato · tavolozza scura</div><img src="assets/privacy-forced-dark.png" alt="Elenco a schede con contrasto forzato, tavolozza scura: ogni scheda ha un contorno bianco su fondo nero" width="390" style="display:block;max-width:100%;border-radius:var(--r-md)"></div>'
              '<div class="dc-fw"><div class="dc-fl">Contrasto forzato · conferma di cancellazione · 390 px · tavolozza scura</div><img src="assets/privacy-forced-confirm.png" alt="Conferma di cancellazione con contrasto forzato: domanda in grassetto, pulsanti Annulla e Sì, cancella con il contorno" width="390" style="display:block;max-width:100%;border-radius:var(--r-md)"></div></div>')
    V = lambda k, l: PT(l, k)
    texts = tbl(['Chiave', 'Verdetto e motivo', 'Prima (it)', 'it', 'en', 'fr', 'es', 'de'], [
        ['<code>cookiePage.noBannerBody</code> + <code>privacySettings.intro</code>', '<b>unire</b>: dicevano la stessa cosa due volte (107 parole in it); una sola introduzione di 59 (en 63, fr 72, es 64, de 60). Tutti i punti legali restano: solo strumenti tecnici, niente consenso né banner, niente analisi/pubblicità/profilazione, unica risorsa di terzi il trailer solo al clic, consenso prima di ogni cambio. «Se in futuro lo faremo» → «Se un giorno questo cambierà». <b>Da rileggere (regola 8).</b>', E(P['it']['cookiePage']['noBannerBody']), *[V('noBannerBody', l) for l in LANGS]],
        ['<code>privacySettings.clearBody</code> (+ <code>cookiePage.manageBody</code>)', '<b>unire</b>: «Come gestirli» rimandava a «Preferenze privacy» da dentro «Preferenze privacy». Aggiunta la risposta che interessa (resti connesso, il cookie di sessione si elimina solo all\'uscita) e le impostazioni del browser. Frase negativa («Non ti disconnette») in positiva.', E(P['it']['privacySettings']['clearBody']), *[V('clearBody', l) for l in LANGS]],
        ['<code>privacySettings.clearQuestion</code>', '<b>riscrivere</b>: «davvero» non dice niente; ora dice cosa si perde (senza account i progressi non si recuperano) e cosa succede (la pagina si ricarica). Resta un solo tono, serio.', E(P['it']['privacySettings']['clearQuestion']), *[V('clearQuestion', l) for l in LANGS]],
        ['<code>privacySettings.clearConfirm</code>', '<b>riscrivere</b>: pulsante con verbo + oggetto, non «Sì, …» (la domanda sopra è già posta).', E(P['it']['privacySettings']['clearConfirm']), *[V('clearConfirm', l) for l in LANGS]],
        ['<code>privacySettings.clearButton</code>, <code>clearHeading</code>, <code>title</code>, <code>cookiePage.noBannerHeading</code>, <code>tableCaption</code>', '<b>tenere</b>: verbo + oggetto, titoli chiari, corti in tutte le lingue.', '—', '—', '—', '—', '—', '—'],
        ['<code>cookiePage.*.kind</code>, <code>.purpose</code>, <code>.duration</code>', '<b>tenere</b>: una frase per voce, già brevi. «HttpOnly, SameSite=Lax» resta (trasparenza tecnica, testo legale).', '—', '—', '—', '—', '—', '—'],
        ['<code>cookiePage.intro</code>, <code>manageHeading</code>, <code>manageBody</code>, <code>columns.name</code>, <code>columns.purpose</code>', '<b>togliere</b> (non più mostrate; cerca altri usi prima di cancellarle).', '—', '—', '—', '—', '—', '—'],
        ['<code>cookiePage.columns.kind</code> · <code>duration</code>', '<b>tenere</b>: etichette «Tipo» e «Durata» delle schede.', '—', *[E(P[l]['cookiePage']['columns']['kind'] + ' / ' + P[l]['cookiePage']['columns']['duration']) for l in LANGS]]])
    rule = ('<pre><code>// StorageTable.tsx: da tabella a elenco (stessa cartella, stesso nome o StorageList)\n'
            '&lt;ul className="storage-list" aria-labelledby="privacy-stored"&gt;\n'
            '  {STORAGE_INVENTORY.map((item) =&gt; (\n'
            '    &lt;li key={item.id} className="storage-card"&gt;\n'
            '      &lt;code className="storage-card__name"&gt;{item.name}&lt;/code&gt;\n'
            '      &lt;p&gt;{t(`cookiePage.${item.id}.purpose`)}&lt;/p&gt;\n'
            '      &lt;dl&gt;\n'
            '        &lt;div&gt;&lt;dt&gt;{t("cookiePage.columns.kind")}&lt;/dt&gt;&lt;dd&gt;{t(`cookiePage.${item.id}.kind`)}&lt;/dd&gt;&lt;/div&gt;\n'
            '        &lt;div&gt;&lt;dt&gt;{t("cookiePage.columns.duration")}&lt;/dt&gt;&lt;dd&gt;{t(`cookiePage.${item.id}.duration`)}&lt;/dd&gt;&lt;/div&gt;\n'
            '      &lt;/dl&gt;\n'
            '    &lt;/li&gt;\n'
            '  ))}\n'
            '&lt;/ul&gt;\n\n'
            '// StorageTable.less: sostituisce tutto (via il tampone .scroll-x, via .storage-table)\n'
            '.storage-list { display: flex; flex-direction: column; gap: var(--sp-2); margin: 0; padding: 0; list-style: none; }\n'
            '.storage-card {\n'
            '  display: flex; flex-direction: column; gap: var(--sp-1h);\n'
            '  padding: var(--sp-3h) var(--sp-4);\n'
            '  border: 1px solid transparent;          // visibile solo nel contrasto forzato\n'
            '  border-radius: var(--r-sm);\n'
            '  background: var(--row);\n'
            '  font-size: var(--fs-label);\n'
            '  p { margin: 0; }\n'
            '  dl { display: grid; grid-template-columns: auto 1fr; gap: 2px var(--sp-3); margin: var(--sp-1) 0 0; color: var(--ink-2); }\n'
            '  dl &gt; div { display: contents; }\n'
            '  dd { margin: 0; }\n'
            '}\n'
            '.storage-card__name { font-weight: 700; overflow-wrap: break-word; }\n\n'
            '// PrivacySettingsDialog.tsx: tre sezioni (consenso, elenco con titolo cookiePage.tableCaption, dati su questo dispositivo)\n'
            '// stato a riposo: &lt;div className="dialog__actions"&gt;&lt;Button variant="soft" icon={&lt;Trash2 aria-hidden /&gt;}&gt;…&lt;/Button&gt;&lt;/div&gt;\n'
            '// conferma:\n'
            '&lt;div className="privacy-confirm"&gt;\n'
            '  &lt;p role="alert"&gt;{t("privacySettings.clearQuestion")}&lt;/p&gt;\n'
            '  &lt;div className="dialog__actions"&gt;&lt;Button variant="soft" ref={cancelRef}&gt;…&lt;/Button&gt;&lt;Button variant="danger"&gt;…&lt;/Button&gt;&lt;/div&gt;\n'
            '&lt;/div&gt;\n'
            '// PrivacySettingsDialog.less: respiro dentro e tra le sezioni (oggi titolo e testo sono attaccati: 0 px)\n'
            '.privacy-section { display: flex; flex-direction: column; gap: var(--sp-3); }   // titolo → contenuto: 12 px\n'
            '.privacy-section + .privacy-section { margin-top: var(--sp-2); }   // + gap 20 px del corpo = 28 px tra le sezioni\n'
            '// …e la regola .privacy-confirm SOSTITUISCE quella di oggi (via flex-wrap, align-items: center, p { flex-basis: 100% })\n'
            '.privacy-confirm { display: flex; flex-direction: column; gap: var(--sp-3); p { margin: 0; } }   // la domanda è già grassetta e rossa: [role="alert"] in base.less r.270-273</code></pre>'
            + ul(['Nessun valore nuovo: solo <code>--row</code>, <code>--r-sm</code>, <code>--sp-1</code>, <code>--sp-1h</code>, <code>--sp-2</code>, <code>--sp-3</code>, <code>--sp-3h</code>, <code>--sp-4</code>, <code>--fs-label</code>, <code>--ink-2</code>. La scheda è come <code>.title-row</code> (fondo <code>--row</code>, <code>--r-sm</code>), non come la riga di oggi (<code>--row-hover</code>).',
                  '<b>Focus:</b> all\'apertura della conferma il focus va su «Annulla» (<code>ref</code>, <code>useEffect</code> sul cambio di stato); su «Annulla» e dopo il ricaricamento non serve altro; quando si annulla il focus torna sul pulsante di cancellazione. Nessun gestore nuovo in <code>Modal</code>.',
                  '<b>Test:</b> nessuno nuovo (markup e CSS, il progetto non ha test di componenti). Verifica a mano a 390 e 1280 px, chiaro e scuro, in tutte e cinque le lingue; a 320 px; al 200 % di testo; con la tastiera (Tab nell\'elenco: niente da focalizzare, la lista non è interattiva; la conferma ha il focus su Annulla).',
                  '<b>Deviazioni di DESIGN.md:</b> cancellare la riga «Tabella dei cookie nelle Preferenze privacy | <code>StorageTable.tsx</code> | …tampone…» (c\'è scritto di farlo quando Design disegna la scheda: è questo). Il tampone <code>.scroll-x</code> con <code>role="region"</code> e <code>tabIndex</code> si toglie con la tabella.',
                  '<b>Non verificato:</b> Safari (la griglia della <code>dl</code> con <code>display: contents</code> sui <code>div</code>, supportata da WebKit ma da vedere con VoiceOver), un lettore di schermo vero (NVDA) sulla lista e sulla conferma, il contrasto forzato del Windows del committente (provato solo con l\'emulazione di Chromium).'])
            )
    pd = tbl(['Cosa', 'Prima', 'Dopo', 'File'], [
        ['Elenco dei dati', 'tabella a 4 colonne con scorrimento laterale (tampone)', 'elenco di schede (<code>ul</code> · <code>li</code> · <code>dl</code>)', 'StorageTable.tsx, StorageTable.less'],
        ['Nomi lunghi', '<code>overflow-wrap: anywhere</code> in una colonna da 75-79 px', '<code>break-word</code>, riga intera nella scheda', 'StorageTable.less'],
        ['Introduzione e consenso', 'paragrafo + sezione «Nessun consenso da dare» (stesso contenuto)', 'una sezione', 'PrivacySettingsDialog.tsx r.28-34; it.ts <code>privacySettings.intro</code>'],
        ['Titolo dell\'elenco', '<code>cookiePage.intro</code> («Questa pagina elenca…»), poi didascalia uguale', '<code>cookiePage.tableCaption</code>', 'PrivacySettingsDialog.tsx r.36-40; StorageTable.tsx r.17-18'],
        ['«Come gestirli»', 'sezione a sé, rimanda a «Preferenze privacy» dal suo interno', 'assorbita in «Dati su questo dispositivo»', 'PrivacySettingsDialog.tsx r.42-45'],
        ['Pulsante di cancellazione', 'soft, larghezza del testo', '<code>.dialog__actions</code>: a destra su desktop, a tutta larghezza sotto 40 em', 'PrivacySettingsDialog.tsx r.60-67'],
        ['Conferma', '<code>role="alert"</code> sull\'intero blocco; il focus cade sul corpo; pulsanti in riga che va a capo', '<code>role="alert"</code> sulla domanda; focus su «Annulla»; <code>.dialog__actions</code> (colonna sotto 40 em); la domanda dice che la pagina si ricarica', 'PrivacySettingsDialog.tsx r.48-58; PrivacySettingsDialog.less']])
    return (f'<div class="dc-sec"><h2 class="dc-h2">Decisione · Preferenze privacy: elenco a schede, una sola introduzione e cancellazione (voce 25)</h2><div>{prop}</div>'
            '<p class="dc-sub">Riferimento: codice di main 4bfbea4 (<code>PrivacySettingsDialog</code>, <code>StorageTable</code>, <code>Modal</code> con <code>useSheetDrag</code>), letto con <code>git show</code>: <b>4bfbea4 non è ancora su <code>main</code></b> (è nel ramo <code>design-suite-architecture-41e77f</code>). '
            'Cornici con il CSS dei <code>.less</code> di oggi e della proposta, i testi dei cinque file di lingua di 4bfbea4, i font veri. Gli iframe mostrano il punto del popup che serve (scorso fino all\'elenco o alla cancellazione); nel codice il popup scorre. <b>Non verificato:</b> Safari e Firefox; il disegno in contrasto forzato è un\'emulazione di Chromium.</p>'
            + box('Scelta · raccomandazione e alternative per punto', f'<p>{why}</p><p>{why2}</p><p>{why3}</p><p>{why4}</p><p>{why5}</p><p>{why6}</p>')
            + sec('Telefono, 390 px · oggi e proposta', 'L\'elenco dei dati scorso in vista. A sinistra la tabella di oggi: «Durata» non c\'è (63 px fuori vista). A destra una scheda per voce: tutto leggibile senza scorrere di lato.', col(scrolls(row390), scrolls(row390d)))
            + sec('Telefono stretto, 320 px (zoom 400 %)', 'Il tedesco è la lingua con le righe più lunghe. A destra, la tabella di oggi a 320 px: scorre di 141 px.', scrolls(row320))
            + sec('Desktop · popup da 35 rem', 'La tabella di oggi non è buona nemmeno qui: colonna del nome da 75-79 px, nomi su 3-6 righe. Sotto, la proposta in scuro, in spagnolo e in inglese.', col(scrolls(rowd), scrolls(rowd2)))
            + sec('Struttura intera', 'Tre sezioni: consenso (testo segnaposto), elenco, dati su questo dispositivo.', scrolls(full))
            + sec('Cancellazione: a riposo e in conferma', 'Il terzo riquadro dell\'ultima riga è la conferma di oggi (a 390 px il pulsante va a capo e il testo si spezza). Dopo «Cancella i dati» la pagina si ricarica: nessun terzo stato.', col(scrolls(cf), scrolls(cf2)))
            + sec('Contrasto forzato', 'Emulazione di Chromium (<code>forcedColors: active</code>), 390 px. Il fondo delle schede sparisce, il bordo trasparente diventa un contorno di sistema. <b>Nel terzo riquadro i pulsanti «Annulla» e «Sì, cancella» sembrano testo semplice:</b> è il difetto F1 dell\'audit (i pulsanti perdono la forma), comune a tutti i pulsanti dell\'app e da risolvere nel pezzo 4 (contrasto forzato), non qui.', scrolls(forced))
            + sec('Misure', 'Prese con Playwright (Chromium) sul CSS del canvas e i testi veri, nelle cinque lingue dove indicato.', meas_table())
            + sec('Testi', 'Rivisti con la skill <code>scrittura-ux</code> (regole del progetto, verdetti tenere / unire / riscrivere / togliere). Lingua: it in «tu»; en, fr, es, de dall\'intento, non letterali; il francese resta in «vous» come nei file di oggi (scelta tu/vous ancora del committente). Titoli e pulsanti corti anche in fr e de. <b>Regola 8: sono testi di privacy, vanno riletti dal committente e da un esperto prima di andare nel codice</b>; fr, es, de da far leggere a un madrelingua. Prima: parole delle due introduzioni sommate.', f'<div class="dc-scroll">{texts}</div>')
            + sec('Regola per Code', 'Il prompt completo è in <code>docs/design/PROMPT_CODE_PRIVACY.md</code>.', rule)
            + sec('Prima, dopo, file', '', pd) + '</div>')


def insert(page, marker, build_fn, force=False):
    p = os.path.join(CANVAS, page + '.dc.html')
    t = open(p, encoding='utf-8', newline='').read()
    if marker in t:
        if not force:
            raise SystemExit(page + ': già inserito (usa --force)')
        i = t.index('<div class="dc-sec"><h2 class="dc-h2">' + marker)
        j = t.index('\n</div>\n</x-dc>')
        t = t[:i].rstrip('\n') + t[j:]
    end = '\n</div>\n</x-dc>'
    assert t.count(end) == 1
    open(p, 'w', encoding='utf-8', newline='').write(t.replace(end, '\n' + build_fn() + end, 1))
    print('ok', page)


if __name__ == '__main__':
    insert('Popup generici', 'Decisione · Preferenze privacy: elenco a schede', build, force='--force' in sys.argv)
