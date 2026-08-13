// Regenerates public/icons/*.png from the source SVGs in this folder.
// Requires `npm i -D playwright && npx playwright install chromium` locally
// (not a runtime dependency of the app — this is a one-off build tool).
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';

const targets = [
  { svg: 'scripts/icon-any.svg', out: 'public/icons/icon-192.png', size: 192 },
  { svg: 'scripts/icon-any.svg', out: 'public/icons/icon-512.png', size: 512 },
  { svg: 'scripts/icon-maskable.svg', out: 'public/icons/icon-maskable-512.png', size: 512 },
];

const browser = await chromium.launch();
const page = await browser.newPage();

for (const t of targets) {
  const svg = readFileSync(t.svg, 'utf8');
  await page.setViewportSize({ width: t.size, height: t.size });
  await page.setContent(
    `<html><body style="margin:0"><div style="width:${t.size}px;height:${t.size}px">${svg}</div></body></html>`,
  );
  await page.locator('svg').screenshot({ path: t.out });
  console.log('wrote', t.out);
}

await browser.close();
