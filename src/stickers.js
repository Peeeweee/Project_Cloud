// Tenor stickers on the slides (sketch theme only, hidden on phones). Linked from Tenor's hosted
// files, not copied into this repo, so they need a connection.
// One entry per slide id: `at` is [left, top, width] in % of the slide's content area (.scene-content);
// `tilt` is in degrees. Use Tenor's transparent sticker file (the ".../AAAAj/..." GIF) when there is one.
// The cover bird and the closing-slide stickers live in direction.js.
const STICKERS = {
  // slide 2, "Computing. On demand.": a bird riding a cloud, under the subtitle
  'what-is-cloud': { src: 'https://media.tenor.com/Twvtwo133j4AAAAj/blue-bird-white-cloud.gif', at: [4.7, 56.7, 22.5], tilt: -3 },
  // slide 3, "Already in your day.": a cute cloud face, under the subtitle
  'cloud-in-real-life': { src: 'https://media.tenor.com/BSWoINes20cAAAAj/pop-cloud-cute.gif', at: [58.6, 42.6, 25], tilt: 2 },
  // slide 6, "Online isn't enough.": a grumpy "nope" pigeon standing on the line above 01 Recovery
  // (`bottom` replaces the top value: % from the bottom of the content area, so its feet stay on the line)
  'online-is-not-enough': { src: 'https://media.tenor.com/yr6uTGRWk7gAAAAj/no-nope.gif', at: [8.4, 0, 12.5], bottom: 17.1 },
  // slide 7, "Resources. On demand.": a waving pug peeking up from the bottom-right corner of the screen
  // (`style` is raw CSS; the content area ends about 4.3vw from the right and 82px above the bottom of the screen)
  'cloud-basics': { src: 'https://media.tenor.com/JH48dYQQ9eIAAAAj/puglie-pug.gif', style: 'right:-.3vw;bottom:calc(-82px - 1.34vw);width:12.2vw' },
  // slide 10, "Plan for the gap.": a puzzled puppy among question marks, standing on a black line above the title
  // (`line` is raw CSS for a drawn black line)
  'recovery': { src: 'https://media.tenor.com/panLmHu0n5QAAAAj/asking-who.gif', style: 'left:42.7%;bottom:calc(100% + 8px);width:12.33%', line: 'left:32.1%;top:-17px;width:35.75%' },
  // slide 12, "Notice. Then investigate.": a pointing detective, under the subtitle
  'operations-signals': { src: 'https://media.tenor.com/1uPJyqC15oIAAAAj/hardiboiled-khaiani.gif', at: [9, 68.05, 13.9] },
  // slide 15, "Practice the whole response.": Bubu skipping rope (practice), under the Contain step
  'incident-response-cycle': { src: 'https://media.tenor.com/bGGgsm4yPmEAAAAj/bubu-bubu-bear.gif', at: [40.9, 72.5, 11.86] },
  // slide 17, "Know your side.": a "yikes" face in place of the 3D boxes (`hideModel` hides the slide's 3D drawing)
  'shared-responsibility': { src: 'https://media.tenor.com/9JXgjbVIr3gAAAAj/yikes.gif', at: [38.9, 33.6, 22], hideModel: true },
  // slide 18, "Power needs limits.": a "no sir" bunny sitting just above the big ≠ sign, between two upright
  // black lines; the right one covers the GIF's cut-off edge, so the blob seems to lean in from behind it
  // (`vlines` is raw CSS for upright black lines)
  'root-access': { src: 'https://media.tenor.com/_7bzzqNht2MAAAAj/no-nosir.gif', at: [41.9, 32, 15],
    vlines: ['left:40.3%;top:26%;height:74.5%', 'left:56.8%;top:26%;height:74.5%'] },
  // slide 20, "Every path needs a rule.": a thumbs-up "yup" blob in place of the 3D frames, above "Controlled boundary"
  'firewalls': { src: 'https://media.tenor.com/5j5wYeZ8YdwAAAAj/yup-yupforreal.gif', at: [44.33, 37.1, 13], hideModel: true },
  // slide 31, "A key leaks. What comes first?": a flashing siren in place of the 3D warning triangle
  'decision': { src: 'https://media.tenor.com/LyKQAcYxkhUAAAAj/flashing-police-light-siren-gif.gif', at: [-2.46, 0.18, 18.75], hideModel: true },
  // slide 19, "Power needs a safe path.": a cat knight with sword and shield, in place of the vault dial
  // (the dial is hidden in sketchbook.css)
  'root-safeguards': { src: 'https://media.tenor.com/PAK_TkeIsvUAAAAj/cute-defense.gif', at: [79.4, 6.1, 18.75] },
};

export function stickerFor(id) {
  const s = STICKERS[id];
  if (!s) return '';
  let place = s.style;
  if (!place) {
    const [left, top, width] = s.at;
    place = `left:${left}%;${s.bottom != null ? `bottom:${s.bottom}%` : `top:${top}%`};width:${width}%`;
  }
  const line = (s.line ? `<span class="sk-slide-line" aria-hidden="true" style="${s.line}"></span>` : '')
    + (s.vlines || []).map(v => `<span class="sk-slide-line sk-slide-vline" aria-hidden="true" style="${v}"></span>`).join('');
  const hide = s.hideModel ? '<span class="sk-hide-model" hidden></span>' : '';
  return `${hide}${line}<span class="sk-slide-sticker" aria-hidden="true" style="${place};--tilt:${s.tilt || 0}deg">`
    + `<img src="${s.src}" alt="" referrerpolicy="no-referrer" decoding="async"></span>`;
}
