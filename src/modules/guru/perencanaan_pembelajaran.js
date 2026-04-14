window.GuruModules = window.GuruModules || {};

window.GuruModules['perencanaan_pembelajaran'] = {
  id: 'perencanaan_pembelajaran',
  title: 'Perencanaan Pembelajaran',
  icon: '📚',
  desc: 'Rancangan instruksional harian untuk intrakurikuler dan proyek kokurikuler (P5).',
  items: [
    {
      id: 'analisis_cp_atp',
      nama: 'Analisis CP dan ATP',
      icon: '🎯',
      components: [
        { id: 'salinan_cp', label: 'Salinan Deskripsi CP Fase', type: 'textarea' },
        { id: 'esensi', label: 'Esensi Materi Inti (Topik)', type: 'textarea' },
        { id: 'rumusan_tp', label: 'Rumusan Tujuan Pembelajaran (TP)', type: 'textarea' },
        { id: 'alur_waktu', label: 'Alokasi Waktu dan Urutan ATP Semester', type: 'textarea' }
      ],
      ai_prompt: "Bertindaklah sebagai Pakar Pengembang Kurikulum Operasional Sekolah Dasar. Saya telah menyalin data mentah untuk kelas/fase saya. Tugas Anda adalah membedah dan menyusun dokumen Analisis Capaian Pembelajaran (CP) dan Alur Tujuan Pembelajaran (ATP) yang berstandar nasional.\n\nInstruksi Struktur:\n1. ANALISIS ELEMEN CP\nTerjemahkan CP berikut menjadi elemen terukur yang ringkas: {{salinan_cp}}.\n2. PEMETAAN MATERI INTI\nBerdasarkan data materi inti ini, kategorikan mana yang esensial dan prasyarat: {{esensi}}.\n3. RUMUSAN TUJUAN PEMBELAJARAN (DEEP LEARNING)\nSempurnakan narasi TP berikut agar tidak sekadar ingatan (LOTS) tapi mendorong pemahaman mendalam (HOTS): {{rumusan_tp}}.\n4. ALUR & ALOKASI WAKTU (ATP)\nBuat tabel/format urutan ATP sesuai alokasi waktu berikut: {{alur_waktu}}.\n\nHasilkan dokumen kerja berpedoman pada taksonomi Bloom, jangan berhalusinasi, gunakan hanya parameter data di atas."
    },
    {
      id: 'modul_ajar',
      nama: 'Modul Ajar Berdiferensiasi',
      icon: '📖',
      components: [
        { id: 'identitas', label: 'Identitas Modul (Mapel, Kelas, Durasi)', type: 'textarea' },
        { id: 'tujuan', label: 'Tujuan & Pertanyaan Pemantik', type: 'textarea' },
        { id: 'langkah', label: 'Langkah Pembelajaran Berdiferensiasi (Visual, Auditori, Kinestetik)', type: 'textarea' },
        { id: 'asesmen', label: 'Skenario Asesmen Formatif & Sumber Belajar', type: 'textarea' }
      ],
      ai_prompt: "Sebagai Ahli Pedagogik Berdiferensiasi, rombak draf instruksional ini menjadi Dokumen Modul Ajar Kurikulum Merdeka yang siap cetak.\n\nStruktur Penulisan:\n1. INFO UMUM & TUJUAN\nSusun latar belakang berdasarkan: {{identitas}} dan letakkan pertanyaan pemantik ini dengan kuat: {{tujuan}}.\n2. SKENARIO KEGIATAN BERDIFERENSIASI\nJabarkan fase kegiatan (Pendahuluan, Inti, Penutup). Di kegiatan INTI, wajib merumuskan aktivitas berbeda bagi gaya belajar siswa menggunakan kerangka ini: {{langkah}}.\n3. ASESMEN & MEDIA\nDeskripsikan instrumen penilaian proses (formatif) yang sejalan: {{asesmen}}.\n\nGunakan gaya penulisan RPP modern standar Kemdikbud. Gunakan format Markdown rapi."
    },
    {
      id: 'kokurikuler_p5',
      nama: 'Perencanaan Kokurikuler (P5)',
      icon: '🌱',
      components: [
        { id: 'topik', label: 'Topik P5 atau Proyek Kontekstual', type: 'textarea' },
        { id: 'profil', label: 'Pemetaan Dimensi Profil Pelajar Pancasila', type: 'textarea' },
        { id: 'alur', label: 'Alur Eksplorasi & Tahapan Proyek', type: 'textarea' },
        { id: 'output', label: 'Hasil/Produk Akhir yang Diharapkan', type: 'textarea' }
      ],
      ai_prompt: "Bantu saya sebagai Guru Fasilitator Utama untuk merancang kerangka kerja Proyek Penguatan Profil Pelajar Pancasila (P5) yang low-budget namun berdampak tinggi (High-Impact).\n\n1. KARAKTERISTIK PROYEK: Kembangkan narasi singkat latar belakang topik ini: {{topik}}.\n2. BINGKAI PROFIL LULUSAN: Jelaskan rasionalitas pemilihan dimensi karakter ini: {{profil}}.\n3. ALUR AKTIVITAS P5: Rangkum rancangan fase (Kenali, Selidiki, Lakukan, Genapi) berdasarkan: {{alur}}.\n4. OUTPUT KARYA: Uraikan bentuk karya selebrasi berbiaya rendah berdasarkan ide ini: {{output}}.\n\nDokumen harus mudah dipahami langsung oleh peserta didik jika disosialisasikan di kelas."
    }
  ]
};
