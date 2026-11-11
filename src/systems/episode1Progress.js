import { EPISODE_1_ENDINGS, STUDY_MATERIALS } from '../data/episode1.js';

export const EPISODE_1_STUDY_DURATION_MS = 12000;

const INITIAL_FLAGS = Object.freeze({
  home: false,
  family: false,
  promise: false,
  report: false,
  schedule: false,
  backpack: false,
  study: false,
  chore: false,
  reflection: false,
  argued: false
});

export class Episode1Progress {
  constructor(saved = {}) {
    this.flags = { ...INITIAL_FLAGS, ...(saved.flags || {}) };
    this.studyHours = Number(saved.studyHours) || 0;
    const savedMaterials=Array.isArray(saved.organizedMaterials)?saved.organizedMaterials:[];
    this.organizedMaterials=[...new Set(savedMaterials)].filter(id=>STUDY_MATERIALS.some(item=>item.id===id));
    if(this.flags.backpack)this.organizedMaterials=STUDY_MATERIALS.map(item=>item.id);
    this.studyElapsedMs=this.flags.study?EPISODE_1_STUDY_DURATION_MS:Math.max(0,Math.min(EPISODE_1_STUDY_DURATION_MS-1,Number(saved.studyElapsedMs)||0));
    this.ending = saved.ending || null;
  }

  complete(id) {
    if (Object.hasOwn(this.flags, id)) this.flags[id] = true;
  }

  organizeMaterial(id) {
    if(this.flags.backpack||!STUDY_MATERIALS.some(item=>item.id===id)||this.organizedMaterials.includes(id))return false;
    this.organizedMaterials.push(id);
    if(this.organizedMaterials.length===STUDY_MATERIALS.length)this.flags.backpack=true;
    return true;
  }

  get responsibleReady() {
    return this.flags.home && this.flags.family && this.flags.report && this.flags.schedule &&
      this.flags.backpack && this.flags.study && this.flags.chore && !this.flags.argued;
  }

  resolve() {
    if (this.ending) return this.ending;
    const branch = this.flags.argued ? 'emotiva' : this.responsibleReady && this.flags.reflection ? 'responsable' : 'superficial';
    this.ending = { branch, ...EPISODE_1_ENDINGS[branch] };
    return this.ending;
  }

  serialize() {
    return { flags: { ...this.flags }, studyHours: this.studyHours, organizedMaterials:[...this.organizedMaterials], studyElapsedMs:this.studyElapsedMs, ending: this.ending };
  }
}
