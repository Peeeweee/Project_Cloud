# Presentation layout audit

## October 27 — shared layout contract

The supplied screenshots exposed a structural problem: foreground 3D objects used browser-wide world coordinates while slide copy used independent CSS percentages. The previous text-only collision check did not detect models crossing text. This revision replaces that arrangement with a shared layout contract.

- Every slide reserves a DOM rectangle for its physical scene. WebGL renders through that rectangle with viewport/scissor clipping; foreground geometry cannot enter titles, values, captions, or the footer outside it.
- The camera fits the actual scene geometry. Diagram comparisons use orthographic projection so equal elements remain comparable in size. Cinematic views retain perspective.
- Service-model, backup-stage, key-authentication, cost-component, and architecture captions use projected object anchors and a shared baseline below the scene.
- Pricing towers are aligned with their corresponding amount columns. The numbers have a separate row; neither tower covers its amount or explanatory text.
- Root-access illustrations align with their centered comparison columns.
- Recovery figures are separated from the backup illustration, which now has explicit stage labels.
- Firewall geometry is separated from its traffic labels and rule descriptions.
- The key lifecycle has a clear illustration area and a consistent numbered sequence.
- FinOps labels surround the loop without crossing the ring or subtitle.
- Removed the large slide-number watermarks, TCO watermark, duplicate lifecycle caption, and redundant decorative markers. The footer remains the single slide-position indicator.
- Increased annotation contrast and adjusted small-screen font sizes and spacing.
- Reading/opening mode changes cancel outgoing slide animations. Diagram labels retain their projected positioning after animation completion.

## October 28 audit — phone and projector fixes

The October 27 phone result below was wrong: the geometric check only looked for text crossing the reserved 3D areas and the screen edge, so it missed the main phone failure. Fixes are in `src/mobile-fit.css` (phone overrides) and a three-line change to `fitLab()` in `src/main.js`.

- **Phones upright (≤760 px wide):** `.scene-content` collapsed to 0 px wide (the slide is a flex row and every child of the content box is absolutely positioned), so every heading wrapped one word per line and labels piled on each other. It now takes the full padded width.
- **Cloud Lab on phones:** `fitLab()` always laid the lab out at 1000 px and scaled it down (≈0.36× on a phone). Phones now skip the scaling and use the stacked layout; tabs, price cards and headings were resized to fit.
- **Phones sideways (≤500 px tall):** the desktop composition, positioned in percentages of a 390 px slide height, collided on nearly every slide. Wider phones now keep a fixed 640 px slide height and scroll; narrower ones use the upright layout. The title cover compacts instead of scrolling.
- **Elasticity slide, all desktop sizes:** the subtitle ran into the “Explore capacity” label and toggle. Fixed upstream (commits a819731, 9f23e61) by placing the heading, toggle and instance count in one flow container; verified at 1024×768, 1280×720, 1366×768, 1920×1080 and 844×390.
- **Cover on upright phones:** the presenter names row was raised slightly off the tagline.

## Keynote upgrade — October 28

The desktop stage now expands when controls are hidden. Headings and body text are larger, including the risk tiles, orbital labels, recovery labels, incident steps, firewall rules, comparison table, lifecycle steps, architecture labels, and quiz. Reserved 3D areas moved below the enlarged subtitles on slides 3 and 6; the firewall, comparison, cost, pricing, elasticity, and FinOps layouts were also adjusted.

All 22 slides share the title → details → takeaway arrival sequence, including both title covers. Only Earl’s slides 14–17 have presenter builds (5/5/6/5 states). Text splits and counters are cancelled before reuse, and rapid title moves settle before new Flip measurements. Hidden build content is inert and excluded from assistive navigation. The final pricing and FinOps statements hide their earlier text instead of leaving competing dim labels underneath.

The 3D look uses toon shading and ink outlines with no eyes. Models remain inside reserved scene slots. On phones the fixed canvas now repaints on scroll, keeping the model aligned with the scrolling text, and a new slide resets scroll position. The 360px Cloud Lab heading now flows above its tabs.

## Validation

Headless Chromium with SwiftShader checked **39 slide/build states at each of eight sizes (312 states total)**. Text bounds were compared for overflow and overlap; screenshots of every state were inspected for visible text collisions and 3D/text collisions. Additional scrolled phone views check models that start below the viewport. These are emulated viewports, not real-device performance measurements.

| View | CSS viewport | States | Text overflow | Visible text/3D collisions |
|---|---|---:|---:|---:|
| Desktop | 1920 × 1080 | 39 | 0 | 0 |
| Laptop | 1366 × 768 | 39 | 0 | 0 |
| Projector | 1280 × 720 | 39 | 0 | 0 |
| Older projector | 1024 × 768 | 39 | 0 | 0 |
| Phone upright | 390 × 844 | 39 | 0 | 0 |
| Phone upright | 360 × 740 | 39 | 0 | 0 |
| Phone sideways | 844 × 390 | 39 | 0 | 0 |
| Phone sideways | 740 × 360 | 39 | 0 | 0 |

The overlap report intentionally retains candidates for inspection. Font bounding boxes overlap around the tight display lines (OF/IN the cloud, Linux/Account root, the keynote titles), large Barlow numerals and their labels, and rotated owner-tag text. The rendered glyphs remain separate. Scene-slot checks can flag the firewall’s corner label despite clear geometry; empty build scenes and opaque final-statement overlays are not model collisions. Phone vertical scrolling and the fixed navigation bar are intentional.

`npm run check:interactions` passes: cover/reprise word reveals and split cleanup; all 39 states forward and backward at rapid-click speed; reversing incomplete builds; pricing, fleet, and monthly counters; quiz choice changes; notes, contents, sources; manual and live device reduced-motion changes; lab modes, usage slider, stage changes and resets; reading links; phone Back/Next; scroll repaint and slide scroll reset. No browser errors were recorded. Motion off keeps build navigation functional without word or title animation.

`npx vite build` passes. Vite reports the existing Three.js vendor chunk above 500 kB; this is a size warning, not a build failure. The dependency installation audit reports zero vulnerabilities. The updated speaker script and regenerated 34-page PDF include the Next instructions for slides 14–17; all slide headings and bookmarks were retained.

Reproducible checks live in `tools/check-layout.cjs` and `tools/check-interactions.cjs`; run against the Vite dev server at port 5199 (see README). Stills and raw reports go to ignored `previews/upgrade/`. Link availability was last checked in the earlier October 28 audit and was not rechecked for this visual upgrade. The earlier 768 × 1024 tablet result is not part of this upgrade’s eight-size run.

Not covered: physical GPU performance, real phones, Safari/Firefox, and screen readers.

Speaker order remains Paulo → Renan → Earl. The Cloud Run review preview is deployed separately. GitHub Pages remains unchanged until Earl explicitly authorizes pushing `main`.
