import assert from 'node:assert/strict';
import {slides,sources} from '../src/content.js';
import {directions,composeSlide} from '../src/direction.js';
import {foundations,operationsRecap} from '../src/additions.js';
assert.equal(slides.length,31);assert.equal(directions.length,slides.length);
assert.equal(new Set(slides.map(s=>s.id)).size,slides.length);
assert.deepEqual(slides.slice(1,5).map(s=>s.id),foundations.map(s=>s.id));
const boundary=slides.findIndex(s=>s.id==='shared-responsibility');
assert.deepEqual(slides.slice(boundary-5,boundary).map(s=>s.id),operationsRecap.map(s=>s.id));
for(const s of [...foundations,...operationsRecap]){
 const i=slides.indexOf(s);assert.equal(directions[i].layout,'briefing');
 assert.equal(s.speaker,'Paulo');assert.ok(s.title.includes('\n'),'editorial two-line title');assert.ok(composeSlide(s,i,'',{}).includes('briefing-intro-art'),'dedicated title entrance artwork');assert.ok(!composeSlide(s,i,'',{}).includes('briefing-intro-number'),'no decorative slide numbers');for(const ref of s.refs)assert.ok(sources[ref],ref);
 assert.ok(s.notes.length>200);assert.ok(s.items.length>=2);
}
assert.equal(operationsRecap.at(-1).items.reduce((n,item)=>n+item[1].split('|').length,0),11);
assert.equal(operationsRecap.find(s=>s.variant==='response').items.length,6);
assert.equal(slides.at(-1).id,'closing-title');
console.log('PASS 31 slides, nine inserted scenes, eleven mistakes, six response stages, sources and art alignment');
