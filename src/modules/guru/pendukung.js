/**
 * =============================================================
 * CIMEGA SMART OFFICE — Modul Guru
 * FILE    : pendukung.js
 * MODUL   : Humas & Pendukung Administratif
 * STANDAR : Kurikulum Merdeka (SD)
 * =============================================================
 *
 * Mencakup:
 *  1. Buku Kasus & Prestasi Murid
 *  2. Komunikasi dengan Orang Tua
 *  3. Inventaris Kelas
 *  4. Log Logistik (Rapor, Pinjam Buku, dll)
 *  5. Keuangan Kelas (Kas Kelas)
 *  6. Notulen Rapat
 * =============================================================
 */

// ── KONSTANTA REFERENSI ──────────────────────────────────────

export const JENIS_CATATAN = {
  MASALAH:   { label: 'Kasus / Masalah', kode: 'masalah',  warna: '#ef4444' },
  PRESTASI:  { label: 'Prestasi',        kode: 'prestasi', warna: '#22c55e' },
  PENTING:   { label: 'Catatan Penting', kode: 'penting',  warna: '#f59e0b' },
};

export const JENIS_KOMUNIKASI = {
  TATAP_MUKA:   'Tatap Muka Langsung',
  TELEPON:      'Telepon / Video Call',
  CHAT:         'Pesan (WA / SMS)',
  SURAT:        'Surat Resmi',
  PERTEMUAN:    'Pertemuan Wali Murid',
};

export const KONDISI_BARANG = {
  BAIK:       { label: 'Baik',        kode: 'baik',       warna: '#22c55e' },
  CUKUP:      { label: 'Cukup Baik',  kode: 'cukup',      warna: '#f59e0b' },
  RUSAK_RINGAN: { label: 'Rusak Ringan', kode: 'rusak_ringan', warna: '#f97316' },
  RUSAK_BERAT:  { label: 'Rusak Berat',  kode: 'rusak_berat',  warna: '#ef4444' },
  HILANG:     { label: 'Hilang',       kode: 'hilang',     warna: '#6b7280' },
};

// ── 1. BUKU KASUS & PRESTASI MURID ──────────────────────────

export const skemaBukuKasusPrestasi = {
  id_catatan:         '',     // String
  id_sekolah:         '',     // String
  id_guru:            '',     // String  — Guru yang mencatat
  id_rombel:          '',     // String
  nama_kelas:         '',     // String

  tanggal:            '',     // String  — "YYYY-MM-DD"
  waktu:              '',     // String  — cth: "09.30"
  id_murid:           '',     // String  — Referensi ke data murid
  nama_murid:         '',     // String
  jenis_catatan:      '',     // String  — "masalah" | "prestasi" | "penting"

  // — DETAIL KEJADIAN —
  detail_kejadian:    '', // String  — Narasi lengkap kejadian / prestasi
  saksi:              [], // Array<String>  — Nama saksi / pihak yang terlibat
  tempat_kejadian:    '', // String  — cth: "Ruang Kelas", "Lapangan", "Kantin"

  // — TINDAK LANJUT —
  solusi_tindak_lanjut: '', // String  — Langkah yang sudah / akan dilakukan
  pihak_yang_dilibatkan: [], // Array<String> — "Kepala Sekolah", "BK", "Orang Tua"
  status_penyelesaian:  '', // String  — "Sedang Diproses" | "Selesai" | "Dipantau"

  // — BUKTI & DOKUMENTASI —
  dokumen_bukti:      [], // Array<String>  — URL foto / surat / file pendukung
  catatan_lanjutan:   '', // String  — Update perkembangan setelah penanganan awal

  // Untuk kasus
  tingkat_kasus:      '', // String  — "Ringan" | "Sedang" | "Berat" (hanya untuk jenis masalah)

  // Untuk prestasi
  nama_kompetisi:     '', // String  — Nama lomba / ajang (hanya untuk jenis prestasi)
  tingkat:            '', // String  — "Sekolah" | "Kecamatan" | "Kota" | "Provinsi" | "Nasional"
  peringkat:          '', // String  — "Juara 1", "Juara 2", dst

  dibuat_pada:  null, // Date
  diubah_pada:  null, // Date
};

// ── 2. KOMUNIKASI DENGAN ORANG TUA ───────────────────────────

