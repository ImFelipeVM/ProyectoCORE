import { gameManager } from '../systems/GameManager.js';
import { EPISODE_1, HOME_INTERACTABLES, STUDY_MATERIALS } from '../data/episode1.js';
import { EPISODE_1_STUDY_DURATION_MS, Episode1Progress } from '../systems/episode1Progress.js';
import { RpgCharacter, createRpgAnimations } from '../entities/RpgCharacter.js';
import { createWorldMapOverlay } from '../systems/worldMapOverlay.js';
import { createOverlayCamera } from '../systems/overlayCamera.js';

const WIDTH=960, HEIGHT=600, MAP_WIDTH=2048, MAP_HEIGHT=608;
const FURNITURE={sofa:0,coffee:1,tv:2,shelf:3,plant:4,fridge:5,stove:6,sink:7,dining:8,bed:9,desk:10,backpack:11,calendar:12};
const DETAIL={doorOpen:0,doorClosed:1,window:2,chair:3,familyPhoto:4,books:5,computer:6,laptop:7,lamp:8,openBook:9,flowers:10,clock:11,placeSetting:12,spices:13,landscape:14,runner:15};

export class EpisodeScene extends Phaser.Scene {
  constructor(){super('EpisodeScene');this.ui=[];this.blockers=[];this.solids=[];}

  init(data={}){
    this.ui=[];this.blockers=[];this.solids=[];this.family=[];
    this.episodeId=Number(data.episodeId??1);
    this.fromValley=Boolean(data.fromValley);
    this.returnX=Number(data.returnX??2455);
    this.returnY=Number(data.returnY??1280);
    this.progress=new Episode1Progress(gameManager.player.episode1Progress||{});
    this.dialogue=null;this.scheduleMode=false;this.organizerMode=false;this.studyMode=null;this.studyElapsed=this.progress.studyElapsedMs;this.mapOverlay=null;
  }

  create(){
    if(this.episodeId!==1){this.scene.start('ValleyScene');return;}
    if(gameManager.player.completedEpisodes.includes(1)){this.scene.start('ResultsScene');return;}
    createRpgAnimations(this);
    this.physics.world.setBounds(0,0,MAP_WIDTH,MAP_HEIGHT);
    this.cameras.main.setBounds(0,0,MAP_WIDTH,MAP_HEIGHT);
    this.add.image(0,0,'homeMap').setOrigin(0).setDepth(-100);
    this.createArchitecture();
    this.createFurniture();
    this.createFamily();
    this.createPlayer();
    this.createPhysics();
    this.overlayUi=createOverlayCamera(this,WIDTH,HEIGHT);
    this.createHud();
    this.cursors=this.input.keyboard.createCursorKeys();
    this.keys=this.input.keyboard.addKeys('W,A,S,D,E,ESC,X,ENTER,M');
    this.refreshMission();
    this.updateLocation(true);
    this.cameras.main.startFollow(this.player,true,.10,.10);
    this.cameras.main.setDeadzone(230,150);
    this.cameras.main.setRoundPixels(true);
    this.tweens.add({targets:this.hint,alpha:.72,duration:800,yoyo:true,repeat:-1});
    if(this.fromValley&&!this.progress.flags.home){
      this.progress.complete('home');
      this.refreshMission();
      this.showHint('MISIÓN 1 COMPLETADA · Ya estás en casa. Busca a tus padres en la sala.');
    }
    this.events.once('shutdown',()=>this.saveProgress());
  }

  createArchitecture(){
    // The world remains continuous: each doorway connects to the next room on the same map.
    for(const x of [512,1024,1536,1664]){
      this.staticBlock(x,145,26,162);
      this.staticBlock(x,455,26,178);
      this.detail(DETAIL.doorOpen,x,300,68,124,false);
    }
    // The house's outer walls and bounds keep the player on the walkable floor.
    this.staticBlock(MAP_WIDTH/2,65,MAP_WIDTH,18);
    this.staticBlock(MAP_WIDTH/2,543,MAP_WIDTH,18);
    // Closed pantry door on the kitchen wall, with a real immovable body.
    this.detail(DETAIL.doorClosed,1470,164,72,108,true);
    // Wall windows and framed pictures from the added pixel-art asset atlas.
    for(const [frame,x,y,w,h] of [
      [DETAIL.window,720,88,104,72],[DETAIL.window,1220,88,104,72],[DETAIL.window,1870,88,104,72],
      [DETAIL.familyPhoto,885,170,62,62],[DETAIL.landscape,1160,170,64,54],[DETAIL.familyPhoto,1810,170,62,62],
      [DETAIL.clock,1510,182,52,60]
    ]) this.detail(frame,x,y,w,h,false);
    this.detail(DETAIL.runner,1595,300,72,138,false);
  }

