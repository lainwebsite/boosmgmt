# Omodeo — Navbar hamburger restore

Navbar component > Menu Button had 4 hidden children and 1 visible one.

Restored (visibility only, Designer element settings):
- SHOWN: HTML Embed with the 3-line SVG (`menu-icon-open`) and the X SVG (`menu-icon-close`)
- HIDDEN: HTML Embed with `<button class="nav-toggle">` (2 lines `line-top` / `line-bottom`)

Still hidden, untouched: default Icon, Image `hamburger-menu` (hamburger-white-menu.svg).

Note: no site/page CSS or IX3 interaction toggles `menu-icon-open` vs `menu-icon-close`.
If both icons show at once, the open/close toggle (legacy IX2 or CSS) needs to be re-added.
Published to the staging subdomain only.
