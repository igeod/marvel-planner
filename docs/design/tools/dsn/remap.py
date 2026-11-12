import re,os,sys,glob
from linemap import lmap
OLD='/tmp/srcb7/src'; NEW='@REPO@/src'
idx={}
for root,_,fs in os.walk(NEW):
    for f in fs: idx.setdefault(f,[]).append(os.path.join(root,f))
cache={}
def getmap(base):
    if base in cache: return cache[base]
    ps=idx.get(base,[])
    if len(ps)!=1: cache[base]=None; return None
    new=ps[0]; old=OLD+new[len(NEW):]
    if not os.path.exists(old) or open(old).read()==open(new).read(): cache[base]=None; return None
    cache[base]=lmap(old,new); return cache[base]
pat=re.compile(r'([A-Za-z][A-Za-z0-9]*\.(?:tsx|ts|less)) r\.(\d+)(?:-(\d+))?((?:, r\.\d+(?:-\d+)?)*)')
rep=[];bad=[]
def fix(m,fn):
    base=m.group(1); mp=getmap(base)
    if mp is None: return m.group(0)
    def one(a,b):
        na=mp.get(int(a)); 
        if b is None:
            if na is None: bad.append((fn,base,a)); return f'{a}?'
            return str(na)
        nb=mp.get(int(b))
        if na is None or nb is None:
            # try nearest
            na=na or next((mp[x] for x in range(int(a),int(b)+1) if x in mp),None); nb=nb or next((mp[x] for x in range(int(b),int(a)-1,-1) if x in mp),None)
            if na is None or nb is None: bad.append((fn,base,a+'-'+b)); return f'{a}-{b}?'
        return f'{na}-{nb}' if na!=nb else str(na)
    out=base+' r.'+one(m.group(2),m.group(3))
    for x in re.findall(r', r\.(\d+)(?:-(\d+))?',m.group(4)):
        out+=', r.'+one(x[0],x[1] or None)
    if out!=m.group(0): rep.append((fn,m.group(0),out))
    return out
for fn in sorted(glob.glob('p_*.py')+glob.glob('add_[a-z0-9]*.py')+['comp.py','parts.py','lib2.py','lessspec.py']):
    if fn=='p_colors.py' or fn=='add_impl.py': continue
    s=open(fn).read(); s2=pat.sub(lambda m:fix(m,fn),s)
    if s2!=s and '--apply' in sys.argv: open(fn,'w').write(s2)
print(len(rep),'changes'); 
for r in rep[:400]: print(r)
print('BAD',bad)
