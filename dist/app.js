const TAU=Math.PI*2;
const MODELS=[
 {id:'cylinder',name:'Hình trụ động',desc:'Quan sát hai đáy tròn, đường sinh và sự thay đổi thể tích.',colors:['#0c6f61','#53c2aa'],formula:'S<sub>xq</sub> = 2πrh<br>V = πr²h',note:'Khi giữ nguyên bán kính và tăng gấp đôi chiều cao, thể tích cũng tăng gấp đôi.',controls:[['r','Bán kính r',1,6,2.8],['h','Chiều cao h',2,10,6]]},
 {id:'cone',name:'Hình nón động',desc:'Khám phá bán kính, chiều cao, đường sinh của hình nón.',colors:['#315ebd','#83a4f4'],formula:'l = √(r² + h²)<br>V = ⅓πr²h',note:'Hình nón có cùng đáy và chiều cao chỉ bằng một phần ba thể tích hình trụ.',controls:[['r','Bán kính r',1,6,3],['h','Chiều cao h',2,10,7]]},
 {id:'sphere',name:'Hình cầu động',desc:'Tìm hiểu tâm, bán kính, mặt cắt và thể tích hình cầu.',colors:['#7150c8','#b99bef'],formula:'S = 4πr²<br>V = ⁴⁄₃πr³',note:'Thể tích phụ thuộc vào lập phương bán kính: bán kính gấp đôi thì thể tích gấp tám.',controls:[['r','Bán kính r',1,6,3.5]]},
 {id:'box',name:'Hình hộp chữ nhật',desc:'Điều chỉnh ba kích thước và quan sát đường chéo không gian.',colors:['#b56e25','#f1bb70'],formula:'d = √(a²+b²+c²)<br>V = abc',note:'Đường chéo không gian nối hai đỉnh đối diện và đi qua bên trong khối hộp.',controls:[['a','Chiều dài a',2,9,6],['b','Chiều rộng b',2,8,4],['c','Chiều cao c',2,9,5]]},
 {id:'pyramid',name:'Hình chóp tứ giác',desc:'Thay đổi cạnh đáy, chiều cao và kiểm chứng công thức.',colors:['#b33c61','#ee86a7'],formula:'V = ⅓S<sub>đáy</sub>h<br>S<sub>đáy</sub> = a²',note:'Mọi hình chóp đều có thể tích bằng một phần ba tích diện tích đáy và chiều cao.',controls:[['a','Cạnh đáy a',2,8,5],['h','Chiều cao h',2,10,7]]}
];
const $=s=>document.querySelector(s), grid=$('#modelGrid'), dialog=$('#labDialog');
const state={model:MODELS[0],values:{},unit:'cm',angle:.4,tilt:.18,zoom:1,auto:true,drag:false,lastX:0,lastY:0,cylinderMode:'solid',coneMode:'solid',sphereMode:'solid',formAngle:0,formPlaying:false,unfoldProgress:0,unfoldPlaying:false,sliceProgress:40,slicePlaying:false};

function makeCanvas(canvas,model,preview=false){const ctx=canvas.getContext('2d');let angle=Math.random()*TAU;function fit(){const r=canvas.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);canvas.width=r.width*d;canvas.height=r.height*d;ctx.setTransform(d,0,0,d,0,0)}fit();new ResizeObserver(fit).observe(canvas);function frame(){
    const activeModel = preview ? model : state.model;
    const isForm = !preview && (
      (activeModel.id === 'cylinder' && state.cylinderMode === 'form') ||
      (activeModel.id === 'cone' && state.coneMode === 'form') ||
      (activeModel.id === 'sphere' && state.sphereMode === 'form')
    );
    const isUnfold = !preview && (
      (activeModel.id === 'cylinder' && state.cylinderMode === 'unfold') ||
      (activeModel.id === 'cone' && state.coneMode === 'unfold')
    );
    const isSlice = !preview && (
      (activeModel.id === 'sphere' && state.sphereMode === 'slice')
    );

    if(preview) {
      angle += .005;
    } else if(state.auto && !state.drag && !isForm && !isUnfold) {
      state.angle += .007;
    }

    if(isForm && state.formPlaying){
      state.formAngle += 2.0;
      if(state.formAngle >= 360){
        state.formAngle = 360;
        state.formPlaying = false;
      }
      const sl = $('#formationAngle'), out = $('#formationAngleOut');
      if(sl) sl.value = Math.round(state.formAngle);
      if(out) out.textContent = Math.round(state.formAngle) + '°';
    }

    if(isUnfold && state.unfoldPlaying){
      state.unfoldProgress += 1.2;
      if(state.unfoldProgress >= 100){
        state.unfoldProgress = 100;
        state.unfoldPlaying = false;
      }
      const uSl = $('#unfoldProgress'), uOut = $('#unfoldProgressOut');
      if(uSl) uSl.value = Math.round(state.unfoldProgress);
      if(uOut) uOut.textContent = Math.round(state.unfoldProgress) + '%';
    }

    if(isSlice && state.slicePlaying){
      state.sliceProgress += 1.2;
      if(state.sliceProgress >= 100){
        state.sliceProgress = 100;
        state.slicePlaying = false;
      }
      const sSl = $('#sliceProgress'), sOut = $('#sliceProgressOut');
      if(sSl) sSl.value = Math.round(state.sliceProgress);
      if(sOut) sOut.textContent = Math.round(state.sliceProgress) + '%';
    }

    if(!preview && activeModel.id === 'cylinder' && state.cylinderMode === 'form')
      drawCylinderFormation(ctx, canvas, state.values, state.angle, state.tilt, state.zoom);
    else if(!preview && activeModel.id === 'cylinder' && state.cylinderMode === 'unfold')
      drawCylinderUnfold(ctx, canvas, state.values, state.angle, state.tilt, state.zoom, state.unfoldProgress);
    else if(!preview && activeModel.id === 'cone' && state.coneMode === 'form')
      drawConeFormation(ctx, canvas, state.values, state.angle, state.tilt, state.zoom);
    else if(!preview && activeModel.id === 'cone' && state.coneMode === 'unfold')
      drawConeUnfold(ctx, canvas, state.values, state.angle, state.tilt, state.zoom, state.unfoldProgress);
    else if(!preview && activeModel.id === 'sphere' && state.sphereMode === 'form')
      drawSphereFormation(ctx, canvas, state.values, state.angle, state.tilt, state.zoom);
    else if(!preview && activeModel.id === 'sphere' && state.sphereMode === 'slice')
      drawSphereSlice(ctx, canvas, state.values, state.angle, state.tilt, state.zoom, state.sliceProgress);
    else 
      drawScene(ctx, canvas, activeModel, preview ? demoValues(model) : state.values, preview ? angle : state.angle, preview ? .15 : state.tilt, preview ? 1 : state.zoom);
    requestAnimationFrame(frame);
  }frame()}
function demoValues(m){return Object.fromEntries(m.controls.map(c=>[c[0],c[4]]))}
function project(x,y,z,a,t,s,cx,cy){let X=x*Math.cos(a)-z*Math.sin(a),Z=x*Math.sin(a)+z*Math.cos(a);let Y=y*Math.cos(t)-Z*Math.sin(t);return [cx+X*s,cy-Y*s,Z]}
function line(ctx,pts,color,w=1,dash=[]){ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.strokeStyle=color;ctx.lineWidth=w;ctx.setLineDash(dash);ctx.stroke();ctx.setLineDash([])}
function face(ctx,pts,fill,stroke='rgba(255,255,255,.65)'){ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();ctx.fillStyle=fill;ctx.fill();ctx.strokeStyle=stroke;ctx.lineWidth=1;ctx.stroke()}
function drawMilkCan(ctx,P,r,h,a,t,s,cx,cy,bot,top,N){
  let bGrad=ctx.createLinearGradient(cx-r*s,cy,cx+r*s,cy);
  bGrad.addColorStop(0,'#b45309');bGrad.addColorStop(0.2,'#f59e0b');bGrad.addColorStop(0.45,'#fffbeb');bGrad.addColorStop(0.7,'#fbbf24');bGrad.addColorStop(1,'#78350f');
  face(ctx,[bot[0],top[0],top[N/2],bot[N/2]],bGrad,'transparent');
  face(ctx,bot,'#e2e8f0','#94a3b8');face(ctx,top,'#f8fafc','#cbd5e1');
  let midBot=[],midTop=[];
  const hLabel=h*0.52;
  for(let i=0;i<N;i++){let ang=TAU*i/N;midBot.push(P(r*Math.cos(ang),-hLabel/2,r*Math.sin(ang)));midTop.push(P(r*Math.cos(ang),hLabel/2,r*Math.sin(ang)))}
  let lGrad=ctx.createLinearGradient(cx-r*s,cy,cx+r*s,cy);
  lGrad.addColorStop(0,'#991b1b');lGrad.addColorStop(0.25,'#dc2626');lGrad.addColorStop(0.5,'#fef08a');lGrad.addColorStop(0.75,'#dc2626');lGrad.addColorStop(1,'#7f1d1d');
  face(ctx,[midBot[0],midTop[0],midTop[N/2],midBot[N/2]],lGrad,'rgba(253,224,71,0.6)');
  line(ctx,midBot,'#fde047',1.6);line(ctx,midTop,'#fde047',1.6);
  line(ctx,[P(-r,-h/2,0),P(-r,h/2,0)],'#92400e',1.8);line(ctx,[P(r,-h/2,0),P(r,h/2,0)],'#92400e',1.8);
  line(ctx,bot,'#78350f',2);line(ctx,top,'#64748b',2);
  let ring=[];for(let i=0;i<N;i++){let ang=TAU*i/N;ring.push(P(r*0.65*Math.cos(ang),h/2,r*0.65*Math.sin(ang)))}
  line(ctx,ring,'#94a3b8',1.2);
  let pullP=P(0,h/2,0);ctx.beginPath();ctx.arc(pullP[0],pullP[1],Math.max(4,r*s*0.18),0,TAU);ctx.strokeStyle='#64748b';ctx.lineWidth=2;ctx.stroke();
  let textP=P(0,0,r);ctx.save();ctx.fillStyle='#ffffff';ctx.shadowColor='rgba(0,0,0,0.6)';ctx.shadowBlur=4;ctx.font=`bold ${Math.max(10,Math.round(r*s*0.28))}px sans-serif`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('SỮA ĐẶC',textP[0],textP[1]);ctx.restore();
}
function drawCylinderFormation(ctx,canvas,v,a,t,z){const W=canvas.clientWidth,H=canvas.clientHeight,cx=W/2,cy=H/2+8,s=Math.min(W,H)/14*z,P=(x,y,q)=>project(x,y,q,a,t,s,cx,cy),r=v.r,h=v.h,sweep=Math.max(.001,state.formAngle/360*TAU),steps=Math.max(2,Math.ceil(state.formAngle/5)),lower=[],upper=[];ctx.clearRect(0,0,W,H);for(let i=0;i<=steps;i++){const u=sweep*i/steps;lower.push(P(r*Math.cos(u),-h/2,r*Math.sin(u)));upper.push(P(r*Math.cos(u),h/2,r*Math.sin(u)))}if(state.formAngle>1){face(ctx,[...lower,...upper.slice().reverse()],'rgba(12,111,97,.3)','transparent');line(ctx,lower,'rgba(255,255,255,.9)',1.4);line(ctx,upper,'rgba(255,255,255,.9)',1.4);for(let i=0;i<=steps;i+=Math.max(1,Math.floor(steps/9)))line(ctx,[lower[i],upper[i]],'rgba(255,255,255,.28)',.8)}const ab=P(0,-h/2,0),at=P(0,h/2,0),eb=P(r*Math.cos(sweep),-h/2,r*Math.sin(sweep)),et=P(r*Math.cos(sweep),h/2,r*Math.sin(sweep));line(ctx,[ab,at],'rgba(255,255,255,.98)',2.3);face(ctx,[ab,eb,et,at],'rgba(83,194,170,.74)','rgba(255,255,255,.9)');line(ctx,[ab,eb],'#fff',1.4);ctx.save();ctx.fillStyle='#fff';ctx.font='700 15px Inter,system-ui,sans-serif';ctx.fillText('h',at[0]-22,(at[1]+ab[1])/2);ctx.fillText('r',(ab[0]+eb[0])/2,(ab[1]+eb[1])/2+18);ctx.restore()}

