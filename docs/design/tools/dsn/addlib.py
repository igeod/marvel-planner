from comp import *
PROP=tag('proposta · non implementata','k2')
DECI=tag('decisione · da implementare')
CONF=tag('confermato dal codice','k3')
CORR=tag('corretto','k2')
PREF=tag('★ preferita')
IMPL=tag('implementata · main c520ab1','k3')
PART=tag('implementata in parte · main c520ab1','k2')
RIM=tag('rimandata','k3')
IMPL2=tag('implementata · main 456fa17','k3')
IMPL3=tag('implementata · main 8b15e60','k3')
SOST=tag('sostituita · main 456fa17','k2')
NEW_IMPL=[
 ('Decisione · focus dopo un tocco','Voce 4. <code>useDialog.ts</code> e <code>ToastProvider.tsx</code>: alla chiusura di toast e popup il focus torna al punto di partenza senza anello se l’ultimo input era tocco o clic, con l’anello se era la tastiera.'),
 ('Decisione · icona nelle etichette cliccabili','Voce 7. Nuovo <code>ButtonLink</code> (<code>icon</code> e <code>iconEnd</code>). “Apri scheda” e “Dettagli” (Prossimo da guardare) hanno Maximize2 a destra. I link esterni di WhereToWatch e CandidatesSection restano scritti a mano, con l’icona già a destra.'),
 ('Decisione · ingresso a cascata','Voce 15. <code>data-intro</code> si imposta a ogni arrivo su planner (<code>/</code> e <code>/s/:code</code>) e film (<code>/film/:id</code>), dura circa 600 ms; il film anima copertina, titolo e metadati, Dove guardare, trama, cast (<code>--i</code> da 1 a 5). <b>Scostamento:</b> con movimento ridotto il canvas chiede la sola dissolvenza, il codice non anima nulla (il blocco <code>data-intro</code> esiste solo con movimento normale). Vale il codice.'),
 ('Decisione · “Prossimo da guardare” in caricamento','Voce 16. La scheda non si smonta mai; in caricamento mostra uno scheletro. Quando cambia il titolo la copertina vecchia resta finché la nuova è pronta, poi la nuova sfuma sopra (300 ms).'),
 ('Decisione · “Condividi il tuo planner” a 1098×911','Voce 17. Nessuna modifica: il codice era già come da decisione (Condividi dentro la scheda, schede a pari altezza).'),
 ('Decisione · fondo del planner su mobile','Voce 18. La barra di avanzamento è sticky e si ferma a fine sezione, prima del footer; tolti il <code>padding-bottom</code> di riserva e la logica che la nascondeva vicino al footer. <b>Scostamento:</b> non è più a tutta larghezza fino al bordo, sta nella colonna con tutti gli angoli arrotondati (<code>@radius-block</code>). Vale il codice.'),
 ('Decisione · cambio filtro senza sfarfallio','Voce 20, ora completa: la lista mantiene l’altezza di prima per un frame durante lo scambio (<code>min-height</code> via CSSOM, <code>style.minHeight</code>, ammesso dalla CSP).'),
 ('Scorciatoie flottanti','Voce 21b. Pillole “Ultimo visto” e “Torna su” centrate, animate, nascoste sotto i toast; testi in <code>planner.jump.last/top</code> nelle 5 lingue; il link nella scheda dei progressi è tolto; “Torna su” c’è anche sulla pagina del film. Evidenziazione: parte a fine scorrimento (<code>scrollend</code>, attesa massima 700 ms), piena 1,6 s, sfuma in 0,8 s (totale 2,4 s); con movimento ridotto l’anello è fisso 2,4 s. <b>Scostamenti (vale il codice):</b> velo al 22% scritto a mano (<code>color-mix</code>, valore senza token); le pillole stanno a <code>--sp-4</code> dal bordo e si alzano sopra la barra solo quando questa è attaccata al bordo basso (lo decide JS con <code>getBoundingClientRect</code>); il footer ha un <code>padding-bottom</code> in più (<code>+ --hit</code>) perché le pillole non coprano l’ultima riga, anche nelle pagine senza pillole.'),
 ('“Torna su” sulla pagina del film','Voce 21b: implementata, stesso componente del planner.'),
 ('Guida “Come leggere il planner” nell’header','Voce 30b. Il “?” è nell’header (portale su <code>#header-help-slot</code>), solo su <code>/</code> e <code>/s/:code</code>, 48px come il pulsante del tema; l’invito della prima visita sta sotto il pulsante; la riga della ricerca è solo ricerca. <b>Da controllare:</b> su mobile l’invito copre in parte la scheda dei progressi finché non viene chiuso.'),
 ('Fascia delle fasi: solo il','Voce 31. Solo il “prossimo” ha il play (10-16px proporzionale), celle 32px desktop e 24px mobile; su mobile è un accordion a sé dopo “Prossimo da guardare”; tolti la variante <code>inline</code> e il riferimento a <code>--strip-on-panel-off</code>.'),
 ('Numero che sale nei tuoi progressi','Voce 32. Nuovo <code>useCountUp</code> (<code>features/planner/hooks/useCountUp.ts</code>): 900 ms all’arrivo, 400 ms a ogni cambio, <code>easeOutCubic</code>, larghezza riservata, <code>tabular-nums</code>; con movimento ridotto salta al valore (<code>useMediaQuery("(prefers-reduced-motion: no-preference)")</code>). Dal commit b7ddfe3 vale per <b>tutti i contatori grandi dei progressi</b>: la scheda “I tuoi progressi” conta da 0 in 900 ms all’arrivo e poi 400 ms a ogni cambio; la scheda piccola nella colonna dei filtri (<code>CompactProgress</code>, desktop) e la barra flottante su mobile (<code>FloatingProgress</code>) contano solo a ogni cambio (400 ms) e alla prima apertura o alla riapertura mostrano subito il valore; nell’account, sezione “Titoli visti” (<code>ProgressStatsSection</code>), il “51” e il “72%” contano da 0 in 900 ms la prima volta che la pagina si apre nella sessione (come le barre, <code>hasFilledOnce</code>) e poi solo ai cambi. Non contano i conteggi piccoli dentro il testo (“12 di 34”, “Mostrando 71 di 71”, conteggio delle fasi). L’hook è <code>useCountUp(target, { initialMs?, changeMs, enabled })</code>: senza <code>initialMs</code> il numero parte dal valore e conta solo ai cambi (l’opzione <code>isActive</code> della versione precedente non c’è più).'),
 ('Regia su mobile','Voce 33. Sotto i 40em la sezione Regia è nascosta e la regia è una riga sotto “Cast” (<code>.film__credit-line</code>); quando il dato manca mostra solo il testo di “mancante”, senza etichetta. <b>Scostamento:</b> la riga non ha misure di font proprie, eredita il corpo; il testo “mancante” usa <code>--fs-label</code>. Vale il codice.'),
 ('Casella sulla fase al posto di','Implementata. La casella (<code>.title-row__check phase__check</code>, PhaseSection.tsx) è tri-stato: vuota, parziale con trattino (<code>indeterminate</code>, letta come <code>aria-checked="mixed"</code>), tutta vista (rossa). Il clic non apre né chiude la fase; agisce solo sui titoli mostrati; con fase vuota non compare; toast con Annulla invariato. <b>Scostamento:</b> riusa <code>.title-row__box</code> con <code>margin-top: 0</code> per centrarla sul sommario. Dal commit 450fbb9 il sommario (<code>.phase__summary</code>) ha <code>padding-left</code> 12px (8px da 64em), come le righe dei titoli: la casella sta sulla loro colonna (prima 20px).'),
]
NEW_IMPL3=[
 ('Pillole flottanti sopra i toast','Voce 34. Tolta la regola che nascondeva le pillole sotto un toast. <code>--toasts-lift</code> è misurata in <code>BackToTop.tsx</code> (<code>getBoundingClientRect</code>; <code>ResizeObserver</code> e <code>MutationObserver</code> su <code>.toasts</code>); <code>translate</code> con transizione 240 ms in salita e 180 ms in discesa (<code>data-lifted</code>), nessuna transizione con movimento ridotto. Anche <code>width: max-content</code> e <code>nowrap</code> (il bug delle etichette a capo).'),
 ('Pillole su mobile: solo','Voce 35. Sotto 40em “Torna su” è solo la freccia (cerchio da 44px, testo visivamente nascosto con <code>.visually-hidden-box()</code>); <code>width: max-content</code>, <code>nowrap</code>; <code>bottom</code> = barra + <code>--sp-2</code> misurata (<code>--bar-lift</code>, in <code>BackToTop.tsx</code>). “Zuletzt gesehen” sta su una riga a 360px.'),
 ('Fascia delle fasi su mobile: lo stesso','Voce 36. <code>&lt;details class="phase phase-strip-accordion card"&gt;</code> con <code>usePhaseMotion</code>; chiusa 60px (serve <code>padding-block: 0</code> sul sommario, altrimenti 80px); titolo <code>.phase-strip__name</code> a <code>--fs-title</code>, peso 700.'),
 ('Barra di avanzamento su telefono','Voce 37. Larghezza <code>min(440px, calc(100% − 1rem))</code> centrata, raggio <code>--r-row</code>, padding <code>--sp-3h</code> / <code>--sp-4</code> / <code>--sp-3</code>. Toast invariati, 8px sopra la barra. Misurato a 390px: barra 16/374, toast 16,5/374,5 (mezzo pixel dell’emulazione). <b>Nota:</b> la misura “sopra la barra” (<code>--bar-lift</code>, <code>Toast.less</code> <code>bottom: max(16px, safe-area, --bar-lift + --sp-2)</code>) vale anche tra 40em e 64em, dove la barra c’è; il canvas la descriveva solo per il telefono. <code>--floating-progress-height</code> serve ormai solo a <code>--floating-progress-clearance</code>.'),
]

