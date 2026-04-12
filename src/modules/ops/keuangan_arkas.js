/**
 * =============================================================
 * CIMEGA SMART OFFICE — Modul Operator Sekolah (OPS)
 * FILE    : keuangan_arkas.js
 * MODUL   : Administrasi Keuangan / ARKAS (RKAS & BOS)
 * STANDAR : Arkas v4 / Juknis BOS Reguler / BOS Kinerja
 * =============================================================
 *
 * Mencakup:
 *  1. RKAS (Rencana Kegiatan dan Anggaran Sekolah)
 *  2. BKU (Buku Kas Umum)
 *  3. Dokumen SPJ (Surat Pertanggungjawaban)
 * =============================================================
 */

// ── KONSTANTA REFERENSI ──────────────────────────────────────

export const SUMBER_DANA = [
  'BOS Reguler', 'BOS Kinerja', 'BOS Afirmasi', 'BOS Transformasi',
  'APBD Kabupaten/Kota', 'APBD Provinsi', 'APBN (DAK Fisik)', 'Komite Sekolah',
  'Hibah / Donasi', 'Dana Lainnya',
];

export const JENIS_BELANJA = [
  '1. Penerimaan Peserta Didik Baru',
  '2. Pengembangan Perpustakaan',
  '3. Kegiatan Pembelajaran & Ekstrakurikuler',
  '4. Kegiatan Asesmen / Ujian',
  '5. Administrasi Sekolah',
  '6. Pengembangan Profesi Guru dan Tenaga Kependidikan',
  '7. Langganan Daya dan Jasa',
  '8. Pemeliharaan Sarpras',
  '9. Penyediaan Alat Multi Media Pembelajaran',
  '10. Penyelenggaraan Lomba/Festival',
  '11. Pembayaran Honor',
];

export const JENIS_TRANSAKSI = {
  MASUK:  { label: 'Penerimaan (Kas Masuk)',  kode: 'masuk',  warna: '#22c55e' },
  KELUAR: { label: 'Pengeluaran (Kas Keluar)', kode: 'keluar', warna: '#ef4444' },
};

export const STATUS_SPJ = [
  'Draft', 'Menunggu Verifikasi', 'Sudah Disetujui', 'Dikembalikan (Ada Koreksi)',
];

// ── 1. RKAS (RENCANA KEGIATAN DAN ANGGARAN SEKOLAH) ──────────

export const skemaRKAS = {
  id_rkas:              '',   // String
  id_sekolah:           '',   // String
  tahun_anggaran:       '',   // String  — cth: "2024"
  semester:             '',   // String  — "Ganjil" | "Genap" | "Tahunan"
  sumber_dana:          '',   // String  — Dari SUMBER_DANA
  total_pagu:           0,    // Number  — Total pagu anggaran yang diterima (Rp)

  daftar_kegiatan: [
    {
      id_kegiatan:          '', // String
      kode_rekening:        '', // String  — Kode akun sesuai Arkas (cth: "521211")
      jenis_belanja:        '', // String  — Dari JENIS_BELANJA
      nama_kegiatan:        '', // String  — Nama kegiatan umum
      nama_barang_jasa:     '', // String  — Nama item belanja spesifik

      // — RINCIAN ANGGARAN —
      spesifikasi:          '', // String  — Detail spesifikasi barang/jasa
      satuan:               '', // String  — "Unit" | "Paket" | "Orang" | "Bulan" | dst
      volume:               0,  // Number  — Jumlah unit / volume
      harga_satuan:         0,  // Number  — Harga per satuan (Rp)
      total_anggaran:       0,  // Number  — volume × harga_satuan (otomatis)

      // — REALISASI —
      realisasi_volume:     0,  // Number  — Volume yang sudah direalisasi
      realisasi_nominal:    0,  // Number  — Nominal yang sudah dibelanjakan (Rp)
      sisa_anggaran:        0,  // Number  — total_anggaran - realisasi_nominal
      persen_realisasi:     0,  // Number  — % realisasi dari pagu

      // — INFO PENGADAAN —
      rencana_bulan:        '', // String  — Bulan rencana pelaksanaan
      triwulan:             '', // String  — "TW1" | "TW2" | "TW3" | "TW4"
      tipe_pengadaan:       '', // String  — "Langsung" | "E-Purchasing" | "Tender"
      catatan:              '', // String
    }
  ],

  // — REKAP ANGGARAN —
  rekap: {
    total_rencana:          0, // Number  — Total anggaran direncanakan
    total_realisasi:        0, // Number  — Total yang sudah terealisasi
    total_sisa:             0, // Number  — Sisa anggaran
    persen_realisasi_total: 0, // Number  — % realisasi keseluruhan
  },

  status_rkas:          '', // String  — "Draft" | "Diajukan" | "Disetujui" | "Final"
  disetujui_kepsek:     false, // Boolean
  tgl_persetujuan:      '',    // String
  dibuat_pada:          null,  // Date
  diubah_pada:          null,  // Date
};

// ── 2. BKU (BUKU KAS UMUM) ───────────────────────────────────

