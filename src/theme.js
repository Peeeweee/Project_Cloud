// Sketchbook theme switch. The sketchbook look is the default; add ?mars to the address to
// present the original Mars design instead (handy as a fallback on the day).
let mars = false;
try { mars = /[?&]mars\b/.test(location.search); } catch {}
export const sketch = !mars;
document.documentElement.classList.toggle('sketch', sketch);
if (sketch) document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#fdf6f2');
