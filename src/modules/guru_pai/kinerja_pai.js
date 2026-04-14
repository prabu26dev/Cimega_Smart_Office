window.GuruPaiModules = window.GuruPaiModules || {};

window.GuruPaiModules['kinerja_pai'] = {
  id: 'kinerja_pai',
  title: 'Pengembangan Keprofesian PAI',
  icon: '🎖️',
  desc: 'Pusat e-Kinerja PMM khusus peningkatan spesialisasi pengembangan Agama Islam.',
  items: [
    {
      id: 'ekinerja_pai',
      nama: 'Dokumen e-Kinerja PAI Terpadu',
      icon: '🏛️',
      components: [
        { id: 'rhk_pai', label: 'RHK Peningkatan Kualitas Pembelajaran (Spesifik Agama)', type: 'textarea' },
        { id: 'bukti_dukung_pai', label: 'Bukti Dukung (Sertifikat KKG PAI/Bimtek Qiroati)', type: 'textarea' },
        { id: 'observasi_kepsek', label: 'Catatan Khusus Hasil Observasi Kelas dari Kepsek', type: 'textarea' }
      ],
      ai_prompt: "Sebagai Pejabat Analis Kepegawaian, tolong Formulasikan Draf Pelaporan e-Kinerja Tahunan (Sistem PMM Kemdikbud) Khusus Jabatan Fungsional Guru Pendidikan Agama Islam.\n\nData Dasar Penilaian:\n1. INDIKATOR RENCANA HASIL KERJA (RHK): Analisis sejauh mana RHK bertema Religiusitas ini tercapai: {{rhk_pai}}.\n2. VALIDASI BUKTI PROFESIONAL: Uraikan korelasi antara bukti dukung spesifik PAI berikut terhadap mutu pengajaran kelas: {{bukti_dukung_pai}}.\n3. FOLLOW-UP OBSERVASI PIMPINAN: Rumuskan rencana perbaikan diri (Action Plan) berdasarkan koreksi manajerial Kepala Sekolah berikut: {{observasi_kepsek}}.\n\nGunakan gaya penyajian objektif ala Berita Acara Pemeriksaan Kepegawaian pemerintah daerah."
    }
  ]
};
