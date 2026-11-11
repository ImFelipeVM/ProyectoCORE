import { gameManager } from '../systems/GameManager.js';
import { Episode1Progress } from '../systems/episode1Progress.js';
import { EPISODE_1 } from '../data/episode1.js';
import { BUILDINGS, VALLEY, VALLEY_PROPS, WORLD_NPCS, WORLD_OBJECTS } from '../data/valley.js';
import { JOURNEY_DECISIONS, JOURNEY_MAX_SCORE, JOURNEY_QUALITIES, JOURNEY_STATIONS, decisionsForStation, nextJourneyStation, stationIsComplete } from '../data/journey.js';
import { RpgCharacter, createRpgAnimations } from '../entities/RpgCharacter.js';
import { createWorldMapOverlay } from '../systems/worldMapOverlay.js';
import { RENDER_DEPTH, groundDepth } from '../systems/renderDepth.js';
import { createOverlayCamera } from '../systems/overlayCamera.js';
import { createWorldNavigationState, directionArrow, distanceInSteps } from '../systems/worldNavigation.js';

const WORLD_KEYS={tree:0,pine:1,bush:2,bench:3,fountain:4,lamp:5,sign:6,mailbox:7,flowers:8,bin:9,planter:10,board:11,stoneBench:12,marker:13,book:14,notebook:15};
const VIEW_WIDTH=960,VIEW_HEIGHT=600;
const MINIMAP={x:788,y:76,size:160,scale:.13};
const MINI_COLORS={station:0xd9c477,visited:0x91b788,locked:0x67746d,npc:0x8dd0df,building:0xc69b73,poi:0x7fc4b5};

export class ValleyScene extends Phaser.Scene {
  constructor(){super('ValleyScene');this.colliders=[];this.ui=[];this.npcs=[];this.transitioning=false;}
  init(data={}){
    this.colliders=[];this.ui=[];this.npcs=[];this.npcById=new Map();this.transitioning=false;this.dialogue=null;this.mapOverlay=null;
    this.journeyUI=[];this.journeyTimer=null;this.journeyFlow=null;this.journeyAction=null;this.journeyChoices=false;this.silenceRemaining=0;
    this.progress=new Episode1Progress(gameManager.player.episode1Progress||{});
    const saved=gameManager.player.worldPosition||VALLEY.start;
    this.spawn={x:Number(data.x??saved.x),y:Number(data.y??saved.y)};
  }
  create(){
    createRpgAnimations(this);
    this.physics.world.setBounds(0,0,VALLEY.width,VALLEY.height);
    this.cameras.main.setBounds(0,0,VALLEY.width,VALLEY.height);
    this.add.image(0,0,'valleyMap').setOrigin(0).setDepth(-100);
    this.createLandmarks();this.createObstacles();this.createNpcs();this.createPlayer();
    this.createMinimapWorld();
    this.overlayUi=createOverlayCamera(this,VIEW_WIDTH,VIEW_HEIGHT);
    // Later modal and HUD layers render above the separate minimap camera.
    this.overlayUi.layer.cameraFilter|=this.minimapCamera.id;
    this.createHud();
    this.cameras.main.startFollow(this.player,true,.10,.10);this.cameras.main.setDeadzone(250,160);this.cameras.main.setRoundPixels(true);
    this.cursors=this.input.keyboard.createCursorKeys();this.keys=this.input.keyboard.addKeys('W,A,S,D,E,ESC,ENTER,M');
    this.choiceKeys=[Phaser.Input.Keyboard.KeyCodes.ONE,Phaser.Input.Keyboard.KeyCodes.TWO,Phaser.Input.Keyboard.KeyCodes.THREE].map(code=>this.input.keyboard.addKey(code));
    this.refreshMission();this.updateArea(true);
    this.events.once('shutdown',()=>{this.clearJourneyUI();this.savePosition();});
  }

  createLandmarks(){
    // Trees and street furniture are imported from an authored pixel-art sprite atlas.
    for(const item of VALLEY_PROPS){
      this.add.image(item.x,item.y,'valleyProps',item.frame).setScale(item.scale).setDepth(groundDepth(item.y,48*item.scale));
      if(item.solid){
        const trunk=item.frame<2?{w:14,h:30,dy:20}:item.frame===3?{w:48,h:14,dy:32}:item.frame===5?{w:18,h:16,dy:35}:{w:30,h:20,dy:31};
        this.staticBlock(item.x,item.y+trunk.dy*item.scale,trunk.w*item.scale,trunk.h*item.scale);
      }
    }
    for(const station of JOURNEY_STATIONS){
      const scale=.72;
      const ground=groundDepth(station.y,100*scale);
      this.add.image(station.x,station.y,'journeyLandmarks',station.frame).setScale(scale).setDepth(ground);
      this.add.text(station.x,station.y-112*scale-14,station.title,{fontFamily:'Arial',fontSize:'10px',fontStyle:'bold',color:'#fff2d0',stroke:'#26352e',strokeThickness:4,backgroundColor:'#263d36dd',padding:{x:5,y:4}}).setOrigin(.5).setDepth(ground+1);
    }
    this.add.image(1510,1010,'valleyProps',WORLD_KEYS.fountain).setScale(.92).setDepth(groundDepth(1010,42));
    this.add.image(1770,1080,'valleyProps',WORLD_KEYS.sign).setScale(.85).setDepth(groundDepth(1080,39));
    this.add.image(2380,1265,'valleyProps',WORLD_KEYS.mailbox).setScale(.7).setDepth(groundDepth(1265,38));
    this.add.image(820,720,'valleyProps',WORLD_KEYS.board).setScale(.8).setDepth(groundDepth(720,40));
    this.add.image(1110,1635,'valleyProps',WORLD_KEYS.notebook).setScale(.75).setDepth(groundDepth(1635,40));
    // Bounded paths along the school, house and park façades. The main house doorway is left open.
    for(const building of BUILDINGS)this.buildingCollision(building);
    this.staticBlock(1510,1038,34,18); // fountain pedestal and basin
  }

  buildingCollision(b){
    if(b.id==='home'){
      this.staticBlock(b.x+b.width/2,b.y+b.height*.45,b.width-36,b.height*.72);
      const frontY=b.y+b.height-12,doorHalf=b.doorWidth/2;
      this.staticBlock((b.x+b.width/2-doorHalf)/2,frontY,b.x+b.width/2-doorHalf-b.x,20);
      const rightStart=b.x+b.width/2+doorHalf;
      this.staticBlock((rightStart+b.x+b.width)/2,frontY,b.x+b.width-rightStart,20);
      return;
    }
    // Other buildings are scenery; their walls block passage and leave the school entrance clear.
    this.staticBlock(b.x+b.width/2,b.y+b.height*.45,b.width-28,b.height*.73);
    const frontY=b.y+b.height-12,doorX=b.doorX??(b.x+b.width/2),gap=b.doorWidth??76;
    this.staticBlock((b.x+doorX-gap/2)/2,frontY,doorX-gap/2-b.x,20);
    const right=doorX+gap/2;
    this.staticBlock((right+b.x+b.width)/2,frontY,b.x+b.width-right,20);
  }

