// Deterministic teaching models. No cloud account or live billing is connected.
export const labState={mode:'pricing',hours:730,capacity:'normal',incident:0};
export function labModel(state=labState){
  const demand=Math.round(state.hours*10)/100,commitment=43.80;
  return {demand,commitment,winner:demand===commitment?'Equal compute cost':demand<commitment?'On-Demand wins':'Commitment wins',instances:state.capacity==='peak'?20:2,elastic:2*730*.10+18*24*.10,fixed:20*730*.10,incidentRate:state.incident===3?.20:.80};
}
export function labDesign(base,state=labState){
  return {...base,scene:state.mode==='pricing'?'price':state.mode==='elasticity'?'elastic':'lab-incident',rotation:state.mode==='elasticity'?[.65,-.3,0]:state.mode==='pricing'?[.15,0,0]:[.15,-.22,0],scale:1,transition:state.mode==='incident'?'split':state.mode==='pricing'?'elevate':'assemble'};
}
const money=n=>'$'+n.toFixed(2);
const choices=(action,items,selected)=>items.map(([value,label])=>`<button data-action="${action}" data-value="${value}" aria-pressed="${String(value)===String(selected)}">${label}</button>`).join('');
export function labHTML(state=labState){
 const m=labModel(state), incident=state.incident;
 const steps=['Leak detected','Block access','Trace activity','Restore trust'];
 let controls,diagram,insight,assumptions;
 if(state.mode==='pricing'){
  controls=`<h2>How long does it run?</h2><p>One identical machine. Change its monthly usage.</p><label class="hours-control">Running time <strong>${state.hours} hours</strong><input aria-label="Monthly running hours" data-lab-hours type="range" min="0" max="730" step="1" value="${state.hours}"></label><div class="lab-controls">${choices('lab-hours',[[176,'Part time'],[438,'Break-even'],[730,'Always on']],state.hours)}</div>`;
  diagram=`<div class="bill-compare"><section><span>PAY FOR USE</span><h3>On-Demand</h3><strong>${money(m.demand)}</strong><div class="bill-track"><i style="width:${state.hours/730*100}%"></i></div><p>${state.hours} h × $0.10</p></section><section><span>PAY FOR COMMITMENT</span><h3>Commitment</h3><strong>$43.80</strong><div class="bill-track"><i style="width:60%"></i></div><p>730 h × $0.06, even if idle</p></section></div>`;
  insight=`${m.winner}. ${state.hours<438?'Unused committed hours still cost money.':state.hours>438?'Steady usage makes the discounted commitment worthwhile.':'At 438 hours, both cost $43.80.'}`;
  assumptions='Illustrative compute only · 730-hour month · $0.10/h On-Demand · 40% commitment discount';
 }else if(state.mode==='elasticity'){
  const peak=state.capacity==='peak';
  controls=`<h2>Send a wave of demand.</h2><p>Orange machines are temporary. Two baseline machines stay online.</p><div class="lab-controls">${choices('lab-capacity',[['normal','1 · Normal'],['peak','2 · Send a rush'],['settled','3 · Release extra']],state.capacity)}</div><div class="lab-stat"><strong>${m.instances}</strong><span>active machines<br>${peak?'18 added for the rush':'Only the 2 baseline machines'}</span></div>`;
  const fleet=(fixed)=>Array.from({length:20},(_,i)=>`<i class="machine ${i<2?'baseline':fixed||peak?'online':'offline'}" style="--delay:${i*22}ms">${i+1}</i>`).join('');
  diagram=`<div class="fleet-compare"><section><h3>Elastic capacity <b>${m.instances} online</b></h3><div class="machine-grid">${fleet(false)}</div><p>${peak?'Match the peak, temporarily.':'Release idle machines after demand falls.'}</p><strong>$189.20 <small>/ month</small></strong></section><section><h3>Fixed at peak <b>20 online</b></h3><div class="machine-grid">${fleet(true)}</div><p>All twenty run for the entire month.</p><strong>$1,460.00 <small>/ month</small></strong></section></div>`;
  insight='Same peak capacity. $1,270.80 less per month by releasing the extra machines.';
  assumptions='Monthly scenario: 2 machines × 730 h + 18 extra × 24 h · $0.10 per machine-hour · compute only';
 }else{
  controls=`<h2>${steps[incident]}.</h2><p>${['A leaked key starts six unauthorized machines. Your two trusted machines still run.','Block compromised access first. Already-running machines continue to bill.','Preserve logs. Identify unauthorized resources and affected permissions.','Remove unauthorized machines. Verify trusted access and service health.'][incident]}</p><div class="lab-controls incident-steps">${choices('lab-incident',steps.map((x,i)=>[i,`${i+1} · ${x}`]),incident)}</div><div class="lab-controls"><button data-action="lab-incident" data-value="${Math.max(0,incident-1)}" ${incident===0?'disabled':''}>← Previous</button><button data-action="lab-incident" data-value="${Math.min(3,incident+1)}" ${incident===3?'disabled':''}>Next step →</button></div>`;
  diagram=`<div class="incident-map"><div class="access-node ${incident?'blocked':'exposed'}"><span>${incident?'⊘':'⚠'}</span><h3>${incident?'Access blocked':'Credential exposed'}</h3><p>${incident?'Compromised permissions contained':'Unauthorized provisioning possible'}</p></div><div class="resource-pools"><section><h3>Trusted service</h3><div class="machine-grid trusted">${[1,2].map(i=>`<i class="machine baseline">${i}</i>`).join('')}</div><p>2 machines preserved</p></section><section><h3>Unauthorized resources</h3><div class="machine-grid rogue">${Array.from({length:6},(_,i)=>`<i class="machine ${incident===3?'offline':'online'}">${i+1}</i>`).join('')}</div><p>${incident===3?'6 removed after investigation':'6 still running and billing'}</p></section></div><div class="incident-bill"><span>Current run rate</span><strong>${money(m.incidentRate)} /h</strong><span>${incident===2?'Audit evidence preserved':incident===3?'Service verified':'2 trusted + 6 unauthorized'}</span></div></div>`;
  insight=incident===1?'Access blocked ≠ charges stopped. Existing resources need investigation and cleanup.':incident===3?'Recovery restores both trust and the baseline cost.':'Contain → investigate → recover. Each action solves a different problem.';
  assumptions='Fictional incident · $0.10/machine-hour · blocking access alone does not remove running resources';
 }
 return `<div class="cloud-lab"><div class="lab-heading"><div><span class="micro">EXPERIMENT / COMPARE / UNDERSTAND</span><h1 id="slide-title">Cloud, in your hands.</h1></div><button class="lab-reset" data-action="lab-reset">Reset ↺</button></div><div class="lab-tabs" role="group" aria-label="Choose a simulation">${choices('lab-mode',[['pricing','01 · Pricing'],['elasticity','02 · Elasticity'],['incident','03 · Incident response']],state.mode)}</div><div class="lab-workbench"><aside class="lab-console">${controls}<div class="lab-miniature" aria-hidden="true"><div class="scene-slot"></div></div></aside><div class="lab-experiment" aria-live="polite">${diagram}</div></div><div class="lab-insight" role="status">↳ ${insight}</div><p class="lab-assumptions">${assumptions}</p></div>`;
}
