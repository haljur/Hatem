import { chromium } from 'playwright-core';

const cams = process.argv.slice(2).length ? process.argv.slice(2) : ['1','2','3','4'];
const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium',
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--no-sandbox'],
});
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
page.on('console', m => console.log('[page]', m.type(), m.text()));
page.on('pageerror', e => console.log('[pageerror]', e.message));

for (const cam of cams) {
  await page.goto(`http://localhost:8123/index.html?cam=${cam}`, { waitUntil: 'load' });
  await page.waitForFunction('window.__done === true', null, { timeout: 60000 });
  await page.screenshot({ path: `shot-cam${cam}.png` });
  console.log(`saved shot-cam${cam}.png`);
}
await browser.close();
