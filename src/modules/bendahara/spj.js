/**
 * =============================================================
 * CIMEGA SMART OFFICE — Modul Bendahara Sekolah
 * FILE    : spj.js
 * MODUL   : Dokumen SPJ (Surat Pertanggungjawaban)
 * STANDAR : Penatausahaan Dokumen Fisik & Digital
 * =============================================================
 */

// ── 1. KWITANSI / NOTA PEMBELIAN ─────────────────────────────

export const skemaKwitansi = {
  id_kwitansi:      '',     // String
  id_sekolah:       '',     // String
  no_seri:          '',     // String  — Nomor urut internal kwitansi
  tgl_beli:         '',     // String  — "YYYY-MM-DD"
  
  // -- Data Toko --
  nama_toko:        '',     // String
  alamat_toko:      '',     // String
  npwp_toko:        '',     // String  — Digunakan untuk pelaporan pajak barang
  
  // -- Rincian Barang --
  daftar_barang: [
    {
      nama_barang:  '',     // String
      jumlah:       0,      // Number
      satuan:       '',     // String  — "Rim", "Ppcs", "Kotak"
      harga_satuan: 0,      // Number
      sub_total:    0,      // Number  — jumlah * harga_satuan
    }
  ],

  total_bayar:      0,      // Number  — Total keseluruhan belanja
  status_acc_kepsek:false,  // Boolean — Persetujuan Kepala Sekolah (TTE)
  
  // -- Digital Docs --
  file_nota:        '',     // String  — URL/Path scan nota fisik
  kategori_dana:    '',     // String  — "BOSP" | "Komite"
  dibuat_pada:      null,   // Date
};

// ── 2. DAFTAR HONOR / TRANSPORT ──────────────────────────────

export const skemaHonorTransport = {
  id_honor:          '',    // String
  id_sekolah:        '',    // String
  bulan_kegiatan:    '',    // String  — cth: "Maret 2024"
  nama_kegiatan:     '',    // String  — cth: "Panitia Proyek P5 Bangunlah Jiwa Raganya"
  no_sk:             '',    // String  — Dasar hukum (SK Panitia)
  
  daftar_penerima: [
    {
      id_ptk:        '',    // String  — Relasi ke Guru/Staf
      nama:          '',    // String
      jabatan_tugas: '',    // String  — "Ketua", "Sekretaris", "Anggota"
      honor_kotor:   0,     // Number  — Nominal sebelum pajak
      potongan_pajak:0,     // Number  — Nominal PPh 21
      honor_bersih:  0,     // Number  — Nominal yang diterima (honor_kotor - pajak)
      status_ttd:    false, // Boolean — Bukti tanda tangan penerima
    }
  ],
  
  total_honor_payout: 0,    // Number
  total_pajak_payout: 0,    // Number
  file_daftar_hadir:  '',    // String  — URL scan daftar hadir kegiatan
};

// ── 3. BAST (BERITA ACARA SERAH TERIMA) ──────────────────────

export const skemaBAST = {
  id_bast:          '',     // String
  id_sekolah:       '',     // String
  no_bast:          '',     // String
  tgl_serah_terima: '',     // String
  
  // -- Pihak Terlibat --
  pihak_pertama:    '',     // String  — Penyedia/Toko
  pihak_kedua:      '',     // String  — Pihak Sekolah (biasanya Sarpras)
  
  daftar_barang_diterima: [
    {
      nama_barang:  '',     // String
      merk_tipe:    '',     // String
      jumlah:       0,      // Number
      kondisi:      '',     // String  — "Baik" | "Rusak"
    }
  ],

  lokasi_penyimpanan: '',    // String  — Ruangan atau gudang
  file_bast:          '',    // String  — URL scan BAST bertanda tangan
  catatan:            '',    // String
};
