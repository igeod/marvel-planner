from parts import *
S=[]
S.append(h1('Textfield','Campo di testo, campo password, messaggio sotto il campo, errore del modulo e requisito della password. Una sola definizione per i campi di tutti i popup e delle pagine. Assorbe Textfield, Revisione codice, Accesso roadmap e Accesso stati (parti sui campi).'))
S.append(hdr('TextField, PasswordField, FieldMessage, FormError, PasswordRequirement: struttura, stati, messaggi, spaziature, testi',
  'src/components/ui/Field/ (Field.tsx, Field.less); src/components/ui/FormError/; src/features/auth/components/PasswordRequirement/ e AuthFormError/; regole base di input in src/styles/base.less; spaziature del popup in src/features/auth/components/AuthDialogs/AuthDialogs.less',
  'Button (pulsanti dentro il campo usano <code>field__button</code>, non Button); icone Lucide; immagine err-429.webp per l\'errore di troppi tentativi'))
# states
H=L('auth.passwordHint',min=8)
def col(inner): return f'<div class="form" style="max-width:none">{inner}</div>'
states=[('Normale',tf(L('auth.email'),'','',hint='')),
 ('Con suggerimento',tf(L('auth.name'),'',hint=L('auth.nameHint'))),
 ('Hover',tf(L('auth.email'),'nome@dominio.it','is-hover')),
 ('Focus tastiera',tf(L('auth.email'),'nome@dominio.it','is-focus')),
 ('Con contatore e cancella',tf(L('auth.name'),'Peter',counter='5/24',hint=L('auth.nameHint'))),
 ('Email con tasto cancella',tf(L('auth.email'),'nome@dominio.it',clear=True,typ='email')),
 ('Errore',tf(L('auth.email'),'nome@',error=L('auth.errors.invalidEmail'))),
 ('Disabilitato',tf(L('auth.email'),'nome@dominio.it',disabled=True)),
 ('Sola lettura',tf(L('auth.email'),'nome@dominio.it',readonly=True))]
cells=''.join(f'<div class="dc-fw" style="width:19rem"><div class="dc-fl">{n}</div>{h}</div>' for n,h in states)
S.append(sec('Campo di testo','Sfondo <code>--bg</code> su <code>--surface</code> (nei dialog); il messaggio sotto occupa sempre la sua riga, così un errore non sposta nulla. Le demo usano le classi vere di <code>TextField</code>.',
  both('1100px',f'<div style="display:flex;flex-wrap:wrap;gap:var(--sp-6) var(--sp-4)">{cells}</div>','',bg='var(--surface)')))
# password
pw=[('Password',tf(L('auth.password'),'',eye=True,typ='password',hint=H)),
 ('Visibile',tf(L('auth.password'),'Spidey2099',eye=True,visible=True,hint=H)),
 ('Focus',tf(L('auth.password'),'Spidey2099',state='is-focus',eye=True,typ='password',hint=H)),
 ('Blocco maiuscole',tf(L('auth.password'),'Spidey',eye=True,typ='password',notice=L('auth.capsLock'))),
 ('Errore',tf(L('auth.password'),'abc',eye=True,typ='password',error=L('auth.errors.passwordShort',min=8)))]
cells=''.join(f'<div class="dc-fw" style="width:19rem"><div class="dc-fl">{n}</div>{h}</div>' for n,h in pw)
S.append(sec('Campo password','Il tasto occhio è <code>field__button</code>: 44px (<code>--hit</code>), con <code>aria-pressed</code>. Con il blocco maiuscole attivo, il suggerimento è sostituito dall\'avviso (icona triangolo, tono neutro). Tre campi possono condividere un solo occhio (<code>isVisible</code>, <code>onToggleVisible</code>, <code>hideToggle</code>).',
  both('1100px',f'<div style="display:flex;flex-wrap:wrap;gap:var(--sp-6) var(--sp-4)">{cells}</div>','',bg='var(--surface)')))
