import '@fontsource/syne/latin-600.css';
import '@fontsource/syne/latin-800.css';
import '@fontsource/instrument-serif/latin-400-italic.css';
import '@fontsource/barlow-condensed/latin-400.css';
import '@fontsource/barlow-condensed/latin-600.css';
import './style.css';
import './redesign.css';
import './layout-fixes.css';
import './branding.css';
import './lab.css';
import './experience.css';
import './lab-fit.css';
import './mobile-fit.css';
import './keynote.css';
import './stage.css';
import './title-sequences.css';
import {chapterFor,mountChapter,dismissChapter,clearChapter} from './chapters.js';
import { buildSteps, applyBuild, clearBuilds } from './builds.js';
import { wordsIn, clearWords } from './choreo.js';
import {labState,labHTML,labDesign,resetLab} from './lab.js';
import { directions, composeSlide } from './direction.js';
import { gsap } from 'gsap';
import { createScene } from './scene.js';
import { slides, people, sources, glossary, questions } from './content.js';

const $ = selector => document.querySelector(selector);
const esc = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const arrow = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>';
const grid = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/></svg>';
const expand = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 4H4v4m12-4h4v4M4 16v4h4m12-4v4h-4"/></svg>';
const media = matchMedia('(prefers-reduced-motion: reduce)');
let manualMotion = null;
const reducedMotion = { get matches() { return manualMotion === null ? media.matches : !manualMotion; } };
let index = 0, mode = 'gate', pricingPart = false, quizAnswer = null, quality = 'balanced', focusBeforeDialog = null;
let entered = false, navigationTween, saleDay = false, step = 0, chapterActive=false;
let controlsVisible=false;
try{controlsVisible=localStorage.getItem('group11-controls-visible')==='true';}catch{}
function updateControls(){
  document.documentElement.classList.toggle('controls-hidden',!controlsVisible);
  const toggle=$('.chrome-toggle');
  toggle.setAttribute('aria-expanded',String(controlsVisible));
  toggle.setAttribute('aria-label',controlsVisible?'Hide presentation controls':'Show presentation controls');
  toggle.querySelector('span').textContent=controlsVisible?'Hide controls':'Show controls';
  for(const el of document.querySelectorAll('.topnav,.deck-footer')){el.inert=!controlsVisible;el.setAttribute('aria-hidden',String(!controlsVisible));}
  const phone=$('.phone-nav');
  if(phone){phone.querySelector('[data-action="previous"]').disabled=index===0;phone.querySelector('[data-action="next"]').disabled=index===slides.length-1;phone.querySelector('span').textContent=`${index+1} / ${slides.length}`;}
  if(!controlsVisible&&document.activeElement?.closest('.topnav,.deck-footer,.source-trigger'))toggle.focus({preventScroll:true});
}
function toggleControls(){controlsVisible=!controlsVisible;try{localStorage.setItem('group11-controls-visible',String(controlsVisible));}catch{}updateControls();requestAnimationFrame(()=>{fitLab();scene.resize();});}
function fitLab(){
 const lab=main.querySelector('.cloud-lab');if(!lab)return;
 // Phones use the stacked, scrolling lab layout from CSS instead of a shrunken desktop view.
 if(matchMedia('(max-width:760px)').matches){for(const k of ['width','height','left','top','transform'])lab.style[k]='';return;}
 const host=lab.parentElement,w=host.clientWidth,h=host.clientHeight;if(w<1||h<1)return;
 const width=Math.max(1000,w),height=Math.max(640,h);
 const scale=Math.min(w/width,h/height);
 Object.assign(lab.style,{width:width+'px',height:height+'px',left:(w-width*scale)/2+'px',top:(h-height*scale)/2+'px',transform:`scale(${scale})`});
 lab.scrollTop=0;
}
function drawArt() { stopNavigation(); main.innerHTML = composeSlide(slides[index], index, visualHTML(slides[index]), { pricingPart, saleDay });fitLab();applyBuild(main,directions[index].layout,step,null,{instant:true,scene}); }
const sceneHost = document.createElement('div');sceneHost.id='scene';sceneHost.setAttribute('aria-hidden','true');document.body.prepend(sceneHost);
const scene = createScene(sceneHost,reducedMotion);

