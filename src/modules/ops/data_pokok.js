/**
 * =============================================================
 * CIMEGA SMART OFFICE — Modul Operator Sekolah (OPS)
 * FILE    : data_pokok.js
 * MODUL   : Manajemen Data Pokok Sekolah
 * STANDAR : Dapodik / Emis / Sinkronisasi Kemdikbud
 * =============================================================
 *
 * Mencakup:
 *  1. Profil Sekolah
 *  2. Verval Siswa / Peserta Didik (PD)
 *  3. Verval Guru / PTK (Pendidik & Tenaga Kependidikan)
 *  4. Verval Kelembagaan / Satuan Pendidikan (SP)
 * =============================================================
 */

// ── KONSTANTA REFERENSI ──────────────────────────────────────

export const JENJANG_SEKOLAH = ['SD', 'SMP', 'SMA', 'SMK', 'SLB', 'PAUD/TK'];

export const STATUS_SEKOLAH = ['Negeri', 'Swasta'];

export const STATUS_AKREDITASI = ['A', 'B', 'C', 'Belum Terakreditasi'];

export const STATUS_KEPEMILIKAN_TANAH = [
  'Milik Sendiri', 'Pemerintah Daerah', 'Sewa', 'Pinjam Pakai', 'Wakaf',
];

export const STATUS_INTERNET = [
  'Ada (Wifi)', 'Ada (Kabel LAN)', 'Ada (Modem)', 'Tidak Ada',
];

export const STATUS_LISTRIK = [
  'PLN (daya memadai)', 'PLN (daya kurang)', 'Genset', 'Solar Cell', 'Tidak Ada',
];

export const STATUS_PERBAIKAN_VERVAL = [
  'Sudah Sinkron', 'Perlu Perbaikan', 'Menunggu Verifikasi', 'Ditolak',
];

// ── 1. PROFIL SEKOLAH ────────────────────────────────────────

export const skemaProfilSekolah = {
  id_sekolah:           '',     // String  — ID unik sekolah di sistem Cimega
  npsn:                 '',     // String  — Nomor Pokok Sekolah Nasional (8 digit)
  nama_sekolah:         '',     // String  — Nama resmi sekolah
  jenjang:              '',     // String  — Dari JENJANG_SEKOLAH
  status_sekolah:       '',     // String  — "Negeri" | "Swasta"
  akreditasi:           '',     // String  — Dari STATUS_AKREDITASI
  nss:                  '',     // String  — Nomor Statistik Sekolah (12 digit)

  // — ALAMAT LENGKAP —
  alamat: {
    jalan:          '', // String
    rt:             '', // String
    rw:             '', // String
    desa_kelurahan: '', // String
    kecamatan:      '', // String
    kota_kabupaten: '', // String
    provinsi:       '', // String
    kode_pos:       '', // String
  },

  // — KOORDINAT GPS —
  koordinat: {
    lat:  0, // Number  — Latitude (contoh: -7.250445)
    long: 0, // Number  — Longitude (contoh: 112.768845)
  },

  // — KONTAK SEKOLAH —
  no_telepon:           '', // String
  email_sekolah:        '', // String
  website:              '', // String

  // — INFRASTRUKTUR —
  status_listrik:       '', // String  — Dari STATUS_LISTRIK
  daya_listrik_watt:    0,  // Number  — Daya listrik tersedia (Watt)
  status_internet:      '', // String  — Dari STATUS_INTERNET
  kecepatan_internet_mbps: 0, // Number — Kecepatan internet (Mbps)
  sumber_air_bersih:    '', // String  — "PDAM" | "Sumur" | "Tidak Ada"

  // — KEPALA SEKOLAH —
  kepala_sekolah: {
    id_guru:    '', // String
    nama:       '', // String
    nip:        '', // String
    nuptk:      '', // String
  },

  // — STATUS SINKRON DAPODIK —
  status_sinkron_dapodik: '', // String  — "Sudah Sinkron" | "Belum Sinkron"
  tgl_sinkron_terakhir:   '', // String  — "YYYY-MM-DD"
  semester_dapodik:       '', // String  — cth: "20241" (Ganjil 2024)
  tahun_pelajaran:        '', // String  — cth: "2024/2025"

  dibuat_pada:  null, // Date (Timestamp)
  diubah_pada:  null, // Date (Timestamp)
};

// ── 2. VERVAL SISWA / PESERTA DIDIK (PD) ─────────────────────