  createFurniture(){
    // Existing handcrafted furniture atlas.
    this.prop(FURNITURE.plant,95,315,80,92,true);
    this.prop(FURNITURE.plant,445,405,76,86,true);
    this.prop(FURNITURE.sofa,650,350,145,118,true);
    this.prop(FURNITURE.coffee,820,415,100,76,true);
    this.prop(FURNITURE.tv,930,252,100,95,true);
    this.prop(FURNITURE.shelf,565,235,84,96,true);
    this.prop(FURNITURE.fridge,1090,262,84,116,true);
    this.prop(FURNITURE.stove,1200,266,86,86,true);
    this.prop(FURNITURE.sink,1400,270,86,84,true);
    this.prop(FURNITURE.dining,1280,406,132,112,true);
    this.prop(FURNITURE.bed,1782,390,142,122,true);
    this.prop(FURNITURE.desk,1900,344,126,104,true);
    this.backpackProp=this.prop(FURNITURE.backpack,1750,430,68,76,true);
    this.orderedMaterials=this.detail(DETAIL.books,1888,371,54,38,false).setVisible(false);
    this.prop(FURNITURE.calendar,1980,214,58,58,false);
    // Added pixel-art detail sprites: chairs, computer, books, study lamp, and table settings.
    for(const [frame,x,y,w,h,solid] of [
      [DETAIL.chair,1200,420,58,62,true],[DETAIL.chair,1355,420,58,62,true],
      [DETAIL.chair,1850,425,55,60,true],[DETAIL.computer,1942,326,72,62,true],
      [DETAIL.books,1802,330,58,55,true],[DETAIL.lamp,1850,326,50,58,false],
      [DETAIL.openBook,1865,344,45,36,false],[DETAIL.placeSetting,1255,387,40,42,false],
      [DETAIL.placeSetting,1310,387,40,42,false],[DETAIL.spices,1145,287,48,48,false],
      [DETAIL.flowers,880,280,47,54,true]
    ]) {
      const prop=this.detail(frame,x,y,w,h,solid);
      if(frame===DETAIL.placeSetting){prop.setVisible(false);if(!this.tableSettings)this.tableSettings=[];this.tableSettings.push(prop);}
    }
  }

  createFamily(){
    // Small animated actors inhabit the room; supplied portraits remain in the dialogue UI.
    this.family=[
      this.actor(760,405,'npcMotherSprites','npcMother','MAMÁ'),
      this.actor(844,405,'npcFatherSprites','npcFather','PAPÁ')
    ];
  }

  actor(x,y,texture,animationPrefix,name){
    const actor=new RpgCharacter(this,{x,y,texture,animationPrefix,player:false,name});
    actor.move(0,0);
    actor.nameLabel=this.add.text(x,y-28,name,{fontFamily:'Arial',fontSize:'10px',fontStyle:'bold',color:'#fff4d6',stroke:'#25211e',strokeThickness:4}).setOrigin(.5,1).setDepth(y+60);
    return actor;
  }

  createPlayer(){
    const female=gameManager.player.appearance.gender==='female';
    this.player=new RpgCharacter(this,{x:350,y:370,texture:female?'heroFemaleSprites':'heroMaleSprites',animationPrefix:female?'heroFemale':'heroMale',player:true,name:gameManager.player.name});
    this.player.move(0,0);
    this.playerName=this.add.text(this.player.x,this.player.y-27,gameManager.player.name,{fontFamily:'Arial',fontSize:'10px',fontStyle:'bold',color:'#fff4d6',stroke:'#25211e',strokeThickness:4}).setOrigin(.5,1).setDepth(this.player.y+60);
  }

  createPhysics(){
    for(const body of [...this.blockers,...this.solids]) this.physics.add.collider(this.player,body);
    for(const actor of this.family) this.physics.add.collider(this.player,actor);
    this.physics.world.setBoundsCollision(true,true,true,true);
  }

  staticBlock(x,y,width,height){
    const object=this.add.rectangle(x,y,width,height,0x000000,0).setVisible(false);
    this.physics.add.existing(object,true);this.blockers.push(object);return object;
  }

  prop(frame,x,y,width,height,solid=false){
    const object=this.add.image(x,y,'homeProps',frame).setDisplaySize(width,height).setDepth(y);
    if(solid)this.makeSolid(object);return object;
  }

  detail(frame,x,y,width,height,solid=false){
    const object=this.add.image(x,y,'homeDetails',frame).setDisplaySize(width,height).setDepth(y);
    if(solid)this.makeSolid(object);return object;
  }

  makeSolid(object){
    this.physics.add.existing(object,true);
    object.body.setSize(object.displayWidth*.82,object.displayHeight*.62);
    object.body.setOffset(object.displayWidth*.09,object.displayHeight*.32);
    this.solids.push(object);return object;
  }