# requirement
rq=''.join(f'<div class="dc-fw" style="width:19rem"><div class="dc-fl">{n}</div>{tf(L("account.password.next"),v,eye=True,typ="password",invalid=(s=="failed"),hint="") if False else ""}{pwreq(s)}</div>' for n,s,v in [('In attesa','pending',''),('Soddisfatto','met','Spidey2099'),('Non soddisfatto dopo un tentativo','failed','abc')])
S.append(sec('Requisito della password','Una riga sotto il campo della nuova password: trattino in attesa, spunta quando è soddisfatto, croce dopo un tentativo fallito (in quel caso la riga è l\'errore: colore <code>--danger</code> e peso 700). Un testo nascosto dice a chi usa lo screen reader se è soddisfatto.',
  both('1100px',f'<div style="display:flex;flex-wrap:wrap;gap:var(--sp-6) var(--sp-4)">{rq}</div>','',bg='var(--surface)')))
# form error
fe=''.join([f'<div class="dc-fw" style="width:24rem"><div class="dc-fl">Errore del modulo</div>{formerror(L("auth.errors.invalidCredentials"))}</div>',
 f'<div class="dc-fw" style="width:24rem"><div class="dc-fl">Troppi tentativi (it e en: con battuta)</div>{formerror(L("auth.errors.tooManyRequests"),rate=True,title=L("auth.errors.tooManyRequestsJoke"))}</div>',
 f'<div class="dc-fw" style="width:24rem"><div class="dc-fl">Troppi tentativi (fr, es, de: senza battuta)</div>{formerror(L("auth.errors.tooManyRequests","fr"),rate=True)}</div>'])
S.append(sec('Errore del modulo','<code>FormError</code> è l\'errore che appartiene al modulo e non a un campo. Con troppi tentativi diventa un riquadro con lo scudo <code>err-429.webp</code> (56px) e, solo in italiano e inglese, una riga di battuta.',
  both('1100px',f'<div style="display:flex;flex-wrap:wrap;gap:var(--sp-6) var(--sp-4)">{fe}</div>','',bg='var(--surface)')))
# spacing
sp=(f'<div class="dc-fw" style="width:19rem"><div class="dc-fl">.form (pagine): gap tra campi</div><div class="form">{tf(L("auth.email"),"",hint="")}{tf(L("auth.password"),"",eye=True,typ="password",hint=H)}</div></div>'
    f'<div class="dc-fw" style="width:19rem"><div class="dc-fl">.auth-view .form (popup)</div><div class="auth-view"><div class="form">{tf(L("auth.email"),"",hint="")}{tf(L("auth.password"),"",eye=True,typ="password",hint=H)}{btn("primary",L("auth.login.button"),"lg")}</div></div></div>')
S.append(sec('Spaziature: pagina e popup','Le due misure vivono in due file e sono diverse. Nelle pagine il modulo (<code>.form</code>) ha gap <code>--sp-5</code> e larghezza massima 30rem. Nel popup (<code>.auth-view .form</code>) il gap è <code>--sp-2</code>: etichetta a 8 sopra il campo, riga di messaggio sempre riservata, 8 tra i blocchi, il pulsante a <code>--sp-2</code> di margine.',
  both('1000px',f'<div style="display:flex;gap:var(--sp-8);flex-wrap:wrap">{sp}</div>','',bg='var(--surface)')
  +ul(['Nel popup la distanza risultante è <b>36px</b> da un campo all\'etichetta successiva e <b>16px</b> dall\'ultimo campo al pulsante (calcolo dal commento in <code>AuthDialogs.less</code>, righe 5-9); lo spazio libero accanto all\'anello è 5px.',
       'Nel popup il messaggio sotto il campo ha gap <code>--sp-1h</code> tra icona e testo (nelle pagine <code>--sp-2</code>).'])))
# anello
S.append(sec('Anello di focus del campo','Il campo ha uno sfondo suo, quindi l\'anello gli sta addosso: <code>outline-offset: 0</code> (Field.less r.34-36). Spessore 3px, colore <code>--focus-color</code>: ink in chiaro, oro in scuro (<code>tokens.less</code>). Non raggiunge mai l\'etichetta né la riga del messaggio.',
  both('600px',f'<div style="width:19rem">{tf(L("auth.email"),"nome@dominio.it","is-focus")}</div>','Anello a filo',bg='var(--surface)')))
