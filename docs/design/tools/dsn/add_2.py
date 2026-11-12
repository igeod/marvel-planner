from addlib import *
PREV=json.load(open(f'{S}/dsn/locales_prev.json'))
def LP(key,lang='it'): return esc(PREV[lang][key])
# ============ POPUP GENERICI ============
add('Popup generici',
 block('Admin, manutenzione: conferma senza frase descrittiva',CONF,'Confermato nel codice 2b5e07a: la frase descrittiva sotto il pulsante è stata tolta e la conferma dice solo <code>admin.maintenance.confirmMessage</code>. Le demo “con tono” di questa pagina usano già il testo attuale.',
  txt([('admin.maintenance.confirmTitle',T(L('admin.maintenance.confirmTitle','it'),*[L('admin.maintenance.confirmTitle',l) for l in LANGS[1:]])),('admin.maintenance.confirmMessage',T(L('admin.maintenance.confirmMessage','it'),*[L('admin.maintenance.confirmMessage',l) for l in LANGS[1:]]))])),
)
POPS=[
 ['Conferma (reset planner, manutenzione, elimina account)','no X · “Annulla” (soft) + conferma','decisione: scelta tra due azioni','ConfirmDialog.tsx (nessun <code>.dialog__close</code>)'],
 ['Condivisione','X','contenuto: si chiude con la X, nessun “Chiudi” in fondo','Modal.tsx; ShareDialog.tsx'],
 ['Importazione, anteprima','X + “Non importare”','decisione: <b>no X</b>, resta “Non importare”','ImportSharedDialog.tsx'],
 ['Importazione, link non valido o errore di caricamento','X + “Chiudi” (+ “Riprova”)','messaggio con azioni: <b>no X</b>, “Chiudi” resta','ImportSharedDialog.tsx; StateBox'],
 ['Profilo','X','contenuto: X','ProfilePopup (Profile Popup)'],
 ['Accesso e registrazione','X','compito: X','AuthDialog'],
 ['Impostazioni privacy','X','contenuto: X; la conferma di cancellazione è nella pagina, non un secondo popup','PrivacySettingsDialog.tsx'],
 ['Trailer','X','contenuto: X','TrailerButton.tsx'],
 ['Menu mobile','X nella barra del pannello','invariato (è un pannello, non un popup)','HeaderMenu.tsx r.100'],
]
add('Popup generici',
 block('Decisione · quando la X c\'è e quando no',DECI,'Oggi <code>Modal</code> mostra sempre la X (<code>.dialog__close</code>, Modal.tsx) e molti popup hanno in più un pulsante “Chiudi” o “Non importare”: due comandi per la stessa cosa. <b>Regola unica:</b> un solo modo visibile per chiudere. (1) Popup di <b>contenuto o compito</b> (condivisione, profilo, accesso, privacy, trailer): c\'è la X e non c\'è un pulsante “Chiudi”. (2) Popup di <b>decisione o con azioni proprie</b> (conferma, anteprima di importazione, errore con Riprova): <b>non c\'è la X</b>, l\'uscita è il pulsante testuale (“Annulla”, “Non importare”, “Chiudi”) accanto alle azioni. Esc e clic sullo sfondo chiudono sempre, tranne mentre una richiesta è in corso. Nel foglio mobile la maniglia di trascinamento resta in tutti e due i casi. Implementazione: <code>Modal</code> riceve <code>showClose</code> (default <code>true</code>); i popup di decisione passano <code>false</code>.',
  '<div class="dc-row">'+fr('light','480px',modal(L('share.title'),f'<p>{L("share.intro")}</p><div>{sel(L("share.duration"),[L("share.days7"),L("share.days30"),L("share.never")])}{btn("primary",L("share.create"),"lg")}</div>' if False else f'<p>{L("share.intro")}</p><div>{btn("primary",L("share.create"),"lg")}</div>'),'Contenuto: X, nessun “Chiudi”')
  +fr('light','480px',confirm_raw(L('planner.reset.title'),L('planner.reset.message'),btn('soft',L('common.cancel'))+btn('primary',L('planner.reset.confirm'))),'Decisione: niente X, “Annulla”')+'</div>'
  +tbl(['Popup','Prima','Dopo','File'],POPS)
  +pd([['Regola della X','sempre presente in <code>Modal</code>','<code>showClose</code>; X solo nei popup di contenuto o compito','Modal.tsx'],['Pulsante “Chiudi” nei popup di contenuto','presente in alcuni','tolto','ShareDialog.tsx; PrivacySettingsDialog.tsx'],['Popup di decisione','X e “Annulla” insieme','solo il pulsante testuale','Modal.tsx; ConfirmDialog.tsx; ImportSharedDialog.tsx']])),
)
IMP=[
 ('import.heading',T('Come vuoi usarlo?','How do you want to use it?','Comment voulez-vous l’utiliser ?','¿Cómo quieres usarlo?','Wie möchtest du ihn verwenden?')),
 ('import.recommended',T('Consigliato','Recommended','Recommandé','Recomendado','Empfohlen')),
 ('import.mergeTitle',T('Unisci i due planner','Merge the two planners','Fusionner les deux planners','Unir los dos planners','Beide Planner zusammenführen')),
 ('import.mergeBody',T('Teniamo i tuoi {current} titoli visti e aggiungiamo i {added} di {name} che ti mancano. Alla fine ne avrai {result}.','We keep your {current} watched titles and add the {added} from {name} that you are missing. In the end you will have {result}.','Nous gardons vos {current} titres vus et ajoutons les {added} de {name} qui vous manquent. Vous en aurez {result} au final.','Mantenemos tus {current} títulos vistos y añadimos los {added} de {name} que te faltan. Al final tendrás {result}.','Wir behalten deine {current} gesehenen Titel und fügen die {added} von {name} hinzu, die dir fehlen. Am Ende hast du {result}.')),
 ('import.replaceTitle',T('Sostituisci il mio planner','Replace my planner','Remplacer mon planner','Reemplazar mi planner','Meinen Planner ersetzen')),
 ('import.replaceBody',T('Il tuo planner diventa uguale a quello di {name}. I {lost} titoli che hai visto solo tu vengono tolti.','Your planner becomes the same as {name}’s. The {lost} titles only you have watched are removed.','Votre planner devient identique à celui de {name}. Les {lost} titres que vous seul avez vus sont retirés.','Tu planner pasa a ser igual al de {name}. Los {lost} títulos que solo has visto tú se quitan.','Dein Planner wird so wie der von {name}. Die {lost} Titel, die nur du gesehen hast, werden entfernt.')),
 ('import.replaceNoLoss',T('Il tuo planner diventa uguale a quello di {name}. Non perdi nessun titolo.','Your planner becomes the same as {name}’s. You lose no titles.','Votre planner devient identique à celui de {name}. Vous ne perdez aucun titre.','Tu planner pasa a ser igual al de {name}. No pierdes ningún título.','Dein Planner wird so wie der von {name}. Du verlierst keinen Titel.')),
 ('import.replaceAsk',T('Togliere {lost} titoli dal tuo planner?','Remove {lost} titles from your planner?','Retirer {lost} titres de votre planner ?','¿Quitar {lost} títulos de tu planner?','{lost} Titel aus deinem Planner entfernen?')),
 ('import.replaceConfirm (invariato)',T(L('import.replaceConfirm','it'),*[L('import.replaceConfirm',l) for l in LANGS[1:]])),
 ('import.back',T('Indietro','Back','Retour','Atrás','Zurück')),
]
KV=dict(name='Marta',current=12,added=8,result=20,lost=5)
def optcard(title,body,btn_,rec=False,pri=True):
    chip=f' <span class="dc-chip k2">{L("import.close","it") and esc(IMP[1][1]["it"])}</span>' if rec else ''
    return f'<section class="import-preview__choice"><h3>{title}{chip}</h3><p>{body}</p>{btn_}</section>'