  createHud(){
    this.hud=this.add.container(0,0).setScrollFactor(0).setDepth(1000);
    this.overlayUi.layer.add(this.hud);
    this.hud.add(this.add.rectangle(220,39,410,62,0x263d36,.96).setStrokeStyle(2,0xe0bd7c));
    this.hud.add(this.add.text(25,17,'01 / 08  ·  LA INFANCIA Y EL HOGAR',{fontFamily:'Arial',fontSize:'14px',fontStyle:'bold',color:'#ffe8b2'}));
    this.missionText=this.add.text(25,39,'',{fontFamily:'Arial',fontSize:'12px',color:'#fff8e6',wordWrap:{width:390}});
    this.hud.add(this.missionText);
    this.location=this.add.text(660,39,'',{fontFamily:'Arial',fontSize:'13px',fontStyle:'bold',color:'#fff0c8',backgroundColor:'#263d36dd',padding:{x:9,y:7}}).setOrigin(.5);
    this.hud.add(this.location);
    this.hud.add(this.add.text(920,39,'M MAPA  ·  E EXAMINAR  ·  X DISCUTIR',{fontFamily:'Arial',fontSize:'11px',fontStyle:'bold',color:'#fff0cf',backgroundColor:'#263d36dd',padding:{x:8,y:7}}).setOrigin(1,.5));
    this.hint=this.overlayUi.add(this.add.text(480,564,'WASD / FLECHAS para moverte  ·  E para interactuar  ·  X para discutir',{fontFamily:'Arial',fontSize:'13px',fontStyle:'bold',color:'#fff4dc',stroke:'#40352b',strokeThickness:4,backgroundColor:'#263d36dd',padding:{x:11,y:7}}).setOrigin(.5),1001);
  }

  refreshMission(){
    const complete=mission=>mission.id==='backpack'?this.progress.flags.backpack&&this.progress.flags.study:Boolean(this.progress.flags[mission.id]);
    const mission=EPISODE_1.missions.find(item=>!complete(item));
    const done=EPISODE_1.missions.filter(complete).length;
    this.missionText.setText(mission?`MISIÓN ${done+1}/${EPISODE_1.missions.length}: ${mission.title} · ${mission.area}`:'Vuelve con tus padres para cerrar la reflexión.');
    gameManager.player.episode1Progress=this.progress.serialize();gameManager.saveGame();
  }

  updateLocation(force=false){
    const x=this.player?.x??250;
    const name=x<512?'VESTÍBULO':x<1024?'SALA':x<1536?'COCINA Y COMEDOR':x<1664?'PASILLO':'HABITACIÓN Y ESTUDIO';
    if(force||name!==this.currentLocation){this.currentLocation=name;this.location?.setText(name);if(!force&&this.location){this.location.setAlpha(.35);this.tweens.add({targets:this.location,alpha:1,duration:260});}}
  }

  update(_time,delta){
    if(!this.player?.active)return;
    if(this.mapOverlay){this.player.move(0,0);if(Phaser.Input.Keyboard.JustDown(this.keys.M)||Phaser.Input.Keyboard.JustDown(this.keys.ESC))this.closeWorldMap();return;}
    if(this.dialogue){this.player.move(0,0);if(Phaser.Input.Keyboard.JustDown(this.keys.E)||Phaser.Input.Keyboard.JustDown(this.keys.ENTER))this.advanceDialogue();else if(Phaser.Input.Keyboard.JustDown(this.keys.ESC))this.closeDialogue(false);return;}
    if(this.scheduleMode){this.updateSchedule();return;}
    if(this.organizerMode){this.updateOrganizer();return;}
    if(this.studyMode){this.updateStudy(delta);return;}
    if(Phaser.Input.Keyboard.JustDown(this.keys.M)){this.openWorldMap();return;}
    if(Phaser.Input.Keyboard.JustDown(this.keys.ESC)){this.showHint('Busca la puerta de entrada y acércate para salir.');return;}
    const left=this.cursors.left.isDown||this.keys.A.isDown,right=this.cursors.right.isDown||this.keys.D.isDown;
    const up=this.cursors.up.isDown||this.keys.W.isDown,down=this.cursors.down.isDown||this.keys.S.isDown;
    const dx=(right?1:0)-(left?1:0),dy=(down?1:0)-(up?1:0);
    this.player.move(dx,dy);
    this.playerName.setPosition(this.player.x,this.player.y-27).setDepth(this.player.y+60);
    this.updateLocation();
    const nearest=this.nearestInteractable();
    if(nearest&&nearest.distance<110){
      const facing=this.isFacing(nearest.item);
      this.hint.setText(facing?(nearest.item.id==='parents'&&this.progress.flags.family?'E conversar  ·  X discutir':`E  ·  ${nearest.item.name}`):`Mira hacia ${nearest.item.name}`);
      if(facing&&Phaser.Input.Keyboard.JustDown(this.keys.E))this.interact(nearest.item);
      else if(facing&&nearest.item.id==='parents'&&this.progress.flags.family&&Phaser.Input.Keyboard.JustDown(this.keys.X))this.argue();
    }else this.hint.setText('WASD / FLECHAS para moverte  ·  E para interactuar  ·  X para discutir');
  }

  nearestInteractable(){
    let nearest=null;
    for(const item of HOME_INTERACTABLES){const d=Phaser.Math.Distance.Between(this.player.x,this.player.y,item.x,item.y);if(!nearest||d<nearest.distance)nearest={item,distance:d};}
    return nearest;
  }