$('#app').innerHTML = `
  <a class="skip-link" href="#main">Skip to report</a>
  <header class="topbar">
    <button class="brand" data-action="home" aria-label="Group 11, return to opening"><span class="brand-mark">11<span></span></span><span class="brand-type">GROUP ELEVEN<span>CLOUD REPORT / 2026</span></span></button>
    <nav class="topnav" id="presentation-nav" aria-label="Report navigation">
      <button class="text-button" data-action="chapters">Contents ${grid}</button>
      <button class="text-button" id="view-toggle" data-action="view">Read report <span>↗</span></button>
      <button class="icon-button settings-button" data-action="settings" aria-label="Presentation settings"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 17h16"/><circle cx="9" cy="7" r="3"/><circle cx="15" cy="17" r="3"/></svg></button>
    </nav>
  </header>
  <button class="chrome-toggle" data-action="controls" aria-controls="presentation-nav presentation-footer" aria-expanded="false" title="Toggle presentation controls (H)"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z"/><circle cx="12" cy="12" r="2.5"/></svg><span>Show controls</span></button>
  <main id="main" tabindex="-1"></main>
  <footer class="deck-footer" id="presentation-footer" hidden>
    <div class="footer-meta"><span id="slide-number"></span><span class="footer-slash">/</span><span id="chapter-name"></span></div>
    <div class="progress" aria-label="Choose a slide"></div>
    <div class="footer-actions"><button class="text-button notes-button" data-action="notes">Speaker notes</button><button class="icon-button" data-action="fullscreen" aria-label="Toggle fullscreen">${expand}</button><button class="icon-button prev" data-action="previous" aria-label="Previous slide">${arrow}</button><button class="icon-button next" data-action="next" aria-label="Next slide">${arrow}</button></div>
  </footer>
  <nav class="phone-nav" aria-label="Mobile slide navigation"><button data-action="previous" aria-label="Previous slide on phone">← Back</button><span></span><button data-action="next" aria-label="Next slide on phone">Next →</button></nav>
  <dialog id="panel" aria-labelledby="panel-title"><div class="dialog-top"><span class="micro" id="panel-title"></span><button class="icon-button" data-action="close" aria-label="Close panel">✕</button></div><div id="panel-content"></div></dialog>
  <div class="sr-only" id="announcement" aria-live="polite" aria-atomic="true"></div>
  <div id="print-report"></div>
`;
const main = $('#main');
const dialog = $('#panel');

