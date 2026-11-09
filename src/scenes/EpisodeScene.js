import { gameManager } from '../systems/GameManager.js';
import { EPISODES } from '../data/episodes.js';
import { drawBackdrop, addButton } from '../systems/visuals.js';

const VIEW = { width: 960, height: 600 };

export class EpisodeScene extends Phaser.Scene {
  constructor() {
    super('EpisodeScene');
    this.overlayObjects = [];
    this.choiceObjects = [];
  }

  init(data = {}) {
    const requestedId = Number(data.episodeId);
    this.episodeId = Number.isInteger(requestedId) ? requestedId : 0;
    this.episodeData = EPISODES.find((episode) => episode.id === this.episodeId) || null;
    this.answered = false;
    this.dialogueActive = false;
    this.dialogueStep = 0;
    console.info(`[EpisodeScene] init episodeId=${this.episodeId}`);
  }

  create() {
    if (!this.episodeData) {
      console.error(`[EpisodeScene] Invalid episode id: ${this.episodeId}; expected 1–${EPISODES.length}`);
      this.showInvalidEpisode();
      return;
    }
    if (this.episodeId > gameManager.player.currentEpisode && !gameManager.player.completedEpisodes.includes(this.episodeId)) {
      console.error(`[EpisodeScene] Episode ${this.episodeId} is locked; current episode is ${gameManager.player.currentEpisode}`);
      this.showInvalidEpisode('Esta estación todavía está bloqueada.');
      return;
    }

    console.info(`[EpisodeScene] create ${this.episodeData.title}`);
    drawBackdrop(this, this.episodeId - 1);
    this.add.rectangle(480, 300, VIEW.width, VIEW.height, 0x11242c, 0.44);
    this.add.rectangle(480, 38, 910, 54, 0x17343a, 0.94).setStrokeStyle(2, 0xd4bd83);
    this.add.text(35, 38, `${String(this.episodeId).padStart(2, '0')} / 08`, { fontFamily: 'Arial', fontSize: '15px', fontStyle: 'bold', color: '#f1d28d' }).setOrigin(0, 0.5);
    this.add.text(480, 38, this.episodeData.title, { fontFamily: 'Arial', fontSize: '20px', fontStyle: 'bold', color: '#fff3d7' }).setOrigin(0.5);
    this.add.text(925, 38, this.episodeData.theme.toUpperCase(), { fontFamily: 'Arial', fontSize: '12px', color: '#d4e0d0' }).setOrigin(1, 0.5);

    this.createActorTextures();
    this.player = this.physics.add.sprite(165, 435, 'episode_player');
    this.player.setScale(1.2).setDepth(5).setCollideWorldBounds(true);
    this.player.body.setSize(28, 38).setOffset(18, 34);
    this.player.body.setAllowGravity(false);
    this.player.setMaxVelocity(170, 170);

    this.npc = this.physics.add.sprite(685, 435, 'episode_npc');
    this.npc.setScale(1.2).setDepth(5).setImmovable(true).setCollideWorldBounds(true);
    this.npc.body.setSize(28, 38).setOffset(18, 34).setAllowGravity(false);
    this.physics.world.setBounds(24, 100, 912, 408);
    // Both bodies exist before the collider is registered.
    this.npcCollider = this.physics.add.collider(this.player, this.npc);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      right: Phaser.Input.Keyboard.KeyCodes.D
    });
    this.interactKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    this.playerName = this.add.text(this.player.x, this.player.y - 60, gameManager.player.name, {
      fontFamily: 'Arial', fontSize: '13px', fontStyle: 'bold', color: '#fff4d6', stroke: '#172a32', strokeThickness: 3
    }).setOrigin(0.5).setDepth(6);
    this.npcName = this.add.text(this.npc.x, this.npc.y - 60, this.episodeId === 1 ? 'MAMÁ' : 'COMPAÑERO', {
      fontFamily: 'Arial', fontSize: '13px', fontStyle: 'bold', color: '#fff4d6', stroke: '#172a32', strokeThickness: 3
    }).setOrigin(0.5).setDepth(6);
    this.instruction = this.add.text(480, 552, 'Muévete con WASD o las flechas. Acércate y pulsa E para conversar.', {
      fontFamily: 'Arial', fontSize: '15px', fontStyle: 'bold', color: '#fff3d7', stroke: '#263b38', strokeThickness: 4
    }).setOrigin(0.5).setDepth(8);
    this.tweens.add({ targets: this.instruction, alpha: 0.58, duration: 650, yoyo: true, repeat: -1 });
    this.sceneHint = this.add.text(34, 88, 'ACÉRCATE A TU INTERLOCUTOR', { fontFamily: 'Arial', fontSize: '12px', fontStyle: 'bold', color: '#f1d28d', letterSpacing: 1.5 }).setDepth(8);
    this.input.keyboard.enabled = true;
    console.info(`[EpisodeScene] actors and collider ready; episodeId=${this.episodeId}`);
  }

  createActorTextures() {
    const gender = gameManager.player.appearance.gender === 'female' ? 'female' : 'male';
    this.createPixelActorTexture('episode_player', gender === 'female' ? 0xd66f86 : 0x4b89a0, gender === 'female' ? 0x49323a : 0x42372e);
    this.createPixelActorTexture('episode_npc', 0xd59b50, 0x584332);
  }

  createPixelActorTexture(key, shirt, hair) {
    if (this.textures.exists(key)) return;
    const art = this.make.graphics({ x: 0, y: 0, add: false });
    // A compact, crisp sprite used by the physics actors (local texture; no network assets).
    art.fillStyle(0x263b42).fillRect(13, 66, 38, 7);
    art.fillStyle(0x344d57).fillRect(19, 47, 26, 22);
    art.fillStyle(shirt).fillRect(15, 42, 34, 24).fillRect(10, 45, 8, 18).fillRect(46, 45, 8, 18);
    art.fillStyle(0xdaa882).fillRect(23, 30, 18, 18).fillRect(18, 15, 28, 23);
    art.fillStyle(hair).fillRect(18, 12, 28, 11).fillRect(17, 18, 6, 14);
    art.fillStyle(0x26343a).fillRect(25, 24, 3, 3).fillRect(37, 24, 3, 3);
    art.fillStyle(0xf6dd9d).fillRect(28, 43, 4, 5).fillRect(34, 43, 4, 5);
    art.generateTexture(key, 64, 80);
    art.destroy();
  }

  update() {
    if (!this.player?.active || !this.npc?.active || this.answered) return;
    if (this.dialogueActive) {
      this.player.setVelocity(0, 0);
      if (Phaser.Input.Keyboard.JustDown(this.interactKey)) this.advanceDialogue();
      return;
    }
    const left = this.cursors.left.isDown || this.wasd.left.isDown;
    const right = this.cursors.right.isDown || this.wasd.right.isDown;
    const up = this.cursors.up.isDown || this.wasd.up.isDown;
    const down = this.cursors.down.isDown || this.wasd.down.isDown;
    this.player.setVelocity((right ? 1 : 0) - (left ? 1 : 0), (down ? 1 : 0) - (up ? 1 : 0));
    this.player.body.velocity.normalize().scale(155);
    this.player.setDepth(this.player.y);
    this.npc.setDepth(this.npc.y);
    this.playerName.setPosition(this.player.x, this.player.y - 60).setDepth(this.player.depth + 1);
    this.npcName.setPosition(this.npc.x, this.npc.y - 60).setDepth(this.npc.depth + 1);
    const close = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.npc.x, this.npc.y) < 95;
    this.instruction.setText(close ? 'Pulsa E para hablar' : 'Muévete con WASD o las flechas. Acércate y pulsa E para conversar.');
    if (close && Phaser.Input.Keyboard.JustDown(this.interactKey)) this.beginDialogue();
  }

  beginDialogue() {
    if (this.dialogueActive || this.answered) return;
    this.dialogueActive = true;
    this.dialogueStep = 0;
    this.instruction.setVisible(false);
    this.sceneHint.setVisible(false);
    this.player.setVisible(false);
    this.npc.setVisible(false);
    this.playerName.setVisible(false);
    this.npcName.setVisible(false);
    this.showDialoguePage();
  }

  showDialoguePage() {
    this.clearOverlay();
    const pages = [
      { title: this.episodeId === 1 ? 'MAMÁ' : 'INTERLOCUTOR', text: this.episodeData.narrative, prompt: 'CONTINUAR  ·  E' },
      { title: 'LECTURA PARA REFLEXIONAR', text: this.episodeData.reading, prompt: 'ELEGIR MI RESPUESTA  ·  E' }
    ];
    const page = pages[this.dialogueStep];
    const panel = this.add.rectangle(480, 464, 900, 205, 0x152a32, 0.98).setStrokeStyle(4, 0xe0c17e).setDepth(20);
    const label = this.add.text(65, 378, page.title, { fontFamily: 'Arial', fontSize: '15px', fontStyle: 'bold', color: '#f2d393', letterSpacing: 1 }).setDepth(21);
    const text = this.add.text(65, 410, page.text, { fontFamily: 'Arial', fontSize: '18px', color: '#fff6e4', wordWrap: { width: 825 }, lineSpacing: 4 }).setDepth(21);
    const { plate, text: prompt } = addButton(this, 480, 540, page.prompt, () => this.advanceDialogue(), 300, 44);
    plate.setDepth(22); prompt.setDepth(23);
    this.overlayObjects.push(panel, label, text, plate, prompt);
  }

  advanceDialogue() {
    if (!this.dialogueActive) return;
    if (this.dialogueStep === 0) {
      this.dialogueStep = 1;
      this.showDialoguePage();
      return;
    }
    this.dialogueActive = false;
    this.showOptions();
  }

  showOptions() {
    this.clearOverlay();
    const panel = this.add.rectangle(480, 457, 930, 220, 0x152a32, 0.92).setStrokeStyle(4, 0xe0c17e).setDepth(19);
    const header = this.add.rectangle(480, 353, 900, 52, 0x152a32, 0.98).setStrokeStyle(3, 0xe0c17e).setDepth(20);
    const title = this.add.text(480, 353, '¿QUÉ DECIDES?', { fontFamily: 'Arial', fontSize: '19px', fontStyle: 'bold', color: '#f2d393', letterSpacing: 2 }).setOrigin(0.5).setDepth(21);
    this.overlayObjects.push(panel, header, title);
    this.episodeData.options.forEach((option, index) => {
      const y = 414 + index * 59;
      const plate = this.add.rectangle(480, y, 900, 49, 0x21464c, 0.98).setStrokeStyle(2, 0xc8b681).setInteractive({ useHandCursor: true }).setDepth(20);
      const marker = this.add.rectangle(67, y, 32, 32, 0xd7bb7c).setDepth(21);
      const letter = this.add.text(67, y, option.id, { fontFamily: 'Arial', fontSize: '16px', fontStyle: 'bold', color: '#243c3d' }).setOrigin(0.5).setDepth(22);
      const text = this.add.text(94, y, option.text, { fontFamily: 'Arial', fontSize: '15px', color: '#fff6e4', wordWrap: { width: 810 } }).setOrigin(0, 0.5).setDepth(21);
      plate.on('pointerover', () => { plate.setFillStyle(0x356767); text.setColor('#fff0c1'); });
      plate.on('pointerout', () => { plate.setFillStyle(0x21464c); text.setColor('#fff6e4'); });
      plate.on('pointerdown', () => this.choose(option));
      this.choiceObjects.push(plate, marker, letter, text);
    });
  }

  choose(option) {
    if (this.answered) return;
    this.answered = true;
    this.player.setVelocity(0, 0);
    const recorded = gameManager.recordEpisodeDecision(this.episodeId, option.id, option.score);
    if (!recorded) {
      console.error(`[EpisodeScene] Decision was not recorded; episodeId=${this.episodeId}, currentEpisode=${gameManager.player.currentEpisode}`);
    }
    this.clearOverlay();
    this.clearChoices();
    const shade = this.add.rectangle(480, 300, VIEW.width, VIEW.height, 0x10252d, 0.88).setDepth(30);
    const panel = this.add.rectangle(480, 300, 680, 350, 0x18383c, 0.99).setStrokeStyle(4, option.score > 0 ? 0xe0c17e : 0xc58b6f).setDepth(31);
    const heading = this.add.text(480, 188, option.score > 0 ? 'UNA ELECCIÓN CON PROPÓSITO' : 'UNA OPORTUNIDAD PARA APRENDER', { fontFamily: 'Arial', fontSize: '22px', fontStyle: 'bold', color: option.score > 0 ? '#efd28e' : '#e7b99a', align: 'center', wordWrap: { width: 610 } }).setOrigin(0.5).setDepth(32);
    const status = this.add.text(480, 232, recorded ? `${option.score > 0 ? '+' : ''}${option.score} PUNTOS  ·  TOTAL ${gameManager.player.score}` : 'ESTACIÓN YA REGISTRADA', { fontFamily: 'Arial', fontSize: '16px', fontStyle: 'bold', color: '#f6ebd4' }).setOrigin(0.5).setDepth(32);
    const feedback = this.add.text(480, 306, option.feedback, { fontFamily: 'Arial', fontSize: '17px', color: '#fff7e8', align: 'center', wordWrap: { width: 565 }, lineSpacing: 5 }).setOrigin(0.5).setDepth(32);
    const finalEpisode = gameManager.player.completedEpisodes.length >= 8;
    const { plate, text } = addButton(this, 480, 432, finalEpisode ? 'VER RESULTADOS' : 'VOLVER AL MAPA', () => this.scene.start(finalEpisode ? 'ResultsScene' : 'WorldMapScene'), 280, 54);
    plate.setDepth(33); text.setDepth(34);
    this.overlayObjects.push(shade, panel, heading, status, feedback, plate, text);
    console.info(`[EpisodeScene] choice=${option.id}, recorded=${recorded}, score=${gameManager.player.score}, unlocked=${gameManager.player.currentEpisode}`);
  }

  clearOverlay() {
    for (const object of this.overlayObjects) object.destroy();
    this.overlayObjects = [];
  }

  clearChoices() {
    for (const object of this.choiceObjects) object.destroy();
    this.choiceObjects = [];
  }

  showInvalidEpisode(message = 'No se pudo abrir este episodio.') {
    this.add.rectangle(480, 300, VIEW.width, VIEW.height, 0x101f27, 0.98);
    this.add.text(480, 245, message, { fontFamily: 'Arial', fontSize: '23px', color: '#fff1d0', align: 'center', wordWrap: { width: 700 } }).setOrigin(0.5);
    addButton(this, 480, 330, 'VOLVER AL TABLERO', () => this.scene.start('WorldMapScene'));
  }
}
