from comp import *
A='features/account/components/'
def pw(label,err='',after='',inv=False):
    i=uid()
    m=f'<p role="alert" class="field__message field__error">{icon("circle-alert")}{err}</p>' if err else ''
    return (f'<div class="field"><div class="field__label"><label for="{i}">{label}</label></div><div class="field__control"><input id="{i}" type="password" data-clearable="true"{" aria-invalid=\"true\"" if (err or inv) else ""}>'
            f'<button type="button" class="field__button" aria-label="{L("auth.showPassword")}" aria-pressed="false">{icon("eye")}</button></div>{m}{after}</div>')
def side(tab,adm=False,count=0):
    badge=f'<span class="admin-badge" aria-hidden="true">{icon("shield-check")}</span>' if adm else ''
    role=f'<p class="profile__role">{icon("shield-check")}{L("account.admin.role")}</p>' if adm else ''
    admin=''
    if adm:
        c=f'<span class="profile__admin-count" aria-hidden="true">{count}</span>' if count else ''
        admin=f'<a class="profile__admin" href="#">{icon("settings")}<span class="profile__admin-label">{L("nav.admin")}</span>{c}</a>'
    T=[('progress','chart-line'),('profile','user-round'),('password','lock'),('account','log-out')]
    tabs=''.join(f'<button type="button" role="tab" class="profile__tab" aria-selected="{"true" if t==tab else "false"}"{"" if t==tab else " tabindex=\"-1\""}>{icon(ic)}{L("account.tabs."+t)}</button>' for t,ic in T)
    return (f'<aside class="profile__side"><div class="profile__id"><div class="profile__avatar" aria-hidden="true">D{badge}</div><div class="profile__who"><p class="profile__name">Diego</p>{role}</div></div>{admin}'
            f'<nav class="profile__nav" role="tablist" aria-label="{L("account.nav")}">{tabs}</nav></aside>')
TITLE={'progress':'account.stats.heading','profile':'account.tabs.profile','password':'account.tabs.password','account':'account.tabs.account'}
def group(title,rows,open_=False,cls=''):
    sd=sum(r[1] for r in rows); st=sum(r[2] for r in rows)
    li=''.join(f'<li class="progress-row{" progress-row--done" if d==t else ""}"><span class="progress-row__head"><span>{n}</span><span>{L("common.ofCount",done=d,total=t)}</span></span><span class="progress-row__bar" aria-hidden="true"><span style="width:{d/max(t,1)*100:.0f}%"></span></span></li>' for n,d,t in rows)
    return f'<details class="progress-group{cls}"{" open" if open_ else ""}><summary class="progress-group__summary"><span>{title}</span><span class="progress-group__sum">{L("common.ofCount",done=sd,total=st)}</span>{CHEV}</summary><ul class="progress-group__rows">{li}</ul></details>'
def progress():
    d,t=24,60
    tot=(f'<div class="progress-total"><div class="progress-total__row"><div><p class="progress-total__label">{L("account.stats.watched")}</p><p class="progress-total__count">{d}<span> / {t}</span></p></div><p class="progress-total__percent">40%</p></div>'
         f'<div class="progress-total__bar" role="progressbar" aria-label="{L("account.stats.watched")}" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100"><span style="width:40%"></span></div>'
         +btn('ink',L('account.stats.share'),'lg','','share-2')+'</div>')
    g=(group(L('account.stats.byPhase'),[(f'1 · {L("catalog.phases.1")}',12,23),(f'2 · {L("catalog.phases.2")}',12,37)],True)
       +group(L('account.stats.byType'),[(L('planner.types.film'),20,40),(L('planner.types.serie'),4,20)])
       +group(L('account.stats.byYear'),[('2008',2,2),('2010',1,3)],cls=' progress-group--year'))
    return f'<div class="profile__panel profile__scroll scroll-y"><section class="progress-stats">{tot}{g}</section></div>'
def profile_tab(err=False):
    n=tf(L('auth.name'),'Diego',hint=L('auth.nameHint'),error=L('account.profile.errors.nameShort',min=2) if err else '',invalid=err)
    return (f'<div class="profile__panel"><section class="profile-section"><form novalidate>{n}'
            f'<div class="profile-section__actions">{btn("primary",L("account.profile.save"),"","","")}{status(L("account.profile.saved",name="Diego"),True)}</div></form><hr class="profile__rule">'
            f'<form novalidate>{tf(L("account.profile.email"),"",typ="email")}<div class="profile-section__actions">{btn("primary",L("account.profile.emailSave"))}</div></form></section></div>')
def password_tab():
    pair=f'<div class="password-section__pair">{pw(L("account.password.next"),after=pwreq("pending"))}{pw(L("account.password.confirm"),err=L("account.password.mismatch"))}</div>'
    return (f'<div class="profile__panel"><section class="password-section"><form class="form" novalidate>{pw(L("account.password.current"))}{pair}'
            f'<div class="password-section__actions"><p class="password-section__note">{L("account.password.signedOut")}</p>{btn("primary",L("account.password.change"))}</div></form></section></div>')