  createObstacles(){
    this.staticBlock(VALLEY.width/2,5,VALLEY.width,10);this.staticBlock(VALLEY.width/2,VALLEY.height-5,VALLEY.width,10);
    this.staticBlock(5,VALLEY.height/2,10,VALLEY.height);this.staticBlock(VALLEY.width-5,VALLEY.height/2,10,VALLEY.height);
  }

  createNpcs(){
    for(const info of WORLD_NPCS){
      if(this.npcById.has(info.id))continue;
      this.npcById.set(info.id,true);
      const npc=this.physics.add.staticSprite(info.x,info.y,info.texture,19).setDepth(groundDepth(info.y,32));
      npc.setFrame(4);npc.body.setSize(16,10).setOffset(8,26);
      const prefix=info.anim;
      if(this.anims.exists(`${prefix}_down_idle`))npc.play(`${prefix}_down_idle`);
      npc.setData('npc',info);
      const label=this.add.text(info.x,info.y-34,info.name,{fontFamily:'Arial',fontSize:'11px',fontStyle:'bold',color:'#fff4da',stroke:'#28342e',strokeThickness:4}).setOrigin(.5,1).setDepth(npc.depth+1);
      this.npcs.push({npc,info,label});
    }
  }

  createPlayer(){
    const female=gameManager.player.appearance.gender==='female';
    this.player=new RpgCharacter(this,{x:this.spawn.x,y:this.spawn.y,texture:female?'heroFemaleSprites':'heroMaleSprites',animationPrefix:female?'heroFemale':'heroMale',player:true,name:gameManager.player.name});
    this.player.move(0,0);
    this.playerName=this.add.text(this.player.x,this.player.y-30,gameManager.player.name,{fontFamily:'Arial',fontSize:'10px',fontStyle:'bold',color:'#fff5dd',stroke:'#26352e',strokeThickness:4}).setOrigin(.5,1).setDepth(this.player.depth+1);
    for(const body of this.colliders)this.physics.add.collider(this.player,body);
    for(const {npc} of this.npcs)this.physics.add.collider(this.player,npc);
  }

  createHud(){
    this.hud=this.add.container(0,0).setScrollFactor(0).setDepth(RENDER_DEPTH.HUD);
    this.overlayUi.layer.add(this.hud);
    this.hud.add(this.add.rectangle(236,43,432,66,0x263d36,.91).setStrokeStyle(2,0xd8ba7a));
    this.hud.add(this.add.text(28,21,'EL VALLE DEL AUTOCONOCIMIENTO',{fontFamily:'Arial',fontSize:'14px',fontStyle:'bold',color:'#f4d48d',letterSpacing:1}));
    this.missionText=this.add.text(28,47,'',{fontFamily:'Arial',fontSize:'12px',color:'#fff3df',wordWrap:{width:405}});this.hud.add(this.missionText);
    this.areaText=this.add.text(695,33,'',{fontFamily:'Arial',fontSize:'12px',fontStyle:'bold',color:'#fff2cf',backgroundColor:'#263d36dd',padding:{x:7,y:6}}).setOrigin(.5);this.hud.add(this.areaText);
    this.scoreText=this.add.text(940,23,`${gameManager.player.score} pts`,{fontFamily:'Arial',fontSize:'12px',fontStyle:'bold',color:'#f4d48d'}).setOrigin(1,.5);this.hud.add(this.scoreText);
    this.journeyScoreText=this.add.text(940,44,'',{fontFamily:'Arial',fontSize:'9px',color:'#fff0c9'}).setOrigin(1,.5);this.hud.add(this.journeyScoreText);
    this.treeHud=this.add.image(838,43,'valleyProps',WORLD_KEYS.tree).setScale(.22);this.hud.add(this.treeHud);
    this.treeStageText=this.add.text(838,70,'SEMILLA',{fontFamily:'Arial',fontSize:'8px',fontStyle:'bold',color:'#f4d48d'}).setOrigin(.5);this.hud.add(this.treeStageText);
    this.hint=this.overlayUi.add(this.add.text(480,566,'WASD / FLECHAS para moverte',{fontFamily:'Arial',fontSize:'13px',fontStyle:'bold',color:'#fff3df',stroke:'#28342e',strokeThickness:4,backgroundColor:'#263d36dd',padding:{x:10,y:6}}).setOrigin(.5),RENDER_DEPTH.HUD_HINT);
    this.overlayUi.add(this.add.text(940,584,'M · MAPA   E · INTERACTUAR   1–3 · ELEGIR',{fontFamily:'Arial',fontSize:'10px',fontStyle:'bold',color:'#efe0bd'}).setOrigin(1),RENDER_DEPTH.HUD_HINT);
    this.refreshTreeHud();
    this.createMinimap();
  }

  createMinimapWorld(){
    const {x,y,size,scale}=MINIMAP;
    const radius=size/2;
    this.minimapWorld=this.add.layer();
    this.minimapWorld.cameraFilter|=this.cameras.main.id;

    // A fixed screen viewport pans over world coordinates at one constant zoom.
    this.minimapCamera=this.cameras.add(x,y,size,size).setZoom(scale).setRoundPixels(false);
    this.minimapCamera.ignore(this.children.list.filter(object=>object!==this.minimapWorld));
    const maskSource=this.make.graphics({x:0,y:0,add:false});
    maskSource.fillStyle(0xffffff).fillCircle(this.player.x,this.player.y,(radius-1)/scale);
    this.minimapMaskSource=maskSource;
    this.minimapCamera.setMask(maskSource.createGeometryMask(),false);

    const markerScale=1/scale;
    this.minimapBackdrop=this.add.circle(this.player.x,this.player.y,(radius-1)*markerScale,0x1b302b,.98).setDepth(-101);
    this.minimapWorld.add(this.minimapBackdrop);
    this.minimapMap=this.add.image(0,0,'valleyMap').setOrigin(0).setDepth(-100);
    this.minimapWorld.add(this.minimapMap);
    const markerFor=(item)=>{
      const dotRadius=(item.kind==='station'?(item.status==='current'?3.5:2.6):item.markerType==='npc'?2.4:2.2)*markerScale;
      const color=item.kind==='station'?(item.status==='current'?MINI_COLORS.station:item.status==='visited'?MINI_COLORS.visited:MINI_COLORS.locked):MINI_COLORS[item.markerType]||MINI_COLORS.poi;
      const dot=this.add.circle(item.x,item.y,dotRadius,color).setStrokeStyle(markerScale,0x20312d,.9);
      this.minimapWorld.add(dot);
      return {item,dot,color};
    };
    const state=createWorldNavigationState(gameManager.player,{x:this.player.x,y:this.player.y});
    this.minimapMarkers=state.markers
      .filter(item=>item.kind==='station'||item.markerType==='building'||item.markerType==='npc')
      .map(markerFor);
    this.minimapTargetRing=this.add.circle(0,0,6.5*markerScale,0x000000,0).setStrokeStyle(1.5*markerScale,0xffe7a0);
    this.minimapTargetDot=this.add.circle(0,0,2.5*markerScale,0xffd26f).setStrokeStyle(markerScale,0x293a32);
    this.minimapWorld.add([this.minimapTargetRing,this.minimapTargetDot]);
    this.minimapPlayerBack=this.add.circle(this.player.x,this.player.y,6.5*markerScale,0x172b2d,.98).setStrokeStyle(1.5*markerScale,0xf0d99c);
    this.minimapPlayer=this.add.text(this.player.x,this.player.y,'▲',{fontFamily:'Arial',fontSize:`${Math.round(11*markerScale)}px`,fontStyle:'bold',color:'#59e1d4',stroke:'#142826',strokeThickness:Math.round(2*markerScale)}).setOrigin(.5);
    this.minimapWorld.add([this.minimapPlayerBack,this.minimapPlayer]);
    this.minimapCamera.centerOn(this.player.x,this.player.y);
  }