function refsHTML(refs) {
  return refs.map(key=>sources[key]).filter(Boolean).map(([label,url])=>`<a href="${url}" target="_blank" rel="noopener noreferrer">${esc(label)} ↗</a>`).join('');
}
function labelRows(items, className='concept-list') {
  return `<div class="${className}">${items.map(([label,text])=>`<div><span>${esc(label)}</span><strong>${esc(text)}</strong></div>`).join('')}</div>`;
}
function lineChart() {
  return `<div class="signal-chart"><div class="chart-top"><span>REQUEST VOLUME</span><span class="badge">SIMULATED</span></div><svg viewBox="0 0 600 150" role="img" aria-label="Simulated traffic rises sharply at 14:20, followed by an audit event"><path class="chart-grid" d="M0 30h600M0 75h600M0 120h600"/><path class="chart-area" d="M0 118L40 113 80 116 120 106 160 112 200 99 240 105 280 86 310 100 340 35 365 12 390 49 420 37 460 52 500 42 550 56 600 48V150H0Z"/><path class="chart-line" d="M0 118L40 113 80 116 120 106 160 112 200 99 240 105 280 86 310 100 340 35 365 12 390 49 420 37 460 52 500 42 550 56 600 48"/><circle cx="365" cy="12" r="5"/></svg><div class="chart-axis"><span>14:00</span><span>14:20 / SPIKE</span><span>14:40</span></div><div class="event-row"><span class="dot"></span><strong>14:21</strong><span>New resource created · audit event</span></div></div>`;
}
function pricingHTML() {
  const hours = pricingPart ? 176 : 730, onDemand=hours*.1, committed=43.8;
  return `<div class="pricing-widget"><div class="segmented" role="group" aria-label="Example workload"><button data-action="pricing" data-value="always" aria-pressed="${!pricingPart}">Always on</button><button data-action="pricing" data-value="part" aria-pressed="${pricingPart}">Part time</button></div><div class="price-row"><div><span>ON-DEMAND</span><strong>$${onDemand.toFixed(2)}</strong></div><div class="price-track"><i style="width:${onDemand/73*100}%"></i></div></div><div class="price-row"><div><span>COMMITMENT</span><strong>$43.80</strong></div><div class="price-track"><i class="muted-bar" style="width:60%"></i></div></div><p class="widget-verdict">${pricingPart?'On-Demand wins at 176 hours.':'Commitment wins at 730 hours.'}</p><p class="tiny">Sample: $0.10/h · 40% discount · monthly totals · other costs excluded</p></div>`;
}
function visualHTML(slide) {
  switch(slide.kind) {
    case 'lab':return labHTML();
    case 'cover': return `<div class="cover-index"><span>01 / OPERATIONS</span><span>02 / SECURITY</span><span>03 / ECONOMICS</span></div><p class="cover-byline">KENT PAULO DELGADO <i>·</i> JOHN RENAN LABAY <i>·</i> EARL JOSH DELGADO</p>`;
    case 'risks': return labelRows(slide.items,'risk-list');
    case 'models': return labelRows(slide.items,'model-list');
    case 'steps': return labelRows(slide.items,'step-list');
    case 'monitor': return lineChart();
    case 'recovery': return `<div class="recovery-chart"><div class="timeline-events"><span>Recovery point</span><span>Disruption</span><span>Service restored</span></div><div class="timeline-track"><i></i><b></b><i></i></div><div class="recovery-windows"><div><span>RPO</span><strong>1 hour</strong><small>Acceptable data loss</small></div><div><span>RTO</span><strong>4 hours</strong><small>Recovery target</small></div></div><p class="tiny">Illustrative objectives, not measured recovery results.</p></div>`;
    case 'response': return labelRows(slide.items,'response-list');
    case 'shared': return `<div class="responsibility"><div><span class="micro">PROVIDER / OF THE CLOUD</span><strong>Hardware<br>Facilities<br>Virtualization</strong></div><div><span class="micro">CUSTOMER / IN THE CLOUD</span><strong>Identities<br>Applications<br>Data & rules</strong></div></div><p class="tiny">IaaS example. Responsibilities vary by service.</p>`;
    case 'root': return `<div class="identity-pair"><div><span class="micro">LINUX ROOT</span><strong>One operating<br>system.</strong><small>Named users + restricted sudo</small></div><div><span class="micro">AWS ACCOUNT ROOT</span><strong>Account-level<br>privilege.</strong><small>Protect root · use limited identities</small></div></div>`;
    case 'firewall': return `<div class="firewall-rules"><div><span class="rule-status allowed">ALLOW</span><strong>HTTPS</strong><span>Visitors → web entry</span><b>443</b></div><div><span class="rule-status restricted">RESTRICT</span><strong>Admin</strong><span>Controlled management path</span><b>↗</b></div><div><span class="rule-status denied">DENY</span><strong>Database</strong><span>Direct public access</span><b>×</b></div></div>`;
    case 'compare': return `<div class="comparison"><div class="comparison-head"><span></span><strong>Security group</strong><strong>Network ACL</strong></div>${[['Boundary','Network interface','Subnet'],['State','Stateful','Stateless'],['Rules','Allow','Allow + deny'],['Evaluation','Combined','Number order']].map(row=>`<div>${row.map((v,i)=>`<${i?'span':'strong'}>${v}</${i?'span':'strong'}>`).join('')}</div>`).join('')}</div>`;
    case 'ssh': return `<div class="ssh-diagram"><div><span class="micro">YOUR DEVICE</span><strong>Private key</strong><span class="key-status">STAYS HERE</span></div><div class="signature-path"><span>Signed proof</span>${arrow}<small>Encrypted connection</small></div><div><span class="micro">SERVER</span><strong>Public key</strong><span class="key-status">VERIFIES</span></div></div>`;
    case 'cost': return `<div class="cost-pair"><div><span class="micro">CAPEX</span><strong>Buy upfront.</strong></div><div><span class="micro">OPEX</span><strong>Pay over time.</strong></div></div><div class="cost-strip"><span>Compute</span><span>Storage</span><span>Transfer</span><span>People</span></div>`;
    case 'pricing': return pricingHTML();
    case 'elasticity': return `<div class="elastic-chart"><svg viewBox="0 0 550 110" role="img" aria-label="Two baseline instances grow to twenty for a one-day peak, then return to two"><path class="chart-grid" d="M0 95h550M0 10h550"/><path class="chart-area" d="M0 95H230V10H310V95H550V110H0Z"/><path class="chart-line" d="M0 95H230V10H310V95H550"/><text x="8" y="85">2 INSTANCES</text><text x="235" y="32">20</text></svg><div class="elastic-totals"><div><span>ELASTIC CAPACITY</span><strong>$189.20</strong></div><div><span>FIXED PEAK CAPACITY</span><strong>$1,460</strong></div></div><p class="tiny">Sample month: 730 h · peak: 24 h · $0.10 / instance-hour · compute only</p></div>`;
    case 'finops': return `<div class="finops-cycle"><div><span>01</span><strong>Inform</strong><small>See & allocate</small></div><b>→</b><div><span>02</span><strong>Optimize</strong><small>Improve value</small></div><b>→</b><div><span>03</span><strong>Operate</strong><small>Act & repeat</small></div></div><div class="resource-tag">OWNER <strong>group-11</strong><span>PROJECT</span><strong>cloud-report</strong></div>`;
    case 'architecture': return `<div class="architecture"><div class="arch-route"><span>Visitors</span><b>HTTPS →</b><span>Application</span><b>→</b><span>Private database</span></div><div class="arch-admin"><span>Administrators</span><b>→ Controlled access →</b><span>Application</span></div><div class="arch-support"><span>Monitoring</span><span>Audit logs</span><span>Backups</span><span>Budgets</span></div></div>`;
    case 'quiz': {
      const answers=[['budget','A','Increase the budget'],['contain','B','Contain the credential'],['delete','C','Delete the repository file']];
      const feedback={budget:'A larger budget does not block misuse. Contain compromised access first.',contain:'Correct. Contain compromised access first, then investigate, remove unauthorized resources, and recover.',delete:'Deleting the file does not revoke an exposed credential. Contain compromised access first.'};
      return `<div class="quiz quiz-live" role="group" aria-label="Explore the first incident response">${answers.map(([value,letter,label])=>`<button data-action="answer" data-value="${value}" aria-pressed="${quizAnswer===value}"><span>${letter}</span>${label}${arrow}</button>`).join('')}<p class="quiz-result ${quizAnswer==='contain'?'is-correct':''}" aria-live="polite" aria-atomic="true">${quizAnswer?feedback[quizAnswer]:'Choose an action to explain it. You can switch choices at any time.'}</p></div>`;
    }
    case 'closing': return `<div class="closing-credits"><span>PAULO / OPERATIONS</span><span>RENAN / SECURITY</span><span>EARL / ECONOMICS</span></div><button class="pill-button" data-action="questions">Questions & discussion ${arrow}</button>`;
    default: return '';
  }
}