def imp_new(stage='choose',lang='it'):
    g=lambda k:fill(dict(IMP)[k][lang],**KV)
    head=f'<p>{L("import.summary",lang,name="Marta",done=24,total=60,percent=40)}</p>{meter()}'
    if stage=='choose':
        body=(f'<h3>{g("import.heading")}</h3>'+optcard(g('import.mergeTitle'),g('import.mergeBody'),btn('primary',g('import.mergeTitle'),'lg'),True)
              +optcard(g('import.replaceTitle'),g('import.replaceBody'),btn('soft',g('import.replaceTitle'),'lg')))
    else:
        body=(f'<h3>{g("import.replaceTitle")}</h3><p role="alert">{g("import.replaceAsk")}</p><p>{g("import.replaceBody")}</p>'
              +btn('danger',dict(IMP)['import.replaceConfirm (invariato)'][lang],'lg')+btn('soft',g('import.back'),'lg'))
    return f'<div class="import-preview">{head}{body}{btn("text",L("import.close",lang))}</div>'
def meter(): return f'<div class="meter"><div class="meter__row"><label>{L("planner.completed")}</label><output>{L("common.ofCount",done=24,total=60)} (40%)</output></div><progress value="24" max="60"></progress></div>'
add('Popup generici',
 block('Decisione · importazione di un planner condiviso, ridisegnata',DECI,'Prima: due blocchi simili (“Unisci”, “Sostituisci”), numeri senza spiegazione (“titoli che verrebbero aggiunti”), avviso e conferma in due punti diversi, un “Non importare” che sembra un terzo esito. <b>Dopo:</b> (1) riepilogo del planner condiviso con la barra; (2) una domanda sola, “Come vuoi usarlo?”; (3) due scelte con la conseguenza <b>in numeri</b> (quanti titoli restano, quanti si aggiungono, quanti si perdono); (4) “Unisci” è l\'azione primaria, evidenziata come “Consigliato” perché non toglie nulla; (5) “Sostituisci” è soft e, se fa perdere titoli, apre un secondo passo nello stesso popup con avviso e “Sì, sostituisci” in rosso; (6) sotto, “Non importare” come unica uscita (niente X: regola dei popup di decisione). Senza account il testo <code>import.anonymousNote</code> resta sotto. I numeri sono valori d\'esempio.',
  '<div class="dc-row">'+fr('light','560px',modal(L('import.title'),imp_new('choose'),close=False),'Scelta · chiaro')+fr('dark','560px',modal(L('import.title'),imp_new('choose'),close=False),'Scelta · scuro')+fr('light','560px',modal(L('import.title'),imp_new('confirm'),close=False),'Sostituisci: conferma · chiaro')+'</div>'
  +f'<div class="dc-fl">Nessuna perdita (<code>import.replaceNoLoss</code>): “Sostituisci” non chiede conferma</div>'+fr('light','560px',modal(L('import.title'),f'<div class="import-preview"><p>{fill(dict(IMP)["import.replaceNoLoss"]["it"],**KV)}</p>{btn("soft",dict(IMP)["import.replaceTitle"]["it"],"lg")}{btn("text",L("import.close"))}</div>',close=False),'Senza titoli persi')
  +'<div class="dc-fl">Testi nuovi nelle 5 lingue (i segnaposto {name}, {current}, {added}, {result}, {lost} sono calcolati dal codice)</div>'+txt(IMP)
  +pd([['Struttura','due blocchi + avviso','riepilogo, domanda, due scelte con numeri, conferma nel secondo passo','ImportSharedDialog.tsx; ImportSharedDialog.less'],['“Unisci”','primario senza spiegazione di cosa accade','primario “Consigliato”: tiene {current}, aggiunge {added}, totale {result}','import.mergeHint → import.mergeBody'],['“Sostituisci”','soft, avviso a parte','soft; con perdita apre conferma; senza perdita nessuna conferma','import.replaceWarning → import.replaceAsk'],['Uscita','X e “Non importare”','solo “Non importare” (nessuna X)','Modal.tsx']])),
)
# ============ POPUP DI ACCESSO ============
LOGIN=[
 ('auth.login.intro (tolto)',T(PREV['it']['auth.login.intro'],*[PREV[l]['auth.login.intro'] for l in LANGS[1:]])),
 ('auth.register.intro (unica etichetta)',T(L('auth.register.intro','it'),*[L('auth.register.intro',l) for l in LANGS[1:]])),
]
def f_(label,value='',typ='text',hint='',err=''): return tf(label,value,typ=typ,hint=hint,error=err)
def pwf(withlink):
    i=uid()
    lk=f'<button type="button" class="link-button">{L("auth.login.forgotLink")}</button>' if withlink else ''
    return (f'<div class="field"><div class="field__label"><label for="{i}">{L("auth.password")}</label>{lk}</div><div class="field__control"><input id="{i}" type="password" value="" data-clearable="true"><button type="button" class="field__button" aria-label="{L("auth.showPassword")}" aria-pressed="false">{icon("eye")}</button></div><p role="status" class="field__message"></p></div>')