  createMinimap(){
    const {x,y,size}=MINIMAP;
    const cx=size/2,cy=size/2,radius=cx-1;
    this.overlayUi.add(this.add.circle(x+cx,y+cy,radius+1,0xffffff,0).setStrokeStyle(2,0xd8ba7a,.98),RENDER_DEPTH.MINIMAP+1);
    this.navInfo=this.add.container(x,y+size+6).setScrollFactor(0).setDepth(RENDER_DEPTH.MINIMAP+2);
    this.overlayUi.layer.add(this.navInfo);
    this.navPanel=this.add.rectangle(size/2,18,size,36,0x1a302a,.94).setStrokeStyle(1,0x9e906a,.9);
    this.navArrow=this.add.text(15,18,'↑',{fontFamily:'Arial',fontSize:'17px',fontStyle:'bold',color:'#f4d48d',stroke:'#27372f',strokeThickness:2}).setOrigin(.5);
    this.navTargetName=this.add.text(32,5,'OBJETIVO',{fontFamily:'Arial',fontSize:'8px',fontStyle:'bold',color:'#fff1d0',wordWrap:{width:116},maxLines:1});
    this.navDistance=this.add.text(32,20,'',{fontFamily:'Arial',fontSize:'8px',color:'#d9e6d3',wordWrap:{width:90},maxLines:1});
    this.navProximity=this.add.text(size-5,20,'',{fontFamily:'Arial',fontSize:'7px',fontStyle:'bold',color:'#f4d48d'}).setOrigin(1,.5);
    this.navInfo.add([this.navPanel,this.navArrow,this.navTargetName,this.navDistance,this.navProximity]);
    this.updateMinimap();
  }

  updateMinimap(){
    if(!this.minimapCamera||!this.player?.active)return;
    const position={x:this.player.x,y:this.player.y};
    const navigation=createWorldNavigationState(gameManager.player,position);
    this.minimapCamera.centerOn(position.x,position.y);
    const {scale,size}=MINIMAP;
    this.minimapMaskSource.clear().fillStyle(0xffffff).fillCircle(position.x,position.y,(size/2-1)/scale);
    this.minimapBackdrop.setPosition(position.x,position.y);
    this.minimapPlayerBack.setPosition(position.x,position.y);
    this.minimapPlayer.setPosition(position.x,position.y);
    for(const view of this.minimapMarkers){
      const marker=navigation.markers.find(item=>item.id===view.item.id);
      if(!marker)continue;
      const visible=marker.kind==='station'?marker.status!=='locked':marker.markerType==='building'||marker.id===navigation.currentStation?.guide;
      view.dot.setPosition(marker.x,marker.y).setVisible(visible);
      const color=marker.kind==='station'?(marker.status==='current'?MINI_COLORS.station:marker.status==='visited'?MINI_COLORS.visited:MINI_COLORS.locked):MINI_COLORS[marker.markerType]||MINI_COLORS.poi;
      if(color!==view.color){view.dot.setFillStyle(color);view.color=color;}
    }
    const facing={up:0,right:Math.PI/2,down:Math.PI,left:-Math.PI/2}[this.player.facing]||0;
    this.minimapPlayer.setRotation(facing);
    const target=navigation.target;
    if(!target){
      this.minimapTargetRing.setVisible(false);this.minimapTargetDot.setVisible(false);
      this.navArrow.setText('✓');this.navTargetName.setText('VALLE RECORRIDO');this.navDistance.setText('Ruta completa');this.navProximity.setText('');
      return;
    }
    this.minimapTargetRing.setPosition(target.x,target.y).setVisible(true);
    this.minimapTargetDot.setPosition(target.x,target.y).setVisible(true);
    const dx=target.x-position.x,dy=target.y-position.y,distance=Math.hypot(dx,dy);
    this.navArrow.setText(directionArrow(dx,dy));
    this.navTargetName.setText(target.name);
    this.navDistance.setText(distance<48?'E · Interactúa':distanceInSteps(dx,dy)+' pasos');
    this.navProximity.setText(distance<48?'E · AQUÍ':distance<128?'CERCA':'');
  }

  refreshMission(){
    if(gameManager.player.completedEpisodes.includes(1)){
      const next=nextJourneyStation(gameManager.player.journey);
      this.missionText.setText(next?`RUTA ${JOURNEY_STATIONS.indexOf(next)+1}/${JOURNEY_STATIONS.length} · ${next.title}`:'Valle recorrido · revisa tus resultados');
      this.refreshTreeHud();gameManager.saveGame();return;
    }
    const f=this.progress.flags;
    const list=EPISODE_1.missions;
    const complete=mission=>mission.id==='backpack'?f.backpack&&f.study:Boolean(f[mission.id]);
    const current=list.find(m=>!complete(m));
    const done=list.filter(complete).length;
    this.missionText.setText(current?`MISIÓN ${done+1}/${list.length} · ${current.title}`:'Episodio 1 completado · Explora el Valle');
    gameManager.player.episode1Progress=this.progress.serialize();gameManager.saveGame();
  }

  refreshTreeHud(){
    if(!this.treeStageText)return;
    const journey=gameManager.player.journey;
    const points=Number(journey.choiceScore||0)+Number(journey.growthPoints||0)+Number(journey.recoveryPoints||0)+Number(journey.streakPoints||0);
    const ratio=Math.max(0,Math.min(1,points/JOURNEY_MAX_SCORE));
    const state=!journey.seedCollected?'SEMILLA':ratio<.2?'BROTANDO':ratio<=.7?'ÁRBOL JOVEN':'CON FRUTOS';
    this.treeStageText.setText(state);this.treeHud?.setScale(.19+ratio*.24);
    this.journeyScoreText?.setText(journey.started?`${points}/${JOURNEY_MAX_SCORE} · VALLE`:'' );
    this.scoreText?.setText(`${gameManager.player.score} pts`);
  }

