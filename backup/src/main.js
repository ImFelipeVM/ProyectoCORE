import { GAME_CONFIG } from './config/gameConfig.js';
import { BootScene } from './scenes/BootScene.js';
import { MenuScene } from './scenes/MenuScene.js';
import { CharacterCreatorScene } from './scenes/CharacterCreatorScene.js';
import { WorldMapScene } from './scenes/WorldMapScene.js';
import { EpisodeScene } from './scenes/EpisodeScene.js';
import { ResultsScene } from './scenes/ResultsScene.js';

// Phaser is already loaded globally via local library in index.html
const config = {
    type: Phaser.AUTO,
    width: GAME_CONFIG.width,
    height: GAME_CONFIG.height,
    parent: 'game-container',
    pixelArt: GAME_CONFIG.pixelArt,
    roundPixels: GAME_CONFIG.roundPixels,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [
        BootScene,
        MenuScene,
        CharacterCreatorScene,
        WorldMapScene,
        EpisodeScene,
        ResultsScene
    ]
};

new Phaser.Game(config);
