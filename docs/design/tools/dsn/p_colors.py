from parts import *
import tokparse as TP, contrast as CT
def sw(n,theme): return f'<span style="display:inline-block;inline-size:var(--sp-8);block-size:var(--sp-6);border-radius:var(--r-tiny);background:var({n});box-shadow:inset 0 0 0 1px var(--line);vertical-align:middle"></span>'
def tokrows(names,swatch=True):
    r=[]
    for n in names:
        if n not in TP.T: continue
        lv=TP.val(n,'light'); dv=TP.val(n,'dark')
        l=f'<code>{lv[0]}</code> <span class="ln">r.{lv[1]}</span>'
        d=f'<code>{dv[0]}</code> <span class="ln">r.{dv[1]}</span>' if dv!=lv else '<span class="ln">come in chiaro</span>'
        cell_l=f'<div data-theme="light" style="display:inline-block;background:var(--bg);padding:var(--sp-1);border-radius:var(--r-tiny)">{sw(n,"light")}</div>' if swatch else ''
        cell_d=f'<div data-theme="dark" style="display:inline-block;background:var(--bg);padding:var(--sp-1);border-radius:var(--r-tiny)">{sw(n,"dark")}</div>' if swatch else ''
        r.append([f'<code>{n}</code>',cell_l+' '+l,cell_d+' '+d])
    return tbl(['Token','Chiaro','Scuro'],r)
G=[
 ('Fondi e righe','Pagina, schede, righe del planner e stati disabilitati.',['--bg','--surface','--row','--row-hover','--row-press','--disabled','--row-open-hover','--row-open-press']),
 ('Testo','Inchiostro e varianti; i colori “su scuro” non cambiano col tema.',['--ink','--ink-2','--ink-static','--ink-hover','--ink-press','--on-dark','--muted-on-dark','--on-disabled','--white','--deepest']),
 ('Accento e primario','Accento rosso; il primario è rosso in chiaro e oro in scuro.',['--accent','--accent-hover','--accent-active','--accent-text','--accent-on-dark','--on-accent','--primary','--primary-hover','--primary-press','--primary-hover-on-panel','--on-primary']),
 ('Evidenza','Oro: focus su scuro, selezioni su pannello, primario in scuro.',['--highlight','--highlight-hover','--highlight-active']),
 ('Pericolo','Errori. Per il testo si usa <code>--danger-text</code>.',['--danger','--danger-text','--on-danger']),
 ('Pannelli scuri','Footer, menu, righe aperte, toast, zona spoiler.',['--panel','--panel-2','--panel-3','--raised','--raised-2','--raised-3']),
 ('Linee, velo e tracce','',['--line','--scrim','--track-panel','--track-surface','--sb-thumb','--sb-thumb-hover','--sb-track']),
]
S=[]
S.append(h1('Colors','Palette, ruoli chiaro/scuro, focus, ombre e coppie di contrasto: tutto letto da <code>tokens.less</code>.'))
S.append(hdr('Token di colore per tema, anello di focus, tre livelli di ombra, contrasti calcolati',
 'src/styles/tokens.less (blocchi .light-tokens(), .dark-tokens(), :root); usi in tutti i .less',
 'Tutti i componenti leggono questi token; nessun componente scrive un colore a mano'))
for t,sub,names in G:
    S.append(sec(t,sub,f'<div class="dc-scroll">{tokrows(names)}</div>'))
S.append(sec('Focus','Anello “a filo”: <code>--focus: 3px solid var(--focus-color)</code>, spessore e distanza dal bordo uguali per tutti, in chiaro <b>ink</b>, in scuro <b>oro</b> (<code>--focus-color</code>). Per le superfici scure o riempite: <code>--focus-on-inverse</code>. Nessun focus rosso.',
 tbl(['Token','Chiaro','Scuro'],[[f'<code>{n}</code>',f'<code>{TP.val(n,"light")[0]}</code> <span class="ln">r.{TP.val(n,"light")[1]}</span>',f'<code>{TP.val(n,"dark")[0]}</code> <span class="ln">r.{TP.val(n,"dark")[1]}</span>'] for n in ('--focus-color','--focus','--focus-offset','--focus-on-inverse')])
 +both('480px',f'<div style="display:flex;gap:var(--sp-4);flex-wrap:wrap">{btn("surface","Pulsante","","is-focus")}{btn("primary","Primario","","is-focus")}</div>','Anello di focus')))
