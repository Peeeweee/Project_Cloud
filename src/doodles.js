// Sketchbook doodles: after a title is written, a little hand-drawn mark is drawn beside it
// (sparks, a swirl, a star, a squiggle or a curly arrow), like someone annotating their notes.
// Each slide always gets the same doodle, so the deck looks deliberate rather than random.
import { gsap } from 'gsap';

const SVG = 'http://www.w3.org/2000/svg';
const BLUE = '#2f63bf', YELLOW = '#f2b705';
// [paths in a 60 x 40 box, colour]
const KINDS = [
  [['M10 32 L15 20', 'M24 28 L35 13', 'M36 36 L52 29'], YELLOW],                       // sparks
  [['M8 30 C8 12 38 10 35 24 C32 34 16 30 23 19 C30 9 50 12 55 5'], BLUE],              // swirl
  [['M30 6 L34 18 L47 18 L37 26 L41 38 L30 30 L19 38 L23 26 L13 18 L26 18 Z'], YELLOW], // star
  [['M4 30 Q12 16 20 30 T36 30 T52 30'], BLUE],                                          // squiggle
  [['M6 34 C20 36 31 28 27 18 C23 8 10 15 18 23 C26 31 44 27 54 12', 'M54 12 L45 13', 'M54 12 L53 21'], BLUE], // curly arrow
  [['M12 30 L16 22', 'M30 24 L30 10', 'M44 30 L48 22'], YELLOW]                          // burst
];

// The right end of the title's first line, relative to the title box.
function firstLineEnd(title) {
  // measure the text only (never the doodle itself)
  const rects = [], walk = document.createTreeWalker(title, NodeFilter.SHOW_TEXT);
  while (walk.nextNode()) {
    if (!walk.currentNode.textContent.trim() || walk.currentNode.parentElement.closest('.sk-doodle')) continue;
    const range = document.createRange(); range.selectNodeContents(walk.currentNode);
    rects.push(...[...range.getClientRects()].filter(r => r.width > 1 && r.height > 1));
  }
  if (!rects.length) return null;
  const top = Math.min(...rects.map(r => r.top));
  const line = rects.filter(r => r.top < top + rects[0].height * .5);
  const box = title.getBoundingClientRect();
  return { x: Math.max(...line.map(r => r.right)) - box.left, left: Math.min(...line.map(r => r.left)) - box.left, boxLeft: box.left, y: top - box.top, h: line[0].height };
}

function place(svg, title) {
  const end = firstLineEnd(title);
  if (!end) return false;
  const size = Math.max(34, Math.min(70, end.h * .62));
  // beside the end of the first line; on the left of its start when the right edge has no room
  let x = end.x + size * .12;
  if (end.boxLeft + x + size > innerWidth - 16) x = end.left - size * 1.1;
  svg.style.cssText = `left:${x}px;top:${end.y - size * .42}px;width:${size}px;height:${size * 2 / 3}px`;
  return true;
}

// Re-place a title's doodle after the title changed size or wrapped differently.
export function placeDoodle(title, { fade = false } = {}) {
  const svg = title?.querySelector(':scope > .sk-doodle');
  if (!svg) return;
  place(svg, title);
  if (fade) gsap.fromTo(svg, { opacity: 0 }, { opacity: 1, duration: .25, ease: 'power1.out' });
}
export function hideDoodle(title) {
  const svg = title?.querySelector(':scope > .sk-doodle');
  if (svg) { gsap.killTweensOf(svg); svg.style.opacity = '0'; }
}
addEventListener('resize', () => document.querySelectorAll('.sk-doodle').forEach(svg => place(svg, svg.parentElement)));

export function doodle(title, seed, { delay = 0 } = {}) {
  if (!title || !title.isConnected) return null;
  title.querySelectorAll(':scope > .sk-doodle').forEach(d => d.remove());
  if (getComputedStyle(title).position === 'static') title.style.position = 'relative';
  const [paths, color] = KINDS[Math.abs(seed) % KINDS.length];
  const svg = document.createElementNS(SVG, 'svg');
  svg.setAttribute('class', 'sk-doodle'); svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('viewBox', '0 0 60 40');
  if (!place(svg, title)) return null;
  const els = paths.map(d => {
    const p = document.createElementNS(SVG, 'path');
    p.setAttribute('d', d); p.style.stroke = color; svg.append(p); return p;
  });
  title.append(svg);
  const tl = gsap.timeline({ delay });
  els.forEach((p, i) => {
    const len = p.getTotalLength();
    p.style.strokeDasharray = `${len} ${len}`;
    tl.fromTo(p, { strokeDashoffset: len }, { strokeDashoffset: 0, duration: Math.min(.45, .15 + len / 260), ease: 'power1.inOut' }, i * .1);
  });
  return tl;
}
