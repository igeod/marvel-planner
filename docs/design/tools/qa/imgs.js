const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage();
for(const f of ['Vuoti%20e%20condivisi.dc.html','Decisioni%202.dc.html']){
 await p.goto('http://localhost:8765/'+f);await p.waitForTimeout(2500);
 const r=await p.evaluate(()=>[...document.querySelectorAll('img[src*="assets/images"]')].map(i=>[i.getAttribute('src'),i.naturalWidth]));
 console.log(f,r.length,'imgs; broken:',r.filter(x=>!x[1]).length);}
await b.close();})();
