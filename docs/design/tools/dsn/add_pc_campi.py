"""Blocco della pagina «Textfield»: mappa dei campi di testo e focus senza doppio bordo (voce 24).
Scritto a mano nel canvas (non rigenerabile da p_textfield.py): `python add_pc_campi.py` lo inserisce
in canvas/Textfield.dc.html (una volta sola) e aggiunge le regole `.pc-*` al <style> della pagina."""
import sys, re
from add_pc_lib import *
HELM_CSS='''/* pc: voci 22-24 (popup e campi) */
.pc-ctx{padding:var(--sp-4);box-shadow:inset 0 0 0 1px var(--line);border-radius:var(--r-md);background:var(--bg);color:var(--ink);--field-bg:var(--surface)}
.pc-ctx--pop{background:var(--surface);--field-bg:var(--bg)}
.pc-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(15rem,1fr));gap:var(--sp-3) var(--sp-4);align-items:start}
.pc-grid .field{gap:var(--sp-1)}
.pc-cap{font-size:var(--fs-caption);font-weight:800;text-transform:uppercase;letter-spacing:.06em;color:var(--ink-2);margin:0 0 var(--sp-1)}
.pc-ctx .planner-search__field.is-hover{box-shadow:inset 0 0 0 2px var(--row-hover)}
.pc-ctx .planner-search__field.is-focus{outline:var(--focus);outline-offset:0}
.pc-prop input.is-focus,.pc-prop textarea.is-focus{box-shadow:none!important}
.pc-prop .planner-search__field.is-focus.is-hover{box-shadow:inset 0 0 0 2px transparent}
.pc-b input:not(.is-focus):not(:disabled):not([aria-invalid]),.pc-b textarea:not(.is-focus):not(:disabled):not([aria-invalid]){box-shadow:inset 0 0 0 1px var(--ink-2)!important}
.pc-b input.is-hover:not(.is-focus):not([aria-invalid]),.pc-b textarea.is-hover:not(.is-focus):not([aria-invalid]){box-shadow:inset 0 0 0 2px var(--ink-2)!important}
.pc-b .planner-search__field:not(.is-focus){box-shadow:inset 0 0 0 1px var(--ink-2)}
.pc-off input.is-focus,.pc-off textarea.is-focus{outline-offset:3px!important}
.pc-keep input[aria-invalid].is-focus{box-shadow:inset 0 0 0 2px var(--danger)!important}
.pc-lens{overflow:hidden;position:relative;border-radius:var(--r-sm)}
.pc-lens>div{zoom:3;width:300px;padding:6px}
.pc-lens .field__label,.pc-lens .field__message{display:none}.pc-lens .field{gap:0}'''
E1='nome@dominio.it'
ERR=L('auth.errors.invalidEmail')
def ctx(theme,kind,inner,cls='pc-prop',w=None):
    st=f' style="width:{w}px;max-width:100%"' if w else ''
    return f'<div data-theme="{theme}" class="pc-ctx pc-ctx--{kind} {cls}"{st}>{inner}</div>'
def lbl(t,theme,kind,inner,cls='pc-prop',w=None):
    return f'<div class="dc-fw"><div class="dc-fl">{t}</div>{ctx(theme,kind,inner,cls,w)}</div>'
def cap(t): return f'<p class="pc-cap">{t}</p>'
def cellf(c,h): return f'<div>{cap(c)}{h}</div>'
# ---- gruppi di stati
def g_text():
    em=L('auth.email'); nm=L('auth.name')
    return [('Riposo',fld(em,'',ph=E1)),
     ('Hover',fld(em,E1,'is-hover')),
     ('Focus (mouse e tastiera)',fld(em,E1,'is-focus')),
     ('Hover + focus',fld(em,E1,'is-hover is-focus')),
     ('Compilato',fld(nm,'Peter',msg=L('auth.nameHint'),cnt='5/24')),
     ('Con contatore',fld(nm,'Peter Parker',cnt='12/24',msg=L('auth.nameHint'))),
     ('Con «svuota»',fld(em,E1,typ='email',clear=True)),
     ('Con «svuota» + focus',fld(em,E1,'is-focus',typ='email',clear=True)),
     ('Invalido',fld(em,'nome@',err=ERR)),
     ('Invalido + focus',fld(em,'nome@','is-focus',err=ERR)),
     ('Disattivo',fld(em,E1,dis=True)),
     ('Sola lettura',fld(em,E1,ro=True))]
