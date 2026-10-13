// Card motion right after the hero fade ends, old vs new footer.
// Run: LIBS=<npm-packed libs> node logo-start-after-hero.test.mjs old.html new.html
import { createRequire } from 'module';
import { readFileSync } from 'fs';
import { join } from 'path';
const require = createRequire(import.meta.url);
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const L = process.env.LIBS;
const map = [[/gsap\/3\.12\.2\/gsap/, 'gsap_3.12.2/package/dist/gsap.min.js'],[/ScrollTrigger\.min/, 'gsap_3.12.2/package/dist/ScrollTrigger.min.js'],[/SplitText/, 'gsap_3.15/package/dist/SplitText.min.js'],[/ScrambleText/, 'gsap_3.15/package/dist/ScrambleTextPlugin.min.js'],[/lenis@1\.0\.34/, '_studio-freight_lenis_1.0.34/package/dist/lenis.min.js'],[/three@0\.128\.0\/build/, 'three_0.128.0/package/build/three.min.js'],[/CSS3DRenderer/, 'three_0.128.0/package/examples/js/renderers/CSS3DRenderer.js'],[/split-type/, 'split-type/package/umd/index.min.js']];
const body = `<!doctype html><html><head><style>body{margin:0}.hero-media-conatiner{height:200vh;position:relative;z-index:2}.hero-media-content{position:sticky;top:0;height:100vh;background:#333;opacity:var(--boss-hero-opacity,1)}.section-boss-logo{margin-top:-100vh}#boss-collage{height:600vh}#container{position:sticky;top:0;height:100vh;overflow:hidden}.the-silent-section{height:100vh}</style></head><body><div class="hero-media-conatiner"><div class="hero-media-content"></div></div><section class="section-boss-logo"><div id="boss-collage"><div id="container"></div></div></section><section class="the-silent-section"></section></body></html>`;
const run = async (file, w, h) => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: w, height: h } });
  await p.route('**/*', (r) => { const u = r.request().url(); if (u === 'https://t.local/') return r.fulfill({ status: 200, contentType: 'text/html', body: body.replace('</body>', readFileSync(file, 'utf8') + '</body>') }); const hh = map.find(([re]) => re.test(u)); if (!hh) return r.fulfill({ status: 404, body: '' }); r.fulfill({ status: 200, contentType: 'application/javascript', body: readFileSync(join(L, hh[1]), 'utf8') }); });
  await p.addInitScript(() => { let s = 7; Math.random = () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646; window.$ = () => ({ each() {} }); });
  await p.goto('https://t.local/'); await p.waitForTimeout(1000);
  const st = async (y) => { await p.evaluate((y) => scrollTo(0, y), y); await p.waitForTimeout(2200); return p.evaluate(() => ({ p: scrollPSmooth, hero: getComputedStyle(document.documentElement).getPropertyValue('--boss-hero-opacity'), c: [...document.querySelectorAll('#container .element')].map((e) => { const r = e.getBoundingClientRect(); return [r.x, r.y]; }) })); };
  // find fade end: first y where hero opacity hits 0
  let fadeEnd = 0; for (let y = 0; y < 4000; y += 10) { await p.evaluate((y) => scrollTo(0, y), y); await p.waitForTimeout(30); const o = await p.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--boss-hero-opacity').trim()); if (o === '0') { fadeEnd = y; break; } }
  const base = await st(fadeEnd);
  const out = { fadeEnd };
  for (const dy of [60, 120, 200, 300, 400, 600]) { const s = await st(fadeEnd + dy); const d = s.c.map((x, i) => Math.hypot(x[0] - base.c[i][0], x[1] - base.c[i][1])).sort((a, b) => a - b); out['+' + dy] = `p=${s.p.toFixed(3)} median ${d[75].toFixed(1)}px p90 ${d[135].toFixed(1)}px`; }
  const H = await p.evaluate(() => document.querySelector(".the-silent-section").getBoundingClientRect().top + scrollY - innerHeight * 0.15);
  const end = await st(H); const end2 = await st(H - 300); out.endMinus300 = end2.p.toFixed(3);
  out.end = end.p.toFixed(3);
  await b.close(); return out;
};
for (const [w, h] of [[1440, 900]]) for (const f of process.argv.slice(2)) console.log(w, f, JSON.stringify(await run(f, w, h), null, 0));
