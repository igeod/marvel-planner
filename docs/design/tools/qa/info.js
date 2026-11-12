const { chromium } = require('playwright');
(async()=>{
 const b=await chromium.launch(); const p=await b.newPage({viewport:{width:1400,height:900},deviceScaleFactor:1});
 await p.goto('http://localhost:8765/Informativa%20planner.dc.html'); await p.waitForTimeout(1500);
 await p.screenshot({path:'qa/info_full.png',fullPage:true});
 // overflow: every frame's content must fit its frame width
 const bad=await p.evaluate(()=>[...document.querySelectorAll('.fr')].map(f=>({w:f.clientWidth,sw:f.scrollWidth})).filter(x=>x.sw>x.w+1));
 console.log('overflowing frames',JSON.stringify(bad));
 // 320px check for the guide text only
 const q=await b.newPage({viewport:{width:360,height:800}}); await q.goto('http://localhost:8765/Informativa%20planner.dc.html'); await q.waitForTimeout(1200);
 console.log('page h-scroll at 360:', await q.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth));
 await b.close();
})();