def g_pw():
    pw=L('auth.password'); H=L('auth.passwordHint',min=8)
    return [('Riposo',fld(pw,'',typ='password',eye=True,msg=H)),
     ('Compilata',fld(pw,'Spidey2099',typ='password',eye=True,msg=H)),
     ('Visibile',fld(pw,'Spidey2099',visible=True,eye=True,msg=H)),
     ('Focus',fld(pw,'Spidey2099','is-focus',typ='password',eye=True,msg=H)),
     ('Hover + focus',fld(pw,'Spidey2099','is-hover is-focus',typ='password',eye=True,msg=H)),
     ('Blocco maiuscole',fld(pw,'Spidey',typ='password',eye=True,caps=True)),
     ('Invalida + focus',fld(pw,'abc','is-focus',typ='password',eye=True,err=L('auth.errors.passwordShort',min=8))),
     ('Disattiva',fld(pw,'Spidey2099',typ='password',eye=True,dis=True))]
LONG='Nella scena dopo i titoli di coda compare un personaggio che nessuno si aspettava e il testo che ho scritto continua per diverse righe, così da superare l\'altezza della riga e far comparire la barra di scorrimento dentro il campo.'
def g_ta():
    f=L('suggest.field') if False else 'Cosa va corretto?'
    return [('Riposo',fld(f,'',ta=3,ph='Scrivi la correzione',cnt='0/500')),
     ('Hover',fld(f,'','is-hover',ta=3,ph='Scrivi la correzione',cnt='0/500')),
     ('Focus',fld(f,'Il titolo è sbagliato.','is-focus',ta=3,cnt='23/500')),
     ('Hover + focus',fld(f,'Il titolo è sbagliato.','is-hover is-focus',ta=3,cnt='23/500')),
     ('Compilata, scorre dentro',fld(f,LONG,ta=3,cnt='219/500')),
     ('Senza maniglia (resize: none)',fld(f,'Il titolo è sbagliato.',ta=3,cnt='23/500',resize='none')),
     ('Invalida',fld(f,'',ta=3,err='Messaggio di errore (testo di prova)',cnt='0/500')),
     ('Invalida + focus',fld(f,'','is-focus',ta=3,err='Messaggio di errore (testo di prova)',cnt='0/500')),
     ('Disattiva',fld(f,'Il titolo è sbagliato.',ta=3,dis=True,cnt='23/500'))]
def g_sel():
    t='Titolo'
    return [('Riposo',select(t,'Iron Man')),('Hover (nessun cambio)',select(t,'Iron Man')),('Focus tastiera',select(t,'Iron Man','is-focus')),
            ('Aperto',select(t,'Iron Man',exp=True))]
def g_src():
    return [('Riposo',search()),('Hover',search('','is-hover')),('Focus',search('','is-focus')),('Hover + focus',search('','is-hover is-focus')),('Compilata, con «svuota»',search('Iron Man'))]
def group(title,sub,items,w=560,cls='pc-prop',pop=True):
    cells=''.join(cellf(c,h) for c,h in items)
    mk=lambda th,k: lbl(f'{title} · {"pagina" if k=="page" else "popup"} · {th}',th,k,f'<div class="pc-grid">{cells}</div>',cls,w)
    return sec(title,sub,row(mk('light','page'),mk('dark','page'))+(row(mk('light','pop'),mk('dark','pop')) if pop else ''))
def lens(t,theme,st,inv=False,cls=''):
    f=fld('',E1,st,inv=inv)
    return (f'<div class="dc-fw"><div class="dc-fl">{t}</div><div data-theme="{theme}" class="pc-ctx pc-ctx--pop {cls}" style="padding:0"><div class="pc-lens" style="width:270px;height:130px;background:var(--surface)"><div>{f}</div></div></div></div>')
