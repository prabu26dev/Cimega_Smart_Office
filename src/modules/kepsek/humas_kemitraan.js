/**
 * =============================================================
 * CIMEGA SMART OFFICE — Modul Kepala Sekolah (Kepsek)
 * FILE    : humas_kemitraan.js
 * MODUL   : Hubungan Masyarakat & Kemitraan
 * STANDAR : Manajemen Humas & Hubungan Industri
 * =============================================================
 */

// ── 1. TAMU DINAS / PENGAWAS ────────────────────────────────
// Log kunjungan pejabat atau pembina sekolah

export const skemaTamuDinas = {
  id_tamu_dinas:    '',     // String
  id_sekolah:       '',     // String
  tgl_kunjungan:    '',     // String  — "YYYY-MM-DD"
  
  nama_tamu:        '',     // String
  jabatan:          '',     // String  — cth: "Pengawas Sekolah", "Kasi Kurikulum"
  instansi:         '',     // String  — cth: "Dinas Pendidikan Kab. ..."
  
  tujuan_kunjungan: '',     // String  — "Monitoring" | "Evaluasi" | "Pembinaan"
  pesan_saran:      '',     // String  — Poin penting hasil pembinaan tamu
  file_sk_tugas_tamu:'',    // String  — URL scan surat tugas tamu (opsional)
};

// ── 2. NOTULEN RAPAT SEKOLAH ────────────────────────────────
// Dokumentasi resmi kebijakan yang diambil melalui musyawarah

export const skemaNotulenRapat = {
  id_notulen:       '',     // String
  id_sekolah:       '',     // String
  tgl_rapat:        '',     // String
  
  jenis_rapat:      '',     // String  — "Komite" | "Kelulusan" | "Rapat Guru" | "Pleno Ortu"
  agenda_bahasan:   '',     // String  — Daftar bahasan utama
  hasil_mufakat:    '',     // String  — Keputusan akhir rapat
  
  notulis:          '',     // String  — Nama pencatat
  daftar_hadir:     [],     // Array of Strings (Nama Peserta)
  link_foto_rapat:  '',     // String  — URL galeri dokumentasi
};

// ── 3. MOU KEMITRAAN ────────────────────────────────────────
// Kerja sama dengan pihak luar (Puskesmas, Polsek, Toko, dll)

export const skemaMoUKemitraan = {
  id_mou:           '',     // String
  id_sekolah:       '',     // String
  instansi_mitra:   '',     // String  — Nama lembaga mitra
  
  tgl_kesepakatan:  '',     // String  — Kapan MoU ditandatangani
  masa_berlaku_sampai: '',  // String  — "YYYY-MM-DD"
  
  bentuk_kerjasama: '',     // String  — cth: "Pemeriksaan Kesehatan", "Keamanan", "Sponsorship"
  file_mou_pdf:     '',     // String  — URL file digital MoU
  status_aktif:     true,   // Boolean — Apakah kerja sama masih berlangsung?
};
