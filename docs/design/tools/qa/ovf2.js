const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();
for(const pg of JSON.parse(process.env.PGS)) for(const w of [360,820,1440]){
 const p=await (await b.newContext({viewport:{width:w,height:900}})).newPage();
 await p.route('**/*',r=>/fonts\.|unpkg/.test(r.request().url())?r.abort():r.continue());
 const errs=[];p.on('pageerror',e=>errs.push(String(e).slice(0,120)));
 await p.goto('http://localhost:8765/'+pg,{waitUntil:'load'});await p.waitForTimeout(1200);
 const r=await p.evaluate(()=>({sw:document.documentElement.scrollWidth,cw:document.documentElement.clientWidth,h1:document.querySelectorAll('h1').length,imgbad:[...document.images].filter(i=>!i.complete||!i.naturalWidth).length}));
 console.log(pg,w,JSON.stringify(r),errs.join('|'));}
await b.close();})();
