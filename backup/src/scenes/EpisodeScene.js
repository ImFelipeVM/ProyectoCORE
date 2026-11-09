import { gameManager } from '../systems/GameManager.js';
import { EPISODES } from '../data/episodes.js';

export class EpisodeScene extends Phaser.Scene {
    constructor() {
        super('EpisodeScene');
    }

    init(data) {
        this.episodeId = data.episodeId || 1;
        this.episodeData = EPISODES.find(e => e.id === this.episodeId);
    }

    preload() {
        // Assets loaded via BootScene
    }

    create() {
        const { width, height } = this.cameras.main;

        // 1. Background: Use the SVG background from AssetGenerator
        if (this.textures.exists(this.episodeData.background)) {
            this.add.image(width / 2, height / 2, this.episodeData.background)
                .setDisplaySize(width, height);
        } else {
            this.add.rectangle(width / 2, height / 2, width, height, 0x222222).setOrigin(0.5);
        }

        this.setupMap();
        this.setupPlayer();
        this.setupNPCs();
        this.setupControls();
        this.setupInteractions();
    }

    setupMap() {
        this.mapGroup = this.physics.add.staticGroup();

        // Simple boundaries to keep player in view
        const wallLeft = this.add.rectangle(0, 0, 10, 600, 0x000000, 0).setOrigin(0, 0);
        const wallRight = this.add.rectangle(800, 0, 10, 600, 0x000000, 0).setOrigin(0, 0);
        const wallTop = this.add.rectangle(0, 0, 800, 10, 0x000000, 0).setOrigin(0, 0);
        const wallBottom = this.add.rectangle(0, 600, 800, 10, 0x000000, 0).setOrigin(0, 0);

        this.physics.add.existing(wallLeft, true);
        this.physics.add.existing(wallRight, true);
        this.physics.add.existing(wallTop, true);
        this.physics.add.existing(wallBottom, true);

        this.mapGroup.add([wallLeft, wallRight, wallTop, wallBottom]);
    }

    setupPlayer() {
        // Use the gender-specific SVG sprite from AssetGenerator
        const texture = gameManager.player.appearance.gender === 'male' ? 'male' : 'female';

        if (this.textures.exists(texture)) {
            this.player = this.physics.add.sprite(100, 300, texture).setScale(1.5);
        } else {
            this.player = this.add.container(100, 300);
            const body = this.add.rectangle(0, 0, 32, 48, 0xdbac8a).setStrokeStyle(2, 0x000000);
            this.player.add(body);
            this.physics.add.existing(this.player);
        }

        this.player.setCollideWorldBounds(true);
        if (this.mapGroup) {
            this.physics.add.collider(this.player, this.mapGroup);
        }
        this.player.setDepth(1);
    }

    setupNPCs() {
        // NPCs can also be gender-neutral or a specific asset. Using a basic SVG placeholder.
        this.npc = this.add.container(400, 300);
        const body = this.add.rectangle(0, 0, 32, 48, 0x3498db).setStrokeStyle(2, 0xffffff);
        const label = this.add.text(0, -30, 'Interlocutor', { fontSize: '10px', color: '#fff' }).setOrigin(0.5);
        this.npc.add([body, label]);

        this.npc.setSize(32, 48);
        this.physics.add.existing(this.npc);

        if (this.player) {
            this.physics.add.collider(this.player, this.npc);
        }
        this.npc.setDepth(1);
    }

    setupControls() {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys('W,A,S,D');
        this.interactKey = this.input.keyboard.addKey('E');
    }

    setupInteractions() {
        this.update = () => {
            const speed = 160;
            this.player.setVelocity(0);

            if (this.cursors.left.isDown || this.wasd.A.isDown) {
                this.player.setVelocityX(-speed);
            } else if (this.cursors.right.isDown || this.wasd.D.isDown) {
                this.player.setVelocityX(speed);
            }

            if (this.cursors.up.isDown || this.wasd.W.isDown) {
                this.player.setVelocityY(-speed);
            } else if (this.cursors.down.isDown || this.wasd.S.isDown) {
                this.player.setVelocityY(speed);
            }

            this.player.setDepth(this.player.y);
            this.npc.setDepth(this.npc.y);

            if (Phaser.Math.Distance.Between(this.player.x, this.player.y, this.npc.x, this.npc.y) < 64) {
                if (Phaser.Input.Keyboard.JustDown(this.interactKey)) {
                    this.startDialogue();
                }
            }
        };
    }