export const skemaBKU = {
  id_bku:               '',   // String
  id_sekolah:           '',   // String
  tahun_anggaran:       '',   // String
  semester:             '',   // String
  sumber_dana:          '',   // String  — Sumber dana rekening ini
  no_rekening_sekolah:  '',   // String  — Rekening resmi BOS / bendahara
  nama_bank:            '',   // String  — cth: "BRI", "BNI", "BSI"
  saldo_awal:           0,    // Number  — Saldo awal periode (Rp)

  daftar_transaksi: [
    {
      id_transaksi:         '', // String
      no_urut:              0,  // Number  — Nomor urut transaksi di buku kas
      tgl_transaksi:        '', // String   — "YYYY-MM-DD"
      jenis_transaksi:      '', // String   — "masuk" | "keluar"
      kode_rekening:        '', // String   — Kode akun RKAS yang terkait
      uraian:               '', // String   — Deskripsi transaksi
      id_kegiatan_rkas:     '', // String   — Referensi ke item RKAS

      // — NOMINAL —
      nominal_masuk:        0,  // Number   — Jumlah penerimaan (Rp), 0 jika pengeluaran
      nominal_keluar:       0,  // Number   — Jumlah pengeluaran (Rp), 0 jika penerimaan
      sisa_saldo:           0,  // Number   — Saldo setelah transaksi (dihitung otomatis)

      // — BUKTI TRANSAKSI —
      no_bukti:             '', // String   — Nomor bukti / nota / kwitansi
      foto_nota:            [], // Array<String>  — URL scan nota/kwitansi/bukti bayar
      no_sp2d:              '', // String   — Nomor SP2D (untuk dana APBD)

      // — PAJAK —
      ada_pajak:            false, // Boolean — Ada kewajiban pajak?
      jenis_pajak:          '',    // String  — "PPN" | "PPh 21" | "PPh 22" | "PPh 23"
      nominal_pajak:        0,     // Number  — Nilai pajak yang dipotong (Rp)
      bukti_setor_pajak:    '',    // String  — URL bukti setor pajak

      dicatat_oleh:         '', // String   — ID/nama bendahara yang input
    }
  ],

  // — REKAP —
  rekap: {
    total_masuk:      0, // Number
    total_keluar:     0, // Number
    saldo_akhir:      0, // Number
  },

  status_cek:         '', // String  — "Belum Dicek" | "Sudah Diverifikasi" | "Ada Selisih"
  diverifikasi_oleh:  '', // String  — Nama pengawas / pemeriksa
  tgl_verifikasi:     '', // String
  dibuat_pada:        null, // Date
  diubah_pada:        null, // Date
};

// ── 3. DOKUMEN SPJ (SURAT PERTANGGUNGJAWABAN) ────────────────

export const skemaSPJ = {
  id_spj:               '',   // String
  id_sekolah:           '',   // String
  no_spj:               '',   // String  — Nomor SPJ resmi
  tahun_anggaran:       '',   // String
  bulan:                '',   // String  — Bulan pelaporan cth: "Januari"
  triwulan:             '',   // String  — "TW1" | "TW2" | "TW3" | "TW4"
  sumber_dana:          '',   // String
  total_realisasi:      0,    // Number  — Total SPJ periode ini (Rp)

  // — DOKUMEN KEUANGAN —
  dokumen_spj: [
    {
      no_bukti:             '', // String   — Nomor urut / kode dokumen
      tgl_bukti:            '', // String   — Tanggal nota / kwitansi
      uraian_belanja:       '', // String   — Keterangan belanja
      kode_rekening:        '', // String
      nominal:              0,  // Number   — Nilai transaksi (Rp)
      foto_nota:            [], // Array<String>  — URL scan nota / kwitansi
      jenis_dokumen:        '', // String   — "Nota", "Kwitansi", "Faktur", "BAST", dst
      sudah_diverifikasi:   false, // Boolean
    }
  ],

  // — HONOR & UPAH —
  daftar_penerima_honor: [
    {
      id_guru_tendik:       '', // String   — Referensi ke data PTK
      nama:                 '', // String
      jenis_honor:          '', // String   — cth: "Honor Wali Kelas", "Honor Penjaga"
      nominal_honor:        0,  // Number   — Nominal honor (Rp)
      tgl_terima:           '', // String
      sudah_tandatangan:    false, // Boolean
      foto_tanda_terima:    '', // String   — URL scan tanda terima honor
    }
  ],

  // — PAJAK —
  daftar_bukti_pajak: [
    {
      jenis_pajak:          '', // String   — "PPN" | "PPh 21" | "PPh 22" | "PPh 23"
      kode_billing:         '', // String   — Kode billing setoran pajak
      nominal_pajak:        0,  // Number   — Nilai pajak (Rp)
      tgl_setor:            '', // String
      bukti_setor_pajak:    '', // String   — URL bukti setoran pajak (e-Billing)
    }
  ],

  // — STATUS SPJ —
  status_spj:           '', // String  — Dari STATUS_SPJ
  catatan_verifikator:  '', // String  — Catatan dari pemeriksa / dinas
  disetujui_kepsek:     false, // Boolean
  tgl_persetujuan:      '',    // String
  file_spj_pdf:         '',    // String  — URL file SPJ yang sudah dijadikan PDF

  dibuat_oleh:    '', // String  — Nama bendahara
  dibuat_pada:    null, // Date
  diubah_pada:    null, // Date
};
