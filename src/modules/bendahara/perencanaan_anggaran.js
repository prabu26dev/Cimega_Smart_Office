window.BendaharaModules = window.BendaharaModules || {};

window.BendaharaModules['perencanaan_anggaran'] = {
  id: 'perencanaan_anggaran',
  title: 'Perencanaan RKAS',
  icon: '📑',
  desc: 'Pangkalan data awal penentuan anggaran BOS (RKAS), Rencana Penarikan Dana (RPD), dan SK Tim BOS.',
  items: [
    {
      id: 'rkas_perencanaan',
      nama: 'Rencana Kegiatan & Anggaran (RKAS)',
      icon: '📊',
      components: [
        { id: 'integrasi_rapor', label: 'Program Benahi Berbasis Rapor Pendidikan (SNP)', type: 'textarea' },
        { id: 'uraian_belanja', label: 'Uraian Kegiatan, Volume, Satuan, dan Harga Satuan', type: 'textarea' },
        { id: 'sumber_dana', label: 'Sumber Pendanaan (BOS Reguler/Kinerja) & Total Pagu', type: 'textarea' }
      ],
      ai_prompt: "Tugas Anda adalah sebagai Konsultan Keuangan Pendidikan (RKAS Planner). Susunlah Dokumen Rencana Belanja Anggaran Sekolah yang taat asas regulasi kementerian.\n\nFokus Analisis Perencanaan:\n1. JUSTIFIKASI BELANJA: Kaitkan urgensi dari Uraian Belanja berikut ini: {{uraian_belanja}} dengan kebutuhan Program Benahi Rapor Mutu Pendidikan berstandar SNP: {{integrasi_rapor}}. Yakinkan auditor bahwa uang ini tidak dibuang percuma.\n2. RUMUSAN ANGGARAN: Rapikan susunan struktur harga dan pastikan itu masuk akal serta tidak melebihi Pagu Anggaran dari dana: {{sumber_dana}}."
    },
    {
      id: 'sk_tim_bos',
      nama: 'SK Tim Manajemen BOS',
      icon: '⚖️',
      components: [
        { id: 'konsideran_hukum', label: 'Konsideran Hukum & Tahun Anggaran', type: 'textarea' },
        { id: 'personalia_tim', label: 'Daftar Nama Personel & Jabatan (Kepsek, Bendahara, Komite)', type: 'textarea' },
        { id: 'rincian_tugas', label: 'Rincian Pembagian Tugas Administratif', type: 'textarea' }
      ],
      ai_prompt: "Sebagai Ahli Tata Usaha (Birokrat Eksekutif), buatlah draf legal formal Surat Keputusan (SK) Tim Manajemen BOS Tingkat Sekolah Dasar.\n\nInstruksi Redaksional:\n1. LANDASAN HUKUM: Rangkai format 'Menimbang, Mengingat, Memutuskan' dari landasan awal ini: {{konsideran_hukum}}.\n2. STRUKTUR ORGANISASI: Susun tabel formatur panitia sesuai hirarki birokrasi berdasar data: {{personalia_tim}}.\n3. LEGALITAS PERAN: Jabarkan tugas dan tanggung jawab masing-masing nama, berikan batasan tegas agar tidak terjadi penyalahgunaan wewenang secara material berdasarkan draf ini: {{rincian_tugas}}."
    },
    {
      id: 'rpd_cashflow',
      nama: 'Rencana Penarikan Dana (RPD)',
      icon: '💸',
      components: [
        { id: 'estimasi_cashflow', label: 'Estimasi Kebutuhan Cashflow (Per Bulan)', type: 'textarea' },
        { id: 'jadwal_pencairan', label: 'Jadwal Pencairan Giro dari Bank Daerah', type: 'textarea' },
        { id: 'tahapan_bos', label: 'Persentase Pembagian Dana Tahap 1 & Tahap 2', type: 'textarea' }
      ],
      ai_prompt: "Sebagai Chief Financial Officer (CFO) Sekolah, prediksikan dan manajemen Rencana Penarikan Dana (RPD) untuk mengamankan likuiditas operasional sekolah.\n\nAnalisis RPD Tahunan:\nBerdasarkan alur kebutuhan operasional bulanan: {{estimasi_cashflow}}, sinkronkan dengan ketersediaan likuiditas bank pada jadwal: {{jadwal_pencairan}}.\nPastikan persentase penarikan tidak menyalahi aturan termin pencairan pemerintah, yakni tahap 1 vs tahap 2: {{tahapan_bos}} dan jelaskan rasionalisasinya secara finansial."
    }
  ]
};
