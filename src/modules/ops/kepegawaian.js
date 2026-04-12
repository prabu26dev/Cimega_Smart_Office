/**
 * =============================================================
 * CIMEGA SMART OFFICE — Modul Operator Sekolah (OPS)
 * FILE    : kepegawaian.js
 * MODUL   : Administrasi Kepegawaian (GTK)
 * STANDAR : Dapodik / Info GTK / Simtun / SKMT-SKBK
 * =============================================================
 *
 * Mencakup:
 *  1. Manajemen Tugas Mengajar PTK
 *  2. Manajemen SK (Surat Keputusan) Kepegawaian
 *  3. Info GTK — Status Sertifikasi & Beban Kerja
 * =============================================================
 */

// ── KONSTANTA REFERENSI ──────────────────────────────────────

export const STATUS_PEGAWAI = [
  'PNS', 'PPPK', 'GTT (Guru Tidak Tetap)', 'GTY (Guru Tetap Yayasan)',
  'Honorer', 'PTT (Pegawai Tidak Tetap)',
];

export const JENIS_PTK = [
  'Guru Kelas', 'Guru Mata Pelajaran', 'Guru BK/Konselor',
  'Kepala Sekolah', 'Wakil Kepala Sekolah', 'Tenaga Administrasi',
  'Tenaga Perpustakaan', 'Tenaga Laboratorium', 'Penjaga Sekolah',
];

export const TUGAS_TAMBAHAN = [
  'Wali Kelas',
  'Koordinator P5 (Projek Profil Pelajar Pancasila)',
  'Koordinator Kurikulum',
  'Koordinator Kesiswaan',
  'Koordinator Sarana Prasarana',
  'Koordinator Humas',
  'Koordinator UKS',
  'Pembina Pramuka',
  'Pembina OSIS/MPK',
  'Bendahara BOS',
  'Operator Dapodik',
  'Kepala Perpustakaan',
  'Kepala Laboratorium',
];

export const JENIS_SK = [
  'SK Pengangkatan',
  'SK Tugas Mengajar',
  'SK Pembagian Tugas',
  'SK Wali Kelas',
  'SK Koordinator P5',
  'SK Panitia Ujian',
  'SK Kegiatan Sekolah',
  'SK Mutasi / Rotasi',
  'SK Pemberhentian',
  'SK Tunjangan Sertifikasi',
];

export const STATUS_SERTIFIKASI = [
  'Sudah Sertifikasi (PPG)',
  'Sedang PPG',
  'Belum Sertifikasi',
  'Sertifikasi Melalui PLPG',
];

// ── 1. TUGAS MENGAJAR PTK ────────────────────────────────────

export const skemaTugasMengajar = {
  id_tugas:             '',   // String
  id_sekolah:           '',   // String
  semester:             '',   // String  — "Ganjil" | "Genap"
  tahun_pelajaran:      '',   // String

  daftar_tugas_guru: [
    {
      id_guru:              '', // String  — Referensi ke data PTK
      nip_nuptk:            '', // String
      nama_guru:            '', // String
      jenis_ptk:            '', // String  — Dari JENIS_PTK
      status_pegawai:       '', // String  — Dari STATUS_PEGAWAI

      // — MAPEL YANG DIAMPU —
      mapel_diampu: [
        {
          nama_mapel:       '', // String  — cth: "Matematika"
          id_rombel:        '', // String  — Referensi ke Rombel
          nama_kelas:       '', // String  — cth: "Kelas 4A"
          jam_per_minggu:   0,  // Number  — JP tatap muka per minggu
        }
      ],

      total_jam_mapel_mingguan: 0,  // Number  — Total JP mengajar seluruh kelas
      total_jam_tugas_tambahan: 0,  // Number  — JP ekuivalen tugas tambahan

      // — TUGAS TAMBAHAN —
      tugas_tambahan: [
        {
          nama_tugas:       '', // String  — Dari TUGAS_TAMBAHAN
          deskripsi:        '', // String  — Keterangan detail tugas
          jp_ekuivalen:     0,  // Number  — Jam ekuivalen untuk beban kerja
          no_sk:            '', // String  — SK yang mendasari tugas ini
        }
      ],

      // — TOTAL BEBAN KERJA —
      total_jam_keseluruhan: 0,    // Number  — Harus ≥ 24 JP untuk pemenuhan beban kerja
      beban_kerja_terpenuhi: false, // Boolean — true jika ≥ 24 JP
      catatan_kekurangan_jp: '',   // String  — Catatan jika JP kurang
    }
  ],

  disetujui_kepsek:  false, // Boolean
  dibuat_pada:       null,  // Date
  diubah_pada:       null,  // Date
};

