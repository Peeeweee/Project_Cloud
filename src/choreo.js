// Word-by-word text motion shared by slide arrivals (main.js) and build steps (builds.js).
// Words rise out of a mask when text appears and lift away when it leaves; the split is
// reverted afterwards so layout, measurements and counters see the original markup.
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { sketch } from './theme.js';
import { inkWrite } from './ink.js';
gsap.registerPlugin(SplitText);

// Topmost elements inside `root` that hold their own visible text. Animated counters are
// skipped (their text is rewritten every frame), as are SVG labels and form controls.
export function textLeaves(root) {
  const leaves = [];
  const visit = el => {
    if (el.matches('[data-count],svg,input,select,textarea,.scene-slot,.kn-dots')) return;
    const ownText = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
    if (el !== root && el.matches('[data-build]:not(.is-on)')) return;
    if (ownText && !el.querySelector('[data-count],[data-build]')) { leaves.push(el); return; }
    [...el.children].forEach(visit);
  };
  visit(root);
  return leaves;
}

// One live split per element: rapid clicks restore the previous split before starting another.
const live = new Map();
export function clearWords(root) {
  for (const [leaf, entry] of live) {
    if (root === leaf || root.contains(leaf)) {
      gsap.killTweensOf(pieces(entry.split));
      entry.timer?.kill(); entry.tl?.kill();
      entry.split.revert();
      live.delete(leaf);
    }
  }
}
function freshSplit(leaf) {
  const old = live.get(leaf);
  if (old) { gsap.killTweensOf(pieces(old.split)); old.timer?.kill(); old.tl?.kill(); old.split.revert(); }
  const split = SplitText.create(leaf, { type: 'words', mask: 'words', aria: 'none' });
  const entry = { split };
  live.set(leaf, entry);
  const done = () => { if (live.get(leaf) === entry) { split.revert(); live.delete(leaf); } };
  return { split, entry, done };
}

const pieces = split => [...(split.words || []), ...(split.chars || [])];

// Sketchbook: headings are written in letter by letter, as if a pen traced them; other text
// simply fades in (the whole block around it fades too, so nothing jumps).
// Only big display text is written by pen; smaller headings, labels and anything inside a button or
// a flex/grid row just fade in, so busy slides stay calm and finish quickly.
const isHeading = leaf => {
  if (leaf.closest('button,[role=button],.quiz')) return false;
  const st = getComputedStyle(leaf);
  if (/flex|grid/.test(st.display)) return false;
  return parseFloat(st.fontSize) >= 34 && (leaf.matches('h1,h2,h3,strong,.kn-l1,.kn-l2') || !!leaf.closest('h1,h2,h3'));
};
function writeIn(leaf, delay) {
  const old = live.get(leaf);
  if (old) { gsap.killTweensOf(pieces(old.split)); old.timer?.kill(); old.tl?.kill(); old.split.revert(); }
  const split = SplitText.create(leaf, { type: 'words,chars', aria: 'none' });
  const entry = { split };
  live.set(leaf, entry);
  const chars = split.chars;
  const done = () => { if (live.get(leaf) === entry) { split.revert(); live.delete(leaf); } };
  // Preferred: each letter traced in ink along its real outline, then filled (ink.js).
  const ink = inkWrite(leaf, chars, delay, done);
  if (ink) { entry.tl = ink.tl; return ink.duration; }
  // Fallback while the font outlines are still loading: a left-to-right reveal per letter.
  const per = Math.min(.03, .45 / Math.max(chars.length, 1));
  gsap.fromTo(chars, { clipPath: 'inset(-30% 100% -30% -10%)' },
    { clipPath: 'inset(-30% -10% -30% -10%)', duration: .14, ease: 'none', delay, stagger: per, onComplete: done });
  return chars.length * per + .14;
}
// Returns when the last heading finishes writing (relative to `delay`).
function sketchIn(root, delay) {
  clearWords(root);
  let at = delay, end = delay;
  textLeaves(root).forEach(leaf => {
    if (isHeading(leaf)) { const d = writeIn(leaf, at); end = Math.max(end, at + d); at += Math.min(.25, d * .35); }
    else gsap.fromTo(leaf, { opacity: 0 }, { opacity: 1, duration: .3, delay: at, ease: 'power1.out', clearProps: 'opacity' });
  });
  return Math.max(end, at) - delay;
}

// Reveal the words of every text leaf in `root`, in reading order. Returns the total duration.
export function wordsIn(root, { delay = 0, stagger = .028, duration = .7 } = {}) {
  if (sketch) return sketchIn(root, delay);
  clearWords(root);
  let at = delay;
  textLeaves(root).forEach(leaf => {
    const { split, done } = freshSplit(leaf);
    gsap.fromTo(split.words, { yPercent: 115, opacity: 0 }, { yPercent: 0, opacity: 1, duration, delay: at, stagger, ease: 'power3.out', onComplete: done });
    at += Math.min(.35, split.words.length * stagger * .6);
  });
  return at - delay;
}

// Lift the words of `root` away (used when a label is swapped for another). The split is kept
// until the container has finished fading out, so the text never pops back mid-fade.
export function wordsOut(root, { duration = .4 } = {}) {
  clearWords(root);
  if (sketch) {
    textLeaves(root).forEach(leaf => gsap.to(leaf, { opacity: 0, duration: .18, ease: 'power1.in', onComplete: () => gsap.set(leaf, { clearProps: 'opacity', delay: .5 }) }));
    return;
  }
  textLeaves(root).forEach(leaf => {
    const { split, entry, done } = freshSplit(leaf);
    gsap.to(split.words, { yPercent: -115, opacity: 0, duration, stagger: .015, ease: 'power2.in', onComplete: () => { entry.timer = gsap.delayedCall(.6, done); } });
  });
}
