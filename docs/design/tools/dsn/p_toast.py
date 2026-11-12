from parts import *
def toast(tone,title,msg='',action=None,loading=False,state=''):
    lead=(f'<img class="toast__icon" src="assets/images/err-toast.webp" alt="" aria-hidden="true" width="36" height="36">' if tone=='error'
          else f'<span class="toast__badge" aria-hidden="true">{icon("check")}</span>')
    m=f'<span>{msg}</span>' if msg else ''
    a=btn('panel',action,'sm','','', '') if action else ''
    return (f'<div class="toast toast--{tone}" role="{"alert" if tone=="error" else "status"}">{lead}<div class="toast__text"><strong>{title}</strong>{m}</div>{a.replace("btn btn--panel","btn btn--panel toast__action") if a else ""}'
            f'<button type="button" class="toast__close{(" "+state) if state else ""}" aria-label="{L("common.close")}">{icon("x")}</button></div>')
def stack(*t): return '<div style="display:flex;flex-direction:column;gap:var(--sp-2);width:min(440px,100%)">'+''.join(t)+'</div>'
S=[]
S.append(h1('Toast','Un messaggio breve e non bloccante in basso al centro: conferma (“info”) o errore. Si chiude da solo, tranne l\'errore da riprovare.'))
S.append(hdr('Toast: tono info, tono errore, con azione, pila di 3, durate, posizione, movimento',
 'src/components/ui/Toast/ (ToastProvider.tsx, toastQueue.ts, ToastContext.ts, Toast.less); usi in ErrorCode, LoginForm, RegisterForm, useWatched',
 'Button (panel, sm), icone Check e X (Lucide), illustrazione err-toast.webp'))
S.append(sec('Toni','Superficie scuro in entrambi i temi (<code>.panel-surface</code>), raggio <code>--r-row</code>, altezza minima <code>--row-h</code>. Info: cerchio oro con spunta; errore: illustrazione <code>err-toast.webp</code>. Testi veri dal codice.',
 both('480px',stack(toast('info',L('auth.login.done')),toast('info',L('error.codeCopied')),toast('error',L('errors.save.title'),L('errors.save.body'),L('common.retry'))),'Info · info · errore con azione')))
S.append(sec('Aggiunto o rimosso dalla lista (useWatched)','Ogni volta che si segna o si toglie un titolo visto compare un toast info con la sola riga del titolo (nessun messaggio) e un\'azione. Ha sempre lo stesso <code>id</code> (<code>list-change</code>): un nuovo cambio aggiorna il toast sul posto, senza impilarne altri. Con l\'azione dura 8 s.',
 both('480px',stack(toast('info',L('planner.list.added'),'',L('common.undo')),toast('info',L('planner.list.removed'),'',L('common.undo')),toast('info',L('planner.list.savedOnDevice'),'',L('nav.login'))),'Account: aggiunto · account o ospite: rimosso · ospite: aggiunto')
 +tbl(['Chi','Gesto','Titolo (chiave)','Azione','Fonte'],[
  ['Con account','segna come visto','<code>planner.list.added</code>','<code>common.undo</code>: ripete il gesto al contrario, senza altro toast','useWatched.ts r.113-129'],
  ['Con account o ospite','toglie il visto','<code>planner.list.removed</code>','<code>common.undo</code>','useWatched.ts r.113-129'],
  ['Ospite','segna come visto','<code>planner.list.savedOnDevice</code>','<code>nav.login</code>: apre il popup di accesso (<code>openAuthDialog("login")</code>); l\'elenco dell\'ospite sta sul dispositivo, quindi qui non c\'è Annulla','useWatched.ts r.114-129'],
 ])
 +ul(['<code>Annulla</code> chiama <code>toggle(id, true)</code> (silenzioso): non compare un altro toast. Se il salvataggio fallisce compare invece il toast persistente di errore con Riprova (tono errore, sopra).','Dopo il clic il pulsante mostra l\'attesa (<code>isLoading</code>) finché l\'azione termina; il codice non chiude il toast dopo l\'azione, resta fino alla scadenza degli 8 s (non verificato nel browser).','Le scritture vanno in coda (<code>enqueue</code>, r.38-42): un tocco e un nuovo tocco arrivano al server nell\'ordine, ma il toast si mostra solo dopo il salvataggio riuscito.'])))
