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

The October 27 phone result below was wrong: the geometric check only looked for text crossing the reserved 3D areas and the screen edge, so it missed the main phone failure. Fixes are in `src/mobile-fit.css` (loaded last) and a three-line change to `fitLab()` in `src/main.js`.

- **Phones upright (≤760 px wide):** `.scene-content` collapsed to 0 px wide (the slide is a flex row and every child of the content box is absolutely positioned), so every heading wrapped one word per line and labels piled on each other. It now takes the full padded width.
- **Cloud Lab on phones:** `fitLab()` always laid the lab out at 1000 px and scaled it down (≈0.36× on a phone). Phones now skip the scaling and use the stacked layout; tabs, price cards and headings were resized to fit.
- **Phones sideways (≤500 px tall):** the desktop composition, positioned in percentages of a 390 px slide height, collided on nearly every slide. Wider phones now keep a fixed 640 px slide height and scroll; narrower ones use the upright layout. The title cover compacts instead of scrolling.
- **Elasticity slide, all desktop sizes:** the subtitle ran into the “Explore capacity” label and toggle. Fixed upstream (commits a819731, 9f23e61) by placing the heading, toggle and instance count in one flow container; verified at 1024×768, 1280×720, 1366×768, 1920×1080 and 844×390.
- **Cover on upright phones:** the presenter names row was raised slightly off the tagline.

## Validation

Checked with headless Chromium on the dev server. “Overflow” compares text bounds with the screen edges; “overlap” compares the bounds of every visible text run; every reported overlap was then inspected in a screenshot. Large display headings with tight line spacing (“OF / the cloud”, “Linux / root”, the RPO/RTO figures) trip the overlap test without visibly touching; these were inspected and are not defects.

| View | CSS viewport | Slides | Overflow | Visible overlaps |
|---|---|---:|---:|---:|
| Desktop | 1920 × 1080 | 22 | 0 | 0 |
| Laptop | 1366 × 768 | 22 | 0 | 0 |
| Projector | 1280 × 720 | 22 | 0 | 0 |
| Older projector | 1024 × 768 | 22 | 0 | 0 |
| Tablet upright | 768 × 1024 | 22 | 0 | 0 |
| Phone upright | 390 × 844, 360 × 740 | 22 | 0 | 0 |
| Phone sideways | 844 × 390, 740 × 360 | 22 | 0 | 0 |

Also exercised without console errors: keyboard navigation through all slides, notes, contents, sources, settings, the quiz, every Cloud Lab control, reading view and its contents links, and deep links to slides. The production build passes and `npm audit` reports no vulnerabilities. All 13 source links resolved on October 28.

Not covered: physical GPU performance, real phones (only emulated viewports), and screen readers.

Speaker order remains Paulo → Renan → Earl. The site remains deployed from `main` through the GitHub Pages workflow.
