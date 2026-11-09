export class GameManager {
    constructor() {
        this.player = {
            name: "Jugador",
            appearance: {
                gender: 'male',
                skinTone: 0,
                hairStyle: 0,
                hairColor: 0,
                clothing: 0,
                accessories: []
            },
            score: 0,
            currentEpisode: 1,
            completedEpisodes: []
        };
        this.gameState = 'BOOT'; // BOOT, MENU, CHARACTER_CREATION, MAP, EPISODE, RESULTS
    }

    updateScore(points) {
        this.player.score += points;
    }

    completeEpisode(episodeId) {
        if (!this.player.completedEpisodes.includes(episodeId)) {
            this.player.completedEpisodes.push(episodeId);
        }
        this.player.currentEpisode++;
    }

    saveGame() {
        localStorage.setItem('caminoAutoconocimientoSave', JSON.stringify(this.player));
    }

    loadGame() {
        const saved = localStorage.getItem('caminoAutoconocimientoSave');
        if (saved) {
            this.player = JSON.parse(saved);
            return true;
        }
        return false;
    }

    resetGame() {
        this.player = {
            name: "Jugador",
            appearance: {
                gender: 'male',
                skinTone: 0,
                hairStyle: 0,
                hairColor: 0,
                clothing: 0,
                accessories: []
            },
            score: 0,
            currentEpisode: 1,
            completedEpisodes: []
        };
        localStorage.removeItem('caminoAutoconocimientoSave');
    }
}

export const gameManager = new GameManager();
