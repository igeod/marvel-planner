import re, json, html, os
S='@WORK@'
OUTDIR=f'{S}/dsn/out'; os.makedirs(OUTDIR,exist_ok=True)
LOC=json.load(open(f'{S}/dsn/locales.json'))
LANGS=['it','en','fr','es','de']
COMMIT='8b15e60'
DATE='11 novembre 2026'
ICO=f'{S}/lessc/node_modules/lucide-static/icons/'

def L(key,lang='it',**kw):
    v=LOC[lang][key]
    for k,x in kw.items(): v=v.replace('{'+k+'}',str(x))
    return html.escape(v,quote=False)

def icon(name,size=None,sw=None,cls=''):
    t=open(ICO+name+'.svg').read()
    inner=re.search(r'>\s*(<(?:path|circle|rect|line|polyline|polygon|ellipse)[\s\S]*?)</svg>',t).group(1)
    inner=re.sub(r'\s+',' ',inner).strip()
    a=f' width="{size}" height="{size}"' if size else ' width="24" height="24"'
    sw_=f'{sw}' if sw else '2'
    c=f' class="lucide {cls}"'.replace(' class="lucide "',' class="lucide"')
    return f'<svg{c} xmlns="http://www.w3.org/2000/svg"{a} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="{sw_}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{inner}</svg>'

CSS='''
button{font:inherit}
.dc-pg{background:var(--bg);color:var(--ink);font-family:var(--font-body);font-size:var(--fs-body);line-height:1.5;padding:clamp(16px,4vw,48px);display:flex;flex-direction:column;gap:var(--sp-10);max-width:1240px;margin:0 auto;box-sizing:border-box;overflow-wrap:anywhere}
.dc-pg p,.dc-pg li{text-wrap:pretty}
.dc-pg h1,.dc-pg h2,.dc-pg h3{text-wrap:balance}
.dc-pg ul.dc-ul{list-style:disc;padding-left:20px;margin:0;display:flex;flex-direction:column;gap:6px;max-width:90ch}
.dc-h1{margin:0;font-family:var(--font-display);font-weight:400;font-size:clamp(2.5rem,8vw,3.5rem);line-height:1;text-transform:uppercase;letter-spacing:.01em}
.dc-pg h2.dc-h2{margin:0;font-size:var(--fs-h2);font-weight:800;letter-spacing:-.01em;line-height:1.2}
.dc-pg h3.dc-h3{margin:0;font-size:var(--fs-title);font-weight:800}
.dc-lead{margin:var(--sp-2) 0 0;max-width:78ch;color:var(--ink-2)}
.dc-sec{display:flex;flex-direction:column;gap:var(--sp-4)}
.dc-sub{margin:0;max-width:80ch;color:var(--ink-2)}
.dc-row{display:flex;flex-wrap:wrap;gap:var(--sp-6) var(--sp-4);align-items:flex-start}
.dc-fw{display:flex;flex-direction:column;gap:var(--sp-2);min-width:0;max-width:100%}
.dc-fl{font-size:var(--fs-caption);font-weight:800;text-transform:uppercase;letter-spacing:.06em;color:var(--ink-2)}
.dc-fr{max-width:100%;box-sizing:border-box;background:var(--bg);color:var(--ink);font-family:var(--font-body);font-size:var(--fs-body);line-height:1.5;border-radius:var(--r-md);overflow:hidden;box-shadow:var(--shadow-card)}
.dc-box{background:var(--surface);border-radius:var(--r-xl);box-shadow:var(--shadow-card);padding:var(--sp-6);display:flex;flex-direction:column;gap:var(--sp-3)}
.dc-tbl{width:100%;border-collapse:collapse;font-size:var(--fs-label)}
.dc-tbl th{text-align:left;font-size:var(--fs-caption);text-transform:uppercase;letter-spacing:.06em;color:var(--ink-2);padding:var(--sp-2) var(--sp-3);border-bottom:2px solid var(--line);white-space:nowrap}
.dc-tbl td{padding:var(--sp-2) var(--sp-3);border-bottom:1px solid var(--line);vertical-align:top}
.dc-scroll{overflow-x:auto;max-width:100%}
.dc-chip{display:inline-block;padding:2px 10px;border-radius:var(--r-pill);font-size:var(--fs-caption);font-weight:800;white-space:nowrap;background:var(--ink);color:var(--bg)}
.dc-chip.k2{background:var(--highlight);color:var(--ink-static)}
.dc-chip.k3{background:var(--row-hover);color:var(--ink)}
.dc-pg code{font-size:.9em;background:var(--row-hover);padding:1px 5px;border-radius:var(--r-tiny);font-family:ui-monospace,Consolas,monospace}
.dc-pg pre{margin:0;white-space:pre-wrap;background:var(--panel);color:var(--on-dark);padding:var(--sp-4);border-radius:var(--r-md);font-size:var(--fs-label);line-height:1.5}
.dc-pg pre code{background:none;padding:0}
.dc-spec td:first-child{min-width:14rem;max-width:26rem}
.dc-spec .ln{color:var(--ink-2);font-size:var(--fs-caption);margin-left:4px}
.dc-spec .cx{color:var(--ink-2);font-size:var(--fs-caption);margin-top:2px}
.dc-src{margin:0;font-size:var(--fs-caption);color:var(--ink-2)}
.dc-hdr{display:flex;flex-direction:column;background:var(--surface);border-radius:var(--r-xl);box-shadow:var(--shadow-card);padding:var(--sp-3) var(--sp-6)}
.dc-hdr>div{display:grid;grid-template-columns:minmax(0,12rem) 1fr;gap:var(--sp-3);padding:var(--sp-2) 0;border-bottom:1px solid var(--line);font-size:var(--fs-label)}
.dc-hdr>div:last-child{border-bottom:0}
.dc-hdr b{color:var(--ink-2)}
.dc-pad{padding:var(--sp-4);display:flex;flex-direction:column;gap:var(--sp-3)}
.dc-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(8.5rem,1fr));gap:var(--sp-3)}
.dc-cell{display:flex;flex-direction:column;gap:var(--sp-2);align-items:flex-start;font-size:var(--fs-caption);color:var(--ink-2)}
'''

