# Salud Mental Estudiantil 🧠🌱

¡Bienvenido(a) a **Salud Mental Estudiantil**! Una aplicación móvil diseñada con [React Native](https://reactnative.dev/) y [Expo](https://expo.dev/) orientada a ayudar a los estudiantes universitarios a monitorear sus estados de ánimo, autoevaluar su estrés académico y practicar técnicas rápidas de relajación en los momentos de más tensión.

![Salud Mental Estudiantil](./assets/icon.png)

## 📋 Características Principales

1. **🏥 Registro Emocional (Mood Tracker):**
   - Evalúa tu estado de ánimo diario desde "Muy Mal" hasta "Excelente".
   - Obtén micro-recomendaciones instantáneas en base a tu respuesta.
   - Posibilidad de añadir notas personales para desahogarte o agradecer.

2. **📊 Test de Estrés Académico:**
   - Cuestionario de 10 preguntas específicas sobre el desgaste universitario (insomnio por clases, irritabilidad, falta de tiempo, etc.).
   - Motor de calificación automático que oscila entre 0 y 40 puntos.
   - Entregables y diagnósticos con su nivel respectivo (Bajo, Moderado, o Alto Estrés).

3. **🧘 Espacio de Relajación:**
   - **Respiración 4-4-6:** Herramienta interactiva y animada para regular tus latidos mediante inhalar y exhalar.
   - **Técnica 5-4-3-2-1:** Ejercicio estructurado de aterrizaje sensorial para calmar episodios puntuales de ansiedad.
   - **Frases:** Tarjetas con motivaciones y mantras diarios para seguir adelante.

4. **📅 Historial Universal:**
   - Visualización cronológica unificada: revisa rápidamente en un solo tablero todos los días que te sentiste mal, bien, o los resultados de tus pasadas pruebas de estrés.

## 🛠️ Stack Tecnológico

- **Framework:** React Native + Expo (v54+)
- **Navegación:** React Navigation v7 (Bottom Tabs + Native Stack)
- **Estado Global:** Zustand
- **Almacenamiento Local (Offline):** AsyncStorage
- **Adicionales:** `expo-linear-gradient` para Glassmorphism y `@expo/vector-icons` para iconografía estándar.

---

## 🚀 Requisitos Previos e Instalación

Para ejecutar este proyecto en tu computadora, necesitarás lo siguiente:

1. **[Node.js](https://nodejs.org/)** (v18 o superior).
2. Un teléfono celular con la aplicación de **Expo Go** instalada (disponible gratuitamente en App Store y Google Play).

### Instalación de dependencias

1. Abre tu terminal y ubícate en la raíz del proyecto.
2. Instala todas las dependencias necesarias de Node.js mediante:
   ```bash
   npm install
   ```

---

## ▶️ Cómo ejecutar la aplicación

Dado a las últimas integraciones de red en Windows con Expo, la forma más limpia y óptima y de ejecutar el empaquetador en tu red de WiFi local es offline:

1. En tu terminal (estando dentro de la raíz del proyecto), escribe:
   ```bash
   npx expo start -c --offline
   ```
   *Nota: `-c` limpia siempre la caché de la aplicación, lo que evitará errores de desconfiguración de React, asegurándote correr la versión más actualizada (especialmente si acabas de cambiar el logo).*

2. **En tu celular:**
   - Si usas Android: Abre la aplicación "Expo Go" y presiona la opción "Scan QR Code". Enfoque el código que apareció en tu computadora.
   - Si usas iPhone (iOS): Abre tu aplicación de **Cámara normal**, escanea el código en la pantalla de la computadora, y selecciona arriba para que se abra automáticamente en Expo Go.

---

## 📦 Cómo empaquetar tu propia app (Instalador Android .APK)

Si ya no quieres usar "Expo Go" y deseas instalar y ejecutar tu programa en tu celular de forma definitiva (o enviarla a un amigo), puedes usar el sistema de servicios cloud gratuítos de Expo llamado **EAS (Expo Application Services)**.

1. Instala en tu computadora la interfaz global de EAS:
   ```bash
   npm install -g eas-cli
   ```
2. Ejecuta la compilación de un "preview" para tu aplicación local. Así le dices a Expo que te forme un APK:
   ```bash
   eas build -p android --profile preview
   ```
3. Se generará un enlace. Descarga tu archivo `.apk`, envíalo por WhatsApp, correo, o cópialo vía cable USB hacia tu Android, ¡y podrás instalarlo de manera nativa!

---

## 🗂️ Estructura del Código

- `/assets/`: Imágenes de logo de la App, favicon, y pantalla Splash.
- `/src/navigation/`: Controladores de rutas (`AppNavigator.js`).
- `/src/screens/`: Diseños puros. Cada pestaña principal de la aplicación reside aquí en un archivo `.js`.
- `/src/store/`: Manejador base `useStore.js` donde configuramos Zustand + persistencia en AsyncStorage.
- `/src/utils/`: Estilos reutilizables (tema principal de color global) y JSON de preguntas o lógicas misceláneas. 

¡Gracias por ayudar a dar prioridad a la salud mental de nuestra futura generación! 🌟
