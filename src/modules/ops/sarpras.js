/**
 * =============================================================
 * CIMEGA SMART OFFICE — Modul Operator Sekolah (OPS)
 * FILE    : sarpras.js
 * MODUL   : Manajemen Sarana dan Prasarana
 * STANDAR : Dapodik Sarpras / Simrusak / Emis
 * =============================================================
 *
 * Mencakup:
 *  1. Data Tanah dan Bangunan
 *  2. Inventaris Barang (BMN/BMD)
 *  3. Pemetaan Kerusakan Ruangan
 * =============================================================
 */

// ── KONSTANTA REFERENSI ──────────────────────────────────────

export const JENIS_RUANGAN = [
  'Ruang Kelas', 'Ruang Kepala Sekolah', 'Ruang Guru', 'Ruang TU',
  'Perpustakaan', 'Laboratorium IPA', 'Laboratorium Komputer',
  'Ruang UKS', 'Ruang BK', 'Mushola / Masjid', 'Aula / Gedung Serba Guna',
  'Kantin', 'WC Siswa', 'WC Guru', 'Gudang', 'Pos Satpam', 'Lapangan',
];

export const KONDISI_RUANGAN = [
  'Baik',
  'Rusak Ringan (1–30%)',
  'Rusak Sedang (31–60%)',
  'Rusak Berat (61–100%)',
];

export const KATEGORI_BARANG = [
  'Mebel (Kursi, Meja, Lemari)',
  'Elektronik & IT (Komputer, Proyektor, Printer)',
  'Alat Olahraga',
  'Alat Musik & Kesenian',
  'Alat Praktik / Lab IPA',
  'Buku & Media Pembelajaran',
  'Peralatan Kebersihan',
  'Peralatan Dapur / Kantin',
  'Kendaraan Dinas',
  'Infrastruktur (AC, Kipas, Genset)',
  'Perlengkapan K3 (APAR, P3K)',
  'Lain-lain',
];

export const KONDISI_BARANG = {
  BAIK:           { label: 'Baik',         kode: 'baik',          warna: '#22c55e' },
  RUSAK_RINGAN:   { label: 'Rusak Ringan', kode: 'rusak_ringan',  warna: '#f59e0b' },
  RUSAK_BERAT:    { label: 'Rusak Berat',  kode: 'rusak_berat',   warna: '#ef4444' },
  HILANG:         { label: 'Hilang',       kode: 'hilang',        warna: '#6b7280' },
  DIHAPUS:        { label: 'Dihapus / Dimusnahkan', kode: 'dihapus', warna: '#374151' },
};

export const SUMBER_BARANG = [
  'APBN (BOS Nasional)',
  'APBD (Dana Pemda)',
  'BOS Reguler',
  'BOS Kinerja',
  'Sumbangan Komite / Orang Tua',
  'Hibah / Donasi',
  'Pembelian Sekolah Sendiri',
];

// ── 1. DATA TANAH DAN BANGUNAN ───────────────────────────────

export const skemaTanahBangunan = {
  id_sarpras:           '',   // String
  id_sekolah:           '',   // String
  tahun_data:           '',   // String  — cth: "2024"

  // — DATA TANAH —
  tanah: {
    luas_total_m2:        0,  // Number  — Total luas seluruh tanah (m2)
    status_kepemilikan:   '', // String  — "Milik Sendiri" | "Sewa" | "Pinjam Pakai" | "Wakaf"
    no_sertifikat:        '', // String  — Nomor sertifikat / bukti kepemilikan
    foto_sertifikat:      '', // String  — URL scan sertifikat tanah
    catatan:              '', // String
  },

  // — DATA BANGUNAN UTAMA —
  luas_bangunan_total_m2: 0,  // Number  — Total luas seluruh bangunan (m2)
  jumlah_lantai:          0,  // Number  — Lantai bangunan tertinggi
  tahun_dibangun:         '', // String
  kondisi_bangunan_utama: '', // String  — Dari KONDISI_RUANGAN

  // — DAFTAR RUANGAN —
  daftar_ruangan: [
    {
      id_ruangan:         '', // String   — ID unik ruangan
      nama_ruang:         '', // String   — cth: "Ruang Kelas 4A"
      jenis_ruangan:      '', // String   — Dari JENIS_RUANGAN
      peruntukan:         '', // String   — Deskripsi fungsi spesifik
      lantai:             0,  // Number   — Di lantai berapa
      luas_m2:            0,  // Number   — Luas ruangan (m2)
      panjang_m:          0,  // Number
      lebar_m:            0,  // Number
      kondisi:            '', // String   — Dari KONDISI_RUANGAN
      persen_kerusakan:   0,  // Number   — Persentase kerusakan (0–100)
      fasilitas_dalam: [],    // Array<String>  — cth: ["Papan Tulis", "AC", "LCD"]
      foto_ruangan:       [], // Array<String>  — URL foto ruangan
      catatan:            '', // String
    }
  ],

  // — FASILITAS PENDUKUNG —
  fasilitas_sanitasi: {
    wc_siswa_laki:          0, // Number  — Jumlah unit WC siswa pria
    wc_siswa_perempuan:     0, // Number  — Jumlah unit WC siswa wanita
    wc_guru_laki:           0, // Number
    wc_guru_perempuan:      0, // Number
    kondisi_sanitasi:       '', // String  — "Baik" | "Rusak Ringan" | dst
    air_tersedia:           false, // Boolean
  },

  fasilitas_olahraga: {
    lapangan_upacara:   false, // Boolean
    lapangan_olahraga:  false, // Boolean
    jenis_lapangan:     '',    // String  — cth: "Basket, Voli, Badminton"
    kondisi_lapangan:   '',    // String
  },

  tgl_pendataan:      '', // String  — Tanggal data diperbarui
  diubah_pada:        null, // Date
};

