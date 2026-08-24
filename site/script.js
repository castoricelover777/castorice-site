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
const cursor=$('#cursor');window.addEventListener('pointermove',e=>{cursor.style.left=e.clientX+'px';cursor.style.top=e.clientY+'px';const art=$('#heroArt');if(art){const x=(e.clientX/innerWidth-.5)*10,y=(e.clientY/innerHeight-.5)*7;art.style.transform=`translate(${x}px,${y}px)`}});
$$('.hand-link,.gallery-item,.theme,.seed').forEach(e=>{e.addEventListener('pointerenter',()=>{cursor.style.width='28px';cursor.style.height='28px'});e.addEventListener('pointerleave',()=>{cursor.style.width='14px';cursor.style.height='14px'})});
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
  }
  $('#carPrev').addEventListener('click',()=>show(idx-1));
  $('#carNext').addEventListener('click',()=>show(idx+1));
  thumbs.forEach(t=>t.addEventListener('click',()=>show(+t.dataset.idx)));
  // 主图点击全屏查看
  const lightbox=document.createElement('div');lightbox.className='lightbox';
  lightbox.innerHTML='<img class="lightbox-img" alt=""><div class="lightbox-cap"></div><button class="lightbox-close" aria-label="关闭">×</button>';
  document.body.appendChild(lightbox);
  function openLB(){const img=lightbox.querySelector('.lightbox-img'),c=lightbox.querySelector('.lightbox-cap');img.src=main.src;c.textContent=title.textContent+' — '+text.textContent;lightbox.classList.add('show');document.body.style.overflow='hidden';}
  function closeLB(){lightbox.classList.remove('show');document.body.style.overflow='';}
  main.addEventListener('click',openLB);
  lightbox.querySelector('.lightbox-close').addEventListener('click',closeLB);
  lightbox.addEventListener('click',e=>{if(e.target===lightbox) closeLB();});
  window.addEventListener('keydown',e=>{if(e.key==='Escape') closeLB();});
  // 键盘左右切换
  window.addEventListener('keydown',e=>{if(e.key==='ArrowLeft')show(idx-1);if(e.key==='ArrowRight')show(idx+1);});
  show(0);
})();
const canvas=$('#gardenCanvas'),ctx=canvas.getContext('2d'),box=$('#gardenBox'),pop=$('#memoryPop'),seed=$('#seed'),count=$('#flowerCount');let flowers=[],pointer={x:.5,y:.5};
function resize(){const r=box.getBoundingClientRect(),d=devicePixelRatio;canvas.width=r.width*d;canvas.height=r.height*d;canvas.style.width=r.width+'px';canvas.style.height=r.height+'px';ctx.setTransform(d,0,0,d,0,0)}
function makeFlower(x=Math.random(),y=Math.random(),life=1){flowers.push({x,y,life,size:2+Math.random()*4,phase:Math.random()*7,speed:.4+Math.random()*.8,hue:Math.random()>.5?'#c99bff':(Math.random()>.5?'#e7a8d8':'#b98cff')})}
for(let i=0;i<22;i++)makeFlower();count.textContent=String(flowers.length).padStart(2,'0');window.addEventListener('resize',resize);resize();
box.addEventListener('pointermove',e=>{const r=box.getBoundingClientRect();pointer.x=(e.clientX-r.left)/r.width;pointer.y=(e.clientY-r.top)/r.height});box.addEventListener('pointerleave',()=>{pointer.x=.5;pointer.y=.5});
seed.addEventListener('click',()=>{makeFlower(.5+(Math.random()-.5)*.35,.55+(Math.random()-.5)*.35,1);count.textContent=String(flowers.length).padStart(2,'0');pop.classList.add('show');setTimeout(()=>pop.classList.remove('show'),2400)});
function draw(t){const r=box.getBoundingClientRect(),w=r.width,h=r.height;ctx.clearRect(0,0,w,h);flowers.forEach(f=>{f.phase+=.008*f.speed;const px=f.x*w+(pointer.x-.5)*25,py=f.y*h+Math.sin(f.phase)*10+(pointer.y-.5)*18;ctx.beginPath();ctx.fillStyle=f.hue;ctx.globalAlpha=.25+.55*f.life;ctx.shadowBlur=13;ctx.shadowColor=f.hue;ctx.arc(px,py,f.size,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.globalAlpha=.25;ctx.strokeStyle='#d9b9ff';ctx.moveTo(px,py);ctx.lineTo(px+(pointer.x-.5)*18,py-30);ctx.stroke()});ctx.globalAlpha=1;ctx.shadowBlur=0;requestAnimationFrame(draw)}requestAnimationFrame(draw);
