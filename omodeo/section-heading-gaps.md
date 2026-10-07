# Omodeo — section title / heading / body gaps (set in Webflow Designer styles, no code)

Rule requested:
- Section title (tag) to Heading: desktop 1rem, mobile 0.5rem
- Heading group (title + heading) to body: desktop 1.5rem, mobile 1rem
- Mobile = Webflow breakpoints Mobile landscape (small, 767px) and Mobile portrait (tiny, 478px); tablet inherits desktop.

Set on the global classes (`grid-row-gap` and `grid-column-gap`).

## Title to Heading (1rem / 0.5rem)
hp-about-content, hp-wgw-content-title, hp-rw-top-content-title, reveal-content-title, about-story-wrapper,
text-heading-behind-wrapper, approach-heading-content, portfolio-overview_copy, heading-philosophy-wrapper,
heading-content-contact, heading-featured-work-wrapper, overview-text-heading-wrapper, material-heading-wrapper,
heading-next-project-wrapper, wrapper-cta-text (CTA component)

## Heading group to Body (1.5rem / 1rem)
hp-wgw-content-txt, hp-rw-top-content, text-behind-wrapper, approach-heading-wrapper, right-content-hww,
text-content-philosophy-wrapper, portfolio-intro_copy, overview-text-wrapper, Div Block 7 (contact form intro)

## Left as is
- portfolio-intro_content: two-column grid (label left, heading right), not a vertical gap.
- right-content-material-wrapper: heading group followed by the accordion list (4rem), not body text.
- reveal-content-txt, featured-work, next-project-*: heading group is followed by images, lists or buttons, not body text.
- Privacy, Terms, 404, Password, Launching: no section tag, so no title/heading pair.
