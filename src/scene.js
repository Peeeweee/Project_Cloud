import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { gsap } from 'gsap';
import marsMapUrl from './assets/mars-color.jpg';

export function createScene(host, reducedMotion) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
  } catch {
    host.classList.add('scene-fallback');
    return { set() {}, setDesign() {}, update() {}, quality() {}, resize() {}, pause() {host.hidden=true;}, destroy() {} };
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.35));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setClearColor(0x08090a, 0);
  host.append(renderer.domElement);
  renderer.domElement.setAttribute('aria-hidden', 'true');
  const scene = new THREE.Scene();
  const backgroundScene = new THREE.Scene();
  const backgroundCamera = new THREE.PerspectiveCamera(38,1,.1,100);
  backgroundCamera.position.z=10;
  renderer.autoClear=false;
  // A shared silhouette travels between the old and new physical scenes.
  const morphScene=new THREE.Scene();
  const morphCamera=new THREE.OrthographicCamera(-1,1,1,-1,.1,10);
  morphCamera.position.z=2;
  const morphCount=560;
  const morphGeometry=new THREE.BufferGeometry();
  const morphPositions=new Float32Array(morphCount*3);
  morphGeometry.setAttribute('position',new THREE.BufferAttribute(morphPositions,3));
  const morphMaterial=new THREE.PointsMaterial({color:0xd58b58,size:2,sizeAttenuation:false,transparent:true,opacity:0,depthTest:false,depthWrite:false});
  const morphCloud=new THREE.Points(morphGeometry,morphMaterial);
  morphCloud.frustumCulled=false;morphScene.add(morphCloud);
  let morphTween;
  const perspectiveCamera = new THREE.PerspectiveCamera(38,1,.1,100);
  const diagramCamera = new THREE.OrthographicCamera(-5,5,5,-5,.1,100);
  let camera=perspectiveCamera;
  camera.position.set(0,0,10);
  const pivot = new THREE.Group(); scene.add(pivot);
  scene.add(new THREE.AmbientLight(0xc8d5df, 1.1));
  const light = new THREE.DirectionalLight(0xffdfbe, 5); light.position.set(-3, 5, 6); scene.add(light);
  const rim = new THREE.DirectionalLight(0xff5c2a, 5); rim.position.set(5, -1, -2); scene.add(rim);
  let queued = false;
  function render() {
    if(queued)return;queued=true;
    requestAnimationFrame(()=>{
      queued=false;if(document.hidden)return;
      const W=host.clientWidth,H=host.clientHeight;
      renderer.setScissorTest(false);renderer.setViewport(0,0,W,H);renderer.clear();
      backgroundCamera.aspect=W/Math.max(H,1);backgroundCamera.updateProjectionMatrix();
      renderer.render(backgroundScene,backgroundCamera);
      const slot=document.querySelector('.scene-slot');
      if(currentDesign?.layout!=='gate'&&!slot)return;
      const r=slot&&currentDesign?.layout!=='horizon'?slot.getBoundingClientRect():{left:0,top:0,width:W,height:H,bottom:H};
      if(r.width<2||r.height<2)return;
      const y=H-r.top-r.height;
      renderer.setViewport(r.left,y,r.width,r.height);
      renderer.setScissor(r.left,y,r.width,r.height);renderer.setScissorTest(true);
      camera.aspect=r.width/r.height;camera.updateProjectionMatrix();
      renderer.clearDepth();renderer.render(scene,camera);renderer.setScissorTest(false);
      if(morphMaterial.opacity>.001){
        renderer.setViewport(r.left,y,r.width,r.height);
        renderer.setScissor(r.left,y,r.width,r.height);renderer.setScissorTest(true);
        renderer.render(morphScene,morphCamera);renderer.setScissorTest(false);
      }
      if(slot)placeLabels(r);
    });
  }
  function placeLabels(rect){
    const labels=document.querySelectorAll('[data-scene-anchor]');
    const content=document.querySelector('.scene-content');if(!content||!current)return;
    const parent=content.getBoundingClientRect();
    const xs=currentDesign.scene==='platforms'?[-3.1,0,3.1]:currentDesign.scene==='authentication'?[-2.5,2.5]:currentDesign.scene==='cost'?[-2.175,-.725,.725,2.175]:[-3,0,3];
    current.updateWorldMatrix(true,true);
    labels.forEach(el=>{
      const i=Number(el.dataset.sceneAnchor);
      const point=current.localToWorld(new THREE.Vector3(xs[i],0,0)).project(camera);
      el.style.left=`${rect.left-parent.left+(point.x+1)*rect.width/2}px`;
      el.style.top=`${rect.bottom-parent.top+12}px`;
    });
  }

  const orange = new THREE.MeshStandardMaterial({ color: 0xb6532f, metalness: .48, roughness: .38 });
  const pale = new THREE.MeshStandardMaterial({ color: 0xced0c9, metalness: .68, roughness: .3 });
  const black = new THREE.MeshStandardMaterial({ color: 0x282c30, metalness: .75, roughness: .3 });
  const lineMat = new THREE.LineBasicMaterial({ color: 0x8d6c50, transparent: true, opacity: .32 });
  const groups = {};
  const make = name => { const g = new THREE.Group(); groups[name] = g; pivot.add(g); g.visible = false; return g; };
  const mesh = (geometry, material, parent, position = [0,0,0]) => {
    const object = new THREE.Mesh(geometry, material); object.position.set(...position); parent.add(object); return object;
  };
  const box = (parent, size, pos, mat = orange) => mesh(new RoundedBoxGeometry(...size, 3, .055), mat, parent, pos);
  const planet = make('planet');
  const planetUniforms={uMorph:{value:0},uTime:{value:0}};
  const vertexShader = `uniform float uMorph; uniform float uTime; varying vec3 vNormal; varying vec3 vPos; varying vec2 vUv;
    void main(){
      vUv=uv; vNormal=normalize(normalMatrix*normal); vPos=position;
      float wave=sin(position.y*2.1+uTime)*cos(position.x*1.7-uTime*.6);
      vec3 shaped=position+normal*wave*uMorph*.22;
      float angle=uMorph*position.y*.13;
      shaped.xz=mat2(cos(angle),-sin(angle),sin(angle),cos(angle))*shaped.xz;
      gl_Position=projectionMatrix*modelViewMatrix*vec4(shaped,1.);
    }`;
  const fragmentShader = `precision highp float;
    varying vec3 vNormal; varying vec3 vPos;
    float hash(vec3 p){p=fract(p*.3183099+vec3(.1,.2,.3));p*=17.;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}
    float noise(vec3 x){vec3 i=floor(x),f=fract(x);f=f*f*(3.-2.*f);
      return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);}
    float fbm(vec3 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*noise(p);p=p*2.07+13.1;a*=.5;}return v;}
    void main(){vec3 p=normalize(vPos); float n=fbm(p*7.);float fine=fbm(p*70.);
      float bands=fbm(p*18.+vec3(n*5.));
      vec3 dark=vec3(.18,.075,.039),dust=vec3(.66,.32,.16);
      vec3 col=mix(dark,dust,smoothstep(.2,.75,n));
      col*=.7+fine*.6;col=mix(col,vec3(.53,.34,.22),smoothstep(.56,.72,bands)*.35);
      float diffuse=max(dot(normalize(vNormal),normalize(vec3(-.85,.65,1.))),0.);
      float edge=pow(1.-max(vNormal.z,0.),3.);
      col=col*(.025+diffuse*1.6)+vec3(.7,.19,.05)*edge*.16*diffuse;
      gl_FragColor=vec4(col,1.); }`;
  const planetSurface=mesh(new THREE.SphereGeometry(2.9,96,64),new THREE.ShaderMaterial({vertexShader,fragmentShader,uniforms:planetUniforms}),planet);
  new THREE.TextureLoader().load(marsMapUrl,texture=>{
    texture.colorSpace=THREE.NoColorSpace;
    texture.anisotropy=Math.min(renderer.capabilities.getMaxAnisotropy(),4);
    const previous=planetSurface.material;
    planetSurface.material=new THREE.ShaderMaterial({
      vertexShader,uniforms:{...planetUniforms,surfaceMap:{value:texture}},
      fragmentShader:`precision highp float; uniform sampler2D surfaceMap; varying vec3 vNormal; varying vec3 vPos; varying vec2 vUv;
      void main(){
        vec3 n=normalize(vNormal);
        vec3 sampleColor=texture2D(surfaceMap,vUv).rgb;
        float light=max(dot(n,normalize(vec3(.85,.35,1.))),0.);
        vec3 color=sampleColor*vec3(1.05,.76,.59)*(.08+light*.70);
        float rim=pow(1.-max(n.z,0.),4.);
        color+=vec3(.42,.20,.10)*rim*light*.13;
        gl_FragColor=vec4(color,1.);
      }`
    });
    previous.dispose();render();
  },undefined,()=>render());
  // Very faint atmospheric rim, without a full-screen bloom pass.
  mesh(new THREE.SphereGeometry(2.93, 56, 36), new THREE.ShaderMaterial({
    vertexShader,
    uniforms:planetUniforms,
    fragmentShader: `varying vec3 vNormal; varying vec3 vPos; void main(){float f=pow(1.-abs(vNormal.z),4.);float l=max(dot(vNormal,normalize(vec3(-.85,.65,1.))),0.);gl_FragColor=vec4(.94,.36,.14,f*l*.32);}`,
    transparent: true, depthWrite: false, side: THREE.BackSide, blending: THREE.AdditiveBlending
  }), planet);

  const compute = make('compute');
  for (let i=0; i<4; i++) {
    const tray = box(compute, [2.7,.38,1.9], [0,(i-1.5)*.72,0], i===2 ? orange : black);
    for(let j=0;j<5;j++) box(tray,[.24,.025,.06],[-.85+j*.41,.202,.78],pale);
    const edges = new THREE.LineSegments(new THREE.EdgesGeometry(tray.geometry, 30), lineMat);
    tray.add(edges);
    box(compute,[.055,.04,.055],[1.1,(i-1.5)*.72,.97],pale);
  }
  compute.rotation.set(.27,-.55,-.08);

  const shield = make('shield');
  const core = box(shield,[1.28,1.28,1.28],[0,0,0],orange); core.rotation.y=.4;
  for(let i=0;i<3;i++) {
    const loop = mesh(new THREE.TorusGeometry(1.25+i*.36,.025,8,100), i===0 ? pale : black,shield);
    loop.rotation.set(Math.PI*.38+i*.18,i*.6,.3+i*.2);
  }
  const shell = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(2.05,0)), lineMat); shield.add(shell);
  shield.rotation.set(.1,-.35,.1);

  const key = make('key');
  const ring = mesh(new THREE.TorusGeometry(.63,.17,16,64),pale,key,[-.95,.1,0]);
  box(key,[2.5,.26,.3],[.85,.1,0],orange);
  box(key,[.28,.62,.3],[1.6,-.14,0],orange);
  box(key,[.28,.46,.3],[1.08,-.06,0],orange);
  ring.rotation.y=.15; key.rotation.set(.4,-.4,.45);

  const resources = make('resources');
  for(let x=0;x<3;x++) for(let z=0;z<3;z++) for(let y=0;y<2;y++) {
    box(resources,[.65,.65,.65],[(x-1)*.83,(y-.5)*.83,(z-1)*.83], (x+z+y)%3===0 ? orange : pale);
  }
  resources.rotation.set(.45,-.58,.1);
  const orbit = make('orbit');
  mesh(new THREE.SphereGeometry(.57,32,24),orange,orbit);
  for(let i=0;i<3;i++) {
    const ring = mesh(new THREE.TorusGeometry(1.25+i*.42,.018,6,100),pale,orbit);
    ring.rotation.set(.7+i*.45,.2+i*.4,i*.3);
  }
  for(let i=0;i<3;i++) mesh(new THREE.SphereGeometry(.1,12,10),orange,orbit,[Math.cos(i*2)*1.7, Math.sin(i*2)*1.3, .3]);

  // Slide-specific physical scenes. Geometry is intentionally inexpensive;
  // the spatial composition, rather than a costly effect pass, does the work.
  function wireBox(parent,size,pos,color=0x9a826b){
    const object=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(...size)),new THREE.LineBasicMaterial({color,transparent:true,opacity:.55}));object.position.set(...pos);parent.add(object);return object;
  }
  function path(parent,points,mat=pale,radius=.018){
    const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)));
    return mesh(new THREE.TubeGeometry(curve,32,radius,6,false),mat,parent);
  }
  const fracture=make('fracture');
  for(let i=0;i<9;i++){
    const a=i*2.399;const radius=.7+(i%3)*.4;
    const bit=box(fracture,[.7,.7,.7],[Math.cos(a)*radius,Math.sin(a)*radius,(i%3-1)*.55],i%3===0?orange:black);
    bit.rotation.set(i*.2,i*.37,i*.13);
  }
  const platforms=make('platforms');
  for(let i=0;i<3;i++){
    const platform=new THREE.Group();platform.position.x=(i-1)*3.1;platforms.add(platform);
    for(let j=0;j<3-i;j++)box(platform,[2.2,.23,1.8],[0,j*.42,0],j===2-i?orange:pale);
    for(let j=0;j<3;j++)box(platform,[.2,.025,.2],[(j-1)*.5,(2-i)*.42+.13,.4],black);
  }
  const systems=make('systems');
  mesh(new THREE.CylinderGeometry(.75,.75,.28,48),orange,systems);
  mesh(new THREE.TorusGeometry(2.05,.014,6,100),pale,systems).rotation.x=Math.PI/2;
  for(let i=0;i<4;i++){
    const a=i*Math.PI/2;const x=Math.cos(a)*2.05,z=Math.sin(a)*2.05;
    box(systems,[.65,.45,.65],[x,0,z],i%2?black:pale);
    path(systems,[[x,0,z],[x*.55,.2,z*.55],[0,.12,0]],orange,.012);
  }
  const satellite=make('satellite');
  box(satellite,[.75,.75,.8],[0,0,0],pale);
  for(const side of [-1,1]){
    const panel=box(satellite,[1.5,.07,1.1],[side*1.2,0,0],black);
    for(let j=0;j<4;j++)box(panel,[.015,.01,1.05],[(j-1.5)*.35,.045,0],orange);
  }
  mesh(new THREE.ConeGeometry(.35,.5,24),pale,satellite,[0,.55,0]);
  const snapshots=make('snapshots');
  for(let i=0;i<3;i++){
    const slab=box(snapshots,[1.6,.19,1.4],[(i-1)*3,0,0],i===1?orange:black);
    wireBox(slab,[1.8,.6,1.6],[0,.1,0]);
  }
  const terrain=make('terrain');
  const terrainGeo=new THREE.PlaneGeometry(24,13,95,65);
  const tv=terrainGeo.attributes.position;
  for(let i=0;i<tv.count;i++){
    const x=tv.getX(i),y=tv.getY(i);
    const ridge=Math.sin(x*.38+y*.33)*.4+Math.sin(x*.77-y*.45)*.18+Math.sin(y*.6)*.4;
    tv.setZ(i,ridge+Math.sin(x*.14+y*.8)*Math.max(0,y/7)*1.6);
  }
  terrainGeo.computeVertexNormals();
  const terrainFragment = fragmentShader
    .replace('vec3 p=normalize(vPos)', 'vec3 p=vPos*.28')
    .replace('(.025+diffuse*1.6)', '(.035+diffuse*.65)');
  mesh(terrainGeo,new THREE.ShaderMaterial({vertexShader,fragmentShader:terrainFragment,side:THREE.DoubleSide}),terrain);
  const shared=make('shared');
  box(shared,[1.35,1.8,1.7],[-.88,0,0],pale);
  box(shared,[1.35,1.8,1.7],[.88,0,0],orange);
  wireBox(shared,[3.55,2.15,2],[0,0,0]);
  const privilege=make('privilege');
  for(const x of [-2.3,2.3]){
    box(privilege,[1.55,2.7,1.4],[x,0,0],x<0?black:orange);
    for(let j=0;j<3;j++)box(privilege,[1.1,.05,.05],[x,.6-j*.6,.73],pale);
    wireBox(privilege,[1.85,3,1.7],[x,0,0]);
  }
  const corridor=make('corridor');
  for(let i=0;i<6;i++){
    const frame=new THREE.Group();frame.position.z=(i-2.5)*1.1;corridor.add(frame);
    const mat=i===2?orange:black;
    box(frame,[3.1,.08,.08],[0,1.25,0],mat);box(frame,[3.1,.08,.08],[0,-1.25,0],mat);
    box(frame,[.08,2.5,.08],[-1.55,0,0],mat);box(frame,[.08,2.5,.08],[1.55,0,0],mat);
    mesh(new THREE.SphereGeometry(.055,10,8),pale,frame,[-1.55,1.25,0]);
  }
  const boundaries=make('boundaries');
  for(const x of [-2.6,2.6]){
    wireBox(boundaries,[2.5,1.6,1.6],[x,0,0],0x6d7367);
    box(boundaries,[1.35,.3,1.1],[x,0,0],x<0?orange:black);
    const ring=mesh(new THREE.TorusGeometry(.85,.025,8,60),orange,boundaries,[x,0,0]);ring.rotation.x=.35;
  }
  const authentication=make('authentication');
  for(const x of [-2.5,2.5]){
    mesh(new THREE.TorusGeometry(.6,.11,12,48),x<0?orange:pale,authentication,[x,.25,0]);
    box(authentication,[1.2,.65,.65],[x,-.45,0],x<0?orange:black);
  }
  path(authentication,[[-1.7,0,0],[0,.12,0],[1.7,0,0]],orange,.013);
  const cost=make('cost');
  [1,1,1,1].forEach((h,i)=>{
    box(cost,[1.1,h,.9],[(i-1.5)*1.45,h/2-.8,0],i===2?orange:pale);
    wireBox(cost,[1.25,.08,1.05],[(i-1.5)*1.45,-.88,0],0x6b6a5b);
  });
  const price=make('price');
  const demandTower=box(price,[1.8,1,1.6],[-2,0,0],orange);
  const commitTower=box(price,[1.8,1,1.6],[2,0,0],pale);
  wireBox(price,[2.2,.06,2],[-2,-1.5,0]);wireBox(price,[2.2,.06,2],[2,-1.5,0]);
  const elastic=make('elastic');const capacityCubes=[];
  for(let i=0;i<20;i++){
    const block=box(elastic,[.67,.67,.67],[(i%5-2)*.93,0,(Math.floor(i/5)-1.5)*.93],i<2?orange:pale);
    capacityCubes.push(block);
  }
  wireBox(elastic,[5,.035,4],[0,-.4,0]);
  const finops=make('finops');
  mesh(new THREE.TorusGeometry(1.95,.035,8,100),black,finops);
  for(let i=0;i<3;i++){
    const a=Math.PI/2+i*Math.PI*2/3;
    mesh(new THREE.SphereGeometry(.21,20,16),orange,finops,[Math.cos(a)*1.95,Math.sin(a)*1.95,0]);
  }
  mesh(new THREE.TorusGeometry(1.52,.012,6,80),orange,finops).rotation.y=.3;
  const architecture=make('architecture');
  for(let i=0;i<3;i++){
    const x=(i-1)*3;
    box(architecture,[2.15,.18,1.9],[x,-.3,0],black);
    if(i===2){for(let j=0;j<3;j++)mesh(new THREE.CylinderGeometry(.5,.5,.24,28),j===2?orange:pale,architecture,[x,j*.27,0]);}
    else for(let j=0;j<2;j++)box(architecture,[1.05,.24,.9],[x,j*.31,0],i===1?orange:pale);
    if(i<2)path(architecture,[[x+1.1,-.25,0],[x+1.5,-.1,0],[x+1.9,-.25,0]],orange,.025);
  }
  box(architecture,[.8,.16,.7],[-1.5,.3,2],pale);
  path(architecture,[[-1.5,.3,2],[-.4,.2,1.7],[0,.1,.7]],orange,.013);
  const alert=make('alert');
  const triangle=new THREE.Shape();triangle.moveTo(0,1.25);triangle.lineTo(-1.25,-1);triangle.lineTo(1.25,-1);triangle.closePath();
  mesh(new THREE.ExtrudeGeometry(triangle,{depth:.25,bevelEnabled:true,bevelSize:.06,bevelThickness:.06,bevelSegments:2,steps:1}),black,alert);
  box(alert,[.14,.85,.1],[0,.2,.4],pale);box(alert,[.14,.14,.1],[0,-.5,.4],pale);

  const incident=make('lab-incident');
  const incidentRed=new THREE.MeshStandardMaterial({color:0xe66432,metalness:.45,roughness:.36});
  const incidentPathMat=new THREE.MeshStandardMaterial({color:0xe66432,transparent:true,opacity:1,metalness:.4,roughness:.4});
  const exposedKey=new THREE.Group();incident.add(exposedKey);exposedKey.position.set(-3.3,0,0);
  mesh(new THREE.TorusGeometry(.4,.11,12,40),orange,exposedKey,[-.3,.3,0]);
  box(exposedKey,[1,.17,.2],[.4,.3,0],orange);box(exposedKey,[.15,.4,.2],[.7,.15,0],orange);
  const incidentPath=path(incident,[[-2.3,.2,0],[-1.3,.35,0],[0,.2,0],[2.3,.2,0]],incidentPathMat,.035);
  const containment=new THREE.Group();incident.add(containment);containment.position.x=-1.5;
  for(const x of [-.3,.3])box(containment,[.08,1.85,.12],[x,.2,0],pale);
  for(const y of [-.65,.2,1.05])box(containment,[.7,.08,.12],[0,y,0],pale);
  for(let i=0;i<2;i++)box(incident,[.85,.4,.85],[0,i*.55,0],pale);
  const rogueMachines=[];
  for(let i=0;i<6;i++)rogueMachines.push(box(incident,[.55,.55,.55],[2.5+(i%3)*.68,Math.floor(i/3)*.72,0],incidentRed));
  const evidence=new THREE.Group();incident.add(evidence);evidence.position.set(1.3,-1,0);
  for(let i=0;i<3;i++)box(evidence,[.5,.08,.5],[0,i*.16,0],pale);

  // Deterministic, sparse distant stars. Render once; no constant particle loop.
  let seed=11; const rand=()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646;};
  const starGeo = new THREE.BufferGeometry(); const positions=[];
  for(let i=0;i<220;i++) positions.push((rand()-.5)*36,(rand()-.5)*22,-12-rand()*8);
  starGeo.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));
  const stars = new THREE.Points(starGeo,new THREE.PointsMaterial({color:0x8d8b89,size:.012,transparent:true,opacity:.55}));backgroundScene.add(stars);

  let current=null, currentDesign=null, active=true, quality='balanced', spatialTween;
  const homePositions=new Map();
  Object.values(groups).forEach(g=>g.children.forEach(child=>homePositions.set(child,child.position.clone())));
  function silhouette(group){
    if(!group)return null;
    group.updateWorldMatrix(true,true);camera.updateMatrixWorld();
    const shapes=[];
    group.traverse(object=>{if(object.geometry?.attributes.position&&object.visible)shapes.push(object);});
    if(!shapes.length)return null;
    const points=new Float32Array(morphCount*3),point=new THREE.Vector3();
    for(let i=0;i<morphCount;i++){
      const object=shapes[i%shapes.length],attribute=object.geometry.attributes.position;
      point.fromBufferAttribute(attribute,(i*137)%attribute.count).applyMatrix4(object.matrixWorld).project(camera);
      points[i*3]=THREE.MathUtils.clamp(point.x,-1.08,1.08);
      points[i*3+1]=THREE.MathUtils.clamp(point.y,-1.08,1.08);
    }
    return points;
  }
  function morphBetween(from,to){
    if(!from||!to)return;
    const state={progress:0};
    morphPositions.set(from);morphMaterial.opacity=0;
    morphMaterial.color.set(['paper','split'].includes(currentDesign.tone)?0x9f492a:0xe4a271);
    morphTween=gsap.timeline({onUpdate:render});
    morphTween.to(state,{progress:1,duration:1.05,ease:'power3.inOut',onUpdate:()=>{
      const p=state.progress,bend=Math.sin(p*Math.PI)*.12;
      for(let i=0;i<morphCount;i++){
        const k=i*3,angle=i*2.399;
        morphPositions[k]=THREE.MathUtils.lerp(from[k],to[k],p)+Math.cos(angle)*bend;
        morphPositions[k+1]=THREE.MathUtils.lerp(from[k+1],to[k+1],p)+Math.sin(angle)*bend;
      }
      morphGeometry.attributes.position.needsUpdate=true;
    }},0).to(morphMaterial,{opacity:.48,duration:.2},0).to(morphMaterial,{opacity:0,duration:.45},.6);
  }
  function fitScene(design){
    if(!current)return;
    if(design.layout==='gate'){
      current.position.set(...design.position);current.scale.setScalar(design.scale);camera.position.set(0,0,10);camera.lookAt(0,0,0);return;
    }
    if(design.layout==='horizon'){
      const aspect=host.clientWidth/Math.max(host.clientHeight,1);
      const radius=2.93*Math.abs(design.scale);
      const widthScale=aspect<1?1.8:1.08;
      const halfHeight=radius/(widthScale*aspect);
      camera.left=-halfHeight*aspect;camera.right=halfHeight*aspect;
      camera.top=halfHeight;camera.bottom=-halfHeight;
      current.position.set(0,(aspect<1?.38:.56)*halfHeight-radius,0);
      camera.position.set(0,0,25);camera.lookAt(0,0,0);camera.updateProjectionMatrix();return;
    }
    const slot=document.querySelector('.scene-slot');if(!slot)return;
    const rect=slot.getBoundingClientRect();
    const aspect=rect.width/Math.max(rect.height,1);
    if(design.scene==='privilege')current.children.forEach(c=>{const h=homePositions.get(c);if(h)c.position.x=h.x;});
    current.position.set(0,0,0);current.updateWorldMatrix(true,true);
    const bounds=new THREE.Box3().setFromObject(current);
    const center=bounds.getCenter(new THREE.Vector3());
    const size=bounds.getSize(new THREE.Vector3());
    if(design.scene==='price'){
      center.set(0,0,0);size.set(6.6,3.5,2.6);
      if(design.layout==='lab'){
        demandTower.position.x=-2;commitTower.position.x=2;
        price.children[2].position.x=-2;price.children[3].position.x=2;
      }
    }
    if(design.scene==='elastic'){center.set(0,0,0);size.set(5.6,4.8,4.8);}
    if(design.scene==='lab-incident'){center.set(0,0,0);size.set(9.5,3.7,3);}
    current.position.sub(center);
    current.updateWorldMatrix(true,true);
    if(camera.isOrthographicCamera){
      const halfHeight=design.scene==='terrain'?size.x/aspect*.54:Math.max(size.y,size.x/aspect)*.58;
      camera.left=-halfHeight*aspect;camera.right=halfHeight*aspect;
      camera.top=halfHeight;camera.bottom=-halfHeight;
      camera.position.set(0,0,25);camera.lookAt(0,0,0);camera.updateProjectionMatrix();
      if(design.scene==='price'||design.scene==='privilege'){
        const cells=design.scene==='price'?[...document.querySelectorAll('.duel-demand,.duel-commit')]:[...document.querySelectorAll('.privilege-pair>div')];
        const xs=cells.map(cell=>{const r=cell.getBoundingClientRect();return ((r.left+r.width/2-rect.left)/rect.width*2-1)*halfHeight*aspect;});
        if(xs.length===2){
          if(design.scene==='price'){
            demandTower.position.x=xs[0];commitTower.position.x=xs[1];price.children[2].position.x=xs[0];price.children[3].position.x=xs[1];
          }else current.children.forEach(child=>{const h=homePositions.get(child);if(h)child.position.x=h.x+(h.x<0?xs[0]+2.3:xs[1]-2.3);});
        }
      }
      return;
    }
    const halfFov=Math.tan(THREE.MathUtils.degToRad(camera.fov/2));
    if(design.scene==='planet'){
      // Frame the complete sphere, not a clipped horizon or a flat texture.
      const radius=2.93*Math.abs(design.scale);
      const limitingAngle=Math.min(THREE.MathUtils.degToRad(camera.fov/2),Math.atan(halfFov*aspect));
      camera.position.set(0,0,radius/Math.sin(limitingAngle)*1.08);
      camera.lookAt(0,0,0);camera.aspect=aspect;camera.updateProjectionMatrix();return;
    }
    let distance=2;
    const points=[];
    if(['price','elastic'].includes(design.scene)){
      for(const x of [-1,1])for(const y of [-1,1])for(const z of [-1,1])points.push(new THREE.Vector3(x*size.x/2,y*size.y/2,z*size.z/2));
    }else current.traverse(obj=>{
      if(!obj.geometry)return;obj.geometry.computeBoundingBox();const b=obj.geometry.boundingBox;if(!b)return;
      for(const x of [b.min.x,b.max.x])for(const y of [b.min.y,b.max.y])for(const z of [b.min.z,b.max.z])points.push(new THREE.Vector3(x,y,z).applyMatrix4(obj.matrixWorld));
    });
    points.forEach(p=>{distance=Math.max(distance,p.z+Math.abs(p.y)/(halfFov*.88),p.z+Math.abs(p.x)/(halfFov*aspect*.88));});
    camera.position.set(0,0,distance);camera.lookAt(0,0,0);
    camera.aspect=aspect;camera.updateProjectionMatrix();
  }
  function setDesign(design,instant=false){
    const previousShape=!instant&&!reducedMotion.matches?silhouette(current):null;
    morphTween?.kill();morphMaterial.opacity=0;
    active=true;host.hidden=false;currentDesign=design;
    camera=['terraces','time','privilege','duality','ownership','price-duel','expansion','cycle','blueprint','proof','horizon','lab'].includes(design.layout)?diagramCamera:perspectiveCamera;
    spatialTween?.kill();
    gsap.killTweensOf(camera.position);
    const g=groups[design.scene]||planet;
    Object.values(groups).forEach(other=>{other.visible=false;gsap.killTweensOf(other.position);gsap.killTweensOf(other.scale);gsap.killTweensOf(other.rotation);other.children.forEach(child=>{gsap.killTweensOf(child.position);gsap.killTweensOf(child.scale);});});
    current=g;g.visible=true;stars.visible=!['paper','split','rust'].includes(design.tone);
    g.children.forEach(child=>{const home=homePositions.get(child);if(home)child.position.copy(home);});
    const position=[0,0,0],scale=design.scale;
    const rotation=design.rotation||[0,0,0];
    pivot.rotation.set(0,0,0);g.position.set(...position);g.rotation.set(...rotation);g.scale.setScalar(scale);fitScene(design);
    position[0]=g.position.x;position[1]=g.position.y;position[2]=g.position.z;
    const targetCameraZ=camera.position.z;
    const nextShape=silhouette(g);
    planetUniforms.uMorph.value=0;
    if(!instant&&!reducedMotion.matches){
      morphBetween(previousShape,nextShape);
      const tl=gsap.timeline({onUpdate:render});spatialTween=tl;
      const type=design.transition;
      if(design.scene==='planet'){
        planetUniforms.uMorph.value=1;
        tl.to(planetUniforms.uMorph,{value:0,duration:1.8,ease:'sine.inOut'},0);
        tl.fromTo(planetSurface.rotation,{y:planetSurface.rotation.y-.32},{y:planetSurface.rotation.y,duration:1.8,ease:'power2.out'},0);
        tl.fromTo(g.scale,{x:scale*.86,y:scale*.86,z:scale*.86},{x:scale,y:scale,z:scale,duration:1.1,ease:'power3.out'},0);
      }else if(type==='orbit'){
        tl.fromTo(g.rotation,{y:rotation[1]-.65,z:rotation[2]-.18},{y:rotation[1],z:rotation[2],duration:1.2,ease:'power3.out'},0);
      }else if(type==='dive'){
        tl.fromTo(camera.position,{z:targetCameraZ*1.3},{z:targetCameraZ,duration:1.25,ease:'power3.inOut'},0);
        tl.fromTo(g.rotation,{y:rotation[1]+.5},{y:rotation[1],duration:1.25,ease:'power3.out'},0);
      }else if(type==='split'){
        g.children.slice(0,2).forEach((child,i)=>{const home=homePositions.get(child);if(home)tl.fromTo(child.position,{x:home.x+(i?1.4:-1.4)},{x:home.x,duration:1,ease:'power3.out'},0);});
      }else if(type==='assemble'||type==='fracture'){
        g.children.forEach((child,i)=>{const home=homePositions.get(child);if(home)tl.fromTo(child.position,{x:home.x*(type==='fracture'?1.6:1),y:home.y+(i%2?-.7:.7),z:home.z-1.2},{x:home.x,y:home.y,z:home.z,duration:.95,ease:'power3.out'},i*.025);});
      }else if(type==='traverse'){
        tl.fromTo(g.position,{x:position[0]+1.3},{x:position[0],duration:1.15,ease:'power3.out'},0);
      }else if(type==='impact'){
        tl.fromTo(g.scale,{x:scale*.65,y:scale*.65,z:scale*.65},{x:scale,y:scale,z:scale,duration:.85,ease:'back.out(1.15)'},0);
      }else{
        tl.fromTo(g.position,{y:position[1]-.8,z:position[2]-.7},{y:position[1],z:position[2],duration:type==='horizon'?1.5:1.1,ease:'power3.out'},0);
      }
    }
    render();
  }
  function update({partTime=false,saleDay=false},instant=false){
    const duration=instant||reducedMotion.matches?0:.8;
    const h=partTime ? 2.4 * 176 / 730 : 2.4;
    gsap.to(demandTower.scale,{y:h,duration,ease:'power3.inOut',onUpdate:render});
    gsap.to(demandTower.position,{y:-1.5+h/2,duration,ease:'power3.inOut',onUpdate:render});
    commitTower.scale.y=1.44;commitTower.position.y=-1.5+1.44/2;
    capacityCubes.forEach((block,i)=>{
      const size=i<2||saleDay?1:.001;
      gsap.to(block.scale,{x:size,y:size,z:size,duration,delay:duration?i*.018:0,ease:'back.out(1.1)',onUpdate:render});
    });render();
  }
  function lab(state,instant=false){
    const duration=instant||reducedMotion.matches?0:.8;
    if(state.mode==='pricing'){
      const height=2.4*state.hours/730;
      gsap.to(demandTower.scale,{y:height,duration,ease:'power3.inOut',overwrite:true,onUpdate:render});
      gsap.to(demandTower.position,{y:-1.5+height/2,duration,ease:'power3.inOut',overwrite:true,onUpdate:render});
      commitTower.scale.y=1.44;commitTower.position.y=-1.5+.72;
    }else if(state.mode==='elasticity')update({saleDay:state.capacity==='peak'},instant);
    else{
      gsap.to(incidentPathMat,{opacity:state.incident===0?1:.06,duration,overwrite:true,onUpdate:render});
      const barrier=state.incident>0?1:.001,logs=state.incident>=2?1:.001;
      gsap.to(containment.scale,{x:barrier,y:barrier,z:barrier,duration,overwrite:true,ease:'power3.out',onUpdate:render});
      gsap.to(evidence.scale,{x:logs,y:logs,z:logs,duration,overwrite:true,ease:'power3.out',onUpdate:render});
      rogueMachines.forEach((block,i)=>{
        const size=state.incident===3?.001:1;
        gsap.to(block.scale,{x:size,y:size,z:size,duration,delay:duration?i*.045:0,overwrite:true,ease:'power3.inOut',onUpdate:render});
      });
    }
    render();
  }
  function resize(){
    renderer.setSize(host.clientWidth,host.clientHeight);
    camera.aspect=host.clientWidth/Math.max(host.clientHeight,1);camera.updateProjectionMatrix();
    if(current&&currentDesign)fitScene(currentDesign);
    render();
  }
  const onPointer=e=>{
    if(reducedMotion.matches||!active||innerWidth<760||document.body.classList.contains('reading'))return;
    gsap.to(pivot.rotation,{y:(e.clientX/innerWidth-.5)*.025,x:(e.clientY/innerHeight-.5)*.012,duration:.8,onUpdate:render});
  };
  addEventListener('pointermove',onPointer,{passive:true});addEventListener('resize',resize);
  let lastPlanetFrame=0;
  function revolve(time){
    if(!active||document.hidden||current!==planet||reducedMotion.matches)return;
    if(time-lastPlanetFrame<1/30)return;
    const elapsed=Math.min(time-lastPlanetFrame,.05);lastPlanetFrame=time;
    // Rotate the surface independently so camera framing and captions stay fixed.
    if(!gsap.isTweening(planetSurface.rotation))planetSurface.rotation.y+=elapsed*.045;
    planetUniforms.uTime.value+=elapsed*.28;
    render();
  }
  gsap.ticker.add(revolve);
  document.addEventListener('visibilitychange',render);resize();
  return {
    setDesign,update,lab,
    set(name,intro=false,instant=false){setDesign({scene:name,position:intro?[0,-4.6,-2.5]:[3.1,-.65,-2.2],scale:1,rotation:[0,0,0],transition:'horizon',tone:'dark',layout:'gate'},instant);},
    pause(){active=false;host.hidden=true;spatialTween?.kill();morphTween?.kill();morphMaterial.opacity=0;},
    resize,
    quality(value){quality=value;renderer.setPixelRatio(Math.min(devicePixelRatio,quality==='detail'?1.8:1.15));resize();},
    destroy(){gsap.ticker.remove(revolve);morphTween?.kill();spatialTween?.kill();removeEventListener('pointermove',onPointer);removeEventListener('resize',resize);morphGeometry.dispose();morphMaterial.dispose();renderer.dispose();}
  };
}
