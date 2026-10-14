# Omodeo — scripts now live in Site Settings custom code (inlined)

Why: after the site transfer the Data API attachments of registered scripts disappeared (`get_site_scripts` -> 404), so the preloader and
every other registered script stopped running. Registered-script attachments do not travel with a transfer/clone; Site Settings custom code does.

On 2026-10-14 all registered scripts were inlined and the attachments were cleared (so nothing runs twice). Published to staging only.
Not verified in a browser (webflow.io not reachable from the session).

## Where each script lives now
| Script | Now in |
|---|---|
| PreloaderOncePerSession 1.3.0, HeroIntro 1.0.0, ScrollStability 1.0.0 | Site Settings > Custom code > Head (after the existing `<style>`) |
| navtogglea11y, ctamobileparallax, navhideonscroll 1.1.0, PaginationFullState, PortfolioEmptyState 1.0.1, CtaImagePosition, OurWorkBathtubPosition, RevealMobileImageMargin | Site Settings > Custom code > Footer (after the existing GSAP code) |
| PortfolioFilterSmooth 1.5.0 | Portfolio page > Custom code > Footer (after the 3 existing blocks) |

## Files in this repo
- `site-custom-code-backup/` — the head/footer (site) and head/footer (Portfolio page) exactly as they were BEFORE this change. Restore by pasting them back.
- `site-custom-code-new/` — what is live now (site head + footer, Portfolio page footer).
- Individual script sources: `omodeo/*.js`.

## Rollback
Paste the files from `site-custom-code-backup/` back into the same Custom code fields, then re-attach the registered scripts
(list: see git history of this file; versions as above, header: preloader/herointro/scrollstability, footer: the rest) and the Portfolio page script.

## Caveats
- The registered script versions still exist in Webflow (unused). Do not re-attach them while the inline copies are present, they would run twice.
- Future changes to these scripts must be made in Site Settings custom code (or the Portfolio page footer), not by registering a new version.
- Home page has its own page-level head/footer code (not touched).
