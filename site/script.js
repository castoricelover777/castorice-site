const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];

/* ===== 开屏 intro ===== */
(function(){
  const overlay=$('#introOverlay'), video=$('#introVideo'),
        skip=$('#introSkip'), enter=$('#introEnter');
  if(!overlay||!video) return;
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch='ontouchstart' in window;
  let shown=false;
  function showEnter(){
    if(shown) return; shown=true;
    enter.classList.add('show');
  }
  function dismiss(){
    if(overlay.classList.contains('done')) return;
    overlay.classList.add('done');
    document.body.style.overflow='';
    $('html').classList.add('intro-done');
    try{ video.pause(); }catch(e){}
  }
  // 无障碍/触屏：开屏期间锁定滚动
  document.body.style.overflow='hidden';
  enter.addEventListener('click',dismiss);
  skip.addEventListener('click',dismiss);
  enter.addEventListener('keydown',e=>{ if(e.key==='Enter'||e.key===' '){e.preventDefault();dismiss();} });
  skip.addEventListener('keydown',e=>{ if(e.key==='Enter'||e.key===' '){e.preventDefault();dismiss();} });
  // 点击视频区域 = 跳过（触屏友好）
  overlay.addEventListener('click',e=>{ if(e.target===overlay||e.target===video) dismiss(); });
  // 播完或足够时长后显示进入
  video.addEventListener('timeupdate',()=>{ if(video.currentTime>4.6) showEnter(); });
  video.addEventListener('ended',showEnter);
  // 自动播放（muted）失败/不支持 → 直接放行
  const tryPlay=()=>{
    const p=video.play();
    if(p&&p.catch){ p.catch(()=>{ /* autoplay blocked: 3s 后仍显示进入 */ setTimeout(showEnter,1200); }); }
  };
  if(reduce){ // 系统偏好减少动效：直接进入
    dismiss(); return;
  }
  video.addEventListener('loadeddata',tryPlay);
  if(video.readyState>=2) tryPlay();
  // 兜底：即使视频没加载完，也给进入入口
  setTimeout(showEnter,7000);
})();
const ease='cubic-bezier(.2,.8,.2,1)';
const observer=new IntersectionObserver(entries=>entries.forEach(e=>e.isIntersecting&&e.target.classList.add('visible')),{threshold:.13});$$('.reveal').forEach(e=>observer.observe(e));
const cursor=$('#cursor');window.addEventListener('pointermove',e=>{cursor.style.left=e.clientX+'px';cursor.style.top=e.clientY+'px';const art=$('#heroArt');if(art){const x=(e.clientX/innerWidth-.5)*10,y=(e.clientY/innerHeight-.5)*7;art.style.transform=`translate(${x}px,${y}px)`}});
$$('.hand-link,.archive-row,.theme,.seed').forEach(e=>{e.addEventListener('pointerenter',()=>{cursor.style.width='28px';cursor.style.height='28px'});e.addEventListener('pointerleave',()=>{cursor.style.width='14px';cursor.style.height='14px'})});
window.addEventListener('scroll',()=>{$('#progress').style.width=(scrollY/(document.body.scrollHeight-innerHeight)*100)+'%'});
$('#theme').addEventListener('click',()=>{const dark=document.body.classList.toggle('dark');$('#theme').setAttribute('aria-pressed',dark)});
$('#openNote').addEventListener('click',()=>{$('#note').classList.toggle('open');$('#openNote span').textContent=$('#note').classList.contains('open')?'－':'＋'});
$$('.archive-row').forEach(row=>row.addEventListener('click',()=>{$('#archiveAnswer').textContent=row.dataset.copy;$('#archiveAnswer').animate([{opacity:0,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],{duration:450,easing:ease})}));
const canvas=$('#gardenCanvas'),ctx=canvas.getContext('2d'),box=$('#gardenBox'),pop=$('#memoryPop'),seed=$('#seed'),count=$('#flowerCount');let flowers=[],pointer={x:.5,y:.5};
function resize(){const r=box.getBoundingClientRect(),d=devicePixelRatio;canvas.width=r.width*d;canvas.height=r.height*d;canvas.style.width=r.width+'px';canvas.style.height=r.height+'px';ctx.setTransform(d,0,0,d,0,0)}
function makeFlower(x=Math.random(),y=Math.random(),life=1){flowers.push({x,y,life,size:2+Math.random()*4,phase:Math.random()*7,speed:.4+Math.random()*.8,hue:Math.random()>.55?'#f5d49e':'#f0b2b0'})}
for(let i=0;i<22;i++)makeFlower();count.textContent=String(flowers.length).padStart(2,'0');window.addEventListener('resize',resize);resize();
box.addEventListener('pointermove',e=>{const r=box.getBoundingClientRect();pointer.x=(e.clientX-r.left)/r.width;pointer.y=(e.clientY-r.top)/r.height});box.addEventListener('pointerleave',()=>{pointer.x=.5;pointer.y=.5});
seed.addEventListener('click',()=>{makeFlower(.5+(Math.random()-.5)*.35,.55+(Math.random()-.5)*.35,1);count.textContent=String(flowers.length).padStart(2,'0');pop.classList.add('show');setTimeout(()=>pop.classList.remove('show'),2400)});
function draw(t){const r=box.getBoundingClientRect(),w=r.width,h=r.height;ctx.clearRect(0,0,w,h);flowers.forEach(f=>{f.phase+=.008*f.speed;const px=f.x*w+(pointer.x-.5)*25,py=f.y*h+Math.sin(f.phase)*10+(pointer.y-.5)*18;ctx.beginPath();ctx.fillStyle=f.hue;ctx.globalAlpha=.25+.55*f.life;ctx.shadowBlur=13;ctx.shadowColor=f.hue;ctx.arc(px,py,f.size,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.globalAlpha=.25;ctx.strokeStyle='#f5dcc0';ctx.moveTo(px,py);ctx.lineTo(px+(pointer.x-.5)*18,py-30);ctx.stroke()});ctx.globalAlpha=1;ctx.shadowBlur=0;requestAnimationFrame(draw)}requestAnimationFrame(draw);
