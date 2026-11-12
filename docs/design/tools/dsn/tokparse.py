import re
SRC='@REPO@/src/styles/tokens.less'
def parse():
    L=open(SRC).read().split('\n')
    ctx=None; media=None; out={}
    i=0
    while i<len(L):
        ln=L[i]; s=ln.strip()
        if s.startswith('.light-tokens()'): ctx='light'
        elif s.startswith('.dark-tokens()'): ctx='dark'
        elif s.startswith(':root {'): ctx='root'
        elif s.startswith('@media'): media=s.split('{')[0].replace('@media','').strip(); ctx='media'
        elif ln.startswith('}'): ctx=None; media=None
        m=re.match(r'\s*(--[\w-]+):\s*(.*)',ln)
        if m and ctx:
            name,val=m.group(1),m.group(2); start=i+1
            while not val.rstrip().endswith(';'):
                i+=1; val+=' '+L[i].strip()
            val=re.sub(r'\s+',' ',val.rstrip().rstrip(';')).replace('( ','(').replace(' )',')')
            key=ctx if ctx!='media' else 'media:'+media
            out.setdefault(name,{})[key]=(val,start)
        i+=1
    return out
T=parse()
def val(name,theme):
    d=T[name]
    if theme=='dark' and 'dark' in d: return d['dark']
    for k in ('light','root'):
        if k in d: return d[k]
    for k in d: return d[k]
def rows(names,swatch=True):
    r=[]
    for n in names:
        if n not in T: continue
        lv=val(n,'light'); dv=val(n,'dark')
        sw=f'<span class="dc-sw" style="background:var({n})"></span>' if swatch else ''
        same=lv==dv
        r.append((n,lv,dv,same))
    return r
