// Real frame sequence; partial turns clamp to their endpoints.
(async()=>{
 const area=document.querySelector('[data-node-id="7:5786"]'),img=area?.querySelector('img');
 if(!area||!img)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const manifestUrl=new URL('assets/bread-sequences/manifest.json',document.baseURI);
 let config;try{const response=await fetch(manifestUrl);if(!response.ok)return;config=await response.json();}catch{return;}
 if(!Array.isArray(config.rotation)||config.rotation.length<2)return;
 const hasBreak=Array.isArray(config.break)&&config.break.length>=2;
 const loop=config.loop!==false;
 const staticBreak=typeof config.brokenImage==='string';
 let rotation=[],breaking=[],ready=false,loading=false,visible=false,raf=0,lastTime=0;
 let current=0,target=0,phase='whole',progress=0,lastFrame='',pointer=null,dragged=false;
 const hint=document.createElement('span');hint.className='bread-viewer-hint';hint.setAttribute('aria-hidden','true');area.append(hint);
 const updateHint=()=>{hint.textContent=phase==='open'?'Нажмите, чтобы собрать':(hasBreak||staticBreak)?'Двигайте мышью — рассмотрите. Нажмите — разломите':'Двигайте мышью или проведите пальцем — рассмотрите хлеб';};
 const decode=async paths=>Promise.all(paths.map(async path=>{
  const frame=new Image();frame.src=new URL(path,manifestUrl).href;await frame.decode();return frame;
 }));
 const count=()=>rotation.length;
 const frameIndex=value=>loop?((Math.round(value)%count())+count())%count():Math.max(0,Math.min(count()-1,Math.round(value)));
 const show=(kind,index)=>{const key=kind+index;if(key===lastFrame)return;lastFrame=key;img.src=(kind==='rotation'?rotation:breaking)[index].src;area.dataset.breadFrame=String(index);};
 const shortest=(from,to)=>{if(!loop)return to-from;const n=count();return ((to-from+n*1.5)%n)-n*.5;};
 const kick=()=>{if(ready&&visible&&!raf)raf=requestAnimationFrame(tick);};
 function tick(now){
  raf=0;if(!ready||!visible)return;
  const dt=lastTime?Math.min(64,now-lastTime):16;lastTime=now;
  if(phase==='whole'||phase==='pivot'){
   const distance=shortest(current,target);
   current=reduced.matches?target:current+distance*(1-Math.exp(-dt/55));
   if(Math.abs(distance)<.06)current=target;
   show('rotation',frameIndex(current));
   if(phase==='pivot'&&Math.abs(shortest(current,target))<.06){phase='opening';progress=0;}
   if(phase!=='whole'||Math.abs(shortest(current,target))>.06)kick();
  }else if(phase==='opening'||phase==='closing'){
   const direction=phase==='opening'?1:-1;
   progress=reduced.matches?(direction>0?1:0):Math.max(0,Math.min(1,progress+direction*dt/(config.breakDuration||1000)));
   const eased=1-Math.pow(1-progress,3);show('break',Math.round(eased*(breaking.length-1)));
   if(progress===1){phase='open';area.classList.add('bread-is-open');area.setAttribute('aria-pressed','true');updateHint();}
   else if(progress===0){phase='whole';current=target=config.breakRotationFrame;area.classList.remove('bread-is-open');area.setAttribute('aria-pressed','false');show('rotation',frameIndex(current));updateHint();}
   else kick();
  }
 }
 const load=async()=>{
  if(loading||ready)return;loading=true;
  try{
   [rotation,breaking]=await Promise.all([decode(config.rotation),hasBreak?decode(config.break):staticBreak?decode([config.brokenImage]):Promise.resolve([])]);
   current=target=Math.max(0,Math.min(count()-1,config.initialFrame||0));
   config.breakRotationFrame=Math.max(0,Math.min(count()-1,config.breakRotationFrame||0));
   ready=true;area.classList.add('bread-viewer-ready');area.setAttribute('aria-label',(hasBreak||staticBreak)?'Рассмотреть и разломить хлеб. Стрелки меняют ракурс, Enter — разломить или собрать':'Рассмотреть хлеб с разных сторон. Стрелки меняют ракурс, Enter — увеличить');if(hasBreak||staticBreak)area.setAttribute('aria-pressed','false');show('rotation',frameIndex(current));updateHint();
  }catch{hint.remove();} // Failed assets never replace the original photograph.
 };
 const preload=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){preload.disconnect();load();}},{rootMargin:'600px'});preload.observe(area);
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;lastTime=0;if(visible)kick();else{cancelAnimationFrame(raf);raf=0;}},{threshold:0}).observe(area);
 const aim=x=>{if(!ready||phase!=='whole')return;const rect=area.getBoundingClientRect();const fraction=Math.max(0,Math.min(1,(x-rect.left)/rect.width));target=loop?config.initialFrame+(fraction-.5)*count():fraction*(count()-1);kick();};
 const toggle=()=>{if(!ready)return;
  if(staticBreak&&!hasBreak){
   if(phase!=='whole'&&phase!=='open')return;
   const opening=phase==='whole';phase=opening?'open':'whole';target=current;
   cancelAnimationFrame(raf);raf=0;
   show(opening?'break':'rotation',opening?0:frameIndex(current));
   area.classList.toggle('bread-is-open',opening);area.setAttribute('aria-pressed',String(opening));
   area.setAttribute('aria-label',opening?'Собрать хлеб':'Разломить хлеб. Стрелки меняют ракурс');updateHint();
   if(!reduced.matches)img.animate([{opacity:.45},{opacity:1}],{duration:240,easing:'ease-out'});
   return;
  }
if(phase==='whole'){phase='pivot';target=config.breakRotationFrame;kick();}else if(phase==='open'){phase='closing';kick();}};
 area.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')aim(e.clientX);});
 area.addEventListener('pointerdown',e=>{if(!ready)return;pointer={id:e.pointerId,x:e.clientX,y:e.clientY};dragged=false;});
 area.addEventListener('pointermove',e=>{
  if(e.pointerType==='mouse'){aim(e.clientX);return;}
  if(!pointer||pointer.id!==e.pointerId)return;
  const dx=e.clientX-pointer.x,dy=e.clientY-pointer.y;
  if(Math.abs(dx)>8&&Math.abs(dx)>Math.abs(dy))dragged=true;
  if(dragged)aim(e.clientX);
 });
 area.addEventListener('pointerleave',()=>{if(phase==='whole')target=current;});
 area.addEventListener('pointercancel',()=>{pointer=null;dragged=true;});
 area.addEventListener('click',e=>{if(!ready)return;if(!hasBreak&&!staticBreak&&!dragged)return;e.preventDefault();e.stopImmediatePropagation();if(!dragged)toggle();pointer=null;dragged=false;},true);
 area.addEventListener('keydown',e=>{
  if(!ready)return;
  if(!hasBreak&&!staticBreak&&(e.key==='Enter'||e.key===' '))return;
  if(['ArrowLeft','ArrowRight','Enter',' '].includes(e.key)){
   e.preventDefault();e.stopImmediatePropagation();
   if(e.key==='Enter'||e.key===' '){if(!e.repeat)toggle();}
   else if(phase==='whole'){target+=e.key==='ArrowRight'?1:-1;if(!loop)target=Math.max(0,Math.min(count()-1,target));kick();}
  }
 },true);
})();
