/**
 * =============================================================
 * CIMEGA SMART OFFICE — Modul Bendahara Sekolah
 * FILE    : pendukung_bendahara.js
 * MODUL   : Administrasi Pendukung Bendahara
 * STANDAR : Manajemen Aset & Dana Bergulir
 * =============================================================
 */

// ── 1. INVENTARIS BELANJA MODAL ──────────────────────────────
// Sinkronisasi antara belanja bendahara dengan inventaris barang

export const skemaInventarisModal = {
  id_aset:          '',     // String
  id_sekolah:       '',     // String
  tgl_beli:         '',     // String  — "YYYY-MM-DD"
  no_bukti_bku:     '',     // String  — Referensi ke BKU
  
  nama_barang_aset: '',     // String  — cth: "Laptop ASUS Vivobook"
  kode_aset:        '',     // String  — Kode barang dari Sarpras (jika ada)
  harga_beli:       0,      // Number  — Harga perolehan
  sumber_dana:      '',     // String  — Dari mana barang dibeli
  
  letak_ruangan:    '',     // String  — cth: "Ruang Guru", "Laboratorium"
  penanggung_jawab: '',     // String  — Nama orang yang memegang aset
  kondisi_barang:   '',     // String  — "Baru" | "Bekas"
  
  file_foto_barang: '',     // String  — URL/Path foto barang fisik
};

// ── 2. PEMINJAMAN KAS KECIL (DANA PANJAR) ────────────────────
// Untuk pengeluaran darurat atau kegiatan panitia sebelum SPJ cair

export const skemaKasKecil = {
  id_pinjam_kas:    '',     // String
  id_sekolah:       '',     // String
  tgl_pinjam:       '',     // String
  nama_peminjam:    '',     // String  — Nama guru/staf yang meminjam dana
  id_peminjam:      '',     // String  — ID referensi PTK
  
  tujuan_kegiatan:  '',     // String  — cth: "Panitia P5 Tema Kewirausahaan"
  nominal_pinjam:   0,      // Number
  
  tgl_kembali_nota: '',     // String  — Tanggal target penyerahan nota SPJ
  status_lunas:     false,  // Boolean — True jika nota & sisa uang sudah kembali
  
  catatan_bendahara: '',    // String
  dibuat_pada:      null,   // Date
};
