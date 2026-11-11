import { groundDepth } from '../systems/renderDepth.js';

export class RpgCharacter extends Phaser.Physics.Arcade.Sprite {
  constructor(scene,{x,y,texture,animationPrefix,player=false,name=''}){
    super(scene,x,y,texture,19);
    scene.add.existing(this);scene.physics.add.existing(this);
    this.animationPrefix=animationPrefix;this.name=name;this.facing='down';this.speed=player?168:0;
    this.setDepth(groundDepth(y,32));this.body.setSize(16,12).setOffset(8,26);this.body.setAllowGravity(false);
    this.setCollideWorldBounds(player);
    if(!player)this.body.setImmovable(true);
  }
  move(x,y){
    const dx=x,dy=y;
    if(dx||dy){
      const length=Math.hypot(dx,dy);this.setVelocity(dx/length*this.speed,dy/length*this.speed);
      if(Math.abs(dx)>Math.abs(dy))this.facing=dx<0?'left':'right';else this.facing=dy<0?'up':'down';
      this.anims.play(`${this.animationPrefix}_${this.facing}_walk`,true);
    }else{this.setVelocity(0,0);this.anims.play(`${this.animationPrefix}_${this.facing}_idle`,true);}
    this.setDepth(groundDepth(this.y,32));
  }
}

export function createRpgAnimations(scene){
  const actors=[['heroMaleSprites','heroMale'],['heroFemaleSprites','heroFemale'],['npcMotherSprites','npcMother'],['npcFatherSprites','npcFather'],['npcTeacherSprites','npcTeacher'],['npcNeighborSprites','npcNeighbor'],['npcGardenerSprites','npcGardener']];
  const directions=['down','left','right','up'];
  for(const [texture,prefix] of actors){
    for(let row=0;row<directions.length;row++){
      const direction=directions[row],base=row*5;
      const walkKey=`${prefix}_${direction}_walk`,idleKey=`${prefix}_${direction}_idle`;
      if(!scene.anims.exists(walkKey))scene.anims.create({key:walkKey,frames:scene.anims.generateFrameNumbers(texture,{start:base,end:base+3}),frameRate:9,repeat:-1});
      if(!scene.anims.exists(idleKey))scene.anims.create({key:idleKey,frames:[{key:texture,frame:base+4}],frameRate:1,repeat:0});
    }
  }
}