// ── 2. MANAJEMEN SK (SURAT KEPUTUSAN) ────────────────────────

export const skemaSK = {
  id_sk:                '',   // String
  id_sekolah:           '',   // String
  no_sk:                '',   // String  — Nomor Surat Keputusan resmi
  jenis_sk:             '',   // String  — Dari JENIS_SK
  judul_sk:             '',   // String  — Judul lengkap SK
  tgl_sk:               '',   // String  — Tanggal terbit SK (YYYY-MM-DD)
  tgl_berlaku_mulai:    '',   // String  — Tanggal mulai berlaku
  tgl_berlaku_sampai:   '',   // String  — Tanggal berakhir (kosong = tidak terbatas)
  semester:             '',   // String
  tahun_pelajaran:      '',   // String

  // — PIHAK YANG MENANDATANGANI —
  ditandatangani_oleh:  '',   // String  — Nama pejabat penandatangan
  jabatan_penandatangan: '',  // String  — cth: "Kepala Sekolah", "Kepala Dinas"

  // — DAFTAR GURU YANG DITUGASKAN —
  daftar_guru_bertugas: [
    {
      id_guru:    '', // String
      nama_guru:  '', // String
      tugas:      '', // String  — Tugas spesifik dalam SK ini
    }
  ],

  // — DOKUMEN DIGITAL —
  file_sk:              '',   // String  — URL scan / file SK
  catatan:              '',   // String
  dibuat_pada:          null, // Date
  diubah_pada:          null, // Date
};

// ── 3. INFO GTK — STATUS SERTIFIKASI & BEBAN KERJA ───────────

export const skemaInfoGTK = {
  id_info_gtk:          '',   // String
  id_sekolah:           '',   // String
  semester:             '',   // String
  tahun_pelajaran:      '',   // String

  daftar_gtk: [
    {
      id_guru:              '', // String
      nuptk:                '', // String
      nama_guru:            '', // String
      jenis_kelamin:        '', // String  — "L" | "P"
      status_pegawai:       '', // String  — Dari STATUS_PEGAWAI
      jenis_ptk:            '', // String  — Dari JENIS_PTK

      // — SERTIFIKASI —
      status_sertifikasi:   false,  // Boolean — true = sudah punya sertifikat pendidik
      jenis_sertifikasi:    '',     // String  — Dari STATUS_SERTIFIKASI
      no_sertifikat:        '',     // String  — Nomor sertifikat pendidik
      tgl_sertifikat:       '',     // String  — Tanggal terbit sertifikat
      bidang_sertifikasi:   '',     // String  — Bidang studi sertifikasi
      sudah_terima_tunjangan: false, // Boolean — Apakah sudah terima tunjangan sertifikasi

      // — BEBAN KERJA —
      total_jp_tatap_muka:  0,     // Number  — Total JP tatap muka per minggu
      total_jp_tugas_tambahan: 0,  // Number  — JP ekuivalen tugas tambahan
      total_jp_keseluruhan: 0,     // Number
      beban_kerja_terpenuhi: false, // Boolean — ≥ 24 JP
      keterangan_bk:        '',    // String  — Penjelasan jika BK tidak terpenuhi

      // — KEHADIRAN & SINKRON —
      sinkron_hadir:        false, // Boolean — Status sinkron kehadiran di Dapodik
      tgl_sinkron_terakhir: '',    // String  — Tanggal terakhir sinkron

      // — SK DAN DOKUMEN —
      no_sk_tugas_mengajar: '',  // String  — Nomor SK Tugas Mengajar aktif
      no_sk_wali_kelas:     '',  // String  — Nomor SK Wali Kelas (jika ada)

      // — STATUS DI INFO GTK ONLINE —
      status_info_gtk:      '',  // String  — "Valid" | "Tidak Valid" | "Belum Dicek"
      catatan_info_gtk:     '',  // String  — Keterangan masalah dari Info GTK
    }
  ],

  // Rekap otomatis
  rekap: {
    total_gtk:                  0, // Number
    total_sudah_sertifikasi:    0, // Number
    total_belum_sertifikasi:    0, // Number
    total_bk_terpenuhi:         0, // Number
    total_bk_tidak_terpenuhi:   0, // Number
  },

  operator_penanggung_jawab:  '', // String
  dibuat_pada:                null, // Date
  diubah_pada:                null, // Date
};
