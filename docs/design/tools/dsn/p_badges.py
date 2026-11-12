from parts import *
def adm(): return f'<span class="admin-badge" aria-hidden="true">{icon("shield-check")}</span>'
def avatar(letter,size=64,sm=False): return f'<div class="profile__avatar"><span>{letter}</span>{adm()}</div>'
S=[]
S.append(h1('Badges','Due soli badge nel codice: il contatore dei filtri attivi (<code>.badge</code>) e il segno di amministratore sull\'avatar (<code>.admin-badge</code>).'))
S.append(hdr('Badge contatore e badge amministratore: misure, colori, dove compaiono',
 'src/features/planner/components/MobileToolbar/MobileToolbar.less (.badge), src/features/admin/components/AdminBadge/AdminBadge.less, misure da AccountSettings.less e HeaderMenu.less',
 'Icona ShieldCheck (Lucide); usati da MobileToolbar, AccountMenu, HeaderMenu, AccountSettings'))
S.append(sec('Badge contatore','Pillola <code>--accent</code> con testo bianco 800, minimo 26px × 1,625rem. Compare accanto a “Filtri” quando c\'è almeno un filtro attivo; il lettore di schermo legge <code>planner.filters.activeCount</code>.',
 both('420px',f'<div style="display:flex;gap:var(--sp-5);align-items:center"><span class="badge">1</span><span class="badge">3</span><span class="badge">12</span></div>','1 · 3 · 12 filtri')))
S.append(sec('Badge amministratore','Cerchio nell\'angolo in basso a destra dell\'avatar, con anello dello sfondo. Dimensioni dalle variabili del contenitore: nel profilo 24px (icona 14, anello 3px; sotto 40em: 18/12/2), nel menu fondo <code>--on-dark</code> e anello <code>--panel-2</code>; predefinito 16px, icona 10px, anello 2px.',
 both('420px',f'<div style="display:flex;gap:var(--sp-6);align-items:center">{avatar("D")}</div>','Profilo (desktop)')))
S.append(sec('Testi','',tbl(['Lingua','planner.filters.activeCount','account.admin.role'],[[l,L('planner.filters.activeCount',l,count=3),L('account.admin.role',l)] for l in LANGS])))
S.append(sec('Valori nel codice: .badge','',spec('features/planner/components/MobileToolbar/MobileToolbar.less',r'\.badge')))
S.append(sec('Valori nel codice: .admin-badge','',spec('features/admin/components/AdminBadge/AdminBadge.less')))
S.append(sec('Regole','',ul(['I badge non sono mai cliccabili e non hanno animazione.','Il badge amministratore è <code>aria-hidden</code>: il ruolo si legge dal testo (<code>account.admin.role</code>).','Il toast ha un suo cerchio (<code>.toast__badge</code>): è parte del Toast, vedi quella pagina.'])))
S.append(prima_dopo([
 ['Badge','pagina con varianti scritte a mano','solo i due badge del codice','MobileToolbar.less, AdminBadge.less'],
 ['Dimensioni avatar','non verificate','24/14/3px desktop, 18/12/2px mobile','AccountSettings.less r.70-96'],
]))
write('Badges.dc.html','Badges','\n'.join(S))
