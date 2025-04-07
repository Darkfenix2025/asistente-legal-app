// Rutas para el procesamiento de cartas documento
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { extractTextFromFile } = require('../utils/textExtractor');
const { procesarCartaDocumento } = require('../utils/geminiAPI');

// Configuración de multer para la carga de archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'carta-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Límite de 10MB
  fileFilter: function (req, file, cb) {
    // Verificar tipos de archivo permitidos
    const filetypes = /pdf|doc|docx|txt|jpg|jpeg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Error: Solo se permiten archivos PDF, DOCX, TXT, JPG y PNG'));
  }
});

/**
 * Ruta para procesar cartas documento
 * Acepta texto directo o un archivo para extraer el texto
 */
router.post('/procesar', upload.single('archivo'), async (req, res) => {
  try {
    let texto;
    const tipo = req.body.tipo || 'redactar'; // Valor por defecto: redactar
    
    // Determinar la fuente del texto (directo o archivo)
    if (req.file) {
      // Extraer texto del archivo
      console.log(`Procesando archivo: ${req.file.path}`);
      texto = await extractTextFromFile(req.file.path);
    } else if (req.body.texto) {
      // Usar texto proporcionado directamente
      texto = req.body.texto;
    } else {
      return res.status(400).json({
        success: false,
        message: 'Se requiere texto o archivo para procesar'
      });
    }
    
    // Procesar la carta documento con la API de Gemini
    console.log(`Procesando carta documento (${tipo})`);
    const resultado = await procesarCartaDocumento(texto, tipo);
    
    // Devolver el resultado
    res.json({
      success: true,
      resultado
    });
    
  } catch (error) {
    console.error('Error en la ruta /procesar:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error al procesar la carta documento'
    });
  }
});

module.exports = router;
