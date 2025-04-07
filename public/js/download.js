// Funcionalidad mejorada para descargar resultados en diferentes formatos
document.addEventListener('DOMContentLoaded', function() {
    // Importar las bibliotecas necesarias para generar documentos
    // Estas bibliotecas se cargarán dinámicamente cuando sean necesarias
    function loadScript(url) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = url;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    // Botones de descarga para cartas documento
    const cartaDownloadTxt = document.getElementById('carta-download-txt');
    const cartaDownloadDocx = document.getElementById('carta-download-docx');
    const cartaDownloadPdf = document.getElementById('carta-download-pdf');
    
    // Botones de descarga para análisis de contratos
    const contratoDownloadTxt = document.getElementById('contrato-download-txt');
    const contratoDownloadDocx = document.getElementById('contrato-download-docx');
    const contratoDownloadPdf = document.getElementById('contrato-download-pdf');
    
    // Elementos de resultado
    const cartaResult = document.getElementById('carta-result');
    const contratoResult = document.getElementById('contrato-result');
    
    // Configurar eventos para botones de descarga de cartas documento
    if (cartaDownloadTxt) {
        cartaDownloadTxt.addEventListener('click', function() {
            downloadAsTextFile(cartaResult.value, 'carta_documento.txt');
        });
    }
    
    if (cartaDownloadDocx) {
        cartaDownloadDocx.addEventListener('click', async function() {
            try {
                // Mostrar indicador de carga
                this.textContent = 'Generando DOCX...';
                this.disabled = true;
                
                // Cargar la biblioteca docx.js si no está cargada
                if (typeof docx === 'undefined') {
                    await loadScript('https://unpkg.com/docx@8.0.0/build/index.js');
                }
                
                await downloadAsDocx(cartaResult.value, 'carta_documento.docx');
                
                // Restaurar el botón
                this.textContent = 'Descargar como DOCX';
                this.disabled = false;
            } catch (error) {
                console.error('Error al generar DOCX:', error);
                alert('Error al generar el documento DOCX. Por favor, intente nuevamente.');
                this.textContent = 'Descargar como DOCX';
                this.disabled = false;
            }
        });
    }
    
    if (cartaDownloadPdf) {
        cartaDownloadPdf.addEventListener('click', async function() {
            try {
                // Mostrar indicador de carga
                this.textContent = 'Generando PDF...';
                this.disabled = true;
                
                // Cargar la biblioteca jsPDF si no está cargada
                if (typeof jspdf === 'undefined') {
                    await loadScript('https://unpkg.com/jspdf@2.5.1/dist/jspdf.umd.min.js');
                }
                
                await downloadAsPdf(cartaResult.value, 'carta_documento.pdf');
                
                // Restaurar el botón
                this.textContent = 'Descargar como PDF';
                this.disabled = false;
            } catch (error) {
                console.error('Error al generar PDF:', error);
                alert('Error al generar el documento PDF. Por favor, intente nuevamente.');
                this.textContent = 'Descargar como PDF';
                this.disabled = false;
            }
        });
    }
    
    // Configurar eventos para botones de descarga de análisis de contratos
    if (contratoDownloadTxt) {
        contratoDownloadTxt.addEventListener('click', function() {
            downloadAsTextFile(contratoResult.value, 'analisis_contrato.txt');
        });
    }
    
    if (contratoDownloadDocx) {
        contratoDownloadDocx.addEventListener('click', async function() {
            try {
                // Mostrar indicador de carga
                this.textContent = 'Generando DOCX...';
                this.disabled = true;
                
                // Cargar la biblioteca docx.js si no está cargada
                if (typeof docx === 'undefined') {
                    await loadScript('https://unpkg.com/docx@8.0.0/build/index.js');
                }
                
                await downloadAsDocx(contratoResult.value, 'analisis_contrato.docx');
                
                // Restaurar el botón
                this.textContent = 'Descargar como DOCX';
                this.disabled = false;
            } catch (error) {
                console.error('Error al generar DOCX:', error);
                alert('Error al generar el documento DOCX. Por favor, intente nuevamente.');
                this.textContent = 'Descargar como DOCX';
                this.disabled = false;
            }
        });
    }
    
    if (contratoDownloadPdf) {
        contratoDownloadPdf.addEventListener('click', async function() {
            try {
                // Mostrar indicador de carga
                this.textContent = 'Generando PDF...';
                this.disabled = true;
                
                // Cargar la biblioteca jsPDF si no está cargada
                if (typeof jspdf === 'undefined') {
                    await loadScript('https://unpkg.com/jspdf@2.5.1/dist/jspdf.umd.min.js');
                }
                
                await downloadAsPdf(contratoResult.value, 'analisis_contrato.pdf');
                
                // Restaurar el botón
                this.textContent = 'Descargar como PDF';
                this.disabled = false;
            } catch (error) {
                console.error('Error al generar PDF:', error);
                alert('Error al generar el documento PDF. Por favor, intente nuevamente.');
                this.textContent = 'Descargar como PDF';
                this.disabled = false;
            }
        });
    }
    
    // Función para descargar como archivo de texto
    function downloadAsTextFile(content, fileName) {
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    // Función para descargar como DOCX
    async function downloadAsDocx(content, fileName) {
        // Crear un nuevo documento
        const doc = new docx.Document({
            sections: [{
                properties: {},
                children: [
                    new docx.Paragraph({
                        children: [
                            new docx.TextRun({
                                text: content,
                                size: 24, // 12pt
                            }),
                        ],
                    }),
                ],
            }],
        });
        
        // Generar el archivo DOCX
        const blob = await docx.Packer.toBlob(doc);
        const url = URL.createObjectURL(blob);
        
        // Descargar el archivo
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    // Función para descargar como PDF
    async function downloadAsPdf(content, fileName) {
        // Crear un nuevo documento PDF
        const { jsPDF } = jspdf;
        const doc = new jsPDF();
        
        // Configurar el documento
        doc.setFont('helvetica');
        doc.setFontSize(12);
        
        // Dividir el contenido en líneas para ajustarlo a la página
        const pageWidth = doc.internal.pageSize.getWidth() - 20; // Margen de 10mm a cada lado
        const lines = doc.splitTextToSize(content, pageWidth);
        
        // Agregar el contenido al documento
        let y = 10; // Posición inicial en Y (10mm desde el borde superior)
        const lineHeight = 7; // Altura de línea en mm
        
        for (let i = 0; i < lines.length; i++) {
            // Si la línea actual excede el límite de la página, crear una nueva página
            if (y > doc.internal.pageSize.getHeight() - 10) {
                doc.addPage();
                y = 10;
            }
            
            doc.text(lines[i], 10, y);
            y += lineHeight;
        }
        
        // Descargar el archivo PDF
        doc.save(fileName);
    }
});
