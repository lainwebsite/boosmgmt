# BOSS | Media — `.section-fiiler` (Code Embed 11)

Source of the Code Embed inside `.section-fiiler` on `/boss-media`
(site `bossmgmtgrp`, page `6944d3eee725483c24fbd899`, embed element `8aefcf21-4f44-6497-535a-c3d66cbcc129`).

- `code-embed-11.original.html` — code as it was before the fix (rollback copy).
- `code-embed-11.html` — code currently live in the Designer.

## Fix history

### 1. Reveal started before `.filler-media` was sticky
ScrollTrigger used `start: 'top bottom'`, so progress began as soon as `.track-filler`
entered the viewport. Changed to `start: 'top top'`.

### 2. Blank white gap between the cards and the reveal
`.section-fiiler` (`margin-top: -270vw`, `z-index: 2`) overlaps the tail of
`.www-scroll-track` (500vw). The IX2 card slide finishes before `.track-filler`
reaches the top, so with fix 1 the screen stayed white until real sticky.

Now the scroll controller runs every frame and:
- detects the moment every `.www-card-item` has left past the viewport
  (off to the right on desktop, above the top on tablet/mobile) after
  `.who-we-work-section` reached the top;
- from that scroll position holds `.filler-media` at `top: 0` with a
  `translate3d` until CSS sticky takes over (visual sticky, no layout change);
- maps reveal progress from that exit point to the sticky end x 0.88.

### 3. Reveal started too late and too slow
- `START_OFFSET_X = 0.5` / `START_OFFSET_Y = 0.35`: reveal starts once every
  card is past the middle of the viewport (right half on desktop, top 35% on
  mobile), overlapping the exit instead of waiting for an empty screen.
- Reveal and hide keep the designed pace (`sticky distance x 0.88`); extra
  scroll between the start and the original end holds the clean video, so the
  hide still lands where it did before.
