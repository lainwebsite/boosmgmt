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

### 1.0.1 — iPhone (WebKit)
Recording on iPhone (Chrome iOS): focusing a field jumped to the footer, closing the keyboard
jumped far above the form.
- Cause 1: the form sits inside `.cta-content-media-wrapp`, which stayed `position: sticky`
  on tablet/mobile (with `height: auto`, so the sticky did nothing). WebKit mis-computes the
  focus scroll for inputs inside sticky boxes. Designer style changed: medium breakpoint
  (cascades to small/tiny) `position: relative; top: auto`. Desktop keeps sticky.
- Cause 2: iOS never resizes the layout for the keyboard and restores the scroll itself;
  the 1.0.0 restore added a second correction and overshot. 1.0.1 only restores when
  `window.innerHeight` actually changed by > 80px while the keyboard was open.

### 1.1.0 — take over focus scrolling
Still jumped on iPhone after 1.0.1. On a tap on a text field the guard now calls
`field.focus({ preventScroll: true })` itself (touchend, tap only, not swipes), so WebKit
does not run its own scroll-into-view, which miscalculates on this layout.

## `head-keyboard-debug.html` (registered script `bosskbdebug` 1.0.0)
Opt-in diagnostics: open the page with `?kbdebug`. Green overlay logs focus/blur,
resize, visualViewport, every scroll jump > 150px or document height change, and every
`scrollTo` / `scrollBy` / `scrollIntoView` / `focus` call with its caller. Remove before
going live on the custom domain.
