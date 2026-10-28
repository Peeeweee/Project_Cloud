// Keynote-style builds: a slide can reveal its story in presenter-controlled steps.
// Next/Back advance the build first and change slides only at either end.
// Elements opt in with data-build="n" (shown from step n) and data-until="m" (hidden after step m).
import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';
import { wordsIn, wordsOut, clearWords } from './choreo.js';
gsap.registerPlugin(Flip);

const money = v => '$' + v.toFixed(2);
const dollars = v => '$' + v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// Each entry: number of steps and a hook for the moving parts CSS cannot express.
const builds = {
  'keynote-elastic': {
    steps: 6,
    apply(root, step, prev, { instant, scene }) {
      const machines = step < 2 ? 0 : step === 3 ? 20 : 2;
      scene.fleet?.({ count: machines }, instant);
      count(root.querySelector('[data-count="fleet"]'), machines, v => String(Math.round(v)).padStart(2, '0'), instant, prev < 2 ? 0 : undefined);
      count(root.querySelector('[data-count="elastic"]'), step >= 5 ? 189.2 : 0, dollars, instant, 0);
      count(root.querySelector('[data-count="fixed"]'), step >= 5 ? 1460 : 0, dollars, instant, 0);
    }
  },
  'keynote-finops': {
    steps: 5,
    apply(root, step, prev, { instant, scene }) {
      scene.loop?.({ show: step === 3 }, instant);
    }
  },
  'keynote-cost': {
    steps: 5,
    apply(root, step, prev, { instant, scene }) {
      scene.costBlocks?.({ count: step >= 3 ? 4 : 0, lift: step >= 4 ? [2, 3] : [] }, instant);
    }
  },
  'keynote-price': {
    steps: 5,
    // On-Demand total and 3D tower height for each step; the commitment is fixed at $43.80.
    apply(root, step, prev, { instant, scene }) {
      const hours = step >= 3 ? 176 : 730;
      const showDuel = step >= 2;
      scene.towers?.({ demandHours: showDuel ? hours : 0, commit: showDuel }, instant);
      count(root.querySelector('[data-count="demand"]'), showDuel ? hours * .1 : 0, money, instant, prev < 2 ? 0 : undefined);
      count(root.querySelector('[data-count="commit"]'), showDuel ? 43.8 : 0, money, instant, prev < 2 ? 0 : undefined);
      count(root.querySelector('[data-count="break"]'), step >= 4 ? 438 : 0, v => String(Math.round(v)), instant, 0);
    }
  }
};

export const buildSteps = layout => builds[layout]?.steps || (layout==='horizon'?1:2);

// Tween a number shown as text. `from` restarts the count (used when a value first appears).
const counters = new Map();
let titleEntranceTween;
export function clearBuilds(root) {
  titleEntranceTween?.progress(1).kill();titleEntranceTween=null;
  for (const [el, tween] of counters) {
    if (root.contains(el)) { tween.kill(); counters.delete(el); }
  }
}
function count(el, to, format, instant, from) {
  if (!el) return;
  counters.get(el)?.kill();
  counters.delete(el);
  const start = from ?? Number(el.dataset.value || 0);
  if (instant || start === to) { el.dataset.value = to; el.textContent = format(to); return; }
  const box = { v: start };
  counters.set(el, gsap.to(box, { v: to, duration: 1.15, ease: 'power3.out', onUpdate: () => { el.dataset.value = box.v; el.textContent = format(box.v); }, onComplete: () => counters.delete(el) }));
}

