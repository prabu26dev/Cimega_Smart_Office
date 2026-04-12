/**
 * =============================================================
 * CIMEGA SMART OFFICE — Modul Guru
 * FILE    : perencanaan.js
 * MODUL   : Perencanaan & Pedoman Guru
 * STANDAR : Kurikulum Merdeka (SD)
 * =============================================================
 *
 * Mencakup:
 *  1. Kalender Pendidikan
 *  2. Capaian Pembelajaran (CP)
 *  3. Alur Tujuan Pembelajaran (ATP)
 *  4. Program Tahunan (Prota)
 *  5. Program Semester (Promes)
 *  6. Modul Ajar (RPP+)
 *  7. KKTP (Kriteria Ketercapaian Tujuan Pembelajaran)
 * =============================================================
 */

// ── KONSTANTA REFERENSI ──────────────────────────────────────

export const FASE_SD = {
  A: { label: 'Fase A', kelas: ['Kelas 1', 'Kelas 2'] },
  B: { label: 'Fase B', kelas: ['Kelas 3', 'Kelas 4'] },
  C: { label: 'Fase C', kelas: ['Kelas 5', 'Kelas 6'] },
};

export const PROFIL_PANCASILA = [
  'Beriman, Bertakwa kepada Tuhan YME, dan Berakhlak Mulia',
  'Berkebhinekaan Global',
  'Bergotong Royong',
  'Mandiri',
  'Bernalar Kritis',
  'Kreatif',
];

export const MATA_PELAJARAN_SD = [
  'Pendidikan Agama dan Budi Pekerti',
  'Pendidikan Pancasila',
  'Bahasa Indonesia',
  'Matematika',
  'Ilmu Pengetahuan Alam dan Sosial (IPAS)',
  'Pendidikan Jasmani Olahraga dan Kesehatan (PJOK)',
  'Seni Budaya',
  'Bahasa Inggris',
  'Muatan Lokal',
];

export const MODEL_PEMBELAJARAN = [
  'Problem Based Learning (PBL)',
  'Project Based Learning (PjBL)',
  'Discovery Learning',
  'Inquiry Learning',
  'Direct Instruction',
  'Cooperative Learning',
  'Think Pair Share (TPS)',
];

// ── 1. KALENDER PENDIDIKAN ───────────────────────────────────

export const skemaKalenderPendidikan = {
  id_kalender:        '',     // String  — ID unik dokumen
  id_sekolah:         '',     // String  — ID sekolah (multi-tenant)
  tahun_pelajaran:    '',     // String  — cth: "2024/2025"
  semester:           '',     // String  — "Ganjil" | "Genap"

  daftar_bulan: [
    {
      bulan:          '',     // String  — "Juli", "Agustus", ...
      urutan:         0,      // Number  — Urutan bulan (1–12)

      daftar_kejadian: [
        {
          tanggal:        '',   // String  — Format "YYYY-MM-DD"
          nama_kegiatan:  '',   // String  — cth: "Hari Pertama Sekolah"
          status_libur:   false, // Boolean — true = hari libur / tidak masuk
          keterangan:     '',   // String  — Keterangan tambahan
        }
      ],

      jumlah_hari_efektif:  0, // Number  — Hari masuk aktif di bulan ini
      jumlah_minggu_efektif: 0, // Number  — Minggu aktif di bulan ini
    }
  ],

  total_hari_efektif_semester: 0, // Number
  total_minggu_efektif:        0, // Number
  disahkan_kepsek:    false,      // Boolean
  dibuat_pada:        null,       // Date (Timestamp)
  diubah_pada:        null,       // Date (Timestamp)
};

// ── 2. CAPAIAN PEMBELAJARAN (CP) ─────────────────────────────

export const skemaCP = {
  id_cp:              '',     // String
  id_sekolah:         '',     // String
  id_guru:            '',     // String
  mata_pelajaran:     '',     // String
  fase:               '',     // String  — "A" | "B" | "C"
  kelas:              [],     // Array<String>  — Bisa lebih dari 1 kelas per fase

  elemen_cp: [
    {
      nama_elemen:        '', // String  — cth: "Bilangan", "Geometri", "Membaca"
      deskripsi_cp:       '', // String  — Narasi CP resmi dari pemerintah
      catatan_penjabaran: '', // String  — Penafsiran guru terhadap elemen ini
    }
  ],

  sumber_dokumen:     '',     // String  — Nomor SK / referensi resmi
  tahun_pelajaran:    '',     // String
  dibuat_pada:        null,   // Date
  diubah_pada:        null,   // Date
};

