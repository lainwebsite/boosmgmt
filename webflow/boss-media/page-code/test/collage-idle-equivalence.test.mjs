// Old vs perf-patched footer: at every scroll position the collage must
// look exactly the same (card transforms, opacity, visibility, shadow,
// filter, hero CSS vars), including after leaving the section and coming
// back. Also reports JS time / layouts per 3s while the page sits still.
// Run: LIBS=<dir with npm-packed libs> node collage-idle-equivalence.test.mjs old.html new.html
import { createRequire } from 'module';
import { readFileSync } from 'fs';
import { join } from 'path';
const require = createRequire(import.meta.url);
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const L = process.env.LIBS;
const [oldFile, newFile] = process.argv.slice(2);

const map = [
  [/cdnjs.*gsap\/3\.12\.2\/gsap\.min\.js/, 'gsap_3.12.2/package/dist/gsap.min.js'],
  [/cdnjs.*gsap\/3\.12\.2\/ScrollTrigger\.min\.js/, 'gsap_3.12.2/package/dist/ScrollTrigger.min.js'],
  [/npm\/gsap@3\.15\/dist\/ScrambleTextPlugin\.min\.js/, 'gsap_3.15/package/dist/ScrambleTextPlugin.min.js'],
  [/npm\/gsap@3\.15\/dist\/SplitText\.min\.js/, 'gsap_3.15/package/dist/SplitText.min.js'],
  [/lenis@1\.0\.34/, '_studio-freight_lenis_1.0.34/package/dist/lenis.min.js'],
  [/three@0\.128\.0\/build/, 'three_0.128.0/package/build/three.min.js'],
  [/CSS3DRenderer/, 'three_0.128.0/package/examples/js/renderers/CSS3DRenderer.js'],
  [/unpkg\.com\/split-type/, 'split-type/package/umd/index.min.js'],
];

const body = `<!doctype html><html><head><style>
  body { margin: 0; }
  .hero-media-conatiner { height: 100vh; position: relative; }
  #boss-collage { height: 500vh; }
  #container { position: sticky; top: 0; height: 100vh; overflow: hidden; }
  .the-silent-section { height: 100vh; }
  .after { height: 400vh; }
</style></head><body>
  <div class="hero-media-conatiner"><div class="hero-media-content"><h1>hero</h1></div></div>
  <section class="section-boss-logo"><div id="boss-collage"><div id="container"></div></div></section>
  <section class="the-silent-section">next</section>
  <div class="after"></div>
</body></html>`;

const snap = () => {
  const cards = [...document.querySelectorAll('#container *')].filter((e) => e.style && (e.style.transform || e.style.opacity || e.style.boxShadow || e.style.filter));
  return JSON.stringify({
    n: cards.length,
    cards: cards.map((e) => [e.style.transform, e.style.opacity, e.style.visibility, e.style.boxShadow, e.style.filter]),
    vars: [document.documentElement.style.getPropertyValue('--boss-hero-heading-w'), document.documentElement.style.getPropertyValue('--boss-hero-opacity')],
  });
};

const run = async (file) => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  p.on('pageerror', (e) => errors.push(e.message));
  await p.route('**/*', (route) => {
    const url = route.request().url();
    if (url === 'https://test.local/') return route.fulfill({ status: 200, contentType: 'text/html', body: body.replace('</body>', readFileSync(file, 'utf8') + '</body>') });
    const hit = map.find(([re]) => re.test(url));
    if (!hit) return route.fulfill({ status: 404, body: '' });
    route.fulfill({ status: 200, contentType: 'application/javascript', body: readFileSync(join(L, hit[1]), 'utf8') });
  });
  await p.addInitScript(() => {
    /* collage layout uses Math.random: same seed for both runs */
    let seed = 12345;
    Math.random = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
    window.$ = window.jQuery = () => ({ on() {}, each() {}, find() { return this; } });
  });
  await p.goto('https://test.local/');
  await p.waitForTimeout(1500);
  const H = await p.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  const positions = [0, 300, 900, 1500, 2400, 3300, 4200, 5000, H, 2400, 0];
  const out = [];
  for (const y of positions) {
    await p.evaluate((y) => window.scrollTo(0, y), y);
    await p.waitForTimeout(2500);
    out.push(await p.evaluate(snap));
  }
  const cdp = await p.context().newCDPSession(p);
  await cdp.send('Performance.enable');
  const metrics = async () => Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map((m) => [m.name, m.value]));
  /* JS time + forced layouts per 3s, page sitting still */
  const cost = {};
  for (const [name, y] of [['idle in collage', 2400], ['idle below collage', H]]) {
    await p.evaluate((y) => window.scrollTo(0, y), y);
    await p.waitForTimeout(2500);
    const m0 = await metrics();
    await p.waitForTimeout(3000);
    const m1 = await metrics();
    cost[name] = { scriptMs: Math.round((m1.ScriptDuration - m0.ScriptDuration) * 1000), layouts: m1.LayoutCount - m0.LayoutCount };
  }
  await b.close();
  return { out, errors, cost, positions };
};

/* Numbers may differ by < 0.01 (px / unitless): the patched loop stops
   redrawing once the mouse-parallax ease-out moves less than 1e-4 per
   step, the old loop kept chasing that invisible tail forever. */
const close = (x, y) => {
  if (x === y) return true;
  const nx = x.match(/-?\d+(\.\d+)?(e-?\d+)?/g) || [];
  const ny = y.match(/-?\d+(\.\d+)?(e-?\d+)?/g) || [];
  if (nx.length !== ny.length) return false;
  if (x.replace(/-?\d+(\.\d+)?(e-?\d+)?/g, '#') !== y.replace(/-?\d+(\.\d+)?(e-?\d+)?/g, '#')) return false;
  return nx.every((v, i) => Math.abs(+v - +ny[i]) < 0.01);
};

const a = await run(oldFile);
const c = await run(newFile);
let ok = true;
a.positions.forEach((y, i) => {
  const same = close(a.out[i], c.out[i]);
  const n = JSON.parse(a.out[i]).n;
  console.log(`y=${y}: cards=${n} ${same ? 'same' : 'DIFF'}`);
  if (!same || !n) ok = false;
  if (!same) {
    const A = JSON.parse(a.out[i]), C = JSON.parse(c.out[i]);
    if (JSON.stringify(A.vars) !== JSON.stringify(C.vars)) console.log('  vars', A.vars, C.vars);
    const k = A.cards.findIndex((x, j) => JSON.stringify(x) !== JSON.stringify(C.cards[j]));
    if (k >= 0) console.log('  card', k, A.cards[k], C.cards[k]);
  }
});
console.log('errors old', a.errors, 'new', c.errors);
console.log('per 3s idle  old', JSON.stringify(a.cost));
console.log('per 3s idle  new', JSON.stringify(c.cost));
if (c.errors.length) ok = false;
console.log(ok ? 'PASS' : 'FAIL');
process.exit(ok ? 0 : 1);