    startDialogue() {
        const { width, height } = this.cameras.main;

        // RPG-style dialogue box
        const panel = this.add.rectangle(width / 2, height - 100, 640, 180, 0x000000, 0.9)
            .setStrokeStyle(6, '#8b5a2b')
            .setDepth(100);

        const nameTag = this.add.text(width / 2 - 300, height - 180, `Escenario: ${this.episodeData.theme}`, {
            fontSize: '18px',
            color: '#ffd700',
            fontFamily: 'monospace',
            fontStyle: 'bold'
        }).setDepth(101);

        const text = this.add.text(width / 2 - 300, height - 160, this.episodeData.narrative, {
            fontSize: '16px',
            color: '#ffffff',
            fontFamily: 'monospace',
            wordWrap: { width: 600 }
        }).setDepth(101);

        const continuePrompt = this.add.text(width / 2 + 280, height - 60, '[E] Siguiente', {
            fontSize: '14px',
            color: '#aaa',
            fontFamily: 'monospace'
        }).setDepth(101);

        this.dialogueStep = 0;
        this.dialogueData = [
            { text: this.episodeData.narrative },
            { text: `LECTURA ACADÉMICA:\n\n${this.episodeData.reading}` },
            { text: 'Considera cuidadosamente tu respuesta...' }
        ];

        this.input.keyboard.once('keydown-E', () => {
            this.dialogueStep++;
            if (this.dialogueStep < this.dialogueData.length) {
                text.setText(this.dialogueData[this.dialogueStep].text);
            } else {
                this.showOptions(panel, nameTag, text, continuePrompt);
            }
        });
    }

    showOptions(panel, nameTag, text, continuePrompt) {
        continuePrompt.setVisible(false);
        text.setText('¿Cuál es tu decisión?');

        this.episodeData.options.forEach((opt, idx) => {
            const optBtn = this.add.rectangle(400, 200 + (idx * 60), 450, 45, 0x4a3123)
                .setStrokeStyle(3, 0x8b5a2b)
                .setInteractive({ useHandCursor: true })
                .setDepth(102);

            const optText = this.add.text(400, 200 + (idx * 60), `${opt.id}: ${opt.text}`, {
                fontSize: '14px',
                color: '#fff',
                fontFamily: 'monospace'
            }).setOrigin(0.5).setDepth(103);

            optBtn.on('pointerdown', () => {
                this.handleDecision(opt);
            });
        });
    }

    handleDecision(option) {
        gameManager.updateScore(option.score);

        // Mark as completed and unlock next
        gameManager.completeEpisode(this.episodeId);

        const feedbackPanel = this.add.rectangle(400, 200, 550, 250, 0x000000, 0.98)
            .setStrokeStyle(6, '#ffd700')
            .setDepth(200);

        this.add.text(400, 140, 'EVALUACIÓN', { fontSize: '24px', color: '#ffd700', fontFamily: 'monospace', fontStyle: 'bold' })
            .setOrigin(0.5).setDepth(201);

        this.add.text(400, 200, option.feedback, {
            fontSize: '16px',
            color: '#fff',
            fontFamily: 'monospace',
            align: 'center',
            wordWrap: { width: 500 }
        }).setOrigin(0.5).setDepth(201);

        const closeBtn = this.add.rectangle(400, 300, 150, 50, 0x4a3123)
            .setStrokeStyle(3, 0x8b5a2b)
            .setInteractive({ useHandCursor: true })
            .setDepth(202);

        this.add.text(400, 300, 'VOLVER AL MAPA', { fontSize: '14px', color: '#fff', fontFamily: 'monospace', fontStyle: 'bold' })
            .setOrigin(0.5).setDepth(203);

        closeBtn.on('pointerdown', () => {
            this.scene.start('WorldMapScene');
        });
    }
}
