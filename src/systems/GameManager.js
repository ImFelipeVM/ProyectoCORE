import { EPISODE_1_ENDINGS } from '../data/episode1.js';
const SAVE_KEY='caminoAutoconocimientoSave';
const freshJourney=()=>({started:false,seedCollected:false,treePlanted:false,complete:false,sharedFruit:false,decisions:{},qualities:{criterio:0,authenticity:0,freedom:0,excellence:0,bonds:0},choiceScore:0,growthPoints:0,recoveryPoints:0,streakPoints:0,streak:0,stationRewards:{},resolvedStations:{},inventory:[],recoveries:{},ending:null});
const freshPlayer=()=>({name:'Viajero',appearance:{gender:'male',skinTone:0,hairStyle:0},score:0,currentEpisode:1,completedEpisodes:[],decisions:{},episode1Progress:null,worldPosition:null,worldVisitedAreas:[],journey:freshJourney()});
export class GameManager {
 constructor(){this.player=freshPlayer();}
 finishEpisode1(result, progress){
  if(this.player.completedEpisodes.includes(1)||!result||!Object.hasOwn(EPISODE_1_ENDINGS,result.branch))return false;
  const ending=EPISODE_1_ENDINGS[result.branch];
  this.player.score+=ending.score;
  this.player.completedEpisodes=[...new Set([...this.player.completedEpisodes,1])];
  this.player.currentEpisode=1;
  this.player.decisions[1]=result.branch;
  this.player.episode1Progress={...progress,ending:{branch:result.branch,...ending}};
  this.saveGame();return true;
 }
 startJourney(){this.player.journey.started=true;this.player.journey.seedCollected=true;this.saveGame();}
 recordJourneyDecision(decision, optionIndex){
  const journey=this.player.journey|| (this.player.journey=freshJourney());
  const option=decision?.options?.[optionIndex];
  if(!decision?.id||!option||journey.decisions[decision.id])return null;
  const points=Math.max(0,Math.min(2,Number(option.points)||0));
  const record={optionIndex,points,quality:decision.quality,source:decision.source};
  journey.decisions[decision.id]=record;journey.choiceScore+=points;
  journey.qualities[decision.quality]=(Number(journey.qualities[decision.quality])||0)+points;
  let streakAward=0;
  if(points===2){journey.streak+=1;if(journey.streak>=3){streakAward=1;journey.streak=0;journey.streakPoints+=1;}}
  else journey.streak=0;
  record.streakAward=streakAward;
  this.player.score+=points+streakAward;
  this.saveGame();return record;
 }
 awardJourneyGrowth(stationId,reward){
  const journey=this.player.journey|| (this.player.journey=freshJourney());
  if(journey.stationRewards[stationId])return false;
  journey.stationRewards[stationId]=reward||true;journey.resolvedStations[stationId]=true;journey.inventory=[...(Array.isArray(journey.inventory)?journey.inventory:[]),...(reward?[reward]:[])];journey.growthPoints+=1;this.player.score+=1;this.saveGame();return true;
 }
 skipJourneyStation(stationId){const journey=this.player.journey|| (this.player.journey=freshJourney());journey.resolvedStations[stationId]=true;this.saveGame();}
 recoverJourneyPoint(stationId,success,reward){
  const journey=this.player.journey|| (this.player.journey=freshJourney());
  if(Object.hasOwn(journey.recoveries,stationId))return {awarded:false,alreadyUsed:true};
  journey.recoveries[stationId]=Boolean(success);
  journey.resolvedStations[stationId]=true;
  if(success){journey.recoveryPoints+=1;this.player.score+=1;if(reward){journey.stationRewards[stationId]=reward;journey.inventory=[...(Array.isArray(journey.inventory)?journey.inventory:[]),reward];}}
  this.saveGame();return {awarded:Boolean(success),alreadyUsed:false};
 }
 completeJourney(ending){
  const journey=this.player.journey|| (this.player.journey=freshJourney());
  journey.treePlanted=true;journey.complete=true;journey.ending=ending;this.saveGame();
 }
 resetJourney(){
  const journey=this.player.journey||freshJourney();
  const journeyScore=(Number(journey.choiceScore)||0)+(Number(journey.growthPoints)||0)+(Number(journey.recoveryPoints)||0)+(Number(journey.streakPoints)||0);
  this.player.score-=journeyScore;this.player.journey=freshJourney();this.player.worldPosition={x:900,y:1550};this.saveGame();
 }
 saveGame(){try{localStorage.setItem(SAVE_KEY,JSON.stringify(this.player));}catch{}}
 loadGame(){try{const raw=localStorage.getItem(SAVE_KEY);if(!raw)return false;const saved=JSON.parse(raw);if(!saved||typeof saved!=='object')return false;const defaults=freshPlayer();const journey={...freshJourney(),...(saved.journey||{})};this.player={...defaults,...saved,appearance:{...defaults.appearance,...saved.appearance},decisions:saved.decisions||{},worldVisitedAreas:Array.isArray(saved.worldVisitedAreas)?[...new Set(saved.worldVisitedAreas)]:[],journey:{...journey,qualities:{...freshJourney().qualities,...journey.qualities},decisions:journey.decisions&&typeof journey.decisions==='object'?journey.decisions:{},stationRewards:journey.stationRewards&&typeof journey.stationRewards==='object'?journey.stationRewards:{},resolvedStations:journey.resolvedStations&&typeof journey.resolvedStations==='object'?journey.resolvedStations:{},inventory:Array.isArray(journey.inventory)?journey.inventory:[],recoveries:journey.recoveries&&typeof journey.recoveries==='object'?journey.recoveries:{}}};this.player.completedEpisodes=Array.isArray(saved.completedEpisodes)?saved.completedEpisodes.filter(id=>Number(id)===1):[];this.player.currentEpisode=1;this.player.score=Number(saved.score)||0;return true;}catch{this.player=freshPlayer();return false;}}
 resetGame(){this.player=freshPlayer();try{localStorage.removeItem(SAVE_KEY);}catch{}}
}
export const gameManager=new GameManager();
