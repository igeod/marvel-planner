from comp import *
def spage(img,title,body,actions='',extra=''):
    ac=f'<div class="status-page__actions">{actions}</div>' if actions else ''
    return (f'<section class="status-page"><img class="status-art" src="assets/images/{img}.webp" alt="" aria-hidden="true" width="640" height="640"><div class="status-page__body"><h1 tabindex="-1">{title}</h1><p>{body}</p>{ac}{extra}</div></section>')
def code(state=''):
    ic={'copied':'check','':'copy'}.get(state,'copy')
    cls='btn btn--text error-code'+(' error-code--select' if state=='failed' else '')
    return f'<button type="button" class="{cls}" aria-label="{L("error.copyCode",code="E-0A1B2")}">{icon(ic)}{L("error.code",code="E-0A1B2")}</button>'
def p404(): return spage('err-404',L('notFound.title'),L('notFound.body'),btn('primary',L('notFound.back'),'lg'))
def p500(standalone=False,state=''):
    ac=btn('primary',L('common.retry'),'lg','','rotate-ccw')+('' if standalone else btn('soft',L('error.home'),'lg'))
    return spage('err-500',L('error.title'),L('error.body'),ac,code(state))
def pmaint(user=False):
    return spage('err-maintenance',L('maintenance.title'),L('maintenance.body'),'' if user else btn('soft',L('maintenance.adminLogin'),'lg','','log-in','aria-haspopup="dialog"'))
def layout(page,mobile=False): return f'<div class="site-shell">{header(True)}<main class="site-main">{page}</main>{footer()}</div>'
def alone(page): return f'<main class="status-screen">{page}</main>'
def D(inner,theme,label,h=800): return phone(inner,theme,h,1100,label)
def M(inner,theme,label,h=900): return phone(inner,theme,h,390,label)
S=[]
S.append(h1('Pagine di errore','Pagina non trovata, errore imprevisto e manutenzione: tutte con lo stesso componente StatusPage.'))
S.append(hdr('Pagine di errore (NotFoundPage, ErrorPage, MaintenancePage) e le rotte che le mostrano, con i testi nelle 5 lingue',
 'src/pages/NotFoundPage/, src/pages/ErrorPage/, src/pages/MaintenancePage/, src/components/ui/StatusPage/, src/components/ui/ErrorCode/, src/lib/errorCode.ts, src/app/router.tsx',
 'System states (StatusPage, ErrorCode), Buttons (primary, soft, text), Toast (codice copiato), Navigation (header e footer), Popup di accesso (accesso admin in manutenzione)'))
S.append(sec('Quando compare ciascuna','',tbl(['Pagina','Quando','Dentro header e footer?','File'],[
 ['Non trovata','rotta non riconosciuta (<code>path: "*"</code>)','sì','router.tsx, NotFoundPage.tsx'],
 ['Errore imprevisto','errore di una rotta (<code>errorElement</code> nel layout)','sì: azioni “Riprova” e “Torna alla home”','router.tsx, ErrorPage.tsx'],
 ['Errore imprevisto (a tutto schermo)','errore del layout stesso (<code>errorElement</code> della radice, <code>standalone</code>)','no: solo “Riprova”, <code>status-screen</code>','router.tsx, ErrorPage.tsx'],
 ['Manutenzione','sito in manutenzione attiva per i non amministratori','no: <code>status-screen</code>','MaintenancePage.tsx']])))
S.append(sec('Pagina non trovata','Illustrazione <code>err-404</code>, titolo in font display (<code>--fs-h1</code>), testo in <code>--ink-2</code> (max 44ch), un’azione primaria grande verso il planner. Il titolo prende il focus solo nelle pagine di errore (<code>autoFocusTitle</code>).',
  '<div class="dc-row">'+D(layout(p404()),'light','Chiaro')+M(layout(p404()),'light','Mobile')+'</div>'))
S.append(sec('Errore imprevisto','Illustrazione <code>err-500</code>. “Riprova” ricarica la pagina; “Torna alla home” è un collegamento (ricarica completa di proposito). Sotto il testo, il codice errore (hash FNV-1a di nome, messaggio e rotta: nessun dato personale), che si copia con un clic: icona che diventa spunta, toast “Codice copiato”; se la copia fallisce il codice si seleziona da solo (<code>error-code--select</code>).',
  '<div class="dc-row">'+D(layout(p500()),'light','Nel layout')+D(alone(p500(True)),'dark','A tutto schermo · scuro',560)+M(layout(p500()),'dark','Mobile · scuro')+'</div>'))
