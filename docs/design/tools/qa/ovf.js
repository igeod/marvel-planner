const { chromium } = require('playwright'); const fs=require('fs'); const path=require('path');
const Q=__dirname, ROOT=path.join(Q,'..','artifact-files','712252da-dd69-46bd-a8bc-d04b21af345f');
const file=p=>fs.readFileSync(p);
const css=`@font-face{font-family:'Anton';font-weight:400;src:url(http://localhost:8765/__f/anton.woff2)}@font-face{font-family:'Hanken Grotesk';font-weight:100 900;src:url(http://localhost:8765/__f/hanken.woff2)}`;
(async()=>{
  const b=await chromium.launch(); const ctx=await b.newContext({viewport:{width:1300,height:900}}); const p=await ctx.newPage();
  await p.route('**/*',async r=>{const u=r.request().url();
    if(u.includes('unpkg.com/react@'))return r.fulfill({body:file(path.join(ROOT,'artifact-type/compat/react.production.min.js')),contentType:'text/javascript'});
    if(u.includes('unpkg.com/react-dom@'))return r.fulfill({body:file(path.join(ROOT,'artifact-type/compat/react-dom.production.min.js')),contentType:'text/javascript'});
    if(u.includes('unpkg.com/@babel'))return r.fulfill({body:file(path.join(Q,'node_modules/@babel/standalone/babel.min.js')),contentType:'text/javascript'});
    if(u.includes('fonts.googleapis.com'))return r.fulfill({body:css,contentType:'text/css'});
    if(u.includes('fonts.gstatic.com')||u.includes('preconnect'))return r.abort();
    if(u.endsWith('/__f/anton.woff2'))return r.fulfill({body:file(path.join(Q,'node_modules/@fontsource/anton/files/anton-latin-400-normal.woff2')),contentType:'font/woff2'});
    if(u.endsWith('/__f/hanken.woff2'))return r.fulfill({body:file(path.join(Q,'node_modules/@fontsource-variable/hanken-grotesk/files/hanken-grotesk-latin-wght-normal.woff2')),contentType:'font/woff2'});
    return r.continue();});
  for (const page of ['Accesso%20stati.dc.html','Accesso%20recupero.dc.html']) {
    await p.goto('http://localhost:8765/'+page,{waitUntil:'load'}); await p.waitForTimeout(3000);
    for (const [c,n] of [['it','Italiano'],['en','English'],['fr','Français'],['es','Español'],['de','Deutsch']]) {
      await p.getByRole('button',{name:n}).click(); await p.waitForTimeout(400);
      const res = await p.evaluate(()=>{ const out=[]; document.querySelectorAll('[data-theme]').forEach((f,i)=>{ if(f.getBoundingClientRect().width>400) return; const fr=f.getBoundingClientRect(); f.querySelectorAll('*').forEach(el=>{const r=el.getBoundingClientRect(); if(r.width&&(r.right>fr.right+0.5||r.left<fr.left-0.5)) out.push(i+':'+el.tagName+':'+(el.textContent||'').slice(0,30));}); if (f.scrollWidth>f.clientWidth+1) out.push(i+':scroll'); }); return {n:out.length, first:out.slice(0,4), unrendered:(document.body.innerText.match(/\{\{/g)||[]).length}; });
      console.log(page.slice(0,16),c,JSON.stringify(res));
    }
  }
  await b.close();
})();
