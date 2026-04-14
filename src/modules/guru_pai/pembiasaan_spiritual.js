window.GuruPaiModules = window.GuruPaiModules || {};

window.GuruPaiModules['pembiasaan_spiritual'] = {
  id: 'pembiasaan_spiritual',
  title: 'Pembiasaan Spiritual Spesifik',
  icon: '📿',
  desc: 'Rekam pantauan ibadah harian, program sanlat ramadhan, dan peringatan hari besar keagamaan.',
  items: [
    {
      id: 'pantauan_ibadah',
      nama: 'Buku Pantauan Ibadah Harian',
      icon: '🕋',
      components: [
        { id: 'ibadah_mandiri', label: 'Tabel Pantauan Shalat 5 Waktu & Mengaji di Rumah', type: 'textarea' },
        { id: 'ibadah_sekolah', label: 'Rekap Shalat Berjamaah (Dhuha/Dzuhur) di Sekolah', type: 'textarea' }
      ],
      ai_prompt: "Bertindaklah sebagai Mentor Tumbuh Kembang Karakter Keagamaan Anak. Berdasarkan data ibadah mentah siswa, buatkan Narasi Laporan Ibadah Spesifik untuk menjadi catatan pendamping.\n\nFokus Analisis:\n1. TATA KEHIDUPAN DI RUMAH: Evaluasi kepatuhan anak menjalankan kewajiban shalat fardhu dan TPA berkat pendampingan ortu berdasarkan: {{ibadah_mandiri}}.\n2. PEMBIASAAN DI LINGKUNGAN SEKOLAH: Rangkum partisipasi siswa dalam agenda Shalat Dhuha/Dzuhur berjamaah, soroti ketaatannya: {{ibadah_sekolah}}.\n\nSampaikan dalam bahasa evaluatif spiritual yang lembut namun menuntut konsistensi (istiqomah)."
    },
    {
      id: 'admin_phbi',
      nama: 'Administrasi Peringatan Hari Besar Islam',
      icon: '🎊',
      components: [
        { id: 'proposal_phbi', label: 'Rancangan Proposal & Tujuan Acara', type: 'textarea' },
        { id: 'susunan_panitia', label: 'Susunan Kepanitiaan & Rincian Tugas', type: 'textarea' },
        { id: 'laporan_dokumentasi', label: 'Laporan Pasca-Kegiatan & Evaluasi', type: 'textarea' }
      ],
      ai_prompt: "Sebagai Ketua Panitia Hari Besar, bantu saya menyusun Proposal & Laporan Kegiatan Peringatan Hari Besar Islam (PHBI).\n\nInstruksi Pembuatan Dokumen Utama:\n1. LEMBAR PENDAHULUAN & TUJUAN: Ubah ide dasar ini menjadi landasan kegiatan agamis yang disokong Kurikulum Merdeka: {{proposal_phbi}}.\n2. STRUKTUR KEPANITIAAN: Format dan jabarkan beban kerja dari susunan panitia ini (termasuk seksi humas, acara, konsumsi): {{susunan_panitia}}.\n3. (Jika Purna Acara) LPJ SINGKAT: Gubah catatan kekurangan dan keberhasilan ini menjadi lembar evaluasi Laporan Pertanggungjawaban: {{laporan_dokumentasi}}."
    },
    {
      id: 'sanlat_ramadhan',
      nama: 'Program Pesantren Kilat (Sanlat)',
      icon: '⛺',
      components: [
        { id: 'silabus_sanlat', label: 'Silabus Materi & Jadwal Pemateri', type: 'textarea' },
        { id: 'lks_ramadhan', label: 'Jurnal Ramadhan / Lembar Kerja Siswa', type: 'textarea' },
        { id: 'evaluasi_akhir', label: 'Laporan Evaluasi Kesuksesan Sanlat', type: 'textarea' }
      ],
      ai_prompt: "Anda adalah Ketua Program Pesantren Ramadhan. Susun Dokumen Masterplan Pelaksanaan Sanlat/Pesantren Kilat Sekolah.\n\nSubdokumen yang Diminta:\n1. DESAIN SILABUS KEKINIAN: Rancang jadwal dan materi sanlat (tidak klise) berdasarkan arahan ini: {{silabus_sanlat}}.\n2. PANDUAN JURNAL RAMADHAN SISWA: Rumuskan daftar tunggu ceklis amalan yaumi (harian) berdasarkan target ini: {{lks_ramadhan}}.\n3. LAPORAN PENYELESAIAN PROGRAM: Susun draf evaluasi final acara kepada Kepala Sekolah mencakup efektivitas agenda: {{evaluasi_akhir}}."
    }
  ]
};
