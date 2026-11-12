"""Compile code LESS (commit c520ab1) into canvas tokens.css + app.css. Run from anywhere."""
import subprocess, re, os, sys
S='@WORK@'
SRC='@REPO@/src'
LESSC=f'{S}/lessc/node_modules/.bin/lessc'
OUT=f'{S}/canvas'
ENTRY_TOK='@import "styles/tokens";\n'
ENTRY_APP=open(f'{S}/dsn/entry_app.less').read()
def lessc(text):
    p=f'{SRC}/__e.less'; open(p,'w').write(text)
    r=subprocess.run([LESSC,'--include-path=.:styles','__e.less'],cwd=SRC,capture_output=True,text=True)
    os.remove(p)
    if r.returncode: print(r.stderr); sys.exit(1)
    return r.stdout

def blocks(css):
    """split into top-level items: (prelude, body) with nested braces kept in body"""
    i=0; n=len(css); out=[]
    while i<n:
        j=css.find('{',i)
        if j<0: break
        pre=css[i:j].strip(); d=1; k=j+1
        while d and k<n:
            c=css[k]
            if c=='{': d+=1
            elif c=='}': d-=1
            k+=1
        out.append((pre,css[j+1:k-1])); i=k
    return out

def force(css):
    res=[]
    def conv(sel):
        return sel.replace(':hover','.is-hover').replace(':active','.is-active').replace(':focus-visible','.is-focus')
    def handle(pre,body,ctx):
        if pre.startswith('@media'):
            flat = ('hover: hover' in pre)
            if not flat and 'prefers-reduced-motion: no-preference' in pre: return
            if not flat and 'min-width' in pre or 'max-width' in pre:
                inner=[]
                for p,b in blocks(body):
                    if re.search(r':(hover|active|focus-visible)',p): inner.append(conv(p)+'{'+b+'}')
                if inner: res.append(pre+'{'+''.join(inner)+'}')
                return
            for p,b in blocks(body):
                if re.search(r':(hover|active|focus-visible)',p) : res.append(conv(p)+'{'+b+'}')
            return
        if pre.startswith('@'): return
        if re.search(r':(hover|active|focus-visible)',pre): res.append(conv(pre)+'{'+body+'}')
    for pre,body in blocks(css): handle(pre,body,None)
    return '\n'.join(res)

tok=lessc(ENTRY_TOK)
# canvas themes: data-theme on any element (no prefers-color-scheme block)
tok=tok.replace(':root[data-theme="dark"]','[data-theme="dark"]')
tok=re.sub(r'@media \(prefers-color-scheme: dark\)\s*\{.*?\n\}\n',  '', tok, flags=re.S)
tok+='\n/* canvas only: values that the code resolves at :root must follow the themed element */\n[data-theme="dark"],[data-theme="light"]{--focus:3px solid var(--focus-color);--soft-press:color-mix(in srgb,var(--disabled),var(--ink) 14%)}\n:root{--font-body:"Hanken Grotesk","Hanken Grotesk Variable",system-ui,sans-serif}\n'
app=lessc(ENTRY_APP)+'''
/* canvas only */
.demo-tip .tooltip__bubble{position:relative!important;display:block!important;opacity:1!important;transform:none!important;margin:0}
/* canvas only: copy of index.html #splash rules */
.demo-splash{display:grid;place-items:center;padding:24px;background:var(--accent);color:var(--white);font-family:var(--font-display);font-size:clamp(3.5rem,11vw,9rem);line-height:1.02;letter-spacing:.02em;text-align:center;text-transform:uppercase;overflow-wrap:anywhere;min-height:16rem;border-radius:var(--r-md)}
/* canvas only */
.demo-sk .skeleton{visibility:visible!important}
/* canvas only: open lists in static demos */
.demo-open .select-field--popover .select-field__list{position:static!important;display:flex!important;opacity:1!important;transform:none!important;box-shadow:var(--shadow-pop)}
.demo-open .select-field--inline .select-field__list{display:flex!important;opacity:1!important;block-size:auto!important;transform:none!important}
'''
app=app.replace(':root[data-theme="dark"]','[data-theme="dark"]').replace(':root:not([data-theme="light"])','[data-theme="dark"]')
fo=force(app)
for f,t in (('tokens.css',tok),('app.css',app+'\n/* canvas only: forced states for static demos (.is-hover .is-active .is-focus) */\n'+fo)):
    open(f'{OUT}/{f}','w').write(t); print(f,len(t))
