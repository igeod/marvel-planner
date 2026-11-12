from comp import *
A='features/auth/components/'
def rich(key,label,lang='it'): return L(key,lang).replace('{link}',f'<button type="button" class="link-button">{label}</button>')
def pf(label,value='',err='',action='',eye=True,after='',invalid=False):
    i=uid()
    msg=(f'<p id="{i}-m" role="alert" class="field__message field__error">{icon("circle-alert")}{err}</p>' if err else '')
    return (f'<div class="field"><div class="field__label"><label for="{i}">{label}</label>{action}</div><div class="field__control"><input id="{i}" name="{i}" type="password" value="{value}" data-clearable="true"{" aria-invalid=\"true\"" if (err or invalid) else ""}>'
            f'<button type="button" class="field__button" aria-label="{L("auth.showPassword")}" aria-pressed="false">{icon("eye")}</button></div>{msg}{after}</div>')
def pbtn(label,ic,loading=False):
    return f'<button type="submit" class="btn btn--primary btn--lg"{" aria-busy=\"true\"" if loading else ""}>{icon(ic)}{label}</button>'
def dlg(title,body,theme_wrap=True):
    return (f'<dialog class="dialog dialog--md" open style="display:block;opacity:1;transform:none;translate:none;scale:none;position:static;margin:0;max-width:100%"><div class="dialog__scroll scroll-y"><header class="dialog__header"><h2 tabindex="-1">{title}</h2></header>'
            f'<div class="dialog__body"><div class="auth-view view-motion">{body}</div></div></div><button type="button" class="dialog__close" aria-label="{L("common.close")}">{icon("x")}</button></dialog>')
form=lambda *xs:'<form class="form" novalidate>'+''.join(xs)+'</form>'
def result(msg,actions,tick=False,links=''):
    st=status(msg,True) if tick else f'<p>{msg}</p>'
    return f'<div class="auth-result">{st}<div class="auth-result__actions">{actions}</div>{links}</div>'
back=lambda: f'<p><button type="button" class="link-button">{L("auth.reset.backToLogin")}</button></p>'
def v_login(err=None,rate=False):
    fe=''
    if rate: fe=formerror(L('auth.errors.tooManyRequests'),True,L('auth.errors.tooManyRequestsJoke'))
    pw=pf(L('auth.password'),'••••••••',L('auth.errors.invalidCredentials') if err else '',f'<button type="button" class="link-button">{L("auth.login.forgotLink")}</button>',invalid=bool(err))
    em=tf(L('auth.email'),'',invalid=bool(err),typ='email')
    return (form(fe,em,pw,pbtn(L('auth.login.button'),'log-in'))+f'<p>{rich("auth.login.noAccount",L("auth.login.registerLink"))}</p>')
def v_register():
    pw=pf(L('auth.password'),'',hint:=''  ) if False else pf(L('auth.password'),'',after=f'<p role="status" class="field__message">{L("auth.passwordHint",min=8)}</p>')
    return (f'<p>{L("auth.register.intro")}</p>'+form(tf(L('auth.name'),'',hint=L('auth.nameHint')),tf(L('auth.email'),'',typ='email'),pw,pbtn(L('auth.register.button'),'user-plus'))
      +f'<p>{rich("auth.register.privacyNotice",L("auth.register.privacyLink"))}</p><p>{rich("auth.register.haveAccount",L("auth.register.loginLink"))}</p>')
def v_forgot(): return f'<p>{L("auth.reset.request.intro")}</p>'+form(tf(L('auth.email'),'',typ='email'),pbtn(L('auth.reset.request.button'),'send'))+back()
def v_sent(): return result(L('auth.reset.sent.body'),btn('primary',L('auth.reset.backToLogin'),'lg')+btn('text',L('auth.reset.sent.resend'))+f'<p role="status" class="status"></p>',True)
def v_new():
    req=pwreq('pending')
    return f'<p>{L("auth.reset.new.intro")}</p>'+form(pf(L('account.password.next'),'',after=req),pf(L('account.password.confirm'),''),pbtn(L('auth.reset.new.button'),'key-round'))
def v_done(): return result(L('auth.reset.done.body'),btn('primary',L('auth.login.button'),'lg'),True)
def v_invalid(): return result(L('auth.reset.invalid.body'),btn('primary',L('auth.reset.invalid.button'),'lg'),False,back())
VIEWS=[('Accesso','auth.login.title',v_login()),('Accesso: credenziali errate','auth.login.title',v_login(err=True)),('Accesso: troppi tentativi','auth.login.title',v_login(rate=True)),
 ('Registrazione','auth.register.title',v_register()),('Recupero password','auth.reset.request.title',v_forgot()),('Link inviato (esito)','auth.reset.sent.title',v_sent()),
 ('Nuova password','auth.reset.new.title',v_new()),('Password aggiornata (esito)','auth.reset.done.title',v_done()),('Link non valido','auth.reset.invalid.title',v_invalid())]
def cells(theme):
    return ''.join(frame(theme,'520px',dlg(L(k),bd),lab,bg='var(--bg)') for lab,k,bd in VIEWS)
