from comp import *
import lib2

# Stili solo di questa pagina (proposta): solo token esistenti. Nel codice diventano le classi `adm-*` (vedi tabella "Misure e token").
lib2.CSS += '''
.adm-kinds{display:grid;grid-template-columns:repeat(auto-fit,minmax(8.5rem,1fr));gap:var(--sp-2) var(--sp-3)}
.adm-kind{display:flex;flex-direction:column;align-items:flex-start;gap:var(--sp-1)}
.adm-kind__label{font-size:var(--fs-caption);font-weight:800;color:var(--ink-2)}
.adm-sources{display:grid;grid-template-columns:auto 1fr;gap:var(--sp-1) var(--sp-4);margin:0;font-size:var(--fs-label)}
.adm-sources dt{color:var(--ink-2)}
.adm-sources dd{margin:0;font-weight:700}
.adm-sources dd.adm-sources__use{font-weight:800}
.adm-revert{margin-inline-end:auto}
.adm-demo{display:flex;flex-direction:column;gap:var(--sp-4)}
'''

OV2='display:block;opacity:1;transform:none;translate:none;scale:none;position:relative;margin:0;max-width:100%'
def modal(title,body,size='md'):
    return (f'<dialog class="dialog dialog--{size}" open style="{OV2}"><div class="dialog__scroll scroll-y"><header class="dialog__header"><h2 tabindex="-1">{title}</h2></header><div class="dialog__body">{body}</div></div>'
            f'<button type="button" class="dialog__close" aria-label="{L("common.close")}">{icon("x")}</button></dialog>')
def confirm(title,msg,ok,ic='triangle-alert'):
    return (f'<dialog class="dialog dialog--confirm" open style="{OV2}"><div class="dialog__body"><div class="dialog__head"><span class="dialog__icon dialog__icon--warning" aria-hidden="true">{icon(ic)}</span><h2>{title}</h2></div><p>{msg}</p>'
            f'<div class="dialog__actions">{btn("soft","Annulla")}{btn("primary",ok)}</div></div></dialog>')
def toast(title,action):
    return (f'<div class="toast toast--info" role="status"><span class="toast__badge" aria-hidden="true">{icon("check")}</span><div class="toast__text"><strong>{title}</strong></div>'
            f'{btn("panel",action,"sm").replace("btn btn--panel","btn btn--panel toast__action")}<button type="button" class="toast__close" aria-label="{L("common.close")}">{icon("x")}</button></div>')

def pill(kind):
    k={'ok':('ok','check','Presente'),'miss':('late','circle-dashed','Manca'),'ver':('never','minus','Verificato'),'rev':('late','refresh-cw','Da rivedere')}[kind]
    return f'<span class="admin-pill admin-pill--{k[0]}">{icon(k[1])}{k[2]}</span>'
KL=['Guida','Post credits','Scene chiave','Easter egg']
def kinds(v):
    return '<div class="adm-kinds">'+''.join(f'<div class="adm-kind"><span class="adm-kind__label">{l}</span>{pill(s)}</div>' for l,s in zip(KL,v))+'</div>'
def planner_link(): return f'<a class="btn btn--soft" href="#">Apri nel planner{icon("maximize-2")}</a>'
def title_row(name,meta,v,review=False,copy_primary=True):
    head=f'<div class="candidate__head"><strong class="candidate__title" lang="en">{name}</strong>'+(f'<span class="admin-pill admin-pill--late">{icon("refresh-cw")}Guida da rivedere</span>' if review else '')+'</div>'
    note=f'<p class="admin-note">La guida è stata scritta prima dell’uscita: l’elenco dei prerequisiti era provvisorio.</p>' if review else ''
    miss=[s for s in v if s=='miss']
    acts=[]
    if review: acts.append(btn('primary','Rivista','','','check'))
    if miss: acts.append(btn('soft' if review else 'primary','Copia modello','','','copy'))
    acts.append(planner_link())
    if any(s in('miss','ver') for s in v[1:]): acts.append(btn('text','Segna verificato…','','','list-checks'))
    return (f'<li class="admin-row candidate">{head}<p class="admin-note candidate__meta">{meta}</p>{kinds(v)}{note}<div class="candidate__actions">{"".join(acts)}</div></li>')