export const skemaKomunikasiOrtu = {
  id_komunikasi:      '',     // String
  id_sekolah:         '',     // String
  id_guru:            '',     // String
  id_rombel:          '',     // String

  tanggal:            '',     // String  — "YYYY-MM-DD"
  waktu:              '',     // String  — cth: "14.00"
  jenis_komunikasi:   '',     // String  — Dari JENIS_KOMUNIKASI
  inisiator:          '',     // String  — "Guru" | "Orang Tua"

  // — DATA ORANG TUA —
  nama_orang_tua:     '', // String
  hubungan_dengan_murid: '', // String  — "Ayah" | "Ibu" | "Wali"
  no_kontak:          '', // String

  // — DATA MURID TERKAIT —
  id_murid:           '', // String
  nama_murid:         '', // String

  // — ISI KOMUNIKASI —
  topik_pembicaraan:  '', // String  — Ringkasan topik / agenda
  detail_pembahasan:  '', // String  — Isi lengkap pembicaraan
  hasil_pertemuan:    '', // String  — Kesimpulan yang dicapai
  kesepakatan:        [], // Array<String>  — Butir-butir kesepakatan
  tindak_lanjut:      '', // String  — Langkah berikutnya
  jadwal_follow_up:   '', // String  — Tanggal pertemuan/komunikasi berikutnya (jika ada)

  // — DOKUMENTASI —
  foto_dokumentasi:   [], // Array<String>  — URL foto pertemuan / surat
  catatan_tambahan:   '', // String

  dibuat_pada:  null, // Date
  diubah_pada:  null, // Date
};

// ── 3. INVENTARIS KELAS ──────────────────────────────────────

export const skemaInventaris = {
  id_inventaris:      '',     // String  — ID dokumen inventaris kelas
  id_sekolah:         '',     // String
  id_rombel:          '',     // String
  nama_kelas:         '',     // String
  tahun_pelajaran:    '',     // String
  tanggal_pembaruan:  '',     // String  — Terakhir diperbarui

  daftar_barang: [
    {
      id_barang:        '', // String   — ID unik barang
      nama_barang:      '', // String   — cth: "Kursi Murid", "Meja Guru"
      kode_barang:      '', // String   — Nomor inventaris sekolah (jika ada)
      kategori:         '', // String   — "Mebel" | "Elektronik" | "Alat Tulis" | "Buku" | dst
      sumber_barang:    '', // String   — "Sekolah" | "Bantuan Pemerintah" | "Sumbangan"
      tahun_perolehan:  '', // String

      // Kondisi barang
      jumlah_baik:      0,  // Number
      jumlah_rusak_ringan: 0, // Number
      jumlah_rusak_berat:  0, // Number
      jumlah_hilang:    0,  // Number
      total_jumlah:     0,  // Number  — Dihitung otomatis (semua kondisi)

      kondisi_dominan:  '', // String   — Dari KONDISI_BARANG
      catatan:          '', // String   — Keterangan atau riwayat perbaikan
      butuh_penggantian: false, // Boolean — Perlu pengadaan baru?
    }
  ],

  catatan_umum: '',   // String  — Catatan kondisi inventaris secara umum
  dibuat_pada:  null, // Date
  diubah_pada:  null, // Date
};

// ── 4. LOG LOGISTIK ──────────────────────────────────────────

/** 4a. Tanda Terima Rapor */
export const skemaTandaTerimaRapor = {
  id_tanda_terima:    '',     // String
  id_sekolah:         '',     // String
  id_rombel:          '',     // String
  nama_kelas:         '',     // String
  semester:           '',     // String
  tahun_pelajaran:    '',     // String

  daftar_pengambilan: [
    {
      id_murid:         '', // String
      nama_murid:       '', // String
      nama_pengambil:   '', // String   — Nama orang yang mengambil rapor
      hubungan:         '', // String   — "Ayah" | "Ibu" | "Wali"
      tanggal_ambil:    '', // String   — "YYYY-MM-DD"
      waktu_ambil:      '', // String   — cth: "10.30"
      sudah_ambil:      false, // Boolean — true = sudah diambil
      tanda_tangan:     false, // Boolean — true = sudah tanda tangan di buku
      foto_ttd:         '', // String   — URL foto tanda tangan (opsional)
      catatan:          '', // String
    }
  ],

  dibuat_pada:  null, // Date
  diubah_pada:  null, // Date
};

/** 4b. Peminjaman Buku */
export const skemaPinjamBuku = {
  id_pinjam:          '',     // String
  id_sekolah:         '',     // String
  id_rombel:          '',     // String
  nama_kelas:         '',     // String

  daftar_pinjaman: [
    {
      id_pinjaman:      '', // String
      id_murid:         '', // String
      nama_murid:       '', // String
      judul_buku:       '', // String
      kode_buku:        '', // String   — Nomor inventaris buku
      tgl_pinjam:       '', // String   — "YYYY-MM-DD"
      tgl_wajib_kembali: '', // String  — Batas pengembalian
      tgl_kembali:      '', // String   — Tanggal dikembalikan (kosong jika belum)
      sudah_kembali:    false, // Boolean
      kondisi_saat_kembali: '', // String — "Baik" | "Rusak" | "Hilang"
      denda:            0,  // Number   — Denda jika terlambat atau rusak (Rp)
      catatan:          '', // String
    }
  ],

  dibuat_pada:  null, // Date
  diubah_pada:  null, // Date
};

