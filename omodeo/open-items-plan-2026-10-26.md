# Omodeo — open Roundable items (project 32), status 2026-10-26

BLOCKED, nothing changed on the site yet:
- Webflow: the connected account now only lists "Mamba V5" (workspace 625749903e5c610181b35b4d). The Omodeo site (id `6a963a7a923fd1c54e923def`) is not visible, so no edit / publish is possible. Reconnect the Webflow connector with access to the workspace that now owns Omodeo, then start a new session.
- Figma MCP: Starter plan tool-call limit reached after the first few calls (file wwnKQViaVOkcDLPUyHUptv). Page "Omodeo" (0:1) has section "Update - 3 September" (391:3633) and a newer "22 oct" (721:1583). Only the structure/text layers were read (metadata), no screenshots.

## Figma "Update - 3 September" frames
About 391:3634 · Homepage 391:3956 · Portfolio listing 391:4109 (+391:4350) · Portfolio detail 391:4378 · Contact 391:4650.
Text layers confirm: card meta line = "Category | Category" with year below; detail page order = intro, overview, our approach, material, explore next, Start a Project, footer.
The Figma copy differs from the live copy requested by the client (e.g. Brookhaven vs Alpharetta, different project names), so Roundable/client copy wins; Figma only used for structure.

## Open items (38) grouped
Copy edits (CMS item fields / page text):
- Portfolio hero text RB-3.10 (#1934): "A growing portfolio of kitchen design, custom cabinetry and millwork by Omodeo, from light-filled Atlanta kitchens to bathrooms and built-ins. Each project is shaped through careful planning, honest materials and the details that make a home feel personal."
- Project Detail Kendrick RB-5.04 (#1978), RB-5.05 (#1979); Lawnview RB-6.02 (#1921), RB-6.05 (#1924), RB-6.06 (#1925), RB-6.07 (#1926), RB-6.09/6.10 (#1928/#1929, specs list + "format suggestions"); Paces Ferry RB-7.01 (#1976), RB-7.02 (#1977)
- Lawnview RB-6.04 (#1923) "Alpharetta, Georgia" (typo "Gerogia"); RB-6.03 (#1922) "by Omodeo"
- Featured/next-project heading RB-6.11 (#1930) "Work with Us", RB-6.12 (#1931) "Discuss your project with Omodeo"
- CTA RB-6.14 (#1933) "considering custom cabinetry"; RB-6.13 / RB-3.27 (#1932 / #1951) "Reformat" (needs clarification which format)
Formatting (Portfolio cards, Lawnview hero):
- Project name + location italic: #1935 #1937 #1938 #1943 #1944 #1946 #1947 and Lawnview hero #1920
- Category line copy: #1936 #1939 #1940 #1941 #1942 #1948 #1949 ("Kitchen Design & Custom Cabinetry | Transitional / Modern")
- RB-3.21 (#1945) "W.Pine Valley | Buckhead"
Layout / interaction:
- RB-3.26 (#1950) center "The centre of everyday life." heading
- RB-1.25 (#1618) elegant hover animation on footer links
- RB-1.10 (#878) white line above overlay (waiting for client check; colour already #1a1915)
Cannot do from here:
- RB-3.06 (#902) blurry Portfolio hero: needs a >=3000px wide source image uploaded by the client.

---
# Update 2026-10-26 (later): Webflow reconnected, items worked on STAGING ONLY
The Omodeo site (same id `6a963a7a923fd1c54e923def`) is now in workspace `6a97c4be08ec9a559a92be9e` and has live domains omodeo.studio / www.omodeo.studio.
Published with `publishToWebflowSubdomain: true, customDomains: []` only. CMS item edits are staged (not published to the live domain by me).
Registered-script-inlined custom code (site head/footer, Portfolio page footer) survived the transfer unchanged.

## Done (Roundable -> check)
- CMS (Portfolios): Lawnview / Kendrick / Paces Ferry copy per client; Lawnview location "Alpharetta, Georgia"; Kendrick/Paces location "Atlanta, Georgia"; Bellhaven/Ellard "Alpharetta, Georgia"; Arden/Arbor "Brookhaven, Georgia"; W. Pine "Buckhead, Atlanta"; Arden renamed "Arden Rd.".
- New CMS field `Location (card, short)` (slug `location-card-short`): "Alpharetta, GA" etc., bound in Portfolio cards and the project detail hero ("Name | City, GA", italic).
- Type Portfolios: "Kitchen Design" renamed "Kitchen Design & Custom Cabinetry" (also changes the filter tab); new type "Custom Cabinetry" used by Arden Rd.
- Single-line CMS fields cannot hold line breaks, so the client writes "¶" as separator. Script in the Portfolio detail template page footer turns "¶" into paragraphs (intro support text) or lines (credits under Project Overview).
- Long client texts were split: first paragraph in the big heading field, remaining paragraphs in the support text field.
- Detail template: "by Omodeo" under the category, section tag "Work with Us", heading "Discuss your project with <i>Omodeo</i>".
- CTA component: "custom millwork" -> "custom cabinetry".
- Portfolio hero text replaced; combo `.body-weight-text.portfolio-hero-body` (34rem).
- Footer links hover (`.button-omodeo`): underline fade + 0.35rem slide, 0.5s.

## Needs the client
- #1932 / #1951 "Reformat" (what exactly?), #1950 "Center" (what exactly?), #902 blurry hero (needs >=3000px source), #878 (waiting for client check).
- Cards: client lines omit the style for most projects, kept the style on all cards ("| Modern/Transitional"); say if it should be hidden.

## Rollback notes
CMS: previous values are in the Webflow CMS history / this file's earlier output; template additions: remove elements "by Omodeo", `hero-title-row` (move h1 back), card separator + location paragraphs; footer `.button-omodeo` hover; page footer script on the detail template.

## Update 2026-10-26 (CTA "Reformat", threads 1932 + 1951)
Reference from agency (Rangga): CTA heading, centered, 3 lines, non-italic text dimmed, italic phrases white, comma not italic.
CTA component (shared, so Portfolio + Lawnview + all pages):
- `.heading-style-h5.text-cta.text-color-white.lower-white` color -> hsla(0,0%,100%,0.65) (non-italic dim; italic spans keep full white)
- comma after "beginning a new home" moved out of the italic span
- copy "custom cabinetry" kept (client copy), reference image still says "millwork"
Staging only. Not visually verified (webflow.io not reachable from the session).
Rollback: remove color on the combo above; put comma back inside the first italic span.

### CTA follow-up (client screenshot: words scattered in columns)
Cause: global combo `.text-color-white.lower-white` has `display:flex`, so every text node / italic span in the CTA h2 became a flex item.
Fix: `.heading-style-h5.text-cta.text-color-white.lower-white` -> `display:block`, `text-align:center` (heading flows as one centered paragraph).
Staging only, not visually verified. Rollback: remove display/text-align from that combo.

## #878 Our Work line — real cause (from client screen recording)
Frame analysis: one 1px row at the bottom edge of the Our Work image is ~2x brighter than the overlaid image (un-overlaid raw photo; parallax-transformed image bleeds 1px past the area the overlay covers). Not a Roundable artifact.
Fix (Designer styles, no code): `.reveal-container::after` = 2px strip, #1a1915, absolute bottom, z-index 1, pointer-events none (global class, so Home/About/Portfolio Our Work). `.reveal-container-wrapper.ow-stage-screen` bg #1a1410 -> #1a1915 (client colour rule).
Staging only, not visually verified. Rollback: remove `::after` on `.reveal-container`; stage-screen bg back to #1a1410.