  isFacing(item){
    const dx=item.x-this.player.x,dy=item.y-this.player.y;
    if(this.player.facing==='left')return dx<0&&Math.abs(dx)>Math.abs(dy)*.55;
    if(this.player.facing==='right')return dx>0&&Math.abs(dx)>Math.abs(dy)*.55;
    if(this.player.facing==='up')return dy<0&&Math.abs(dy)>Math.abs(dx)*.55;
    return dy>0&&Math.abs(dy)>Math.abs(dx)*.55;
  }

  interact(item){
    if(item.id==='parents'){this.talkToFamily();return;}
    if(item.id==='exit'){this.leaveHome();return;}
    if(item.id==='report'){this.inspectReport();return;}
    if(item.id==='schedule'){this.openSchedule();return;}
    if(item.id==='desk'){if(this.progress.flags.backpack)this.startStudy();else this.organizeMaterials();return;}
    if(item.id==='chore'){this.doChore();return;}
  }

  talkToFamily(){
    if(this.progress.flags.family){
      if(this.progress.flags.reflection){
        this.openDialogue([{name:'MAMÁ',portrait:'portraitParentB',text:'Ya conversamos sobre lo que aprendiste. Puedes seguir recorriendo el Valle.'}],()=>{});
      }else if(this.progress.responsibleReady){
        this.openDialogue([{name:'MAMÁ',portrait:'portraitParentB',text:'Cumpliste lo que acordamos: organizaste tu horario, estudiaste y colaboraste en casa. ¿Qué te ayudó a sostener esos compromisos?'},{name:'PAPÁ',portrait:'portraitParentA',text:'El horario queda en pie, y puedes pedir ayuda si una materia se complica. Los límites y el apoyo pueden convivir.'}],()=>{this.progress.complete('reflection');this.refreshMission();this.finishEpisode();});
      }else this.openDialogue([{name:'PAPÁ',portrait:'portraitParentA',text:'El acuerdo sigue pendiente. Aún puedes revisar tu evaluación, organizar tu horario y cumplir las tareas que asumiste.'}],()=>{});
      return;
    }
    this.openDialogue([
      {name:'MAMÁ',portrait:'portraitParentB',text:'Vimos que tus últimas calificaciones bajaron. Te queremos y vamos a ayudarte; también vamos a acordar límites para las pantallas y horarios de estudio.'},
      {name:'MAMÁ',portrait:'portraitParentB',text:EPISODE_1.theory,highlights:true},
      {name:'PAPÁ',portrait:'portraitParentA',text:'El horario y las tareas de casa son parte del acuerdo. Revisa la evaluación, prepara un plan, ordena tus materiales, estudia un rato y ayuda a poner la mesa. Las acciones mostrarán qué entendiste.'}
    ],()=>{this.progress.complete('family');this.progress.complete('promise');this.refreshMission();this.showHint('Escuchaste el acuerdo. Tus próximos pasos dependen de lo que hagas por la casa.');});
  }

  argue(){
    if(!this.progress.flags.family||this.progress.flags.argued)return;
    this.progress.complete('argued');this.refreshMission();
    this.openDialogue([{name:'PAPÁ',portrait:'portraitParentA',text:'Interrumpiste la conversación y rechazaste el acuerdo. El enojo es comprensible; discutir ahora cierra el diálogo. La familia mantiene los límites y hablarán de nuevo cuando estés listo.'}],()=>{this.progress.complete('reflection');this.refreshMission();this.finishEpisode();});
  }

  inspectReport(){
    if(!this.progress.flags.family){this.openDialogue([{name:'EVALUACIÓN',portrait:null,text:'La hoja está sobre el escritorio, pero primero necesitas hablar con tus padres para conocer el acuerdo familiar.'}],()=>{});return;}
    if(this.progress.flags.report){this.showHint('Ya revisaste la evaluación.');return;}
    this.openDialogue([{name:'EVALUACIÓN',portrait:null,text:'Resultado: 3,2 / 5. Hay tareas sin entregar y dos temas que requieren repaso. La nota describe tu desempeño actual; no define tu capacidad. Elige una materia concreta para empezar.'}],()=>{this.progress.complete('report');this.refreshMission();});
  }

