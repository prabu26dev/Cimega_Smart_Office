/**
 * =============================================================
 * CIMEGA SMART OFFICE — Modul Operator Sekolah (OPS)
 * FILE    : tata_usaha.js
 * MODUL   : Surat Menyurat & Tata Usaha
 * STANDAR : Tata Naskah Dinas / Permendikbud
 * =============================================================
 *
 * Mencakup:
 *  1. Agenda Surat (Masuk & Keluar)
 *  2. Layanan Surat Keterangan
 *  3. Buku Tamu
 * =============================================================
 */

// ── KONSTANTA REFERENSI ──────────────────────────────────────

export const JENIS_SURAT = {
  MASUK:  { label: 'Surat Masuk',  kode: 'masuk',  warna: '#3b82f6' },
  KELUAR: { label: 'Surat Keluar', kode: 'keluar', warna: '#22c55e' },
};

export const SIFAT_SURAT = [
  'Biasa', 'Penting', 'Segera', 'Rahasia', 'Sangat Rahasia',
];

export const KLASIFIKASI_SURAT = [
  'Surat Dinas Umum',
  'Surat Tugas',
  'Surat Undangan',
  'Surat Edaran',
  'Surat Keputusan (SK)',
  'Surat Pemberitahuan',
  'Surat Permohonan',
  'Surat Keterangan',
  'Surat Pengantar',
  'Nota Dinas',
  'Surat Perintah Perjalanan Dinas (SPPD)',
  'Surat dari Dinas / Kementerian',
  'Surat dari Komite / Orang Tua',
  'Surat dari Lembaga Lain',
];

export const TINDAK_LANJUT_SURAT = [
  'Diarsipkan',
  'Diteruskan ke Kepsek',
  'Diteruskan ke Guru',
  'Diteruskan ke Bendahara',
  'Perlu Balasan',
  'Sudah Ditindaklanjuti',
  'Tidak Perlu Ditindaklanjuti',
];

export const JENIS_SURAT_KETERANGAN = [
  'Surat Keterangan Aktif Sekolah',
  'Surat Keterangan Pindah Sekolah',
  'Surat Keterangan Lulus',
  'Surat Keterangan Tidak Mampu (SKTM)',
  'Surat Keterangan Berkelakuan Baik',
  'Surat Pengantar ke Instansi',
  'Surat Keterangan Masih Sekolah (untuk PIP/KIP)',
  'Surat Keterangan untuk Beasiswa',
  'Surat Izin Kegiatan',
  'Surat Permohonan Dispensasi',
  'Surat Keterangan Juara / Prestasi',
  'Surat Tugas Guru',
  'Surat Jalan / Surat Pengantar Barang',
  'Surat Undangan Wali Murid',
];

export const STATUS_LAYANAN_SURAT = [
  'Diproses', 'Siap Diambil', 'Sudah Diambil', 'Dibatalkan',
];

// ── 1. AGENDA SURAT ──────────────────────────────────────────

export const skemaAgendaSurat = {
  id_agenda:            '',   // String
  id_sekolah:           '',   // String
  tahun_pelajaran:      '',   // String
  semester:             '',   // String

  daftar_surat: [
    {
      id_surat:             '', // String   — ID unik surat
      no_urut:              0,  // Number   — Nomor urut agenda di buku
      jenis:                '', // String   — "masuk" | "keluar"

      // — IDENTITAS SURAT —
      no_surat:             '', // String   — Nomor surat (dari pengirim / yang diterbitkan)
      tgl_surat:            '', // String   — Tanggal tertera di surat (YYYY-MM-DD)
      tgl_diterima:         '', // String   — Tanggal surat diterima (untuk surat masuk)
      tgl_kirim:            '', // String   — Tanggal surat dikirim (untuk surat keluar)

      // — PENGIRIM / PENERIMA —
      instansi_pengirim:    '', // String   — Nama instansi / lembaga pengirim (surat masuk)
      nama_pengirim:        '', // String   — Nama petugas / pejabat pengirim
      instansi_tujuan:      '', // String   — Nama instansi tujuan (surat keluar)
      nama_penerima:        '', // String   — Nama penerima (surat keluar)

      // — ISI & KLASIFIKASI —
      perihal:              '', // String   — Perihal / pokok surat
      isi_ringkas:          '', // String   — Ringkasan isi surat (2–3 kalimat)
      klasifikasi:          '', // String   — Dari KLASIFIKASI_SURAT
      sifat:                '', // String   — Dari SIFAT_SURAT

      // — TINDAK LANJUT —
      tindak_lanjut:        '', // String   — Dari TINDAK_LANJUT_SURAT
      diteruskan_ke:        '', // String   — Nama/jabatan yang menerima disposisi
      catatan_disposisi:    '', // String   — Instruksi/catatan dari Kepsek

      // — DOKUMEN DIGITAL —
      scan_surat:           '', // String   — URL scan / file digital surat
      status_arsip:         '', // String   — "Aktif" | "Inaktif" | "Permanen"

      diinput_oleh:         '', // String   — Nama operator TU
    }
  ],

  total_surat_masuk:    0,    // Number
  total_surat_keluar:   0,    // Number
  dibuat_pada:          null, // Date
  diubah_pada:          null, // Date
};

