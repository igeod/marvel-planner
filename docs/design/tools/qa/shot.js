const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
  p.on('console', m => { if (m.type()==='error') console.log('console error:', m.text().slice(0,200)); });
  p.on('pageerror', e => console.log('pageerror:', String(e).slice(0,200)));
  await p.goto('http://localhost:8765/Pagine%20errore.dc.html', { waitUntil: 'load', timeout: 20000 });
  await p.waitForTimeout(2500);
  console.log('h2 count', await p.locator('h2').count(), 'frames h1', await p.locator('h1').count());
  await p.screenshot({ path: '@WORK@/qa/pagine-top.png', fullPage: false });
  await p.screenshot({ path: '@WORK@/qa/pagine-full.png', fullPage: true });
  await b.close();
})();
