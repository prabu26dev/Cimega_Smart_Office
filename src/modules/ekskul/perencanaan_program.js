window.EkskulModules = window.EkskulModules || {};

window.EkskulModules['perencanaan_program'] = {
  id: 'perencanaan_program',
  title: 'Perencanaan Program Kerja',
  icon: '📝',
  desc: 'Blueprint kegiatan ekstrakurikuler selama satu tahun ajaran/semester beserta Silabus Latihan Rutin.',
  items: [
    {
      id: 'proker_tahunan',
      nama: 'Program Kerja Tahunan / Semester',
      icon: '🏛️',
      components: [
        { id: 'identitas_tujuan', label: 'Nama Ekskul, Latar Belakang & Tujuan Khusus', type: 'textarea' },
        { id: 'target_pencapaian', label: 'Target Event/Kompetisi (Misal: FLS2N/O2SN)', type: 'textarea' },
        { id: 'relevansi_dimensi', label: 'Pemetaan Relevansi dengan 8 Dimensi Profil Lulusan', type: 'textarea' }
      ],
      ai_prompt: "Sebagai Ahli Manajemen Ekstrakurikuler, olah usulan mentah ini menjadi Draf Program Kerja (Proker) Lengkap yang layak diajukan ke Kepala Sekolah untuk pencairan anggaran rutin.\n\nFokus Penyusunan Proker:\n1. RASIONALISASI: Susun Latar Belakang dan Tujuan Akademik berdasar ide ini: {{identitas_tujuan}}.\n2. GOAL SETTING: Rinci ambisi kompetisi yang dikejar: {{target_pencapaian}} sebagai *Key Performance Indicator* (KPI) ekskul.\n3. INTEGRASI KARAKTER: Kaitkan ekskul ini dengan pembangunan *soft-skill* spesifik dari 8 Dimensi Profil Lulusan (Misal: Ekskul Paskibra untuk dimensi Kepemimpinan & Kolaborasi) berdasar: {{relevansi_dimensi}}."
    },
    {
      id: 'silabus_latihan',
      nama: 'Silabus Latihan (RPL)',
      icon: '📋',
      components: [
        { id: 'materi_pertemuan', label: 'Daftar Materi per Pertemuan (Contoh: Latihan Passing Dasar)', type: 'textarea' },
        { id: 'metode_alat', label: 'Metode Latihan & Alat Pendukung yang Dibutuhkan', type: 'textarea' }
      ],
      ai_prompt: "Berperanlah sebagai Pelatih/Trainer Profesional. Rincikan coretan kasar ini menjadi Silabus Rencana Pelaksanaan Latihan (RPL) yang terkalibrasi.\n\nStruktur Silabus:\nJabarkan *Step-by-step* indikator keterampilan/materi dari draf ini: {{materi_pertemuan}}.\nPetakan skenario simulasi dan spesifikasi alat bantu (seperti bola/kanvas/pita) yang mutlak dibutuhkan dari referensi ini: {{metode_alat}} agar latihan tidak monoton."
    }
  ]
};
