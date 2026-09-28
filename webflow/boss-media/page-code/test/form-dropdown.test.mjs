// Run: node form-dropdown.test.mjs (Playwright + Chromium from the container)
import { createRequire } from 'module';
import { readFileSync } from 'fs';
const require = createRequire(import.meta.url);
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const src = readFileSync(new URL('../bossformdropdown-1.0.0.min.js', import.meta.url), 'utf8');

const dd = (label, items) => `
<div class="dropdown w-dropdown">
  <div class="dropdown-toggle w-dropdown-toggle"><div class="icon w-icon-dropdown-toggle"></div><div class="un-uppercase">${label}</div></div>
  <nav class="dropdown-list w-dropdown-list">${items.map((t) => `<a href="#" class="drop-menu w-dropdown-link">${t}</a>`).join('')}</nav>
</div>`;

const html = `<form id="email-form">
  <input name="Name" value="x">
  ${dd('What are you looking to achieve?', ['Brand awareness', 'Product launch'])}
  ${dd('Budget range', ['Under $10K', '$500K+'])}
</form>
<script>
  // Stand-in for webflow.js dropdown toggling
  document.querySelectorAll('.w-dropdown-toggle').forEach((t) => t.addEventListener('click', () => {
    t.classList.toggle('w--open'); t.nextElementSibling.classList.toggle('w--open');
  }));
</script>
<script>${src}</script>
<script>window.Webflow.forEach((f) => f());</script>`;

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent(html);
const toggles = page.locator('.w-dropdown-toggle');
await toggles.nth(0).click();
await page.getByText('Product launch').click();
await toggles.nth(1).click();
await page.getByText('$500K+').click();
const r = await page.evaluate(() => ({
  labels: [...document.querySelectorAll('.w-dropdown-toggle .un-uppercase')].map((e) => e.textContent),
  open: document.querySelectorAll('.w--open').length,
  data: Object.fromEntries(new FormData(document.querySelector('#email-form'))),
  hash: location.hash,
}));
console.log(JSON.stringify(r));
const ok = r.labels[0] === 'Product launch' && r.labels[1] === '$500K+' && r.open === 0 &&
  r.data.Goal === 'Product launch' && r.data['Budget Range'] === '$500K+' && r.hash === '';
console.log(ok ? 'PASS' : 'FAIL');
await browser.close();
process.exit(ok ? 0 : 1);
