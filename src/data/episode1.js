export const EPISODE_1 = {
  id: 1,
  title: 'LA INFANCIA Y EL HOGAR',
  theme: 'LA FAMILIA',
  narrative: 'Un bajo rendimiento académico ha provocado cambios en los acuerdos de casa. Tus padres quieren conversar sobre horarios, pantallas y responsabilidades.',
  theory: 'La familia moldea la identidad: la madre aporta el principio de seguridad (afecto incondicional) y el padre el principio de realidad (límites y leyes del mundo). Madurar exige comprender que los límites familiares no te encierran, sino que te preparan para la realidad.',
  missions: [
    { id: 'home', title: 'Regresa a casa', area: 'Barrio familiar' },
    { id: 'family', title: 'Habla con tu familia', area: 'Sala' },
    { id: 'report', title: 'Examina la evaluación', area: 'Habitación' },
    { id: 'schedule', title: 'Organiza un horario', area: 'Habitación' },
    { id: 'backpack', title: 'Ordena tus materiales y estudia', area: 'Estudio' },
    { id: 'chore', title: 'Asume una responsabilidad familiar', area: 'Cocina y comedor' },
    { id: 'reflection', title: 'Reflexiona con tus padres', area: 'Sala' }
  ]
};

export const STUDY_MATERIALS = [
  { id: 'book', label: 'LIBRO DE REPASO', glyph: 'L' },
  { id: 'notebook', label: 'CUADERNO', glyph: 'C' },
  { id: 'pencils', label: 'LÁPICES', glyph: 'P' },
  { id: 'notes', label: 'APUNTES', glyph: 'A' },
  { id: 'backpack', label: 'MOCHILA', glyph: 'M' }
];

export const HOME_INTERACTABLES = [
  { id: 'report', name: 'Evaluación académica', x: 1865, y: 350, room: 'Habitación', kind: 'paper' },
  // Keep the interaction point beside the desk, clear of its collision body and chair.
  { id: 'desk', name: 'Escritorio · materiales y estudio', x: 1970, y: 420, room: 'Estudio', kind: 'desk' },
  { id: 'schedule', name: 'Calendario de estudio', x: 1980, y: 215, room: 'Habitación', kind: 'calendar' },
  { id: 'chore', name: 'Mesa y utensilios', x: 1280, y: 410, room: 'Cocina y comedor', kind: 'table' },
  { id: 'parents', name: 'Conversar con tus padres', x: 790, y: 405, room: 'Sala', kind: 'family' },
  { id: 'exit', name: 'Puerta de entrada', x: 220, y: 430, room: 'Exterior', kind: 'door' }
];

export const EPISODE_1_ENDINGS = {
  responsable: {
    score: 10,
    label: 'CRITERIO RESPONSABLE',
    conduct: 'Escuchaste, reconociste el bajo rendimiento, preparaste un horario, ordenaste tus materiales, estudiaste y colaboraste en casa.',
    consequence: 'Tu familia ve que tus compromisos se convirtieron en acciones. Conservas los acuerdos y recuperas gradualmente autonomía.',
    reflection: 'El principio de seguridad te recuerda que puedes pedir apoyo; el principio de realidad te ayuda a reconocer límites y responder por tus decisiones.'
  },
  emotiva: {
    score: -5,
    label: 'REACCIÓN EMOTIVA E INERCIAL',
    conduct: 'Interrumpiste la conversación para discutir, rechazaste los límites y evitaste asumir las responsabilidades.',
    consequence: 'La conversación se interrumpe. Por ahora, los límites permanecen y será necesario retomarlos cuando baje la rabia.',
    reflection: 'El afecto merece ser escuchado; reconocerlo te permite expresarlo sin dejar que decida por ti.'
  },
  superficial: {
    score: -2,
    label: 'OBEDIENCIA SUPERFICIAL',
    conduct: 'Aceptaste las normas en la conversación, pero saliste de casa sin cumplir tus compromisos.',
    consequence: 'Tu familia nota que el acuerdo no se cumplió. Los horarios y las responsabilidades siguen pendientes.',
    reflection: 'El principio de seguridad ofrece apoyo y el principio de realidad invita a convertir las palabras en hábitos.'
  }
};
