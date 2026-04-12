/**
 * =============================================================
 * CIMEGA SMART OFFICE — AI Generator UI Handler
 * FILE    : ai_generator_ui.js
 * DESKRIPSI: Logic sisi client untuk handle SSE stream dari AI
 * =============================================================
 */

window.CimegaAIGenerator = {
  /**
   * Memicu proses generation
   * @param {Object} options - { role, adminType, params, onProgress, onSuccess, onError }
   */
  generate: function({ role, adminType, params, onProgress, onSuccess, onError }) {
    // 1. Matikan jika ada koneksi EventSource lama
    if (this._eventSource) {
      this._eventSource.close();
    }

    // 2. Bangun Query String
    const queryParams = new URLSearchParams({
      role,
      adminType,
      ...params
    }).toString();

    const url = `http://localhost:3001/api/generate-admin?${queryParams}`;

    // 3. Inisialisasi EventSource
    this._eventSource = new EventSource(url);

    // 4. Listener
    this._eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        // -- PROGRESS UPDATE --
        if (onProgress) {
          onProgress(data.progress, data.status);
        }

        // -- ERROR HANDLING --
        if (data.error) {
          this._eventSource.close();
          if (onError) onError(data.error);
        }

        // -- SUCCESS HANDLING --
        if (data.isDone && data.payload) {
          this._eventSource.close();
          if (onSuccess) onSuccess(data.payload);
        }

      } catch (err) {
        console.error('SSE Parse Error:', err);
        this._eventSource.close();
        if (onError) onError('Gagal memproses sinyal dari server AI.');
      }
    };

    this._eventSource.onerror = (err) => {
      console.error('EventSource Error:', err);
      this._eventSource.close();
      if (onError) onError('Koneksi ke server AI terputus. Pastikan AI Service berjalan.');
    };
  },

  /**
   * Menghentikan regenerasi secara paksa
   */
  cancel: function() {
    if (this._eventSource) {
      this._eventSource.close();
      console.log('AI Generation cancelled by user.');
    }
  }
};
