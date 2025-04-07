// Funcionalidad principal de la aplicación
document.addEventListener('DOMContentLoaded', function() {
    // Referencias a elementos DOM
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Formularios
    const cartasForm = document.getElementById('cartas-form');
    const contratosForm = document.getElementById('contratos-form');
    
    // Elementos de método de entrada
    const cartaMetodoRadios = document.querySelectorAll('input[name="carta-metodo"]');
    const contratoMetodoRadios = document.querySelectorAll('input[name="contrato-metodo"]');
    
    // Contenedores de texto y archivo
    const cartaTextoContainer = document.getElementById('carta-texto-container');
    const cartaArchivoContainer = document.getElementById('carta-archivo-container');
    const contratoTextoContainer = document.getElementById('contrato-texto-container');
    const contratoArchivoContainer = document.getElementById('contrato-archivo-container');
    
    // Elementos de archivo
    const cartaArchivo = document.getElementById('carta-archivo');
    const contratoArchivo = document.getElementById('contrato-archivo');
    
    // Elementos de previsualización
    const cartaPreview = document.getElementById('carta-preview');
    const contratoPreview = document.getElementById('contrato-preview');
    
    // Elementos de resultado
    const cartaResultContainer = document.getElementById('carta-result-container');
    const contratoResultContainer = document.getElementById('contrato-result-container');
    const cartaResult = document.getElementById('carta-result');
    const contratoResult = document.getElementById('contrato-result');
    
    // Elementos de carga
    const cartaLoading = document.getElementById('carta-loading');
    const contratoLoading = document.getElementById('contrato-loading');
    
    // Botones de descarga
    const cartaDownloadTxt = document.getElementById('carta-download-txt');
    const cartaDownloadDocx = document.getElementById('carta-download-docx');
    const cartaDownloadPdf = document.getElementById('carta-download-pdf');
    const contratoDownloadTxt = document.getElementById('contrato-download-txt');
    const contratoDownloadDocx = document.getElementById('contrato-download-docx');
    const contratoDownloadPdf = document.getElementById('contrato-download-pdf');
    
    // Cambio de pestañas
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remover clase active de todos los botones y contenidos
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Agregar clase active al botón clickeado y su contenido correspondiente
            btn.classList.add('active');
            const tabId = btn.getAttribute('data-tab');
            document.getElementById(`${tabId}-content`).classList.add('active');
        });
    });
    
    // Cambio de método de entrada para cartas documento
    cartaMetodoRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.value === 'texto') {
                cartaTextoContainer.classList.remove('hidden');
                cartaArchivoContainer.classList.add('hidden');
            } else {
                cartaTextoContainer.classList.add('hidden');
                cartaArchivoContainer.classList.remove('hidden');
            }
        });
    });
    
    // Cambio de método de entrada para contratos
    contratoMetodoRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.value === 'texto') {
                contratoTextoContainer.classList.remove('hidden');
                contratoArchivoContainer.classList.add('hidden');
            } else {
                contratoTextoContainer.classList.add('hidden');
                contratoArchivoContainer.classList.remove('hidden');
            }
        });
    });
    
    // Previsualización de archivos para cartas documento
    cartaArchivo.addEventListener('change', function() {
        previewFile(this, cartaPreview);
    });
    
    // Previsualización de archivos para contratos
    contratoArchivo.addEventListener('change', function() {
        previewFile(this, contratoPreview);
    });
    
    // Función para previsualizar archivos
    function previewFile(input, previewElement) {
        previewElement.innerHTML = '';
        
        if (input.files && input.files[0]) {
            const file = input.files[0];
            const fileName = file.name;
            const fileType = file.type;
            
            // Crear elemento para mostrar información del archivo
            const fileInfo = document.createElement('p');
            fileInfo.textContent = `Archivo: ${fileName} (${formatFileSize(file.size)})`;
            previewElement.appendChild(fileInfo);
            
            // Previsualizar según el tipo de archivo
            if (fileType.startsWith('image/')) {
                const img = document.createElement('img');
                img.src = URL.createObjectURL(file);
                img.onload = function() {
                    URL.revokeObjectURL(this.src);
                };
                previewElement.appendChild(img);
            } else if (fileType === 'application/pdf') {
                const iframe = document.createElement('iframe');
                iframe.src = URL.createObjectURL(file);
                iframe.className = 'pdf-preview';
                previewElement.appendChild(iframe);
            } else {
                const icon = document.createElement('div');
                icon.innerHTML = `<svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" stroke="#3498db" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M14 2V8H20" stroke="#3498db" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M16 13H8" stroke="#3498db" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M16 17H8" stroke="#3498db" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M10 9H9H8" stroke="#3498db" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>`;
                previewElement.appendChild(icon);
            }
        }
    }
    
    // Formatear tamaño de archivo
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    // Envío del formulario de cartas documento
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
                formData.append('texto', texto);
            } else {
                const archivo = document.getElementById('carta-archivo').files[0];
                if (archivo) {
                    formData.append('archivo', archivo);
                } else {
                    throw new Error('Por favor seleccione un archivo');
                }
            }
            
            // Enviar solicitud al servidor
            const response = await fetch('/api/procesar', {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) {
                throw new Error('Error en el servidor: ' + response.statusText);
            }
            
            const data = await response.json();
            
            // Mostrar resultado
            cartaResult.value = data.resultado;
            
            // Habilitar botones de descarga
            enableDownloadButtons(cartaDownloadTxt, cartaDownloadDocx, cartaDownloadPdf, data.resultado, 'carta_documento');
            
        } catch (error) {
            console.error('Error:', error);
            cartaResult.value = 'Error: ' + error.message;
        } finally {
            // Ocultar spinner de carga y habilitar botón de envío
            cartaLoading.classList.add('hidden');
            submitBtn.disabled = false;
        }
    });
    
    // Envío del formulario de análisis de contratos
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
                formData.append('texto', texto);
            } else {
                const archivo = document.getElementById('contrato-archivo').files[0];
                if (archivo) {
                    formData.append('archivo', archivo);
                } else {
                    throw new Error('Por favor seleccione un archivo');
                }
            }
            
            // Enviar solicitud al servidor
            const response = await fetch('/api/analizar', {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) {
                throw new Error('Error en el servidor: ' + response.statusText);
            }
            
            const data = await response.json();
            
            // Mostrar resultado
            contratoResult.value = data.resultado;
            
            // Habilitar botones de descarga
            enableDownloadButtons(contratoDownloadTxt, contratoDownloadDocx, contratoDownloadPdf, data.resultado, 'analisis_contrato');
            
        } catch (error) {
            console.error('Error:', error);
            contratoResult.value = 'Error: ' + error.message;
        } finally {
            // Ocultar spinner de carga y habilitar botón de envío
            contratoLoading.classList.add('hidden');
            submitBtn.disabled = false;
        }
    });
    
    // Función para habilitar botones de descarga
    function enableDownloadButtons(txtBtn, docxBtn, pdfBtn, content, filePrefix) {
        // Descargar como TXT
        txtBtn.addEventListener('click', function() {
            downloadAsFile(content, filePrefix + '.txt', 'text/plain');
        });
        
        // Descargar como DOCX (requiere librería externa)
        docxBtn.addEventListener('click', function() {
            alert('Funcionalidad de descarga DOCX en desarrollo');
            // Aquí se implementará la descarga como DOCX usando una librería como docx.js
        });
        
        // Descargar como PDF (requiere librería externa)
        pdfBtn.addEventListener('click', function() {
            alert('Funcionalidad de descarga PDF en desarrollo');
            // Aquí se implementará la descarga como PDF usando una librería como jsPDF
        });
    }
    
    // Función para descargar contenido como archivo
    function downloadAsFile(content, fileName, contentType) {
        const a = document.createElement('a');
        const file = new Blob([content], {type: contentType});
        a.href = URL.createObjectURL(file);
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(a.href);
    }
});