function drawConeFormation(ctx,canvas,v,a,t,z){
  const W=canvas.clientWidth,H=canvas.clientHeight,cx=W/2,cy=H/2+18,s=Math.min(W,H)/14*z,P=(x,y,q)=>project(x,y,q,a,t,s,cx,cy),r=v.r,h=v.h,sweep=Math.max(.001,state.formAngle/360*TAU),steps=Math.max(2,Math.ceil(state.formAngle/5)),rim=[];
  ctx.clearRect(0,0,W,H);
  for(let i=0;i<=steps;i++){
    const u=sweep*i/steps;
    rim.push(P(r*Math.cos(u),-h/2,r*Math.sin(u)));
  }
  const apex=P(0,h/2,0),origin=P(0,-h/2,0);
  if(state.formAngle>1){
    face(ctx,[apex,...rim,apex],'rgba(49,94,189,.32)','transparent');
    line(ctx,rim,'rgba(255,255,255,.9)',1.4);
    face(ctx,[origin,...rim,origin],'rgba(131,164,244,.18)','transparent');
    for(let i=0;i<=steps;i+=Math.max(1,Math.floor(steps/8))){
      line(ctx,[apex,rim[i]],'rgba(255,255,255,.26)',.8);
    }
  }
  const edgeP=P(r*Math.cos(sweep),-h/2,r*Math.sin(sweep));
  line(ctx,[origin,apex],'rgba(255,255,255,.98)',2.3);
  face(ctx,[origin,edgeP,apex],'rgba(131,164,244,.74)','rgba(255,255,255,.95)');
  line(ctx,[origin,edgeP],'#fff',1.5);
  line(ctx,[apex,edgeP],'#fbbf24',2.2);
  ctx.save();
  ctx.fillStyle='#fff';
  ctx.font='700 15px Inter,system-ui,sans-serif';
  ctx.fillText('h',apex[0]-22,(apex[1]+origin[1])/2);
  ctx.fillText('r',(origin[0]+edgeP[0])/2,(origin[1]+edgeP[1])/2+18);
  ctx.fillStyle='#fbbf24';
  ctx.fillText('l',(apex[0]+edgeP[0])/2+14,(apex[1]+edgeP[1])/2);
  ctx.restore();
}

function drawLeafHat(ctx,P,r,h,a,t,s,cx,cy,bot,N){
  let apex=P(0,h/2,0);
  let bGrad=ctx.createLinearGradient(cx-r*s,cy,cx+r*s,cy);
  bGrad.addColorStop(0,'#b45309');bGrad.addColorStop(0.2,'#d97706');bGrad.addColorStop(0.45,'#fef9c3');bGrad.addColorStop(0.7,'#fde68a');bGrad.addColorStop(1,'#78350f');
  
  for(let i=0;i<N;i++){
    let p1=bot[i],p2=bot[(i+1)%N];
    face(ctx,[apex,p1,p2],i%2===0?'#fef3c7':'#fde68a','transparent');
  }
  ctx.save();
  ctx.globalAlpha=0.45;
  face(ctx,[apex,bot[0],bot[Math.floor(N/2)]],bGrad,'transparent');
  ctx.restore();

  for(let i=0;i<N;i+=4){
    line(ctx,[apex,bot[i]],'rgba(180,83,9,0.38)',0.8);
  }

  for(let v=1;v<=16;v++){
    let ratio=v/17,ringH=h/2-h*ratio,ringR=r*ratio,ringPts=[];
    for(let i=0;i<=N;i++){
      let u=i/N*TAU;
      ringPts.push(P(ringR*Math.cos(u),ringH,ringR*Math.sin(u)));
    }
    let isMain=(v===16||v===8||v===1);
    line(ctx,ringPts,isMain?'#b45309':'rgba(217,119,6,0.5)',isMain?1.6:0.75);
  }

  line(ctx,bot,'#78350f',2.2);
  line(ctx,[apex,bot[0]],'#92400e',1.6);
  line(ctx,[apex,bot[Math.floor(N/2)]],'#92400e',1.6);

  let capPts=[apex,P(-r*0.1,h/2-h*0.07,0),P(r*0.1,h/2-h*0.07,0)];
  face(ctx,capPts,'#dc2626','#b91c1c');

  let attachLeft=P(-r*0.85,-h/2+0.15,0),attachRight=P(r*0.85,-h/2+0.15,0),ribbonLoop=P(0,-h/2-h*0.42,r*0.28);
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(attachLeft[0],attachLeft[1]);
  ctx.quadraticCurveTo(attachLeft[0]-10,ribbonLoop[1],ribbonLoop[0],ribbonLoop[1]);
  ctx.quadraticCurveTo(attachRight[0]+10,ribbonLoop[1],attachRight[0],attachRight[1]);
  ctx.strokeStyle='rgba(236,72,153,0.85)';
  ctx.lineWidth=3.2;
  ctx.lineCap='round';
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(ribbonLoop[0],ribbonLoop[1]);
  ctx.lineTo(ribbonLoop[0]-8,ribbonLoop[1]+22);
  ctx.moveTo(ribbonLoop[0],ribbonLoop[1]);
  ctx.lineTo(ribbonLoop[0]+10,ribbonLoop[1]+26);
  ctx.strokeStyle='rgba(219,39,119,0.85)';
  ctx.lineWidth=2.2;
  ctx.stroke();
  ctx.restore();
}


function drawSphereFormation(ctx,canvas,v,a,t,z){
  const W=canvas.clientWidth,H=canvas.clientHeight,cx=W/2,cy=H/2+8,s=Math.min(W,H)/14*z,P=(x,y,q)=>project(x,y,q,a,t,s,cx,cy),r=v.r,sweep=Math.max(.001,state.formAngle/360*TAU),steps=Math.max(2,Math.ceil(state.formAngle/6));
  ctx.clearRect(0,0,W,H);
  const north=P(0,r,0),south=P(0,-r,0),center=P(0,0,0);
  
  // Vẽ các múi nửa mặt cầu đã quét được
  if(state.formAngle>1){
    const N_lat = 24;
    for(let i=0;i<steps;i++){
      const u1 = sweep * i / steps, u2 = sweep * (i+1) / steps;
      let strip = [];
      for(let j=0;j<=N_lat;j++){
        const q = -Math.PI/2 + Math.PI * j / N_lat;
        strip.push(P(r*Math.cos(q)*Math.cos(u1), r*Math.sin(q), r*Math.cos(q)*Math.sin(u1)));
      }
      for(let j=N_lat;j>=0;j--){
        const q = -Math.PI/2 + Math.PI * j / N_lat;
        strip.push(P(r*Math.cos(q)*Math.cos(u2), r*Math.sin(q), r*Math.cos(q)*Math.sin(u2)));
      }
      face(ctx, strip, 'rgba(113,80,200,.25)', 'transparent');
    }
    // Vẽ các đường kinh tuyến viền quét
    for(let i=0;i<=steps;i+=Math.max(1,Math.floor(steps/6))){
      const u = sweep * i / steps;
      let arc = [];
      for(let j=0;j<=24;j++){
        const q = -Math.PI/2 + Math.PI * j / 24;
        arc.push(P(r*Math.cos(q)*Math.cos(u), r*Math.sin(q), r*Math.cos(q)*Math.sin(u)));
      }
      line(ctx, arc, 'rgba(255,255,255,.3)', .9);
    }
  }

  // Trục quay cố định (đường kính nối 2 cực Bắc - Nam)
  line(ctx, [south, north], 'rgba(255,255,255,.98)', 2.4);

  // Nửa hình tròn đang quay tại vị trí góc sweep
  let currentArc = [], currentHalfDisk = [south];
  for(let j=0;j<=32;j++){
    const q = -Math.PI/2 + Math.PI * j / 32;
    const pt = P(r*Math.cos(q)*Math.cos(sweep), r*Math.sin(q), r*Math.cos(q)*Math.sin(sweep));
    currentArc.push(pt);
    currentHalfDisk.push(pt);
  }
  currentHalfDisk.push(north);
  currentHalfDisk.push(center);

  face(ctx, currentHalfDisk, 'rgba(185,155,239,.72)', 'rgba(255,255,255,.95)');
  line(ctx, currentArc, '#fbbf24', 2.3);

  // Chấm tâm O và các cực
  [center, north, south].forEach((p, idx)=>{
    ctx.beginPath();
    ctx.arc(p[0], p[1], 4, 0, TAU);
    ctx.fillStyle = idx===0 ? '#fff' : '#fbbf24';
    ctx.fill();
    ctx.strokeStyle = '#7150c8';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  });

  // Nhãn ký hiệu
  ctx.save();
  ctx.fillStyle='#fff';
  ctx.font='700 15px Inter,system-ui,sans-serif';
  ctx.fillText('O', center[0]-18, center[1]+6);
  ctx.fillText('r', (center[0]+currentArc[16][0])/2, (center[1]+currentArc[16][1])/2-12);
  ctx.fillStyle='#fbbf24';
  ctx.fillText('2r', north[0]+12, (north[1]+south[1])/2);
  ctx.restore();
}

