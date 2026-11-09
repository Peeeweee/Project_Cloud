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

// One live animation per element: rapid clicks stop the previous one (and restore the text)
// before starting another.
const live = new Map();
function stop(entry) {
  if (entry.split) gsap.killTweensOf(pieces(entry.split));
  entry.timer?.kill(); entry.tl?.kill(); entry.cleanup?.(); entry.split?.revert();
}
export function clearWords(root) {
  for (const [leaf, entry] of live) {
    if (root === leaf || root.contains(leaf)) { stop(entry); live.delete(leaf); }
  }
}
function freshSplit(leaf) {
  const old = live.get(leaf);
  if (old) stop(old);
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
// The text itself is never split or re-flowed in the sketch theme, so its spacing never changes
// when an animation ends: the pen drawing sits on top of the untouched text (ink.js).
function writeIn(leaf, delay) {
  const old = live.get(leaf);
  if (old) { stop(old); live.delete(leaf); }
  const entry = {};
  live.set(leaf, entry);
  const ink = inkWrite(leaf, delay, () => { if (live.get(leaf) === entry) { entry.cleanup?.(); live.delete(leaf); } });
  if (ink) { entry.tl = ink.tl; entry.cleanup = ink.cleanup; return ink.duration; }
  live.delete(leaf);
  return riseIn(leaf, delay) + .3; // outlines still loading: the line simply rises in
}
// Other text rises in as a whole line, the way it will finally sit on the page.
function riseIn(leaf, delay) {
  const move = getComputedStyle(leaf).display !== 'inline' && canMove(leaf);
  gsap.fromTo(leaf, { opacity: 0, ...(move ? { y: 10 } : {}) },
    { opacity: 1, ...(move ? { y: 0 } : {}), duration: .5, delay, ease: 'power3.out', overwrite: 'auto', clearProps: move ? 'opacity,transform' : 'opacity' });
  return .06;
}

// Returns when the last heading finishes writing (relative to `delay`).
function sketchIn(root, delay) {
  clearWords(root);
  let at = delay, end = delay;
  textLeaves(root).forEach(leaf => {
    if (isHeading(leaf)) { const d = writeIn(leaf, at); end = Math.max(end, at + d); at += Math.min(.25, d * .35); }
    else at += riseIn(leaf, at);
  });
  return Math.max(end, at) - delay;
}

// Can `el` be moved with a transform without shifting positioned content inside it? (A transform
// makes the element the containing block of its absolutely positioned descendants.)
export function canMove(el) {
  if (getComputedStyle(el).position !== 'static') return true;
  for (const d of el.querySelectorAll('*')) {
    const p = getComputedStyle(d).position;
    if (p === 'fixed' || (p === 'absolute' && !el.contains(d.offsetParent))) return false;
  }
  return true;
}
// Cards and blocks rise a little and fade in, one after another.
export function riseBlocks(tl, blocks, at, gap = .08) {
  blocks.forEach((el, i) => {
    const move = canMove(el);
    tl.fromTo(el, { opacity: 0, ...(move ? { y: 18 } : {}) },
      { opacity: 1, ...(move ? { y: 0 } : {}), duration: .55, ease: 'power3.out', clearProps: move ? 'opacity,transform' : 'opacity' }, at + i * gap);
    wordsIn(el, { delay: at + i * gap });
  });
  return at + blocks.length * gap;
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
