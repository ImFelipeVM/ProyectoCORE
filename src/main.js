import { GAME_CONFIG } from './config/gameConfig.js';
import { BootScene } from './scenes/BootScene.js';
import { MenuScene } from './scenes/MenuScene.js';
import { CharacterCreatorScene } from './scenes/CharacterCreatorScene.js';
import { ValleyScene } from './scenes/ValleyScene.js';
import { EpisodeScene } from './scenes/EpisodeScene.js';
import { ResultsScene } from './scenes/ResultsScene.js';

new Phaser.Game({
  type: Phaser.AUTO, width: GAME_CONFIG.width, height: GAME_CONFIG.height,
  parent: 'game-container', backgroundColor: '#132b37',
  pixelArt: true, roundPixels: true,
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  render: { antialias: false, pixelArt: true },
  physics: { default: 'arcade', arcade: { debug: false } },
  scene: [BootScene, MenuScene, CharacterCreatorScene, ValleyScene, EpisodeScene, ResultsScene]
});
