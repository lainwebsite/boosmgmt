# Omodeo — Portfolio page + footer (Roundable #902-#905, #742)

Designer style changes only (no code). Published to staging.

- #904 (arrow too thick): `.product-sort-item-wrapper` (style select) now uses appearance none + a thin 12px chevron SVG (stroke 0.75) as background, padding-right 1.5rem.
- #742 (footer mobile): `.footer-content-nav` margin-right 6rem removed at Tablet/Mobile, grid gap 4rem to 2rem at Mobile landscape and portrait.
- #905 (footer logo row): `anim-text-reveal` removed from `.footer-bottom-content` (footer component) so the logo row is never left shifted down 1.5rem at the very bottom of the page.

Not changed:
- #902 hero blurry: source image-portfolio.avif is 1357x1900 and Webflow only generated variants up to 1080px, but the hero is full width at 1512px (3024px on retina). Needs a new source of at least 3000px wide.
- #903 filter switching jump: not reproduced, needs a screen recording or exact steps.
