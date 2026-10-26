# Group 11 — Beyond the Cloud

A cinematic, original Mars-inspired browser presentation on cloud economics, operations, and security. Speaker order: **Paulo → Renan → Earl**. Twenty-one slides, including a final reprise of the opening title, approximately 18–22 minutes plus questions.

## Run locally

Requires Node.js 22.12+ (or a compatible recent release).

```sh
npm ci
npm run dev
```

Open the URL printed by Vite. `npm run build` creates `dist/`; `npm run preview` serves that production build.

## Present

- Arrow keys / Space: navigate. Home / End: first / last slide.
- N: speaker notes. C: contents. R: reading view. F: fullscreen. H: show/hide controls.
- Presentation utilities start hidden. The discreet top-right eye button reveals the top menu, source links, and bottom navigation together. Your choice is remembered in this browser. Arrow-key navigation works while controls are hidden. Reading view keeps its navigation available.
- Escape: close a panel. Focused buttons retain their normal keyboard behavior.
- Settings: balanced/high 3D detail and motion toggle. Reduced-motion device settings are respected initially.
- Reading view: detailed explanations, glossary, defense questions, source links, and sample calculations.
- Print / save PDF: generates a text report from the same content.

The opening is manually activated and skippable. No sound plays. Essential assets are bundled; external source links require a connection. To rehearse without internet, build first and serve `dist/` locally with the preview command. A hosted page is not guaranteed available offline after closing its browser tab.

## GitHub Pages

Push this project to a repository with a `main` branch. In **Settings → Pages → Build and deployment**, select **GitHub Actions**. The included workflow builds and publishes `dist/`. This project uses relative asset paths, so the repository name does not need to be embedded in the build. Do not upload `node_modules/`.

The workflow has been prepared locally; no repository was created and no public deployment was performed by this build task.

## Edit

- `src/content.js`: slide order, presenter, speaker notes, reading text, sources, glossary, defense questions.
- `src/main.js`: layouts, controls, reading view, print output.
- `src/direction.js`: twenty individual compositions, scene poses, palettes, and transition choices.
- `src/scene.js`: original procedural Three.js objects, textured Mars and terrain shaders, spatial transitions, interactive resource scenes, quality controls.
- `src/style.css`: shared interface, reading view, and print styles.
- `src/redesign.css`: slide-specific editorial layouts and responsive art direction.
- `src/layout-fixes.css`: reserved scene areas, diagram-caption alignment, contrast, and cross-viewport corrections.
- `src/branding.css`: reference-inspired typography, cover composition, planet atmosphere, and responsive branding.
- `REPORT_BLUEPRINT.md`: design and content plan.
- `PRESENTATION_AUDIT.md`: screenshot-driven findings, structural fixes, and validation scope.

Illustrative prices are not live quotes. Technical summaries are based on the supplied defense guide and linked primary references. The report corrects several oversimplifications in the source guide, including root credential management, SSH encryption and authentication, security-group defaults, and the difference between budget alerts and spending caps.

Visual inspiration: *The Martian*. No movie stills, logos, copied branding, or external models are used. Geometry is generated procedurally; the planet uses a bundled NASA/JPL/USGS Viking surface map with artistic lighting and color grading. Asset credits are in `public/credits.txt`. FinOps phase terminology is attributed to the FinOps Foundation. Speaker notes are public content when the site is published.

The second design edition replaces the repeated text/object layout with a horizon title, risk triptych, physical service terraces, orbital operations map, panoramic signal chart, large recovery intervals, incident procedure, split responsibility boundary, privilege comparison, firewall corridor, network-control comparison, authentication path, diagonal key lifecycle, ownership poster, pricing duel, capacity field, FinOps loop, isometric architecture, audience decision, and landscape finale. Motion includes assembly, separation, orbit, traversal, camera dive, elevation, impact, and horizon reveals. The pricing and elasticity controls update actual 3D geometry.

The October 27 layout audit introduces a shared coordinate contract: each slide's `.scene-slot` defines its WebGL viewport and clipping boundary. Models fit inside that area; object captions use projected anchors below it. Isometric cameras keep diagram sizes consistent, while cinematic scenes retain perspective. Do not position foreground models against the whole window independently of slide copy.

The opening and closing titles share the reference-inspired cover. Syne supplies wide display headings, Instrument Serif Italic supplies editorial subtitles, and Barlow Condensed supplies labels, names, controls, and reading text. These are close visual matches chosen from the reference image; exact fonts cannot be extracted from a bitmap. Font files and their SIL Open Font License notices are bundled locally.
