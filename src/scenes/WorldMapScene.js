import { gameManager } from '../systems/GameManager.js';
import { drawBackdrop } from '../systems/visuals.js';
const STATIONS=[['EL HOGAR','⌂'],['EL YO','✦'],['EL ESPEJO','◉'],['EL PARQUE','♧'],['ÉTICA','▤'],['AMISTAD','♡'],['LIBERTAD','◇'],['VOCACIÓN','⌑']];
const POS=[{x:145,y:242},{x:368,y:242},{x:592,y:242},{x:815,y:242},{x:815,y:420},{x:592,y:420},{x:368,y:420},{x:145,y:420}];
export class WorldMapScene extends Phaser.Scene {
 constructor(){super('WorldMapScene');}
 create(){
  drawBackdrop(this,3);this.add.rectangle(480,300,960,600,0x112c32,.50);
  this.add.text(480,39,'EL CAMINO HACIA TI',{fontFamily:'Arial',fontSize:'27px',fontStyle:'bold',color:'#fff0c4',letterSpacing:3}).setOrigin(.5);
  this.add.text(480,74,'Explora la primera estación: la infancia y el hogar',{fontFamily:'Arial',fontSize:'15px',color:'#e4efdc'}).setOrigin(.5);
  const done=gameManager.player.completedEpisodes.includes(1);
  this.add.rectangle(480,113,810,42,0x17353a,.8).setStrokeStyle(1,0xb5c69a);
  this.add.text(78,113,`${gameManager.player.name}  •  ${gameManager.player.score} pts`,{fontFamily:'Arial',fontSize:'14px',fontStyle:'bold',color:'#f3d691'}).setOrigin(0,.5);
  this.add.text(875,113,`${done?1:0}/1 episodio`,{fontFamily:'Arial',fontSize:'14px',color:'#fff1d1'}).setOrigin(1,.5);
  const path=this.add.graphics();for(let i=0;i<7;i++){const a=POS[i],b=POS[i+1];path.lineStyle(11,i===0&&done?0xd8bb77:0x496c5a,.95).beginPath().moveTo(a.x,a.y).lineTo(b.x,b.y).strokePath();path.lineStyle(3,0xf2e0ad,.5).beginPath().moveTo(a.x,a.y).lineTo(b.x,b.y).strokePath();}
  STATIONS.forEach((s,i)=>this.station(s,i,done));
  this.add.text(480,520,done?'Primera estación completada. Las demás se reservan para una versión futura.':'La primera estación está disponible. Las demás están cerradas en esta versión.',{fontFamily:'Arial',fontSize:'14px',color:'#fff3d7',align:'center'}).setOrigin(.5);
  this.add.text(28,568,'Una experiencia breve de exploración y reflexión',{fontFamily:'Arial',fontSize:'13px',color:'#d6e5d3'});
  if(done){const b=this.add.rectangle(822,562,230,49,0x315c56).setStrokeStyle(2,0xf0d38e).setInteractive({useHandCursor:true});this.add.text(822,562,'VER RESULTADOS',{fontFamily:'Arial',fontSize:'16px',fontStyle:'bold',color:'#fff2ce'}).setOrigin(.5);b.on('pointerdown',()=>this.scene.start('ResultsScene'));}
 }
 station([name,glyph],i,done){const{x,y}=POS[i],active=i===0&&!done,complete=i===0&&done;const card=this.add.rectangle(x,y,174,133,active?0x31575b:complete?0x31584c:0x26393b,.96).setStrokeStyle(2,complete?0xe4ca83:active?0xffe4a4:0x62736c);
  this.add.circle(x,y-15,31,active?0xe7c87e:complete?0xd2b671:0x425252).setStrokeStyle(3,0xf7e6bc);this.add.text(x,y-16,complete?'✓':active?'1':'·',{fontFamily:'Arial',fontSize:'24px',fontStyle:'bold',color:active||complete?'#263d3e':'#9aa9a1'}).setOrigin(.5);this.add.text(x,y+25,glyph,{fontFamily:'Arial',fontSize:'15px',color:'#f4d99c'}).setOrigin(.5);this.add.text(x,y+48,active||complete?name:'PRÓXIMAMENTE',{fontFamily:'Arial',fontSize:'12px',fontStyle:'bold',color:active||complete?'#fff0cf':'#abb8ac',letterSpacing:1}).setOrigin(.5);
  if(active){const hit=this.add.rectangle(x,y,174,133,0xffffff,0).setInteractive({useHandCursor:true});hit.on('pointerover',()=>card.setFillStyle(0x47716b,.98));hit.on('pointerout',()=>card.setFillStyle(0x31575b,.96));hit.on('pointerdown',()=>this.scene.start('EpisodeScene',{episodeId:1}));}
 }
}
