/**
 * =============================================================
 * CIMEGA SMART OFFICE — Modul Guru
 * FILE    : penilaian.js
 * MODUL   : Penilaian, Asesmen & Evaluasi
 * STANDAR : Kurikulum Merdeka (SD)
 * =============================================================
 *
 * Mencakup:
 *  1. Kisi-Kisi Soal
 *  2. Bank Soal & Kunci Jawaban
 *  3. Daftar Nilai Murid
 *  4. Analisis Hasil Penilaian
 *  5. Remedial & Pengayaan
 *  6. Portofolio Murid
 *  7. Legger Nilai (Rekap Semua Mapel)
 * =============================================================
 */

// ── KONSTANTA REFERENSI ──────────────────────────────────────

export const BENTUK_SOAL = ['Pilihan Ganda', 'Isian Singkat', 'Uraian', 'Benar/Salah', 'Menjodohkan'];

export const LEVEL_KOGNITIF = [
  { kode: 'C1', label: 'Mengingat' },
  { kode: 'C2', label: 'Memahami' },
  { kode: 'C3', label: 'Menerapkan' },
  { kode: 'C4', label: 'Menganalisis' },
  { kode: 'C5', label: 'Mengevaluasi' },
  { kode: 'C6', label: 'Mencipta' },
];

export const JENIS_PENILAIAN = {
  DIAGNOSTIK:  'Diagnostik',   // Sebelum pembelajaran dimulai
  FORMATIF:    'Formatif',     // Selama proses pembelajaran
  SUMATIF:     'Sumatif',      // Akhir unit atau semester
};

export const STATUS_KETUNTASAN = {
  TUNTAS:   { label: 'Tuntas',   warna: '#22c55e' },
  REMEDIAL: { label: 'Remedial', warna: '#ef4444' },
  PENGAYAAN:{ label: 'Pengayaan',warna: '#8b5cf6' },
};

// ── 1. KISI-KISI SOAL ────────────────────────────────────────

export const skemaKisiKisi = {
  id_kisi_kisi:       '',     // String
  id_sekolah:         '',     // String
  id_guru:            '',     // String
  mata_pelajaran:     '',     // String
  kelas:              '',     // String
  semester:           '',     // String
  tahun_pelajaran:    '',     // String
  jenis_penilaian:    '',     // String  — "Formatif" | "Sumatif" | "Diagnostik"
  jenis_ujian:        '',     // String  — "Harian" | "PTS" | "PAS" | "PAT"
  alokasi_waktu:      '',     // String  — cth: "90 menit"

  daftar_kisi: [
    {
      no_urut:          0,  // Number
      id_tp:            '', // String  — Referensi ke ATP
      tujuan_pembelajaran: '', // String
      materi_pokok:     '', // String
      indikator_soal:   '', // String  — "Disajikan ..., murid dapat ..."
      bentuk_soal:      '', // String  — "Pilihan Ganda" | "Isian Singkat" | dst
      level_kognitif:   '', // String  — "C1" hingga "C6"
      nomor_soal:       0,  // Number  — Nomor soal pada naskah ujian
      bobot_skor:       0,  // Number  — Bobot/poin soal ini
    }
  ],

  total_soal:         0,    // Number
  total_bobot:        0,    // Number  — Harus = 100
  dibuat_pada:        null, // Date
  diubah_pada:        null, // Date
};

// ── 2. BANK SOAL & KUNCI JAWABAN ─────────────────────────────

export const skemaBankSoal = {
  id_bank_soal:       '',     // String
  id_sekolah:         '',     // String
  id_guru:            '',     // String
  mata_pelajaran:     '',     // String
  kelas:              '',     // String
  fase:               '',     // String
  id_kisi_kisi:       '',     // String  — Referensi ke kisi-kisi (opsional)

  daftar_soal: [
    {
      id_soal:          '', // String   — ID unik per soal
      no_urut:          0,  // Number
      id_tp:            '', // String   — Referensi ke TP terkait
      bentuk_soal:      '', // String   — "Pilihan Ganda" | "Isian" | "Uraian"
      level_kognitif:   '', // String   — "C1" - "C6"
      materi_pokok:     '', // String

      // Pertanyaan (bisa teks biasa atau deskripsi gambar)
      teks_pertanyaan:  '', // String   — Narasi soal
      gambar_soal:      '', // String   — URL/path gambar (opsional)

      // Untuk soal Pilihan Ganda
      pilihan_jawaban: [
        { kode: 'A', teks: '' }, // Object
        { kode: 'B', teks: '' }, // Object
        { kode: 'C', teks: '' }, // Object
        { kode: 'D', teks: '' }, // Object
      ],

      kunci_benar:      '', // String   — "A" | "B" | "C" | "D" atau teks jawaban
      pedoman_skor:     '', // String   — Rubrik / pedoman penilaian uraian
      bobot_skor:       0,  // Number   — Poin maksimal soal ini

      // Metadata bank soal
      tingkat_kesulitan: '', // String  — "Mudah" | "Sedang" | "Sulit"
      tags:             [],  // Array<String>  — Label untuk filter soal
      dipakai_ujian:    [],  // Array<String>  — ID ujian yang pernah memakai soal ini
    }
  ],

  dibuat_pada:  null, // Date
  diubah_pada:  null, // Date
};

