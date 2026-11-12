const { chromium } = require('playwright'); const fs=require('fs'); const path=require('path');
const Q=__dirname, ROOT=path.join(Q,'..','artifact-files','712252da-dd69-46bd-a8bc-d04b21af345f');
const file=p=>fs.readFileSync(p);
const css=`@font-face{font-family:'Anton';font-weight:400;src:url(http://localhost:8765/__f/anton.woff2)}@font-face{font-family:'Hanken Grotesk';font-weight:100 900;src:url(http://localhost:8765/__f/hanken.woff2)}`;
(async()=>{
  const W=Number(process.argv[2]); const pages=JSON.parse(process.argv[3]);
  const b=await chromium.launch(); const res=[];
  for(const pg of pages){
    const ctx=await b.newContext({viewport:{width:W,height:900}}); const p=await ctx.newPage();
    await p.route('**/*',async r=>{const u=r.request().url();
      if(u.includes('unpkg.com/react@'))return r.fulfill({body:file(path.join(ROOT,'artifact-type/compat/react.production.min.js')),contentType:'text/javascript'});
      if(u.includes('unpkg.com/react-dom@'))return r.fulfill({body:file(path.join(ROOT,'artifact-type/compat/react-dom.production.min.js')),contentType:'text/javascript'});
      if(u.includes('unpkg.com/@babel'))return r.fulfill({body:file(path.join(Q,'node_modules/@babel/standalone/babel.min.js')),contentType:'text/javascript'});
      if(u.includes('fonts.googleapis.com'))return r.fulfill({body:css,contentType:'text/css'});
      if(u.includes('fonts.gstatic.com')||u.includes('preconnect'))return r.abort();
      if(u.endsWith('/__f/anton.woff2'))return r.fulfill({body:file(path.join(Q,'node_modules/@fontsource/anton/files/anton-latin-400-normal.woff2')),contentType:'font/woff2'});
      if(u.endsWith('/__f/hanken.woff2'))return r.fulfill({body:file(path.join(Q,'node_modules/@fontsource-variable/hanken-grotesk/files/hanken-grotesk-latin-wght-normal.woff2')),contentType:'font/woff2'});
      return r.continue();});
    await p.goto('http://localhost:8765/'+pg,{waitUntil:'load'}); await p.waitForTimeout(3000);
    const r=await p.evaluate(()=>{const de=document.documentElement; const vw=de.clientWidth; const bad=[];
      const inScroll=el=>{for(let e=el.parentElement;e;e=e.parentElement){const o=getComputedStyle(e).overflowX; if((o==='auto'||o==='scroll'||o==='hidden'||o==='clip')&&e!==document.body&&e!==de)return true;}return false;};
      document.querySelectorAll('.dc-pg *').forEach(el=>{const r=el.getBoundingClientRect(); if(r.width&&r.right>vw+1&&!inScroll(el)) bad.push(el.tagName+'.'+(el.className||'').toString().slice(0,40)+' r='+Math.round(r.right));});
      return {sw:de.scrollWidth,vw,bad:bad.slice(0,5),nbad:bad.length};});
    res.push({pg,W,...r}); await ctx.close();
  }
  await b.close(); console.log(JSON.stringify(res));
})();