IMPL_KEYS=['X o Annulla, e durate','hover sugli interruttori','elenco della lingua nel menu','scroll con elenco aperto','margine sotto la voce','footer: “Made in Italy”','click sul titolo','quando la X c','importazione di un planner condiviso, ridisegnata','una sola etichetta','suggerimento e-mail','Questo è già il tuo nome','conferma dopo aggiornamento','in caricamento: dimensioni fisse','senza rete o dati non recuperati','copertina che non si carica','“Regia” e “Cast”','“Regia non disponibile.”','Titoli di serie','indicatore dei titoli visti','Saga dell\'Infinito']
OV='display:block;opacity:1;transform:none;translate:none;scale:none;position:relative;margin:0;max-width:100%'
def T(it,en,fr,es,de): return dict(zip(LANGS,(it,en,fr,es,de)))
def esc(s): return html.escape(s,quote=False)
def fill(s,**kw):
    for k,v in kw.items(): s=s.replace('{'+k+'}',str(v))
    return s
def txt(rows,first='Chiave',**kw):
    return tbl([first]+LANGS,[[f'<code>{k}</code>']+[esc(fill(v[l],**kw)) for l in LANGS] for k,v in rows])
def pd(rows,title='Prima, dopo, file',sub='Per ogni voce: com\'era nel codice 2b5e07a (prima), che cosa decide questa pagina (dopo), file da toccare.'):
    return sec(title,sub,tbl(['Cosa','Prima','Dopo','File'],rows))