def account_tab():
    lo=f'<section class="profile__logout"><div><h3>{L("account.logout.heading")}</h3><p class="muted">{L("account.logout.note")}</p></div>{btn("ink",L("account.logout.heading"),"","","log-out")}</section>'
    ex=f'<section class="export-section"><div class="export-section__row"><div><h3>{L("account.export.heading")}</h3><p class="muted">{L("account.export.description")}</p></div>{btn("soft",L("account.export.button"),"","","download")}</div></section>'
    de=(f'<section class="delete-account"><div class="delete-account__head"><span class="delete-account__icon" aria-hidden="true">{icon("trash-2")}</span><h3>{L("account.delete.heading")}</h3></div><p class="muted">{L("account.delete.warning")}</p>'
        f'<form novalidate>{pw(L("auth.password"))}<div class="delete-account__actions">{btn("danger",L("account.delete.button"),"","","","")}</div></form></section>')
    return f'<div class="profile__panel">{lo}<hr class="profile__rule">{ex}{de}</div>'
def skeleton(): return f'<div class="profile__panel profile__scroll scroll-y"><section class="progress-stats" aria-busy="true"><div class="progress-skeleton__card" aria-hidden="true"></div>'+'<div class="progress-skeleton__group" aria-hidden="true"></div>'*3+'</section></div>'
def unsaved(): return f'<div class="profile__unsaved" role="alert"><p>{L("account.dialog.unsaved")}</p><div class="profile__unsaved-actions"><button type="button" class="profile__keep">{L("account.dialog.keep")}</button><button type="button" class="profile__discard">{L("account.dialog.discard")}</button></div></div>'
def popup(tab,body,adm=False,count=0,banner=False,busy=False):
    inner=f'<h2 class="profile__title">{L(TITLE[tab])}</h2>{body}'
    return (f'<dialog class="dialog dialog--profile" open style="position:static;margin:0"><div class="profile">{side(tab,adm,count)}<section class="profile__content"><div class="profile__inner" data-tab="{tab}"{" data-unsaved" if banner else ""}>{inner}</div></section>'
            f'<button type="button" class="dialog__close profile__close{" profile__close--busy" if busy else ""}" aria-label="{L("common.close")}">{icon("x")}</button>{unsaved() if banner else ""}</div></dialog>')
def desk(tab,body,theme,label,**k): return phone(f'<div style="padding:var(--sp-5);background:var(--bg-sunk,var(--bg))">{popup(tab,body,**k)}</div>',theme,720,840,label)
def mob(tab,body,theme,label,**k): return phone(f'<div style="padding-top:var(--sp-6);background:var(--bg-sunk,var(--bg))">{popup(tab,body,**k)}</div>',theme,800,390,label)
S=[]
S.append(h1('Profile Popup','Il popup dell\'account: avanzamento, profilo, password e dati, con la barra “modifiche non salvate”.'))
S.append(hdr('Profile Popup (AccountSettings): le 4 schede, l\'avviso di modifiche non salvate, la versione mobile come foglio dal basso, i testi nelle 5 lingue',
 'src/features/account/components/ (AccountSettings, ProgressStatsSection, ProfileSection, PasswordSection, ExportSection, DeleteAccountSection), src/features/account/hooks/useReportDirty.ts, src/features/admin/components/AdminBadge/',
 'Popup generici (Modal, ConfirmDialog, ShareDialog), Textfield (campi, requisito password, FormError), Buttons (primary, ink, soft, danger), Status (System states), Badges (badge amministratore), Accordion (gruppi di avanzamento), Progress'))
S.append(sec('Struttura','Popup 800×640 (<code>50rem</code>, alto <code>min(40rem, 100dvh − 64px)</code>): colonna a sinistra di 260px (<code>16.25rem</code>) con avatar, nome e le 4 schede verticali, contenuto a destra. Sotto 40em diventa un foglio dal basso: intestazione compatta, schede in una riga di 4 colonne uguali (icona sopra, etichetta sotto) e trascinabile verso il basso (<code>useSheetDrag</code>). Tutti i pannelli restano montati, così le modifiche non salvate sopravvivono al cambio scheda.',
  '<div class="dc-row">'+desk('progress',progress(),'light','Avanzamento · chiaro')+'</div>'))
