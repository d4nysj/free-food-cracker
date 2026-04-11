# 🧾 Receipt Scanner & Store Classifier (OCR + QR)

## 📖 Descripción General
Este proyecto es una herramienta de automatización backend construida en **Node.js**. Su función principal es procesar imágenes de tickets de compra (recibos), extraer todo su texto mediante Reconocimiento Óptico de Caracteres (**OCR**), decodificar códigos QR incrustados en la imagen y **clasificar automáticamente** a qué franquicia pertenece el ticket.

Actualmente, el algoritmo de clasificación está entrenado para detectar tickets de cadenas de comida rápida específicas basadas en patrones de texto y expresiones regulares. Además, el flujo está preparado para ser orquestado a través de un **Bot de Telegram**.

## 🛠️ Stack Tecnológico y Dependencias
El núcleo del proyecto se apoya en las siguientes librerías:

* **[node-tesseract-ocr]**: Wrapper para el motor Tesseract OCR (configurado para el idioma español `spa`).
* **[Jimp]**: Herramienta de procesamiento de imágenes para generar el mapa de bits (bitmap) necesario para el escáner QR.
* **[qrcode-reader]**: Motor de decodificación de códigos QR estáticos.

---

## ⚙️ Arquitectura Lógica

El sistema se divide en tres componentes clave dentro del módulo principal:

### 1. Extracción Integral (`recognizeStore`)
Es el orquestador principal. Recibe la ruta de una imagen y ejecuta dos procesos en paralelo:
* Extrae el texto usando Tesseract y lo limpia dividiéndolo en un array de líneas legibles.
* Llama al procesador de QR.
* **Retorna:** Un objeto JSON estructurado con la tienda detectada, el array de líneas de texto, el texto bruto y los datos descifrados del QR.

### 2. Clasificación Automatizada (`detectStore`)
Analiza las líneas extraídas por el OCR buscando patrones específicos para identificar la procedencia del ticket:
* **`BK` (Burger King):** Detectado si la primera línea contiene "su pedido".
* **`MC` (McDonald's):** Detectado mediante la coincidencia de cadenas similares a "donal".
* **`TB` (Taco Bell):** Detectado mediante la coincidencia de cadenas similares a "tacobell".

### 3. Escáner de QR (`getQRParser`)
Envuelve la librería `jimp` en una Promesa para leer la imagen de forma asíncrona, generar el mapa de bits puro y pasárselo a `qrcode-reader` para extraer cualquier URL o código oculto en el ticket.

---

## 🚀 Uso e Implementación

### Requisitos Previos
Para que el motor OCR funcione correctamente en tu máquina o servidor, necesitas tener los binarios de **Tesseract OCR** instalados a nivel de sistema operativo y descargar el paquete de idioma español (`spa`).

* **Ubuntu/Debian:** `sudo apt install tesseract-ocr tesseract-ocr-spa`
* **macOS:** `brew install tesseract tesseract-lang`

### Instalación del Proyecto
1. Clona el repositorio.
2. Instala las dependencias de Node:
   ```bash
   npm install node-tesseract-ocr jimp qrcode-reader