// ── 2. INVENTARIS BARANG (BMN/BMD) ───────────────────────────

export const skemaInventarisBarang = {
  id_inventaris:        '',   // String
  id_sekolah:           '',   // String
  tahun_data:           '',   // String

  daftar_barang: [
    {
      id_barang:          '', // String   — ID unik barang (kode inventaris)
      kode_barang:        '', // String   — Kode inventaris / kode akun BMN
      nama_barang:        '', // String   — Nama lengkap barang
      merk_tipe:          '', // String   — Merk dan tipe/seri
      kategori:           '', // String   — Dari KATEGORI_BARANG
      spesifikasi:        '', // String   — Spesifikasi teknis (opsional)

      // — PENGADAAN —
      sumber_barang:      '', // String   — Dari SUMBER_BARANG
      tahun_pengadaan:    '', // String   — Tahun barang diperoleh
      harga_perolehan:    0,  // Number   — Harga saat dibeli/diterima (Rp)
      no_dokumen_perolehan: '', // String — Nomor BAST / faktur / SP2D

      // — JUMLAH & LOKASI —
      jumlah_total:       0,  // Number   — Total unit
      jumlah_baik:        0,  // Number
      jumlah_rusak_ringan: 0, // Number
      jumlah_rusak_berat:  0, // Number
      jumlah_hilang:      0,  // Number
      satuan:             '', // String   — "Unit" | "Buah" | "Set" | "Rim" | dst
      lokasi_ruang:       '', // String   — Ruangan tempat barang berada
      no_urut_ruang:      '', // String   — Nomor urut inventaris di ruangan

      // — KONDISI & TINDAK LANJUT —
      kondisi:            '', // String   — Dari KONDISI_BARANG
      perlu_perbaikan:    false, // Boolean
      perlu_penghapusan:  false, // Boolean — Barang perlu dihapus dari daftar
      catatan:            '', // String

      // — FOTO —
      foto_barang:        [], // Array<String>  — URL foto barang
    }
  ],

  // — REKAP OTOMATIS —
  rekap: {
    total_jenis_barang:   0, // Number
    total_unit:           0, // Number
    total_unit_baik:      0, // Number
    total_unit_rusak:     0, // Number
    total_nilai_aset:     0, // Number  — Total nilai perolehan seluruh aset (Rp)
  },

  tgl_pendataan:      '', // String
  diubah_pada:        null, // Date
};

// ── 3. PEMETAAN KERUSAKAN RUANGAN ────────────────────────────

export const skemaPemetaanKerusakan = {
  id_kerusakan:         '',   // String
  id_sekolah:           '',   // String
  tahun_data:           '',   // String
  semester:             '',   // String

  daftar_kerusakan: [
    {
      id_kerusakan_item:    '', // String
      nama_ruang:           '', // String  — Nama ruangan yang rusak
      jenis_kerusakan:      '', // String  — "Atap" | "Dinding" | "Lantai" | "Pintu/Jendela" | "Plafon" | "Instalasi Listrik" | "Sanitasi"
      deskripsi_kerusakan:  '', // String  — Penjelasan detail kerusakan
      persen_rusak:         0,  // Number  — Persentase kerusakan (0–100)
      tingkat_kerusakan:    '', // String  — Dihitung otomatis dari persen_rusak

      // — DOKUMENTASI —
      foto_bukti:           [], // Array<String>  — URL foto kerusakan (min 2 foto)
      sketsa_denah:         '', // String  — URL sketsa denah lokasi kerusakan

      // — ESTIMASI PERBAIKAN —
      estimasi_biaya:       0,  // Number  — Estimasi biaya perbaikan (Rp)
      sumber_dana_rencana:  '', // String  — "BOS" | "APBD" | "Dana Komite" | "Lainnya"
      rencana_perbaikan:    '', // String  — Deskripsi rencana tindak lanjut
      target_selesai:       '', // String  — Target tanggal selesai (YYYY-MM-DD)
      prioritas:            '', // String  — "Mendesak" | "Segera" | "Bisa Ditunda"

      // — STATUS PERBAIKAN —
      status_perbaikan:     '', // String  — "Belum Diperbaiki" | "Sedang Diperbaiki" | "Sudah Selesai"
      tgl_mulai_perbaikan:  '', // String  — "YYYY-MM-DD"
      tgl_selesai_perbaikan: '', // String
      biaya_realisasi:      0,  // Number  — Biaya aktual perbaikan (Rp)
      foto_setelah_perbaikan: [], // Array<String>  — URL foto sesudah perbaiki
      catatan:              '', // String
    }
  ],

  // — REKAP —
  rekap: {
    total_ruang_rusak:        0, // Number
    total_ruang_rusak_ringan: 0, // Number
    total_ruang_rusak_berat:  0, // Number
    total_estimasi_biaya:     0, // Number  — Total estimasi perbaikan semua kerusakan (Rp)
  },

  dilaporkan_ke_dinas: false, // Boolean  — Sudah dilaporkan ke Dinas Pendidikan?
  no_laporan_dinas:    '',    // String   — Nomor laporan ke dinas
  tgl_laporan:         '',    // String
  dibuat_pada:         null,  // Date
  diubah_pada:         null,  // Date
};
