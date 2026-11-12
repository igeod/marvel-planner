const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const pg=process.argv[2];
const p=await (await b.newContext({viewport:{width:1400,height:900}})).newPage();
await p.route('**/*',r=>/fonts\.|unpkg/.test(r.request().url())?r.abort():r.continue());
await p.goto('http://localhost:8765/'+pg,{waitUntil:'load'});await p.waitForTimeout(5000);
const r=await p.evaluate(()=>[...document.querySelectorAll('iframe')].map(f=>[f.title,f.clientWidth,f.contentDocument&&f.contentDocument.documentElement.scrollHeight]));
console.log(JSON.stringify(r));await b.close();})();
