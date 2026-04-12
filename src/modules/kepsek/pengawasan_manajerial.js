/**
 * =============================================================
 * CIMEGA SMART OFFICE — Modul Kepala Sekolah (Kepsek)
 * FILE    : pengawasan_manajerial.js
 * MODUL   : Pengawasan Manajerial & Kontrol Administrasi
 * STANDAR : Pengelolaan Satuan Pendidikan (PMP)
 * =============================================================
 */

// ── 1. PEMERIKSAAN KAS BENDAHARA ────────────────────────────
// Tupoksi Kepsek sebagai pimpinan unit kerja untuk kontrol BOSP

export const skemaPeriksaKas = {
  id_periksa_kas:   0,      // Number / String
  id_sekolah:       '',     // String
  tgl_periksa:      '',     // String  — "YYYY-MM-DD"
  
  // -- DATA SALDO --
  saldo_fisik_tunai: 0,     // Number  — Uang nyata di brankas
  saldo_bank:        0,     // Number  — Saldo di buku tabungan/rekening
  saldo_arkas:       0,     // Number  — Saldo yang tercatat di aplikasi ARKAS/BKU
  
  jumlah_selisih:    0,     // Number  — (fisik + bank) - arkas
  keterangan_selisih:'',    // String  — Alasan jika ada perbedaan saldo
  
  ttd_kepsek:        false, // Boolean — Konfirmasi persetujuan fisik
  catatan_pembinaan: '',     // String  — Pesan untuk bendahara
};

// ── 2. PEMERIKSAAN ADMINISTRASI GURU ────────────────────────
// Kontrol rutin kelengkapan dokumen ajar guru

export const skemaPeriksaAdmGuru = {
  id_periksa_adm:   '',     // String
  id_sekolah:       '',     // String
  tgl_periksa:      '',     // String
  id_guru:          '',     // String
  nama_guru:        '',     // String
  
  // -- CEKLIST DOKUMEN --
  daftar_dokumen: [
    {
      nama_dokumen:  '',    // String  — cth: "Modul Ajar", "Jurnal Harian", "Daftar Nilai"
      status_lengkap:false, // Boolean
      catatan_khusus:'',    // String
    }
  ],
  
  catatan_kepsek:    '',    // String  — Evaluasi umum untuk guru tersebut
  status_akhir:      '',    // String  — "Lengkap" | "Perlu Perbaikan" | "Belum Mencukupi"
};

// ── 3. REGISTER PENGESAHAN DOKUMEN ──────────────────────────
// Logbook dokumen yang ditandatangani Kepala Sekolah

export const skemaRegisterTTD = {
  id_ttd:           '',     // String
  id_sekolah:       '',     // String
  tgl_ttd:          '',     // String
  
  jenis_dokumen:    '',     // String  — "Ijazah" | "Rapor" | "SPJ" | "Surat Tugas"
  pihak_pengaju:    '',     // String  — Nama staf/staf yang membawa dokumen
  jumlah_lembar:     0,     // Number
  no_seri_awal:     '',     // String  — cth: "D-0001" (untuk ijazah)
  no_seri_akhir:    '',     // String
  
  keterangan:       '',     // String
  sudah_diambil:    true,   // Boolean — Apakah dokumen sudah diambil pengaju?
};
