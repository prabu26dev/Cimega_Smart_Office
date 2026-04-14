window.FasilitatorP5Modules = window.FasilitatorP5Modules || {};

window.FasilitatorP5Modules['manajemen_portofolio'] = {
  id: 'manajemen_portofolio',
  title: 'Manajemen Portofolio Karya',
  icon: '📚',
  desc: 'Pangkalan penyusunan bukti otentik proses belajar mendalam (deep learning) dan Penilaian Akhir Sumatif Proyek.',
  items: [
    {
      id: 'induk_portofolio',
      nama: 'Buku Induk Portofolio Kelompok',
      icon: '📂',
      components: [
        { id: 'log_draf', label: 'Log Penyimpanan Draf/Sketsa Rancangan Karya', type: 'textarea' },
        { id: 'dokumentasi_proses', label: 'Catatan Dokumentasi Proses Kerja (Bukan cuma Hasil)', type: 'textarea' },
        { id: 'log_revisi', label: 'Dokumentasi Revisi Karya (Bukti Nalar Kritis/Problem Solving)', type: 'textarea' }
      ],
      ai_prompt: "Sebagai Kurator Galeri Proses Akademik, formulasikan narasi historis di balik pembuatan proyek dari sekumpulan coretan kasar ini.\n\nFokus Historiografi:\n1. ORIGINALITAS ARSITEKTUR AWAL: Nadi proyek bukan di hiasan akhir, jabarkan jatuh bangun ide ide mentah kelompok berdasar aset: {{log_draf}}.\n2. DINAMIKA DAPUR PRODUKSI (TRIAL AND ERROR): Tulis paragraf storytelling dari kegiatan mereka saat memotong bahan, mewawancarai narasumber, dsb dari: {{dokumentasi_proses}}.\n3. PROBLEM SOLVING: Ini krusial! Rangkai sebuah epic fail (kegagalan fase coba-coba) yang mereka lalui hingga akhirnya merevisi karya menjadi utuh, merujuk data revisi: {{log_revisi}}."
    },
    {
      id: 'rubrik_sumatif',
      nama: 'Rubrik Penilaian Karya / Presentasi Akhir',
      icon: '🏆',
      components: [
        { id: 'orisinalitas_ide', label: 'Tingkat Orisinalitas & Inovasi Ide', type: 'textarea' },
        { id: 'daya_guna', label: 'Daya Guna/Impact Karya Fisik terhadap Lingkungan', type: 'textarea' },
        { id: 'kemampuan_komunikasi', label: 'Kemampuan Komunikasi & Argumentasi saat Presentasi/Showcase', type: 'textarea' }
      ],
      ai_prompt: "Anda bertugas sebagai Dewan Juri Panelis Penilaian Ekspo Pameran. Berikan penilaian sumatif puncak (Summative Assessment) secara adil.\n\nMatriks Evaluasi Penjurian Akhir:\n1. NILAI INOVATIF KARYA: Apakah proyek ini terobosan jenius atau sekedar meniru Pineterest/Google? Nilai berdasar observasi: {{orisinalitas_ide}}.\n2. IMPACT ASSESMENT: Deskripsikan kemanfaatan karya/kampanyenya apabila digulirkan ke skala lingkungan hidup sekitar: {{daya_guna}}.\n3. PUBLIC SPEAKING METRICS: Nilai seberapa cakap narator kelompok menangkis *grilling* pertanyaan pengunjung saat pameran berdasarkan data: {{kemampuan_komunikasi}}."
    }
  ]
};
