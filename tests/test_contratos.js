// Script para pruebas de la funcionalidad de análisis de contratos
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

// URL base para las pruebas (servidor local)
const BASE_URL = 'http://localhost:3000/api';

// Función para probar el análisis de contrato con texto
async function testAnalizarContratoTexto() {
  console.log('\n=== Prueba: Analizar contrato con texto ===');
  
  try {
    const contratoEjemplo = `CONTRATO DE LOCACIÓN DE INMUEBLE

ENTRE: Juan Pérez, DNI 25.123.456, con domicilio en Av. Corrientes 1234, CABA, en adelante "EL LOCADOR"

Y: María González, DNI 30.456.789, con domicilio en Av. Santa Fe 5678, CABA, en adelante "LA LOCATARIA"

CONVIENEN en celebrar el presente contrato de locación sujeto a las siguientes cláusulas:

PRIMERA: EL LOCADOR da en locación a LA LOCATARIA y ésta acepta, el inmueble ubicado en Av. Rivadavia 9876, piso 3, departamento B, CABA.

SEGUNDA: El plazo de la locación se establece en 36 (treinta y seis) meses, comenzando el día 1 de mayo de 2025 y finalizando el día 30 de abril de 2028.

TERCERA: El precio de la locación se pacta en la suma de $150.000 (ciento cincuenta mil pesos) mensuales para el primer año, $180.000 (ciento ochenta mil pesos) mensuales para el segundo año, y $216.000 (doscientos dieciséis mil pesos) mensuales para el tercer año.

CUARTA: El alquiler deberá ser abonado del 1 al 10 de cada mes por adelantado mediante transferencia bancaria a la cuenta que EL LOCADOR indique.

QUINTA: LA LOCATARIA deberá abonar además del alquiler, todos los servicios con que cuenta el inmueble (luz, gas, agua, internet, expensas).

SEXTA: Se establece un depósito en garantía equivalente a un mes de alquiler, que será devuelto al finalizar el contrato, previa verificación del estado del inmueble.

SÉPTIMA: LA LOCATARIA no podrá subalquilar total o parcialmente el inmueble, ni ceder el contrato sin autorización escrita de EL LOCADOR.

OCTAVA: LA LOCATARIA recibe el inmueble en perfecto estado de conservación y se compromete a devolverlo en iguales condiciones al finalizar el contrato.

NOVENA: LA LOCATARIA no podrá realizar modificaciones estructurales en el inmueble sin autorización escrita de EL LOCADOR.

DÉCIMA: En caso de incumplimiento de cualquiera de las cláusulas del presente contrato, EL LOCADOR podrá resolver el mismo y exigir el desalojo inmediato.

DÉCIMO PRIMERA: Para todos los efectos legales derivados del presente contrato, las partes constituyen domicilio en los indicados al comienzo, sometiéndose a la jurisdicción de los Tribunales Ordinarios de la Ciudad Autónoma de Buenos Aires.

En prueba de conformidad, se firman dos ejemplares de un mismo tenor y a un solo efecto, en la Ciudad Autónoma de Buenos Aires, a los 15 días del mes de abril de 2025.`;

    const response = await axios.post(`${BASE_URL}/analizar`, {
      texto: contratoEjemplo
    });
    
    console.log('✅ Prueba exitosa');
    console.log('Respuesta del servidor:');
    console.log('Status:', response.status);
    console.log('Resultado recibido:', response.data.resultado ? 'Sí' : 'No');
    console.log('Longitud del resultado:', response.data.resultado ? response.data.resultado.length : 0);
    
    // Guardar resultado para revisión
    fs.writeFileSync(
      path.join(__dirname, 'test_results', 'analisis_contrato_texto.txt'), 
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

// Función para probar el análisis de contrato con archivo (simulado)
async function testAnalizarContratoArchivo() {
  console.log('\n=== Prueba: Analizar contrato con archivo (simulado) ===');
  
  try {
    // Crear un archivo de texto temporal para la prueba
    const testFilePath = path.join(__dirname, 'test_data', 'contrato_ejemplo.txt');
    const testContent = `CONTRATO DE PRESTACIÓN DE SERVICIOS PROFESIONALES

ENTRE: ABC Consulting S.A., CUIT 30-12345678-9, con domicilio en Av. Libertador 1234, CABA, representada por Roberto García, DNI 20.123.456, en su carácter de Presidente, en adelante "LA EMPRESA"

Y: Carlos Rodríguez, DNI 30.456.789, con domicilio en Av. Cabildo 5678, CABA, en adelante "EL PROFESIONAL"

CONVIENEN en celebrar el presente contrato de prestación de servicios profesionales sujeto a las siguientes cláusulas:

PRIMERA: EL PROFESIONAL prestará servicios de consultoría en sistemas informáticos a LA EMPRESA, incluyendo desarrollo de software, mantenimiento de sistemas y asesoramiento técnico.

SEGUNDA: El plazo del contrato se establece en 12 (doce) meses, comenzando el día 1 de mayo de 2025 y finalizando el día 30 de abril de 2026, renovable automáticamente por períodos iguales salvo notificación en contrario con 30 días de anticipación.

TERCERA: LA EMPRESA abonará a EL PROFESIONAL la suma de $500.000 (quinientos mil pesos) mensuales más IVA, contra presentación de factura.

CUARTA: EL PROFESIONAL deberá cumplir un mínimo de 160 horas mensuales de servicios, distribuidas según las necesidades de LA EMPRESA.

QUINTA: EL PROFESIONAL declara ser un trabajador independiente, responsable de sus propias obligaciones fiscales y previsionales.

SEXTA: LA EMPRESA proporcionará a EL PROFESIONAL los equipos y herramientas necesarios para la prestación de los servicios.

SÉPTIMA: EL PROFESIONAL se compromete a mantener confidencialidad sobre toda la información a la que tenga acceso durante la prestación de los servicios.

OCTAVA: Los derechos de propiedad intelectual sobre los desarrollos realizados por EL PROFESIONAL en el marco de este contrato pertenecerán exclusivamente a LA EMPRESA.

NOVENA: Cualquiera de las partes podrá rescindir el contrato en cualquier momento, notificando a la otra parte con 30 días de anticipación.

DÉCIMA: En caso de incumplimiento de cualquiera de las cláusulas del presente contrato, la parte cumplidora podrá resolverlo sin necesidad de interpelación judicial o extrajudicial.

DÉCIMO PRIMERA: Para todos los efectos legales derivados del presente contrato, las partes constituyen domicilio en los indicados al comienzo, sometiéndose a la jurisdicción de los Tribunales Ordinarios de la Ciudad Autónoma de Buenos Aires.

En prueba de conformidad, se firman dos ejemplares de un mismo tenor y a un solo efecto, en la Ciudad Autónoma de Buenos Aires, a los 15 días del mes de abril de 2025.`;
    
    // Asegurar que el directorio existe
    if (!fs.existsSync(path.join(__dirname, 'test_data'))) {
      fs.mkdirSync(path.join(__dirname, 'test_data'), { recursive: true });
    }
    
    fs.writeFileSync(testFilePath, testContent);
    
    // Crear FormData y adjuntar el archivo
    const formData = new FormData();
    formData.append('archivo', fs.createReadStream(testFilePath));
    
    const response = await axios.post(`${BASE_URL}/analizar`, formData, {
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
      path.join(__dirname, 'test_results', 'analisis_contrato_archivo.txt'), 
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
  console.log('Iniciando pruebas de funcionalidad de análisis de contratos...');
  
  // Crear directorio para resultados si no existe
  if (!fs.existsSync(path.join(__dirname, 'test_results'))) {
    fs.mkdirSync(path.join(__dirname, 'test_results'), { recursive: true });
  }
  
  // Ejecutar pruebas
  const results = {
    analizarTexto: await testAnalizarContratoTexto(),
    analizarArchivo: await testAnalizarContratoArchivo()
  };
  
  // Mostrar resumen
  console.log('\n=== Resumen de pruebas ===');
  console.log(`Analizar contrato con texto: ${results.analizarTexto ? '✅ Pasó' : '❌ Falló'}`);
  console.log(`Analizar contrato con archivo: ${results.analizarArchivo ? '✅ Pasó' : '❌ Falló'}`);
  
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
