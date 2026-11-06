'use strict';
const byNode=id=>document.querySelector(`[data-node-id="${id}"]`);
const catalogUrl='https://www.coolclever.ru/catalog/myasnov/khleba-remeslennye';
const appUrl='https://www.coolclever.ru/mobile-app';
function localLink(el,href){if(!el)return;el.href=href;el.removeAttribute('target');}
byNode('7:5787').parentElement.id='catalog';
byNode('28:686').parentElement.id='preorder';
localLink(byNode('6:4687'),'#catalog');localLink(byNode('6:4700'),'#preorder');
for(const a of document.querySelectorAll('a')){
 if(a.href.includes('frantsuzskie-konyaki'))a.href=a.textContent.includes('приложении')?appUrl:catalogUrl;
 if(a.target==='_blank')a.rel='noopener noreferrer';
}
for(const a of document.querySelectorAll('a'))if(a.textContent.includes('Выбрать свой хлеб')||a.textContent.includes('Выбрать целый хлеб'))localLink(a,'#catalog');
// Keep typography identifiers so the small-screen layout can reflow without changing the desktop reference.
for(const el of document.querySelectorAll('p,span,div')){
 const s=getComputedStyle(el),size=parseFloat(s.fontSize);
 if(size>=50)el.classList.add('mobile-heading');
 if(s.fontFamily.includes('Nexa'))el.classList.add('mobile-script');
}
const headings=['6:4663','7:5030','7:4834','7:5485','28:3343','28:3360','7:5760','7:5816','9:6171','28:688','28:754','28:763','28:779','28:796','28:802','28:818','28:1315'];
for(const [i,id] of headings.entries()){
 const el=byNode(id);if(el){el.setAttribute('role','heading');el.setAttribute('aria-level',i===0?'1':'2');}
}
for(const id of ['28:803','28:3129'])byNode(id)?.classList.add('format-column');
for(const id of ['28:3125','28:3157'])byNode(id)?.classList.add('format-card');
for(const id of ['28:3169','28:3171'])byNode(id)?.classList.add('format-photo');
const cards=[...document.querySelectorAll('[data-name^="Карточка"]')];
// The first catalog card is a component instance whose root uses its component ID.
if(byNode('9:5860'))cards.unshift(byNode('9:5860'));
const uniqueCards=[...new Set(cards)];
uniqueCards.forEach((card,index)=>{
 card.classList.add('product-card');card.dataset.group=index<6?'slow':'classic';
 card.dataset.pairing=[['breakfast','soup'],['breakfast','coffee'],['cheese','soup'],['cheese','coffee'],['breakfast','soup'],['cheese','soup'],['breakfast','soup'],['breakfast','cheese'],['soup','cheese'],['breakfast','coffee']][index]?.join(' ')||'breakfast soup';
});
const filterIds=['9:6581','9:6584','9:6587','9:6592','9:6594','9:6596','9:6598'];
const keys=['all','slow','classic','breakfast','cheese','soup','coffee'];
filterIds.forEach((id,i)=>{
 const el=byNode(id);el.classList.add('filter');el.setAttribute('role','button');el.tabIndex=0;el.setAttribute('aria-pressed',String(i===0));
 const activate=()=>{
  filterIds.forEach(other=>byNode(other).setAttribute('aria-pressed',String(other===id)));
  uniqueCards.forEach(c=>c.classList.toggle('card-hidden',!(keys[i]==='all'||c.dataset.group===keys[i]||c.dataset.pairing.split(' ').includes(keys[i]))));
  for(const row of ['9:5972','9:6050']){const el=byNode(row);el.hidden=![...el.children].some(c=>!c.classList.contains('card-hidden'));el.style.display=el.hidden?'none':'';}
  const classic=byNode('9:6166').parentElement;classic.hidden=!uniqueCards.some(c=>c.dataset.group==='classic'&&!c.classList.contains('card-hidden'));
  document.body.classList.toggle('is-filtered',i!==0);
  if(keys[i]==='classic')classic.scrollIntoView({behavior:'smooth',block:'start'});
 };
 el.addEventListener('click',activate);el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();activate();}});
});
for(const el of document.querySelectorAll('[data-name="Заказать"]')){
 el.classList.add('order-button');el.setAttribute('role','link');el.tabIndex=0;el.setAttribute('aria-label','Выбрать хлеб в каталоге КуулКлевер');
 const open=()=>{window.location.href=catalogUrl;};el.addEventListener('click',open);el.addEventListener('keydown',e=>{if(e.key==='Enter')open();});
}
const allBread=byNode('28:793');allBread.setAttribute('role','link');allBread.tabIndex=0;allBread.style.cursor='pointer';allBread.onclick=()=>location.href=catalogUrl;allBread.onkeydown=e=>{if(e.key==='Enter')location.href=catalogUrl;};
const photo=byNode('7:5786');photo.setAttribute('role','button');photo.tabIndex=0;photo.setAttribute('aria-label','Разломить хлеб');