VARS=[('V0','Oggi','',''),('V1b','Proposta','pc-prop',''),('V1','Variante: errore resta rosso a fuoco','pc-prop pc-keep',''),('V2','Variante: anello staccato 3 px','pc-off',''),('V3','Variante: bordo a riposo 1 px','pc-prop pc-b','')]
STT=[('riposo',''),('hover','is-hover'),('focus','is-focus'),('hover + focus','is-hover is-focus'),('invalido',''),('invalido + focus','is-focus')]
def vcol(theme,name,cls):
    h=''.join(f'<div><div class="pc-cap">{n}</div>{fld("",E1,st,inv=n.startswith("invalido")).replace("<div class=\"field__label\"><label","<div class=\"field__label\" hidden><label").replace("<p id","<p hidden id")}</div>' for n,st in STT)
    return f'<div class="dc-fw" style="width:13rem"><div class="dc-fl">{name}</div>{ctx(theme,"pop",f"<div class=\"pc-grid\" style=\"grid-template-columns:1fr\">{h}</div>",cls)}</div>'
def build(only390=False,skip390=False):
    prop=tag('proposta · non implementata','k2')
    why=('<b>Raccomandazione (V1b, la riga «Proposta»).</b> Il difetto è reale e ha una causa sola: <code>base.less</code> r.215 disegna l\'hover come <code>inset 0 0 0 2px var(--row-hover)</code> e <code>:focus-visible</code> (r.217-219) non lo spegne; con il mouse sopra un campo a fuoco l\'anello esterno (3 px, <code>Field.less</code> r.34-36, offset 0) e la riga interna da 2 px sono due contorni contigui (5 px in tutto). '
         'La ricerca del planner lo fa già bene (<code>PlannerSearch.less</code> r.22-25: l\'hover vale solo <code>:not(:focus-within)</code>). '
         '<b>Regola unica: un solo contorno per volta.</b> A fuoco c\'è l\'anello e nient\'altro dentro il campo: né hover né riga rossa dell\'errore; restano il fondo (<code>--danger</code> al 12%), il messaggio con icona e il colore del testo. Si applica a TextField, PasswordField, TextArea e ricerca; il trigger del select ha già il suo anello staccato come i pulsanti e non cambia.')
    alt=ul(['<b>Distanza dell\'anello: 0 (resta).</b> L\'anello da 3 px a filo non tocca etichetta (gap 8 px) né messaggio. <b>Alternativa V2:</b> staccato di <code>--focus-offset</code> (3 px) come i pulsanti: separa bene dall\'ombra interna, ma l\'anello occupa 6 px e arriva a 2 px dalla riga dell\'etichetta e dal messaggio (<code>Field.less</code> r.32-33 lo scartava per questo); in più, spento l\'hover, il distacco non serve.',
            '<b>Errore a fuoco: riga rossa spenta (V1b).</b> <b>Alternativa V1:</b> la riga rossa resta (come decide la voce «campo in errore: hover e focus» più sotto, confermata dal codice): l\'errore si legge anche mentre si corregge, ma torna un doppio contorno rosso + ink o oro. Questa proposta <b>supera quella decisione</b> per il solo stato «invalido + focus».',
            '<b>Bordo a riposo: nessuno (resta), con un punto aperto.</b> Il campo si distingue solo dal fondo: <b>1,11:1 in chiaro e 1,19:1 in scuro</b> (calcolo sui token, tabella sotto), sotto il 3:1 che WCAG 1.4.11 chiede a un componente quando il contorno serve a riconoscerlo; lo salvano l\'etichetta sopra, il segnaposto e, in contrasto alto, il bordo di <code>forced-colors.less</code> r.367-377. <b>Alternativa V3:</b> bordo interno 1 px <code>--ink-2</code> (7,1:1 chiaro, 8,5:1 scuro), 2 px a hover, spento a fuoco: nessun token nuovo, ma cambia il carattere morbido dei campi. <b>Decisione del committente</b>; V3 è disegnata.',
            '<b>Altezza e padding: invariati.</b> 3 rem, <code>padding: 0 var(--sp-4)</code>, raggio <code>--r-input</code> (16 px) (<code>base.less</code> r.194-198): misurati 48 px, 16 px, 16 px. «Svuota» e occhio: 44 px (<code>--hit</code>) a 2 px da sopra e da destra (<code>Field.less</code> r.66-75), con <code>padding-right: 3.5rem</code> (r.206-208).',
            '<b>Etichetta, contatore, messaggio: invariati.</b> Etichetta sopra (21 px di riga), contatore a destra nella stessa riga, messaggio sotto con altezza minima 20 px (<code>min-height: 1.25rem</code>), gap 8 px: blocco da 105 px misurato. Il messaggio non sposta mai nulla.',
            '<b>TextArea.</b> Stessi stati dei campi; padding <code>--sp-3</code> / <code>--sp-4</code>, interlinea 24 px, altezza dalle <code>rows</code> (3 righe = 96 px, 5 = 144 px, misurato). <b>Maniglia: resta (<code>resize: vertical</code>).</b> È del browser (non si disegna), compare solo con il puntatore fine, sta dentro l\'angolo da 16 px senza uscirne (disegno sotto); <b>alternativa:</b> <code>resize: none</code> e righe fisse, più pulita ma costringe chi scrive molto a scorrere dentro 5 righe. Con la barra di scorrimento dentro il campo (12 px, <code>--sb-size</code>) il testo non passa sotto (disegnato).',
            '<b>Trigger del select e ricerca:</b> mappati, nessuna modifica. Il trigger è una pillola da 52 px su <code>--row-hover</code> (<code>SelectField.less</code> r.154-165, variante <code>--inline</code> r.200-213), non un campo da 48 px con 16 px di raggio: nello stesso popup (Admin, date) i due si affiancano con forme diverse; è voluto (apre un elenco, come un pulsante) e il resto della famiglia pulsanti ha lo stesso aspetto. A fuoco con la tastiera l\'anello sta a 3 px (r.167-170); al clic col mouse non compare. A hover non cambia nulla.'])
    # 1. difetto, lente
    lent=row(lens('Oggi · hover + focus · chiaro (×3)','light','is-hover is-focus'),lens('Oggi · hover + focus · scuro (×3)','dark','is-hover is-focus'),
             lens('Proposta · hover + focus · chiaro (×3)','light','is-hover is-focus',cls='pc-prop'),lens('Proposta · hover + focus · scuro (×3)','dark','is-hover is-focus',cls='pc-prop'))
    lent2=row(lens('Oggi · invalido + focus · chiaro (×3)','light','is-focus',True),lens('Oggi · invalido + focus · scuro (×3)','dark','is-focus',True),
              lens('Proposta · invalido + focus · chiaro (×3)','light','is-focus',True,'pc-prop'),lens('Proposta · invalido + focus · scuro (×3)','dark','is-focus',True,'pc-prop'))
    s1=sec('Il difetto, ingrandito tre volte','Fuori l\'anello (3 px, ink in chiaro, oro in scuro); dentro la riga dell\'hover (2 px) o dell\'errore. Nella colonna di sinistra si leggono due contorni, a destra uno solo.',col(lent,lent2))
    # 2. confronto
    cmp_=''.join(row(*[vcol(th,f'{k} · {n} · {th}',c) for k,n,c,_ in VARS]) for th in ('light','dark'))
    s2=sec('Confronto delle varianti','Stesso campo, sei stati, popup chiaro e scuro. V0 è il codice di oggi.',cmp_)
    gt=group('Campo di testo (TextField)','Tutti gli stati con la proposta applicata. «Pagina»: campo <code>--surface</code> su <code>--bg</code>; «popup»: campo <code>--bg</code> su <code>--surface</code> (<code>Modal.less</code> r.5).',g_text())
    gp=group('Campo password (PasswordField)','Occhio da 44 px come «svuota» (<code>field__button</code>); con il blocco maiuscole il suggerimento diventa avviso.',g_pw())
    ga=group('Area di testo (TextArea)','Nuova (voce 18): stessi stili di <code>input</code> (<code>base.less</code> r.228-233). La maniglia in basso a destra è quella del browser. Il modulo «Suggerisci» non mostra oggi errori di campo: il messaggio della variante invalida è un testo di prova.',g_ta())
    gs=group('Trigger del select (SelectField)','Variante in linea, come nel popup Admin; l\'elenco aperto è nella pagina Select.',g_sel())
    gr=group('Ricerca del planner (PlannerSearch)','Sta solo in pagina. Pillola da 56 px (<code>--row-h</code>); l\'anello sta sul contenitore (<code>:focus-within</code>) e l\'hover è già spento a fuoco.',g_src(),pop=False)
    # 390
    ph1=fr('Telefono 390 px · popup (bottom sheet) · chiaro','light',390,560,popup('Suggerisci una modifica',
        fld('Cosa va corretto?','Il titolo è sbagliato.','is-focus',ta=3,cnt='23/500',msg='')+fld(L('auth.email'),E1,'is-hover',typ='email',clear=True)+fld(L('auth.email'),'nome@',err=ERR)),
        'body{background:var(--scrim)}.dialog__scroll{max-height:none}dialog.dialog{position:static!important;margin:0!important;border-radius:var(--r-lg) var(--r-lg) 0 0}.is-hover{}'+'input.is-focus,textarea.is-focus{box-shadow:none!important}')
    ph2=fr('Telefono 390 px · popup · scuro','dark',390,560,popup('Suggerisci una modifica',
        fld('Cosa va corretto?','Il titolo è sbagliato.','is-focus',ta=3,cnt='23/500',msg='')+fld(L('auth.email'),E1,'is-hover',typ='email',clear=True)+fld(L('auth.email'),'nome@',err=ERR)),
        'body{background:var(--scrim)}.dialog__scroll{max-height:none}dialog.dialog{position:static!important;margin:0!important;border-radius:var(--r-lg) var(--r-lg) 0 0}'+'input.is-focus,textarea.is-focus{box-shadow:none!important}')
    ph3=fr('Telefono 390 px · pagina · chiaro e scuro (ricerca, campo, select)','light',390,330,
        search('','is-focus')+'<div style="height:16px"></div>'+fld('Nome da supereroe','Peter','',cnt='5/24',msg=L('auth.nameHint'))+select('Titolo','Iron Man'),
        '.field{--field-bg:var(--surface)}.planner-search__field.is-focus{outline:var(--focus);outline-offset:0}')
    global PHONES
    PHONES=[ph1,ph2,ph3]
    s390=sec('Telefono, 390 px','Il campo è <code>width: 100%</code> senza altri breakpoint: cambiano solo i margini del popup (24 px). Sul telefono il tocco non ha hover (<code>@media (hover: hover)</code> in <code>.on-hover</code>): restano riposo, focus, errore.',row(ph1,ph2,ph3))
    # misure
    meas=tbl(['Misura (Chromium, font veri, riga di prova a 520 px)','Valore','Da'],[
      ['Campo di testo: altezza / raggio / padding laterale','48 px / 16 px / 16 px','base.less r.194-198'],
      ['Etichetta (riga) / gap etichetta-campo / gap campo-messaggio / messaggio','21 px / 8 px / 8 px / 20 px (minimo)','base.less r.250-253; Field.less r.10-14, r.39-47'],
      ['Blocco campo completo (etichetta + campo + messaggio)','105 px','misurato'],
      ['«Svuota» e occhio','44 × 44 px, a 2 px da sopra e da destra; <code>padding-right</code> del campo 56 px','Field.less r.66-75; base.less r.206-208'],
      ['TextArea 3 righe / 5 righe','96 px / 144 px (24 px di interlinea + 12 px di padding sopra e sotto)','base.less r.228-233; Field.tsx r.248-285 (<code>rows = 5</code> di default)'],
      ['Trigger del select (in linea) / ricerca del planner','52 px, pillola / 56 px, pillola','SelectField.less r.200-213; PlannerSearch.less r.9-20'],
      ['Anello di focus','3 px, <code>--focus-color</code>; offset 0 nei campi, 3 px sul trigger e sui pulsanti','tokens.less (<code>--focus</code>, <code>--focus-offset</code>); Field.less r.34-36'],
      ['Ombra interna oggi','hover 2 px <code>--row-hover</code>; errore 2 px <code>--danger</code>, fondo <code>--danger</code> al 12%','base.less r.215, r.240-248'],
      ['Transizione','fondo e ombra, <code>--dur-hover</code> (120 ms; 80 ms con movimento ridotto), <code>--ease-out</code>','base.less r.202-205']])
    con=tbl(['Coppia (WCAG 1.4.11 chiede 3:1 per il contorno)','Chiaro','Scuro'],[
      ['Campo su sfondo: <code>--bg</code> / <code>--surface</code> (in entrambi i sensi)','1,11:1','1,19:1'],
      ['Hover <code>--row-hover</code> su <code>--bg</code> / su <code>--surface</code>','1,12:1 / 1,25:1','1,97:1 / 1,65:1'],
      ['<b>V3</b>: <code>--ink-2</code> su <code>--bg</code> / su <code>--surface</code>','6,4:1 / 7,1:1','10,1:1 / 8,5:1'],
      ['Anello: <code>--focus-color</code> (ink / oro) su <code>--bg</code>','15,1:1 (ink)','10,2:1 (oro)'],
      ['Errore: <code>--danger</code> su <code>--bg</code>','5,5:1','7,0:1'],
      ['Campo disattivo: <code>--disabled</code> su <code>--surface</code>','1,43:1','2,0:1 (il testo usa <code>--on-disabled</code>)']])
    hc=ul(['Contrasto alto (<code>forced-colors.less</code> r.367-377): campi, ricerca e trigger prendono un bordo 1 px <code>ButtonBorder</code> e l\'anello diventa <code>Highlight</code> (r.374-377). Le ombre interne e i fondi sono scartati dal browser: <b>hover e riga rossa dell\'errore spariscono già oggi</b>, resta il messaggio con icona e testo (l\'errore non è affidato al solo colore). La proposta non tocca <code>forced-colors.less</code>: spegnere l\'ombra a fuoco non cambia nulla lì.',
            '<b>Non verificato:</b> l\'anello a filo sopra il bordo 1 px in modalità contrasto alto reale di Windows (nessuna emulazione disponibile qui); il comportamento della maniglia di <code>textarea</code> in Safari e Firefox; i campi fuori da <code>.field__control</code>, se ci sono (restano con l\'offset 3 px di <code>base.less</code> r.217-219).'])
    rule=('<pre><code>// base.less: fuori l\'ombra interna dell\'hover dal fuoco, come PlannerSearch.less r.22-25\ninput[type="text"], input[type="email"], input[type="password"], textarea, select {\n  …\n  // Hover only when the field is not focused: the ring is the only outline then.\n  &amp;:not(:focus-visible) {\n    .on-hover({ box-shadow: inset 0 0 0 2px var(--row-hover); });\n  }\n}\n\n'
          '// base.less: l\'errore a fuoco tiene il fondo rosato e perde la riga interna\ninput[aria-invalid="true"]:focus-visible, textarea[aria-invalid="true"]:focus-visible, select[aria-invalid="true"]:focus-visible {\n  box-shadow: none;\n}</code></pre>'
          +ul(['Nessun valore nuovo: <code>--row-hover</code>, <code>--danger</code>, <code>--focus</code> e <code>--focus-offset</code> restano; <code>Field.less</code> r.34-36 (offset 0) <b>non cambia</b>.',
               'L\'invalido a riposo e con hover non cambia (r.240-248 intatte): la nuova regola vale solo <code>:focus-visible</code> e deve stare <b>dopo</b> di esse (stessa specificità o più alta) per vincere. <code>select</code> è nei selettori ma il trigger usa un <code>button</code>: nessun effetto sul trigger.',
               'Test: nessuno nuovo (CSS puro, il progetto non ha test di componenti). Verifica a mano in chiaro e scuro: campo con mouse sopra e fuoco = un solo anello, nessuna riga dentro; campo invalido a fuoco = anello e fondo rosato, messaggio rosso sotto.',
               'Se il committente sceglie V3 (bordo a riposo): <code>box-shadow: inset 0 0 0 1px var(--ink-2)</code> a riposo, <code>2px</code> a hover, e le stesse due righe «a fuoco niente ombra»; <code>forced-colors.less</code> già mette il bordo 1 px.',
               'Deviazioni di DESIGN.md: «Campi di testo | <code>base.less</code> | a fuoco l\'ombra interna (hover, errore) è spenta: un solo contorno per volta, come la ricerca del planner | voce 24 di HANDOFF §2».']))
    pd=tbl(['Cosa','Prima','Dopo','File'],[
      ['Hover a fuoco','riga 2 px <code>--row-hover</code> sotto l\'anello (doppio contorno)','spenta: solo l\'anello','base.less r.215'],
      ['Errore a fuoco','riga 2 px <code>--danger</code> sotto l\'anello','spenta; restano fondo e messaggio','base.less r.240-248'],
      ['Anello','3 px, offset 0 nei campi','invariato','Field.less r.34-36'],
      ['Ricerca del planner','già a posto','invariata (la regola dei campi la imita)','PlannerSearch.less r.22-25'],
      ['Bordo a riposo','nessuno (1,11:1 / 1,19:1)','nessuno; V3 a scelta del committente','base.less']])
    return (f'<div class="dc-sec"><h2 class="dc-h2">Revisione · mappa dei campi di testo e focus senza doppio bordo (voce 24)</h2><div>{prop}</div>'
      '<p class="dc-sub">Riferimento: main 3dfc873 (TextArea e le sue regole di <code>base.less</code> sono già lì). Le demo usano le classi vere e la proposta applicata a parte (<code>.pc-prop</code>); i valori in px sono misurati nel browser con i font veri, il resto citato dal <code>.less</code>. La pagina non aveva una mappa d\'insieme: TextField, PasswordField, TextArea, trigger del select e ricerca stanno qui, in pagina e nel popup, chiaro e scuro.</p>'
      +box('Scelta · raccomandazione e alternative per ogni punto',f'<p>{why}</p>'+alt)
      +(s390 if only390 else (s1+s2+gt+gp+ga+gs+gr+('' if skip390 else s390)))
      +sec('Misure','Le stesse in pagina e nel popup; cambia solo il fondo del campo.',meas)
      +sec('Contrasti (calcolati sui token)','Non è una misura nel browser: rapporto di luminanza WCAG tra i colori di <code>tokens.less</code>.',con)
      +sec('Contrasto alto e cose non verificate','',hc)
      +sec('Regola per Code','Stato di partenza: main 3dfc873. Solo token esistenti. Il prompt completo (anche popup e accesso) è in <code>docs/design/PROMPT_CODE_POPUP_CAMPI.md</code>.',rule)
      +sec('Prima, dopo, file','',pd)+'</div>')
