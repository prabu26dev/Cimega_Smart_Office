/**
 * =============================================================
 * CIMEGA SMART OFFICE — Modul Guru
 * FILE    : proyek_p5.js
 * MODUL   : Proyek Penguatan Profil Pelajar Pancasila (P5)
 * STANDAR : Kurikulum Merdeka (SD)
 * =============================================================
 *
 * Mencakup:
 *  1. Modul Proyek P5
 *  2. Jurnal Observasi P5
 *  3. Rapor Proyek P5
 * =============================================================
 */

// ── KONSTANTA REFERENSI P5 ───────────────────────────────────

/** Tema resmi P5 untuk jenjang SD */
export const TEMA_P5_SD = [
  'Gaya Hidup Berkelanjutan',
  'Kearifan Lokal',
  'Bhinneka Tunggal Ika',
  'Bangunlah Jiwa dan Raganya',
  'Suara Demokrasi',
  'Rekayasa dan Teknologi',
  'Kewirausahaan',
];

/** Dimensi dan sub-elemen Profil Pelajar Pancasila */
export const DIMENSI_PPP = [
  {
    dimensi: 'Beriman, Bertakwa kepada Tuhan YME, dan Berakhlak Mulia',
    sub_elemen: ['Akhlak Beragama', 'Akhlak Pribadi', 'Akhlak kepada Manusia', 'Akhlak kepada Alam', 'Akhlak Bernegara'],
  },
  {
    dimensi: 'Berkebhinekaan Global',
    sub_elemen: ['Mengenal dan menghargai budaya', 'Komunikasi dan interaksi antar budaya', 'Refleksi dan tanggung jawab terhadap pengalaman kebinekaan', 'Berkeadilan sosial'],
  },
  {
    dimensi: 'Bergotong Royong',
    sub_elemen: ['Kolaborasi', 'Kepedulian', 'Berbagi'],
  },
  {
    dimensi: 'Mandiri',
    sub_elemen: ['Pemahaman diri dan situasi', 'Regulasi diri'],
  },
  {
    dimensi: 'Bernalar Kritis',
    sub_elemen: ['Memperoleh dan memproses informasi', 'Menganalisis dan mengevaluasi penalaran', 'Merefleksi dan mengevaluasi pemikirannya sendiri'],
  },
  {
    dimensi: 'Kreatif',
    sub_elemen: ['Menghasilkan gagasan yang orisinal', 'Menghasilkan karya dan tindakan yang orisinal', 'Memiliki keluwesan berpikir'],
  },
];

/** Level capaian dimensi PPP */
export const LEVEL_CAPAIAN_PPP = [
  { kode: 'MB',  label: 'Mulai Berkembang',              urutan: 1 },
  { kode: 'SB',  label: 'Sedang Berkembang',             urutan: 2 },
  { kode: 'BSH', label: 'Berkembang Sesuai Harapan',     urutan: 3 },
  { kode: 'SAB', label: 'Sangat Berkembang',             urutan: 4 },
];

/** Tahapan standar proyek P5 */
export const TAHAPAN_P5_STANDAR = [
  'Pengenalan (Orientasi)',
  'Kontekstualisasi',
  'Aksi Nyata',
  'Refleksi',
  'Tindak Lanjut / Perayaan Belajar',
];

// ── 1. MODUL PROYEK P5 ───────────────────────────────────────

