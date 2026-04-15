// ══════════════════════════════════════════════════════════════════════════
// ADMIN MASTER DATA — Cimega Smart Office v2.0
// Sumber Kebenaran Tunggal (Single Source of Truth)
//
// Total: 80 KATEGORI (role-spesifik) + TEMPLATES penuh dari semua modul
// 12 Role: guru, guru_pai, guru_pjok, kepsek, bendahara, ops,
//          tu, pustakawan, gpk, ekskul, koordinator, fasilitator
//
// Digunakan oleh masterSync() untuk push ke Firestore & Supabase.
// ══════════════════════════════════════════════════════════════════════════
'use strict';

window.CimegaMasterData = {

  // ─────────────────────────────────────────────────────────────────────
  // 80 KATEGORI MASTER — Role-Spesifik dengan ID Unik
  // Format ID: {role_prefix}_{slug}
  // ─────────────────────────────────────────────────────────────────────
  KATEGORI: [

    // ══════ KEPALA SEKOLAH (5 Kategori) ══════
    { id:'ks_perencanaan',  nama:'Perencanaan Satuan Pendidikan',              icon:'🎯', role:'kepsek',      urutan:1,  visibleTo:['kepsek'] },
    { id:'ks_supervisi',    nama:'Kepemimpinan Pembelajaran & Supervisi',      icon:'🔭', role:'kepsek',      urutan:2,  visibleTo:['kepsek'] },
    { id:'ks_sdm',          nama:'Manajemen SDM & Kepegawaian',                icon:'👥', role:'kepsek',      urutan:3,  visibleTo:['kepsek'] },
    { id:'ks_sarpras',      nama:'Manajemen Operasional & Sarana Prasarana',   icon:'🏢', role:'kepsek',      urutan:4,  visibleTo:['kepsek'] },
    { id:'ks_humas',        nama:'Hubungan Masyarakat & Pelaporan',            icon:'🤝', role:'kepsek',      urutan:5,  visibleTo:['kepsek'] },

    // ══════ GURU KELAS (10 Kategori) ══════
    { id:'gk_perencanaan',  nama:'Perencanaan Pembelajaran (Intrakurikuler & Kokurikuler)', icon:'📚', role:'guru', urutan:1,  visibleTo:['guru'] },
    { id:'gk_asesmen',      nama:'Asesmen dan Evaluasi Belajar',               icon:'📈', role:'guru',        urutan:2,  visibleTo:['guru'] },
    { id:'gk_kelaskelas',   nama:'Manajemen dan Tata Kelola Kelas',            icon:'📋', role:'guru',        urutan:3,  visibleTo:['guru'] },
    { id:'gk_bimbingan',    nama:'Bimbingan dan Profil Kesiswaan',             icon:'🚸', role:'guru',        urutan:4,  visibleTo:['guru'] },
    { id:'gk_kinerja',      nama:'Pengembangan Keprofesian & Kinerja Guru',    icon:'🎖️', role:'guru',        urutan:5,  visibleTo:['guru'] },
    { id:'gk_prates',       nama:'Pra-Tes: Perencanaan & Desain Evaluasi',     icon:'🗺️', role:'guru',        urutan:6,  visibleTo:['guru'] },
    { id:'gk_instrumen',    nama:'Pembuatan Instrumen Tes: Core Database Soal',icon:'📄', role:'guru',        urutan:7,  visibleTo:['guru'] },
    { id:'gk_validasi',     nama:'Validasi & Verifikasi Tahap Pra-Ujian',      icon:'🔎', role:'guru',        urutan:8,  visibleTo:['guru'] },
    { id:'gk_pelaksanaan',  nama:'Administrasi Pelaksanaan Ujian',             icon:'📐', role:'guru',        urutan:9,  visibleTo:['guru'] },
    { id:'gk_pascates',     nama:'Pasca-Tes: Analisis, Evaluasi & Tindak Lanjut',icon:'📊',role:'guru',      urutan:10, visibleTo:['guru'] },

    // ══════ GURU PAI (10 Kategori) ══════
    { id:'pai_perencanaan', nama:'Perencanaan Pembelajaran PAI (Intrakurikuler & Kokurikuler)', icon:'🕌', role:'guru_pai', urutan:1,  visibleTo:['guru_pai'] },
    { id:'pai_asesmen',     nama:'Asesmen dan Evaluasi Keagamaan',             icon:'📊', role:'guru_pai',    urutan:2,  visibleTo:['guru_pai'] },
    { id:'pai_lintas',      nama:'Manajemen Kelas Lintas Rombel',              icon:'📋', role:'guru_pai',    urutan:3,  visibleTo:['guru_pai'] },
    { id:'pai_pembiasaan',  nama:'Pembiasaan Spiritual & Program Khusus Keagamaan',icon:'📿',role:'guru_pai', urutan:4,  visibleTo:['guru_pai'] },
    { id:'pai_kinerja',     nama:'Pengembangan Keprofesian & Kinerja (PMM)',   icon:'🎖️', role:'guru_pai',    urutan:5,  visibleTo:['guru_pai'] },
    { id:'pai_prates',      nama:'Pra-Tes: Perencanaan Asesmen PAI (Teori & Praktik)',icon:'🗺️',role:'guru_pai',urutan:6,visibleTo:['guru_pai'] },
    { id:'pai_instrumen',   nama:'Pembuatan Instrumen Tes: Database Kognitif & Praktik',icon:'📄',role:'guru_pai',urutan:7,visibleTo:['guru_pai'] },
    { id:'pai_validasi',    nama:'Validasi & Verifikasi Pra-Ujian',            icon:'🔎', role:'guru_pai',    urutan:8,  visibleTo:['guru_pai'] },
    { id:'pai_pelaksanaan', nama:'Administrasi Pelaksanaan Ujian (Lintas Kelas)',icon:'📐',role:'guru_pai',   urutan:9,  visibleTo:['guru_pai'] },
    { id:'pai_pascates',    nama:'Pasca-Tes: Analisis, Evaluasi & Tindak Lanjut',icon:'📊',role:'guru_pai',  urutan:10, visibleTo:['guru_pai'] },

    // ══════ GURU PJOK (10 Kategori) ══════
    { id:'pjok_perencanaan',nama:'Perencanaan Pembelajaran Lintas Ruang',      icon:'🏃', role:'guru_pjok',   urutan:1,  visibleTo:['guru_pjok'] },
    { id:'pjok_asesmen',    nama:'Asesmen Jasmani, Keterampilan, dan Karakter',icon:'📊', role:'guru_pjok',   urutan:2,  visibleTo:['guru_pjok'] },
    { id:'pjok_lapangan',   nama:'Manajemen Lapangan & Inventaris Olahraga',   icon:'🏟️', role:'guru_pjok',   urutan:3,  visibleTo:['guru_pjok'] },
    { id:'pjok_uks',        nama:'Program Khusus Kesehatan Sekolah (UKS) & Prestasi',icon:'🏆',role:'guru_pjok',urutan:4,visibleTo:['guru_pjok'] },
    { id:'pjok_kinerja',    nama:'Pengembangan Keprofesian & Kinerja (PMM)',   icon:'🎖️', role:'guru_pjok',   urutan:5,  visibleTo:['guru_pjok'] },
    { id:'pjok_prates',     nama:'Pra-Tes: Perencanaan Asesmen Lapangan & Teori',icon:'🗺️',role:'guru_pjok', urutan:6,  visibleTo:['guru_pjok'] },
    { id:'pjok_instrumen',  nama:'Pembuatan Instrumen Tes: Core Database Gerak & Tulis',icon:'📄',role:'guru_pjok',urutan:7,visibleTo:['guru_pjok'] },
    { id:'pjok_validasi',   nama:'Validasi & Verifikasi Pra-Ujian',            icon:'🛡️', role:'guru_pjok',   urutan:8,  visibleTo:['guru_pjok'] },
    { id:'pjok_pelaksanaan',nama:'Administrasi Pelaksanaan Ujian (Fokus Keselamatan)',icon:'📋',role:'guru_pjok',urutan:9,visibleTo:['guru_pjok'] },
    { id:'pjok_pascates',   nama:'Pasca-Tes: Analisis, Evaluasi & Modifikasi Gerak',icon:'📈',role:'guru_pjok',urutan:10,visibleTo:['guru_pjok'] },

    // ══════ KOORDINATOR KOKURIKULER (5 Kategori) ══════
    { id:'kord_desain',     nama:'Perencanaan & Desain Program (Grand Design)', icon:'🎯', role:'koordinator', urutan:1,  visibleTo:['koordinator'] },
    { id:'kord_sdm',        nama:'Manajemen SDM & Fasilitator',                icon:'👥', role:'koordinator', urutan:2,  visibleTo:['koordinator'] },
    { id:'kord_monitoring', nama:'Pelaksanaan & Pemantauan (Monitoring)',       icon:'📡', role:'koordinator', urutan:3,  visibleTo:['koordinator'] },
    { id:'kord_asesmen',    nama:'Asesmen, Evaluasi & Output Karya',           icon:'🎨', role:'koordinator', urutan:4,  visibleTo:['koordinator'] },
    { id:'kord_laporan',    nama:'Pelaporan Pertanggungjawaban',               icon:'📑', role:'koordinator', urutan:5,  visibleTo:['koordinator'] },

    // ══════ FASILITATOR KOKURIKULER (5 Kategori) ══════
    { id:'fas_kelompok',    nama:'Manajemen Kelompok & Persiapan Mikro',       icon:'👨‍🏫', role:'fasilitator', urutan:1,  visibleTo:['fasilitator'] },
    { id:'fas_lapangan',    nama:'Eksekusi & Pemantauan Lapangan (Logbook)',   icon:'📓', role:'fasilitator', urutan:2,  visibleTo:['fasilitator'] },
    { id:'fas_asesmen',     nama:'Asesmen Karakter & Observasi',              icon:'🔍', role:'fasilitator', urutan:3,  visibleTo:['fasilitator'] },
    { id:'fas_portofolio',  nama:'Manajemen Portofolio & Bukti Karya',         icon:'📁', role:'fasilitator', urutan:4,  visibleTo:['fasilitator'] },
    { id:'fas_laporan',     nama:'Pelaporan & Sinkronisasi Data',             icon:'🔄', role:'fasilitator', urutan:5,  visibleTo:['fasilitator'] },

    // ══════ BENDAHARA (5 Kategori) ══════
    { id:'bend_anggaran',   nama:'Perencanaan & Pemetaan Anggaran (Budgeting)',icon:'📑', role:'bendahara',   urutan:1,  visibleTo:['bendahara','kepsek'] },
    { id:'bend_kas',        nama:'Penatausahaan & Pembukuan Kas (Core Accounting)',icon:'📒',role:'bendahara', urutan:2,  visibleTo:['bendahara','kepsek'] },
    { id:'bend_spj',        nama:'Pengadaan & Bukti Fisik Transaksi (SPJ)',    icon:'🧾', role:'bendahara',   urutan:3,  visibleTo:['bendahara','kepsek'] },
    { id:'bend_pajak',      nama:'Manajemen Perpajakan',                       icon:'⚖️', role:'bendahara',   urutan:4,  visibleTo:['bendahara','kepsek'] },
    { id:'bend_closing',    nama:'Pelaporan, Evaluasi & Closing Bulanan',      icon:'📊', role:'bendahara',   urutan:5,  visibleTo:['bendahara','kepsek'] },

    // ══════ OPERATOR SEKOLAH (5 Kategori) ══════
    { id:'ops_kelembagaan', nama:'Manajemen Data Kelembagaan & Sarpras',       icon:'🏫', role:'ops',         urutan:1,  visibleTo:['ops','kepsek'] },
    { id:'ops_ptk',         nama:'Manajemen Data Pendidik & Tenaga Kependidikan (PTK)',icon:'👨‍💼',role:'ops',urutan:2,  visibleTo:['ops','kepsek'] },
    { id:'ops_kesiswaan',   nama:'Manajemen Data Peserta Didik (Kesiswaan)',   icon:'🎓', role:'ops',         urutan:3,  visibleTo:['ops','kepsek'] },
    { id:'ops_kurikulum',   nama:'Manajemen Kurikulum, Rombel, dan e-Rapor',  icon:'📋', role:'ops',         urutan:4,  visibleTo:['ops','kepsek'] },
    { id:'ops_digital',     nama:'Manajemen Asesmen & Platform Ekosistem Digital',icon:'💻',role:'ops',      urutan:5,  visibleTo:['ops','kepsek'] },

    // ══════ TATA USAHA (5 Kategori) ══════
    { id:'tu_persuratan',   nama:'Manajemen Persuratan & Kearsipan (Korespondensi)',icon:'✉️',role:'tu',     urutan:1,  visibleTo:['tu','kepsek'] },
    { id:'tu_kepegawaian',  nama:'Administrasi Kepegawaian Dasar (Personnel File)',icon:'📂',role:'tu',      urutan:2,  visibleTo:['tu','kepsek'] },
    { id:'tu_kesiswaan',    nama:'Administrasi Kesiswaan Fisik & Legalitas Mutasi',icon:'📝',role:'tu',     urutan:3,  visibleTo:['tu','kepsek'] },
    { id:'tu_layanan',      nama:'Layanan Publik & Hubungan Masyarakat',       icon:'🤝', role:'tu',         urutan:4,  visibleTo:['tu','kepsek'] },
    { id:'tu_inventaris',   nama:'Manajemen Logistik & Inventaris Habis Pakai',icon:'📦', role:'tu',         urutan:5,  visibleTo:['tu','kepsek'] },

    // ══════ GPK / KOORDINATOR INKLUSI (5 Kategori) ══════
    { id:'gpk_identifikasi',nama:'Identifikasi & Asesmen Diagnostik',         icon:'🔍', role:'gpk',         urutan:1,  visibleTo:['gpk','kepsek'] },
    { id:'gpk_ppi',         nama:'Perencanaan Program Individual (PPI)',       icon:'📋', role:'gpk',         urutan:2,  visibleTo:['gpk','kepsek'] },
    { id:'gpk_monitoring',  nama:'Pelaksanaan & Pemantauan Perilaku',         icon:'📡', role:'gpk',         urutan:3,  visibleTo:['gpk','kepsek'] },
    { id:'gpk_rapor',       nama:'Evaluasi & Pelaporan Kualitatif (Rapor Inklusi)',icon:'📊',role:'gpk',     urutan:4,  visibleTo:['gpk','kepsek'] },
    { id:'gpk_kemitraan',   nama:'Kemitraan & Kolaborasi Lintas Pihak',       icon:'🤝', role:'gpk',         urutan:5,  visibleTo:['gpk','kepsek'] },

    // ══════ PEMBINA EKSKUL (5 Kategori) ══════
    { id:'eks_program',     nama:'Perencanaan & Desain Program (Program Kerja)',icon:'📋', role:'ekskul',     urutan:1,  visibleTo:['ekskul','kepsek'] },
    { id:'eks_keanggotaan', nama:'Manajemen Keanggotaan & Kehadiran',         icon:'📝', role:'ekskul',      urutan:2,  visibleTo:['ekskul','kepsek'] },
    { id:'eks_operasional', nama:'Pelaksanaan & Operasional Lapangan',        icon:'🏃', role:'ekskul',      urutan:3,  visibleTo:['ekskul','kepsek'] },
    { id:'eks_prestasi',    nama:'Penilaian, Talenta & Bank Prestasi',        icon:'🏆', role:'ekskul',      urutan:4,  visibleTo:['ekskul','kepsek'] },
    { id:'eks_event',       nama:'Pelaporan & Event Khusus (Event Management)',icon:'🎊', role:'ekskul',     urutan:5,  visibleTo:['ekskul','kepsek'] },

    // ══════ PUSTAKAWAN (5 Kategori) ══════
    { id:'perp_ekosistem',  nama:'Perencanaan & Manajemen Ekosistem Literasi', icon:'📚', role:'pustakawan',  urutan:1,  visibleTo:['pustakawan','kepsek'] },
    { id:'perp_katalog',    nama:'Pengolahan Bahan Pustaka (Katalogisasi)',    icon:'📝', role:'pustakawan',  urutan:2,  visibleTo:['pustakawan','kepsek'] },
    { id:'perp_sirkulasi',  nama:'Administrasi Sirkulasi & Layanan Pengguna', icon:'🔄', role:'pustakawan',  urutan:3,  visibleTo:['pustakawan','kepsek'] },
    { id:'perp_literasi',   nama:'Program Literasi & Dukungan Deep Learning', icon:'📖', role:'pustakawan',  urutan:4,  visibleTo:['pustakawan','kepsek'] },
    { id:'perp_penyiangan', nama:'Pemeliharaan, Penyiangan & Pelaporan',      icon:'📊', role:'pustakawan',  urutan:5,  visibleTo:['pustakawan','kepsek'] },
  ],

  // ─────────────────────────────────────────────────────────────────────
  // TEMPLATES — Satu template per kategori, AI Prompt + Components penuh
  // ─────────────────────────────────────────────────────────────────────
  TEMPLATES: [

    // ══════════════════════════════════════════
    // KEPALA SEKOLAH (5 template)
    // ══════════════════════════════════════════
    {
      id: 'ks_perencanaan', role: 'kepsek', kategori: 'ks_perencanaan',
      nama: 'Perencanaan Satuan Pendidikan', icon: '🎯',
      desc: 'Dokumen kompas sekolah: KOSP, PBD, RKT, RKJM.',
      items: [
        {
          id: 'kosp', nama: 'Kurikulum Operasional (KOSP)', icon: '📑',
          components: [
            { id: 'karakteristik', label: 'Analisis Karakteristik (Lingkungan, Sosial, Budaya)', type: 'textarea' },
            { id: 'visi_misi', label: 'Visi, Misi, dan Tujuan Sekolah', type: 'textarea' },
            { id: 'pengorganisasian', label: 'Pengorganisasian Pembelajaran (Intra & Ekstrakurikuler)', type: 'textarea' },
            { id: 'rencana', label: 'Rencana Pembelajaran', type: 'textarea' },
            { id: 'evaluasi', label: 'Pendampingan, Evaluasi, dan Pengembangan Profesional', type: 'textarea' }
          ],
          ai_prompt: "Anda adalah Konsultan Manajemen Pendidikan Ahli. Kembangkan draf resmi KOSP yang komprehensif sesuai standar Kurikulum Merdeka.\n\n1. BAB I KARAKTERISTIK: {{karakteristik}}\n2. BAB II VISI-MISI & 8 Dimensi PPP: {{visi_misi}}\n3. BAB III PENGORGANISASIAN: {{pengorganisasian}}\n4. BAB IV RENCANA PEMBELAJARAN: {{rencana}}\n5. BAB V EVALUASI & PENGEMBANGAN: {{evaluasi}}\n\nGunakan gaya bahasa formal kedinasan tingkat tinggi."
        },
        {
          id: 'pbd', nama: 'Perencanaan Berbasis Data (PBD)', icon: '📊',
          components: [
            { id: 'rapor', label: 'Analisis Rapor Pendidikan', type: 'textarea' },
            { id: 'refleksi', label: 'Dokumen Refleksi dan Benahi', type: 'textarea' },
            { id: 'rkt', label: 'Lembar Kerja RKT', type: 'textarea' },
            { id: 'rkas', label: 'Rencana Kerja dan Anggaran Sekolah (RKAS)', type: 'textarea' }
          ],
          ai_prompt: "Bertindaklah sebagai Auditor Perencanaan Pendidikan. Susun Laporan PBD untuk landasan RKAS.\n\n1. RINGKASAN RAPOR PENDIDIKAN: {{rapor}}.\n2. REFLEKSI & AKAR MASALAH: {{refleksi}}.\n3. PENYELARASAN RKT: {{rkt}}.\n4. PROYEKSI RKAS: {{rkas}}."
        }
      ]
    },
    {
      id: 'ks_supervisi', role: 'kepsek', kategori: 'ks_supervisi',
      nama: 'Kepemimpinan Pembelajaran & Supervisi', icon: '🔭',
      desc: 'Instrumen kepengawasan pembelajaran dan pembinaan guru.',
      items: [
        {
          id: 'jadwal_supervisi', nama: 'Jadwal & Instrument Supervisi Kelas', icon: '📋',
          components: [
            { id: 'jadwal_kunjungan', label: 'Jadwal Kunjungan Kelas per Guru', type: 'textarea' },
            { id: 'aspek_observasi', label: 'Aspek yang Diobservasi (Perencanaan, Pelaksanaan, Penilaian)', type: 'textarea' },
            { id: 'catatan_hasil', label: 'Catatan Hasil Observasi & Rekomendasi Pembinaan', type: 'textarea' }
          ],
          ai_prompt: "Sebagai Kepala Sekolah Penggerak. Rancang program supervisi yang memberdayakan bukan menghakimi.\n\n1. JADWAL SUPERVISI: {{jadwal_kunjungan}}.\n2. INSTRUMEN OBSERVASI: {{aspek_observasi}}.\n3. LAPORAN PEMBINAAN: {{catatan_hasil}}."
        }
      ]
    },
    {
      id: 'ks_sdm', role: 'kepsek', kategori: 'ks_sdm',
      nama: 'Manajemen SDM & Kepegawaian', icon: '👥',
      desc: 'SK tugas tambahan, pembagian tugas, pembinaan karir.',
      items: [
        {
          id: 'sk_tugas_tambahan', nama: 'SK Tugas Tambahan & Pembagian Tugas', icon: '⚖️',
          components: [
            { id: 'daftar_guru', label: 'Daftar Nama Guru & Spesialisasi', type: 'textarea' },
            { id: 'tugas_tambahan', label: 'Rincian Tugas Tambahan (Walas, Kesiswaan, Humas)', type: 'textarea' },
            { id: 'jam_mengajar', label: 'Beban Jam Mengajar per Guru (per Minggu)', type: 'textarea' }
          ],
          ai_prompt: "Sebagai Administrator Kepegawaian. Susun SK pembagian tugas yang merata dan legal.\n\n1. FORMASI PERSONALIA: {{daftar_guru}}.\n2. DISTRIBUSI TUGAS TAMBAHAN: {{tugas_tambahan}}.\n3. BEBAN MENGAJAR (≥24 jam/minggu): {{jam_mengajar}}."
        }
      ]
    },
    {
      id: 'ks_sarpras', role: 'kepsek', kategori: 'ks_sarpras',
      nama: 'Manajemen Operasional & Sarana Prasarana', icon: '🏢',
      desc: 'Pengelolaan aset, inventaris, dan kesiswaan makro.',
      items: [
        {
          id: 'admin_sarpras', nama: 'Administrasi Sarpras & Inventaris', icon: '📦',
          components: [
            { id: 'buku_inventaris', label: 'Ringkasan Buku Inventaris (Tanah, Bangunan, Aset Digital)', type: 'textarea' },
            { id: 'kebutuhan', label: 'Analisis Kebutuhan & Proposal Pengajuan (DAK/BOS)', type: 'textarea' },
            { id: 'penghapusan', label: 'Justifikasi Penghapusan Barang Milik Daerah', type: 'textarea' }
          ],
          ai_prompt: "Sebagai Manajer Aset Negara (PPK). Susun Dokumen Pertanggungjawaban Manajemen Sarpras.\n\n1. UPDATE INVENTARIS: {{buku_inventaris}}.\n2. PROPOSAL PENGAJUAN DAK: {{kebutuhan}}.\n3. BERITA ACARA PENGHAPUSAN: {{penghapusan}}."
        },
        {
          id: 'admin_kesiswaan', nama: 'Administrasi Kesiswaan (Makro)', icon: '🎓',
          components: [
            { id: 'ppdb', label: 'Metrik & Evaluasi PPDB (Afirmasi/Zonasi)', type: 'textarea' },
            { id: 'buku_induk', label: 'Laporan Sinkronisasi Buku Induk/Dapodik', type: 'textarea' },
            { id: 'mutasi', label: 'Data Pergerakan Siswa (Mutasi Keluar/Masuk/Lulus)', type: 'textarea' },
            { id: 'kehadiran', label: 'Isu Strategis Kehadiran & Angka Putus Sekolah', type: 'textarea' }
          ],
          ai_prompt: "Sebagai Ahli Supervisi Kesiswaan. Buat Laporan Penyelenggaraan Kesiswaan tingkat satuan.\n\n1. PPDB: {{ppdb}}.\n2. VALIDITAS DATA POKOK: {{buku_induk}}.\n3. DINAMIKA PERPUTARAN SISWA: {{mutasi}}.\n4. STUDENT RETENTION: {{kehadiran}}."
        }
      ]
    },
    {
      id: 'ks_humas', role: 'kepsek', kategori: 'ks_humas',
      nama: 'Hubungan Masyarakat & Pelaporan', icon: '🤝',
      desc: 'MoU kemitraan, LPJ tahunan, dan akuntabilitas kinerja.',
      items: [
        {
          id: 'admin_kemitraan', nama: 'Administrasi Kemitraan (MoU)', icon: '🤝',
          components: [
            { id: 'komite', label: 'Program Sinergi dan Peran Komite Sekolah', type: 'textarea' },
            { id: 'mou_luar', label: 'Ruang Lingkup Kerja Sama Pihak Luar (Puskesmas/Polsek/DUDI)', type: 'textarea' }
          ],
          ai_prompt: "Sebagai Ahli Hubungan Eksternal Institusi Pendidikan. Rancang draf MoU formal.\n\n1. KEMITRAAN KOMITE SEKOLAH: {{komite}}.\n2. MoU PIHAK EKSTERNAL: {{mou_luar}}.\n\nGunakan bahasa hukum positif Indonesia yang baku dan mengikat."
        },
        {
          id: 'lpj', nama: 'Laporan Pertanggungjawaban (LPJ)', icon: '📑',
          components: [
            { id: 'bos', label: 'Ringkasan Capaian dan Realisasi Dana BOS', type: 'textarea' },
            { id: 'eds', label: 'Sorotan/Temuan Evaluasi Diri Sekolah (EDS)', type: 'textarea' },
            { id: 'akip', label: 'Laporan Akuntabilitas Kinerja (AKIP)', type: 'textarea' }
          ],
          ai_prompt: "Berperan sebagai Akuntan Publik/Auditor Internal. Rumuskan LPJ Tahunan Satuan Pendidikan.\n\n1. REALISASI DANA BOSP: {{bos}}.\n2. EDS: {{eds}}.\n3. AKIP: {{akip}}."
        }
      ]
    },

    // ══════════════════════════════════════════
    // GURU KELAS (10 template)
    // ══════════════════════════════════════════
    {
      id: 'gk_perencanaan', role: 'guru', kategori: 'gk_perencanaan',
      nama: 'Perencanaan Pembelajaran (Intrakurikuler & Kokurikuler)', icon: '📚',
      desc: 'Rancangan instruksional harian untuk intrakurikuler dan proyek P5.',
      items: [
        {
          id: 'analisis_cp_atp', nama: 'Analisis CP dan ATP', icon: '🎯',
          components: [
            { id: 'salinan_cp', label: 'Salinan Deskripsi CP Fase', type: 'textarea' },
            { id: 'esensi', label: 'Esensi Materi Inti (Topik)', type: 'textarea' },
            { id: 'rumusan_tp', label: 'Rumusan Tujuan Pembelajaran (TP)', type: 'textarea' },
            { id: 'alur_waktu', label: 'Alokasi Waktu dan Urutan ATP Semester', type: 'textarea' }
          ],
          ai_prompt: "Bertindaklah sebagai Pakar Pengembang Kurikulum Operasional SD. Susun Analisis CP dan ATP berstandar nasional.\n\n1. ANALISIS ELEMEN CP: {{salinan_cp}}.\n2. PEMETAAN MATERI INTI: {{esensi}}.\n3. RUMUSAN TP DEEP LEARNING (ajukan HOTS bukan LOTS): {{rumusan_tp}}.\n4. ALUR & ALOKASI WAKTU: {{alur_waktu}}."
        },
        {
          id: 'modul_ajar', nama: 'Modul Ajar Berdiferensiasi', icon: '📖',
          components: [
            { id: 'identitas', label: 'Identitas Modul (Mapel, Kelas, Durasi)', type: 'textarea' },
            { id: 'tujuan', label: 'Tujuan & Pertanyaan Pemantik', type: 'textarea' },
            { id: 'langkah', label: 'Langkah Pembelajaran Berdiferensiasi (Visual, Auditori, Kinestetik)', type: 'textarea' },
            { id: 'asesmen', label: 'Skenario Asesmen Formatif & Sumber Belajar', type: 'textarea' }
          ],
          ai_prompt: "Sebagai Ahli Pedagogik Berdiferensiasi, rombak draf ini menjadi Modul Ajar Kurikulum Merdeka siap cetak.\n\n1. INFO UMUM: {{identitas}} dengan pertanyaan pemantik: {{tujuan}}.\n2. SKENARIO BERDIFERENSIASI (Visual/Auditori/Kinestetik): {{langkah}}.\n3. ASESMEN & MEDIA: {{asesmen}}."
        },
        {
          id: 'kokurikuler_p5', nama: 'Perencanaan Kokurikuler (P5)', icon: '🌱',
          components: [
            { id: 'topik', label: 'Topik P5 atau Proyek Kontekstual', type: 'textarea' },
            { id: 'profil', label: 'Pemetaan Dimensi Profil Pelajar Pancasila', type: 'textarea' },
            { id: 'alur', label: 'Alur Eksplorasi & Tahapan Proyek', type: 'textarea' },
            { id: 'output', label: 'Hasil/Produk Akhir yang Diharapkan', type: 'textarea' }
          ],
          ai_prompt: "Sebagai Guru Fasilitator P5. Rancang kerangka kerja P5 yang high-impact dan low-budget.\n\n1. KARAKTERISTIK PROYEK: {{topik}}.\n2. PROFIL LULUSAN: {{profil}}.\n3. ALUR P5 (Kenali, Selidiki, Lakukan, Genapi): {{alur}}.\n4. OUTPUT KARYA: {{output}}."
        }
      ]
    },
    {
      id: 'gk_asesmen', role: 'guru', kategori: 'gk_asesmen',
      nama: 'Asesmen dan Evaluasi Belajar', icon: '📈',
      desc: 'Perekaman jejak akademik dan karakter formatif-sumatif.',
      items: [
        {
          id: 'daftar_nilai', nama: 'Buku Daftar Nilai (Intrakurikuler)', icon: '📘',
          components: [
            { id: 'diagnostik', label: 'Hasil Asesmen Awal (Diagnostik)', type: 'textarea' },
            { id: 'formatif', label: 'Rekap Nilai Formatif (Proses Belajar)', type: 'textarea' },
            { id: 'sumatif', label: 'Nilai Sumatif (Akhir Lingkup Materi)', type: 'textarea' },
            { id: 'kompetensi', label: 'Catatan Kualitatif Penguasaan Kompetensi', type: 'textarea' }
          ],
          ai_prompt: "Anda adalah Guru Pengolah Data Akademik. Buat narasi penilaian untuk Daftar Nilai.\n\n1. DIAGNOSIS AWAL: {{diagnostik}}.\n2. RATING FORMATIF: {{formatif}}.\n3. CAPAIAN SUMATIF: {{sumatif}}.\n4. NARASI INTERVENSI (feedback + remedial): {{kompetensi}}."
        },
        {
          id: 'buku_rapor', nama: 'Buku Rapor Siswa Terpadu', icon: '📂',
          components: [
            { id: 'nilai_angka', label: 'Tabel/Rekap Nilai Angka Mapel', type: 'textarea' },
            { id: 'narasi_akademik', label: 'Narasi Capaian Akademik', type: 'textarea' },
            { id: 'narasi_karakter', label: 'Narasi Pertumbuhan Karakter (P5)', type: 'textarea' },
            { id: 'kehadiran', label: 'Rekapitulasi Kehadiran & Ekstrakurikuler', type: 'textarea' }
          ],
          ai_prompt: "Anda adalah Wali Kelas. Rangkum semua input menjadi Deskripsi Rapor final siap cetak.\n\nData:\n- Kuantitatif: {{nilai_angka}}\n- Akademik: {{narasi_akademik}}\n- Karakter P5: {{narasi_karakter}}\n- Kehadiran: {{kehadiran}}\n\nFormulasikan narasi heartwarming namun jujur: Pendahuluan → Sorotan Akademik → Sorotan Karakter → Kesimpulan."
        }
      ]
    },
    {
      id: 'gk_kelaskelas', role: 'guru', kategori: 'gk_kelaskelas',
      nama: 'Manajemen dan Tata Kelola Kelas', icon: '📋',
      desc: 'Tugas operasional keseharian, jurnal mengajar, dan kelengkapan ruang kelas.',
      items: [
        {
          id: 'buku_presensi', nama: 'Buku Presensi Kehadiran', icon: '✅',
          components: [
            { id: 'rekap_harian', label: 'Rekap Kehadiran (Sakit, Izin, Alpa)', type: 'textarea' },
            { id: 'persentase', label: 'Persentase Kehadiran Bulanan', type: 'textarea' },
            { id: 'keterangan', label: 'Keterangan Khusus / Isu Ketidakhadiran', type: 'textarea' }
          ],
          ai_prompt: "Sebagai Wali Kelas. Buat rekapitulasi presensi kehadiran bulanan.\n\n1. Distribusi absensi: {{rekap_harian}}.\n2. Metrik persentase: {{persentase}}.\n3. Isu spesifik & rencana tindak lanjut: {{keterangan}}."
        },
        {
          id: 'jurnal_mengajar', nama: 'Jurnal Mengajar Harian', icon: '📓',
          components: [
            { id: 'jam_topik', label: 'Hari/Tgl, Jam Ke-, Topik yang dibahas', type: 'textarea' },
            { id: 'siswa_absen', label: 'Daftar Siswa Tidak Hadir', type: 'textarea' },
            { id: 'catatan_kejadian', label: 'Catatan Kejadian Kelas (Hambatan/Antusiasme)', type: 'textarea' }
          ],
          ai_prompt: "Tulis ulang catatan kasar ini menjadi Jurnal Mengajar Harian Profesional.\n\nPelaksanaan: {{jam_topik}}.\nSiswa tidak hadir: {{siswa_absen}}.\nEvaluasi reflektif: {{catatan_kejadian}}."
        }
      ]
    },
    {
      id: 'gk_bimbingan', role: 'guru', kategori: 'gk_bimbingan',
      nama: 'Bimbingan dan Profil Kesiswaan', icon: '🚸',
      desc: 'Pusat rekam jejak psikologis, layanan BK dasar, dan catatan kepribadian anak.',
      items: [
        {
          id: 'profil_belajar', nama: 'Profil Belajar & Diagnostik', icon: '🆔',
          components: [
            { id: 'gaya_belajar', label: 'Peta Gaya Belajar (Visual, Auditori, Kinestetik)', type: 'textarea' },
            { id: 'minat_bakat', label: 'Pemetaan Potensi Minat & Bakat', type: 'textarea' },
            { id: 'kondisi_keluarga', label: 'Analisis Dukungan dan Kondisi Keluarga', type: 'textarea' }
          ],
          ai_prompt: "Bertindaklah sebagai Konselor Pendidikan. Satukan data survei menjadi Laporan Profil Belajar Siswa.\n\n1. GAYA BELAJAR DOMINAN: {{gaya_belajar}}.\n2. PEMETAAN POTENSI: {{minat_bakat}}.\n3. LATAR KELUARGA: {{kondisi_keluarga}}."
        },
        {
          id: 'catatan_anekdotal', nama: 'Buku Catatan Anekdotal', icon: '📝',
          components: [
            { id: 'kronologis', label: 'Hari/Tanggal, Nama Siswa, Kronologis Peristiwa', type: 'textarea' },
            { id: 'kasus', label: 'Deskripsi Pelanggaran / Perilaku Menonjol Positif', type: 'textarea' },
            { id: 'restitusi', label: 'Tindakan Penanganan (Segitiga Restitusi)', type: 'textarea' }
          ],
          ai_prompt: "Sebagai Ahli Disiplin Positif. Formulasikan insiden siswa menjadi Catatan Anekdotal yang adil psikologis.\n\nFakta: {{kronologis}}.\nPerincian: {{kasus}}.\nRestitusi (Stabilkan → Validasi → Keyakinan): {{restitusi}}."
        },
        {
          id: 'komunikasi_ortu', nama: 'Buku Penghubung (Komunikasi Wali)', icon: '💌',
          components: [
            { id: 'pesan_guru', label: 'Pemberitahuan/Peringatan Akademik dari Guru', type: 'textarea' },
            { id: 'tanggapan', label: 'Catatan/Tanggapan Orang Tua', type: 'textarea' },
            { id: 'tindak_lanjut', label: 'Rencana Pertemuan / Tindak Lanjut', type: 'textarea' }
          ],
          ai_prompt: "Sebagai Pakar Mediasi Sekolah-Keluarga. Susun laporan Buku Penghubung yang transparan namun hangat.\n\nPemberitahuan: {{pesan_guru}}.\nRekam jejak tanggapan: {{tanggapan}}.\nAjakan tindak lanjut: {{tindak_lanjut}}."
        }
      ]
    },
    {
      id: 'gk_kinerja', role: 'guru', kategori: 'gk_kinerja',
      nama: 'Pengembangan Keprofesian & Kinerja Guru', icon: '🎖️',
      desc: 'Integrasi e-Kinerja (PMM) dan pelaporan bukti dukung ASN.',
      items: [
        {
          id: 'admin_ekinerja', nama: 'Administrasi e-Kinerja (PMM)', icon: '🏛️',
          components: [
            { id: 'rhk', label: 'Rencana Hasil Kerja (RHK) Tahunan', type: 'textarea' },
            { id: 'bukti_dukung', label: 'Daftar Bukti Dukung (Sertifikat/Webinar/Aksi Nyata)', type: 'textarea' },
            { id: 'rubrik_observasi', label: 'Hasil Rubrik Observasi Kinerja dari Kepala Sekolah', type: 'textarea' }
          ],
          ai_prompt: "Sebagai Verifikator Akuntabilitas ASN. Susun Draf Laporan e-Kinerja PMM.\n\n1. KONTRAK RHK: {{rhk}}.\n2. ANALISIS BUKTI DUKUNG: {{bukti_dukung}}.\n3. REFLEKSI OBSERVASI (constructive feedback): {{rubrik_observasi}}."
        }
      ]
    },
    {
      id: 'gk_prates', role: 'guru', kategori: 'gk_prates',
      nama: 'Pra-Tes: Perencanaan & Desain Evaluasi', icon: '🗺️',
      desc: 'Pemetaan TP dan penyusunan kisi-kisi ujian berstandar Deep Learning.',
      items: [
        {
          id: 'prates_kisi_kisi', nama: 'Pemetaan & Kisi-Kisi Ujian', icon: '🗺️',
          components: [
            { id: 'pemetaan_tp', label: 'Daftar Tujuan Pembelajaran & Persentase Tes', type: 'textarea' },
            { id: 'indikator_level', label: 'Indikator Soal (ABCD) & Komposisi Level Kognitif (Min 40% HOTS)', type: 'textarea' },
            { id: 'bentuk_bobot', label: 'Bentuk Soal (PG, Isian, Uraian) & Bobot Skor', type: 'textarea' }
          ],
          ai_prompt: "Sebagai Pakar Evaluasi Pendidikan Dasar. Terjemahkan draf menjadi Kisi-Kisi Ujian standar Deep Learning.\n\n1. ANALISIS KOGNITIF: {{indikator_level}} — pastikan 40%+ HOTS.\n2. DISTRIBUSI BOBOT: {{bentuk_bobot}} sesuai TP: {{pemetaan_tp}}."
        }
      ]
    },
    {
      id: 'gk_instrumen', role: 'guru', kategori: 'gk_instrumen',
      nama: 'Pembuatan Instrumen Tes: Core Database Soal', icon: '📄',
      desc: 'Bank stimulus, naskah soal HOTS, dan rubrik penskoran berjenjang.',
      items: [
        {
          id: 'instrumen_soal_rubrik', nama: 'Bank Stimulus, Naskah Soal & Rubrik', icon: '📄',
          components: [
            { id: 'bank_stimulus', label: 'Draf Stimulus Soal (Artikel, Infografis, Tabel, Kasus Fiktif)', type: 'textarea' },
            { id: 'draft_pertanyaan', label: 'Kartu Soal Utama & Pilihan Pengecoh/Distraktor', type: 'textarea' },
            { id: 'rubrik_analitik', label: 'Kunci Jawaban & Rubrik Penskoran Berjenjang (Skor 0-4)', type: 'textarea' }
          ],
          ai_prompt: "Sebagai Reviewer Soal HOTS tingkat SD. Bangun instrumen yang valid secara epistemologi.\n\n1. KONSTRUKSI STIMULUS: {{bank_stimulus}}.\n2. ANALISIS DISTRAKTOR: {{draft_pertanyaan}}.\n3. RUBRIK SKORING: {{rubrik_analitik}}."
        }
      ]
    },
    {
      id: 'gk_validasi', role: 'guru', kategori: 'gk_validasi',
      nama: 'Validasi & Verifikasi Tahap Pra-Ujian', icon: '🔎',
      desc: 'Quality Control soal: kesesuaian indikator dan kelayakan bahasa.',
      items: [
        {
          id: 'validasi_telaah_soal', nama: 'Lembar Telaah / Validasi QC Tes', icon: '🔎',
          components: [
            { id: 'telaah_materi', label: 'Inspeksi Aspek Materi (Kesesuaian Indikator)', type: 'textarea' },
            { id: 'telaah_konstruksi', label: 'Inspeksi Konstruksi Pilihan & Kesopanan Bahasa (EYD)', type: 'textarea' }
          ],
          ai_prompt: "Sebagai Quality Control (QC) Asesmen Sekolah. Lakukan proof-reading kritis.\n\n1. KESALAHAN METODOLOGI: {{telaah_materi}}.\n2. PEMBEDAHAN LINGUISTIK: {{telaah_konstruksi}}."
        }
      ]
    },
    {
      id: 'gk_pelaksanaan', role: 'guru', kategori: 'gk_pelaksanaan',
      nama: 'Administrasi Pelaksanaan Ujian', icon: '📐',
      desc: 'Daftar hadir, berita acara, dan tata tertib ruang ujian.',
      items: [
        {
          id: 'administrasi_pelaksanaan', nama: 'Administrasi Ruang Ujian (Sumatif)', icon: '📐',
          components: [
            { id: 'absen_beritaacara', label: 'Daftar Hadir & Berita Acara Ujian', type: 'textarea' },
            { id: 'tatatertib', label: 'Tata Tertib / Pakta Larangan Curang', type: 'textarea' }
          ],
          ai_prompt: "Sebagai Pengawas Silang Ujian. Rapikan administrasi ruang ujian.\n\nBerita Acara sah dari: {{absen_beritaacara}}.\nPeraturan Do & Don't: {{tatatertib}}."
        }
      ]
    },
    {
      id: 'gk_pascates', role: 'guru', kategori: 'gk_pascates',
      nama: "Pasca-Tes: Analisis, Evaluasi & Tindak Lanjut", icon: '📊',
      desc: 'Analisis butir soal, rekap kegagalan TP, dan rencana remedial-pengayaan.',
      items: [
        {
          id: 'pascates_analisis', nama: 'Analisis Butir & Tindak Lanjut', icon: '📈',
          components: [
            { id: 'analisis_kuantitatif', label: 'Matriks Data Kuantitatif (Daya Serap, Kesukaran, Daya Beda)', type: 'textarea' },
            { id: 'rekapitulasi', label: 'Rekap Kualitatif (TP mana yang tuntas/Gagal)', type: 'textarea' },
            { id: 'remedial_pengayaan', label: 'Rencana Remedial & Pengayaan', type: 'textarea' }
          ],
          ai_prompt: "Sebagai Ilmuwan Data Pendidikan. Olah raw data ujian menjadi keputusan Tindak Lanjut.\n\n1. FORENSIK ANGKA: {{analisis_kuantitatif}}.\n2. EKSTRAKSI KEGAGALAN TP: {{rekapitulasi}}.\n3. RTL REMEDIAL & ENRICHMENT: {{remedial_pengayaan}}."
        }
      ]
    },

    // ══════════════════════════════════════════
    // GURU PAI (10 template)
    // ══════════════════════════════════════════
    {
      id: 'pai_perencanaan', role: 'guru_pai', kategori: 'pai_perencanaan',
      nama: 'Perencanaan Pembelajaran PAI', icon: '🕌',
      desc: 'Instrumen perencanaan PAI berbasis 5 elemen Kurikulum Merdeka.',
      items: [
        {
          id: 'analisis_cp_pai', nama: 'Analisis CP & ATP PAI', icon: '🎯',
          components: [
            { id: 'cp_pai', label: 'Capaian Pembelajaran PAI per Fase', type: 'textarea' },
            { id: 'peta_materi', label: 'Peta Materi 5 Elemen PAI (Al-Quran, Aqidah, Fikih, Akhlak, SPI)', type: 'textarea' },
            { id: 'tp_pai', label: 'Rumusan Tujuan Pembelajaran PAI', type: 'textarea' }
          ],
          ai_prompt: "Bertindaklah sebagai Pengembang Kurikulum PAI. Susun Analisis CP dan ATP PAI.\n\n1. ANALISIS CP — 5 Elemen: {{cp_pai}}.\n2. PETA MATERI: {{peta_materi}}.\n3. RUMUSAN TP (kontekstual, bukan dogmatis): {{tp_pai}}."
        },
        {
          id: 'modul_ajar_pai', nama: 'Modul Ajar & RPP PAI', icon: '📖',
          components: [
            { id: 'identitas_pai', label: 'Identitas Modul (Kelas, Semester, Elemen)', type: 'textarea' },
            { id: 'metode_pai', label: 'Strategi Pembelajaran (Rihlah, Simulasi Ibadah, Diskusi)', type: 'textarea' },
            { id: 'media_pai', label: 'Media Ajar & Sumber Belajar', type: 'textarea' }
          ],
          ai_prompt: "Sebagai Guru PAI Kreatif. Rancang Modul Ajar yang engaging dan bebas dari hafalan semata.\n\n1. INFO UMUM: {{identitas_pai}}.\n2. STRATEGI AKTIF: {{metode_pai}}.\n3. MEDIA INFORMATIF: {{media_pai}}."
        }
      ]
    },
    {
      id: 'pai_asesmen', role: 'guru_pai', kategori: 'pai_asesmen',
      nama: 'Asesmen dan Evaluasi Keagamaan', icon: '📊',
      desc: 'Nilai kognitif, praktik ibadah, BTQ, dan observasi akhlak.',
      items: [
        {
          id: 'nilai_kognitif', nama: 'Buku Nilai Kognitif/Teori PAI', icon: '📘',
          components: [
            { id: 'identitas_rombel', label: 'Nama Siswa & Rombel Kelas', type: 'textarea' },
            { id: 'formatif', label: 'Nilai Formatif Harian', type: 'textarea' },
            { id: 'sumatif', label: 'Nilai Sumatif (Akhir Bab / Semester)', type: 'textarea' },
            { id: 'deskripsi_teori', label: 'Deskripsi Ketercapaian Teori Agama', type: 'textarea' }
          ],
          ai_prompt: "Sebagai Akuntan Akademik PAI. Buat Laporan Nilai Kognitif yang bermutu.\n\nSasaran Kelas: {{identitas_rombel}}.\nPerangkat Nilai Harian: {{formatif}}.\nPencapaian Final: {{sumatif}}.\nNarasi Rapor Deskriptif (mengayomi namun faktual): {{deskripsi_teori}}."
        },
        {
          id: 'praktik_btq', nama: 'Format Penilaian Praktik & BTQ', icon: '🤲',
          components: [
            { id: 'praktik_wudhu', label: 'Rubrik Praktik Wudhu (Niat, Rukun, Tertib)', type: 'textarea' },
            { id: 'praktik_shalat', label: 'Rubrik Praktik Shalat Fardhu (Bacaan & Gerakan)', type: 'textarea' },
            { id: 'hafalan', label: 'Rekap Hafalan Surah (Juz Amma)', type: 'textarea' },
            { id: 'kemampuan_hijaiyah', label: 'Kemampuan Baca/Tulis Hijaiyah (Tajwid/Makhroj)', type: 'textarea' }
          ],
          ai_prompt: "Sebagai Penguji Ujian Praktik Agama. Konsolidasikan instrumen penilaian keterampilan keagamaan.\n\n1. TATA CARA WUDHU: {{praktik_wudhu}}.\n2. PRAKTIK SHALAT: {{praktik_shalat}}.\n3. BTQ & TAHFIDZ: {{hafalan}} + kefasihan makharijul huruf: {{kemampuan_hijaiyah}}."
        },
        {
          id: 'observasi_akhlak', nama: 'Lembar Observasi Akhlak (Budi Pekerti)', icon: '🕊️',
          components: [
            { id: 'indikator_adab', label: 'Indikator Adab (Keseharian & Kebersihan)', type: 'textarea' },
            { id: 'skala_penilaian', label: 'Skala Penilaian Kualitatif (MB, BSH, SB)', type: 'textarea' },
            { id: 'kejadian_spesifik', label: 'Catatan Kejadian Spesifik Terkait Moral/Perilaku', type: 'textarea' }
          ],
          ai_prompt: "Sebagai Guru PAI & Pendidik Moral. Ubah observasi lapangan menjadi Jurnal Akhlak berformat Standar Nasional.\n\nPilar adab: {{indikator_adab}}.\nData konversi kuantitatif: {{skala_penilaian}}.\nKasus perilaku moral: {{kejadian_spesifik}}."
        }
      ]
    },
    {
      id: 'pai_lintas', role: 'guru_pai', kategori: 'pai_lintas',
      nama: 'Manajemen Kelas Lintas Rombel', icon: '📋',
      desc: 'Jurnal mengajar harian dan presensi spesifik mapel agama lintas rombongan belajar.',
      items: [
        {
          id: 'jurnal_lintas_kelas', nama: 'Jurnal Mengajar Harian Lintas Kelas', icon: '📓',
          components: [
            { id: 'jadwal_kelas', label: 'Waktu/Jam Ke-, Kelas Tertentu (Misal 4A, 5B)', type: 'textarea' },
            { id: 'elemen_materi', label: 'Elemen Materi yang Diajarkan', type: 'textarea' },
            { id: 'absensi_kejadian', label: 'Jumlah Hadir/Absen & Catatan Kejadian KBM', type: 'textarea' }
          ],
          ai_prompt: "Sebagai Administrator Mapel Khusus Lintas Kelas. Kompilasikan Jurnal Harian Guru PAI.\n\n1. AGENDA MENGAJAR: {{jadwal_kelas}}.\n2. MUATAN KURIKULUM: {{elemen_materi}}.\n3. OBSERVASI KLINIK KELAS (kejadian & absensi): {{absensi_kejadian}}."
        },
        {
          id: 'presensi_mapel', nama: 'Presensi / Daftar Hadir Mapel PAI', icon: '✅',
          components: [
            { id: 'daftar_siswa', label: 'Daftar Nama Siswa Terpisah Tiap Kelas/Rombel', type: 'textarea' },
            { id: 'absen_khusus', label: 'Ceklis Kehadiran Jam Agama & Kendala', type: 'textarea' }
          ],
          ai_prompt: "Buat Format Daftar Kehadiran PAI agar wali kelas juga bisa melihat.\n\nPisahkan per rombongan belajar: {{daftar_siswa}}.\nRekap ketidakhadiran jam agama: {{absen_khusus}}."
        }
      ]
    },
    {
      id: 'pai_pembiasaan', role: 'guru_pai', kategori: 'pai_pembiasaan',
      nama: 'Pembiasaan Spiritual & Program Khusus Keagamaan', icon: '📿',
      desc: 'Pantauan ibadah harian, PHBI, dan pesantren kilat ramadhan.',
      items: [
        {
          id: 'pantauan_ibadah', nama: 'Buku Pantauan Ibadah Harian', icon: '🕋',
          components: [
            { id: 'ibadah_mandiri', label: 'Tabel Pantauan Shalat 5 Waktu & Mengaji di Rumah', type: 'textarea' },
            { id: 'ibadah_sekolah', label: 'Rekap Shalat Berjamaah (Dhuha/Dzuhur) di Sekolah', type: 'textarea' }
          ],
          ai_prompt: "Sebagai Mentor Tumbuh Kembang Karakter Keagamaan Anak. Buat Narasi Laporan Ibadah Spesifik.\n\n1. TATA KEHIDUPAN DI RUMAH: {{ibadah_mandiri}}.\n2. PEMBIASAAN DI SEKOLAH: {{ibadah_sekolah}}."
        },
        {
          id: 'admin_phbi', nama: 'Administrasi Peringatan Hari Besar Islam', icon: '🎊',
          components: [
            { id: 'proposal_phbi', label: 'Rancangan Proposal & Tujuan Acara', type: 'textarea' },
            { id: 'susunan_panitia', label: 'Susunan Kepanitiaan & Rincian Tugas', type: 'textarea' },
            { id: 'laporan_dokumentasi', label: 'Laporan Pasca-Kegiatan & Evaluasi', type: 'textarea' }
          ],
          ai_prompt: "Sebagai Ketua Panitia PHBI. Susun Proposal & LPJ Kegiatan Peringatan Hari Besar Islam.\n\n1. PENDAHULUAN & TUJUAN: {{proposal_phbi}}.\n2. STRUKTUR KEPANITIAAN: {{susunan_panitia}}.\n3. LPJ SINGKAT: {{laporan_dokumentasi}}."
        },
        {
          id: 'sanlat_ramadhan', nama: 'Program Pesantren Kilat (Sanlat)', icon: '⛺',
          components: [
            { id: 'silabus_sanlat', label: 'Silabus Materi & Jadwal Pemateri', type: 'textarea' },
            { id: 'lks_ramadhan', label: 'Jurnal Ramadhan / Lembar Kerja Siswa', type: 'textarea' },
            { id: 'evaluasi_akhir', label: 'Laporan Evaluasi Kesuksesan Sanlat', type: 'textarea' }
          ],
          ai_prompt: "Sebagai Ketua Program Pesantren Ramadhan. Susun Masterplan Pelaksanaan Sanlat Sekolah.\n\n1. DESAIN SILABUS KEKINIAN: {{silabus_sanlat}}.\n2. PANDUAN JURNAL RAMADHAN SISWA: {{lks_ramadhan}}.\n3. LAPORAN PENYELESAIAN PROGRAM: {{evaluasi_akhir}}."
        }
      ]
    },
    {
      id: 'pai_kinerja', role: 'guru_pai', kategori: 'pai_kinerja',
      nama: 'Pengembangan Keprofesian & Kinerja PAI (PMM)', icon: '🎖️',
      desc: 'e-Kinerja PMM khusus peningkatan spesialisasi Agama Islam.',
      items: [
        {
          id: 'ekinerja_pai', nama: 'Dokumen e-Kinerja PAI Terpadu', icon: '🏛️',
          components: [
            { id: 'rhk_pai', label: 'RHK Peningkatan Kualitas Pembelajaran PAI', type: 'textarea' },
            { id: 'bukti_dukung_pai', label: 'Bukti Dukung (Sertifikat KKG PAI/Bimtek Qiroati)', type: 'textarea' },
            { id: 'observasi_kepsek', label: 'Hasil Observasi Kelas dari Kepala Sekolah', type: 'textarea' }
          ],
          ai_prompt: "Sebagai Pejabat Analis Kepegawaian. Formulasikan Draf e-Kinerja Tahunan Guru PAI.\n\n1. INDIKATOR RHK RELIGIUSITAS: {{rhk_pai}}.\n2. VALIDASI BUKTI PROFESIONAL PAI: {{bukti_dukung_pai}}.\n3. FOLLOW-UP OBSERVASI (Action Plan): {{observasi_kepsek}}."
        }
      ]
    },
    {
      id: 'pai_prates', role: 'guru_pai', kategori: 'pai_prates',
      nama: 'Pra-Tes: Perencanaan Asesmen PAI (Teori & Praktik)', icon: '🗺️',
      desc: 'Kisi-kisi ganda: teori kognitif dan ujian praktik ibadah.',
      items: [
        {
          id: 'prates_perencanaan_pai', nama: 'Pemetaan TP & Kisi-Kisi Ganda', icon: '🗺️',
          components: [
            { id: 'pemetaan_5elemen', label: 'Beban Ujian per 5 Elemen PAI', type: 'textarea' },
            { id: 'kisi_kognitif', label: 'Kisi-Kisi Tertulis (Indikator Soal & Dominasi HOTS)', type: 'textarea' },
            { id: 'kisi_praktik', label: 'Kisi-Kisi Praktik (Indikator Unjuk Kerja Ibadah)', type: 'textarea' }
          ],
          ai_prompt: "Sebagai Ahli Evaluasi PAI. Pecah beban ujian agar tidak murni hafalan.\n\n1. PEMETAAN SEIMBANG (tertulis vs praktik): {{pemetaan_5elemen}}.\n2. KISI-KISI KOGNITIF L3/HOTS: {{kisi_kognitif}}.\n3. KISI-KISI PRAKTIK IBADAH: {{kisi_praktik}}."
        }
      ]
    },
    {
      id: 'pai_instrumen', role: 'guru_pai', kategori: 'pai_instrumen',
      nama: 'Pembuatan Instrumen Tes: Database Kognitif & Praktik', icon: '📄',
      desc: 'Bank stimulus dilema moral, soal kognitif, dan rubrik penilaian BTQ.',
      items: [
        {
          id: 'instrumen_soal_observasi', nama: 'Bank Stimulus & Lembar Observasi Praktik', icon: '📜',
          components: [
            { id: 'stimulus_dilema_moral', label: 'Bank Stimulus (Kisah Hikmah, Ayat, Dilema Moral)', type: 'textarea' },
            { id: 'kartu_soal_tertulis', label: 'Kartu Soal Kognitif (Pertanyaan terbuka / Pengecoh)', type: 'textarea' },
            { id: 'rubrik_praktik_btq', label: 'Rubrik Detail Praktik (Makhrijul Huruf, Tumakninah, Niat)', type: 'textarea' }
          ],
          ai_prompt: "Sebagai Penulis Soal PAI Kontekstual. Hindari ujian yang mencetak generasi dogmatis.\n\n1. STUDI KASUS MORAL: {{stimulus_dilema_moral}}.\n2. VALIDASI KARTU SOAL: {{kartu_soal_tertulis}}.\n3. MATRIKS OBSERVASI PRAKTIK: {{rubrik_praktik_btq}}."
        }
      ]
    },
    {
      id: 'pai_validasi', role: 'guru_pai', kategori: 'pai_validasi',
      nama: 'Validasi & Verifikasi Pra-Ujian', icon: '🔎',
      desc: 'Sensor soal: bebas radikalisme, kesesuaian usia SD, moderasi beragama.',
      items: [
        {
          id: 'validasi_telaah_sara', nama: 'Lembar Telaah / Sensor Soal (KKG PAI)', icon: '🔎',
          components: [
            { id: 'telaah_bebas_radikalisme', label: 'Inspeksi Bias Mazhab & Radikalisme pada Stimulus', type: 'textarea' },
            { id: 'telaah_kesesuaian_usia', label: 'Inspeksi Kesesuaian Bahasa & Tingkat Materi Usia SD', type: 'textarea' }
          ],
          ai_prompt: "Sebagai Tim Filter KKG PAI. Lakukan Quality Control ketat.\n\n1. MODERASI & TOLERANSI (pindai bias mazhab/radikalisme): {{telaah_bebas_radikalisme}}.\n2. RAMAH ANAK (sederhanakan bahasa teologis): {{telaah_kesesuaian_usia}}."
        }
      ]
    },
    {
      id: 'pai_pelaksanaan', role: 'guru_pai', kategori: 'pai_pelaksanaan',
      nama: 'Administrasi Pelaksanaan Ujian (Lintas Kelas)', icon: '📐',
      desc: 'Daftar hadir, berita acara, dan tata tertib ujian lintas kelas PAI.',
      items: [
        {
          id: 'admin_ujian_pai', nama: 'Berita Acara & Daftar Hadir Ujian PAI', icon: '📐',
          components: [
            { id: 'daftar_hadir_pai', label: 'Daftar Hadir Ujian (Tertulis & Praktik, per Kelas)', type: 'textarea' },
            { id: 'beritaacara_pai', label: 'Berita Acara Pelaksanaan & Kondisi Ujian', type: 'textarea' }
          ],
          ai_prompt: "Sebagai Pengawas Ujian PAI Lintas Kelas. Siapkan administrasi ujian yang tertib.\n\nDaftar hadir per kelas: {{daftar_hadir_pai}}.\nBerita acara kondisi pelaksanaan: {{beritaacara_pai}}."
        }
      ]
    },
    {
      id: 'pai_pascates', role: 'guru_pai', kategori: 'pai_pascates',
      nama: 'Pasca-Tes: Analisis, Evaluasi & Tindak Lanjut', icon: '📊',
      desc: 'Analisis daya serap, pemetaan ketuntasan praktik ibadah, dan RTL.',
      items: [
        {
          id: 'pascates_analisis_ibadah', nama: 'Analisis Kuantitatif & Progres Ibadah', icon: '📈',
          components: [
            { id: 'analisis_dayaserap', label: 'Matriks Ketuntasan Soal Tertulis (Kognitif)', type: 'textarea' },
            { id: 'rekapitulasi_ibadah', label: 'Pemetaan Ketuntasan Praktik Wudhu/Shalat', type: 'textarea' },
            { id: 'intervensi_btq', label: 'Rencana Praktik Ulang & Tutor Sebaya', type: 'textarea' }
          ],
          ai_prompt: "Sebagai Evaluator Internal Kemenag. Tentukan di mana kegagalan pengajaran berada.\n\n1. DIAGNOSA TEORI: {{analisis_dayaserap}}.\n2. PEMETAAN PERILAKU IBADAH: {{rekapitulasi_ibadah}}.\n3. RTL (intervensi tidak mempermalukan + Tutor Sebaya): {{intervensi_btq}}."
        }
      ]
    },

    // ══════════════════════════════════════════
    // GURU PJOK (10 template)
    // ══════════════════════════════════════════
    {
      id: 'pjok_perencanaan', role: 'guru_pjok', kategori: 'pjok_perencanaan',
      nama: 'Perencanaan Pembelajaran Lintas Ruang', icon: '🏃',
      desc: 'Instrumen perencanaan intrakurikuler dan proyek kesehatan lapangan.',
      items: [
        {
          id: 'analisis_cp_pjok', nama: 'Analisis CP & ATP PJOK', icon: '🎯',
          components: [
            { id: 'cp_pjok', label: 'Capaian Pembelajaran PJOK per Fase', type: 'textarea' },
            { id: 'elemen_gerak', label: 'Elemen (Keterampilan, Pengetahuan, Pemanfaatan Gerak)', type: 'textarea' },
            { id: 'tp_pjok', label: 'Rumusan TP Praktik & Teori PJOK', type: 'textarea' }
          ],
          ai_prompt: "Sebagai Pengembang Kurikulum PJOK. Susun Analisis CP dan ATP PJOK yang holistik.\n\n1. ANALISIS CP: {{cp_pjok}}.\n2. PEMETAAN ELEMEN GERAK (teori vs lapangan): {{elemen_gerak}}.\n3. RUMUSAN TP: {{tp_pjok}}."
        }
      ]
    },
    {
      id: 'pjok_asesmen', role: 'guru_pjok', kategori: 'pjok_asesmen',
      nama: 'Asesmen Jasmani, Keterampilan, dan Karakter', icon: '📊',
      desc: 'Nilai psikomotorik, kognitif strategi, TKJI, dan sportivitas lapangan.',
      items: [
        {
          id: 'nilai_keterampilan', nama: 'Format Penilaian Keterampilan Gerak (Psikomotorik)', icon: '🤸',
          components: [
            { id: 'rubrik_praktik', label: 'Rubrik Observasi Praktik Olahraga Spesifik', type: 'textarea' },
            { id: 'tingkat_penguasaan', label: 'Tingkat Penguasaan Motorik (Awal, Berkembang, Mahir)', type: 'textarea' },
            { id: 'catatan_remedial', label: 'Catatan Rencana Remedial / Penguatan Otot', type: 'textarea' }
          ],
          ai_prompt: "Sebagai Akuntan Kebugaran Fisik (Assessor PJOK). Buat Laporan Nilai Psikomotorik Jasmani.\n\nINDIKATOR GERAK: {{rubrik_praktik}}.\nANALISIS KUALITATIF MOTORIK: {{tingkat_penguasaan}}.\nPRESKRIPSI LATIHAN REMEDIAL: {{catatan_remedial}}."
        },
        {
          id: 'nilai_kognitif_pjok', nama: 'Daftar Nilai Pengetahuan Teori', icon: '🧠',
          components: [
            { id: 'teori_olahraga', label: 'Nilai Formatif/Sumatif Aturan Main & Strategi', type: 'textarea' },
            { id: 'teori_kesehatan', label: 'Nilai Teori Kesehatan (Bahaya Rokok, Gizi, Kebersihan)', type: 'textarea' },
            { id: 'deskripsi_rapor', label: 'Draft Deskripsi Rapor Gabungan Kognitif', type: 'textarea' }
          ],
          ai_prompt: "Sebagai Guru Ilmu Faal dan Teori Olahraga. Konsolidasikan nilai kognitif PJOK.\n\n1. PEMAHAMAN ATURAN PERMAINAN: {{teori_olahraga}}.\n2. LITERASI KESEHATAN ANAK: {{teori_kesehatan}}.\n3. FINALISASI DESKRIPSI RAPOR: {{deskripsi_rapor}}."
        },
        {
          id: 'kebugaran_tkji', nama: 'Buku Catatan Kebugaran (TKJI)', icon: '💪',
          components: [
            { id: 'data_antropometri', label: 'Data TB, BB, & IMT', type: 'textarea' },
            { id: 'hasil_tes_tkji', label: 'Hasil Tes Ketahanan (Lari, Push-Up/Sit-Up, Kelenturan)', type: 'textarea' },
            { id: 'rekomendasi_gizi', label: 'Catatan Khusus Pertumbuhan / Rekomendasi Gizi', type: 'textarea' }
          ],
          ai_prompt: "Sebagai Dokter Muda / Ahli Kinesiologi Sekolah (TKJI). Buat Narasi Pemantauan Pertumbuhan Anatomi Anak.\n\nRasio pertumbuhan (Stunting/Obesitas/Normal): {{data_antropometri}}.\nKebugaran kardiovaskular & otot: {{hasil_tes_tkji}}.\nRekomendasi diet & gaya hidup: {{rekomendasi_gizi}}."
        },
        {
          id: 'observasi_sportivitas', nama: 'Lembar Observasi Sportivitas (Afektif P5)', icon: '🤝',
          components: [
            { id: 'indikator_fairplay', label: 'Indikator Sportivitas (Kerjasama, Menerima Kekalahan)', type: 'textarea' },
            { id: 'skala_afektif', label: 'Skala Frekuensi Perilaku Baik dalam Pertandingan', type: 'textarea' },
            { id: 'insiden_bentrokan', label: 'Jurnal Kasus Khusus (Perselisihan / Solidaritas Tinggi)', type: 'textarea' }
          ],
          ai_prompt: "Sebagai Wasit Profesional & Psikolog Olahraga. Laporan Jurnal Observasi Fairplay Record.\n\nPilar sportivitas: {{indikator_fairplay}} frekuensi: {{skala_afektif}}.\nKasus tabrakan/solidaritas: {{insiden_bentrokan}}."
        }
      ]
    },
    {
      id: 'pjok_lapangan', role: 'guru_pjok', kategori: 'pjok_lapangan',
      nama: 'Manajemen Lapangan & Inventaris Olahraga', icon: '🏟️',
      desc: 'Tata kelola aset olahraga, kehadiran spesifik PJOK, dan jurnal lapangan.',
      items: [
        {
          id: 'inventaris_olahraga', nama: 'Buku Inventaris & Peminjaman Alat', icon: '🎾',
          components: [
            { id: 'daftar_aset', label: 'Daftar Alat Konsumabel (Bola, Net, Matras, Kun) & Kondisinya', type: 'textarea' },
            { id: 'log_peminjaman', label: 'Log Aktivitas Peminjaman per Siswa/Rombel', type: 'textarea' },
            { id: 'laporan_kerusakan', label: 'Laporan Kerusakan / Kehilangan Barang', type: 'textarea' }
          ],
          ai_prompt: "Sebagai Staff Gudang Perlengkapan Olahraga. Format Laporan Mutasi Barang.\n\n1. BUKU INDUK BARANG: {{daftar_aset}}.\n2. LALU LINTAS PEMAKAIAN: {{log_peminjaman}}.\n3. BERITA ACARA KEHILANGAN/RUSAK: {{laporan_kerusakan}}."
        },
        {
          id: 'jurnal_lapangan', nama: 'Jurnal Mengajar Harian Lapangan', icon: '📓',
          components: [
            { id: 'jadwal_materi', label: 'Waktu/Jam, Kelas, & Ruang Lingkup Materi', type: 'textarea' },
            { id: 'kondisi_cuaca', label: 'Catatan Cuaca & Status Area Lapangan', type: 'textarea' },
            { id: 'insiden_medis', label: 'Catatan Insiden KBM (Siswa Pingsan/Cedera)', type: 'textarea' }
          ],
          ai_prompt: "Sebagai Komandan Instruktur Lapangan. Konversi catatan menjadi Log Jurnal Harian Pelatih.\n\nAGENDA KBM: {{jadwal_materi}}.\nANALISIS MEDAN (RISK EVALUATION): {{kondisi_cuaca}}.\nREKAM MEDIK DARURAT: {{insiden_medis}}."
        }
      ]
    },
    {
      id: 'pjok_uks', role: 'guru_pjok', kategori: 'pjok_uks',
      nama: 'Program Khusus UKS & Prestasi Olahraga', icon: '🏆',
      desc: 'Operasional UKS, pembinaan ekskul olahraga, dan bank prestasi O2SN.',
      items: [
        {
          id: 'admin_uks', nama: 'Administrasi Unit Kesehatan Sekolah (UKS)', icon: '🏥',
          components: [
            { id: 'jadwal_piket', label: 'Bagan Struktur UKS & Jadwal Piket Dokter Kecil', type: 'textarea' },
            { id: 'pasien_p3k', label: 'Buku Catatan Pasien UKS (Tindakan P3K yang Diberikan)', type: 'textarea' },
            { id: 'bias_imunisasi', label: 'Laporan Sinkronisasi Program BIAS dari Puskesmas', type: 'textarea' }
          ],
          ai_prompt: "Sebagai Kepala Administrator UKS. Konversi dokumentasi klinis menjadi LPJ Bulanan UKS.\n\n1. AGENDA KEPEGAWAIAN KESEHATAN: {{jadwal_piket}}.\n2. LOG BUKU MEDIS P3K: {{pasien_p3k}}.\n3. KERJASAMA PUSKESMAS: {{bias_imunisasi}}."
        },
        {
          id: 'bina_ekskul', nama: 'Program Pembinaan Olahraga Pilihan', icon: '⚽',
          components: [
            { id: 'silabus_ekskul', label: 'Silabus Latihan Spesifik (Futsal, Bulu Tangkis, dll)', type: 'textarea' },
            { id: 'absensi_atlet', label: 'Daftar Presensi Peserta Ekstrakurikuler', type: 'textarea' },
            { id: 'jurnal_latihan', label: 'Jurnal Agenda Kegiatan Latihan Mingguan', type: 'textarea' }
          ],
          ai_prompt: "Sebagai Pelatih Kepala dari cabang olahraga spesifik. Restrukturisasi masterplan pengembangan atlet usia dini.\n\n1. KURIKULUM LATIHAN (teknik-taktik-fisik-uji coba): {{silabus_ekskul}}.\n2. RETENSI PESERTA: {{absensi_atlet}}.\n3. LOG BOOK PELATIH: {{jurnal_latihan}}."
        },
        {
          id: 'prestasi_o2sn', nama: 'Bank Data Prestasi & Persiapan O2SN', icon: '🥇',
          components: [
            { id: 'profil_bakat', label: 'Data Tabulasi Profil Siswa Berbakat Olahraga', type: 'textarea' },
            { id: 'riwayat_juara', label: 'Riwayat Pendataan Kejuaraan/Piagam Cabang Olahraga', type: 'textarea' }
          ],
          ai_prompt: "Sebagai Ahli Scouting Talent Atlet Nasional. Buat Dokumen Pemetaan Potensi Olahraga Unggulan Sekolah.\n\n1. MANAJEMEN TALENTA: {{profil_bakat}}.\n2. PARAGRAF PRESTASI (bragging paragraph): {{riwayat_juara}}."
        }
      ]
    },
    {
      id: 'pjok_kinerja', role: 'guru_pjok', kategori: 'pjok_kinerja',
      nama: 'Pengembangan Keprofesian & Kinerja PJOK (PMM)', icon: '🎖️',
      desc: 'e-Kinerja PMM terkait literasi kesehatan jasmani guru dan KKG Lapangan.',
      items: [
        {
          id: 'ekinerja_pjok', nama: 'Dokumen e-Kinerja Guru PJOK', icon: '🏛️',
          components: [
            { id: 'rhk_kesehatan', label: 'RHK Literasi Kesehatan Motorik (PMM)', type: 'textarea' },
            { id: 'bukti_sertifikat', label: 'Lampiran Sertifikat (KKG, Diklat Wasit / P3K)', type: 'textarea' },
            { id: 'observasi_lapangan', label: 'Log Umpan Balik Observasi Praktik dari Kepsek', type: 'textarea' }
          ],
          ai_prompt: "Sebagai Pejabat Verifikasi PMM Pusat Kemdikbud. Selesaikan Laporan Akhir Portofolio e-Kinerja Guru PJOK.\n\n1. KONSISTENSI SASARAN RHK: {{rhk_kesehatan}}.\n2. PEMBOBOTAN LOG FILE: {{bukti_sertifikat}}.\n3. REFLEKSI TANTANGAN (Growth Mindset): {{observasi_lapangan}}."
        }
      ]
    },
    {
      id: 'pjok_prates', role: 'guru_pjok', kategori: 'pjok_prates',
      nama: 'Pra-Tes: Perencanaan Asesmen Lapangan & Teori', icon: '🗺️',
      desc: 'Kisi-kisi teori kesehatan HOTS dan kisi-kisi praktik lapangan.',
      items: [
        {
          id: 'prates_pemetaan_pjok', nama: 'Pemetaan Asesmen Lapangan & Teori', icon: '🗺️',
          components: [
            { id: 'pemetaan_tp_pjok', label: 'Daftar TP per Elemen & Persentase (60% Praktik : 40% Teori)', type: 'textarea' },
            { id: 'kisi_tulis_pjok', label: 'Kisi-Kisi Soal Teori (HOTS: Analisis Cedera, Taktik)', type: 'textarea' },
            { id: 'kisi_praktik_pjok', label: 'Kisi-Kisi Penilaian Lapangan (Indikator Keterampilan Gerak)', type: 'textarea' }
          ],
          ai_prompt: "Sebagai Pakar Asesmen PJOK SD. Petakan mana yang diuji kertas vs lapangan.\n\n1. DISTRIBUSI BOBOT (60:40 Praktik:Teori): {{pemetaan_tp_pjok}}.\n2. KISI-KISI TEORI HOTS: {{kisi_tulis_pjok}}.\n3. RUBRIK LAPANGAN: {{kisi_praktik_pjok}}."
        }
      ]
    },
    {
      id: 'pjok_instrumen', role: 'guru_pjok', kategori: 'pjok_instrumen',
      nama: 'Pembuatan Instrumen Tes: Core Database Gerak & Tulis', icon: '📄',
      desc: 'Bank stimulus taktik, naskah soal HOTS, dan rubrik penilaian gerak.',
      items: [
        {
          id: 'instrumen_soal_rubrik_pjok', nama: 'Bank Stimulus Taktik & Naskah Praktik', icon: '📄',
          components: [
            { id: 'stimulus_taktik', label: 'Bank Stimulus (Ilustrasi Sudut Gerak, Infografis Gizi)', type: 'textarea' },
            { id: 'draft_pertanyaan_teori', label: 'Kartu Soal Tulis (HOTS) beserta Distraktor', type: 'textarea' },
            { id: 'rubrik_observasi_gerak', label: 'Rubrik Skoring Praktik & Lembar Penilaian Fairplay', type: 'textarea' }
          ],
          ai_prompt: "Berperan sebagai Dosen Penjaskes. Rancang instrumen validitas untuk tes fungsi nalar dan otot.\n\n1. ILUSTRASI TAKTIKAL: {{stimulus_taktik}} → soal HOTS: {{draft_pertanyaan_teori}}.\n2. RUBRIK UNJUK KERJA (Penilaian 4-3-2-1): {{rubrik_observasi_gerak}}."
        }
      ]
    },
    {
      id: 'pjok_validasi', role: 'guru_pjok', kategori: 'pjok_validasi',
      nama: 'Validasi & Verifikasi Pra-Ujian PJOK', icon: '🛡️',
      desc: 'SOP keselamatan, verifikasi modifikasi alat, dan mitigasi risiko cedera.',
      items: [
        {
          id: 'validasi_keamanan_alat', nama: 'Lembar Verifikasi Keselamatan (SOP)', icon: '🛡️',
          components: [
            { id: 'validasi_alat', label: 'Verifikasi Modifikasi Alat (Tolak Peluru dgn Bola Kasti Pasir)', type: 'textarea' },
            { id: 'validasi_resiko', label: 'Verifikasi Tingkat Bahaya Skenario Praktik', type: 'textarea' }
          ],
          ai_prompt: "Sebagai Safety Officer Sekolah. Sensor keamanan ujian PJOK agar tidak ada siswa yang cedera.\n\n1. MODIFIKASI ERGONOMIS: {{validasi_alat}}.\n2. MITIGASI KECELAKAAN: {{validasi_resiko}}."
        }
      ]
    },
    {
      id: 'pjok_pelaksanaan', role: 'guru_pjok', kategori: 'pjok_pelaksanaan',
      nama: 'Administrasi Pelaksanaan Ujian (Fokus Keselamatan)', icon: '📋',
      desc: 'SOP pemanasan, daftar hadir lapangan, berita acara cedera.',
      items: [
        {
          id: 'administrasi_pelaksanaan_lapangan', nama: 'Administrasi Lapangan & Berita Acara', icon: '📋',
          components: [
            { id: 'sop_pemanasan', label: 'SOP Pemanasan & Konfirmasi Rekam Medis (Asma/Flu)', type: 'textarea' },
            { id: 'absen_beritaacara_cedera', label: 'Daftar Hadir Lapangan & Berita Acara Kendala/Cedera', type: 'textarea' }
          ],
          ai_prompt: "Sebagai Wasit / Pengawas Ujian Praktik Lapangan. Kendalikan ketertiban dan keselamatan kelas.\n\nSOP pemanasan & clearance medis: {{sop_pemanasan}}.\nBerita Acara cedera & penanganan P3K: {{absen_beritaacara_cedera}}."
        }
      ]
    },
    {
      id: 'pjok_pascates', role: 'guru_pjok', kategori: 'pjok_pascates',
      nama: 'Pasca-Tes: Analisis, Evaluasi & Modifikasi Gerak', icon: '📈',
      desc: 'Analisis motorik, hambatan kinestetik, dan talent scouting O2SN.',
      items: [
        {
          id: 'pascates_analisis_kinestetik', nama: 'Analisis Motorik & Talent Scouting', icon: '📈',
          components: [
            { id: 'analisis_kognitif', label: 'Data Kesukaran Soal Tulis (Teori Pola Sehat)', type: 'textarea' },
            { id: 'rekap_hambatan_motorik', label: 'Ringkasan Hambatan Motorik Kelas (Misal: 60% salah bertumpu)', type: 'textarea' },
            { id: 'remedial_o2sn', label: 'Modifikasi Jarak (Remedial) & Daftar Bakat Kinestetik (O2SN)', type: 'textarea' }
          ],
          ai_prompt: "Sebagai Ilmuwan Keolahragaan & Pemandu Bakat. Bedah data pasca-tes fisik siswa.\n\n1. EVALUASI LITERASI KESEHATAN: {{analisis_kognitif}}.\n2. HAMBATAN BIOMEKANIK: {{rekap_hambatan_motorik}}.\n3. MODIFIKASI KLINIS & NOMINASI O2SN: {{remedial_o2sn}}."
        }
      ]
    },

    // ══════════════════════════════════════════
    // KOORDINATOR KOKURIKULER (5 template)
    // ══════════════════════════════════════════
    {
      id: 'kord_desain', role: 'koordinator', kategori: 'kord_desain',
      nama: 'Perencanaan & Desain Program Kokurikuler (Grand Design)', icon: '🎯',
      desc: 'Perancangan program P5 dan desain kurikulum kokurikuler.',
      items: [
        {
          id: 'desain_p5', nama: 'Desain Proyek P5 Sekolah', icon: '🌱',
          components: [
            { id: 'tema_p5', label: 'Tema P5 Pilihan & Kontekstualisasi Lokal', type: 'textarea' },
            { id: 'alur_kegiatan', label: 'Alur Kegiatan per Fase (Kenali, Selidiki, Lakukan, Genapi)', type: 'textarea' },
            { id: 'lintas_mapel', label: 'Kolaborasi Lintas Mata Pelajaran yang Dilibatkan', type: 'textarea' }
          ],
          ai_prompt: "Sebagai Koordinator P5 Sekolah. Rancang proyek P5 yang berdampak dan terkoordinasi baik.\n\n1. KONTEKSTUALISASI TEMA: {{tema_p5}}.\n2. ALUR PROJEK CYCLE: {{alur_kegiatan}}.\n3. MATRIKS KOLABORASI GURU: {{lintas_mapel}}."
        }
      ]
    },
    {
      id: 'kord_sdm', role: 'koordinator', kategori: 'kord_sdm',
      nama: 'Manajemen SDM & Fasilitator', icon: '👥',
      desc: 'Pengelolaan tim fasilitator dan koordinasi jadwal kokurikuler.',
      items: [
        {
          id: 'manajemen_fasilitator', nama: 'Manajemen Tim Fasilitator', icon: '👨‍🏫',
          components: [
            { id: 'daftar_fasilitator', label: 'Daftar Fasilitator & Kelompok yang Diampu', type: 'textarea' },
            { id: 'jadwal_koordinasi', label: 'Jadwal Rapat Koordinasi Rutin', type: 'textarea' },
            { id: 'pembagian_sesi', label: 'Pembagian Sesi Kegiatan per Fasilitator', type: 'textarea' }
          ],
          ai_prompt: "Sebagai Koordinator Kokurikuler. Susun struktur manajemen tim fasilitator yang efektif.\n\n1. FORMASI TIM: {{daftar_fasilitator}}.\n2. AGENDA KOORDINASI: {{jadwal_koordinasi}}.\n3. DISTRIBUSI SESI: {{pembagian_sesi}}."
        }
      ]
    },
    {
      id: 'kord_monitoring', role: 'koordinator', kategori: 'kord_monitoring',
      nama: 'Pelaksanaan & Pemantauan (Monitoring)', icon: '📡',
      desc: 'Logbook monitoring, kendala lapangan, dan evaluasi pelaksanaan.',
      items: [
        {
          id: 'logbook_monitoring', nama: 'Logbook Pemantauan Pelaksanaan', icon: '📊',
          components: [
            { id: 'progres_kelompok', label: 'Progres Setiap Kelompok & Fase yang Dicapai', type: 'textarea' },
            { id: 'kendala_lapangan', label: 'Kendala yang Ditemui di Lapangan', type: 'textarea' },
            { id: 'intervensi', label: 'Tindakan Intervensi & Penyesuaian yang Diambil', type: 'textarea' }
          ],
          ai_prompt: "Sebagai Koordinator Kokurikuler. Monitor dan evaluasi pelaksanaan P5.\n\n1. STATUS PROGRES: {{progres_kelompok}}.\n2. IDENTIFIKASI KENDALA: {{kendala_lapangan}}.\n3. RENCANA INTERVENSI: {{intervensi}}."
        }
      ]
    },
    {
      id: 'kord_asesmen', role: 'koordinator', kategori: 'kord_asesmen',
      nama: 'Asesmen, Evaluasi & Output Karya', icon: '🎨',
      desc: 'Penilaian karya P5, evaluasi capaian dimensi Profil Pancasila.',
      items: [
        {
          id: 'asesmen_karya', nama: 'Asesmen & Evaluasi Karya P5', icon: '🎨',
          components: [
            { id: 'kriteria_karya', label: 'Kriteria Penilaian Produk Akhir', type: 'textarea' },
            { id: 'rubrik_dimensi', label: 'Rubrik Penilaian Dimensi Profil Pelajar Pancasila', type: 'textarea' },
            { id: 'rekap_nilai', label: 'Rekap Nilai & Narasi per Kelompok', type: 'textarea' }
          ],
          ai_prompt: "Sebagai Evaluator P5. Susun instrumen asesmen karya yang holistik.\n\n1. KRITERIA PRODUK: {{kriteria_karya}}.\n2. RUBRIK DIMENSI PPP: {{rubrik_dimensi}}.\n3. REKAP NARASI: {{rekap_nilai}}."
        }
      ]
    },
    {
      id: 'kord_laporan', role: 'koordinator', kategori: 'kord_laporan',
      nama: 'Pelaporan Pertanggungjawaban Kokurikuler', icon: '📑',
      desc: 'Laporan pelaksanaan program kokurikuler kepada kepala sekolah.',
      items: [
        {
          id: 'laporan_kokurikuler', nama: 'Laporan Pelaksanaan P5 & Kokurikuler', icon: '📑',
          components: [
            { id: 'ringkasan_program', label: 'Ringkasan Pelaksanaan Program (Capaian vs Target)', type: 'textarea' },
            { id: 'output_karya', label: 'Deskripsi Output/Karya yang Dihasilkan', type: 'textarea' },
            { id: 'rekomendasi', label: 'Evaluasi & Rekomendasi untuk Program Berikutnya', type: 'textarea' }
          ],
          ai_prompt: "Sebagai Koordinator Kokurikuler. Buat Laporan LPJ Program P5 kepada Kepala Sekolah.\n\n1. RINGKASAN CAPAIAN: {{ringkasan_program}}.\n2. OUTPUT KARYA SISWA: {{output_karya}}.\n3. EVALUASI & REKOMENDASI: {{rekomendasi}}."
        }
      ]
    },

    // ══════════════════════════════════════════
    // FASILITATOR KOKURIKULER (5 template)
    // ══════════════════════════════════════════
    {
      id: 'fas_kelompok', role: 'fasilitator', kategori: 'fas_kelompok',
      nama: 'Manajemen Kelompok & Persiapan Mikro', icon: '👨‍🏫',
      desc: 'Pengelolaan anggota kelompok dan persiapan sesi kegiatan.',
      items: [
        {
          id: 'manajemen_kelompok', nama: 'Profil & Manajemen Kelompok', icon: '👥',
          components: [
            { id: 'anggota_kelompok', label: 'Daftar Anggota Kelompok & Karakteristik Individu', type: 'textarea' },
            { id: 'pembagian_peran', label: 'Pembagian Peran dalam Kelompok (Ketua, Sekretaris, dll)', type: 'textarea' },
            { id: 'persiapan_sesi', label: 'Rencana Persiapan Sesi Berikutnya', type: 'textarea' }
          ],
          ai_prompt: "Sebagai Fasilitator Kokurikuler. Kelola dinamika kelompok secara efektif.\n\n1. PROFIL ANGGOTA: {{anggota_kelompok}}.\n2. DISTRIBUSI PERAN: {{pembagian_peran}}.\n3. RENCANA SESI: {{persiapan_sesi}}."
        }
      ]
    },
    {
      id: 'fas_lapangan', role: 'fasilitator', kategori: 'fas_lapangan',
      nama: 'Eksekusi & Pemantauan Lapangan (Logbook)', icon: '📓',
      desc: 'Catatan pelaksanaan kegiatan P5 dan dokumentasi proses.',
      items: [
        {
          id: 'logbook_lapangan', nama: 'Logbook Pelaksanaan Kegiatan P5', icon: '📝',
          components: [
            { id: 'aktivitas_sesi', label: 'Deskripsi Aktivitas per Sesi (Tgl, Kelompok, Kegiatan)', type: 'textarea' },
            { id: 'produk_siswa', label: 'Produk/Karya yang Dihasilkan Siswa', type: 'textarea' },
            { id: 'refleksi', label: 'Refleksi Siswa & Fasilitator', type: 'textarea' }
          ],
          ai_prompt: "Sebagai Fasilitator P5 di lapangan. Dokumentasikan kegiatan dan bimbing refleksi.\n\n1. NARASI KEGIATAN: {{aktivitas_sesi}}.\n2. KURASI KARYA: {{produk_siswa}}.\n3. PANDUAN REFLEKSI: {{refleksi}}."
        }
      ]
    },
    {
      id: 'fas_asesmen', role: 'fasilitator', kategori: 'fas_asesmen',
      nama: 'Asesmen Karakter & Observasi', icon: '🔍',
      desc: 'Lembar observasi perkembangan karakter dan soft skills siswa.',
      items: [
        {
          id: 'asesmen_karakter', nama: 'Lembar Observasi Karakter Kokurikuler', icon: '🔍',
          components: [
            { id: 'indikator_karakter', label: 'Indikator Karakter yang Diobservasi (dari Dimensi P5)', type: 'textarea' },
            { id: 'data_observasi', label: 'Data Observasi per Individu (Berkala)', type: 'textarea' },
            { id: 'narasi_perkembangan', label: 'Narasi Perkembangan Karakter Akhir', type: 'textarea' }
          ],
          ai_prompt: "Sebagai Penilai Karakter P5. Buat laporan asesmen karakter yang otentik dan bermakna.\n\n1. INDIKATOR DIMENSI: {{indikator_karakter}}.\n2. DATA OBSERVASI: {{data_observasi}}.\n3. NARASI PERKEMBANGAN: {{narasi_perkembangan}}."
        }
      ]
    },
    {
      id: 'fas_portofolio', role: 'fasilitator', kategori: 'fas_portofolio',
      nama: 'Manajemen Portofolio & Bukti Karya', icon: '📁',
      desc: 'Pengumpulan,  kurasi, dan dokumentasi bukti karya siswa.',
      items: [
        {
          id: 'manajemen_portofolio', nama: 'Portofolio & Evidence Karya Siswa', icon: '📁',
          components: [
            { id: 'daftar_karya', label: 'Daftar Karya yang Dikumpulkan (Foto, Video, Dokumen)', type: 'textarea' },
            { id: 'deskripsi_karya', label: 'Deskripsi Karya & Proses Pembuatannya', type: 'textarea' },
            { id: 'capaian_dimensi', label: 'Capaian Dimensi PPP yang Terefleksi', type: 'textarea' }
          ],
          ai_prompt: "Sebagai Kurator Portofolio P5. Susun portofolio karya yang menunjukkan pertumbuhan nyata.\n\n1. INVENTARIS KARYA: {{daftar_karya}}.\n2. NARASI PROSES: {{deskripsi_karya}}.\n3. REFLEKSI DIMENSI PPP: {{capaian_dimensi}}."
        }
      ]
    },
    {
      id: 'fas_laporan', role: 'fasilitator', kategori: 'fas_laporan',
      nama: 'Pelaporan & Sinkronisasi Data', icon: '🔄',
      desc: 'Pelaporan hasil kegiatan kepada koordinator kokurikuler.',
      items: [
        {
          id: 'pelaporan_fasilitator', nama: 'Laporan Fasilitator ke Koordinator', icon: '📤',
          components: [
            { id: 'capaian_kelompok', label: 'Capaian Kelompok vs Target Fase', type: 'textarea' },
            { id: 'kendala_fasilitator', label: 'Kendala yang Dihadapi selama Fasilitasi', type: 'textarea' },
            { id: 'saran_koordinasi', label: 'Saran & Hal yang Perlu Dikoordinasikan', type: 'textarea' }
          ],
          ai_prompt: "Sebagai Fasilitator. Buat laporan progres yang informatif untuk Koordinator Kokurikuler.\n\n1. CAPAIAN vs TARGET: {{capaian_kelompok}}.\n2. KENDALA & HAMBATAN: {{kendala_fasilitator}}.\n3. SARAN & ESKALASI: {{saran_koordinasi}}."
        }
      ]
    },

    // ══════════════════════════════════════════
    // BENDAHARA (5 template)
    // ══════════════════════════════════════════
    {
      id: 'bend_anggaran', role: 'bendahara', kategori: 'bend_anggaran',
      nama: 'Perencanaan & Pemetaan Anggaran (Budgeting)', icon: '📑',
      desc: 'RKAS, SK Tim BOS, dan Rencana Penarikan Dana (RPD).',
      items: [
        {
          id: 'rkas_perencanaan', nama: 'Rencana Kegiatan & Anggaran (RKAS)', icon: '📊',
          components: [
            { id: 'integrasi_rapor', label: 'Program Benahi Berbasis Rapor Pendidikan (SNP)', type: 'textarea' },
            { id: 'uraian_belanja', label: 'Uraian Kegiatan, Volume, Satuan, dan Harga Satuan', type: 'textarea' },
            { id: 'sumber_dana', label: 'Sumber Pendanaan (BOS Reguler/Kinerja) & Total Pagu', type: 'textarea' }
          ],
          ai_prompt: "Sebagai Konsultan Keuangan Pendidikan (RKAS Planner). Susun Dokumen Rencana Belanja yang taat regulasi.\n\n1. JUSTIFIKASI BELANJA: {{uraian_belanja}} → linked ke Program Benahi: {{integrasi_rapor}}.\n2. RUMUSAN ANGGARAN (tidak melebihi Pagu): {{sumber_dana}}."
        },
        {
          id: 'sk_tim_bos', nama: 'SK Tim Manajemen BOS', icon: '⚖️',
          components: [
            { id: 'konsideran_hukum', label: 'Konsideran Hukum & Tahun Anggaran', type: 'textarea' },
            { id: 'personalia_tim', label: 'Daftar Nama Personel & Jabatan', type: 'textarea' },
            { id: 'rincian_tugas', label: 'Rincian Pembagian Tugas Administratif', type: 'textarea' }
          ],
          ai_prompt: "Sebagai Ahli Tata Usaha. Buat draf legal SK Tim Manajemen BOS tingkat SD.\n\n1. LANDASAN HUKUM (Menimbang, Mengingat, Memutuskan): {{konsideran_hukum}}.\n2. STRUKTUR ORGANISASI: {{personalia_tim}}.\n3. LEGALITAS PERAN (batas wewenang jelas): {{rincian_tugas}}."
        },
        {
          id: 'rpd_cashflow', nama: 'Rencana Penarikan Dana (RPD)', icon: '💸',
          components: [
            { id: 'estimasi_cashflow', label: 'Estimasi Kebutuhan Cashflow (Per Bulan)', type: 'textarea' },
            { id: 'jadwal_pencairan', label: 'Jadwal Pencairan Giro dari Bank Daerah', type: 'textarea' },
            { id: 'tahapan_bos', label: 'Persentase Pembagian Dana Tahap 1 & Tahap 2', type: 'textarea' }
          ],
          ai_prompt: "Sebagai CFO Sekolah. Kelola RPD untuk mengamankan likuiditas operasional.\n\nSinkronkan kebutuhan bulanan: {{estimasi_cashflow}} dengan ketersediaan bank: {{jadwal_pencairan}}.\nPastikan tidak menyalahi aturan termin pencairan tahap 1 vs 2: {{tahapan_bos}}."
        }
      ]
    },
    {
      id: 'bend_kas', role: 'bendahara', kategori: 'bend_kas',
      nama: 'Penatausahaan & Pembukuan Kas (Core Accounting)', icon: '📒',
      desc: 'BKU, buku pembantu kas, buku bank, dan rekonsiliasi.',
      items: [
        {
          id: 'bku_harian', nama: 'Buku Kas Umum (BKU)', icon: '📓',
          components: [
            { id: 'transaksi_masuk', label: 'Transaksi Penerimaan (Tanggal, Uraian, Jumlah)', type: 'textarea' },
            { id: 'transaksi_keluar', label: 'Transaksi Pengeluaran (Tanggal, Uraian, Jumlah)', type: 'textarea' },
            { id: 'saldo_akhir', label: 'Saldo Akhir Periode & Rekonsiliasi Bank', type: 'textarea' }
          ],
          ai_prompt: "Sebagai Controller Keuangan Sekolah. Verifikasi dan format BKU yang audit-ready.\n\n1. REKONSILIASI MASUK: {{transaksi_masuk}}.\n2. AUDIT PENGELUARAN: {{transaksi_keluar}}.\n3. SALDO & REKONSILIASI (koheren dengan rekening bank): {{saldo_akhir}}."
        }
      ]
    },
    {
      id: 'bend_spj', role: 'bendahara', kategori: 'bend_spj',
      nama: 'Pengadaan & Bukti Fisik Transaksi (SPJ)', icon: '🧾',
      desc: 'Kuitansi, berita acara pengadaan, dan SPJ belanja barang/jasa.',
      items: [
        {
          id: 'pengadaan_spj', nama: 'Surat Pertanggungjawaban (SPJ) Pengadaan', icon: '🧾',
          components: [
            { id: 'daftar_pengadaan', label: 'Daftar Item Pengadaan (Nama Barang, Spesifikasi, Harga)', type: 'textarea' },
            { id: 'bukti_transaksi', label: 'Ringkasan Kuitansi & Bukti Pembayaran', type: 'textarea' },
            { id: 'beritaacara_pengadaan', label: 'Berita Acara Serah Terima Barang/Jasa', type: 'textarea' }
          ],
          ai_prompt: "Sebagai Verifikator SPJ Pengadaan. Buatkan draf dokumen SPJ yang lengkap dan anti-temuan audit.\n\n1. SPESIFIKASI ITEM: {{daftar_pengadaan}}.\n2. VERIFIKASI KUITANSI: {{bukti_transaksi}}.\n3. BERITA ACARA SERAH TERIMA: {{beritaacara_pengadaan}}."
        }
      ]
    },
    {
      id: 'bend_pajak', role: 'bendahara', kategori: 'bend_pajak',
      nama: 'Manajemen Perpajakan', icon: '⚖️',
      desc: 'Pengelolaan PPh 21/22/23, NPWP, dan pelaporan pajak BOS.',
      items: [
        {
          id: 'manajemen_perpajakan', nama: 'Administrasi Perpajakan BOS', icon: '⚖️',
          components: [
            { id: 'objek_pajak', label: 'Daftar Objek Pajak (Honorarium, Pengadaan, Sewa)', type: 'textarea' },
            { id: 'perhitungan_pph', label: 'Perhitungan PPh yang Dipotong (21/22/23)', type: 'textarea' },
            { id: 'bukti_setor', label: 'Nomor SSP / Bukti Setor Pajak', type: 'textarea' }
          ],
          ai_prompt: "Sebagai Konsultan Pajak BOS. Pastikan kepatuhan perpajakan sekolah.\n\n1. IDENTIFIKASI OBJEK PAJAK: {{objek_pajak}}.\n2. KALKULASI PPh: {{perhitungan_pph}}.\n3. VERIFIKASI BUKTI SETOR: {{bukti_setor}}."
        }
      ]
    },
    {
      id: 'bend_closing', role: 'bendahara', kategori: 'bend_closing',
      nama: 'Pelaporan, Evaluasi & Closing Bulanan', icon: '📊',
      desc: 'Laporan realisasi anggaran, closing bulanan, dan evaluasi serapan.',
      items: [
        {
          id: 'pelaporan_closing', nama: 'Laporan Closing & Evaluasi Realisasi Anggaran', icon: '📊',
          components: [
            { id: 'realisasi_anggaran', label: 'Realisasi vs Rencana Anggaran Bulan Ini', type: 'textarea' },
            { id: 'sisa_anggaran', label: 'Sisa Anggaran & Proyeksi Bulan Depan', type: 'textarea' },
            { id: 'catatan_temuan', label: 'Catatan Temuan / Kendala Administrasi Keuangan', type: 'textarea' }
          ],
          ai_prompt: "Sebagai CFO & Controller Sekolah. Buat laporan closing bulanan yang komprehensif.\n\n1. ANALISIS REALISASI: {{realisasi_anggaran}}.\n2. PROYEKSI SISA ANGGARAN: {{sisa_anggaran}}.\n3. CATATAN KENDALA & RTL: {{catatan_temuan}}."
        }
      ]
    },

    // ══════════════════════════════════════════
    // OPERATOR SEKOLAH (5 template)
    // ══════════════════════════════════════════
    {
      id: 'ops_kelembagaan', role: 'ops', kategori: 'ops_kelembagaan',
      nama: 'Manajemen Data Kelembagaan & Sarana Prasarana', icon: '🏫',
      desc: 'Data profil sekolah, sarpras, dan pembaruan Dapodik kelembagaan.',
      items: [
        {
          id: 'data_kelembagaan', nama: 'Data Profil & Kelembagaan Sekolah', icon: '🏫',
          components: [
            { id: 'profil_sekolah', label: 'Data Profil Sekolah (NPSN, Alamat, Akreditasi)', type: 'textarea' },
            { id: 'data_sarpras', label: 'Data Sarana Prasarana di Dapodik (Ruang, Fasilitas)', type: 'textarea' },
            { id: 'pembaruan_dapodik', label: 'Pembaruan yang Perlu Dilakukan di Dapodik', type: 'textarea' }
          ],
          ai_prompt: "Sebagai Operator DAPODIK Profesional. Verifikasi dan update data kelembagaan sekolah.\n\n1. VALIDASI PROFIL SEKOLAH: {{profil_sekolah}}.\n2. DATA SARPRAS: {{data_sarpras}}.\n3. CHECKLIST PEMBARUAN DAPODIK: {{pembaruan_dapodik}}."
        }
      ]
    },
    {
      id: 'ops_ptk', role: 'ops', kategori: 'ops_ptk',
      nama: 'Manajemen Data Pendidik & Tenaga Kependidikan (PTK)', icon: '👨‍💼',
      desc: 'Data PTK di Dapodik, NIP, kepangkatan, dan sertifikasi.',
      items: [
        {
          id: 'manajemen_ptk', nama: 'Entry & Verifikasi Data PTK', icon: '👨‍💼',
          components: [
            { id: 'data_guru', label: 'Data Identitas Guru (NIP, NUPTK, Pangkat, Sertifikasi)', type: 'textarea' },
            { id: 'data_tendik', label: 'Data Tenaga Kependidikan (Operator, TU, Satpam, Penjaga)', type: 'textarea' },
            { id: 'pembaruan_ptk', label: 'Perubahan Status yang Perlu Diperbarui di Dapodik', type: 'textarea' }
          ],
          ai_prompt: "Sebagai Operator Dapodik untuk PTK. Pastikan data guru dan tendik akurat.\n\n1. VALIDASI DATA GURU: {{data_guru}}.\n2. DATA TENDIK: {{data_tendik}}.\n3. FLAGGING PEMBARUAN: {{pembaruan_ptk}}."
        }
      ]
    },
    {
      id: 'ops_kesiswaan', role: 'ops', kategori: 'ops_kesiswaan',
      nama: 'Manajemen Data Peserta Didik (Kesiswaan)', icon: '🎓',
      desc: 'Entry data siswa, mutasi, PPDB, dan sinkronisasi buku induk.',
      items: [
        {
          id: 'manajemen_kesiswaan', nama: 'Entry Data DAPODIK Peserta Didik', icon: '💻',
          components: [
            { id: 'data_siswa', label: 'Data Identitas Siswa (NISN, NIK, Nama, TTL)', type: 'textarea' },
            { id: 'data_orang_tua', label: 'Data Orang Tua/Wali (NIK, Pekerjaan, Pendidikan)', type: 'textarea' },
            { id: 'mutasi', label: 'Catatan Mutasi Masuk/Keluar & Verifikasi Dokumen', type: 'textarea' }
          ],
          ai_prompt: "Sebagai Operator DAPODIK. Verifikasi dan persiapkan input data peserta didik.\n\n1. VALIDASI DATA SISWA: {{data_siswa}}.\n2. DATA ORANG TUA (flagging tidak lengkap): {{data_orang_tua}}.\n3. PROSES MUTASI (checklist dokumen): {{mutasi}}."
        }
      ]
    },
    {
      id: 'ops_kurikulum', role: 'ops', kategori: 'ops_kurikulum',
      nama: 'Manajemen Kurikulum, Rombel, dan e-Rapor', icon: '📋',
      desc: 'Jadwal pelajaran, pembagian rombel, dan entry nilai erapor.',
      items: [
        {
          id: 'kurikulum_rombel', nama: 'Jadwal Pelajaran & Pembagian Rombel', icon: '📅',
          components: [
            { id: 'data_guru_mapel', label: 'Daftar Guru & Mata Pelajaran yang Diampu', type: 'textarea' },
            { id: 'alokasi_jam', label: 'Alokasi Jam Pelajaran per Mapel (Permendikbud)', type: 'textarea' },
            { id: 'kendala_jadwal', label: 'Kendala/Konflik Jadwal yang ditemukan', type: 'textarea' }
          ],
          ai_prompt: "Sebagai Penyusun Jadwal Pelajaran. Optimalkan alokasi waktu dan guru.\n\n1. MAP GURU-MAPEL: {{data_guru_mapel}}.\n2. ALOKASI JAM vs PERMENDIKBUD: {{alokasi_jam}}.\n3. SOLUSI KONFLIK JADWAL: {{kendala_jadwal}}."
        }
      ]
    },
    {
      id: 'ops_digital', role: 'ops', kategori: 'ops_digital',
      nama: 'Manajemen Asesmen & Platform Ekosistem Digital', icon: '💻',
      desc: 'Asesmen digital Dapodik, PMM sekolah, dan platform ekosistem.',
      items: [
        {
          id: 'asesmen_digital', nama: 'Manajemen Platform & Asesmen Digital', icon: '💻',
          components: [
            { id: 'akun_pmm', label: 'Status Aktivasi Akun PMM Guru & Kepala Sekolah', type: 'textarea' },
            { id: 'asesmen_nasional', label: 'Persiapan Asesmen Nasional Berbasis Komputer (ANBK)', type: 'textarea' },
            { id: 'platform_digital', label: 'Platform Digital Lain yang Dikelola (SIPLah, BUKU, dll)', type: 'textarea' }
          ],
          ai_prompt: "Sebagai Admin Ekosistem Digital Sekolah. Pantau dan optimalkan penggunaan platform.\n\n1. MONITORING PMM: {{akun_pmm}}.\n2. PERSIAPAN ANBK: {{asesmen_nasional}}.\n3. PLATFORM LAINNYA: {{platform_digital}}."
        }
      ]
    },

    // ══════════════════════════════════════════
    // TATA USAHA (5 template)
    // ══════════════════════════════════════════
    {
      id: 'tu_persuratan', role: 'tu', kategori: 'tu_persuratan',
      nama: 'Manajemen Persuratan & Kearsipan (Korespondensi)', icon: '✉️',
      desc: 'Buku agenda surat masuk/keluar, disposisi, dan pembuatan surat dinas.',
      items: [
        {
          id: 'surat_masuk_keluar', nama: 'Buku Agenda Surat Masuk & Keluar', icon: '📬',
          components: [
            { id: 'data_surat_masuk', label: 'Data Surat Masuk (Nomor, Tanggal, Pengirim, Perihal)', type: 'textarea' },
            { id: 'disposisi', label: 'Disposisi & Tindak Lanjut Surat', type: 'textarea' },
            { id: 'surat_keluar', label: 'Draft/Data Surat Keluar (Nomor, Tujuan, Perihal)', type: 'textarea' }
          ],
          ai_prompt: "Sebagai Manajer Arsip Sekolah. Kelola agenda surat dengan tertib dan sistematis.\n\n1. KATALOG SURAT MASUK: {{data_surat_masuk}}.\n2. DISPOSISI: {{disposisi}}.\n3. SURAT KELUAR (format surat dinas baku): {{surat_keluar}}."
        },
        {
          id: 'pembuatan_surat_dinas', nama: 'Pembuatan Surat Dinas & SK', icon: '📄',
          components: [
            { id: 'jenis_surat', label: 'Jenis Surat (Undangan, Tugas, Keterangan, SK)', type: 'textarea' },
            { id: 'isi_pokok', label: 'Isi Pokok dan Data yang Perlu Dicantumkan', type: 'textarea' },
            { id: 'format_khusus', label: 'Format Khusus atau Referensi Surat Sebelumnya', type: 'textarea' }
          ],
          ai_prompt: "Sebagai Sekretaris Eksekutif Sekolah. Buat draf surat dinas yang formal dan sah.\n\n1. IDENTIFIKASI JENIS SURAT: {{jenis_surat}}.\n2. PENYUSUNAN ISI (informatif & to-the-point): {{isi_pokok}}.\n3. FORMAT & KONSISTENSI: {{format_khusus}}."
        }
      ]
    },
    {
      id: 'tu_kepegawaian', role: 'tu', kategori: 'tu_kepegawaian',
      nama: 'Administrasi Kepegawaian Dasar (Personnel File)', icon: '📂',
      desc: 'File kepegawaian, absensi, cuti, dan administrasi SKP.',
      items: [
        {
          id: 'administrasi_kepegawaian', nama: 'Pengelolaan File Kepegawaian', icon: '📂',
          components: [
            { id: 'data_pegawai', label: 'Daftar Data Pegawai (NIP, Pangkat, Jabatan, Status)', type: 'textarea' },
            { id: 'rekapitulasi_absensi', label: 'Rekapitulasi Absensi Bulanan', type: 'textarea' },
            { id: 'proses_administrasi', label: 'Proses Administrasi yang Sedang Berjalan (Cuti, Kenaikan)', type: 'textarea' }
          ],
          ai_prompt: "Sebagai Kepala Urusan Kepegawaian. Kelola administrasi personalia yang tertib.\n\n1. DATA PEGAWAI: {{data_pegawai}}.\n2. REKAP ABSENSI: {{rekapitulasi_absensi}}.\n3. PROSES AKTIF (cuti/kenaikan): {{proses_administrasi}}."
        }
      ]
    },
    {
      id: 'tu_kesiswaan', role: 'tu', kategori: 'tu_kesiswaan',
      nama: 'Administrasi Kesiswaan Fisik & Legalitas Mutasi', icon: '📝',
      desc: 'Dokumen kesiswaan fisik, legalisasi ijazah, dan surat mutasi.',
      items: [
        {
          id: 'kesiswaan_fisik_mutasi', nama: 'Administrasi Kesiswaan Fisik & Mutasi', icon: '📝',
          components: [
            { id: 'dokumen_masuk', label: 'Dokumen Kesiswaan Masuk / PPDB (Akta, KK, Ijazah)', type: 'textarea' },
            { id: 'proses_mutasi', label: 'Proses Mutasi (Surat Keterangan, STTB, Rapor)', type: 'textarea' },
            { id: 'legalisasi', label: 'Permintaan Legalisasi Dokumen', type: 'textarea' }
          ],
          ai_prompt: "Sebagai Petugas Administrasi Kesiswaan TU. Kelola dokumen kesiswaan fisik.\n\n1. CHECKLIST DOKUMEN PPDB: {{dokumen_masuk}}.\n2. SOP MUTASI: {{proses_mutasi}}.\n3. PROSEDUR LEGALISASI: {{legalisasi}}."
        }
      ]
    },
    {
      id: 'tu_layanan', role: 'tu', kategori: 'tu_layanan',
      nama: 'Layanan Publik & Hubungan Masyarakat', icon: '🤝',
      desc: 'Pelayanan tamu, informasi publik, dan koordinasi humas.',
      items: [
        {
          id: 'layanan_tamu_hubmas', nama: 'Layanan Tamu & Hubungan Masyarakat', icon: '🤝',
          components: [
            { id: 'buku_tamu', label: 'Log Buku Tamu (Nama, Instansi, Keperluan)', type: 'textarea' },
            { id: 'permohonan_informasi', label: 'Permohonan Informasi / Kerjasama yang Masuk', type: 'textarea' },
            { id: 'kegiatan_humas', label: 'Kegiatan Hubungan Masyarakat yang Direncanakan', type: 'textarea' }
          ],
          ai_prompt: "Sebagai Front Desk & Humas Sekolah. Kelola hubungan eksternal dan layanan tamu.\n\n1. LOG BUKU TAMU: {{buku_tamu}}.\n2. RESPONS PERMOHONAN INFO: {{permohonan_informasi}}.\n3. RENCANA KEGIATAN HUMAS: {{kegiatan_humas}}."
        }
      ]
    },
    {
      id: 'tu_inventaris', role: 'tu', kategori: 'tu_inventaris',
      nama: 'Manajemen Logistik & Inventaris Habis Pakai', icon: '📦',
      desc: 'Persediaan ATK, logistik kebutuhan sekolah, dan pembelian habis pakai.',
      items: [
        {
          id: 'manajemen_inventaris', nama: 'Inventaris Barang Habis Pakai', icon: '📦',
          components: [
            { id: 'stok_atk', label: 'Stok ATK & Bahan Habis Pakai Tersedia', type: 'textarea' },
            { id: 'kebutuhan_pengadaan', label: 'Kebutuhan Pengadaan Bulan Ini', type: 'textarea' },
            { id: 'distribusi_barang', label: 'Distribusi Barang ke Unit/Guru', type: 'textarea' }
          ],
          ai_prompt: "Sebagai Kepala Logistik Sekolah. Kelola persediaan dan distribusi barang.\n\n1. MONITORING STOK: {{stok_atk}}.\n2. RENCANA PENGADAAN: {{kebutuhan_pengadaan}}.\n3. DISTRIBUSI & PENCATATAN: {{distribusi_barang}}."
        }
      ]
    },

    // ══════════════════════════════════════════
    // GPK / KOORDINATOR INKLUSI (5 template)
    // ══════════════════════════════════════════
    {
      id: 'gpk_identifikasi', role: 'gpk', kategori: 'gpk_identifikasi',
      nama: 'Identifikasi & Asesmen Diagnostik', icon: '🔍',
      desc: 'Asesmen awal, profil ABK, dan identifikasi kebutuhan khusus.',
      items: [
        {
          id: 'asesmen_diagnostik', nama: 'Profil & Asesmen Awal ABK', icon: '🔍',
          components: [
            { id: 'data_abk', label: 'Data Siswa ABK (Nama, Jenis Kebutuhan, Diagnosa)', type: 'textarea' },
            { id: 'hasil_asesmen', label: 'Hasil Asesmen Awal (Akademik, Sosial, Motorik)', type: 'textarea' },
            { id: 'kekuatan_hambatan', label: 'Profil Kekuatan & Hambatan Belajar', type: 'textarea' }
          ],
          ai_prompt: "Sebagai Guru Pendidikan Khusus (GPK). Susun profil ABK yang komprehensif berbasis kekuatan.\n\n1. PROFIL INDIVIDU: {{data_abk}}.\n2. HASIL ASESMEN AWAL: {{hasil_asesmen}}.\n3. KEKUATAN vs HAMBATAN: {{kekuatan_hambatan}}."
        }
      ]
    },
    {
      id: 'gpk_ppi', role: 'gpk', kategori: 'gpk_ppi',
      nama: 'Perencanaan Program Individual (PPI)', icon: '📋',
      desc: 'Dokumen PPI berbasis hasil asesmen diagnostik.',
      items: [
        {
          id: 'perencanaan_ppi', nama: 'Penyusunan Program Pembelajaran Individual', icon: '📋',
          components: [
            { id: 'tujuan_ppi', label: 'Tujuan Pembelajaran Individual Jangka Pendek & Panjang', type: 'textarea' },
            { id: 'akomodasi', label: 'Akomodasi yang Diperlukan (Materi, Penilaian, Lingkungan)', type: 'textarea' },
            { id: 'strategi_intervensi', label: 'Strategi Intervensi & Pendekatan yang Digunakan', type: 'textarea' }
          ],
          ai_prompt: "Sebagai GPK. Susun PPI yang personal, realistis, dan berbasis kekuatan siswa.\n\n1. TUJUAN INDIVIDUAL SMART: {{tujuan_ppi}}.\n2. AKOMODASI & MODIFIKASI KURIKULUM: {{akomodasi}}.\n3. STRATEGI INTERVENSI: {{strategi_intervensi}}."
        }
      ]
    },
    {
      id: 'gpk_monitoring', role: 'gpk', kategori: 'gpk_monitoring',
      nama: 'Pelaksanaan & Pemantauan Perilaku (Monitoring)', icon: '📡',
      desc: 'Logbook pemantauan perkembangan dan catatan perilaku ABK.',
      items: [
        {
          id: 'pemantauan_perilaku', nama: 'Logbook Pemantauan Perkembangan ABK', icon: '📊',
          components: [
            { id: 'catatan_harian', label: 'Catatan Harian Perkembangan Siswa ABK', type: 'textarea' },
            { id: 'skala_perilaku', label: 'Skala Perkembangan Perilaku (Akademik & Sosial)', type: 'textarea' },
            { id: 'tindak_lanjut', label: 'Tindak Lanjut & Penyesuaian Intervensi', type: 'textarea' }
          ],
          ai_prompt: "Sebagai GPK. Monitor perkembangan siswa ABK secara berkala dan objektif.\n\n1. CATATAN PERKEMBANGAN: {{catatan_harian}}.\n2. SKALA PERILAKU: {{skala_perilaku}}.\n3. PENYESUAIAN INTERVENSI: {{tindak_lanjut}}."
        }
      ]
    },
    {
      id: 'gpk_rapor', role: 'gpk', kategori: 'gpk_rapor',
      nama: 'Evaluasi & Pelaporan Kualitatif (Rapor Inklusi)', icon: '📊',
      desc: 'Laporan perkembangan ABK untuk rapor inklusi dan orang tua.',
      items: [
        {
          id: 'rapor_inklusi', nama: 'Laporan Rapor Inklusi & Evaluasi', icon: '📋',
          components: [
            { id: 'capaian_ppi', label: 'Capaian Tujuan PPI vs Target Awal', type: 'textarea' },
            { id: 'narasi_perkembangan', label: 'Narasi Perkembangan Holistik (Akademik, Sosial, Emosional)', type: 'textarea' },
            { id: 'rekomendasi', label: 'Rekomendasi untuk Orang Tua & Guru Kelas', type: 'textarea' }
          ],
          ai_prompt: "Sebagai GPK. Buat laporan perkembangan ABK yang informatif dan memberdayakan orang tua.\n\n1. CAPAIAN PPI: {{capaian_ppi}}.\n2. NARASI HOLISTIK: {{narasi_perkembangan}}.\n3. REKOMENDASI (untuk ortu & guru kelas): {{rekomendasi}}."
        }
      ]
    },
    {
      id: 'gpk_kemitraan', role: 'gpk', kategori: 'gpk_kemitraan',
      nama: 'Kemitraan & Kolaborasi Lintas Pihak', icon: '🤝',
      desc: 'Kolaborasi dengan orang tua, terapis, psikolog, dan lembaga luar.',
      items: [
        {
          id: 'kemitraan_kolaborasi', nama: 'Administrasi Kemitraan & Kolaborasi', icon: '🤝',
          components: [
            { id: 'komunikasi_ortu', label: 'Catatan Komunikasi & Pertemuan dengan Orang Tua ABK', type: 'textarea' },
            { id: 'keterlibatan_profesional', label: 'Keterlibatan Profesional Luar (Terapis, Psikolog, Dokter)', type: 'textarea' },
            { id: 'koordinasi_guru_kelas', label: 'Koordinasi & Panduan untuk Guru Kelas', type: 'textarea' }
          ],
          ai_prompt: "Sebagai GPK. Kelola kemitraan multi-pihak untuk mendukung siswa ABK secara holistik.\n\n1. KOMUNIKASI & PERTEMUAN ORTU: {{komunikasi_ortu}}.\n2. KETERLIBATAN PROFESIONAL LUAR: {{keterlibatan_profesional}}.\n3. KOORDINASI GURU KELAS: {{koordinasi_guru_kelas}}."
        }
      ]
    },

    // ══════════════════════════════════════════
    // PEMBINA EKSKUL (5 template)
    // ══════════════════════════════════════════
    {
      id: 'eks_program', role: 'ekskul', kategori: 'eks_program',
      nama: 'Perencanaan & Desain Program (Program Kerja)', icon: '📋',
      desc: 'Program kerja tahunan ekskul, jadwal latihan, dan target prestasi.',
      items: [
        {
          id: 'perencanaan_program', nama: 'Program Kerja Tahunan Ekskul', icon: '📋',
          components: [
            { id: 'jenis_ekskul', label: 'Jenis Ekskul, Pembina, dan Target Peserta', type: 'textarea' },
            { id: 'jadwal_latihan', label: 'Jadwal Latihan & Sarana yang Dibutuhkan', type: 'textarea' },
            { id: 'target_prestasi', label: 'Target Prestasi & Kompetisi yang Diikuti', type: 'textarea' }
          ],
          ai_prompt: "Sebagai Pembina Ekskul Profesional. Rancang program kerja yang terstruktur menuju prestasi.\n\n1. PETA EKSKUL (pembina & kapasitas): {{jenis_ekskul}}.\n2. JADWAL LATIHAN EFEKTIF: {{jadwal_latihan}}.\n3. ROADMAP PRESTASI: {{target_prestasi}}."
        }
      ]
    },
    {
      id: 'eks_keanggotaan', role: 'ekskul', kategori: 'eks_keanggotaan',
      nama: 'Manajemen Keanggotaan & Kehadiran (Membership)', icon: '📝',
      desc: 'Daftar anggota, presensi latihan, dan manajemen membership.',
      items: [
        {
          id: 'manajemen_keanggotaan', nama: 'Daftar Anggota & Presensi Ekskul', icon: '📝',
          components: [
            { id: 'daftar_anggota', label: 'Daftar Nama Anggota, Kelas, dan Posisi/Bagian', type: 'textarea' },
            { id: 'presensi_latihan', label: 'Presensi Kehadiran Latihan Mingguan', type: 'textarea' },
            { id: 'pengelolaan_membership', label: 'Pengelolaan Rekruitmen & Pengunduran Diri Anggota', type: 'textarea' }
          ],
          ai_prompt: "Sebagai Pembina Ekskul. Kelola keanggotaan dan kehadiran latihan secara tertib.\n\n1. DAFTAR ANGGOTA AKTIF: {{daftar_anggota}}.\n2. REKAP KEHADIRAN: {{presensi_latihan}}.\n3. MANAJEMEN MEMBERSHIP: {{pengelolaan_membership}}."
        }
      ]
    },
    {
      id: 'eks_operasional', role: 'ekskul', kategori: 'eks_operasional',
      nama: 'Pelaksanaan & Operasional Lapangan', icon: '🏃',
      desc: 'Jurnal latihan harian, materi latihan, dan catatan perkembangan.',
      items: [
        {
          id: 'operasional_lapangan', nama: 'Jurnal & Operasional Latihan', icon: '📓',
          components: [
            { id: 'materi_latihan', label: 'Materi Latihan Sesi Ini (Teknik, Taktik, Fisik)', type: 'textarea' },
            { id: 'evaluasi_sesi', label: 'Evaluasi Pelaksanaan Sesi Latihan', type: 'textarea' },
            { id: 'catatan_individu', label: 'Catatan Perkembangan Individu Anggota', type: 'textarea' }
          ],
          ai_prompt: "Sebagai Pembina Ekskul di lapangan. Dokumentasikan dan evaluasi latihan.\n\n1. MATERI SESI: {{materi_latihan}}.\n2. EVALUASI PELAKSANAAN: {{evaluasi_sesi}}.\n3. PERKEMBANGAN INDIVIDU: {{catatan_individu}}."
        }
      ]
    },
    {
      id: 'eks_prestasi', role: 'ekskul', kategori: 'eks_prestasi',
      nama: 'Penilaian, Talenta & Bank Prestasi (Talent Pool)', icon: '🏆',
      desc: 'Profil talenta, rekam prestasi kejuaraan, dan scouting bakat.',
      items: [
        {
          id: 'bank_prestasi', nama: 'Bank Data Talenta & Prestasi Ekskul', icon: '🏆',
          components: [
            { id: 'profil_talenta', label: 'Profil Talenta Unggul (Kemampuan, Potensi, Posisi)', type: 'textarea' },
            { id: 'rekam_prestasi', label: 'Riwayat Prestasi & Kejuaraan yang Diikuti', type: 'textarea' },
            { id: 'rencana_talent', label: 'Rencana Pengembangan Talenta Jangka Menengah', type: 'textarea' }
          ],
          ai_prompt: "Sebagai Pembina Ekskul & Scout Bakat. Kelola bank prestasi dan pengembangan talenta.\n\n1. PROFIL TALENTA: {{profil_talenta}}.\n2. REKAM JEJAK PRESTASI: {{rekam_prestasi}}.\n3. RENCANA PENGEMBANGAN: {{rencana_talent}}."
        }
      ]
    },
    {
      id: 'eks_event', role: 'ekskul', kategori: 'eks_event',
      nama: 'Pelaporan & Event Khusus (Event Management)', icon: '🎊',
      desc: 'Proposal event, laporan pelaksanaan, dan dokumentasi kegiatan.',
      items: [
        {
          id: 'pelaporan_event', nama: 'Manajemen Event & Pelaporan Ekskul', icon: '🎊',
          components: [
            { id: 'proposal_event', label: 'Proposal Event / Perlombaan yang Diikuti', type: 'textarea' },
            { id: 'laporan_event', label: 'Laporan Pelaksanaan Event (Hasil & Evaluasi)', type: 'textarea' },
            { id: 'dokumentasi', label: 'Dokumentasi Kegiatan yang Perlu Disiapkan', type: 'textarea' }
          ],
          ai_prompt: "Sebagai Event Coordinator Ekskul. Susun proposal dan laporan event yang profesional.\n\n1. PROPOSAL EVENT: {{proposal_event}}.\n2. LAPORAN PELAKSANAAN: {{laporan_event}}.\n3. PANDUAN DOKUMENTASI: {{dokumentasi}}."
        }
      ]
    },

    // ══════════════════════════════════════════
    // PUSTAKAWAN (5 template)
    // ══════════════════════════════════════════
    {
      id: 'perp_ekosistem', role: 'pustakawan', kategori: 'perp_ekosistem',
      nama: 'Perencanaan & Manajemen Ekosistem Literasi', icon: '📚',
      desc: 'Perencanaan program perpustakaan dan pengelolaan ekosistem literasi sekolah.',
      items: [
        {
          id: 'manajemen_ekosistem', nama: 'Program & Ekosistem Literasi Sekolah', icon: '🌳',
          components: [
            { id: 'peta_literasi', label: 'Pemetaan Kebiasaan Membaca Warga Sekolah', type: 'textarea' },
            { id: 'program_perpus', label: 'Program Unggulan Perpustakaan Tahun Ini', type: 'textarea' },
            { id: 'target_kunjungan', label: 'Target Kunjungan & Statistik Peminjaman', type: 'textarea' }
          ],
          ai_prompt: "Sebagai Pustakawan Promotor Literasi. Rancang ekosistem literasi yang sehat dan megah.\n\n1. PETA KEBIASAAN MEMBACA: {{peta_literasi}}.\n2. PROGRAM UNGGULAN: {{program_perpus}}.\n3. TARGET STATISTIK: {{target_kunjungan}}."
        }
      ]
    },
    {
      id: 'perp_katalog', role: 'pustakawan', kategori: 'perp_katalog',
      nama: 'Pengolahan Bahan Pustaka (Katalogisasi)', icon: '📝',
      desc: 'Katalogisasi koleksi baru menggunakan standar DDC.',
      items: [
        {
          id: 'katalogisasi_pustaka', nama: 'Entry Katalog Koleksi Baru', icon: '📝',
          components: [
            { id: 'data_buku', label: 'Data Buku (Judul, Pengarang, Penerbit, ISBN, Tahun)', type: 'textarea' },
            { id: 'klasifikasi_ddc', label: 'Nomor Klasifikasi DDC & Tajuk Subjek', type: 'textarea' },
            { id: 'kondisi_fisik', label: 'Kondisi Fisik & Lokasi Rak Penyimpanan', type: 'textarea' }
          ],
          ai_prompt: "Sebagai Pustakawan Profesional. Bantu proses katalogisasi koleksi baru sesuai standar AACR2.\n\n1. ENTRI BIBLIOGRAFI: {{data_buku}}.\n2. KLASIFIKASI DDC: {{klasifikasi_ddc}}.\n3. INVENTARIS FISIK: {{kondisi_fisik}}."
        }
      ]
    },
    {
      id: 'perp_sirkulasi', role: 'pustakawan', kategori: 'perp_sirkulasi',
      nama: 'Administrasi Sirkulasi & Layanan Pengguna', icon: '🔄',
      desc: 'Peminjaman, pengembalian, denda, dan layanan pengguna perpustakaan.',
      items: [
        {
          id: 'sirkulasi_layanan', nama: 'Data Peminjaman, Pengembalian & Denda', icon: '📖',
          components: [
            { id: 'data_peminjam', label: 'Data Peminjam (Nama, Kelas, No Anggota)', type: 'textarea' },
            { id: 'data_buku_pinjam', label: 'Data Buku yang Dipinjam (Judul, No Induk, Tgl Pinjam-Kembali)', type: 'textarea' },
            { id: 'status_keterlambatan', label: 'Status Keterlambatan & Perhitungan Denda', type: 'textarea' }
          ],
          ai_prompt: "Sebagai Sistem Sirkulasi Perpustakaan. Kelola data peminjaman secara akurat.\n\n1. VERIFIKASI ANGGOTA: {{data_peminjam}}.\n2. TRANSAKSI SIRKULASI: {{data_buku_pinjam}}.\n3. PERHITUNGAN DENDA & STATUS: {{status_keterlambatan}}."
        }
      ]
    },
    {
      id: 'perp_literasi', role: 'pustakawan', kategori: 'perp_literasi',
      nama: 'Program Literasi & Dukungan Deep Learning', icon: '📖',
      desc: 'Program GLS, sudut baca, dan dukungan perpustakaan untuk Kurikulum Merdeka.',
      items: [
        {
          id: 'program_literasi', nama: 'Program Gerakan Literasi Sekolah (GLS)', icon: '📅',
          components: [
            { id: 'tema_gls', label: 'Tema Literasi & Target Peserta Didik', type: 'textarea' },
            { id: 'kegiatan_gls', label: 'Kegiatan GLS (Sudut Baca, Storytime, Bookfair)', type: 'textarea' },
            { id: 'koleksi_pendukung', label: 'Koleksi Buku Pendukung yang Direkomendasikan', type: 'textarea' }
          ],
          ai_prompt: "Sebagai Promotor Literasi Sekolah. Rancang program GLS yang menarik dan sustainable.\n\n1. DESAIN TEMA LITERASI: {{tema_gls}}.\n2. KALENDER KEGIATAN VARIATIF: {{kegiatan_gls}}.\n3. KURASI KOLEKSI: {{koleksi_pendukung}}."
        }
      ]
    },
    {
      id: 'perp_penyiangan', role: 'pustakawan', kategori: 'perp_penyiangan',
      nama: 'Pemeliharaan, Penyiangan & Pelaporan (Closing)', icon: '📊',
      desc: 'Penyiangan koleksi, pemeliharaan buku, dan pelaporan statistik perpustakaan.',
      items: [
        {
          id: 'pelaporan_penyiangan', nama: 'Penyiangan Koleksi & Laporan Perpustakaan', icon: '📊',
          components: [
            { id: 'koleksi_penyiangan', label: 'Daftar Koleksi yang Akan Disiangi (Rusak/Kadaluarsa/Jarang Dipinjam)', type: 'textarea' },
            { id: 'statistik_perpus', label: 'Statistik Perpustakaan (Kunjungan, Peminjaman, Koleksi)', type: 'textarea' },
            { id: 'laporan_tahunan', label: 'Laporan Tahunan Kondisi & Perkembangan Perpustakaan', type: 'textarea' }
          ],
          ai_prompt: "Sebagai Pustakawan. Lakukan penyiangan koleksi yang terencana dan buat laporan pertanggungjawaban.\n\n1. KRITERIA PENYIANGAN: {{koleksi_penyiangan}}.\n2. STATISTIK PERPUSTAKAAN: {{statistik_perpus}}.\n3. LAPORAN TAHUNAN: {{laporan_tahunan}}."
        }
      ]
    }

  ] // end TEMPLATES

}; // end window.CimegaMasterData

// ── Validasi saat load ──────────────────────────────────────────
console.log(`✅ CimegaMasterData loaded: ${window.CimegaMasterData.KATEGORI.length} kategori, ${window.CimegaMasterData.TEMPLATES.length} templates`);
