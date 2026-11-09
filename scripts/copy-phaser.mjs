import { copyFile, mkdir } from 'node:fs/promises';

await mkdir(new URL('../dist/lib/', import.meta.url), { recursive: true });
await copyFile(new URL('../lib/phaser.min.js', import.meta.url), new URL('../dist/lib/phaser.min.js', import.meta.url));