// Follow DOM reading order, including details inside cards, tables and the two covers.
// Build-controlled content gets its own sequence when Next reveals it.
function entranceTargets(root,title){
  const parts=[];if(!root)return parts;
  const visit=el=>{for(const child of el.children){
    if(child===title||child.matches('.scene-slot,.kn-dots,[data-build]'))continue;
    if(getComputedStyle(child).display==='none')continue;
    const ownText=[...child.childNodes].some(n=>n.nodeType===3&&n.textContent.trim());
    if(!child.contains(title)&&(ownText||child.matches('svg,input,button'))){parts.push(child);continue;}
    visit(child);
  }};
  visit(root);return parts;
}
// Bounds of an element's text rather than its (possibly full-width) box.
function textBox(el){const range=document.createRange();range.selectNodeContents(el);const r=range.getBoundingClientRect();return r.width?r:el.getBoundingClientRect();}
// When the background tone changes, the old colour slides away like a curtain instead of fading through grey.
function toneWipe(color,direction){
  document.querySelectorAll('.tone-wipe').forEach(el=>el.remove());
  const wipe=document.createElement('div');wipe.className='tone-wipe';wipe.style.background=color;document.body.prepend(wipe);
  const edge=direction>0?'inset(0 0 0 100%)':'inset(0 100% 0 0)';
  gsap.fromTo(wipe,{clipPath:'inset(0 0 0 0%)'},{clipPath:edge,duration:.75,ease:'expo.inOut',onComplete:()=>wipe.remove()});
}
function stopNavigation(){
  chapterActive=false;clearChapter(main);
  navigationTween?.kill();
  clearWords(main);clearBuilds(main);
  gsap.killTweensOf('.scene-content, .scene-content *, .slide-bottom');
  document.querySelectorAll('.outgoing-scene,.tone-wipe').forEach(el=>{gsap.killTweensOf(el);el.remove();});
}

function gate() {
  stopNavigation();$('#announcement').textContent='Report opening. Enter to begin.';
  updateControls();
  mode='gate'; document.body.className='at-gate';$('.deck-footer').hidden=true;
  $('#view-toggle').innerHTML='Read report <span>↗</span>';
  main.innerHTML=`<section class="gate" aria-label="Report opening"><div class="gate-coordinate micro">OPERATIONS / SECURITY / ECONOMICS</div><div class="gate-center"><span class="gate-number">11</span><p>Every system<br>depends on balance.</p></div><button class="enter-button" data-action="enter"><span>ENTER THE REPORT</span>${arrow}</button><span class="gate-foot micro">A STUDY IN RELIABILITY, SECURITY & VALUE</span></section>`;
  scene.set('planet',true,true); entered=false;
}

