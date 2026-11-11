import { gameManager } from '../systems/GameManager.js';
import { EPISODE_1_ENDINGS } from '../data/episode1.js';
import { JOURNEY_DECISIONS, JOURNEY_MAX_SCORE, JOURNEY_QUALITIES } from '../data/journey.js';
import { drawBackdrop, addButton } from '../systems/visuals.js';

export class ResultsScene extends Phaser.Scene {
  constructor(){super('ResultsScene');}
  init(data={}){this.resultKind=data.kind==='journey'?'journey':'episode1';}
  create(){
    if(this.resultKind==='journey'){this.createJourneyResults();return;}
    this.createEpisode1Results();
  }

  createEpisode1Results(){
    drawBackdrop(this,7);this.add.rectangle(480,300,960,600,0x11242c,.52);
    const branch=gameManager.player.episode1Progress?.ending;
    const ending=branch||EPISODE_1_ENDINGS[gameManager.player.decisions[1]];
    this.add.rectangle(480,304,760,500,0x18383c,.97).setStrokeStyle(3,ending?.score>0?0xd8c38f:0xc98d72);
    this.add.text(480,70,'LA INFANCIA Y EL HOGAR',{fontFamily:'Arial',fontSize:'27px',fontStyle:'bold',color:'#f2d393',letterSpacing:1}).setOrigin(.5);
    this.add.text(480,113,ending?.label||'ESTACIÓN COMPLETADA',{fontFamily:'Arial',fontSize:'21px',fontStyle:'bold',color:'#fff1c9'}).setOrigin(.5);
    this.add.text(480,158,`${ending?.score>0?'+':''}${ending?.score??0} puntos de criterio`,{fontFamily:'Arial',fontSize:'20px',fontStyle:'bold',color:'#fff1c9'}).setOrigin(.5);
    const actor=gameManager.player.appearance.gender==='female'?'heroFemale':'heroMale';
    const portrait=this.add.image(480,270,actor);
    const source=this.textures.get(actor).getSourceImage();portrait.setScale(Math.min(90/source.width,160/source.height));
    this.add.text(480,380,ending?.conduct||'Has finalizado la primera estación.',{fontFamily:'Arial',fontSize:'15px',color:'#fff4df',align:'center',wordWrap:{width:610},lineSpacing:4}).setOrigin(.5);
    this.add.text(480,440,ending?.consequence||'',{fontFamily:'Arial',fontSize:'15px',color:'#e9ddb8',align:'center',wordWrap:{width:620},lineSpacing:4}).setOrigin(.5);
    this.add.text(480,493,gameManager.player.journey.seedCollected?'La semilla ya está contigo. Cruza el Valle para continuar el recorrido.':'Don Tomás te espera en el jardín para entregarte una semilla.',{fontFamily:'Arial',fontSize:'14px',fontStyle:'italic',color:'#f2d393',align:'center',wordWrap:{width:640}}).setOrigin(.5);
    addButton(this,480,557,'CONTINUAR AL VALLE',()=>this.scene.start('ValleyScene'),250,46);
    addButton(this,850,557,'INICIO',()=>this.scene.start('MenuScene'),130,42);
  }