export const skemaVervalPD = {
  id_verval_pd:         '',     // String  — ID dokumen verval
  id_sekolah:           '',     // String
  semester:             '',     // String  — Semester aktif Dapodik
  tahun_pelajaran:      '',     // String

  daftar_pd: [
    {
      id_pd:                '', // String  — ID lokal Dapodik
      nisn:                 '', // String  — Nomor Induk Siswa Nasional (10 digit)
      nik:                  '', // String  — NIK KTP/KK (16 digit)
      nama_lengkap:         '', // String
      tgl_lahir:            '', // String  — "YYYY-MM-DD"
      jenis_kelamin:        '', // String  — "L" | "P"
      nama_ibu_kandung:     '', // String  — WAJIB untuk verval Dapodik
      no_kk:                '', // String  — Nomor Kartu Keluarga
      kelas:                '', // String  — cth: "Kelas 3"
      fase:                 '', // String  — "A" | "B" | "C" (Kurikulum Merdeka)
      status_perbaikan_data: '', // String — Dari STATUS_PERBAIKAN_VERVAL
      catatan_kesalahan:    '', // String  — Keterangan data yang salah/perlu diperbaiki
      foto_kk:              '', // String  — URL foto KK (untuk verval NIK)
      sudah_sinkron:        false, // Boolean — Sudah masuk ke Dapodik pusat?
    }
  ],

  total_pd:                 0, // Number  — Total siswa di semester ini
  total_sudah_sinkron:      0, // Number
  total_perlu_perbaikan:    0, // Number
  tgl_update:               '', // String  — Tanggal update terakhir
  operator_penanggung_jawab: '', // String  — Nama/ID operator yang input
};

// ── 3. VERVAL GURU / PTK ─────────────────────────────────────

export const skemaVervalPTK = {
  id_verval_ptk:        '',     // String
  id_sekolah:           '',     // String
  semester:             '',     // String
  tahun_pelajaran:      '',     // String

  daftar_ptk: [
    {
      id_ptk:               '', // String
      nuptk:                '', // String  — Nomor Unik PTK (16 digit), bisa kosong jika belum punya
      nik:                  '', // String  — NIK KTP (16 digit)
      nama_lengkap:         '', // String
      tgl_lahir:            '', // String  — "YYYY-MM-DD"
      jenis_kelamin:        '', // String  — "L" | "P"
      status_pegawai:       '', // String  — "PNS" | "PPPK" | "GTT" | "GTY" | "Honorer" | "PTT"
      status_aktif:         '', // String  — "Aktif" | "Pensiun" | "Mutasi" | "Nonaktif"
      pendidikan_terakhir:  '', // String  — "S1" | "S2" | "D3" | "SMA" | dst
      bidang_studi_ijazah:  '', // String  — Bidang studi di ijazah terakhir
      jenis_ptk:            '', // String  — "Guru Kelas" | "Guru Mapel" | "Tendik" | "Kepsek"
      status_perbaikan_data: '', // String — Dari STATUS_PERBAIKAN_VERVAL
      catatan_kesalahan:    '', // String
      foto_ktp:             '', // String  — URL foto KTP
      sudah_sinkron:        false, // Boolean
    }
  ],

  total_ptk:                0, // Number
  total_sudah_sinkron:      0, // Number
  total_perlu_perbaikan:    0, // Number
  tgl_update:               '', // String
};

// ── 4. VERVAL KELEMBAGAAN / SATUAN PENDIDIKAN (SP) ───────────

export const skemaVervalSP = {
  id_verval_sp:         '',     // String
  id_sekolah:           '',     // String

  // — LEGALITAS PENDIRIAN —
  no_sk_pendirian:      '', // String  — Nomor SK Pendirian Sekolah
  tgl_sk_pendirian:     '', // String  — Tanggal SK terbit (YYYY-MM-DD)
  instansi_penerbit_sk: '', // String  — cth: "Dinas Pendidikan Kab. ..."

  // — IZIN OPERASIONAL —
  no_izin_operasional:  '', // String  — Nomor surat izin operasional terbaru
  tgl_izin:             '', // String  — Tanggal terbit izin
  tgl_berlaku_sampai:   '', // String  — Tanggal kadaluarsa izin (jika ada)
  status_izin:          '', // String  — "Aktif" | "Kadaluarsa" | "Dalam Perpanjangan"

  // — TANAH & BANGUNAN —
  luas_tanah_m2:        0,  // Number  — Total luas tanah (m2)
  status_kepemilikan:   '', // String  — Dari STATUS_KEPEMILIKAN_TANAH
  no_sertifikat_tanah:  '', // String  — Nomor sertifikat / bukti kepemilikan

  // — FOTO DOKUMENTASI BANGUNAN —
  foto_bangunan: [],        // Array<String>  — URL foto tampak depan, dalam, dll
  foto_papan_nama:    '',   // String  — URL foto papan nama sekolah
  foto_sk_pendirian:  '',   // String  — URL scan SK Pendirian
  foto_izin_operasional: '', // String — URL scan Surat Izin Operasional

  // — STATUS VERVAL —
  status_verval:        '', // String  — "Sudah Diverval" | "Belum Diverval" | "Proses"
  catatan_verval:       '', // String  — Catatan dari operator / dinas
  tgl_verval:           '', // String
  diubah_pada:          null, // Date
};