// Schema satu naskah ujian lengkap
export const skemaNaskahUjian = {
  id_ujian:         '',   // String
  id_sekolah:       '',   // String
  id_guru:          '',   // String
  id_kisi_kisi:     '',   // String  — Referensi
  mata_pelajaran:   '',   // String
  kelas:            '',   // String
  semester:         '',   // String
  tahun_pelajaran:  '',   // String
  jenis_ujian:      '',   // String  — "Harian" | "PTS" | "PAS"
  tanggal_ujian:    '',   // String
  alokasi_waktu:    '',   // String
  petunjuk_umum:    [],   // Array<String>  — Petunjuk pengerjaan
  daftar_id_soal:   [],   // Array<String>  — Urutan ID soal yang dipakai
  total_soal:       0,    // Number
  total_bobot:      0,    // Number
  dibuat_pada:      null, // Date
};

// ── 3. DAFTAR NILAI MURID ────────────────────────────────────

export const skemaNilaiMurid = {
  id_nilai:           '',     // String
  id_sekolah:         '',     // String
  id_guru:            '',     // String
  id_rombel:          '',     // String
  nama_kelas:         '',     // String
  mata_pelajaran:     '',     // String
  semester:           '',     // String
  tahun_pelajaran:    '',     // String

  daftar_nilai: [
    {
      id_murid:         '', // String
      nama:             '', // String
      nisn:             '', // String
      no_urut:          0,  // Number

      // Nilai Formatif (Harian / Proses)
      nilai_formatif: [
        {
          id_tp:      '', // String   — TP yang dinilai
          tanggal:    '', // String
          jenis:      '', // String   — "Observasi" | "Kuis" | "LKPD" | "Presentasi"
          nilai:      0,  // Number   — 0–100
          keterangan: '', // String
        }
      ],
      rata_nilai_formatif: 0, // Number  — Dihitung otomatis

      // Nilai Sumatif (Per unit / PTS / PAS)
      nilai_sumatif: [
        {
          id_ujian:   '', // String   — Referensi ke naskah ujian
          jenis:      '', // String   — "Sumatif Lingkup Materi" | "PTS" | "PAS"
          tanggal:    '', // String
          nilai:      0,  // Number
        }
      ],
      rata_nilai_sumatif: 0, // Number

      // Nilai akhir untuk rapor
      nilai_akhir_rapor:  0,  // Number  — Gabungan formatif & sumatif
      predikat:           '', // String  — "A" | "B" | "C" | "D"
      deskripsi_rapor:    '', // String  — Narasi untuk rapor (bisa dibantu AI)
    }
  ],

  dibuat_pada:  null, // Date
  diubah_pada:  null, // Date
};

// ── 4. ANALISIS HASIL PENILAIAN ──────────────────────────────

export const skemaAnalisisPenilaian = {
  id_analisis:        '',     // String
  id_sekolah:         '',     // String
  id_ujian:           '',     // String  — Referensi ke naskah ujian
  id_rombel:          '',     // String
  nama_kelas:         '',     // String
  mata_pelajaran:     '',     // String
  tanggal_analisis:   '',     // String

  hasil_per_murid: [
    {
      id_murid:         '', // String
      nama:             '', // String
      skor_per_nomor:   [], // Array<Number>  — Skor tiap soal [2, 0, 1, 2, ...]
      total_skor:       0,  // Number
      nilai_akhir:      0,  // Number  — Dikonversi ke skala 100
      status:           '', // String  — "Tuntas" | "Remedial" | "Pengayaan"
      soal_salah:       [], // Array<Number>  — Nomor soal yang dijawab salah
      keterangan:       '', // String
    }
  ],

  // Analisis per soal
  analisis_soal: [
    {
      nomor_soal:     0,    // Number
      jumlah_benar:   0,    // Number  — Murid yang menjawab benar
      jumlah_salah:   0,    // Number
      persen_benar:   0,    // Number  — Persentase ketuntasan soal ini
      kategori:       '',   // String  — "Mudah" | "Sedang" | "Sulit"
    }
  ],

  // Statistik kelas
  statistik_kelas: {
    nilai_tertinggi:  0, // Number
    nilai_terendah:   0, // Number
    nilai_rata_rata:  0, // Number
    jumlah_tuntas:    0, // Number
    jumlah_remedial:  0, // Number
    persen_ketuntasan: 0, // Number  — Persentase murid yang tuntas
  },

  rekomendasi_tindak_lanjut: '', // String  — Saran untuk guru (bisa dibantu AI)
  dibuat_pada: null, // Date
};

