# BOSS | Media — page-level code

## `head-keyboard-guard.html` (registered script `bosskeyboardguard` 1.0.0, page header)
Form in `.section-cta` jumped on mobile when the keyboard opened / closed. Most sections
on this page are sized in `vh` (500vh, 350vh, 1050vh...). Browsers that shrink the layout
viewport for the keyboard shrink all of them, moving the form by thousands of pixels.

1. Adds `interactive-widget=resizes-visual` to the viewport meta: the keyboard overlays the
   page instead of resizing it (Chrome / Samsung Internet / Firefox Android).
2. Touch devices: when the keyboard closes, scroll so the form is back where it was before
   typing (covers in-app webviews that still resize).
3. `ScrollTrigger.config({ ignoreMobileResize: true })` after load.

Registered scripts max 2000 chars, so the published copy is minified with terser.