FLAG=tag('implementata · spenta di default (flag)','k2')
def block(title,chips,sub,body=''):
    for k,n in NEW_IMPL3:
        if k in title:
            return _block(title,IMPL3,'<b>Stato: implementata su main 8b15e60.</b> '+n+' Il testo qui sotto è la decisione presa; dove il codice differisce vale il codice. '+sub,body)
    return _block(title,chips,sub,body)
def _block(title,chips,sub,body=''):
    for k,n in NEW_IMPL:
        if k in title:
            chips=IMPL2; sub='<b>Stato: implementata su main 456fa17.</b> '+n+(' Il testo qui sotto è la decisione presa; dove il codice differisce vale il codice.' if True else '')+(' '+sub if sub else ''); break
    if '“Segna tutta la fase come vista” (funzioni 21 e 22' in title:
        chips=SOST; sub='<b>Sostituita su main 456fa17</b> dalla casella tri-stato nel sommario della fase (vedi “Casella sulla fase”). Resta qui come descrizione di c520ab1. '+sub
    if 'campo in errore' in title: chips=CONF
    if 'cambio filtro senza sfarfallio' in title: chips=PART
    if 'Password dimenticata' in title: chips=FLAG
    if DECI in chips and any(k in title for k in IMPL_KEYS): chips=chips.replace(DECI,IMPL)
    return f'<div class="dc-sec"><h2 class="dc-h2">{title}</h2><div>{chips}</div>'+(f'<p class="dc-sub">{sub}</p>' if sub else '')+body+'</div>'
