# Group 11 — Beyond the Cloud

A cinematic, original Mars-inspired browser presentation on cloud economics, operations, and security. Speaker order: **Paulo → Renan → Earl**. Thirty-one slides, including an interactive Cloud Lab before the final title reprise. The core report takes approximately 25–30 minutes; allow an optional additional 2–3 minutes for the lab, plus questions.

## Run locally

Requires Node.js 22.12+ (or a compatible recent release).

```sh
npm ci
npm run dev
```

Open the URL printed by Vite. `npm run build` creates `dist/`; `npm run preview` serves that production build.

## Present

- Arrow keys / Space: navigate. On Earl’s slides 23–26, Next/Back move through the builds first; Back from the next slide returns to the last build. Home / End: first / last slide.
- N: speaker notes. C: contents. R: reading view. F: fullscreen. H: show/hide controls.
- Presentation utilities start hidden. The discreet top-right eye button reveals the top menu, source links, and bottom navigation together. Your choice is remembered in this browser. Arrow-key navigation works while controls are hidden. Reading view keeps its navigation available.
- Escape: close a panel. Focused buttons retain their normal keyboard behavior.
- Settings: balanced/high 3D detail and motion toggle. Reduced-motion device settings are respected initially.
- Reading view: detailed explanations, glossary, defense questions, source links, and sample calculations.
- Print / save PDF: generates a text report from the same content.

The opening is manually activated and skippable. No sound plays. Essential assets are bundled; external source links require a connection. To rehearse without internet, build first and serve `dist/` locally with the preview command. A hosted page is not guaranteed available offline after closing its browser tab.

## GitHub Pages

Live site: https://peeeweee.github.io/Project_Cloud/ — every push to `main` rebuilds and redeploys it, so merged changes go public automatically.

To set up Pages on a new copy of the repository: in **Settings → Pages → Build and deployment**, select **GitHub Actions**. The included workflow builds and publishes `dist/`. This project uses relative asset paths, so the repository name does not need to be embedded in the build. Do not upload `node_modules/`.

## Edit

- `src/content.js`: slide order, presenter, speaker notes, reading text, sources, glossary, defense questions.
- `src/main.js`: layouts, controls, reading view, print output.
- `src/direction.js`: twenty-two individual compositions, build markup, scene poses, palettes, and transition choices.
- `src/builds.js`: presenter steps for slides 23–26, cancellable counters, Flip title moves, and 3D scene hooks.
- `src/choreo.js`: shared masked word reveals, with split cleanup on interruption and navigation.
- `src/keynote.css`: build visibility, sequenced arrivals, title states, and phone layouts.
- `src/stage.css`: desktop stage expansion and larger text, with reserved space around diagrams.
- `src/scene.js`: original procedural Three.js objects, textured Mars and terrain shaders, spatial transitions, interactive resource scenes, quality controls.
- `src/style.css`: shared interface, reading view, and print styles.
- `src/redesign.css`: slide-specific editorial layouts and responsive art direction.
- `src/layout-fixes.css`: reserved scene areas, diagram-caption alignment, contrast, and cross-viewport corrections.
- `src/branding.css`: reference-inspired typography, cover composition, planet atmosphere, and responsive branding.
- `src/mobile-fit.css`: phone portrait and landscape layout, and the phone Cloud Lab.
- `REPORT_BLUEPRINT.md`: design and content plan.
- `PRESENTATION_AUDIT.md`: screenshot-driven findings, structural fixes, and validation scope.

Illustrative prices are not live quotes. Technical summaries are based on the supplied defense guide and linked primary references. The report corrects several oversimplifications in the source guide, including root credential management, SSH encryption and authentication, security-group defaults, and the difference between budget alerts and spending caps.

Visual inspiration: *The Martian*. No movie stills, logos, copied branding, or external models are used. Geometry is generated procedurally; the planet uses a bundled NASA/JPL/USGS Viking surface map with artistic lighting and color grading. Asset credits are in `public/credits.txt`. FinOps phase terminology is attributed to the FinOps Foundation. Speaker notes are public content when the site is published.

