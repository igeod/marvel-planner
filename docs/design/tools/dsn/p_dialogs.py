from comp import *
OV='display:block;opacity:1;transform:none;translate:none;scale:none;position:relative;margin:0;max-width:100%'
def art(n,sz=112): return f'<img src="assets/images/{n}.webp" alt="" aria-hidden="true" width="{sz}" height="{sz}">'
def sbox(a,title,text,actions='',role='alert'):
    return f'<div class="state-box state-box--dialog" role="{role}"><div class="state-box__art" aria-hidden="true">{a}</div><div class="state-box__body"><h3>{title}</h3><p>{text}</p><div class="state-box__actions">{actions}</div></div></div>'
def modal(title,body,size='md'):
    return (f'<dialog class="dialog dialog--{size}" open style="{OV}"><div class="dialog__scroll scroll-y"><header class="dialog__header"><h2 tabindex="-1">{title}</h2></header><div class="dialog__body">{body}</div></div>'
            f'<button type="button" class="dialog__close" aria-label="{L("common.close")}">{icon("x")}</button></dialog>')
def confirm(title,msg,ok,tone=None,ic=None,typed=None,err='',pending=False,var='primary'):
    head=(f'<div class="dialog__head"><span class="dialog__icon dialog__icon--{tone}" aria-hidden="true">{icon(ic)}</span><h2>{title}</h2></div>' if tone else f'<h2>{title}</h2>')
    t=tf(typed,'') if typed else ''
    e=f'<p role="alert" class="dialog__error">{icon("circle-alert")}{err}</p>' if err else ''
    ok_b=btn(var,L('common.loading') if pending else ok,'','',None,'aria-busy="true"' if pending else (f'aria-disabled="true"' if typed else ''))
    return (f'<dialog class="dialog dialog--confirm" open style="{OV}"><div class="dialog__body">{head}<p>{msg}</p>{t}{e}'
            f'<div class="dialog__actions">{btn("soft",L("common.cancel"))}{ok_b}</div></div></dialog>')
def sel(label,opts,i=1):
    return f'<div class="field"><label>{label}</label><select>'+''.join(f'<option{" selected" if k==i else ""}>{o}</option>' for k,o in enumerate(opts))+'</select></div>'
DUR=lambda: sel(L('share.duration'),[L('share.days7'),L('share.days30'),L('share.never')])
QR='<div class="share-qr" role="img" aria-label="'+L('share.qrAlt')+'" style="width:256px;height:256px;border:1px solid var(--line);display:flex;align-items:center;justify-content:center;color:var(--ink-2)">QR</div>'
def link_details():
    return (f'<div class="share-link"><label>{L("share.linkLabel")}</label><input type="text" readonly value="">{btn("soft",L("share.copy"),"","","copy")}</div>'
            f'<p>{L("share.noExpiry")}</p>{QR}<section class="share-image"><h3>{L("share.imageHeading")}</h3>{btn("soft",L("share.downloadImage"),"","","download")}{btn("soft",L("share.shareImage"),"","","share-2")}</section>')
share_new=f'<p>{L("share.intro")}</p><div>{DUR()}{btn("primary",L("share.create"),"lg")}</div>'
share_link=f'<p>{L("share.intro")}</p><div>{link_details()}{DUR()}<div>{btn("soft",L("share.regenerate"),"","","refresh-cw")}<p>{L("share.regenerateHint")}</p>{btn("text",L("share.disable"),"","","link-2-off")}</div></div>'
share_login=f'<div><p>{L("share.loginRequired")}</p>{btn("primary",L("share.loginButton"),"lg")}</div>'
share_load=f'<p role="status">{L("share.loading")}</p>'
share_err=f'<p role="alert">{L("share.error")}</p>'
meter=f'<div class="meter"><div class="meter__row"><label>{L("planner.completed")}</label><output>{L("common.ofCount",done=24,total=60)} (40%)</output></div><progress value="24" max="60"></progress></div>'
def _bar(): return f'<div class="meter"><div class="meter__row"><label>{L("planner.completed")}</label><output>{L("common.ofCount",done=24,total=60)} (40%)</output></div><progress value="24" max="60"></progress></div>'
meter=_bar()
_ex=btn("soft",L("import.close"),"lg")
imp=(f'<div class="import-preview"><p>{L("import.summary",name="…",done=24,total=60,percent=40)}</p>{meter}<h3>{L("import.heading")}</h3>'
     f'<section class="import-preview__choice"><p class="import-preview__recommended"><span class="import-preview__badge">{L("import.recommended")}</span></p><p>{L("import.mergeBody",name="…",current=12,added=18,result=30)}</p>{btn("primary",L("import.mergeTitle"),"lg")}</section>'
     f'<section class="import-preview__choice"><p>{L("import.replaceBody",name="…",lost=5)}</p>{btn("soft",L("import.replaceTitle"),"lg")}</section><p>{L("import.anonymousNote")}</p>{_ex}</div>')
