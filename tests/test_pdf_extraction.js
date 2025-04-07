// Script para probar la extracción de texto del PDF proporcionado por el usuario
const fs = require('fs');
const path = require('path');
const { extractTextFromFile } = require('../utils/textExtractor');

// Ruta al PDF proporcionado por el usuario
const pdfPath = path.join(__dirname, '..', 'test_pdf', 'Duarte Maldonado TCL 26225.pdf');

// Función para probar la extracción de texto
async function testPDFExtraction() {
  console.log('Iniciando prueba de extracción de texto del PDF proporcionado por el usuario...');
  console.log(`Archivo: ${pdfPath}`);
  
  try {
    // Verificar que el archivo existe
    if (!fs.existsSync(pdfPath)) {
      throw new Error(`El archivo no existe en la ruta: ${pdfPath}`);
    }
    
    console.log('Extrayendo texto del PDF...');
    const startTime = Date.now();
    
    // Intentar extraer el texto
    const extractedText = await extractTextFromFile(pdfPath);
    
    const endTime = Date.now();
    const executionTime = (endTime - startTime) / 1000; // en segundos
    
    console.log(`Extracción completada en ${executionTime.toFixed(2)} segundos`);
    
    // Verificar si se extrajo texto
    if (!extractedText || extractedText.trim().length === 0) {
      throw new Error('No se pudo extraer texto del PDF. El resultado está vacío.');
    }
    
    // Guardar el texto extraído para revisión
    const outputPath = path.join(__dirname, '..', 'test_pdf', 'extracted_text.txt');
    fs.writeFileSync(outputPath, extractedText);
    
    console.log(`Texto extraído guardado en: ${outputPath}`);
    console.log(`Longitud del texto extraído: ${extractedText.length} caracteres`);
    
    // Mostrar una muestra del texto extraído
    const previewLength = Math.min(500, extractedText.length);
    console.log('\nMuestra del texto extraído:');
    console.log('----------------------------');
    console.log(extractedText.substring(0, previewLength) + (extractedText.length > previewLength ? '...' : ''));
    console.log('----------------------------');
    
    console.log('\n✅ Prueba exitosa: Se pudo extraer texto del PDF');
    return true;
  } catch (error) {
    console.error('\n❌ Prueba fallida:', error.message);
    return false;
  }
}

// Ejecutar la prueba
testPDFExtraction()
  .then(success => {
    console.log(`\nPrueba ${success ? 'completada exitosamente' : 'fallida'}`);
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('Error al ejecutar la prueba:', error);
    process.exit(1);
  });
