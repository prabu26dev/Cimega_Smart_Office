/**
 * =============================================================
 * CIMEGA SMART OFFICE — Modul Kepala Sekolah (Kepsek)
 * FILE    : supervisi_akademik.js
 * MODUL   : Supervisi Akademik & Pembinaan Guru
 * STANDAR : PMM / Supervisi Akademik Kurikulum Merdeka
 * =============================================================
 */

// ── 1. JADWAL SUPERVISI ──────────────────────────────────────

export const skemaJadwalSupervisi = {
  id_supervisi:     '',     // String
  id_sekolah:       '',     // String
  semester:         '',     // String
  tahun_ajaran:     '',     // String
  
  bulan_pelaksanaan:'',     // String  — cth: "Maret 2024"
  id_guru:          '',     // String  — ID Guru yang akan disupervisi
  nama_guru:        '',     // String
  mapel_fase:       '',     // String  — cth: "Matematika / Fase B"
  jadwal_observasi: '',     // String  — Format "YYYY-MM-DD HH:mm"
  
  status_terlaksana:false,  // Boolean
  id_instrumen_ref: '',     // String  — Relasi ke hasil observasi
};

// ── 2. INSTRUMEN OBSERVASI & COACHING ────────────────────────
// Hasil pengamatan di dalam kelas

export const skemaHasilObservasi = {
  id_hasil:         '',     // String
  id_guru:          '',     // String
  tgl_observasi:    '',     // String
  
  // -- AREA PENGAMATAN --
  kelengkapan_modul:false,  // Boolean — Cek RPP/Modul Ajar
  catatan_mengajar: '',     // String  — Poin positif & kekurangan
  interaksi_murid:  '',     // String  — Bagaimana guru mengaktifkan murid
  
  // -- COACHING & UMPAN BALIK --
  umpan_balik:      '',     // String  — Rekomendasi perbaikan
  catatan_coaching: '',     // String  — Hasil diskusi pasca-observasi
  tindak_lanjut:    '',     // String  — Apa yang harus diperbaiki ke depannya
};

// ── 3. KOMUNITAS BELAJAR (KOMBEL) ────────────────────────────
// Dokumentasi pertemuan rutin antar guru (PLC)

export const skemaKombel = {
  id_kombel:        '',     // String
  id_sekolah:       '',     // String
  tgl_pertemuan:    '',     // String
  nama_komunitas:   '',     // String  — cth: "Kombel Fase A SD Cimega"
  
  topik_masalah:    '',     // String  — Masalah pembelajaran yang dibahas
  kesimpulan_solusi:'',     // String  — Hasil kesepakatan bersama
  
  daftar_hadir:     [],     // Array of Strings (Nama Guru)
  dokumentasi_foto: '',     // String  — URL foto pertemuan
};

// ── 4. PENILAIAN KINERJA (PKG) ───────────────────────────────

export const skemaPKG = {
  id_pkg:           '',     // String
  id_pegawai:       '',     // String
  tahun_penilaian:  '',     // String
  
  poin_disiplin:     0,     // Number  — Skala 1-100
  poin_kualitas_kerja:0,    // Number  — Skala 1-100
  poin_sosial:       0,     // Number  — Interaksi dengan teman sejawat
  
  rekomendasi_pengembangan: '', // String — Pengembangan kompetensi yang disarankan
  predikat_akhir:   '',     // String  — "Sangat Baik" | "Baik" | "Cukup" | "Kurang"
  tgl_penilaian:    '',     // String
};
