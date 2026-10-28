const {chromium}=require('playwright');const assert=require('node:assert/strict');
const base=process.env.PRESENTATION_URL||'http://127.0.0.1:5199';
(async()=>{
const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']});
const ctx=await b.newContext({viewport:{width:1366,height:768}});const p=await ctx.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
const go=async id=>{await p.evaluate(id=>location.hash=id,id);await p.waitForTimeout(160);if(await p.locator('.chapter-cinematic').count())await p.click('[data-action="begin-chapter"]');if(await p.locator('.has-title-entrance[data-step="0"]').count())await p.keyboard.press('ArrowRight');};
const press=async(key,wait=60)=>{await p.keyboard.press(key);await p.waitForTimeout(wait)};
const at=async(id,step,chapter=false)=>{assert.equal(await p.locator('body').evaluate(e=>e.classList.contains('chapter-is-active')),Boolean(chapter));assert.equal(new URL(p.url()).hash,`#${id}`);if(step!==undefined)assert.equal(await p.locator('main .art-slide').getAttribute('data-step'),String(step));};
await p.goto(base+'/');await p.evaluate(()=>document.fonts.ready);await p.click('[data-action="enter"]');
assert.ok(await p.locator('#slide-title div').count(),'cover word reveal');await p.waitForTimeout(3500);assert.equal(await p.locator('#slide-title div').count(),0,'cover split reverted');
await press('End',180);await at('closing-title');assert.ok(await p.locator('#slide-title div').count(),'closing title word reveal');await p.waitForTimeout(3500);assert.equal(await p.locator('#slide-title div').count(),0);
console.log('PASS cover and reprise word reveals and cleanup');
const states=await p.evaluate(async()=>{const {slides}=await import('/src/content.js');const {directions}=await import('/src/direction.js');const {buildSteps}=await import('/src/builds.js');const {chapterFor}=await import('/src/chapters.js');return slides.flatMap((s,i)=>[...(chapterFor(s.id)?[{id:s.id,step:0,chapter:true}]:[]),...Array.from({length:buildSteps(directions[i].layout)},(_,step)=>({id:s.id,step:buildSteps(directions[i].layout)>1?step:undefined}))]);});
assert.equal(states.length,58);assert.equal(states.filter(s=>s.chapter).length,3);
await press('Home');
for(let i=0;i<states.length;i++){await at(states[i].id,states[i].step,states[i].chapter);if(i<states.length-1)await press('ArrowRight');}
for(let i=states.length-1;i>=0;i--){await at(states[i].id,states[i].step,states[i].chapter);if(i>0)await press('ArrowLeft');}
await p.waitForTimeout(4000);assert.equal(await p.locator('.outgoing-scene,.tone-wipe,#slide-title div').count(),0);console.log(`PASS forward/back through ${states.length} states at rapid-click speed`);
for(const id of ['total-cost','pricing','elasticity','finops']){
 await go(id);await press('ArrowRight',120);await press('ArrowRight',120);await press('ArrowRight',120);await press('ArrowLeft',120);await press('ArrowRight',1800);
 assert.equal(await p.locator('.kn-l2 div').count(),0,`${id} split cleanup`);
 if(id==='pricing'){assert.equal(await p.locator('[data-count="demand"]').textContent(),'$17.60');assert.equal(await p.locator('[data-count="commit"]').textContent(),'$43.80');await press('ArrowRight',1600);assert.equal(await p.locator('[data-count="break"]').textContent(),'438');}
 if(id==='elasticity'){assert.equal(await p.locator('[data-count="fleet"]').textContent(),'20');await press('ArrowRight',80);await press('ArrowRight',1600);assert.equal(await p.locator('[data-count="elastic"]').textContent(),'$189.20');assert.equal(await p.locator('[data-count="fixed"]').textContent(),'$1,460.00');}
}
console.log('PASS rapid build reversal, counters and split cleanup');
await go('decision');for(const [choice,word] of [['budget','larger budget'],['contain','Correct.'],['delete','does not revoke']]){await p.click(`[data-action="answer"][data-value="${choice}"]`);assert.ok((await p.locator('.quiz-result').innerText()).includes(word));}console.log('PASS quiz switches');
await press('n',100);assert.ok(await p.locator('#panel').evaluate(e=>e.open));await press('Escape');await press('c',100);await p.click('.chapter-list button:nth-child(15)');await at('pricing',0);
await press('h');await p.click('[data-action="sources"]');assert.ok(await p.locator('#panel').evaluate(e=>e.open));await press('Escape');await p.click('[data-action="settings"]');await p.click('[data-action="motion"]');await press('Escape');await press('ArrowRight');await at('pricing',1);assert.equal(await p.locator('#slide-title div').count(),0);
await p.click('[data-action="settings"]');await p.click('[data-action="motion"]');await press('Escape');await press('h');console.log('PASS notes, contents, sources, manual motion toggle');
await go('cloud-lab');for(const v of ['176','438','730']){await p.click(`[data-action="lab-hours"][data-value="${v}"]`);assert.equal(await p.locator('[data-lab-hours]').inputValue(),v)}
await p.locator('[data-lab-hours]').fill('300');await p.locator('[data-lab-hours]').dispatchEvent('change');assert.equal(await p.locator('[data-lab-hours]').inputValue(),'300');
for(const mode of ['elasticity','incident']){await p.click(`[data-action="lab-mode"][data-value="${mode}"]`);const values=mode==='elasticity'?['peak','settled','normal']:['1','2','3','0'];for(const value of values){const action=mode==='elasticity'?'lab-capacity':'lab-incident';const button=p.locator(`[data-action="${action}"][data-value="${value}"]`).first();if(await button.count())await button.click();}}
await p.click('[data-action="lab-mode"][data-value="pricing"]');assert.equal(await p.locator('[data-lab-hours]').inputValue(),'730');
await press('r',120);assert.ok(await p.locator('body').evaluate(e=>e.classList.contains('reading')));await p.click('.reading-toc a:nth-of-type(4)');await p.waitForTimeout(100);assert.ok(new URL(p.url()).hash.startsWith('#read-'));await p.click('.reader-slide-link[data-index="13"]');await at('total-cost',0,true);await p.click('[data-action="begin-chapter"]');console.log('PASS lab modes, slider, resets and reading links');
await p.emulateMedia({reducedMotion:'reduce'}); // New context also exercises the device default without a manual override.
const r=await b.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});r.on('pageerror',e=>errors.push(e.message));await r.goto(base+'/#total-cost');await r.click('[data-action="begin-chapter"]');
for(let i=0;i<4;i++)await r.click('.phone-nav [data-action="next"]');assert.equal(await r.locator('main .art-slide').getAttribute('data-step'),'4');assert.equal(await r.locator('#slide-title div').count(),0);await r.click('.phone-nav [data-action="next"]');assert.equal(new URL(r.url()).hash,'#pricing');await r.click('.phone-nav [data-action="previous"]');assert.equal(await r.locator('main .art-slide').getAttribute('data-step'),'4');console.log('PASS reduced motion and phone Next/Back builds');
await r.evaluate(()=>{location.hash='cloud-basics'});await r.waitForTimeout(200);await r.keyboard.press('ArrowRight');
const before=await r.locator('#scene').screenshot();await r.evaluate(()=>scrollTo(0,140));await r.waitForTimeout(150);
assert.ok(await r.evaluate(()=>scrollY>0));assert.notDeepEqual(await r.locator('#scene').screenshot(),before,'scroll must repaint the fixed canvas');
await r.click('.phone-nav [data-action="next"]');assert.equal(await r.evaluate(()=>scrollY),0,'new slide starts at the top');
await r.evaluate(()=>{location.hash='pricing'});await r.emulateMedia({reducedMotion:'no-preference'});await r.waitForTimeout(150);await r.keyboard.press('ArrowRight');await r.emulateMedia({reducedMotion:'reduce'});await r.waitForTimeout(100);
assert.equal(await r.locator('#slide-title div').count(),0,'live device preference cancels word motion');assert.equal(await r.locator('main .art-slide').getAttribute('data-step'),'1');
console.log('PASS phone scroll repaint, slide scroll reset and live reduced-motion changes');
assert.deepEqual(errors,[]);console.log('PASS no browser errors');await b.close();
})().catch(e=>{console.error(e);process.exit(1)});
