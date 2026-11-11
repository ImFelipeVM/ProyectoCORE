import { cp, copyFile, mkdir } from 'node:fs/promises';

await mkdir(new URL('../dist/lib/', import.meta.url), { recursive: true });
await copyFile(new URL('../lib/phaser.min.js', import.meta.url), new URL('../dist/lib/phaser.min.js', import.meta.url));
// Phaser loads the project's art by relative URL at runtime. Vite cannot discover
// these assets because scene loaders keep their paths as strings, so copy the
// authored asset tree into the production output alongside the bundled game.
await cp(new URL('../assets/', import.meta.url), new URL('../dist/assets/', import.meta.url), { recursive: true, force: true });
