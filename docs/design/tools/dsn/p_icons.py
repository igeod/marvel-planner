from parts import *
import subprocess, re, os, glob, shutil, lessspec, html
SRC='@REPO@/src'
PRJ=glob.glob("@WORK@/canvas")[0]
os.makedirs(PRJ+'/assets/images',exist_ok=True)
for f in glob.glob(SRC+'/assets/*.webp'): shutil.copy(f,PRJ+'/assets/images/')
# icons used
icons={}
for p in glob.glob(SRC+'/**/*.tsx',recursive=True):
    t=open(p).read()
    for m in re.finditer(r'import\s*\{([^}]*)\}\s*from\s*"lucide-react"',t):
        for n in m.group(1).split(','):
            n=n.strip()
            if n: icons.setdefault(n,[]).append(os.path.basename(p).replace('.tsx',''))
def kebab(n): return re.sub(r'(?<=[a-z])(?=[0-9])|(?<=[0-9])(?=[A-Z])|(?<=[a-z])(?=[A-Z])','-',n).lower()
rows=[]
for n,fs in sorted(icons.items()):
    k=kebab(n)
    try: svg=icon(k,24)
    except Exception: svg='<i>—</i>'
    rows.append([svg,f'<code>{n}</code>',', '.join(sorted(set(fs)))])
# svg size rules
srows=[]
for p in glob.glob(SRC+'/**/*.less',recursive=True):
    rel=p.replace(SRC+'/','')
    try: rules=lessspec.parse(rel)
    except Exception: continue
    for r in rules:
        if re.search(r'\bsvg\b|\.lucide',r['sel']):
            d={a:(b,c) for a,b,c in r['decls'] if a in('width','height','stroke-width')}
            if d: srows.append([f'<code>{html.escape(r["sel"][:80])}</code>',os.path.basename(rel),' '.join(f'<code>{a}: {v}</code> <span class="ln">r.{l}</span>' for a,(v,l) in d.items())])
srows.sort(key=lambda x:x[1])
def im(name,w): return f'<img src="assets/images/{name}" alt="" width="{w}" height="{w}" style="display:block;border-radius:var(--r-md);background:var(--surface)">'
byt=lambda n:f'{os.path.getsize(SRC+"/assets/"+n)//1024} KB'
from PIL import Image
imported={'err-toast':'ToastProvider.tsx','err-429':'FormError.tsx','err-shared':'ImportSharedDialog.tsx','empty-search':'PlannerSearch.tsx','empty-filters':'FiltersEmpty.tsx','err-404':'NotFoundPage.tsx','err-500':'ErrorPage.tsx','err-maintenance':'MaintenancePage.tsx'}
arows=[]
for n in ['empty-filters','empty-search','err-404','err-429','err-500','err-maintenance','err-shared','err-toast']:
    w,h=Image.open(f'{SRC}/assets/{n}.webp').size
    arows.append([im(n+'.webp',96),f'<code>src/assets/{n}.webp</code>',f'{w}×{h}',byt(n+'.webp'),imported[n]])
S=[]
S.append(h1('Icone e immagini','Icone Lucide con misure e spessori, illustrazioni, loghi e miniature dei poster.'))
S.append(hdr('Icone usate, dimensioni nei .less, illustrazioni in src/assets, loghi, PosterImage',
 'src/components/ui/PosterImage/, src/assets/*.webp, public/ (favicon, icone), src/components/layout/AppFooter/tmdb-logo.svg',
 'Button, Toast, Field, Modal, ConfirmDialog, StateBox, LoadError, FormError, PosterThumb'))
S.append(sec('Icone (lucide-react)','Libreria <code>lucide-react</code>; ogni icona è importata per nome. Elenco generato dagli <code>import</code> nei .tsx.',
 f'<div class="dc-scroll">{tbl(["","Nome","Usata in"],rows)}</div>'))
S.append(sec('Dimensioni e spessore nei .less','Solo le regole con selettore <code>svg</code> o <code>.lucide</code> che dichiarano misura o spessore. Dove non c\'è una regola vale il default di lucide-react (24, spessore 2) '+NOVERIF+'.',
 f'<div class="dc-scroll">{tbl(["Selettore","File","Valori nel codice"],srows)}</div>'))
S.append(sec('Illustrazioni (src/assets)','Formato WebP. '+NOVERIF+' per le dimensioni di visualizzazione: ogni componente le dichiara nella sua pagina.',
 f'<div class="dc-scroll">{tbl(["Anteprima","File","Pixel","Peso","Importata da"],arows)}</div>'))
S.append(sec('Poster','',spec('components/ui/PosterImage/PosterImage.less')+spec('features/planner/components/PosterThumb/PosterThumb.less')))
S.append(sec('Loghi e icone del sito','<code>tmdb-logo.svg</code> nel footer (AppFooter.tsx r.9); <code>favicon.svg</code>, <code>favicon.ico</code>, <code>apple-touch-icon.png</code> e <code>og-image.png</code> in <code>public/</code>.',''))
S.append(sec('LEGGIMI_IMMAGINI','Il vecchio file delle istruzioni sulle immagini è assorbito da questa pagina e sarà cancellato.',''))
S.append(prima_dopo([
 ['Icone','elenco scritto a mano','elenco generato dagli import nei .tsx','componenti/*.tsx'],
 ['Illustrazioni','PNG e WebP in più cartelle','solo i WebP di src/assets','src/assets'],
 ['Spinner poster','1,6 s','0,8 s con movimento normale, 1,6 s con movimento ridotto: è la regola scelta','PosterImage.less r.61, r.66'],
]))
write('Icone e immagini.dc.html','Icone e immagini','\n'.join(S))
