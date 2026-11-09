import { gameManager } from '../systems/GameManager.js';
import { drawBackdrop, drawAvatar, addButton } from '../systems/visuals.js';

export class MenuScene extends Phaser.Scene {
  constructor() { super('MenuScene'); }
  create() {
    drawBackdrop(this, 6);
    this.add.rectangle(480,300,960,600,0x0b2028,.49);
    this.add.ellipse(480,478,500,65,0x10232a,.35);
    drawAvatar(this,480,355,gameManager.player.appearance.gender,.98);
    this.add.text(480,110,'CAMINO AL',{fontFamily:'Arial',fontSize:'25px',fontStyle:'bold',color:'#f5d995',letterSpacing:6}).setOrigin(.5);
    this.add.text(480,158,'AUTOCONOCIMIENTO',{fontFamily:'Arial',fontSize:'39px',fontStyle:'bold',color:'#fff5db',stroke:'#253e45',strokeThickness:7,letterSpacing:2}).setOrigin(.5);
    this.add.text(480,210,'Ocho decisiones. Una vida que puedes elegir.',{fontFamily:'Arial',fontSize:'17px',color:'#e9f1e8'}).setOrigin(.5);
    const resume=gameManager.player.completedEpisodes.length>0;
    addButton(this,480,485,resume?'CONTINUAR EL VIAJE':'COMENZAR EL VIAJE',()=>{
      if(resume) this.scene.start('WorldMapScene'); else this.scene.start('CharacterCreatorScene');
    },300,58);
    if(resume) addButton(this,480,552,'NUEVO VIAJE',()=>{
      gameManager.resetGame(); this.scene.start('CharacterCreatorScene');
    },180,38);
    this.add.text(22,570,'8 estaciones  •  3 decisiones por episodio  •  10–12 min',{fontFamily:'Arial',fontSize:'13px',color:'#e0e9dc'});
  }
}
