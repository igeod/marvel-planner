// Immagini del contrasto forzato (emulazione di Chromium). Uso: CHR=… CANVAS=…/canvas OUT=…/canvas/assets TEMP=… node forced_shots.js
// Legge $TEMP/sc/ff_*.html e ff_css_*.css scritti da add_forced.py.
const {chromium}=require('playwright');const path=require('path');const fs=require('fs');
const T=path.join(process.env.TEMP,'sc');
const CUR=fs.readFileSync(path.join(T,'ff_css_cur.css'),'utf8'), PROP=fs.readFileSync(path.join(T,'ff_css_prop.css'),'utf8');
(async()=>{const b=await chromium.launch({executablePath:process.env.CHR});
const net=p=>p.route(u=>/^https?:/.test(u.toString())&&!/fonts.(googleapis|gstatic)/.test(u.toString()),r=>r.abort());
for(const th of ['light','dark']) for(const st of ['prima','dopo']){
  const p=await b.newPage({viewport:{width:520,height:900},colorScheme:th,forcedColors:'active'});await net(p);
  await p.goto('file://'+path.join(T,`ff_${th}_${st}.html`));await p.waitForTimeout(600);
  await p.screenshot({path:path.join(process.env.OUT,`forzato-${th==='light'?'chiaro':'scuro'}-${st==='prima'?'prima':'dopo'}.png`),fullPage:true});await p.close();
}
const jobs=[[0,'dark','planner-d',1250],[2,'light','planner-m',1100]];
for(const [idx,scheme,name,h] of jobs) for(const after of [false,true]){
  const p=await b.newPage({viewport:{width:1500,height:1000},colorScheme:scheme,forcedColors:'active'});await net(p);
  await p.goto('file://'+path.resolve(process.env.CANVAS,'Planner.dc.html'));await p.waitForTimeout(3500);
  const frames=p.locator('iframe');const el=frames.nth(scheme==='dark'&&idx===0?1:idx);await el.scrollIntoViewIfNeeded();
  const fr=await el.elementHandle().then(h=>h.contentFrame());
  await fr.addStyleTag({content:CUR});if(after)await fr.addStyleTag({content:PROP});await p.waitForTimeout(500);
  const bb0=await el.boundingBox();const sy=await p.evaluate(()=>scrollY);
  await p.screenshot({path:path.join(process.env.OUT,`forzato-${name.replace('planner-d','planner-d').replace('planner-m','planner-m')}-${after?'dopo':'prima'}.png`),clip:{x:bb0.x,y:bb0.y+sy,width:bb0.width,height:Math.min(bb0.height,h)},fullPage:true});await p.close();
}
await b.close()})();
