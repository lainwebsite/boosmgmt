# Home — page-level code

## Service cards ("ONE VISION. / FOUR DIVISIONS.") 2026-10-13
Desktop (>= 991px): the four `.hp_hero_service_item` slides are hidden and their
`<video>` (Code Embeds) are drawn by WebGL ("HERO IMAGE FLYING ANIMATION" in the footer).

- **One card missing.** WebGL can only use a video whose host allows CORS. Liaison /
  Talent / Media come from `friendly-unicorn-7191a6.netlify.app`; Digital came from
  `boss-assets.netlify.app` (likely down or without CORS — this container cannot reach
  Netlify to confirm). A video that errors now falls back to the division image hosted
  on Webflow (S3 sends `Access-Control-Allow-Origin: *`), cropped like object-fit cover.
  Same fallback on tablet/mobile, where the videos are shown directly.
  Real fix: upload the Digital thumbnail video to Webflow Assets and use that URL in the
  Digital slide's Code Embed.
- **Squashed cards when the window gets narrower.** Plane width followed the window
  width, height the window height; only a 16:9 window gave the intended shape.
  `fitFlyingMesh` scales height from width (identical at 16:9), plus a resize handler
  (the canvas never resized before).

Tests (Playwright Chromium + swiftshader, `LIBS=<npm-packed libs>`):
`test/service-cards-shape.test.mjs old new` (card shape at 4 window sizes; Chromium has
no H.264, so all cards show the fallback there) and `test/service-cards-fallback.test.mjs`
(WebM; Digital host dead -> old: 3 cards, new: 4 with the image; all hosts ok -> 4 videos).
Rollback: `page-footer.before-2026-10-13.html`.
