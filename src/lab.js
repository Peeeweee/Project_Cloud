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
  const m=labModel(state);
  const phase=['Exposed','Contained','Investigated','Recovered'][state.incident];
  let title,description,controls,values,labels,assumptions;
  if(state.mode==='pricing'){
    title=m.winner;
    description='Same machine. Different usage. Watch the bill cross the commitment.';
    controls=choices('lab-hours',[[176,'176 h'],[438,'438 h / equal'],[730,'730 h']],state.hours);
    values=`<div><span>ON-DEMAND</span><strong>${money(m.demand)}</strong></div><div><span>COMMITMENT</span><strong>${money(m.commitment)}</strong></div>`;
    labels='<span>Usage-based bill</span><span>Fixed obligation</span>';
    assumptions='$0.10/h · 730-hour commitment · 40% discount · compute only';
  }else if(state.mode==='elasticity'){
    title=state.capacity==='peak'?'Meet the rush.':state.capacity==='settled'?'Release the extra.':'Start with two.';
    description=state.capacity==='peak'?'Eighteen temporary instances join the two baseline machines.':state.capacity==='settled'?'Demand falls. The eighteen temporary machines are released.':'The baseline stays on. Peak capacity arrives only when needed.';
    controls=choices('lab-capacity',[['normal','Normal / 2'],['peak','Peak / 20'],['settled','Scale down / 2']],state.capacity);
    values=`<div><span>ELASTIC / MONTH</span><strong>${money(m.elastic)}</strong></div><div><span>FIXED PEAK / MONTH</span><strong>$1,460.00</strong></div>`;
    labels=`<span>2 baseline</span><span>${m.instances===20?'18 extra online':'18 extra released'} · ${m.instances} active</span>`;
    assumptions='2 × 730 h + 18 × 24 h · $0.10/instance-hour · compute only';
  }else{
    title=phase+'.';
    description=[
      'A leaked credential provisions six unauthorized machines. Two trusted machines remain.',
      'Revoke compromised access. Existing machines may still run and bill.',
      'Preserve audit evidence. Identify the six unauthorized resources before cleanup.',
      'Remove unauthorized resources. Validate trusted access and service health.'
    ][state.incident];
    controls=choices('lab-incident',[[0,'1 Expose'],[1,'2 Contain'],[2,'3 Investigate'],[3,'4 Recover']],state.incident);
    values=`<div><span>SIMULATED RUN RATE</span><strong>${money(m.incidentRate)}<small>/h</small></strong></div><div><span>UNAUTHORIZED</span><strong>${state.incident===3?'0':'6'}<small> machines</small></strong></div>`;
    labels=`<span>${state.incident?'Access revoked':'Leaked access'}</span><span>2 trusted</span><span>${state.incident===3?'Cleanup complete':'6 unauthorized'}</span>`;
    assumptions='Fictional incident · $0.10/machine-hour · containment alone does not stop existing charges';
  }
  return `<div class="cloud-lab">
    <div class="lab-heading"><div><span class="micro">INTERACTIVE / TEACHING SIMULATION</span><h1 id="slide-title">Make it visible.</h1></div><button class="lab-reset" data-action="lab-reset">Reset lab ↺</button></div>
    <div class="lab-tabs" role="group" aria-label="Choose a simulation">${choices('lab-mode',[['pricing','01 Pricing'],['elasticity','02 Elasticity'],['incident','03 Incident response']],state.mode)}</div>
    <div class="lab-body">
      <div class="lab-story"><h2>${title}</h2><p>${description}</p><div class="lab-controls" role="group" aria-label="Simulation stages">${controls}</div><div class="lab-values" role="status" aria-live="polite">${values}</div></div>
      <div class="lab-theater" role="img" aria-label="${state.mode==='pricing'?`Two 3D towers compare ${money(m.demand)} On-Demand with ${money(m.commitment)} commitment`:state.mode==='elasticity'?`${m.instances} active 3D instances; two baseline and up to eighteen temporary machines`:`${phase}: two trusted machines, ${state.incident===3?'zero':'six'} unauthorized machines; ${state.incident?'credential path blocked':'credential path open'}`}"><div class="scene-slot" aria-hidden="true"></div><div class="lab-scene-labels">${labels}</div></div>
    </div><p class="lab-assumptions">${assumptions}</p>
  </div>`;
}
