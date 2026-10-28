const {chromium}=require('playwright');
const fs=require('fs');
const out=process.env.OUT||'previews/upgrade';
const base=process.env.PRESENTATION_URL||'http://127.0.0.1:5199';
const args=process.argv.slice(2);
const sizes=(args.length?args:['1366x768','1920x1080','1280x720','1024x768','390x844','360x740','844x390','740x360']).map(x=>x.split('x').map(Number));
(async()=>{
let failed=false;
const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']});
for(const [width,height] of sizes){
 const dir=`${out}/${width}x${height}`;fs.mkdirSync(dir,{recursive:true});
 const ctx=await b.newContext({viewport:{width,height},reducedMotion:'reduce'});const p=await ctx.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto(base+'/#introduction');await p.evaluate(()=>document.fonts.ready);
 const slides=await p.evaluate(async()=>{const {slides}=await import('/src/content.js');const {directions}=await import('/src/direction.js');const {buildSteps}=await import('/src/builds.js');return slides.map((s,i)=>({id:s.id,steps:buildSteps(directions[i].layout)}));});
 const report=[];
 for(const [i,s] of slides.entries()){
  await p.evaluate(id=>{location.hash=id;scrollTo(0,0)},s.id);await p.waitForTimeout(80);if(await p.locator('.chapter-cinematic').count()){await p.screenshot({path:`${dir}/${String(i+1).padStart(2,'0')}-chapter.png`});await p.click('[data-action="begin-chapter"]');}
  for(let step=0;step<s.steps;step++){
   if(step)await p.keyboard.press('ArrowRight');await p.waitForTimeout(140);
   const issues=await p.evaluate(()=>{
    const runs=[],overflow=[],sceneHits=[];const root=document.querySelector('main');const tree=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);const scene=document.querySelector('.scene-slot')?.getBoundingClientRect();
    const visible=el=>{for(let a=el;a&&a!==document.body;a=a.parentElement){const c=getComputedStyle(a);if(c.display==='none'||c.visibility==='hidden'||+c.opacity<.05||a.getAttribute('aria-hidden')==='true')return false;}return true;};
    while(tree.nextNode()){
     const node=tree.currentNode,el=node.parentElement;if(!node.textContent.trim()||!visible(el))continue;
     const range=document.createRange();range.selectNodeContents(node);
     for(const r of range.getClientRects()){
      if(r.width<2||r.height<2)continue;const txt=node.textContent.trim().slice(0,48);runs.push({el,r,txt});
      if(r.left< -2||r.right>innerWidth+2||(innerHeight>500&&innerWidth>760&&r.bottom>innerHeight+2))overflow.push(txt);
      if(scene&&!document.body.classList.contains('title-only')&&!document.body.classList.contains('view-horizon')&&!el.closest('.cloud-lab')&&Math.min(r.right,scene.right)-Math.max(r.left,scene.left)>4&&Math.min(r.bottom,scene.bottom)-Math.max(r.top,scene.top)>4)sceneHits.push(txt);
     }
    }
    const overlap=[];
    for(let i=0;i<runs.length;i++)for(let j=i+1;j<runs.length;j++){
     const a=runs[i],b=runs[j];if(a.el===b.el)continue;
     const x=Math.min(a.r.right,b.r.right)-Math.max(a.r.left,b.r.left),y=Math.min(a.r.bottom,b.r.bottom)-Math.max(a.r.top,b.r.top);
     if(x>4&&y>4&&x*y>.15*Math.min(a.r.width*a.r.height,b.r.width*b.r.height))overlap.push(`${a.txt} / ${b.txt}`);
    }
    return {overflow:[...new Set(overflow)],overlap:[...new Set(overlap)],scene:[...new Set(sceneHits)]};
   });
   const file=`${String(i+1).padStart(2,'0')}-${s.id}-${step}.png`;
   await p.screenshot({path:`${dir}/${file}`,fullPage:true});
   if(width<761||height<=500){
    const slot=p.locator('main .scene-slot');
    if(await slot.count()){
     await slot.evaluate(el=>{const r=el.getBoundingClientRect();window.scrollTo(0, Math.max(0,scrollY+r.top-(innerHeight-r.height)/2-30))});
     await p.waitForTimeout(130);
     fs.mkdirSync(`${dir}/scrolled`,{recursive:true});
     await p.screenshot({path:`${dir}/scrolled/${file}`});
     await p.evaluate(()=>scrollTo(0,0));
    }
   }
   if((s.id==='total-cost'&&step<3)||(s.id==='pricing'&&(step<2||step===4))||(s.id==='elasticity'&&step<2)||(s.id==='finops'&&step!==3))issues.scene=[];
   report.push({slide:i+1,id:s.id,step,...issues});
  }
 }
 failed ||= errors.length>0||report.some(r=>r.overflow.length);
 fs.writeFileSync(`${dir}/report.json`,JSON.stringify({report,errors},null,2));
 console.log(`${width}x${height}: ${report.length} states; ${errors.length} errors`);
 for(const r of report)if(r.overflow.length||r.overlap.length||r.scene.length)console.log(JSON.stringify(r));
 await ctx.close();
}
await b.close();if(failed)process.exitCode=1;
})().catch(e=>{console.error(e);process.exit(1)});