// ── 5. KEUANGAN KELAS (KAS KELAS) ───────────────────────────

export const skemaKeuanganKelas = {
  id_keuangan:        '',     // String
  id_sekolah:         '',     // String
  id_rombel:          '',     // String
  nama_kelas:         '',     // String
  semester:           '',     // String
  tahun_pelajaran:    '',     // String
  saldo_awal:         0,      // Number   — Saldo awal periode (Rp)

  // Buku Kas Harian
  daftar_transaksi: [
    {
      id_transaksi:   '', // String
      tanggal:        '', // String   — "YYYY-MM-DD"
      keterangan:     '', // String   — Deskripsi transaksi
      kategori:       '', // String   — "Kas Masuk" | "Pembelian ATK" | "Kegiatan" | dst
      jumlah_masuk:   0,  // Number   — Pemasukan (Rp), 0 jika ini pengeluaran
      jumlah_keluar:  0,  // Number   — Pengeluaran (Rp), 0 jika ini pemasukan
      saldo:          0,  // Number   — Saldo setelah transaksi (dihitung otomatis)
      bukti_transaksi: '', // String  — URL struk / foto bukti
      dicatat_oleh:   '', // String   — Nama bendahara kelas / guru
    }
  ],

  // Rekap
  total_pemasukan:    0,  // Number  — Total semua pemasukan
  total_pengeluaran:  0,  // Number  — Total semua pengeluaran
  saldo_akhir:        0,  // Number  — Saldo saat ini

  dibuat_pada:  null, // Date
  diubah_pada:  null, // Date
};

// ── 6. NOTULEN RAPAT ─────────────────────────────────────────

export const skemaNotulenRapat = {
  id_notulen:         '',     // String
  id_sekolah:         '',     // String
  id_rombel:          '',     // String  — Bisa kosong jika rapat tingkat sekolah
  nama_kelas:         '',     // String  — Opsional

  // — INFORMASI RAPAT —
  judul_rapat:        '', // String  — cth: "Rapat Wali Murid Semester Ganjil"
  tanggal_rapat:      '', // String  — "YYYY-MM-DD"
  waktu_mulai:        '', // String  — cth: "09.00"
  waktu_selesai:      '', // String  — cth: "11.30"
  tempat_rapat:       '', // String  — cth: "Aula Sekolah"
  jenis_rapat:        '', // String  — "Internal Guru" | "Wali Murid" | "Komite" | "Dinas"

  // — PESERTA —
  pimpinan_rapat:     '', // String  — Nama pemimpin rapat
  notulis:            '', // String  — Nama pencatat
  daftar_hadir: [
    {
      nama:     '', // String
      jabatan:  '', // String  — cth: "Wali Kelas 4A", "Orang Tua Murid"
      hadir:    true, // Boolean
      keterangan: '', // String  — Keterangan jika tidak hadir
    }
  ],
  jumlah_hadir:       0,  // Number  — Dihitung otomatis
  jumlah_undangan:    0,  // Number

  // — AGENDA & ISI RAPAT —
  agenda: [], // Array<String>  — Daftar poin agenda rapat

  ringkasan_pembahasan: [
    {
      agenda_ke:    0,  // Number  — Merujuk ke urutan agenda
      pembahasan:   '', // String  — Ringkasan diskusi
      penyampaian_dari: '', // String — cth: "Kepala Sekolah", "Wali Murid"
    }
  ],

  // — KEPUTUSAN —
  poin_keputusan: [
    {
      no:               0,  // Number
      isi_keputusan:    '', // String  — Keputusan yang disepakati
      penanggung_jawab: '', // String  — Siapa yang bertanggung jawab
      batas_waktu:      '', // String  — Tanggal tenggat pelaksanaan
      status:           '', // String  — "Belum" | "Proses" | "Selesai"
    }
  ],

  // — DOKUMENTASI —
  foto_rapat:         [], // Array<String>  — URL foto dokumentasi
  file_lampiran:      [], // Array<String>  — URL dokumen lampiran
  catatan_tambahan:   '', // String

  dibuat_pada:  null, // Date
  diubah_pada:  null, // Date
};
