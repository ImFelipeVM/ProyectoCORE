import { gameManager } from '../systems/GameManager.js';
import { VALLEY } from '../data/valley.js';
import { RENDER_DEPTH } from './renderDepth.js';
import { createWorldNavigationState, directionArrow, distanceInSteps } from './worldNavigation.js';

const WIDTH=960,HEIGHT=600,MAP_WIDTH=690,MAP_HEIGHT=460,MAP_X=135,MAP_Y=78;
const COLORS={station:0xd9c477,visited:0x9ebc85,locked:0x778079,npc:0x91b9d0,building:0xc69b73,poi:0x8cc8be};

function worldToMap(x,y){
  return {x:MAP_X+x/VALLEY.width*MAP_WIDTH,y:MAP_Y+y/VALLEY.height*MAP_HEIGHT};
}

function markerColor(marker){
  if(marker.kind==='station')return marker.status==='current'?COLORS.station:marker.status==='visited'?COLORS.visited:COLORS.locked;
  return COLORS[marker.markerType]||COLORS.poi;
}

function markerGlyph(marker){
  if(marker.kind==='station')return String(marker.order);
  if(marker.markerType==='npc'){
    if(marker.id==='neighbor')return 'C';
    if(marker.id==='teacher')return 'E';
    if(marker.id==='mother')return 'M';
    if(marker.id==='father')return 'P';
    return 'G';
  }
  if(marker.markerType==='building')return marker.name==='Escuela'?'E':'H';
  if(marker.kind==='door')return '1';
  if(marker.kind==='school')return 'E';
  return '·';
}

export function createWorldMapOverlay(scene,{position,location,onClose}){
  const objects=[];
  const add=(object)=>{
    const depth=RENDER_DEPTH.MAP+objects.length;
    if(scene.overlayUi)scene.overlayUi.add(object,depth);
    else object.setScrollFactor(0).setDepth(depth);
    objects.push(object);return object;
  };
  const navigation=createWorldNavigationState(gameManager.player,{x:position.x,y:position.y});
  const target=navigation.target;
  const distance=target?Math.hypot(target.x-position.x,target.y-position.y):0;

  add(scene.add.rectangle(WIDTH/2,HEIGHT/2,WIDTH,HEIGHT,0x101a19,.86).setInteractive());
  add(scene.add.rectangle(WIDTH/2,HEIGHT/2,836,548,0x203632,.99).setStrokeStyle(3,0xd8ba7a));
  add(scene.add.text(170,40,'MAPA DEL VALLE',{fontFamily:'Arial',fontSize:'20px',fontStyle:'bold',color:'#f4d48d',letterSpacing:1}));
  add(scene.add.text(170,66,location+'  ·  '+(target?'OBJETIVO: '+target.name:'VALLE RECORRIDO'),{fontFamily:'Arial',fontSize:'11px',color:'#f7efdc'}));
  add(scene.add.image(MAP_X+MAP_WIDTH/2,MAP_Y+MAP_HEIGHT/2,'valleyMap').setDisplaySize(MAP_WIDTH,MAP_HEIGHT));

  for(const area of navigation.areas){
    const center=worldToMap(area.x+area.width/2,area.y+area.height/2);
    const width=area.width/VALLEY.width*MAP_WIDTH,height=area.height/VALLEY.height*MAP_HEIGHT;
    const zone=scene.add.rectangle(center.x,center.y,width,height,area.visited?0x8cac76:0x84928b,0)
      .setStrokeStyle(area.visited?2:1,area.visited?0xd4ca8e:0xb7bdb3,area.visited?0.8:0.45);
    add(zone);
    add(scene.add.text(center.x,center.y,area.name,{fontFamily:'Arial',fontSize:'8px',fontStyle:'bold',color:area.visited?'#f8edc8':'#d7ded3',backgroundColor:area.visited?'#253c35cc':'#4b5750bb',padding:{x:3,y:2}}).setOrigin(.5));
  }
  add(scene.add.rectangle(MAP_X+MAP_WIDTH/2,MAP_Y+MAP_HEIGHT/2,MAP_WIDTH,MAP_HEIGHT,0x000000,0).setStrokeStyle(2,0xd8ba7a));

  for(const marker of navigation.markers){
    const p=worldToMap(marker.x,marker.y);
    const radius=marker.kind==='station'?8:marker.markerType==='npc'?6:marker.markerType==='building'?4:5;
    add(scene.add.circle(p.x,p.y,radius,markerColor(marker)).setStrokeStyle(2,0x20312d));
    add(scene.add.text(p.x,p.y,markerGlyph(marker),{fontFamily:'Arial',fontSize:marker.kind==='station'?'9px':'8px',fontStyle:'bold',color:'#172b27'}).setOrigin(.5));
    if(marker.kind==='station'&&marker.status==='current'){
      add(scene.add.text(p.x,p.y-18,marker.title,{fontFamily:'Arial',fontSize:'8px',fontStyle:'bold',color:'#fff6df',stroke:'#24342e',strokeThickness:2}).setOrigin(.5,1));
    }
  }

  if(target){
    const p=worldToMap(target.x,target.y);
    add(scene.add.circle(p.x,p.y,12,0,0).setStrokeStyle(3,0xffe7a0));
    add(scene.add.text(p.x,p.y,'◆',{fontFamily:'Arial',fontSize:'11px',fontStyle:'bold',color:'#ffe7a0'}).setOrigin(.5));
  }

  const player=worldToMap(position.x,position.y);
  add(scene.add.circle(player.x,player.y,10,0xf6f0d9).setStrokeStyle(3,0x375d67));
  const facing={up:0,right:Math.PI/2,down:Math.PI,left:-Math.PI/2}[position.facing]||0;
  add(scene.add.text(player.x,player.y,'▲',{fontFamily:'Arial',fontSize:'12px',fontStyle:'bold',color:'#268c90'}).setOrigin(.5).setRotation(facing));
  add(scene.add.text(860,44,target
    ?(distance<48?'E · INTERACTÚA CON ':directionArrow(target.x-position.x,target.y-position.y)+'  '+distanceInSteps(target.x-position.x,target.y-position.y)+' pasos · ')+target.name
    :'El recorrido del Valle está completo',
    {fontFamily:'Arial',fontSize:'10px',fontStyle:'bold',color:'#f4d48d',align:'right',wordWrap:{width:305}}).setOrigin(1,0));

  add(scene.add.text(160,552,'TÚ · ubicación   1–9 · estaciones: dorada actual, verde visitada, gris bloqueada   C/M/P/E/G · personajes',{fontFamily:'Arial',fontSize:'9px',color:'#f4eedc'}));
  const close=add(scene.add.rectangle(827,45,54,30,0x35574c,.98).setStrokeStyle(1,0xe4c980).setInteractive({useHandCursor:true}));
  const closeText=add(scene.add.text(827,45,'CERRAR',{fontFamily:'Arial',fontSize:'10px',fontStyle:'bold',color:'#fff2d1'}).setOrigin(.5).setInteractive({useHandCursor:true}));
  close.on('pointerover',()=>close.setFillStyle(0x52725d));
  close.on('pointerout',()=>close.setFillStyle(0x35574c));
  close.on('pointerdown',()=>onClose?.());
  closeText.on('pointerdown',()=>onClose?.());
  return {objects,destroy(){for(const object of objects)object.destroy();objects.length=0;}};
}

