// All questions, readings and feedback here come from the group's supplied narrative guide.
// The guide does not include the remaining 68-item question bank, so this playable route
// uses only the fourteen complete dilemmas it contains.
export const JOURNEY_STATIONS = [
  { id: 'noise', title: 'EL RUIDO', place: 'Jardín del silencio', guide: 'gardener', quality: 'criterio', qualityName: 'Criterio Ético', source: 'Eva María Reschreiter', frame: 0, reward: 'Hoja de silencio', x: 980, y: 1600 },
  { id: 'door', title: 'LA PUERTA CON LLAVE', place: 'La casa de la intimidad', guide: 'mother', quality: 'authenticity', qualityName: 'Autenticidad', source: 'Yepes · intimidad y pudor', frame: 1, reward: 'Llave de confianza', x: 2200, y: 830 },
  { id: 'family', title: 'LA MESA DE LA COCINA', place: 'Encuentro de familia', guide: 'mother', quality: 'bonds', qualityName: 'Vínculos', source: 'Tercer corte · familia', frame: 2, reward: 'Taza de conversación', x: 2520, y: 1390 },
  { id: 'mirrors', title: 'EL PUENTE DE LOS ESPEJOS', place: 'Puente del valle', guide: 'neighbor', quality: 'authenticity', qualityName: 'Autenticidad', source: 'Yepes · autenticidad y Llano · libertad', frame: 3, reward: 'Espejo sincero', x: 1580, y: 1510 },
  { id: 'friendship', title: 'EL BANCO DEL PARQUE', place: 'Encuentro de amistad', guide: 'neighbor', quality: 'bonds', qualityName: 'Vínculos', source: 'Tercer corte · amistad', frame: 4, reward: 'Banco de lealtad', x: 1110, y: 1770 },
  { id: 'social', title: 'LA PANTALLA', place: 'Encuentro de redes', guide: 'neighbor', quality: 'authenticity', qualityName: 'Autenticidad', source: 'Una tarta de manzana · Tipos de Autoestima', frame: 5, reward: 'Pantalla en calma', x: 1790, y: 1110 },
  { id: 'overlook', title: 'EL MIRADOR', place: 'La meta y la vocación', guide: 'father', quality: 'authenticity', qualityName: 'Autenticidad', source: 'Yepes · vocación; Blanca como la nieve, roja como la sangre', frame: 6, reward: 'Brújula de propósito', x: 650, y: 1110 },
  { id: 'workshop', title: 'EL TALLER', place: 'Taller de excelencia', guide: 'teacher', quality: 'excellence', qualityName: 'Excelencia', source: 'Howard Gardner', frame: 7, reward: 'Herramienta de servicio', x: 940, y: 740 },
  { id: 'tree', title: 'EL ÁRBOL', place: 'Regreso al jardín', guide: 'gardener', quality: 'freedom', qualityName: 'Libertad Interior', source: 'Alejandro Llano · valoraciones fuertes', frame: 8, reward: 'Fruto de libertad', x: 650, y: 1860 }
];

