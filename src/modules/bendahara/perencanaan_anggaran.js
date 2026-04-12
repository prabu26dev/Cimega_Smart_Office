/**
 * =============================================================
 * CIMEGA SMART OFFICE — Modul Bendahara Sekolah
 * FILE    : perencanaan_anggaran.js
 * MODUL   : Perencanaan Anggaran (RKAS & RAPBS)
 * STANDAR : Juknis BOSP / ARKAS v4
 * =============================================================
 */

// ── KONSTANTA SUMBER DANA ────────────────────────────────────

export const SUMBER_DANA = [
  'BOSP Reguler',
  'BOSP Kinerja',
  'BOSP Afirmasi',
  'BOS Daerah (BOSDA)',
  'Dana Komite / Sumbangan',
  'Dana Hibah',
  'SiLPA Tahun Lalu',
];

// ── 1. RKAS (RENCANA KEGIATAN & ANGGARAN SEKOLAH) ────────────

export const skemaRKAS = {
  id_rkas:          '',     // String  — ID unik RKAS
  id_sekolah:       '',     // String
  tahun_anggaran:   '',     // String  — cth: "2024"
  semester:         '',     // String  — "Ganjil" | "Genap"
  sumber_dana:      '',     // String  — Dari SUMBER_DANA

  daftar_kegiatan: [
    {
      kode_program:   '',   // String  — cth: "03.02.01" (Standar Sarpras)
      nama_kegiatan:  '',   // String  — Nama kegiatan (cth: "Pemeliharaan Ruang Kelas")
      uraian_belanja: '',   // String  — Deskripsi barang/jasa (cth: "Cat Tembok 5kg")
      volume:         0,    // Number  — Jumlah barang/jasa
      satuan:         '',   // String  — cth: "Pail", "Rim", "Paket"
      harga_satuan:   0,    // Number  — Harga per unit (Rp)
      total_anggaran: 0,    // Number  — volume * harga_satuan
      prioritas:      '',   // String  — "Sangat Penting" | "Penting" | "Tambahan"
      terkait_p5:     false,// Boolean — Apakah alokasi untuk Proyek P5?
    }
  ],

  total_pagu:       0,      // Number  — Total pagu yang diterima
  total_perencanaan:0,      // Number  — Total belanja yang direncanakan
  sisa_pagu:        0,      // Number  — Selisih pagu - perencanaan
  status_pengajuan: '',     // String  — "Draft" | "Diajukan" | "Disetujui"
  tgl_pengesahan:   '',     // String  — "YYYY-MM-DD"
};

// ── 2. RAPBS (RENCANA ANGGARAN PENDAPATAN & BELANJA SEKOLAH) ─

export const skemaRAPBS = {
  id_rapbs:         '',     // String
  id_sekolah:       '',     // String
  tahun_ajaran:     '',     // String  — cth: "2024/2025"
  
  // -- PEMASUKAN --
  estimasi_pemasukan: [
    {
      sumber:       '',     // String  — cth: "Pusat", "Daerah", "Lainnya"
      nominal:      0,      // Number
      keterangan:   '',     // String
    }
  ],

  // -- PENGELUARAN --
  estimasi_pengeluaran: [
    {
      standar:      '',     // String  — cth: "Isi", "Proses", "Sarpras", dst
      nominal:      0,      // Number
      keterangan:   '',     // String
    }
  ],

  saldo_awal_tahun: 0,      // Number  — Sisa saldo dari tahun ajaran sebelumnya
  total_estimasi_masuk: 0,  // Number
  total_estimasi_keluar:0,  // Number
  surplus_defisit:  0,      // Number  — Selisih total masuk - total keluar
  
  dibuat_pada:      null,   // Date
  operator_input:   '',     // String
};
