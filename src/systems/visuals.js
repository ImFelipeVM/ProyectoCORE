export function drawBackdrop(scene, id = 0) {
  const g = scene.add.graphics();
  const skies = [0x87b9cb,0x91c7dd,0x9bc8bd,0x8abf9c,0xe7b98b,0x918dc4,0x78a9c4,0x9aa9ad];
  const grounds = [0x597d58,0x647b69,0x637b86,0x438054,0x986d54,0x413d68,0x3d7890,0x596b70];
  g.fillGradientStyle(skies[id % 8], skies[id % 8], 0xe9d5a5, 0xd7d39b, 1).fillRect(0,0,960,600);
  g.fillStyle(0xffe4a0,0.9).fillCircle(790,100,44);
  g.fillStyle(0xffffff,0.55).fillEllipse(140,120,160,40).fillEllipse(180,112,100,32).fillEllipse(560,145,180,36);
  g.fillStyle(grounds[id % 8],1).fillEllipse(120,410,560,190).fillEllipse(550,420,620,220).fillRect(0,410,960,190);
  g.fillStyle(0x263d45,0.17).fillRect(0,0,960,600);
  // Distinct hand-drawn scene silhouettes per station.
  if (id === 0) { // warm home
    g.fillStyle(0xecd6b2).fillRect(100,230,245,190).fillTriangle(78,232,222,130,367,232);
    g.fillStyle(0x8a6148).fillRect(133,273,56,65).fillRect(253,293,58,127);
    g.fillStyle(0x80b7c1).fillRect(212,270,32,50).fillStyle(0x5b4031).fillRect(105,405,240,15);
    g.fillStyle(0xf1bd78).fillRoundedRect(418,338,140,65,12).fillStyle(0x705240).fillRect(440,398,10,28).fillRect(535,398,10,28);
  } else if (id === 1) { // school
    g.fillStyle(0xe9e2c7).fillRoundedRect(540,176,280,235,8).fillStyle(0xa7744f).fillTriangle(510,178,680,90,850,178);
    g.fillStyle(0x668899).fillRect(578,218,62,55).fillRect(718,218,62,55).fillStyle(0x5d4136).fillRect(660,294,46,117);
    g.fillStyle(0x315b46).fillRoundedRect(115,310,300,30,6).fillStyle(0x986b43).fillRect(145,340,16,60).fillRect(368,340,16,60);
    g.fillStyle(0x263c43).fillRoundedRect(170,235,190,70,5);
  } else if (id === 2) { // reflective room
    g.fillStyle(0xd9d0e9).fillRoundedRect(590,155,160,230,80).lineStyle(7,0xf5e3b2).strokeRoundedRect(590,155,160,230,80);
    g.fillStyle(0x4c7181,0.75).fillEllipse(670,255,100,135);
    g.fillStyle(0xb79968).fillRoundedRect(180,340,280,28,6).fillRect(205,368,18,62).fillRect(410,368,18,62);
    g.fillStyle(0xffd878).fillCircle(319,294,29);
  } else if (id === 3) { // park
    g.fillStyle(0x72543d).fillRoundedRect(190,220,30,200,10).fillCircle(205,195,90);
    g.fillStyle(0x5f9b61).fillCircle(164,191,50).fillCircle(229,167,60).fillCircle(249,219,48);
    g.fillStyle(0x9a7458).fillRoundedRect(560,340,180,20,8).fillRect(578,358,12,38).fillRect(710,358,12,38);
    g.lineStyle(6,0xd9c79e).beginPath().moveTo(0,455).lineTo(960,455).strokePath();
  } else if (id === 4) { // cafe
    g.fillStyle(0x7a514b).fillRect(570,180,300,228).fillStyle(0xe7cba6).fillRect(600,210,110,82).fillRect(735,210,110,82);
    g.fillStyle(0x694c3b).fillRoundedRect(110,338,300,25,8).fillRect(140,363,18,54).fillRect(365,363,18,54);
    g.fillStyle(0xf2e2cc).fillRoundedRect(235,294,48,44,6).fillStyle(0x9d6948).fillEllipse(259,299,36,10);
    g.fillStyle(0xf0ce91).fillCircle(752,250,17);
  } else if (id === 5) { // digital room
    g.fillStyle(0x594b7b).fillRoundedRect(550,170,270,180,12).fillStyle(0x8ccef0).fillRoundedRect(565,185,240,145,8);
    g.fillStyle(0x4a3a58).fillRoundedRect(160,340,270,28,8).fillRect(183,368,16,50).fillRect(390,368,16,50);
    g.fillStyle(0x283a49).fillRoundedRect(642,218,78,105,8); g.fillStyle(0x96daef).fillCircle(681,228,5);
    g.fillStyle(0xffdd9a).fillCircle(320,295,27);
  } else if (id === 6) { // mountain path
    g.fillStyle(0x61778a).fillTriangle(0,420,240,100,480,420).fillStyle(0x728b96).fillTriangle(350,420,650,65,960,420);
    g.fillStyle(0xeee2c3).fillTriangle(170,238,240,100,310,238).fillTriangle(572,157,650,65,733,160);
    g.lineStyle(24,0xd8bd82,1).beginPath().moveTo(450,600).lineTo(520,490).lineTo(430,420).lineTo(520,340).lineTo(470,280).strokePath();
    g.fillStyle(0x416148).fillCircle(105,355,48).fillCircle(860,370,58);
  } else { // office
    g.fillStyle(0xddd7c4).fillRect(480,150,340,235).fillStyle(0x72a7b8).fillRect(510,175,125,95).fillRect(656,175,134,95);
    g.fillStyle(0x8a6244).fillRoundedRect(120,345,360,24,5).fillRect(150,369,17,48).fillRect(435,369,17,48);
    g.fillStyle(0xf5f0df).fillRoundedRect(265,292,130,52,4).fillStyle(0x4c7483).fillRect(278,302,102,30);
    g.fillStyle(0x607d73).fillRoundedRect(86,242,64,104,26).fillCircle(118,227,32);
  }
  // Foreground grass and small illustrated flowers.
  g.fillStyle(0x315944,0.28).fillRect(0,540,960,60);
  for (let i=0;i<18;i++) { const x=(i*83+23)%950; g.fillStyle(i%2?0xf0d68f:0xe9c0a2,0.82).fillCircle(x,525+(i%3)*12,3); }
  return g;
}

