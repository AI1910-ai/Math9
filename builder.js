(() => {
  const $ = (s) => document.querySelector(s);
  const dialog = $('#builderDialog');
  const svg = $('#builderSvg');
  const code = $('#tikzCode');
  const status = $('#builderStatus');
  let geometry = null;
  let dragging = null;
  let interactionMode = 'point';
  let movingShape = false;
  let moveOrigin = null;
  let moveSnapshot = null;
  let autoMotion = false;
  let motionStart = 0;
  let rotationSource = null;
  let rotationAngle = 0;
  let rotationTilt = 0;
  let lastMotionFrame = 0;
  let lastGeneratedCode = '';

  const shapeDefinitions = {
    pyramid: {
      labels: ['S', 'A', 'B', 'C', 'D'],
      build(h, b, d) {
        const cx = 380, baseY = 405, sx = b * 34, sy = d * 19, topY = baseY - h * 45;
        return {
          points: { S:[cx,topY], A:[cx-sx*.62,baseY-sy*.15], B:[cx+sx*.38,baseY+sy*.45], C:[cx+sx*.72,baseY-sy*.48], D:[cx-sx*.28,baseY-sy] },
          visible:[['S','A'],['S','B'],['S','C'],['S','D'],['A','B'],['B','C'],['C','D']], hidden:[['D','A']], diagonal:[['A','C'],['B','D'],['S','B']]
        };
      }
    },
    triPyramid: {
      labels: ['S', 'A', 'B', 'C'],
      build(h, b, d) {
        const cx=380, baseY=405, sx=b*38, sy=d*23, topY=baseY-h*45;
        return {points:{S:[cx,topY],A:[cx-sx*.65,baseY],B:[cx+sx*.5,baseY+sy*.35],C:[cx+sx*.3,baseY-sy]},visible:[['S','A'],['S','B'],['S','C'],['A','B'],['B','C']],hidden:[['C','A']],diagonal:[['S','B']]};
      }
    },
    prism: {
      labels: ['A', 'B', 'C', "A'", "B'", "C'"],
      build(h, b, d) {
        const sx=b*28, sy=h*30, dx=d*30, x=180, y=380;
        return {points:{A:[x,y-sy],B:[x-sx*.25,y],C:[x+sx*.65,y+15],"A'":[x+dx,y-sy-35],"B'":[x+dx-sx*.25,y-35],"C'":[x+dx+sx*.65,y-20]},visible:[['A','B'],['B','C'],['C','A'],['A',"A'"],['B',"B'"],['C',"C'"],["A'","B'"],["B'","C'"]],hidden:[["C'","A'"]],diagonal:[['A',"C'"],['C',"A'"]]};
      }
    },
    cube: {
      labels: ['A','B','C','D',"A'","B'","C'","D'"],
      build(h, b, d) {
        const sx=b*32, sy=h*31, dx=d*25, x=220, y=180;
        return {points:{A:[x,y],B:[x+sx,y],C:[x+sx+dx,y-dx*.62],D:[x+dx,y-dx*.62],"A'":[x,y+sy],"B'":[x+sx,y+sy],"C'":[x+sx+dx,y+sy-dx*.62],"D'":[x+dx,y+sy-dx*.62]},visible:[['A','B'],['B','C'],['C','D'],['D','A'],['A',"A'"],['B',"B'"],["B'","C'"],["C'",'C'],["A'","B'"]],hidden:[['D',"D'"],["D'","A'"],["D'","C'"]],diagonal:[['A',"C'"],["A'",'C']]};
      }
    },
    box: {
      labels: ['A','B','C','D',"A'","B'","C'","D'"],
      build(h,b,d){
        const sx=b*35,sy=h*30,dx=d*24,x=205,y=175;
        return {points:{A:[x,y],B:[x+sx,y],C:[x+sx+dx,y-dx*.55],D:[x+dx,y-dx*.55],"A'":[x,y+sy],"B'":[x+sx,y+sy],"C'":[x+sx+dx,y+sy-dx*.55],"D'":[x+dx,y+sy-dx*.55]},visible:[['A','B'],['B','C'],['C','D'],['D','A'],['A',"A'"],['B',"B'"],['C',"C'"],["A'","B'"],["B'","C'"]],hidden:[['D',"D'"],["D'","A'"],["D'","C'"]],diagonal:[['A',"C'"],["A'",'C']]};
      }
    },
    pentPyramid: {
      labels: ['S','A','B','C','D','E'],
      build(h,b,d){
        const cx=380,cy=395,rx=b*34,ry=d*22,pts={S:[cx,cy-h*43]};
        ['A','B','C','D','E'].forEach((k,i)=>{const q=Math.PI/2+i*TAU/5;pts[k]=[cx+rx*Math.cos(q),cy+ry*Math.sin(q)]});
        return {points:pts,visible:[['S','A'],['S','B'],['S','C'],['S','D'],['S','E'],['A','B'],['B','C'],['C','D']],hidden:[['D','E'],['E','A']],diagonal:[['A','C'],['A','D']]};
      }
    },
    pentPrism: {
      labels: ['A','B','C','D','E',"A'","B'","C'","D'","E'"],
      build(h,b,d){
        const cx=275,cy=300,rx=b*25,ry=h*18,dx=d*38,dy=-d*15,pts={};
        ['A','B','C','D','E'].forEach((k,i)=>{const q=-Math.PI/2+i*TAU/5;pts[k]=[cx+rx*Math.cos(q),cy+ry*Math.sin(q)];pts[k+"'"]=[cx+dx+rx*Math.cos(q),cy+dy+ry*Math.sin(q)]});
        return {points:pts,visible:[['A','B'],['B','C'],['C','D'],['D','E'],['A','Ap'],['B','Bp'],['C','Cp'],['D','Dp'],['Ap','Bp'],['Bp','Cp'],['Cp','Dp']],hidden:[['E','A'],['E','Ep'],['Dp','Ep'],['Ep','Ap']],diagonal:[['A','Cp'],['B','Dp']]};
      }
    },
    frustum: {
      labels: ['A','B','C','D',"A'","B'","C'","D'"],
      build(h,b,d){
        const cx=380,baseY=420,bx=b*35,by=d*19,tx=bx*.55,ty=by*.55,topY=baseY-h*34;
        return {points:{A:[cx-bx*.62,baseY],B:[cx+bx*.45,baseY+by*.35],C:[cx+bx*.67,baseY-by*.55],D:[cx-bx*.4,baseY-by],"A'":[cx-tx*.62,topY],"B'":[cx+tx*.45,topY+ty*.35],"C'":[cx+tx*.67,topY-ty*.55],"D'":[cx-tx*.4,topY-ty]},visible:[['A','B'],['B','C'],['C','D'],['A',"A'"],['B',"B'"],['C',"C'"],["A'","B'"],["B'","C'"],["C'","D'"]],hidden:[['D','A'],['D',"D'"],["D'","A'"]],diagonal:[['A','C'],["A'","C'"]]};
      }
    }
  };

  function el(tag, attrs={}) {
    const node=document.createElementNS('http://www.w3.org/2000/svg',tag);
    Object.entries(attrs).forEach(([k,v])=>node.setAttribute(k,v));
    return node;
  }
  function safeName(name){return name.replace(/'/g,'p').replace(/[^A-Za-z0-9_]/g,'')||'P'}
  function displayName(key){return geometry.names?.[key]||key.replace(/p$/,"'")}
  function depthForPoint(key,index,total){if(['C','D','Cp','Dp'].includes(key))return 85;if(['A','B','Ap','Bp'].includes(key))return-85;if(key==='S')return 0;return Math.sin(index/Math.max(1,total)*TAU)*75}
  function prepareRotation(){const entries=Object.entries(geometry.points),cx=entries.reduce((s,[,p])=>s+p[0],0)/entries.length,cy=entries.reduce((s,[,p])=>s+p[1],0)/entries.length;rotationSource={cx,cy,points:{}};entries.forEach(([k,p],i)=>{const z=depthForPoint(k,i,entries.length);rotationSource.points[k]=[p[0]-cx-z*.55,p[1]-cy+z*.28,z]})}
  function applyRotation(){if(!rotationSource)prepareRotation();const ca=Math.cos(rotationAngle),sa=Math.sin(rotationAngle),ct=Math.cos(rotationTilt),st=Math.sin(rotationTilt),{cx,cy}=rotationSource;Object.entries(rotationSource.points).forEach(([k,p])=>{const X=p[0]*ca+p[2]*sa,Z=-p[0]*sa+p[2]*ca,Y=p[1]*ct-Z*st,scale=720/(720+Z);geometry.points[k]=[cx+X*scale,cy+Y*scale]});render()}
  function makeGeometry(){
    const type=$('#shapePreset').value, h=+$('#shapeHeight').value||6, b=+$('#shapeBase').value||6, d=+$('#shapeDepth').value||3;
    const raw=shapeDefinitions[type].build(h,b,d), converted={};
    Object.entries(raw.points).forEach(([k,p])=>converted[safeName(k)]=p);
    const cv=arr=>arr.map(pair=>pair.map(safeName));
    geometry={type,points:converted,visible:cv(raw.visible),hidden:cv(raw.hidden),diagonal:cv(raw.diagonal),names:Object.fromEntries(Object.keys(raw.points).map(k=>[safeName(k),k]))};rotationSource=null;rotationAngle=0;rotationTilt=0;
    refreshAll(true);
  }
  function tikzFromGeometry(){
    const lines=['\\begin{tikzpicture}[line join=round, line cap=round, scale=0.8]'];
    Object.entries(geometry.points).forEach(([k,p])=>lines.push(`  \\coordinate (${k}) at (${(p[0]/55).toFixed(2)},${((520-p[1])/55).toFixed(2)});`));
    geometry.visible.forEach(e=>lines.push(`  \\draw (${e[0]}) -- (${e[1]});`));
    if($('#showHidden').checked) geometry.hidden.forEach(e=>lines.push(`  \\draw[dashed] (${e[0]}) -- (${e[1]});`));
    if($('#showDiagonal').checked) geometry.diagonal.forEach(e=>lines.push(`  \\draw[dashed, teal] (${e[0]}) -- (${e[1]});`));
    if($('#showLabels').checked) Object.keys(geometry.points).forEach(k=>lines.push(`  \\node[above right] at (${k}) {${displayName(k)}};`));
    lines.push('\\end{tikzpicture}');
    return lines.join('\n');
  }
  function render(){
    svg.replaceChildren();
    const width=+$('#lineWidth').value;
    const edges=[...geometry.visible.map(e=>[e,'geo-edge']),...($('#showHidden').checked?geometry.hidden.map(e=>[e,'geo-edge geo-hidden']):[]),...($('#showDiagonal').checked?geometry.diagonal.map(e=>[e,'geo-edge geo-diagonal']):[])];
    edges.forEach(([edge,cls])=>{const [a,b]=edge.map(k=>geometry.points[k]);if(!a||!b)return;svg.append(el('line',{x1:a[0],y1:a[1],x2:b[0],y2:b[1],class:cls,'stroke-width':width}))});
    if($('#showDimensions').checked) drawDimensions();
    Object.entries(geometry.points).forEach(([key,p])=>{
      const point=el('circle',{cx:p[0],cy:p[1],r:5,class:'geo-point','data-point':key,tabindex:'0'});svg.append(point);
      if($('#showLabels').checked){const text=el('text',{x:p[0]+11,y:p[1]-11,class:'geo-label'});text.textContent=displayName(key);svg.append(text)}
    });
    $('#lineWidthOut').textContent=width.toFixed(2);
    const objects=[...Object.keys(geometry.points).map(k=>`Điểm ${displayName(k)} (${(geometry.points[k][0]/55).toFixed(1)}; ${((520-geometry.points[k][1])/55).toFixed(1)})`),...edges.map(([e,c])=>`${c.includes('hidden')?'Nét khuất':'Đoạn thẳng'} ${displayName(e[0])}${displayName(e[1])}`)];
    $('#objectCount').textContent=objects.length;
    $('#objectList').innerHTML=Object.entries(geometry.points).map(([k,p])=>`<div class="coordinate-item" data-key="${k}"><strong>${displayName(k)}</strong><label>X<input type="number" step="0.1" data-axis="x" value="${(p[0]/55).toFixed(1)}"></label><label>Y<input type="number" step="0.1" data-axis="y" value="${((520-p[1])/55).toFixed(1)}"></label><button class="delete-point" data-delete="${k}" title="Xóa điểm ${displayName(k)}">×</button></div>`).join('')+edges.map(([e,c])=>`<div class="object-item"><i></i>${c.includes('hidden')?'Nét khuất':'Đoạn thẳng'} ${displayName(e[0])}${displayName(e[1])}</div>`).join('');
    syncPointSelectors();
  }
  function drawDimensions(){
    const pts=geometry.points;if(!Object.keys(pts).length)return;
    const h=+$('#shapeHeight').value||0,b=+$('#shapeBase').value||0,d=+$('#shapeDepth').value||0;
    const label=(p,q,value,offset=-10,guide=false)=>{if(!p||!q)return;if(guide)svg.append(el('line',{x1:p[0],y1:p[1],x2:q[0],y2:q[1],class:'dimension-guide'}));let angle=Math.atan2(q[1]-p[1],q[0]-p[0])*180/Math.PI;if(angle>90||angle<-90)angle+=180;const len=Math.hypot(q[0]-p[0],q[1]-p[1]),nx=-(q[1]-p[1])/len,ny=(q[0]-p[0])/len,mx=(p[0]+q[0])/2+nx*offset,my=(p[1]+q[1])/2+ny*offset;const text=el('text',{x:mx,y:my,class:'dimension-label','text-anchor':'middle',transform:`rotate(${angle} ${mx} ${my})`});text.textContent=value;svg.append(text)};
    const prismLike=['box','cube','frustum'].includes(geometry.type);
    if(prismLike){label(pts.A,pts.Ap,`h = ${h} cm`,-13);label(pts.A,pts.B,`${b} cm`,-13);label(pts.B,pts.C,`${d} cm`,-13);return}
    if(['pyramid','triPyramid','pentPyramid'].includes(geometry.type)&&pts.S){const baseKeys=Object.keys(pts).filter(k=>k!=='S'),center=baseKeys.reduce((a,k)=>[a[0]+pts[k][0]/baseKeys.length,a[1]+pts[k][1]/baseKeys.length],[0,0]);label(pts.S,center,`h = ${h} cm`,-13,true);label(pts.A,pts.B,`${b} cm`,-13);if(pts.C)label(pts.B,pts.C,`${d} cm`,-13);return}
    const keys=Object.keys(pts),segments=geometry.visible.map(e=>e.map(k=>pts[k])).filter(e=>e[0]&&e[1]);if(!segments.length)return;
    const score=(seg,kind)=>{const dx=Math.abs(seg[1][0]-seg[0][0]),dy=Math.abs(seg[1][1]-seg[0][1]),len=Math.hypot(dx,dy);return kind==='h'?dy-dx*.6:kind==='b'?dx-dy*.6:Math.min(dx,dy)+len*.15};
    const best=kind=>segments.slice().sort((x,y)=>score(y,kind)-score(x,kind))[0];label(...best('h'),`h = ${h} cm`,-13);label(...best('b'),`${b} cm`,-13);label(...best('d'),`${d} cm`,-13);
  }
  function syncPointSelectors(){
    const keys=Object.keys(geometry.points),from=$('#edgeFrom'),to=$('#edgeTo'),oldFrom=from.value,oldTo=to.value;
    const options=keys.map(k=>`<option value="${k}">${displayName(k)}</option>`).join('');
    from.innerHTML=options;to.innerHTML=options;
    if(keys.includes(oldFrom))from.value=oldFrom;
    if(keys.includes(oldTo))to.value=oldTo;else if(keys.length>1)to.value=keys[1];
  }
  function addPoint(){
    const label=$('#newPointName').value.trim(),key=safeName(label),x=+$('#newPointX').value,y=+$('#newPointY').value;
    if(!label||!Number.isFinite(x)||!Number.isFinite(y)){status.textContent='Hãy nhập tên điểm và đủ hai tọa độ X, Y.';return}
    if(geometry.points[key]){status.textContent=`Điểm ${label} đã tồn tại. Hãy chọn tên khác.`;return}
    geometry.points[key]=[x*55,520-y*55];geometry.names[key]=label;refreshAll(true);status.textContent=`Đã thêm điểm ${label}.`;
  }
  function addEdge(){
    const a=$('#edgeFrom').value,b=$('#edgeTo').value,style=$('#edgeStyle').value;
    if(!a||!b||a===b){status.textContent='Hãy chọn hai điểm khác nhau.';return}
    const all=[...geometry.visible,...geometry.hidden,...geometry.diagonal];
    if(all.some(e=>(e[0]===a&&e[1]===b)||(e[0]===b&&e[1]===a))){status.textContent='Đoạn thẳng này đã có trong hình.';return}
    geometry[style].push([a,b]);refreshAll(true);status.textContent=`Đã nối ${displayName(a)} với ${displayName(b)}.`;
  }
  function deletePoint(key){
    if(Object.keys(geometry.points).length<=3){status.textContent='Hình cần giữ lại ít nhất 3 điểm.';return}
    delete geometry.points[key];delete geometry.names[key];['visible','hidden','diagonal'].forEach(type=>geometry[type]=geometry[type].filter(e=>!e.includes(key)));refreshAll(true);status.textContent=`Đã xóa điểm ${key} và các đoạn nối liên quan.`;
  }
  function refreshAll(updateCode){render();if(updateCode){code.value=tikzFromGeometry();lastGeneratedCode=code.value}status.textContent='Đã tạo hình. Có thể kéo các đỉnh hoặc sửa mã TikZ.'}

  function compile(){
    try{
      const text=code.value, pts={}, names={};
      const coord=/\\coordinate\s*\(([^)]+)\)\s*at\s*\((-?[\d.]+)\s*,\s*(-?[\d.]+)\)\s*;/g;let m;
      while((m=coord.exec(text)))pts[m[1].trim()]=[+m[2]*55,520-(+m[3]*55)];
      if(Object.keys(pts).length<3)throw new Error('Cần ít nhất 3 lệnh \\coordinate hợp lệ.');
      const visible=[],hidden=[],diagonal=[];
      text.split(/\r?\n/).forEach(line=>{if(!/\\draw/.test(line))return;const ids=[...line.matchAll(/\(([^)]+)\)/g)].map(x=>x[1].trim());for(let i=0;i<ids.length-1;i++){if(!pts[ids[i]]||!pts[ids[i+1]])continue;(line.includes('teal')?diagonal:line.includes('dashed')?hidden:visible).push([ids[i],ids[i+1]])}});
      const node=/\\node(?:\[[^\]]*\])?\s*at\s*\(([^)]+)\)\s*\{([^}]*)\}\s*;/g;while((m=node.exec(text)))names[m[1].trim()]=m[2].trim();
      geometry={type:'custom',points:pts,visible,hidden,diagonal,names};render();status.textContent=`Biên dịch thành công: ${Object.keys(pts).length} điểm, ${visible.length+hidden.length+diagonal.length} đoạn.`;
    }catch(err){status.textContent='Lỗi biên dịch: '+err.message}
  }
  function svgText(){const clone=svg.cloneNode(true);clone.setAttribute('width','760');clone.setAttribute('height','520');clone.insertBefore(el('rect',{width:'100%',height:'100%',fill:'white'}),clone.firstChild);return new XMLSerializer().serializeToString(clone)}
  function download(data,name,type){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([data],{type}));a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
  function pointerPos(evt){const r=svg.getBoundingClientRect();return [(evt.clientX-r.left)*760/r.width,(evt.clientY-r.top)*520/r.height]}

  svg.addEventListener('pointerdown',e=>{const key=e.target.dataset.point;if(autoMotion){autoMotion=false;$('#autoShapeMotion').textContent='▶ Tự xoay 3D'}if(interactionMode==='point'){if(!key)return;dragging=key}else{movingShape=true;moveOrigin=pointerPos(e);moveSnapshot=Object.fromEntries(Object.entries(geometry.points).map(([k,p])=>[k,[...p]]));if(interactionMode==='rotate'&&!rotationSource)prepareRotation()}svg.setPointerCapture(e.pointerId)});
  svg.addEventListener('pointermove',e=>{if(dragging){geometry.points[dragging]=pointerPos(e);rotationSource=null;render();return}if(movingShape){const now=pointerPos(e),dx=now[0]-moveOrigin[0],dy=now[1]-moveOrigin[1];if(interactionMode==='rotate'){rotationAngle+=dx*.008;rotationTilt=Math.max(-.75,Math.min(.75,rotationTilt+dy*.006));moveOrigin=now;applyRotation()}else{Object.entries(moveSnapshot).forEach(([k,p])=>geometry.points[k]=[p[0]+dx,p[1]+dy]);render()}}});
  svg.addEventListener('pointerup',()=>{if(!dragging&&!movingShape)return;const moved=movingShape;dragging=null;movingShape=false;code.value=tikzFromGeometry();lastGeneratedCode=code.value;status.textContent=moved?'Đã di chuyển toàn bộ hình.':'Đã cập nhật tọa độ sau khi kéo điểm.'});
  function setInteractionMode(mode){interactionMode=mode;$('#editPointMode').classList.toggle('active',mode==='point');$('#moveShapeMode').classList.toggle('active',mode==='move');$('#rotateShapeMode').classList.toggle('active',mode==='rotate');svg.classList.toggle('move-mode',mode!=='point');status.textContent=mode==='rotate'?'Kéo ngang để xoay quanh trục đứng; kéo dọc để nghiêng hình.':mode==='move'?'Giữ và kéo để di chuyển toàn bộ hình.':'Kéo từng điểm để thay đổi hình.'}
  $('#editPointMode').onclick=()=>setInteractionMode('point');
  $('#moveShapeMode').onclick=()=>setInteractionMode('move');
  $('#rotateShapeMode').onclick=()=>{prepareRotation();setInteractionMode('rotate')};
  $('#autoShapeMotion').onclick=()=>{autoMotion=!autoMotion;motionStart=performance.now();if(autoMotion){prepareRotation();setInteractionMode('rotate')}$('#autoShapeMotion').textContent=autoMotion?'Ⅱ Dừng xoay 3D':'▶ Tự xoay 3D'};
  function animateMotion(now){if(autoMotion&&now-lastMotionFrame>32){lastMotionFrame=now;rotationAngle+=.016;applyRotation()}requestAnimationFrame(animateMotion)}requestAnimationFrame(animateMotion);
  $('#objectList').addEventListener('change',e=>{const axis=e.target.dataset.axis;if(!axis)return;const row=e.target.closest('.coordinate-item'),key=row.dataset.key,value=+e.target.value;if(!Number.isFinite(value))return;if(axis==='x')geometry.points[key][0]=value*55;else geometry.points[key][1]=520-value*55;refreshAll(true);status.textContent=`Đã cập nhật tọa độ điểm ${displayName(key)}.`});
  $('#objectList').addEventListener('click',e=>{const key=e.target.dataset.delete;if(key)deletePoint(key)});
  $('#addPoint').onclick=addPoint;
  $('#addEdge').onclick=addEdge;
  $('#generateShape').onclick=makeGeometry;
  $('#compileTikz').onclick=compile;
  $('#resetCode').onclick=()=>{code.value=lastGeneratedCode;compile()};
  $('#shapePreset').onchange=makeGeometry;
  ['shapeHeight','shapeBase','shapeDepth'].forEach(id=>$('#'+id).addEventListener('change',makeGeometry));
  ['showLabels','showHidden','showDiagonal','showDimensions'].forEach(id=>$('#'+id).addEventListener('change',()=>refreshAll(true)));
  $('#lineWidth').addEventListener('input',()=>render());
  $('#copyTikz').onclick=async()=>{try{await navigator.clipboard.writeText(code.value);status.textContent='Đã sao chép mã TikZ.'}catch{status.textContent='Không thể sao chép tự động. Hãy chọn mã và nhấn Ctrl+C.'}};
  $('#downloadSvg').onclick=()=>download(svgText(),'hinh-hoc-khong-gian.svg','image/svg+xml');
  $('#downloadPng').onclick=()=>{const url=URL.createObjectURL(new Blob([svgText()],{type:'image/svg+xml'})),img=new Image();img.onload=()=>{const c=document.createElement('canvas');c.width=1520;c.height=1040;const x=c.getContext('2d');x.fillStyle='white';x.fillRect(0,0,c.width,c.height);x.drawImage(img,0,0,c.width,c.height);URL.revokeObjectURL(url);c.toBlob(file=>{const a=document.createElement('a');a.href=URL.createObjectURL(file);a.download='hinh-hoc-khong-gian.png';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);status.textContent='Đã xuất ảnh PNG độ phân giải cao.'},'image/png')};img.src=url};
  function open(){dialog.showModal();document.body.style.overflow='hidden';if(!geometry)makeGeometry()}
  $('#openBuilder').onclick=open;$('#openBuilder').onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open()}};
  $('#closeBuilder').onclick=()=>dialog.close();dialog.addEventListener('close',()=>document.body.style.overflow='');dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});
  const builderAiBtn=$('#builderAskAiBtn');if(builderAiBtn){builderAiBtn.onclick=()=>{const sel=$('#shapePreset'),name=sel?sel.options[sel.selectedIndex].textContent:'Hình không gian';const promptText=`Gợi ý cho tôi 2 bài toán hình học thực tế về ${name} (Toán THCS) kèm lời giải chi tiết và đáp số.`;if(window.MathLabChat){dialog.close();window.MathLabChat.openWithPrompt(promptText);}else{window.location.href='ai-assistant.html?prompt='+encodeURIComponent(promptText);}};}
})();
