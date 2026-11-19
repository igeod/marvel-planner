"""Utilità comuni dei blocchi «popup e campi» (voci 22-24). Scritto a mano; non rigenerabile da p_*.py.
Con VERIFY=1 gli iframe incorporano tokens.css/app.css (per aprire una pagina di prova fuori dal canvas)."""
import os, html as _h
from comp import *
CANVAS=os.path.join(S,'..','..','canvas')
VERIFY=os.environ.get('VERIFY')
FONT='<link href="https://fonts.googleapis.com/css2?family=Anton&family=Hanken+Grotesk:wght@400;500;600;700;800&display=swap" rel="stylesheet">'
def css():
    if VERIFY: return '<style>'+open(os.path.join(CANVAS,'tokens.css'),encoding='utf-8').read()+open(os.path.join(CANVAS,'app.css'),encoding='utf-8').read()+'</style>'
    return '<link rel="stylesheet" href="tokens.css"><link rel="stylesheet" href="app.css">'
BASE='html{overflow:hidden}body{margin:0;padding:16px;background:var(--bg);color:var(--ink);font-family:var(--font-body);font-size:var(--fs-body);line-height:1.5}'\
 '.mk{position:absolute;font:800 11px/16px var(--font-body);background:var(--highlight);color:var(--ink-static);padding:0 5px;border-radius:var(--r-tiny);white-space:nowrap;z-index:9}'\
 '.ml{position:absolute;border-left:1px dashed var(--highlight);opacity:.9;z-index:8}.mh{position:absolute;border-top:1px dashed var(--highlight);opacity:.9;z-index:8}'
def fr(label,theme,w,h,body,extra='',js='',lang='it',note=''):
    doc=(f'<!doctype html><html lang="{lang}" data-theme="{theme}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">{css()}{FONT}<style>{BASE}{extra}</style></head><body>{body}'
         +(f'<script>{js}</script>' if js else '')+'</body></html>')
    if VERIFY:
        _i[0]+=1; k=f'v_frame_{_i[0]}.html'
        open(os.path.join(S,k),'w',encoding='utf-8').write(doc)
        return f'<div class="dc-fw"><div class="dc-fl">{label}</div><p>(prova: {k})</p></div>'
    return (f'<div class="dc-fw"><div class="dc-fl">{label}</div><iframe title="{_h.escape(label)}" srcdoc="{_h.escape(doc.replace("viewBox","viewbox"),quote=True)}" '
            f'style="width:{w}px;height:{h}px;border:0;border-radius:var(--r-md);display:block;max-width:100%"></iframe>{note}</div>')
def row(*f): return '<div class="dc-row">'+''.join(f)+'</div>'
def col(*r): return '<div style="display:flex;flex-direction:column;gap:var(--sp-5)">'+''.join(r)+'</div>'
CHIP=tag('proposta · non implementata','k2')
def box(title,html_): return f'<div class="dc-box"><div class="dc-fl">{title}</div>{html_}</div>'
# popup statico (stesse classi del Modal); body_html = contenuto di .dialog__body
OV='display:block;opacity:1;transform:none;translate:none;scale:none;position:relative;margin:0;inset:auto;max-width:100%'
def popup(title,body_html,scroll_h=None,close=True,fixed_head=False,extra_cls=''):
    sh=f' style="max-height:{scroll_h}px"' if scroll_h else ''
    x=f'<button type="button" class="dialog__close" aria-label="{L("common.close")}">{icon("x")}</button>' if close else ''
    head=f'<header class="dialog__header"><h2 tabindex="-1">{title}</h2></header>'
    if fixed_head:
        return (f'<dialog class="dialog dialog--md {extra_cls}" open style="{OV}"><div class="pop-fixed">{head}<div class="dialog__scroll scroll-y"{sh}><div class="dialog__body">{body_html}</div></div></div>{x}</dialog>')
    return (f'<dialog class="dialog dialog--md {extra_cls}" open style="{OV}"><div class="dialog__scroll scroll-y"{sh}>{head}<div class="dialog__body">{body_html}</div></div>{x}</dialog>')
_i=[0]
def nid(): _i[0]+=1; return f'pc{_i[0]}'
X=lambda: icon('x')
def fld(label,value='',st='',ph='',typ='text',msg='',err='',cnt='',clear=False,eye=False,visible=False,ro=False,dis=False,inv=False,ta=0,resize=None,caps=False):
    i=nid(); a=f'id="{i}" name="{i}"'
    if ta:
        attrs=a+f' rows="{ta}" placeholder="{ph}"'
    else:
        attrs=a+f' type="{typ}" value="{value}" placeholder="{ph}"'
    if clear or eye: attrs+=' data-clearable="true"'
    if dis: attrs+=' disabled="disabled"'
    if ro: attrs+=' readonly="readonly"'
    if err or inv: attrs+=' aria-invalid="true"'
    style=f' style="resize:{resize}"' if resize else ''   # solo per la demo della maniglia
    b=''
    if clear: b=f'<button type="button" class="field__button" aria-label="{L("auth.clearEmail")}">{X()}</button>'
    if eye: b=f'<button type="button" class="field__button" aria-label="{L("auth.hidePassword" if visible else "auth.showPassword")}" aria-pressed="{"true" if visible else "false"}">{icon("eye-off" if visible else "eye")}</button>'
    if err: m=f'<p id="{i}-m" role="alert" class="field__message field__error">{icon("circle-alert")}{err}</p>'
    elif caps: m=f'<p id="{i}-m" role="status" class="field__message">{icon("triangle-alert")}{L("auth.capsLock")}</p>'
    else: m=f'<p id="{i}-m" role="status" class="field__message">{msg}</p>'
    c=f'<span class="field__counter" aria-hidden="true">{cnt}</span>' if cnt else ''
    el=(f'<textarea class="{st}" {attrs}{style}>{value}</textarea>' if ta else f'<input class="{st}" {attrs}{style}>')
    return f'<div class="field"><div class="field__label"><label for="{i}">{label}</label>{c}</div><div class="field__control">{el}{b}</div>{m}</div>'
def search(value='',st=''):
    clr=f'<button type="button" class="planner-search__clear" aria-label="Svuota la ricerca">{X()}</button>' if value else ''
    return (f'<form class="planner-search" role="search"><label class="planner-search__field {st}">{icon("search",20,2.4)}<input type="search" aria-label="Cerca" placeholder="Cerca un titolo" value="{value}">{clr}</label></form>')
def select(label,value,st='',exp=False):
    return (f'<div class="select-field select-field--inline"><span class="select-field__label">{label}</span><button type="button" class="select-field__trigger {st}" aria-haspopup="listbox" aria-expanded="{"true" if exp else "false"}"><span>{value}</span>{CHEV}</button></div>')
