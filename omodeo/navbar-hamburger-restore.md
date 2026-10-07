# Omodeo — Navbar menu button (reverted to original)

Navbar component > Menu Button, visibility only (Designer element settings):
- SHOWN (original): HTML Embed with `<button class="nav-toggle">` (2 lines `line-top` / `line-bottom`).
  The site head CSS (`.menu-button.w--open .line-top / .line-bottom`) animates it into an X.
- HIDDEN: HTML Embed with the 3-line SVG (`menu-icon-open`) and the X SVG (`menu-icon-close`).
  This one was shown by the earlier "hamburger restore" and has now been reverted.

Still hidden, untouched: default Icon, Image `hamburger-menu`.
Published to the staging subdomain only.
