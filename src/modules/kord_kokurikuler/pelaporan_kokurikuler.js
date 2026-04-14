window.KordKokuModules = window.KordKokuModules || {};

window.KordKokuModules['pelaporan_kokurikuler'] = {
  id: 'pelaporan_kokurikuler',
  title: 'Pelaporan Pertanggungjawaban (LPJ)',
  icon: '📋',
  desc: 'Penyusunan dokumen final penutupan siklus program kokurikuler untuk dievaluasi Kepala Sekolah.',
  items: [
    {
      id: 'lpj_evaluasi',
      nama: 'Laporan Evaluasi Pelaksanaan P5',
      icon: '📈',
      components: [
        { id: 'ketercapaian_target', label: 'Analisis Ketercapaian Dimensi secara Agregat', type: 'textarea' },
        { id: 'testimoni_feedback', label: 'Rekap Testimoni / Umpan Balik (Siswa, Ortu, Fasilitator)', type: 'textarea' },
        { id: 'analisis_biaya', label: 'Analisis Efisiensi Biaya/Cost Proyek', type: 'textarea' },
        { id: 'rekomendasi_tindak', label: 'Rekomendasi Tema & Perbaikan Menyeluruh Tahun Depan', type: 'textarea' }
      ],
      ai_prompt: "Sebagai Independent Auditor Program Merdeka Belajar, tulislah Laporan Pertanggungjawaban dan Evaluasi Tahunan Proyek Kokurikuler (P5) yang ditujukan langsung ke meja Kepala Sekolah.\n\nInstruksi Struktur LPJ:\n1. ANALISIS DAMPAK MAKRO: Konklusikan secara tajam seberapa besar lompatan moral dan karakter siswa di sekolah ini berkat selesainya serangkaian P5 yang digerakkan berdasarkan bukti agregat: {{ketercapaian_target}}.\n2. SURVEI KEPUASAN (SATISFACTION INDEX): Ubah komentar emosional komite masyarakat ini menjadi laporan penerimaan publik (Public Acceptance) terhadap kebijakan proyek sekolah: {{testimoni_feedback}}.\n3. AUDIT KEUANGAN: Justifikasi bahwa setiap rupiah sekolah/sumbangan yang terpakai memberikan *Return on Education* yang tinggi berdasar data serapan: {{analisis_biaya}}.\n4. EXECUTIVE SUMMARY RECOMMENDATION: Rangkai rekomendasi berjangka untuk menyusun ulang silabus kokurikuler yang lebih sempurna tahun depan dari rintisan argumen: {{rekomendasi_tindak}}."
    }
  ]
};