S.append(sec('Testi: lista e azioni nelle 5 lingue','',tbl(['Lingua','planner.list.added','planner.list.removed','planner.list.savedOnDevice','common.undo','nav.login'],[[l]+[L(k,l) for k in ('planner.list.added','planner.list.removed','planner.list.savedOnDevice','common.undo','nav.login')] for l in LANGS])))
S.append(sec('Ombra','Solo nel tema scuro: <code>--toast-shadow</code> vale <code>none</code> in chiaro e <code>var(--shadow-pop), 0 0 0 1px var(--ink-2)</code> in scuro (tokens.less). È un overlay: livello 2 della regola delle ombre.',''))
S.append(sec('Pila','<code>MAX_VISIBLE = 3</code> (toastQueue.ts). Con lo stesso <code>id</code> il toast si aggiorna sul posto. Oltre 3 esce il più vecchio non persistente; un toast info non spinge mai fuori uno persistente, un errore può spingere fuori un altro persistente.',
 both('480px',stack(toast('info',L('auth.login.done')),toast('info',L('error.codeCopied')),toast('error',L('errors.save.title'),L('errors.save.body'),L('common.retry'))),'Tre toast')))
S.append(sec('Durate e pausa','',tbl(['Caso','Durata','Fonte'],[
 ['Predefinita','6000 ms','<code>DEFAULT_DURATION</code>, ToastProvider.tsx'],
 ['Con azione da raggiungere','8000 ms','<code>ACTION_DURATION</code>, ToastProvider.tsx'],
 ['Minimo assoluto','4000 ms (anche se una durata passata è più corta)','<code>Math.max(duration ?? base, 4000)</code>'],
 ['Persistente (<code>persistent: true</code>)','non si chiude da solo','ToastProvider.tsx'],
 ['Pausa','con puntatore sopra o focus dentro il timer si ferma; <b>al rilascio riparte per intero</b> (nel codice: “shortcut: the timer restarts in full after a pause”)','ToastProvider.tsx'],
])))
S.append(sec('Tastiera e focus','',ul(['<code>role="alert"</code> per l\'errore, <code>role="status"</code> per gli altri; il contenitore è <code>aria-live="polite"</code>.','Esc chiude il toast; se il focus era dentro, torna all\'elemento di prima.','Il pulsante di chiusura è 44px (<code>--hit</code>), focus oro 3px.'])))
S.append(sec('Posizione','Fisso in basso al centro, <code>bottom: max(16px, safe-area)</code>, larghezza <code>min(440px, 100vw − 32px)</code>, z-index 20. Con la barra di avanzamento mobile visibile i toast salgono sopra di essa. Le misure 440px, 36px (icona e cerchio), 16px non hanno token: '+NOTOKEN,''))
S.append(sec('Valori nel codice: Toast.less','',spec('components/ui/Toast/Toast.less')))
S.append(sec('Movimento','Ingresso: dissolvenza in <code>--dur-enter</code> (240ms) con <code>swap-in</code> di 6px dal basso quando il movimento non è ridotto. <b>Non esiste un\'animazione di uscita</b> nel codice: il toast sparisce di colpo.',spec('styles/motion.less',r'toast')))
S.append(sec('Testi nelle 5 lingue','',tbl(['Lingua','auth.login.done','error.codeCopied','errors.save.title','errors.save.body','common.retry'],[[l]+[L(k,l) for k in ('auth.login.done','error.codeCopied','errors.save.title','errors.save.body','common.retry')] for l in LANGS])))
S.append(prima_dopo([
 ['Durata','4 s (ERRORI_SPEC)','6 s, 8 s con azione, minimo 4 s','ToastProvider.tsx'],
 ['Pila','non definita','massimo 3, regole di sfratto','toastQueue.ts'],
 ['Ombra','sempre','solo in scuro, <code>--toast-shadow</code>','tokens.less'],
 ['Testo del messaggio','regolare','grassetto solo sul titolo (<code>.toast__text strong</code>, 800); il resto del toast errore è peso 400 (<code>.toast</code> riporta <code>font-weight: 400</code> perché <code>[role="alert"]</code> in base.less r.235 lo renderebbe grassetto)','Toast.less r.20-21, r.64-65; base.less r.235'],
 ['Uscita','dissolvenza dichiarata','nessuna animazione di uscita nel codice','motion.less'],
]))
write('Toast.dc.html','Toast','\n'.join(S))
