import { gameManager } from '../systems/GameManager.js';
import { drawBackdrop, addButton } from '../systems/visuals.js';
export class CharacterCreatorScene extends Phaser.Scene {
  constructor(){super('CharacterCreatorScene');}
  create(){
    drawBackdrop(this,3);this.add.rectangle(480,300,960,600,0x122b32,.48);
    this.add.text(480,66,'ELIGE QUIÉN EMPRENDERÁ EL VIAJE',{fontFamily:'Arial',fontSize:'26px',fontStyle:'bold',color:'#fff1cb',letterSpacing:1}).setOrigin(.5);
    this.add.text(480,104,'Cada camino comienza con una mirada hacia dentro.',{fontFamily:'Arial',fontSize:'16px',color:'#e7ebd6'}).setOrigin(.5);
    this.cards=[];
    [['male','HOMBRE',300,'heroMale'],['female','MUJER',660,'heroFemale']].forEach(([gender,label,x,key])=>{
      const card=this.add.rectangle(x,317,250,330,gameManager.player.appearance.gender===gender?0x315e5e:0x26464d,.9).setStrokeStyle(3,gameManager.player.appearance.gender===gender?0xf1d18f:0xa9bcaa).setInteractive({useHandCursor:true});
      this.cards.push({gender,card});
      const portrait=this.add.image(x,286,key);
      const source=this.textures.get(key).getSourceImage();
      portrait.setScale(Math.min(122/source.width,210/source.height));
      this.add.text(x,430,label,{fontFamily:'Arial',fontSize:'20px',fontStyle:'bold',color:'#fff2d2',letterSpacing:2}).setOrigin(.5);
      card.on('pointerdown',()=>{gameManager.player.appearance.gender=gender;this.refreshCards();});
    });
    const nameBox=this.add.rectangle(480,492,290,40,0x17363e,.95).setStrokeStyle(1,0xb5c99e).setInteractive({useHandCursor:true});
    this.nameLabel=this.add.text(480,492,`Nombre: ${gameManager.player.name}  ✎`,{fontFamily:'Arial',fontSize:'15px',color:'#fff1cc'}).setOrigin(.5);
    nameBox.on('pointerdown',()=>{const value=window.prompt('¿Cómo te llamas?',gameManager.player.name);if(value?.trim()){gameManager.player.name=value.trim().slice(0,20);this.nameLabel.setText(`Nombre: ${gameManager.player.name}  ✎`);}});
    addButton(this,480,552,'EMPEZAR A EXPLORAR',()=>{gameManager.saveGame();this.scene.start('ValleyScene');},280,48);this.refreshCards();
  }
  refreshCards(){for(const {gender,card} of this.cards){const on=gameManager.player.appearance.gender===gender;card.setStrokeStyle(3,on?0xf1d18f:0xa9bcaa);card.setFillStyle(on?0x315e5e:0x26464d,.9);}}
}