  updateArea(force=false){
    const x=this.player?.x??this.spawn.x,y=this.player?.y??this.spawn.y;
    const area=VALLEY.areas.find(a=>x>=a.x&&x<a.x+a.width&&y>=a.y&&y<a.y+a.height);
    const label=area?.name||'EL VALLE';
    if(area&&!gameManager.player.worldVisitedAreas.includes(area.id)){
      gameManager.player.worldVisitedAreas=[...gameManager.player.worldVisitedAreas,area.id];
      gameManager.saveGame();
    }
    if(force||label!==this.areaName){this.areaName=label;this.areaText?.setText(label);if(!force&&this.areaText){this.areaText.setAlpha(.4);this.tweens.add({targets:this.areaText,alpha:1,duration:220});}}
  }

  update(){
    if(!this.player?.active)return;
    this.updateMinimap();
    if(this.journeyUI.length){
      this.player.move(0,0);
      if(this.journeyChoices&&this.choiceKeys.some((key,index)=>Phaser.Input.Keyboard.JustDown(key)&&this.chooseJourneyOption(index)))return;
      if(this.journeyAction&&Phaser.Input.Keyboard.JustDown(this.keys.ENTER))this.journeyAction();
      else if(this.journeyAction&&Phaser.Input.Keyboard.JustDown(this.keys.ESC)&&!this.journeyFlow?.requiredSilence)this.journeyAction();
      return;
    }
    if(this.mapOverlay){
      this.player.move(0,0);
      if(Phaser.Input.Keyboard.JustDown(this.keys.M)||Phaser.Input.Keyboard.JustDown(this.keys.ESC))this.closeWorldMap();
      return;
    }
    if(this.dialogue){this.player.move(0,0);if(Phaser.Input.Keyboard.JustDown(this.keys.E)||Phaser.Input.Keyboard.JustDown(this.keys.ENTER))this.advanceDialogue();else if(Phaser.Input.Keyboard.JustDown(this.keys.ESC))this.closeDialogue();return;}
    if(Phaser.Input.Keyboard.JustDown(this.keys.M)){this.openWorldMap();return;}
    const dx=(this.cursors.right.isDown||this.keys.D.isDown?1:0)-(this.cursors.left.isDown||this.keys.A.isDown?1:0);
    const dy=(this.cursors.down.isDown||this.keys.S.isDown?1:0)-(this.cursors.up.isDown||this.keys.W.isDown?1:0);
    this.player.move(dx,dy);this.playerName.setPosition(this.player.x,this.player.y-30).setDepth(this.player.depth+1);this.updateArea();this.updateMinimap();
    const nearest=this.nearestInteractable();
    if(nearest&&nearest.distance<88){
      const facing=this.isFacing(nearest.item);
      this.hint.setText(facing?`E — ${nearest.item.name}`:`Mira hacia ${nearest.item.name}`);
      if(facing&&Phaser.Input.Keyboard.JustDown(this.keys.E))this.interact(nearest.item);
    }else this.hint.setText('WASD / FLECHAS para moverte');
  }

  nearestInteractable(){
    const stations=JOURNEY_STATIONS.map(station=>({id:`station-${station.id}`,name:station.title,x:station.x,y:station.y,kind:'journey',stationId:station.id}));
    const entries=[...WORLD_OBJECTS,...stations,...this.npcs.map(({info})=>({id:info.id,name:info.name,x:info.x,y:info.y,kind:'npc',info,stationId:info.stationId}))];
    let best=null;for(const item of entries){const distance=Phaser.Math.Distance.Between(this.player.x,this.player.y,item.x,item.y);if(!best||distance<best.distance)best={item,distance};}return best;
  }
  isFacing(item){
    const dx=item.x-this.player.x,dy=item.y-this.player.y;
    if(this.player.facing==='left')return dx<0&&Math.abs(dx)>Math.abs(dy)*.55;
    if(this.player.facing==='right')return dx>0&&Math.abs(dx)>Math.abs(dy)*.55;
    if(this.player.facing==='up')return dy<0&&Math.abs(dy)>Math.abs(dx)*.55;
    return dy>0&&Math.abs(dy)>Math.abs(dx)*.55;
  }

  interact(item){
    if(item.stationId){this.startJourneyStation(item.stationId);return;}
    if(item.kind==='journey'){this.startJourneyStation(item.stationId);return;}
    if(item.kind==='door'){
      if(gameManager.player.completedEpisodes.includes(1)){this.openDialogue({name:'CASA',texture:'npcMotherSprites',text:'Ya completaste la primera estación. Puedes seguir recorriendo el Valle o revisar tus resultados desde el menú.'});return;}
      const returnX=this.player.x,returnY=this.player.y+42;
      gameManager.player.worldPosition={x:returnX,y:returnY};gameManager.saveGame();
      this.transitioning=true;this.cameras.main.fadeOut(220,20,28,25);this.overlayUi.camera.fadeOut(220,20,28,25);
      this.cameras.main.once('camerafadeoutcomplete',()=>this.scene.start('EpisodeScene',{episodeId:1,fromValley:true,returnX,returnY}));return;
    }
    if(item.kind==='npc'){
      const portrait=this.textures.exists(item.info.texture)?item.info.texture:null;
      this.openDialogue({name:item.info.name,texture:portrait,text:item.info.lines[0]});
      return;
    }
    const text={
      board:'EL VALLE DEL AUTOCONOCIMIENTO · Plaza Central, Barrio Familiar, Zona Escolar y Zona Verde. La casa del protagonista está al este, siguiendo el camino de piedra.',
      school:'Zona escolar: pregunta a la profesora sobre la evaluación y las estrategias de estudio.',
      journal:'Un cuaderno de campo. Puedes registrar una idea que quieras recordar mientras exploras.',
      fountain:'El sonido de la fuente invita a hacer una pausa. Tómate un momento antes de continuar.'
    }[item.kind]||'Un rincón del Valle.';
    this.openDialogue({name:item.name,texture:null,text});
  }

