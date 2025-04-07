# Asistente Legal - Aplicación Web para Cartas Documento y Análisis de Contratos

Esta aplicación web proporciona dos funcionalidades principales para asistencia legal en Argentina:
1. **Asistente para Cartas Documento**: Permite redactar o contestar cartas documento utilizando la API de Gemini.
2. **Analizador de Contratos**: Permite analizar contratos utilizando la API de Gemini.

## Características Principales

- Interfaz de usuario intuitiva y responsiva
- Procesamiento de múltiples formatos de archivo (PDF, DOCX, TXT, JPG, PNG)
- Extracción de texto mediante OCR para imágenes y PDFs basados en imágenes
- Integración con la API de Gemini para procesamiento de lenguaje natural
- Descarga de resultados en múltiples formatos (TXT, DOCX, PDF)

## Tecnologías Utilizadas

- **Backend**: Node.js, Express.js
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla JS)
- **API**: Google Generative AI (Gemini API)
- **Procesamiento de Archivos**: pdf-parse, mammoth, tesseract.js
- **Despliegue**: GitHub y Vercel

## Requisitos Previos

- Node.js (v14 o superior)
- Clave API de Gemini

## Instalación

1. Clonar el repositorio:
   ```
   git clone https://github.com/su-usuario/asistente-legal-app.git
   cd asistente-legal-app
   ```

2. Instalar dependencias:
   ```
   npm install
   ```

3. Crear archivo `.env` en la raíz del proyecto con su clave API de Gemini:
   ```
   GEMINI_API_KEY=su-clave-api-aqui
   ```

4. Iniciar la aplicación:
   ```
   npm start
   ```

5. Acceder a la aplicación en su navegador:
   ```
   http://localhost:3000
   ```

## Estructura del Proyecto

```
asistente-legal-app/
├── public/                  # Archivos estáticos del frontend
│   ├── css/                 # Estilos CSS
│   ├── js/                  # Scripts JavaScript
│   └── img/                 # Imágenes
├── routes/                  # Rutas de la API
├── controllers/             # Controladores
├── utils/                   # Utilidades
│   ├── textExtractor.js     # Extracción de texto de archivos
│   └── geminiAPI.js         # Integración con API de Gemini
├── uploads/                 # Directorio para archivos subidos (creado automáticamente)
├── tests/                   # Pruebas
├── .env.example             # Ejemplo de variables de entorno
├── .gitignore               # Archivos ignorados por Git
├── package.json             # Dependencias y scripts
├── server.js                # Punto de entrada de la aplicación
└── README.md                # Documentación
```

## Funcionalidades

### Asistente para Cartas Documento

- **Redacción**: Genera cartas documento basadas en información proporcionada por el usuario.
- **Contestación**: Ayuda a responder a cartas documento recibidas.
- **Entrada de Datos**: Permite ingresar información mediante texto directo o subida de archivos.
- **Descarga**: Permite descargar el resultado en formato TXT, DOCX o PDF.

### Analizador de Contratos

- **Análisis Completo**: Identifica cláusulas importantes, riesgos y recomendaciones.
- **Entrada de Datos**: Permite ingresar el contrato mediante texto directo o subida de archivos.
- **Descarga**: Permite descargar el análisis en formato TXT, DOCX o PDF.

## Solución OCR

La aplicación implementa una solución robusta para la extracción de texto de diferentes tipos de archivo:

- **PDF con texto seleccionable**: Extracción directa mediante pdf-parse.
- **PDF basados en imágenes**: Procesamiento mediante OCR con Tesseract.js.
- **Imágenes (JPG, PNG)**: Procesamiento mediante OCR con Tesseract.js.
- **Documentos DOCX**: Extracción mediante mammoth.
- **Archivos TXT**: Lectura directa.

## Despliegue

La aplicación está configurada para ser desplegada fácilmente en Vercel:

1. Suba el código a un repositorio de GitHub.
2. Conecte el repositorio a Vercel.
3. Configure la variable de entorno `GEMINI_API_KEY` en Vercel.
4. ¡Listo! Su aplicación estará disponible en la URL proporcionada por Vercel.

## Contribuciones

Las contribuciones son bienvenidas. Por favor, abra un issue para discutir los cambios propuestos o envíe un pull request.

## Licencia

Este proyecto está licenciado bajo la Licencia MIT - vea el archivo LICENSE para más detalles.