imp_conf=(f'<div class="import-preview"><p>{L("import.summary",name="…",done=24,total=60,percent=40)}</p>{meter}<section class="import-preview__choice"><h3>{L("import.replaceTitle")}</h3><p><strong>{L("import.replaceAsk",lost=5)}</strong></p><p>{L("import.replaceBody",name="…",lost=5)}</p>{btn("danger",L("import.replaceConfirm"),"lg")}{btn("soft",L("import.back"),"lg")}</section>{_ex}</div>')
imp_noloss=(f'<div class="import-preview"><p>{L("import.summary",name="…",done=24,total=60,percent=40)}</p>{meter}<section class="import-preview__choice"><p>{L("import.replaceNoLoss",name="…")}</p>{btn("primary",L("import.replaceTitle"),"lg")}</section>{_ex}</div>')
imp_empty=f'<div class="import-preview"><p>{L("import.empty",name="…")}</p>{_ex}</div>'
imp_nf=sbox(art('err-shared'),L('share.invalid.title'),L('share.invalid.body'),btn('primary',L('common.close'),'lg'))
imp_err_wait=sbox(art('err-shared'),L('share.loadError.title'),L('share.loadError.body'),btn('primary',L('common.loading'),'lg','','','aria-busy="true"')+btn('soft',L('common.close'),'lg'))
imp_err=sbox(art('err-shared'),L('share.loadError.title'),L('share.loadError.body'),btn('primary',L('common.retry'),'lg')+btn('soft',L('common.close'),'lg'))
INV=[('session','better-auth.session_token'),('progress','mcu-planner-v1'),('language','mcu-planner-language'),('filters','mcu-planner-filters'),('viewOrder','mcu-planner-view-order'),('theme','mcu-planner-theme'),('completedSeen','mcu-planner-completed-seen'),('sound','mcu-planner-sound'),('guideSeen','mcu-planner-guide-seen')]
stor=(f'<table class="storage-table"><caption>{L("cookiePage.tableCaption")}</caption><thead><tr>'+''.join(f'<th scope="col">{L("cookiePage.columns."+c)}</th>' for c in ['name','kind','purpose','duration'])+'</tr></thead><tbody>'
      +''.join(f'<tr><th scope="row"><code>{n}</code></th><td>{L("cookiePage."+i+".kind")}</td><td>{L("cookiePage."+i+".purpose")}</td><td>{L("cookiePage."+i+".duration")}</td></tr>' for i,n in INV)+'</tbody></table>')
def priv(conf=False):
    clr=(f'<div class="privacy-confirm" role="alert"><p>{L("privacySettings.clearQuestion")}</p>{btn("soft",L("common.cancel"))}{btn("danger",L("privacySettings.clearConfirm"))}</div>' if conf else btn('soft',L('privacySettings.clearButton'),'','','trash-2'))
    return (f'<p>{L("privacySettings.intro")}</p><section><h3>{L("cookiePage.noBannerHeading")}</h3><p>{L("cookiePage.noBannerBody")}</p></section><section><h3>{L("cookiePage.intro")}</h3>{stor}</section>'
            f'<section><h3>{L("cookiePage.manageHeading")}</h3><p>{L("cookiePage.manageBody")}</p></section><section><h3>{L("privacySettings.clearHeading")}</h3><p>{L("privacySettings.clearBody")}</p>{clr}</section>')
fr=lambda t,w,inner,lab: frame(t,w,inner,lab,bg='var(--bg)')
S=[]
S.append(h1('Popup generici','Modal, dialog di conferma, condivisione, importazione e impostazioni privacy.'))
S.append(hdr('Popup generici: contenitore Modal, ConfirmDialog, ShareDialog, ImportSharedDialog, PrivacySettingsDialog, con tutti gli stati e i testi nelle 5 lingue',
 'src/components/ui/Modal/, src/components/ui/ConfirmDialog/, src/features/share/components/, src/features/privacy/components/, src/components/ui/useDialog.ts, useSheetDrag.ts',
 'Buttons (primary, soft, danger, text), Textfield (campo di conferma), Select (durata), Progress (ProgressMeter), System states (StateBox “dialog”, Status), Scrollbar (scroll-y)'))