// Moscow cutoff is displayed as a daily schedule; actual availability is checked by the store.
const clock=byNode('28:2575'),status=byNode('28:2574'),description=byNode('28:2576');
function updateClock(){const msk=new Date(Date.now()+3*3600000),minutes=msk.getUTCHours()*60+msk.getUTCMinutes();if(minutes<900){const left=900-minutes;clock.innerHTML=`<strong>${Math.floor(left/60)}</strong> часа <strong>${left%60}</strong> мин`;}else{clock.innerHTML='<strong>До 15:00</strong>';status.textContent='ПРЕДЗАКАЗ ИЗ ПЕКАРНИ';description.textContent='Выберите доступную дату и время получения на сайте или в приложении КуулКлевер.';}}
updateClock();setInterval(updateClock,60000);
function sizeDesktop(){document.documentElement.style.setProperty('--viewport-width',document.documentElement.clientWidth+'px');document.documentElement.style.setProperty('--scale',innerWidth>=1024&&document.documentElement.clientWidth<1620?document.documentElement.clientWidth/1620:1);}
sizeDesktop();window.addEventListener('resize',sizeDesktop,{passive:true});
const maturityIds=['I7:4921;7:1062','I7:4921;7:1064','I7:4921;7:1067'];
const maturityRows=[byNode('7:4962'),byNode('7:4963')];
const maturityHtml=maturityRows.map(e=>e.innerHTML);
maturityIds.forEach((id,index)=>{
 const el=byNode(id);el.classList.add('maturity-tab');el.tabIndex=0;el.setAttribute('role','button');el.setAttribute('aria-pressed',String(index===0));el.setAttribute('aria-label',`${[16,18,24][index]} часов созревания`);
 const select=()=>{maturityIds.forEach(other=>byNode(other).setAttribute('aria-pressed',String(other===id)));byNode('7:4953').textContent=[16,18,24][index];
  maturityRows.forEach((row,i)=>{row.innerHTML=index===0?maturityHtml[i]:i===0?`<a href="${catalogUrl}">Выбрать хлеб с долгим созреванием →</a>`:'<span>Ассортимент и характеристики — в каталоге.</span>';});};
 el.onclick=select;el.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();select();}};
});
// SVG preserves the precise dash spacing and rounded caps from Figma.
for (const id of ["28:2051", "28:2405", "28:2625", "28:2146", "28:2269", "28:3345", "28:3362", "28:2471", "28:2562", "28:3125", "28:3157"]) {
 const paper=byNode(id),ns='http://www.w3.org/2000/svg';
 paper.classList.add('paper-note');
 const svg=document.createElementNS(ns,'svg'),path=document.createElementNS(ns,'path');
 svg.classList.add('paper-stroke');svg.setAttribute('aria-hidden','true');
 path.setAttribute('fill','none');path.setAttribute('stroke',({"28:2146": "#eadbc8", "28:2269": "#f7f1e5", "28:3345": "#f7f1e5", "28:3362": "#f7f1e5", "28:2471": "#e7d7c2", "28:2562": "#f6f1e4", "28:3125": "#faf6ed", "28:3157": "#faf6ed", "28:2625": "#faf6ed"})[id] || '#eadbc8');
 path.setAttribute('stroke-width','15');path.setAttribute('stroke-dasharray','2 25');path.setAttribute('stroke-linecap','round');path.setAttribute('stroke-linejoin','round');
 svg.append(path);paper.append(svg);
 const draw=()=>{const w=paper.offsetWidth,h=paper.offsetHeight;
  svg.setAttribute('viewBox',`0 0 ${w} ${h}`);
  const a=7.5,r=12,right=w-a,bottom=h-a;
  const top=`M${a} ${h}V${a+r}Q${a} ${a} ${a+r} ${a}H${right-r}Q${right} ${a} ${right} ${a+r}V${h}`;
  const closed=`M${a+r} ${a}H${right-r}Q${right} ${a} ${right} ${a+r}V${bottom-r}Q${right} ${bottom} ${right-r} ${bottom}H${a+r}Q${a} ${bottom} ${a} ${bottom-r}V${a+r}Q${a} ${a} ${a+r} ${a}Z`;
  path.setAttribute('d',!['28:2405','28:2625'].includes(id)?closed:top);
 };
 new ResizeObserver(draw).observe(paper);draw();
}
// One pinned story, three stages controlled by the page's native scroll.
{
 const sections=[3,4,5].map(i=>document.querySelector(`.section-${i}`));
 const slides=['7:5482','28:3340','28:3357'].map(byNode);
 const picture=byNode('7:5477');
 const markerNodes=['7:5478','28:3336','28:3353'].map(byNode);
 const markerSources=markerNodes.map(el=>el.querySelector('img').getAttribute('src'));
 const story=document.createElement('section');story.className='process-story';story.setAttribute('aria-label','Как рождается хлеб: три этапа');
 const pin=document.createElement('div');pin.className='process-pin';
 const layout=document.createElement('div');layout.className='process-layout';
 const content=document.createElement('div');content.className='process-content';
 const navigation=document.createElement('nav');navigation.className='process-nav';navigation.setAttribute('aria-label','Этапы приготовления хлеба');
 const markers=document.createElement('img');markers.className='process-markers';markers.alt='';markers.src=markerSources[0];navigation.append(markers);
 const buttons=slides.map((slide,i)=>{
  const button=document.createElement('button');button.type='button';button.className='process-step-button';button.setAttribute('aria-label',['Шаг 1: Закваска','Шаг 2: Брожение','Шаг 3: Печь'][i]);
  button.onclick=()=>{const top=story.getBoundingClientRect().top+window.scrollY;window.scrollTo({top:top+i*window.innerHeight*.8+1,behavior:'instant'});};
  navigation.append(button);slide.classList.add('process-slide');content.append(slide);return button;
 });
 sections[0].before(story);picture.classList.add('process-picture');layout.append(picture,navigation,content);pin.append(layout);story.append(pin);sections.forEach(el=>el.remove());
 let current=0,amount=0,lastDirection=0,gestureTimer=0,consumed=false;
 const setStep=index=>{
  current=Math.min(2,Math.max(0,index));story.dataset.step=String(current+1);markers.src=markerSources[current];
  slides.forEach((slide,i)=>{slide.classList.toggle('is-current',i===current);slide.inert=i!==current;slide.setAttribute('aria-hidden',String(i!==current));buttons[i].setAttribute('aria-current',i===current?'step':'false');});
 };
 buttons.forEach((button,i)=>{button.onclick=()=>setStep(i);});
 const anchor=()=>story.getBoundingClientRect().top+window.scrollY-(document.querySelector('.site-header')?.offsetHeight||0);
 let locked=false,lastStepTime=0,settling=false,entryFrame=0,releasedDirection=0;
 const releaseStory=direction=>{locked=false;releasedDirection=direction;};
 window.addEventListener('site:navigate',()=>{locked=false;settling=false;cancelAnimationFrame(entryFrame);releasedDirection=0;});
 const enterStory=direction=>{
  locked=true;settling=true;releasedDirection=0;setStep(direction>0?0:2);
  consumed=true;lastDirection=direction;lastStepTime=performance.now();
  const from=window.scrollY,to=anchor(),start=performance.now();
  const duration=matchMedia('(prefers-reduced-motion: reduce)').matches?0:360;
  cancelAnimationFrame(entryFrame);
  const settle=now=>{
   const t=duration?Math.min(1,(now-start)/duration):1;
   window.scrollTo({top:from+(to-from)*(1-Math.pow(1-t,3)),behavior:'instant'});
   if(t<1)entryFrame=requestAnimationFrame(settle);
   else{settling=false;consumed=false;amount=0;lastStepTime=performance.now();}
  };
  entryFrame=requestAnimationFrame(settle);
 };
 // Prevent input while held; never correct scroll position after the browser moved.
 const crossesStory=delta=>{
  const distance=anchor()-window.scrollY,direction=Math.sign(delta);
  if(releasedDirection){
   if(Math.abs(distance)>4||direction!==releasedDirection)releasedDirection=0;
   else return false;
  }
  return delta>0?distance>=-1&&distance<=delta:distance<=1&&distance>=delta;
 };
 // Consume one scroll gesture per stage, without adding empty scroll space.
 window.addEventListener('wheel',event=>{
  if(event.ctrlKey||Math.abs(event.deltaX)>Math.abs(event.deltaY)||event.target.closest('.dev-panel'))return;
  const delta=event.deltaY*(event.deltaMode===1?16:event.deltaMode===2?window.innerHeight:1);
  const direction=Math.sign(delta);if(!direction)return;
  if(!locked){
   if(!crossesStory(delta))return;
   event.preventDefault();enterStory(direction);
  }
  if(settling){event.preventDefault();return;}
  if(direction!==lastDirection){amount=0;consumed=false;lastDirection=direction;}
  clearTimeout(gestureTimer);gestureTimer=setTimeout(()=>{amount=0;consumed=false;},180);
  const canChange=direction>0?current<2:current>0;
  if(consumed){event.preventDefault();return;}
  if(!canChange){if(performance.now()-lastStepTime<650){event.preventDefault();return;}releaseStory(direction);return;}
  event.preventDefault();amount+=Math.abs(event.deltaY)*(event.deltaMode===1?16:event.deltaMode===2?window.innerHeight:1);
  if(amount>=40&&performance.now()-lastStepTime>=650){setStep(current+direction);lastStepTime=performance.now();consumed=true;amount=0;}
 },{passive:false});
 let touchStart=0,touchConsumed=false;
 window.addEventListener('touchstart',event=>{touchStart=event.touches[0]?.clientY||0;touchConsumed=false;},{passive:true});
 window.addEventListener('touchmove',event=>{
  const delta=touchStart-(event.touches[0]?.clientY||touchStart),direction=Math.sign(delta);
  if(!direction)return;
  if(!locked){if(!crossesStory(delta))return;enterStory(direction);touchConsumed=true;}
  if(touchConsumed||settling){event.preventDefault();return;}
  if((direction>0&&current<2)||(direction<0&&current>0)){
   event.preventDefault();if(Math.abs(delta)>45){setStep(current+direction);lastStepTime=performance.now();touchConsumed=true;}
  }else{releaseStory(direction);}
 },{passive:false});
 window.addEventListener('keydown',event=>{
  if(event.target.closest('button,a,input,textarea,select,[contenteditable]'))return;
  const direction=['ArrowDown','PageDown',' '].includes(event.key)?1:['ArrowUp','PageUp'].includes(event.key)?-1:0;
  if(!direction)return;
  if(!locked){if(!crossesStory(direction*window.innerHeight))return;event.preventDefault();enterStory(direction);return;}
  if(settling){event.preventDefault();return;}
  if(direction&&((direction>0&&current<2)||(direction<0&&current>0))){event.preventDefault();if(!event.repeat){setStep(current+direction);lastStepTime=performance.now();}}else if(!event.repeat){releaseStory(direction);}else{event.preventDefault();}
 });
 setStep(0);

}
// Development view controls. Only the selected bakery variant changes.
{
 const bakery=document.querySelector('.section-13'),principles=byNode('28:783');
 const items=['28:784','28:787','28:790'].map(byNode);
 const widget=document.createElement('aside');widget.className='dev-widget';widget.setAttribute('aria-label','Dev Mod — варианты блоков');
 widget.innerHTML=`<button class="dev-toggle" type="button" aria-expanded="false" aria-controls="dev-panel"><span aria-hidden="true">◈</span> Dev Mod</button><div class="dev-panel" id="dev-panel" hidden><div class="dev-panel-header"><strong>Варианты блоков</strong><button class="dev-close" type="button" aria-label="Закрыть Dev Mod">×</button></div><label for="bakery-variant">Своя ремесленная пекарня</label><select id="bakery-variant"><option value="original">01 — Исходный макет</option><option value="production">02 — Линия производства</option><option value="photo">03 — Фотография с привязкой к тексту</option></select><p class="dev-description"></p></div>`;
 document.body.append(widget);
 const toggle=widget.querySelector('.dev-toggle'),panel=widget.querySelector('.dev-panel'),select=widget.querySelector('select');
 const close=()=>{panel.hidden=true;toggle.setAttribute('aria-expanded','false');};
 toggle.onclick=()=>{panel.hidden=!panel.hidden;toggle.setAttribute('aria-expanded',String(!panel.hidden));};
 widget.querySelector('.dev-close').onclick=close;
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden){close();toggle.focus();}});
 document.addEventListener('click',e=>{if(!widget.contains(e.target))close();});
 const track=document.createElement('div');track.className='production-track';track.setAttribute('aria-hidden','true');
 track.innerHTML='<div class="production-track-fill"></div><i class="production-mark"></i><i class="production-mark"></i><i class="production-mark"></i><span class="production-wheat">🌾</span>';
 principles.append(track);items.forEach(el=>el.classList.add('production-principle'));

 const panorama=document.createElement('figure');panorama.className='bakery-panorama';panorama.hidden=true;
 panorama.innerHTML=`<div class="panorama-scene"><img src="assets/bakery-panorama.png" alt="Иллюстративная панорама пекарни: хранение муки слева, шкафы созревания теста в центре и ручная формовка справа" width="1536" height="512"><button class="panorama-point" type="button" style="--x:14%;--y:28%" aria-label="1. Бережно храним муку" aria-controls="photo-principle-1"><span>1</span><span class="photo-point-label">Хранение муки</span></button><button class="panorama-point" type="button" style="--x:48%;--y:50%" aria-label="2. Создаём условия для теста" aria-controls="photo-principle-2"><span>2</span><span class="photo-point-label">Созревание теста</span></button><button class="panorama-point" type="button" style="--x:85%;--y:64%" aria-label="3. Самое важное делаем руками" aria-controls="photo-principle-3"><span>3</span><span class="photo-point-label">Ручная формовка</span></button></div><figcaption><span>Три принципа — три места в пекарне. Наведите на точку или описание.</span><span>Иллюстрация пекарни</span></figcaption>`;
 principles.before(panorama);
 const points=[...panorama.querySelectorAll('.panorama-point')];
 let selectedPhoto=-1;
 const highlight=index=>{items.forEach((el,i)=>el.classList.toggle('is-photo-active',i===index));points.forEach((point,i)=>{point.classList.toggle('is-highlighted',i===index);point.setAttribute('aria-pressed',String(i===index));});};
 items.forEach((item,i)=>{item.id='photo-principle-'+(i+1);
  item.addEventListener('pointerenter',()=>{if(select.value==='photo')highlight(i);});
  item.addEventListener('pointerleave',()=>{if(select.value==='photo'&&!item.contains(document.activeElement))highlight(selectedPhoto);});
  item.addEventListener('focusin',()=>{if(select.value==='photo')highlight(i);});
  item.addEventListener('click',()=>{if(select.value==='photo'){selectedPhoto=i;highlight(i);}});
 });
 points.forEach((point,i)=>{point.addEventListener('pointerenter',()=>highlight(i));point.addEventListener('pointerleave',()=>{if(document.activeElement!==point)highlight(selectedPhoto);});point.addEventListener('focus',()=>highlight(i));point.addEventListener('click',()=>{selectedPhoto=i;highlight(i);});});
 let enabled=false,queued=false;
 const update=()=>{queued=false;if(!enabled)return;
  const rect=principles.getBoundingClientRect(),mobile=matchMedia('(max-width:1023px)').matches;
  const start=innerHeight*.85,end=innerHeight*.35;
  const progress=Math.max(0,Math.min(1,(start-rect.top)/(Math.max(rect.height,160)+start-end)));
  principles.style.setProperty('--production-progress',progress);
  const active=Math.min(2,Math.round(progress*2));
  items.forEach((el,i)=>{el.classList.toggle('is-active',i===active);el.classList.toggle('is-passed',i<active);});
  [...track.querySelectorAll('.production-mark')].forEach((mark,i)=>mark.classList.toggle('is-passed',progress>=i/2));
  const first=items[0],last=items[2];
  if(mobile){
   track.style.left='8px';track.style.top=(first.offsetTop+10)+'px';track.style.width='1px';track.style.height=(last.offsetTop-first.offsetTop)+'px';
  }else{
   const x1=first.offsetLeft+first.offsetWidth/2,x2=last.offsetLeft+last.offsetWidth/2;
   track.style.left=x1+'px';track.style.top='15px';track.style.width=(x2-x1)+'px';track.style.height='1px';
  }
 };
 const requestUpdate=()=>{if(!queued){queued=true;requestAnimationFrame(update);}};
 const apply=value=>{enabled=value==='production';bakery.classList.toggle('bakery-production',enabled);select.value=value;track.hidden=!enabled;panorama.hidden=value!=='photo';bakery.classList.toggle('bakery-photo',value==='photo');items.forEach(item=>{if(value==='photo'){item.tabIndex=0;}else{item.removeAttribute('tabindex');}});selectedPhoto=-1;highlight(-1);
  widget.querySelector('.dev-description').textContent=value==='photo'?'Точки на панораме и описания выделяют друг друга. На телефоне нажмите на точку или текст.':enabled?'Прокрутите блок: колосок проходит три этапа и выделяет каждый принцип.':'Исходная композиция из макета Figma.';
  try{localStorage.setItem('bakery-variant',value);}catch{}
  requestUpdate();
 };
 select.onchange=()=>apply(select.value);
 let saved='production';try{saved=localStorage.getItem('bakery-variant')||'production';}catch{}
 apply(['original','production','photo'].includes(saved)?saved:'production');
 window.addEventListener('scroll',requestUpdate,{passive:true});window.addEventListener('resize',requestUpdate,{passive:true});new ResizeObserver(requestUpdate).observe(principles);
}
// Small, interruptible motion for the dough maturation card.
{
 const card=byNode('28:2146'),tabs=byNode('7:4921'),dial=byNode('7:4956'),number=byNode('7:4953');
 const controls=['I7:4921;7:1062','I7:4921;7:1064','I7:4921;7:1067'].map(byNode);
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const ringSvg=document.createElementNS('http://www.w3.org/2000/svg','svg');
 ringSvg.setAttribute('viewBox','0 0 210 210');ringSvg.setAttribute('aria-hidden','true');ringSvg.classList.add('maturity-progress-svg');
 const ring=document.createElementNS('http://www.w3.org/2000/svg','circle');
 const circumference=2*Math.PI*96.5;
 for(const [name,value] of Object.entries({cx:105,cy:105,r:96.5,fill:'none',stroke:'#485933','stroke-width':14,'stroke-linecap':'round','stroke-dasharray':circumference,'stroke-dashoffset':circumference/3,transform:'rotate(-90 105 105)'}))ring.setAttribute(name,String(value));
 ringSvg.append(ring);dial.append(ringSvg);dial.classList.add('maturity-ring-ready');
 const fillRing=hours=>{
  ring.getAnimations().forEach(animation=>animation.cancel());
  const offset=circumference*(1-hours/24);ring.setAttribute('stroke-dashoffset',String(offset));
  if(!reduced.matches)ring.animate([{strokeDashoffset:String(circumference)},{strokeDashoffset:String(offset)}],{duration:900,easing:'cubic-bezier(.25,.65,.3,1)'});
 };
 let countFrame=0,currentValue=Number(number.textContent)||16;
 const countTo=(value,from=currentValue)=>{
  cancelAnimationFrame(countFrame);if(reduced.matches){number.textContent=value;currentValue=value;return;}
  const start=performance.now();
  const tick=now=>{const t=Math.min(1,(now-start)/420),ease=1-Math.pow(1-t,3);currentValue=from+(value-from)*ease;number.textContent=Math.round(currentValue);if(t<1)countFrame=requestAnimationFrame(tick);else currentValue=value;};
  countFrame=requestAnimationFrame(tick);
 };
 const play=(element,keyframes,options)=>{element.getAnimations().forEach(a=>a.cancel());if(!reduced.matches)element.animate(keyframes,options);};
 const change=index=>{
  tabs.style.setProperty('--maturity-index',index);countTo([16,18,24][index]);fillRing([16,18,24][index]);
  play(dial,[{transform:'scale(.975)',opacity:.78},{transform:'scale(1)',opacity:1}],{duration:360,easing:'cubic-bezier(.2,.8,.2,1)'});
  [byNode('7:4962'),byNode('7:4963')].forEach((row,i)=>play(row,[{opacity:0,transform:'translateY(6px)'},{opacity:1,transform:'translateY(0)'}],{duration:260,delay:i*45,easing:'ease-out',fill:'backwards'}));
 };
 controls.forEach((control,i)=>{control.addEventListener('click',()=>change(i));control.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){change(i);}});});
 // Reveal once; never hide content while waiting for JavaScript or an observer.
 const observer=new IntersectionObserver(entries=>{if(!entries.some(e=>e.isIntersecting))return;observer.disconnect();
  fillRing([16,18,24][Math.max(0,controls.findIndex(c=>c.getAttribute('aria-pressed')==='true'))]);
  if(!reduced.matches){play(card,[{opacity:.55,transform:'translateY(14px)'},{opacity:1,transform:'translateY(0)'}],{duration:540,easing:'cubic-bezier(.2,.8,.2,1)'});countTo(Number(number.textContent)||16,0);}
 },{threshold:.3});observer.observe(card);
 reduced.addEventListener('change',()=>{if(reduced.matches){ring.getAnimations().forEach(animation=>animation.cancel());cancelAnimationFrame(countFrame);number.textContent=[16,18,24][controls.findIndex(c=>c.getAttribute('aria-pressed')==='true')]||16;}});
}

