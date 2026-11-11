import { mkdir, writeFile } from 'node:fs/promises';
import { deflateSync } from 'node:zlib';

const W=3072,H=2048,T=32;
const pxbuf=Buffer.alloc(W*H*4);
const C={grass:'#668751',grass2:'#75975a',grass3:'#557548',grass4:'#88a561',soil:'#91734d',path:'#c6b88e',path2:'#d9cba1',path3:'#ad9d78',stone:'#8f8c7a',wall:'#ebd8ac',wall2:'#d3bb8e',ink:'#342d35',roof:'#8c4f47',roof2:'#ad6556',roof3:'#c17a61',blue:'#4e7f88',blue2:'#83b3ad',wood:'#805641',wood2:'#a9744b',leaf:'#4b713f',leaf2:'#698a4c',leaf3:'#83a25a',gold:'#e0bb6d'};
function rgba(hex){return [parseInt(hex.slice(1,3),16),parseInt(hex.slice(3,5),16),parseInt(hex.slice(5,7),16),255];}
function rect(x,y,w,h,color){const c=rgba(color),x0=Math.max(0,x|0),y0=Math.max(0,y|0),x1=Math.min(W,(x+w)|0),y1=Math.min(H,(y+h)|0);for(let yy=y0;yy<y1;yy++){let i=(yy*W+x0)*4;for(let xx=x0;xx<x1;xx++,i+=4)pxbuf.set(c,i);}}
function pixel(x,y,color){rect(x,y,1,1,color);}
function seed(n){let x=(n+0x9e3779b9)|0;x=Math.imul(x^(x>>>16),0x21f0aaad);x=Math.imul(x^(x>>>15),0x735a2d97);return (x^(x>>>15))>>>0;}
function tile(x,y,color,hi,dark){const ox=x*T,oy=y*T;rect(ox,oy,T,T,color);for(let i=0;i<6;i++){const r=seed(x*131+y*977+i*71),a=ox+(r%29),b=oy+((r>>>8)%29);rect(a,b,1+(r%3),1+((r>>>4)%2),i%3===0?hi:dark);}}
// Grassland base with pixel-grain variation, small clover patches and shade bands.
for(let ty=0;ty<H/T;ty++)for(let tx=0;tx<W/T;tx++){
 const r=seed(tx*7837+ty*1973),base=r%23===0?C.grass2:r%37===0?C.grass3:C.grass;
 tile(tx,ty,base,C.grass4,C.grass3);
 if(r%7===0){const x=tx*T+((r>>>7)%26),y=ty*T+((r>>>15)%26);rect(x,y,2,2,C.grass2);}
}
// Paved plazas and winding roads; all paths are continuous tile-painted surfaces.
const segments=[
 [[1470,1020],[1390,850],[1210,770],[1000,700],[800,730]],
 [[1580,985],[1790,910],[2000,960],[2210,1080],[2400,1120]],
 [[1550,1110],[1640,1300],[1530,1470],[1330,1590],[1080,1670]],
 [[1600,930],[1780,730],[2020,620],[2320,530]]
];
function distSegment(px,py,a,b){const vx=b[0]-a[0],vy=b[1]-a[1],t=Math.max(0,Math.min(1,((px-a[0])*vx+(py-a[1])*vy)/(vx*vx+vy*vy)));return Math.hypot(px-(a[0]+t*vx),py-(a[1]+t*vy));}
const roadMask=new Uint8Array((W/T)*(H/T));
for(let ty=0;ty<H/T;ty++)for(let tx=0;tx<W/T;tx++){const x=tx*T+16,y=ty*T+16;let d=1e9;for(const s of segments){for(let i=0;i<s.length-1;i++)d=Math.min(d,distSegment(x,y,s[i],s[i+1]));}if(d<70)roadMask[ty*(W/T)+tx]=d<46?2:1;}
function pavedRect(x,y,w,h){for(let yy=y;yy<y+h;yy+=T)for(let xx=x;xx<x+w;xx+=T){const n=seed(xx*3+yy*19),base=n%6===0?C.path3:C.path;tile(xx/T|0,yy/T|0,base,C.path2,C.path3);rect(xx,yy,32,1,'#a99a79');rect(xx,yy+16,32,1,'#b8aa89');if(n%2)rect(xx+15,yy,1,16,'#aa9b7b');else rect(xx+7,yy+16,1,16,'#aa9b7b');}}
for(let ty=0;ty<H/T;ty++)for(let tx=0;tx<W/T;tx++){const m=roadMask[ty*(W/T)+tx];if(!m)continue;const x=tx*T,y=ty*T;tile(tx,ty,m===2?C.path:C.path3,C.path2,C.path3);if(m===2){rect(x,y+15,32,1,'#b3a47f');rect(x+15,y,1,16,'#b3a47f');}}
pavedRect(1130,740,770,540);
// Courtyards, flower beds, little fenced plots.
for(const [x,y,w,h] of [[315,275,760,570],[2030,435,850,1140],[320,1330,970,590]]){
 for(let xx=x;xx<x+w;xx+=16){rect(xx,y,9,8,C.leaf2);rect(xx,y+h-8,9,8,C.leaf2);}
 for(let yy=y;yy<y+h;yy+=16){rect(x,yy,8,9,C.leaf2);rect(x+w-8,yy,8,9,C.leaf2);}
}
// School building: tiled red roof, blue skylights, cream walls and broad entrance steps.
function building(x,y,w,h,theme='school'){
 const roof=theme==='school'?['#8a4d47','#a65d50','#c0795d']:theme==='home'?['#497378','#588c87','#81aa92']:['#a16b48','#bd8252','#d3a06a'];
 rect(x+10,y+17,w,h,'#45404a');rect(x+6,y+10,w,h,'#6f5545');
 rect(x+14,y+10,w-28,h-23,C.wall);rect(x+21,y+17,w-42,h-39,'#f0e4c4');
 rect(x,y,w,14,C.ink);rect(x+4,y+4,w-8,Math.max(48,h*.52),roof[0]);
 const roofH=Math.max(48,Math.floor(h*.52));
 for(let yy=y+8;yy<y+roofH;yy+=18){rect(x+8,yy,w-16,2,roof[1]);for(let xx=x+12+(yy%36?0:18);xx<x+w-12;xx+=32){rect(xx,yy+3,2,13,roof[2]);rect(xx+2,yy+4,12,11,roof[1]);}}
 rect(x+w*.48,y+roofH-4,w*.08,roofH+25,C.ink);rect(x+w*.49,y+roofH,w*.06,roofH+12,theme==='school'?'#735443':'#724a40');
 for(let xx=x+40;xx<x+w-40;xx+=theme==='school'?105:92){rect(xx,y+roofH+18,44,42,C.ink);rect(xx+4,y+roofH+22,36,34,C.blue);rect(xx+20,y+roofH+22,3,34,C.path2);rect(xx+4,y+roofH+38,36,3,C.path2);}
 rect(x+w*.44,y+h-20,w*.12,25,C.ink);rect(x+w*.46,y+h-17,w*.08,22,C.wood);rect(x+w*.48,y+h-14,4,3,C.gold);
 rect(x+w*.35,y+h+7,w*.30,8,C.path3);rect(x+w*.39,y+h+16,w*.22,7,C.path2);
}
building(440,330,570,345,'school');
building(2240,870,430,330,'home');
building(2320,485,300,245,'neighbor');
building(2635,1245,275,235,'neighbor2');
building(2015,1190,240,205,'neighbor');
// School walk and civic plaza details drawn into the background pixel art.
rect(1410,990,28,112,C.path3);rect(1436,990,8,112,C.path2);
// Fountain basin with concentric stone rings, water, and a bright central jet.
for(const [x,y,r,c] of [[1510,1010,86,C.ink],[1510,1010,78,'#858574'],[1510,1010,66,'#c5b999'],[1510,1010,55,'#4c8190'],[1510,1010,40,'#75b2b2'],[1510,1010,17,'#d8e0ba']]){
 for(let yy=-r;yy<=r;yy++)for(let xx=-r;xx<=r;xx++)if(xx*xx+yy*yy<=r*r)pixel(x+xx,y+yy,c);
}
rect(1504,986,12,40,'#d7d9c4');rect(1499,998,22,8,'#ecdcaa');
// Gardens, hedges, flower beds and shade trees painted as clustered pixel patches.
for(let i=0;i<86;i++){
 const r=seed(i*913+11),x=130+(r%2800),y=120+((r>>>8)%1800);
 const nearBuilding=(x>390&&x<1040&&y>290&&y<760)||(x>2160&&x<2720&&y>820&&y<1260)||(x>2290&&x<2650&&y>430&&y<760)||(x>2600&&y>1200&&y<1510);
 const nearPlaza=x>1120&&x<1910&&y>730&&y<1290;
 if(nearBuilding||nearPlaza)continue;
 const w=38+(r%26),h=18+((r>>>12)%15);
 rect(x+5,y+9,w,h,C.leaf);rect(x,y+6,w,h,C.leaf2);rect(x+4,y,w-9,7,C.grass4);
 for(let j=0;j<4;j++){const fx=x+((r>>>(j+2))%Math.max(1,w-3));rect(fx,y+4+(j%2)*8,3,3,j%2?'#e8cf83':'#d58b77');}
}
// Small tilled plots and rows of flowers make the park and neighborhood readable at a glance.
for(const [x,y] of [[360,1400],[680,1450],[2430,1420],[2500,790],[1810,1290]]){
 rect(x,y,130,76,'#725b43');rect(x+5,y+5,120,66,'#8b704b');
 for(let i=0;i<7;i++){rect(x+10+i*16,y+14,4,45,i%2?'#688c49':'#7a994d');pixel(x+12+i*16,y+9,i%2?'#e5c779':'#d98571');}
}

