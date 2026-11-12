const {chromium}=require('playwright');
const P='@WORK@/canvas/';
const pairs=JSON.parse(process.argv[2]);
(async()=>{const b=await chromium.launch();const pg=await b.newPage();
await pg.goto('file://'+P+'Select.dc.html');
const res=await pg.evaluate((pairs)=>{
 const out={};
 for(const theme of ['light','dark']){
  const d=document.createElement('div');d.setAttribute('data-theme',theme);document.body.appendChild(d);
  out[theme]=pairs.map(([fg,bg])=>{
    const e=document.createElement('span');e.style.color=`var(${fg})`;e.style.backgroundColor=`var(${bg})`;d.appendChild(e);
    const cs=getComputedStyle(e);const p=s=>s.match(/[\d.]+/g).slice(0,3).map(Number);
    const lum=c=>{const f=x=>{x/=255;return x<=.03928?x/12.92:Math.pow((x+.055)/1.055,2.4)};return .2126*f(c[0])+.7152*f(c[1])+.0722*f(c[2])};
    const a=lum(p(cs.color)),bb=lum(p(cs.backgroundColor));const r=(Math.max(a,bb)+.05)/(Math.min(a,bb)+.05);
    return [fg,bg,Math.round(r*100)/100,cs.color,cs.backgroundColor];});
 }
 return out;},pairs);
console.log(JSON.stringify(res));await b.close();})();
