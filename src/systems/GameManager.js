const SAVE_KEY = 'caminoAutoconocimientoSave';
const freshPlayer = () => ({
  name: 'Viajero', appearance: { gender: 'male', skinTone: 0, hairStyle: 0 },
  score: 0, currentEpisode: 1, completedEpisodes: [], decisions: {}
});

export class GameManager {
  constructor() { this.player = freshPlayer(); }
  updateScore(points) { this.player.score += points; this.saveGame(); }
  recordEpisodeDecision(id, optionId, points) {
    const episodeId = Number(id);
    if (!Number.isInteger(episodeId) || episodeId < 1 || episodeId > 8) return false;
    if (this.player.completedEpisodes.includes(episodeId)) return false;
    if (episodeId !== this.player.currentEpisode) return false;
    const scoreDelta = Number(points);
    if (!Number.isFinite(scoreDelta)) return false;
    // Commit the choice, score, and unlock together so the save cannot record
    // only half of a decision if the scene changes immediately afterwards.
    this.player.score += scoreDelta;
    this.player.completedEpisodes.push(episodeId);
    this.player.decisions[episodeId] = optionId;
    this.player.currentEpisode = Math.min(8, episodeId + 1);
    this.saveGame();
    return true;
  }
  completeEpisode(id, option) {
    if (!this.player.completedEpisodes.includes(id)) {
      this.player.completedEpisodes.push(id);
      this.player.decisions[id] = option;
      this.player.currentEpisode = Math.min(8, Math.max(this.player.currentEpisode, id + 1));
    }
    this.saveGame();
  }
  saveGame() { try { localStorage.setItem(SAVE_KEY, JSON.stringify(this.player)); } catch {} }
  loadGame() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return false;
      const saved = JSON.parse(raw);
      if (!saved || typeof saved !== 'object') return false;
      this.player = { ...freshPlayer(), ...saved, appearance: { ...freshPlayer().appearance, ...saved.appearance }, decisions: saved.decisions || {} };
      this.player.completedEpisodes = Array.isArray(this.player.completedEpisodes) ? this.player.completedEpisodes : [];
      this.player.currentEpisode = Math.min(8, Math.max(1, Number(this.player.currentEpisode) || 1));
      this.player.score = Number(this.player.score) || 0;
      return true;
    } catch { this.player = freshPlayer(); return false; }
  }
  resetGame() { this.player = freshPlayer(); try { localStorage.removeItem(SAVE_KEY); } catch {} }
}

export const gameManager = new GameManager();