def login_dlg(intro=True,link=False):
    ip=f'<p>{LP("auth.login.intro")}</p>' if intro else ''
    return modal(L('auth.login.title'),f'<div class="auth-view view-motion">{ip}<form class="form" novalidate>{tf(L("auth.email"),"",typ="email")}{pwf(link)}<button type="submit" class="btn btn--primary btn--lg">{icon("log-in")}{L("auth.login.button")}</button></form><p>{L("auth.login.noAccount").replace("{link}",f"<button type=button class=link-button>{L("auth.login.registerLink")}</button>")}</p></div>')
def sugg(anim=''):
    i=uid()
    return (f'<div class="field"><div class="field__label"><label for="{i}">{L("auth.email")}</label></div><div class="field__control"><input id="{i}" type="email" value="diego@gmial.com" data-clearable="true"></div>'
            f'<p role="status" class="field__message" style="color:var(--ink-2)">{icon("info")}{esc(L("auth.emailSuggestion",email="diego@gmail.com"))}{btn('text',esc(L('auth.useSuggestion')),'sm')}</p></div>')
SUG=[('auth.emailSuggestion (invariato)',T(*[L('auth.emailSuggestion',l,email='{email}') for l in LANGS])),
 ('auth.useSuggestion',T(*[L('auth.useSuggestion',l) for l in LANGS]))]