// Fixed header links from the Figma composition.
{
 const header=document.querySelector('.site-header');
 const targets={home:document.querySelector('.section-0'),preorder:document.getElementById('preorder')};
 targets.home.id='home';
 header.querySelectorAll('a[href^="#"]').forEach(link=>link.addEventListener('click',event=>{
  const target=targets[link.hash.slice(1)];if(!target)return;
  event.preventDefault();window.dispatchEvent(new Event('site:navigate'));
  window.scrollTo({top:Math.max(0,target.getBoundingClientRect().top+scrollY-header.offsetHeight-7.5),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
  history.replaceState(null,'',link.hash);
 }));
 const update=()=>header.classList.toggle('is-scrolled',scrollY>16);window.addEventListener('scroll',update,{passive:true});update();
}

// Show the top anchor when the visitor scrolls back up.
{
 const topLink=document.createElement('a');topLink.className='back-to-top';topLink.href='#home';topLink.setAttribute('aria-label','Наверх страницы');topLink.setAttribute('aria-hidden','true');topLink.tabIndex=-1;
 topLink.innerHTML='<img src="assets/header-back.svg" alt="" width="32" height="32">';document.body.append(topLink);
 let previousY=scrollY,upward=0,downward=0;
 const show=visible=>{topLink.classList.toggle('is-visible',visible);topLink.setAttribute('aria-hidden',String(!visible));topLink.tabIndex=visible?0:-1;};
 window.addEventListener('scroll',()=>{
  const y=Math.max(0,scrollY),delta=y-previousY;previousY=y;
  if(y<240){upward=downward=0;show(false);return;}
  if(delta<0){upward-=delta;downward=0;if(upward>20)show(true);}
  else if(delta>0){downward+=delta;upward=0;if(downward>20)show(false);}
 },{passive:true});
 topLink.addEventListener('click',event=>{
  event.preventDefault();window.dispatchEvent(new Event('site:navigate'));show(false);
  window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
  history.replaceState(null,'','#home');
 });
}

// Final invitation, variant 02: three real products before the actions.
{
 const section=document.querySelector('.section-17'),content=byNode('28:3189'),actions=byNode('28:3199');
 const group=document.createElement('div');group.className='dev-variant-group';
 group.innerHTML='<label for="home-variant">Пусть дома пахнет хлебом</label><select id="home-variant"><option value="original">01 — Исходный макет</option><option value="showcase">02 — Небольшая витрина перед кнопками</option><option value="ribbon">03 — Бумажная лента с рукописной фразой</option></select><p class="dev-description">Три хлеба с названиями и переходами на страницы товаров.</p>';
 document.querySelector('.dev-panel').append(group);
 const showcase=document.createElement('nav');showcase.className='home-showcase';showcase.setAttribute('aria-label','Выберите буханку');
 const products=[
  ['Итальянский домашний','showcase-italian.webp','khleb-italyanskiy-domashniy-na-zakvaske-900-g-90012344'],
  ['Чиабатта Итальянская','showcase-ciabatta.webp','chiabatta-italyanskaya-myasnov-pekarnya-90012522'],
  ['Багет Французский','showcase-baguette.webp','baget-frantsuzskiy-klassicheskiy-90000522']
 ];
 for(const [name,photo,slug] of products){
  const link=document.createElement('a');link.className='showcase-bread';link.href='https://www.coolclever.ru/catalog/product/'+slug;link.setAttribute('aria-label',name+' — открыть товар');
  link.innerHTML=`<img src="assets/${photo}" alt="${name}" width="240" height="170"><span>${name} <i aria-hidden="true">↗</i></span>`;showcase.append(link);
 }
 content.insertBefore(showcase,actions);
 const select=group.querySelector('select');
 const phrase=byNode('28:3190');let ribbonSeen=false;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const revealRibbon=()=>{
  if(ribbonSeen||!section.classList.contains('home-with-ribbon'))return;
  ribbonSeen=true;
  if(!reduced.matches)phrase.animate([{opacity:0,transform:'perspective(800px) rotateX(-55deg) scaleX(.8)'},{opacity:1,transform:'perspective(800px) rotateX(0deg) scaleX(1)'}],{duration:900,easing:'cubic-bezier(.2,.75,.2,1)'});
 };
 const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting))revealRibbon();},{threshold:.3});observer.observe(section);
 const apply=value=>{
  const variant=['showcase','ribbon'].includes(value)?value:'original';select.value=variant;
  showcase.hidden=variant!=='showcase';section.classList.toggle('home-with-showcase',variant==='showcase');section.classList.toggle('home-with-ribbon',variant==='ribbon');
  group.querySelector('.dev-description').textContent=variant==='ribbon'?'Рукописная фраза на бумажной ленте: мягкое разворачивание при появлении блока.':variant==='showcase'?'Три хлеба с названиями и переходами на страницы товаров.':'Исходная композиция из макета.';
  ribbonSeen=false;phrase.getAnimations().forEach(a=>a.cancel());
  const rect=section.getBoundingClientRect();if(rect.top<innerHeight*.7&&rect.bottom>0)revealRibbon();
  try{localStorage.setItem('home-variant',variant);}catch{}
 };
 select.onchange=()=>apply(select.value);let saved='ribbon';try{const stored=localStorage.getItem('home-variant');if(['original','showcase','ribbon'].includes(stored))saved=stored;}catch{}apply(saved);
}

