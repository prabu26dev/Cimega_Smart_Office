window.GuruModules = window.GuruModules || {};

window.GuruModules['kinerja_guru'] = {
  id: 'kinerja_guru',
  title: 'Pengembangan Keprofesian',
  icon: '🎖️',
  desc: 'Pusat integrasi administrasi e-Kinerja (PMM) dan pelaporan bukti dukung ASN.',
  items: [
    {
      id: 'admin_ekinerja',
      nama: 'Administrasi e-Kinerja (PMM)',
      icon: '🏛️',
      components: [
        { id: 'rhk', label: 'Rencana Hasil Kerja (RHK) Tahunan', type: 'textarea' },
        { id: 'bukti_dukung', label: 'Daftar Bukti Dukung (Sertifikat/Webinar/Aksi Nyata)', type: 'textarea' },
        { id: 'rubrik_observasi', label: 'Hasil Rubrik Observasi Kinerja dari Kepala Sekolah', type: 'textarea' }
      ],
      ai_prompt: "Anda adalah Verifikator Akuntabilitas Aparatur Sipil Negara. Tugas Anda menyusun Draf Laporan Evaluasi Kinerja Pegawai (e-Kinerja PMM) yang siap ditandatangani.\n\nStruktur Penulisan Dokumen Kinerja:\n1. KONTRAK RENCANA HASIL KERJA (RHK): Tuangkan sasaran SKP ini ke dalam poin target tahunan: {{rhk}}.\n2. ANALISIS BUKTI DUKUNG: Lakukan pengecekan dan jabaran deskriptif bagaimana portofolio (sertifikat, diklat) ini mendukung mutu pendidikan: {{bukti_dukung}}.\n3. REFLEKSI PENILAIAN OBSERVASI: Terjemahkan skor rubrik penilaian Kepala Sekolah ini menuju bahasa umpan balik yang membangun (constructive feedback): {{rubrik_observasi}}.\n\nHasilkan dokumen penilaian kinerja dalam format tabulasi naratif pemerintahan."
    }
  ]
};