S=[]
S.append(h1('Popup di accesso','Una finestra sola che cambia vista: accesso, registrazione, recupero, nuova password, esiti e link non valido.'))
S.append(hdr('Popup di accesso (AuthDialogs): ogni vista, gli errori del form, il cambio di vista animato, i testi nelle 5 lingue',
 'src/features/auth/components/ (AuthDialogs, LoginForm, RegisterForm, ForgotForm, ResetPasswordForm, ResetPasswordEntry, AuthResult, AuthFormError, ResendButton, PasswordRequirement), src/features/auth/context/, src/components/ui/Modal/',
 'Popup generici (Modal), Textfield (campi, requisito password, FormError), Buttons (primary, text), Status (System states), Toast (accesso riuscito)'))
S.append(sec('Viste','Il popup di accesso non ha più la frase introduttiva (<code>auth.login.intro</code> tolta da main); la registrazione tiene <code>auth.register.intro</code>. Tutte le viste stanno nello stesso <code>&lt;dialog&gt;</code> (<code>Modal size="md"</code>): cambia il titolo e il contenuto. Il titolo viene dalla chiave <code>auth.*.title</code> della vista; le viste senza campi (esiti, link non valido) mettono il focus sul titolo. Sotto 40em il popup è un foglio dal basso (vedi Popup generici).',
  '<div class="dc-row" style="align-items:flex-start">'+cells('light')+'</div>'))
S.append(sec('Viste: scuro','Stesse viste in scuro (accesso e nuova password).','<div class="dc-row" style="align-items:flex-start">'+''.join(frame('dark','520px',dlg(L(k),bd),lab,bg='var(--bg)') for lab,k,bd in [VIEWS[0],VIEWS[6]])+'</div>'))
S.append(sec('Cambio di vista (movimento)','La vista che esce sfuma, quella che entra sfuma e scivola di 12px (da sinistra −12px quando si torna all\'accesso); il popup cresce o si accorcia all\'altezza della nuova vista in <code>--dur-ui</code>. Sono istantanei: la prima apertura e il profilo. Con movimento ridotto restano solo le sfumature e l\'altezza non anima (valori nella pagina Motion).',
  spec('styles/motion.less',r'view-motion')+tbl(['Cosa','Valore nel codice','File'],[
   ['Altezza del popup','<code>height var(--dur-ui) var(--ease-out)</code>, fallback 400ms, ritaglio con margine 4px per non tagliare il focus','AuthDialogs.tsx'],
   ['Direzione “indietro”','quando la vista di arrivo è l\'accesso','AuthDialogs.tsx'],
   ['Istantaneo','da nulla, da/verso il profilo','AuthDialogs.tsx']])))
S.append(sec('Regole di comportamento','',ul([
 'Credenziali errate: un solo messaggio sotto la password, entrambi i campi segnati; la password resta compilata e il focus torna lì (<code>LoginForm.tsx</code>).',
 'Troppi tentativi: blocco <code>FormError</code> in versione “rate” con scudo (<code>AuthFormError.tsx</code>); la battuta (<code>auth.errors.tooManyRequestsJoke</code>) esiste solo in italiano e inglese.',
 'Recupero password: il collegamento “Password dimenticata?” è implementato (accanto all\'etichetta della password, <code>labelAction</code>, LoginForm.tsx r.91-101) ma compare solo se <code>VITE_PASSWORD_RESET === "true"</code> (<code>passwordReset.ts</code> r.3): di default è spento finché il server non può inviare l\'e-mail e gli indirizzi non sono verificati. Le viste di questa pagina lo mostrano come con il flag acceso.',
 '“Reinvia”: non conta alla rovescia da solo, l\'attesa arriva dalla risposta 429 del server (<code>ResendButton.tsx</code>).',
 'Accesso riuscito: il popup si chiude e compare un toast (<code>auth.login.done</code>).'])))
KEYS=['auth.login.title','auth.login.button','auth.login.forgotLink','auth.login.noAccount','auth.register.title','auth.register.button','auth.reset.request.title','auth.reset.request.intro','auth.reset.sent.body','auth.reset.new.title','auth.reset.done.body','auth.reset.invalid.body','auth.errors.invalidCredentials','auth.errors.tooManyRequests']
for chunk in (KEYS[:8],KEYS[8:]):
    S.append(sec('Testi nelle 5 lingue','',f'<div class="dc-scroll">{tbl(["Chiave"]+["it","en","fr","es","de"],[[f"<code>{k}</code>"]+[L(k,l).replace("{link}","…") for l in LANGS] for k in chunk])}</div>'))
S.append(sec('Parti proprie di questa schermata','',''))
for t_,p_ in [('Popup di accesso (AuthDialogs.less)','AuthDialogs/AuthDialogs.less'),('Esiti (AuthResult.less)','AuthResult/AuthResult.less')]:
    S.append(sec(t_,'',spec(A+p_)))
S.append(prima_dopo([
 ['Pagine del giro','Accesso animazioni, recupero, roadmap, stati','una pagina sola, una sezione per vista','AuthDialogs.tsx'],
 ['PasswordPair','presente nella roadmap','non esiste nel codice: tolto','—'],
 ['Recupero password','descritto come proposta','vista nel codice; lato server da fare: HANDOFF','passwordReset.ts, AuthDialogs.tsx'],
 ['Campi e pulsanti','ridefiniti nelle pagine','usati dalle pagine Textfield e Buttons','Field.tsx, Button.tsx'],
]))
write('Popup di accesso.dc.html','Popup di accesso','\n'.join(S))
