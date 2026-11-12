const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
const Q = __dirname, ROOT = path.join(Q, '..', 'artifact-files', '712252da-dd69-46bd-a8bc-d04b21af345f');
const file = (p) => fs.readFileSync(p);
const css = `@font-face{font-family:'Anton';font-weight:400;src:url(http://localhost:8765/__f/anton.woff2)}@font-face{font-family:'Hanken Grotesk';font-weight:100 900;src:url(http://localhost:8765/__f/hanken.woff2)}`;
async function open(b, page, width, height) {
  const ctx = await b.newContext({ viewport: { width, height }, deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  await p.route('**/*', async (r) => {
    const u = r.request().url();
    if (u.includes('unpkg.com/react@')) return r.fulfill({ body: file(path.join(ROOT, 'artifact-type/compat/react.production.min.js')), contentType: 'text/javascript' });
    if (u.includes('unpkg.com/react-dom@')) return r.fulfill({ body: file(path.join(ROOT, 'artifact-type/compat/react-dom.production.min.js')), contentType: 'text/javascript' });
    if (u.includes('unpkg.com/@babel')) return r.fulfill({ body: file(path.join(Q, 'node_modules/@babel/standalone/babel.min.js')), contentType: 'text/javascript' });
    if (u.includes('fonts.googleapis.com')) return r.fulfill({ body: css, contentType: 'text/css' });
    if (u.includes('fonts.gstatic.com') || u.includes('preconnect')) return r.abort();
    if (u.endsWith('/__f/anton.woff2')) return r.fulfill({ body: file(path.join(Q, 'node_modules/@fontsource/anton/files/anton-latin-400-normal.woff2')), contentType: 'font/woff2' });
    if (u.endsWith('/__f/hanken.woff2')) return r.fulfill({ body: file(path.join(Q, 'node_modules/@fontsource-variable/hanken-grotesk/files/hanken-grotesk-latin-wght-normal.woff2')), contentType: 'font/woff2' });
    return r.continue();
  });
  p.on('pageerror', e => console.log('pageerror:', String(e).slice(0, 200)));
  await p.goto('http://localhost:8765/' + page, { waitUntil: 'load' });
  await p.waitForTimeout(3000); await p.evaluate(() => document.fonts.ready);
  return p;
}
(async () => {
  const b = await chromium.launch();
  const p = await open(b, 'Pagine%20errore.dc.html', 1280, 900);
  console.log('h1:', await p.locator('h1').count(), 'imgs loaded:', await p.evaluate(() => [...document.images].map(i => i.src.split('/').pop() + ':' + i.naturalWidth).join(',')));
  const fr = p.locator('[data-theme]');
  const n = await fr.count(); console.log('frames', n);
  for (let i = 0; i < n; i++) await fr.nth(i).screenshot({ path: Q + `/fc-${i}.png` });
  const hs = await p.evaluate(() => document.documentElement.scrollHeight); console.log('height', hs);
  await b.close();
})();
