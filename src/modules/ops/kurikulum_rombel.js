window.OpsModules = window.OpsModules || {};

window.OpsModules['kurikulum_rombel'] = {
  id: 'kurikulum_rombel',
  title: 'Kurikulum, Rombel & e-Rapor',
  icon: '🗂️',
  desc: 'Pusat pengaturan pembagian ruang kelas, jam tatap muka guru, server lokal e-Rapor, dan tugas tambahan.',
  items: [
    {
      id: 'rombel_kelas',
      nama: 'Pengaturan Rombongan Belajar',
      icon: '🏫',
      components: [
        { id: 'pemetaan_siswa', label: 'Pemetaan Siswa ke Rombel (Naik Kelas/Reguler/Inklusi)', type: 'textarea' },
        { id: 'walas_kurikulum', label: 'Plotting Wali Kelas Definitif & Jenis Kurikulum Fase', type: 'textarea' }
      ],
      ai_prompt: "Sebagai Ahli Manajemen Kelas (Class Roster Admin). Rapikan tata letak siswa dengan bijak.\n\nFokus Plotting Kelas:\n1. MANAJEMEN ANGKATAN: Rekam riwayat pergeseran naik kelas / rombel siswa secara terstruktur berdasar list ini: {{pemetaan_siswa}}.\n2. DISTRIBUSI PENGASUHAN: Kaitkan nama Romawi kelas dengan kurikulum Merdeka fasenya, lalu tempatkan guru wali (Homeroom) yang tepat berdasarkan SK di data ini: {{walas_kurikulum}}."
    },
    {
      id: 'pembelajaran_jam',
      nama: 'Pemetaan Jam Pembelajaran (JTM)',
      icon: '⏳',
      components: [
        { id: 'jadwal_mapel', label: 'Input Jadwal Tatap Muka Mapel ke Aplikasi', type: 'textarea' },
        { id: 'tugas_tambahan', label: 'Sinkronisasi SK Tugas Tambahan (Kepsek, Bendahara, Ekskul)', type: 'textarea' }
      ],
      ai_prompt: "Berperanlah sebagai Kepala Bagian Penjadwalan Akademik Sekolah. Hitung matriks kalkulasi beban jam ini agar guru tidak kurang dari kuota honornya.\n\nInstruksi Kalkulasi Jam Mengajar:\nTata matriks jadwal mapel reguler (dan muatan lokal) per kelas dari draf ini: {{jadwal_mapel}}.\nBerikan konversi kuantitas terhadap SK tambahan (misal Kepala Sekolah diakui sbg ekuivalen sekian jam) agar target 24 Jam Mengajar PTK tercapai tanpa melanggar batasan dapodik: {{tugas_tambahan}}."
    },
    {
      id: 'erapor_admin',
      nama: 'Administrator e-Rapor Tingkat Sekolah',
      icon: '📊',
      components: [
        { id: 'instal_server', label: 'Log Instalasi & Sync Database Master Dapodik', type: 'textarea' },
        { id: 'akun_guru', label: 'Distribusi Akun & Password Guru Mapel/Walas', type: 'textarea' },
        { id: 'backup_akhir', label: 'Konfirmasi Backup Database Nilai (Semester/Tahun)', type: 'textarea' }
      ],
      ai_prompt: "Anda ditugaskan sebagai IT Server Administrator tingkat pendidikan. Pastikan kelancaran arus pengisian nilai guru melalui protokol server e-Rapor.\n\nStandard Operating Procedure (SOP) e-Rapor:\n1. SYNC & FETCH: Buatkan log teknis bahwa penarikan (fetching) data siswa/rombel baru dari localhost Dapodik ke DB Rapor sukses: {{instal_server}}.\n2. CREDENTIAL MANAGEMENT: Buat kerangka daftar serah terima kerahasiaan login (Username/Password) tiap guru mapel untuk menekan angka lupa password: {{akun_guru}}.\n3. SECURE BACKUP: Tuliskan konfirmasi serah terima hard-copy/soft-copy database backup (*.sql/pg) Rapor yang siap direstore jika server utama terbakar/rusak: {{backup_akhir}}."
    }
  ]
};
