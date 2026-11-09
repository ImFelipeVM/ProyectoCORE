import { gameManager } from '../systems/GameManager.js';
import { RESOURCE_MANIFEST } from '../config/ResourceManifest.js';
import { AssetGenerator, SVG_ASSETS } from '../systems/asset_gen.js';

export class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        this.add.text(width / 2, height / 2, 'Cargando Motor...', {
            fontSize: '20px',
            color: '#ffffff',
            backgroundColor: '#000000'
        }).setOrigin(0.5);

        console.log("BootScene: Loading assets from manifest...");

        Object.entries(RESOURCE_MANIFEST.images).forEach(([key, path]) => {
            this.load.image(key, path);
        });

        Object.entries(RESOURCE_MANIFEST.spritesheets).forEach(([key, config]) => {
            this.load.spritesheet(key, config.path, config.frameConfig);
        });

        Object.entries(RESOURCE_MANIFEST.maps).forEach(([key, path]) => {
            this.load.tilemapTiledJSON(key, path);
        });

        // Load SVG assets dynamically
        Object.entries(SVG_ASSETS.backgrounds).forEach(([key, svg]) => {
            AssetGenerator.loadSVGTexture(this, key, svg);
        });
        Object.entries(SVG_ASSETS.characters).forEach(([key, svg]) => {
            AssetGenerator.loadSVGTexture(this, key, svg);
        });
    }

    create() {
        console.log("BootScene: Engine initialized successfully. Transitioning to MenuScene...");
        this.scene.start('MenuScene');
    }
}