def vcard(letter,title,demo,desc,states,pro,con,pref=False):
    return (f'<div class="dc-box" style="flex:1 1 22rem;min-width:0"><h3 class="dc-h3">Variante {letter} · {title}</h3><div>{PROP} {PREF if pref else ""}</div>'
            f'<p class="dc-sub">{desc}</p>{demo}'
            +(f'<div class="dc-fl">Stati</div>{ul(states)}' if states else '')
            +f'<div class="dc-fl">Pro</div>{ul(pro)}<div class="dc-fl">Contro</div>{ul(con)}</div>')
def vgrid(*c): return '<div class="dc-row" style="align-items:stretch">'+''.join(c)+'</div>'
def why(t): return f'<div class="dc-box"><div class="dc-fl">Scelta · variante preferita e perché</div><p>{t}</p></div>'
def modal(title,body,size='md',close=True):
    cl=f'<button type="button" class="dialog__close" aria-label="{L("common.close")}">{icon("x")}</button>' if close else ''
    return (f'<dialog class="dialog dialog--{size}" open style="{OV}"><div class="dialog__scroll scroll-y"><header class="dialog__header"><h2 tabindex="-1">{title}</h2></header><div class="dialog__body">{body}</div></div>{cl}</dialog>')
def confirm_raw(title,msg,actions):
    return (f'<dialog class="dialog dialog--confirm" open style="{OV}"><div class="dialog__body"><h2>{title}</h2><p>{msg}</p><div class="dialog__actions">{actions}</div></div></dialog>')
def toast_el(tone,title,msg='',action=None,close=True):
    lead=(f'<img class="toast__icon" src="assets/images/err-toast.webp" alt="" aria-hidden="true" width="36" height="36">' if tone=='error' else f'<span class="toast__badge" aria-hidden="true">{icon("check")}</span>')
    m=f'<span>{msg}</span>' if msg else ''
    a=btn('panel',action,'sm').replace('btn btn--panel','btn btn--panel toast__action') if action else ''
    c=f'<button type="button" class="toast__close" aria-label="{L("common.close")}">{icon("x")}</button>' if close else ''
    return f'<div class="toast toast--{tone}" role="{"alert" if tone=="error" else "status"}">{lead}<div class="toast__text"><strong>{title}</strong>{m}</div>{a}{c}</div>'
def tstack(*t): return '<div style="display:flex;flex-direction:column;gap:var(--sp-2);width:min(440px,100%)">'+''.join(t)+'</div>'
def fr(t,w,inner,lab,pad='var(--sp-4)'): return frame(t,w,inner,lab,pad=pad,bg='var(--bg)')
def Tl(label,text): return f'<p><b>{label}</b> {text}</p>'
def note(t): return f'<p class="dc-sub">{t}</p>'
EXTRA={}
def add(page,*html_): EXTRA.setdefault(page,[]).extend(html_)
