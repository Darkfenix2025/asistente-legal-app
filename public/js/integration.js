// Configuración para la integración frontend-backend
document.addEventListener('DOMContentLoaded', function() {
    // Formularios
    const cartasForm = document.getElementById('cartas-form');
    const contratosForm = document.getElementById('contratos-form');
    
    // Elementos de resultado
    const cartaResultContainer = document.getElementById('carta-result-container');
    const contratoResultContainer = document.getElementById('contrato-result-container');
    const cartaResult = document.getElementById('carta-result');
    const contratoResult = document.getElementById('contrato-result');
    
    // Elementos de carga
    const cartaLoading = document.getElementById('carta-loading');
    const contratoLoading = document.getElementById('contrato-loading');
    
    // Envío del formulario de cartas documento
    if (cartasForm) {
        cartasForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Mostrar contenedor de resultado y spinner de carga
            cartaResultContainer.classList.remove('hidden');
            cartaLoading.classList.remove('hidden');
            cartaResult.value = '';
            
            // Deshabilitar botón de envío
            const submitBtn = document.getElementById('carta-submit');
            submitBtn.disabled = true;
            
            try {
                const formData = new FormData();
                const tipoOperacion = document.getElementById('carta-tipo').value;
                formData.append('tipo', tipoOperacion);
                
                const metodoEntrada = document.querySelector('input[name="carta-metodo"]:checked').value;
                
                if (metodoEntrada === 'texto') {
                    const texto = document.getElementById('carta-texto').value;
                    if (!texto.trim()) {
                        throw new Error('Por favor ingrese el texto de la carta documento');
                    }
                    formData.append('texto', texto);
                } else {
                    const archivo = document.getElementById('carta-archivo').files[0];
                    if (!archivo) {
                        throw new Error('Por favor seleccione un archivo');
                    }
                    formData.append('archivo', archivo);
                }
                
                // Enviar solicitud al servidor
                const response = await fetch('/api/procesar', {
                    method: 'POST',
                    body: formData
                });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Error en el servidor: ' + response.statusText);
                }
                
                const data = await response.json();
                
                // Mostrar resultado
                if (data.success && data.resultado) {
                    cartaResult.value = data.resultado;
                } else {
                    throw new Error('No se recibió un resultado válido del servidor');
                }
                
            } catch (error) {
                console.error('Error:', error);
                cartaResult.value = 'Error: ' + error.message;
            } finally {
                // Ocultar spinner de carga y habilitar botón de envío
                cartaLoading.classList.add('hidden');
                submitBtn.disabled = false;
            }
        });
    }
    
    // Envío del formulario de análisis de contratos
    if (contratosForm) {
        contratosForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Mostrar contenedor de resultado y spinner de carga
            contratoResultContainer.classList.remove('hidden');
            contratoLoading.classList.remove('hidden');
            contratoResult.value = '';
            
            // Deshabilitar botón de envío
            const submitBtn = document.getElementById('contrato-submit');
            submitBtn.disabled = true;
            
            try {
                const formData = new FormData();
                
                const metodoEntrada = document.querySelector('input[name="contrato-metodo"]:checked').value;
                
                if (metodoEntrada === 'texto') {
                    const texto = document.getElementById('contrato-texto').value;
                    if (!texto.trim()) {
                        throw new Error('Por favor ingrese el texto del contrato');
                    }
                    formData.append('texto', texto);
                } else {
                    const archivo = document.getElementById('contrato-archivo').files[0];
                    if (!archivo) {
                        throw new Error('Por favor seleccione un archivo');
                    }
                    formData.append('archivo', archivo);
                }
                
                // Enviar solicitud al servidor
                const response = await fetch('/api/analizar', {
                    method: 'POST',
                    body: formData
                });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Error en el servidor: ' + response.statusText);
                }
                
                const data = await response.json();
                
                // Mostrar resultado
                if (data.success && data.resultado) {
                    contratoResult.value = data.resultado;
                } else {
                    throw new Error('No se recibió un resultado válido del servidor');
                }
                
            } catch (error) {
                console.error('Error:', error);
                contratoResult.value = 'Error: ' + error.message;
            } finally {
                // Ocultar spinner de carga y habilitar botón de envío
                contratoLoading.classList.add('hidden');
                submitBtn.disabled = false;
            }
        });
    }
});