export const skemaModulP5 = {
  id_modul_p5:        '',     // String
  id_sekolah:         '',     // String
  id_guru:            '',     // String  — Koordinator / fasilitator utama
  id_rombel:          '',     // String
  nama_kelas:         '',     // String
  tahun_pelajaran:    '',     // String
  semester:           '',     // String  — "Ganjil" | "Genap"
  status:             'draft', // String — "draft" | "aktif" | "selesai"

  // — IDENTITAS PROYEK —
  identitas: {
    tema_p5:          '', // String  — Dari TEMA_P5_SD
    topik:            '', // String  — Topik spesifik dalam tema
    judul_proyek:     '', // String  — Nama/judul proyek
    fase:             '', // String  — "A" | "B" | "C"
    alokasi_jp_total: 0,  // Number  — Total jam pelajaran proyek
    tanggal_mulai:    '', // String  — "YYYY-MM-DD"
    tanggal_selesai:  '', // String  — "YYYY-MM-DD"
    tim_fasilitator: [
      {
        id_guru:      '', // String
        nama_guru:    '', // String
        peran:        '', // String  — cth: "Koordinator", "Fasilitator Seni"
      }
    ],
  },

  // — DIMENSI KARAKTER YANG DIKEMBANGKAN —
  dimensi_karakter: [
    {
      nama_dimensi:   '', // String  — Dimensi PPP
      sub_elemen:     [], // Array<String>  — Sub-elemen yang difokuskan
      target_capaian: '', // String  — Target akhir (MB/SB/BSH/SAB)
    }
  ],

  // — DESKRIPSI & TUJUAN —
  deskripsi_proyek:     '', // String  — Gambaran umum proyek
  relevansi_nyata:      '', // String  — Kaitannya dengan kehidupan sehari-hari
  produk_akhir:         '', // String  — cth: "Kebun Mini Sekolah", "Buku Cerita"
  indikator_sukses:     [], // Array<String>  — Tanda keberhasilan proyek

  // — ALUR KEGIATAN (TAHAPAN) —
  alur_kegiatan: [
    {
      nama_tahap:     '', // String  — cth: "Pengenalan", "Aksi Nyata"
      deskripsi:      '', // String  — Gambaran kegiatan di tahap ini
      jp:             0,  // Number  — Alokasi JP untuk tahap ini
      aktivitas: [],      // Array<String>  — Daftar aktivitas spesifik
      produk_tahap:   '', // String  — Hasil/produk di akhir tahap ini
      sumber_belajar: [], // Array<String>  — Referensi / media yang dipakai
      catatan_guru:   '', // String  — Catatan pelaksanaan
    }
  ],

  // — RUBRIK PENILAIAN P5 —
  rubrik_penilaian: [
    {
      dimensi:    '', // String
      sub_elemen: '', // String
      MB:         '', // String  — Deskriptor level Mulai Berkembang
      SB:         '', // String  — Deskriptor level Sedang Berkembang
      BSH:        '', // String  — Deskriptor level Berkembang Sesuai Harapan
      SAB:        '', // String  — Deskriptor level Sangat Berkembang
    }
  ],

  dibuat_pada:  null, // Date
  diubah_pada:  null, // Date
};

// ── 2. JURNAL OBSERVASI P5 ───────────────────────────────────

export const skemaJurnalObservasiP5 = {
  id_jurnal_p5:       '',     // String
  id_sekolah:         '',     // String
  id_modul_p5:        '',     // String  — Referensi ke modul proyek
  id_guru:            '',     // String  — Guru yang mengobservasi
  nama_kelas:         '',     // String
  tanggal:            '',     // String  — "YYYY-MM-DD"
  tahap_proyek:       '',     // String  — Tahap P5 yang sedang berlangsung

  // Observasi per murid
  catatan_per_murid: [
    {
      id_murid:             '', // String
      nama:                 '', // String
      catatan_proses:       '', // String  — Apa yang dilakukan / bagaimana perilakunya
      karakter_yang_muncul: [], // Array<String>  — Dimensi/karakter yang terlihat
      level_sementara:      '', // String  — Estimasi level: "MB" | "SB" | "BSH" | "SAB"
      foto_dokumentasi:     [], // Array<String>  — URL foto/video dokumentasi
      catatan_khusus:       '', // String  — Hal menonjol / perlu perhatian

      // Penilaian per dimensi (diisi saat observasi)
      penilaian_dimensi: [
        {
          nama_dimensi: '', // String
          sub_elemen:   '', // String
          level:        '', // String  — "MB" | "SB" | "BSH" | "SAB"
          bukti:        '', // String  — Deskripsi bukti yang teramati
        }
      ],
    }
  ],

  catatan_umum_sesi: '', // String  — Catatan umum kegiatan hari ini
  hambatan:          '', // String  — Kendala selama pelaksanaan
  dibuat_pada:       null, // Date
};

// ── 3. RAPOR PROYEK P5 ───────────────────────────────────────

export const skemaRaporP5 = {
  id_rapor_p5:        '',     // String
  id_sekolah:         '',     // String
  id_modul_p5:        '',     // String  — Referensi ke modul proyek
  id_rombel:          '',     // String
  nama_kelas:         '',     // String
  tahun_pelajaran:    '',     // String
  semester:           '',     // String
  judul_proyek:       '',     // String
  tema_p5:            '',     // String

  // Rapor per murid
  capaian_per_murid: [
    {
      id_murid:         '', // String
      nama:             '', // String
      nisn:             '', // String
      no_urut:          0,  // Number

      // Capaian tiap dimensi
      daftar_dimensi: [
        {
          nama_dimensi:   '', // String
          sub_elemen:     '', // String
          level_capaian:  '', // String  — "MB" | "SB" | "BSH" | "SAB"
          deskripsi:      '', // String  — Narasi capaian (bisa dibantu AI)
        }
      ],

      narasi_guru:        '', // String  — Komentar / cerita perkembangan murid
      karya_unggulan:     '', // String  — Karya / momen menonjol murid
      saran_tindak_lanjut: '', // String — Saran untuk perkembangan ke depan
    }
  ],

  dicetak_pada:  null, // Date
  diubah_pada:   null, // Date
};
