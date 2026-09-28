// card-section on tablet/mobile: .card-content (100vw) xPercent 0 -> 100 and
// .card-track (max-content) xPercent 0 -> -100. The last card must end 2em from
// the right edge for any card count / size. Run: node card-track-positions.test.mjs
import { createRequire } from 'module';
const require = createRequire('/opt/node22/lib/node_modules/');
const { chromium } = require('playwright');
const html = (t, n, w, fs) => `<!doctype html><style>*{box-sizing:border-box}body{margin:0;overflow-x:hidden;font-size:${fs}px}
.cc{display:flex;column-gap:2em;width:100vw;padding-left:2em;transform:translateX(${t * 100}%)}
.ct{display:flex;width:max-content;flex-shrink:0;column-gap:2em;padding-right:4em;transform:translateX(${t * -100}%)}
.cm{width:${w}em;height:40px;background:#333}</style>
<div class="cc"><div class="ct">${'<div class="nc"><div class="cm"></div></div>'.repeat(n)}</div></div>`;
const b = await chromium.launch();
let ok = true;
for (const [vw, w, fs] of [[390, 50, 3.9], [390, 50, 16], [700, 35, 8], [900, 35, 10]]) {
  for (const n of [3, 4, 5]) {
    const p = await b.newPage({ viewport: { width: vw, height: 700 } });
    const at = async (t) => { await p.setContent(html(t, n, w, fs)); return p.$$eval('.cm', (e) => e.map((x) => x.getBoundingClientRect()).map((r) => [Math.round(r.left), Math.round(r.right)])); };
    const s = await at(0), e = await at(1);
    const want = vw - 2 * fs;
    const pass = Math.abs(e.at(-1)[1] - want) <= 1 && Math.abs(s[0][0] - 2 * fs) <= 1;
    ok &&= pass;
    console.log(`vw=${vw} em=${fs} cards=${n}: first start ${s[0][0]} | last end ${e.at(-1)[1]} (want ${Math.round(want)}) ${pass ? 'OK' : 'FAIL'}`);
    await p.close();
  }
}
await b.close();
process.exit(ok ? 0 : 1);
