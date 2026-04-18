/**
 * =============================================================
 * CIMEGA SMART OFFICE — Dynamic AI Generator Service
 * FILE    : ai_generator_service.js
 * ENGINE  : Gemini 2.5 Flash + Firestore Templates
 * DESKRIPSI: Backend SSE dengan prompt dinamis dari Database
 * =============================================================
 */

const express = require('express');
const cors    = require('cors');
const admin   = require('firebase-admin');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app  = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// ── 1. HELPER: PARSE DYNAMIC PROMPT ─────────────────────────

function parsePrompt(template, params) {
  let prompt = template;
  Object.keys(params).forEach(key => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    prompt = prompt.replace(regex, params[key]);
  });
  return prompt;
}

// ── 2. ENDPOINT SSE (GENERATE DOCUMENT) ─────────────────────────

app.get('/api/generate-docs', async (req, res) => {
  // SSE Headers
  res.setHeader('Content-Type',  'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection',    'keep-alive');

  const sendEvent = (data) => res.write(`data: ${JSON.stringify(data)}\n\n`);

  try {
    const { role, adminType, ...params } = req.query;
    
    // Step 0-10%: Inisialisasi & Fetch Template
    sendEvent({ progress: 5, status: 'Mengambil template dari database...', isDone: false });

    // GUARD v2.1: Pastikan Firebase Admin sudah siap sebelum akses Firestore
    if (!admin.apps || admin.apps.length === 0) {
      throw new Error('Firebase Admin belum diinisialisasi. Periksa serviceAccountKey.json dan koneksi jaringan.');
    }

    // Ambil data dari Firestore admin_templates
    const db = admin.firestore();
    const templateDoc = await db.collection('admin_templates')
      .doc(`${role}_${adminType}`).get();

    if (!templateDoc.exists) {
      throw new Error(`Template untuk ${role} - ${adminType} tidak ditemukan di database.`);
    }

    const templateData = templateDoc.data();
    const dynamicPrompt = parsePrompt(templateData.ai_prompt, params);

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error('GEMINI_API_KEY belum diisi di file .env');

    const genAI  = new GoogleGenerativeAI(apiKey);
    const model  = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const systemInstruction = `
      Kamu adalah CIMEGA SMART GENERATOR. 
      TUGAS: ${dynamicPrompt}
      ATURAN:
      1. Jawab HANYA dalam format JSON valid.
      2. JANGAN sertakan markdown code block (\`\`\`json).
      3. Gunakan bahasa formal dan profesional.
      4. Ikuti struktur komponen yang diminta: ${JSON.stringify(templateData.components)}
    `;

    sendEvent({ progress: 15, status: 'Menghubungkan ke Gemini AI...', isDone: false });

    // Stream dari Gemini
    const result = await model.generateContentStream(systemInstruction);
    
    let fullText = '';
    let progress = 20;

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      fullText += chunkText;
      
      if (progress < 90) progress += 2;
      sendEvent({ progress, status: 'AI sedang merakit konten dinamis...', isDone: false });
    }

    // Step 91-100%: Validasi & Selesai
    sendEvent({ progress: 95, status: 'Memvalidasi hasil...', isDone: false });
    
    try {
      const cleanJson = fullText.replace(/```json|```/gi, '').trim();
      const finalData = JSON.parse(cleanJson);
      
      sendEvent({ progress: 100, status: 'Selesai!', isDone: true, payload: finalData });
    } catch (parseError) {
      console.error('JSON Parse Fail:', fullText);
      throw new Error('Gagal memproses format data AI. Pastikan instruksi template benar.');
    }

  } catch (error) {
    console.error('AI Gen Error:', error.message);
    sendEvent({ progress: 0, status: 'ERROR', error: error.message, isDone: true });
  } finally {
    res.end();
  }
});

// Start Server (Hanya jika belum jalan)
if (!global.aiServerStarted) {
  app.listen(PORT, () => {
    // console.log(`[AI] Service ready on port ${PORT}`);
    global.aiServerStarted = true;
  });
}
