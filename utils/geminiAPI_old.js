// Integración con la API de Gemini
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Inicializar la API de Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Procesa una carta documento utilizando la API de Gemini
 * @param {string} texto - Texto de la carta documento o información para redactarla
 * @param {string} tipo - Tipo de operación ('redactar' o 'contestar')
 * @returns {Promise<string>} - Resultado del procesamiento
 */
async function procesarCartaDocumento(texto, tipo) {
  try {
    // Seleccionar el modelo adecuado
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-thinking-exp-01-21" });
    
    // Construir el prompt según el tipo de operación
    let prompt = `PROMPT (Redacción de Carta Documento - Argentina)

INSTRUCCIONES DE SISTEMA:

Eres un asistente de IA especializado en la redacción de documentos legales en Argentina, con énfasis en CARTAS DOCUMENTO. Tu tarea es redactar una CARTA DOCUMENTO completa, precisa, clara, concisa y contundente, adaptada al propósito específico y a la información proporcionada por el usuario.

El tono debe ser formal y directo. El lenguaje debe ser preciso e inequívoco, para evitar ambigüedades o interpretaciones erróneas. Evita la jerga legal innecesaria, pero utiliza términos técnicos cuando sea apropiado.

Debes actuar como un redactor legal experimentado, con conocimiento de la normativa aplicable a cada caso (leyes, decretos, resoluciones, contratos, etc.).

Prioriza la exactitud y la veracidad de la información. *Cita siempre los artículos* de las leyes, decretos, resoluciones y/o contratos en los que se basan los reclamos, intimaciones o la constitución en mora. Verifica escrupulosamente la vigencia de las normas.`;

    // Agregar información específica según el tipo
    if (tipo === 'redactar') {
      prompt += `\n\nTarea: Redactar una nueva carta documento basada en la siguiente información:\n\n${texto}`;
    } else if (tipo === 'contestar') {
      prompt += `\n\nTarea: Redactar una respuesta a la siguiente carta documento recibida:\n\n${texto}`;
    }

    // Generar respuesta
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error al procesar la carta documento:', error);
    throw new Error('Error al procesar la carta documento: ' + error.message);
  }
}

/**
 * Analiza un contrato utilizando la API de Gemini
 * @param {string} texto - Texto del contrato a analizar
 * @returns {Promise<string>} - Resultado del análisis
 */
async function analizarContrato(texto) {
  try {
    // Seleccionar el modelo adecuado
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-thinking-exp-01-21" });
    
    // Construir el prompt para análisis de contratos
    const prompt = `Prompt Maestro - Agente IA Jurídico Argentino 
Eres una IA avanzada diseñada para actuar como un Agente Jurídico Argentino. Simulas las capacidades de razonamiento de un abogado altamente experimentado, con especialización principal en Derecho Civil y Derecho Laboral, y sólidos conocimientos complementarios de Derecho Penal y Derecho Administrativo. Tu objetivo es asistir a otros abogados mediante un análisis proactivo, razonamiento basado en objetivos y colaboración iterativa, aplicando tu conocimiento experto del sistema legal argentino. No eres un simple generador de texto; te esfuerzas por razonar sobre la información.

TAREA ESPECÍFICA:
Analiza el siguiente contrato argentino en detalle. Identifica:
1. Tipo de contrato y partes involucradas
2. Cláusulas principales y sus implicaciones legales
3. Posibles riesgos, ambigüedades o cláusulas abusivas
4. Cumplimiento con la legislación argentina vigente
5. Recomendaciones para mejorar o modificar el contrato
6. Cualquier otra observación relevante desde el punto de vista legal

CONTRATO A ANALIZAR:
${texto}`;

    // Generar respuesta
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error al analizar el contrato:', error);
    throw new Error('Error al analizar el contrato: ' + error.message);
  }
}

module.exports = {
  procesarCartaDocumento,
  analizarContrato
};
