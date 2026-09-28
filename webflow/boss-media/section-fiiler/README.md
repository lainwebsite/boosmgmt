# BOSS | Media — `.section-fiiler` (Code Embed 11)

Source of the Code Embed inside `.section-fiiler` on `/boss-media`
(site `bossmgmtgrp`, page `6944d3eee725483c24fbd899`, embed element `8aefcf21-4f44-6497-535a-c3d66cbcc129`).

- `code-embed-11.original.html` — code as it was before the fix (rollback copy).
- `code-embed-11.html` — code currently live in the Designer.

## Fix: reveal started before `.filler-media` was sticky

ScrollTrigger used `start: 'top bottom'`, so progress began as soon as `.track-filler`
entered the viewport — a full screen before `.filler-media` (`position: sticky; top: 0`) sticks.

Now:
- `start: 'top top'` — begins the moment `.filler-media` sticks.
- End distance = sticky run (`track height - .filler-media height`) × 0.88.
