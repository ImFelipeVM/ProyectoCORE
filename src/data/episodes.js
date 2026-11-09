
export const EPISODES = [
    {
        id: 1,
        title: "LA INFANCIA Y EL HOGAR",
        theme: "Familia",
        background: "bg_home",
        narrative: "Tus padres han establecido nuevas reglas estrictas sobre el uso de pantallas y tus responsabilidades en casa. Sientes que son injustas y quieres protestar.",
        reading: "La familia es el primer espacio de socialización. En ella se experimentan el principio de seguridad y el principio de realidad, fundamentales para alcanzar la madurez y la responsabilidad.",
        options: [
            { id: 'A', text: "Acepto las normas entendiendo que buscan mi bienestar y organizo mi tiempo.", score: 10, type: 'virtuosa', feedback: "Correcto. Reconocer los límites y asumir responsabilidades es signo de madurez y respeto al principio de realidad." },
            { id: 'B', text: "Acepto las normas pero me quejo constantemente y trato de evitarlas.", score: -5, type: 'inercial', feedback: "Actitud inercial. La aceptación superficial no conlleva un crecimiento personal ni responsabilidad real." },
            { id: 'C', text: "Rechazo las normas y entro en conflicto abierto con mis padres.", score: -2, type: 'grave', feedback: "Incorrecto. El rechazo impulsivo ignora la función socializadora de la familia y frena la madurez." }
        ]
    },
    {
        id: 2,
        title: "LA CONSTRUCCIÓN DEL YO",
        theme: "Personalidad y Temperamento",
        background: "bg_school",
        narrative: "Has recibido una calificación muy baja en un examen para el que estudiaste. Sientes una profunda frustración y ganas de rendirte.",
        reading: "La personalidad se construye sobre la herencia (temperamento) y el ambiente. La voluntad, la razón y la afectividad deben trabajar juntas para lograr el orden y la constancia. (Enrique Rojas)",
        options: [
            { id: 'A', text: "Analizo mis errores, ajusto mi método de estudio y me propongo mejorar.", score: 10, type: 'virtuosa', feedback: "Virtuoso. Usas la razón y la voluntad para transformar la frustración en una oportunidad de crecimiento." },
            { id: 'B', text: "Me culpo a mí mismo y pienso que no soy lo suficientemente inteligente.", score: -5, type: 'emotiva', feedback: "Error. Te dejas llevar por la afectividad negativa, ignorando que la voluntad puede superar las limitaciones." },
            { id: 'C', text: "Culpo al profesor por la dificultad del examen y decido dejar de esforzarme.", score: -3, type: 'inercial', feedback: "Conducta inercial. Evadir la responsabilidad personal impide el desarrollo de la personalidad." }
        ]
    },
    {
        id: 3,
        title: "EL ESPEJO INTERIOR",
        theme: "Estructura de la Autoestima",
        background: "bg_lab",
        narrative: "Un compañero ha cometido un error grave en un proyecto grupal. Tú sabes cómo arreglarlo rápidamente, pero él se siente humillado.",
        reading: "La autoestima se basa en la competencia y el merecimiento. Una autoestima sana permite el servicio y la generosidad, mientras que la pseudo-autoestima cae en el narcisismo. (Christopher Mruk)",
        options: [
            { id: 'A', text: "Le ayudo a corregirlo discretamente, enseñándole cómo hacerlo para que aprenda.", score: 10, type: 'virtuosa', feedback: "Generosidad y servicio. Utilizas tu competencia para elevar al otro, reflejo de una autoestima sana." },
            { id: 'B', text: "Arreglo el error yo mismo y menciono frente a todos que yo salvé el proyecto.", score: -8, type: 'narcisista', feedback: "Pseudo-autoestima. Buscas validación externa humillando al otro; es una señal de inseguridad disfrazada de superioridad." },
            { id: 'C', text: "Le digo que es su problema y que debe enfrentar las consecuencias solo.", score: -5, type: 'superficial', feedback: "Falta de empatía. Ignoras la oportunidad de servicio, limitando tu crecimiento humano." }
        ]
    },
    {
        id: 4,
        title: "LAS MÁSCARAS Y LA INTIMIDAD",
        theme: "Persona, Pudor y Manifestación",
        background: "bg_park",
        narrative: "En una reunión social, un grupo de amigos te presiona para que reveles un secreto íntimo que un amigo cercano te confió.",
        reading: "La intimidad personal y el pudor protegen la esencia de la persona. La apertura personal debe ser fruto de la confianza y el diálogo, no de la presión social. (Ricardo Yepes y Javier Aranguren)",
        options: [
            { id: 'A', text: "Me niego rotundamente a revelar la información, defendiendo la confianza de mi amigo.", score: 10, type: 'virtuosa', feedback: "Respeto a la intimidad. Proteges la dignidad de la persona y mantienes la lealtad, valor fundamental de la amistad." },
            { id: 'B', text: "Digo que no recuerdo los detalles para evitar el conflicto sin quedar mal con nadie.", score: -8, type: 'superficial', feedback: "Actitud tibia. No defiendes el valor de la intimidad, priorizando la comodidad social sobre la ética." },
            { id: 'C', text: "Reveló el secreto para ganar aceptación y prestigio dentro del grupo.", score: -4, type: 'grave', feedback: "Traición a la confianza. Rompes el pudor y la intimidad del otro para alimentar tu propia máscara social." }
        ]
    },
    {
        id: 5,
        title: "EL DILEMA DE LA SINCERIDAD",
        theme: "Identidad y Autenticidad",
        background: "bg_cafe",
        narrative: "Tus amigos están criticando duramente una idea que tú consideras correcta y valiosa. Todos esperan que te sumes a la crítica.",
        reading: "La autenticidad es la correspondencia entre la interioridad y la exterioridad. La mímesis y la inercia nos empujan a seguir a la masa, perdiendo la identidad personal. (Ricardo Yepes)",
        options: [
            { id: 'A', text: "Expreso mi opinión con respeto, argumentando por qué difiero del grupo.", score: 10, type: 'virtuosa', feedback: "Autenticidad. Mantienes la coherencia entre tu pensamiento y tu acción, reafirmando tu identidad personal." },
            { id: 'B', text: "Me quedo en silencio para no generar tensión, aunque no estoy de acuerdo.", score: -6, type: 'inercial', feedback: "Inercia. Permites que la presión grupal anule tu manifestación personal." },
            { id: 'C', text: "Me sumo a las críticas para encajar, fingiendo que pienso lo mismo que ellos.", score: -5, type: 'mimesis', feedback: "Mímesis. Sacrificas tu autenticidad por aceptación social, creando una fractura en tu identidad." }
        ]
    },
    {
        id: 6,
        title: "EL MURO DIGITAL",
        theme: "Amistad y Redes Sociales",
        background: "bg_room",
        narrative: "Un amigo te escribe diciendo que se siente muy solo y necesita hablar. Justo en ese momento, recibes una invitación a un evento exclusivo que te daría mucha visibilidad.",
        reading: "Aristóteles distingue la amistad por utilidad, por placer y la amistad perfecta (de virtud). Las redes sociales a menudo instrumentalizan las relaciones. (Aristóteles y Ana María Romero Iribas)",
        options: [
            { id: 'A', text: "Priorizo a mi amigo, escuchándolo y acompañándolo en su momento de necesidad.", score: 10, type: 'virtuosa', feedback: "Amistad de virtud. Reconoces la dignidad del amigo sobre la utilidad o el placer inmediato." },
            { id: 'B', text: "Le digo que estoy ocupado y voy al evento, prometiendo llamarlo 'luego' (aunque sé que no lo haré).", score: -8, type: 'utilidad', feedback: "Amistad por utilidad. Instrumentalizas al amigo y priorizas el beneficio personal." },
            { id: 'C', text: "Intento hacer ambas cosas, pero ignoro los mensajes del amigo mientras estoy en el evento.", score: -4, type: 'placer', feedback: "Amistad por placer. Buscas la gratificación inmediata del evento, descuidando la profundidad del vínculo humano." }
        ]
    },
    {
        id: 7,
        title: "LA SALIDA DEL LABERINTO",
        theme: "Libertad y Felicidad",
        background: "bg_view",
        narrative: "Tienes la oportunidad de obtener un beneficio rápido haciendo algo que contradice tus valores y el proyecto de vida que has diseñado para ti.",
        reading: "La libertad no es solo 'libertad-de' (impulsos), sino 'libertad-para' (un proyecto vital). La felicidad surge de actuar según valoraciones fuertes y coherentes. (Alejandro Llano)",
        options: [
            { id: 'A', text: "Rechazo el beneficio inmediato para mantenerme fiel a mi proyecto de vida.", score: 10, type: 'virtuosa', feedback: "Libertad-para. Ejerces tu libertad verdadera al elegir el bien superior sobre el impulso inmediato." },
            { id: 'B', text: "Acepto el beneficio, justificando que 'solo es una vez' y que no hace daño a nadie.", score: -7, type: 'inercial', feedback: "Esclavitud del impulso. Cedes ante la inmediatez, debilitando tu proyecto vital." },
            { id: 'C', text: "Dudo mucho y termino aceptando por miedo a perder la oportunidad.", score: -4, type: 'emotiva', feedback: "Falta de libertad interior. El miedo domina tu decisión, alejándote de tu felicidad real." }
        ]
    },
    {
        id: 8,
        title: "EL FUTURO PROFESIONAL",
        theme: "Vocación y Ética ECE",
        background: "bg_office",
        narrative: "Tu jefe te ofrece un bono económico muy atractivo si alteras ligeramente unos datos en un informe oficial para que la empresa luzca mejor.",
        reading: "La excelencia profesional requiere compromiso y ética. Las conductas transaccionales (dinero por integridad) y las inerciales (hacerlo porque todos lo hacen) destruyen la responsabilidad profesional. (Howard Gardner)",
        options: [
            { id: 'A', text: "Me niego a alterar los datos, manteniendo la honestidad y la excelencia profesional.", score: 10, type: 'virtuosa', feedback: "Ética Profesional. Actúas con integridad y compromiso, alcanzando la excelencia en tu vocación." },
            { id: 'B', text: "Acepto la propuesta; el beneficio económico es demasiado alto para rechazarlo.", score: -10, type: 'transaccional', feedback: "CONDUCTA TRANSACCIONAL GRAVE. Has vendido tu integridad profesional. Esta decisión conlleva el fracaso ético y la pérdida de credibilidad profesional." },
            { id: 'C', text: "Acepto, argumentando que en este sector todos alteran los datos para sobrevivir.", score: -7, type: 'inercial', feedback: "CONDUCTA INERCIAL. Justificas la falta de ética basándote en el error ajeno, renunciando a tu responsabilidad profesional." }
        ]
    }
];
