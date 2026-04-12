/**
 * =============================================================
 * CIMEGA SMART OFFICE — Modul Operator Sekolah (OPS)
 * FILE    : kesiswaan_bansos.js
 * MODUL   : Administrasi Kesiswaan & Bantuan Sosial
 * STANDAR : Dapodik / Emis / PIP / PPDB
 * =============================================================
 *
 * Mencakup:
 *  1. PPDB (Penerimaan Peserta Didik Baru)
 *  2. Manajemen Rombongan Belajar (Rombel)
 *  3. Mutasi Siswa (Masuk / Keluar / Lulus)
 *  4. Bantuan PIP (Program Indonesia Pintar)
 * =============================================================
 */

// ── KONSTANTA REFERENSI ──────────────────────────────────────

export const JALUR_PPDB = [
  'Zonasi', 'Afirmasi', 'Prestasi', 'Perpindahan Orang Tua', 'Mandiri',
];

export const STATUS_PPDB = {
  DAFTAR:   'Sudah Mendaftar',
  VERIF:    'Sedang Diverifikasi',
  LULUS:    'Lulus Seleksi',
  TIDAK_LULUS: 'Tidak Lulus',
  MUNDUR:   'Mengundurkan Diri',
};

export const JENIS_MUTASI = {
  MASUK:   { label: 'Pindah Masuk',  kode: 'masuk'  },
  KELUAR:  { label: 'Pindah Keluar', kode: 'keluar' },
  LULUS:   { label: 'Lulus / Tamat', kode: 'lulus'  },
  DO:      { label: 'Drop Out',      kode: 'do'     },
};

export const JENIS_ROMBEL = [
  'Reguler', 'Inklusif', 'Akselerasi', 'Kelas Internasional',
];

export const STATUS_PIP = {
  BELUM_REKENING:  'Belum Punya Rekening',
  SUDAH_REKENING:  'Sudah Punya Rekening',
  SUDAH_AKTIVASI:  'Rekening Sudah Diaktivasi',
  CAIR:            'Dana Sudah Cair',
  BELUM_CAIR:      'Dana Belum Cair',
  TIDAK_LAYAK:     'Tidak Layak PIP',
};

// ── 1. PPDB (PENERIMAAN PESERTA DIDIK BARU) ──────────────────

export const skemaPPDB = {
  id_ppdb:            '',     // String  — ID dokumen PPDB
  id_sekolah:         '',     // String
  tahun_pelajaran:    '',     // String  — cth: "2024/2025"
  gelombang:          0,      // Number  — Gelombang pendaftaran ke-1, ke-2, dst
  kelas_tujuan:       '',     // String  — "Kelas 1" (untuk SD biasanya Kelas 1)
  kuota_tersedia:     0,      // Number  — Total kuota penerimaan
  kuota_per_jalur: {
    zonasi:           0,      // Number
    afirmasi:         0,      // Number
    prestasi:         0,      // Number
    perpindahan_ortu: 0,      // Number
    mandiri:          0,      // Number
  },

  daftar_calon_siswa: [
    {
      id_pendaftar:       '', // String   — ID unik pendaftar
      no_pendaftaran:     '', // String   — Nomor urut pendaftaran
      nama_lengkap:       '', // String
      nik:                '', // String   — NIK calon siswa
      tgl_lahir:          '', // String   — "YYYY-MM-DD"
      jenis_kelamin:      '', // String   — "L" | "P"
      asal_sekolah:       '', // String   — Nama TK/RA/PAUD asal
      nama_ayah:          '', // String
      nama_ibu:           '', // String
      no_hp_ortu:         '', // String
      alamat_lengkap:     '', // String
      jarak_ke_sekolah_m: 0,  // Number   — Jarak rumah ke sekolah (meter) untuk zonasi
      jalur_daftar:       '', // String   — Dari JALUR_PPDB
      nilai_prestasi:     0,  // Number   — Nilai rapor / sertifikat (untuk jalur prestasi)

      // Status berkas
      berkas_lengkap:     false, // Boolean — true = semua berkas terpenuhi
      berkas_yang_ada: {
        akta_lahir:       false, // Boolean
        kartu_keluarga:   false, // Boolean
        foto_formal:      false, // Boolean
        surat_keterangan_asal: false, // Boolean
        pk_pip:           false, // Boolean — Kartu PIP (untuk jalur afirmasi)
        sertifikat_prestasi: false, // Boolean (untuk jalur prestasi)
      },

      // Hasil seleksi
      skor_seleksi:       0,    // Number   — Skor total berdasarkan jalur
      peringkat:          0,    // Number   — Peringkat dalam seleksi
      status_lulus:       '',   // String   — Dari STATUS_PPDB
      tgl_daftar:         '',   // String   — "YYYY-MM-DD"
      tgl_diterima:       '',   // String   — "YYYY-MM-DD" (jika lulus)
      catatan_operator:   '',   // String
    }
  ],

  // Rekap PPDB
  rekap: {
    total_pendaftar:    0, // Number
    total_lulus:        0, // Number
    total_tidak_lulus:  0, // Number
    total_mundur:       0, // Number
    sisa_kuota:         0, // Number
  },

  status_ppdb:          '', // String  — "Buka" | "Tutup" | "Pengumuman" | "Daftar Ulang"
  tgl_buka:             '', // String
  tgl_tutup:            '', // String
  tgl_pengumuman:       '', // String
  dibuat_pada:          null, // Date
  diubah_pada:          null, // Date
};

// ── 2. MANAJEMEN ROMBONGAN BELAJAR (ROMBEL) ──────────────────

