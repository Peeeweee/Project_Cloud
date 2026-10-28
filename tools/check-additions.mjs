import assert from 'node:assert/strict';
import {slides,sources} from '../src/content.js';
import {directions,composeSlide} from '../src/direction.js';
import {foundations,operationsRecap} from '../src/additions.js';
assert.equal(slides.length,34);assert.equal(directions.length,slides.length);
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
console.log('PASS 34 slides, source and design alignment, eleven mistakes, and six response stages');

for(const s of foundations){
 const html=composeSlide(s,slides.indexOf(s),'',{});
 assert.ok(!html.includes('briefing-object'),'no repeated orange stacks');
 assert.ok(!html.includes('briefing-card'),'foundations use distinct spatial scenes');
}
import {foundationScene} from '../src/foundation-scenes.js';
const signatures=['resource-map','everyday-route','scale-comparison','elastic-timeline'];
foundations.forEach((s,i)=>assert.ok(foundationScene(s,'heading',String).includes(signatures[i]),'distinct concept layout'));
import {operationsScene} from '../src/operations-scenes.js';
const opsSignatures=['ops-evidence','backup-recipe','ops-control-rail','response-track','mistake-ledger'];
operationsRecap.forEach((s,i)=>{
 const html=operationsScene(s,'heading',String);
 assert.ok(html.includes(opsSignatures[i]),'distinct operations layout');
 assert.ok(!html.includes('briefing-card'),'no shared card template');
});
const resources=foundationScene(foundations[0],'heading',String),daily=foundationScene(foundations[1],'heading',String);
assert.ok(!resources.includes('resource-link'),'no connectors through resource labels');
assert.ok(!daily.includes('route-line'),'no path through everyday symbols');

import {securityAdditions,securityScene} from '../src/security-additions.js';
for(const s of securityAdditions){
 const i=slides.indexOf(s);assert.equal(slides[i-1].id,s.after);assert.equal(s.speaker,'Renan');
 assert.equal(directions[i].layout,'briefing');assert.equal(directions[i].tone,s.design.tone);
 assert.ok(securityScene(s,'heading',String));for(const ref of s.refs)assert.ok(sources[ref]);
}