  openSchedule(){
    if(!this.progress.flags.report){this.openDialogue([{name:'CALENDARIO',portrait:null,text:'Primero revisa la evaluación para identificar qué tema y qué tareas deben tener un espacio en el horario.'}],()=>{});return;}
    if(this.progress.flags.schedule){this.showHint(`Tu horario quedó organizado: ${this.progress.studyHours} bloques de estudio.`);return;}
    this.scheduleMode=true;this.scheduleHours=2;this.player.move(0,0);
    this.scheduleUI=[];
    const add=object=>{this.scheduleUI.push(this.overlayUi.add(object,1100+this.scheduleUI.length));return object;};
    const shade=add(this.add.rectangle(480,300,960,600,0x101c1a,.18));
    const panel=add(this.add.rectangle(480,310,500,190,0x263d36,.97).setStrokeStyle(3,0xe0bd7c));
    const title=add(this.add.text(480,248,'ORGANIZA TU HORARIO',{fontFamily:'Arial',fontSize:'19px',fontStyle:'bold',color:'#f4d48d'}).setOrigin(.5));
    this.scheduleValue=add(this.add.text(480,306,'',{fontFamily:'Arial',fontSize:'18px',fontStyle:'bold',color:'#fff4df'}).setOrigin(.5));
    const help=add(this.add.text(480,350,'Ajusta tus bloques y guarda el plan',{fontFamily:'Arial',fontSize:'13px',color:'#fff1d5'}).setOrigin(.5));
    const minus=this.makeUiButton(365,306,48,44,'−',()=>{this.scheduleHours=Math.max(1,this.scheduleHours-1);this.updateScheduleLabel();});
    const plus=this.makeUiButton(595,306,48,44,'+',()=>{this.scheduleHours=Math.min(4,this.scheduleHours+1);this.updateScheduleLabel();});
    const save=this.makeUiButton(480,408,150,40,'GUARDAR',()=>this.saveSchedule());
    const cancel=this.makeUiButton(480,457,150,34,'CERRAR',()=>this.closeSchedule());
    this.scheduleUI.push(...minus,...plus,...save,...cancel);this.updateScheduleLabel();
  }

  updateSchedule(){
    this.player.move(0,0);
    if(Phaser.Input.Keyboard.JustDown(this.cursors.left))this.scheduleHours=Math.max(1,this.scheduleHours-1);
    if(Phaser.Input.Keyboard.JustDown(this.cursors.right))this.scheduleHours=Math.min(4,this.scheduleHours+1);
    this.updateScheduleLabel();
    if(Phaser.Input.Keyboard.JustDown(this.keys.ESC)){this.closeSchedule();return;}
    if(Phaser.Input.Keyboard.JustDown(this.keys.E)||Phaser.Input.Keyboard.JustDown(this.keys.ENTER))this.saveSchedule();
  }

  saveSchedule(){if(!this.scheduleMode)return;this.progress.studyHours=this.scheduleHours;this.progress.complete('schedule');this.refreshMission();this.closeSchedule();this.openDialogue([{name:'CALENDARIO',portrait:null,text:`Guardaste un horario con ${this.scheduleHours} bloques de estudio. Reserva pausas y revisa al final del día si el plan fue realista.`}],()=>{});}
  updateScheduleLabel(){if(this.scheduleValue)this.scheduleValue.setText(`${this.scheduleHours} bloques / día`);}
  closeSchedule(){this.scheduleUI?.forEach(o=>o.destroy());this.scheduleUI=null;this.scheduleMode=false;}

  organizeMaterials(){
    if(!this.progress.flags.report){this.openDialogue([{name:'MOCHILA',portrait:null,text:'Antes de ordenar tus cuadernos, revisa la evaluación para saber qué materia necesita atención.'}],()=>{});return;}
    if(!this.progress.flags.schedule){this.openDialogue([{name:'MOCHILA',portrait:null,text:'Tu evaluación ya señala qué repasar. Prepara primero un horario para decidir cuándo usar estos materiales.'}],()=>{});return;}
    if(this.progress.flags.backpack){this.showHint('Tus cuadernos y materiales ya están organizados. Ve al escritorio a estudiar.');return;}
    this.openOrganizer();
  }

  startStudy(){
    if(!this.progress.flags.report||!this.progress.flags.schedule||!this.progress.flags.backpack){
      const next=!this.progress.flags.report?'revisar la evaluación':!this.progress.flags.schedule?'preparar el horario':'organizar los cinco materiales en el escritorio';
      this.openDialogue([{name:'ESCRITORIO',portrait:null,text:`Antes de estudiar necesitas ${next}. La misión no avanzará hasta completar ese paso.`}],()=>{});return;
    }
    if(this.progress.flags.study){this.showHint('Ya cumpliste tu periodo de estudio.');return;}
    this.studyElapsed=this.progress.studyElapsedMs;this.lastStudySaveSecond=Math.floor(this.studyElapsed/1000);this.studyMode='running';this.player.move(0,0);this.createStudyUI();
  }

  updateStudy(delta){
    this.player.move(0,0);
    if(this.studyMode==='complete'){
      if(Phaser.Input.Keyboard.JustDown(this.keys.E)||Phaser.Input.Keyboard.JustDown(this.keys.ENTER)||Phaser.Input.Keyboard.JustDown(this.keys.ESC))this.closeStudyUI();
      return;
    }
    if(Phaser.Input.Keyboard.JustDown(this.keys.ESC)){this.closeStudyUI();return;}
    this.studyElapsed=Math.min(EPISODE_1_STUDY_DURATION_MS,this.studyElapsed+delta);
    this.progress.studyElapsedMs=Math.floor(this.studyElapsed);
    this.updateStudyUI();
    if(this.studyElapsed>=EPISODE_1_STUDY_DURATION_MS){
      this.progress.studyElapsedMs=EPISODE_1_STUDY_DURATION_MS;
      this.progress.complete('study');this.studyMode='complete';this.refreshMission();this.saveProgress();this.updateStudyUI();
    }else if(Math.floor(this.studyElapsed/1000)!==this.lastStudySaveSecond){
      this.lastStudySaveSecond=Math.floor(this.studyElapsed/1000);this.saveProgress();
    }
  }