// ── 2. LAYANAN SURAT KETERANGAN ──────────────────────────────

export const skemaLayananSurat = {
  id_layanan:           '',   // String
  id_sekolah:           '',   // String

  // — JENIS & TUJUAN —
  no_surat_keluar:      '', // String   — Nomor surat yang diterbitkan sekolah
  jenis_surat_keterangan: '', // String — Dari JENIS_SURAT_KETERANGAN
  tujuan_penggunaan:    '', // String   — Keperluan surat cth: "Beasiswa", "Daftar SMP"
  tgl_permohonan:       '', // String   — Tanggal permohonan masuk (YYYY-MM-DD)
  tgl_keluar:           '', // String   — Tanggal surat diterbitkan

  // — PEMOHON —
  jenis_pemohon:        '', // String   — "Siswa" | "Guru" | "Orang Tua" | "Alumni"
  id_pemohon:           '', // String   — Referensi ke id_siswa atau id_guru
  nama_pemohon:         '', // String   — Nama pemohon
  no_kontak_pemohon:    '', // String

  // — DATA UNTUK ISI SURAT —
  // (diisi tergantung jenis surat)
  kelas_siswa:          '', // String   — cth: "Kelas 5A"
  nisn:                 '', // String
  nama_lengkap_siswa:   '', // String
  tgl_lahir_siswa:      '', // String
  nama_ortu:            '', // String
  keterangan_tambahan:  '', // String   — Keterangan spesifik isi surat

  // — TANDA TANGAN & STEMPEL —
  ttd_kepsek:           false, // Boolean — Sudah ditandatangani Kepsek?
  nama_kepsek_ttd:      '',    // String  — Nama Kepsek yang TTD
  stempel_sekolah:      false, // Boolean — Sudah distempel?

  // — STATUS & ARSIP —
  status_layanan:       '', // String   — Dari STATUS_LAYANAN_SURAT
  file_surat_jadi:      '', // String   — URL file surat yang sudah jadi (PDF)
  catatan:              '', // String

  diproses_oleh:    '', // String
  dibuat_pada:      null, // Date
  diubah_pada:      null, // Date
};

// ── 3. BUKU TAMU ─────────────────────────────────────────────

export const skemaBukuTamu = {
  id_buku_tamu:         '',   // String
  id_sekolah:           '',   // String

  daftar_kunjungan: [
    {
      id_kunjungan:         '', // String
      no_urut:              0,  // Number

      // — DATA TAMU —
      nama_tamu:            '', // String   — Nama lengkap tamu
      jenis_kelamin:        '', // String   — "L" | "P"
      instansi_asal:        '', // String   — Instansi / lembaga tamu (isi "-" jika umum)
      jabatan_tamu:         '', // String   — Jabatan di instansinya
      no_kontak:            '', // String   — No HP / email tamu (opsional)

      // — KUNJUNGAN —
      tgl_kunjungan:        '', // String   — "YYYY-MM-DD"
      jam_datang:           '', // String   — cth: "09.00"
      jam_pulang:           '', // String   — cth: "10.30"
      tujuan_kunjungan:     '', // String   — Maksud dan tujuan kedatangan
      yang_dituju:          '', // String   — Nama/jabatan yang ingin ditemui
      hasil_kunjungan:      '', // String   — Ringkasan hasil / capaian

      // — VERIFIKASI IDENTITAS —
      jenis_identitas:      '', // String   — "KTP" | "SIM" | "Kartu Pegawai" | "Surat Tugas"
      no_identitas:         '', // String   — Nomor identitas tamu
      foto_identitas:       '', // String   — URL foto KTP/identitas (opsional)

      // — STATUS —
      tamu_masuk:           false, // Boolean — Apakah diizinkan masuk?
      alasan_ditolak:       '',    // String  — Keterangan jika tidak diizinkan masuk
      dicatat_oleh:         '',    // String  — Nama penjaga / satpam
    }
  ],

  total_kunjungan:      0,    // Number  — Total kunjungan tercatat
  dibuat_pada:          null, // Date
  diubah_pada:          null, // Date
};