function drawBasketball(ctx, P, r, a, t, s, cx, cy){
  const R_px = r * s;
  
  // 1. Bóng đổ dưới đáy sàn
  ctx.save();
  ctx.fillStyle = 'rgba(18, 76, 65, 0.2)';
  ctx.filter = 'blur(10px)';
  ctx.beginPath();
  ctx.ellipse(cx, cy + R_px + 12, R_px * 0.75, R_px * 0.18, 0, 0, TAU);
  ctx.fill();
  ctx.restore();

  // 2. Thân quả bóng rổ với gradient đa sắc cam - đổ bóng 3D
  ctx.save();
  let g = ctx.createRadialGradient(cx - R_px*0.35, cy - R_px*0.35, R_px*0.08, cx, cy, R_px);
  g.addColorStop(0, '#fed7aa');
  g.addColorStop(0.2, '#fb923c');
  g.addColorStop(0.55, '#ea580c');
  g.addColorStop(0.85, '#c2410c');
  g.addColorStop(1, '#7c2d12');
  
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(cx, cy, R_px, 0, TAU);
  ctx.fill();
  ctx.strokeStyle = '#431407';
  ctx.lineWidth = 2.2;
  ctx.stroke();
  
  ctx.clip(); // Giữ các rãnh trong khuôn mặt cầu

  // Hàm vẽ đường rãnh 3D ở nửa mặt cầu hướng về phía người nhìn
  function drawSphereCurve(pointFn, w = 3.2, color = '#1c1917'){
    const N_pts = 72;
    let segs = [];
    let currentSeg = [];
    for(let i=0; i<=N_pts; i++){
      let u = i / N_pts * TAU;
      let [x, y, z] = pointFn(u);
      let pt = P(x, y, z);
      if(pt[2] >= -r * 0.15){
        currentSeg.push([pt[0], pt[1]]);
      } else {
        if(currentSeg.length > 1) segs.push(currentSeg);
        currentSeg = [];
      }
    }
    if(currentSeg.length > 1) segs.push(currentSeg);
    
    segs.forEach(seg => {
      ctx.beginPath();
      seg.forEach((p, idx) => idx ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]));
      ctx.strokeStyle = color;
      ctx.lineWidth = w;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
    });
  }

  // Rãnh 1: Đường xích đạo tròn ngang (y = 0)
  drawSphereCurve(u => [r * Math.cos(u), 0, r * Math.sin(u)], 3.5);

  // Rãnh 2: Đường kinh tuyến dọc (x = 0)
  drawSphereCurve(u => [0, r * Math.sin(u), r * Math.cos(u)], 3.5);

  // Rãnh 3 & 4: Hai đường cong uốn lượn đặc trưng đối xứng
  const angleTilt = 0.65;
  drawSphereCurve(u => {
    let x0 = r * 0.55 * Math.sin(u);
    let y0 = r * Math.cos(u);
    let z0 = Math.sqrt(Math.max(0, r*r - x0*x0 - y0*y0)) * (u > Math.PI ? -1 : 1);
    let x = x0 * Math.cos(angleTilt) - y0 * Math.sin(angleTilt);
    let y = x0 * Math.sin(angleTilt) + y0 * Math.cos(angleTilt);
    return [x, y, z0];
  }, 2.8);

  drawSphereCurve(u => {
    let x0 = r * 0.55 * Math.sin(u);
    let y0 = r * Math.cos(u);
    let z0 = Math.sqrt(Math.max(0, r*r - x0*x0 - y0*y0)) * (u > Math.PI ? -1 : 1);
    let x = x0 * Math.cos(-angleTilt) - y0 * Math.sin(-angleTilt);
    let y = x0 * Math.sin(-angleTilt) + y0 * Math.cos(-angleTilt);
    return [x, y, z0];
  }, 2.8);

  // Logo in nổi
  let centerFront = P(0, 0, r);
  if(centerFront[2] > -r * 0.2){
    ctx.save();
    ctx.fillStyle = '#1c1917';
    ctx.font = `800 ${Math.max(12, Math.round(R_px * 0.16))}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(254, 215, 170, 0.4)';
    ctx.shadowBlur = 3;
    ctx.fillText('BASKETBALL', centerFront[0], centerFront[1] - R_px * 0.2);
    ctx.font = `700 ${Math.max(9, Math.round(R_px * 0.105))}px sans-serif`;
    ctx.fillStyle = '#292524';
    ctx.fillText('OFFICIAL SIZE 7', centerFront[0], centerFront[1] + R_px * 0.24);
    ctx.restore();
  }

  ctx.restore();

  // 3. Hien thi tam O va ban kinh r cho hoc sinh de quan sat
  const radAngle = -0.42;
  const radEndX = cx + R_px * Math.cos(radAngle);
  const radEndY = cy + R_px * Math.sin(radAngle);
  const midX = (cx + radEndX) / 2;
  const midY = (cy + radEndY) / 2;

  // Duong xich dao mo xuyen thau (mat cat qua tam qua bong)
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(cx, cy, R_px, R_px * 0.28, 0, 0, TAU);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
  ctx.lineWidth = 1.2;
  ctx.setLineDash([4, 4]);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();

  // Do bong dam cho duong ban kinh de tach biet ro tren nen cam
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(radEndX, radEndY);
  ctx.strokeStyle = 'rgba(15, 23, 42, 0.75)';
  ctx.lineWidth = 4.5;
  ctx.stroke();

  // Doan thang ban kinh r net dut vang sang ruc ro
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(radEndX, radEndY);
  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 2.6;
  ctx.setLineDash([6, 3]);
  ctx.stroke();
  ctx.setLineDash([]);

  // Diem moc tren mat cau (M)
  ctx.beginPath();
  ctx.arc(radEndX, radEndY, 4.5, 0, TAU);
  ctx.fillStyle = '#fde047';
  ctx.fill();
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Diem tam O
  ctx.beginPath();
  ctx.arc(cx, cy, 5.5, 0, TAU);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 2.2;
  ctx.stroke();

  // Chu nhan tam O
  ctx.font = '800 16px Inter, system-ui, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
  ctx.shadowBlur = 4;
  ctx.fillText('O', cx - 20, cy + 20);

  // Badge hien thi ban kinh r = ... cm
  const labelText = 'r = ' + r.toFixed(1) + ' ' + (state.unit || 'cm');
  ctx.font = '700 13px Inter, system-ui, sans-serif';
  const textW = ctx.measureText(labelText).width;
  const padX = 10, boxW = textW + padX * 2, boxH = 24;
  const badgeX = midX - boxW / 2;
  const badgeY = midY - boxH - 6;

  // Nen badge bo tron
  ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
  ctx.shadowBlur = 6;
  ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
  ctx.strokeStyle = '#fde047';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  if(ctx.roundRect){
    ctx.roundRect(badgeX, badgeY, boxW, boxH, 12);
  } else {
    let bx = badgeX, by = badgeY, bw = boxW, bh = boxH, br = 6;
    ctx.moveTo(bx + br, by);
    ctx.lineTo(bx + bw - br, by);
    ctx.quadraticCurveTo(bx + bw, by, bx + bw, by + br);
    ctx.lineTo(bx + bw, by + bh - br);
    ctx.quadraticCurveTo(bx + bw, by + bh, bx + bw - br, by + bh);
    ctx.lineTo(bx + br, by + bh);
    ctx.quadraticCurveTo(bx, by + bh, bx, by + bh - br);
    ctx.lineTo(bx, by + br);
    ctx.quadraticCurveTo(bx, by, bx + br, by);
  }
  ctx.fill();
  ctx.stroke();

  // Chu badge
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#fef08a';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(labelText, midX, badgeY + boxH / 2);
  ctx.restore();
}


// ==========================================================================
// 1. BƯỚC 1: THUẬT TOÁN MÔ PHỎNG MẶT CẮT HÌNH CẦU BỞI MẶT PHẲNG (BÀI 32)
// ==========================================================================
// THUẬT TOÁN MÔ PHỎNG CẮT ĐÔI HÌNH CẦU THÀNH 2 BÁN CẦU (BÀI 32 - TOÁN 9)
// ==========================================================================
function drawSphereSlice(ctx, canvas, v, a, t, z, progress){
  const W = canvas.clientWidth, H = canvas.clientHeight;
  ctx.clearRect(0, 0, W, H);
  const cx = W / 2, cy = H / 2 + 10, s = Math.min(W, H) / 14 * z;
  const P = (x, y, z) => project(x, y, z, a, t, s, cx, cy);
  const R = v.r;
  const prog = (typeof progress === 'number') ? Math.max(0, Math.min(100, progress)) : 40;
  const f = prog / 100;
  // Khoảng cách nhấc rời 2 nửa bán cầu
  const dy = f * R * 0.55; 
  const u = state.unit || 'cm';
  const N = 48;

  // 1. Bóng đổ dưới đáy
  ctx.save();
  ctx.fillStyle = 'rgba(18, 76, 65, 0.16)';
  ctx.filter = 'blur(10px)';
  ctx.beginPath();
  ctx.ellipse(cx, cy + (R + dy) * s + 14, R * s * 0.75, 18, 0, 0, TAU);
  ctx.fill();
  ctx.restore();

  // 2. Trục thẳng đứng nối tâm 2 bán cầu khi tách
  const centerBottom = P(0, -dy, 0);
  const centerTop = P(0, dy, 0);
  if(dy > 0.05){
    line(ctx, [centerBottom, centerTop], 'rgba(255, 255, 255, 0.45)', 1.5, [4, 4]);
  }

  // 3. VẼ BÁN CẦU DƯỚI (y <= 0, dịch tâm xuống -dy)
  // Các đường vĩ tuyến của bán cầu dưới (lat từ -6 đến 0)
  for(let lat = -6; lat <= 0; lat++){
    const q = lat * Math.PI / 12;
    const pts = [];
    const rad = R * Math.cos(q);
    const yVal = R * Math.sin(q) - dy;
    for(let i = 0; i <= N; i++){
      const ang = i / N * TAU;
      pts.push(P(rad * Math.cos(ang), yVal, rad * Math.sin(ang)));
    }
    line(ctx, pts, lat === 0 ? 'rgba(249, 115, 22, 0.9)' : 'rgba(167, 139, 250, 0.22)', lat === 0 ? 2.0 : 0.9);
  }

  // Các đường kinh tuyến của bán cầu dưới
  for(let lon = 0; lon < 10; lon++){
    const ang = lon / 10 * TAU;
    const pts = [];
    for(let i = 0; i <= N/2; i++){
      const q = -Math.PI / 2 + (i / (N/2)) * (Math.PI / 2); // từ -pi/2 đến 0
      pts.push(P(R * Math.cos(q) * Math.cos(ang), R * Math.sin(q) - dy, R * Math.cos(q) * Math.sin(ang)));
    }
    line(ctx, pts, 'rgba(167, 139, 250, 0.2)');
  }

  // Nền gradient bán cầu dưới
  ctx.save();
  ctx.globalCompositeOperation = 'destination-over';
  let gBot = ctx.createRadialGradient(cx, cy + dy * s * 0.5, 4, cx, cy + dy * s * 0.5, R * s);
  gBot.addColorStop(0, 'rgba(196, 181, 253, 0.45)');
  gBot.addColorStop(0.8, 'rgba(124, 58, 237, 0.3)');
  gBot.addColorStop(1, 'rgba(91, 33, 182, 0.18)');
  ctx.fillStyle = gBot;
  ctx.beginPath();
  ctx.arc(cx, cy + dy * s, R * s, 0, TAU);
  ctx.fill();
  ctx.restore();

  // 4. MẶT PHẲNG CẮT HÌNH TRÒN LỚN (Great Circle Cut Surface) ở mặt trên của Bán cầu dưới
  const cutCircle = [];
  for(let i = 0; i <= N; i++){
    const ang = i / N * TAU;
    cutCircle.push(P(R * Math.cos(ang), -dy, R * Math.sin(ang)));
  }
  // Đổ màu mặt cắt hình tròn lớn (Màu cam sáng rực rỡ, bề mặt phẳng)
  face(ctx, cutCircle, 'rgba(249, 115, 22, 0.42)', '#f97316');
  line(ctx, cutCircle, '#f97316', 2.8);

  // Vạch nan quạt / đường kính trên mặt cắt tròn lớn
  for(let spoke = 0; spoke < 4; spoke++){
    const sAng = spoke * Math.PI / 4 + a;
    const pA = P(R * Math.cos(sAng), -dy, R * Math.sin(sAng));
    const pB = P(-R * Math.cos(sAng), -dy, -R * Math.sin(sAng));
    line(ctx, [pA, pB], 'rgba(254, 215, 170, 0.45)', 1.0, [3, 3]);
  }

  // Bán kính mặt cắt r = R trên mặt cắt
  const rAng = a + 0.65;
  const rimPt = P(R * Math.cos(rAng), -dy, R * Math.sin(rAng));
  line(ctx, [centerBottom, rimPt], '#ffffff', 2.4);

  // Điểm tâm O trên mặt cắt
  ctx.beginPath();
  ctx.arc(centerBottom[0], centerBottom[1], 5, 0, TAU);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.strokeStyle = '#f97316';
  ctx.lineWidth = 2.2;
  ctx.stroke();

  // Điểm M trên mép đường tròn lớn
  ctx.beginPath();
  ctx.arc(rimPt[0], rimPt[1], 4.5, 0, TAU);
  ctx.fillStyle = '#f97316';
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Nhãn O và M
  ctx.save();
  ctx.font = '800 14px Inter, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(0,0,0,0.85)';
  ctx.shadowBlur = 4;
  ctx.fillText('O', centerBottom[0] - 18, centerBottom[1] + 16);
  ctx.fillStyle = '#fed7aa';
  ctx.fillText('M', rimPt[0] + 12, rimPt[1] + 6);

  // Nhãn bán kính r = R trên mặt cắt
  ctx.font = '700 12.5px Inter, sans-serif';
  ctx.fillStyle = '#fef08a';
  const midR_x = (centerBottom[0] + rimPt[0]) / 2;
  const midR_y = (centerBottom[1] + rimPt[1]) / 2 - 12;
  ctx.fillText(`r = R = ${R.toFixed(1)} ${u}`, midR_x, midR_y);
  ctx.restore();

  // 5. VẼ BÁN CẦU TRÊN (y >= 0, dịch tâm lên +dy)
  // Mặt đáy của bán cầu trên
  const topCutCircle = [];
  for(let i = 0; i <= N; i++){
    const ang = i / N * TAU;
    topCutCircle.push(P(R * Math.cos(ang), dy, R * Math.sin(ang)));
  }
  face(ctx, topCutCircle, 'rgba(168, 85, 247, 0.28)', 'rgba(196, 181, 253, 0.85)');
  line(ctx, topCutCircle, 'rgba(196, 181, 253, 0.85)', 1.8);

  // Các đường vĩ tuyến của bán cầu trên (lat từ 0 đến 6)
  for(let lat = 0; lat <= 6; lat++){
    const q = lat * Math.PI / 12;
    const pts = [];
    const rad = R * Math.cos(q);
    const yVal = R * Math.sin(q) + dy;
    for(let i = 0; i <= N; i++){
      const ang = i / N * TAU;
      pts.push(P(rad * Math.cos(ang), yVal, rad * Math.sin(ang)));
    }
    line(ctx, pts, lat === 0 ? 'rgba(196, 181, 253, 0.9)' : 'rgba(167, 139, 250, 0.22)', lat === 0 ? 1.6 : 0.9);
  }

  // Các đường kinh tuyến của bán cầu trên
  for(let lon = 0; lon < 10; lon++){
    const ang = lon / 10 * TAU;
    const pts = [];
    for(let i = 0; i <= N/2; i++){
      const q = (i / (N/2)) * (Math.PI / 2); // từ 0 đến pi/2
      pts.push(P(R * Math.cos(q) * Math.cos(ang), R * Math.sin(q) + dy, R * Math.cos(q) * Math.sin(ang)));
    }
    line(ctx, pts, 'rgba(167, 139, 250, 0.2)');
  }

  // Nhãn chỉ định bán cầu trên & dưới
  if(dy > R * 0.15){
    const northPt = P(0, R + dy, 0);
    const southPt = P(0, -R - dy, 0);
    ctx.save();
    ctx.font = '700 12px Inter, sans-serif';
    ctx.shadowColor = 'rgba(0,0,0,0.85)';
    ctx.shadowBlur = 4;
    ctx.fillStyle = '#c4b5fd';
    ctx.fillText('Bán cầu trên', northPt[0] + 16, northPt[1] + 10);
    ctx.fillStyle = '#fdba74';
    ctx.fillText('Bán cầu dưới', southPt[0] + 16, southPt[1] - 8);
    ctx.restore();
  }

  // 6. HUD Box thông số cắt đôi (hình tròn lớn)
  ctx.save();
  let tabBottom = 72;
  const tabsElem = document.querySelector('#sphereModeTabs');
  if(tabsElem && !tabsElem.hidden){
    const r = tabsElem.getBoundingClientRect();
    const cRect = canvas.getBoundingClientRect();
    if(cRect.height > 0) tabBottom = Math.max(70, Math.round(r.bottom - cRect.top + 10));
  }
  const hudX = 16, hudY = tabBottom, hudW = Math.min(270, W - 32), hudH = 92;
  ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
  ctx.strokeStyle = '#f97316';
  ctx.lineWidth = 1.2;
  if(ctx.roundRect){
    ctx.beginPath();
    ctx.roundRect(hudX, hudY, hudW, hudH, 10);
    ctx.fill();
    ctx.stroke();
  } else {
    ctx.fillRect(hudX, hudY, hudW, hudH);
    ctx.strokeRect(hudX, hudY, hudW, hudH);
  }

  ctx.fillStyle = '#f97316';
  ctx.font = '800 11px Inter, sans-serif';
  ctx.fillText('MẶT CẮT QUA TÂM O (CẮT ĐÔI HÌNH CẦU)', hudX + 12, hudY + 20);

  ctx.font = '600 12px Inter, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(`Mặt cắt là hình tròn lớn: r = R = ${R.toFixed(1)} ${u}`, hudX + 12, hudY + 40);

  ctx.fillStyle = '#fef08a';
  ctx.font = '700 12.5px Inter, sans-serif';
  const areaCircle = Math.PI * R * R;
  ctx.fillText(`Diện tích mặt cắt: S = πR² = ${areaCircle.toFixed(2)} ${u}²`, hudX + 12, hudY + 60);

  ctx.fillStyle = '#c4b5fd';
  ctx.font = '600 11.5px Inter, sans-serif';
  const vHemi = (2/3) * Math.PI * (R**3);
  ctx.fillText(`Thể tích mỗi bán cầu: V = ⅔πR³ = ${vHemi.toFixed(2)} ${u}³`, hudX + 12, hudY + 79);
  ctx.restore();
}

function drawCylinderUnfold(ctx, canvas, v, a, t, z, progress){
  const W = canvas.clientWidth, H = canvas.clientHeight;
  ctx.clearRect(0, 0, W, H);
  const cx = W / 2, cy = H / 2, s = Math.min(W, H) / 16 * z;
  const P = (x, y, z) => project(x, y, z, a, t, s, cx, cy);
  const r = v.r, h = v.h;
  const u = state.unit || 'cm';
  const C = 2 * Math.PI * r;
  const prog = Math.max(0, Math.min(100, progress || 0));
  const f = prog / 100;

  if(f < 0.05){
    drawScene(ctx, canvas, state.model, v, a, t, z);
    ctx.save();
    ctx.fillStyle = '#fde047';
    ctx.font = '700 13px Inter, sans-serif';
    ctx.shadowColor = 'rgba(0,0,0,0.8)';
    ctx.shadowBlur = 4;
    ctx.fillText('Nhấn "▶ Mở bung ra" để xem mặt xung quanh trải thành hình chữ nhật!', 20, 30);
    ctx.restore();
    return;
  }

  const scaleNet = Math.min(W / (C * 1.35), H / (h + 4 * r + 2)) * z * 0.88;
  const rectW = C * scaleNet;
  const rectH = h * scaleNet;
  const rNet = r * scaleNet;

  const rx = cx - rectW / 2;
  const ry = cy - rectH / 2;

  let rectGrad = ctx.createLinearGradient(rx, ry, rx + rectW, ry + rectH);
  rectGrad.addColorStop(0, '#0c6f61');
  rectGrad.addColorStop(0.5, '#14b8a6');
  rectGrad.addColorStop(1, '#084c42');

  ctx.save();
  ctx.globalAlpha = Math.min(1, f * 1.2);
  ctx.fillStyle = rectGrad;
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2.2;
  ctx.fillRect(rx, ry, rectW, rectH);
  ctx.strokeRect(rx, ry, rectW, rectH);

  const segs = 12;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);
  for(let i = 1; i < segs; i++){
    const sx = rx + rectW * (i / segs);
    ctx.beginPath();
    ctx.moveTo(sx, ry);
    ctx.lineTo(sx, ry + rectH);
    ctx.stroke();
  }
  ctx.setLineDash([]);
  ctx.restore();

  const baseOffset = rNet * f;
  const topCenterY = ry - baseOffset;
  const botCenterY = ry + rectH + baseOffset;
  const centerX = cx;

  // Đáy trên
  ctx.save();
  ctx.globalAlpha = Math.min(1, f * 1.2);
  ctx.beginPath();
  ctx.arc(centerX, topCenterY, rNet, 0, TAU);
  ctx.fillStyle = 'rgba(83, 194, 170, 0.85)';
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2.2;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(centerX, topCenterY, 3.5, 0, TAU);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  line(ctx, [[centerX, topCenterY], [centerX + rNet, topCenterY]], '#fef08a', 2, [3, 3]);
  ctx.font = '700 11.5px Inter, sans-serif';
  ctx.fillStyle = '#fef08a';
  ctx.fillText(`r = ${r.toFixed(1)} ${u}`, centerX + rNet * 0.25, topCenterY - 6);

  // Đáy dưới
  ctx.beginPath();
  ctx.arc(centerX, botCenterY, rNet, 0, TAU);
  ctx.fillStyle = 'rgba(12, 111, 97, 0.85)';
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2.2;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(centerX, botCenterY, 3.5, 0, TAU);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  line(ctx, [[centerX, botCenterY], [centerX + rNet, botCenterY]], '#fef08a', 2, [3, 3]);
  ctx.fillText(`r = ${r.toFixed(1)} ${u}`, centerX + rNet * 0.25, botCenterY - 6);
  ctx.restore();

  if(f > 0.4){
    ctx.save();
    ctx.globalAlpha = (f - 0.4) / 0.6;

    const dimY = ry + rectH + 20;
    line(ctx, [[rx, dimY], [rx + rectW, dimY]], '#fde047', 2);
    line(ctx, [[rx, dimY - 6], [rx, dimY + 6]], '#fde047', 2);
    line(ctx, [[rx + rectW, dimY - 6], [rx + rectW, dimY + 6]], '#fde047', 2);
    ctx.font = '700 12.5px Inter, sans-serif';
    ctx.fillStyle = '#fde047';
    ctx.textAlign = 'center';
    ctx.fillText(`Chiều dài = Chu vi đáy C = 2πr = ${(C).toFixed(2)} ${u}`, cx, dimY + 18);

    const dimX = rx + rectW + 18;
    line(ctx, [[dimX, ry], [dimX, ry + rectH]], '#38bdf8', 2);
    line(ctx, [[dimX - 6, ry], [dimX + 6, ry]], '#38bdf8', 2);
    line(ctx, [[dimX - 6, ry + rectH], [dimX + 6, ry + rectH]], '#38bdf8', 2);
    ctx.save();
    ctx.translate(dimX + 16, cy);
    ctx.rotate(Math.PI / 2);
    ctx.fillStyle = '#38bdf8';
    ctx.textAlign = 'center';
    ctx.fillText(`Chiều cao h = ${h.toFixed(1)} ${u}`, 0, 0);
    ctx.restore();

    ctx.fillStyle = '#ffffff';
    ctx.font = '800 13px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('DIỆN TÍCH XUNG QUANH (MẶT THÂN TRỤ)', cx, cy - 8);
    ctx.fillStyle = '#fef08a';
    ctx.font = '700 14px Inter, sans-serif';
    ctx.fillText(`Sxq = 2πrh = ${(2 * Math.PI * r * h).toFixed(2)} ${u}²`, cx, cy + 14);

    ctx.fillStyle = '#ffffff';
    ctx.font = '700 11px Inter, sans-serif';
    ctx.fillText(`Sđ = πr² = ${(Math.PI * r * r).toFixed(2)} ${u}²`, centerX, topCenterY + 16);
    ctx.fillText(`Sđ = πr² = ${(Math.PI * r * r).toFixed(2)} ${u}²`, centerX, botCenterY + 16);

    ctx.restore();
  }

  ctx.save();
  let tabBottom = 72;
  const tabsElem = document.querySelector('#cylinderModeTabs');
  if(tabsElem && !tabsElem.hidden){
    const r = tabsElem.getBoundingClientRect();
    const cRect = canvas.getBoundingClientRect();
    if(cRect.height > 0) tabBottom = Math.max(70, Math.round(r.bottom - cRect.top + 10));
  }
  const hudX = 16, hudY = tabBottom, hudW = Math.min(265, W - 32), hudH = 70;
  ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
  ctx.strokeStyle = '#53c2aa';
  ctx.lineWidth = 1.2;
  if(ctx.roundRect){
    ctx.beginPath();
    ctx.roundRect(hudX, hudY, hudW, hudH, 10);
    ctx.fill();
    ctx.stroke();
  } else {
    ctx.fillRect(hudX, hudY, hudW, hudH);
    ctx.strokeRect(hudX, hudY, hudW, hudH);
  }
  ctx.fillStyle = '#53c2aa';
  ctx.font = '800 11px Inter, sans-serif';
  ctx.fillText('KHAI TRIỂN TRẢI PHẲNG HÌNH TRỤ', hudX + 12, hudY + 20);
  ctx.font = '600 12px Inter, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(`Stp = Sxq + 2Sđ = 2πrh + 2πr²`, hudX + 12, hudY + 40);
  ctx.fillStyle = '#fde047';
  ctx.font = '700 13px Inter, sans-serif';
  ctx.fillText(`= ${(2 * Math.PI * r * (h + r)).toFixed(2)} ${u}²`, hudX + 12, hudY + 58);
  ctx.restore();
}

// ==========================================================================
// 2. BƯỚC 2B: THUẬT TOÁN TRẢI PHẲNG (KHAI TRIỂN) HÌNH NÓN (BÀI 31)
// ==========================================================================
function drawConeUnfold(ctx, canvas, v, a, t, z, progress){
  const W = canvas.clientWidth, H = canvas.clientHeight;
  ctx.clearRect(0, 0, W, H);
  const cx = W / 2, cy = H / 2 - 10, s = Math.min(W, H) / 16 * z;
  const r = v.r, h = v.h;
  const u = state.unit || 'cm';
  const l = Math.hypot(r, h);
  const C = 2 * Math.PI * r;
  const theta = (r / l) * TAU;
  const thetaDeg = (r / l) * 360;
  const prog = Math.max(0, Math.min(100, progress || 0));
  const f = prog / 100;

  if(f < 0.05){
    drawScene(ctx, canvas, state.model, v, a, t, z);
    ctx.save();
    ctx.fillStyle = '#fde047';
    ctx.font = '700 13px Inter, sans-serif';
    ctx.shadowColor = 'rgba(0,0,0,0.8)';
    ctx.shadowBlur = 4;
    ctx.fillText('Nhấn "▶ Mở bung ra" để xem mặt nón xẻ dọc trải thành hình quạt tròn!', 20, 30);
    ctx.restore();
    return;
  }

  const scaleNet = Math.min(W / (l * 2.2), H / (l + 2.5 * r + 2)) * z * 0.95;
  const lNet = l * scaleNet;
  const rNet = r * scaleNet;

  const apexX = cx;
  const apexY = cy - lNet * 0.42;

  const midAngle = Math.PI / 2;
  const curTheta = theta * f;
  const startAng = midAngle - curTheta / 2;
  const endAng = midAngle + curTheta / 2;

  ctx.save();
  ctx.globalAlpha = Math.min(1, f * 1.2);

  let fanGrad = ctx.createRadialGradient(apexX, apexY, 10, apexX, apexY, lNet);
  fanGrad.addColorStop(0, '#83a4f4');
  fanGrad.addColorStop(0.7, '#315ebd');
  fanGrad.addColorStop(1, '#1e40af');

  ctx.beginPath();
  ctx.moveTo(apexX, apexY);
  ctx.arc(apexX, apexY, lNet, startAng, endAng);
  ctx.closePath();
  ctx.fillStyle = fanGrad;
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2.2;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(apexX, apexY, 4, 0, TAU);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.font = '800 14px Inter, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('S (Đỉnh nón)', apexX - 35, apexY - 10);

  if(f > 0.3){
    ctx.beginPath();
    ctx.arc(apexX, apexY, 32, startAng, endAng);
    ctx.strokeStyle = '#fde047';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.font = '700 11.5px Inter, sans-serif';
    ctx.fillStyle = '#fde047';
    ctx.textAlign = 'center';
    ctx.fillText(`θ = ${(thetaDeg * f).toFixed(0)}°`, apexX, apexY + 46);
  }

  const arcMidX = apexX + lNet * Math.cos(midAngle);
  const arcMidY = apexY + lNet * Math.sin(midAngle);
  const baseCenterY = arcMidY + rNet * f;

  ctx.beginPath();
  ctx.arc(apexX, baseCenterY, rNet, 0, TAU);
  ctx.fillStyle = 'rgba(49, 94, 189, 0.88)';
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2.2;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(apexX, baseCenterY, 3.5, 0, TAU);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  line(ctx, [[apexX, baseCenterY], [apexX + rNet, baseCenterY]], '#fef08a', 2, [3, 3]);
  ctx.font = '700 11.5px Inter, sans-serif';
  ctx.fillStyle = '#fef08a';
  ctx.textAlign = 'left';
  ctx.fillText(`r = ${r.toFixed(1)} ${u}`, apexX + rNet * 0.25, baseCenterY - 6);
  ctx.restore();

  if(f > 0.45){
    ctx.save();
    ctx.globalAlpha = (f - 0.45) / 0.55;

    const edgeRightX = apexX + lNet * Math.cos(endAng);
    const edgeRightY = apexY + lNet * Math.sin(endAng);
    ctx.font = '700 12px Inter, sans-serif';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText(`Đường sinh l = √(r²+h²) = ${l.toFixed(2)} ${u}`, (apexX + edgeRightX) / 2 + 10, (apexY + edgeRightY) / 2);

    ctx.font = '700 12.5px Inter, sans-serif';
    ctx.fillStyle = '#fde047';
    ctx.textAlign = 'center';
    ctx.fillText(`Độ dài cung quạt = Chu vi đáy 2πr = ${(C).toFixed(2)} ${u}`, apexX, arcMidY - 14);

    ctx.fillStyle = '#ffffff';
    ctx.font = '800 13px Inter, sans-serif';
    ctx.fillText('DIỆN TÍCH XUNG QUANH (MẶT NÓN)', apexX, apexY + lNet * 0.55 - 10);
    ctx.fillStyle = '#fef08a';
    ctx.font = '700 14px Inter, sans-serif';
    ctx.fillText(`Sxq = πrl = ${(Math.PI * r * l).toFixed(2)} ${u}²`, apexX, apexY + lNet * 0.55 + 12);

    ctx.fillStyle = '#ffffff';
    ctx.font = '700 11px Inter, sans-serif';
    ctx.fillText(`Sđ = πr² = ${(Math.PI * r * r).toFixed(2)} ${u}²`, apexX, baseCenterY + 16);
    ctx.restore();
  }

  ctx.save();
  let tabBottom = 72;
  const tabsElem = document.querySelector('#coneModeTabs');
  if(tabsElem && !tabsElem.hidden){
    const r = tabsElem.getBoundingClientRect();
    const cRect = canvas.getBoundingClientRect();
    if(cRect.height > 0) tabBottom = Math.max(70, Math.round(r.bottom - cRect.top + 10));
  }
  const hudX = 16, hudY = tabBottom, hudW = Math.min(265, W - 32), hudH = 76;
  ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
  ctx.strokeStyle = '#83a4f4';
  ctx.lineWidth = 1.2;
  if(ctx.roundRect){
    ctx.beginPath();
    ctx.roundRect(hudX, hudY, hudW, hudH, 10);
    ctx.fill();
    ctx.stroke();
  } else {
    ctx.fillRect(hudX, hudY, hudW, hudH);
    ctx.strokeRect(hudX, hudY, hudW, hudH);
  }
  ctx.fillStyle = '#83a4f4';
  ctx.font = '800 11px Inter, sans-serif';
  ctx.fillText('KHAI TRIỂN TRẢI PHẲNG HÌNH NÓN', hudX + 12, hudY + 18);
  ctx.font = '600 11.5px Inter, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(`Góc quạt: θ = (r / l) · 360° = ${thetaDeg.toFixed(1)}°`, hudX + 12, hudY + 36);
  ctx.fillText(`Stp = Sxq + Sđ = πrl + πr²`, hudX + 12, hudY + 52);
  ctx.fillStyle = '#fde047';
  ctx.font = '700 12.5px Inter, sans-serif';
  ctx.fillText(`= ${(Math.PI * r * (l + r)).toFixed(2)} ${u}²`, hudX + 12, hudY + 68);
  ctx.restore();
}

function drawScene(ctx,canvas,m,v,a,t,z,formation=false){const W=canvas.clientWidth,H=canvas.clientHeight;ctx.clearRect(0,0,W,H);const cx=W/2,cy=H/2+(m.id==='cone'?22:8),s=Math.min(W,H)/(m.id==='box'?15:14)*z;const P=(x,y,z)=>project(x,y,z,a,t,s,cx,cy);let grad=ctx.createLinearGradient(cx-W*.2,cy-H*.3,cx+W*.25,cy+H*.3);grad.addColorStop(0,m.colors[1]+'e8');grad.addColorStop(1,m.colors[0]+'d9');const fill=grad,edge='rgba(255,255,255,.82)',dark=m.colors[0]+'bb';
 if(m.id==='sphere'&&canvas.id==='labCanvas'&&state.sphereMode==='ball'){drawBasketball(ctx,P,v.r,a,t,s,cx,cy)}else if(m.id==='sphere'){let r=v.r,N=56;for(let lat=-6;lat<=6;lat++){let q=lat*Math.PI/12,pts=[];for(let i=0;i<=N;i++){let u=i/N*TAU;pts.push(P(r*Math.cos(q)*Math.cos(u),r*Math.sin(q),r*Math.cos(q)*Math.sin(u)))}line(ctx,pts,lat===0?edge:'rgba(255,255,255,.24)',lat===0?1.5:1)}for(let lon=0;lon<10;lon++){let u=lon/10*TAU,pts=[];for(let i=0;i<=N;i++){let q=-Math.PI/2+i/N*Math.PI;pts.push(P(r*Math.cos(q)*Math.cos(u),r*Math.sin(q),r*Math.cos(q)*Math.sin(u)))}line(ctx,pts,'rgba(255,255,255,.22)')}ctx.save();ctx.globalCompositeOperation='destination-over';let g=ctx.createRadialGradient(cx-W*.08,cy-H*.1,4,cx,cy,r*s);g.addColorStop(0,m.colors[1]+'cc');g.addColorStop(1,m.colors[0]+'88');ctx.fillStyle=g;ctx.beginPath();ctx.arc(cx,cy,r*s,0,TAU);ctx.fill();ctx.restore();let center=P(0,0,0),radiusEnd=[cx+r*s*Math.cos(a),cy,r*Math.sin(a)],mx=(center[0]+radiusEnd[0])/2,my=(center[1]+radiusEnd[1])/2;line(ctx,[center,radiusEnd],radiusEnd[2]>=0?'rgba(255,255,255,.96)':'rgba(255,255,255,.58)',2.2,radiusEnd[2]>=0?[]:[5,4]);ctx.save();ctx.fillStyle='#fff';ctx.strokeStyle=m.colors[0];ctx.lineWidth=2;[center,radiusEnd].forEach(p=>{ctx.beginPath();ctx.arc(p[0],p[1],4.5,0,TAU);ctx.fill();ctx.stroke()});ctx.font='700 15px Inter,system-ui,sans-serif';ctx.fillStyle='#fff';ctx.shadowColor='rgba(35,25,80,.65)';ctx.shadowBlur=4;ctx.fillText('O',center[0]-19,center[1]+20);ctx.fillText('r',mx-3,my-10);ctx.restore()}
 else if(m.id==='cylinder'||m.id==='cone'){let r=v.r,h=v.h,N=m.id==='cone'?180:64,bot=[],top=[];for(let i=0;i<=N;i++){let u=i/N*TAU;bot.push(P(r*Math.cos(u),-h/2,r*Math.sin(u)));top.push(P(r*Math.cos(u),h/2,r*Math.sin(u)))}if(m.id==='cylinder'){if(formation){drawCylinderFormation(ctx,P,r,h,edge,m)}else if(canvas.id==='labCanvas' && state.cylinderMode==='milk'){drawMilkCan(ctx,P,r,h,a,t,s,cx,cy,bot,top,N)}else{face(ctx,[bot[0],top[0],top[N/2],bot[N/2]],fill,'transparent');face(ctx,bot,m.colors[0]+'55',edge);face(ctx,top,m.colors[1]+'99',edge);line(ctx,[P(-r,-h/2,0),P(-r,h/2,0)],edge,1.3);line(ctx,[P(r,-h/2,0),P(r,h/2,0)],edge,1.3)}}else{if(canvas.id==='labCanvas'&&state.coneMode==='hat'){drawLeafHat(ctx,P,r,h,a,t,s,cx,cy,bot,N)}else{let apex=P(0,h/2,0),left=P(-r*Math.cos(a),-h/2,r*Math.sin(a)),right=P(r*Math.cos(a),-h/2,-r*Math.sin(a)),marker=P(r,-h/2,0),frontArc=[],backArc=[];for(let i=0;i<=N/2;i++){let q=i/(N/2)*Math.PI,u=-a+q,w=Math.PI-a+q;frontArc.push(P(r*Math.cos(u),-h/2,r*Math.sin(u)));backArc.push(P(r*Math.cos(w),-h/2,r*Math.sin(w)))}ctx.save();ctx.globalAlpha=.82;face(ctx,[apex,left,right],fill,'transparent');ctx.restore();face(ctx,bot,m.colors[0]+'66','transparent');line(ctx,backArc,'rgba(255,255,255,.35)',1,[4,4]);line(ctx,frontArc,edge,1.35);line(ctx,[apex,left],edge,1.4);line(ctx,[apex,right],edge,1.4);line(ctx,[apex,P(0,-h/2,0)],'rgba(255,255,255,.62)',1,[4,4]);line(ctx,[apex,marker],marker[2]>=0?'rgba(255,255,255,.72)':'rgba(255,255,255,.34)',1.05,marker[2]>=0?[]:[4,4])}line(ctx,[P(0,-h/2,0),P(r,-h/2,0)],edge,1,[4,4])}}
 else if(m.id==='box'){let x=v.a/2,y=v.c/2,q=v.b/2,vs=[P(-x,-y,-q),P(x,-y,-q),P(x,y,-q),P(-x,y,-q),P(-x,-y,q),P(x,-y,q),P(x,y,q),P(-x,y,q)],fs=[[0,1,2,3],[4,5,6,7],[0,4,7,3],[1,5,6,2],[3,2,6,7],[0,1,5,4]];fs.sort((A,B)=>A.reduce((n,i)=>n+vs[i][2],0)-B.reduce((n,i)=>n+vs[i][2],0)).forEach((f,i)=>face(ctx,f.map(j=>vs[j]),i%2?m.colors[1]+'72':m.colors[0]+'70',edge));line(ctx,[vs[0],vs[6]],'#fff',1.4,[5,4])}
 else if(m.id==='pyramid'){let r=v.a/2,h=v.h/2,b=[P(-r,-h,-r),P(r,-h,-r),P(r,-h,r),P(-r,-h,r)],ap=P(0,h,0);[[b[0],b[1],ap],[b[1],b[2],ap],[b[2],b[3],ap],[b[3],b[0],ap]].sort((A,B)=>A.reduce((n,p)=>n+p[2],0)-B.reduce((n,p)=>n+p[2],0)).forEach((f,i)=>face(ctx,f,i%2?m.colors[1]+'82':m.colors[0]+'80',edge));face(ctx,b,m.colors[0]+'55',edge);line(ctx,[ap,P(0,-h,0)],'#fff',1.3,[4,4])}
 ctx.save();ctx.globalCompositeOperation='destination-over';ctx.filter='blur(12px)';ctx.fillStyle='rgba(18,76,65,.18)';ctx.beginPath();ctx.ellipse(cx,cy+Math.min(H*.35,170),Math.min(W*.2,120),18,0,0,TAU);ctx.fill();ctx.restore()}

MODELS.forEach((m,i)=>{const card=document.createElement('article');card.className='model-card';card.style.cssText=`--cardA:${m.colors[0]};--cardB:${m.colors[1]}`;card.innerHTML=`<div class="model-preview"><span class="card-index">0${i+1}</span><canvas></canvas></div><div class="card-body"><h3>${m.name}</h3><p>${m.desc}</p><div class="card-action"><span>VÀO PHÒNG THÍ NGHIỆM</span><i>↗</i></div></div>`;card.addEventListener('click',()=>openLab(m));grid.append(card);makeCanvas(card.querySelector('canvas'),m,true)});
makeCanvas($('#heroCanvas'),MODELS[1],true);makeCanvas($('#labCanvas'),state.model,false);

function openLab(m){
  state.model=m;
  state.values=demoValues(m);
  state.angle=.45;state.tilt=.2;state.zoom=1;state.auto=true;
  state.cylinderMode='solid';
  state.coneMode='solid';
  state.sphereMode='solid';
  state.formAngle=0;
  state.formPlaying=false;
  state.unfoldProgress=0;
  state.unfoldPlaying=false;
  state.sliceProgress=40;
  state.slicePlaying=false;
  
  $('#labTitle').textContent=m.name;
  $('#formula').innerHTML=m.formula;
  $('#labNote').textContent=m.note;
  
  const isCyl = m.id === 'cylinder';
  const isCone = m.id === 'cone';
  const isSphere = m.id === 'sphere';
  
  if($('#cylinderModeTabs')) $('#cylinderModeTabs').hidden = !isCyl;
  if($('#coneModeTabs')) $('#coneModeTabs').hidden = !isCone;
  if($('#sphereModeTabs')) $('#sphereModeTabs').hidden = !isSphere;
  $('#formationControls').hidden = true;
  if($('#unfoldControls')) $('#unfoldControls').hidden = true;
  if($('#sliceControls')) $('#sliceControls').hidden = true;
  $('#autoRotate').hidden = false;
  
  if(isCyl){
    document.querySelectorAll('#cylinderModeTabs button').forEach(b=>b.classList.toggle('active',b.dataset.mode==='solid'));
  }
  if(isCone){
    document.querySelectorAll('#coneModeTabs button').forEach(b=>b.classList.toggle('active',b.dataset.coneMode==='solid'));
  }
  if(isSphere){
    document.querySelectorAll('#sphereModeTabs button').forEach(b=>b.classList.toggle('active',b.dataset.sphereMode==='solid'));
  }
  
  renderControls();
  updateResults();
  dialog.showModal();
  document.body.style.overflow='hidden';
}
window.openLab = openLab;
window.MODELS = MODELS;

function renderControls(){
  const box=$('#controls');
  if(!box) return;
  box.innerHTML='';
  
  const header=document.createElement('div');
  header.innerHTML='<span class="eyebrow">ĐIỀU CHỈNH THÔNG SỐ</span>';
  box.append(header);

  // 1. Khung chọn & tự nhập đơn vị đo
  const unitBox=document.createElement('div');
  unitBox.className='unit-control-box';
  unitBox.innerHTML=`
    <div class="unit-title-bar">
      <span>ĐƠN VỊ ĐO:</span>
      <div class="unit-chips">
        <button type="button" class="unit-chip ${state.unit==='cm'?'active':''}" data-u="cm">cm</button>
        <button type="button" class="unit-chip ${state.unit==='m'?'active':''}" data-u="m">m</button>
        <button type="button" class="unit-chip ${state.unit==='dm'?'active':''}" data-u="dm">dm</button>
        <button type="button" class="unit-chip ${state.unit==='mm'?'active':''}" data-u="mm">mm</button>
      </div>
    </div>
    <div class="unit-input-inline">
      <label for="customUnit">Hoặc tự gõ đơn vị:</label>
      <input type="text" id="customUnit" class="custom-unit-input" value="${state.unit||'cm'}" maxlength="10" placeholder="vd: cm, m, dm, mm...">
    </div>
  `;

  const customUnitInput=unitBox.querySelector('#customUnit');
  const chipButtons=unitBox.querySelectorAll('.unit-chip');

  function setUnit(newUnit){
    state.unit=newUnit.trim()||'cm';
    if(customUnitInput.value!==state.unit){
      customUnitInput.value=state.unit;
    }
    chipButtons.forEach(btn=>{
      btn.classList.toggle('active',btn.dataset.u===state.unit);
    });
    box.querySelectorAll('.param-unit-badge').forEach(badge=>{
      badge.textContent=state.unit;
    });
    updateResults();
  }

  chipButtons.forEach(btn=>{
    btn.onclick=()=>setUnit(btn.dataset.u);
  });

  customUnitInput.oninput=e=>{
    setUnit(e.target.value);
  };

  box.append(unitBox);

  // 2. Các thông số: Ô tự nhập số + Thanh trượt đồng bộ
  state.model.controls.forEach(c=>{
    const key=c[0], label=c[1], minVal=c[2], maxVal=c[3];
    const currentVal=state.values[key];

    const wrap=document.createElement('div');
    wrap.className='slider-row';
    wrap.innerHTML=`
      <div class="slider-title">
        <label>${label}</label>
        <div class="param-input-wrap">
          <input type="number" class="param-number-input" value="${currentVal.toFixed(1)}" step="0.1" min="0.01">
          <span class="param-unit-badge">${state.unit||'cm'}</span>
        </div>
      </div>
      <input type="range" class="param-range-slider" min="${minVal}" max="${maxVal}" step="0.1" value="${currentVal}">
    `;

    const numInput=wrap.querySelector('.param-number-input');
    const rangeSlider=wrap.querySelector('.param-range-slider');

    rangeSlider.oninput=e=>{
      const val=parseFloat(e.target.value)||minVal;
      state.values[key]=val;
      numInput.value=val.toFixed(1);
      updateResults();
    };

    numInput.oninput=e=>{
      let val=parseFloat(e.target.value);
      if(isNaN(val)||val<=0) val=0.1;
      state.values[key]=val;
      if(val>+rangeSlider.max){
        rangeSlider.max=Math.ceil(val*1.2);
      }
      if(val<+rangeSlider.min){
        rangeSlider.min=Math.floor(val*0.8);
      }
      rangeSlider.value=val;
      updateResults();
    };

    box.append(wrap);
  });
}

function updateResults(){
  const m=state.model, v=state.values, pi=Math.PI;
  const u=state.unit||'cm';
  const u2=u+'²';
  const u3=u+'³';
  let rows=[];

  if(m.id==='cylinder'){
    if(state.cylinderMode==='milk'){
      let volUnit=u3;
      if(u==='cm') volUnit='ml (cm³)';
      else if(u==='dm') volUnit='lít (dm³)';
      rows=[
        ['Bán kính đáy lon r', v.r, u],
        ['Chiều cao thân lon h', v.h, u],
        ['Diện tích thân lon (Sxq)', 2*pi*v.r*v.h, u2],
        ['Diện tích 2 nắp tôn (2Sđ)', 2*pi*v.r*v.r, u2],
        ['Tổng diện tích tôn vỏ lon (Stp)', 2*pi*v.r*(v.h+v.r), u2],
        ['Dung tích sữa tối đa (V)', pi*v.r*v.r*v.h, volUnit]
      ];
    } else if(state.cylinderMode==='unfold'){
      rows=[
        ['Bán kính đáy r', v.r, u],
        ['Chiều cao h (chiều rộng tấm trải)', v.h, u],
        ['Chu vi đáy C = 2πr (chiều dài tấm trải)', 2*pi*v.r, u],
        ['Diện tích xung quanh Sxq = 2πrh', 2*pi*v.r*v.h, u2],
        ['Diện tích 2 đáy tròn 2Sđ = 2πr²', 2*pi*v.r*v.r, u2],
        ['Diện tích toàn phần tấm khai triển Stp', 2*pi*v.r*(v.h+v.r), u2]
      ];
    } else {
      rows=[
        ['Bán kính đáy r', v.r, u],
        ['Chiều cao h', v.h, u],
        ['Diện tích xung quanh (Sxq)', 2*pi*v.r*v.h, u2],
        ['Diện tích 2 đáy (2Sđ)', 2*pi*v.r*v.r, u2],
        ['Diện tích toàn phần (Stp)', 2*pi*v.r*(v.h+v.r), u2],
        ['Thể tích (V)', pi*v.r*v.r*v.h, u3]
      ];
    }
  }
  if(m.id==='cone'){
    const l = Math.hypot(v.r, v.h);
    if(state.coneMode==='hat'){
      rows=[
        ['Bán kính vành nón r', v.r, u],
        ['Chiều cao nón h', v.h, u],
        ['Độ dài đường sinh l', l, u + ' (từ chóp đến vành)'],
        ['Diện tích lá lợp nón (Sxq)', pi*v.r*l, u2 + ' (rỗng đáy)'],
        ['Dung tích không gian trong nón', pi*v.r*v.r*v.h/3, u3]
      ];
    } else if(state.coneMode==='unfold'){
      const thetaDeg = (v.r / l) * 360;
      rows=[
        ['Bán kính đáy r', v.r, u],
        ['Đường sinh l (bán kính hình quạt)', l, u],
        ['Góc ở tâm hình quạt θ = (r/l)·360°', thetaDeg, '°'],
        ['Độ dài cung quạt = Chu vi đáy 2πr', 2*pi*v.r, u],
        ['Diện tích xung quanh Sxq = πrl', pi*v.r*l, u2],
        ['Diện tích toàn phần Stp = πrl + πr²', pi*v.r*(l+v.r), u2]
      ];
    } else {
      rows=[
        ['Bán kính đáy r', v.r, u],
        ['Chiều cao h', v.h, u],
        ['Đường sinh l', l, u],
        ['Diện tích xung quanh Sxq', pi*v.r*l, u2],
        ['Diện tích toàn phần Stp', pi*v.r*(l+v.r), u2],
        ['Thể tích V', pi*v.r*v.r*v.h/3, u3]
      ];
    }
  }
  if(m.id==='sphere'){
    if(state.sphereMode==='ball'){
      rows=[
        ['Bán kính bóng r', v.r, u + ` (đường kính ${(v.r*2).toFixed(1)} ${u})`],
        ['Chu vi vòng bóng (C)', 2*pi*v.r, u + ' (chu vi đường tròn lớn)'],
        ['Diện tích da bọc bóng (S)', 4*pi*v.r*v.r, u2 + ' (mặt cầu)'],
        ['Dung tích không khí trong bóng (V)', 4*pi*v.r**3/3, u3 + ' (thể tích khối cầu)']
      ];
    } else if(state.sphereMode==='slice'){
      const curHc = (typeof state.sliceHc === 'number') ? state.sliceHc : 2.0;
      const diff = v.r * v.r - curHc * curHc;
      if(diff > 0.0001){
        const rPrime = Math.sqrt(diff);
        rows=[
          ['Bán kính khối cầu R', v.r, u],
          ['Khoảng cách tâm đến mặt cắt |hc|', Math.abs(curHc), u],
          ["Bán kính đường tròn thiết diện r'", rPrime, u],
          ["Diện tích thiết diện Scắt = π(r')²", pi*rPrime*rPrime, u2],
          ['Trạng thái thiết diện', 'Đường tròn giao tuyến (0 ≤ |hc| < R)', '']
        ];
      } else if(Math.abs(diff) <= 0.0001){
        rows=[
          ['Bán kính khối cầu R', v.r, u],
          ['Khoảng cách tâm đến mặt cắt |hc|', Math.abs(curHc), u],
          ['Trạng thái thiết diện', 'Mặt phẳng tiếp xúc mặt cầu tại 1 điểm (|hc| = R)', '']
        ];
      } else {
        rows=[
          ['Bán kính khối cầu R', v.r, u],
          ['Khoảng cách tâm đến mặt cắt |hc|', Math.abs(curHc), u],
          ['Trạng thái thiết diện', 'Mặt phẳng KHÔNG cắt mặt cầu (|hc| > R)', '']
        ];
      }
    } else {
      rows=[
        ['Bán kính hình cầu r', v.r, u],
        ['Diện tích mặt cầu S', 4*pi*v.r*v.r, u2],
        ['Thể tích khối cầu V', 4*pi*v.r**3/3, u3]
      ];
    }
  }
  if(m.id==='box') rows=[
    ['Chiều dài a', v.a, u],
    ['Chiều rộng b', v.b, u],
    ['Chiều cao c', v.c, u],
    ['Đường chéo', Math.hypot(v.a, v.b, v.c), u],
    ['Diện tích toàn phần', 2*(v.a*v.b + v.b*v.c + v.c*v.a), u2],
    ['Thể tích', v.a*v.b*v.c, u3]
  ];
  if(m.id==='pyramid') rows=[
    ['Cạnh đáy a', v.a, u],
    ['Chiều cao h', v.h, u],
    ['Diện tích đáy', v.a*v.a, u2],
    ['Thể tích', v.a*v.a*v.h/3, u3]
  ];

  $('#results').innerHTML=rows.map(r=>`<div class="result-line"><span>${r[0]}</span><b>${typeof r[1]==='number'?r[1].toFixed(2):r[1]} ${r[2]||''}</b></div>`).join('');
}

// Lab dialog actions
$('#closeLab').onclick=()=>dialog.close();
dialog.addEventListener('close',()=>document.body.style.overflow='');
dialog.addEventListener('click',e=>{if(e.target===dialog) dialog.close()});

$('#autoRotate').onclick=()=>{
  state.auto=!state.auto;
  $('#autoRotate').textContent=state.auto?'Ⅱ Tự động xoay':'▶ Tiếp tục xoay';
};

const labAiBtn=$('#labAskAiBtn');
if(labAiBtn){
  labAiBtn.onclick=()=>{
    const m=state.model, v=state.values, p=Object.entries(v).map(([k,val])=>`${k} = ${val.toFixed(1)} ${state.unit||'cm'}`).join(', ');
    const promptText=`Giải thích công thức và cách tính toán các đại lượng của ${m.name} khi ${p}.`;
    if(window.MathLabChat){
      dialog.close();
      window.MathLabChat.openWithPrompt(promptText);
    } else {
      window.location.href='ai-assistant.html?prompt='+encodeURIComponent(promptText);
    }
  };
}

const lab=$('#labCanvas');
lab.addEventListener('pointerdown',e=>{
  state.drag=true;
  state.lastX=e.clientX;
  state.lastY=e.clientY;
  lab.setPointerCapture(e.pointerId);
});
lab.addEventListener('pointermove',e=>{
  if(!state.drag) return;
  state.angle+=(e.clientX-state.lastX)*.012;
  state.tilt=Math.max(-.65, Math.min(.65, state.tilt+(e.clientY-state.lastY)*.008));
  state.lastX=e.clientX;
  state.lastY=e.clientY;
});
lab.addEventListener('pointerup',()=>state.drag=false);
lab.addEventListener('wheel',e=>{
  e.preventDefault();
  state.zoom=Math.max(.65, Math.min(1.6, state.zoom-e.deltaY*.001));
},{passive:false});

// Cylinder tabs click
document.querySelectorAll('#cylinderModeTabs button').forEach(button=>button.onclick=()=>{
  state.cylinderMode=button.dataset.mode;
  document.querySelectorAll('#cylinderModeTabs button').forEach(b=>b.classList.toggle('active',b===button));
  const isForm = state.cylinderMode === 'form';
  const isUnfold = state.cylinderMode === 'unfold';
  $('#formationControls').hidden = !isForm;
  if($('#unfoldControls')) $('#unfoldControls').hidden = !isUnfold;
  if($('#sliceControls')) $('#sliceControls').hidden = true;
  $('#autoRotate').hidden = (isForm || isUnfold);
  
  if(isForm){
    state.formAngle = 0;
    state.formPlaying = true;
    const sl = $('#formationAngle'), out = $('#formationAngleOut');
    if(sl) sl.value = 0;
    if(out) out.textContent = '0°';
    const fDesc=$('#formationDesc');
    if(fDesc) fDesc.innerHTML='Hình chữ nhật quay quanh cạnh <b>h</b>; cạnh còn lại tạo nên bán kính <b>r</b>.';
    $('.stage-hint').textContent='Hình chữ nhật quay quanh cạnh h để tạo hình trụ';
  } else if(isUnfold){
    state.unfoldProgress = 0;
    state.unfoldPlaying = true;
    const uSl = $('#unfoldProgress'), uOut = $('#unfoldProgressOut');
    if(uSl) uSl.value = 0;
    if(uOut) uOut.textContent = '0%';
    const uDesc = $('#unfoldDesc');
    if(uDesc) uDesc.innerHTML = 'Thân hình trụ mở bung ra thành hình chữ nhật kích thước <b>2πr × h</b>; hai nắp mở ra thành hai hình tròn bán kính <b>r</b>.';
    $('#formula').innerHTML='S<sub>xq</sub> = 2πrh<br>S<sub>tp</sub> = 2πrh + 2πr²';
    $('#labNote').textContent='Khi khai triển (trải phẳng) mặt xung quanh hình trụ, ta được một hình chữ nhật có một cạnh bằng chiều cao h, cạnh kia bằng chu vi đường tròn đáy 2πr. Hai đáy là 2 hình tròn bán kính r.';
    $('.stage-hint').textContent='📜 Khai triển hình trụ: Thân trụ mở phẳng thành hình chữ nhật 2πr × h';
  } else if(state.cylinderMode==='milk'){
    state.formPlaying = false;
    state.unfoldPlaying = false;
    state.values.r=3.7;
    state.values.h=8.0;
    $('#formula').innerHTML='S<sub>tp</sub> = 2πrh + 2πr²<br>V = πr²h ≈ 344 ml';
    $('#labNote').textContent='Lon sữa đặc Ông Thọ hình trụ: vỏ thép dập gờ chịu lực, hai nắp kín. Diện tích vỏ lon gồm thân (Sxq) và 2 nắp (2Sđ). Dung tích chứa tối đa V ≈ 344 ml.';
    $('.stage-hint').textContent='Mô phỏng thực tế: Vỏ lon sữa đặc hình trụ (2 đáy kín)';
  } else {
    state.formPlaying = false;
    state.unfoldPlaying = false;
    $('#formula').innerHTML=state.model.formula;
    $('#labNote').textContent=state.model.note;
    $('.stage-hint').textContent='↔ Kéo để xoay · Cuộn để phóng to';
  }
  renderControls();
  updateResults();
});
// Cone tabs click
document.querySelectorAll('#coneModeTabs button').forEach(button=>button.onclick=()=>{
  state.coneMode=button.dataset.coneMode;
  document.querySelectorAll('#coneModeTabs button').forEach(b=>b.classList.toggle('active',b===button));
  const isForm = state.coneMode === 'form';
  const isUnfold = state.coneMode === 'unfold';
  $('#formationControls').hidden = !isForm;
  if($('#unfoldControls')) $('#unfoldControls').hidden = !isUnfold;
  if($('#sliceControls')) $('#sliceControls').hidden = true;
  $('#autoRotate').hidden = (isForm || isUnfold);
  
  if(isForm){
    state.formAngle = 0;
    state.formPlaying = true;
    const sl = $('#formationAngle'), out = $('#formationAngleOut');
    if(sl) sl.value = 0;
    if(out) out.textContent = '0°';
    const fDesc=$('#formationDesc');
    if(fDesc) fDesc.innerHTML='Tam giác vuông quay quanh cạnh góc vuông <b>h</b>; cạnh góc vuông còn lại tạo nên bán kính đáy <b>r</b>, cạnh huyền quét nên đường sinh <b>l</b>.';
    $('.stage-hint').textContent='Tam giác vuông quay quanh cạnh h để tạo hình nón';
  } else if(isUnfold){
    state.unfoldProgress = 0;
    state.unfoldPlaying = true;
    const uSl = $('#unfoldProgress'), uOut = $('#unfoldProgressOut');
    if(uSl) uSl.value = 0;
    if(uOut) uOut.textContent = '0%';
    const uDesc = $('#unfoldDesc');
    if(uDesc) uDesc.innerHTML = 'Mặt xung quanh hình nón cắt dọc theo đường sinh mở ra thành <b>hình quạt tròn</b> bán kính <b>l</b>, góc ở tâm <b>θ = (r/l)·360°</b>; độ dài cung bằng chu vi đáy <b>2πr</b>.';
    $('#formula').innerHTML='l = √(r² + h²)<br>θ = (r/l) · 360°<br>S<sub>xq</sub> = πrl';
    $('#labNote').textContent='Khi cắt dọc theo đường sinh l và trải phẳng, mặt xung quanh hình nón mở thành một hình quạt tròn tâm S bán kính l. Cung tròn của hình quạt có độ dài đúng bằng chu vi đáy C = 2πr.';
    $('.stage-hint').textContent='📜 Khai triển hình nón: Mặt nón mở thành hình quạt tròn bán kính l';
  } else if(state.coneMode==='hat'){
    state.formPlaying = false;
    state.unfoldPlaying = false;
    state.values.r=3.0;
    state.values.h=4.0;
    $('#formula').innerHTML='l = √(r² + h²)<br>S<sub>xq</sub> = πrl<br>V = ⅓πr²h';
    $('#labNote').textContent='Chiếc nón lá truyền thống hình nón: rỗng đáy để đội đầu, diện tích lá cọ lợp nón chỉ bằng diện tích xung quanh Sxq. Với r=3cm, h=4cm thì đường sinh l=5cm (bộ ba Pythagore 3-4-5).';
    $('.stage-hint').textContent='Mô phỏng thực tế: Chiếc nón lá truyền thống (rỗng đáy)';
  } else {
    state.formPlaying = false;
    state.unfoldPlaying = false;
    $('#formula').innerHTML=state.model.formula;
    $('#labNote').textContent=state.model.note;
    $('.stage-hint').textContent='↔ Kéo để xoay · Cuộn để phóng to';
  }
  renderControls();
  updateResults();
});
// Sphere tabs click
document.querySelectorAll('#sphereModeTabs button').forEach(button=>button.onclick=()=>{
  state.sphereMode=button.dataset.sphereMode;
  document.querySelectorAll('#sphereModeTabs button').forEach(b=>b.classList.toggle('active',b===button));
  const isForm = state.sphereMode === 'form';
  const isSlice = state.sphereMode === 'slice';
  $('#formationControls').hidden = !isForm;
  if($('#unfoldControls')) $('#unfoldControls').hidden = true;
  if($('#sliceControls')) $('#sliceControls').hidden = !isSlice;
  $('#autoRotate').hidden = isForm;
  
  if(isForm){
    state.formAngle = 0;
    state.formPlaying = true;
    const sl = $('#formationAngle'), out = $('#formationAngleOut');
    if(sl) sl.value = 0;
    if(out) out.textContent = '0°';
    const fDesc=$('#formationDesc');
    if(fDesc) fDesc.innerHTML='Nửa hình tròn bán kính <b>r</b> quay quanh đường kính cố định; cung tròn quét nên mặt cầu, nửa hình tròn quét nên khối cầu.';
    $('.stage-hint').textContent='Nửa hình tròn quay quanh đường kính để tạo hình cầu';
  } else if(isSlice){
    state.formPlaying = false;
    state.slicePlaying = false;
    state.sliceProgress = 40;
    const slProg = $('#sliceProgress'), slOut = $('#sliceProgressOut');
    if(slProg) slProg.value = 40;
    if(slOut) slOut.textContent = '40%';
    $('#formula').innerHTML="r = R<br>S<sub>cắt</sub> = πR²<br>V<sub>bán cầu</sub> = &frac23;πR³";
    $('#labNote').textContent="Khi cắt đôi hình cầu tâm O bán kính R bởi một mặt phẳng đi qua tâm, mặt cắt thu được là hình tròn lớn có bán kính r = R và diện tích S = πR². Khối cầu được chia thành hai bán cầu bằng nhau có thể tích mỗi nửa là V = ⅔πR³.";
    $('.stage-hint').textContent='🔪 Cắt đôi hình cầu: Nhấn [▶ Bổ đôi] hoặc kéo thanh trượt để quan sát 2 nửa bán cầu tách rời';
  } else if(state.sphereMode==='ball'){
    state.formPlaying = false;
    state.values.r=3.5;
    $('#formula').innerHTML='S = 4πr²<br>V = ⁴⁄₃πr³<br>C = 2πr';
    $('#labNote').textContent='Quả bóng rổ tiêu chuẩn (Size 7): hình cầu tròn xoay hoàn hảo. Diện tích da bao bọc bóng chính là diện tích mặt cầu S = 4πr², lượng khí bơm căng trong bóng là thể tích khối cầu V = 4/3πr³.';
    $('.stage-hint').textContent='Mô phỏng thực tế: Quả bóng rổ tiêu chuẩn (Size 7)';
  } else {
    state.formPlaying = false;
    $('#formula').innerHTML=state.model.formula;
    $('#labNote').textContent=state.model.note;
    $('.stage-hint').textContent='↔ Kéo để xoay · Cuộn để phóng to';
  }
  renderControls();
  updateResults();
});
// Formation controls event listeners
const fSlider = $('#formationAngle');
if(fSlider){
  fSlider.oninput = e => {
    state.formAngle = +e.target.value;
    state.formPlaying = false;
    const out = $('#formationAngleOut');
    if(out) out.textContent = Math.round(state.formAngle) + '°';
  };
}
const fStart = $('#formationStart');
if(fStart){
  fStart.onclick = () => {
    if(state.formAngle >= 360) state.formAngle = 0;
    state.formPlaying = true;
  };
}
const fPause = $('#formationPause');
if(fPause){
  fPause.onclick = () => {
    state.formPlaying = false;
  };
}
const fReset = $('#formationReset');
if(fReset){
  fReset.onclick = () => {
    state.formAngle = 0;
    state.formPlaying = true;
    const sl = $('#formationAngle'), out = $('#formationAngleOut');
    if(sl) sl.value = 0;
    if(out) out.textContent = '0°';
  };
}

// Unfold controls listeners
const uSlider = $('#unfoldProgress');
if(uSlider){
  uSlider.oninput = e => {
    state.unfoldProgress = +e.target.value;
    state.unfoldPlaying = false;
    const out = $('#unfoldProgressOut');
    if(out) out.textContent = Math.round(state.unfoldProgress) + '%';
  };
}
const uStart = $('#unfoldStart');
if(uStart){
  uStart.onclick = () => {
    if(state.unfoldProgress >= 100) state.unfoldProgress = 0;
    state.unfoldPlaying = true;
  };
}
const uPause = $('#unfoldPause');
if(uPause){
  uPause.onclick = () => {
    state.unfoldPlaying = false;
  };
}
const uReset = $('#unfoldReset');
if(uReset){
  uReset.onclick = () => {
    state.unfoldProgress = 0;
    state.unfoldPlaying = false;
    const sl = $('#unfoldProgress'), out = $('#unfoldProgressOut');
    if(sl) sl.value = 0;
    if(out) out.textContent = '0%';
  };
}

// Slice (Hemisphere cut) controls listeners
const slProg = $('#sliceProgress');
if(slProg){
  slProg.oninput = e => {
    state.sliceProgress = +e.target.value;
    state.slicePlaying = false;
    const out = $('#sliceProgressOut');
    if(out) out.textContent = `${Math.round(state.sliceProgress)}%`;
  };
}
const slStart = $('#sliceStart');
if(slStart){
  slStart.onclick = () => {
    if(state.sliceProgress >= 100) state.sliceProgress = 0;
    state.slicePlaying = true;
  };
}
const slPause = $('#slicePause');
if(slPause){
  slPause.onclick = () => {
    state.slicePlaying = false;
  };
}
const slReset = $('#sliceReset');
if(slReset){
  slReset.onclick = () => {
    state.slicePlaying = false;
    state.sliceProgress = 0;
    if(slProg) slProg.value = 0;
    const out = $('#sliceProgressOut');
    if(out) out.textContent = '0%';
  };
}


// ==========================================
// BỘ ĐIỀU KHIỂN NHẠC NỀN TƯƠI TẮN, SINH ĐỘNG
// (Carefree - Kevin MacLeod / Creative Commons BY 3.0)
// ==========================================
(function initBackgroundMusic(){
  const soundBtn = document.getElementById('soundBtn');
  const bgMusic = document.getElementById('bgMusic');
  if(!soundBtn || !bgMusic) return;

  // Thiết lập âm lượng tươi tắn, vừa vặn (khoảng 22%), tạo cảm hứng học tập
  bgMusic.volume = 0.22;

  // Trạng thái lưu trữ (mặc định mở web là bật nhạc)
  const isMutedPref = localStorage.getItem('mathlab_sound_muted') === '1';

  function updateBtnUI(playing){
    const iconSpan = soundBtn.querySelector('.sound-icon');
    const textSpan = soundBtn.querySelector('.sound-text');
    
    soundBtn.classList.toggle('playing', playing);
    soundBtn.classList.toggle('muted', !playing);
    
    if(iconSpan) iconSpan.textContent = playing ? '🔊' : '🔇';
    if(textSpan) textSpan.textContent = playing ? ' Âm thanh' : ' Tắt tiếng';
    
    soundBtn.title = playing ? 'Nhấp để tắt nhạc nền vui tươi' : 'Nhấp để bật nhạc nền vui tươi (Carefree)';
    soundBtn.setAttribute('aria-label', playing ? 'Tắt nhạc nền' : 'Bật nhạc nền');
  }

  function playMusic(){
    bgMusic.play().then(() => {
      updateBtnUI(true);
      localStorage.setItem('mathlab_sound_muted', '0');
    }).catch(() => {
      updateBtnUI(false);
    });
  }

  function pauseMusic(){
    bgMusic.pause();
    updateBtnUI(false);
    localStorage.setItem('mathlab_sound_muted', '1');
  }

  // Nhấp vào biểu tượng âm thanh để tắt/bật
  soundBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if(bgMusic.paused){
      playMusic();
    } else {
      pauseMusic();
    }
  });

  // Tự động phát khi tải trang
  if(!isMutedPref){
    const playAttempt = bgMusic.play();
    if(playAttempt !== undefined){
      playAttempt.then(() => {
        updateBtnUI(true);
      }).catch(() => {
        // Trình duyệt chặn autoplay khi chưa có cử chỉ người dùng:
        // Đặt giao diện sẵn sàng và kích hoạt tức thì khi người dùng tương tác lần đầu
        updateBtnUI(false);
        const autoResumeOnFirstTouch = () => {
          if(localStorage.getItem('mathlab_sound_muted') !== '1'){
            bgMusic.play().then(() => updateBtnUI(true)).catch(() => {});
          }
          ['pointerdown', 'click', 'touchstart', 'keydown'].forEach(evt => {
            window.removeEventListener(evt, autoResumeOnFirstTouch);
          });
        };
        ['pointerdown', 'click', 'touchstart', 'keydown'].forEach(evt => {
          window.addEventListener(evt, autoResumeOnFirstTouch, { once: true, passive: true });
        });
      });
    }
  } else {
    updateBtnUI(false);
  }
})();
