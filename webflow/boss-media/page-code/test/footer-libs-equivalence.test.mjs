// Old vs deduplicated page footer: the libraries the page actually runs on
// must be identical. CDN URLs are served from npm packages (LIBS dir).
// Run: LIBS=<dir with npm-packed libs> node footer-libs-equivalence.test.mjs old.html new.html
import { createRequire } from 'module';
import { readFileSync } from 'fs';
import { join } from 'path';
const require = createRequire(import.meta.url);
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const L = process.env.LIBS;
const [oldFile, newFile] = process.argv.slice(2);

const map = [
  [/cdnjs.*gsap\/3\.13\.0\/gsap\.min\.js/, 'gsap_3.13.0/package/dist/gsap.min.js', 'gsap-3.13.0'],
  [/cdnjs.*gsap\/3\.12\.2\/gsap\.min\.js/, 'gsap_3.12.2/package/dist/gsap.min.js', 'gsap-3.12.2'],
  [/cdnjs.*gsap\/3\.12\.2\/ScrollTrigger\.min\.js/, 'gsap_3.12.2/package/dist/ScrollTrigger.min.js', 'ST-3.12.2'],
  [/npm\/gsap@3\/dist\/gsap\.min\.js/, 'gsap_3/package/dist/gsap.min.js', 'gsap-3.x'],
  [/npm\/gsap@3\/dist\/ScrollTrigger\.min\.js/, 'gsap_3/package/dist/ScrollTrigger.min.js', 'ST-3.x'],
  [/npm\/gsap@3\.15\/dist\/gsap\.min\.js/, 'gsap_3.15/package/dist/gsap.min.js', 'gsap-3.15'],
  [/npm\/gsap@3\.15\/dist\/ScrambleTextPlugin\.min\.js/, 'gsap_3.15/package/dist/ScrambleTextPlugin.min.js', 'Scramble-3.15'],
  [/npm\/gsap@3\.15\/dist\/SplitText\.min\.js/, 'gsap_3.15/package/dist/SplitText.min.js', 'SplitText-3.15'],
  [/react@18\/umd/, 'react_18/package/umd/react.production.min.js', 'react'],
  [/react-dom@18\/umd/, 'react-dom_18/package/umd/react-dom.production.min.js', 'react-dom'],
  [/lenis@1\.0\.33/, '_studio-freight_lenis_1.0.33/package/dist/lenis.min.js', 'lenis-1.0.33'],
  [/lenis@1\.0\.34/, '_studio-freight_lenis_1.0.34/package/dist/lenis.min.js', 'lenis-1.0.34'],
  [/three@0\.128\.0\/build/, 'three_0.128.0/package/build/three.min.js', 'three'],
  [/CSS3DRenderer/, 'three_0.128.0/package/examples/js/renderers/CSS3DRenderer.js', 'css3d'],
  [/unpkg\.com\/split-type/, 'split-type/package/umd/index.min.js', 'split-type'],
];

const probe = `<script>
  window.__probe = () => {
    const g = window.gsap;
    const globals = g && g.core && g.core.globals ? Object.keys(g.core.globals()) : [];
    return {
      gsap: g && g.version,
      ST: window.ScrollTrigger && window.ScrollTrigger.version,
      STsameCore: !!(g && window.ScrollTrigger && g.core.globals().ScrollTrigger === window.ScrollTrigger),
      registered: ['ScrollTrigger', 'SplitText', 'ScrambleTextPlugin'].filter((k) => globals.includes(k)),
      lenis: window.Lenis && window.__lenisTag,
      splitText: typeof window.SplitText, scramble: typeof window.ScrambleTextPlugin,
      react: typeof window.React, three: window.THREE && window.THREE.REVISION, css3d: typeof (window.THREE && window.THREE.CSS3DRenderer),
      loaded: window.__libs,
    };
  };
</script>`;

const run = async (file) => {
  const b = await chromium.launch();
  const p = await b.newPage();
  const errors = [];
  p.on('pageerror', (e) => errors.push(e.message));
  await p.route(/^https:\/\/(cdnjs|cdn\.jsdelivr|unpkg)/, (route) => {
    const url = route.request().url();
    const hit = map.find(([re]) => re.test(url));
    if (!hit) return route.fulfill({ status: 404, body: '' });
    let body = readFileSync(join(L, hit[1]), 'utf8');
    body += `\n;window.__libs=(window.__libs||[]).concat(${JSON.stringify(hit[2])});` +
      (hit[2].startsWith('lenis') ? `window.__lenisTag=${JSON.stringify(hit[2])};` : '');
    route.fulfill({ status: 200, contentType: 'application/javascript', body });
  });
  await p.route('https://test.local/', (route) => route.fulfill({
    status: 200, contentType: 'text/html',
    body: `<!doctype html><html><head><script>window.Webflow=[];</script></head><body><div style="height:3000px"></div>${probe}${readFileSync(file, 'utf8')}
      <script>document.addEventListener('DOMContentLoaded',()=>{const q=window.Webflow;window.Webflow={push:(f)=>f()};q.forEach((f)=>{try{f()}catch(e){}});});</script></body></html>`,
  }));
  await p.goto('https://test.local/');
  await p.waitForTimeout(1500);
  await p.mouse.wheel(0, 800);
  await p.waitForTimeout(800);
  const r = await p.evaluate(() => ({ ...window.__probe(), scrollY: Math.round(window.scrollY) }));
  await b.close();
  return { ...r, errors: [...new Set(errors)] };
};

const a = await run(oldFile);
const n = await run(newFile);
console.log('OLD', JSON.stringify(a, null, 1));
console.log('NEW', JSON.stringify(n, null, 1));
const keys = ['gsap', 'ST', 'STsameCore', 'registered', 'lenis', 'splitText', 'scramble', 'three', 'css3d', 'scrollY'];
const diff = keys.filter((k) => JSON.stringify(a[k]) !== JSON.stringify(n[k]));
const newErr = n.errors.filter((e) => !a.errors.includes(e));
console.log('differences:', diff.length ? diff : 'none', '| new errors:', newErr.length ? newErr : 'none');
process.exit(diff.length || newErr.length ? 1 : 0);
