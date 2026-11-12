const { chromium } = require('playwright'); const fs=require('fs'); const path=require('path');
const Q=__dirname, ROOT=path.join(Q,'..','artifact-files','712252da-dd69-46bd-a8bc-d04b21af345f');
const file=p=>fs.readFileSync(p);
const css=`@font-face{font-family:'Anton';font-weight:400;src:url(http://localhost:8765/__f/anton.woff2)}@font-face{font-family:'Hanken Grotesk';font-weight:100 900;src:url(http://localhost:8765/__f/hanken.woff2)}`;
(async()=>{
  const page=process.argv[2], idxs=(process.argv[3]||'').split(',').filter(Boolean).map(Number), lang=process.argv[4]||'it';
  const b=await chromium.launch(); const ctx=await b.newContext({viewport:{width:1400,height:900}}); const p=await ctx.newPage();
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
  await p.goto('http://localhost:8765/'+page,{waitUntil:'load'}); await p.waitForTimeout(3500);
  if(lang!=='it'){await p.getByRole('button',{name:{en:'English',fr:'Français',es:'Español',de:'Deutsch'}[lang]}).click(); await p.waitForTimeout(500);}
  await p.evaluate(()=>document.fonts.ready);
  const r=await p.evaluate(()=>{const d=document.querySelector("dialog.dialog");if(!d)return "nodialog";const c=getComputedStyle(d);const b=d.getBoundingClientRect();const ch=d.querySelector(".auth-view");const cc=getComputedStyle(ch);return JSON.stringify({chop:cc.opacity,chan:cc.animationName,chdisp:cc.display,chh:ch.getBoundingClientRect().height,disp:c.display,vis:c.visibility,op:c.opacity,w:b.width,h:b.height,pos:c.position,scrollH:d.querySelector(".dialog__scroll")?.getBoundingClientRect().height,html:d.outerHTML.slice(0,300)})});console.log(r);
  const out=Q+'/a'; fs.mkdirSync(out,{recursive:true});
  await b.close();
})();
