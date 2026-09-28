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

## Who We Work cards: full text on mobile portrait (tiny)

The card text was cut off, and on most cards it never showed at all.

- `www-card-item-content` had a fixed tiny `height: 26em`. The text ran past the bottom of the black card, and white text on the cream page could not be seen.
- The card was also taller than the screen, so its text row sat below the fold. The terminal typing script (Code Embed 10) only starts once 20% of the text is visible, so on those cards it never ran.

Changes, all on tiny only:
- `www-card-item-content`: removed `height`, so the card now grows with its text.
- `www-card-image-wrapp`: `aspect-ratio: 4/3` (was 2/2.2), so the heading and the whole card fit in the sticky 100vh.
- `www-card-item`: `height: auto` and `gap: 1em`.

## Who We Work cards: equal height (medium and below)
Cards had different heights because text length differs and the row centered them.

- `www-bottom-content-track`: `align-items: stretch` (was `center`).
- `float-card`: `display: flex`.
- `www-bottom-content`: `align-items: stretch`.

All four cards now take the height of the tallest one (checked in a Chromium replica at 390px: 342/342/342).

## Card-section after removing a card (4 visible cards)
The owner hid `null-card-1` (visibility off), so 4 cards remain (`null-card-2..5`). The IX3 timelines were changed to match:

| Interaction | Per-card shift (was) | Per-card shift (now) |
|---|---|---|
| `i-43aa27d7` tablet & mobile landscape | -534.29% (5 cards) | -428.57% = -(2 + 4x35 + 3x2 + 2)/35 |
| `i-e1161f7a` mobile portrait | -524% (5 cards) | -420% = -(2 + 4x50 + 3x2 + 2)/50 |

Other changes in both interactions:
- `null-card-1` was removed from the targets.
- **"Horizontal first, then scroll down":** the slide actions now run over 0 to 0.8 of the timeline. A hold action (`cards-hold`, card row xPercent 100 to 100, 0.8 to 1.0) keeps the timeline length at 1. The last 20% of the sticky range therefore shows the finished row, covering the 0.6s scrub lag before the section scrolls away.

`horizontal-scroll-positions.test.mjs` was updated for 4 cards: the last card ends 2em (32px) from the right at 390, 700 and 900px.
