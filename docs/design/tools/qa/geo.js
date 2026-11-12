const {chromium}=require('playwright');const path=require('path');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:900}});
await p.route(u=>/^https?:/.test(u.toString()),r=>r.abort());
await p.goto('file://'+path.resolve('zip/canvas/Planner.dc.html'));await p.waitForTimeout(3000);
const fr=p.frames().find(f=>f.url()==='about:srcdoc'&&0);
for(const f of p.frames()){ if(f===p.mainFrame())continue;
 const r=await f.evaluate(()=>{const q=s=>{const e=document.querySelector(s);if(!e)return null;const r=e.getBoundingClientRect();return [Math.round(r.left*10)/10,Math.round(r.right*10)/10,Math.round(r.top),Math.round(r.bottom),Math.round(r.width),getComputedStyle(e).borderRadius]};
 if(!document.querySelector('.floating-progress')||!document.querySelector('.toast'))return null;
 return {W:innerWidth,H:innerHeight,bar:q('.floating-progress'),toasts:q('.toasts'),toast:q('.toast'),phase:q('.phase'),main:q('.site-main'),pad:getComputedStyle(document.querySelector('.floating-progress')).padding,tpad:getComputedStyle(document.querySelector('.toast')).padding}});
 if(r){console.log(JSON.stringify(r))}}
await b.close()})();
