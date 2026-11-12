const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:1400,height:900}})).newPage();
await p.route('**/*',r=>/fonts\.|unpkg/.test(r.request().url())?r.abort():r.continue());
await p.goto('http://localhost:8765/Buttons.dc.html',{waitUntil:'load'});await p.waitForTimeout(3000);
const rows=await p.evaluate(()=>[...document.querySelectorAll('table.dc-tbl tbody tr')].slice(0,3).map(tr=>[...tr.querySelectorAll('button')].map(b=>getComputedStyle(b).backgroundColor+(b.disabled?'(D)':''))));
console.log(JSON.stringify(rows));
await p.locator('table.dc-tbl').first().screenshot({path:'a/tbl.png'});
await b.close();})();
