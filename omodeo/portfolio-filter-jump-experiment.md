# Omodeo — Portfolio filter image jump: EXPERIMENT (thread 903, RB-07)

Goal: keep the card parallax, stop images jumping when filters change. Experiment only, not verified.
Note: the list has `fs-list-resetix="true"` (Finsweet resets Webflow interactions on render), which fits the "parallax resets" theory.

## What was changed (staging only)
1. New combo class `.portfolio-archive_list-wrapper.portfolio-filter-list` (`min-height: 70vh`), applied only to the Portfolio list wrapper.
2. List attributes `fs-list-duration` 450 -> 300, `fs-list-stagger` 40 -> 20.
3. Registered script `PortfolioFilterParallaxRefresh` 1.0.1 attached to the Portfolio page footer only.

## Roll back to the state before the experiment
1. Page script: Portfolio page -> remove `PortfolioFilterParallaxRefresh` (set_page_scripts to []).
2. List attributes: `fs-list-duration` back to 450, `fs-list-stagger` back to 40.
3. Wrapper element `97999f7e-d7cb-845a-2b84-ce76e56c809b` on Portfolio: style names back to just `portfolio-archive_list-wrapper`.
4. Publish to staging.
(Unused leftovers are harmless: combo class `portfolio-filter-list`, registered script versions 1.0.0 and 1.0.1.)

## Round 2 (still jumpy after round 1)
Replaced round 1 with `PortfolioFilterSmooth` 1.1.0 (Portfolio page footer only, file `omodeo/PortfolioFilterSmooth-1.1.0.js`):
- On any change inside the filters form (tabs and sort select) the list wrapper height is frozen before Finsweet re-renders.
- Once the list settles (350ms after the last change) the wrapper height animates to the new height (0.5s), then returns to auto, then parallax is re-nudged.
- Removed the static `min-height: 70vh` combo from the wrapper (it blocked shrinking). Fade set to 450ms / stagger 30.

Rollback to the state before ANY experiment: Portfolio page scripts -> [], wrapper style names -> `portfolio-archive_list-wrapper`, attributes `fs-list-duration` 450 and `fs-list-stagger` 40, publish to staging.

## Round 3 (from the client screen recording, 1920x934 @ 60fps, filters All -> Kitchen -> Bathroom -> All)
Findings from the frames (50ms apart): the grid hard-cuts in ONE frame on every filter change. No fade is visible, so the
Finsweet fade (and the round 2 height animation) did not show. No vertical page jump was visible; the cut itself is the jump.
Fix: `PortfolioFilterSmooth` 1.2.0 (`omodeo/PortfolioFilterSmooth-1.2.0.js`), Portfolio page footer only.
It lays a snapshot of the current list over the grid, lets Finsweet render underneath, then crossfades (0.5s) while the
wrapper height animates. Safety timer 1.5s restores everything. Lifecycle tested on a mock page in Chromium; not on staging.
Rollback is unchanged (see above).

## Round 4 (client: "make it smoother")
`PortfolioFilterSmooth` 1.3.0 (`omodeo/PortfolioFilterSmooth-1.3.0.js`), Portfolio page footer only:
- wait before the swap 300ms -> 160ms (less lag), eases 0.5s -> 0.7-0.8s with a soft out-expo curve,
- new cards rise in (translateY 18px -> 0) with a 55ms stagger while the snapshot of the old grid fades out,
- full cleanup of inline styles after the animation. Lifecycle tested on a mock page in Chromium; not on staging.
Rollback: same as above, or go back to 1.2.0 / 1.1.0 by setting the page script version.

## Round 5 (client: "still choppy, turn parallax off")
`PortfolioFilterSmooth` 1.4.0 (`omodeo/PortfolioFilterSmooth-1.4.0.js`): same crossfade as 1.3.0 plus a CSS rule that turns the card parallax off
on the Portfolio grid only: `[fs-list-element="list"] .portfolio-card-item .image-content` is forced to fill its frame
(absolute, 100% x 100%, margin 0, transform none, object-fit cover). Only the Portfolio page has `fs-list-element="list"`, so
the Home Recent Work and About Featured Work cards keep their parallax.
Back to parallax on: set the Portfolio page script to 1.3.0.