S.append(sec('Schede','Titolo del pannello dalla chiave <code>account.stats.heading</code> (Avanzamento) o <code>account.tabs.*</code>. Nella scheda Avanzamento scorre solo la lista, il titolo resta fisso.','<div class="dc-row">'+desk('profile',profile_tab(),'light','Profilo')+desk('password',password_tab(),'light','Password')+desk('account',account_tab(),'light','Dati e account')+'</div>'))
S.append(sec('Scuro e amministratore','Il badge dell\'amministratore sta nell\'angolo dell\'avatar; il collegamento “Amministrazione” compare solo per gli admin, con il numero di candidati da approvare (<code>account.admin.pending</code> per i lettori di schermo).','<div class="dc-row">'+desk('progress',progress(),'dark','Avanzamento · scuro · admin',adm=True,count=3)+desk('profile',profile_tab(True),'dark','Profilo con errore · scuro')+'</div>'))
S.append(sec('Modifiche non salvate','Chiudere con campi modificati non chiude: sul fondo compare la barra scura con “Continua a modificare” e “Esci senza salvare”. Esc, clic sullo sfondo e trascinamento del foglio passano tutti da qui. Mentre una richiesta è in corso la chiusura è ignorata e il pulsante di chiusura diventa grigio (<code>profile__close--busy</code>). La barra sfuma in <code>--dur-hover</code> e il pannello tiene lo spazio sotto il contenuto.','<div class="dc-row">'+desk('profile',profile_tab(),'light','Barra di conferma',banner=True)+desk('profile',profile_tab(),'light','Richiesta in corso',busy=True)+'</div>'))
S.append(sec('Caricamento','Scheletro della scheda Avanzamento (<code>aria-busy</code>, testo nascosto <code>account.stats.loading</code>). Le barre si riempiono da 0 una sola volta per caricamento pagina; riaprire il popup non rifà l\'animazione. Se la richiesta fallisce compare <code>LoadError</code> con “Riprova” (System states).','<div class="dc-row">'+desk('progress',skeleton(),'light','Scheletro')+'</div>'))
S.append(sec('Mobile (sotto 40em)','Foglio dal basso: maniglia (barra 40×5px) in cima, schede su 4 colonne, il campo con il focus resta sopra la tastiera (l\'altezza segue <code>visualViewport</code>).','<div class="dc-row">'+mob('progress',progress(),'light','Avanzamento')+mob('profile',profile_tab(),'light','Profilo')+mob('account',account_tab(),'dark','Dati e account · scuro')+'</div>'))
S.append(sec('Regole di comportamento','',ul([
 'Cambio scheda: frecce, Home e Fine come in una tablist; il focus segue la scheda (<code>AccountSettings.tsx</code>).',
 'Profilo: nome e e-mail sono due form separati, ognuno con il suo pulsante; il pulsante resta <code>aria-disabled</code> finché non c\'è una modifica valida; un suggerimento sull\'e-mail (<code>auth.emailSuggestion</code>) compare come aiuto (<code>ProfileSection.tsx</code>).',
 'Password: dopo il salvataggio il form si svuota e le altre sessioni vengono chiuse (<code>account.password.signedOut</code>); i campi nuovo/conferma condividono l\'occhio (<code>PasswordSection.tsx</code>).',
 'Elimina account: serve la password, poi il dialog di conferma con la parola da scrivere (<code>DELETE</code>); vedi Popup generici (<code>DeleteAccountSection.tsx</code>).',
 'Esporta dati: scarica il file dall\'API; errore e conferma sotto il pulsante (<code>ExportSection.tsx</code>).',
 'Condividi avanzamento: apre ShareDialog (Popup generici).'])))
KEYS=['account.tabs.progress','account.tabs.profile','account.tabs.password','account.tabs.account','account.stats.heading','account.stats.share','account.profile.save','account.profile.saved','account.password.change','account.password.signedOut','account.logout.heading','account.logout.note','account.export.description','account.delete.warning','account.dialog.unsaved','account.dialog.keep','account.dialog.discard']
for ch_ in (KEYS[:9],KEYS[9:]):
    S.append(sec('Testi nelle 5 lingue','',f'<div class="dc-scroll">{tbl(["Chiave"]+["it","en","fr","es","de"],[[f"<code>{k}</code>"]+[L(k,l,name="…",min=2) for l in LANGS] for k in ch_])}</div>'))
S.append(sec('Parti proprie di questa schermata','',''))
for t_,p_ in [('Popup profilo (AccountSettings.less)','AccountSettings/AccountSettings.less'),('Avanzamento (ProgressStatsSection.less)','ProgressStatsSection/ProgressStatsSection.less'),('Profilo (ProfileSection.less)','ProfileSection/ProfileSection.less'),('Password (PasswordSection.less)','PasswordSection/PasswordSection.less'),('Dati (ExportSection.less)','ExportSection/ExportSection.less'),('Elimina account (DeleteAccountSection.less)','DeleteAccountSection/DeleteAccountSection.less')]:
    S.append(sec(t_,'',spec(A+p_)))
S.append(prima_dopo([
 ['PROFILE_POPUP_SPEC','documento a parte','assorbito in questa pagina','AccountSettings.tsx'],
 ['Pagina Profile Popup vecchia','mockup con valori propri','sostituita: markup e valori dal codice','AccountSettings.less'],
 ['Campi, pulsanti, stati','ridefiniti nel popup','usati dalle pagine Textfield, Buttons, System states','Field.tsx, Button.tsx'],
 ['Elenco dati, dialog di conferma','—','ConfirmDialog e ShareDialog stanno in Popup generici','—'],
]))
write('Profile Popup.dc.html','Profile Popup','\n'.join(S))
