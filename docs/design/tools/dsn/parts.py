from lib2 import *
_n=[0]
def uid(): _n[0]+=1; return f'f{_n[0]}'
def tf(label,value='',state='',hint='',error='',notice='',counter='',clear=False,ph='',typ='text',disabled=False,readonly=False,invalid=False,pw=False,eye=False,visible=False,lang='it'):
    i=uid(); cls=state
    cnt=f'<span class="field__counter" aria-hidden="true">{counter}</span>' if counter else ''
    attrs=f'id="{i}" name="{i}" type="{typ}" value="{value}" placeholder="{ph}"'
    if clear or eye: attrs+=' data-clearable="true"'
    if disabled: attrs+=' disabled="disabled"'
    if readonly: attrs+=' readonly="readonly"'
    if error or invalid: attrs+=' aria-invalid="true"'
    btn=''
    if clear: btn=f'<button type="button" class="field__button" aria-label="{L("auth.clearEmail",lang)}">{icon("x")}</button>'
    if eye: btn=f'<button type="button" class="field__button" aria-label="{L("auth.hidePassword" if visible else "auth.showPassword",lang)}" aria-pressed="{"true" if visible else "false"}">{icon("eye-off" if visible else "eye")}</button>'
    if error: msg=f'<p id="{i}-m" role="alert" class="field__message field__error">{icon("circle-alert")}{error}</p>'
    else: msg=f'<p id="{i}-m" role="status" class="field__message">{(icon("triangle-alert") if notice else "")}{notice or hint}</p>'
    return (f'<div class="field"><div class="field__label"><label for="{i}">{label}</label>{cnt}</div>'
            f'<div class="field__control"><input class="{cls}" {attrs}>{btn}</div>{msg}</div>')
def pwreq(state,min_=8,lang='it'):
    ic={'met':'check','failed':'x','pending':'minus'}[state]
    a={'met':' data-met="true"','failed':' data-failed="true"','pending':''}[state]
    hid=L('account.password.requirements.met' if state=='met' else 'account.password.requirements.notMet',lang)
    return f'<p role="status" class="password-requirement"{a}>{icon(ic)}{L("account.password.requirements.length",lang,min=min_)}<span class="visually-hidden">{hid}</span></p>'
def formerror(msg,rate=False,title='',lang='it'):
    if rate:
        return (f'<div role="alert" class="form-error form-error--rate"><img src="assets/images/err-429.webp" alt="" aria-hidden="true" width="56" height="56"><div>'
                +(f'<strong>{title}</strong>' if title else '')+f'<p>{msg}</p></div></div>')
    return f'<p role="alert" class="form-error">{icon("circle-alert")}{msg}</p>'
def btn(v,label,size='',state='',ic=None,attrs=''):
    cls=f'btn btn--{v}'+(f' btn--{size}' if size else '')+(f' {state}' if state else '')
    return f'<button type="button" class="{cls}" {attrs}>{icon(ic) if ic else ""}{label}</button>'