function resetSlideInteractions(){pricingPart=false;saleDay=false;quizAnswer=null;step=0;resetLab();}
// Next/Back play a slide's build steps before changing slides; Back lands on the previous slide's last step.
function setStep(n){navigationTween?.progress(1);clearWords(main);const prev=step;step=n;applyBuild(main,directions[index].layout,step,prev,{instant:reducedMotion.matches,scene});$('#announcement').textContent=`Slide ${index+1}. Step ${step+1} of ${buildSteps(directions[index].layout)}.`;}
function beginChapter(){if(!chapterActive)return;chapterActive=false;$('#announcement').textContent=`${slides[index].title.replace(/\n/g,' ')}. Next to reveal the slide.`;dismissChapter(main,{instant:reducedMotion.matches,onComplete:()=>{if(step===0&&!chapterActive){const title=main.querySelector('.live-moving-title')||main.querySelector('.kn-title');if(title&&!reducedMotion.matches){if(title.classList.contains('live-moving-title'))gsap.fromTo(title,{opacity:0},{opacity:1,duration:.6,clearProps:'opacity'});else wordsIn(title);}}scene.resize();}});}
function advance(){if(chapterActive)return beginChapter();if(mode!=='slides')return showSlide(0,{focus:true});if(step<buildSteps(directions[index].layout)-1)setStep(step+1);else showSlide(index+1);}
function retreat(){if(mode!=='slides')return;if(chapterActive){if(index>0)showSlide(index-1,{atEnd:true});return;}if(step>0)setStep(step-1);else if(chapterFor(slides[index].id)){chapterActive=true;mountChapter(main,chapterFor(slides[index].id),{instant:reducedMotion.matches});}else if(index>0)showSlide(index-1,{atEnd:true});}
function showSlide(nextIndex, { updateHash=true, instant=false, focus=false, atEnd=false }={}) {
  const previous=index;
  stopNavigation();
  const outgoing = !instant && !reducedMotion.matches && mode==='slides' ? main.querySelector('.art-slide')?.cloneNode(true) : null;
  // Remember where the current title sits so the next title can "magic move" from it.
  const oldTitle=outgoing?main.querySelector('#slide-title'):null;
  const titleFrom=oldTitle?{rect:textBox(oldTitle),size:parseFloat(getComputedStyle(oldTitle).fontSize)||1}:null;
  const oldTone=document.body.className.match(/tone-(\w+)/)?.[1],bodyBackground=getComputedStyle(document.body).backgroundColor;
  // Dark tones leave the body transparent and show the page colour behind it.
  const oldBackground=/rgba\(.*,\s*0\)$|transparent/.test(bodyBackground)?getComputedStyle(document.documentElement).backgroundColor:bodyBackground;
  index=Math.max(0,Math.min(slides.length-1,nextIndex));if(index!==previous||mode!=='slides'){resetSlideInteractions();window.scrollTo(0,0);}if(atEnd)step=buildSteps(directions[index].layout)-1;const slide=slides[index];
  updateControls();
  mode='slides';entered=true;document.body.className=`presenting chapter-${slide.chapter.toLowerCase()} tone-${directions[index].tone} view-${directions[index].layout}`;
  $('#view-toggle').innerHTML='Read report <span>↗</span>';
  $('.deck-footer').hidden=false;
  drawArt();
  if(outgoing) {
    outgoing.classList.add('outgoing-scene');outgoing.setAttribute('aria-hidden','true');outgoing.inert=true;
    outgoing.querySelector('#slide-title')?.classList.add('outgoing-title');
    outgoing.querySelectorAll('[id]').forEach(el=>el.removeAttribute('id'));
    outgoing.querySelector('.scene-meta')?.remove();
    outgoing.querySelector('.slide-bottom')?.remove();
    document.body.append(outgoing);
  }
  $('#slide-number').textContent=`${String(index+1).padStart(2,'0')} / ${slides.length}`;
  $('#chapter-name').textContent=slide.chapter.toUpperCase();
  $('.progress').innerHTML=slides.map((s,i)=>`<button class="progress-segment ${i===index?'active':''} ${i<index?'visited':''}" data-action="jump" data-index="${i}" aria-label="Slide ${i+1}: ${esc(s.title.replace(/\n/g,' '))}" ${i===index?'aria-current="step"':''}><span></span></button>`).join('');
  $('.prev').disabled=index===0;$('.next').disabled=index===slides.length-1;
  $('#announcement').textContent=`Slide ${index+1} of ${slides.length}. ${slide.title.replace(/\n/g,' ')}. Presenter: ${slide.speaker}.`;
  if(updateHash) history.replaceState(null,'',`#${slide.id}`);
  const art = slides[index].kind==='lab'?labDesign(directions[index]):directions[index];
  scene.setDesign(art, instant || reducedMotion.matches);
  if(!directions[index].layout.startsWith('keynote-'))scene.update?.({partTime:pricingPart, saleDay}, true);
  if(slide.kind==='lab')scene.lab?.(labState,true);
  applyBuild(main,directions[index].layout,step,null,{instant:true,scene});
  if(!instant && !reducedMotion.matches) {
    const direction=index>=previous?1:-1;
    const tl=gsap.timeline();navigationTween=tl;
    const title=main.querySelector('#slide-title'),content=main.querySelector('.scene-content');
    const outTitle=outgoing?.querySelector('.outgoing-title');
    if(oldTone&&oldTone!==directions[index].tone)toneWipe(oldBackground,direction);
    if(outgoing) tl.to(outgoing,{opacity:0,x:-direction*36,scale:.97,filter:'blur(10px)',duration:.45,ease:'power2.inOut',onComplete:()=>outgoing.remove()},0);
    // Every slide plays the same choreography: the title first, then each detail in reading order.
    const titleFirst=Boolean(main.querySelector('.has-title-entrance'));
    const heroOnly=titleFirst&&step===0;
    const morph=!titleFirst&&titleFrom&&title&&slide.kind!=='lab'&&!['horizon','finale'].includes(art.layout);
    if(morph){
      // Magic move: the new title starts where the old one was, at its size, and glides into place.
      // Measure the text itself (centred headings sit in full-width boxes) and scale around its corner.
      const to=textBox(title),box=title.getBoundingClientRect(),size=parseFloat(getComputedStyle(title).fontSize)||1;
      if(outTitle)tl.to(outTitle,{opacity:0,duration:.18},0);
      tl.fromTo(title,{x:titleFrom.rect.left-to.left,y:titleFrom.rect.top-to.top,scale:titleFrom.size/size,opacity:.2,transformOrigin:`${to.left-box.left}px ${to.top-box.top}px`},{x:0,y:0,scale:1,opacity:1,duration:1,ease:'expo.inOut',clearProps:'transform,opacity,transformOrigin'},0);
    }
    if(title&&!(chapterFor(slide.id)&&!atEnd)){if(titleFirst)tl.fromTo(title,{opacity:0},{opacity:1,duration:.6,clearProps:'opacity'},outgoing?.25:.1);else wordsIn(title,{delay:outgoing?.25:.1,stagger:.045,duration:.8});}
    // Details: each block softens in and its words rise, one block after another.
    const parts=heroOnly?[]:entranceTargets(content,title);
    const start=(outgoing?.3:.15)+(morph?.35:.25);
    parts.forEach((part,i)=>{
      const at=start+i*.14;
      tl.fromTo(part,{opacity:0,filter:'blur(5px)'},{opacity:1,filter:'blur(0px)',duration:.7,ease:'power3.out',clearProps:'opacity,filter'},at);
      wordsIn(part,{delay:at});
    });
    // The takeaway line closes the sequence.
    const last=start+parts.length*.14+.05,bottom=main.querySelector('.slide-bottom');
    if(bottom&&!heroOnly){tl.fromTo(bottom,{opacity:0,y:10},{opacity:1,y:0,duration:.6,ease:'power2.out',clearProps:'opacity,transform'},last);wordsIn(bottom,{delay:last});}
    if(!heroOnly&&art.layout==='signal')tl.fromTo('.chart-line',{strokeDasharray:900,strokeDashoffset:900},{strokeDashoffset:0,duration:1.3,ease:'power2.out'},.25);
    if(!heroOnly&&art.layout==='proof')tl.fromTo('.proof-signature b',{left:'0%'},{left:'95%',duration:1.3,ease:'power2.inOut'},.25);
  } else outgoing?.remove();
  const chapter=chapterFor(slide.id);
  if(chapter&&!atEnd){chapterActive=true;mountChapter(main,chapter,{instant:instant||reducedMotion.matches});$('#announcement').textContent=`Part ${chapter.number}: ${chapter.title}. ${chapter.speaker}. Next to begin.`;}
  if(focus)main.focus({preventScroll:true});
}

