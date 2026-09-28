// Run: node form-dropdown.test.mjs [min-file]  (Playwright + Chromium from the container)
// Reproduces the iPhone case: the dropdown list closes (pointer-events: none)
// on touchstart, before the tap's click arrives.
import { createRequire } from 'module';
import { readFileSync } from 'fs';
const require = createRequire(import.meta.url);
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const file = process.argv[2] || 'bossformdropdown-1.1.0.min.js';
const src = readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');

const dd = (label, items) => `
<div class="dropdown w-dropdown">
  <div class="dropdown-toggle w-dropdown-toggle"><div class="icon w-icon-dropdown-toggle"></div><div class="un-uppercase">${label}</div></div>
  <nav class="dropdown-list w-dropdown-list">${items.map((t) => `<a href="#" class="drop-menu w-dropdown-link">${t}</a>`).join('')}</nav>
</div>`;

const html = `<style>
  body { margin: 0; font: 16px sans-serif; }
  .dropdown { position: relative; height: 40px; }
  .dropdown-list { position: absolute; top: 40px; left: 0; right: 0; z-index: 5; background: #fff; opacity: 0; pointer-events: none; }
  .dropdown-list.w--open { opacity: 1; pointer-events: auto; }
  .drop-menu { display: block; padding: 10px; }
  input.field { display: block; width: 100%; height: 40px; }
</style>
<form id="email-form">
  ${dd('What are you looking to achieve?', ['Brand awareness', 'Product launch'])}
  <input class="field" id="under1"><input class="field" id="under2">
  ${dd('Budget range', ['Under $10K', '$500K+'])}
  <input class="field" id="under3"><input class="field" id="under4">
</form>
<script>
  // Stand-in for webflow.js: toggle opens/closes, any touch closes the open list
  const setOpen = (t, on) => { t.classList.toggle('w--open', on); t.nextElementSibling.classList.toggle('w--open', on); };
  document.querySelectorAll('.w-dropdown-toggle').forEach((t) => t.addEventListener('click', () => setOpen(t, !t.classList.contains('w--open'))));
  document.addEventListener('touchstart', (e) => {
    if (!e.target.closest('.w-dropdown-toggle')) document.querySelectorAll('.w-dropdown-toggle.w--open').forEach((t) => setOpen(t, false));
  }, true);
</script>
<script>${src}</script>
<script>window.Webflow.forEach((f) => f());</script>`;

const browser = await chromium.launch();
const ctx = await browser.newContext({ hasTouch: true, isMobile: true, viewport: { width: 390, height: 700 } });
const page = await ctx.newPage();
await page.setContent(html);
const tapText = async (t) => { const b = await page.getByText(t, { exact: true }).boundingBox(); await page.touchscreen.tap(b.x + b.width / 2, b.y + b.height / 2); await page.waitForTimeout(700); };
const toggles = page.locator('.w-dropdown-toggle');
await toggles.nth(0).tap(); await page.waitForTimeout(100);
await tapText('Product launch');
await toggles.nth(1).tap(); await page.waitForTimeout(100);
await tapText('$500K+');
const r = await page.evaluate(() => ({
  labels: [...document.querySelectorAll('.w-dropdown-toggle .un-uppercase')].map((e) => e.textContent),
  open: document.querySelectorAll('.w--open').length,
  data: Object.fromEntries(new FormData(document.querySelector('#email-form'))),
  focused: document.activeElement.id || document.activeElement.tagName,
  hash: location.hash,
}));
console.log(file, JSON.stringify(r));
const ok = r.labels[0] === 'Product launch' && r.labels[1] === '$500K+' && r.open === 0 &&
  r.data.Goal === 'Product launch' && r.data['Budget Range'] === '$500K+' && r.hash === '' && !/^under/.test(r.focused);
console.log(ok ? 'PASS' : 'FAIL');
await browser.close();
process.exit(ok ? 0 : 1);
