const {chromium}=require('playwright');const path=require('path');
(async()=>{const b=await chromium.launch();const args=JSON.parse(process.argv[2]);
for(const [pg,t,w] of args){const p=await b.newPage({viewport:{width:w||1280,height:900},deviceScaleFactor:1});
await p.route(u=>/^https?:/.test(u.toString()),r=>r.abort());
await p.goto('file://'+path.resolve('zip/canvas/'+pg+'.dc.html'));await p.waitForTimeout(2500);
const h=p.locator('h2.dc-h2',{hasText:t}).first();const sec=h.locator('xpath=..');
await sec.screenshot({path:`qa/a/s-${pg.replace(/ /g,'_')}-${t.slice(0,8).replace(/\W/g,'_')}.png`});await p.close();}
await b.close()})();