// ── 3. ALUR TUJUAN PEMBELAJARAN (ATP) ────────────────────────

export const skemaATP = {
  id_atp:             '',     // String
  id_sekolah:         '',     // String
  id_guru:            '',     // String
  mata_pelajaran:     '',     // String
  fase:               '',     // String  — "A" | "B" | "C"
  kelas:              '',     // String  — "Kelas 3"
  semester:           '',     // String  — "Ganjil" | "Genap"
  tahun_pelajaran:    '',     // String

  daftar_tp: [
    {
      urutan:             0,  // Number  — Urutan pengajaran dalam semester
      id_tp:              '', // String  — cth: "TP-MTK-3A-01"
      tujuan_pembelajaran: '', // String — "Murid dapat ..."
      materi_inti:        '', // String  — Topik / materi pokok
      profil_pancasila:   [], // Array<String>  — Dimensi PPP yang dikembangkan
      alokasi_waktu:      0,  // Number  — Jumlah Jam Pelajaran (JP)
      jenis_penilaian:    '', // String  — "Formatif" | "Sumatif" | "Keduanya"
      keterangan:         '', // String  — Catatan tambahan
    }
  ],

  total_jp:           0,      // Number  — Total JP semester ini
  dibuat_pada:        null,   // Date
  diubah_pada:        null,   // Date
};

// ── 4. PROGRAM TAHUNAN (PROTA) ───────────────────────────────

export const skemaProta = {
  id_prota:           '',     // String
  id_sekolah:         '',     // String
  id_guru:            '',     // String
  mata_pelajaran:     '',     // String
  fase:               '',     // String
  kelas:              '',     // String
  tahun_pelajaran:    '',     // String

  daftar_tp_tahunan: [
    {
      semester:           '', // String  — "Ganjil" | "Genap"
      no_urut:            0,  // Number
      id_tp:              '', // String
      tujuan_pembelajaran: '', // String
      materi_inti:        '', // String
      alokasi_jp:         0,  // Number
    }
  ],

  total_jp_ganjil:    0,      // Number
  total_jp_genap:     0,      // Number
  total_jp:           0,      // Number  — Total JP setahun
  diketahui_kepsek:   '',     // String  — Nama kepala sekolah
  dibuat_pada:        null,   // Date
  diubah_pada:        null,   // Date
};

// ── 5. PROGRAM SEMESTER (PROMES) ─────────────────────────────

export const skemaPromes = {
  id_promes:          '',     // String
  id_sekolah:         '',     // String
  id_guru:            '',     // String
  mata_pelajaran:     '',     // String
  kelas:              '',     // String
  semester:           '',     // String  — "Ganjil" | "Genap"
  tahun_pelajaran:    '',     // String
  jumlah_minggu_efektif: 0,   // Number

  detail_mingguan: [
    {
      bulan:          '',     // String  — "Juli", "Agustus", ...
      minggu_ke:      0,      // Number  — Minggu ke berapa di bulan ini
      id_tp:          '',     // String  — Referensi ke ATP
      tujuan_pembelajaran: '', // String
      materi:         '',     // String
      jp:             0,      // Number  — JP di minggu ini
      keterangan:     '',     // String  — cth: "Libur Nasional", "Ujian"
    }
  ],

  total_jp:           0,      // Number
  diketahui_kepsek:   '',     // String
  dibuat_pada:        null,   // Date
  diubah_pada:        null,   // Date
};

// ── 6. MODUL AJAR (RPP+) ────────────────────────────────────

