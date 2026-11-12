const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:1400,height:900}})).newPage();
await p.route('**/*',r=>/fonts\.|unpkg/.test(r.request().url())?r.abort():r.continue());
await p.goto('http://localhost:8765/'+process.argv[2],{waitUntil:'load'});await p.waitForTimeout(2500);
console.log(JSON.stringify(await p.evaluate((sel)=>{const e=document.querySelector(sel);if(!e)return null;const c=getComputedStyle(e);return {dis:e.disabled,bg:c.backgroundColor,color:c.color,h:c.height,html:e.outerHTML.slice(0,160)}},process.argv[3])));
await b.close();})();
