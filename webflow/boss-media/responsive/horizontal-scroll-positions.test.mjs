import { createRequire } from 'module';
const require = createRequire('/opt/node22/lib/node_modules/');
const { chromium } = require('playwright');
const html = (outerX, innerX, cardX, w) => `<!doctype html><html><head><meta name="viewport" content="width=device-width"><style>
body{margin:0;overflow-x:hidden}
.pad{padding:0 1.5rem}
.S{display:flex;width:100vw;transform:translateX(${outerX}%)}
.N{width:max-content;padding-right:10vw;transform:translateX(${innerX}%)}
.T{display:flex;width:max-content;column-gap:2em}
.card{width:20rem;flex-shrink:0;height:50px;background:#000}
.CW{display:flex;flex-direction:column;align-items:flex-start;width:100%}
.CC{display:flex;column-gap:2em;width:100vw;padding-left:2em;box-sizing:border-box;transform:translateX(${outerX}%)}
.nc{transform:translateX(${cardX}%)} .cm{width:${w}em;height:40px;background:#333}
</style></head><body>
<div class="pad"><div class="S"><div class="N"><div class="T">${'<div class="card"></div>'.repeat(4)}</div></div></div></div>
<div class="CW"><div class="CC">${'<div class="nc"><div class="cm"></div></div>'.repeat(5)}</div></div></body></html>`;
const b = await chromium.launch();
for (const [vw, w, pct] of [[390, 50, -524], [700, 35, -534.29], [900, 35, -534.29]]) {
  const p = await b.newPage({ viewport: { width: vw, height: 800 } });
  for (const t of [0, 1]) {
    await p.setContent(html(t*100, t*-100, t*pct, w));
    const r = await p.evaluate(() => {
      const c = [...document.querySelectorAll('.card')].map(e => e.getBoundingClientRect());
      const m = [...document.querySelectorAll('.cm')].map(e => e.getBoundingClientRect());
      return { who: c.map(r => [Math.round(r.left), Math.round(r.right)]), cards: m.map(r => [Math.round(r.left), Math.round(r.right)]) };
    });
    console.log(`vw=${vw} progress=${t}`, 'who last:', r.who.at(-1), 'who first:', r.who[0], '| card last:', r.cards.at(-1), 'card first:', r.cards[0]);
  }
}
await b.close();