export const skemaModulAjar = {
  id_modul_ajar:      '',     // String
  id_sekolah:         '',     // String
  id_guru:            '',     // String
  status:             'draft', // String — "draft" | "selesai" | "disetujui"

  // — IDENTITAS —
  identitas: {
    nama_guru:          '', // String
    nip:                '', // String
    nama_sekolah:       '', // String
    mata_pelajaran:     '', // String
    fase:               '', // String
    kelas:              '', // String  — cth: "Kelas 4"
    semester:           '', // String
    tahun_pelajaran:    '', // String
    alokasi_waktu:      '', // String  — cth: "2 x 35 menit"
    jumlah_pertemuan:   0,  // Number
    model_pembelajaran: '', // String
    moda:               '', // String  — "Tatap Muka" | "PJJ Daring" | "Hybrid"
  },

  // — KOMPONEN UTAMA —
  kompetensi_awal:    '', // String  — Kemampuan prasyarat murid
  profil_pancasila:   [], // Array<String>
  target_murid:       '', // String  — "Reguler" | "Berkebutuhan Khusus" | "Cerdas Berbakat"

  // — TUJUAN —
  tujuan: {
    capaian_pembelajaran:   '', // String  — Elemen CP yang dituju
    id_tp:                  '', // String  — Referensi ke ATP
    tujuan_pembelajaran:    '', // String  — "Murid dapat ..."
    pemahaman_bermakna:     '', // String  — Manfaat nyata bagi murid
    pertanyaan_pemantik:    [], // Array<String>  — Pertanyaan pembuka (≥2)
  },

  // — MEDIA & ALAT BAHAN —
  media_ajar: {
    alat_dan_bahan: [
      {
        nama:       '', // String  — cth: "Kartu Pecahan"
        jumlah:     '', // String  — cth: "1 set/kelompok"
        keterangan: '', // String
      }
    ],
    sumber_belajar: [], // Array<String>  — Buku, video, website
    tautan_media:   [], // Array<String>  — Link video, gambar interaktif
  },

  // — LANGKAH KEGIATAN —
  langkah_kegiatan: {
    pendahuluan: [], // Array<String>  — Aktivitas pembuka
    inti:        [], // Array<String>  — Aktivitas utama
    penutup:     [], // Array<String>  — Aktivitas penutup & refleksi
    durasi: {
      pendahuluan_menit: 0, // Number
      inti_menit:        0, // Number
      penutup_menit:     0, // Number
    },
  },

  // — DIFERENSIASI —
  diferensiasi: {
    strategi_konten:  '', // String  — Penyesuaian isi materi
    strategi_proses:  '', // String  — Penyesuaian cara belajar
    strategi_produk:  '', // String  — Penyesuaian hasil karya
    belum_mencapai:   '', // String  — Langkah untuk murid yang belum mencapai TP
    sudah_mencapai:   '', // String  — Langkah untuk murid yang sudah mencapai TP
    melampaui:        '', // String  — Tantangan untuk murid yang melampaui TP
  },

  // — PENILAIAN —
  rencana_penilaian: {
    diagnostik:   '', // String  — Teknik penilaian awal
    formatif:     '', // String  — Teknik selama proses belajar
    sumatif:      '', // String  — Teknik penilaian akhir unit
  },

  // — REFLEKSI —
  refleksi_guru:   [], // Array<String>  — Pertanyaan refleksi untuk guru
  refleksi_murid:  [], // Array<String>  — Pertanyaan refleksi untuk murid

  // — LAMPIRAN LKPD —
  lampiran_lkpd: [
    {
      judul_lkpd:       '', // String
      petunjuk_umum:    '', // String
      soal_atau_tugas:  [], // Array<String>
    }
  ],

  // — LAMPIRAN BACAAN —
  bahan_bacaan_murid: '',  // String  — Teks/materi bacaan pendek
  bahan_bacaan_guru:  '',  // String  — Latar belakang materi untuk guru

  daftar_istilah: [
    {
      istilah:    '', // String
      penjelasan: '', // String
    }
  ],

  daftar_buku_referensi: [
    {
      judul:      '', // String
      pengarang:  '', // String
      penerbit:   '', // String
      tahun:      '', // String
    }
  ],

  dibuat_pada:  null, // Date
  diubah_pada:  null, // Date
};

// ── 7. KKTP (KRITERIA KETERCAPAIAN TUJUAN PEMBELAJARAN) ──────

export const skemaKKTP = {
  id_kktp:            '',     // String
  id_sekolah:         '',     // String
  id_guru:            '',     // String
  mata_pelajaran:     '',     // String
  kelas:              '',     // String
  semester:           '',     // String
  tahun_pelajaran:    '',     // String

  daftar_kktp: [
    {
      id_tp:              '', // String  — Referensi ke ATP
      tujuan_pembelajaran: '', // String

      indikator_tuntas: [], // Array<String>  — Daftar indikator pencapaian TP

      rentang_nilai: {
        perlu_bimbingan:  { min: 0,  max: 60,  label: 'Perlu Bimbingan',  kode: 'D' }, // Object
        cukup:            { min: 61, max: 70,  label: 'Cukup',            kode: 'C' }, // Object
        baik:             { min: 71, max: 85,  label: 'Baik',             kode: 'B' }, // Object
        sangat_baik:      { min: 86, max: 100, label: 'Sangat Baik',      kode: 'A' }, // Object
      },

      teknik_penilaian: '', // String  — "Tes Tertulis" | "Observasi" | "Portofolio" | dll
      keterangan:       '', // String
    }
  ],

  dibuat_pada:  null, // Date
  diubah_pada:  null, // Date
};
