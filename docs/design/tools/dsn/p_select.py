from parts import *
NAMES=[('de','Deutsch'),('en','English'),('es','Español'),('fr','Français'),('it','Italiano')]
def opt(label,state='',sel=False,check=True):
    a=f' aria-selected="{"true" if sel else "false"}"'
    d=' data-active="true"' if state=='active' else ' data-active="false"'
    cls='select-field__option'+(' is-hover' if state=='hover' else '')+(' is-active' if state=='press' else '')
    return f'<div role="option"{a}{d} class="{cls}"><span>{label}</span>{icon("check") if sel else ""}</div>'
def trigger(value,state='',expanded=False,show_label=False,label='Lingua',ic=True,panel=False):
    cls='select-field__trigger'+(f' {state}' if state else '')
    lab=f'<span class="select-field__label">{label}</span>' if show_label else ''
    return (f'{lab}<button type="button" class="{cls}" aria-haspopup="listbox" aria-expanded="{"true" if expanded else "false"}">'
            f'{icon("languages") if ic else ""}<span>{value}</span><svg class="lucide chevron" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></button>')
def popover(sel='it',state_row=None):
    rows=''
    for code,name in NAMES:
        st=''
        if code==state_row: st='active'
        rows+=opt(name,st,sel==code)
    return f'<div class="select-field select-field--popover">{trigger(dict(NAMES)[sel],expanded=True)}<div class="select-field__list" role="listbox" tabindex="-1">{rows}</div></div>'
def inline(sel='it',open_=True):
    rows=''.join(opt(n,'active' if c=='en' else '',sel==c) for c,n in NAMES)
    lst=f'<div class="select-field__list" role="listbox" tabindex="-1"{" data-open=\"\"" if open_ else ""}>{rows}</div>'
    return f'<div class="select-field select-field--inline">{trigger(dict(NAMES)[sel],expanded=open_,show_label=True,ic=False)}{lst}</div>'
def native(sel='it'):
    o=''.join(f'<option value="{c}"{" selected=\"selected\"" if c==sel else ""} lang="{c}">{n}</option>' for c,n in NAMES)
    return f'<label class="select-field select-field--native"><span class="visually-hidden">Lingua</span><span class="select-field__trigger">{icon("languages")}<select>{o}</select>{icon("chevron-down")}</span></label>'
S=[]
S.append(h1('Select','Un solo selettore, <code>SelectField</code>, con tre forme: nativo (dispositivi senza puntatore fine), elenco a comparsa (desktop) ed elenco in linea (pannello del menu su mobile).'))
S.append(hdr('SelectField: trigger, elenco, opzioni, stati e le tre forme; esempio reale dello switcher di lingua',
  'src/components/ui/SelectField/ (SelectField.tsx, SelectField.less, position.ts); movimento in src/styles/motion.less; uso in src/components/layout/LanguageSwitcher/',
  'Chevron (src/components/ui/Chevron); icone Lucide (Languages, Check, ChevronDown)'))
trg=''.join(cell(l,f'<div class="select-field select-field--popover">{trigger("Italiano",st)}</div>') for l,st in [('Normale',''),('Hover','is-hover'),('Premuto','is-active'),('Focus tastiera','is-focus')])
trg+=cell('Aperto',f'<div class="select-field select-field--popover">{trigger("Italiano",expanded=True)}</div>')
S.append(sec('Trigger','Pillola <code>--row-hover</code> con icona, valore e chevron. Il focus ha l\'anello <code>--focus-color</code>: ink in chiaro, oro in scuro, come ogni altro controllo (<code>SelectField.less</code> r.37-40). Nella variante in linea su pannello scuro è oro (<code>--highlight</code>, r.193-195). Dentro <code>.on-panel</code> il fondo è <code>--panel-2</code>.',
  both('720px',f'<div style="display:flex;gap:var(--sp-5);flex-wrap:wrap;align-items:flex-start">{trg}</div>','',bg='var(--bg)')
  +frame('dark','720px','<div class="on-panel" style="background:var(--panel);padding:var(--sp-4);border-radius:var(--r-md);display:flex;gap:var(--sp-4);flex-wrap:wrap">'+''.join(f'<div class="select-field select-field--popover">{trigger("Italiano",st)}</div>' for st in ['','is-hover','is-active','is-focus'])+'</div>','Su pannello scuro')))
