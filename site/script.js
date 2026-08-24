const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];

/* ===== 开屏 intro ===== */
(function(){
  const overlay=$('#introOverlay'), video=$('#introVideo'),
        skip=$('#introSkip'), enter=$('#introEnter');
  if(!overlay||!video) return;
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch='ontouchstart' in window;
  let dismissed=false, leaving=false;
  function dismiss(animate=true){
    if(dismissed) return; dismissed=true;
    if(overlay.classList.contains('done')) return;
    document.body.style.overflow='';
    $('html').classList.add('intro-done');
    try{ video.pause(); }catch(e){}
    overlay.setAttribute('aria-hidden','true');
    if(reduce || !animate){ overlay.classList.add('done'); return; }
    overlay.classList.add('leaving');
    setTimeout(()=>overlay.classList.add('done'),900);
  }
  // 无障碍/触屏：开屏期间锁定滚动
  document.body.style.overflow='hidden';
  enter.addEventListener('click',()=>dismiss(false));
  skip.addEventListener('click',()=>dismiss(false));
  enter.addEventListener('keydown',e=>{ if(e.key==='Enter'||e.key===' '){e.preventDefault();dismiss(false);} });
  skip.addEventListener('keydown',e=>{ if(e.key==='Enter'||e.key===' '){e.preventDefault();dismiss(false);} });
  // 点击视频区域 = 跳过（触屏友好）
  overlay.addEventListener('click',e=>{ if(e.target===overlay||e.target===video) dismiss(false); });
  // 在最后约 1 秒内开始虚化，保持视频继续播放，结束后再隐藏开屏
  const finishIntro=()=>{
    if(leaving||dismissed) return;
    leaving=true;
    document.body.style.overflow='';
    $('html').classList.add('intro-done');
    overlay.setAttribute('aria-hidden','true');
    overlay.classList.add('leaving');
    setTimeout(()=>{ try{ video.pause(); }catch(e){} overlay.classList.add('done'); },1000);
  };
  video.addEventListener('timeupdate',()=>{ if(video.duration && video.currentTime>=video.duration-1) finishIntro(); });
  video.addEventListener('ended',finishIntro);
  if(reduce){ // 系统偏好减少动效：直接进入
    dismiss(); return;
  }
  // 确保静音（否则部分浏览器阻止自动播放）
  video.muted=true; video.defaultMuted=true; video.autoplay=true; video.loop=false;
  let plays=0;
  const tryPlay=()=>{
    plays++;
    const p=video.play();
    if(p&&p.catch){
      p.then(()=>{ /* playing */ }).catch(()=>{
        // 首次可能因未就绪/被暂缓而失败；稍后重试
        if(video.paused && plays<3 && !video.ended){
          setTimeout(tryPlay, 600);
        }
      });
    }
  };
  video.addEventListener('loadeddata', tryPlay);
  video.addEventListener('canplay', tryPlay);
  video.addEventListener('canplaythrough', tryPlay);
  if(video.readyState>=2) tryPlay();
  // 兜底：即使视频没加载完，也给进入入口
  setTimeout(finishIntro,6000);
})();
const ease='cubic-bezier(.2,.8,.2,1)';
const observer=new IntersectionObserver(entries=>entries.forEach(e=>e.isIntersecting&&e.target.classList.add('visible')),{threshold:.13});$$('.reveal').forEach(e=>observer.observe(e));
const cursor=$('#cursor');const heroBg=document.querySelector('.hero-bg');window.addEventListener('pointermove',e=>{cursor.style.left=e.clientX+'px';cursor.style.top=e.clientY+'px'});
/* 滚动视差：hero 大图随滚动慢移 + 三区块渐显 */
window.addEventListener('scroll',()=>{ if(heroBg){heroBg.style.transform=`translateY(${scrollY*0.12}px) scale(1.05)`;} },{passive:true});
$$('.hand-link,.car-main,.theme,.nav-link,.car-btn,.car-thumb').forEach(e=>{e.addEventListener('pointerenter',()=>{cursor.style.width='34px';cursor.style.height='32px'});e.addEventListener('pointerleave',()=>{cursor.style.width='26px';cursor.style.height='24px'})});
window.addEventListener('scroll',()=>{$('#progress').style.width=(scrollY/(document.body.scrollHeight-innerHeight)*100)+'%'});
$('#theme').addEventListener('click',()=>{const dark=document.body.classList.toggle('dark');$('#theme').setAttribute('aria-pressed',dark)});
/* ===== 横向电影图集轮播 ===== */
(function(){
  const imgs=[];
  for(let i=1;i<=12;i++) imgs.push(`assets/gallery/gal_${String(i).padStart(2,'0')}.jpg`);
  const meta=[
    {t:'她从哪里来？',c:'雪做的孩子，替终结保管一盏灯。'},
    {t:'蝴蝶的翅膀',c:'折成花的形状，落在无人记得的夜。'},
    {t:'月光借给她',c:'今夜，所有的告别都轻一点。'},
    {t:'记忆花园',c:'点一朵花，它想起一句将要说的告别。'},
    {t:'四月的新雪',c:'有些花，只在离别之后才开。'},
    {t:'撑伞的人',c:'她为一场不会停的雨，备了一整夜。'},
    {t:'花与灰烬',c:'死亡并不带走所有东西，它留下相遇的形状。'},
    {t:'黄昏的衣摆',c:'她把一整个黄昏，穿成了沉默。'},
    {t:'静止的时间',c:'花瓣落下时，时间会停在原地。'},
    {t:'一封没有地址的信',c:'所有未说出口的话，都寄给了昨天。'},
    {t:'持灯者',c:'她不是终结本身，而是替终结保管一盏灯。'},
    {t:'蝴蝶与星',c:'她记得的，是来路，不是归途。'}
  ];
  const main=$('#carMain'),title=$('#carTitle'),text=$('#carText'),cap=$('#carCaption');
  const thumbs=[...document.querySelectorAll('.car-thumb')];
  let idx=0;
  function show(n){
    idx=(n+imgs.length)%imgs.length;
    main.classList.add('swap');
    setTimeout(()=>{ main.src=imgs[idx]; main.alt='遗蝶大图 '+meta[idx].t; main.classList.remove('swap'); },200);
    cap.querySelector('span').textContent='CAST · NO.'+String(idx+1).padStart(2,'0');
    title.textContent=meta[idx].t; text.textContent=meta[idx].c;
    thumbs.forEach((t,i)=>t.classList.toggle('active',i===idx));
    // 展签淡入
    cap.classList.remove('fade-in'); void cap.offsetWidth; cap.classList.add('fade-in');
  }
  // 移动端触屏左右滑动切换
  let tx=null;
  main.addEventListener('touchstart',e=>{tx=e.touches[0].clientX;},{passive:true});
  main.addEventListener('touchend',e=>{if(tx===null)return;const dx=e.changedTouches[0].clientX-tx;if(Math.abs(dx)>45){dx<0?show(idx+1):show(idx-1);}tx=null;},{passive:true});
  $('#carPrev').addEventListener('click',()=>show(idx-1));
  $('#carNext').addEventListener('click',()=>show(idx+1));
  thumbs.forEach(t=>t.addEventListener('click',()=>show(+t.dataset.idx)));
  // 主图点击全屏查看（灯箱，含上一张/下一张）
  const lightbox=document.createElement('div');lightbox.className='lightbox';
  lightbox.innerHTML='<button class="lightbox-close" aria-label="关闭">×</button><button class="lightbox-nav prev" aria-label="上一张">‹</button><img class="lightbox-img" alt=""><button class="lightbox-nav next" aria-label="下一张">›</button><div class="lightbox-cap"></div>';
  document.body.appendChild(lightbox);
  const L_img=lightbox.querySelector('.lightbox-img'),L_cap=lightbox.querySelector('.lightbox-cap');
  function syncLB(){L_img.src=imgs[idx];L_cap.textContent='CAST · NO.'+String(idx+1).padStart(2,'0')+' — '+meta[idx].t+'：'+meta[idx].c;}
  function openLB(){syncLB();lightbox.classList.add('show');document.body.style.overflow='hidden';}
  function closeLB(){lightbox.classList.remove('show');document.body.style.overflow='';}
  function lbNav(d){show(idx+d);syncLB();}
  main.addEventListener('click',openLB);
  lightbox.querySelector('.lightbox-close').addEventListener('click',closeLB);
  lightbox.querySelector('.lightbox-nav.prev').addEventListener('click',e=>{e.stopPropagation();lbNav(-1);});
  lightbox.querySelector('.lightbox-nav.next').addEventListener('click',e=>{e.stopPropagation();lbNav(1);});
  lightbox.addEventListener('click',e=>{if(e.target===lightbox) closeLB();});
  window.addEventListener('keydown',e=>{if(e.key==='Escape') closeLB();});
  window.addEventListener('keydown',e=>{if(lightbox.classList.contains('show')){if(e.key==='ArrowLeft')lbNav(-1);if(e.key==='ArrowRight')lbNav(1);}});
  // 轮播图键盘左右切换（非灯箱时）
  window.addEventListener('keydown',e=>{if(!lightbox.classList.contains('show')){if(e.key==='ArrowLeft')show(idx-1);if(e.key==='ArrowRight')show(idx+1);}});
  show(0);
})();
/* ===== 背景飘落花瓣 / 蝴蝶粒子 ===== */
(function(){
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const layer=document.createElement('div');layer.className='petals-layer';
  const style=document.createElement('style');
  style.textContent=`
    .petals-layer{position:fixed;inset:0;z-index:2;pointer-events:none;overflow:hidden}
    .petal-p{position:absolute;top:-30px;border:1px solid rgba(201,155,255,.35);background:linear-gradient(135deg,rgba(231,168,216,.5),rgba(185,140,255,.35));border-radius:100% 0 100% 0;opacity:0;animation:petalfall linear infinite}
    @keyframes petalfall{0%{transform:translateY(0) rotate(0);opacity:0}10%{opacity:.9}90%{opacity:.7}100%{transform:translateY(110vh) rotate(360deg);opacity:0}}
  `;
  document.head.appendChild(style);document.body.appendChild(layer);
  const colors=['#c99bff','#e7a8d8','#b98cff'];
  const N=window.innerWidth<700?10:18;
  for(let i=0;i<N;i++){
    const p=document.createElement('span');p.className='petal-p';
    const s=(8+Math.random()*16);
    p.style.width=s+'px';p.style.height=(s*1.5)+'px';
    p.style.left=Math.random()*100+'vw';
    p.style.animationDuration=(9+Math.random()*14)+'s';
    p.style.animationDelay=(Math.random()*12)+'s';
    p.style.background=`linear-gradient(135deg,${colors[i%3]},rgba(185,140,255,.3))`;
    layer.appendChild(p);
  }
})();