  openOrganizer(){this.organizerMode=true;this.organizerSelected=STUDY_MATERIALS.findIndex(item=>!this.progress.organizedMaterials.includes(item.id));if(this.organizerSelected<0)this.organizerSelected=0;this.createOrganizerUI();}

  createOrganizerUI(){
    this.destroyOrganizerUI();
    const add=object=>{this.organizerUI.push(this.overlayUi.add(object,1100+this.organizerUI.length));return object;};
    this.organizerUI=[];this.organizerCards=[];
    add(this.add.rectangle(480,300,960,600,0x101c1a,.54).setInteractive());
    add(this.add.rectangle(480,300,650,430,0x263d36,.98).setStrokeStyle(3,0xe0bd7c));
    add(this.add.text(480,115,'ORGANIZA TU ESPACIO DE ESTUDIO',{fontFamily:'Arial',fontSize:'20px',fontStyle:'bold',color:'#f4d48d'}).setOrigin(.5));
    add(this.add.text(480,144,'Selecciona cada material para colocarlo junto al escritorio.',{fontFamily:'Arial',fontSize:'13px',color:'#fff2d7'}).setOrigin(.5));
    for(let i=0;i<STUDY_MATERIALS.length;i++){
      const item=STUDY_MATERIALS[i],ordered=this.progress.organizedMaterials.includes(item.id),y=190+i*48;
      const plate=add(this.add.rectangle(480,y,520,40,ordered?0x3d6655:0x344b43,.98).setStrokeStyle(2,i===this.organizerSelected?0xffdc88:0x819486).setInteractive({useHandCursor:true}));
      const icon=add(this.add.text(252,y,item.glyph,{fontFamily:'Arial',fontSize:'15px',fontStyle:'bold',color:'#f2d18a'}).setOrigin(.5));
      const label=add(this.add.text(282,y,item.label,{fontFamily:'Arial',fontSize:'13px',fontStyle:'bold',color:'#fff4df'}).setOrigin(0,.5));
      const status=add(this.add.text(715,y,ordered?'ORDENADO':'CLIC / E',{fontFamily:'Arial',fontSize:'10px',fontStyle:'bold',color:ordered?'#bde1aa':'#f4d48d'}).setOrigin(1,.5));
      plate.on('pointerover',()=>{if(!ordered)plate.setFillStyle(0x496a5b);});
      plate.on('pointerout',()=>plate.setFillStyle(ordered?0x3d6655:0x344b43));
      plate.on('pointerdown',()=>this.sortMaterial(item.id));
      icon.setInteractive({useHandCursor:true}).on('pointerdown',()=>this.sortMaterial(item.id));
      label.setInteractive({useHandCursor:true}).on('pointerdown',()=>this.sortMaterial(item.id));
      status.setInteractive({useHandCursor:true}).on('pointerdown',()=>this.sortMaterial(item.id));
      this.organizerCards.push({item,plate,icon,label,status});
    }
    const allDone=this.progress.flags.backpack;
    add(this.add.text(480,435,allDone?'MATERIALES ORGANIZADOS · Ya puedes estudiar.':'Ordenados: '+this.progress.organizedMaterials.length+'/'+STUDY_MATERIALS.length,{fontFamily:'Arial',fontSize:'12px',fontStyle:'bold',color:allDone?'#c7e5aa':'#f3e7c9'}).setOrigin(.5));
    const close=this.makeUiButton(480,476,148,34,allDone?'LISTO':'CERRAR',()=>this.closeOrganizer());
    this.organizerUI.push(...close);
  }

  destroyOrganizerUI(){this.organizerUI?.forEach(object=>object.destroy());this.organizerUI=[];this.organizerCards=[];}
  updateOrganizer(){
    this.player.move(0,0);
    if(Phaser.Input.Keyboard.JustDown(this.keys.ESC)){this.closeOrganizer();return;}
    const up=Phaser.Input.Keyboard.JustDown(this.cursors.up),down=Phaser.Input.Keyboard.JustDown(this.cursors.down);
    if(up)this.organizerSelected=(this.organizerSelected+STUDY_MATERIALS.length-1)%STUDY_MATERIALS.length;
    if(down)this.organizerSelected=(this.organizerSelected+1)%STUDY_MATERIALS.length;
    if(up||down)this.createOrganizerUI();
    if(Phaser.Input.Keyboard.JustDown(this.keys.E)||Phaser.Input.Keyboard.JustDown(this.keys.ENTER))this.sortMaterial(STUDY_MATERIALS[this.organizerSelected].id);
  }
  sortMaterial(id){
    const changed=this.progress.organizeMaterial(id);
    if(!changed)return;
    const next=STUDY_MATERIALS.findIndex(item=>!this.progress.organizedMaterials.includes(item.id));
    if(next>=0)this.organizerSelected=next;
    else {this.backpackProp.setVisible(false);if(this.backpackProp.body)this.backpackProp.body.enable=false;this.orderedMaterials.setVisible(true);this.refreshMission();}
    this.saveProgress();this.createOrganizerUI();
  }
  closeOrganizer(){if(!this.organizerMode)return;this.organizerMode=false;this.destroyOrganizerUI();this.showHint(this.progress.flags.backpack?'Materiales listos. Interactúa con el escritorio para estudiar.':`Progreso guardado: ${this.progress.organizedMaterials.length}/${STUDY_MATERIALS.length} materiales ordenados.`);}

