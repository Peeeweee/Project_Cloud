// Ink writing for the sketchbook theme: every letter of a heading is traced with a pen stroke along
// its real outline (taken from the handwriting font files), then filled in, one letter after another.
// The live text stays in the page the whole time (only made transparent), so layout never shifts.
import { parse } from 'opentype.js';
import { gsap } from 'gsap';
import { sketch } from './theme.js';
import fb400 from '@fontsource/fuzzy-bubbles/files/fuzzy-bubbles-latin-400-normal.woff?url';
import fb700 from '@fontsource/fuzzy-bubbles/files/fuzzy-bubbles-latin-700-normal.woff?url';
import ph400 from '@fontsource/patrick-hand/files/patrick-hand-latin-400-normal.woff?url';

const fonts = {};
const load = (key, url) => fetch(url).then(r => r.arrayBuffer()).then(b => { fonts[key] = parse(b); }).catch(() => {});
export const inkReady = sketch ? Promise.all([load('fb400', fb400), load('fb700', fb700), load('ph400', ph400)]) : Promise.resolve();

function fontFor(style) {
  const family = style.fontFamily.toLowerCase(), bold = parseInt(style.fontWeight, 10) >= 600;
  if (family.startsWith('"fuzzy') || family.startsWith('fuzzy')) return fonts[bold ? 'fb700' : 'fb400'];
  if (family.startsWith('"patrick') || family.startsWith('patrick')) return fonts.ph400;
  return null;
}

const SVG = 'http://www.w3.org/2000/svg';

// Returns { paths, duration } after starting the animation, or null when the font is not loaded
// (the caller then uses the simpler reveal). `chars` are SplitText character elements.
export function inkWrite(leaf, chars, delay, onDone) {
  const style = getComputedStyle(leaf);
  const font = fontFor(style);
  if (!font || !chars.length) return null;
  const size = parseFloat(style.fontSize), upper = style.textTransform === 'uppercase';
  const ink = style.color;
  // Find each character's baseline with a zero-height probe (read all, then write, to avoid thrash).
  const probes = chars.map(ch => {
    const p = document.createElement('span');
    p.style.cssText = 'display:inline-block;width:0;height:0;vertical-align:baseline';
    ch.append(p); return p;
  });
  const baselines = probes.map(p => p.offsetTop);
  probes.forEach(p => p.remove());
  const paths = [];
  chars.forEach((ch, i) => {
    let text = ch.textContent; if (upper) text = text.toUpperCase();
    const d = font.getPath(text, 0, baselines[i], size).toPathData(2);
    if (!d) return;
    const svg = document.createElementNS(SVG, 'svg');
    svg.setAttribute('class', 'sk-ink'); svg.setAttribute('aria-hidden', 'true');
    svg.style.cssText = 'position:absolute;left:0;top:0;width:1px;height:1px;overflow:visible;pointer-events:none';
    const path = document.createElementNS(SVG, 'path');
    path.setAttribute('d', d);
    path.style.cssText = `fill:${ink};fill-opacity:0;stroke:${ink};stroke-width:${Math.max(1, size * .028)}px;stroke-linejoin:round;stroke-linecap:round`;
    svg.append(path); ch.append(svg);
    ch.style.color = 'transparent'; ch.style.webkitTextFillColor = 'transparent';
    paths.push(path);
  });
  if (!paths.length) return null;
  const lengths = paths.map(p => p.getTotalLength() || 1);
  paths.forEach((p, i) => { p.style.strokeDasharray = lengths[i]; p.style.strokeDashoffset = lengths[i]; });
  // One steady pen: each letter takes about a quarter second and the next starts before it ends,
  // so two or three letters are in progress at once; a whole line stays within about 1.2 s.
  const per = Math.min(.085, 1 / paths.length), draw = .26;
  const tl = gsap.timeline({ delay, onComplete: onDone });
  paths.forEach((p, i) => {
    tl.to(p, { strokeDashoffset: 0, duration: draw, ease: 'power1.inOut' }, i * per);
    tl.to(p, { fillOpacity: 1, duration: .22, ease: 'power1.out' }, i * per + draw * .7);
  });
  return { tl, paths, duration: (paths.length - 1) * per + draw + .1 };
}

// Put the live text back and remove the drawings.
export function inkClear(chars) {
  chars.forEach(ch => {
    ch.querySelectorAll(':scope > .sk-ink').forEach(s => s.remove());
    ch.style.color = ''; ch.style.webkitTextFillColor = '';
  });
}
