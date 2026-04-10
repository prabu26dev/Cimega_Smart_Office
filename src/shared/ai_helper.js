/**
 * CIMEGA SMART OFFICE - AI Helper
 * 
 * Centralized wrapper for window.cimegaAPI.geminiAsk or claudeAsk
 * Ensures strict domain guardrails before sending requests to the main process.
 */

window.CimegaAI = {
  /**
   * Cimega AI Guardrail
   * Exact system instruction as per architectural requirement.
   */
  SYSTEM_GUARDRAIL: "Anda adalah Cimega AI, Asisten Ahli Administrasi SD Kurikulum Merdeka. Anda HANYA boleh menjawab terkait pendidikan, Dapodik, BOSP, Modul Ajar, dan laporan sekolah. JIKA ditanya di luar topik sekolah (resep, coding, hiburan, dll), TOLAK DENGAN TEGAS: 'Maaf, saya hanya diprogram untuk tata kelola pendidikan Cimega Smart Office'.",

  /**
   * Wrapper for sending prompts to the AI API.
   * 
   * @param {Object} options 
   * @param {string} [options.system] - Optional extra system prompt.
   * @param {Array} options.messages - Array of chat messages e.g. [{ role: 'user', content: '...' }]
   * @param {number} [options.maxTokens=2000] - Max output tokens
   * @returns {Promise<Object>} The AI response { text, error }
   */
  ask: async function(options) {
    if (!window.cimegaAPI || (!window.cimegaAPI.claudeAsk && !window.cimegaAPI.geminiAsk)) {
      return { error: 'cimegaAPI AI Bridge belum tersedia di preload.js.' };
    }

    try {
      // Merge system guardrails
      let mergedSystem = this.SYSTEM_GUARDRAIL;
      if (options.system) {
        mergedSystem += '\n\nINSTRUKSI TAMBAHAN:\n' + options.system;
      }

      // Payload building
      const payload = {
        system: mergedSystem,
        messages: options.messages,
        maxTokens: options.maxTokens || 2000
      };

      // Call underlying API (Gemini/Claude)
      const askFn = window.cimegaAPI.geminiAsk || window.cimegaAPI.claudeAsk;
      
      const res = await askFn(payload);
      return res;
    } catch (err) {
      console.error('CimegaAI Error:', err);
      return { error: err.message };
    }
  }
};