def insert():
    p=os.path.join(CANVAS,'Textfield.dc.html')
    t=open(p,encoding='utf-8',newline='').read()
    if 'mappa dei campi di testo e focus senza doppio bordo' in t: raise SystemExit('già inserito')
    end='\n</div>\n</x-dc>'; assert t.count(end)==1
    assert t.count('</style>')==1
    t=t.replace('</style>',HELM_CSS+'\n</style>',1)
    open(p,'w',encoding='utf-8',newline='').write(t.replace(end,'\n'+build()+end,1)); print('ok')
if __name__=='__main__':
    if VERIFY:
        # pagina di prova fuori dal canvas: stesso <style> e stessa struttura
        src=open(os.path.join(CANVAS,'Textfield.dc.html'),encoding='utf-8').read()
        st=re.search(r'<helmet>.*?<style>(.*?)</style>',src,re.S).group(1) if 'import re' else ''
        for nm,kw in (('v_campi.html',dict(skip390=True)),('v_campi390.html',dict(only390=True))):
            open(os.path.join(S,nm),'w',encoding='utf-8').write('<!doctype html><meta charset=utf-8><body>'+css()+FONT+f'<style>{st}{HELM_CSS}</style><div class="dc-pg">{build(**kw)}</div>')
        for n,f in enumerate(PHONES):
            open(os.path.join(S,f'v_campi390_{n}.html'),'w',encoding='utf-8').write('<!doctype html><meta charset=utf-8><body style="margin:0">'+f)
        print('verify ok')
    else: insert()
