import {gsap} from 'gsap';
export const chapterFor=id=>({
 'cloud-basics':{key:'operations',number:'01',title:'Operations',speaker:'Kent Paulo R. Delgado',line:'Keep it running.',verb:'Observe / Maintain / Recover'},
 'shared-responsibility':{key:'security',number:'02',title:'Security',speaker:'John Renan Labay',line:'Protect what matters.',verb:'Identity / Boundaries / Trust'},
 'total-cost':{key:'economics',number:'03',title:'Economics',speaker:'Earl Josh Delgado',line:'Make every resource count.',verb:'Measure / Adapt / Optimize'}
})[id];
let chapterTween;
export function clearChapter(root){chapterTween?.kill();chapterTween=null;root.querySelector('.chapter-cinematic')?.remove();document.body.classList.remove('chapter-is-active');const slide=root.querySelector('.art-slide');if(slide)slide.inert=false;}
export function mountChapter(root,chapter,{instant=false}={}){
 clearChapter(root);
 const panel=document.createElement('section');panel.className=`chapter-cinematic chapter-${chapter.key}`;
 panel.setAttribute('aria-labelledby','chapter-title');
 const art=chapter.key==='operations'?'<div class="chapter-assembly">'+Array.from({length:7},(_,i)=>`<i style="--i:${i}"></i>`).join('')+'</div>':chapter.key==='security'?'<div class="chapter-iris"><i></i><i></i><i></i><b>◎</b></div>':'<div class="chapter-columns">'+Array.from({length:8},(_,i)=>`<i style="--i:${i}"></i>`).join('')+'</div>';
 panel.innerHTML=`<span class="chapter-part">GROUP ELEVEN / PART ${chapter.number}</span><span class="chapter-person">${chapter.speaker}</span><div class="chapter-art" aria-hidden="true">${art}</div><div class="chapter-copy"><span class="chapter-verb">${chapter.verb}</span><h1 id="chapter-title">${chapter.title}<span>.</span></h1><p>${chapter.line}</p></div><button data-action="begin-chapter" class="chapter-begin">Begin ${chapter.title} <span>→</span></button><span class="chapter-navigation">Next / Space to continue</span>`;
 root.append(panel);root.querySelector('.art-slide').inert=true;document.body.classList.add('chapter-is-active');
 if(!instant){chapterTween=gsap.timeline();chapterTween.fromTo(panel,{opacity:0},{opacity:1,duration:.35}).fromTo(panel.querySelectorAll('.chapter-part,.chapter-person,.chapter-verb'),{opacity:0,y:15},{opacity:1,y:0,duration:.65,stagger:.08},.15).fromTo(panel.querySelector('h1'),{opacity:0,y:65,rotationX:-30},{opacity:1,y:0,rotationX:0,duration:1.1,ease:'expo.out'},.35).fromTo(panel.querySelectorAll('p,.chapter-begin,.chapter-navigation'),{opacity:0},{opacity:1,duration:.65,stagger:.1},.75);}
}
export function dismissChapter(root,{instant=false,onComplete}={}){
 chapterTween?.progress(1).kill();const panel=root.querySelector('.chapter-cinematic');if(!panel)return;
 document.body.classList.remove('chapter-is-active');root.querySelector('.art-slide').inert=false;panel.inert=true;
 const finish=()=>{panel.remove();onComplete?.();};
 if(instant){finish();return;}
 const shape=panel.classList.contains('chapter-security')?'circle(0% at 50% 50%)':panel.classList.contains('chapter-economics')?'inset(100% 0 0 0)':'inset(0 0 0 100%)';
 chapterTween=gsap.to(panel,{clipPath:shape,opacity:.1,duration:.85,ease:'expo.inOut',onComplete:finish});
}
