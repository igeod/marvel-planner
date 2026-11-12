import re,json
css=open('../canvas/tokens.css').read()
def block(sel_re):
    m=re.search(sel_re+r'\s*\{(.*?)\n\}',css,flags=re.S); return dict(re.findall(r'--([\w-]+):\s*([^;]+);',m.group(1)))
light=block(r':root'); dark={**light,**block(r'\[data-theme="dark"\]')}
def hex2rgb(h):
    h=h.lstrip('#'); 
    if len(h)==3: h=''.join(c*2 for c in h)
    return tuple(int(h[i:i+2],16) for i in (0,2,4))
def parse(v,env,bg=None):
    v=v.strip()
    m=re.fullmatch(r'var\(--([\w-]+)(?:,.*)?\)',v)
    if m: return parse(env[m.group(1)],env,bg)
    if v.startswith('#'): return hex2rgb(v)+(1,)
    m=re.fullmatch(r'rgba?\(([^)]*)\)',v)
    if m:
        p=[float(x) for x in m.group(1).split(',')]; return (p[0],p[1],p[2],p[3] if len(p)>3 else 1)
    m=re.fullmatch(r'color-mix\(in srgb,\s*(.*)\)',v)
    if m:
        inner=m.group(1); parts=[];d=0;cur=''
        for ch in inner:
            if ch=='(':d+=1
            if ch==')':d-=1
            if ch==',' and d==0: parts.append(cur);cur=''
            else: cur+=ch
        parts.append(cur)
        def pc(x):
            x=x.strip(); mm=re.match(r'(.*?)\s+(\d+(?:\.\d+)?)%$',x)
            return (mm.group(1),float(mm.group(2))) if mm else (x,None)
        (a,pa),(b,pb)=pc(parts[0]),pc(parts[1])
        if pa is None and pb is None: pa=pb=50
        elif pa is None: pa=100-pb
        elif pb is None: pb=100-pa
        A=parse(a,env,bg);B=parse(b,env,bg); t=pa/(pa+pb)
        return tuple(A[i]*t+B[i]*(1-t) for i in range(3))+(1,)
    raise ValueError(v)
def over(c,bgc):
    a=c[3]; return tuple(c[i]*a+bgc[i]*(1-a) for i in range(3))+(1,)
def lum(c):
    def f(x): x/=255; return x/12.92 if x<=0.03928 else ((x+0.055)/1.055)**2.4
    return 0.2126*f(c[0])+0.7152*f(c[1])+0.0722*f(c[2])
def cr(a,b):
    la,lb=lum(a),lum(b); hi,lo=max(la,lb),min(la,lb); return (hi+.05)/(lo+.05)
PAIRS=[ # (label, fg, bg, min)
 ('Testo ink su bg','ink','bg',4.5),('Testo ink su surface','ink','surface',4.5),
 ('Testo ink-2 su bg','ink-2','bg',4.5),('Testo ink-2 su surface','ink-2','surface',4.5),
 ('Testo accent-text su bg','accent-text','bg',4.5),('Testo accent-text su surface','accent-text','surface',4.5),
 ('Testo danger-text su bg','danger-text','bg',4.5),('Testo danger-text su surface','danger-text','surface',4.5),
 ('Pulsante primario: on-primary su primary','on-primary','primary',4.5),
 ('Pulsante pericolo: on-danger su danger','on-danger','danger',4.5),
 ('Pulsante disabilitato: on-disabled su disabled','on-disabled','disabled',4.5),
 ('Oro: ink-static su highlight','ink-static','highlight',4.5),
 ('Pannello: on-dark su panel','on-dark','panel',4.5),('Pannello: muted-on-dark su panel','muted-on-dark','panel',4.5),
 ('Pannello: highlight su panel','highlight','panel',3),
 ('Non testo: primary su bg (pulsante)','primary','bg',3),('Non testo: primary su surface','primary','surface',3),
 ('Non testo: focus-color su bg','focus-color','bg',3),('Non testo: focus-color su surface','focus-color','surface',3),
 ('Non testo: focus-on-inverse (highlight/ink-static) su panel','highlight','panel',3),
 ('Non testo: ink-2 su surface (bordo campo)','ink-2','surface',3),
 ('Traccia: track-panel su panel','track-panel','panel',3),('Traccia: track-surface su surface','track-surface','surface',3),
 ('Riempimento barra: accent su track-surface','accent','track-surface',3),
]
rows=[]
for th,env in (('chiaro',light),('scuro',dark)):
    bgc=parse('bg',env) if False else parse(env['bg'],env)
    for lab,fg,bg,mn in PAIRS:
        try:
            F=parse('var(--%s)'%fg,env); B=parse('var(--%s)'%bg,env)
            if B[3]<1: B=over(B,parse(env['bg'],env))
            if F[3]<1: F=over(F,B)
            r=cr(F,B); rows.append((th,lab,round(r,2),mn,'sì' if r>=mn else 'NO'))
        except Exception as e: rows.append((th,lab,None,mn,'n/d '+str(e)[:30]))
# gold total track
env=light
F=parse('color-mix(in srgb, var(--ink-static) 55%, var(--highlight))',env);B=parse('var(--highlight)',env)
rows.append(('entrambi','Traccia totale su oro (ink-static 55%) su highlight',round(cr(F,B),2),3,'sì' if cr(F,B)>=3 else 'NO'))
json.dump(rows,open('/tmp/contrast.json','w'),ensure_ascii=False)
for r in rows: print(r)
