import { gameManager } from '../systems/GameManager.js';

export class ResultsScene extends Phaser.Scene {
    constructor() {
        super('ResultsScene');
    }

    create() {
        const { width, height } = this.cameras.main;

        this.add.text(width / 2, 100, 'RESULTADOS FINALES', {
            fontSize: '24px',
            color: '#ffffff',
            fontFamily: 'monospace'
        }).setOrigin(0.5);

        const finalScore = gameManager.player.score;
        this.add.text(width / 2, 200, `Puntaje Total: ${finalScore} / 80`, {
            fontSize: '20px',
            color: '#ffff00',
            fontFamily: 'monospace'
        }).setOrigin(0.5);

        let message = "";
        if (finalScore >= 70) message = "¡Excelente! Has alcanzado un alto nivel de autoconocimiento.";
        else if (finalScore >= 40) message = "Buen progreso, pero aún hay camino por recorrer.";
        else message = "Necesitas reflexionar más sobre tu camino personal.";

        this.add.text(width / 2, 250, message, {
            fontSize: '12px',
            color: '#ffffff',
            fontFamily: 'monospace',
            align: 'center',
            wordWrap: { width: 500 }
        }).setOrigin(0.5);

        const restartBtn = this.add.image(width / 2, 320, 'ui_button').setInteractive({ useHandCursor: true });
        this.add.text(width / 2, 320, 'REINICIAR', {
            fontSize: '12px',
            color: '#ffffff',
            fontFamily: 'monospace'
        }).setOrigin(0.5);

        restartBtn.on('pointerdown', () => {
            gameManager.resetGame();
            this.scene.start('MenuScene');
        });
    }
}
