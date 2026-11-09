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

// Matches the size boost the sketch @font-face rules give each face (sketchbook.css).
function fontFor(style) {
  const family = style.fontFamily.toLowerCase(), bold = parseInt(style.fontWeight, 10) >= 600;
  if (family.startsWith('"fuzzy') || family.startsWith('fuzzy')) return fonts[bold ? 'fb700' : 'fb400'] && { font: fonts[bold ? 'fb700' : 'fb400'], boost: 1.12 };
  if (family.startsWith('"patrick') || family.startsWith('patrick')) return fonts.ph400 && { font: fonts.ph400, boost: 1.10 };
  return null;
}

const SVG = 'http://www.w3.org/2000/svg';
let uid = 0;

// Draws the letters of `leaf` with a pen, on top of the untouched text: nothing in the page is split
// or moved, so spacing and line breaks stay exactly as they are. Returns { tl, duration, cleanup },
// or null when the font outlines are not loaded (the caller then uses a simpler reveal).
export function inkWrite(leaf, delay, onDone) {
  if (!fontFor(getComputedStyle(leaf))) return null;
  // every visible character, where the browser already placed it
  const items = [];
  const walk = document.createTreeWalker(leaf, NodeFilter.SHOW_TEXT);
  while (walk.nextNode()) {
    const node = walk.currentNode, el = node.parentElement, text = node.textContent;
    if (el.closest('svg')) continue;
    for (let i = 0; i < text.length; i++) {
      if (/\s/.test(text[i])) continue;
      const r = document.createRange(); r.setStart(node, i); r.setEnd(node, i + 1);
      const rect = [...r.getClientRects()].find(q => q.width > 0);
      if (rect) items.push({ ch: text[i], el, node, i, rect });
    }
  }
  if (!items.length) return null;
  // font, size, colour and baseline per element (a heading can hold smaller text in a span)
  const looks = new Map();
  for (const it of items) {
    if (looks.has(it.el)) continue;
    const st = getComputedStyle(it.el), face = fontFor(st);
    if (!face) return null;
    // a zero-size probe placed just before the element's first letter sits on its baseline
    const probe = document.createElement('span');
    probe.style.cssText = 'display:inline-block;width:0;height:0;vertical-align:baseline';
    const r = document.createRange(); r.setStart(it.node, it.i); r.insertNode(probe);
    const offset = probe.getBoundingClientRect().top - it.rect.top;
    const parent = probe.parentNode; probe.remove(); parent.normalize();
    looks.set(it.el, { font: face.font, size: parseFloat(st.fontSize) * face.boost, ink: st.color, upper: st.textTransform === 'uppercase', offset });
  }
  // the drawing lives inside the leaf so it moves with it
  const restore = { position: leaf.style.position, color: leaf.style.color, fill: leaf.style.webkitTextFillColor };
  if (getComputedStyle(leaf).position === 'static') leaf.style.position = 'relative';
  const origin = leaf.getClientRects()[0] || leaf.getBoundingClientRect();
  const ox = origin.left + leaf.clientLeft, oy = origin.top + leaf.clientTop;
  const svg = document.createElementNS(SVG, 'svg');
  svg.setAttribute('class', 'sk-ink'); svg.setAttribute('aria-hidden', 'true');
  svg.style.cssText = 'position:absolute;left:0;top:0;width:1px;height:1px;overflow:visible;pointer-events:none';
  let defs = '';
  const paths = [];
  items.forEach(it => {
    const look = looks.get(it.el), ch = look.upper ? it.ch.toUpperCase() : it.ch;
    const d = look.font.getPath(ch, it.rect.left - ox, it.rect.top + look.offset - oy, look.size).toPathData(2);
    if (!d) return;
    // A fat pen moves along the letter's own outline, clipped to the letter, so the solid letter is
    // painted in exactly its final shape: no hollow stage, no extra outline, no change in weight.
    const id = `sk-ink-${++uid}`;
    defs += `<clipPath id="${id}"><path d="${d}"/></clipPath>`;
    const path = document.createElementNS(SVG, 'path');
    path.setAttribute('d', d); path.setAttribute('clip-path', `url(#${id})`);
    path.style.cssText = `fill:${look.ink};fill-opacity:0;stroke:${look.ink};stroke-width:${look.size * .3}px;stroke-linejoin:round;stroke-linecap:round`;
    paths.push(path);
  });
  if (!paths.length) { leaf.style.position = restore.position; return null; }
  svg.innerHTML = defs; paths.forEach(p => svg.append(p));
  leaf.append(svg);
  leaf.style.color = 'transparent'; leaf.style.webkitTextFillColor = 'transparent';
  const cleanup = () => {
    svg.remove();
    leaf.style.color = restore.color; leaf.style.webkitTextFillColor = restore.fill; leaf.style.position = restore.position;
  };
  const lengths = paths.map(p => p.getTotalLength() || 1);
  paths.forEach((p, i) => { p.style.strokeDasharray = `${lengths[i]} ${lengths[i]}`; p.style.strokeDashoffset = lengths[i]; });
  // An even pen: longer letters take a little longer, and the next letter starts as this one is
  // finishing. A whole line stays within about 1.2 s.
  const per = Math.min(.075, .95 / paths.length);
  const tl = gsap.timeline({ delay, onComplete: () => { cleanup(); onDone?.(); } });
  paths.forEach((p, i) => {
    const draw = Math.max(.16, Math.min(.36, lengths[i] / parseFloat(p.style.strokeWidth) * .0135));
    tl.to(p, { strokeDashoffset: 0, duration: draw, ease: 'sine.inOut' }, i * per);
    // seal any tiny gap the pen missed, right as it lifts
    tl.to(p, { fillOpacity: 1, duration: .08, ease: 'none' }, i * per + draw * .9);
  });
  return { tl, cleanup, duration: tl.duration() + .05 };
}