  openDialogue(page,onContinue=null){
    if(this.dialogue)return;
    this.dialogue={...page,onContinue};this.player.move(0,0);this.clearUI();
    const dim=this.overlayUi.add(this.add.rectangle(VIEW_WIDTH/2,VIEW_HEIGHT/2,VIEW_WIDTH,VIEW_HEIGHT,0x101918,.26),RENDER_DEPTH.DIALOGUE_DIM);
    this.ui.push(dim);
    const panel=this.overlayUi.add(this.add.rectangle(480,514,820,148,0x1c302c,.96).setStrokeStyle(3,0xd8ba7a).setInteractive(),RENDER_DEPTH.DIALOGUE);
    panel.on('pointerdown',()=>this.advanceDialogue());
    this.ui.push(panel);
    let x=65;
    if(page.texture){const sprite=this.overlayUi.add(this.add.sprite(92,519,page.texture,4).setScale(1.35),RENDER_DEPTH.DIALOGUE+2);this.ui.push(sprite);x=142;}
    const name=this.overlayUi.add(this.add.text(x,455,page.name,{fontFamily:'Arial',fontSize:'13px',fontStyle:'bold',color:'#f4d48d'}),RENDER_DEPTH.DIALOGUE+2);
    const body=this.overlayUi.add(this.add.text(x,479,page.text,{fontFamily:'Arial',fontSize:'16px',color:'#fff3df',wordWrap:{width:page.texture?660:700},lineSpacing:4}),RENDER_DEPTH.DIALOGUE+2);
    const prompt=this.overlayUi.add(this.add.text(878,561,'CLIC / E · CONTINUAR',{fontFamily:'Arial',fontSize:'11px',fontStyle:'bold',color:'#f4d48d'}).setOrigin(1,.5).setInteractive({useHandCursor:true}),RENDER_DEPTH.DIALOGUE+3);
    prompt.on('pointerdown',()=>this.advanceDialogue());
    this.ui.push(name,body,prompt);
  }
  advanceDialogue(){if(!this.dialogue)return;const action=this.dialogue.onContinue;this.closeDialogue();action?.();}
  closeDialogue(){
    if(!this.dialogue)return;
    this.dialogue=null;
    this.clearUI();
    this.player?.move(0,0);
  }

  startJourneyStation(stationId){
    const station=JOURNEY_STATIONS.find(item=>item.id===stationId);
    if(!station)return;
    if(!gameManager.player.completedEpisodes.includes(1)){
      this.openDialogue({name:'DON TOMÁS',texture:'npcGardenerSprites',text:'El camino empieza cuando termines la conversación y los compromisos de casa. Busca la puerta grande al este de la plaza.'});
      return;
    }
    if(gameManager.player.journey.complete){this.openDialogue({name:'DON TOMÁS',texture:'npcGardenerSprites',text:'El árbol ya muestra el camino que elegiste. Puedes consultar tus resultados desde el menú.'});return;}
    const next=nextJourneyStation(gameManager.player.journey);
    if(next?.id!==stationId){
      const message=stationIsComplete(gameManager.player.journey,stationId)?'Este lugar ya guarda tu decisión. El siguiente encuentro está señalado en el mapa.':`La ruta todavía no llega aquí. Primero visita ${next?.title||'el árbol final'}.`;
      this.openDialogue({name:station.title,texture:null,text:message});return;
    }
    this.journeyFlow={stationId,decisionIndex:0,recovering:false,requiredSilence:false};
    if(stationId==='noise'&&!gameManager.player.journey.started){
      gameManager.startJourney();this.refreshTreeHud();
      this.openDialogue({name:'NARRADOR',texture:null,text:'Otro día igual. Te levantas, miras el celular, te vistes como todos y sales corriendo. ¿Cuándo fue la última vez que decidiste algo solo porque querías?'},()=>{
        this.openDialogue({name:'DON TOMÁS',texture:'npcGardenerSprites',text:'Buenos días. Todos en esta casa tienen prisa, pero ningún árbol ha crecido más rápido por hacer ruido. Toma esta semilla. Lo que nazca de ella depende de lo que decidas en el Valle del Autoconocimiento. Allá no gana el más rápido, sino el más sincero.'},()=>this.openStationIntroduction(station));
      });
      return;
    }
    this.openStationIntroduction(station);
  }

  openStationIntroduction(station){
    const intros={
      noise:{name:'DON TOMÁS',texture:'npcGardenerSprites',text:'Mira a tu alrededor. ¿Cuántas cosas haces solo porque todos las hacen?'},
      door:{name:'MAMÁ',texture:'npcMotherSprites',text:'Todos tenemos un cuarto con llave por dentro. No es malo tener uno. Lo importante es saber a quién le abres la puerta.'},
      family:{name:'PAPÁ',texture:'npcFatherSprites',text:'Siéntate, que el tinto está caliente. Cuando la presión sube, no tienes que resolverlo todo en silencio.'},
      mirrors:{name:'CAMILA',texture:'npcNeighborSprites',text:'¡Ey! ¿Viste lo que hicieron todos? Lo que toca es hacer lo mismo, no seas aburrido.'},
      friendship:{name:'CAMILA',texture:'npcNeighborSprites',text:'Oye, ayer en el grupo estaban hablando mal de nuestro amigo. Tú estabas ahí…'},
      social:{name:'CAMILA',texture:'npcNeighborSprites',text:'Miremos nuestros celulares. A veces flotan tantos “me gusta” que olvidamos quién está aquí.'},
      overlook:{name:'PAPÁ',texture:'npcFatherSprites',text:'Desde aquí se ve todo el camino. Pero ¿sabes hacia dónde vas? Y pregúntame a mí también: no quiero que estudies algo solo por mí.'},
      workshop:{name:'MAESTRA',texture:'npcTeacherSprites',text:'Aquí la nota no es lo más importante. ¿Sabes qué distingue a un profesional de verdad?'},
      tree:{name:'DON TOMÁS',texture:'npcGardenerSprites',text:'Volviste. Antes de plantarla, una última pregunta. Es la que sostiene al árbol cuando hay viento.'}
    };
    const page=intros[station.id]||{name:station.title,texture:null,text:station.place};
    this.openDialogue(page,()=>this.showJourneyDecision());
  }

  currentJourneyDecision(){
    const flow=this.journeyFlow;if(!flow)return null;
    if(flow.recovering)return flow.recoveryDecision;
    return decisionsForStation(flow.stationId)[flow.decisionIndex]||null;
  }

  showJourneyDecision(){
    if(!this.journeyFlow.recovering){
      const openIndex=decisionsForStation(this.journeyFlow.stationId).findIndex(item=>!gameManager.player.journey.decisions[item.id]);
      if(openIndex<0){this.finishJourneyStation();return;}
      this.journeyFlow.decisionIndex=openIndex;
    }
    const decision=this.currentJourneyDecision();if(!decision)return this.finishJourneyStation();
    this.journeyFlow.currentDecisionId=decision.id;
    if(decision.silenceSeconds&&!this.journeyFlow.recovering&&!this.journeyFlow.silenceCompleted){this.openSilence(decision);return;}
    this.renderJourneyQuestion(decision);
  }

