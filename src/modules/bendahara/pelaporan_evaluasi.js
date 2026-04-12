/**
 * =============================================================
 * CIMEGA SMART OFFICE — Modul Bendahara Sekolah
 * FILE    : pelaporan_evaluasi.js
 * MODUL   : Pelaporan & Evaluasi Keuangan
 * STANDAR : Pelaporan Realisasi BOSP (Simpul Pesparawi/ARKAS)
 * =============================================================
 */

// ── 1. LAPORAN REALISASI ANGGARAN (LRA) ──────────────────────

export const skemaLRA = {
  id_lra:           '',     // String
  id_sekolah:       '',     // String
  periode:          '',     // String  — "Triwulan 1" | "Triwulan 2" | dst
  tahun:            '',     // String  — cth: "2024"
  sumber_dana:      '',     // String
  
  rekap_anggaran: [
    {
      nama_program:           '', // String  — cth: "Pengembangan Perpustakaan"
      anggaran_direncanakan:  0,  // Number  — Sesuai RKAS
      anggaran_terpakai:      0,  // Number  — Realisasi belanja
      sisa_anggaran:          0,  // Number  — anggaran_direncanakan - anggaran_terpakai
      persen_serap:           0,  // Number  — (anggaran_terpakai / anggaran_direncanakan) * 100
    }
  ],

  total_anggaran_rkas:  0,  // Number
  total_realisasi_bku:  0,  // Number
  total_sisa_dana:      0,  // Number
  tgl_cetak:            '', // String
};

// ── 2. OPNAME KAS (PEMERIKSAAN FISIK) ────────────────────────
// Pencocokan saldo buku dengan saldo fisik uang nyata

export const skemaOpnameKas = {
  id_opname_kas:    '',     // String
  id_sekolah:       '',     // String
  tgl_periksa:      '',     // String
  nama_pemeriksa:   '',     // String  — Biasanya Kepala Sekolah atau Pengawas
  
  // -- Rincian Uang Fisik --
  rincian_uang_fisik: [
    {
      pecahan_uang: 100000, // Number  — Nominal pecahan (cth: 100000, 50000)
      lembar:       0,      // Number  — Jumlah lembar/keping yang ada
      total:        0,      // Number  — nominal * lembar
    }
  ],
  
  total_uang_tunai: 0,      // Number  — Jumlah seluruh rincian uang fisik
  total_uang_bank:  0,      // Number  — Saldo terakhir di rekening koran bank
  
  saldo_buku:       0,      // Number  — Saldo terakhir yang tercatat di BKU
  selisih:          0,      // Number  — saldo_buku - (total_tunai + total_bank)
  alasan_selisih:   '',     // String  — Penjelasan jika ada selisih kas
  catatan_pemeriksa:'',     // String
};

// ── 3. PENUTUPAN KAS ─────────────────────────────────────────

export const skemaPenutupanKas = {
  id_tutup_kas:     '',     // String
  id_sekolah:       '',     // String
  bulan_tutup:      '',     // String  — cth: "Maret"
  tahun_tutup:      '',     // String  — cth: "2024"
  tgl_tutup:        '',     // String
  
  // -- Saldo Akhir Periode --
  saldo_akhir_bank:  0,      // Number
  saldo_akhir_tunai: 0,      // Number
  saldo_akhir_pajak: 0,      // Number  — Pajak yang belum disetor saat tutup buku
  
  total_saldo_tutup: 0,      // Number
  ttd_sah:           false,  // Boolean — Validasi sah penutupan kas (Bendahara & Kepsek)
  lock_transaksi:    true,   // Boolean — Jika true, transaksi bulan ini tidak bisa diedit
};
