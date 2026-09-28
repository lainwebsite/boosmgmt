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