// ── 5. REMEDIAL & PENGAYAAN ──────────────────────────────────

export const skemaRemedialPengayaan = {
  id_kegiatan:        '',     // String
  id_sekolah:         '',     // String
  id_guru:            '',     // String
  id_rombel:          '',     // String
  mata_pelajaran:     '',     // String
  semester:           '',     // String
  tahun_pelajaran:    '',     // String
  tanggal_pelaksanaan: '',    // String  — Format "YYYY-MM-DD"
  jenis:              '',     // String  — "Remedial" | "Pengayaan"

  daftar_peserta: [
    {
      id_murid:         '', // String
      nama:             '', // String
      id_tp:            '', // String   — TP yang menjadi fokus
      materi_fokus:     '', // String   — Materi yang perlu diulang/diperdalam
      nilai_awal:       0,  // Number   — Nilai sebelum remedial/pengayaan
      metode_yang_dipakai: '', // String — cth: "Tutor Sebaya", "Latihan Mandiri"
      nilai_akhir:      0,  // Number   — Nilai setelah remedial/pengayaan
      status_lulus:     false, // Boolean — true = lulus KKTP setelah remedial
      catatan_guru:     '', // String
    }
  ],

  ringkasan_kegiatan: '', // String  — Deskripsi singkat kegiatan
  dibuat_pada:  null,     // Date
  diubah_pada:  null,     // Date
};

// ── 6. PORTOFOLIO MURID ──────────────────────────────────────

export const skemaPortofolio = {
  id_portofolio:      '',     // String
  id_sekolah:         '',     // String
  id_murid:           '',     // String
  nama_murid:         '',     // String
  id_rombel:          '',     // String
  nama_kelas:         '',     // String
  semester:           '',     // String
  tahun_pelajaran:    '',     // String

  koleksi_karya: [
    {
      id_karya:         '',   // String
      tanggal:          '',   // String   — Tanggal karya dibuat / dikumpulkan
      mata_pelajaran:   '',   // String
      id_tp:            '',   // String   — TP yang terkait
      nama_tugas:       '',   // String   — Judul/nama tugas/karya
      deskripsi:        '',   // String   — Deskripsi singkat karya
      link_file:        '',   // String   — URL Google Drive / Firebase Storage
      jenis_file:       '',   // String   — "Dokumen" | "Gambar" | "Video" | "Audio"
      feedback_guru:    '',   // String   — Komentar / catatan dari guru
      nilai_karya:      0,    // Number   — Nilai karya ini (jika dinilai)
    }
  ],

  deskripsi_perkembangan: '', // String  — Narasi perkembangan murid secara keseluruhan
  dibuat_pada:  null,         // Date
  diubah_pada:  null,         // Date
};

// ── 7. LEGGER NILAI (REKAP SEMUA MAPEL) ─────────────────────

export const skemaLegger = {
  id_legger:          '',     // String
  id_sekolah:         '',     // String
  id_rombel:          '',     // String
  nama_kelas:         '',     // String
  semester:           '',     // String
  tahun_pelajaran:    '',     // String

  rekap_semua_mapel: [
    {
      id_murid:         '', // String
      nama:             '', // String
      nisn:             '', // String
      no_urut:          0,  // Number
      jenis_kelamin:    '', // String  — "L" | "P"

      // Nilai tiap mata pelajaran
      nilai_per_mapel: [
        {
          mata_pelajaran: '', // String
          nilai_akhir:    0,  // Number  — Nilai angka
          predikat:       '', // String  — "A" | "B" | "C" | "D"
        }
      ],

      rata_rata:          0,  // Number  — Rata-rata semua mapel
      peringkat:          0,  // Number  — Peringkat di kelas
      jumlah_hadir:       0,  // Number  — Total hari hadir semester ini
      jumlah_sakit:       0,  // Number
      jumlah_izin:        0,  // Number
      jumlah_alpa:        0,  // Number
      catatan_kenaikan:   '', // String  — "Naik Kelas" | "Tidak Naik" | "Lulus"
    }
  ],

  diketahui_kepsek:   '', // String
  dibuat_pada:        null, // Date
  diubah_pada:        null, // Date
};
