from parts import *
import html as _h

CHEV='<svg class="lucide chevron" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>'
def poster(): return f'<div class="poster-thumb"><div class="poster-image"><span class="poster-image__state" role="img" aria-label="{L("poster.missing")}">{icon("image-off")}</span></div></div>'
def row(name,meta,watched=False,state='',open_=False):
    cls='title-row'+(' title-row--open' if open_ else '')+(f' {state}' if state else '')
    nm=f'<s>{name}</s>' if watched and not open_ else name
    chk='' if open_ else (f'<label class="title-row__check"><input type="checkbox"{" checked=\"checked\"" if watched else ""} aria-label="{L("planner.markWatched",name=name)}"><span class="title-row__box" aria-hidden="true">{icon("check")}</span></label>')
    content=''
    if open_:
        content=(f'<div class="title-row__content"><div class="mark-watched"><button type="button" class="mark-watched__button"><span class="mark-watched__pill">{icon("check")}{L("planner.next.markWatched")}</span></button></div>'
                 f'<div class="title-row__actions"><a class="btn btn--primary" href="#">{L("details.open")}{icon("maximize-2")}</a></div></div>')
    return (f'<li class="{cls}">{chk}{poster()}<details class="title-row__details"{" open=\"open\"" if open_ else ""}><summary class="title-row__summary"><span class="title-row__heading"><span lang="en" class="title-row__name">{nm}</span><span class="title-row__meta">{meta}</span></span>{CHEV}</summary>{content}</details></li>')
ACT=f'<div class="phase__actions"><button type="button" class="btn btn--text btn--sm">{icon("check-check")}{L("planner.phase.markAll")}</button></div>'
PCHK=f'<label class="title-row__check phase__check"><input type="checkbox" aria-label="{L("planner.phase.markAll")}"><span class="title-row__box" aria-hidden="true" style="color:var(--ink)">{icon("minus").replace("<svg","<svg style=\"opacity:1\"",1)}</span></label>'
def phase(open_=True,state='',rows=''):
    c='phase card'+(f' {state}' if False else '')
    sm='phase__summary'+(f' {state}' if state else '')
    body=''
    if open_: body=f'<ol class="phase__titles">{rows}</ol>'
    return (f'<details class="{c}"{" open=\"open\"" if open_ else ""}><summary class="{sm}">{PCHK}<span class="phase__heading"><h3 class="phase__name">{L("catalog.phases.1")}</h3><span class="phase__years muted">2008 – 2012</span></span><span class="phase__count">{L("common.ofCount",done=2,total=6)}</span>{CHEV}</summary>{body}</details>')
M=lambda extra='': f'{L("planner.types.film")}, 2008'

def sw(label,checked=False,state=''):
    c=' checked="checked"' if checked else ''
    f=' is-focus' if state=='focus' else ''
    return (f'<div class="switch"><span>{label}</span><label class="switch__control"><input class="switch__input{f}" type="checkbox" role="switch"{c} aria-label="{label}"/>'
            f'<span class="switch__track" aria-hidden="true"></span></label></div>')
_g=[0]
def ch(label,typ='radio',checked=False,state='',name='x'):
    c=' checked="checked"' if checked else ''
    f=' is-focus' if state=='focus' else ''
    ck=icon('check',16,3.4) if (typ=='checkbox' and checked) else ''
    return f'<label class="choice"><input class="choice__input{f}" type="{typ}"{c}/><span class="choice__face">{ck}{label}</span></label>'
def grp(legend,cols,items): return f'<fieldset class="choice-group"><legend>{legend}</legend><div class="choice-group__options choice-group__options--{cols}">{items}</div></fieldset>'
def status(msg,success=False):
    if success: return f'<p role="status" class="status status--success"><span class="status__inner"><span class="status__mark" aria-hidden="true">{icon("check")}</span><span class="status__text">{msg}</span></span></p>'
    return f'<p role="status">{msg}</p>'


CHEV='<svg class="lucide chevron" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>'
def phone(inner,theme,h=220,w=390,label=''):
    doc=f'<!doctype html><html lang="it" data-theme="{theme}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="tokens.css"><link rel="stylesheet" href="app.css"><link href="https://fonts.googleapis.com/css2?family=Anton&family=Hanken+Grotesk:wght@400;500;600;700;800&display=swap" rel="stylesheet"><style>body{{margin:0}}</style></head><body>{inner}</body></html>'
    lab=f'<div class="dc-fl">{label}</div>' if label else ''
    return f'<div class="dc-fw">{lab}<div class="dc-scroll"><iframe title="{label}" srcdoc="{_h.escape(doc.replace('viewBox','viewbox'),quote=True)}" style="width:{w}px;height:{h}px;border:0;border-radius:var(--r-md);display:block"></iframe></div></div>'