S.append(sec('Contenitore Modal','<code>&lt;dialog&gt;</code> nativo (<code>useDialog</code>) con sfondo scuro (<code>::backdrop</code>), angoli <code>--r-xl</code>, ombra livello 2 (<code>--shadow-pop</code>). Misure: <code>md</code> 35rem (560px), <code>lg</code> 45rem (720px, trailer), <code>profile</code> senza intestazione (vedi Profile Popup). Intestazione con titolo <code>h2</code> a <code>--fs-h4</code>; il pulsante di chiusura è fisso, ultimo nell\'ordine del focus. Esc e clic sullo sfondo chiudono. Sotto 40em è un foglio dal basso: raggio solo in alto, maniglia, larghezza piena, trascinabile (<code>useSheetDrag</code>).',
  '<div class="dc-row">'+fr('light','560px',modal(L('share.title'),share_new),'Modal md · chiaro')+fr('dark','560px',modal(L('share.title'),share_new),'Modal md · scuro')+phone(f'<div style="padding-top:var(--sp-14);background:var(--bg)">{modal(L("share.title"),share_new).replace("max-width:100%","max-width:100%;border-radius:var(--r-lg) var(--r-lg) 0 0")}</div>','light',640,390,'Foglio mobile')+'</div>'))
S.append(sec('ConfirmDialog','Titolo e messaggio, due azioni a destra: “Annulla” (soft, ha il focus iniziale) e la conferma. Larghezza massima 30rem. Con <code>tone</code> compare l\'icona tonda da 40px (<code>warning</code> oro, <code>danger</code> rosso). Con <code>requiredText</code> la conferma resta <code>aria-disabled</code> finché non si scrive la parola. In corso: pulsante in caricamento e Annulla disabilitato; Esc ignorato. Errore: riga rossa con icona 18px. Sotto 40em le azioni vanno in colonna a tutta larghezza.',
  '<div class="dc-row">'+fr('light','480px',confirm(L('planner.reset.title'),L('planner.reset.message'),L('planner.reset.confirm')),'Semplice')
  +fr('light','480px',confirm(L('admin.maintenance.confirmTitle'),L('admin.maintenance.confirmMessage'),L('admin.maintenance.enable'),'warning','triangle-alert'),'Con tono “warning”')
  +fr('light','480px',confirm(L('account.delete.heading'),L('account.delete.confirm'),L('account.delete.button'),typed=L('account.dialog.typeLabel',word='DELETE')),'Con parola da scrivere')
  +fr('dark','480px',confirm(L('admin.maintenance.confirmTitle'),L('admin.maintenance.confirmMessage'),L('admin.maintenance.enable'),'danger','triangle-alert',err=L('admin.actionError')),'Errore · scuro')
  +fr('light','480px',confirm(L('planner.reset.title'),L('planner.reset.message'),L('planner.reset.confirm'),pending=True),'In corso')
  +phone(f'<div style="padding-top:var(--sp-10);background:var(--bg)">{confirm(L("planner.reset.title"),L("planner.reset.message"),L("planner.reset.confirm"))}</div>','light',320,390,'Mobile')+'</div>'))
S.append(sec('Condivisione (ShareDialog)','Titolo <code>share.title</code>. Senza accesso: invito ad accedere (apre il popup di accesso). Con accesso: introduzione, link con copia, scadenza, QR (generato dal codice, 256px, fondo bianco), immagine da scaricare o condividere (il tasto “Condividi” compare solo se il browser condivide file), durata (Select nativo) e creazione, rigenerazione o disattivazione. Il link vecchio smette di funzionare quando si rigenera.',
  '<div class="dc-row">'+fr('light','560px',modal(L('share.title'),share_login),'Senza accesso')+fr('light','560px',modal(L('share.title'),share_new),'Nessun link')+fr('light','560px',modal(L('share.title'),share_link),'Link attivo')
  +fr('light','560px',modal(L('share.title'),share_load),'Caricamento')+fr('dark','560px',modal(L('share.title'),share_err),'Errore · scuro')+'</div>'))
S.append(sec('Importazione di un planner condiviso (ImportSharedDialog)','Si apre dal link condiviso. Anteprima con avanzamento (ProgressMeter), scelta “Unisci i due planner” (primario, con targhetta “Consigliato”) o “Sostituisci il mio planner” (soft: se si perdono titoli chiede una seconda conferma con “Sì, sostituisci” pericolo e “Indietro”; se non se ne perde nessuno resta una sola scelta), note per chi non ha un account. Link non valido e errore di caricamento usano StateBox “dialog” con l\'illustrazione <code>err-shared</code> (112px: valore senza token). Nell\'errore di caricamento “Riprova” non smonta il riquadro: il pulsante va in attesa (<code>isLoading</code>, testo <code>common.loading</code>, da <code>isRetrying</code> di <code>useSharedPlanner</code>), “Chiudi” resta attivo e a ogni nuovo tentativo il riquadro si rimonta (<code>key={state.attempt}</code>, <code>role="alert"</code>).',
  '<div class="dc-row">'+fr('light','560px',modal(L('import.title'),imp),'Anteprima')+fr('light','560px',modal(L('import.title'),imp_conf),'Conferma di sostituzione (se si perdono titoli)')+fr('light','560px',modal(L('import.title'),imp_noloss),'Nulla da perdere: una sola scelta')+fr('light','560px',modal(L('import.title'),imp_empty),'Vuoto')+fr('light','560px',modal(L('import.title'),imp_nf),'Link non valido')+fr('dark','560px',modal(L('import.title'),imp_err),'Errore · scuro')+fr('light','560px',modal(L('import.title'),imp_err_wait),'Errore: nuovo tentativo in corso')+'</div>'))