def section(inner,sid=''): return f'<div class="admin"><section{f" id=\"{sid}\"" if sid else ""}>{inner}</section></div>'
def filt(sel=0,counts=(12,2,64)):
    labs=[f'Da completare ({counts[0]})',f'Guide da rivedere ({counts[1]})',f'Tutti i titoli usciti ({counts[2]})']
    return grp('Mostra',3,''.join(ch(l,'radio',i==sel) for i,l in enumerate(labs)))
INTRO='<p>Per ogni titolo uscito: che cosa manca tra guida, post credits, scene chiave ed easter egg. «Verificato» vuol dire controllato, niente da aggiungere.</p>'
def empty(text): return f'<div class="candidates__empty"><span class="candidates__empty-icon" aria-hidden="true">{icon("check")}</span><div class="candidates__empty-text"><p>{text}</p></div></div>'

ROWS=(title_row('VisionQuest','Serie · uscita 13 ott 2026 · Fase Sei',['ok','miss','miss','miss'],review=True)
     +title_row('Ironheart','Serie · uscita 24 giu 2025 · Fase Sei',['ok','ver','miss','ok'])
     +title_row('Eyes of Wakanda','Serie animata · uscita 27 ago 2025 · Fase Sei',['miss','miss','miss','miss']))
MORE=f'<div><button type="button" class="btn btn--soft">Mostra altri 9</button></div>'
LIST=section(f'<h2>Contenuti da completare</h2>{INTRO}<p class="admin-note">12 titoli da completare su 64 usciti</p>{filt(0)}<ul class="candidates__list">{ROWS}</ul>{MORE}','da-completare')
LIST_REV=section(f'<h2>Contenuti da completare</h2>{INTRO}<p class="admin-note">2 guide da rivedere</p>{filt(1)}<ul class="candidates__list">{title_row("VisionQuest","Serie · uscita 13 ott 2026 · Fase Sei",["ok","miss","miss","miss"],review=True)}</ul>','da-completare')
EMPTY=section(f'<h2>Contenuti da completare</h2>{INTRO}{filt(0,(0,0,64))}{empty("Tutto completo: i 64 titoli usciti hanno tutti i contenuti o sono stati verificati.")}','da-completare')
EMPTY_REV=section(f'<h2>Contenuti da completare</h2>{INTRO}{filt(1,(12,0,64))}{empty("Nessuna guida da rivedere.")}','da-completare')

verif=modal('Verificato: niente da aggiungere',
  '<p>Per <strong lang="en">VisionQuest</strong>. Spunta ciò che hai controllato e che davvero non c’è. Togli la spunta per rimetterlo da completare.</p>'
  +grp('Contenuti verificati',3,ch('Post credits','checkbox',True)+ch('Scene chiave','checkbox',False)+ch('Easter egg','checkbox',False))
  +f'<div class="dialog__actions">{btn("soft","Annulla")}{btn("primary","Salva")}</div>')

# ---- Date
def date_row(name,state,lines,acts,meta=''):
    k={'none':('late','circle-dashed','Senza data'),'year':('late','circle-dashed','Solo l’anno'),'manual':('ok','pencil','Corretta a mano'),'diff':('late','triangle-alert','Data diversa'),'changed':('late','refresh-cw','TMDB ha cambiato la data')}[state]
    return (f'<li class="admin-row candidate"><div class="candidate__head"><strong class="candidate__title" lang="en">{name}</strong><span class="admin-pill admin-pill--{k[0]}">{icon(k[1])}{k[2]}</span></div>'
            f'<p class="admin-note candidate__meta">{lines}</p><div class="candidate__actions">{"".join(acts)}</div></li>')
EDIT=btn('soft','Modifica data','','','calendar-clock')
DATES=section('<h2>Date di uscita</h2><p>Titoli con una data da controllare. La data scritta a mano vince su quella di TMDB.</p><ul class="candidates__list">'
  +date_row('Avengers: Doomsday','year','TMDB: solo l’anno, 2026 · Manuale: nessuna',[EDIT])
  +date_row('Spider-Man: Brand New Day','manual','TMDB: nessuna · Manuale: 31 lug 2026 · In uso: manuale',[EDIT])
  +date_row('Wonder Man','changed','TMDB ora dice 20 gen 2026 · La tua data: 13 gen 2026',[btn('primary','Tieni la mia'),btn('soft','Usa TMDB')])
  +'</ul><div>'+btn('text','Modifica la data di un altro titolo','','','calendar-clock')+'</div>','date')
DIFF=section('<h2>Date di uscita</h2><ul class="candidates__list">'
  +date_row('VisionQuest','diff','TMDB 13 ott 2026 · Wikidata 20 ott 2026',[btn('soft','Usa TMDB'),btn('soft','Usa Wikidata'),btn('text','Ignora')])+'</ul>','date')

