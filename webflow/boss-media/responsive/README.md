# BOSS | Media — responsive (tablet <=991px, mobile <=767 / <=478px)

Desktop (base) styles are never touched; only medium/small/tiny overrides.

## Horizontal-scroll sections back on tablet/mobile
who-we-work and card-section slide via Webflow Interactions (IX2), which were switched
off for tablet/mobile. IX2 cannot be read or toggled through the Webflow MCP, so the owner
re-enables the breakpoints in the Interactions panel. The tablet/mobile style overrides
that flattened these sections were removed so they inherit the desktop scroll layout:

| Class | Breakpoint | Removed / changed |
|---|---|---|
| `www-scroll-track` | medium | `height: auto` removed -> 500vw |
| `who-we-work-sticky` | medium | `position: relative`, `top: auto` removed -> sticky |
| `who-we-work-sticky` | tiny | `top: auto`, `height: auto` removed -> 100vh |
| `www-bottom-content-track-scroll` | medium | `width: 100%` removed -> 300vw |
| `www-card-item` | medium | added `flex-shrink: 0` |
| `all-reach-track-contanier` | medium | `height: auto` removed -> 300vh |
| `all-reach-sticky-content` | medium | `position: relative`, `top: auto` removed -> sticky |
| `track-card-scroll` | medium | `height: auto` removed -> 420vw |
| `card-content-wrapp` | medium | `height: auto` removed -> 100vh |
| `card-content-wrapp` | tiny | `position: relative`, `top: auto` removed -> sticky |

Kept on purpose: section `margin-top: 0` on medium (desktop overlaps don't fit mobile order).
all-reach's big-text slide is GSAP in the page footer and already runs at every width; it
only needed the track height and sticky back.

## IX3 horizontal scroll for tablet/mobile (replaces the IX2 route)
Owner asked for new Webflow interactions instead of re-enabling IX2. Three IX3 scroll-scrub
interactions, page-scoped, desktop (`main`) set to `dont-animate`, so desktop IX2 is untouched.
Trigger: the section track, `start: top top`, `end: bottom bottom`, `scrub: 0.6`.

"All cards visible" needs a shift of exactly (content width - viewport width), which one
IX3 value cannot express, so each uses two layers moving at once:

| Interaction | id | Outer layer (width 100vw) | Inner layer(s) |
|---|---|---|---|
| Who We Work — mobile | `i-0655ed0c` | `www-bottom-content-track-scroll` xPercent 0 -> 100 | `www-bottom-content-track-null` (max-content, padding-right 10vw) xPercent 0 -> -100 |
| Card Section — tablet & mobile landscape | `i-43aa27d7` (off on main, tiny) | `card-content` xPercent 0 -> 100 | `null-card-1..5` xPercent 0 -> -534.29 = -(2 + 5x35 + 4x2 + 2)/35 |
| Card Section — mobile portrait | `i-e1161f7a` (off on main, medium, small) | `card-content` xPercent 0 -> 100 | `null-card-1..5` xPercent 0 -> -524 = -(2 + 5x50 + 4x2 + 2)/50 |

Card-section numbers use the Designer sizes: card 35em (medium/small) / 50em (tiny), gap 2em,
row padding-left 2em, 2em right margin at the end. If card sizes change, recompute.

Styles added (medium, cascades to small/tiny): `www-bottom-content-track-scroll` width 100vw;
`www-bottom-content-track-null` width max-content + padding-right 10vw;
`www-bottom-content-track` width max-content; `www-card-item` width 20rem;
`card-content` width 100vw + padding-left 2em; `null-card-1` opacity 1 (desktop fades it in via IX2).

`horizontal-scroll-positions.test.mjs` replays start/end transforms in Chromium at 390/700/900px:
who-we-work last card ends inside the viewport, card-section last card ends 2em from the right.
