
export class DialogueSystem {
    constructor(scene) {
        this.scene = scene;
        this.isTyping = false;
        this.currentText = "";
        this.charIndex = 0;

        // UI Elements
        this.box = null;
        this.textObj = null;
        this.nameText = null;
        this.portrait = null;
    }

    createUI() {
        const { width, height } = this.scene.scale;

        // Dialogue Box (Pixel Art style)
        this.box = this.scene.add.rectangle(width/2, height - 80, 600, 120, 0x000000, 0.9)
            .setStrokeStyle(4, 0xeeeeee)
            .setOrigin(0.5);

        this.nameText = this.scene.add.text(width/2 - 280, height - 130, '', {
            fontSize: '18px',
            color: '#ffff00',
            fontFamily: 'monospace'
        });

        this.textObj = this.scene.add.text(width/2 - 280, height - 110, '', {
            fontSize: '16px',
            color: '#ffffff',
            wordWrap: { width: 540 },
            fontFamily: 'monospace'
        });

        this.portrait = this.scene.add.image(width/2 - 320, height - 100, 'portrait_placeholder').setScale(0.5);
    }

    async showDialogue(name, text, portraitKey = 'portrait_placeholder') {
        this.box.setVisible(true);
        this.nameText.setText(name);
        this.portrait.setTexture(portraitKey);

        this.currentText = text;
        this.charIndex = 0;
        this.textObj.setText('');
        this.isTyping = true;

        return new Promise(resolve => {
            const timer = this.scene.time.addEvent({
                delay: 30,
                callback: () => {
                    this.textObj.text += this.currentText[this.charIndex];
                    this.charIndex++;
                    if (this.charIndex >= this.currentText.length) {
                        timer.destroy();
                        this.isTyping = false;
                        resolve();
                    }
                },
                loop: true
            });
        });
    }

    hideUI() {
        this.box.setVisible(false);
        this.textObj.setText('');
        this.nameText.setText('');
    }
}