def sources(tmdb,manual,use): return f'<dl class="adm-sources"><dt>TMDB</dt><dd>{tmdb}</dd><dt>Scritta a mano</dt><dd>{manual}</dd><dt>In uso</dt><dd class="adm-sources__use">{use}</dd></dl>'
ED_ACT=f'<div class="dialog__actions">{btn("text","Torna alla data di TMDB","","adm-revert","undo-2")}{btn("soft","Annulla")}{btn("primary","Salva")}</div>'
ED=modal('Data di uscita · <span lang="en">VisionQuest</span>',
  sources('13 ott 2026','—','13 ott 2026 (TMDB)').replace('<dd>—</dd>','<dd>—</dd>')
  +tf('Data scritta a mano','2026-10-20',hint='20 ottobre 2026 · formato AAAA-MM-GG',ph='AAAA-MM-GG')
  +f'<div class="dialog__actions">{btn("soft","Annulla")}{btn("primary","Salva")}</div>')
ED_SET=modal('Data di uscita · <span lang="en">VisionQuest</span>',
  sources('13 ott 2026','20 ott 2026','20 ott 2026 (a mano)')
  +tf('Data scritta a mano','2026-10-20',hint='20 ottobre 2026 · formato AAAA-MM-GG',ph='AAAA-MM-GG')+ED_ACT)
ED_ERR=modal('Data di uscita · <span lang="en">VisionQuest</span>',
  sources('13 ott 2026','—','13 ott 2026 (TMDB)')
  +tf('Data scritta a mano','2026-13-40',error='Data non valida. Scrivila come AAAA-MM-GG, per esempio 2026-10-13.',ph='AAAA-MM-GG')
  +f'<div class="dialog__actions">{btn("soft","Annulla")}{btn("primary","Salva")}</div>')
CONF=confirm('Segnare Spider-Man: Brand New Day come uscito?','Con la data 2026-07-31 il titolo risulta uscito: gli utenti potranno segnarlo come visto e conterà nel totale.','Conferma')
TOAST='<div style="width:min(440px,100%)">'+toast('Data di TMDB ripristinata','Annulla')+'</div>'

S=[]
S.append(h1('Admin','La pagina /admin: contenuti da completare, guida da rivedere, correzione delle date. Proposta · non implementata.'))
S.append(hdr('Pagina /admin (AdminDashboard): le sezioni già nel codice (Candidati, Manutenzione, Automazione, Utenti) e le due nuove proposte (Contenuti da completare, Date di uscita). Titoli e date negli esempi sono dati di prova.',
 'src/features/admin/components/ (AdminDashboard, CandidatesSection, AutomationSection, MaintenanceSection, UsersSection), shared/admin.ts, worker/routes/admin.ts',
 'Buttons (primary, soft, text), Switch e ChoiceGroup (filtro e verifica), Popup generici (Modal, ConfirmDialog), Textfield, Toast, System states (stato vuoto come <code>.candidates__empty</code>), Select (solo per “un altro titolo”)'))
S.append(sec('Raccomandazioni',f'Una per punto; le alternative in tabella. {NOCANVAS}',
 tbl(['Punto','Raccomandazione','Alternative'],[
  ['1 · Da completare','Elenco a righe, una per titolo uscito, con quattro pillole di stato; di base solo i titoli con qualcosa da fare (12 su 64), più recenti prima, 10 per volta. «Verificato» si segna da un popup a spunte.','Tabella con una colonna per contenuto (troppo larga: 880px max, il telefono la spezza); raggruppare per tipo di contenuto (un titolo compare 3 volte).'],
  ['2 · Guida da rivedere','Pillola “Guida da rivedere” in testa alla riga e pulsante “Rivista”. Solo admin.','Segnale anche per l’utente: sconsigliato, la guida resta leggibile e corretta.'],
  ['3 · Data a mano','Solo data completa AAAA-MM-GG, in un popup aperto da una sezione “Date di uscita”. Vince la data scritta a mano; “Torna alla data di TMDB” la toglie.','B: anche AAAA-MM (conta come fine mese). C: “metà/fine 2026”: più testi nelle 5 lingue e non fa scattare da sola “in arrivo/uscito”.'],
  ['4 · Discrepanze','Non ora: servirebbe un secondo servizio e una mappa degli id Wikidata per 71 titoli, con date spesso copiate da TMDB o Wikipedia. Il problema vero (data mancante o approssimata) lo risolve il punto 3.','Se il committente la vuole: stessa riga, ma tra “prima” e “dopo” di TMDB (il giro giornaliero registra che la data è cambiata). Disegnata sotto con Wikidata come da richiesta.'],
  ['5 · Titoli senza codice','Resta lo snippet. Catalogo, riferimenti TMDB e guide sono dati nel codice, con test e legati ai link condivisi; un modulo non scrive le guide, quindi il codice si aprirebbe comunque. Con 3-5 titoli l’anno il guadagno è piccolo. Non disegnato.','Se serve più avanti: brief a parte (spostare il catalogo su D1 è un lavoro di architettura, non di interfaccia).'],
 ])))
