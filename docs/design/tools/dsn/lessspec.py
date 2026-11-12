import re, html
SRC='@REPO@/src/'

def parse(path):
    """Return list of rules: dict(sel, ctx, decls[(prop,val,line)], line). Resolves nesting and &."""
    t=open(SRC+path).read()
    # strip comments but keep line numbers
    t=re.sub(r'/\*.*?\*/',lambda m:'\n'*m.group(0).count('\n'),t,flags=re.S)
    t=re.sub(r'(?m)(^|\s)//[^\n]*',lambda m:m.group(1),t)
    rules=[]; stack=[]  # stack of (sel, ctx, decls, line)
    buf=''; line=1; bufline=1
    def cur_sel():
        sels=['']
        for s,_,_,_ in stack:
            if s is None: continue
            parts=[x.strip() for x in s.split(',')]
            new=[]
            for base in sels:
                for p in parts:
                    new.append(p.replace('&',base) if '&' in p else (base+' '+p).strip())
            sels=new
        return ', '.join(sels)
    def cur_ctx():
        return ' · '.join(c for _,c,_,_ in stack if c)
    i=0;n=len(t)
    while i<n:
        c=t[i]
        if c=='\n': line+=1
        if c in '{':
            head=buf.strip(); buf=''
            ctx=''; sel=head
            m=re.match(r'@media\s*(.*)',head)
            mm=re.match(r'\.(desktop|tablet)\(\s*$',head)
            if m: ctx='@media '+m.group(1); sel=None
            elif head.startswith('@keyframes') or head.startswith('@'): ctx=head; sel=None
            elif mm: ctx='@media min-width '+('64em' if mm.group(1)=='desktop' else '48em'); sel=None
            elif re.match(r'\.on-hover\(\s*$',head): ctx='hover (puntatore fine)'; sel=None
            elif re.match(r'\.[\w-]+\(\s*$',head): ctx='mixin '+head.rstrip('( '); sel=None
            stack.append((sel,ctx,[],bufline)); 
        elif c=='}':
            if buf.strip():
                stack[-1][2].append(parse_decl(buf.strip(),bufline))
            buf=''
            s,ctx,decls,ln=stack.pop()
            # mixin-call blocks: "({ ... })" closing paren
            if stack is not None and decls:
                full=sel_of(stack,s)
                rules.append(dict(sel=full,ctx=ctx_of(stack,ctx),decls=decls,line=ln))
            if i+1<n and t[i+1]==')': i+=1
        elif c==';':
            if buf.strip(): stack[-1][2].append(parse_decl(buf.strip(),bufline)) if stack else None
            buf=''
        else:
            if not buf.strip(): bufline=line
            buf+=c
        i+=1
    return rules

def parse_decl(s,line):
    s=s.strip()
    if s.startswith('@import'): return ('@import',s,line)
    m=re.match(r'^([\w-]+|--[\w-]+)\s*:\s*(.*)$',s,flags=re.S)
    if m and not s.startswith('&'): return (m.group(1),re.sub(r'\s+',' ',m.group(2)),line)
    return ('mixin',re.sub(r'\s+',' ',s),line)

def sel_of(stack,s):
    sels=['']
    for sel in [x[0] for x in stack]+[s]:
        if sel is None: continue
        parts=[x.strip() for x in sel.split(',')]
        new=[]
        for base in sels:
            for p in parts: new.append(p.replace('&',base) if '&' in p else (base+' '+p).strip())
        sels=new
    return ', '.join(sels)
def ctx_of(stack,ctx):
    cs=[x[1] for x in stack if x[1]]+([ctx] if ctx else [])
    return ' · '.join(cs)

def table(path, only=None, skip_mixin_imports=True):
    rules=parse(path)
    rows=[]
    for r in rules:
        if only and not re.search(only,r['sel']+r['ctx']): continue
        decl=[(p,v,l) for p,v,l in r['decls'] if p!='@import']
        if not decl: continue
        d='<br>'.join(f'<code>{html.escape(p) if p!="mixin" else ""}{": " if p!="mixin" else ""}{html.escape(v)}</code> <span class="ln">r.{l}</span>' for p,v,l in decl)
        sel=html.escape(r['sel'] or '(radice)')
        ctx=f'<div class="cx">{html.escape(r["ctx"])}</div>' if r['ctx'] else ''
        rows.append(f'<tr><td><code>{sel}</code>{ctx}</td><td>{d}</td></tr>')
    return (f'<div class="dc-scroll"><table class="dc-tbl dc-spec"><thead><tr><th>Selettore</th><th>Valori nel codice</th></tr></thead><tbody>'
            + ''.join(rows) + f'</tbody></table></div><p class="dc-src">Fonte: <code>src/{path}</code> (commit 8b15e60), righe indicate come r.N.</p>')

if __name__=='__main__':
    import sys
    for r in parse(sys.argv[1]): print(r['sel'],'|',r['ctx'],'|',[(p,v) for p,v,l in r['decls']][:4])
