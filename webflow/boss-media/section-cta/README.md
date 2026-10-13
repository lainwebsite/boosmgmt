# BOSS | Media — `.section-cta` 3D logo (Code Embed 9)

Embed element `f13cec74-4711-20d9-b2e1-6584afb7ad2f`, renders into `#boss-logo`.

- `code-embed-9.original.html` — before the fix (rollback copy).
- `code-embed-9.html` — live in the Designer.

## Why the logo never showed on publish
1. The embed was set to hidden (`visibility: false`), so Webflow left it out of the
   published HTML. Now visible.
2. It shipped its own `<script type="importmap">` ("three" -> jsdelivr three@0.185.0,
   "three/addons/"). Code Embed 11 in `.section-fiiler` is earlier in the page and has
   its own import map ("three" -> esm.sh three@0.174.0). A page only honours the first
   map (newer Chrome merges, first entry wins), so `three/addons/...` never resolved or
   "three" pointed at the wrong build. The import map is removed and the module imports
   full URLs: `https://esm.sh/three@0.185.0` and
   `https://esm.sh/three@0.185.0/examples/jsm/loaders/SVGLoader.js`.

## Logo size +15% (2026-10-13)
The page head CSS sizes the logo with `#boss-logo.canvas.media`: it was `width: 100%` and `max-width: 45em`, and is now `width: 115%` and `max-width: 52em`. The camera fit in Code Embed 9 follows the container size, so the logo scales with it. The box stays centered because it is absolutely positioned inside the flex `cta-content-media-in-wrapp`.

Correction (same day): widening the box alone did nothing. The Designer class also sets `height` (35em base, 45em tiny), and the camera fits the smaller side. On mobile, em is only a few px, so the 52em cap was about 150 to 200px. The box is now a square forced in the page head:
- desktop and tablet: 40em x 40em (about +15% over the effective 35em);
- 767px and below: 80vw x 80vw.