def C(x): return f'<code>{x}</code>'
def tag(t,k=''): return f'<span class="dc-chip {k}">{t}</span>'
NOCANVAS=tag('solo canvas · non implementato')
NOVERIF=tag('non verificato','k3')
NOTOKEN=tag('valore senza token','k2')
def ul(items): return '<ul class="dc-ul">'+''.join(f'<li>{i}</li>' for i in items)+'</ul>'
def tbl(head,rows,cls=''):
    h=''.join(f'<th>{x}</th>' for x in head)
    r=''.join('<tr>'+''.join(f'<td>{c}</td>' for c in row)+'</tr>' for row in rows)
    return f'<div class="dc-scroll"><table class="dc-tbl {cls}"><thead><tr>{h}</tr></thead><tbody>{r}</tbody></table></div>'
def sec(title,sub,body=''):
    return f'<div class="dc-sec"><h2 class="dc-h2">{title}</h2>'+(f'<p class="dc-sub">{sub}</p>' if sub else '')+body+'</div>'
def frame(theme,width,inner,label='',pad='var(--sp-4)',bg=None):
    lab=f'<div class="dc-fl">{label}</div>' if label else ''
    st=f'width:{width};padding:{pad};'+(f'background:{bg};' if bg else '')
    return f'<div class="dc-fw">{lab}<div data-theme="{theme}" class="dc-fr" style="{st}">{inner}</div></div>'
def both(width,inner,label='',pad='var(--sp-4)',bg=None):
    return frame('light',width,inner,label+(' · chiaro' if label else 'chiaro'),pad,bg)+frame('dark',width,inner,label+(' · scuro' if label else 'scuro'),pad,bg)
