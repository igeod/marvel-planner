from parts import *
import html as _h
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
S=[]
S.append(h1('Navigation','Barra in alto, menu su mobile, piè di pagina e link “Vai al contenuto”.'))
S.append(hdr('AppHeader, HeaderMenu (menu mobile), AccountMenu, AppFooter, SkipLink, CoffeeLink',
 'src/components/layout/ (AppHeader, HeaderMenu, AppFooter, SkipLink, CoffeeLink, LanguageSwitcher), src/features/auth/components/AccountMenu/, src/features/theme/',
 'Button (panel, ink, primary, text), SelectField, ChoiceGroup, AdminBadge, Chevron'))
S.append(sec('Barra in alto: desktop (da 48em)','Trasparente, wordmark rosso (<code>--accent-hover</code> in chiaro, <code>--accent</code> in scuro), comandi con contorno <code>--ink</code> 2px: tema, lingua, account. Utente non connesso: pulsante <code>ink</code> “Accedi”; connesso: pillola con avatar e nome; admin: badge sull\'avatar.',
 both('1100px',f'<div style="display:flex;flex-direction:column;gap:var(--sp-3)">{header(False)}{header(True)}{header(True,True)}</div>','Non connesso · connesso · amministratore',pad='var(--sp-2)',bg='var(--bg)')))
S.append(sec('Barra e menu: mobile (sotto 48em)','Sotto il tablet resta il wordmark e il pulsante Menu (<code>nav.menu</code>). Il pannello è un <code>&lt;dialog&gt;</code> a tutta larghezza che scende dall\'alto, bordi inferiori arrotondati: tema (ChoiceGroup a 3), lingua (SelectField in linea), accesso o account. Anteprima in un frame di 390px (le regole sono media query del viewport).',
 phone(header(True),'light',90,390,'Chiusa · chiaro')+phone(menu_panel(True),'light',410,390,'Aperto · chiaro')+phone(menu_panel(False),'dark',400,390,'Aperto, non connesso · scuro')))
S.append(sec('Piè di pagina','Su pannello (<code>.on-panel</code>): wordmark grande, avvertenza, crediti con link, licenza dei caratteri, TMDB, link legali. Il link “Offrimi un caffè” (<code>CoffeeLink</code>) compare solo se <code>SITE.coffeeUrl</code> non è vuoto: nel codice oggi è vuoto, quindi non si vede.',
 both('1100px',footer(),'',pad='0',bg='var(--bg)')))
S.append(sec('Link “Vai al contenuto”','Primo elemento focalizzabile; compare solo con il focus da tastiera. Testo <code>nav.skipToContent</code>, destinazione <code>#main-content</code>.',
 both('480px',f'<a class="skip-link is-focus" href="#main-content" style="position:static">{L("nav.skipToContent")}</a>','')))
S.append(sec('Testi nelle 5 lingue','',tbl(['Lingua','nav.main','nav.login','nav.menu','nav.skipToContent','nav.language','nav.account'],[[l]+[L('nav.'+k,l) for k in ('main','login','menu','skipToContent','language','account')] for l in LANGS])))
S.append(sec('Testi del piè di pagina nelle 5 lingue','',tbl(['Lingua','footer.disclaimer','footer.legal','footer.privacy','footer.accessibility','footer.privacySettings','footer.coffee'],[[l]+[L('footer.'+k,l) for k in ('disclaimer','legal','privacy','accessibility','privacySettings','coffee')] for l in LANGS])))
S.append(sec('Valori nel codice: AppHeader.less','',spec('components/layout/AppHeader/AppHeader.less')))
S.append(sec('Valori nel codice: HeaderMenu.less','',spec('components/layout/HeaderMenu/HeaderMenu.less')))
S.append(sec('Valori nel codice: AppFooter.less','',spec('components/layout/AppFooter/AppFooter.less')))
S.append(sec('Valori nel codice: SkipLink.less e CoffeeLink.less','',spec('components/layout/SkipLink/SkipLink.less')+spec('components/layout/CoffeeLink/CoffeeLink.less')))
S.append(sec('Valori nel codice: AccountMenu.less','',spec('features/auth/components/AccountMenu/AccountMenu.less')))
S.append(prima_dopo([
 ['Header','misure e colori nella pagina','solo dal .less; wordmark <code>--accent-hover</code> (chiaro) e <code>--accent</code> (scuro)','AppHeader.less'],
 ['Menu mobile','non verificato','dialog a tutta larghezza dall\'alto, raggio inferiore <code>@radius-block</code>','HeaderMenu.less r.7-17'],
 ['Link del caffè','mostrato','non attivo: <code>SITE.coffeeUrl</code> è vuoto','site.ts, CoffeeLink.tsx'],
]))
write('Navigation.dc.html','Navigation','\n'.join(S))
