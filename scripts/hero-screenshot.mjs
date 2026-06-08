import { chromium } from 'playwright';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const BASE_URL = process.env.E2E_BASE_URL || 'http://localhost:5175';
const OUT = resolve(ROOT, 'scripts', 'hero-screenshots');

const viewports = [
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'desktop-1440', width: 1440, height: 900 },
];

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

for (const vp of viewports) {
  await page.setViewportSize({ width: vp.width, height: vp.height });
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  const hero = page.locator('.hero__visual');
  await hero.screenshot({ path: resolve(OUT, `${vp.name}-hero.png`) });
  const overflow = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    innerWidth: window.innerWidth,
  }));
  const box = await page.locator('.hero__image').boundingBox();
  console.log(`${vp.name}: overflow=${overflow.scrollWidth <= overflow.innerWidth + 1}, img=${JSON.stringify(box)}`);
}

await browser.close();