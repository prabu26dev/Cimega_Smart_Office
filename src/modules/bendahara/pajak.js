/**
 * =============================================================
 * CIMEGA SMART OFFICE — Modul Bendahara Sekolah
 * FILE    : pajak.js
 * MODUL   : Administrasi Pajak Sekolah
 * STANDAR : Ketentuan Perpajakan Belanja Hibah/BOS
 * =============================================================
 */

// ── KONSTANTA JENIS PAJAK ────────────────────────────────────

export const JENIS_PAJAK = [
  'PPN (Pajak Pertambahan Nilai)',
  'PPh Pasal 21 (Gaji/Honor)',
  'PPh Pasal 22 (Barang)',
  'PPh Pasal 23 (Jasa)',
  'PPh Pasal 4 Ayat 2 (Sewa/Konstruksi)',
];

// ── 1. BUKU PEMBANTU PAJAK ───────────────────────────────────
// Mencatat rincian pemotongan dan penyetoran pajak sekolah

export const skemaBukuPajak = {
  id_buku_pajak:     '',     // String
  id_sekolah:        '',     // String
  tgl_transaksi:     '',     // String  — Tanggal saat pajak dipotong/dipungut
  uraian_belanja:    '',     // String  — Keterangan barang/jasa yang dikenakan pajak
  no_bukti_belanja:  '',     // String  — Referensi ke Kwitansi/BKU
  
  jenis_pajak:       '',     // String  — Dari JENIS_PAJAK
  nominal_potongan:  0,      // Number  — Saldo bertambah (saat memungut)
  nominal_setoran:   0,      // Number  — Saldo berkurang (saat setor ke bank/Pos)
  sisa_pajak:        0,      // Number  — Saldo pajak yang belum disetor
  
  tgl_setor_negara:  '',     // String  — Tanggal penyetoran ke kas negara
  status_lapor:      false,  // Boolean — Status pelaporan pajak (DJP Online)
};

// ── 2. ARSIP SSP / BILLING PAJAK ─────────────────────────────
// Penyimpanan kode billing dan bukti bayar elektronik

export const skemaArsipPajak = {
  id_arsip_pajak:    '',     // String
  id_sekolah:        '',     // String
  no_billing:        '',     // String  — Nomor ID Billing (15 digit)
  ntpn:              '',     // String  — Nomor Transaksi Penerimaan Negara
  masa_pajak_bulan:  '',     // String  — "Januari" | "Februari" | dst
  tahun_pajak:       '',     // String  — cth: "2024"
  
  nama_penyetor:     '',     // String  — Bendahara atau instansi terkait
  nominal_pajak:     0,      // Number
  
  // -- Digital Docs --
  file_bukti_bayar:  '',     // String  — URL/Path foto atau PDF (BPE/SSP)
  keterangan:        '',     // String
  
  dibuat_pada:       null,   // Date (Timestamp)
};
