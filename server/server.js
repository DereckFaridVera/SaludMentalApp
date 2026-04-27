require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Initialize Google Gen AI only if API key is provided
let ai;
if (GEMINI_API_KEY) {
  ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
}

const SYSTEM_INSTRUCTION = `Eres "Luz", una asistente de inteligencia artificial integrada en la aplicación "Salud Mental Estudiantil". 
Tu objetivo es proporcionar contención emocional, apoyo psicológico de primeros auxilios y consejos para el manejo del estrés académico a estudiantes universitarios.
Debes ser empática, cálida, validar sus emociones y ofrecer consejos cortos y prácticos. Nunca diagnostiques problemas médicos ni reemplaces a un profesional clínico de la salud mental; si el estudiante menciona intenciones de autolesión o problemas graves, recomiéndale buscar ayuda profesional inmediatamente. Mantén tus respuestas relativamente cortas para que sean fáciles de leer en un chat móvil.`;

app.post('/api/chat', async (req, res) => {
  try {
    const { history, message } = req.body;
    
    if (!ai) {
      return res.status(500).json({ error: "Falta configurar la API Key de Gemini en el backend." });
    }

    if (!message) {
      return res.status(400).json({ error: "El mensaje es requerido." });
    }

    // Convert client history to Gemini format if needed (simplified approach here uses stateless generateContent or chat sessions)
    // We'll create a new chat session to generate a response, prepending system instructions.
    
    // For @google/genai SDK v0.1.x, we can use systemInstruction with generateContent:
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: message,
        config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 0.7,
        }
    });

    res.json({ reply: response.text });
  } catch (error) {
    console.error("Error en /api/chat:", error);
    res.status(500).json({ error: "Lo siento, tuve un problema procesando tu mensaje. Intenta de nuevo más tarde." });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend de Salud Mental corriendo en http://localhost:${PORT}`);
  if (!GEMINI_API_KEY) {
    console.warn("⚠️ ADVERTENCIA: No se encontró GEMINI_API_KEY en el archivo .env. El chat devolverá error.");
  }
});
