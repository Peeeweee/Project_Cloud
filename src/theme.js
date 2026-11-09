// Sketchbook theme switch. The sketchbook look is the default; add ?mars to the address to
// present the original Mars design instead (handy as a fallback on the day).
let mars = false;
try { mars = /[?&]mars\b/.test(location.search); } catch {}
export const sketch = !mars;
document.documentElement.classList.toggle('sketch', sketch);
if (sketch) document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#fdf6f2');

// A few faint pencil clouds drift slowly across the back of every page (sketch theme only).
if (sketch) {
  const cloud = w => `<svg viewBox="0 0 120 60" width="${w}" aria-hidden="true"><path d="M14 46 C4 46 4 32 16 32 C14 20 30 16 36 26 C40 10 64 8 68 24 C76 14 96 18 94 32 C108 32 110 46 98 46 Z"/></svg>`;
  const sky = document.createElement('div');
  sky.id = 'sk-sky'; sky.setAttribute('aria-hidden', 'true');
  sky.innerHTML = [[150, 7, 95, -10], [96, 15, 120, -70], [130, 90, 140, -35]]
    .map(([w, top, dur, delay]) => `<i style="top:${top}%;animation-duration:${dur}s;animation-delay:${delay}s">${cloud(w)}</i>`).join('');
  document.body.prepend(sky);
}
