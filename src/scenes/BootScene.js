import { gameManager } from '../systems/GameManager.js';

export class BootScene extends Phaser.Scene {
  constructor() { super('BootScene'); }
  create() {
    gameManager.loadGame();
    this.scene.start('MenuScene');
  }
}
