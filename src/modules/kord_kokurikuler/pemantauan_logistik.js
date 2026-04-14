window.KordKokuModules = window.KordKokuModules || {};

window.KordKokuModules['pemantauan_logistik'] = {
  id: 'pemantauan_logistik',
  title: 'Pelaksanaan & Pemantauan (Monitoring)',
  icon: '🔍',
  desc: 'Pangkalan logbook pemantauan berjalannya proyek, manajemen persediaan material, serta perizinan pihak luar.',
  items: [
    {
      id: 'jurnal_pemantauan',
      nama: 'Jurnal Logbook Koordinator',
      icon: '📓',
      components: [
        { id: 'progres_kelas', label: 'Laporan Progres per Kelas (Mingguan/Bulanan)', type: 'textarea' },
        { id: 'temuan_masalah', label: 'Temuan Masalah di Lapangan (Misal: Kekurangan Alat)', type: 'textarea' },
        { id: 'solusi_kord', label: 'Tindakan Solusi dari Koordinator Proyek', type: 'textarea' }
      ],
      ai_prompt: "Sebagai Pemimpin Pengendali Mutu Proyek (QA Project), susunlah Laporan Jurnal Logbook Inspeksi Lapangan Mingguan.\n\nFokus Analisis Logbook:\n1. METRIK PROGRES: Ubah data kasar ini menjadi ringkasan kemajuan tahapan kelas (Eksplorasi/Aksi): {{progres_kelas}}.\n2. AUDIT KENDALA: Dokumentasikan hambatan operasional maupun pedagogik fasilitator secara tajam: {{temuan_masalah}}.\n3. MITIGASI & RESOLUSI: Definisikan intervensi kepemimpinan (solusi) yang telah dieksekusi agar masalah ini tidak menjalar ke kelas lain berdasarkan ide: {{solusi_kord}}."
    },
    {
      id: 'manajemen_logistik',
      nama: 'Manajemen Material & Barang Aset Proyek',
      icon: '📦',
      components: [
        { id: 'daftar_material', label: 'Daftar Kebutuhan Material (Kardus, Cat, Bibit, dll)', type: 'textarea' },
        { id: 'asal_barang', label: 'Sumber Modal Aset (Bawaan Siswa/Dana Sekolah/Sumbangan)', type: 'textarea' },
        { id: 'log_distribusi', label: 'Log Distribusi Berkeadilan (Ceklis Barang Masuk Keluar ke Kelas)', type: 'textarea' }
      ],
      ai_prompt: "Anda bertugas sebagai Manajer Logistik Rantai Pasok P5. Sempurnakan Laporan Arus Persediaan Barang (Inventory Flow) di gudang logistik proyek.\n\nRancangan Sistem:\n1. ANALISIS KEBUTUHAN: Rekapitulasi daftar komoditi konsumabel berikut agar tidak ada selisih pembelian ganda: {{daftar_material}}.\n2. TRANSPARANSI PENDANAAN: Buktikan asal usul barang secara terang benderang mencegah kesalahpahaman sumbangan wali murid berdasar rasio ini: {{asal_barang}}.\n3. ARUS DISTRIBUSI: Tata ulang jadwal mutasi penyebaran alat-alat ke masing-masing kelompok stan proyek: {{log_distribusi}}."
    },
    {
      id: 'kemitraan_proyek',
      nama: 'Administrasi Kemitraan (Narasumber)',
      icon: '🤝',
      components: [
        { id: 'surat_kunjungan', label: 'Surat Permohonan Kunjungan / Izin Tempat', type: 'textarea' },
        { id: 'mou_narasumber', label: 'MoU dengan Narasumber Pakar Eksternal', type: 'textarea' }
      ],
      ai_prompt: "Berperanlah sebagai Petugas Hubungan Masyarakat (Humas) Sekolah.\n\nTolong rakit draf administrasi eksternal legal tingkat tinggi (White Paper):\n1. SURAT JALAN / PERMOHONAN: Berdasarkan garis besar konsep ini: {{surat_kunjungan}}, gubah menjadi Surat Pengajuan Kunjungan Belajar Lapangan yang memohon izin ke institusi tujuan dengan rendah hati namun bernilai akademis di mata pimpinan instansi terkait.\n2. NOTA KESEPAHAMAN (MoU): Ubah skema ini: {{mou_narasumber}} menjadi draf Perjanjian Kerja Sama antara Koordinator P5 Sekolah dengan Narasumber ahli (dunia usaha/budayawan) yang mencakup jam kehadiran, topik materi, dan tanggung jawab logistik."
    }
  ]
};
