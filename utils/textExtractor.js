// Utilidad mejorada para extraer texto de diferentes tipos de archivos
const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const { createWorker } = require('tesseract.js');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

/**
 * Extrae texto de un archivo según su tipo
 * @param {string} filePath - Ruta del archivo
 * @returns {Promise<string>} - Texto extraído del archivo
 */
async function extractTextFromFile(filePath) {
  const fileExtension = path.extname(filePath).toLowerCase();
  
  try {
    switch (fileExtension) {
      case '.pdf':
        return await extractTextFromPDF(filePath);
      case '.docx':
        return await extractTextFromDOCX(filePath);
      case '.doc':
        // Para archivos .doc, podríamos necesitar una solución diferente
        // Por ahora, informamos que no es compatible directamente
        throw new Error('Los archivos .doc no son compatibles directamente. Por favor, conviértalos a .docx o .pdf');
      case '.txt':
        return await extractTextFromTXT(filePath);
      case '.jpg':
      case '.jpeg':
      case '.png':
        return await extractTextFromImage(filePath);
      default:
        throw new Error(`Tipo de archivo no soportado: ${fileExtension}`);
    }
  } catch (error) {
    console.error(`Error al extraer texto del archivo ${filePath}:`, error);
    throw error;
  }
}

/**
 * Extrae texto de un archivo PDF
 * @param {string} filePath - Ruta del archivo PDF
 * @returns {Promise<string>} - Texto extraído del PDF
 */
async function extractTextFromPDF(filePath) {
  try {
    // Primero intentamos extraer texto directamente con pdf-parse
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    
    // Si el texto extraído es muy corto, podría ser un PDF basado en imágenes
    if (data.text.trim().length < 100) {
      console.log('PDF posiblemente basado en imágenes. Intentando extracción con pdftotext...');
      return await extractTextFromPDFWithPoppler(filePath);
    }
    
    return data.text;
  } catch (error) {
    console.error('Error al extraer texto del PDF con pdf-parse:', error);
    // Si falla la extracción normal, intentamos con poppler-utils
    console.log('Intentando extraer texto del PDF con pdftotext...');
    return await extractTextFromPDFWithPoppler(filePath);
  }
}

/**
 * Extrae texto de un PDF utilizando poppler-utils (pdftotext)
 * @param {string} filePath - Ruta del archivo PDF
 * @returns {Promise<string>} - Texto extraído del PDF
 */
async function extractTextFromPDFWithPoppler(filePath) {
  try {
    // Intentar extraer texto con pdftotext (parte de poppler-utils)
    const outputPath = `${filePath}.txt`;
    await execPromise(`pdftotext -layout "${filePath}" "${outputPath}"`);
    
    // Leer el texto extraído
    const extractedText = fs.readFileSync(outputPath, 'utf8');
    
    // Eliminar el archivo temporal
    fs.unlinkSync(outputPath);
    
    // Si el texto extraído es muy corto, podría ser un PDF basado en imágenes
    if (extractedText.trim().length < 100) {
      console.log('PDF posiblemente basado en imágenes. Intentando OCR con pdftoppm y Tesseract...');
      return await extractTextFromPDFWithOCR(filePath);
    }
    
    return extractedText;
  } catch (error) {
    console.error('Error al extraer texto del PDF con pdftotext:', error);
    // Si falla pdftotext, intentamos con OCR
    console.log('Intentando extraer texto del PDF mediante OCR...');
    return await extractTextFromPDFWithOCR(filePath);
  }
}

/**
 * Extrae texto de un PDF utilizando OCR (convierte PDF a imágenes con pdftoppm y luego aplica Tesseract)
 * @param {string} filePath - Ruta del archivo PDF
 * @returns {Promise<string>} - Texto extraído del PDF mediante OCR
 */
async function extractTextFromPDFWithOCR(filePath) {
  try {
    // Crear directorio temporal para las imágenes
    const tempDir = path.join(path.dirname(filePath), 'temp_ocr');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    
    // Nombre base para las imágenes
    const baseName = path.join(tempDir, path.basename(filePath, '.pdf'));
    
    // Convertir PDF a imágenes usando pdftoppm (parte de poppler-utils)
    await execPromise(`pdftoppm -png "${filePath}" "${baseName}"`);
    
    // Obtener lista de imágenes generadas
    const imageFiles = fs.readdirSync(tempDir)
      .filter(file => file.startsWith(path.basename(filePath, '.pdf')) && file.endsWith('.png'))
      .map(file => path.join(tempDir, file))
      .sort(); // Ordenar para mantener el orden de las páginas
    
    if (imageFiles.length === 0) {
      throw new Error('No se pudieron generar imágenes a partir del PDF');
    }
    
    // Extraer texto de cada imagen usando Tesseract
    let fullText = '';
    const worker = await createWorker('spa');
    
    for (const imageFile of imageFiles) {
      console.log(`Procesando OCR para imagen: ${imageFile}`);
      const { data: { text } } = await worker.recognize(imageFile);
      fullText += text + '\n\n';
      
      // Eliminar la imagen después de procesarla
      fs.unlinkSync(imageFile);
    }
    
    // Terminar el worker de Tesseract
    await worker.terminate();
    
    // Eliminar el directorio temporal
    fs.rmdirSync(tempDir);
    
    return fullText;
  } catch (error) {
    console.error('Error al extraer texto del PDF mediante OCR:', error);
    throw error;
  }
}

/**
 * Extrae texto de un archivo DOCX
 * @param {string} filePath - Ruta del archivo DOCX
 * @returns {Promise<string>} - Texto extraído del DOCX
 */
async function extractTextFromDOCX(filePath) {
  try {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  } catch (error) {
    console.error('Error al extraer texto del DOCX:', error);
    throw error;
  }
}

/**
 * Extrae texto de un archivo TXT
 * @param {string} filePath - Ruta del archivo TXT
 * @returns {Promise<string>} - Texto extraído del TXT
 */
async function extractTextFromTXT(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.error('Error al extraer texto del TXT:', error);
    throw error;
  }
}

/**
 * Extrae texto de una imagen usando OCR (Tesseract.js)
 * @param {string} filePath - Ruta del archivo de imagen
 * @returns {Promise<string>} - Texto extraído de la imagen
 */
async function extractTextFromImage(filePath) {
  const worker = await createWorker('spa');
  
  try {
    const { data: { text } } = await worker.recognize(filePath);
    await worker.terminate();
    return text;
  } catch (error) {
    console.error('Error al extraer texto de la imagen:', error);
    await worker.terminate();
    throw error;
  }
}

module.exports = {
  extractTextFromFile
};
