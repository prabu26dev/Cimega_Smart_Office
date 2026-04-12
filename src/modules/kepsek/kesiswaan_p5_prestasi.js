/**
 * =============================================================
 * CIMEGA SMART OFFICE — Modul Kepala Sekolah (Kepsek)
 * FILE    : kesiswaan_p5_prestasi.js
 * MODUL   : Kesiswaan, Proyek P5, & Manajemen Prestasi
 * STANDAR : Karakter Pelajar Pancasila & Pembinaan Siswa
 * =============================================================
 */

// ── 1. PEMANTAUAN PROYEK P5 ──────────────────────────────────

export const skemaPantauP5 = {
  id_pantau_p5:     '',     // String
  id_sekolah:       '',     // String
  tahun_ajaran:     '',     // String
  
  nama_tema_p5:     '',     // String  — cth: "Gaya Hidup Berkelanjutan"
  koordinator_pembina: '',  // String  — Nama Guru Koordinator
  fase:             '',     // String  — "A" | "B" | "C"
  
  jadwal_pelaksanaan: '',   // String  — Narasi jadwal (cth: "Setiap hari Jumat, Sep-Okt")
  catatan_keberhasilan:'',  // String  — Evaluasi Kepsek terhadap progres proyek
  hambatan_ditemukan: '',   // String  — Masalah yang terjadi di lapangan
  solusi_diambil:   '',     // String
};

// ── 2. PENANGANAN KASUS LANJUT ──────────────────────────────
// Untuk kasus berat yang memerlukan campur tangan Kepala Sekolah

export const skemaKasusSiswa = {
  id_kasus:         '',     // String
  id_sekolah:       '',     // String
  tgl_kejadian:     '',     // String  — "YYYY-MM-DD"
  
  id_siswa:         '',     // String
  nama_siswa:       '',     // String
  kelas:            '',     // String
  
  laporan_walikelas:'',     // String  — Kronologi awal dari guru
  detail_kasus_berat: '',   // String  — Deskripsi masalah (cth: Bullying, Pelanggaran Kode Etik)
  
  // -- TINDAK LANJUT KEPSEK --
  tindak_lanjut:    '',     // String  — "Panggilan Ortu" | "Skorsing" | "Pemberhentian"
  hasil_mediasi:    '',     // String  — Kesepakatan hasil pertemuan dengan orang tua
  status_kasus:     '',     // String  — "Proses" | "Selesai" | "Arsip"
};

// ── 3. REGISTER PRESTASI ────────────────────────────────────
// Kebanggaan sekolah (Siswa & Guru)

export const skemaRegisterPrestasi = {
  id_prestasi:      '',     // String
  id_sekolah:       '',     // String
  tgl_prestasi:     '',     // String
  
  peraih_prestasi:  '',     // String  — Nama Siswa / Guru / Kelompok
  kategori:         '',     // String  — "Siswa" | "Guru"
  nama_lomba:       '',     // String  — cth: "FLS2N Menyanyi Tunggal"
  
  tingkat_lomba:    '',     // String  — "Kecamatan" | "Kabupaten" | "Provinsi" | "Nasional"
  juara_ke:         '',     // String  — cth: "Juara 1" | "Harapan 1"
  
  penyelenggara:    '',     // String
  foto_sertifikat_piala: '', // String — URL dokumentasi
};