def initials_avatar(adm=False): return f'<span class="avatar" aria-hidden="true">D{"<span class=\"admin-badge\" aria-hidden=\"true\">"+icon("shield-check")+"</span>" if adm else ""}</span>'
def theme_btn(): return btn('panel','','','','monitor','aria-label="'+L('theme.current',name=L('theme.system'))+'"')
def lang_trigger(): return f'<div class="select-field select-field--popover"><button type="button" class="select-field__trigger" aria-haspopup="listbox" aria-expanded="false">{icon("languages")}<span>Italiano</span>{CHEV}</button></div>'
def acct(user=True,adm=False):
    if not user: return btn('ink',L('nav.login'))
    return f'<div class="account-menu"><button type="button" class="account-pill" title="{L("nav.account")}">{initials_avatar(adm)}<span>Diego</span></button></div>'
def header(user=True,adm=False,mobile=False,guide=False):
    act=f'<div class="site-header__actions">{theme_btn()}{lang_trigger()}{acct(user,adm)}</div>'
    menu=btn('panel','','','site-header__menu-button' if False else '','menu','aria-label="'+L('nav.menu')+'"').replace('btn btn--panel','btn btn--panel site-header__menu-button',1)
    hp=f'<div class="guide-help"><button type="button" class="btn btn--panel btn--icon" aria-label="{L("planner.guide.help")}" aria-haspopup="dialog">{icon("circle-help")}</button></div>' if guide else ''
    return f'<header class="site-header"><nav class="site-header__bar" aria-label="{L("nav.main")}"><a href="#" class="wordmark">Marvel Planner</a><div class="site-header__end"><div class="site-header__help">{hp}</div>{act}{menu}</div></nav></header>'
def footer():
    cred=L('footer.credits').replace('{justwatch}','<a href="#">JustWatch</a>').replace('{wikipedia}','<a href="#">Wikipedia</a>').replace('{license}',f'<a href="#">{L("footer.creditsLicense")}</a>')
    fonts=L('footer.fonts').replace('{license}',f'<a href="#">{L("footer.fontsLicense")}</a>')
    return (f'<footer class="site-footer on-panel"><div class="site-footer__columns"><div class="site-footer__about"><p class="wordmark wordmark--large">Marvel Planner</p><p class="muted">{L("footer.disclaimer")}</p><p class="muted">{cred}</p><p class="muted">{fonts}</p></div>'
      f'<div class="site-footer__tmdb"><p class="muted">This product uses the TMDB API but is not endorsed or certified by <a href="#">TMDB</a>.</p></div></div>'
      f'<nav class="site-footer__legal" aria-label="{L("footer.legal")}"><a href="#">{L("footer.privacy")}</a><a href="#">{L("footer.accessibility")}</a>{btn("text",L("footer.privacySettings"))}<span class="site-footer__made muted" lang="en">Made in Italy</span></nav></footer>')
def menu_panel(user=True,adm=False):
    acc=(f'<div class="menu-panel__account"><button type="button" class="account-pill account-pill--wide">{initials_avatar(adm)}<span>Diego</span></button></div>' if user else btn('primary',L('nav.login'),'lg','','log-in'))
    th=''.join(f'<label class="choice"><input class="choice__input" type="radio"{" checked=\"checked\"" if c=="system" else ""}><span class="choice__face">{L("theme."+c)}</span></label>' for c in ('system','light','dark'))
    body=(f'<div class="menu-panel__body"><div class="menu-panel__bar"><span class="wordmark">Marvel Planner</span>{btn("panel","","","","x","aria-label=\""+L("common.close")+"\"")}</div>'
          f'<fieldset class="choice-group"><legend>{L("theme.label")}</legend><div class="choice-group__options choice-group__options--3">{th}</div></fieldset>'
          f'<div class="menu-panel__language"><div class="select-field select-field--inline"><span class="select-field__label">{L("nav.language")}</span><button type="button" class="select-field__trigger" aria-haspopup="listbox" aria-expanded="false"><span>Italiano</span>{CHEV}</button></div></div>{acc}</div>')
    return f'<dialog class="menu-panel on-panel" open style="position:static;margin:0">{body}</dialog>'