export function applyBuild(root, layout, step, prev, { instant = false, scene } = {}) {
  const build = builds[layout];
  const slide = root.querySelector('.art-slide');
  if (!slide) return;
  if(!build){if(layout!=='horizon')applyTitleEntrance(slide,step,{instant,scene});return;}
  const title = slide.querySelector('.kn-title');
  // Finish a previous title move before measuring the next one.
  if (title) Flip.killFlipsOf(title, true);
  if (instant) clearWords(slide);
  // The title "magic moves" from a centred hero statement into the slide heading.
  const flipState = title && !instant ? Flip.getState(title) : null;
  slide.dataset.step = step;
  slide.classList.toggle('kn-hero-state', step < 2);
  // Work out what appears and what leaves on this step, then number the arrivals in reading order
  // so CSS (--seq) and the word animations play them one after another.
  const arriving = [], leaving = [];
  slide.querySelectorAll('[data-build]').forEach(el => {
    const from = Number(el.dataset.build), until = el.dataset.until === undefined ? Infinity : Number(el.dataset.until);
    const on = step >= from && step <= until, was = el.classList.contains('is-on');
    if (on && !was) arriving.push(el); else if (!on && was) leaving.push(el);
    el.classList.toggle('is-on', on);
    el.setAttribute('aria-hidden', String(!on));
    el.inert = !on;
  });
  const outermost = list => list.filter(el => !list.some(other => other !== el && other.contains(el)));
  arriving.forEach((el, i) => el.style.setProperty('--seq', instant ? 0 : i));
  if (!instant) {
    outermost(leaving).forEach(el => wordsOut(el));
    outermost(arriving).forEach(el => {
      const base = parseFloat(getComputedStyle(el).getPropertyValue('--delay-base')) || 0;
      wordsIn(el, { delay: base + Number(el.style.getPropertyValue('--seq')) * .11 });
    });
  }
  slide.querySelectorAll('.kn-dots i').forEach((dot, i) => dot.classList.toggle('is-on', i <= step));
  if (instant) slide.classList.add('kn-instant'); else slide.classList.remove('kn-instant');
  if (flipState) Flip.from(flipState, { duration: .95, ease: 'power3.inOut', scale: true });
  build.apply(slide, step, prev ?? -1, { instant, scene });
  if (instant) requestAnimationFrame(() => slide.classList.remove('kn-instant'));
}

// Existing compositions keep their layouts; a shared title card precedes their details.
function applyTitleEntrance(slide,step,{instant,scene}){
 titleEntranceTween?.progress(1).kill();titleEntranceTween=null;
 const card=slide.querySelector('.slide-title-card'),hero=card?.querySelector('.intro-title');
 const content=slide.querySelector('.scene-content'),bottom=slide.querySelector('.slide-bottom');
 if(!card||!content)return;
 const wasTitle=slide.dataset.step==='0',from=hero.getBoundingClientRect();
 slide.dataset.step=step;
 const titleOnly=step===0;
 document.body.classList.toggle('title-only',titleOnly);
 slide.setAttribute('aria-labelledby',titleOnly?'intro-slide-title':'slide-title');
 content.inert=titleOnly;content.setAttribute('aria-hidden',String(titleOnly));
 if(bottom){bottom.inert=titleOnly;bottom.setAttribute('aria-hidden',String(titleOnly));}
 card.inert=!titleOnly;card.setAttribute('aria-hidden',String(!titleOnly));
 gsap.set(card,{clearProps:'opacity,visibility'});gsap.set(hero,{clearProps:'transform,opacity'});
 if(instant)return;
 if(titleOnly){wordsIn(hero,{duration:.75,stagger:.055});return;}
 const title=content.querySelector('#slide-title');
 const tl=gsap.timeline();titleEntranceTween=tl;
 if(wasTitle&&title){
  const to=title.getBoundingClientRect(),scale=parseFloat(getComputedStyle(title).fontSize)/parseFloat(getComputedStyle(hero).fontSize);
  gsap.set(card,{autoAlpha:1});
  tl.to(hero,{x:to.left-from.left,y:to.top-from.top,scale,transformOrigin:'top left',opacity:0,duration:.8,ease:'expo.inOut'},0)
    .set(card,{autoAlpha:0},.8);
 }
 const parts=[...content.children].filter(el=>!el.matches('.scene-slot'));
 tl.fromTo(parts,{opacity:0,y:18},{opacity:1,y:0,duration:.7,stagger:.07,ease:'power3.out',clearProps:'opacity,transform'},.35);
 wordsIn(content,{delay:.45});scene?.resize?.();
}