export const JOURNEY_DECISIONS = [
  {
    id: 'noise-herd', station: 'noise', speaker: 'JARDINERO', question: '¿Qué actitud, moda o costumbre universitaria sigues por pura inercia social y no por convicción propia?', quality: 'criterio', source: 'Eva María Reschreiter',
    basis: 'Reschreiter advierte que la sociedad de consumo fomenta la masificación y el borreguismo: a veces compramos, vestimos y actuamos impulsados por la publicidad y la imitación.',
    options: [
      { text: 'Hay algo que hago porque todos lo hacen. Voy a revisar si de verdad lo elegiría estando solo.', points: 2, feedback: 'Reconocer tu propia inercia es el primer paso para recuperar el discernimiento.' },
      { text: 'Creo que a veces sigo la corriente, aunque todavía no sabría decir en qué.', points: 1, feedback: 'Sospechar que algo te influye ya es un avance; ponerle nombre ayuda a cambiarlo.' },
      { text: 'Nada me influye. Yo decido todo por mi cuenta.', points: 0, feedback: 'Si das por hecho que nada te influye, resulta difícil notar cuándo te arrastra la masificación.' }
    ]
  },
  {
    id: 'noise-silence', station: 'noise', speaker: 'JARDINERO', question: 'En medio de la prisa y las pantallas, ¿a qué pensamiento o miedo le huyes cuando te quedas a solas contigo?', quality: 'criterio', source: 'Eva María Reschreiter', silenceSeconds: 30,
    basis: 'La lectura propone que para reconocer la propia identidad hacen falta tiempo y silencio: detenerse permite meditar y escuchar la voz interior.',
    options: [
      { text: 'Le pongo nombre a un miedo concreto y me quedo con él un momento.', points: 2, feedback: 'Nombrar el miedo es un primer acto de silencio y escucha interior.' },
      { text: 'Siento que huyo de algo, aunque todavía no sé qué es.', points: 1, feedback: 'Notar que huyes ya es empezar a escuchar; puedes darle nombre poco a poco.' },
      { text: 'Me aburro y prefiero llenar el silencio con el celular.', points: 0, feedback: 'Llenar el silencio con pantallas hace más difícil escuchar lo que pasa dentro de ti.' }
    ]
  },
  {
    id: 'door-intimacy', station: 'door', speaker: 'MADRE', question: 'El pudor protege lo valioso de la persona. ¿Qué convicción profunda prefieres resguardar de la burla o del qué dirán?', quality: 'authenticity', source: 'Yepes · intimidad y pudor',
    basis: 'Yepes describe la intimidad como el mundo interior que resguardamos con el pudor y que revelamos mediante el lenguaje y la confianza.',
    options: [
      { text: 'Cuido lo que más valoro y lo comparto con quien sabe respetarlo.', points: 2, feedback: 'La confianza permite compartir tu intimidad sin dejarla desprotegida.' },
      { text: 'Prefiero no contarle nada a nadie, por si acaso.', points: 1, feedback: 'Reservarte te protege, pero confiar en alguien también puede acercarte a los demás.' },
      { text: 'Lo cuento todo a cualquiera o lo cambio según quién me escuche.', points: 0, feedback: 'Sin cuidado ni confianza, lo que es íntimo puede quedar expuesto a la burla.' }
    ]
  },
  {
    id: 'door-criticism', station: 'door', speaker: 'MADRE', question: 'Recibes una crítica constructiva sobre un trabajo, pero sientes que ataca tu valor como persona. ¿Qué haces?', quality: 'authenticity', source: 'Estructura de la Autoestima',
    basis: 'La lectura diferencia la autoestima y el valor intrínseco de una persona de su rendimiento o de los errores que puede corregir.',
    options: [
      { text: 'Respiro, separo el trabajo de quien soy y reviso qué puedo mejorar.', points: 2, feedback: 'Separar el trabajo de tu valor personal deja espacio para aprender.' },
      { text: 'Me duele, pero después de un rato intento analizar la crítica.', points: 1, feedback: 'Ya vuelves a la crítica con calma; puedes practicar ese espacio antes de responder.' },
      { text: 'Respondo a la defensiva: no tienen derecho a decirme eso.', points: 0, feedback: 'Cuando el orgullo responde por ti, se vuelve más difícil aprovechar una observación útil.' }
    ]
  },
  {
    id: 'family-support', station: 'family', speaker: 'MADRE Y PADRE', question: 'Cuando la presión de la universidad te supera, ¿buscas apoyo en casa o prefieres aislarte?', quality: 'bonds', source: 'Tercer corte · familia',
    basis: 'La familia puede ser un núcleo afectivo seguro, un lugar al que volver y donde se ofrece cariño incondicional.',
    options: [
      { text: 'Les cuento lo que me pasa: mi familia es un lugar al que puedo volver.', points: 2, feedback: 'Pedir apoyo te permite usar el refugio que está disponible para estos momentos.' },
      { text: 'Les cuento solo lo básico para que no se preocupen.', points: 1, feedback: 'Compartes una parte, aunque aún cargas casi todo a solas.' },
      { text: 'Me aíslo. Prefiero resolverlo todo por mi cuenta.', points: 0, feedback: 'Aislarte parece fortaleza, pero deja sin usar el apoyo que tienes cerca.' }
    ]
  },
  {
    id: 'mirrors-authenticity', station: 'mirrors', speaker: 'VECINO', question: 'En un trabajo en equipo tus compañeros proponen un atajo deshonesto. ¿Te mantienes fiel a lo que piensas o imitas al grupo?', quality: 'authenticity', source: 'Yepes · autenticidad y mímesis',
    basis: 'Para Yepes, la autenticidad hace coincidir la conducta visible con el fondo íntimo; la mímesis es imitar al grupo sin preguntarse quién se quiere ser.',
    options: [
      { text: 'Digo que no y propongo hacerlo bien, aunque mi postura sea minoría.', points: 2, feedback: 'Tu conducta coincide con lo que piensas y abre una alternativa al grupo.' },
      { text: 'No participo, pero tampoco digo lo que pienso.', points: 1, feedback: 'No tomas parte en el atajo; expresar tu postura también puede ayudar.' },
      { text: 'Me sumo para no quedar mal con mis compañeros.', points: 0, feedback: 'Imitar al grupo por encajar es la mímesis que describe la lectura.' }
    ]
  },
  {
    id: 'mirrors-freedom', station: 'mirrors', speaker: 'VECINO', question: '¿Qué emoción impulsiva podría estar frenando hoy tus relaciones auténticas: orgullo, rencor o envidia?', quality: 'freedom', source: 'Alejandro Llano · libertad interior',
    basis: 'Llano plantea que la libertad superior incluye liberarse del egoísmo, de las apariencias y de las pasiones descontroladas.',
    options: [
      { text: 'Reconozco si hay orgullo, rencor o envidia y elijo cuál necesito trabajar.', points: 2, feedback: 'Nombrar una emoción es el primer paso para que no gobierne tus decisiones.' },
      { text: 'Siento que algo me frena, pero todavía no puedo ponerle nombre.', points: 1, feedback: 'Ya percibes un obstáculo; darte tiempo puede ayudarte a reconocerlo.' },
      { text: 'Ninguna. No tengo nada de eso.', points: 0, feedback: 'Afirmar que nada te ocurre cierra la posibilidad de mirar tus propios impulsos.' }
    ]
  },
  {
    id: 'friendship-loyalty', station: 'friendship', speaker: 'VECINO', question: 'En un grupo empiezan a hablar mal de un amigo tuyo. ¿Lo defiendes o callas para encajar?', quality: 'bonds', source: 'Tercer corte · amistad',
    basis: 'La lealtad en la amistad significa ser firme: proteger al amigo frente a otros y hablarle de frente si algo necesita corregirse.',
    options: [
      { text: 'Lo defiendo y, si hay algo que corregir, se lo digo a él con respeto.', points: 2, feedback: 'Lo cuidas frente al grupo y mantienes la sinceridad entre ustedes.' },
      { text: 'Cambio de tema y después le cuento lo que pasó.', points: 1, feedback: 'Intentas cuidarlo, aunque aún puedes tomar una posición clara.' },
      { text: 'Me quedo callado para no tener problemas.', points: 0, feedback: 'Callar para encajar deja solo a quien consideras tu amigo.' }
    ]
  },
  {
    id: 'social-image', station: 'social', speaker: 'VECINO', question: 'Si pudieras medir tu energía, ¿cuánta va a mantener una imagen en redes y cuánta a ser tú en la vida real?', quality: 'authenticity', source: 'Una tarta de manzana llena de esperanza · Tipos de Autoestima',
    basis: 'Las lecturas relacionan el refugio en las apariencias y la comparación con un vacío interior; una autoestima firme se apoya en la autoaceptación real.',
    options: [
      { text: 'La mayor parte va a mi vida real; en redes procuro ser la misma persona.', points: 2, feedback: 'La coherencia entre tu imagen y tu vida real fortalece la autenticidad.' },
      { text: 'Más o menos la reparto por igual entre ambas.', points: 1, feedback: 'Ya observas el equilibrio; puedes preguntarte qué uso de las redes sí te representa.' },
      { text: 'Casi toda mi energía se va en cuidar la imagen que muestro.', points: 0, feedback: 'La comparación y las apariencias pueden desplazar la aceptación de quien eres.' }
    ]
  },
  {
    id: 'overlook-vocation', station: 'overlook', speaker: 'PADRE', question: '¿Vives tu carrera universitaria como una misión con sentido o como un trámite para obtener el título?', quality: 'authenticity', source: 'Yepes · vocación',
    basis: 'Según Yepes, la vocación es un proyecto global que da unidad y sentido a la biografía y ayuda a orientar las decisiones.',
    options: [
      { text: 'Como un proyecto con sentido: puedo explicar para qué la estudio.', points: 2, feedback: 'Ya reconoces un hilo conductor para orientar tus decisiones.' },
      { text: 'A ratos tiene sentido y a ratos parece un trámite; lo estoy descubriendo.', points: 1, feedback: 'La duda honesta también forma parte de encontrar tu proyecto.' },
      { text: 'Es un trámite para sacar el título.', points: 0, feedback: 'Sin un sentido global, las decisiones pueden quedar desconectadas entre sí.' }
    ]
  },
  {
    id: 'overlook-pleasing', station: 'overlook', speaker: 'PADRE', question: 'Si elegiste tu carrera más por complacer a tus padres que por gusto propio, ¿qué haces?', quality: 'authenticity', source: 'Blanca como la nieve, roja como la sangre',
    basis: 'En la lectura, madurar implica revisar lo que de verdad se quiere para la propia vida y conversar las decisiones importantes.',
    options: [
      { text: 'Hablo con sinceridad con mi familia y revisamos lo que de verdad quiero.', points: 2, feedback: 'Tomas parte en tu proyecto y lo conversas con quienes te importan.' },
      { text: 'Sigo por ahora, pero me doy un tiempo para pensarlo.', points: 1, feedback: 'Pensarlo abre la puerta; después puedes convertir esa reflexión en una conversación.' },
      { text: 'Sigo por miedo a decepcionarlos.', points: 0, feedback: 'Decidir solo por miedo a decepcionar puede alejarte de tu propia vocación.' }
    ]
  },
  {
    id: 'workshop-ethics', station: 'workshop', speaker: 'MAESTRA', question: '¿En qué área de tu formación cumples con la técnica, pero te falta conectar tu trabajo con las necesidades de otros?', quality: 'excellence', source: 'Howard Gardner · ser excelente, comprometido y ético',
    basis: 'Gardner presenta al buen profesional como excelente, comprometido y ético: la técnica importa junto con la responsabilidad hacia los demás.',
    options: [
      { text: 'Identifico una tarea concreta y pienso cómo poner lo aprendido al servicio de otros.', points: 2, feedback: 'Conectas lo que sabes hacer con el compromiso y el servicio.' },
      { text: 'Creo que cumplo bien, pero no sé aún a quién le sirve lo que hago.', points: 1, feedback: 'Ya estás mirando el propósito; ahora puedes acercar la técnica a las personas.' },
      { text: 'Mientras saque buena nota, lo demás no importa.', points: 0, feedback: 'Cumplir solo por la nota deja fuera el compromiso y la dimensión ética.' }
    ]
  },
  {
    id: 'workshop-passion', station: 'workshop', speaker: 'MAESTRA', question: '¿Has caído en estudiar porque toca o buscas una pasión que le dé sentido a tu esfuerzo?', quality: 'excellence', source: 'Howard Gardner · actitudes profesionalizantes',
    basis: 'Gardner critica la actitud inercial y la transaccional: hacer las cosas porque toca o limitarse a cumplir por la nota o el sueldo.',
    options: [
      { text: 'Busco qué da sentido a mi esfuerzo y ya encuentro algunas pistas.', points: 2, feedback: 'Buscar sentido es una forma de pasar de la inercia al compromiso.' },
      { text: 'Estudio por inercia, pero quisiera encontrar un sentido.', points: 1, feedback: 'Reconocer la inercia es un comienzo para explorar otras motivaciones.' },
      { text: 'Estudio porque toca y ya.', points: 0, feedback: 'Esa respuesta coincide con la actitud inercial descrita por Gardner.' }
    ]
  },
  {
    id: 'tree-principle', station: 'tree', speaker: 'JARDINERO', question: 'Ante el beneficio propio a costa de otra persona, ¿qué principio no negociable sostendría tus decisiones?', quality: 'freedom', source: 'Alejandro Llano · valoraciones fuertes',
    basis: 'Llano señala que para no depender de la debilidad o de emociones cambiantes conviene cultivar valoraciones fuertes: principios éticos sólidos.',
    options: [
      { text: 'No gano a costa de otra persona, aunque nadie llegue a enterarse.', points: 2, feedback: 'Un principio estable puede sostenerte incluso cuando nadie está mirando.' },
      { text: 'Depende de cuánto esté en juego; todavía estoy pensando el límite.', points: 1, feedback: 'Reconoces el dilema; definir el límite con anticipación lo haría más firme.' },
      { text: 'Si me conviene y nadie se entera, lo hago.', points: 0, feedback: 'Sin un principio firme, la conveniencia del momento termina decidiendo por ti.' }
    ]
  }
];

export const JOURNEY_DECISION_BY_ID = Object.fromEntries(JOURNEY_DECISIONS.map(item => [item.id, item]));
export const JOURNEY_STATION_BY_ID = Object.fromEntries(JOURNEY_STATIONS.map(item => [item.id, item]));
export const JOURNEY_QUALITIES = [
  { id: 'criterio', name: 'Criterio Ético' },
  { id: 'authenticity', name: 'Autenticidad' },
  { id: 'freedom', name: 'Libertad Interior' },
  { id: 'excellence', name: 'Excelencia' },
  { id: 'bonds', name: 'Vínculos' }
];
export const JOURNEY_MAX_SCORE = 41; // 28 choice points + 4 streak points + 9 station growth/recovery points.

export function decisionsForStation(stationId) {
  return JOURNEY_DECISIONS.filter(item => item.station === stationId);
}

export function stationIsComplete(journey, stationId) {
  const decisions = decisionsForStation(stationId);
  return decisions.length > 0 && decisions.every(item => journey.decisions?.[item.id]);
}

export function nextJourneyStation(journey) {
  return JOURNEY_STATIONS.find(item => !stationIsComplete(journey, item.id) || !journey.resolvedStations?.[item.id]) || null;
}
