const fs=require('fs'),vm=require('vm');
const D='@REPO@/src/i18n/locales/';
const out={};
for(const l of ['it','en','fr','es','de']){
  let s=fs.readFileSync(D+l+'.ts','utf8');
  s=s.replace(/^import[^\n]*\n/mg,'').replace(/^export type [^\n]*\n/mg,'').replace(/export const (\w+)(\s*:\s*[\w<>]+)?\s*=/,'var X =').replace(/\}\s*(as const|satisfies [^;]+);?\s*$/,'};');
  const ctx={};vm.createContext(ctx);vm.runInContext(s+';this.R=X;',ctx);
  const flat={};(function w(o,p){for(const k in o){const v=o[k];if(v&&typeof v==='object')w(v,p?p+'.'+k:k);else flat[p?p+'.'+k:k]=v}})(ctx.R,'');
  out[l]=flat;
}
fs.writeFileSync('locales.json',JSON.stringify(out));
console.log(Object.keys(out.it).length,Object.keys(out.en).length,Object.keys(out.de).length);
