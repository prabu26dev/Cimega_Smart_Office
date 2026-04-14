window.GuruPaiModules = window.GuruPaiModules || {};

window.GuruPaiModules['perencanaan_pai'] = {
  id: 'perencanaan_pai',
  title: 'Perencanaan PAI',
  icon: '🕌',
  desc: 'Peta pembelajaran agamis yang berfokus pada deep learning dan praktik keberimanan.',
  items: [
    {
      id: 'analisis_cp_atp',
      nama: 'Analisis CP & ATP PAI',
      icon: '🎯',
      components: [
        { id: 'elemen_pai', label: 'Pemetaan 5 Elemen Utama (Al-Qur\'an Hadis, Aqidah, Akhlak, Fikih, SKI)', type: 'textarea' },
        { id: 'rumusan_tp', label: 'Rumusan TP Berorientasi Deep Learning', type: 'textarea' },
        { id: 'alur_atp', label: 'Alur Tujuan Pembelajaran Lintas Kelas', type: 'textarea' },
        { id: 'alokasi_waktu', label: 'Alokasi Jam Pelajaran', type: 'textarea' }
      ],
      ai_prompt: "Anda adalah Pakar Kurikulum Pendidikan Agama Islam (PAI). Susunlah dokumen Analisis Capaian Pembelajaran (CP) dan Alur Tujuan Pembelajaran (ATP) berstandar Kurikulum Nasional.\n\nInstruksi Struktur:\n1. PEMETAAN 5 ELEMEN PAI: Berdasarkan data ini: {{elemen_pai}}, konversikan menjadi narasi yang menekankan bahwa agama bukan cuma hafalan, melainkan internalisasi moral.\n2. RUMUSAN TP DEEP LEARNING: Sempurnakan draf Tujuan Pembelajaran (TP) ini: {{rumusan_tp}}. Gunakan kata kerja Taksonomi Bloom level tinggi (misal: mempertimbangkan, mendesain, memvalidasi).\n3. ALUR PEMETAAN KELAS: Buat format matriks alur belajar dari data ini: {{alur_atp}}.\n4. ALOKASI WAKTU: Rasionalkan pembagian jam berbasis: {{alokasi_waktu}}."
    },
    {
      id: 'modul_ajar_pai',
      nama: 'Modul Ajar PAI Berdiferensiasi',
      icon: '📖',
      components: [
        { id: 'identitas', label: 'Identitas Modul (Kelas/Semester)', type: 'textarea' },
        { id: 'tujuan', label: 'Tujuan & Pemantik Keimanan', type: 'textarea' },
        { id: 'skenario_diferensiasi', label: 'Skenario Diferensiasi (Berdasarkan Kelancaran Baca Al-Qur\'an)', type: 'textarea' },
        { id: 'media_asesmen', label: 'Media Ajar & Rancangan Asesmen Integratif', type: 'textarea' }
      ],
      ai_prompt: "Bertindaklah sebagai Maestro Pedagogik PAI. Susun draf Modul Ajar Kurikulum Merdeka yang memiliki sensitivitas tinggi terhadap kemampuan literasi Al-Qur'an siswa yang beragam.\n\nStruktur Penulisan:\n1. BINGKAI IDENTITAS: {{identitas}}. Masukkan pertanyaan pemantik yang menggugah nalar spiritual (Socratic Questioning): {{tujuan}}.\n2. INTI BERDIFERENSIASI: Deskripsikan dengan detail teknik pembelajaran. Anda WAJIB membedakan kelompok siswa yang sudah lancar mengaji (misal dengan tahsin/terjemah) dan yang Iqra/pemula (misal dengan pendampingan intensif) berdasarkan masukan ini: {{skenario_diferensiasi}}.\n3. PERANGKAT PENDUKUNG: Buat daftar media ajar kreatif dan metodologi asesmen pemahaman makna dari ide ini: {{media_asesmen}}."
    },
    {
      id: 'kokurikuler_agama',
      nama: 'Perencanaan Kokurikuler Keagamaan',
      icon: '🕋',
      components: [
        { id: 'desain_proyek', label: 'Desain Proyek Kokurikuler (Dimensi Keimanan)', type: 'textarea' },
        { id: 'alur_pelaksanaan', label: 'Alur Pelaksanaan Proyek (Fase)', type: 'textarea' },
        { id: 'target_karakter', label: 'Target Capaian Karakter Spiritual', type: 'textarea' }
      ],
      ai_prompt: "Sebagai Fasilitator P5 Ahli Pendidikan Agama, susun Konsep Proyek Kokurikuler yang menunjang eksplorasi Dimensi Beriman, Bertakwa, dan Berakhlak Mulia.\n\nPenjabaran:\n1. RASIONAL PROYEK: Kembangkan landasan konsep ini menjadi aktivitas seru (misal: Sedekah Sampah, Duta Adab): {{desain_proyek}}.\n2. TAHAPAN AKSI: Jabarkan kerangka eksplorasi, pelaksanaan, dan selebrasi berdasarkan: {{alur_pelaksanaan}}.\n3. OUTPUT KARAKTER: Definisikan parameter perubahan adab kongkret sebagai tolok ukur kesuksesan P5: {{target_karakter}}."
    }
  ]
};
