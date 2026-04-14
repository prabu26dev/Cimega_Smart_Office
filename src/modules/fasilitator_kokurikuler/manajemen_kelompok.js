window.FasilitatorP5Modules = window.FasilitatorP5Modules || {};

window.FasilitatorP5Modules['manajemen_kelompok'] = {
  id: 'manajemen_kelompok',
  title: 'Manajemen Kelompok Mikro',
  icon: '🗂️',
  desc: 'Pangkalan data kesiapan siswa, rotasi jabatan tim, dan persiapan logistik mikro di dalam kelas.',
  items: [
    {
      id: 'rencana_pendampingan',
      nama: 'Rencana Pendampingan Kelompok',
      icon: '🛡️',
      components: [
        { id: 'identitas_klas', label: 'Identitas Kelompok/Kelas Dampingan', type: 'textarea' },
        { id: 'pemetaan_kesiapan', label: 'Pemetaan Kesiapan Mandiri vs Bimbingan Intensif', type: 'textarea' },
        { id: 'modifikasi_instruksi', label: 'Modifikasi Pertanyaan Pemantik untuk Kelompok Ini', type: 'textarea' },
        { id: 'checklist_alat', label: 'Checklist Persediaan Alat/Bahan Harian', type: 'textarea' }
      ],
      ai_prompt: "Anda adalah Guru Fasilitator Lapangan Proyek P5. Rancang Dokumen Rencana Pendampingan Kelompok (Micro-Teaching Plan) secara tajam.\n\nFokus Analisis:\n1. ASESMEN DIAGNOSTIK KELOMPOK: Berdasar data ini: {{pemetaan_kesiapan}}, jabarkan tingkat kedewasaan kelompok (apakah perlu di-*micromanage* sangat ketat atau diberi kemerdekaan bereksplorasi?).\n2. REVISI PEMANTIK: Modifikasi instruksi kaku dari modul koordinator menjadi pemantik yang lebih membumi/mudah dipahami tingkat nalar spesifik anak di kelompok ini: {{modifikasi_instruksi}}.\n3. LOGISTIK MIKRO: Rangkum ceklis alat spesifik harian yang wajib dibawa kelompok agar agenda hari ini tidak macet: {{checklist_alat}}."
    },
    {
      id: 'dinamika_rotasi',
      nama: 'Data Dinamika Kelompok (Rotasi Peran)',
      icon: '🔄',
      components: [
        { id: 'anggota_kelompok', label: 'Daftar Nama Anggota Tim Proyek', type: 'textarea' },
        { id: 'pembagian_peran', label: 'Porsi Peran Saat Ini (Ketua, Logistik, Juru Bicara, dll)', type: 'textarea' },
        { id: 'sistem_rotasi', label: 'Rancangan Evaluasi & Sistem Rotasi Jabatan', type: 'textarea' }
      ],
      ai_prompt: "Sebagai Ahli Dinamika Sosial Kelompok, berikan evaluasi kepemimpinan dan manajerial dari pembagian peran siswa ini.\n\nInstruksi Jurnal Sosiometri:\n1. BEBAN KERJA: Tinjau kelayakan pembagian beban dari susunan jabatan saat ini: {{pembagian_peran}} dari orang-orang ini: {{anggota_kelompok}}. Apakah ada yang mendominasi (bossy) atau *free-rider*?\n2. MANAJEMEN ROTASI: Berdasarkan analisis di atas, rumuskan sistem putaran kemudi kepemimpinan selanjutnya agar semua siswa merasakan 'asam garam' memimpin rapat maupun menjadi tukang catat/logistik: {{sistem_rotasi}}. Jadikan ini sebagai instrumen melatih Dimensi Kolaborasi."
    }
  ]
};
