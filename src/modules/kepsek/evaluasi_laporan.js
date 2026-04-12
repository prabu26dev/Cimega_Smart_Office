/**
 * =============================================================
 * CIMEGA SMART OFFICE — Modul Kepala Sekolah (Kepsek)
 * FILE    : evaluasi_laporan.js
 * MODUL   : Evaluasi & Laporan Akhir Tahunan
 * STANDAR : Raport Pendidikan & Akreditasi
 * =============================================================
 */

// ── 1. TINDAK LANJUT RAPOR PENDIDIKAN ───────────────────────
// Berdasarkan data PBD (Perencanaan Berbasis Data)

export const skemaTindakLanjutRapor = {
  id_pbd:           '',     // String
  id_sekolah:       '',     // String
  tahun_evaluasi:   '',     // String  — cth: "2024"
  
  indikator_kurang: [
    {
      nama_indikator: '',   // String  — cth: "Literasi", "Kualitas Pembelajaran"
      nilai_rapor:    0,    // Number
      warna_indikator:'',   // String  — "Merah" | "Kuning" | "Hijau"
      akar_masalah:   '',   // String  — Kenapa nilainya rendah?
      program_perbaikan: '', // String — Rencana aksi tahun depan
    }
  ],
  
  rencana_anggaran_pbd: 0,  // Number  — Alokasi dana BOS untuk perbaikan ini
  catatan_pengawas: '',     // String
};

// ── 2. LAPORAN TAHUNAN KEPSEK ───────────────────────────────
// Pertanggungjawaban akhir tahun ajaran

export const skemaLaporanTahunan = {
  id_laporan_tahunan: '',   // String
  id_sekolah:       '',     // String
  tahun_ajaran:     '',     // String
  
  program_sukses: [
    {
      nama_kegiatan: '',    // String
      capaian_utama: '',    // String
    }
  ],
  
  kendala_utama:    '',     // String  — Masalah terbesar tahun ini
  rekomendasi_strategis: '', // String — Untuk pimpinan sekolah periode berikutnya
  
  tgl_laporan:      '',     // String
  file_laporan_lengkap: '', // String — URL file PDF Laporan Tahunan
};

// ── 3. INDUK LULUSAN ────────────────────────────────────────
// Data historis siswa yang sudah tamat

export const skemaIndukLulusan = {
  id_induk_lulusan: '',     // String
  id_sekolah:       '',     // String
  tahun_ajaran_lulus: '',   // String  — cth: "2023/2024"
  
  total_lulus:       0,     // Number
  daftar_ijazah: [
    {
      id_siswa:     '',     // String
      nama_lulusan: '',     // String
      nisn:         '',     // String
      no_seri_ijazah: '',   // String  — Nomor resmi ijazah yang diterbitkan
      tgl_penyerahan: '',   // String  — Kapan ijazah diambil siswa/ortu
      pihak_penerima: '',   // String  — Tanda tangan / Nama penerima
      file_scan_ijazah: '', // String  — URL arsip digital ijazah
    }
  ],
  
  catatan_arsip:    '',     // String
};
