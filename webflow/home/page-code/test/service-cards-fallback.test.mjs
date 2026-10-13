import { createRequire } from 'module';
import { readFileSync } from 'fs';
const require = createRequire(import.meta.url);
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const L = process.env.LIBS, file = process.argv[2];
const footer = readFileSync(file, 'utf8');
const script = footer.slice(footer.indexOf('<!-- HERO IMAGE FLYING ANIMATION -->'));
const slide = (n, src) => `<div class="hp_hero_service_item ls-${n}" style="width:11.2em;height:16.4em"><div class="code_embed_services"><video crossorigin="anonymous" src="${src}" muted autoplay loop playsinline style="width:100%;height:100%;object-fit:cover"></video></div></div>`;
const html = `<!doctype html><html><head><style>body{margin:0;font-size:1vw;background:#f3f3f0}#webgl-canvas{position:fixed;inset:0;pointer-events:none}.hp_canvas_img_wrapper{height:300vh}.row{display:flex;gap:.75em}</style></head><body>
<canvas id="webgl-canvas"></canvas><div class="hp_canvas_img_wrapper"></div>
<div class="row">${slide(1,'https://cors.test/a.mp4')}${slide(2,'https://cors.test/b.mp4')}${slide(3,'https://nocors.test/digital.mp4')}${slide(4,'https://cors.test/d.mp4')}</div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
${script}</body></html>`;
const run = async (w, h) => {
  const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--autoplay-policy=no-user-gesture-required'] });
  const p = await b.newPage({ viewport: { width: w, height: h } });
  const errs = []; p.on('pageerror', (e) => errs.push(e.message));
  await p.route('**/*', (r) => {
    const u = r.request().url();
    if (u === 'https://t.local/') return r.fulfill({ status: 200, contentType: 'text/html', body: html });
    if (u.includes('three.min')) return r.fulfill({ status: 200, contentType: 'application/javascript', body: readFileSync(L + '/three_0.128.0/package/build/three.min.js', 'utf8') });
    if (u.includes('gsap.min')) return r.fulfill({ status: 200, contentType: 'application/javascript', body: readFileSync(L + '/gsap_3.12.2/package/dist/gsap.min.js', 'utf8') });
    if (u.includes('ScrollTrigger')) return r.fulfill({ status: 200, contentType: 'application/javascript', body: readFileSync(L + '/gsap_3.12.2/package/dist/ScrollTrigger.min.js', 'utf8') });
    if (u.startsWith('https://cors.test/')) return r.fulfill({ status: 200, contentType: 'video/webm', headers: { 'Access-Control-Allow-Origin': '*' }, body: readFileSync('t.webm') });
    if (u.startsWith('https://nocors.test/')) return r.fulfill({ status: 200, contentType: 'video/webm', headers: { 'Access-Control-Allow-Origin': '*' }, body: readFileSync('t.webm') });
    if (u.includes('webflow-prod-assets')) return r.fulfill({ status: 200, contentType: 'image/png', headers: { 'Access-Control-Allow-Origin': '*' }, body: readFileSync('fallback.png') });
    r.fulfill({ status: 404, body: '' });
  });
  await p.goto('https://t.local/'); await p.waitForTimeout(3000);
  // bounding boxes of drawn pixels per quarter of the canvas width
  const boxes = await p.evaluate(() => {
    const c = document.getElementById('webgl-canvas');
    const g = c.getContext('webgl') || c.getContext('webgl2');
    const W = g.drawingBufferWidth, H = g.drawingBufferHeight;
    const px = new Uint8Array(W * H * 4); g.readPixels(0, 0, W, H, g.RGBA, g.UNSIGNED_BYTE, px);
    const cols = []; // find columns with alpha
    const bb = []; let cur = null;
    for (let x = 0; x < W; x++) { let any = false, y0 = H, y1 = -1; for (let y = 0; y < H; y++) { if (px[(y * W + x) * 4 + 3] > 10) { any = true; y0 = Math.min(y0, y); y1 = Math.max(y1, y); } }
      if (any) { if (!cur) { cur = { x0: x, x1: x, y0, y1 }; bb.push(cur); } else { cur.x1 = x; cur.y0 = Math.min(cur.y0, y0); cur.y1 = Math.max(cur.y1, y1); } } else cur = null; }
    return { W, H, bb: bb.map((r) => { let R=0,G=0,n=0; for (let x=r.x0;x<=r.x1;x+=3) for (let y=r.y0;y<=r.y1;y+=3){const i=(y*W+x)*4; if(px[i+3]>10){R+=px[i];G+=px[i+1];n++;}} return { w: r.x1 - r.x0 + 1, h: r.y1 - r.y0 + 1, x: r.x0, src: (R/n>150 && G/n<80) ? 'video' : 'image' }; }) };
  });
  await b.close(); return { boxes, errs };
};
for (const [w, h] of [[1920, 1080]]) {
  const r = await run(w, h);
  console.log(w + 'x' + h, 'cards', r.boxes.bb.length, r.boxes.bb.map((b) => `${b.src}`).join('  '), r.errs.length ? 'ERR ' + r.errs.join('|') : '');
}