  createJourneyResults(){
    const journey=gameManager.player.journey;
    const ending=journey.ending||{title:'EL BROTE',branch:'brote',total:0,percent:0,max:JOURNEY_MAX_SCORE};
    const total=Number(ending.total)||0,percent=Number(ending.percent)||0;
    this.add.image(480,300,'valleyMap').setDisplaySize(960,640).setAlpha(.38);
    this.add.rectangle(480,300,960,600,0x11221f,.68);
    this.add.rectangle(480,300,900,548,0x1d3631,.98).setStrokeStyle(3,0xd8ba7a);
    this.add.text(480,53,'RESULTADOS DEL VALLE',{fontFamily:'Arial',fontSize:'23px',fontStyle:'bold',color:'#f4d48d',letterSpacing:1}).setOrigin(.5);
    this.add.text(480,91,`${ending.title}  ·  ${total}/${JOURNEY_MAX_SCORE} PUNTOS  ·  ${percent}%`,{fontFamily:'Arial',fontSize:'15px',fontStyle:'bold',color:'#fff2d0'}).setOrigin(.5);

    const stage=ending.branch==='eco'?0:ending.branch==='brote'?0.62:1;
    this.add.image(240,247,'journeyLandmarks',8).setDisplaySize(288,202).setScale(.72+stage*.25);
    const actor=gameManager.player.appearance.gender==='female'?'heroFemale':'heroMale';
    const portrait=this.add.image(111,260,actor);const source=this.textures.get(actor).getSourceImage();portrait.setScale(Math.min(72/source.width,132/source.height));
    this.add.text(238,367,`Semilla · brote · árbol · frutos`,{fontFamily:'Arial',fontSize:'11px',color:'#f0dfb2'}).setOrigin(.5);

    this.add.text(646,142,'CUALIDADES',{fontFamily:'Arial',fontSize:'13px',fontStyle:'bold',color:'#f4d48d',letterSpacing:1}).setOrigin(.5);
    const qualities=journey.qualities||{};
    JOURNEY_QUALITIES.forEach((quality,index)=>{
      const questions=JOURNEY_DECISIONS.filter(item=>item.quality===quality.id).length;
      const maximum=questions*2,score=Number(qualities[quality.id])||0,ratio=maximum?Math.max(0,Math.min(1,score/maximum)):0;
      const y=181+index*43;
      this.add.text(469,y,quality.name,{fontFamily:'Arial',fontSize:'11px',fontStyle:'bold',color:'#fff2d0'}).setOrigin(0,0.5);
      this.add.rectangle(650,y,174,11,0x152824,.96).setStrokeStyle(1,0x738874);
      if(ratio>0)this.add.rectangle(563+87*ratio,y,174*ratio,7,0xc1a96e,.98);
      this.add.text(808,y,`${score}/${maximum}`,{fontFamily:'Arial',fontSize:'10px',color:'#e6ddc5'}).setOrigin(1,.5);
      if(score===maximum)this.add.text(826,y,'INSIGNIA',{fontFamily:'Arial',fontSize:'8px',fontStyle:'bold',color:'#f4d48d'}).setOrigin(0,.5);
    });

    this.add.text(478,395,'LECTURAS PARA REPASAR',{fontFamily:'Arial',fontSize:'12px',fontStyle:'bold',color:'#f4d48d'});
    const missed=[...new Set(JOURNEY_DECISIONS.filter(item=>(Number(journey.decisions?.[item.id]?.points)||0)<2).map(item=>item.source))];
    const columns=[missed.filter((_,index)=>index%2===0),missed.filter((_,index)=>index%2===1)];
    if(missed.length){
      this.add.text(478,418,columns[0].map(item=>`· ${item}`).join('\n'),{fontFamily:'Arial',fontSize:'8px',color:'#f2ead5',wordWrap:{width:190},lineSpacing:2});
      this.add.text(680,418,columns[1].map(item=>`· ${item}`).join('\n'),{fontFamily:'Arial',fontSize:'8px',color:'#f2ead5',wordWrap:{width:205},lineSpacing:2});
    }else this.add.text(478,419,'Respondiste con el máximo crecimiento en todos los dilemas. Vuelve a las fuentes que más te interesaron.',{fontFamily:'Arial',fontSize:'9px',color:'#f2ead5',wordWrap:{width:810}});
    this.add.text(478,367,'OBJETOS',{fontFamily:'Arial',fontSize:'10px',fontStyle:'bold',color:'#f4d48d'});
    const objects=(journey.inventory||[]).map(item=>item.name);
    if(journey.sharedFruit)objects.push('Fruto compartido con Camila');
    const inventory=objects.join('  ·  ')||'Aún no hay objetos de crecimiento.';
    this.add.text(547,367,inventory,{fontFamily:'Arial',fontSize:'8px',color:'#f2ead5',wordWrap:{width:800}});

    addButton(this,355,550,'REPETIR EL VALLE',()=>{gameManager.resetJourney();this.scene.start('ValleyScene');},200,38);
    addButton(this,590,550,'VOLVER AL MENÚ',()=>this.scene.start('MenuScene'),200,38);
  }
}
