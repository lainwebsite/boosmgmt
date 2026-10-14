# Omodeo — scroll jiggle audit (all pages)

Static audit only (code + styles). webflow.io is not reachable from the session, so no page was scrolled in a browser.

## Causes found (shared across all pages)
1. Hero (`.hp-hero-container-new`, `.sticky-content-new`, `.image-wrapp-hero` is `position: fixed`, `.hp-hero-content-new`) used `100vh` / `200vh`. On phones and tablets `vh` is the largest viewport, so the hero resizes/shifts as the URL bar collapses. Fixed: `svh` at medium and small (applies to Home, About, Portfolio heroes, they share the classes).
2. Reveal pin (`.ow-stage .ow-stage-screen`) used `100dvh` at <=991px. `dvh` changes while the URL bar moves, so the pinned screen resized mid-scroll. Fixed: `100svh` (script ScrollStability 1.0.0, header).
3. Site resize handler calls `ScrollTrigger.refresh()` on every resize. Mobile URL-bar show/hide fires `resize` (height only), so the reveal timeline was recalculated while scrolling. Fixed: ScrollStability 1.0.0 stops height-only resize events (capture phase, registered first in the header). Width changes still pass.

## Checked, left as is
- Nav hide on scroll (<=767px): rAF throttled, 12px / 10px thresholds.
- CTA mobile parallax: GSAP scrub 0.35, transform only.
- Lenis: touch devices use native scroll (`smoothTouch: false`).
- Desktop `.ow-stage-screen` already used `svh`.

## Not verified / possible remaining
- Webflow IX2 `parrallex-anim` images (margin-top -8rem, height 125%) on the other pages: no JS in the page code, behaviour only visible in a browser.
- Project Detail page styles were not inspected in this pass.