def row(*xs): return '<div class="dc-row">'+''.join(xs)+'</div>'
def cell(label,inner): return f'<div class="dc-cell">{inner}<span>{label}</span></div>'

def hdr(describes,folder,uses,date=DATE):
    rows=[('Cosa descrive',describes),('Cartella del codice',folder),('Componenti che usa',uses),('Ultima modifica',date)]
    return '<div class="dc-hdr">'+''.join(f'<div><b>{k}</b><span>{v}</span></div>' for k,v in rows)+'</div>'

def prima_dopo(rows):
    return sec('Prima, dopo, file','Che cosa è cambiato rispetto alla pagina precedente del canvas.',
        tbl(['Cosa','Prima (canvas vecchio)','Dopo (codice)','File'],rows))

def spec(path,only=None):
    from lessspec import table
    return table(path,only)

def page(title,body,desc=''):
    return f'''<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
<link rel="stylesheet" href="tokens.css">
<link rel="stylesheet" href="app.css">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Anton&family=Hanken+Grotesk:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>{CSS}</style>
</helmet>
<div class="dc-pg">
{body}
</div>
</x-dc>
<script type="text/x-dc" data-dc-script>
class Component extends DCLogic {{
  renderVals() {{ return {{}}; }}
}}
</script>
</body>
</html>
'''

SKIP={
 'Textfield':['.auth-view','.auth-view .field__message','.auth-view .form','.auth-view .form > .btn','[role="alert"]','.password-section .field__message:empty'],
 'Profile Popup':['.password-requirement','.password-requirement svg','.password-requirement[data-failed]','.password-requirement[data-failed] svg','.password-requirement[data-met]'],
 'Planner':['.badge'],
 'Accordion':['.details-skeleton__short','.view-motion[data-dir][data-phase="in"]','.view-motion[data-dir][data-phase="out"]'],
 'Spacing e layout':['.section-title','.site-header'],
 'Navigation':['.skip-link','.skip-link:focus'],
 'System states':[':root[data-splash-capped] .skeleton'],
 'Typography':['label'],
 'Scrollbar':['progress::-webkit-progress-bar','progress::-webkit-progress-value'],
}
SHARED_BTN='.btn, .why-toggle'
def dedupe(name,body):
    skip=set(SKIP.get(name,[]))
    def tbl_fix(m):
        t=m.group(0)
        body_t=t[t.index('<tbody>')+7:t.rindex('</tbody>')]
        rows=re.findall(r'<tr>.*?</tr>',body_t,flags=re.S)
        keep=[]
        for r in rows:
            m=re.match(r'<tr><td>(.*?)</td>',r,flags=re.S)
            sel=html.unescape(re.sub('<[^>]+>','',m.group(1))).strip() if m else ''
            if sel in skip: continue
            if name!='Buttons' and sel.startswith(SHARED_BTN): continue
            keep.append(r)
        if not keep: return '@@EMPTY@@'
        head=t[:t.index('<tbody>')+7]
        return head+''.join(keep)+'</tbody></table>'
    body=re.sub(r'<table class="dc-tbl dc-spec">.*?</table>',tbl_fix,body,flags=re.S)
    # remove empty table wrappers and their source line
    body=re.sub(r'<div class="dc-scroll">@@EMPTY@@</div>(<p class="dc-src">.*?</p>)?','',body,flags=re.S)
    body=re.sub(r'<div class="dc-sec"><h2 class="dc-h2">[^<]*</h2></div>','',body)
    return body

def write(name,title,body):
    import add
    body=body+'\n'.join(add.EXTRA.get(name[:-8],[]))
    body=dedupe(name[:-8],body)
    open(f'{OUTDIR}/{name}','w').write(page(title,body))
    print('wrote',name,len(body))

def h1(t,lead): return f'<div><h1 class="dc-h1">{t}</h1><p class="dc-lead">{lead}</p></div>'