  openSilence(decision){
    this.clearJourneyUI();this.journeyFlow.requiredSilence=true;this.silenceRemaining=decision.silenceSeconds;
    const add=object=>this.addJourneyUi(object);
    add(this.add.rectangle(480,300,960,600,0x111d1d,.94));
    add(this.add.rectangle(480,300,800,548,0x253c35,.98).setStrokeStyle(3,0xd8ba7a));
    add(this.add.image(480,252,'journeyLandmarks',0).setDisplaySize(520,364).setAlpha(.88));
    const female=gameManager.player.appearance.gender==='female';
    add(this.add.image(480,358,'heroSitting',female?1:0).setScale(1.7));
    for(let index=0;index<6;index++){
      const leaf=add(this.add.image(Phaser.Math.Between(330,630),Phaser.Math.Between(188,270),'journeyLeaves',index%4).setScale(.75+Math.random()*.35));
      this.tweens.add({targets:leaf,y:Phaser.Math.Between(385,466),x:leaf.x+Phaser.Math.Between(-48,48),rotation:Phaser.Math.FloatBetween(-1.2,1.2),duration:4300+index*360,repeat:-1});
    }
    add(this.add.text(480,69,'EL PARADOR DEL SILENCIO',{fontFamily:'Arial',fontSize:'21px',fontStyle:'bold',color:'#f4d48d',letterSpacing:1}).setOrigin(.5));
    add(this.add.text(480,106,'Siéntate bajo el árbol. Vamos a callar un momento.',{fontFamily:'Arial',fontSize:'16px',color:'#fff3df',align:'center'}).setOrigin(.5));
    add(this.add.text(480,139,decision.question,{fontFamily:'Arial',fontSize:'14px',color:'#f1e5c8',align:'center',wordWrap:{width:680}}).setOrigin(.5));
    this.silenceCountText=add(this.add.text(480,502,String(this.silenceRemaining),{fontFamily:'Arial',fontSize:'30px',fontStyle:'bold',color:'#f4d48d'}).setOrigin(.5));
    add(this.add.text(480,532,'Permanece aquí unos instantes. La hoja caerá cuando termine la pausa.',{fontFamily:'Arial',fontSize:'11px',color:'#e6dcc2'}).setOrigin(.5));
    this.journeyTimer=this.time.addEvent({delay:1000,repeat:decision.silenceSeconds-1,callback:()=>{
      this.silenceRemaining=Math.max(0,this.silenceRemaining-1);this.silenceCountText?.setText(String(this.silenceRemaining));
      if(this.silenceRemaining===0){this.journeyTimer?.remove(false);this.journeyTimer=null;this.journeyFlow.requiredSilence=false;this.journeyFlow.silenceCompleted=true;this.clearJourneyUI();this.renderJourneyQuestion(decision);}
    }});
  }

  renderJourneyQuestion(decision){
    this.clearJourneyUI();this.journeyChoices=true;this.journeyAction=null;
    const station=JOURNEY_STATIONS.find(item=>item.id===this.journeyFlow.stationId);
    const add=object=>this.addJourneyUi(object);
    add(this.add.rectangle(480,300,960,600,0x0e1818,.82));
    add(this.add.rectangle(480,315,892,510,0x1e3531,.98).setStrokeStyle(3,0xd8ba7a));
    add(this.add.text(480,82,this.journeyFlow.recovering?'SEGUNDA OPORTUNIDAD':station.title,{fontFamily:'Arial',fontSize:'19px',fontStyle:'bold',color:'#f4d48d',letterSpacing:1}).setOrigin(.5));
    add(this.add.text(480,111,`${decision.speaker}  ·  ${JOURNEY_QUALITIES.find(item=>item.id===decision.quality)?.name||station.qualityName}`,{fontFamily:'Arial',fontSize:'11px',fontStyle:'bold',color:'#d8cfac'}).setOrigin(.5));
    add(this.add.text(480,153,decision.question,{fontFamily:'Arial',fontSize:'16px',color:'#fff3df',align:'center',wordWrap:{width:780},lineSpacing:3}).setOrigin(.5));
    decision.options.forEach((option,index)=>{
      const y=245+index*84,button=add(this.add.rectangle(480,y,820,70,0x35574c,.98).setStrokeStyle(2,0x9daa7d).setInteractive({useHandCursor:true}));
      const label=add(this.add.text(480,y,option.text,{fontFamily:'Arial',fontSize:'14px',color:'#fff6e4',align:'center',wordWrap:{width:770},lineSpacing:2}).setOrigin(.5));
      button.on('pointerover',()=>button.setFillStyle(0x496b57));button.on('pointerout',()=>button.setFillStyle(0x35574c));button.on('pointerdown',()=>this.chooseJourneyOption(index));label.setDepth(button.depth+1);
    });
    add(this.add.text(480,517,'ELIGE LA RESPUESTA QUE MEJOR REPRESENTA LO QUE HARÍAS · 1 / 2 / 3',{fontFamily:'Arial',fontSize:'10px',fontStyle:'bold',color:'#dbc990'}).setOrigin(.5));
  }

  chooseJourneyOption(optionIndex){
    if(!this.journeyChoices)return false;
    const decision=this.currentJourneyDecision(),option=decision?.options?.[optionIndex];if(!option)return false;
    this.journeyChoices=false;
    if(this.journeyFlow.recovering){
      const station=JOURNEY_STATIONS.find(item=>item.id===this.journeyFlow.stationId);
      const success=option.points===2;
      const result=gameManager.recoverJourneyPoint(station.id,success,{stationId:station.id,name:station.reward,frame:station.frame});
      this.journeyFlow.recoveryResult={...result,success,option,decision};
      this.refreshTreeHud();this.showJourneyFeedback(decision,option,{points:success?1:0,recovery:true});return true;
    }
    const record=gameManager.recordJourneyDecision(decision,optionIndex);if(!record)return false;
    this.journeyFlow.lastRecord=record;this.journeyFlow.lastDecisionId=decision.id;this.refreshTreeHud();this.showJourneyFeedback(decision,option,{points:record.points,streakAward:record.streakAward||0});return true;
  }

