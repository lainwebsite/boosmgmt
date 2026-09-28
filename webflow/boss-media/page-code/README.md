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

### 1.2.1 — freeze the layout while the keyboard is open (current)
`?kbdebug` on iPhone Chrome showed the real cause: opening the keyboard shrinks the layout
viewport (`innerHeight` 666 -> 337), so all vh sections shrink and the document drops from
12493px to 7846px. WebKit ignores `interactive-widget`.

On focus of a field (before the keyboard opens) every block whose height, margin or
padding is >= 25% of the viewport is pinned to its current px values (`!important` inline),
read-all-then-write-all. Released once focus leaves the fields and `innerHeight` is back
(1.5s cap), or when the width changes (real rotation). 1.1.0's focus takeover and the
scroll restore were removed.

`test/keyboard-collapse.test.mjs` (Playwright, mobile emulation) reproduces the collapse:
without the guard 5982 -> 3186px, with it the document and form position stay put.
`bosskeyboardguard-1.2.1.min.js` is the exact registered source.

Confirmed fixed on iPhone. `bosskbdebug` removed from the page (still registered on the
site, unused); page header now carries only `bosskeyboardguard` 1.2.1.

## Form dropdowns (`bossformdropdown` 1.0.0, page footer)

The "What are you looking to achieve?" and "Budget range" fields are Webflow Dropdown components. Their items are plain `#` links, so clicking one did not pick anything and nothing was submitted.

`form-dropdown-select.js` is the readable source; `bossformdropdown-1.0.0.min.js` is the exact registered code. On an item click it:

- shows the chosen text in the toggle;
- stores the value in a hidden input, `Goal` or `Budget Range`, which is sent with the form;
- adds `is-selected` to the dropdown and `w--current` to the chosen item;
- closes the list.

Test: `node test/form-dropdown.test.mjs`.