  createStudyUI(){
    this.studyUI=[];
    const add=object=>{this.studyUI.push(this.overlayUi.add(object,1120+this.studyUI.length));return object;};
    add(this.add.rectangle(480,300,960,600,0x101c1a,.58).setInteractive());
    add(this.add.rectangle(480,300,560,250,0x263d36,.98).setStrokeStyle(3,0xe0bd7c));
    this.studyTitle=add(this.add.text(480,220,'PERIODO DE ESTUDIO',{fontFamily:'Arial',fontSize:'20px',fontStyle:'bold',color:'#f4d48d'}).setOrigin(.5));
    this.studyStatus=add(this.add.text(480,258,'Permanece en el escritorio hasta completar el periodo.',{fontFamily:'Arial',fontSize:'13px',color:'#fff2d7'}).setOrigin(.5));
    add(this.add.rectangle(480,310,440,22,0x172924).setStrokeStyle(1,0x9db594));
    this.studyBar=add(this.add.rectangle(261,310,2,16,0xe0bd7c).setOrigin(0,.5));
    this.studyTimer=add(this.add.text(480,349,'',{fontFamily:'Arial',fontSize:'16px',fontStyle:'bold',color:'#fff4df'}).setOrigin(.5));
    this.studyClose=this.makeUiButton(480,407,170,38,'PAUSAR · ESC',()=>this.closeStudyUI());this.studyUI.push(...this.studyClose);
    this.updateStudyUI();
  }
  updateStudyUI(){
    if(!this.studyUI?.length)return;
    const ratio=Math.min(1,this.studyElapsed/EPISODE_1_STUDY_DURATION_MS);
    this.studyBar.setDisplaySize(Math.max(2,440*ratio),16);
    if(this.studyMode==='complete'){
      this.studyTitle.setText('PERIODO COMPLETADO');this.studyStatus.setText('El estudio quedó registrado. La misión 5 ya está actualizada.');this.studyTimer.setText('COMPLETADO');
      this.studyClose[0].setFillStyle(0x496a52);this.studyClose[1].setText('CERRAR');
    }else{
      const remaining=Math.max(0,(EPISODE_1_STUDY_DURATION_MS-this.studyElapsed)/1000);
      this.studyTimer.setText(`${remaining.toFixed(1)} s restantes`);
      this.studyClose[0].setFillStyle(0x35574c);this.studyClose[1].setText('PAUSAR · ESC');
    }
  }
  closeStudyUI(){
    if(!this.studyMode)return;
    const completed=this.studyMode==='complete';this.studyMode=null;this.studyUI?.forEach(object=>object.destroy());this.studyUI=[];this.saveProgress();
    this.showHint(completed?'Estudio completado. Puedes continuar con la tarea doméstica.':`Estudio pausado; se guardó el avance (${Math.floor(this.progress.studyElapsedMs/1000)} s). Vuelve al escritorio para retomarlo.`);
  }

  makeUiButton(x,y,width,height,label,callback){
    const plate=this.overlayUi.add(this.add.rectangle(x,y,width,height,0x35574c,.98).setStrokeStyle(2,0xd8ba7a).setInteractive({useHandCursor:true}),1125);
    const text=this.overlayUi.add(this.add.text(x,y,label,{fontFamily:'Arial',fontSize:'12px',fontStyle:'bold',color:'#fff2d1',align:'center'}).setOrigin(.5).setInteractive({useHandCursor:true}),1126);
    const activate=()=>{plate.setFillStyle(0x52725d);callback();};
    plate.on('pointerover',()=>plate.setFillStyle(0x496b58));plate.on('pointerout',()=>plate.setFillStyle(0x35574c));
    plate.on('pointerdown',activate);text.on('pointerdown',activate);
    return [plate,text];
  }

  openWorldMap(){
    this.player.move(0,0);
    this.mapOverlay=createWorldMapOverlay(this,{position:{x:this.returnX,y:this.returnY},location:`CASA · ${this.currentLocation||'INTERIOR'}`,mission:this.missionText.text,onClose:()=>this.closeWorldMap()});
  }
  closeWorldMap(){this.mapOverlay?.destroy();this.mapOverlay=null;this.player?.move(0,0);}

