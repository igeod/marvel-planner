from parts import *
def eye(shown=False,state=''): return f'<button type="button" class="spoiler-box__eye {state}" aria-expanded="{"true" if shown else "false"}" aria-label="{L("details.spoilerZone")}">{icon("eye-off" if shown else "eye")}</button>'
def box(title,hidden,body,eye_state=''):
    h=' data-hidden="true" aria-hidden="true"' if hidden else ''
    return f'<article class="spoiler-box"><div class="spoiler-box__head"><h3 class="section-title">{title}</h3>{eye(not hidden,eye_state)}</div><div class="spoiler-box__content"{h} style="max-height:12rem"><div class="spoiler-list">{body}</div></div></article>'
item=lambda t: f'<div class="spoiler-item"><div>{t}<small>{L("details.keyScenes.editorial")}</small></div><a class="spoiler-item__source" href="#" aria-label="{L("details.easterEggs.source")}">{icon("external-link")}</a></div>'
body=item(L('details.missing.spoilers'))*3
S=[]
S.append(h1('Spoiler box','Il riquadro scuro che tiene sfocato ciò che racconta la storia, finché non premi l\'occhio.'))
S.append(hdr('SpoilerBox: testata, occhio, contenuto sfocato, voci',
 'src/components/ui/SpoilerBox/ (SpoilerBox.tsx, SpoilerBox.less); usato da PlotSection, KeyScenes, EasterEggs, BeforeYouWatch',
 'Tooltip (tono warning), icone Eye / EyeOff / ExternalLink (Lucide)'))
S.append(sec('Stati','Nascosto: il contenuto è <code>filter: blur(8px)</code>, <code>inert</code>, <code>aria-hidden</code>, non selezionabile e fuori dall\'ordine di tab. Rivelato: leggibile, scorre dentro il riquadro (altezza decisa da chi lo usa).',
 both('560px',f'<div style="display:flex;flex-direction:column;gap:var(--sp-4)">{box(L("details.spoilerZone"),True,body)}{box(L("details.spoilerZone"),False,body)}</div>','Nascosto · rivelato')))
S.append(sec('Occhio','Tasto da <code>--tap</code> con icona 20px in oro; hover <code>--raised-2</code>, premuto <code>--raised-3</code>. L\'etichetta accessibile è <code>spoiler.showLabel</code> / <code>hideLabel</code> del chiamante; al focus o hover mostra il Tooltip warning <code>prerequisites.warning</code>.',
 frame('dark','560px',f'<div style="background:var(--panel-2);padding:var(--sp-4);border-radius:var(--r-md);display:flex;gap:var(--sp-4)">{eye()}{eye(False,"is-hover")}{eye(False,"is-active")}{eye(True,"is-focus")}</div>','Normale · hover · premuto · focus')))
S.append(sec('Testi nelle 5 lingue','',tbl(['Lingua','details.spoilerZone','details.missing.spoilers','prerequisites.warning'],[[l]+[L(k,l) for k in ('details.spoilerZone','details.missing.spoilers','prerequisites.warning')] for l in LANGS])))
S.append(sec('Valori nel codice: SpoilerBox.less','',spec('components/ui/SpoilerBox/SpoilerBox.less')))
S.append(sec('Regole','',ul(['Solo ciò che racconta la trama sta dietro l\'occhio; l\'introduzione (<code>intro</code>) resta leggibile.','Lo sfocato anima in <code>--dur-enter</code> (240ms); con movimento ridotto è immediato.','Il box è sempre su sfondo scuro (<code>--panel-2</code>) in entrambi i temi: nella zona spoiler i tooltip usano <code>--on-dark</code>.'])))
S.append(prima_dopo([
 ['Box e occhio','pagina con misure scritte a mano','tutte le misure dal .less, nessun valore locale','SpoilerBox.less'],
 ['Sfocatura','non verificata','8px, <code>--dur-enter</code>','SpoilerBox.less'],
]))
write('Spoiler box.dc.html','Spoiler box','\n'.join(S))
