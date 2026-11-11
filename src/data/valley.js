export const VALLEY = {
  width: 3072,
  height: 2048,
  start: { x: 1450, y: 1160 },
  areas: [
    { id: 'plaza', name: 'PLAZA CENTRAL', x: 1100, y: 720, width: 800, height: 570 },
    { id: 'school', name: 'ZONA ESCOLAR', x: 250, y: 260, width: 900, height: 590 },
    { id: 'neighborhood', name: 'BARRIO FAMILIAR', x: 1950, y: 400, width: 1000, height: 1150 },
    { id: 'green', name: 'ZONA VERDE', x: 260, y: 1300, width: 1050, height: 680 }
  ]
};

export const WORLD_NPCS = [
  { id: 'teacher', name: 'MAESTRA ELENA', texture: 'npcTeacherSprites', anim: 'npcTeacher', x: 940, y: 680, area: 'school', stationId: 'workshop', lines: [
    'La técnica importa. También importa a quién sirve lo que sabes hacer.'
  ] },
  { id: 'neighbor', name: 'CAMILA, VECINA', texture: 'npcNeighborSprites', anim: 'npcNeighbor', x: 1480, y: 1430, area: 'plaza', stationId: 'mirrors', lines: [
    '¡Ey! El grupo quiere tomar un atajo. ¿Tú qué piensas?' 
  ] },
  { id: 'mother', name: 'MAMÁ', texture: 'npcMotherSprites', anim: 'npcMother', x: 2145, y: 830, area: 'neighborhood', stationId: 'door', lines: [
    'Todos tenemos un cuarto con llave por dentro. Lo importante es saber a quién le abrimos la puerta.'
  ] },
  { id: 'father', name: 'PAPÁ', texture: 'npcFatherSprites', anim: 'npcFather', x: 685, y: 1050, area: 'green', stationId: 'overlook', lines: [
    'Desde aquí se ve el camino que ya recorriste. ¿Sabes hacia dónde quieres ir?' 
  ] },
  { id: 'gardener', name: 'DON TOMÁS', texture: 'npcGardenerSprites', anim: 'npcGardener', x: 900, y: 1550, area: 'green', stationId: 'noise', lines: [
    'Las plantas crecen con cuidado y paciencia. ¿Cuántas cosas haces solo porque todos las hacen?' 
  ] }
];

export const WORLD_OBJECTS = [
  { id: 'homeDoor', name: 'Casa del protagonista · entrar', x: 2455, y: 1220, kind: 'door' },
  { id: 'plazaBoard', name: 'Cartel del Valle', x: 1770, y: 1120, kind: 'board' },
  { id: 'schoolBoard', name: 'Tablón escolar', x: 820, y: 750, kind: 'school' },
  { id: 'parkNotebook', name: 'Cuaderno de reflexión', x: 1110, y: 1635, kind: 'journal' },
  { id: 'fountain', name: 'Fuente de la plaza', x: 1510, y: 1010, kind: 'fountain' }
];

export const VALLEY_PROPS = [
  { frame: 0, x: 340, y: 360, scale: 1.1, solid: true },{ frame: 1, x: 1110, y: 480, scale: 1, solid: true },
  { frame: 0, x: 1140, y: 710, scale: .95, solid: true },{ frame: 0, x: 1920, y: 780, scale: 1.1, solid: true },
  { frame: 1, x: 2090, y: 560, scale: 1, solid: true },{ frame: 0, x: 2840, y: 620, scale: 1.05, solid: true },
  { frame: 0, x: 2950, y: 1340, scale: 1, solid: true },{ frame: 1, x: 2730, y: 1580, scale: 1, solid: true },
  { frame: 0, x: 1380, y: 1440, scale: 1.1, solid: true },{ frame: 0, x: 690, y: 1330, scale: 1, solid: true },
  { frame: 3, x: 1320, y: 920, scale: .9, solid: true },{ frame: 3, x: 1690, y: 920, scale: .9, solid: true },
  { frame: 3, x: 1360, y: 1190, scale: .9, solid: true },{ frame: 5, x: 1150, y: 815, scale: .9, solid: true },
  { frame: 5, x: 1900, y: 1110, scale: .9, solid: true },{ frame: 8, x: 720, y: 1710, scale: 1, solid: false },
  { frame: 8, x: 540, y: 1480, scale: 1, solid: false },{ frame: 8, x: 870, y: 1810, scale: 1, solid: false },
  { frame: 11, x: 2260, y: 1280, scale: .8, solid: true },{ frame: 11, x: 2730, y: 1280, scale: .8, solid: true },
  { frame: 14, x: 2200, y: 780, scale: .8, solid: true },{ frame: 14, x: 2770, y: 1050, scale: .8, solid: true },
  { frame: 15, x: 920, y: 790, scale: .7, solid: false }
];

export const BUILDINGS = [
  { id: 'school', x: 440, y: 330, width: 570, height: 345, doorX: 725, doorWidth: 90 },
  { id: 'home', x: 2240, y: 870, width: 430, height: 330, doorX: 2455, doorWidth: 92 },
  { id: 'neighborA', x: 2320, y: 485, width: 300, height: 245 },
  { id: 'neighborB', x: 2635, y: 1245, width: 275, height: 235 },
  { id: 'neighborC', x: 2015, y: 1190, width: 240, height: 205 }
];
