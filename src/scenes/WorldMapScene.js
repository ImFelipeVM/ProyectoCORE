import { gameManager } from '../systems/GameManager.js';
import { EPISODES } from '../data/episodes.js';
import { drawBackdrop } from '../systems/visuals.js';

const STATIONS=[['EL HOGAR','⌂'],['EL YO','✦'],['EL ESPEJO','◉'],['EL PARQUE','♧'],['ÉTICA','▤'],['AMISTAD','♡'],['LIBERTAD','◇'],['VOCACIÓN','⌑']];
const POSITIONS=[{x:145,y:242},{x:368,y:242},{x:592,y:242},{x:815,y:242},{x:815,y:420},{x:592,y:420},{x:368,y:420},{x:145,y:420}];

export class WorldMapScene extends Phaser.Scene {
  constructor(){super('WorldMapScene');}
  create(){
    drawBackdrop(this,3);
    this.add.rectangle(480,300,960,600,0x112c32,.50);
    this.add.text(480,39,'EL CAMINO HACIA TI',{fontFamily:'Arial',fontSize:'27px',fontStyle:'bold',color:'#fff0c4',letterSpacing:3}).setOrigin(.5);
    this.add.text(480,74,'Ocho estaciones para descubrir quién quieres ser',{fontFamily:'Arial',fontSize:'15px',color:'#e4efdc'}).setOrigin(.5);
    const done=gameManager.player.completedEpisodes.length;
    this.add.rectangle(480,113,810,42,0x17353a,.8).setStrokeStyle(1,0xb5c69a);
    this.add.text(78,113,`${gameManager.player.name}  •  ${gameManager.player.score} pts`,{fontFamily:'Arial',fontSize:'14px',fontStyle:'bold',color:'#f3d691'}).setOrigin(0,.5);
    this.add.text(875,113,`${done}/8 estaciones`,{fontFamily:'Arial',fontSize:'14px',color:'#fff1d1'}).setOrigin(1,.5);
    // The winding trail is drawn first so each station rests on it.
    const path=this.add.graphics();
    for(let i=0;i<7;i++){
      const a=POSITIONS[i],b=POSITIONS[i+1],complete=gameManager.player.completedEpisodes.includes(i+1);
      path.lineStyle(11,complete?0xd8bb77:0x496c5a,.95).beginPath().moveTo(a.x,a.y).lineTo(b.x,b.y).strokePath();
      path.lineStyle(3,0xf2e0ad,.5).beginPath().moveTo(a.x,a.y).lineTo(b.x,b.y).strokePath();
    }
    EPISODES.forEach((ep,index)=>this.createStation(ep,index));
    this.add.text(480,520,'Toca la próxima estación iluminada para continuar.',{fontFamily:'Arial',fontSize:'15px',color:'#fff3d7'}).setOrigin(.5);
    this.add.text(28,568,'Pulsa una estación desbloqueada',{fontFamily:'Arial',fontSize:'13px',color:'#d6e5d3'});
    if(done>=8){
      const b=this.add.rectangle(822,562,230,49,0x315c56).setStrokeStyle(2,0xf0d38e).setInteractive({useHandCursor:true});
      this.add.text(822,562,'VER RESULTADOS',{fontFamily:'Arial',fontSize:'16px',fontStyle:'bold',color:'#fff2ce'}).setOrigin(.5);
      b.on('pointerdown',()=>this.scene.start('ResultsScene'));
    }
  }
  createStation(ep,index){
    const {x,y}=POSITIONS[index],locked=index+1>gameManager.player.currentEpisode,completed=gameManager.player.completedEpisodes.includes(ep.id),isNext=!locked&&!completed;
    const card=this.add.rectangle(x,y,174,133,locked?0x26393b:completed?0x31584c:0x31575b,.96).setStrokeStyle(2,completed?0xe4ca83:isNext?0xffe4a4:0x9fb39a);
    this.add.circle(x,y-15,31,locked?0x425252:completed?0xd2b671:isNext?0xe7c87e:0x88b6a5).setStrokeStyle(3,0xf7e6bc);
    this.add.text(x,y-16,locked?'·':completed?'✓':`${index+1}`,{fontFamily:'Arial',fontSize:'24px',fontStyle:'bold',color:locked?'#9aa9a1':'#263d3e'}).setOrigin(.5);
    const [name,glyph]=STATIONS[index];
    this.add.text(x,y+25,glyph,{fontFamily:'Arial',fontSize:'15px',color:'#f4d99c'}).setOrigin(.5);
    this.add.text(x,y+48,name,{fontFamily:'Arial',fontSize:'13px',fontStyle:'bold',color:locked?'#abb8ac':'#fff0cf',letterSpacing:1}).setOrigin(.5);
    if(isNext){
      const hit=this.add.rectangle(x,y,174,133,0xffffff,0).setInteractive({useHandCursor:true});
      hit.on('pointerover',()=>card.setFillStyle(0x47716b,.98));hit.on('pointerout',()=>card.setFillStyle(0x31575b,.96));
      hit.on('pointerdown',()=>this.scene.start('EpisodeScene',{episodeId:ep.id}));
    }
  }
}
