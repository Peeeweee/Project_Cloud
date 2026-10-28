// Word-by-word text motion shared by slide arrivals (main.js) and build steps (builds.js).
// Words rise out of a mask when text appears and lift away when it leaves; the split is
// reverted afterwards so layout, measurements and counters see the original markup.
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
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
      gsap.killTweensOf(entry.split.words);
      entry.timer?.kill();
      entry.split.revert();
      live.delete(leaf);
    }
  }
}
function freshSplit(leaf) {
  const old = live.get(leaf);
  if (old) { gsap.killTweensOf(old.split.words); old.timer?.kill(); old.split.revert(); }
  const split = SplitText.create(leaf, { type: 'words', mask: 'words', aria: 'none' });
  const entry = { split };
  live.set(leaf, entry);
  const done = () => { if (live.get(leaf) === entry) { split.revert(); live.delete(leaf); } };
  return { split, entry, done };
}

// Reveal the words of every text leaf in `root`, in reading order. Returns the total duration.
export function wordsIn(root, { delay = 0, stagger = .028, duration = .7 } = {}) {
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
  textLeaves(root).forEach(leaf => {
    const { split, entry, done } = freshSplit(leaf);
    gsap.to(split.words, { yPercent: -115, opacity: 0, duration, stagger: .015, ease: 'power2.in', onComplete: () => { entry.timer = gsap.delayedCall(.6, done); } });
  });
}
