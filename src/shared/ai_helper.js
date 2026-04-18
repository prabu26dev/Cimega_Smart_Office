// ── CIMEGA SMART OFFICE: AI HELPER ────────────────────────────────

window.CimegaAI = {
  // ★ ROLE CAPABILITIES MAPPING ★
  ROLE_CAPABILITIES: {
    'guru': {
      label: 'Guru Kelas',
      domains: [],
      prohibited: []
    },
    'guru_pai': {
      label: 'Guru PAI',
      domains: [],
      prohibited: []
    },
    'guru_pjok': {
      label: 'Guru PJOK',
      domains: [],
      prohibited: []
    },
    'kepsek': {
      label: 'Kepala Sekolah',
      domains: [],
      prohibited: []
    },
    'bendahara': {
      label: 'Bendahara',
      domains: [],
      prohibited: []
    },
    'ops': {
      label: 'Operator (OPS)',
      domains: [],
      prohibited: []
    },
    'tu': {
      label: 'Tata Usaha (TU)',
      domains: [],
      prohibited: []
    },
    'pustakawan': {
      label: 'Pustakawan',
      domains: [],
      prohibited: []
    },
    'gpk': {
      label: 'GPK (Inklusif)',
      domains: [],
      prohibited: []
    },
    'ekskul': {
      label: 'Pembina Ekskul',
      domains: [],
      prohibited: []
    },
    'koordinator': {
      label: 'Koordinator P5',
      domains: [],
      prohibited: []
    }
  },

  // ── 1. AI PROTOCOL & GUARDRAILS ──
  SYSTEM_GUARDRAIL: `### PROTOKOL KETAT CIMEGA AI v4.1 ###
1. IDENTITAS: Anda adalah Cimega AI, "The Compassionate Specialist" (Asisten Ahli Administrasi Sekolah & Pendamping Psikologis).
2. DOMAIN EKSKLUSIF: DILARANG KERAS membantu topik di luar Administrasi Sekolah Kurikulum Merdeka (Tolak: Resep, Coding Umum, Hiburan, dll).
3. FILTER KEAMANAN: Tolak dengan santun namun tegas segala topik terkait Bullying, Pornografi, SARA, atau Tindakan Kriminal sesuai etika sekolah.
4. SISI KEMANUSIAAN: Jika user menunjukkan tanda lelah atau stres, jadilah pendengar yang baik. Gunakan bahasa yang menenangkan sebelum kembali ke topik tugas.
5. PENOLAKAN: Gunakan kalimat: "Mohon maaf, fokus saya adalah tata kelola sekolah. Tugas ini di luar wewenang saya sebagai asisten administrasi Anda."`,

  // ── 2. CONTEXT EXTRACTION ──
  getUserContext: function() {
    try {
      const userData = JSON.parse(localStorage.getItem('cimega_user') || '{}');
      if (!userData || !userData.nama) return null;
      
      const rolesRaw = Array.isArray(userData.roles) ? userData.roles : (userData.role ? [userData.role] : []);
      const activeCaps = [];
      const forbiddenTopics = new Set();
      const roleLabels = [];

      rolesRaw.forEach(r => {
        // Normalisasi role (kecilkan, ganti spasi jadi underscore)
        const roleKey = String(r).toLowerCase().trim().replace(/[\s-]/g, '_');
        const cap = this.ROLE_CAPABILITIES[roleKey];
        if (cap) {
          activeCaps.push(...cap.domains);
          cap.prohibited.forEach(p => forbiddenTopics.add(p));
          roleLabels.push(cap.label);
        }
      });

      // Format Waktu Lokal
      const now = new Date();
      const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
      const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
      const timeStr = `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;

      return {
        nama: userData.nama,
        sekolah: userData.sekolah || 'SDN Cimega',
        roles: roleLabels.length > 0 ? roleLabels : ['Staf Sekolah'],
        capabilities: [...new Set(activeCaps)],
        prohibited: [...forbiddenTopics],
        currentTime: timeStr
      };
    } catch (e) { 
      console.error('CimegaAI: Context error', e);
      return null; 
    }
  },

  // ── 3. AI INTERACTION (Ask) ──
  ask: async function(options) {
    if (!options || !options.messages) return { error: 'Invalid parameters.' };
    
    const _api = window.cimegaConfig || window.cimegaAPI;
    if (!_api || !_api.geminiAsk) return { error: 'Integrasi AI (Bridge) tidak ditemukan.' };

    try {
      const ctx = this.getUserContext();
      let identityPrompt = "";
      
      if (ctx) {
        identityPrompt = `
### KONTEKS USER AKTIF ###
Waktu: ${ctx.currentTime}
User: ${ctx.nama} | Institusi: ${ctx.sekolah}
Jabatan: ${ctx.roles.join(' & ')}
DOMAIN WEWENANG: ${ctx.capabilities.length > 0 ? ctx.capabilities.join(', ') : 'Administrasi Umum'}
TOPIK TERLARANG: ${ctx.prohibited.length > 0 ? ctx.prohibited.join(', ') : 'Hal di luar pendidikan'}
---------------------------
INSTRUKSI KHUSUS: 
- SAPAAN: Tampilkan Hari/Tanggal dan sapa user sesuai perannya hanya di balon chat pertama.
- WEWENANG: Sebutkan bahwa Anda bisa membantu topik di daftar DOMAIN WEWENANG di atas.
- FILTER: Jika user bertanya tentang TOPIK TERLARANG, tolak sesuai protokol nomor 5.
`;
      }

      // Gabungkan sistem utama, identitas, dan tugas spesifik (jika ada)
      let mergedSystem = this.SYSTEM_GUARDRAIL + (identityPrompt ? "\n" + identityPrompt : "");
      if (options.system) {
        mergedSystem += "\n\n### TUGAS SPESIFIK SAAT INI ###\n" + options.system;
      }

      const res = await _api.geminiAsk({
        system: mergedSystem,
        messages: options.messages,
        maxTokens: parseInt(options.maxTokens) || 2000
      });

      if (res && res.success && res.text) {
        return { success: true, text: res.text.trim() };
      }
      return { error: (res && res.error) ? res.error : 'Respon AI kosong atau tidak valid.' };
    } catch (err) {
      console.error('CimegaAI: Ask error', err);
      return { error: 'Kesalahan Sistem AI: ' + err.message };
    }
  }
};

console.log('✅ Cimega AI Helper loaded.');