add('Popup di accesso',
 block('Decisione · una sola etichetta nell\'accesso e nella registrazione',DECI,'Oggi i due popup ripetono la stessa promessa: l\'accesso dice “Accedi per conservare i tuoi progressi su tutti i dispositivi”, la registrazione “I progressi già salvati su questo dispositivo verranno aggiunti al tuo account”. <b>Decisione:</b> l\'accesso non ha frase introduttiva (il titolo “Accedi” e i due campi bastano; chi accede da un toast conosce già il motivo). La registrazione tiene <b>una sola</b> frase (<code>auth.register.intro</code>), l\'unica che dice qualcosa di nuovo: che cosa succede ai progressi locali. Il testo sulla privacy resta in fondo.',
  '<div class="dc-row">'+fr('light','560px',login_dlg(True,False),'Prima · accesso')+fr('light','560px',login_dlg(False,False),'Dopo · accesso senza frase')+'</div>'+txt(LOGIN)
  +pd([['Accesso','frase <code>auth.login.intro</code>','nessuna frase','LoginForm.tsx (intro); locales <code>auth.login.intro</code> da togliere'],['Registrazione','frase <code>auth.register.intro</code>','invariata: unica etichetta','RegisterForm.tsx']])),
 block('Stato previsto · “Password dimenticata?”',DECI+' '+NOCANVAS,'Il link non c\'è perché il recupero è spento (richiede verifica e-mail lato server: HANDOFF §2). Stato previsto: link <code>link-button</code> a destra dell\'etichetta “Password”, che porta alla vista “recupero” (<code>auth.reset.request.*</code>, già descritta in questa pagina) e da lì a “inviato”. Finché il recupero è spento il link non si mostra (nessun link morto).',
  '<div class="dc-row">'+fr('light','560px',login_dlg(False,True),'Chiaro')+fr('dark','560px',login_dlg(False,True),'Scuro')+'</div>'+tbl(['Lingua','auth.login.forgotLink'],[[l,esc(L('auth.login.forgotLink',l))] for l in LANGS])),
 block('Decisione · suggerimento e-mail (“Intendevi gmail.com?”)',DECI,'Ha senso: intercetta gli errori di battitura (gmial.com) prima che costino un account non verificabile. Oggi compare come <code>hint</code> senza animazione (RegisterForm.tsx; ProfileSection.tsx), mentre l\'errore entra con la sua transizione: sembra un salto. <b>Nel codice:</b> (1) compare solo quando il campo perde il focus (<code>onBlur</code>, <code>isEmailLeft</code>, RegisterForm.tsx) e sparisce appena si riscrive; (2) componente <code>EmailSuggestion</code>: <code>role="status"</code>, icona <code>Info</code> 18px, <code>--fs-label</code>, <code>--ink-2</code>, entra con <code>fade-in</code> in <code>--dur-enter</code> (con movimento normale <code>reveal-in</code>, come l\'errore) (Field.less r.99); (3) azione <code>text</code> sm con <code>auth.useSuggestion</code> che sostituisce l\'indirizzo.',
  both('420px',sugg(),'Suggerimento')+txt(SUG)
  +pd([['Quando compare','mentre si scrive (hint)','al blur del campo','RegisterForm.tsx; ProfileSection.tsx'],['Animazione','nessuna','come l\'errore del campo, <code>--dur-enter</code>','motion.less; Field.less'],['Tono e icona','avviso (<code>triangle-alert</code>)','neutro (<code>info</code>, <code>--ink-2</code>)','Field.tsx'],['Azione','solo testo','“Usa questo” (<code>text</code> sm)','EmailSuggestion.tsx']])),
)
# ============ PROFILE POPUP ============
PR=[
 ('account.profile.saved',T(*[L('account.profile.saved',l) for l in LANGS])),
 ('account.profile.emailSaved',T(*[L('account.profile.emailSaved',l) for l in LANGS])),
 ('account.profile.nothingToSave (solo lettore di schermo)',T(*[L('account.profile.nothingToSave',l) for l in LANGS])),
]
def nm(v,msg=''):
    i=uid()
    return f'<div class="field"><div class="field__label"><label for="{i}">{L("auth.name")}</label></div><div class="field__control"><input id="{i}" value="{v}"></div><p role="status" class="field__message">{msg}</p></div><button type="button" class="btn btn--primary" aria-disabled="true">Salva</button>'