The second design edition replaces the repeated text/object layout with a horizon title, risk triptych, physical service terraces, orbital operations map, panoramic signal chart, large recovery intervals, incident procedure, split responsibility boundary, privilege comparison, firewall corridor, network-control comparison, authentication path, diagonal key lifecycle, ownership poster, pricing duel, capacity field, FinOps loop, isometric architecture, audience decision, and landscape finale. Motion includes assembly, separation, orbit, traversal, camera dive, elevation, impact, and horizon reveals. The pricing and elasticity builds update actual 3D geometry; Cloud Lab keeps its direct controls.

The October 27 layout audit introduces a shared coordinate contract: each slide's `.scene-slot` defines its WebGL viewport and clipping boundary. Models fit inside that area; object captions use projected anchors below it. Isometric cameras keep diagram sizes consistent, while cinematic scenes retain perspective. Do not position foreground models against the whole window independently of slide copy.

The opening and closing titles share the reference-inspired cover. Syne supplies wide display headings, Instrument Serif Italic supplies editorial subtitles, and Barlow Condensed supplies labels, names, controls, and reading text. These are close visual matches chosen from the reference image; exact fonts cannot be extracted from a bitmap. Font files and their SIL Open Font License notices are bundled locally.

Scene changes now include a 560-point silhouette morph between the previous and next 3D compositions. Mars uses a revolving, shader-deformed reveal that settles into a sphere, followed by slow surface rotation. The planet and the cost blocks’ gentle idle bob render at up to 30 frames per second only while their slide is visible and active. Other scenes redraw on demand, including scrolling to keep the fixed canvas aligned with phone content. Motion off and reduced-motion preferences disable these effects; reading view pauses them.

## Interactive Cloud Lab and mobile navigation

The penultimate slide (`#cloud-lab`, slide 30 of 31) has three presenter-controlled simulations. Pricing compares 176, 438, and 730 usage hours; 438 is the equal-cost point under the stated assumptions. Elasticity grows from two baseline machines to twenty for a peak and releases the additional eighteen afterward. Incident response moves through exposure, containment, investigation, and recovery. The incident model keeps existing resource charges running after containment until cleanup; it is a fictional teaching example, not a connected cloud account. Each mode starts fresh when selected, with direct stage selection and a Replay action after recovery. All three simulations respect Motion off.

Phones have a fixed Back/Next bar with at least 44-pixel touch targets, page position, and safe-area spacing. It remains available when presentation utilities are hidden. The same bar appears in short landscape windows.

Phone layouts (`src/mobile-fit.css`):

- **Upright (≤760 px wide):** each slide is a stacked page that scrolls under the fixed Back/Next bar. The Cloud Lab is not scaled down on phones; its panels stack at readable size.
- **Sideways (≤500 px tall):** wider phones keep the desktop composition at a fixed 640 px slide height and scroll; narrower ones use the upright layout. The title cover never scrolls; it compacts its title and hides secondary captions instead.

The site is the authoritative running order: Paulo → Renan → Earl, 22 slides, with the Cloud Lab at 21 and the title reprise at 22. The speaker script (`output/script/`) and its PDF (`output/pdf/`) follow the same order and numbering.

- `src/lab.js`: lab state, calculation model, labels, and stage controls.
- `src/lab.css`: lab layout and mobile navigation placement.

## Interactive redesign

Cloud Lab compares cause and effect with a 0–730 hour pricing slider, animated elastic/fixed fleets, and a four-stage incident walkthrough. Presets, direct stage selection, previous/next steps, and one-click replay support live teaching. Assumptions stay visible; examples are illustrative compute costs, not live cloud billing.

The highlighted security and economics scenes use larger explanations and distinct compositions. Phone content scrolls while the safe-area-aware Back/Next navigation stays fixed; on laptops and projectors Cloud Lab uses a fitted single-screen stage, and on upright phones its panels stack and scroll. Hidden supporting 3D viewports are excluded from camera fitting to avoid invalid geometry during responsive changes. Reduced-motion preferences disable the new bar and machine entrances.

