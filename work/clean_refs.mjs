import { readFile, writeFile } from 'node:fs/promises';
import { deflateSync, inflateSync } from 'node:zlib';

const paeth=(a,b,c)=>{const p=a+b-c,pa=Math.abs(p-a),pb=Math.abs(p-b),pc=Math.abs(p-c);return pa<=pb&&pa<=pc?a:pb<=pc?b:c;};
function decode(buf){
  if(buf.toString('ascii',1,4)!=='PNG')throw Error('Not PNG');let p=8,w,h,depth,color,interlace;const ids=[];
  while(p<buf.length){const n=buf.readUInt32BE(p),type=buf.toString('ascii',p+4,p+8),d=buf.subarray(p+8,p+8+n);p+=12+n;if(type==='IHDR'){w=d.readUInt32BE(0);h=d.readUInt32BE(4);depth=d[8];color=d[9];interlace=d[12];}if(type==='IDAT')ids.push(d);if(type==='IEND')break;}
  if(depth!==8||interlace!==0||![2,6].includes(color))throw Error(`Unsupported PNG format depth=${depth} color=${color} interlace=${interlace}`);
  const ch=color===6?4:3,stride=w*ch,raw=inflateSync(Buffer.concat(ids)),pixels=Buffer.alloc(stride*h);let s=0;
  for(let y=0;y<h;y++){const f=raw[s++],row=y*stride;for(let x=0;x<stride;x++){const a=x>=ch?pixels[row+x-ch]:0,b=y?pixels[row-stride+x]:0,c=y&&x>=ch?pixels[row-stride+x-ch]:0,v=raw[s++];pixels[row+x]=(v+(f===1?a:f===2?b:f===3?Math.floor((a+b)/2):f===4?paeth(a,b,c):0))&255;}}
  const rgba=Buffer.alloc(w*h*4);for(let i=0,j=0;i<pixels.length;i+=ch,j+=4){rgba[j]=pixels[i];rgba[j+1]=pixels[i+1];rgba[j+2]=pixels[i+2];rgba[j+3]=ch===4?pixels[i+3]:255;}return {w,h,rgba};
}
const crcTable=(()=>{const t=new Uint32Array(256);for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xedb88320^(c>>>1):c>>>1;t[n]=c>>>0;}return t;})();
function crc(b){let c=0xffffffff;for(const v of b)c=crcTable[(c^v)&255]^(c>>>8);return(c^0xffffffff)>>>0;}
function chunk(name,data){const type=Buffer.from(name),out=Buffer.alloc(12+data.length);out.writeUInt32BE(data.length,0);type.copy(out,4);data.copy(out,8);out.writeUInt32BE(crc(Buffer.concat([type,data])),8+data.length);return out;}
function encode(w,h,rgba){const ih=Buffer.alloc(13);ih.writeUInt32BE(w,0);ih.writeUInt32BE(h,4);ih[8]=8;ih[9]=6;const rows=Buffer.alloc((w*4+1)*h);for(let y=0;y<h;y++)rgba.copy(rows,y*(w*4+1)+1,y*w*4,(y+1)*w*4);return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',ih),chunk('IDAT',deflateSync(rows)),chunk('IEND',Buffer.alloc(0))]);}
async function clean(src,dst){const {w,h,rgba}=decode(await readFile(src)),seen=new Uint8Array(w*h),q=new Int32Array(w*h);let head=0,tail=0;
 const seed=i=>{if(seen[i])return;const p=i*4;if(rgba[p+3]&&rgba[p]<24&&rgba[p+1]<24&&rgba[p+2]<24){seen[i]=1;q[tail++]=i;}};
 for(let x=0;x<w;x++){seed(x);seed((h-1)*w+x);}for(let y=0;y<h;y++){seed(y*w);seed(y*w+w-1);}
 while(head<tail){const i=q[head++],x=i%w,y=(i/w)|0;if(x)seed(i-1);if(x+1<w)seed(i+1);if(y)seed(i-w);if(y+1<h)seed(i+w);}
 let minX=w,minY=h,maxX=-1,maxY=-1;for(let i=0;i<w*h;i++){const p=i*4;if(seen[i])rgba[p+3]=0;else if(rgba[p+3]){const x=i%w,y=(i/w)|0;if(x<minX)minX=x;if(x>maxX)maxX=x;if(y<minY)minY=y;if(y>maxY)maxY=y;}}
 if(maxX<minX)throw Error(`Empty sprite ${src}`);const cw=maxX-minX+1,ch=maxY-minY+1,crop=Buffer.alloc(cw*ch*4);for(let y=0;y<ch;y++)rgba.copy(crop,y*cw*4,((minY+y)*w+minX)*4,((minY+y)*w+maxX+1)*4);await writeFile(dst,encode(cw,ch,crop));console.log(`${dst}: ${cw}x${ch}`);
}
const root='C:/Users/ASUS/';
const refs=[
 ['AppData/Local/Temp/codex-clipboard-1c9c830a-f871-4d40-81b7-2cd7b342e216.png','assets/characters/ref_01.png'],
 ['AppData/Local/Temp/codex-clipboard-d498c57f-ca2e-4309-b74f-78ca1fc2d3bf.png','assets/characters/ref_02.png'],
 ['AppData/Local/Temp/codex-clipboard-167843d8-63e8-4f9a-a610-b5f29e46387d.png','assets/characters/ref_03.png'],
 ['AppData/Local/Temp/codex-clipboard-59692fa3-222d-4f99-bf06-f3bd67a06f1b.png','assets/characters/ref_04.png'],
 ['AppData/Local/Temp/codex-clipboard-8d071697-3b57-4ad2-afd6-2e368ebf78ab.png','assets/characters/ref_05.png']
];
for(const [src,dst] of refs)await clean(root+src,dst);
