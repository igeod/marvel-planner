from parts import *
import tokparse as TP, re, html, lessspec, glob, subprocess
SRC=lessspec.SRC
def tv(t,th='light'):
    v=TP.val(t,th); return f'<code>{v[0]}</code> <span class="ln">r.{v[1]}</span>'
def used(tok):
    return str(len(subprocess.run(['grep','-rn',f'var({tok})','--include=*.less',SRC],capture_output=True,text=True).stdout.splitlines()))
D=[('--dur-press','pressione (:active)'),('--dur-hover','hover, colore'),('--dur-ui','UI e uscite'),('--dur-enter','entrata'),('--dur-progress','riempimento barre'),('--delay-tooltip','attesa tooltip'),('--delay-pending','attesa prima di skeleton/spinner'),('--stagger-step','scaglionamento'),('--stagger-max','massimo scaglionamento')]
_t=open(SRC+'styles/tokens.less').read().split('\n')
red={}; _on=False
for i,l in enumerate(_t,1):
    if 'prefers-reduced-motion: reduce' in l: _on=True; continue
    if _on:
        m=re.match(r'\s*(--[\w-]+):\s*([^;]+);',l)
        if m: red[m.group(1)]=(m.group(2),i)
        if l.startswith('}'): break
rows=[]
for t,d in D:
    r=red.get(t)
    rows.append([f'<code>{t}</code>',tv(t),f'<code>{r[0]}</code> <span class="ln">r.{r[1]}</span>' if r else 'invariato (<code>%s</code>)'%TP.val(t,'light')[0],d,used(t)])
KF={}
for f in ['styles/motion.less','components/ui/Button/Button.less','components/ui/PosterImage/PosterImage.less']:
    L_=open(SRC+f).read().split('\n')
    for i,l in enumerate(L_):
        m=re.match(r'@keyframes ([\w-]+)',l)
        if m:
            j=i;body=[];depth=0
            while True:
                depth+=L_[j].count('{')-L_[j].count('}'); body.append(L_[j].strip()); j+=1
                if depth==0: break
            KF[m.group(1)]=(f,i+1,' '.join(body))
use={}
for p in glob.glob(SRC+'**/*.less',recursive=True):
    for i,l in enumerate(open(p).read().split('\n')):
        m=re.search(r'animation(?:-name)?:\s*([\w-]+)',l)
        if m and m.group(1) in KF: use.setdefault(m.group(1),[]).append(p.replace(SRC,'')+f' r.{i+1}')
krows=[]
for k,(f,ln,b) in KF.items():
    u=use.get(k,[]); us=', '.join(u[:3])+(f' … (+{len(u)-3})' if len(u)>3 else '') if u else '<i>nessun uso trovato</i>'
    krows.append([f'<code>{k}</code>',f'{f} r.{ln}',f'<code>{html.escape(b[len("@keyframes "+k):].strip())}</code>',us])
def grep1(path,pat):
    for i,l in enumerate(open(SRC+path).read().split('\n'),1):
        if re.search(pat,l): return i
wait=tbl(['Indicatore','Movimento normale','Movimento ridotto','File'],[
 ['Spinner del pulsante (<code>btn-spin</code>)','0,8 s, lineare, infinito','1,6 s: lo spinner è uno stato, quindi gira anche con movimento ridotto, a metà velocità',f'Button.less r.{grep1("components/ui/Button/Button.less","animation: btn-spin")}, r.{grep1("components/ui/Button/Button.less","animation-duration")}'],
 ['Spinner del poster (<code>poster-spin</code>)','0,8 s, lineare, infinito','1,6 s, stessa regola',f'PosterImage.less r.{grep1("components/ui/PosterImage/PosterImage.less","poster-spin 1.6s")}, r.{grep1("components/ui/PosterImage/PosterImage.less","animation-duration")}'],
 ['Attesa prima di mostrarli','<code>--delay-pending</code> 200ms','invariata',f'tokens.less r.{TP.val("--delay-pending","light")[1]}'],
])
S=[]
S.append(h1('Motion','Cinque durate, una curva, scaglionamento e animazioni: tutto il movimento è in un solo file.'))
S.append(hdr('Durate, curva, attese, scaglionamento, comportamento con movimento ridotto, elenco delle animazioni',
 'src/styles/tokens.less (--dur-*, --ease-out, --delay-*, --stagger-*), src/styles/motion.less (tutto il movimento), Button.less e PosterImage.less per le animazioni locali',
 'Tutti i componenti'))
S.append(sec('Regole di fondo','Dai commenti in testa a motion.less e a tokens.less:',ul([
 'Mai <code>transition: all</code>, mai ease-in (motion.less r.1).',
 'Colore e opacità girano sempre; trasformazioni, altezze e animazioni a keyframe sono saltate con <code>prefers-reduced-motion</code> (motion.less r.2-3, tokens.less r.196-208). Unica eccezione scelta: gli spinner (vedi sotto).',
 'L\'uscita dura un gradino meno dell\'entrata: 240→180, 180→120, 120→80 (tokens.less r.175-185).'])))
S.append(sec('Curva e durate','Una sola curva: <code>--ease-out</code> '+tv('--ease-out')+'. Con movimento ridotto cambiano i valori della colonna “Movimento ridotto”.',
 f'<div class="dc-scroll">{tbl(["Token","Valore","Movimento ridotto","Uso","Righe .less che lo usano"],rows)}</div>'))
S.append(sec('Indicatori di attesa','Regola scelta: i loop degli spinner restano anche con movimento ridotto, a metà velocità.',wait))
S.append(sec('Animazioni a keyframe','Dove sono definite e dove sono usate (le righe di uso sono le prime tre trovate).',
 f'<div class="dc-scroll">{tbl(["Nome","Definita in","Passi","Usata in"],krows)}</div>'))
S.append(prima_dopo([
 ['Durate','scritte nella pagina','token letti da tokens.less, con i valori a movimento ridotto','tokens.less r.176-185, r.200-206'],
 ['Animazioni','elenco a mano','elenco generato dai @keyframes del codice','motion.less, Button.less, PosterImage.less'],
 ['Durata toast','4 s','6 s / 8 s: vedi la pagina Toast','ToastProvider.tsx'],
 ['Spinner','1,6 s','0,8 s con movimento normale, 1,6 s con movimento ridotto','Button.less, PosterImage.less'],
]))
write('Motion.dc.html','Motion','\n'.join(S))
