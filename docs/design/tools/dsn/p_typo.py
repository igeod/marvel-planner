from parts import *
import tokparse as TP, subprocess, re, os, collections
SRC='@REPO@/src'
def uses(tok):
    out=subprocess.run(['grep','-rlF',f'var({tok})','--include=*.less',SRC],capture_output=True,text=True).stdout.split()
    names=sorted(set(os.path.basename(p).replace('.less','') for p in out))
    return names
def sample(tok,txt='Marvel Planner',disp=False):
    f='font-family:var(--font-display);text-transform:uppercase;letter-spacing:.02em;font-weight:400;' if disp else ''
    return f'<span style="font-size:var({tok});line-height:1.2;{f}">{txt}</span>'
FS=['--fs-hero','--fs-xl','--fs-h1','--fs-h1-sm','--fs-wordmark','--fs-h2','--fs-h4','--fs-h3','--fs-title','--fs-body','--fs-button','--fs-label','--fs-caption']
rows=[]
for t in FS:
    v=TP.val(t,'light')
    u=uses(t); us=', '.join(u[:6])+(f' … (+{len(u)-6})' if len(u)>6 else '') if u else '<i>non usato nei .less</i>'
    rows.append([f'<code>{t}</code>',f'<code>{v[0]}</code> <span class="ln">r.{v[1]}</span>',sample(t,'Marvel Planner',t in ('--fs-hero','--fs-xl','--fs-h1','--fs-h1-sm','--fs-wordmark','--fs-h4')),us])
# weights
w=subprocess.run('grep -rhoE "font-weight: [0-9]+" --include=*.less %s'%SRC,shell=True,capture_output=True,text=True).stdout.split('\n')
cnt=collections.Counter(x.split(': ')[1] for x in w if x)
wrows=[[k,str(cnt[k])] for k in sorted(cnt,key=int)]
tone=[
 ['Registro','tu informale, frasi brevi',L('planner.empty.filters.body')],
 ['Pulsanti','verbo (+ oggetto)',f'{L("planner.next.markWatched")} · {L("common.retry")} · {L("details.open")} · {L("planner.filters.clear")}'],
 ['Errore','cosa è successo + cosa fare',f'{L("errors.save.title")}. {L("errors.save.body")}'],
 ['Conferma (toast)','esito breve, tono caldo',f'{L("auth.login.done")} · {L("error.codeCopied")}'],
 ['Vuoto','cosa manca + cosa fare',f'{L("planner.empty.search.title",q="Thor")}. {L("planner.empty.search.body")}'],
]
S=[]
S.append(h1('Typography','Due famiglie, una scala, e il tono dei testi: tutto dal codice.'))
S.append(hdr('Famiglie di font, scala dimensioni con dove si usa, pesi, stili base, tono dei testi',
 'src/styles/tokens.less (--font-*, --fs-*), src/styles/base.less (body, label, .section-title), mixin .display-font() in mixins.less',
 'Tutti i componenti'))
S.append(sec('Famiglie','Display: Anton (maiuscolo, peso 400, spaziatura 0,02em) per titoli grandi, wordmark, percentuali. Corpo: Hanken Grotesk Variable per tutto il resto.',
 tbl(['Token','Valore','Fonte'],[[f'<code>{n}</code>',f'<code>{TP.val(n,"light")[0]}</code>',f'tokens.less r.{TP.val(n,"light")[1]}'] for n in ('--font-display','--font-body')])
 +both('720px','<div style="display:flex;flex-direction:column;gap:var(--sp-3)"><span style="font-family:var(--font-display);font-size:var(--fs-h1);text-transform:uppercase;letter-spacing:.02em;line-height:1.05">Marvel Planner</span><span style="font-size:var(--fs-title);font-weight:700">Hanken Grotesk Variable 700</span><span style="font-size:var(--fs-body)">Hanken Grotesk Variable 400, 16px, interlinea 1,5</span></div>','')))
S.append(sec('Scala','Ogni dimensione è un token; la colonna “Usato da” viene da una ricerca di <code>var(--fs-…)</code> nei .less.',
 f'<div class="dc-scroll">{tbl(["Token","Valore","Anteprima","Usato da"],rows)}</div>'))
S.append(sec('Pesi usati nei .less','Conteggio delle dichiarazioni <code>font-weight</code> per valore.',tbl(['Peso','Dichiarazioni'],wrows)))
S.append(sec('Stili base','',spec('styles/base.less',r'^(body|label|html|a)$|section-title')))
S.append(sec('Mixin del font display','',spec('styles/mixins.less',r'display-font')))
S.append(sec('Tono dei testi','Ricavato da <code>src/i18n/locales/it.ts</code>; i testi sono i veri valori in italiano.',tbl(['Elemento','Regola','Testi reali'],tone)))
S.append(sec('Regole dai dati','',ul(['Il maiuscolo dei titoli display è solo CSS (<code>text-transform: uppercase</code> nel mixin <code>.display-font()</code>), mai nel testo.','Lingua dei titoli originali, formato delle date e dei numeri: '+NOVERIF+' nel sorgente staged (nessun <code>lang=</code> sui titoli del planner, nessun <code>Intl.DateTimeFormat</code> trovato in src/).'])))
S.append(sec('Pagina Content: cosa ne è stato','La vecchia pagina “Testi e dati” (Content) è assorbita qui e sarà cancellata: i formati che mostrava (“2 h 6 min”, “29 ott 2026”, “8,1”, conteggi singolare/plurale) <b>non sono nel codice</b> e i suoi testi erano esempi. Restano qui solo le regole verificate nel codice. '+NOVERIF+' per le regole “trattino per testo mancante” e “niente emoji”: non ho trovato un controllo nel codice.',''))
S.append(prima_dopo([
 ['Scala','valori scritti nella pagina','token letti da tokens.less con i file che li usano','tokens.less'],
 ['Content','pagina separata con esempi','assorbita; solo regole verificate qui sopra','i18n/locales/it.ts'],
 ['Famiglie','Anton, Impact','Anton, Impact, Arial Narrow; Hanken Grotesk Variable, system-ui…','tokens.less'],
]))
write('Typography.dc.html','Typography','\n'.join(S))