  showJourneyFeedback(decision,option,result){
    this.clearJourneyUI();this.journeyAction=()=>this.afterJourneyFeedback();
    const station=JOURNEY_STATIONS.find(item=>item.id===this.journeyFlow.stationId);
    const success=result.recovery?result.points>0:result.points===2;
    const verdict=result.recovery?(success?'PUNTO RECUPERADO':'SEGUNDA OPORTUNIDAD'):result.points===2?'CAMINO DE CRECIMIENTO':result.points===1?'A MEDIO CAMINO':'TROPIEZO';
    const hint=decision.options.find(item=>item.points===2)?.text||decision.options[0].text;
    const delta=result.recovery?result.points:result.points+(result.streakAward||0);
    const plus=delta>0?`+${delta}`:'0';
    const add=object=>this.addJourneyUi(object);
    add(this.add.rectangle(480,300,960,600,0x0e1818,.82));
    add(this.add.rectangle(480,315,880,500,0x1e3531,.98).setStrokeStyle(3,success?0xd8ba7a:0x957966));
    add(this.add.text(480,88,verdict,{fontFamily:'Arial',fontSize:'20px',fontStyle:'bold',color:success?'#f4d48d':'#e4c0a2',letterSpacing:1}).setOrigin(.5));
    add(this.add.text(480,121,`${plus} PUNTOS  ·  ${station.qualityName}${result.streakAward?`  ·  RACHA +${result.streakAward}`:''}`,{fontFamily:'Arial',fontSize:'12px',fontStyle:'bold',color:'#f4d48d'}).setOrigin(.5));
    add(this.add.text(101,159,'POR QUÉ',{fontFamily:'Arial',fontSize:'11px',fontStyle:'bold',color:'#d8c78f'}));
    add(this.add.text(101,181,`${option.feedback} ${decision.basis}`,{fontFamily:'Arial',fontSize:'14px',color:'#fff3df',wordWrap:{width:755},lineSpacing:3}));
    add(this.add.text(101,292,'RINCÓN DEL LIBRO  ·  FUENTE',{fontFamily:'Arial',fontSize:'11px',fontStyle:'bold',color:'#d8c78f'}));
    add(this.add.text(101,313,decision.source,{fontFamily:'Arial',fontSize:'13px',color:'#fff3df',wordWrap:{width:690}}));
    add(this.add.image(849,325,'valleyProps',WORLD_KEYS.book).setScale(.36));
    add(this.add.text(101,354,'PISTA',{fontFamily:'Arial',fontSize:'11px',fontStyle:'bold',color:'#d8c78f'}));
    add(this.add.text(101,375,`Una respuesta que habría sumado más: «${hint}»`,{fontFamily:'Arial',fontSize:'13px',color:'#fff3df',wordWrap:{width:755},lineSpacing:3}));
    const floating=add(this.add.text(480,440,plus,{fontFamily:'Arial',fontSize:'24px',fontStyle:'bold',color:'#f4d48d'}).setOrigin(.5));
    this.tweens.add({targets:floating,y:414,alpha:.5,duration:480,ease:'Sine.out'});
    if(result.streakAward){
      for(let index=0;index<9;index++){
        const leaf=this.addJourneyUi(this.add.image(Phaser.Math.Between(245,715),Phaser.Math.Between(228,370),'journeyLeaves',index%4).setScale(.85+Math.random()*.5),RENDER_DEPTH.JOURNEY-1);
        this.tweens.add({targets:leaf,x:leaf.x+Phaser.Math.Between(-100,100),y:leaf.y-Phaser.Math.Between(70,165),rotation:Phaser.Math.FloatBetween(-2,2),alpha:0,duration:850+index*45,ease:'Sine.out',onComplete:()=>leaf.destroy()});
      }
    }
    this.addJourneyButton('CONTINUAR',480,510,()=>this.journeyAction?.(),200,42);
  }

  afterJourneyFeedback(){
    if(this.journeyFlow.recovering){this.journeyFlow.recovering=false;this.journeyFlow.recoveryResolved=true;this.continueAfterStation();return;}
    const decisions=decisionsForStation(this.journeyFlow.stationId);
    const nextIndex=decisions.findIndex(item=>!gameManager.player.journey.decisions[item.id]);
    if(nextIndex>=0){this.journeyFlow.decisionIndex=nextIndex;this.showJourneyDecision();return;}
    this.finishJourneyStation();
  }

  finishJourneyStation(){
    if(!this.journeyFlow)return;
    const station=JOURNEY_STATIONS.find(item=>item.id===this.journeyFlow.stationId);
    if(this.journeyFlow.outcomeShown)return;
    this.journeyFlow.outcomeShown=true;
    const decisions=decisionsForStation(station.id);
    const points=decisions.reduce((sum,item)=>sum+(Number(gameManager.player.journey.decisions[item.id]?.points)||0),0);
    const strongPath=points/Math.max(1,decisions.length*2)>=.75;
    if(strongPath){
      const reward={stationId:station.id,name:station.reward,frame:station.frame};
      const gained=gameManager.awardJourneyGrowth(station.id,reward);this.refreshTreeHud();
      this.showStationOutcome('CAMINO CLARO',`${this.stationAdvice(station.id)}\n\nUn objeto de esta estación se une a tu inventario y hace crecer el árbol.`,gained?reward:null,()=>this.continueAfterStation());
      return;
    }
    this.showRecoveryOffer(station);
  }

  stationAdvice(id){
    return ({noise:'Reconocer el ruido que te rodea te permite escuchar tu propio criterio.',door:'La intimidad puede compartirse con cuidado cuando existe confianza.',family:'Pedir apoyo también es una forma de cuidar los vínculos.',mirrors:'Actuar según tus convicciones abre espacio para la libertad interior.',friendship:'La lealtad cuida la amistad con presencia y sinceridad.',social:'Tu vida real puede orientar la imagen que decides compartir.',overlook:'Un proyecto con sentido da dirección a las decisiones del camino.',workshop:'La excelencia conecta lo que sabes hacer con compromiso y ética.',tree:'Un principio firme sostiene tus decisiones cuando cambia la conveniencia.'})[id]||'Cada decisión puede ayudarte a conocerte mejor.';
  }

  showStationOutcome(title,message,reward,onContinue){
    this.clearJourneyUI();this.journeyAction=onContinue;
    const add=object=>this.addJourneyUi(object);
    add(this.add.rectangle(480,300,960,600,0x0e1818,.82));
    add(this.add.rectangle(480,300,850,430,0x203b34,.98).setStrokeStyle(3,0xd8ba7a));
    add(this.add.text(480,110,title,{fontFamily:'Arial',fontSize:'23px',fontStyle:'bold',color:'#f4d48d',letterSpacing:1}).setOrigin(.5));
    add(this.add.text(480,180,message,{fontFamily:'Arial',fontSize:'15px',color:'#fff3df',align:'center',wordWrap:{width:700},lineSpacing:4}).setOrigin(.5));
    if(reward){add(this.add.image(480,310,'journeyLandmarks',reward.frame).setDisplaySize(175,122));add(this.add.text(480,390,`OBJETO · ${reward.name}`,{fontFamily:'Arial',fontSize:'11px',fontStyle:'bold',color:'#f4d48d'}).setOrigin(.5));}
    this.addJourneyButton('SEGUIR EL CAMINO',480,493,()=>this.journeyAction?.(),250,46);
  }

