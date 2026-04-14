window.GuruPaiModules = window.GuruPaiModules || {};

window.GuruPaiModules['asesmen_agama'] = {
  id: 'asesmen_agama',
  title: 'Asesmen Keagamaan',
  icon: '📊',
  desc: 'Pangkalan data ujian teori, ujian praktik ibadah, BTQ, dan pantauan budi pekerti.',
  items: [
    {
      id: 'nilai_kognitif',
      nama: 'Buku Nilai Kognitif/Teori PAI',
      icon: '📘',
      components: [
        { id: 'identitas_rombel', label: 'Nama Siswa & Rombel Kelas', type: 'textarea' },
        { id: 'formatif', label: 'Nilai Formatif Harian', type: 'textarea' },
        { id: 'sumatif', label: 'Nilai Sumatif (Akhir Bab / Semester)', type: 'textarea' },
        { id: 'deskripsi_teori', label: 'Deskripsi Ketercapaian Teori Agama', type: 'textarea' }
      ],
      ai_prompt: "Sebagai Akuntan Akademik Pendidikan Agama, buat Draf Laporan Daftar Nilai Kognitif (Pengetahuan) yang bermutu.\n\nDapur Data:\n- Sasaran Kelas: {{identitas_rombel}}\n- Pertumbuhan Nilai Harian: {{formatif}}\n- Pencapaian Final: {{sumatif}}\n- Narasi Wali Mapel: Berlandaskan penilaian teori ini, buatkan narasi deskriptif untuk diinput ke buku Rapor siswa terkait seberapa dalam pemahaman ilmu agama mereka (usahakan bernada mengayomi namun faktual): {{deskripsi_teori}}."
    },
    {
      id: 'praktik_btq',
      nama: 'Format Penilaian Praktik & BTQ',
      icon: '🤲',
      components: [
        { id: 'praktik_wudhu', label: 'Rubrik Praktik Wudhu (Niat, Rukun, Tertib)', type: 'textarea' },
        { id: 'praktik_shalat', label: 'Rubrik Praktik Shalat Fardhu (Bacaan & Gerakan)', type: 'textarea' },
        { id: 'hafalan', label: 'Rekap Hafalan Surah (Juz Amma)', type: 'textarea' },
        { id: 'kemampuan_hijaiyah', label: 'Kemampuan Baca/Tulis Hijaiyah (Tajwid/Makhroj)', type: 'textarea' }
      ],
      ai_prompt: "Anda adalah Penguji Ujian Praktik Agama. Konsolidasikan instrumen penilaian ini ke dalam satu Dokumen Laporan Keterampilan (Psikomotorik) Agama yang resmi.\n\nFokus Analisis:\n1. TATA CARA BERSUCI (FIQIH I): Rapikan format penilaian kualitas wudhu ini: {{praktik_wudhu}}.\n2. PRAKTIK SHALAT (FIQIH II): Jabarkan skala ketepatan gerakan dan tajwid bacaan shalat: {{praktik_shalat}}.\n3. BTQ & TAHFIDZ (AL-QUR'AN): Buatkan rekap kualitatif dari laporan kelancaran hafalan juz 'amma: {{hafalan}} dipadukan dengan tingkat kefasihan makharijul huruf dari data ini: {{kemampuan_hijaiyah}}."
    },
    {
      id: 'observasi_akhlak',
      nama: 'Lembar Observasi Akhlak (Budi Pekerti)',
      icon: '🕊️',
      components: [
        { id: 'indikator_adab', label: 'Indikator Adab (Keseharian & Kebersihan)', type: 'textarea' },
        { id: 'skala_penilaian', label: 'Skala Penilaian Kualitatif (MB, BSH, SB)', type: 'textarea' },
        { id: 'kejadian_spesifik', label: 'Catatan Kejadian Spesifik Terkait Moral/Perilaku', type: 'textarea' }
      ],
      ai_prompt: "Sebagai Guru PAI Sekaligus Pendidik Moral, ubah coretan observasi lapangan saya menjadi Jurnal Akhlak & Budi Pekerti berformat Standar Nasional.\n\nInstruksi:\nSusun matriks laporan naratif berdasarkan pilar adab keislaman ini: {{indikator_adab}}.\nTransformasikan data konversi kuantitatif ini (MB, SB, dll) menjadi penjelasan mudah cerna: {{skala_penilaian}}.\nUntuk kasus di lapangan, jabarkan insiden perilaku moral berikut dan berikan catatan bimbingan (Irsyad) sebagai tindakan preventif bagi wali murid: {{kejadian_spesifik}}."
    }
  ]
};