export const skemaRombel = {
  id_rombel:            '',   // String
  id_sekolah:           '',   // String
  tahun_pelajaran:      '',   // String
  semester:             '',   // String  — "Ganjil" | "Genap"

  nama_kelas:           '',   // String  — cth: "Kelas 4A", "Kelas 5B"
  tingkat_kelas:        '',   // String  — "Kelas 1" | "Kelas 2" | ... | "Kelas 6"
  fase:                 '',   // String  — "A" | "B" | "C" (Kurikulum Merdeka)
  jenis_rombel:         '',   // String  — Dari JENIS_ROMBEL
  kurikulum:            '',   // String  — "Kurikulum Merdeka" | "Kurikulum 2013"

  // — WALI KELAS —
  id_wali_kelas:        '',   // String  — Referensi ke data PTK
  nama_wali_kelas:      '',   // String

  // — RUANG KELAS —
  nama_ruang:           '',   // String  — cth: "Ruang Kelas 4A"
  kapasitas_ruang:      0,    // Number  — Kapasitas ideal ruang (murid)

  // — DAFTAR SISWA —
  daftar_id_siswa:      [],   // Array<String>  — ID siswa anggota rombel
  jumlah_siswa_l:       0,    // Number  — Laki-laki
  jumlah_siswa_p:       0,    // Number  — Perempuan
  total_siswa:          0,    // Number

  // — JADWAL KELAS —
  jam_masuk:            '',   // String  — cth: "07.00"
  jam_pulang:           '',   // String  — cth: "13.30"

  // — STATUS DAPODIK —
  sudah_sinkron_dapodik: false, // Boolean
  id_rombel_dapodik:    '',   // String  — ID rombel di sistem Dapodik

  dibuat_pada:          null, // Date
  diubah_pada:          null, // Date
};

// ── 3. MUTASI SISWA ──────────────────────────────────────────

export const skemaMutasiSiswa = {
  id_mutasi:            '',   // String
  id_sekolah:           '',   // String
  id_operator:          '',   // String  — Operator yang memproses

  tanggal_mutasi:       '',   // String  — "YYYY-MM-DD"
  tahun_pelajaran:      '',   // String
  semester:             '',   // String

  // — DATA SISWA —
  id_siswa:             '',   // String  — Referensi ke data PD
  nisn:                 '',   // String
  nama_siswa:           '',   // String
  kelas_asal:           '',   // String  — Kelas saat mutasi dilakukan

  jenis_mutasi:         '',   // String  — "masuk" | "keluar" | "lulus" | "do"
  alasan_mutasi:        '',   // String  — Narasi alasan kepindahan

  // — UNTUK MUTASI MASUK —
  sekolah_asal:         '',   // String  — Nama sekolah asal (jika masuk)
  no_surat_pindah_masuk: '',  // String  — Nomor surat mutasi dari sekolah asal

  // — UNTUK MUTASI KELUAR / LULUS —
  sekolah_tujuan:       '',   // String  — Nama sekolah tujuan (jika keluar)
  no_surat_keluar:      '',   // String  — Nomor surat keterangan pindah keluar
  tgl_surat_keluar:     '',   // String  — "YYYY-MM-DD"

  // — BERKAS DIGITAL —
  file_surat_pindah:    '',   // String  — URL scan surat pindah
  file_sttb_ijazah:     '',   // String  — URL scan STTB/ijazah (untuk lulus)
  file_raport_terakhir: '',   // String  — URL scan rapor terakhir

  // — STATUS PROSES —
  status_proses:        '',   // String  — "Diproses" | "Selesai" | "Dibatalkan"
  catatan_operator:     '',   // String
  sudah_diupdate_dapodik: false, // Boolean

  dibuat_pada:          null, // Date
  diubah_pada:          null, // Date
};

// ── 4. BANTUAN PIP (PROGRAM INDONESIA PINTAR) ────────────────

export const skemaPIP = {
  id_pip:               '',   // String
  id_sekolah:           '',   // String
  tahun_anggaran:       '',   // String  — cth: "2024"
  semester:             '',   // String

  daftar_penerima_pip: [
    {
      id_siswa:             '', // String  — Referensi ke data PD
      nisn:                 '', // String
      nik:                  '', // String
      nama_siswa:           '', // String
      kelas:                '', // String
      nama_ortu:            '', // String

      // Rekening bank
      nama_bank:            '', // String  — "BRI" | "BNI" | "BSI" | dst
      no_rekening:          '', // String  — Nomor rekening penerima PIP
      atas_nama_rekening:   '', // String  — Nama pemilik rekening
      no_atm:               '', // String  — Nomor ATM (jika ada)

      // Status
      status_pip:           '', // String  — Dari STATUS_PIP
      sudah_aktivasi:       false, // Boolean — Rekening sudah diaktivasi di bank
      tgl_aktivasi:         '',  // String  — Tanggal aktivasi rekening
      nominal_pip:          0,   // Number  — Nominal yang diterima (Rp)
      tgl_cair:             '',  // String  — Tanggal dana cair
      status_cair:          false, // Boolean — true = dana sudah dicairkan

      // Bukti & dokumen
      bukti_aktivasi_rekening: '', // String  — URL foto buku tabungan / ATM yang sudah aktif
      bukti_cair:              '', // String  — URL foto saat pencairan
      sk_penerima_pip:         '', // String  — URL scan SK penetapan penerima PIP
      kartu_pip:               '', // String  — URL foto Kartu Indonesia Pintar (KIP)

      catatan_kendala:     '',   // String  — Catatan jika ada masalah pencairan
    }
  ],

  // Rekap
  rekap: {
    total_penerima:     0, // Number
    total_sudah_cair:   0, // Number
    total_belum_cair:   0, // Number
    total_nominal_cair: 0, // Number  — Total dana yang sudah cair (Rp)
  },

  operator_penanggung_jawab: '', // String
  dibuat_pada:  null, // Date
  diubah_pada:  null, // Date
};