  showRecoveryOffer(station){
    this.clearJourneyUI();this.journeyAction=()=>this.beginJourneyRecovery(station);
    const add=object=>this.addJourneyUi(object);
    add(this.add.rectangle(480,300,960,600,0x0e1818,.82));
    add(this.add.rectangle(480,300,850,430,0x2e3933,.98).setStrokeStyle(3,0xc0a57d));
    add(this.add.text(480,112,'CAMINO DE NIEBLA',{fontFamily:'Arial',fontSize:'22px',fontStyle:'bold',color:'#e6c995',letterSpacing:1}).setOrigin(.5));
    add(this.add.text(480,178,`La lectura todavía tiene algo para ofrecerte. Puedes volver a pensar en un dilema de ${station.source} y recuperar hasta un punto.`,{fontFamily:'Arial',fontSize:'15px',color:'#fff3df',align:'center',wordWrap:{width:690},lineSpacing:4}).setOrigin(.5));
    add(this.add.text(480,255,'Ambas rutas continúan. La segunda oportunidad no cambia la decisión que ya guardaste.',{fontFamily:'Arial',fontSize:'12px',color:'#e2d6b8',align:'center',wordWrap:{width:680}}).setOrigin(.5));
    this.addJourneyButton('REVISAR EL DILEMA',480,354,()=>this.beginJourneyRecovery(station),250,46);
    this.addJourneyButton('SEGUIR SIN RECUPERAR',480,425,()=>{gameManager.skipJourneyStation(station.id);this.continueAfterStation();},260,42);
  }

  beginJourneyRecovery(station){
    const decisions=decisionsForStation(station.id);
    const lastId=this.journeyFlow.lastDecisionId;
    const chosen=decisions.find(item=>item.id!==lastId)||decisions[0];
    this.journeyFlow.recovering=true;this.journeyFlow.recoveryDecision=chosen;this.journeyFlow.decisionIndex=0;
    this.renderJourneyQuestion(chosen);
  }

  continueAfterStation(){
    const stationId=this.journeyFlow?.stationId;
    if(stationId==='tree'){this.showTreeFinal();return;}
    this.journeyFlow=null;this.clearJourneyUI();this.journeyAction=null;this.journeyChoices=false;this.refreshMission();
    const next=nextJourneyStation(gameManager.player.journey);
    this.hint.setText(next?`SIGUIENTE PARADA · ${next.title}`:'EL VALLE ESTÁ COMPLETO');
  }

  showTreeFinal(){
    const journey=gameManager.player.journey;
    const total=Number(journey.choiceScore||0)+Number(journey.growthPoints||0)+Number(journey.recoveryPoints||0)+Number(journey.streakPoints||0);
    const percent=total/JOURNEY_MAX_SCORE*100;
    const branch=percent<40?'eco':percent<=70?'brote':'frutos';
    const endings={eco:{title:'EL ECO',text:'Un árbol pequeño sigue siendo un árbol. Pero aún se parece más al ruido que a ti. Vuelve a recorrer el valle.'},brote:{title:'EL BROTE',text:'Ya sabes quién no quieres ser. Ahora falta decidir quién sí.'},frutos:{title:'EL ÁRBOL CON FRUTOS',text:'Lo que construiste no es solo para ti. Eso es ser excelente, comprometido y ético.'}};
    const ending={...endings[branch],branch,total,percent:Math.round(percent),max:JOURNEY_MAX_SCORE};
    gameManager.completeJourney(ending);this.refreshTreeHud();this.clearJourneyUI();this.journeyFlow=null;
    const add=object=>this.addJourneyUi(object);
    add(this.add.rectangle(480,300,960,600,0x0c1718,.92));
    add(this.add.rectangle(480,300,850,530,0x203a34,.98).setStrokeStyle(3,0xd8ba7a));
    const tree=add(this.add.image(480,260,'journeyLandmarks',8).setDisplaySize(360,252));
    const scale=percent<40?0.55:percent<=70?0.82:1;
    tree.setScale(scale);tree.y=256;
    add(this.add.text(480,76,'LA SEMILLA ENCUENTRA SU FORMA',{fontFamily:'Arial',fontSize:'19px',fontStyle:'bold',color:'#f4d48d',letterSpacing:1}).setOrigin(.5));
    add(this.add.text(480,400,`${ending.title}  ·  ${total}/${JOURNEY_MAX_SCORE} PUNTOS  ·  ${ending.percent}%`,{fontFamily:'Arial',fontSize:'16px',fontStyle:'bold',color:'#f4d48d'}).setOrigin(.5));
    add(this.add.text(480,446,`JARDINERO: «${ending.text}»`,{fontFamily:'Arial',fontSize:'14px',color:'#fff3df',align:'center',wordWrap:{width:690},lineSpacing:4}).setOrigin(.5));
    const fruitEnding=branch==='frutos';
    if(fruitEnding)add(this.add.sprite(705,280,'npcNeighborSprites',4).setScale(1.6));
    this.journeyAction=()=>{if(fruitEnding){gameManager.player.journey.sharedFruit=true;gameManager.saveGame();}this.scene.start('ResultsScene',{kind:'journey'});};
    this.addJourneyButton(fruitEnding?'COMPARTIR UN FRUTO':'VER RESULTADOS Y LECTURAS',{x:480,y:526,onClick:()=>this.journeyAction?.()});
  }

  addJourneyButton(label,x,y,onClick,width=240,height=44){
    if(typeof x==='object'){const options=x;x=options.x;y=options.y;onClick=options.onClick;width=options.width||width;height=options.height||height;}
    const rect=this.addJourneyUi(this.add.rectangle(x,y,width,height,0x47694f,.98).setStrokeStyle(2,0xe1ca8d).setInteractive({useHandCursor:true}),RENDER_DEPTH.JOURNEY+100+this.journeyUI.length);
    const text=this.addJourneyUi(this.add.text(x,y,label,{fontFamily:'Arial',fontSize:'12px',fontStyle:'bold',color:'#fff3d0',align:'center',wordWrap:{width:width-18}}).setOrigin(.5),rect.depth+1);
    rect.on('pointerover',()=>rect.setFillStyle(0x66835b));rect.on('pointerout',()=>rect.setFillStyle(0x47694f));rect.on('pointerdown',()=>onClick?.());
    return rect;
  }

  addJourneyUi(object,depth=RENDER_DEPTH.JOURNEY+this.journeyUI.length){
    this.overlayUi.add(object,depth);this.journeyUI.push(object);return object;
  }

  clearJourneyUI(){
    if(this.journeyTimer){this.journeyTimer.remove(false);this.journeyTimer=null;}
    this.journeyUI?.forEach(object=>object.destroy());this.journeyUI=[];
    this.journeyChoices=false;this.silenceCountText=null;
  }

  openWorldMap(){
    this.player.move(0,0);
    this.mapOverlay=createWorldMapOverlay(this,{position:this.player,location:this.areaName||'EL VALLE',mission:this.missionText.text,onClose:()=>this.closeWorldMap()});
  }
  closeWorldMap(){this.mapOverlay?.destroy();this.mapOverlay=null;this.player?.move(0,0);}
  clearUI(){this.ui.forEach(object=>object.destroy());this.ui=[];}
  staticBlock(x,y,width,height){const object=this.add.rectangle(x,y,width,height,0,0).setVisible(false);this.physics.add.existing(object,true);this.colliders.push(object);return object;}
  savePosition(){if(!this.player||this.transitioning)return;gameManager.player.worldPosition={x:this.player.x,y:this.player.y};gameManager.player.episode1Progress=this.progress.serialize();gameManager.saveGame();}
}