S.append(sec('Valori nel codice: Field.less','',spec('components/ui/Field/Field.less')))
S.append(sec('Valori nel codice: input, select, label e avviso (base.less)','Regole globali, definite una volta: valgono per ogni input e per ogni <code>[role="alert"]</code>.',spec('styles/base.less',r'input|select|label|alert')))
S.append(sec('Valori nel codice: FormError.less','',spec('components/ui/FormError/FormError.less')))
S.append(sec('Valori nel codice: requisito password','',spec('features/account/components/PasswordSection/PasswordSection.less',r'requirement|message')))
S.append(sec('Valori nel codice: spaziature del popup','',spec('features/auth/components/AuthDialogs/AuthDialogs.less')))
# texts
keys=[('auth.email','Email'),('auth.password','Password'),('auth.name','Nome'),('auth.nameHint','Suggerimento nome'),('auth.passwordHint','Suggerimento password'),('auth.showPassword','Mostra'),('auth.hidePassword','Nascondi'),('auth.clearEmail','Svuota email'),('auth.capsLock','Maiuscole'),('auth.emailSuggestion','Email suggerita')]
rows=[[l]+[L(k,l) for k,_ in keys] for l in LANGS]
S.append(sec('Testi dei campi nelle cinque lingue','Chiavi <code>auth.*</code> in <code>src/i18n/locales/</code>. <code>{min}</code> e <code>{email}</code> sono segnaposto.',tbl(['Lingua']+[n for _,n in keys],rows)))
ek=[k for k in LOC['it'] if k.startswith('auth.errors.')]
rows=[[ '<code>'+k.replace('auth.errors.','')+'</code>']+[L(k,l) for l in LANGS] for k in ek]
S.append(sec('Messaggi di errore nelle cinque lingue','Tutte le chiavi <code>auth.errors.*</code>. “tooManyRequestsJoke” esiste in it e en; nelle altre lingue è vuota.',tbl(['Chiave']+LANGS,rows)))
rows=[[l]+[L(k,l,min=8) for k in ['account.password.requirements.length','account.password.requirements.met','account.password.requirements.notMet','account.password.mismatch']] for l in LANGS]
S.append(sec('Requisiti password nelle cinque lingue','Il minimo predefinito è 8 (<code>shared/passwordPolicy.ts</code>, <code>DEFAULT_PASSWORD_POLICY</code>); il server può cambiarlo.',tbl(['Lingua','Requisito','Soddisfatto','Non soddisfatto','Non coincidono'],rows)))
S.append(sec('Regole','',ul(['Il messaggio sotto il campo occupa sempre la sua riga (altezza minima 1,25rem): un errore non sposta il layout. L\'errore è un elemento nuovo con <code>role="alert"</code>, così viene annunciato.',
  'Suggerimento, avviso di maiuscole ed errore hanno la stessa dimensione; solo l\'errore è in grassetto e rosso.',
  'L\'etichetta dà il nome al campo ma un clic non sposta il focus (<code>keepFocus</code>).',
  'Campo non valido: fondo misto con <code>--danger</code> al 12% e anello interno 2px <code>--danger</code> (base.less).',
  'PasswordPair: nel codice non esiste. Era solo nel canvas e non viene più mostrato; il confronto tra due password è <code>PasswordSection</code> (nuova e conferma affiancate).'])))
S.append(prima_dopo([
 ['Messaggi sotto il campo','13px, avviso <code>role="status"</code>','<code>--fs-label</code> (14px) con line-height 20px, icona 18px, gap <code>--sp-2</code>','Field.less r.39-54'],
 ['Gap etichetta-campo','8px','<code>--sp-2</code> (8px)','Field.less r.10-14'],
 ['Gap campo-campo, pagina','20px','<code>--sp-5</code> (20px), larghezza massima 30rem','Field.less r.3-8'],
 ['Gap campo-campo, popup','20px, gruppo-pulsante 24px','<code>--sp-2</code>; risultato 36px tra campi e 16px al pulsante','AuthDialogs.less r.5-18'],
 ['Anello del campo','rosso in chiaro, a 2-3px','<code>--focus-color</code> (ink in chiaro, oro in scuro), 3px, <code>outline-offset: 0</code>','Field.less r.34-36; tokens.less'],
 ['Requisito password','non descritto','trattino, spunta, croce; 16px; <code>--fs-caption</code>','PasswordSection.less r.31-55'],
 ['FormError','una frase','<code>FormError</code> con variante troppi tentativi (scudo 56px)','FormError.less'],
 ['PasswordPair','presente in Accesso roadmap','tolto: nel codice non esiste','—'],
]))
write('Textfield.dc.html','Textfield','\n'.join(S))