// Restrained finishing motion: once on entry, small feedback on direct actions.
{
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const running=new Set();
 const ids=['6:4753','7:5760','7:5814','28:759','28:777','28:3176'];
 const targets=ids.map(byNode).filter(Boolean);
 const observer=new IntersectionObserver(entries=>{
  for(const entry of entries){
   if(!entry.isIntersecting)continue;
   observer.unobserve(entry.target);
   if(reduced.matches||document.hidden)continue;
   const animation=entry.target.animate([{opacity:.65,translate:'0 12px'},{opacity:1,translate:'0 0'}],{duration:650,easing:'cubic-bezier(.22,1,.36,1)'});
   running.add(animation);animation.finished.then(()=>running.delete(animation),()=>running.delete(animation));
  }
 },{threshold:.18});
 targets.forEach(el=>observer.observe(el));
 const cancel=()=>{running.forEach(a=>a.cancel());running.clear();};
 reduced.addEventListener('change',()=>{if(reduced.matches)cancel();});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)cancel();});
 for(const link of document.querySelectorAll('.section a,.header-order')){
  if(link.classList.contains('showcase-bread'))continue;
  const arrow=link.querySelector('img[src$="33840.svg"],img[src$="78745.svg"]');
  if(arrow){link.classList.add('quiet-action');arrow.classList.add('quiet-action-arrow');}
 }
 for(const card of document.querySelectorAll('.product-card')){
  const image=card.querySelector('img[src$=".png"],img[src$=".webp"]');
  if(image)image.classList.add('quiet-product-image');
 }
}