S.append(sec('Elenco a comparsa (desktop)','Elenco <code>--surface</code>, raggio <code>--r-md</code>, ombra <code>--shadow-pop</code> (livello 2: è un overlay), opzioni da 3,25rem. Opzione selezionata: fondo <code>--ink</code>, testo <code>--bg</code>, spunta. L\'opzione attiva da tastiera ha l\'anello interno.',
  both('420px',f'<div class="demo-open" style="min-height:22rem;display:flex;justify-content:flex-end">{popover("it","en")}</div>','')))
S.append(sec('Elenco in linea (pannello del menu su mobile)','Trigger a tutta larghezza (3,25rem) e elenco <code>--panel-2</code> che spinge il contenuto; opzione selezionata in oro.',
  frame('dark','420px',f'<div class="on-panel demo-open" style="background:var(--panel);padding:var(--sp-4);border-radius:var(--r-md)">{inline("it")}</div>','Aperto · scuro')
  +frame('light','420px',f'<div class="on-panel" style="background:var(--panel);padding:var(--sp-4);border-radius:var(--r-md)">{inline("it",False)}</div>','Chiuso')))
S.append(sec('Nativo (senza puntatore fine)','Su touch il componente usa il <code>&lt;select&gt;</code> del sistema dentro lo stesso trigger.',
  both('360px',f'<div class="select-field select-field--native" style="display:inline-flex">{native()[native().index("<span class=\"select-field__trigger"):native().rindex("</label>")] if False else native()}</div>','')))
S.append(sec('Opzioni: stati','',both('420px',f'<div class="demo-open"><div class="select-field select-field--popover"><div class="select-field__list" role="listbox">{opt("Normale")}{opt("Hover","hover")}{opt("Attiva da tastiera","active")}{opt("Premuta","press")}{opt("Selezionata","",True)}</div></div></div>','')))
S.append(sec('Lingue','Nomi nella loro lingua (<code>shared/languages.ts</code>): Deutsch, English, Español, Français, Italiano. Etichetta del selettore, chiave <code>nav.language</code>.',
   tbl(['Lingua','Etichetta del selettore (nav.language)'],[[l,L('nav.language',l)] for l in LANGS])))
S.append(sec('Valori nel codice: SelectField.less','',spec('components/ui/SelectField/SelectField.less')))
S.append(sec('Valori nel codice: chevron','',spec('components/ui/Chevron/Chevron.less')))
S.append(sec('Valori nel codice: movimento del select','Da <code>motion.less</code>.',spec('styles/motion.less',r'select-field|chevron')))
S.append(sec('Regole','',ul(['Tastiera: frecce, Home, Fine, digitazione per iniziale (type-ahead), Esc chiude e riporta il focus al trigger.',
  'L\'elenco a comparsa si apre sopra o sotto il trigger a seconda dello spazio (<code>data-placement="above"</code> inverte il movimento di 4px).',
  'Selezionata non vuol dire hover: l\'opzione selezionata cambia solo con <code>--ink-hover</code> e <code>--ink-press</code>.'])))
S.append(prima_dopo([
 ['Anello di focus del trigger','non descritto','<code>--focus-color</code>: ink in chiaro, oro in scuro; oro anche sul pannello scuro nella variante in linea (correzione del codice, ora su main)','SelectField.less r.37-40, r.205-207'],
 ['Altezze','non verificate','trigger 3rem; inline 3,25rem; opzione 3,25rem','SelectField.less r.28, 75, 144'],
 ['Elenco','sfondo e raggio dichiarati a mano','<code>--surface</code>, <code>--r-md</code>, <code>--shadow-pop</code>; inline <code>--panel-2</code>','SelectField.less r.98-125'],
]))
write('Select.dc.html','Select','\n'.join(S))
