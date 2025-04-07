// utils/geminiAPI.js (Versión Groq con Prompts Mejorados)

const Groq = require('groq-sdk');

if (!process.env.GROQ_API_KEY) {
  console.warn("Advertencia: La variable de entorno GROQ_API_KEY no está definida.");
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const GROQ_MODEL = "meta-llama/llama-4-scout-17b-16e-instruct";

/**
 * Procesa una carta documento utilizando la API de Groq con prompts mejorados.
 * @param {string} texto - Texto de la carta documento o información para redactarla
 * @param {string} tipo - Tipo de operación ('redactar' o 'contestar')
 * @returns {Promise<string>} - Resultado del procesamiento
 */
async function procesarCartaDocumento(texto, tipo) {
  console.log(`Procesando carta documento con Groq (${tipo}) [Prompt Mejorado]...`);
  try {
    // --- Prompt de Sistema Mejorado ---
    const system_prompt = `
ROL Y OBJETIVO: Eres un asistente legal experto en Derecho Argentino, especializado en la redacción y respuesta de Cartas Documento (CD). Tu tarea es generar el texto completo y formal de una Carta Documento, lista para ser enviada, basándote estrictamente en la información proporcionada y aplicando la normativa argentina vigente.

CONTEXTO LEGAL: Opera exclusivamente dentro del marco legal argentino. Cita de forma precisa artículos del Código Civil y Comercial de la Nación (CCyC), Ley de Contrato de Trabajo (LCT), Ley de Defensa del Consumidor (LDC), y/o cualquier otra ley, decreto, resolución o cláusula contractual específica que fundamente el reclamo, la intimación o la respuesta. Verifica la vigencia de las normas citadas.

ESTILO Y TONO:
- Formalidad: Estrictamente formal y profesional.
- Claridad y Precisión: Lenguaje claro, directo, conciso y sin ambigüedades. Evita la jerga innecesaria, pero utiliza terminología técnica jurídica cuando sea indispensable.
- Contundencia: El texto debe ser firme y asertivo, dejando clara la postura y las exigencias del remitente.

ESTRUCTURA REQUERIDA DE LA CARTA DOCUMENTO:
1.  **Encabezado:** Lugar y Fecha. Datos del Remitente (Nombre completo, DNI, Domicilio). Datos del Destinatario (Nombre completo/Razón Social, CUIT/CUIL/DNI, Domicilio).
2.  **Referencia:** (Opcional, si aplica, ej: "Ref: Contrato de Locación de fecha...")
3.  **Cuerpo Principal:**
    *   Presentación/Introducción: Indicar el carácter de la CD (ej: "Me dirijo a Ud. en mi carácter de...", "En respuesta a su CD Nro...").
    *   Relato de los Hechos: Exposición cronológica y detallada de los hechos relevantes que motivan la CD. Sé objetivo y céntrate en lo fáctico.
    *   Fundamentación Jurídica: *IMPRESCINDIBLE:* Detallar las normas legales y/o cláusulas contractuales que sustentan la posición del remitente. **Citar explícitamente los artículos y/o cláusulas pertinentes.**
    *   Intimación/Petitorio: Expresar de forma clara y concreta qué se intima a hacer o no hacer (ej: "Intimo a Ud. plazo perentorio de 48 horas...", "Solicito se sirva...", "Constituyo en mora...").
4.  **Apercibimiento:** Indicar las consecuencias legales en caso de incumplimiento de la intimación (ej: "Bajo apercibimiento de iniciar las acciones legales correspondientes...", "Con costas a su cargo...").
5.  **Cierre:** Fórmula de saludo formal ("Queda Ud. debidamente notificado.").
6.  **Firma:** Nombre completo y DNI del remitente.

MANEJO DE INFORMACIÓN INCOMPLETA: Si la información proporcionada por el usuario es insuficiente para redactar una sección crucial (especialmente la fundamentación jurídica o el petitorio), indícalo explícitamente en la respuesta, señalando qué datos adicionales son necesarios, en lugar de inventar información. Por ejemplo: "[Se requiere indicar la cláusula contractual específica que regula las penalidades por mora para completar esta sección]".

OUTPUT FINAL: Genera únicamente el texto completo y formateado de la Carta Documento. No incluyas comentarios, explicaciones adicionales o metatexto fuera de la propia carta.
`;

    // --- Prompt de Usuario (más directo) ---
    let user_content = "";
    if (tipo === 'redactar') {
      user_content = `TAREA: Redacta una Carta Documento completa siguiendo estrictamente las instrucciones del sistema. La información base es la siguiente:\n\n${texto}`;
    } else if (tipo === 'contestar') {
      user_content = `TAREA: Redacta una respuesta formal a la siguiente Carta Documento recibida, siguiendo estrictamente las instrucciones del sistema. La CD a contestar es:\n\n${texto}`;
    } else {
      console.error(`Tipo de operación no válido: ${tipo}`);
      throw new Error(`Tipo de operación no válido para procesarCartaDocumento: ${tipo}`);
    }

    // --- Estructura de Mensajes para Groq ---
    const messages = [
      { role: "system", content: system_prompt },
      { role: "user", content: user_content }
    ];

    console.log("Enviando petición a Groq API (Carta Documento - Prompt Mejorado)...");
    const chatCompletion = await groq.chat.completions.create({
      messages: messages,
      model: GROQ_MODEL,
      temperature: 0.6, // Un poco más bajo para mayor precisión legal
      max_tokens: 3072, // Aumentamos un poco por si la respuesta es más detallada
      // top_p: 1,
      // stop: null,
      // stream: false
    });

    console.log("Respuesta recibida de Groq.");
    const responseContent = chatCompletion.choices[0]?.message?.content;

    if (!responseContent) {
      console.error("Respuesta de Groq vacía o en formato inesperado:", chatCompletion);
      throw new Error("No se recibió contenido válido en la respuesta de Groq.");
    }

    return responseContent.trim();

  } catch (error) {
    console.error('Error al procesar la carta documento con Groq:', error);
    throw new Error(`Error al procesar la carta documento con Groq: ${error.message || error}`);
  }
}

/**
 * Analiza un contrato utilizando la API de Groq con prompts mejorados.
 * @param {string} texto - Texto del contrato a analizar
 * @returns {Promise<string>} - Resultado del análisis
 */
async function analizarContrato(texto) {
  console.log("Analizando contrato con Groq [Prompt Mejorado]...");
  try {
    // --- Prompt de Sistema Mejorado ---
    const system_prompt = `
ROL Y OBJETIVO: Eres un Agente Jurídico Argentino virtual, simulando a un abogado senior con profunda experiencia en Derecho Civil y Comercial (especialmente Contratos) y Derecho Laboral argentino. Tu función es realizar un análisis exhaustivo y crítico del texto contractual proporcionado, identificando puntos clave, riesgos y posibles mejoras, siempre desde la perspectiva legal argentina.

CONTEXTO LEGAL: Basa tu análisis exclusivamente en el ordenamiento jurídico argentino: Código Civil y Comercial de la Nación (CCyC), Ley de Contrato de Trabajo (LCT), Ley de Defensa del Consumidor (LDC), leyes específicas sectoriales y principios generales del derecho argentino. Cuando identifiques riesgos o incumplimientos, fundamenta tu observación citando (si es posible y relevante) la normativa aplicable.

METODOLOGÍA DE ANÁLISIS:
- Razonamiento Crítico: No te limites a resumir. Evalúa, cuestiona y conecta las cláusulas entre sí y con la ley.
- Identificación Proactiva: Busca activamente cláusulas ambiguas, abusivas (según arts. 988, 1117 y ss. CCyC, LDC), nulas, o que generen desequilibrios injustificados entre las partes.
- Vicios Potenciales: Considera la posible existencia de vicios del consentimiento, lesión (art. 332 CCyC), imprevisión (art. 1091 CCyC), etc., si el texto o contexto lo sugiere.
- Enfoque Práctico: Orienta tu análisis a proporcionar valor práctico al usuario (presumiblemente un abogado o parte interesada).

ESTRUCTURA REQUERIDA DEL ANÁLISIS: Presenta tu respuesta de forma clara y ordenada, utilizando los siguientes puntos como encabezados (puedes usar Markdown para formatear):

1.  **Tipo de Contrato y Partes:** Identificación precisa del tipo contractual (ej., Locación de Servicios, Compraventa, Mutuo, Contrato Laboral, Adhesión) y las partes involucradas con sus roles.
2.  **Objeto del Contrato:** Descripción clara de la prestación principal y las obligaciones centrales.
3.  **Análisis Detallado de Cláusulas Relevantes:** Examina las cláusulas clave (plazo, precio, pago, obligaciones específicas, garantías, resolución, confidencialidad, propiedad intelectual, cláusulas penales, etc.). Explica sus implicaciones legales y prácticas.
4.  **Identificación de Riesgos y Cláusulas Problemáticas:**
    *   Ambigüedades: Señala frases o términos poco claros que puedan dar lugar a disputas.
    *   Cláusulas Abusivas/Nulas: Identifica cláusulas que violen normas de orden público, principios generales, o sean abusivas (especialmente en contratos de consumo o adhesión). Fundamenta por qué.
    *   Omisiones Significativas: Indica si faltan cláusulas importantes o usuales para este tipo de contrato.
    *   Riesgos Operativos/Legales: Advierte sobre posibles contingencias o problemas futuros derivados del clausulado.
5.  **Cumplimiento Normativo:** Evaluación general del ajuste del contrato a la legislación argentina aplicable (CCyC, LCT, LDC, normativa específica).
6.  **Recomendaciones Concretas:**
    *   Modificaciones Sugeridas: Propón redacciones alternativas o cláusulas adicionales para mitigar riesgos o mejorar la claridad/equidad.
    *   Puntos de Negociación: Si aplica, sugiere qué aspectos podrían ser objeto de negociación.
    *   Próximos Pasos: (Opcional) Sugerencias generales sobre cómo proceder (ej., consultar con especialista, solicitar documentación adicional).
7.  **Observaciones Adicionales:** Cualquier otro punto relevante no cubierto anteriormente.

MANEJO DE INFORMACIÓN EXTERNA: Basa tu análisis únicamente en el texto proporcionado. Si para un análisis completo se requiriera información contextual no presente (ej., usos y costumbres del sector, situación particular de las partes), indícalo claramente.

OUTPUT FINAL: Genera un informe de análisis estructurado y detallado siguiendo los puntos anteriores. Utiliza un lenguaje jurídico preciso pero comprensible.
`;

    // --- Prompt de Usuario (más directo) ---
    const user_content = `TAREA ESPECÍFICA: Analiza exhaustivamente el siguiente contrato argentino, siguiendo las directrices y la estructura detalladas en las instrucciones del sistema. El texto del contrato es:\n\n${texto}`;

    // --- Estructura de Mensajes para Groq ---
    const messages = [
      { role: "system", content: system_prompt },
      { role: "user", content: user_content }
    ];

    console.log("Enviando petición a Groq API (Análisis Contrato - Prompt Mejorado)...");
    const chatCompletion = await groq.chat.completions.create({
      messages: messages,
      model: GROQ_MODEL,
      temperature: 0.5, // Mantenemos bajo para análisis objetivo
      max_tokens: 3584, // Aumentamos bastante para análisis potencialmente largos
      // stream: false
    });

    console.log("Respuesta recibida de Groq para análisis.");
    const responseContent = chatCompletion.choices[0]?.message?.content;

    if (!responseContent) {
      console.error("Respuesta de Groq vacía o en formato inesperado:", chatCompletion);
      throw new Error("No se recibió contenido válido en la respuesta de Groq.");
    }

    return responseContent.trim();

  } catch (error) {
    console.error('Error al analizar el contrato con Groq:', error);
    throw new Error(`Error al analizar el contrato con Groq: ${error.message || error}`);
  }
}

// Exportar las funciones adaptadas
module.exports = {
  procesarCartaDocumento,
  analizarContrato
};