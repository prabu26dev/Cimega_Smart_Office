/**
 * =============================================================
 * CIMEGA SMART OFFICE — Modul Bendahara Sekolah
 * FILE    : buku_kas.js
 * MODUL   : Pembukuan Kas (BKU, Kas Tunai, & Kas Bank)
 * STANDAR : Juknis Penatausahaan Keuangan BOSP
 * =============================================================
 */

// ── 1. BUKU KAS UMUM (BKU) ───────────────────────────────────
// Merupakan induk dari seluruh transaksi keuangan sekolah

export const skemaBKU = {
  id_bku_transaksi: '',     // String  — ID unik transaksi BKU
  id_sekolah:       '',     // String
  tahun:            '',     // String  — cth: "2024"
  bulan:            '',     // String  — cth: "Januari"

  tgl_transaksi:    '',     // String  — "YYYY-MM-DD"
  no_bukti:         '',     // String  — Nomor bukti transaksi (Nota/Kwitansi)
  uraian_transaksi: '',     // String  — Keterangan transaksi
  kode_rekening:    '',     // String  — Kode akun anggaran
  
  // -- Alur Kas --
  uang_masuk:       0,      // Number  — Debit (Pemasukan)
  uang_keluar:      0,      // Number  — Kredit (Pengeluaran)
  sisa_saldo:       0,      // Number  — Saldo berjalan (running balance)
  
  metode_pembayaran:'',     // String  — "Tunai" | "Bank (Transfer)"
  status_verifikasi:false,  // Boolean — Validasi oleh Kepala Sekolah
  id_rkas_item:     '',     // String  — Relasi ke id_rkas kegiatan
};

// ── 2. BUKU KAS TUNAI ────────────────────────────────────────
// Pencatatan uang tunai yang dipegang bendahara (Kas di Tangan)

export const skemaKasTunai = {
  id_kas_tunai:     '',     // String
  id_sekolah:       '',     // String
  tgl_transaksi:    '',     // String
  no_bukti:         '',     // String
  uraian:           '',     // String
  
  masuk_tunai:      0,      // Number
  keluar_tunai:     0,      // Number
  saldo_tunai:      0,      // Number
  
  id_bku_ref:       '',     // String  — Referensi ke BKU
};

// ── 3. BUKU KAS BANK ─────────────────────────────────────────
// Pencatatan transaksi buku tabungan/rekening sekolah

export const skemaKasBank = {
  id_kas_bank:      '',     // String
  id_sekolah:       '',     // String
  tgl_transaksi:    '',     // String
  no_referensi_bank: '',     // String  — Nomor referensi transfer/cetak buku
  uraian:           '',     // String
  
  masuk_bank:       0,      // Number
  keluar_bank:      0,      // Number
  saldo_bank:       0,      // Number
  
  biaya_admin:      0,      // Number  — Biaya administrasi bank (jika ada)
  bunga_bank:       0,      // Number  — Bunga bank (jika ada)
  id_bku_ref:       '',     // String  — Referensi ke BKU
};
