import re,glob,html,collections,os
pages=sorted(glob.glob('out/*.dc.html'))
sel=collections.defaultdict(set); hand=[]
for f in pages:
    n=os.path.basename(f)[:-8]; s=open(f).read()
    # strip helmet style block (canvas scaffolding)
    body=re.sub(r'<helmet>.*?</helmet>','',s,flags=re.S)
    body=re.sub(r'<script.*?</script>','',body,flags=re.S)
    # remove iframe srcdoc (contains whole docs; inner styles are canvas frames)
    body_nosrc=re.sub(r'srcdoc="[^"]*"','srcdoc=""',body)
    # selectors in spec tables
    for m in re.finditer(r'<table class="dc-tbl dc-spec">.*?</table>',body_nosrc,flags=re.S):
        for c in re.findall(r'<tr><td><code>(.*?)</code></td>',m.group(0)):
            sel[html.unescape(re.sub('<[^>]+>','',c))].add(n)
    # inline styles
    for st in re.findall(r'style="([^"]*)"',body_nosrc):
        for decl in st.split(';'):
            if ':' not in decl: continue
            p,v=[x.strip() for x in decl.split(':',1)]
            if re.search(r'#[0-9a-fA-F]{3,8}\b|rgba?\(|\d+(\.\d+)?(px|rem|em)\b',v) and 'var(' not in v.split(' ')[0] :
                hand.append((n,p,v))
    # srcdoc inline styles
    for sd in re.findall(r'srcdoc="([^"]*)"',body):
        sd=html.unescape(sd)
        for st in re.findall(r'style="([^"]*)"',sd):
            for decl in st.split(';'):
                if ':' not in decl: continue
                p,v=[x.strip() for x in decl.split(':',1)]
                if re.search(r'#[0-9a-fA-F]{3,8}\b|rgba?\(|\d+(\.\d+)?(px|rem|em)\b',v): hand.append((n+' (iframe)',p,v))
dups={k:v for k,v in sel.items() if len(v)>1}
print('PAGES',len(pages)); print('DUP SELECTORS',len(dups))
for k,v in sorted(dups.items()): print('  ',k[:70],'->',sorted(v))
c=collections.Counter((n,p) for n,p,v in hand)
print('HAND-WRITTEN inline',len(hand))
for (n,p),k in sorted(c.items()): print('  ',n,p,k)
import json; json.dump(hand,open('/tmp/hand.json','w'))