S.append(sec('Impostazioni privacy (PrivacySettingsDialog)','Senza banner di consenso: spiega che cosa si salva sul dispositivo (tabella <code>storage-table</code>) e permette di cancellare i dati locali. La cancellazione chiede conferma nello stesso popup (<code>privacy-confirm</code>), poi ricarica la pagina.',
  '<div class="dc-row">'+fr('light','560px',modal(L('privacySettings.title'),priv()),'Chiaro')+fr('dark','560px',modal(L('privacySettings.title'),priv(True)),'Conferma di cancellazione · scuro')+'</div>'))
S.append(sec('Regole di comportamento','',ul([
 'Il popup è sempre un <code>&lt;dialog&gt;</code> in portale (<code>document.body</code>); il focus iniziale è sul titolo (Modal) o su “Annulla” (ConfirmDialog).',
 'Esc non chiude il dialog di conferma mentre una richiesta è in corso (<code>ConfirmDialog.tsx</code>).',
 'L\'eliminazione dell\'account usa ConfirmDialog con parola <code>DELETE</code>; il reset del planner e la modalità manutenzione usano la forma semplice e quella “warning” (<code>DeleteAccountSection.tsx</code>, <code>Planner.tsx</code>, <code>MaintenanceSection.tsx</code>).',
 'Il trailer usa Modal <code>lg</code> (<code>TrailerButton.tsx</code>).'])))
KEYS=['share.title','share.intro','share.create','share.regenerate','share.regenerateHint','share.disable','share.copy','share.expires','share.loginRequired','import.title','import.summary','import.heading','import.recommended','import.mergeTitle','import.mergeBody','import.replaceTitle','import.replaceBody','import.replaceNoLoss','import.replaceAsk','import.replaceConfirm','import.back','import.close','import.anonymousNote','import.empty','share.invalid.title','share.invalid.body','privacySettings.title','privacySettings.intro','privacySettings.clearQuestion','privacySettings.clearConfirm','planner.reset.title','planner.reset.message','planner.reset.confirm','admin.maintenance.confirmTitle','admin.maintenance.confirmMessage']
for i in range(0,len(KEYS),9):
    S.append(sec('Testi nelle 5 lingue','',f'<div class="dc-scroll">{tbl(["Chiave"]+["it","en","fr","es","de"],[[f"<code>{k}</code>"]+[L(k,l,name="…",count="N",date="…",done="N",total="N",percent="N",url="…") for l in LANGS] for k in KEYS[i:i+9]])}</div>'))
S.append(sec('Parti proprie di questa schermata','',''))
for t_,p_ in [('Modal e conferma (Modal.less)','components/ui/Modal/Modal.less'),('ConfirmDialog (ConfirmDialog.less)','components/ui/ConfirmDialog/ConfirmDialog.less'),('Condivisione (ShareDialog.less)','features/share/components/ShareDialog/ShareDialog.less'),('Importazione (ImportSharedDialog.less)','features/share/components/ImportSharedDialog/ImportSharedDialog.less'),('Privacy (PrivacySettingsDialog.less)','features/privacy/components/PrivacySettingsDialog/PrivacySettingsDialog.less'),('Tabella dati (StorageTable.less)','features/privacy/components/StorageTable/StorageTable.less')]:
    S.append(sec(t_,'',spec(p_)))
S.append(prima_dopo([
 ['Pagina Popup','dialog descritti con valori propri','sostituita: una sola pagina con tutti i dialog del codice','Modal.less, ConfirmDialog.less'],
 ['Vuoti e condivisi','link non valido e errore di caricamento','assorbiti qui (StateBox “dialog”, err-shared 112px)','ImportSharedDialog.tsx'],
 ['Ombra del popup','varie','livello 2 (<code>--shadow-pop</code>)','Modal.less'],
 ['Pulsanti e campi','ridefiniti','usati dalle pagine Buttons e Textfield','Button.tsx, Field.tsx'],
]))
write('Popup generici.dc.html','Popup generici','\n'.join(S))
