import { mkdir, writeFile } from 'node:fs/promises';
import { deflateSync } from 'node:zlib';

const crcTable=(()=>{const t=new Uint32Array(256);for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xedb88320^(c>>>1):c>>>1;t[n]=c>>>0;}return t;})();
function crc(b){let c=0xffffffff;for(const v of b)c=crcTable[(c^v)&255]^(c>>>8);return(c^0xffffffff)>>>0;}
function chunk(name,data){const type=Buffer.from(name),out=Buffer.alloc(data.length+12);out.writeUInt32BE(data.length,0);type.copy(out,4);data.copy(out,8);out.writeUInt32BE(crc(Buffer.concat([type,data])),data.length+8);return out;}
function png(w,h,pixels){const ih=Buffer.alloc(13);ih.writeUInt32BE(w,0);ih.writeUInt32BE(h,4);ih[8]=8;ih[9]=6;const rows=Buffer.alloc((w*4+1)*h);for(let y=0;y<h;y++)pixels.copy(rows,y*(w*4+1)+1,y*w*4,(y+1)*w*4);return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',ih),chunk('IDAT',deflateSync(rows)),chunk('IEND',Buffer.alloc(0))]);}
const palette={ink:'#352b36',shadow:'#56404b',wood:'#87583f',wood2:'#ad7950',woodHi:'#d4a675',wall:'#e8d9b3',wallHi:'#f4e8cb',floor:'#b77e55',floor2:'#c78d61',floor3:'#a96f4e',cream:'#f7eac8',teal:'#568b83',teal2:'#76aaa0',red:'#b94c45',blue:'#55748d',green:'#517754',green2:'#769653',leaf:'#93a85a',soil:'#76523d',stone:'#b5aa8a',black:'#302e36',gold:'#d6ad64'};
function canvas(w,h,fill='#00000000'){const data=Buffer.alloc(w*h*4);const c=col(fill);for(let i=0;i<w*h;i++)data.set(c,i*4);return{w,h,data};}
function col(c){if(Array.isArray(c))return c;const s=c.replace('#','');return s.length===8?[parseInt(s.slice(0,2),16),parseInt(s.slice(2,4),16),parseInt(s.slice(4,6),16),parseInt(s.slice(6,8),16)]:[parseInt(s.slice(0,2),16),parseInt(s.slice(2,4),16),parseInt(s.slice(4,6),16),255];}
function rect(g,x,y,w,h,c){const C=col(c);for(let yy=Math.max(0,y);yy<Math.min(g.h,y+h);yy++)for(let xx=Math.max(0,x);xx<Math.min(g.w,x+w);xx++)g.data.set(C,(yy*g.w+xx)*4);}
function px(g,x,y,c){rect(g,x,y,1,1,c);}
function tileFloor(g,tx,ty,kind){const x=tx*32,y=ty*32;if(kind==='grass'){rect(g,x,y,32,32,'#66834c');for(let i=0;i<9;i++){px(g,x+(tx*13+i*7)%32,y+(ty*11+i*5)%32,i%3?'#789354':'#526e45');}return;}if(kind==='stone'){rect(g,x,y,32,32,'#b1a78a');rect(g,x+1,y+1,30,1,'#d3c7a1');rect(g,x+1,y+16,30,1,'#968d78');rect(g,x+15,y,1,16,'#968d78');rect(g,x+7,y+17,1,15,'#968d78');rect(g,x+24,y+17,1,15,'#968d78');return;}if(kind==='wall'){rect(g,x,y,32,32,palette.wall);rect(g,x,y,32,3,palette.wallHi);rect(g,x,y+30,32,2,'#c5b58f');for(let i=0;i<3;i++)px(g,x+5+i*10,y+9+i%2*10,'#dcc89e');return;}let base=kind==='kitchen'?'#c9ad84':kind==='bedroom'?'#bd8060':'#bd845e';rect(g,x,y,32,32,base);rect(g,x,y,32,1,'#d9a478');rect(g,x,y+15,32,1,'#a66f50');rect(g,x+15,y,1,15,'#a66f50');rect(g,x+7,y+16,1,16,'#a66f50');rect(g,x+24,y+16,1,16,'#a66f50');px(g,x+3,y+4,'#e0b387');px(g,x+20,y+26,'#94664e');}
const map=canvas(64*32,19*32,palette.wall);
// garden, front walk and perimeter walls
for(let ty=0;ty<19;ty++)for(let tx=0;tx<64;tx++)tileFloor(map,tx,ty,tx<16?(tx>11&&ty>6&&ty<13?'stone':'grass'):tx<32?'living':tx<48?'kitchen':'bedroom');
// Rooms have readable wall bands, warm skirting and door openings at center.
for(let rx=0;rx<4;rx++){const start=rx*16;for(let tx=start;tx<start+16;tx++){tileFloor(map,tx,0,'wall');tileFloor(map,tx,1,'wall');tileFloor(map,tx,17,'wall');tileFloor(map,tx,18,'wall');}}
for(const bx of [16,32,48])for(let ty=0;ty<19;ty++)if(ty<6||ty>12)tileFloor(map,bx,ty,'wall');
// Exterior greenery and flower beds.
for(let i=0;i<28;i++){const x=(i*71+29)%475,y=(i*47+40)%550;rect(map,x,y,18,14,'#4d713f');rect(map,x+3,y+2,12,9,i%2?'#789553':'#617e49');px(map,x+6,y+4,i%3?'#e6c77d':'#cf8063');}
rect(map,360,248,150,112,'#c2915d');rect(map,374,258,122,90,'#ece0c0');rect(map,414,250,42,16,'#674331');rect(map,414,250,42,5,'#a96849');
// rugs are woven pixel patterns; room furnishing is placed by runtime sprites.
for(const [x,y,w,h] of [[585,290,300,175],[1090,300,260,170],[1620,290,270,180]]){rect(map,x,y,w,h,'#745344');rect(map,x+8,y+8,w-16,h-16,'#d1a36c');rect(map,x+16,y+16,w-32,h-32,'#657d62');for(let a=0;a<w-30;a+=20)rect(map,x+16+a,y+19,3,h-38,'#b68c56');}

// A 64px frame atlas of hand-authored chunky pixel-art furniture, not runtime placeholder shapes.
const atlas=canvas(8*64,4*64);
function frame(index,draw){const ox=(index%8)*64,oy=Math.floor(index/8)*64;const g={w:64,h:64,data:Buffer.alloc(64*64*4)};draw(g);for(let y=0;y<64;y++)g.data.copy(atlas.data,((oy+y)*atlas.w+ox)*4,y*64*4,(y+1)*64*4);}
function sofa(g){rect(g,4,13,56,42,palette.ink);rect(g,7,15,50,33,'#66877c');rect(g,9,18,21,25,'#83a396');rect(g,33,18,21,25,'#83a396');rect(g,3,16,7,30,'#d2b184');rect(g,54,16,7,30,'#d2b184');rect(g,8,47,6,10,palette.wood);rect(g,50,47,6,10,palette.wood);rect(g,29,17,5,25,'#55766d');}
function coffee(g){rect(g,8,14,48,39,palette.ink);rect(g,11,16,42,33,'#d2a071');rect(g,15,19,34,26,'#b9875b');rect(g,10,49,5,8,palette.wood);rect(g,49,49,5,8,palette.wood);rect(g,18,21,28,2,'#e4ba86');}
function tv(g){rect(g,7,17,50,37,palette.ink);rect(g,10,19,44,30,palette.wood);rect(g,15,20,34,23,'#26323b');rect(g,18,23,28,17,'#40586a');rect(g,13,44,38,5,'#513a34');rect(g,12,50,5,5,palette.wood);rect(g,48,50,5,5,palette.wood);}
function shelf(g){rect(g,8,7,48,51,palette.ink);rect(g,11,9,42,47,'#865c43');for(let y of [23,38,51]){rect(g,11,y,42,3,'#d0a06a');}for(let y of [11,26,41])for(let i=0;i<5;i++){const colors=['#547c82','#bd6850','#d1ae68','#647c59','#865f89'];rect(g,14+i*8,y,5,10,colors[(i+y)%5]);}rect(g,7,56,50,4,'#513c36');}
function plant(g){rect(g,18,30,28,25,palette.ink);rect(g,20,32,24,18,'#b96945');rect(g,22,33,20,3,'#d69b5d');for(const [x,y,w,h,c]of[[30,10,7,25,'#567b4f'],[16,18,17,15,'#779553'],[34,16,15,17,'#89a75a'],[21,7,12,11,'#95ad60'],[36,6,10,13,'#72944d']])rect(g,x,y,w,h,c);px(g,25,12,'#bdd17b');px(g,40,9,'#bdd17b');}
function fridge(g){rect(g,12,5,40,54,palette.ink);rect(g,15,8,34,48,'#c7d0c0');rect(g,17,10,30,20,'#e3e4cb');rect(g,17,33,30,20,'#d1d8c5');rect(g,42,17,2,8,'#697d76');rect(g,42,39,2,8,'#697d76');rect(g,13,56,6,3,palette.wood);rect(g,45,56,6,3,palette.wood);}
function stove(g){rect(g,9,13,46,43,palette.ink);rect(g,12,16,40,36,'#c4b59b');for(const [x,y]of[[20,24],[42,24],[20,43],[42,43]]){rect(g,x-7,y-7,14,14,'#705952');rect(g,x-4,y-4,8,8,'#d6c9aa');rect(g,x-2,y-2,4,4,'#423c3e');}rect(g,16,11,32,4,'#dfd4b6');}
function sink(g){rect(g,7,17,50,37,palette.ink);rect(g,10,20,44,29,'#a97a57');rect(g,15,23,33,21,'#c6d2c2');rect(g,25,17,14,7,'#647e7a');rect(g,30,11,4,10,'#8bb0a2');rect(g,17,26,29,15,'#9db6a9');}
function dining(g){rect(g,7,8,50,49,palette.ink);rect(g,12,13,40,39,'#996448');rect(g,15,16,34,33,'#bf8a58');rect(g,21,20,22,25,'#d4a16a');rect(g,4,8,5,9,'#d2a777');rect(g,55,8,5,9,'#d2a777');rect(g,4,49,5,9,'#d2a777');rect(g,55,49,5,9,'#d2a777');rect(g,28,10,8,6,'#f0e2c4');}
function bed(g){rect(g,5,9,54,48,palette.ink);rect(g,8,12,48,42,'#875d64');rect(g,11,15,42,16,'#eee4d1');rect(g,12,34,40,17,'#6e879a');rect(g,14,18,15,10,'#f6eddb');rect(g,32,18,17,10,'#f6eddb');rect(g,8,52,6,5,palette.wood);rect(g,52,52,6,5,palette.wood);}
function desk(g){rect(g,7,17,50,37,palette.ink);rect(g,10,20,44,26,'#9d6849');rect(g,13,22,38,20,'#bd8758');rect(g,12,47,5,9,palette.wood);rect(g,48,47,5,9,palette.wood);rect(g,18,23,20,15,'#e6dfcc');rect(g,39,23,10,15,'#536f83');rect(g,21,26,12,2,'#597e87');rect(g,21,31,10,2,'#597e87');}
function backpack(g){rect(g,16,10,32,45,palette.ink);rect(g,19,13,26,37,'#aa5947');rect(g,22,18,20,22,'#c97755');rect(g,24,42,16,9,'#864b43');rect(g,28,45,8,3,'#e1b574');rect(g,13,19,5,20,'#80504b');rect(g,46,19,5,20,'#80504b');}
function calendar(g){rect(g,8,8,48,48,palette.ink);rect(g,11,11,42,42,'#f0e6c9');rect(g,11,11,42,10,'#b95348');for(let y=26;y<49;y+=8)for(let x=17;x<49;x+=8)rect(g,x,y,4,4,(x+y)%3?'#7a9880':'#d5aa5f');rect(g,20,7,3,9,'#d9c594');rect(g,42,7,3,9,'#d9c594');}
const draws=[sofa,coffee,tv,shelf,plant,fridge,stove,sink,dining,bed,desk,backpack,calendar];draws.forEach((d,i)=>frame(i,d));

await mkdir('assets/backgrounds',{recursive:true});await mkdir('assets/objects',{recursive:true});
await writeFile('assets/backgrounds/episode1_house.png',png(map.w,map.h,map.data));
await writeFile('assets/objects/episode1_props.png',png(atlas.w,atlas.h,atlas.data));
console.log('Generated episode 1 house map and furniture sprite atlas.');
