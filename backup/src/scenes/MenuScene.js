import { gameManager } from '../systems/GameManager.js';

export class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    create() {
        const { width, height } = this.cameras.main;

        // Background Fallback
        if (this.textures.exists('menu_bg')) {
            this.add.image(width / 2, height / 2, 'menu_bg').setDisplaySize(width, height);
        } else {
            const bg = this.add.graphics();
            bg.fillGradientStyle(0x1a1a2e, 0x16213e, 0x0f3460, 0x0f3460, 1);
            bg.fillRect(0, 0, width, height);
        }

        const vignette = this.add.graphics();
        vignette.fillGradientStyle(0x000000, 0x000000, 0x000000, 0x000000, 0.4);
        vignette.fillRect(0, 0, width, height);

        const titleContainer = this.add.container(width / 2, height / 3);

        const titleText = this.add.text(0, 0, 'CAMINO AL\nAUTOCONOCIMIENTO', {
            fontSize: '32px',
            color: '#ffd700',
            fontFamily: 'monospace',
            align: 'center',
            stroke: '#000',
            strokeThickness: 6,
            fontStyle: 'bold'
        }).setOrigin(0.5);

        const subtitleText = this.add.text(0, 60, 'Un viaje hacia la esencia humana', {
            fontSize: '14px',
            color: '#ffffff',
            fontFamily: 'monospace',
            align: 'center'
        }).setOrigin(0.5);

        titleContainer.add([titleText, subtitleText]);

        this.createRPGButton(width / 2, height / 2 + 40, 'COMENZAR', () => {
            if (gameManager.loadGame()) {
                this.scene.start('WorldMapScene');
            } else {
                this.scene.start('CharacterCreatorScene');
            }
        });

        this.createRPGButton(width / 2, height / 2 + 110, 'CONTINUAR', () => {
            if (gameManager.loadGame()) {
                this.scene.start('WorldMapScene');
            } else {
                // Flash button if no save game exists
                const btn = this.children.list[this.children.list.length - 1];
                this.flashButton(btn);
            }
        }, gameManager.loadGame());
    }

    createRPGButton(x, y, label, callback, enabled = true) {
        const btnContainer = this.add.container(x, y);

        const bg = this.add.rectangle(0, 0, 220, 50, 0x4a3123)
            .setStrokeStyle(4, 0x8b5a2b)
            .setInteractive({ useHandCursor: true });

        const text = this.add.text(0, 0, label, {
            fontSize: '18px',
            color: '#fff',
            fontFamily: 'monospace',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        btnContainer.add([bg, text]);

        if (enabled) {
            bg.on('pointerover', () => {
                bg.setFillStyle(0x6b4a3a);
                text.setScale(1.1);
            });
            bg.on('pointerout', () => {
                bg.setFillStyle(0x4a3123);
                text.setScale(1);
            });
            bg.on('pointerdown', () => {
                bg.setScale(0.95);
                callback();
                this.time.delayedCall(100, () => bg.setScale(1));
            });
        } else {
            bg.setFillStyle(0x333333);
            text.setColor('#888888');
        }

        return btnContainer;
    }

    flashButton(btn) {
        this.tweens.add({
            targets: btn,
            x: btn.x + 5,
            duration: 50,
            yoyo: true,
            repeat: 3
        });
    }
}
