window.GuruPjokModules = window.GuruPjokModules || {};

window.GuruPjokModules['kinerja_pjok'] = {
  id: 'kinerja_pjok',
  title: 'Pengembangan Keprofesian PJOK',
  icon: '🎖️',
  desc: 'Pangkalan e-Kinerja PMM terkait literasi kesehatan jasmani guru dan integrasi KKG Lapangan.',
  items: [
    {
      id: 'ekinerja_pjok',
      nama: 'Dokumen e-Kinerja Guru PJOK',
      icon: '🏛️',
      components: [
        { id: 'rhk_kesehatan', label: 'RHK Literasi Kesehatan Motorik (Tuntutan PMM)', type: 'textarea' },
        { id: 'bukti_sertifikat', label: 'Lampiran Sertifikat (KKG, Diklat Wasit / P3K)', type: 'textarea' },
        { id: 'observasi_lapangan', label: 'Log Umpan Balik Observasi Praktik Lapangan dari Kepsek', type: 'textarea' }
      ],
      ai_prompt: "Sebagai Pejabat Verifikasi PMM Pusat Kemdikbud, selesaikan format Laporan Akhir Portofolio e-Kinerja spesifik Guru Penjasorkes (PJOK) ini secara komprehensif.\n\nTenggat Laporan:\n1. KONSISTENSI SASARAN: Tinjau RHK (Rencana Hasil Kerja) ini: {{rhk_kesehatan}} dan jelaskan argumentasinya bahwa target tersebut linear dengan kebersihan dan kesehatan anak.\n2. PEMBOBOTAN LOG FILE: Kategorikan sertifikasi peningkatan diri (Pelatihan wasit, lisensi P3K, atau temu KKG) ini ke dalam alinea pendukung kapasitas ASN unggul: {{bukti_sertifikat}}.\n3. REFLEKSI TANTANGAN: Rangkaikan rekomendasi pembinaan Kepala Sekolah berikut menjadi komitmen perbaikan diri konkret (Growth Mindset) untuk tahun depan: {{observasi_lapangan}}."
    }
  ]
};