S.append(sec('Codice errore: stati','',
  '<div class="dc-row">'+frame('light','360px',code(),'Normale',bg='var(--surface)')+frame('light','360px',code('copied'),'Copiato',bg='var(--surface)')+frame('light','360px',code('failed'),'Copia fallita (selezione)',bg='var(--surface)')+'</div>'))
S.append(sec('Manutenzione','Illustrazione <code>err-maintenance</code>, a tutto schermo e senza header. Gli utenti non registrati vedono “Accesso admin” (apre il popup di accesso); chi è già dentro non ha azioni. Questa è la pagina dell\'app: la pagina HTML statica con risposta 503 e <code>noindex</code> non esiste ancora (HANDOFF).',
  '<div class="dc-row">'+D(alone(pmaint()),'light','Utente non registrato',560)+D(alone(pmaint(True)),'dark','Già dentro · scuro',560)+M(alone(pmaint()),'light','Mobile',700)+'</div>'))
S.append(sec('Misure','',tbl(['Cosa','Valore nel codice','File'],[
 ['Scheda','<code>max-width: 56rem</code>, raggio <code>--r-xl</code>, padding <code>--pad-hero</code>, ombra livello 1 (<code>--shadow-card</code>)','StatusPage.less'],
 ['Illustrazione','<code>15rem</code> (12rem sotto 40em); in scuro <code>drop-shadow(0 0 1.5px var(--ink))</code>; file 640×640','StatusPage.less, StatusPage.tsx'],
 ['Sotto 40em','scheda in colonna, azioni in colonna a tutta larghezza','StatusPage.less'],
 ['Schermo intero','<code>min-height: 100dvh</code>, contenuto centrato','StatusPage.less (<code>.status-screen</code>)'],
 ['Focus del titolo','<code>outline: 3px solid var(--highlight)</code>, offset 4px','StatusPage.less']])))
S.append(sec('Errori in linea (non sono pagine)','Questi errori non portano a una pagina: usano i componenti già definiti altrove.',tbl(['Dove','Che cosa si vede','Definito in'],[
 ['Dati non caricati in una sezione','LoadError con “Riprova”','System states'],
 ['Campo o form','messaggio sotto il campo, FormError','Textfield'],
 ['Troppe richieste (429)','FormError “rate” con illustrazione <code>err-429</code>','Textfield, Popup di accesso'],
 ['Azione fallita fuori da un form','toast con illustrazione <code>err-toast</code>','Toast'],
 ['Link condiviso non valido','StateBox “dialog” con <code>err-shared</code>','Popup generici']])))
KEYS=['notFound.title','notFound.body','notFound.back','error.title','error.body','error.home','error.code','error.codeCopied','error.copyFailed','maintenance.title','maintenance.body','maintenance.adminLogin']
for i in (0,6):
    S.append(sec('Testi nelle 5 lingue','',f'<div class="dc-scroll">{tbl(["Chiave"]+["it","en","fr","es","de"],[[f"<code>{k}</code>"]+[L(k,l) for l in LANGS] for k in KEYS[i:i+6]])}</div>'))
S.append(prima_dopo([
 ['Pagine del giro (Errori, Errori roadmap, Pagine errore, Stati inline)','quattro pagine con proposte','una pagina sola, con quello che è nel codice','router.tsx, ErrorPage.tsx'],
 ['ERRORI_SPEC','documento a parte','assorbito in questa pagina','ErrorPage.tsx, errorCode.ts'],
 ['Pagina 429','pagina intera nelle proposte','non esiste come pagina: è FormError “rate”','FormError.tsx'],
 ['Manutenzione statica','descritta come già pronta','pagina HTML con 503 e noindex: da fare (HANDOFF)','—'],
 ['StatusPage, ErrorCode','ridefiniti','definiti in System states; qui solo usati','StatusPage.tsx, ErrorCode.tsx'],
]))
write('Pagine di errore.dc.html','Pagine di errore','\n'.join(S))
