# Omodeo — reveal sections without top padding (Webflow Designer, no code change)

Why removing `.padding-top` / `.padding-huge` broke the animation: the site footer GSAP script
selects `:scope > .padding-top.padding-huge` inside each `.ow-stage`; with the class gone it logs
"not found" and returns, so no track / ScrollTrigger is created.

Fix: keep both classes, add a combo class `ow-no-pad` with `padding-top: 0rem`
(`.padding-top.padding-huge.ow-no-pad`). Only the reveal wrappers get it, so other
`.padding-top.padding-huge` users (e.g. Home Recent Work) keep their padding.

Applied to the reveal wrapper (`.ow-stage > .padding-top.padding-huge`) on:
- Home (Our Work)
- About (Our Work)
- Portfolio (Our Work)

Published to staging only. Not verified in a browser (webflow.io not reachable from the session).
