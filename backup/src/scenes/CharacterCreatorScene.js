import { gameManager } from '../systems/GameManager.js';

export class CharacterCreatorScene extends Phaser.Scene {
    constructor() {
        super('CharacterCreatorScene');
    }

    create() {
        const { width, height } = this.cameras.main;

        const bg = this.add.graphics();
        bg.fillGradientStyle(0x1a1a2e, 0x16213e, 0x0f3460, 0x0f3460, 1);
        bg.fillRect(0, 0, width, height);

        this.add.text(width / 2, 40, 'CREA TU PERSONAJE', {
            fontSize: '24px',
            color: '#ffd700',
            fontFamily: 'monospace',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.previewContainer = this.add.container(width / 2, height / 2);

        // Using the new SVG-based sprite instead of rectangles
        this.playerSprite = this.add.image(0, 0, gameManager.player.appearance.gender === 'male' ? 'male' : 'female')
            .setScale(2);

        this.previewContainer.add(this.playerSprite);

        const panel = this.add.rectangle(width / 4, height / 2, 300, 300, 0x000000, 0.6)
            .setStrokeStyle(2, 0xffffff);

        this.createControl('Género', width / 4, 120, ['Masculino', 'Femenino'], (val) => {
            gameManager.player.appearance.gender = val === 'Masculino' ? 'male' : 'female';
            this.updatePreview();
        });

        this.createControl('Piel', width / 4, 170, ['Tono 1', 'Tono 2', 'Tono 3', 'Tono 4', 'Tono 5'], (val, idx) => {
            gameManager.player.appearance.skinTone = idx;
            this.updatePreview();
        });

        this.createControl('Cabello', width / 4, 220, ['Estilo 1', 'Estilo 2', 'Estilo 3', 'Estilo 4', 'Estilo 5', 'Estilo 6', 'Estilo 7', 'Estilo 8'], (val, idx) => {
            gameManager.player.appearance.hairStyle = idx;
            this.updatePreview();
        });

        const nameText = this.add.text(width / 2, height - 80, `Nombre: ${gameManager.player.name}`, {
            fontSize: '16px',
            color: '#ffffff',
            fontFamily: 'monospace'
        }).setOrigin(0.5).setInteractive();

        nameText.on('pointerdown', () => {
            const newName = prompt("Introduce tu nombre:", gameManager.player.name);
            if (newName) {
                gameManager.player.name = newName;
                nameText.setText(`Nombre: ${newName}`);
            }
        });

        this.createRPGButton(width - 100, height - 60, 'GUARDAR', () => {
            gameManager.saveGame();
            this.scene.start('WorldMapScene');
        });
    }

    createControl(label, x, y, options, callback) {
        this.add.text(x, y - 20, label, { fontSize: '14px', color: '#aaa', fontFamily: 'monospace' }).setOrigin(0.5);

        const btn = this.add.rectangle(x, y, 120, 30, 0x4a3123)
            .setStrokeStyle(2, 0x8b5a2b)
            .setInteractive({ useHandCursor: true });

        const text = this.add.text(x, y, options[0], { fontSize: '12px', color: '#fff', fontFamily: 'monospace' }).setOrigin(0.5);

        let currentIdx = 0;
        btn.on('pointerdown', () => {
            currentIdx = (currentIdx + 1) % options.length;
            text.setText(options[currentIdx]);
            callback(options[currentIdx], currentIdx);
        });
    }

    createRPGButton(x, y, label, callback) {
        const btn = this.add.rectangle(x, y, 150, 40, 0x4a3123).setStrokeStyle(4, 0x8b5a2b).setInteractive({ useHandCursor: true });
        const text = this.add.text(x, y, label, { fontSize: '16px', color: '#fff', fontFamily: 'monospace', fontStyle: 'bold' }).setOrigin(0.5);
        btn.on('pointerdown', () => callback());
    }

    updatePreview() {
        // Update the sprite texture based on gender
        this.playerSprite.setTexture(gameManager.player.appearance.gender);
    }
}
