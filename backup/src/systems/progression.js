
export class GameState {
    constructor() {
        this.score = 0;
        this.currentEpisodeIndex = 0;
        this.completedEpisodes = [];
        this.selectedCharacter = null; // 'male' or 'female'
        this.virtuousDecisions = 0;
        this.professionalFailure = false;
    }

    save() {
        localStorage.setItem('camino_autoconocimiento_save', JSON.stringify(this));
    }

    static load() {
        const saved = localStorage.getItem('camino_autoconocimiento_save');
        if (saved) {
            const data = JSON.parse(saved);
            const state = new GameState();
            Object.assign(state, data);
            return state;
        }
        return new GameState();
    }

    reset() {
        this.score = 0;
        this.currentEpisodeIndex = 0;
        this.completedEpisodes = [];
        this.selectedCharacter = null;
        this.virtuousDecisions = 0;
        this.professionalFailure = false;
        this.save();
    }

    addScore(points) {
        this.score += points;
        this.save();
    }

    completeEpisode(id) {
        if (!this.completedEpisodes.includes(id)) {
            this.completedEpisodes.push(id);
        }
        this.save();
    }
}
