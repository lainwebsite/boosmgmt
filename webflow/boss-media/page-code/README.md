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

## Form dropdowns (`bossformdropdown` 1.1.0, page footer)

The "What are you looking to achieve?" and "Budget range" fields are Webflow Dropdown components. Their items are plain `#` links, so clicking one did not pick anything and nothing was submitted.

`form-dropdown-select.js` is the readable source; `bossformdropdown-1.1.0.min.js` is the exact registered code. On an item tap it:

- shows the chosen text in the toggle;
- stores the value in a hidden input, `Goal` or `Budget Range`, which is sent with the form;
- adds `is-selected` to the dropdown and `w--current` to the chosen item;
- closes the list.

Test: `node test/form-dropdown.test.mjs`.

v1.1.0: on iPhone, the tap on an item never reached the link, because Webflow had already closed the list (setting it to `pointer-events: none`) before the click event arrived. The tap then went through to the field underneath. The script now does three things:

- takes the pick on `pointerup`, from the tap position;
- blocks the leftover touch/click events so they don't reach the field underneath;
- keeps `click` only as a fallback for mouse and keyboard.

The test reproduces that iPhone case: v1.0.0 fails it and v1.1.0 passes (`node test/form-dropdown.test.mjs [min-file]`).

## Form values in white

- Designer: class `Text Field` now has `color: White` (`--white`, #fbfbf7). Typed text used the Webflow default dark gray, which was hard to see on the black form.
- Page head: `head-form-colors.html` was appended to the page's head code. It turns a picked dropdown value (`.dropdown.is-selected`) white, and keeps iPhone/Chrome autofilled fields white too.

Follow-up: on iPhone the typed text still showed Webflow's default dark gray (`#333`). The Designer color alone did not win there, so `head-form-colors.html` now does:

- sets `color` and `-webkit-text-fill-color` to #fbfbf7 with `!important` on `#email-form .text-field`, including `:focus`;
- keeps the placeholder #999;
- turns picked dropdown values and autofilled fields white.

## Page footer: duplicate libraries removed (2026-10-13)
`page-footer.html` is the live footer code. `page-footer.before-dedupe-2026-10-13.html` is the rollback copy.

The footer loaded:
- GSAP core 4x: 3.13.0, 3.x (3.15.0), 3.15 and 3.12.2;
- ScrollTrigger 2x;
- Lenis 2x (1.0.33 and 1.0.34);
- React 18 + ReactDOM UMD, which nothing used (the filler embed has its own ESM React).

Every copy replaced the one before it, so all runtime code (lenis2, hover stagger, all-reach text, float cards, anim-reveal, terminal text, filler) ran on the last ones: GSAP 3.12.2, ScrollTrigger 3.12.2 and Lenis 1.0.34. Only those are kept now. SplitText and ScrambleText 3.15 load before the core, as their effective registration was before.

Script tags went from 15 to 8, with roughly 400 KB less JS to download and parse.

`test/footer-libs-equivalence.test.mjs` serves the CDN URLs from npm packages and compares old vs new in Chromium. It checks:
- the gsap and ScrollTrigger versions, and that ScrollTrigger is on the same core;
- the registered plugins;
- which Lenis build is used, and the Lenis scroll result;
- that three/CSS3D are present;
- that there are no new errors.

Result: no differences.

## Performance pass 2026-10-13 (Safari / Firefox / weaker devices janky)
Same visuals, less work per frame. Tests: `test/collage-idle-equivalence.test.mjs`,
`test/terminal-text.test.mjs` (run with `LIBS=<npm-packed libs>`; see test headers).

- **Collage (page footer, CSS3D 150 cards)**: the rAF loop recomputed all 150 cards every
  frame forever, even with nothing moving or the section far away. Now it skips the frame
  when hero + collage are > 200px off screen (IntersectionObserver), and when scroll
  progress and mouse parallax have not moved since the last draw. `boxShadow` / `filter`
  are only written when the value changes. Old vs new: identical card transforms /
  opacity / visibility at every tested scroll position (< 0.01px). Chromium, 3s idle:
  ~150ms JS -> ~20ms.
- **Footer size**: Webflow caps page custom code at 50 000 chars. To make room, the form
  submit script and the desktop float-cards script moved to the page head
  (`page-head.html`). Both are `Webflow.push` callbacks, so they still run on DOM ready
  after the footer libraries. Rollback: `page-footer.before-perf-2026-10-13.html`
  (and remove the last two scripts from the head).
- **Terminal text (Code Embed 10, `../section-terminal/`)**: every 50ms it walked all
  ancestors of every `.terminal-text` with `getComputedStyle` + `getBoundingClientRect`,
  forever. Now elements an IntersectionObserver reports as off screen count as 0% visible
  without the walk (same result), finished one-shot items leave the list, and the ticker
  stops once nothing is left to watch.

## Logo scatter starts as the hero disappears (2026-10-13)
Recording: after the hero faded the B logo sat still ~1s before scattering. Cause: each
card's start is delayed by its distance from the centre (`delays`, min ~0.08, median
~0.13), so progress 0 -> ~0.15 moves nothing. `LOGO_START_AT = 0.15`: progress is already
0.15 when the hero fade ends, the still part runs behind the fading hero (< 3px movement),
and the end of the animation stays at the same scroll position. Old: 0px movement for the
first ~450px of scroll after the hero (1440x900); new: moving from the first pixels.
`LOGO_START_AT = 0` restores the old timing. Test: `test/logo-start-after-hero.test.mjs`.
