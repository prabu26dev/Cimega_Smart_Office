/**
 * =============================================================
 * CIMEGA SMART OFFICE — Modul Kepala Sekolah (Kepsek)
 * FILE    : perencanaan_manajemen.js
 * MODUL   : Perencanaan & Manajemen Sekolah
 * STANDAR : KOSP (Kurikulum Operasional Satuan Pendidikan)
 * =============================================================
 */

// ── 1. KOSP (KURIKULUM OPERASIONAL SATUAN PENDIDIKAN) ────────

export const skemaKOSP = {
  id_kosp:          '',     // String  — ID unik KOSP
  id_sekolah:       '',     // String
  tahun_ajaran:     '',     // String  — cth: "2024/2025"
  
  // -- LANDASAN FILOSOFIS --
  visi:             '',     // String
  misi:             '',     // String
  tujuan:           '',     // String
  
  // -- PENGORGANISASIAN PEMBELAJARAN --
  pengorganisasian_belajar: {
    pembagian_jp:   '',     // String  — Narasi/Penjelasan pembagian JP Intra & Ekstra
    jadwal_p5:      '',     // String  — Blok / Reguler / Kolaborasi
    ekskul: [
      {
        nama_ekskul: '',    // String
        pembina:     '',    // String
        jadwal:      '',    // String
      }
    ]
  },

  // -- DOKUMEN PENDUKUNG --
  file_kaldik:      '',     // String  — URL file Kalender Pendidikan
  file_kosp_lengkap:'',     // String  — URL file draft KOSP utuh
  status_pengesahan:false,  // Boolean — Sudah disahkan Pengawas/Dinas?
  dibuat_pada:      null,   // Date
};

// ── 2. RKS / RKJM (RENCANA KERJA SEKOLAH / JANGKA MENENGAH) ─

export const skemaRKJM = {
  id_rkjm:          '',     // String
  id_sekolah:       '',     // String
  tahun_mulai:      '',     // String  — cth: "2024"
  tahun_selesai:    '',     // String  — cth: "2028"
  
  target_utama:     '',     // String  — Capaian besar dalam 4 tahun
  program_unggulan: [
    {
      nama_program: '',     // String
      anggaran_est:  0,     // Number
      pj:           '',     // String  — Penanggung Jawab
    }
  ],
  
  strategi_pencapaian: '',  // String  — Narasi taktik pelaksanaan
  dibuat_pada:      null,   // Date
};

// ── 3. SK TUGAS GURU & TENDIK ────────────────────────────────

export const skemaSKTugas = {
  id_sk:            '',     // String
  id_sekolah:       '',     // String
  no_sk:            '',     // String  — Nomor Surat Keputusan
  tgl_sk:           '',     // String  — "YYYY-MM-DD"
  
  rincian_tugas: [
    {
      id_pegawai:     '',   // String  — Relasi ke database PTK
      nama_pegawai:   '',   // String
      jabatan_utama:  '',   // String  — "Guru Kelas" | "Guru Mapel" | "Staf TU"
      tugas_tambahan: '',   // String  — "Wali Kelas" | "Bendahara" | "Operator"
      beban_kerja:    0,    // Number  — Ekuivalensi jam (misal 24 JP)
    }
  ],

  semester:         '',     // String  — "Ganjil" | "Genap"
  tahun_ajaran:     '',     // String
  file_sk_scan:     '',     // String  — URL scan SK bertanda tangan
};
