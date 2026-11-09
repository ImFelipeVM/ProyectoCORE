
export class Player extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setCollideWorldBounds(true);
        this.speed = 150;
        this.direction = 'down';
    }

    update(cursors) {
        this.setVelocity(0);

        if (cursors.left.isDown) {
            this.setVelocityX(-this.speed);
            this.direction = 'left';
        } else if (cursors.right.isDown) {
            this.setVelocityX(this.speed);
            this.direction = 'right';
        }

        if (cursors.up.isDown) {
            this.setVelocityY(-this.speed);
            this.direction = 'up';
        } else if (cursors.down.isDown) {
            this.setVelocityY(this.speed);
            this.direction = 'down';
        }

        this.updateAnimation();
    }

    updateAnimation() {
        const animKey = `walk_${this.direction}`;
        if (this.body.velocity.x !== 0 || this.body.velocity.y !== 0) {
            this.play(animKey, true);
        } else {
            this.play(`idle_${this.direction}`, true);
        }
    }
}
