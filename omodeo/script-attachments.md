# Omodeo — script attachments (re-attached after the site transfer)

After the client transferred the site, `get_site_scripts` / `get_page_scripts` returned 404 "Custom code block not found":
the registered scripts still existed but their attachment to the site/pages was gone, so the preloader (and every script below) did not run.
Re-attached on 2026-10-14 via the Data API and published to staging only. Not verified in a browser.

## Site scripts
| Script | Version | Location |
|---|---|---|
| PreloaderOncePerSession | 1.3.0 | header |
| HeroIntro | 1.0.0 | header |
| ScrollStability | 1.0.0 | header |
| navtogglea11y | 1.0.0 | footer |
| ctamobileparallax | 1.0.0 | footer |
| navhideonscroll | 1.1.0 | footer |
| PaginationFullState | 1.0.0 | footer |
| PortfolioEmptyState | 1.0.1 | footer |
| CtaImagePosition | 1.0.0 | footer |
| OurWorkBathtubPosition | 1.0.0 | footer |
| RevealMobileImageMargin | 1.0.0 | footer |

## Page scripts
- Portfolio: PortfolioFilterSmooth 1.5.0 (footer)

## Notes
- The Site Settings custom code (head CSS incl. `.loader`, footer GSAP / Lenis / reveal code) was NOT affected.
- If the site is transferred or cloned again, these attachments can disappear again. Option discussed: inline the scripts into Site Settings custom code so they travel with the site.