S.append(sec('Ombre: tre livelli','Livello 0: nessuna ombra sui componenti. Livello 1: <code>--shadow-card</code> (StatusPage). Livello 2: <code>--shadow-pop</code> per gli overlay (popup, elenco del select, toast in scuro).',
 tbl(['Token','Chiaro','Scuro'],[[f'<code>{n}</code>',f'<code>{TP.val(n,"light")[0]}</code> <span class="ln">r.{TP.val(n,"light")[1]}</span>',f'<code>{TP.val(n,"dark")[0]}</code> <span class="ln">r.{TP.val(n,"dark")[1]}</span>'] for n in ('--shadow-card','--shadow-pop','--toast-shadow')])
 +both('560px','<div style="display:flex;gap:var(--sp-6)"><div style="padding:var(--sp-4);background:var(--surface);border-radius:var(--r-md)">0</div><div style="padding:var(--sp-4);background:var(--surface);border-radius:var(--r-md);box-shadow:var(--shadow-card)">1</div><div style="padding:var(--sp-4);background:var(--surface);border-radius:var(--r-md);box-shadow:var(--shadow-pop)">2</div></div>','Livello 0 · 1 · 2')
 +tbl(['Dove nel codice','Livello','Fonte'],[
  ['StateBox','0 (esplicito <code>box-shadow: none</code>)','StateBox.less r.64'],
  ['StatusPage','1','StatusPage.less r.13'],
  ['Modal, elenco del select','2','Modal.less r.14, SelectField.less r.123'],
  ['Toast','2, solo scuro (<code>--toast-shadow</code>)','Toast.less r.32'],
  ['<code>.card</code>, pannello dettagli del titolo','0 (nessuna ombra)','base.less (blocco <code>.card</code>), TitleDetailsPanel.less (<code>.film__card</code>)'],
 ])))
pairs=CT.get()
rows=[]
for i,(fg,bg) in enumerate(CT.PAIRS):
    l=pairs['light'][i]; d=pairs['dark'][i]
    ok=lambda r:'sì' if r>=4.5 else ('solo testo grande/icone (≥3)' if r>=3 else 'no')
    rows.append([f'<code>{fg}</code> su <code>{bg}</code>',f'{l[2]}:1 · {ok(l[2])}',f'{d[2]}:1 · {ok(d[2])}'])
S.append(sec('Coppie e contrasti','Rapporti WCAG calcolati sui colori risolti dal browser con i token del codice (soglia 4,5:1 per il testo, 3:1 per testo grande e componenti).',tbl(['Coppia','Chiaro','Scuro'],rows)))
fc=TP.val('--focus-color','light')[1]; fd=TP.val('--focus-color','dark')[1]; ff=TP.T['--focus']['light'][1]
S.append(prima_dopo([
 ['Valori di colore','valori scritti a mano nella pagina','tokens.less (120 token), compilato in <code>tokens.css</code> del canvas','tokens.less'],
 ['<code>--focus</code>','<code>3px solid var(--accent)</code> (rosso)',f'<code>3px solid var(--focus-color)</code>: ink in chiaro, oro in scuro','tokens.less r.%d, r.%d, r.%d'%(fc,fd,ff)],
 ['Famiglie di font','Anton, Impact; Hanken Grotesk','Anton, Impact, Arial Narrow; Hanken Grotesk Variable, system-ui, -apple-system, Segoe UI','tokens.less'],
 ['Ombre','5 livelli','3 livelli (0, 1 StatusPage, 2 overlay); <code>.card</code> e pannello del film senza ombra','base.less, TitleDetailsPanel.less'],
]))
write('Colors.dc.html','Colors','\n'.join(S))