add('Profile Popup',
 block('Decisione · “Questo è già il tuo nome”',DECI,'Il pulsante Salva è <code>aria-disabled</code> (resta raggiungibile col Tab): un clic a vuoto mostrava la nota <code>account.profile.errors.nameUnchanged</code>. <b>Nel codice (ProfileSection.tsx r.171-182):</b> la nota è tolta; il pulsante ha <code>aria-describedby="profile-name-nothing"</code> verso un testo nascosto <code>account.profile.nothingToSave</code> (“Non ci sono modifiche da salvare.”) e il clic non fa nulla.',
  both('360px',nm('Diego'),'Nome invariato: Salva spento, nessuna nota')+txt(PR[2:])
  +pd([['Clic su Salva senza modifiche','nota “Questo è già il tuo nome.”','nessun effetto visibile; descrizione nascosta per il lettore','ProfileSection.tsx r.171-182']])),
 block('Decisione · conferma dopo aggiornamento di nome ed e-mail',DECI,'La conferma non ripete più il valore: <code>account.profile.saved</code> (“Nome aggiornato”) compare sotto il campo del nome (r.179) e <code>account.profile.emailSaved</code> (“Email aggiornata”) sotto quello dell\'e-mail (r.227), ognuna una <code>role="status"</code> propria. Niente messaggio unico per i due salvataggi insieme: ogni campo conferma sé stesso, senza il nome (il campo lo mostra già).',
  both('420px','<div style="display:flex;flex-direction:column;gap:var(--sp-3)">'+status(esc(L('account.profile.saved')),True)+status(esc(L('account.profile.emailSaved')),True)+'</div>','Conferme')+txt(PR[:2])
  +pd([['Messaggio di conferma','“Nome aggiornato: {name}” (ripete il valore)','“Nome aggiornato” e “Email aggiornata” senza valore, uno per campo','ProfileSection.tsx r.179, r.227; <code>account.profile.saved</code>, <code>emailSaved</code>']])),
)
