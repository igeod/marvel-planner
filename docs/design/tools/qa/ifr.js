const {chromium}=require('playwright');const path=require('path');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:900}});
await p.route(u=>/^https?:/.test(u.toString()),r=>r.abort());
await p.goto('file://'+path.resolve('zip/canvas/Pagina Film.dc.html'));await p.waitForTimeout(2500);
const f=p.locator('iframe[title^="Pagina film · mobile"]');await f.first().scrollIntoViewIfNeeded();await p.waitForTimeout(800);
await p.screenshot({path:'qa/a/ifr.png'});await b.close()})();
