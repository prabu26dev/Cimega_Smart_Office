/**
 * =============================================================
 * CIMEGA SMART OFFICE — Modul Guru
 * FILE    : pelaksanaan.js
 * MODUL   : Pelaksanaan Harian
 * STANDAR : Kurikulum Merdeka (SD)
 * =============================================================
 *
 * Mencakup:
 *  1. Absensi Murid (Daftar Hadir Harian)
 *  2. Jurnal Harian Guru
 *  3. Jadwal Pelajaran
 * =============================================================
 */

// ── KONSTANTA STATUS KEHADIRAN ───────────────────────────────

export const STATUS_HADIR = {
  H: { label: 'Hadir',  kode: 'H', warna: '#22c55e' },
  S: { label: 'Sakit',  kode: 'S', warna: '#f59e0b' },
  I: { label: 'Izin',   kode: 'I', warna: '#3b82f6' },
  A: { label: 'Alpa',   kode: 'A', warna: '#ef4444' },
};

export const HARI_SEKOLAH = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];

export const KETERCAPAIAN_TP = [
  { nilai: 'Tercapai',          deskripsi: '≥ 80% murid mencapai TP' },
  { nilai: 'Sebagian Tercapai', deskripsi: '50–79% murid mencapai TP' },
  { nilai: 'Belum Tercapai',    deskripsi: '< 50% murid mencapai TP' },
];

// ── 1. ABSENSI MURID (DAFTAR HADIR HARIAN) ───────────────────

export const skemaAbsensi = {
  id_absensi:         '',     // String  — ID unik dokumen absensi
  id_sekolah:         '',     // String  — ID sekolah (multi-tenant)
  id_guru:            '',     // String  — Guru yang mencatat
  id_rombel:          '',     // String  — Referensi ke rombongan belajar
  nama_kelas:         '',     // String  — cth: "Kelas 4A"
  tanggal:            '',     // String  — Format "YYYY-MM-DD"
  hari:               '',     // String  — "Senin" | "Selasa" | ...
  mata_pelajaran:     '',     // String  — Mata pelajaran saat absensi dicatat
  semester:           '',     // String  — "Ganjil" | "Genap"
  tahun_pelajaran:    '',     // String

  list_kehadiran: [
    {
      id_murid:         '', // String  — Referensi ke data murid
      nama:             '', // String  — Nama lengkap murid
      nisn:             '', // String
      no_urut:          0,  // Number  — Nomor urut absen
      status:           '', // String  — "H" | "S" | "I" | "A"
      keterangan:       '', // String  — cth: "Surat dokter ada"
    }
  ],

  // Rekap otomatis (dihitung dari list_kehadiran)
  rekap: {
    jumlah_hadir:   0, // Number
    jumlah_sakit:   0, // Number
    jumlah_izin:    0, // Number
    jumlah_alpa:    0, // Number
    total_murid:    0, // Number
  },

  catatan_kelas:  '',   // String  — Catatan umum kondisi kelas hari ini
  dibuat_pada:    null, // Date (Timestamp)
  diubah_pada:    null, // Date (Timestamp)
};

// Schema rekap absensi bulanan / per semester
export const skemaRekapAbsensi = {
  id_rekap:         '',     // String
  id_sekolah:       '',     // String
  id_rombel:        '',     // String
  nama_kelas:       '',     // String
  semester:         '',     // String
  tahun_pelajaran:  '',     // String
  periode:          '',     // String  — "Bulan Juli 2024" atau "Semester Ganjil"

  rekap_per_murid: [
    {
      id_murid:   '', // String
      nama:       '', // String
      nisn:       '', // String
      jumlah_hadir: 0, // Number
      jumlah_sakit: 0, // Number
      jumlah_izin:  0, // Number
      jumlah_alpa:  0, // Number
      total_hari:   0, // Number  — Total hari belajar di periode ini
    }
  ],

  dibuat_pada:  null, // Date
};

// ── 2. JURNAL HARIAN GURU ────────────────────────────────────

