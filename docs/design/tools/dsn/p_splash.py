from parts import *
S=[]
S.append(h1('Splash','La schermata rossa del primo caricamento della sessione, la sua uscita e l\'intro a cascata.'))
S.append(hdr('Splash: aspetto, tempi, uscita, intro, fallback',
 'index.html, public/splash.css, public/splash-start.js, public/splash-root.js, src/app/splash.ts, src/styles/motion.less (#splash, :root[data-intro])',
 'Nessun componente; il planner registra la propria disponibilità con <code>useSplashReady</code>'))
S.append(sec('Aspetto','Testo “MARVEL PLANNER” in font display, <code>--accent</code> su <code>--white</code>, maiuscolo, <code>clamp(3.5rem, 11vw, 9rem)</code>, interlinea 1,02, spaziatura 0,02em, padding 24px. Il resto della pagina è <code>inert</code> finché la splash è visibile (<code>public/splash-root.js</code>).',
 f'<div class="demo-splash" aria-hidden="true">MARVEL PLANNER</div>'))
S.append(sec('Tempi (splash.ts, splash-start.js)','',tbl(['Costante','Valore','Cosa fa','Fonte'],[
 ['<code>MIN_MS</code>','450 ms','la splash non esce prima','splash.ts r.3'],
 ['<code>MAX_MS</code>','2000 ms','tetto: esce comunque, senza aspettare i dati','splash.ts r.4'],
 ['<code>INTRO_MS</code>','450 ms','dopo quanto si toglie <code>data-intro</code>','splash.ts r.5?'],
 ['<code>REMOVE_FALLBACK_MS</code>','600 ms','rimozione forzata se <code>animationend</code> non arriva','splash.ts r.6'],
 ['fallback di splash-start.js','6000 ms','libera la pagina se il bundle non parte','public/splash-start.js r.19-23'],
])))
S.append(sec('Cosa aspetta','La splash esce quando sono pronte tutte le chiavi: <code>site</code> (login e stato del sito, da AppLayout), <code>fonts</code> (Anton e Hanken Grotesk Variable) e quelle registrate dalle pagine (<code>planner</code>). Passato il tetto la pagina compare senza dati: gli scheletri partono subito (<code>data-splash-capped</code> annulla <code>--delay-pending</code>).',''))
S.append(sec('Tre casi','Tempi calcolati dalle costanti sopra: uscita = max(MIN_MS, dati pronti), con tetto a MAX_MS; pagina completa = uscita + INTRO_MS.',
 tbl(['Caso','Dati pronti a','Uscita splash','Pagina completa','Note'],[
 ['Veloce','prima di 450 ms','450 ms (MIN_MS)','900 ms','dati già presenti'],
 ['Medio','1500 ms','1500 ms','1950 ms','dati già presenti'],
 ['Lento','dopo 2000 ms','2000 ms (MAX_MS)','2450 ms','scheletri subito; i dati li sostituiscono quando arrivano'],
])))
S.append(sec('Quando compare','Solo al primo caricamento della sessione: dopo l\'uscita <code>sessionStorage["splash-seen"] = "1"</code>. Ricaricando nella stessa sessione si vede solo l\'intro (<code>data-intro</code>, rimosso dopo 450 ms). Se lo storage è bloccato la splash riappare a ogni caricamento.',''))
S.append(sec('Uscita e intro (motion.less)','Uscita: <code>fade-out</code> in <code>--dur-press</code> (80ms) con movimento ridotto; senza riduzione <code>splash-out</code> in <code>--dur-enter</code>: opacità a 0 e scala 1,02. Intro: gli elementi della prima schermata entrano con <code>swap-in</code> (6px) in <code>--dur-enter</code>, ritardo <code>min(--stagger-step × i, --stagger-max)</code>; sei elementi in cascata, tutto il resto compare senza animazione.',
 spec('styles/motion.less',r'splash|data-intro')))
S.append(sec('Stile della splash: public/splash.css','Valori nel file CSS statico (<code>public/splash.css</code>, caricato da index.html), non in un .less: serve prima del bundle. Colori e font letti dai token con fallback (<code>#c8202b</code>, <code>#fff</code>, Anton).',
 tbl(['Proprietà','Valore','Riga'],[['position / inset / z-index','fixed · 0 · 2147483647','public/splash.css r.11-13'],['display / place-items / padding','grid · center · 24px','public/splash.css r.14-16'],['background / color','var(--accent, #c8202b) · var(--white, #fff)','public/splash.css r.17-18'],['font','var(--font-display, "Anton", "Impact", "Arial Narrow", sans-serif); clamp(3.5rem, 11vw, 9rem); line-height 1.02; letter-spacing .02em','public/splash.css r.19-22'],['html','scrollbar-gutter: stable; con splash <code>overflow: hidden</code>','public/splash.css r.1-3, r.7-9']])))
S.append(prima_dopo([
 ['Tempi','minimo 600, tetto 3000, intro 700 (proposta)','450 / 2000 / 450 già nel codice','splash.ts'],
 ['Quando compare','sempre','solo primo caricamento della sessione','public/splash-start.js r.6-8, splash.ts'],
 ['Pagina Splash a parte','timeline disegnata a mano','tabella dei tempi dalle costanti','splash.ts'],
]))
write('Splash.dc.html','Splash','\n'.join(S))
