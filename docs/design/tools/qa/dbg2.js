const {chromium}=require('playwright');const path=require('path');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:900}});
await p.route(u=>/^https?:/.test(u.toString()),r=>r.abort());
await p.goto('file://'+path.resolve('zip/canvas/Fascia fasi.dc.html'));await p.waitForTimeout(2500);
const f=p.frames().find(x=>x!==p.mainFrame());
const r=await f.evaluate(()=>{const c=document.querySelector('.phase-strip__cell--watched');const s=c.querySelector('svg');const cs=getComputedStyle(s);const cc=c.getBoundingClientRect();const sb=s.getBoundingClientRect();return {html:s.outerHTML.slice(0,300),cell:[cc.width,cc.height],svg:[sb.width,sb.height],w:cs.width,h:cs.height,disp:cs.display,pos:cs.position,vb:s.getAttribute('viewBox'),path:getComputedStyle(s.querySelector('path')).cssText.slice(0,100)}});
console.log(JSON.stringify(r));await b.close()})();
