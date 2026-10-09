import { chromium } from 'playwright';
import fs from 'fs';
const [,, mode, outDir, cfgPath] = process.argv;
const cfg = cfgPath ? JSON.parse(fs.readFileSync(cfgPath,'utf8')) : {};
const browser = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
await page.addInitScript(c => { window.T = c.T; window.CAPS = c.CAPS; }, cfg);
await page.goto('file://' + process.cwd() + '/web/index.html');
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(300);
fs.mkdirSync(outDir, { recursive: true });
const FPS = 30;
const times = mode === 'preview' ? (cfg.preview || [1, 2.5, 5.5, 9, 13.5, 16.2, 17.3, 19]) : null;
const end = (cfg.T && cfg.T.end) || 20;
const list = times || [...Array(Math.round(end * FPS)).keys()].map(i => i / FPS);
let i = 0;
for (const t of list) {
  await page.evaluate(t => window.render(t), t);
  const name = times ? `p_${t.toFixed(2)}.jpg` : `f_${String(i).padStart(4, '0')}.jpg`;
  await page.screenshot({ path: `${outDir}/${name}`, type: 'jpeg', quality: 92 });
  i++;
}
await browser.close();
