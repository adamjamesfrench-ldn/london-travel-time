/**
 * Take README screenshots using Playwright.
 * Run: npx playwright install chromium && npx tsx scripts/take-screenshots.ts
 */
import { chromium } from 'playwright';
import { resolve } from 'path';

const DOCS_DIR = resolve(__dirname, '..', 'docs');
const BASE_URL = 'http://localhost:3000';

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1400, height: 860 },
  });
  const page = await context.newPage();

  // ── Screenshot 1: Dark mode with multi-mode isochrones ──
  console.log('Loading app...');
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await sleep(2000);

  // Search for Liverpool Street
  console.log('Searching Liverpool Street...');
  await page.fill('input[type="text"]', 'Liverpool Street Station');
  await sleep(1500);

  // Select first suggestion
  const firstSuggestion = page.locator('.absolute.z-50 button').first();
  await firstSuggestion.click();
  await sleep(6000); // Wait for isochrones

  // Enable Walking and Cycling
  console.log('Enabling more modes...');
  const walkingBtn = page.locator('button', { hasText: 'Walking' });
  const cyclingBtn = page.locator('button', { hasText: 'Cycling' });
  await walkingBtn.click();
  await sleep(500);
  await cyclingBtn.click();
  await sleep(6000); // Wait for isochrones

  console.log('Taking dark mode screenshot...');
  await page.screenshot({ path: resolve(DOCS_DIR, 'screenshot-dark.png') });

  // Scroll down to show stats
  console.log('Scrolling to stats...');
  await page.evaluate(() => {
    const scrollable = document.querySelector('.overflow-y-auto');
    if (scrollable) scrollable.scrollTop = scrollable.scrollHeight;
  });
  await sleep(1000);
  await page.screenshot({ path: resolve(DOCS_DIR, 'screenshot-stats.png') });

  // ── Screenshot 2: Light mode ──
  console.log('Switching to light mode...');
  // Scroll back up first
  await page.evaluate(() => {
    const scrollable = document.querySelector('.overflow-y-auto');
    if (scrollable) scrollable.scrollTop = 0;
  });
  await sleep(500);

  const themeBtn = page.locator('button[title*="Switch to"]');
  await themeBtn.click();
  await sleep(3000); // Wait for map style to load

  console.log('Taking light mode screenshot...');
  await page.screenshot({ path: resolve(DOCS_DIR, 'screenshot-light.png') });

  await browser.close();
  console.log('Done! Screenshots saved to docs/');
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