Forward entry and contents jumps start interactive slides at their initial values. Slides 23–26 use 5, 5, 6, and 5 builds respectively, including their opening state. Next reveals the next part; Back reverses it and returns from the next slide to the last build. Quiz answers and lab scenarios remain directly selectable. Re-selecting a lab mode starts that scenario again; incident navigation cycles through its stages.

Every slide, including the cover and title reprise, uses the same arrival sequence: title, details in reading order, then the takeaway. Titles move between compositions, words rise through masks, and background tone changes use a curtain wipe. A single click completes the sequence on Paulo’s and Renan’s slides; only Earl’s slides 23–26 need more clicks. Rapid navigation cancels obsolete splits and counters. Motion off shows the same build states immediately.

The 3D models use three-band toon shading, ink outlines, and soft squash-and-stretch arrivals, without eyes. Desktop slides use more of the available height when controls are hidden. Phone slides scroll under their fixed navigation; changing slides returns to the top.

## Verify the presentation

With the dev server running at port 5199:

```sh
npx playwright install chromium
npm run check:interactions
npm run check:layout
npx vite build
```

The interaction check covers all 39 slide/build states, rapid reversals, counters, covers, quiz, lab, reading links, motion settings, and phone scrolling. The layout check captures all states at eight laptop, projector, and phone sizes in ignored `previews/upgrade/`, plus scrolled phone views. It fails on overflow or browser errors and records text-overlap and scene-slot candidates for visual review; font bounding boxes can overlap while the glyphs remain separate. Use `npm run check:layout -- 1366x768` for one size. Both checks accept `PRESENTATION_URL` for a different **dev server** URL; they import source modules and are not production smoke checks.

Phone review preview: https://group11-report-779241214444.asia-southeast1.run.app. This is separate from GitHub Pages; pushing `main` still requires Earl’s explicit approval.


## Title-first presentation and chapter entrances

Every content slide now opens with its title before Next reveals the original composition. The four economics slides retain their existing multi-step keynote builds. Opening and closing covers use larger type and emphasize Operations, Security, and Economics.

The Operations, Security, and Economics sections each begin with a distinct full-screen animated chapter card. Operations appears immediately after the opening cover, before “Online isn’t enough”; it does not repeat at “Resources. On demand.” Next, Space, or the Begin button opens the first title; Next again reveals the content. Back reverses those stages. Chapter cards do not add slide numbers or change existing slide URLs. The order remains Paulo → Renan → Earl. Reduced-motion mode preserves presenter control with immediate state changes.

Paulo’s and Renan’s title reveals move the same live heading from the centered statement into its content position using GSAP Flip, matching the economics build approach. Content animates separately; the heading does not fade out, duplicate, or replay its word reveal after docking.


### Foundation and Operations field guide

Four new slides follow the opening and precede the Operations chapter entrance: cloud definition, everyday services, scalability, and scalability versus elasticity. Five field-guide slides follow Incident Response and precede Security: monitoring/logs, recovery objectives and backups, automation guardrails, the six-stage response cycle, and eleven mistakes grouped by spending, exposure, and readiness. All nine belong to Paulo; stage copy stays brief while presenter notes and reader mode retain explanations and examples.

`src/additions.js` supplies these scenes and their art directions. `src/briefing.css` provides resource stacks, service portals, capacity comparisons, signal panels, recovery tiles, and a response sequence. They retain translation-only title movement and respect reduced motion. Desktop scenes fit the slide; phones stack content above the fixed navigation. Run `node tools/check-additions.mjs` for sequence, coverage, source, and design alignment checks.

The five Operations field-guide additions now use dedicated compositions in `src/operations-scenes.js` and `src/operations-scenes.css`: signal-to-evidence, a 3-2-1 recipe with recovery objectives, a control rail, a six-stage timeline, and a categorized mistakes ledger. All nine additions use concept-specific layouts. Decorative connectors that crossed resource labels and everyday icons have been removed; the elasticity legend uses the same dashed styling as its capacity line. Brand typography remains Syne 600, Instrument Serif, and Barlow Condensed.
