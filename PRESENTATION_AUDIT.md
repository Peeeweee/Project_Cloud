# Presentation layout audit — October 27, 2026

The supplied screenshots exposed a structural problem: foreground 3D objects used browser-wide world coordinates while slide copy used independent CSS percentages. The previous text-only collision check did not detect models crossing text. This revision replaces that arrangement with a shared layout contract.

## Changes

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

## Validation

The recorded audit is in `screenshots/audit-fixes/final-audit.json`.

| View | CSS viewport | Slides checked | Detected problems |
|---|---|---:|---:|
| Desktop | 1920 × 1080 | 20 | 0 |
| Laptop | 1365 × 768 | 20 | 0 |
| Phone | 391 × 845 | 20 | 0 |

The checks compare visible text-element bounds with reserved model areas, verify horizontal containment, and check footer clearance. They are geometric checks, supplemented by rendered-slide inspection; they do not measure physical GPU performance or prove every possible viewport is flawless.

Speaker order remains Paulo → Renan → Earl. Slide content, the reading report, source references, and notes are retained. The site remains a local build with a prepared GitHub Pages workflow.
