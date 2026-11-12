from lib2 import *
import re,html
GR=[('A · Fondamenta',['Colors','Typography','Spacing e layout','Motion','Icone e immagini','Accessibility']),
    ('B · Componenti',['Buttons','Textfield','Select','Switch e ChoiceGroup','Accordion','Badges','Tooltip','Toast','Progress','Spoiler box','Scrollbar','Navigation','Splash','System states']),
    ('C · Schermate',['Planner','Pagina Film','Popup di accesso','Profile Popup','Popup generici','Pagine di errore'])]
def info(n):
    s=open(f'out/{n}.dc.html').read()
    d=dict(re.findall(r'<div><b>(Cosa descrive|Cartella del codice|Componenti che usa)</b><span>(.*?)</span>',s))
    return d
S=[h1('Indice','Le 26 pagine del design system di Marvel Planner: che cosa descrive ciascuna, quali componenti usa, dove sta nel codice.')]
S.append(hdr('Indice delle pagine del canvas, con i componenti che ognuna usa e la cartella del codice',
 'Nessuna: questa pagina non descrive codice. Il riferimento di tutte le altre è main, commit '+COMMIT,
 'Nessuno','11 novembre 2026'))
S.append(sec('Come leggerlo','',ul([
 'Ogni cosa è definita in una sola pagina. Le Fondamenta (A) definiscono i valori, i Componenti (B) li usano e si descrivono una volta, le Schermate (C) usano i componenti e definiscono solo le proprie parti.',
 'I valori vengono dal codice (<code>src/</code>, commit '+COMMIT+') e ogni tabella cita file e riga. Dove il codice non dice, la pagina scrive “non verificato”; dove un’idea è nel canvas ma non nel codice, scrive “solo canvas”.',
 '<code>tokens.css</code> e <code>app.css</code> sono compilati dal codice: le pagine non ripetono i valori a mano.',
 'Che cosa manca nel codice e le decisioni scartate sono in <code>HANDOFF.md</code>; la storia delle modifiche in <code>CHANGELOG.md</code>.'])))
for t,ps in GR:
    rows=[]
    for p in ps:
        d=info(p)
        rows.append([f'<b>{html.escape(p)}</b>',d.get('Cosa descrive',''),d.get('Componenti che usa',''),d.get('Cartella del codice','')])
    S.append(sec(t,'',f'<div class="dc-scroll">{tbl(["Pagina","Che cosa descrive","Componenti che usa","Cartella del codice"],rows)}</div>'))
S.append(prima_dopo([
 ['Pagine','27 pagine di guida più le pagine del giro, con valori ripetuti','26 pagine in tre gruppi (6 fondamenta, 14 componenti, 6 schermate) più questo indice','—'],
 ['Pagine del giro','Decisioni, Errori, Accesso, Revisione codice e altre','assorbite nelle pagine sopra; dove è finito ogni punto: CHANGELOG.md','CHANGELOG.md'],
 ['Documenti','CHANGES_FOR_CODE, DA_IMPLEMENTARE, ERRORI_SPEC, PROFILE_POPUP_SPEC, REPORT_FASE_A','un solo HANDOFF.md e un CHANGELOG.md','HANDOFF.md, CHANGELOG.md'],
]))
write('Index.dc.html','Indice','\n'.join(S))
