/* scenes.js – Canvas drawing for each game level */
'use strict';

const CW = 500, CH = 380; // canonical canvas size

/* ──────────────────────────────────────────────────────────
   UTILITY HELPERS
────────────────────────────────────────────────────────── */
function rr(ctx, x, y, w, h, r = 6) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function lg(ctx, x1, y1, x2, y2, stops) {
  const g = ctx.createLinearGradient(x1, y1, x2, y2);
  stops.forEach(([t, c]) => g.addColorStop(t, c));
  return g;
}

function rg(ctx, cx, cy, r0, r1, stops) {
  const g = ctx.createRadialGradient(cx, cy, r0, cx, cy, r1);
  stops.forEach(([t, c]) => g.addColorStop(t, c));
  return g;
}

/* ══════════════════════════════════════════════════════════
   LEVEL 1 : 거실 (Living Room)                  500 × 380
   Differences when alt=true:
     D0 (255,  50) r=38  clock rim  gold → blue
     D1 ( 87, 103) r=50  curtains   blue → purple
     D2 (385,  87) r=55  TV bezel   dark → red
     D3 (471,  36) r=22  book #3 in top shelf row  present → absent
     D4 (410, 293) r=38  plant pot  red → green
══════════════════════════════════════════════════════════ */
function drawLivingRoom(ctx, alt) {
  /* wall */
  ctx.fillStyle = lg(ctx, 0, 0, 0, CH * 0.64, [[0,'#FDEBD0'],[1,'#F0D5B5']]);
  ctx.fillRect(0, 0, CW, CH);
  for (let x = 0; x <= CW; x += 28) {
    ctx.fillStyle = 'rgba(0,0,0,0.02)';
    ctx.fillRect(x, 0, 14, CH * 0.64);
  }

  /* floor */
  ctx.fillStyle = lg(ctx, 0, CH * 0.64, 0, CH, [[0,'#C4895A'],[1,'#9A6038']]);
  ctx.fillRect(0, CH * 0.64, CW, CH);
  ctx.fillStyle = 'rgba(0,0,0,0.06)';
  for (let x = 0; x <= CW; x += 50) { ctx.fillRect(x, CH * 0.64, 1, CH); }
  ctx.fillStyle = '#E8C9A0';
  ctx.fillRect(0, CH * 0.64 - 4, CW, 10);

  /* ── WINDOW ── */
  ctx.fillStyle = '#8B6542';
  rr(ctx, 28, 22, 120, 165, 5); ctx.fill();
  ctx.fillStyle = lg(ctx, 28, 22, 28, 187, [[0,'#B8D4EC'],[1,'#AED6F1']]);
  ctx.fillRect(33, 27, 52, 155); ctx.fillRect(88, 27, 52, 155);
  ctx.fillStyle = '#8B6542';
  ctx.fillRect(82, 22, 10, 165); ctx.fillRect(28, 97, 120, 9);
  /* outdoor in window */
  ctx.fillStyle = '#87CEEB'; ctx.fillRect(33,27,52,65); ctx.fillRect(88,27,52,65);
  ctx.fillStyle = '#5D8A3C'; ctx.beginPath(); ctx.arc(57,83,18,0,Math.PI*2); ctx.fill();
  ctx.fillStyle = '#4A6F2E'; ctx.fillRect(54,97,5,17);
  ctx.fillStyle = '#5D8A3C'; ctx.beginPath(); ctx.arc(108,87,14,0,Math.PI*2); ctx.fill();
  ctx.fillStyle = '#4A6F2E'; ctx.fillRect(106,98,4,13);

  /* CURTAINS – D1: blue → purple */
  const cTop = alt ? '#8E44AD' : '#2471A3';
  const cBot = alt ? '#6C3483' : '#1A5276';
  ctx.fillStyle = lg(ctx, 28, 0, 56, 0, [[0,cTop],[1,cBot]]);
  ctx.beginPath();
  ctx.moveTo(28,18); ctx.lineTo(56,18);
  ctx.bezierCurveTo(50,78,44,128,50,190); ctx.lineTo(28,190);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = lg(ctx, 148, 0, 120, 0, [[0,cTop],[1,cBot]]);
  ctx.beginPath();
  ctx.moveTo(148,18); ctx.lineTo(120,18);
  ctx.bezierCurveTo(126,78,132,128,126,190); ctx.lineTo(148,190);
  ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#6B4F2E'; ctx.lineWidth = 7; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(20,18); ctx.lineTo(156,18); ctx.stroke();
  ctx.fillStyle = '#B8860B';
  ctx.beginPath(); ctx.arc(20,18,5,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(156,18,5,0,Math.PI*2); ctx.fill();

  /* CLOCK – D0: gold → blue */
  const ck = alt ? '#2471A3' : '#D4AC0D';
  ctx.shadowColor = 'rgba(0,0,0,0.3)'; ctx.shadowBlur = 8;
  ctx.fillStyle = ck;
  ctx.beginPath(); ctx.arc(255, 50, 34, 0, Math.PI*2); ctx.fill();
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#FAFAFA';
  ctx.beginPath(); ctx.arc(255, 50, 27, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = '#555'; ctx.font = 'bold 7.5px Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('12',255,29); ctx.fillText('3',279,50); ctx.fillText('6',255,71); ctx.fillText('9',231,50);
  ctx.strokeStyle = '#222'; ctx.lineCap = 'round';
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(255,50); ctx.lineTo(255+13*Math.cos(-1.1),50+13*Math.sin(-1.1)); ctx.stroke();
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(255,50); ctx.lineTo(255+20*Math.cos(-Math.PI/2+0.2),50+20*Math.sin(-Math.PI/2+0.2)); ctx.stroke();
  ctx.fillStyle = '#222'; ctx.beginPath(); ctx.arc(255,50,2.5,0,Math.PI*2); ctx.fill();

  /* PICTURE FRAME */
  ctx.shadowColor = 'rgba(0,0,0,0.25)'; ctx.shadowBlur = 6;
  ctx.fillStyle = '#7D5A3C'; rr(ctx,163,28,82,100,4); ctx.fill();
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#E8E0D5'; ctx.fillRect(168,33,72,90);
  ctx.fillStyle = '#87CEEB'; ctx.fillRect(171,36,66,38);
  ctx.fillStyle = '#7CB87C'; ctx.fillRect(171,74,66,46);
  ctx.fillStyle = '#F4D03F'; ctx.beginPath(); ctx.arc(202,48,9,0,Math.PI*2); ctx.fill();
  ctx.fillStyle = '#5D8A3C'; ctx.beginPath(); ctx.arc(181,73,11,0,Math.PI*2); ctx.fill();
  ctx.fillStyle = '#4A6F2E'; ctx.fillRect(179,81,4,12);
  ctx.fillStyle = '#5D8A3C'; ctx.beginPath(); ctx.arc(220,70,9,0,Math.PI*2); ctx.fill();
  ctx.fillStyle = '#4A6F2E'; ctx.fillRect(218,77,4,11);

  /* TV – D2: dark bezel → red */
  const tvBz = alt ? '#922B21' : '#1A252F';
  ctx.shadowColor = 'rgba(0,0,0,0.45)'; ctx.shadowBlur = 12;
  ctx.fillStyle = tvBz; rr(ctx,300,28,170,128,12); ctx.fill();
  ctx.shadowBlur = 0;
  ctx.fillStyle = lg(ctx,310,36,310,144,[[0,'#0D1117'],[1,'#1A1A2E']]);
  ctx.fillRect(310,36,152,112);
  ctx.fillStyle = '#1E90FF'; ctx.fillRect(310,36,152,56);
  ctx.fillStyle = '#CC2929'; ctx.fillRect(310,92,152,56);
  ctx.fillStyle = '#fff'; ctx.font = 'bold 11px Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('NEWS', 386,64); ctx.fillText('BREAKING', 386,118);
  ctx.beginPath(); ctx.arc(468,150,3,0,Math.PI*2); ctx.fillStyle='#2ECC71'; ctx.fill();
  ctx.fillStyle = tvBz; ctx.fillRect(379,156,9,22); ctx.fillRect(362,176,44,7);

  /* BOOKSHELF – D3: one book missing */
  ctx.fillStyle = lg(ctx,440,0,500,0,[[0,'#9B6F3D'],[1,'#7A5530']]);
  ctx.fillRect(440,12,58,225);
  ctx.fillStyle = '#6B4828'; ctx.fillRect(443,15,52,219);
  for (let sy = 52; sy < 230; sy += 53) {
    ctx.fillStyle = '#8B6342'; ctx.fillRect(440,sy,58,6);
    ctx.fillStyle = 'rgba(255,255,255,0.04)'; ctx.fillRect(440,sy,58,2);
  }
  const row1 = [['#E74C3C',11],['#3498DB',9],['#F39C12',13],['#9B59B6',10]];
  let bx = 445;
  row1.forEach(([c,w]) => {
    ctx.fillStyle=c; ctx.fillRect(bx,17,w,33);
    ctx.fillStyle='rgba(255,255,255,0.12)'; ctx.fillRect(bx,17,2,33);
    bx+=w+1;
  });
  bx=445;
  [['#2ECC71',10],['#E67E22',8],['#1ABC9C',12],['#E91E63',9]].forEach(([c,w])=>{
    ctx.fillStyle=c; ctx.fillRect(bx,57,w,47);
    ctx.fillStyle='rgba(255,255,255,0.08)'; ctx.fillRect(bx,57,2,47);
    bx+=w+1;
  });
  bx=445;
  [['#F44336',9],['#673AB7',11],['#009688',10],['#FF9800',8]].forEach(([c,w])=>{
    ctx.fillStyle=c; ctx.fillRect(bx,110,w,46); bx+=w+1;
  });
  bx=445;
  [['#3F51B5',10],['#4CAF50',9],['#FF5722',11]].forEach(([c,w])=>{
    ctx.fillStyle=c; ctx.fillRect(bx,163,w,60); bx+=w+1;
  });

  /* RUG */
  ctx.fillStyle = rg(ctx,188,336,8,120,[[0,'rgba(142,68,173,0.38)'],[0.7,'rgba(142,68,173,0.12)'],[1,'rgba(142,68,173,0)']]);
  ctx.beginPath(); ctx.ellipse(188,336,142,38,0,0,Math.PI*2); ctx.fill();
  ctx.strokeStyle='rgba(142,68,173,0.4)'; ctx.lineWidth=2;
  ctx.beginPath(); ctx.ellipse(188,336,128,30,0,0,Math.PI*2); ctx.stroke();

  /* SOFA */
  ctx.fillStyle='#5D4037';
  [[72,283],[142,283],[225,283],[295,283]].forEach(([lx,ly])=>{ ctx.fillRect(lx,ly,10,14); });
  ctx.fillStyle=lg(ctx,0,208,0,292,[[0,'#7F8C8D'],[1,'#5D6D7E']]);
  rr(ctx,65,208,248,82,14); ctx.fill();
  ctx.fillStyle='rgba(255,255,255,0.06)'; rr(ctx,65,208,248,22,14); ctx.fill();
  ctx.fillStyle=lg(ctx,65,228,65,288,[[0,'#6D7A8A'],[1,'#4F5B6A']]);
  rr(ctx,65,228,28,58,10); ctx.fill();
  rr(ctx,283,228,28,58,10); ctx.fill();
  /* cushions */
  ctx.fillStyle=lg(ctx,0,218,0,258,[[0,'#5DADE2'],[1,'#2E86C1']]);
  rr(ctx,78,218,90,46,8); ctx.fill();
  ctx.fillStyle=lg(ctx,0,218,0,258,[[0,'#E67E22'],[1,'#CA6F1E']]);
  rr(ctx,183,218,90,46,8); ctx.fill();
  ctx.strokeStyle='rgba(255,255,255,0.18)'; ctx.lineWidth=1.5; ctx.setLineDash([4,3]);
  [[78,78+90],[183,183+90]].forEach(([x1,x2])=>{
    ctx.beginPath(); ctx.moveTo(x1+8,241); ctx.lineTo(x2-8,241); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x1+45,220); ctx.lineTo(x1+45,262); ctx.stroke();
  });
  ctx.setLineDash([]);

  /* COFFEE TABLE */
  ctx.fillStyle=lg(ctx,0,288,0,322,[[0,'#8D6E63'],[1,'#6D4C41']]);
  rr(ctx,118,288,148,30,6); ctx.fill();
  ctx.fillStyle='rgba(255,255,255,0.08)'; rr(ctx,122,290,140,8,4); ctx.fill();
  ctx.fillStyle='#5D4037'; [[130,318],[256,318]].forEach(([lx,ly])=>{ ctx.fillRect(lx,ly,8,16); });
  ctx.fillStyle='#E74C3C'; rr(ctx,148,277,18,12,3); ctx.fill();
  ctx.fillStyle='#FDEBD0'; ctx.beginPath(); ctx.ellipse(157,277,8,3,0,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='#3498DB'; ctx.save(); ctx.rotate(-0.08); ctx.fillRect(187,276,46,11); ctx.restore();

  /* LAMP */
  ctx.strokeStyle='#607D8B'; ctx.lineWidth=5; ctx.lineCap='round';
  ctx.beginPath(); ctx.moveTo(356,200); ctx.lineTo(348,338); ctx.stroke();
  ctx.fillStyle='#455A64'; rr(ctx,338,336,26,7,3); ctx.fill();
  /* LAMP SHADE – D3: yellow → pink */
  const lsC1 = alt ? '#F48FB1' : '#FFF9C4';
  const lsC2 = alt ? '#E91E63' : '#FFF176';
  const lsBd = alt ? '#C2185B' : '#D4AC0D';
  ctx.fillStyle=lg(ctx,336,200,382,200,[[0,lsC1],[1,lsC2]]);
  ctx.beginPath(); ctx.moveTo(334,200); ctx.lineTo(380,200); ctx.lineTo(370,176); ctx.lineTo(344,176); ctx.closePath(); ctx.fill();
  ctx.strokeStyle=lsBd; ctx.lineWidth=1.5; ctx.beginPath(); ctx.moveTo(334,200); ctx.lineTo(380,200); ctx.lineTo(370,176); ctx.lineTo(344,176); ctx.closePath(); ctx.stroke();
  ctx.fillStyle=rg(ctx,357,200,0,65,[[0,'rgba(255,240,150,0.2)'],[1,'rgba(255,240,150,0)']]);
  ctx.beginPath(); ctx.arc(357,200,65,0,Math.PI*2); ctx.fill();

  /* PLANT – D4: pot red → green */
  const ptC = alt ? '#27AE60' : '#C0392B';
  const ptD = alt ? '#1E8449' : '#962D22';
  ctx.fillStyle='rgba(0,0,0,0.12)'; ctx.beginPath(); ctx.ellipse(412,344,26,6,0,0,Math.PI*2); ctx.fill();
  ctx.fillStyle=lg(ctx,394,276,434,276,[[0,ptC],[1,ptD]]);
  ctx.beginPath(); ctx.moveTo(397,314); ctx.lineTo(393,278); ctx.lineTo(433,278); ctx.lineTo(429,314); ctx.closePath(); ctx.fill();
  ctx.fillStyle=ptC; rr(ctx,390,273,46,9,3); ctx.fill();
  ctx.fillStyle='#4E342E'; ctx.beginPath(); ctx.ellipse(412,277,19,5,0,0,Math.PI*2); ctx.fill();
  const lv=[[-0.3,0,8,24],[-.8,-14,7,21],[.8,13,7,21],[0,0,6,18]];
  lv.forEach(([a,ox,rx,ry],i)=>{
    ctx.fillStyle = i<3 ? '#27AE60' : '#1E8449';
    ctx.beginPath(); ctx.ellipse(412+ox, i===3?228:250, rx, ry, a, 0, Math.PI*2); ctx.fill();
  });
}

/* ══════════════════════════════════════════════════════════
   LEVEL 2 : 해변 (Beach)                        500 × 380
   Differences when alt=true:
     D0 (420,  55) r=50  sun: normal → bigger
     D1 ( 88,  90) r=55  palm leaves: 3 → 4
     D2 (385, 285) r=35  beach ball: red/white → blue/yellow
     D3 (275,  78) r=32  seagulls: 2 → 3
     D4 (172, 210) r=50  umbrella: red → green
     D5 (300, 342) r=65  wave colour: white → gold
══════════════════════════════════════════════════════════ */
function drawBeach(ctx, alt) {
  /* sky */
  ctx.fillStyle = lg(ctx,0,0,0,CH*0.56,[[0,'#87CEEB'],[0.5,'#B0E0E6'],[1,'#C5E8F0']]);
  ctx.fillRect(0,0,CW,CH);

  /* ocean */
  ctx.fillStyle = lg(ctx,0,CH*0.56,0,CH,[[0,'#1565C0'],[0.4,'#1976D2'],[1,'#0D47A1']]);
  ctx.fillRect(0,CH*0.56,CW,CH);
  ctx.strokeStyle='rgba(255,255,255,0.12)'; ctx.lineWidth=1;
  for(let wy=CH*0.62;wy<CH;wy+=17){
    ctx.beginPath(); ctx.moveTo(0,wy); ctx.bezierCurveTo(CW/4,wy-3,CW*3/4,wy+3,CW,wy); ctx.stroke();
  }

  /* sand */
  ctx.fillStyle=lg(ctx,0,CH*0.52,0,CH*0.7,[[0,'#F5DEB3'],[1,'#DEB887']]);
  ctx.beginPath();
  ctx.moveTo(0,CH*0.57); ctx.bezierCurveTo(CW*0.3,CH*0.54,CW*0.7,CH*0.59,CW,CH*0.55);
  ctx.lineTo(CW,CH); ctx.lineTo(0,CH); ctx.closePath(); ctx.fill();

  /* WAVES – D5 */
  const wc1 = 'rgba(255,255,255,0.8)';
  const wc2 = 'rgba(255,255,255,0.5)';
  ctx.strokeStyle=wc1; ctx.lineWidth=2.5; ctx.lineCap='round';
  ctx.beginPath(); ctx.moveTo(0,CH*0.60); ctx.bezierCurveTo(100,CH*0.58,260,CH*0.615,420,CH*0.59); ctx.bezierCurveTo(450,CH*0.583,470,CH*0.60,CW,CH*0.60); ctx.stroke();
  ctx.strokeStyle=wc2; ctx.lineWidth=1.5;
  ctx.beginPath(); ctx.moveTo(0,CH*0.635); ctx.bezierCurveTo(150,CH*0.615,300,CH*0.645,CW,CH*0.625); ctx.stroke();

  /* SUN – D0: normal r=32 → bigger r=44 */
  const sunR = alt ? 44 : 32;
  ctx.fillStyle=rg(ctx,420,55,sunR*0.5,sunR*2.4,[[0,'rgba(255,235,100,0.45)'],[1,'rgba(255,235,100,0)']]);
  ctx.beginPath(); ctx.arc(420,55,sunR*2.4,0,Math.PI*2); ctx.fill();
  ctx.fillStyle=lg(ctx,420-sunR,55,420+sunR,55,[[0,'#FFD700'],[1,'#FFA500']]);
  ctx.beginPath(); ctx.arc(420,55,sunR,0,Math.PI*2); ctx.fill();
  ctx.strokeStyle='#FFD700'; ctx.lineWidth=2.5;
  for(let a=0;a<Math.PI*2;a+=Math.PI/6){
    const x1=420+(sunR+5)*Math.cos(a),y1=55+(sunR+5)*Math.sin(a);
    const x2=420+(sunR+15)*Math.cos(a),y2=55+(sunR+15)*Math.sin(a);
    ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
  }

  /* CLOUDS */
  function cloud(cx,cy,s){
    ctx.fillStyle='rgba(255,255,255,0.92)';
    [[0,0,22],[20,5,18],[-18,5,16],[38,8,14],[-36,8,13]].forEach(([dx,dy,r])=>{
      ctx.beginPath(); ctx.arc(cx+dx*s,cy+dy*s,r*s,0,Math.PI*2); ctx.fill();
    });
  }
  cloud(180,55,1); cloud(310,35,0.8); cloud(78,38,0.7);

  /* SEAGULLS – D3: 2 → 3 */
  function bird(bx,by,s=1){
    ctx.strokeStyle='#444'; ctx.lineWidth=1.5; ctx.lineCap='round';
    ctx.beginPath();
    ctx.moveTo(bx-8*s,by); ctx.bezierCurveTo(bx-4*s,by-5*s,bx,by,bx+4*s,by-5*s);
    ctx.bezierCurveTo(bx+8*s,by,bx+12*s,by,bx+12*s,by); ctx.stroke();
  }
  bird(228,82); bird(258,68);

  /* PALM TREE – D1: 3 leaves → 4 */
  const trunkY = CH*0.57;
  ctx.strokeStyle='#8B6914'; ctx.lineWidth=13; ctx.lineCap='round';
  ctx.beginPath(); ctx.moveTo(88,trunkY); ctx.bezierCurveTo(80,trunkY-80,88,trunkY-140,95,trunkY-200); ctx.stroke();
  ctx.strokeStyle='#A0782A'; ctx.lineWidth=9;
  ctx.beginPath(); ctx.moveTo(89,trunkY-40); ctx.bezierCurveTo(82,trunkY-120,89,trunkY-160,95,trunkY-200); ctx.stroke();
  ctx.fillStyle='#8B6914';
  [[95,trunkY-200+5],[88,trunkY-200+10],[102,trunkY-200+8]].forEach(([px,py])=>{
    ctx.beginPath(); ctx.arc(px,py,4,0,Math.PI*2); ctx.fill();
  });
  const leaves=[{a:-2.2,l:65},{a:-1.0,l:72},{a:0.3,l:66}];
  if(alt) leaves.push({a:2.1,l:58});
  const apex={x:95,y:trunkY-200};
  leaves.forEach(({a,l})=>{
    const ex=apex.x+l*Math.cos(a), ey=apex.y+l*Math.sin(a);
    ctx.strokeStyle='#5A7A1A'; ctx.lineWidth=3;
    ctx.beginPath(); ctx.moveTo(apex.x,apex.y);
    ctx.bezierCurveTo(apex.x+(ex-apex.x)*0.3,apex.y+(ey-apex.y)*0.3-14,ex-8*Math.cos(a+0.5),ey-8*Math.sin(a+0.5),ex,ey);
    ctx.stroke();
    ctx.fillStyle='#4CAF50';
    const mx=(apex.x+ex)/2+18*Math.cos(a-Math.PI/2);
    const my=(apex.y+ey)/2+18*Math.sin(a-Math.PI/2);
    ctx.beginPath(); ctx.moveTo(apex.x,apex.y);
    ctx.bezierCurveTo(mx,my,ex+12*Math.cos(a+0.5),ey+12*Math.sin(a+0.5),ex,ey);
    ctx.bezierCurveTo(ex-6*Math.cos(a-0.5),ey-6*Math.sin(a-0.5),(apex.x+ex)/2+3*Math.cos(a+Math.PI/2),(apex.y+ey)/2+3*Math.sin(a+Math.PI/2),apex.x,apex.y);
    ctx.closePath(); ctx.fill();
  });

  /* BEACH UMBRELLA – D4: red → green */
  const uc1=alt?'#388E3C':'#D32F2F', uc2=alt?'#2E7D32':'#B71C1C';
  ctx.strokeStyle='#8D6E63'; ctx.lineWidth=4;
  ctx.beginPath(); ctx.moveTo(172,200); ctx.lineTo(168,322); ctx.stroke();
  for(let s=0;s<8;s++){
    const a1=-Math.PI+s*Math.PI/4, a2=a1+Math.PI/4;
    ctx.fillStyle=s%2===0?uc1:'#FFFFFF';
    ctx.beginPath(); ctx.moveTo(172,200); ctx.arc(172,200,56,a1,a2); ctx.closePath(); ctx.fill();
  }
  ctx.fillStyle=uc2; ctx.beginPath(); ctx.arc(172,200,6,0,Math.PI*2); ctx.fill();
  ctx.strokeStyle='rgba(0,0,0,0.18)'; ctx.lineWidth=1.2;
  for(let s=0;s<8;s++){
    const a=-Math.PI+s*Math.PI/4;
    ctx.beginPath(); ctx.moveTo(172,200); ctx.lineTo(172+56*Math.cos(a),200+56*Math.sin(a)); ctx.stroke();
  }
  /* TOWEL – D3: orange → blue */
  const towelC = alt ? '#5C6BC0' : '#FF7043';
  ctx.fillStyle=towelC; ctx.save(); ctx.rotate(-0.05); ctx.fillRect(128,268,70,38); ctx.restore();

  /* BEACH BALL – D2: red/white → blue/yellow */
  const bc1=alt?'#1565C0':'#D32F2F', bc2=alt?'#F9A825':'#FFFFFF';
  const [bCx,bCy,bR]=[385,285,24];
  ctx.fillStyle='rgba(0,0,0,0.14)'; ctx.beginPath(); ctx.ellipse(bCx,bCy+bR-3,bR*0.7,bR*0.2,0,0,Math.PI*2); ctx.fill();
  for(let s=0;s<6;s++){
    ctx.fillStyle=s%2===0?bc1:bc2;
    ctx.beginPath(); ctx.moveTo(bCx,bCy); ctx.arc(bCx,bCy,bR,s*Math.PI/3-Math.PI/6,(s+1)*Math.PI/3-Math.PI/6); ctx.closePath(); ctx.fill();
  }
  ctx.strokeStyle='rgba(255,255,255,0.38)'; ctx.lineWidth=1; ctx.beginPath(); ctx.arc(bCx,bCy,bR,0,Math.PI*2); ctx.stroke();
  ctx.fillStyle='rgba(255,255,255,0.35)'; ctx.beginPath(); ctx.arc(bCx-7,bCy-8,7,0,Math.PI*2); ctx.fill();

  /* footprints */
  ctx.fillStyle='rgba(160,100,50,0.22)';
  [[300,312],[322,325],[344,315],[365,328],[386,318]].forEach(([fx,fy])=>{
    ctx.beginPath(); ctx.ellipse(fx,fy,5,9,0.3,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(fx+14,fy+5,5,9,-0.3,0,Math.PI*2); ctx.fill();
  });

  /* BUCKET – D5: yellow → red */
  const bkC1 = alt ? '#F44336' : '#FDD835';
  const bkC2 = alt ? '#B71C1C' : '#F57F17';
  const bkRim = alt ? '#EF9A9A' : '#FFF59D';
  const bkHdl = alt ? '#E57373' : '#FFEE58';
  ctx.fillStyle=lg(ctx,470,302,470,338,[[0,bkC1],[1,bkC2]]);
  ctx.beginPath();
  ctx.moveTo(453,302); ctx.lineTo(487,302); ctx.lineTo(480,338); ctx.lineTo(460,338); ctx.closePath(); ctx.fill();
  ctx.fillStyle=bkRim; ctx.fillRect(452,297,36,8);
  ctx.strokeStyle='rgba(0,0,0,0.2)'; ctx.lineWidth=1.5;
  ctx.beginPath();
  ctx.moveTo(453,302); ctx.lineTo(487,302); ctx.lineTo(480,338); ctx.lineTo(460,338); ctx.closePath(); ctx.stroke();
  ctx.strokeStyle=bkHdl; ctx.lineWidth=2.5;
  ctx.beginPath(); ctx.arc(470,299,13,Math.PI,0); ctx.stroke();
  ctx.fillStyle='#DEB887'; ctx.beginPath(); ctx.ellipse(470,302,16,5,0,0,Math.PI); ctx.fill();
}

/* ══════════════════════════════════════════════════════════
   LEVEL 3 : 우주 (Space)                        500 × 380
   Differences when alt=true:
     D0 (415,  90) r=55  planet colour: orange → blue
     D1 (128, 275) r=34  rocket flame: yellow → red
     D2 (220, 135) r=45  star cluster: 4 → 7 stars
     D3 ( 68,  55) r=44  moon: full → crescent
     D4 (295, 215) r=30  astronaut visor: gold → silver
     D5 (415, 110) r=62  planet ring: present → absent
     D6 (358,  48) r=32  meteor: big → small
══════════════════════════════════════════════════════════ */
function drawSpace(ctx, alt) {
  /* background */
  ctx.fillStyle=lg(ctx,0,0,CW,CH,[[0,'#010020'],[0.5,'#0D0030'],[1,'#050015']]);
  ctx.fillRect(0,0,CW,CH);

  /* stars (seeded pseudo-random) */
  let seed=42;
  const sr=()=>{ seed=(seed*9301+49297)%233280; return seed/233280; };
  for(let i=0;i<165;i++){
    const sx=sr()*CW, sy=sr()*CH, srad=sr()*1.8+0.3;
    ctx.fillStyle=`rgba(255,255,255,${0.35+sr()*0.65})`;
    ctx.beginPath(); ctx.arc(sx,sy,srad,0,Math.PI*2); ctx.fill();
  }

  /* nebula */
  ctx.fillStyle=rg(ctx,295,145,0,200,[[0,'rgba(80,0,120,0.3)'],[0.5,'rgba(40,0,80,0.12)'],[1,'rgba(0,0,0,0)']]);
  ctx.beginPath(); ctx.arc(295,145,200,0,Math.PI*2); ctx.fill();
  ctx.fillStyle=rg(ctx,120,250,0,140,[[0,'rgba(0,60,100,0.22)'],[1,'rgba(0,0,0,0)']]);
  ctx.beginPath(); ctx.arc(120,250,140,0,Math.PI*2); ctx.fill();

  /* MOON – D3: full → crescent */
  const mCx=68, mCy=55;
  ctx.fillStyle=lg(ctx,mCx-35,mCy-35,mCx+35,mCy+35,[[0,'#FFFDE7'],[1,'#FFF9C4']]);
  ctx.beginPath(); ctx.arc(mCx,mCy,35,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='rgba(200,190,100,0.4)';
  [[55,45,5],[72,68,4],[88,50,3]].forEach(([cx,cy,cr])=>{
    ctx.beginPath(); ctx.arc(cx,cy,cr,0,Math.PI*2); ctx.fill();
  });
  if(alt){
    /* cut crescent by painting space-coloured circle over part of moon */
    ctx.fillStyle='#010020';
    ctx.beginPath(); ctx.arc(mCx+22,mCy-8,30,0,Math.PI*2); ctx.fill();
  }
  ctx.fillStyle=rg(ctx,mCx,mCy,35,70,[[0,'rgba(255,255,200,0.2)'],[1,'rgba(255,255,200,0)']]);
  ctx.beginPath(); ctx.arc(mCx,mCy,70,0,Math.PI*2); ctx.fill();

  /* STAR CLUSTER – D2: 4 stars → 7 stars */
  const base=[[0,0,4],[20,-15,3],[-18,10,3.5],[15,20,2.5]];
  const extra=[[...base],[-26,-18,2],[30,5,2.5],[8,-28,2]];
  (alt ? extra : base).forEach(([dx,dy,sr2])=>{
    ctx.fillStyle=rg(ctx,220+dx,135+dy,0,sr2*3,[[0,'rgba(200,230,255,0.9)'],[1,'rgba(100,150,255,0)']]);
    ctx.beginPath(); ctx.arc(220+dx,135+dy,sr2*3,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#FFFFFF'; ctx.beginPath(); ctx.arc(220+dx,135+dy,sr2,0,Math.PI*2); ctx.fill();
  });

  /* METEOR – D6: big (r=14) → small (r=8) */
  const mR=alt?8:14, mTail=alt?52:88;
  const mtg=lg(ctx,358+mTail,48-mTail*0.5,358,48,[[0,'rgba(255,160,50,0)'],[1,'rgba(255,180,80,0.72)']]);
  ctx.strokeStyle=mtg; ctx.lineWidth=mR*1.3; ctx.lineCap='round';
  ctx.beginPath(); ctx.moveTo(358+mTail,48-mTail*0.5); ctx.lineTo(358,48); ctx.stroke();
  ctx.fillStyle=lg(ctx,358-mR,48-mR,358+mR,48+mR,[[0,'#FFCC80'],[1,'#FF6D00']]);
  ctx.beginPath(); ctx.arc(358,48,mR,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='rgba(255,255,200,0.55)'; ctx.beginPath(); ctx.arc(354,44,mR*0.38,0,Math.PI*2); ctx.fill();

  /* LARGE PLANET – D0: orange → blue */
  const pCx=415, pCy=90, pR=65;
  const pc1=alt?'#1565C0':'#E65100', pc2=alt?'#0D47A1':'#BF360C', pc3=alt?'#1976D2':'#FF6D00';
  ctx.fillStyle=rg(ctx,pCx,pCy,pR*0.8,pR*1.8,[[0,alt?'rgba(21,101,192,0.3)':'rgba(230,81,0,0.3)'],[1,'rgba(0,0,0,0)']]);
  ctx.beginPath(); ctx.arc(pCx,pCy,pR*1.8,0,Math.PI*2); ctx.fill();
  ctx.fillStyle=lg(ctx,pCx-pR,pCy-pR,pCx+pR,pCy+pR,[[0,pc3],[0.5,pc1],[1,pc2]]);
  ctx.beginPath(); ctx.arc(pCx,pCy,pR,0,Math.PI*2); ctx.fill();
  ctx.fillStyle=alt?'rgba(100,180,255,0.28)':'rgba(255,200,100,0.22)';
  [-22,0,24].forEach(dy=>{ ctx.beginPath(); ctx.ellipse(pCx,pCy+dy,pR*0.94,9,0,0,Math.PI*2); ctx.fill(); });
  ctx.fillStyle='rgba(255,255,255,0.14)'; ctx.beginPath(); ctx.ellipse(pCx-20,pCy-24,pR*0.48,pR*0.28,-0.5,0,Math.PI*2); ctx.fill();

  /* PLANET RING – D5: present → absent */
  if(!alt){
    ctx.save(); ctx.translate(pCx,pCy+18); ctx.rotate(-0.24); ctx.scale(1,0.3);
    const rg2=ctx.createLinearGradient(-pR*2,0,pR*2,0);
    rg2.addColorStop(0,'rgba(180,140,80,0)'); rg2.addColorStop(0.18,'rgba(220,180,100,0.72)');
    rg2.addColorStop(0.5,'rgba(200,160,80,0.35)'); rg2.addColorStop(0.82,'rgba(220,180,100,0.72)');
    rg2.addColorStop(1,'rgba(180,140,80,0)');
    ctx.strokeStyle=rg2; ctx.lineWidth=18;
    ctx.beginPath(); ctx.arc(0,0,pR*1.5,0,Math.PI*2); ctx.stroke();
    ctx.strokeStyle='rgba(255,220,130,0.35)'; ctx.lineWidth=6;
    ctx.beginPath(); ctx.arc(0,0,pR*1.72,0,Math.PI*2); ctx.stroke();
    ctx.restore();
    /* redraw planet centre to mask ring going behind */
    ctx.fillStyle=lg(ctx,pCx-pR,pCy-pR,pCx+pR,pCy+pR,[[0,pc3],[0.5,pc1],[1,pc2]]);
    ctx.beginPath(); ctx.arc(pCx,pCy,pR,0,Math.PI*2); ctx.fill();
    ctx.fillStyle=alt?'rgba(100,180,255,0.28)':'rgba(255,200,100,0.22)';
    [-22,0,24].forEach(dy=>{ ctx.beginPath(); ctx.ellipse(pCx,pCy+dy,pR*0.94,9,0,0,Math.PI*2); ctx.fill(); });
    ctx.fillStyle='rgba(255,255,255,0.14)'; ctx.beginPath(); ctx.ellipse(pCx-20,pCy-24,pR*0.48,pR*0.28,-0.5,0,Math.PI*2); ctx.fill();
  }

  /* ROCKET */
  const rCx=128, rCy=200;
  ctx.fillStyle=lg(ctx,rCx-15,rCy,rCx+15,rCy,[[0,'#ECEFF1'],[0.5,'#B0BEC5'],[1,'#78909C']]);
  rr(ctx,rCx-15,rCy,30,65,8); ctx.fill();
  /* nose */
  ctx.fillStyle=lg(ctx,rCx,rCy-40,rCx,rCy,[[0,'#EF5350'],[1,'#B71C1C']]);
  ctx.beginPath(); ctx.moveTo(rCx,rCy-40);
  ctx.bezierCurveTo(rCx+15,rCy-15,rCx+15,rCy,rCx+15,rCy);
  ctx.lineTo(rCx-15,rCy); ctx.bezierCurveTo(rCx-15,rCy,rCx-15,rCy-15,rCx,rCy-40);
  ctx.fill();
  /* window */
  ctx.fillStyle=lg(ctx,rCx-10,rCy+10,rCx+10,rCy+32,[[0,'#80D8FF'],[1,'#29B6F6']]);
  ctx.beginPath(); ctx.arc(rCx,rCy+22,11,0,Math.PI*2); ctx.fill();
  ctx.strokeStyle='#78909C'; ctx.lineWidth=2; ctx.beginPath(); ctx.arc(rCx,rCy+22,11,0,Math.PI*2); ctx.stroke();
  ctx.fillStyle='rgba(255,255,255,0.38)'; ctx.beginPath(); ctx.arc(rCx-4,rCy+16,4,0,Math.PI*2); ctx.fill();
  /* fins */
  ctx.fillStyle='#EF5350';
  ctx.beginPath(); ctx.moveTo(rCx-15,rCy+56); ctx.lineTo(rCx-30,rCy+80); ctx.lineTo(rCx-15,rCy+66); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(rCx+15,rCy+56); ctx.lineTo(rCx+30,rCy+80); ctx.lineTo(rCx+15,rCy+66); ctx.closePath(); ctx.fill();

  /* FLAME – D1: yellow → red */
  const fc1=alt?'#E53935':'#FFCC02', fc2=alt?'#880E4F':'#FF6D00', fc3=alt?'#FF6B6B':'#FFEA00';
  ctx.fillStyle=rg(ctx,rCx,rCy+100,5,32,[[0,fc1],[0.5,fc2],[1,'rgba(0,0,0,0)']]);
  ctx.beginPath(); ctx.moveTo(rCx-14,rCy+65);
  ctx.bezierCurveTo(rCx-22,rCy+90,rCx-8,rCy+115,rCx,rCy+122);
  ctx.bezierCurveTo(rCx+8,rCy+115,rCx+22,rCy+90,rCx+14,rCy+65); ctx.closePath(); ctx.fill();
  ctx.fillStyle=rg(ctx,rCx,rCy+85,2,16,[[0,fc3],[0.6,fc1],[1,'rgba(0,0,0,0)']]);
  ctx.beginPath(); ctx.moveTo(rCx-8,rCy+65);
  ctx.bezierCurveTo(rCx-10,rCy+82,rCx-5,rCy+100,rCx,rCy+108);
  ctx.bezierCurveTo(rCx+5,rCy+100,rCx+10,rCy+82,rCx+8,rCy+65); ctx.closePath(); ctx.fill();

  /* ASTRONAUT */
  const aCx=295, aCy=215;
  /* tether */
  ctx.strokeStyle='rgba(255,255,255,0.35)'; ctx.lineWidth=1.5; ctx.setLineDash([4,3]);
  ctx.beginPath(); ctx.moveTo(aCx,aCy+20);
  ctx.bezierCurveTo(aCx-40,aCy+50,rCx+30,rCy+28,rCx+15,rCy+28); ctx.stroke();
  ctx.setLineDash([]);
  /* body */
  ctx.fillStyle='#ECEFF1'; rr(ctx,aCx-20,aCy-4,40,46,12); ctx.fill();
  ctx.strokeStyle='#B0BEC5'; ctx.lineWidth=1.5; rr(ctx,aCx-20,aCy-4,40,46,12); ctx.stroke();
  ctx.fillStyle='#90CAF9';
  [[aCx-8,aCy+10],[aCx+2,aCy+10],[aCx-3,aCy+22]].forEach(([bx2,by2])=>{
    ctx.beginPath(); ctx.arc(bx2,by2,4,0,Math.PI*2); ctx.fill();
  });
  /* arms */
  ctx.fillStyle='#ECEFF1'; ctx.strokeStyle='#B0BEC5'; ctx.lineWidth=1.5;
  rr(ctx,aCx-36,aCy+5,17,30,8); ctx.fill(); ctx.stroke();
  rr(ctx,aCx+19,aCy,17,30,8);   ctx.fill(); ctx.stroke();
  ctx.fillStyle='#90CAF9';
  ctx.beginPath(); ctx.arc(aCx-27,aCy+35,8,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(aCx+27,aCy+30,8,0,Math.PI*2); ctx.fill();
  /* legs */
  ctx.fillStyle='#ECEFF1';
  rr(ctx,aCx-17,aCy+40,14,25,6); ctx.fill();
  rr(ctx,aCx+3,  aCy+40,14,25,6); ctx.fill();
  ctx.fillStyle='#B0BEC5';
  ctx.fillRect(aCx-17,aCy+58,14,7); ctx.fillRect(aCx+3,aCy+58,14,7);
  /* helmet */
  ctx.fillStyle='#F5F5F5'; ctx.beginPath(); ctx.arc(aCx,aCy-18,22,0,Math.PI*2); ctx.fill();
  ctx.strokeStyle='#B0BEC5'; ctx.lineWidth=2; ctx.beginPath(); ctx.arc(aCx,aCy-18,22,0,Math.PI*2); ctx.stroke();
  /* VISOR – D4: gold → silver */
  const vc=alt ? lg(ctx,aCx-14,aCy-26,aCx+14,aCy-10,[[0,'#CFD8DC'],[1,'#90A4AE']])
               : lg(ctx,aCx-14,aCy-26,aCx+14,aCy-10,[[0,'#FFD740'],[1,'#FF8F00']]);
  ctx.fillStyle=vc; ctx.beginPath(); ctx.ellipse(aCx,aCy-18,14,11,0,0,Math.PI*2); ctx.fill();
  ctx.strokeStyle=alt?'#607D8B':'#E65100'; ctx.lineWidth=1.5;
  ctx.beginPath(); ctx.ellipse(aCx,aCy-18,14,11,0,0,Math.PI*2); ctx.stroke();
  ctx.fillStyle='rgba(255,255,255,0.35)'; ctx.beginPath(); ctx.ellipse(aCx-4,aCy-22,5,4,-0.4,0,Math.PI*2); ctx.fill();

  /* small distant planet (decoration) */
  ctx.fillStyle=lg(ctx,50,162,80,200,[[0,'#CE93D8'],[1,'#9C27B0']]);
  ctx.beginPath(); ctx.arc(60,182,18,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='rgba(255,255,255,0.1)'; ctx.beginPath(); ctx.ellipse(54,176,8,6,-0.4,0,Math.PI*2); ctx.fill();

  /* asteroid belt (decoration) */
  ctx.fillStyle='#8D6E63';
  [[195,315,6],[218,328,4],[244,312,7],[267,325,5],[290,314,4]].forEach(([ax,ay,ar])=>{
    ctx.beginPath(); ctx.arc(ax,ay,ar,0,Math.PI*2); ctx.fill();
  });
}
