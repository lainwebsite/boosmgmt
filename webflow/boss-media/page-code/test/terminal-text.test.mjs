// Code Embed 10 (terminal text), old vs perf-patched: every .terminal-text
// must stay hidden until scrolled into view, then type out to its original
// text; a data-terminal-repeat one must reset after leaving and replay.
// Run: LIBS=<dir with npm-packed libs> node terminal-text.test.mjs old.html new.html
import { createRequire } from 'module';
import { readFileSync } from 'fs';
import { join } from 'path';
const require = createRequire(import.meta.url);
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const L = process.env.LIBS;
const [oldFile, newFile] = process.argv.slice(2);

const page = (embed) => `<!doctype html><html><head><style>body{margin:0}.gap{height:150vh}</style></head><body>
  <p class="terminal-text" id="t0">Visible at load</p>
  <div class="gap"></div>
  <p class="terminal-text" id="t1">Second <strong>block</strong> text</p>
  <div class="gap"></div>
  <p class="terminal-text" id="t2" data-terminal-repeat="true">Repeats each time</p>
  <div class="gap"></div>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
  <script>window.Webflow = { push: (f) => document.readyState === 'loading' ? addEventListener('DOMContentLoaded', f) : f() };</script>
  ${embed}
</body></html>`;

const state = () => ['t0', 't1', 't2'].map((id) => {
  const el = document.getElementById(id);
  const chars = [...el.querySelectorAll('.terminal-char')];
  return { text: chars.map((c) => c.textContent).join(''), shown: chars.every((c) => c.style.opacity === '1'), hidden: chars.every((c) => c.style.opacity === '0') };
});

const run = async (file) => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1200, height: 800 } });
  const errors = [];
  p.on('pageerror', (e) => errors.push(e.message));
  await p.route('**/*', (route) => {
    const url = route.request().url();
    if (url === 'https://test.local/') return route.fulfill({ status: 200, contentType: 'text/html', body: page(readFileSync(file, 'utf8')) });
    if (/gsap\.min\.js/.test(url)) return route.fulfill({ status: 200, contentType: 'application/javascript', body: readFileSync(join(L, 'gsap_3.12.2/package/dist/gsap.min.js'), 'utf8') });
    route.fulfill({ status: 404, body: '' });
  });
  await p.goto('https://test.local/');
  const steps = [];
  const at = async (y, label) => {
    await p.evaluate((y) => scrollTo(0, y), y);
    await p.waitForTimeout(1500);
    const s = await p.evaluate(state);
    steps.push([label, s.map((x) => (x.shown ? x.text : x.hidden ? '(hidden)' : '(mid)'))]);
  };
  await at(0, 'top');
  await at(1250, 't1 in view');
  await at(2500, 't2 in view');
  await at(0, 'back to top');
  await at(2500, 't2 again');
  await b.close();
  return { steps, errors };
};

const a = await run(oldFile);
const c = await run(newFile);
const same = JSON.stringify(a.steps) === JSON.stringify(c.steps);
c.steps.forEach(([l, s]) => console.log(l.padEnd(12), s.join(' | ')));
console.log('errors old', a.errors, 'new', c.errors);
if (!same) console.log('OLD', JSON.stringify(a.steps));
const ok = same && !c.errors.length && c.steps[0][1][0] === 'Visibleatload' && c.steps[1][1][1] === 'Secondblocktext' && c.steps[3][1][2] === '(hidden)' && c.steps[4][1][2] === 'Repeatseachtime';
console.log(ok ? 'PASS' : 'FAIL');
process.exit(ok ? 0 : 1);
