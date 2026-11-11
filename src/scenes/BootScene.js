import { gameManager } from '../systems/GameManager.js';
export class BootScene extends Phaser.Scene {
  constructor(){super('BootScene');}
  preload(){
    this.load.image('valleyMap','./assets/backgrounds/autoconocimiento_valley.png');
    this.load.spritesheet('valleyProps','./assets/objects/valley_props.svg',{frameWidth:96,frameHeight:96});
    this.load.spritesheet('journeyLandmarks','./assets/objects/journey_landmarks.svg',{frameWidth:320,frameHeight:224});
    this.load.spritesheet('journeyLeaves','./assets/objects/journey_leaves.svg',{frameWidth:32,frameHeight:32});
    this.load.spritesheet('heroSitting','./assets/characters/hero_sitting.svg',{frameWidth:96,frameHeight:112});
    this.load.spritesheet('heroMaleSprites','./assets/characters/hero_male_sheet.svg',{frameWidth:32,frameHeight:40});
    this.load.spritesheet('heroFemaleSprites','./assets/characters/hero_female_sheet.svg',{frameWidth:32,frameHeight:40});
    this.load.spritesheet('npcMotherSprites','./assets/characters/npc_mother_sheet.svg',{frameWidth:32,frameHeight:40});
    this.load.spritesheet('npcFatherSprites','./assets/characters/npc_father_sheet.svg',{frameWidth:32,frameHeight:40});
    this.load.spritesheet('npcTeacherSprites','./assets/characters/npc_teacher_sheet.svg',{frameWidth:32,frameHeight:40});
    this.load.spritesheet('npcNeighborSprites','./assets/characters/npc_neighbor_sheet.svg',{frameWidth:32,frameHeight:40});
    this.load.spritesheet('npcGardenerSprites','./assets/characters/npc_gardener_sheet.svg',{frameWidth:32,frameHeight:40});
    this.load.image('homeMap','./assets/backgrounds/episode1_house.png');
    this.load.spritesheet('homeProps','./assets/objects/episode1_props.png',{frameWidth:64,frameHeight:64});
    this.load.spritesheet('homeDetails','./assets/objects/episode1_details.svg',{frameWidth:64,frameHeight:64});
    this.load.image('heroMale','./assets/characters/ref_01.png');
    this.load.image('heroFemale','./assets/characters/ref_05.png');
    this.load.image('portraitMale','./assets/characters/ref_02.png');
    this.load.image('portraitParentA','./assets/characters/ref_03.png');
    this.load.image('portraitParentB','./assets/characters/ref_04.png');
    this.load.image('caminoLogo','./assets/ui/camino-logo.png');
    this.load.on('loaderror',file=>console.error(`[BootScene] No se pudo cargar ${file.key}: ${file.src}`));
  }
  create(){gameManager.loadGame();this.scene.start('MenuScene');}
}
