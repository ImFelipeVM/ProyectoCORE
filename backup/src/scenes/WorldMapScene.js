import { gameManager } from '../systems/GameManager.js';

export class WorldMapScene extends Phaser.Scene {
    constructor() {
        super('WorldMapScene');
    }

    create() {
        const { width, height } = this.cameras.main;

        // Background
        const bg = this.add.graphics();
        bg.fillGradientStyle(0x1b4332, 0x1b4332, 0x081c15, 0x081c15, 1);
        bg.fillRect(0, 0, width, height);

        this.add.text(width / 2, 40, 'EL CAMINO AL AUTOCONOCIMIENTO', {
            fontSize: '24px',
            color: '#ffd700',
            fontFamily: 'monospace',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        const episodes = [
            { id: 1, x: 100, y: 250, name: "El Hogar" },
            { id: 2, x: 200, y: 180, name: "La Universidad" },
            { id: 3, x: 300, y: 250, name: "El Espejo" },
            { id: 4, x: 400, y: 180, name: "Las Máscaras" },
            { id: 5, x: 500, y: 250, name: "La Sinceridad" },
            { id: 6, x: 600, y: 180, name: "El Muro Digital" },
            { id: 7, x: 700, y: 250, name: "El Laberinto" },
            { id: 8, x: 800, y: 180, name: "El Futuro" },
        ];

        // Draw the winding path
        const pathGraphics = this.add.graphics();
        pathGraphics.lineStyle(8, 0x4a3123, 1);

        for (let i = 0; i < episodes.length - 1; i++) {
            const start = episodes[i];
            const end = episodes[i+1];
            const isCompleted = gameManager.player.completedEpisodes.includes(start.id);

            pathGraphics.lineStyle(8, isCompleted ? 0xffd700 : 0x4a3123, 1);
            pathGraphics.beginPath();
            pathGraphics.moveTo(start.x, start.y);
            pathGraphics.lineTo(end.x, end.y);
            pathGraphics.strokePath();
        }

        episodes.forEach(ep => {
            const isLocked = ep.id > gameManager.player.currentEpisode;
            const isCompleted = gameManager.player.completedEpisodes.includes(ep.id);

            const nodeContainer = this.add.container(ep.x, ep.y);

            // Station marker
            const circle = this.add.circle(0, 0, 20, isLocked ? 0x333333 : (isCompleted ? 0x00ff00 : 0xffffff))
                .setStrokeStyle(4, 0x000000)
                .setInteractive({ useHandCursor: true });

            const label = this.add.text(0, 35, ep.name, {
                fontSize: '12px',
                color: '#ffffff',
                fontFamily: 'monospace',
                fontStyle: 'bold'
            }).setOrigin(0.5);

            nodeContainer.add([circle, label]);

            if (!isLocked) {
                circle.on('pointerdown', () => {
                    this.scene.start('EpisodeScene', { episodeId: ep.id });
                });
            }
        });

        // RPG-style Status Bar
        const statusBar = this.add.rectangle(width / 2, height - 30, width, 60, 0x000000, 0.7)
            .setStrokeStyle(2, 0xffffff);

        this.add.text(50, height - 40, `Puntaje: ${gameManager.player.score}`, {
            fontSize: '16px',
            color: '#ffd700',
            fontFamily: 'monospace'
        });

        this.add.text(width - 50, height - 40, `Estación: ${gameManager.player.currentEpisode}/8`, {
            fontSize: '16px',
            color: '#ffffff',
            fontFamily: 'monospace'
        }).setOrigin(1, 0);
    }
}
