import { gameManager } from '../systems/GameManager.js';
import { drawBackdrop, addButton } from '../systems/visuals.js';
export class MenuScene extends Phaser.Scene {
  constructor(){super('MenuScene');}
  create(){
    drawBackdrop(this,6);this.add.rectangle(480,300,960,600,0x0b2028,.55);
    this.add.image(480,248,'caminoLogo').setDisplaySize(560,373);
    this.add.text(480,445,'Explora el Valle del Autoconocimiento',{fontFamily:'Arial',fontSize:'17px',color:'#e9f1e8'}).setOrigin(.5);
    addButton(this,480,505,'CONTINUAR EL VIAJE',()=>this.scene.start('ValleyScene'),320,58);
    addButton(this,480,562,'ELEGIR PERSONAJE',()=>this.scene.start('CharacterCreatorScene'),210,42);
    addButton(this,118,562,'¿CÓMO JUGAR?',()=>this.openInstructions(),186,42);
    if(gameManager.player.completedEpisodes.includes(1))addButton(this,830,562,'RESULTADOS',()=>this.scene.start('ResultsScene',gameManager.player.journey.complete?{kind:'journey'}:{}),170,42);
    this.add.text(20,580,'Episodio 1 · La infancia y el hogar',{fontFamily:'Arial',fontSize:'13px',color:'#e0e9dc'});
  }

  openInstructions(){
    this.instructionIndex=0;this.instructionUi=[];this.showInstructionPage();
  }

  showInstructionPage(){
    this.instructionUi.forEach(item=>item.destroy());this.instructionUi=[];
    const pages=[
      {title:'1 · UN CAMINO COTIDIANO',text:'Eres un estudiante universitario que empieza a preguntarse si sus decisiones nacen de una convicción propia o de la costumbre. Completa la conversación en casa y cruza al Valle para encontrarte con cuatro personas y sus dilemas.'},
      {title:'2 · CAMINA Y CONVERSA',text:'Muévete con WASD o las flechas. Acércate a los personajes y lugares y pulsa E para interactuar. Pulsa M para consultar el mapa. Lee el dilema y elige una respuesta con el ratón o las teclas 1, 2 y 3.'},
      {title:'3 · CRECE A TU MANERA',text:'Cada decisión suma 2, 1 o 0 puntos y muestra su explicación y lectura. Tres decisiones de crecimiento seguidas dan un punto de racha. Al final, tu árbol refleja el camino. No hay game over: cada ruta sigue avanzando.'}
    ];
    const page=pages[this.instructionIndex],add=object=>{object.setScrollFactor(0).setDepth(1500+this.instructionUi.length);this.instructionUi.push(object);return object;};
    add(this.add.rectangle(480,300,960,600,0x0e1717,.82).setInteractive());
    add(this.add.rectangle(480,300,760,390,0x1e3934,.99).setStrokeStyle(3,0xd8ba7a));
    add(this.add.text(480,176,page.title,{fontFamily:'Arial',fontSize:'22px',fontStyle:'bold',color:'#f4d48d',letterSpacing:1}).setOrigin(.5));
    add(this.add.text(480,285,page.text,{fontFamily:'Arial',fontSize:'16px',color:'#fff3df',align:'center',wordWrap:{width:620},lineSpacing:5}).setOrigin(.5));
    add(this.add.text(480,395,`${this.instructionIndex+1} / 3`,{fontFamily:'Arial',fontSize:'12px',fontStyle:'bold',color:'#d8ba7a'}).setOrigin(.5));
    const button=this.add.rectangle(480,460,245,50,0x47694f,.98).setStrokeStyle(2,0xe1ca8d).setInteractive({useHandCursor:true});
    const label=this.add.text(480,460,this.instructionIndex<2?'SIGUIENTE':'ELEGIR PERSONAJE',{fontFamily:'Arial',fontSize:'13px',fontStyle:'bold',color:'#fff3d0'}).setOrigin(.5);
    add(button);add(label);button.on('pointerdown',()=>{if(this.instructionIndex<2){this.instructionIndex+=1;this.showInstructionPage();}else{this.instructionUi.forEach(item=>item.destroy());this.scene.start('CharacterCreatorScene');}});
  }
}
