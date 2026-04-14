window.KepsekModules = window.KepsekModules || {};

window.KepsekModules['manajemen_sdm'] = {
  id: 'manajemen_sdm',
  title: 'Manajemen Sumber Daya Manusia',
  icon: '👥',
  desc: 'Pengecekan dan administrasi hukum, kepegawaian, serta pengembangan karier.',
  items: [
    {
      id: 'admin_sk',
      nama: 'Administrasi SK & Penugasan',
      icon: '📜',
      components: [
        { id: 'jtm', label: 'Spesifikasi Pembagian Tugas Mengajar (JTM) & Wali Kelas', type: 'textarea' },
        { id: 'tpmps', label: 'Struktur Tim Penjamin Mutu Pendidikan Sekolah (TPMPS)', type: 'textarea' },
        { id: 'pengelola', label: 'Penugasan Pengelola Teknis (Perpus, Bendahara, Ops)', type: 'textarea' }
      ],
      ai_prompt: "Anda adalah Kepala Sub-Bagian Kepegawaian (Kasubag TU). Saya memerlukan kompilasi Draf Surat Keputusan (SK) Resmi Kepala Sekolah untuk periode berjalan.\n\nTolong kerjakan 3 bagian SK terpisah dalam satu dokumen ini:\n\n1. SK PEMBAGIAN TUGAS MENGAJAR\nBuat konsideran Menimbang, Mengingat, Menetapkan berdasarkan data ini: {{jtm}}.\n2. SK TIM PENJAMIN MUTU SEKOLAH\nUbah struktur kepanitiaan berikut menjadi format diktum keputusan yang sah: {{tpmps}}.\n3. SK PENGELOLA MANAJEMEN SEKOLAH\nJabarkan rincian tugas dan fungsi dari personel teknis berikut: {{pengelola}}.\n\nSetiap draf harus mencantumkan format standar kearsipan kedinasan (Menimbang, Mengingat, Memutuskan, Menetapkan) tanpa menggunakan placeholder tanggal; biarkan ruang kosong untuk tanda tangan Kepala Sekolah."
    },
    {
      id: 'ekinerja',
      nama: 'Pengelolaan e-Kinerja (PMM)',
      icon: '📈',
      components: [
        { id: 'skp', label: 'Rangkuman Perencanaan SKP Pegawai', type: 'textarea' },
        { id: 'pkg', label: 'Deskripsi Penilaian Kinerja Guru (PKG)', type: 'textarea' },
        { id: 'kompetensi', label: 'Log Aktivitas Pengembangan Kompetensi (Sertifikat/Diklat)', type: 'textarea' }
      ],
      ai_prompt: "Sebagai Pejabat Penilai Kinerja ASN (Kepala Sekolah), buatlah Dokumen Evaluasi e-Kinerja Tahunan (Terintegrasi PMM - Platform Merdeka Mengajar).\n\nInstruksi:\n1. ANALISIS SASARAN KINERJA PEGAWAI (SKP): Evaluasi kemajuan dari perencanaan dari data ini: {{skp}}.\n2. EVALUASI PENILAIAN GURU: Terjemahkan deskripsi kasar ini menjadi kalimat evaluasi kinerja yang formal dan memotivasi: {{pkg}}.\n3. REKOMENDASI PENGEMBANGAN DIRI: Nilai efektivitas keikutsertaan pelatihan/komunitas belajar guru berdasarkan data berikut, dan sarankan pengembangan lanjutan yang relevan: {{kompetensi}}.\n\nHasilkan keluaran dalam gaya laporan personal (Pejabat Penilai kepada Pegawai yang Dinilai) yang objektif, jelas, dan mematuhi kaidah evaluasi ASN."
    }
  ]
};