function reportHTML(print=false) {
  return `<div class="reading-heading"><span class="micro">GROUP 11 / COMPLETE REPORT</span><h1>Cloud economics,<br>operations & security.</h1><p>Reliable systems. Controlled access. Accountable spending.</p><div class="reader-people">${Object.values(people).map(n=>`<span>${n}</span>`).join('')}</div></div><div class="reader-layout">${print?'':`<aside class="reading-toc"><span class="micro">IN THIS REPORT</span>${['Overview','Operations','Security','Economics','Together'].map(ch=>`<a href="#read-${slides.find(s=>s.chapter===ch).id}">${ch}</a>`).join('')}<a href="#appendix">Appendix</a><button class="text-button" data-action="print">Print / save PDF ↗</button></aside>`}<div class="reading-body">${slides.map((s,i)=>`<section class="reading-section" id="read-${s.id}"><div class="micro">${String(i+1).padStart(2,'0')} / ${s.chapter.toUpperCase()} <span>${s.speaker.toUpperCase()}</span></div><h2>${esc(s.title.replace(/\n/g,' '))}</h2><p class="reader-lead">${esc(s.subtitle)}</p><p>${esc(s.detail)}</p>${s.kind==='pricing'?`<div class="reader-example"><strong>Illustrative monthly compute comparison</strong><table><thead><tr><th scope="col">Usage</th><th scope="col">On-Demand</th><th scope="col">Commitment</th></tr></thead><tbody><tr><th scope="row">730 hours</th><td>$73.00</td><td>$43.80</td></tr><tr><th scope="row">176 hours</th><td>$17.60</td><td>$43.80</td></tr></tbody></table><p>$0.10/hour, 40% discount, 730 committed hours. Other charges excluded.</p></div>`:''}${s.kind==='elasticity'?'<p class="reader-example">Elastic: (2 × 730 × $0.10) + (18 × 24 × $0.10) = <strong>$189.20</strong>.<br>Fixed peak fleet: 20 × 730 × $0.10 = <strong>$1,460</strong>.<br>Teaching assumptions; compute only.</p>':''}${s.kind==='compare'?'<div class="reader-example">Security group: network interface, stateful, allow rules, combined evaluation.<br>Network ACL: subnet, stateless, allow and deny rules, numbered evaluation.<br>Inspect default and custom configurations separately.</div>':''}<div class="reader-sources">${refsHTML(s.refs)}</div>${print?'':`<details><summary>Presenter explanation · ${s.time}</summary><p>${esc(s.notes)}</p></details><button class="reader-slide-link text-button" data-action="jump" data-index="${i}">Present this slide ${arrow}</button>`}</section>`).join('')}<section class="reading-section" id="appendix"><span class="micro">APPENDIX / DEFENSE REFERENCE</span><h2>Keep the detail close.</h2><h3>Glossary</h3><dl class="glossary">${glossary.map(([a,b])=>`<div><dt>${esc(a)}</dt><dd>${esc(b)}</dd></div>`).join('')}</dl><h3>Defense questions</h3>${questions.map(([q,a])=>`<details ${print?'open':''}><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}<h3>Break-even example</h3><p>For equivalent steady capacity, assume ₱100,000 upfront ownership cost, ₱3,000 monthly running costs, and ₱8,000 monthly cloud cost. Break-even = ₱100,000 ÷ (₱8,000 − ₱3,000) = <strong>20 months</strong>. This simplified example excludes financing, residual value, replacements, and changes in service quality.</p><h3>Home server vs VPS</h3><p>Guide assumptions: ₱25,000 hardware spread over 36 months, 100 W × 24 h × 30 days at ₱12/kWh, and ₱500 extra internet cost. Rounded monthly ownership cost: ₱694 + ₱864 + ₱500 = <strong>₱2,058</strong>. A sample $6–12 VPS at an assumed ₱58/$ is <strong>₱348–696</strong>. These are not current quotes or proof of equivalent performance. Compare memory, CPU, storage, traffic, availability, and administration before choosing.</p><h3>Availability</h3><p>At 99.9% availability, the arithmetic annual downtime allowance is approximately 8.76 hours in a 365-day year; at 99.99%, 52.56 minutes. Provider SLA measurement windows, exclusions, and remedies differ. An SLA is not a guarantee that your application will meet that availability.</p><h3>Source library</h3><div class="source-library">${refsHTML(Object.keys(sources))}</div><p class="reading-credit">Prepared from the Group 11 defense guide. Technical references checked October 26, 2026. Prices, workloads, chart data, and incidents labeled as examples are illustrative. Visual inspiration: The Martian; no film assets. Mars surface map: Caltech/JPL/USGS, Viking imagery, NASA/JPL Solar System Simulator. Typography: Syne, Instrument Serif Italic, Barlow Condensed; visual matches to the supplied reference, not extracted font files. FinOps phase names attributed to the FinOps Foundation.</p></section></div></div>`;
}

function showReading(updateHash=true) {
  stopNavigation();
  for(const el of document.querySelectorAll('.topnav,.deck-footer')){el.inert=false;el.removeAttribute('aria-hidden');}
  mode='read';document.body.className='reading';scene.pause?.();$('.deck-footer').hidden=true;
  $('#view-toggle').innerHTML='Present slides <span>↗</span>';
  main.innerHTML=`<article class="reading-report">${reportHTML()}</article>`;
  if(updateHash)history.replaceState(null,'','#read');
  window.scrollTo(0,0);
}

function openPanel(title,html) {
  focusBeforeDialog=document.activeElement;$('#panel-title').textContent=title;$('#panel-content').innerHTML=html;
  if(!dialog.open)dialog.showModal();
}
function closePanel(){dialog.close();focusBeforeDialog?.focus({preventScroll:true});}
function notes(){const s=slides[index];openPanel(`SPEAKER NOTES / ${String(index+1).padStart(2,'0')}`,`<div class="notes-meta"><span>${s.speaker==='All'?'ALL PRESENTERS':esc(people[s.speaker])}</span><span>TARGET ${s.time}</span></div><h2>${esc(s.title.replace(/\n/g,' '))}</h2><p class="script">${esc(s.notes)}</p><div class="notes-nav"><button class="text-button" data-action="notes-prev" ${index===0?'disabled':''}>← Previous</button><span>${index+1} / ${slides.length}</span><button class="text-button" data-action="notes-next" ${index===slides.length-1?'disabled':''}>Next →</button></div>`);}
function chapters(){openPanel('REPORT CONTENTS',`<h2>Choose your perspective.</h2><div class="chapter-list">${slides.map((s,i)=>`<button data-action="jump" data-index="${i}" class="${index===i?'selected':''}"><span>${String(i+1).padStart(2,'0')}</span><strong>${esc(s.title.replace(/\n/g,' '))}</strong><small>${s.speaker}</small></button>`).join('')}</div>`);}
function settings(){openPanel('PRESENTATION SETTINGS',`<h2>Make it yours.</h2><div class="setting-row"><div><strong>3D detail</strong><p>Balanced is tuned for ordinary laptops.</p></div><div class="segmented"><button data-action="quality" data-value="balanced" aria-pressed="${quality==='balanced'}">Balanced</button><button data-action="quality" data-value="detail" aria-pressed="${quality==='detail'}">High</button></div></div><div class="setting-row"><div><strong>Motion</strong><p>Respect your device preference, or choose here.</p></div><button class="pill-button" data-action="motion">${reducedMotion.matches?'Motion off':'Motion on'}</button></div><div class="shortcuts"><span>→ / Space</span><strong>Next reveal / slide</strong><span>←</span><strong>Previous reveal / slide</strong><span>Home / End</span><strong>First / last slide</strong><span>N / C / R</span><strong>Notes / contents / reading view</strong><span>H</span><strong>Show / hide presentation controls</strong><span>F / Esc</span><strong>Fullscreen / close panel</strong></div><button class="text-button" data-action="print">Print report / save PDF ↗</button><p class="tiny">Speaker notes and all report content are public in a deployed static site.</p>`);}

document.addEventListener('click',async e=>{
  if(e.target.closest('.skip-link')){e.preventDefault();main.focus({preventScroll:true});return;}
  const target=e.target.closest('[data-action]');if(!target||target.disabled)return;
  const action=target.dataset.action;
  switch(action){
    case 'begin-chapter':beginChapter();break;
    case 'enter': showSlide(0,{focus:true});break;
    case 'home': if(dialog.open)closePanel();history.replaceState(null,'',location.pathname+location.search);gate();break;
    case 'next': advance();break;
    case 'previous': retreat();break;
    case 'jump': if(dialog.open)closePanel();showSlide(Number(target.dataset.index),{focus:true});window.scrollTo(0,0);break;
    case 'view': if(mode==='read')showSlide(index,{focus:true});else showReading();break;
    case 'chapters': chapters();break;
    case 'notes': notes();break;
    case 'notes-next': showSlide(index+1);notes();break;
    case 'notes-prev': showSlide(index-1);notes();break;
    case 'close':closePanel();break;
    case 'sources': {const s=slides[index];openPanel('SOURCES & CONTEXT',`<h2>${esc(s.title.replace(/\n/g,' '))}</h2><p>${esc(s.detail)}</p><div class="source-library">${refsHTML(s.refs)}</div><p class="tiny">Based on the Group 11 defense guide. Teaching calculations are illustrative; live rates vary. Original visuals inspired by the atmosphere of The Martian.</p>`);break;}
    case 'pricing': pricingPart=target.dataset.value==='part';drawArt();scene.update?.({partTime:pricingPart,saleDay});$('.segmented [data-value="'+target.dataset.value+'"]').focus();break;
    case 'capacity': saleDay=target.dataset.value==='sale';drawArt();scene.update?.({partTime:pricingPart,saleDay});$('.segmented [data-value="'+target.dataset.value+'"]').focus();break;
    case 'answer': {const value=target.dataset.value;quizAnswer=quizAnswer===value?null:value;drawArt();main.querySelector(`[data-action="answer"][data-value="${value}"]`)?.focus({preventScroll:true});break;}
    case 'lab-mode':case 'lab-hours':case 'lab-capacity':case 'lab-incident':{
      const switching=action==='lab-mode';
      if(switching)resetLab(target.dataset.value);
      else if(action==='lab-hours')labState.hours=Number(target.dataset.value);
      else if(action==='lab-capacity')labState.capacity=target.dataset.value;
      else labState.incident=Number(target.dataset.value);
      drawArt();
      if(switching)scene.setDesign(labDesign(directions[index]),reducedMotion.matches);
      scene.lab?.(labState,false);
      scene.resize();
      main.querySelector(`[data-action="${action}"]${target.dataset.value!==undefined?`[data-value="${target.dataset.value}"]`:''}`)?.focus({preventScroll:true});
      break;
    }
    case 'settings':settings();break;
    case 'controls':toggleControls();break;
    case 'quality':quality=target.dataset.value;scene.quality(quality);settings();break;
    case 'motion':manualMotion=reducedMotion.matches;document.documentElement.classList.toggle('reduce-motion',reducedMotion.matches);gsap.globalTimeline.getChildren().forEach(t=>t.progress(1));settings();break;
    case 'fullscreen':try{if(!document.fullscreenElement)await document.documentElement.requestFullscreen();else await document.exitFullscreen();}catch{openPanel('FULLSCREEN','<h2>Use your browser’s fullscreen control.</h2><p>Fullscreen is unavailable in this embedded preview. Open the report in a browser tab and use F11.</p>');}break;
    case 'questions':openPanel('QUESTIONS & DISCUSSION',`<h2>Let’s talk cloud.</h2>${questions.map(([q,a])=>`<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}`);break;
    case 'print':$('#print-report').innerHTML=reportHTML(true);window.print();break;
  }
});
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closePanel();}});
document.addEventListener('keydown',e=>{
  if(dialog.open||e.altKey||e.ctrlKey||e.metaKey||['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName))return;
  if(e.key.toLowerCase()==='h'&&mode!=='read'){e.preventDefault();toggleControls();return;}
  if(e.target.closest('button,a,summary')&&!['ArrowRight','ArrowLeft','ArrowUp','ArrowDown','PageDown','PageUp','Home','End'].includes(e.key)&&!['n','c','r','f'].includes(e.key.toLowerCase()))return;
  if(mode==='read'){if(e.key.toLowerCase()==='r'){e.preventDefault();showSlide(index,{focus:true});}return;}
  const key=e.key.toLowerCase();
  if(['arrowright','arrowdown',' ','pagedown'].includes(key)){e.preventDefault();advance();}
  else if(['arrowleft','arrowup','pageup'].includes(key)){e.preventDefault();retreat();}
  else if(key==='home'){e.preventDefault();showSlide(0);}
  else if(key==='end'){e.preventDefault();showSlide(slides.length-1);}
  else if(key==='n'&&mode==='slides')notes();else if(key==='c')chapters();else if(key==='r')showReading();else if(key==='f')$('[data-action="fullscreen"]').click();
});
function route(){let hash;try{hash=decodeURIComponent(location.hash.slice(1));}catch{hash='';}if(hash==='read'||hash.startsWith('read-')||hash==='appendix'){showReading(false);if(hash!=='read')requestAnimationFrame(()=>document.getElementById(hash)?.scrollIntoView());}else{const i=slides.findIndex(s=>s.id===hash);if(i>=0)showSlide(i,{updateHash:false,instant:true});else gate();}}
addEventListener('hashchange',route);
media.addEventListener('change',()=>{if(manualMotion===null){document.documentElement.classList.toggle('reduce-motion',media.matches);if(media.matches&&mode==='slides')showSlide(index,{instant:true});}});
document.documentElement.classList.toggle('reduce-motion',reducedMotion.matches);
route();

// Commit slider changes without replacing the focused control during a drag.
document.addEventListener('input',e=>{if(e.target.matches('[data-lab-hours]'))e.target.previousElementSibling.textContent=e.target.value+' hours';});
document.addEventListener('change',e=>{if(!e.target.matches('[data-lab-hours]'))return;labState.hours=Number(e.target.value);drawArt();scene.lab?.(labState,false);scene.resize();main.querySelector('[data-lab-hours]')?.focus({preventScroll:true});});

// Refit after viewport, fullscreen, or browser chrome size changes.
new ResizeObserver(fitLab).observe(main);
window.visualViewport?.addEventListener('resize',fitLab);
window.addEventListener('resize',fitLab);

// Fonts and viewport changes can alter the natural heading box before its first move.
function fitTitleIntro(){if(mode==='slides'&&step===0&&main.querySelector('.has-title-entrance'))applyBuild(main,directions[index].layout,step,null,{instant:true,scene});}
document.fonts.ready.then(fitTitleIntro);
window.addEventListener('resize',fitTitleIntro);
