# GROUP 11 — CLOUD ECONOMICS, OPERATIONS, AND SECURITY

Latest implementation correction (October 27): model/text layout is governed by reserved `.scene-slot` rectangles, per-scene camera fitting, projected captions, and isometric diagram views. See `PRESENTATION_AUDIT.md` for screenshot-driven findings and the current desktop, projector, tablet, and phone verification. This supersedes any earlier proposal to freely position foreground models behind slide text.

## Cloud Economics, Operations, and Security

Theme: cinematic space imagery inspired by The Martian's visual atmosphere and themes of resilience, protection, and resourcefulness. The report stays directly about cloud computing. Use original visual assets and branding.

Status: implemented and deployed to GitHub Pages (https://peeeweee.github.io/Project_Cloud/) from `main`. Twenty-two slides — twenty report slides, the interactive Cloud Lab (21), and a closing title reprise (22) — with procedural Three.js visuals, presenter-controlled depth transitions, reading view, speaker notes, source references, interactive examples, and phone layouts.

Implementation title: **Beyond the cloud.** The academic subtitle remains **Cloud economics, operations & security**. The opening begins in black space with a restrained horizon and a manual Enter control.

User-selected format: approximately 18–22 minutes; slide presentation plus scrolling reading view; balanced rendering for integrated graphics with an optional high-detail setting. Real-time 3D depth and transitions are part of the visual language. The renderer draws on demand rather than running an endless background animation loop.

## Content and branding direction

The movie supplies visual inspiration, not the presentation's plot. Remove the fictional Mars habitat mission, crew roles, supply narrative, and HABITAT 11 title. Brand the presentation as GROUP 11 with its actual academic title.

One brief spoken acknowledgment near the introduction is enough: “Our visual theme takes inspiration from The Martian: keeping essential systems working, protecting what matters, and making limited resources count. Those ideas connect to cloud operations, security, and economics.” Do not retell the film or repeat movie references through the slides. Treat security as our conceptual connection, not a claim that the movie teaches cybersecurity.

The content progresses through cloud operations, security, and economics using actual cloud diagrams and clearly labeled teaching examples.

Presentation order: Kent Paulo Delgado (Paulo) → John Renan Labay (Renan) → Earl Josh Delgado (Earl).

Core line: Keep it running. Protect access. Make resources count.

## Visual system

- Rust orange #B94725: large graphic areas and active emphasis.
- Warm ivory #F3EEE5: primary reading background.
- Basalt #202321: dark backgrounds and body text.
- Dust #C9B7A5: secondary surfaces and diagram fills.
- Signal yellow #F0CF65: occasional warning emphasis on dark surfaces.
- Use large bold sans-serif headlines and a readable sans-serif body. Monospace is limited to small coordinates or identifiers, not body copy.
- Design for a 16:9 presentation canvas; adapt into a vertically readable layout on small screens.
- Main slide body text should generally be 28–36px at a 1920px-wide presentation viewport. Footnotes must remain readable. Never shrink content to fit an overloaded slide.
- Black space, restrained planetary horizons, rust-colored surface textures, orbital arcs, dramatic scale, editorial labels, and clear cloud architecture diagrams establish the visual theme. Space imagery frames content rather than replacing technical explanations.
- Maintain text contrast; do not use muted dust colors for essential small text. Label status with words as well as color.
- Use quiet editorial compositions and large areas of empty space. Avoid filling every slide with dashboard panels.

## Motion and interaction

Opening: begin on near-total black (#050607), with generous empty space and hidden navigation chrome. A small, accessible Begin control is available. On activation, a subtle light edge or planetary horizon appears, followed by the actual academic title and GROUP 11. The opening is skippable and requires no timed wait. No opening habitat or fictional mission premise.

No terminal startup, scrolling code, typewriter text, simulated command execution, mandatory loading sequence, automatic slide advance, or continuously moving backgrounds.

Transition vocabulary: a slow-feeling but brief cinematic fade for the opening (roughly 700–1000ms, skippable); restrained crossfades or short spatial shifts (roughly 250–450ms) within sections; a horizon or surface crop change for speaker handoffs. Avoid flashes, spinning objects, particle storms, and ornamental animations on every element. Cancel pending transitions on rapid navigation and remove all nonessential motion in reduced-motion mode.

Slides must look finished when paused. Use short fades or position changes only to explain relationships. All important reveals are presenter controlled. Reduced-motion mode shows content immediately. Interactive controls must not also advance the slide.

## Storyboard

| # | Presenter | Headline | Visible content and composition | Explanation / reveal |
|---|---|---|---|---|
| 1 | Paulo | CLOUD ECONOMICS, OPERATIONS, AND SECURITY | Begin with black empty space; reveal a restrained planetary light edge, actual report title, GROUP 11, and team names | Presenter activates the opening. Introduce the topic and give the single brief acknowledgment of the visual inspiration. |
| 2 | Paulo | ONLINE DOES NOT MEAN READY. | Cloud application marked Online; three concealed annotations | Reveal untested recovery, outdated access, and untracked spending. These are separate risks in a fictional scenario. |
| 3 | Paulo | WHAT IS CLOUD COMPUTING? | Application linked to compute, storage, and networking | Define cloud computing and briefly distinguish IaaS, PaaS, SaaS. Explain which service model the following examples use. |
| 4 | Paulo | KEEP THE SYSTEM WORKING. | A cloud-system overview showing watch, maintain, automate, recover | Define CloudOps directly using a familiar web application. |
| 5 | Paulo | NOTICE THE CHANGE. FIND THE CAUSE. | One clear usage graph beside a short event timeline | Distinguish metrics, application logs, audit logs, and alerts. Label all incident data as simulated. |
| 6 | Paulo | HOW MUCH CAN WE LOSE? | Large recovery timeline with two separately labeled intervals | Explain RPO as acceptable data loss and RTO as target recovery duration. Discuss protected backups and restore tests. |
| 7 | Paulo | PREPARE FOR THE BAD DAY. | Detect → contain → investigate → recover → improve, arranged as an incident-response workflow | Use leaked cloud credentials as an example. Explain containment, evidence preservation, automation, and learning. Transition to access controls. |
| 8 | Renan | KNOW YOUR SIDE OF THE BOUNDARY. | Cutaway divided into provider and customer responsibility | Explain shared responsibility for IaaS and how responsibility changes by service model. Introduce confidentiality, integrity, availability. |
| 9 | Renan | ACCESS SHOULD HAVE LIMITS. | Two distinct identity cards: Linux root and AWS account root | Explain the difference, named identities, least privilege, restricted sudo, root MFA, and avoiding root access keys. |
| 10 | Renan | EVERY ENTRANCE NEEDS A RULE. | Cloud network boundary diagram paired with an actual network rule | Explain source, destination, protocol, port, direction. Default deny is the intended policy, not a claim about every default configuration. |
| 11 | Renan | TWO BOUNDARIES. DIFFERENT RULES. | Network interface and subnet boundaries, request and reply arrows | Compare security groups and NACLs: stateful vs stateless, allow vs allow/deny, combined evaluation vs numbered order. Explain default/custom exceptions in notes. |
| 12 | Renan | PROVE IDENTITY. KEEP THE SECRET. | Client and server on opposite sides; private key remains on client | Explain SSH signatures proving possession. Separate user authentication from server host-key verification. No code demonstration. |
| 13 | Renan | CONTROL THE KEY'S ENTIRE LIFE. | Create → protect → use → revoke, with an individual administrator identity | Cover individual keys, passphrases, protected storage, restricted connectivity, removal, and leak response. A simple key alone does not automatically provide MFA. |
| 14 | Earl | EVERY RESOURCE HAS A COST. | A direct cloud cost stack: compute, storage, networking, and administration | Introduce CapEx, OpEx, and full TCO. Use actual currency units and label teaching assumptions. |
| 15 | Earl | THE LOWER RATE CAN COST MORE. | On-Demand and commitment comparison, switch between always-on and part-time | Sample $0.10/hour and 40% commitment discount: $73 vs $43.80 at 730 hours; $17.60 vs $43.80 at 176 hours. Label all assumptions. Spot is a separate interruptible option. |
| 16 | Earl | GROW FOR THE PEAK. SHRINK AFTER. | Resource modules expand with a demand graph | Sample 2 instances × 730h plus 18 × 24h at $0.10/h = $189.20 vs 20 × 730h = $1,460. These are rented compute comparisons, not hardware purchase TCO. |
| 17 | Earl | MAKE EVERY RESOURCE ACCOUNTABLE. | Inform → optimize → operate; a spare resource marked with its owner | Explain FinOps, tags, right-sizing, idle resources, transfer costs, and budget alerts. Notifications are not guaranteed spending caps. |
| 18 | Earl | ONE SYSTEM. CONNECTED CONTROLS. | Full architecture assembled from the same visual elements used earlier | Show visitor HTTPS route, separate administrator route, app, private database, monitoring, audit logs, protected backups, and budgets. Distinguish management MFA from SSH keys. |
| 19 | Earl / All | A CLOUD CREDENTIAL HAS LEAKED. | Fictional exposed cloud credential, unknown resources, spending spike; audience chooses a response | Ask what to do first. Reveal credential containment, investigation and unauthorized resource handling, then recovery and prevention. Do not imply open SSH caused API credential theft. |
| 20 | All, led by Earl | KEEP IT RUNNING. PROTECT ACCESS. MAKE RESOURCES COUNT. | Return to the black-space composition with the three cloud takeaways and a restrained planetary horizon | Paulo closes reliability, Renan closes security, Earl closes economics and opens Q&A. |
| 21 | All | CLOUD, IN YOUR HANDS. | Interactive Cloud Lab: pricing hours, elastic vs fixed fleet, four-step incident walkthrough | Optional 2–3 minute recap. Earl runs pricing and elasticity, Renan the incident steps, Paulo detection and recovery checks. |
| 22 | All | BEYOND THE CLOUD. | The opening title cover, reprised | Stays on screen during questions. |

Target duration: 18–22 minutes plus Q&A. Adjust after timed rehearsal. Never force equal speaking time by rushing dense sections.

## Speaker handoffs

Paulo → Renan: We know how to watch the system and recover when it fails. Renan will explain who should be able to reach and control it.

Renan → Earl: Controlled access protects the system and its resources. Earl will explain how we choose capacity and manage the cost.

## Report depth and appendix

Provide a reading view with explanations, glossary, sources, and speaker-independent definitions. Appendix: home vs VPS TCO with comparable-workload assumptions; break-even; SLA/RPO/RTO; service models; Well-Architected framework; sourced incident cases; optional SSH/firewall reference; defense questions; confirmed connections to classmates' reports.

Keep code snippets out of the main presentation. Technical commands may exist in an explicitly opened appendix reference.

## Build architecture

- Static Vite + TypeScript site suitable for GitHub Pages. Confirm the repository name before setting deployment base path.
- Maintain slide text, notes, source references, presenter ownership, and reading-view content in structured data.
- Use original SVG/CSS diagrams for editable technical visuals. Use custom raster art only where landscape imagery adds value.
- Presentation view, reading view, chapter menu, hash-based slide links, print stylesheet, keyboard navigation, fullscreen control, and a separate notes view.
- Speaker notes shipped in a public static site are public data; keep credentials and private information out of them.
- Bundle essential fonts and assets; prepare a local production build for rehearsal and a printable backup.
- Use native buttons, accessible labels, visible focus, and hide inactive slides from keyboard and assistive-technology navigation.

## Production sequence

1. Verify technical facts and select primary sources; keep illustrative prices explicitly labeled.
2. Finalize exact visible slide text and speaker scripts.
3. Build three representative slide compositions: 1 (identity), 6 (explanation), 15 (data).
4. Review at presentation size for visual consistency, contrast, readability, and density.
5. Implement the remaining slides using the approved visual system.
6. Add reading view, appendix, notes, navigation, print support, and responsive layouts.
7. Check calculations, citations, asset loading, keyboard behavior, reduced motion, and overflow.
8. Rehearse in speaker order, refine timing, and test the GitHub Pages production path.
9. Deploy when requested and verify the published site.

## Completion criteria

All 22 slides have a clear message and correct presenter; no code or terminal gimmicks appear in the main flow; static slides remain visually compelling; sample numbers and historical claims are distinguishable; every major technical claim has a supporting source; production assets load under the correct Pages path; navigation, reading view, print layout, and responsive layouts work; team handoffs and timings survive a full rehearsal.


## Second design edition — implemented

The repeated text-left/object-right composition has been replaced by individually composed slides (twenty in this edition; the Cloud Lab and title reprise were added later, for twenty-two), nineteen scene configurations, eleven transition families, and four palette treatments. This implementation table supersedes the earlier visual composition column. Speaker order and technical content are retained. The black-space opening is retained. Pricing controls adjust physical tower height; the elasticity control assembles 2 or 20 instances. Motion is presenter-controlled and respects reduced-motion settings.

| Slide | Presenter | Composition | 3D scene | Entrance | Palette |
|---|---|---|---|---|---|
| 1 | Paulo | horizon | planet | horizon | dark |
| 2 | Paulo | faults | fracture | fracture | dark |
| 3 | Paulo | terraces | platforms | assemble | paper |
| 4 | Paulo | orbital | systems | orbit | dark |
| 5 | Paulo | signal | satellite | scan | dark |
| 6 | Paulo | time | snapshots | traverse | paper |
| 7 | Paulo | procedure | terrain | rise | rust |
| 8 | Renan | boundary | shared | split | split |
| 9 | Renan | privilege | privilege | elevate | dark |
| 10 | Renan | corridor | corridor | dive | dark |
| 11 | Renan | duality | boundaries | split | paper |
| 12 | Renan | proof | authentication | traverse | dark |
| 13 | Renan | lifecycle | key | orbit | dark |
| 14 | Earl | ownership | cost | rise | paper |
| 15 | Earl | price-duel | price | elevate | dark |
| 16 | Earl | expansion | elastic | assemble | dark |
| 17 | Earl | cycle | finops | orbit | paper |
| 18 | Earl | blueprint | architecture | assemble | dark |
| 19 | Earl | decision | alert | impact | rust |
| 20 | All | finale | planet | horizon | dark |
| 21 | All | lab | price (changes with lab mode) | assemble | dark |
| 22 | All | horizon | planet | horizon | dark |

Validation: see `PRESENTATION_AUDIT.md` for the current checks. No physical GPU benchmark has been performed.
