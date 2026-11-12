const { chromium } = require('playwright'); const fs=require('fs'); const path=require('path');
const Q=__dirname, ROOT=path.join(Q,'..','artifact-files','712252da-dd69-46bd-a8bc-d04b21af345f');
const file=p=>fs.readFileSync(p);
const css=`@font-face{font-family:'Anton';font-weight:400;src:url(http://localhost:8765/__f/anton.woff2)}@font-face{font-family:'Hanken Grotesk';font-weight:100 900;src:url(http://localhost:8765/__f/hanken.woff2)}`;
(async()=>{
  const b=await chromium.launch(); const ctx=await b.newContext({viewport:{width:1300,height:1000}}); const p=await ctx.newPage();
  await p.route('**/*',async r=>{const u=r.request().url();
    if(u.includes('unpkg.com/react@'))return r.fulfill({body:file(path.join(ROOT,'artifact-type/compat/react.production.min.js')),contentType:'text/javascript'});
    if(u.includes('unpkg.com/react-dom@'))return r.fulfill({body:file(path.join(ROOT,'artifact-type/compat/react-dom.production.min.js')),contentType:'text/javascript'});
    if(u.includes('unpkg.com/@babel'))return r.fulfill({body:file(path.join(Q,'node_modules/@babel/standalone/babel.min.js')),contentType:'text/javascript'});
    if(u.includes('fonts.googleapis.com'))return r.fulfill({body:css,contentType:'text/css'});
    if(u.includes('fonts.gstatic.com')||u.includes('preconnect'))return r.abort();
    if(u.endsWith('/__f/anton.woff2'))return r.fulfill({body:file(path.join(Q,'node_modules/@fontsource/anton/files/anton-latin-400-normal.woff2')),contentType:'font/woff2'});
    if(u.endsWith('/__f/hanken.woff2'))return r.fulfill({body:file(path.join(Q,'node_modules/@fontsource-variable/hanken-grotesk/files/hanken-grotesk-latin-wght-normal.woff2')),contentType:'font/woff2'});
    return r.continue();});
  p.on('pageerror',e=>console.log('pageerror:',String(e).slice(0,300)));
  p.on('console',m=>{ if(m.type()==='error') console.log('console:',m.text().slice(0,200)); });
  await p.goto('http://localhost:8765/Accesso%20animazioni.dc.html',{waitUntil:'load'}); await p.waitForTimeout(3500);
  const out=Q+'/a'; const dlg=()=>p.locator('#live-dlg');
  console.log('dlg count',await dlg().count());
  await dlg().screenshot({path:out+'/live-0.png'});
  // wrong credentials: click primary twice
  await p.getByRole('button',{name:'Accedi'}).last().click(); await p.waitForTimeout(1200);
  await dlg().screenshot({path:out+'/live-1-error.png'});
  // slow mode, go to forgot via link and capture mid-transition
  await p.getByRole('button',{name:'Rallentata ×5'}).click();
  await p.getByRole('link',{name:'Password dimenticata?'}).click();
  for (const [i,t] of [[0,300],[1,400],[2,500],[3,900]]) { await p.waitForTimeout(t); await p.locator('[data-theme]').first().screenshot({path:out+`/live-tr-${i}.png`}); }
  await p.waitForTimeout(1500);
  console.log('view h2:', await p.locator('#live-dlg h2').innerText());
  await b.close();
})();
