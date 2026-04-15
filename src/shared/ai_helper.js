/**
 * CIMEGA SMART OFFICE - AI Helper
 * 
 * Centralized wrapper for window.cimegaAPI.geminiAsk
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
    // 1. Check if options is defined
    if (!options) return { error: 'Parameter options tidak boleh kosong.' };

    // 2. Check for API bridge existence (FIX v2.1: fallback ke cimegaConfig jika cimegaAPI tidak ada)
    const _api = window.cimegaConfig || window.cimegaAPI;
    if (!_api || !_api.geminiAsk) {
      return { error: 'Cimega AI Bridge (geminiAsk) tidak ditemukan. Pastikan aplikasi berjalan di Electron.' };
    }

    // 3. Validate messages
    if (!options.messages || !Array.isArray(options.messages) || options.messages.length === 0) {
      return { error: 'Parameter messages harus berupa array yang tidak kosong.' };
    }

    try {
      // 4. Merge system guardrails using absolute reference
      let mergedSystem = window.CimegaAI.SYSTEM_GUARDRAIL;
      if (options.system) {
        mergedSystem += '\n\nINSTRUKSI TAMBAHAN:\n' + options.system;
      }

      // 5. Build payload with sanitized types
      const payload = {
        system: mergedSystem,
        messages: options.messages,
        maxTokens: parseInt(options.maxTokens) || 2000
      };

      // 6. Call underlying API
      const res = await _api.geminiAsk(payload);

      // 7. Handle empty responses from bridge
      if (!res) return { error: 'AI Bridge tidak mengembalikan respon.' };
      
      // 8. Error handling from bridge
      if (res.error) return { error: res.error };

      // 9. Standardize output text
      if (res.success && res.text) {
        return { success: true, text: res.text.trim() };
      }

      return { error: 'AI mengembalikan respon kosong tanpa pesan kesalahan.' };
      
    } catch (err) {
      // 10. Global Exception Handling
      console.error('CimegaAI Critical Error:', err);
      return { error: 'Terjadi kesalahan sistem pada Cimega AI: ' + err.message };
    }
  }
};