export function addButton(scene, x, y, label, callback, width=250, height=54) {
  const plate = scene.add.rectangle(x,y,width,height,0x244b53,0.97).setStrokeStyle(2,0xe2bd77).setInteractive({useHandCursor:true});
  const text = scene.add.text(x,y,label,{fontFamily:'Arial',fontSize:'17px',fontStyle:'bold',color:'#fff4da',align:'center',wordWrap:{width:width-24}}).setOrigin(.5);
  plate.on('pointerover',()=>{plate.setFillStyle(0x356b6b); text.setColor('#ffe09b');});
  plate.on('pointerout',()=>{plate.setFillStyle(0x244b53); text.setColor('#fff4da');});
  plate.on('pointerdown',()=>callback());
  return {plate,text};
}

export function drawAvatar(scene, x, y, gender, scale=1) {
  const g=scene.add.graphics().setPosition(x,y).setScale(scale);
  const shirt=gender==='female'?0xd66f86:0x4b89a0;
  g.fillStyle(0x263b42).fillEllipse(0,49,82,21).fillStyle(0x344d57).fillRoundedRect(-25,7,50,48,13).fillStyle(shirt).fillRoundedRect(-32,-7,64,57,15);
  g.fillStyle(0xe9b990).fillCircle(0,-35,28);
  g.fillStyle(gender==='female'?0x412e35:0x42372e).fillEllipse(0,-49,54,24);
  if(gender==='female') g.fillStyle(0x423039).fillRoundedRect(-28,-45,14,56,7).fillRoundedRect(14,-45,14,56,7);
  g.fillStyle(0x26343a).fillCircle(-9,-37,2.5).fillCircle(9,-37,2.5);
  g.lineStyle(2,0x9d5d58).beginPath().arc(0,-30,8,.2,Math.PI-.2,false).strokePath();
  g.fillStyle(0xf6dd9d).fillCircle(-8,-2,4).fillCircle(8,-2,4);
  return g;
}