  doChore(){
    if(!this.progress.flags.study){this.openDialogue([{name:'COCINA',portrait:null,text:'Primero cumple el periodo de estudio que acordaste. Después puedes ayudar a dejar la mesa lista para la cena.'}],()=>{});return;}
    if(this.progress.flags.chore){this.showHint('La mesa ya está lista.');return;}
    this.openDialogue([{name:'COCINA',portrait:null,text:'Pusiste los platos y cubiertos para la cena y dejaste espacio para todos. La tarea compartida quedó cumplida.'}],()=>{this.progress.complete('chore');this.tableSettings?.forEach(item=>item.setVisible(true));this.refreshMission();});
  }

  leaveHome(){
    if(!this.progress.flags.family){this.openDialogue([{name:'MAMÁ',portrait:'portraitParentB',text:'Antes de salir, conversemos de la evaluación y de los nuevos horarios.'}],()=>{});return;}
    if(this.progress.responsibleReady){
      this.openDialogue([{name:'PUERTA',portrait:null,text:'Antes de salir, vuelve a la sala y completa la reflexión final con tus padres.'}],()=>{});return;
    }
    this.openDialogue([{name:'PAPÁ',portrait:'portraitParentA',text:'Te vas sin completar el acuerdo que aceptaste. Tus padres respetarán que necesites una pausa, pero las responsabilidades siguen pendientes. Esta salida cuenta como una decisión y tendrá una consecuencia.'}],()=>{this.progress.complete('reflection');this.refreshMission();this.finishEpisode();});
  }

  finishEpisode(){
    if(gameManager.player.completedEpisodes.includes(1)){this.scene.start('ResultsScene');return;}
    const ending=this.progress.resolve();
    if(gameManager.finishEpisode1(ending,this.progress.serialize()))this.scene.start('ResultsScene');
  }

  saveProgress(){gameManager.player.episode1Progress=this.progress.serialize();gameManager.saveGame();}

  openDialogue(pages,onComplete){this.dialogue={pages,index:0,onComplete};this.player.move(0,0);this.renderDialoguePage();}

  renderDialoguePage(){
    this.clearUI();
    const page=this.dialogue.pages[this.dialogue.index];
    const panel=this.overlayUi.add(this.add.rectangle(480,512,914,164,0x1c302c,.94).setStrokeStyle(3,0xd8ba7a).setInteractive({useHandCursor:true}),1100);
    panel.on('pointerdown',()=>this.advanceDialogue());
    const trim=this.overlayUi.add(this.add.rectangle(480,435,890,3,0x78937b,.9),1101);
    this.ui.push(panel,trim);
    if(page.portrait){
      const portrait=this.overlayUi.add(this.add.image(82,521,page.portrait),1102);
      const source=this.textures.get(page.portrait).getSourceImage();portrait.setScale(Math.min(68/source.width,118/source.height));
      this.ui.push(portrait);
    }
    const x=page.portrait?132:55,width=page.portrait?770:850;
    const name=this.overlayUi.add(this.add.text(x,450,page.name,{fontFamily:'Arial',fontSize:'13px',fontStyle:'bold',color:'#f4d48d',letterSpacing:1}),1102);
    let bodyY=473;
    if(page.highlights){
      const tags=['PRINCIPIO DE SEGURIDAD','PRINCIPIO DE REALIDAD','MADUREZ','RESPONSABILIDAD'];
      const tagWidths=[170,168,76,122];let tx=x;
      for(let i=0;i<tags.length;i++){
        const tag=this.overlayUi.add(this.add.text(tx,470,tags[i],{fontFamily:'Arial',fontSize:'9px',fontStyle:'bold',color:'#f8e4a8',backgroundColor:'#49654f',padding:{x:5,y:3}}),1102);
        this.ui.push(tag);tx+=tagWidths[i];
      }
      bodyY=492;
    }
    const body=this.overlayUi.add(this.add.text(x,bodyY,page.text,{fontFamily:'Arial',fontSize:page.highlights?'14px':'16px',color:'#fff4df',wordWrap:{width},lineSpacing:3}),1102);
    const prompt=this.overlayUi.add(this.add.text(894,559,'CLIC / E · CONTINUAR',{fontFamily:'Arial',fontSize:'11px',fontStyle:'bold',color:'#f4d48d'}).setOrigin(1,.5).setInteractive({useHandCursor:true}),1103);
    prompt.on('pointerover',()=>prompt.setColor('#fff5d9'));prompt.on('pointerout',()=>prompt.setColor('#f4d48d'));prompt.on('pointerdown',()=>this.advanceDialogue());
    this.ui.push(name,body,prompt);
  }

  advanceDialogue(){
    if(!this.dialogue)return;
    this.dialogue.index++;
    if(this.dialogue.index<this.dialogue.pages.length){this.renderDialoguePage();return;}
    this.closeDialogue(true);
  }

  closeDialogue(runCallback){
    const callback=this.dialogue?.onComplete;this.dialogue=null;this.clearUI();
    if(runCallback)callback?.();
  }

  clearUI(){this.ui.forEach(o=>o.destroy());this.ui=[];}
  showHint(text){this.hint.setText(text);}
}
