import { gameManager } from '../systems/GameManager.js';
import { drawBackdrop, drawAvatar, addButton } from '../systems/visuals.js';

export class ResultsScene extends Phaser.Scene {
  constructor(){super('ResultsScene');}
  create(){
    drawBackdrop(this,7);
    this.add.rectangle(480,300,960,600,0x11242c,.59);
    this.add.rectangle(480,300,720,485,0x18383c,.95).setStrokeStyle(2,0xd8c38f);
    this.add.text(480,90,'TU CAMINO, HASTA AQUÍ',{fontFamily:'Arial',fontSize:'29px',fontStyle:'bold',color:'#f2d393',letterSpacing:2}).setOrigin(.5);
    this.add.text(480,130,`${gameManager.player.name} • ocho decisiones tomadas`,{fontFamily:'Arial',fontSize:'16px',color:'#f1f1dd'}).setOrigin(.5);
    drawAvatar(this,480,245,gameManager.player.appearance.gender,1.08);
    const score=gameManager.player.score;
    this.add.text(480,335,`${score} puntos`,{fontFamily:'Arial',fontSize:'32px',fontStyle:'bold',color:'#fff1c9'}).setOrigin(.5);
    this.add.text(480,373,'Puntuación máxima posible: 80',{fontFamily:'Arial',fontSize:'13px',color:'#d5e1d5'}).setOrigin(.5);
    let message;
    if(score>=65)message='Has elegido con mucha coherencia. Sigue cultivando la responsabilidad, la amistad y la integridad.';
    else if(score>=30)message='Tu camino muestra avances y también preguntas abiertas. Cada reflexión puede convertirse en una práctica.';
    else if(score>=0)message='Has comenzado a observar tus decisiones. El autoconocimiento crece cuando conviertes cada tropiezo en aprendizaje.';
    else message='Algunas decisiones te alejaron de tus valores; reconocerlo ya abre una puerta para elegir distinto la próxima vez.';
    this.add.text(480,427,message,{fontFamily:'Arial',fontSize:'16px',color:'#fff4df',align:'center',wordWrap:{width:580},lineSpacing:4}).setOrigin(.5);
    addButton(this,480,510,'VOLVER AL INICIO',()=>{gameManager.resetGame();this.scene.start('MenuScene');},250,52);
    this.add.text(480,560,'La meta no es ser perfecto: es conocerte y elegir mejor.',{fontFamily:'Arial',fontSize:'14px',fontStyle:'italic',color:'#e7d5ad'}).setOrigin(.5);
  }
}
