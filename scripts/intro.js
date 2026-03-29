
const $=id=>document.getElementById(id);
const EIC=t=>t<0.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
const EOE=t=>t>=1?1:1-Math.pow(2,-10*t);

function fi(id,dur,delay=0){
  setTimeout(()=>{
    const el=$(id),s=performance.now();
    function f(n){const t=Math.min((n-s)/dur,1);el.setAttribute('opacity',t);if(t<1)requestAnimationFrame(f);}
    requestAnimationFrame(f);
  },delay);
}

function tip(id,x1,y1,x2,y2,dur,delay=0){
  setTimeout(()=>{
    const el=$(id),s=performance.now();
    el.setAttribute('opacity',1);
    function f(n){
      const t=Math.min((n-s)/dur,1),e=EIC(t);
      el.setAttribute('cx',x1+(x2-x1)*e);
      el.setAttribute('cy',y1+(y2-y1)*e);
      el.setAttribute('opacity',t>0.82?(1-t)/0.18:1);
      if(t<1)requestAnimationFrame(f);else el.setAttribute('opacity',0);
    }
    requestAnimationFrame(f);
  },delay);
}

function draw(id,dur,delay=0){
  setTimeout(()=>{
    const el=$(id);el.style.setProperty('--d',dur+'ms');el.classList.add('dSeg');
  },delay);
}

function showBrackets(delay){
  ['bTLh','bTLv','bTRh','bTRv','bBLh','bBLv','bBRh','bBRv'].forEach(id=>fi(id,300,delay));
}

function startClock(){
  let c=24;const el=$('sclNum');
  const iv=setInterval(()=>{
    if(--c<=0){el.textContent='00';clearInterval(iv);return;}
    el.textContent=c<10?'0'+c:''+c;
  },112);
}

function lockH(){
  ['sL','sR','sX'].forEach(id=>{
    const e=$(id);e.style.strokeDashoffset='0';e.classList.remove('dSeg');void e.offsetWidth;
  });
}

function flicker(cb){
  const segs=document.querySelectorAll('.hs');
  const sq=['#f0f0f0','#3e3e3e','#e4e4e4','#5e5e5e','#dadada','#848484','#eaeaea','#acacac','#c0c0c0'];
  let i=0;
  const iv=setInterval(()=>{
    segs.forEach(s=>s.style.stroke=sq[i]);
    if(++i>=sq.length){clearInterval(iv);segs.forEach(s=>s.style.stroke='#c0c0c0');if(cb)cb();}
  },65);
}

function crossPulse(){
  const L=$('plL'),R=$('plR'),s=performance.now(),dur=800;
  L.setAttribute('opacity',1);R.setAttribute('opacity',1);
  function f(n){
    const t=Math.min((n-s)/dur,1),e=EOE(t);
    L.setAttribute('x1',185-170*e);
    R.setAttribute('x2',315+170*e);
    const op=t<0.28?1:1-(t-0.28)/0.72;
    L.setAttribute('opacity',op);R.setAttribute('opacity',op);
    if(t<1)requestAnimationFrame(f);else{L.setAttribute('opacity',0);R.setAttribute('opacity',0);}
  }
  requestAnimationFrame(f);
}

const EQ_IDS=['eq1','eq2','eq3','eq4','eq5','eq6','eq7'];
const EQ_BASE=442;

function startEQ(){
  EQ_IDS.forEach(id=>fi(id,500));
  function pulse(){
    EQ_IDS.forEach(id=>{
      const h=Math.floor(Math.random()*28)+5;
      $(id).setAttribute('y',EQ_BASE-h);
      $(id).setAttribute('height',h);
    });
  }
  pulse();
  return setInterval(pulse,228);
}

function glitch(cb){
  const el=$('main');const o=[8,-6,4,-3,2,0];let i=0;
  const iv=setInterval(()=>{
    el.style.transform=i<o.length-1?`translateX(${o[i]}px)`:'';
    if(++i>=o.length){clearInterval(iv);cb();}
  },38);
}

let eqIv;

function run(){
  // PHOTOGRAPHY: lens ring draws
  setTimeout(()=>$('lens').classList.add('lGo'),60);

  // PHOTOGRAPHY: crosshairs & focus ring appear as lens settles
  setTimeout(()=>{
    $('aH').style.opacity='1';
    $('aV').style.opacity='1';
    $('fRing').style.opacity='1';
  },600);

  // Brackets
  showBrackets(520);

  // BASKETBALL: shot clock appears + counts down
  fi('sclLbl',400,380);
  fi('sclNum',400,380);
  setTimeout(startClock,780);

  // H left vertical
  draw('sL',700,860);
  tip('tL',185,122,185,342,700,860);

  // H right vertical (slight cascade)
  draw('sR',700,1020);
  tip('tR',315,122,315,342,700,1020);

  // PHOTOGRAPHY: exposure data
  fi('exT',500,1120);

  // H crossbar
  draw('sX',450,1470);
  tip('tX',185,232,315,232,450,1470);

  // After crossbar lands: lock → flicker → music drops
  setTimeout(()=>{
    lockH();
    flicker(()=>{
      crossPulse();
      eqIv=startEQ();
      fi('lkT',300);
      fi('bpmT',450);
      fi('frmT',600);
    });
  },1930);

  // BASKETBALL: jersey number rises as ghost
  fi('jersey',900,2300);

  // Glitch → curtain split exit
  setTimeout(()=>{
    clearInterval(eqIv);
    glitch(()=>{
      $('st').classList.add('exit');
      $('ot').classList.add('exit');
      $('ob').classList.add('exit');
      setTimeout(()=>{
        ['ot','ob','st'].forEach(id=>$(id).style.display='none');
      },1080);
    });
  },3100);
}

const lastIntro = new Date(parseInt(localStorage.getItem("intoPlayed")));
const today = new Date();

const isNotToday =
  lastIntro.getFullYear() !== today.getFullYear() ||
  lastIntro.getMonth() !== today.getMonth() ||
  lastIntro.getDate() !== today.getDate();

if (isNotToday) {
  run();
  localStorage.setItem("intoPlayed", today.getTime())
  sessionStorage.setItem("intoPlayed", true);
} else {
  if (!sessionStorage.getItem("intoPlayed")) {
    run();
    sessionStorage.setItem("intoPlayed", true);
  } else {
    document.getElementById('st').style.display = 'none';
    document.getElementById('grain').style.display = 'none';
    document.getElementById('ot').style.display = 'none';
    document.getElementById('ob').style.display = 'none';
  }
}
