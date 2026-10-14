# Omodeo — Homepage fixes (Roundable project 32, Webflow Designer styles, no code)

Published to staging only. Not visually verified (webflow.io not reachable from the session).
RB-24 (mobile nav menu vertical centering, thread 918) intentionally NOT done, per request.

| Thread | Item | Change |
|---|---|---|
| 873 | RB-05 | `.body-weight-text` max-width 25rem -> 18rem (hero body shorter than heading) |
| 906 | RB-22 | `.main-content-text` mobile gap 1.5rem -> 2rem |
| 907 | RB-23 | `.main-content-text` / `.main-content-text-home` small+tiny max-width 80% (global class, so all page heroes on mobile) |
| 892 | RB-21 | `.main-content-wrapp-new` small/tiny padding-bottom 7rem (clears Chrome mobile toolbar) |
| 891 | RB-20 | `.hp-hero-container-new`, `.sticky-content-new`, `.image-wrapp-hero` small/tiny height 100vh -> 100svh (no resize jiggle when the URL bar moves) |
| 888 | RB-17 | `.hp-about-container.padding-vertical.padding-huge` small/tiny height 55vh -> auto |
| 874, 883 | RB-06, RB-12 | new `.wgw-body-text` wrapper (max-width 24rem) around the What Guides the Work paragraph |
| 877, 884 | RB-09, RB-13 | `.hp-rw-top-content-txt` max-width 30rem -> 22rem |
| 875, 876 | RB-07, RB-08 | recent-work card top border colour -> rgba(0,0,0,0.15); `.btn-line.is-1` -> rgba(0,0,0,0.2) |
| 878 | RB-10 | `.section.another-hero.ow-stage` background #1a1410 so any seam shows dark instead of light (unverified) |
| 886, 887 | RB-15, RB-16 | footer `.form-and-button` align-items center, `.form-arrow` margin-bottom 0 |
| 885 | RB-14 | tablet and down: footer bottom row stacks; Terms / Privacy first, All Right Reserved below |
| 889, 890 | RB-18, RB-19 | tablet and down: footer bottom row font-size 12px |