export const skemaJurnalGuru = {
  id_jurnal:          '',     // String
  id_sekolah:         '',     // String
  id_guru:            '',     // String
  nama_guru:          '',     // String
  id_rombel:          '',     // String
  nama_kelas:         '',     // String

  // — WAKTU —
  tanggal:            '',     // String  — Format "YYYY-MM-DD"
  hari:               '',     // String  — "Senin" dst
  semester:           '',     // String
  tahun_pelajaran:    '',     // String

  // — SLOT PELAJARAN (bisa lebih dari 1 per hari) —
  daftar_sesi: [
    {
      jam_ke:             0,  // Number  — Jam pelajaran ke berapa
      jam_mulai:          '', // String  — cth: "07.30"
      jam_selesai:        '', // String  — cth: "08.05"
      mata_pelajaran:     '', // String
      id_tp:              '', // String  — Referensi ke ATP
      materi_diajarkan:   '', // String  — Topik / materi yang diajarkan hari ini
      metode_yang_dipakai: '', // String — cth: "Diskusi + Tanya Jawab"
      media_yang_dipakai:  '', // String — cth: "Video, Kartu Kata"
      jumlah_hadir:       0,  // Number
      jumlah_tidak_hadir: 0,  // Number
      ketercapaian_tp:    '', // String  — "Tercapai" | "Sebagian Tercapai" | "Belum Tercapai"
    }
  ],

  // — CATATAN UMUM HARI INI —
  catatan_kejadian:   '', // String  — Kejadian penting / insiden hari ini
  hambatan:           '', // String  — Hambatan dalam pembelajaran
  tindak_lanjut:      '', // String  — Rencana perbaikan esok hari
  catatan_khusus_murid: '', // String — Murid yang perlu perhatian hari ini

  // — REFLEKSI (bisa diisi manual atau dibantu AI) —
  refleksi: {
    hal_baik:         '', // String  — Yang berjalan baik hari ini
    hal_diperbaiki:   '', // String  — Yang perlu diperbaiki
    rencana_besok:    '', // String  — Rencana kegiatan esok
  },

  dibuat_pada:  null, // Date
  diubah_pada:  null, // Date
};

// ── 3. JADWAL PELAJARAN ──────────────────────────────────────

export const skemaJadwalPelajaran = {
  id_jadwal:          '',     // String
  id_sekolah:         '',     // String
  id_rombel:          '',     // String
  nama_kelas:         '',     // String
  semester:           '',     // String
  tahun_pelajaran:    '',     // String
  berlaku_mulai:      '',     // String  — Tanggal jadwal mulai berlaku "YYYY-MM-DD"

  // Pengaturan jam sekolah
  jam_masuk:          '',     // String  — cth: "07.00"
  jam_pulang:         '',     // String  — cth: "13.00"

  // Definisi slot waktu (berlaku semua hari)
  slot_waktu: [
    {
      jam_ke:     0,  // Number  — Jam pelajaran ke-1, ke-2, dst
      jam_mulai:  '', // String  — cth: "07.00"
      jam_selesai: '', // String — cth: "07.35"
      is_istirahat: false, // Boolean — true jika slot ini untuk istirahat
      label_istirahat: '', // String — cth: "Istirahat 1", "Makan Siang"
    }
  ],

  // Jadwal per hari
  jadwal_per_hari: [
    {
      hari:   '', // String  — "Senin" | "Selasa" | "Rabu" | "Kamis" | "Jumat"
      aktif:  true, // Boolean — false jika hari itu tidak ada KBM

      slot_kegiatan: [
        {
          jam_ke:         0,  // Number  — Referensi ke slot_waktu
          mata_pelajaran: '', // String  — Nama mapel atau "Pramuka", "Upacara"
          id_guru:        '', // String  — Guru yang mengajar
          nama_guru:      '', // String
          keterangan:     '', // String  — Catatan khusus jika ada
        }
      ],
    }
  ],

  diketahui_kepsek: '',   // String  — Nama kepala sekolah
  dibuat_pada:      null, // Date
  diubah_pada:      null, // Date
};
