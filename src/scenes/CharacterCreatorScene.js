import { gameManager } from '../systems/GameManager.js';
import { drawBackdrop, drawAvatar, addButton } from '../systems/visuals.js';

export class CharacterCreatorScene extends Phaser.Scene {
  constructor(){ super('CharacterCreatorScene'); }
  create(){
    drawBackdrop(this,3);
    this.add.rectangle(480,300,960,600,0x122b32,.48);
    this.add.text(480,70,'ELIGE QUIÉN EMPRENDERÁ EL VIAJE',{fontFamily:'Arial',fontSize:'27px',fontStyle:'bold',color:'#fff1cb',letterSpacing:1}).setOrigin(.5);
    this.add.text(480,110,'Cada camino comienza con una mirada hacia dentro.',{fontFamily:'Arial',fontSize:'16px',color:'#e7ebd6'}).setOrigin(.5);
    this.cards=[];
    [['male','HOMBRE',300],['female','MUJER',660]].forEach(([gender,label,x])=>{
      const card=this.add.rectangle(x,325,250,330,gameManager.player.appearance.gender===gender?0x315e5e:0x26464d,.9).setStrokeStyle(3,gameManager.player.appearance.gender===gender?0xf1d18f:0xa9bcaa).setInteractive({useHandCursor:true});
      this.cards.push({gender,card}); drawAvatar(this,x,300,gender,1.8);
      this.add.text(x,440,label,{fontFamily:'Arial',fontSize:'21px',fontStyle:'bold',color:'#fff2d2',letterSpacing:2}).setOrigin(.5);
      card.on('pointerdown',()=>{gameManager.player.appearance.gender=gender;this.refreshCards();});
    });
    const nameBox=this.add.rectangle(480,505,290,43,0x17363e,.95).setStrokeStyle(1,0xb5c99e).setInteractive({useHandCursor:true});
    this.nameLabel=this.add.text(480,505,`Nombre: ${gameManager.player.name}  ✎`,{fontFamily:'Arial',fontSize:'16px',color:'#fff1cc'}).setOrigin(.5);
    nameBox.on('pointerdown',()=>{
      const value=window.prompt('¿Cómo te llamas?',gameManager.player.name);
      if(value?.trim()){gameManager.player.name=value.trim().slice(0,20);this.nameLabel.setText(`Nombre: ${gameManager.player.name}  ✎`);}
    });
    addButton(this,480,565,'EMPEZAR A EXPLORAR',()=>{gameManager.saveGame();this.scene.start('WorldMapScene');},280,50);
    this.refreshCards();
  }
  refreshCards(){ for(const {gender,card} of this.cards){ const selected=gameManager.player.appearance.gender===gender; card.setStrokeStyle(3,selected?0xf1d18f:0xa9bcaa);card.setFillStyle(selected?0x315e5e:0x26464d,.9); } }
}
