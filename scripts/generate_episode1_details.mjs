import { mkdir, writeFile } from 'node:fs/promises';

// Original transparent 8x4 pixel-art sprite atlas, rendered as an SVG asset so Phaser loads
// the furniture as images instead of drawing it with scene Graphics at runtime.
const colors={ink:'#342b34',edge:'#59434a',wood:'#8d5d43',wood2:'#bd855b',light:'#e2bc86',wall:'#eadab8',blue:'#58818a',blue2:'#8cb4b0',cream:'#f5e9c9',red:'#b95c50',green:'#6f8e5a',dark:'#34434a',gold:'#d9b667'};
const frames=[];
function box(x,y,w,h,c,stroke=colors.ink,sw=2){return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}" stroke="${stroke}" stroke-width="${sw}"/>`;}
function path(d,fill,stroke=colors.ink,sw=2){return `<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="miter"/>`;}
function add(content){frames.push(content);}
// 0 open doorway
add(box(7,3,50,58,colors.wall,colors.ink,3)+box(13,8,38,50,'#6b4939')+box(20,12,29,46,'#2e3333')+box(22,14,24,43,'#493b35')+box(45,30,3,5,colors.gold,colors.gold,1)+box(4,57,56,4,colors.wood));
// 1 closed paneled door
add(box(10,3,44,58,colors.ink,colors.ink,3)+box(14,7,36,51,colors.wood)+box(19,12,26,18,colors.wood2)+box(19,34,26,17,colors.wood2)+box(43,31,3,4,colors.gold,colors.gold,1)+box(6,58,52,3,colors.wood));
// 2 window with curtains and sill
add(box(3,10,58,42,colors.ink,colors.ink,3)+box(8,15,48,31,'#427078')+box(11,18,18,12,'#87b7b2')+box(34,18,18,12,'#87b7b2')+box(11,34,18,9,'#4d7778')+box(34,34,18,9,'#4d7778')+box(30,15,4,31,colors.cream)+box(3,48,58,6,colors.wood2)+box(2,8,10,42,colors.red)+box(52,8,10,42,colors.red));
// 3 dining chair, pixel silhouette
add(path('M16 8H48V30H53V41H46V57H39V42H25V57H18V41H11V30H16Z',colors.wood2)+box(20,13,24,13,'#d4a16c')+box(14,31,36,7,colors.wood));
// 4 framed family photograph
add(box(5,5,54,54,colors.wood,colors.ink,3)+box(10,10,44,39,'#568084')+box(13,13,38,31,'#8da77b')+box(17,20,12,13,'#e9b78f')+box(34,19,12,14,'#f0c59d')+box(16,17,14,5,'#493833')+box(33,16,14,5,'#493833')+box(14,34,17,10,'#6f8581')+box(32,34,17,10,'#b86458')+box(27,50,10,5,colors.gold,colors.gold,1));
// 5 colorful stacked books
add(box(8,43,47,12,colors.red)+box(12,31,43,12,'#567a91')+box(7,19,46,12,colors.green)+box(12,7,42,12,'#d0a45d')+box(15,9,4,8,colors.cream,colors.cream,1)+box(10,21,4,8,colors.cream,colors.cream,1)+box(16,33,4,8,colors.cream,colors.cream,1)+box(13,45,4,8,colors.cream,colors.cream,1));
// 6 desktop computer and keyboard
add(box(12,6,40,32,colors.ink,colors.ink,3)+box(16,10,32,23,'#3d6670')+box(19,13,26,4,'#9cc9bd',colors.blue,1)+box(20,19,8,10,'#d7b765',colors.blue,1)+box(32,19,11,10,'#718d63',colors.blue,1)+box(28,38,8,7,'#81705d')+box(21,44,23,4,colors.wood)+path('M8 50H56L52 59H12Z','#c6b79b')+box(14,52,36,3,'#eee0c2',colors.cream,1));
// 7 open laptop
add(path('M14 9H50V42H14Z',colors.ink)+box(18,13,28,24,'#426c75')+box(21,16,22,3,'#93c1b5',colors.blue,1)+path('M7 44H57L53 55H11Z','#c4b397')+box(20,47,24,3,'#e8ddc3',colors.cream,1)+box(28,42,8,3,colors.gold));
// 8 study lamp
add(box(26,49,24,7,colors.wood)+path('M35 48L32 28L40 14L46 18L37 31L41 48Z','#b18b5e')+path('M31 19L38 6L57 15L50 27Z',colors.gold)+box(35,11,13,7,'#f4e49e',colors.gold,1));
// 9 open book
add(path('M5 14Q29 8 31 20Q33 8 59 14V52Q35 46 31 57Q25 46 5 52Z','#f5e7c8')+box(30,19,3,34,colors.red,colors.red,1)+box(10,21,16,2,'#798b82',colors.cream,1)+box(10,28,17,2,'#798b82',colors.cream,1)+box(10,35,15,2,'#798b82',colors.cream,1)+box(36,21,17,2,'#798b82',colors.cream,1)+box(36,28,17,2,'#798b82',colors.cream,1)+box(36,35,15,2,'#798b82',colors.cream,1));
// 10 small flower pot
add(box(18,39,29,18,colors.red)+box(16,37,33,5,colors.wood2)+path('M32 37V19M30 27L20 18M34 25L45 15M30 20L28 9', 'none',colors.green,5)+box(17,14,12,7,colors.green,colors.green,1)+box(39,11,12,7,colors.green,colors.green,1)+box(24,5,11,7,colors.green,colors.green,1)+box(17,12,4,4,colors.gold,colors.gold,1));
// 11 wall clock
add(box(13,5,38,50,'#77573f')+box(17,9,30,42,colors.cream)+box(20,12,24,34,'#f1e8cc')+path('M32 17V30L40 35','none',colors.red,3)+box(28,27,7,7,colors.gold,colors.gold,1)+box(26,2,12,5,colors.wood2));
// 12 plate, fork, spoon
add(box(8,37,48,15,colors.wood)+box(14,33,36,9,colors.cream)+box(19,35,26,5,'#d1d0bd',colors.blue2,1)+box(8,17,4,15,colors.dark)+box(5,12,2,8,colors.dark)+box(9,12,2,8,colors.dark)+box(13,12,2,8,colors.dark)+box(5,10,10,3,colors.dark)+box(48,14,5,20,colors.dark)+box(47,10,8,7,colors.dark));
// 13 kitchen spice jars
add(box(8,30,14,25,colors.cream)+box(10,25,10,7,colors.red)+box(25,22,14,33,'#89a18c')+box(27,17,10,7,colors.gold)+box(42,29,13,26,'#c47755')+box(44,24,9,7,colors.wood2)+box(8,38,14,4,colors.gold)+box(25,34,14,4,colors.cream)+box(42,37,13,4,colors.cream));
// 14 framed landscape picture
add(box(4,9,56,45,colors.wood,colors.ink,3)+box(9,14,46,34,'#6c99a0')+path('M10 39L23 26L31 34L42 20L54 38V47H10Z','#668458')+box(39,18,7,7,colors.gold,colors.gold,1)+box(19,17,9,2,colors.cream,colors.cream,1));
// 15 woven runner rug
add(box(11,3,42,58,colors.edge)+box(15,7,34,50,'#b45d4e')+box(19,11,26,42,'#d8b36d')+box(22,14,20,36,'#68856e')+box(24,17,16,30,'#b45d4e')+box(15,7,5,5,colors.cream)+box(44,7,5,5,colors.cream)+box(15,52,5,5,colors.cream)+box(44,52,5,5,colors.cream));
const groups=frames.map((f,i)=>`<g transform="translate(${(i%8)*64},${Math.floor(i/8)*64})" shape-rendering="crispEdges">${f}</g>`).join('\n');
const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="512" height="256" viewBox="0 0 512 256"><title>Complementos de pixel art para el hogar</title>${groups}</svg>`;
await mkdir('assets/objects',{recursive:true});
await writeFile('assets/objects/episode1_details.svg',svg);
console.log('Wrote original 16-frame episode 1 detail atlas (512x256).');