S.append(sec('1 · Contenuti da completare: elenco',f'Dopo “Nuovi titoli su TMDB da valutare”. Righe come quelle dei candidati (<code>.admin-row.candidate</code>). Quattro stati per contenuto, sempre con testo e icona (mai solo il colore). Il filtro è un ChoiceGroup a tre voci. L’elenco di prova mostra 3 righe di 12: dopo 10, “Mostra altri”. La prima riga ha anche la guida da rivedere (punto 2). {NOCANVAS}',
 both('880px',LIST,'Desktop')+both('390px',LIST,'Telefono')))
S.append(sec('Stati delle pillole','',tbl(['Pillola','Classe','Icona','Quando'],[
 [pill('ok'),'<code>admin-pill--ok</code>','Check','il contenuto c’è nel catalogo'],
 [pill('miss'),'<code>admin-pill--late</code>','CircleDashed','non c’è e nessuno l’ha verificato'],
 [pill('ver'),'<code>admin-pill--never</code>','Minus','controllato, niente da aggiungere (post credits, scene chiave, easter egg; la guida no: o c’è o manca)'],
 [pill('rev'),'<code>admin-pill--late</code>','RefreshCw','solo guida: uscito + elenco provvisorio + nessuna revisione registrata'],
])))
S.append(sec('Elenco: filtro “Guide da rivedere”',NOCANVAS,both('880px',LIST_REV,'Desktop')))
S.append(sec('Elenco vuoto',f'Come l’elenco dei candidati: icona e una frase. Con il filtro “Guide da rivedere” la frase è un’altra. {NOCANVAS}',
 both('880px',EMPTY,'Tutto completo · desktop')+both('390px',EMPTY,'Tutto completo · telefono')+both('880px',EMPTY_REV,'Nessuna guida da rivedere')))
S.append(sec('“Segna verificato…”',f'Popup (<code>Modal</code>) con ChoiceGroup a spunte: la spunta vuol dire “verificato, niente da aggiungere”. I contenuti già verificati arrivano spuntati e si tolgono togliendo la spunta. Spunta tutto ciò che manca tra i tre. {NOCANVAS}',
 both('600px',verif,'Desktop')+both('390px',verif,'Telefono')))
S.append(sec('Azioni di riga','',ul([
 '<b>Apri nel planner</b>: <code>/titolo/:id</code>, stessa scheda, icona <code>Maximize2</code> come “Apri scheda”.',
 '<b>Copia modello</b>: copia nel codice la scheda vuota dei soli contenuti che mancano (come lo snippet dei candidati). L’etichetta diventa “Modello copiato” per 2 secondi; se la copia non riesce, mostra il codice. Il modello ha solo campi vuoti: nessun testo di trama o di scena, quindi nessuno spoiler.',
 '<b>Rivista</b>: toglie “Guida da rivedere”. Non cambia i testi della guida: quelli si correggono nel codice.',
 'Nessun testo di trama, di scena o di prerequisiti compare in questa sezione: se servisse (ad esempio i motivi dei prerequisiti), va dietro il pulsante spoiler.'])))
S.append(sec('3 · Date di uscita',f'Seconda sezione nuova, dopo “Contenuti da completare”. Elenca solo i titoli con una data da controllare: senza data, solo l’anno, scritta a mano, o TMDB cambiata dopo la correzione. “Modifica la data di un altro titolo” apre lo stesso popup con un SelectField dei 71 titoli sopra al campo. {NOCANVAS}',
 both('880px',DATES,'Desktop')+both('390px',DATES,'Telefono')))
