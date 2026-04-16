/**
 * CIMEGA SMART OFFICE - AI Helper
 * 
 * Centralized wrapper for window.cimegaAPI.geminiAsk
 * Ensures strict domain guardrails before sending requests to the main process.
 */

window.CimegaAI = {
  /**
   * Mengambil konteks user dari localStorage untuk Identity Injection
   */
  getUserContext: function() {
    try {
      const userData = JSON.parse(localStorage.getItem('cimega_user') || '{}');
      if (!userData || !userData.nama) return null;
      
      const roles = Array.isArray(userData.roles) ? userData.roles : (userData.role ? [userData.role] : []);
      const assignments = userData.teaching_assignments ? 
        `Unit: ${userData.teaching_assignments.classes?.join(', ') || '-'} / ${userData.teaching_assignments.phases?.join(', ') || '-'}` : 
        (userData.wali_kelas ? `Wali Kelas: ${userData.wali_kelas}` : '');

      return {
        nama: userData.nama,
        sekolah: userData.sekolah || 'SDN Cimega',
        roles: roles.map(r => r.toUpperCase()),
        assignments: assignments
      };
    } catch (e) {
      return null;
    }
  },

  /**
   * Cimega AI Guardrail - Fokus Kurikulum Merdeka 2025/2026
   */
  SYSTEM_GUARDRAIL: `### CIMEGA SMART OFFICE — PROTOKOL KEAMANAN AI ###
Versi: Kurikulum Merdeka 2025/2026 (Modern SD)

1. IDENTITAS: Anda adalah Cimega AI, Asisten Ahli khusus Administrasi Sekolah Kurikulum Merdeka.
2. LIMITASI DOMAIN: Hanya layani Pendidikan SD, Modul Ajar, ATP, CP, BOSP, Dapodik, dan Manajemen Sekolah.
3. KURIKULUM: Hapus referensi RPP/Kurtilas. Gunakan CP, TP, ATP, dan Modul Ajar.
4. KEAMANAN ROLE (SANGAT PENTING): 
   - Anda harus memeriksa Identitas User yang dikirimkan.
   - Jika user meminta tugas/dokumen dari Role yang tidak dia miliki, TOLAK DENGAN TEGAS.
   - Contoh: User Guru dilarang mengurus Keuangan BOS (Role Bendahara) atau Supervisi (Role Kepsek).
   - Penolakan: "Mohon maaf, sebagai Cimega AI, saya mendeteksi tugas ini di luar wewenang Role [Role User] Anda."
5. GUARD TOPIC: Tolak resep, coding umum, hiburan, atau hal di luar tata kelola sekolah.`,

  /**
   * Wrapper for sending prompts to the AI API.
   */
  ask: async function(options) {
    if (!options) return { error: 'Parameter options tidak boleh kosong.' };

    const _api = window.cimegaConfig || window.cimegaAPI;
    if (!_api || !_api.geminiAsk) {
      return { error: 'Cimega AI Bridge tidak ditemukan.' };
    }

    if (!options.messages || !Array.isArray(options.messages) || options.messages.length === 0) {
      return { error: 'Parameter messages tidak valid.' };
    }

    try {
      // 1. Identity Injection
      const context = window.CimegaAI.getUserContext();
      let identityPrompt = "";
      
      if (context) {
        identityPrompt = `
### IDENTITAS USER AKTIF ###
Nama: ${context.nama}
Sekolah: ${context.sekolah}
Role Resmi: ${context.roles.join(', ')}
Penugasan: ${context.assignments}
---------------------------
INSTRUKSI: Layani user HANYA untuk tugas yang sesuai dengan daftar Role Resmi di atas.
`;
      }

      // 2. Build Merged System Prompt
      let mergedSystem = window.CimegaAI.SYSTEM_GUARDRAIL + (identityPrompt ? "\n" + identityPrompt : "");
      
      if (options.system) {
        mergedSystem += '\n\nKONTEKS TUGAS SPESIFIK:\n' + options.system;
      }

      // 3. Build Payload
      const payload = {
        system: mergedSystem,
        messages: options.messages,
        maxTokens: parseInt(options.maxTokens) || 2000
      };

      const res = await _api.geminiAsk(payload);
      if (!res) return { error: 'AI Bridge tidak merespon.' };
      if (res.error) return { error: res.error };
      if (res.success && res.text) {
        return { success: true, text: res.text.trim() };
      }

      return { error: 'AI mengembalikan respon kosong.' };
      
    } catch (err) {
      console.error('CimegaAI Error:', err);
      return { error: 'Terjadi kesalahan sistem Cimega AI: ' + err.message };
    }
  }
};

