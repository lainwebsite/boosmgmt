# /boss-media cross-check (2026-09-28)

## Fixed
| Item | Change |
|---|---|
| Who We Work cards uneven height on mobile/tablet | Card row stretched (see `responsive/README.md`) |
| Filler reveal appears half-way after the cards on mobile | Start point = real card exit (see `section-fiiler/README.md` #4) |
| IX3 `i-2d3052db` "Scroll interaction" and `i-a731a030` "Scroll interaction 2" had `showMarkers: true` (GSAP debug markers) | Set to `false`; triggers and timelines otherwise untouched |
| Site head CSS: selector `•⁠ ⁠{` (bullet + invisible chars) instead of `*`, so the scrollbar hide never applied in Firefox / old Edge | Restored to `* {` |

## Left as is (needs owner decision or a live test)
- The page footer loads GSAP four times (3.13.0, 3.x, 3.15, 3.12.2), ScrollTrigger twice, and Lenis twice (1.0.33 and 1.0.34). Each new copy replaces `window.gsap`. Removing the duplicates would speed up mobile, but other scripts are written against this load order, so it needs testing on the live page first.
- IX3 `i-2d3052db` and `i-a731a030` do nothing: one has an empty action, the other has no actions. They can be deleted in the Interactions panel.
- Card texts are missing a space after the first sentence: "scale.Audiences", "watches.YouTube", "execution.Worldwide", "design.Tech". Content change, so owner's call.