S.append(sec('Editor della data',f'Un campo solo, AAAA-MM-GG (scritto, non il selettore del sistema: stesso formato in tutte le lingue). Sopra, tre righe: la data di TMDB, quella scritta a mano, quella in uso. Vince quella scritta a mano. Sotto il campo, la data in lettere appena è valida. {NOCANVAS}',
 both('600px',ED,'Senza data a mano')+both('600px',ED_SET,'Con data a mano: “Torna alla data di TMDB”')+both('600px',ED_ERR,'Data non valida')+both('390px',ED_SET,'Telefono')))
S.append(sec('Conferma e annullamento',f'La conferma compare solo se la nuova data cambia lo stato del titolo (in arrivo ↔ uscito): decide se si può segnare come visto e se conta nel totale. “Torna alla data di TMDB” non chiede conferma: chiude il popup e mostra un toast con “Annulla”. {NOCANVAS}',
 both('480px',CONF,'ConfirmDialog (tono warning)')+both('480px',TOAST,'Toast con Annulla')))
S.append(sec('Testi di errore','',tbl(['Caso','Testo'],[
 ['Formato sbagliato (<code>2026-13-40</code>, <code>20/10/2026</code>, campo con lettere)','Data non valida. Scrivila come AAAA-MM-GG, per esempio 2026-10-13.'],
 ['Il campo è vuoto e si preme “Salva”','Scrivi una data oppure usa “Torna alla data di TMDB”.'],
 ['Il server non risponde','L’operazione non è riuscita. Riprova. (<code>admin.actionError</code>, già nel codice)'],
])))
S.append(sec('4 · Discrepanza tra fonti',f'Non raccomandata (vedi sopra). Se la si vuole: stessa riga delle altre, pillola “Data diversa”, tre azioni. “Usa TMDB / Usa Wikidata” salva quella data come data scritta a mano; “Ignora” nasconde la riga finché una delle due fonti non cambia ancora. {tag("proposta · non raccomandata","k2")}',
 both('880px',DIFF,'Desktop')+both('390px',DIFF,'Telefono')))
S.append(sec('Misure e token (nuovi stili, tutti con token esistenti)','',tbl(['Classe','Regola','Token'],[
 ['<code>.adm-kinds</code>','griglia <code>repeat(auto-fit, minmax(8.5rem, 1fr))</code>: 4 colonne su desktop, 2 su telefono; spazio tra righe <code>--sp-2</code>, tra colonne <code>--sp-3</code>','<code>--sp-2</code>, <code>--sp-3</code>; 8.5rem è la larghezza minima di “Da rivedere” con icona (nessun token)'],
 ['<code>.adm-kind</code>','colonna: etichetta sopra la pillola, spazio <code>--sp-1</code>','<code>--sp-1</code>'],
 ['<code>.adm-kind__label</code>','<code>--fs-caption</code>, peso 800, <code>--ink-2</code>','<code>--fs-caption</code>, <code>--ink-2</code>'],
 ['<code>.adm-sources</code>','<code>dl</code> a due colonne (<code>auto 1fr</code>), <code>--fs-label</code>; <code>dt</code> in <code>--ink-2</code>; “In uso” peso 800','<code>--sp-1</code>, <code>--sp-4</code>, <code>--fs-label</code>, <code>--ink-2</code>'],
 ['<code>.adm-revert</code>','<code>margin-inline-end: auto</code>: “Torna alla data di TMDB” a sinistra, le due azioni a destra','—'],
 ['Righe, pillole, azioni, vuoto','già nel codice: <code>.admin-row</code>, <code>.admin-pill--*</code>, <code>.candidate__*</code>, <code>.candidates__empty</code>, <code>.dialog__actions</code>','—'],
])))
S.append(sec('Non verificato','',ul(['Il canvas è a 390px e 880px come larghezza dell’intera cornice; nel codice la sezione ha <code>padding: 1.25rem</code> sotto 40em (<code>AdminDashboard.less</code>), qui ha sempre 1.5rem.','Il numero di titoli (71, 64 usciti, 12 da completare) e le date sono dati di prova.','Nessuna pagina è stata vista nel browser con dati reali: non esistono ancora.'])))
S.append(prima_dopo([
 ['Pagina Admin','non c’era nel canvas','nuova: Contenuti da completare, Date di uscita (proposta)','src/features/admin/components/'],
 ['Sezioni già nel codice','non descritte','non ridisegnate; Candidati, Manutenzione, Automazione e Utenti restano come sono','AdminDashboard.tsx r.40-63'],
]))
write('Admin.dc.html','Admin','\n'.join(S))
