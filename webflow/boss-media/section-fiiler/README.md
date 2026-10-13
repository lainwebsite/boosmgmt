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

### 4. Mobile: reveal jumped in half-way after the cards
On tablet/mobile `.section-fiiler` overlaps the who-we-work track (`margin-top: -250vw` on tiny, `-190vw` on medium). The cards scroll sideways and stay on screen until that track ends, so `.track-filler` has already passed the top when they leave.

The old start point was `min(exit scroll, track top)`, which picked the earlier track top. The reveal therefore began about 700px "late", roughly half-way (0.30 progress measured at 390px wide).

Changes:
- The start is now the scroll position where the cards actually left, stored relative to the track top (`startOffset`) so late layout shifts move it with the track.
- If the page is loaded deep, with the cards never seen, it falls back to the old track-top rule.
- A resize only re-reads the start point when the width changes. The iOS toolbar changes only the height and used to reset it.

Desktop is unchanged: there the cards leave before the track top, which gives the same start point as before.

### 5. Safari: filler video not loading (2026-10-13)
The patch was applied on top of the owner's live version, which had been edited in Webflow since the last repo copy. That version is kept as `code-embed-11.live-2026-10-13.html`; `code-embed-11.html` is now live plus the patch below.

Likely causes, found by reading the code. Safari could not be tested here because this container has no WebKit.
1. **WebM first on desktop Safari.** MP4 came first only for iOS, so desktop Safari loaded the WebM (VP9). VP9 into a WebGL texture is unreliable in Safari and can fail without an `error` event.
2. **Readiness waited only on `requestVideoFrameCallback`.** The video element is never added to the DOM, and Safari may not fire that callback for it. The video then never counted as ready and the poster stayed up.
3. **No stall timeout.** A source that neither played nor errored was never replaced.
4. **The MP4 was 11.2 MB** (11 Mbps, plus an unused AAC audio track).

Fixes:
- **Format order:** desktop Safari now gets MP4 first, same as iOS (`isSafari` UA check).
- **Readiness:** a requestAnimationFrame poll (`readyState >= 2` and real video size) now always runs alongside `requestVideoFrameCallback`.
- **Stall timeout:** after 8 s without a confirmed frame, the next format is tried.
- **New MP4:** asset `6acda03c6c75e634ffda5201_Boss-Filler-1080.mp4`, 2.7 MB, H.264 Main, 1080p30, no audio, faststart, SSIM 0.9956 against the original. CORS `*` was checked. The old asset is kept.
