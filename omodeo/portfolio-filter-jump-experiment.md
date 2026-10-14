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