// PNG encoder for the map texture.
const crcTable=(()=>{const t=new Uint32Array(256);for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xedb88320^(c>>>1):c>>>1;t[n]=c>>>0;}return t;})();
function crc(b){let c=0xffffffff;for(const v of b)c=crcTable[(c^v)&255]^(c>>>8);return(c^0xffffffff)>>>0;}
function chunk(name,data){const type=Buffer.from(name),out=Buffer.alloc(data.length+12);out.writeUInt32BE(data.length,0);type.copy(out,4);data.copy(out,8);out.writeUInt32BE(crc(Buffer.concat([type,data])),data.length+8);return out;}
function png(width,height,pixels){const ih=Buffer.alloc(13);ih.writeUInt32BE(width,0);ih.writeUInt32BE(height,4);ih[8]=8;ih[9]=6;const rows=Buffer.alloc((width*4+1)*height);for(let y=0;y<height;y++)pixels.copy(rows,y*(width*4+1)+1,y*width*4,(y+1)*width*4);return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',ih),chunk('IDAT',deflateSync(rows,{level:7})),chunk('IEND',Buffer.alloc(0))]);}

// Transparent 8x3 sprite sheet (96x96 cells) for trees, public-space props and signs.
const props=[
`<g><ellipse cx="48" cy="86" rx="29" ry="7" fill="#273a39" opacity=".55"/><path d="M43 82h13V47H43z" fill="#6d4939"/><path d="M24 57h12V43h12V26h17v14h13v19h9v21H20V62h4z" fill="#304139"/><path d="M28 51h15V35h14V20h12v14h13v18h7v20H22V57h6z" fill="#547a45"/><path d="M35 43h11V28h16v13h12v14H30V46h5z" fill="#779955"/><path d="M42 34h9V22h10v12H50v9h-8z" fill="#91ad65"/></g>`,
`<g><ellipse cx="48" cy="87" rx="28" ry="7" fill="#283a39" opacity=".5"/><path d="M44 80h12V47H44z" fill="#71503b"/><path d="M28 55h12V42h12V30h18v13h11v18h8v17H21V61h7z" fill="#37483c"/><path d="M25 52h13V39h13V26h20v15h12v17h7v18H20V58h5z" fill="#41614a"/><path d="M31 42h12V31h13v12h12v13H25V47h6z" fill="#648553"/><path d="M40 36h10V27h13v11h-9v9H40z" fill="#78995b"/></g>`,
`<g><ellipse cx="48" cy="82" rx="34" ry="8" fill="#334239" opacity=".35"/><path d="M16 57h16V44h13V34h15v10h14v12h10v22H14V62h2z" fill="#354839"/><path d="M19 54h13V42h15V32h17v11h13v13h9v18H15V60h4z" fill="#62824d"/><path d="M29 47h13V38h17v9h13v12H23V52h6z" fill="#87a35d"/></g>`,
`<g><ellipse cx="48" cy="86" rx="35" ry="7" fill="#293b3b" opacity=".5"/><path d="M10 38h76v35H10z" fill="#3c3a39"/><path d="M15 34h66v31H15z" fill="#8b5c43"/><path d="M18 29h60v29H18z" fill="#b37c50"/><path d="M22 24h52v25H22z" fill="#7a4f3e"/><path d="M22 30h52v4H22z" fill="#d2a16a"/><path d="M20 58h7v24h-7zm47 0h7v24h-7z" fill="#674738"/><path d="M27 38h40v7H27z" fill="#d2a16a"/></g>`,
`<g><ellipse cx="48" cy="87" rx="36" ry="8" fill="#2b3a3b" opacity=".45"/><path d="M16 28h64v45H16z" fill="#34343b"/><path d="M21 24h54v43H21z" fill="#9f967d"/><path d="M26 28h44v34H26z" fill="#578696"/><path d="M30 33h35v24H30z" fill="#72b1b5"/><path d="M24 62h48v9H24z" fill="#6c5c4b"/><path d="M44 36h8v16h-8z" fill="#d9cfaa"/><path d="M32 44h29v4H32z" fill="#83c5c2"/><path d="M13 69h70v8H13z" fill="#7c715c"/></g>`,
`<g><ellipse cx="48" cy="87" rx="25" ry="7" fill="#2a3938" opacity=".4"/><path d="M42 63h14v23H42z" fill="#514a43"/><path d="M39 46h20v22H39z" fill="#4f7864"/><path d="M32 49h34v10H32z" fill="#8c6850"/><path d="M38 34h22v16H38z" fill="#e1cc91"/><path d="M42 37h14v10H42z" fill="#f1deaa"/><path d="M45 15h8v22h-8z" fill="#5c5345"/><path d="M29 20h40v6H29z" fill="#e8c975"/><path d="M36 7h26v14H36z" fill="#f2d98a"/><path d="M38 8h22v3H38z" fill="#fff0bb"/></g>`,
`<g><ellipse cx="48" cy="88" rx="25" ry="6" fill="#2c3938" opacity=".4"/><path d="M36 45h24v40H36z" fill="#333841"/><path d="M31 35h34v18H31z" fill="#9b6246"/><path d="M27 30h42v12H27z" fill="#d2a266"/><path d="M37 23h22v12H37z" fill="#8e6048"/><path d="M43 19h10v14H43z" fill="#b87a4f"/><path d="M32 54h32v5H32z" fill="#d0b67e"/><path d="M39 62h18v6H39z" fill="#8b644c"/></g>`,
`<g><ellipse cx="48" cy="87" rx="31" ry="7" fill="#2c3938" opacity=".4"/><path d="M12 23h72v52H12z" fill="#37423b"/><path d="M17 28h62v42H17z" fill="#7d9362"/><path d="M22 34h52v30H22z" fill="#b2ad88"/><path d="M29 41h38v18H29z" fill="#53818c"/><path d="M45 41h5v18h-5z" fill="#ead9ad"/><path d="M29 49h38v4H29z" fill="#ead9ad"/><path d="M20 69h56v8H20z" fill="#855e43"/></g>`,
`<g><ellipse cx="48" cy="87" rx="26" ry="7" fill="#293a3b" opacity=".45"/><path d="M28 39h40v40H28z" fill="#51473d"/><path d="M32 35h32v40H32z" fill="#b36b4a"/><path d="M35 44h26v23H35z" fill="#e1c897"/><path d="M39 48h18v15H39z" fill="#8a664d"/><path d="M43 52h10v8H43z" fill="#b6c48b"/><path d="M38 31h20v8H38z" fill="#d6b578"/></g>`,
`<g><ellipse cx="48" cy="84" rx="35" ry="8" fill="#2c3d3d" opacity=".4"/><path d="M15 36h66v42H15z" fill="#5c533f"/><path d="M19 31h58v41H19z" fill="#a77b4d"/><path d="M24 36h48v31H24z" fill="#6c9a75"/><path d="M29 42h38v18H29z" fill="#84ae7a"/><path d="M36 49h23v5H36z" fill="#e7cf81"/><path d="M43 40h7v23h-7z" fill="#c66c57"/></g>`,
`<g><ellipse cx="48" cy="85" rx="30" ry="7" fill="#283938" opacity=".4"/><path d="M24 50h48v34H24z" fill="#8d5543"/><path d="M20 45h56v31H20z" fill="#bd7656"/><path d="M29 52h38v17H29z" fill="#ead7b0"/><path d="M33 56h30v3H33z" fill="#6f8a6b"/><path d="M36 63h22v3H36z" fill="#6f8a6b"/><path d="M35 38h26v10H35z" fill="#d4b374"/></g>`,
`<g><ellipse cx="48" cy="88" rx="33" ry="7" fill="#283938" opacity=".45"/><path d="M14 44h68v32H14z" fill="#494138"/><path d="M18 39h60v29H18z" fill="#87704d"/><path d="M22 43h52v21H22z" fill="#a79164"/><path d="M27 48h42v11H27z" fill="#587e80"/><path d="M31 51h34v5H31z" fill="#94b5a4"/><path d="M25 68h8v16h-8zm40 0h8v16h-8z" fill="#654d3d"/></g>`,
`<g><ellipse cx="48" cy="88" rx="25" ry="6" fill="#293839" opacity=".45"/><path d="M25 42h46v39H25z" fill="#3b4141"/><path d="M30 37h36v38H30z" fill="#b9b49a"/><path d="M34 42h28v27H34z" fill="#eee0b9"/><path d="M39 47h18v17H39z" fill="#58858f"/><path d="M43 47h5v17h-5z" fill="#d9c99d"/><path d="M39 54h18v4H39z" fill="#d9c99d"/></g>`,
`<g><ellipse cx="48" cy="87" rx="30" ry="7" fill="#293a39" opacity=".4"/><path d="M20 45h56v33H20z" fill="#67483a"/><path d="M24 39h48v30H24z" fill="#ae794d"/><path d="M31 43h35v22H31z" fill="#e5cf9e"/><path d="M35 49h27v3H35z" fill="#7a8b68"/><path d="M35 56h21v3H35z" fill="#7a8b68"/></g>`,
`<g><ellipse cx="48" cy="87" rx="30" ry="7" fill="#293938" opacity=".45"/><path d="M18 34h60v43H18z" fill="#3d4240"/><path d="M22 29h52v42H22z" fill="#e4d6b0"/><path d="M27 34h42v32H27z" fill="#607e91"/><path d="M31 39h34v6H31z" fill="#89aeb0"/><path d="M31 50h25v4H31z" fill="#d9c48d"/><path d="M31 58h19v4H31z" fill="#d9c48d"/></g>`
];
function spriteAtlas(){return `<svg xmlns="http://www.w3.org/2000/svg" width="768" height="192" viewBox="0 0 768 192"><title>Objetos del Valle del Autoconocimiento</title>${props.map((s,i)=>`<g transform="translate(${i%8*96},${Math.floor(i/8)*96})" shape-rendering="crispEdges">${s}</g>`).join('')}</svg>`;}

// Original 16-bit-style animated actors: five genuine frames per direction, 32x40 pixels.
function actorFrame(row,frame,palette){
 const moving=[-2,0,2,-1,0][frame],arm=[1,-2,2,-1,0][frame];
 let p=[];const R=(x,y,w,h,c)=>p.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}"/>`);
 const face=row===0,back=row===3,side=row===1||row===2;
 // compact shadow, separated legs and shoes animate with four walking poses
 R(5,35,22,3,'#303638');
 if(frame===4){R(10,27,5,8,'#35434a');R(18,27,5,8,'#35434a');R(8,34,8,3,'#e5ded0');R(17,34,8,3,'#e5ded0');}
 else {R(10,26+moving,5,9,'#35434a');R(18,26-moving,5,9,'#35434a');R(8,33+moving,8,4,'#e5ded0');R(17,33-moving,8,4,'#e5ded0');}
 R(8,16,16,12,palette.shirt);R(6,18+arm,4,9,palette.shirt);R(22,18-arm,4,9,palette.shirt);
 R(10,16,3,4,palette.shade);R(19,16,3,4,palette.hi);R(12,14,8,4,palette.skin);
 if(side){R(11,4,11,11,palette.hair);R(row===1?9:22,8,4,7,palette.hair);R(row===1?18:12,8,2,2,'#f2e2bc');R(row===1?18:12,11,2,2,'#392e32');R(12,10,7,3,palette.skin);}
 else if(back){R(9,3,14,13,palette.hair);R(7,7,4,9,palette.hair);R(22,7,4,9,palette.hair);R(10,13,12,3,palette.hair);}
 else {R(10,4,12,7,palette.hair);R(8,7,4,6,palette.hair);R(20,6,5,7,palette.hair);R(11,8,12,7,palette.skin);R(12,10,2,2,'#2d2c31');R(20,10,2,2,'#2d2c31');R(15,13,4,1,'#b36d5c');}
 R(9,2,13,3,palette.hair);R(8,5,3,3,palette.hair);R(22,5,3,3,palette.hair);
 if(palette.longHair){R(7,9,4,12,palette.hair);R(21,9,4,13,palette.hair);R(8,20,3,4,palette.hi);}
 R(12,19,8,2,palette.hi);R(15,20,2,4,palette.gold);
 return `<g>${p.join('')}</g>`;
}
const actors={
 'hero_male_sheet.svg':{hair:'#3b2e31',shirt:'#50808a',shade:'#3e6876',hi:'#7da7a3',skin:'#e7b58e',gold:'#d0aa67'},
 'hero_female_sheet.svg':{hair:'#3d3035',shirt:'#e4ded0',shade:'#bbaea2',hi:'#fff2db',skin:'#ecc09c',gold:'#d0aa67',longHair:true},
 'npc_mother_sheet.svg':{hair:'#4c3436',shirt:'#9f5c58',shade:'#78484b',hi:'#c9816e',skin:'#e9b797',gold:'#d0aa67',longHair:true},
 'npc_father_sheet.svg':{hair:'#3a3433',shirt:'#526d77',shade:'#3d5663',hi:'#82999a',skin:'#cf9c78',gold:'#d0aa67'},
 'npc_teacher_sheet.svg':{hair:'#625247',shirt:'#6d8058',shade:'#536844',hi:'#9daa78',skin:'#e3b18d',gold:'#d0aa67'},
 'npc_neighbor_sheet.svg':{hair:'#503b4b',shirt:'#b96f63',shade:'#8f5655',hi:'#dda081',skin:'#ecc29a',gold:'#d0aa67',longHair:true},
 'npc_gardener_sheet.svg':{hair:'#766044',shirt:'#9b7142',shade:'#765331',hi:'#c49a5d',skin:'#d2a07a',gold:'#d0aa67'}
};
function actorSvg(palette){let groups=[];for(let row=0;row<4;row++)for(let frame=0;frame<5;frame++)groups.push(`<g transform="translate(${frame*32},${row*40})">${actorFrame(row,frame,palette)}</g>`);return `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160"><title>Hoja de sprites animados original</title><g shape-rendering="crispEdges">${groups.join('')}</g></svg>`;}

await mkdir('assets/backgrounds',{recursive:true});await mkdir('assets/objects',{recursive:true});await mkdir('assets/characters',{recursive:true});
await writeFile('assets/backgrounds/autoconocimiento_valley.png',png(W,H,pxbuf));
await writeFile('assets/objects/valley_props.svg',spriteAtlas());
for(const [name,palette] of Object.entries(actors))await writeFile(`assets/characters/${name}`,actorSvg(palette));
console.log(`Generated ${W}x${H} valley map, a 16-frame outdoor prop atlas, and seven 20-frame character sheets.`);
