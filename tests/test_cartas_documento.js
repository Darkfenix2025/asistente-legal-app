// Script para pruebas de la funcionalidad de cartas documento
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

// URL base para las pruebas (servidor local)
const BASE_URL = 'http://localhost:3000/api';

// Función para probar la redacción de carta documento con texto
async function testRedactarCartaDocumentoTexto() {
  console.log('\n=== Prueba: Redactar carta documento con texto ===');
  
  try {
    const response = await axios.post(`${BASE_URL}/procesar`, {
      tipo: 'redactar',
      texto: 'Necesito redactar una carta documento para intimar a mi inquilino por falta de pago del alquiler correspondiente a los meses de enero, febrero y marzo de 2025. El contrato establece una penalidad del 0.5% diario por día de retraso. Los datos del inquilino son: Juan Pérez, DNI 25.123.456, domicilio en Av. Corrientes 1234, CABA. Mis datos son: María González, DNI 20.987.654, propietaria del inmueble ubicado en Av. Corrientes 1234, CABA.'
    });
    
    console.log('✅ Prueba exitosa');
    console.log('Respuesta del servidor:');
    console.log('Status:', response.status);
    console.log('Resultado recibido:', response.data.resultado ? 'Sí' : 'No');
    console.log('Longitud del resultado:', response.data.resultado ? response.data.resultado.length : 0);
    
    // Guardar resultado para revisión
    fs.writeFileSync(
      path.join(__dirname, 'test_results', 'carta_documento_redactar_texto.txt'), 
      response.data.resultado || 'Sin resultado'
    );
    
    return true;
  } catch (error) {
    console.log('❌ Prueba fallida');
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Datos:', error.response.data);
    }
    return false;
  }
}

// Función para probar la contestación de carta documento con texto
async function testContestarCartaDocumentoTexto() {
  console.log('\n=== Prueba: Contestar carta documento con texto ===');
  
  try {
    const response = await axios.post(`${BASE_URL}/procesar`, {
      tipo: 'contestar',
      texto: 'He recibido una carta documento donde se me intima a pagar la suma de $500.000 en concepto de daños y perjuicios por un supuesto incumplimiento contractual. La carta alega que no entregué mercadería según lo acordado en el contrato de compraventa firmado el 15/01/2025. Sin embargo, tengo comprobantes de entrega firmados por un empleado de la empresa reclamante. Necesito contestar rechazando el reclamo y exponiendo mi posición.'
    });
    
    console.log('✅ Prueba exitosa');
    console.log('Respuesta del servidor:');
    console.log('Status:', response.status);
    console.log('Resultado recibido:', response.data.resultado ? 'Sí' : 'No');
    console.log('Longitud del resultado:', response.data.resultado ? response.data.resultado.length : 0);
    
    // Guardar resultado para revisión
    fs.writeFileSync(
      path.join(__dirname, 'test_results', 'carta_documento_contestar_texto.txt'), 
      response.data.resultado || 'Sin resultado'
    );
    
    return true;
  } catch (error) {
    console.log('❌ Prueba fallida');
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Datos:', error.response.data);
    }
    return false;
  }
}

// Función para probar la redacción de carta documento con archivo (simulado)
async function testRedactarCartaDocumentoArchivo() {
  console.log('\n=== Prueba: Redactar carta documento con archivo (simulado) ===');
  
  try {
    // Crear un archivo de texto temporal para la prueba
    const testFilePath = path.join(__dirname, 'test_data', 'carta_documento_info.txt');
    const testContent = 'Necesito redactar una carta documento para intimar a mi empleador por falta de pago de horas extras trabajadas durante los meses de enero a marzo de 2025. Trabajo en la empresa XYZ S.A., CUIT 30-12345678-9, con domicilio en Av. Libertador 1234, CABA. Mis datos son: Carlos Rodríguez, DNI 30.456.789, empleado desde 2020, legajo 12345.';
    
    // Asegurar que el directorio existe
    if (!fs.existsSync(path.join(__dirname, 'test_data'))) {
      fs.mkdirSync(path.join(__dirname, 'test_data'), { recursive: true });
    }
    
    fs.writeFileSync(testFilePath, testContent);
    
    // Crear FormData y adjuntar el archivo
    const formData = new FormData();
    formData.append('tipo', 'redactar');
    formData.append('archivo', fs.createReadStream(testFilePath));
    
    const response = await axios.post(`${BASE_URL}/procesar`, formData, {
      headers: {
        ...formData.getHeaders()
      }
    });
    
    console.log('✅ Prueba exitosa');
    console.log('Respuesta del servidor:');
    console.log('Status:', response.status);
    console.log('Resultado recibido:', response.data.resultado ? 'Sí' : 'No');
    console.log('Longitud del resultado:', response.data.resultado ? response.data.resultado.length : 0);
    
    // Guardar resultado para revisión
    if (!fs.existsSync(path.join(__dirname, 'test_results'))) {
      fs.mkdirSync(path.join(__dirname, 'test_results'), { recursive: true });
    }
    
    fs.writeFileSync(
      path.join(__dirname, 'test_results', 'carta_documento_redactar_archivo.txt'), 
      response.data.resultado || 'Sin resultado'
    );
    
    return true;
  } catch (error) {
    console.log('❌ Prueba fallida');
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Datos:', error.response.data);
    }
    return false;
  }
}

// Función principal para ejecutar todas las pruebas
async function runTests() {
  console.log('Iniciando pruebas de funcionalidad de cartas documento...');
  
  // Crear directorio para resultados si no existe
  if (!fs.existsSync(path.join(__dirname, 'test_results'))) {
    fs.mkdirSync(path.join(__dirname, 'test_results'), { recursive: true });
  }
  
  // Ejecutar pruebas
  const results = {
    redactarTexto: await testRedactarCartaDocumentoTexto(),
    contestarTexto: await testContestarCartaDocumentoTexto(),
    redactarArchivo: await testRedactarCartaDocumentoArchivo()
  };
  
  // Mostrar resumen
  console.log('\n=== Resumen de pruebas ===');
  console.log(`Redactar carta documento con texto: ${results.redactarTexto ? '✅ Pasó' : '❌ Falló'}`);
  console.log(`Contestar carta documento con texto: ${results.contestarTexto ? '✅ Pasó' : '❌ Falló'}`);
  console.log(`Redactar carta documento con archivo: ${results.redactarArchivo ? '✅ Pasó' : '❌ Falló'}`);
  
  const totalTests = Object.keys(results).length;
  const passedTests = Object.values(results).filter(result => result).length;
  
  console.log(`\nResultado final: ${passedTests}/${totalTests} pruebas exitosas`);
  
  return passedTests === totalTests;
}

// Ejecutar las pruebas
runTests()
  .then(success => {
    console.log(`\nPruebas ${success ? 'completadas exitosamente' : 'con fallos'}`);
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('Error al ejecutar las pruebas:', error);
    process.exit(1);
  });
