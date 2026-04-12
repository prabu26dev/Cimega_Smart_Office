/**
 * =============================================================
 * CIMEGA SMART OFFICE — Modul Guru
 * FILE    : wali_kelas.js
 * MODUL   : Administrasi Wali Kelas
 * STANDAR : Kurikulum Merdeka (SD)
 * =============================================================
 *
 * Mencakup:
 *  1. Buku Induk Kelas (Data Murid Lengkap)
 *  2. Mutasi Murid (Masuk / Keluar)
 *  3. Tata Ruang Kelas (Denah Duduk & Struktur Organisasi)
 *  4. Kesepakatan Kelas
 * =============================================================
 */

// ── KONSTANTA REFERENSI ──────────────────────────────────────

export const JENIS_MUTASI = {
  MASUK:  { label: 'Pindah Masuk',  kode: 'masuk',  warna: '#22c55e' },
  KELUAR: { label: 'Pindah Keluar', kode: 'keluar', warna: '#ef4444' },
};

export const KONDISI_SOSEKBUD = ['Mampu', 'Kurang Mampu', 'Penerima KIP / PIP'];

export const JENIS_KEBUTUHAN_KHUSUS = [
  'Tidak Ada',
  'Tunanetra',
  'Tunarungu',
  'Tunagrahita',
  'Tunadaksa',
  'Kesulitan Belajar (Disleksia / Diskalkulia)',
  'Autisme',
  'ADHD',
  'Lainnya',
];

// ── 1. BUKU INDUK KELAS (DATA MURID LENGKAP) ─────────────────

export const skemaBukuIndukMurid = {
  id_murid:           '',     // String  — ID unik murid
  id_sekolah:         '',     // String  — ID sekolah (multi-tenant)
  id_rombel:          '',     // String  — Referensi rombongan belajar / kelas saat ini

  // — DATA PRIBADI —
  data_pribadi: {
    nama_lengkap:       '', // String
    nama_panggilan:     '', // String
    nisn:               '', // String  — Nomor Induk Siswa Nasional
    nis:                '', // String  — Nomor Induk Siswa (lokal sekolah)
    jenis_kelamin:      '', // String  — "L" | "P"
    tempat_lahir:       '', // String
    tanggal_lahir:      '', // String  — "YYYY-MM-DD"
    agama:              '', // String
    kewarganegaraan:    '', // String  — "WNI" | "WNA"
    anak_ke:            0,  // Number  — Anak ke berapa
    jumlah_saudara:     0,  // Number
    bahasa_sehari_hari: '', // String  — cth: "Indonesia", "Jawa"
    golongan_darah:     '', // String  — "A" | "B" | "AB" | "O"
    kebutuhan_khusus:   '', // String  — Dari JENIS_KEBUTUHAN_KHUSUS
    jarak_rumah_km:     0,  // Number  — Jarak ke sekolah (km)
    waktu_tempuh_menit: 0,  // Number
    moda_transportasi:  '', // String  — "Jalan Kaki" | "Sepeda" | "Kendaraan Umum"
    foto_murid:         '', // String  — URL foto
  },

  // — ALAMAT —
  alamat: {
    jalan:      '', // String
    rt:         '', // String
    rw:         '', // String
    kelurahan:  '', // String
    kecamatan:  '', // String
    kota:       '', // String
    provinsi:   '', // String
    kode_pos:   '', // String
  },

  // — DATA ORANG TUA / WALI —
  data_ayah: {
    nama:         '', // String
    tempat_lahir: '', // String
    tanggal_lahir: '', // String  — "YYYY-MM-DD"
    pendidikan:   '', // String  — "SD" | "SMP" | "SMA" | "D3" | "S1" | dst
    pekerjaan:    '', // String
    penghasilan:  '', // String  — "< 1 Juta" | "1–3 Juta" | "> 3 Juta"
    no_hp:        '', // String
    email:        '', // String
    status:       '', // String  — "Masih Hidup" | "Meninggal"
  },
  data_ibu: {
    nama:         '', // String
    tempat_lahir: '', // String
    tanggal_lahir: '', // String
    pendidikan:   '', // String
    pekerjaan:    '', // String
    penghasilan:  '', // String
    no_hp:        '', // String
    email:        '', // String
    status:       '', // String  — "Masih Hidup" | "Meninggal"
  },
  data_wali: {              // Diisi jika berbeda dengan orang tua kandung
    nama:         '', // String
    hubungan:     '', // String  — "Kakek/Nenek" | "Paman/Bibi" | dst
    pekerjaan:    '', // String
    no_hp:        '', // String
    alamat:       '', // String
  },

  // — DATA MASUK SEKOLAH —
  data_masuk: {
    kelas_masuk:      '', // String  — cth: "Kelas 1"
    tahun_masuk:      '', // String  — Tahun pelajaran saat masuk
    asal_sekolah:     '', // String  — TK / SD asal (jika pindahan)
    nomor_sttb:       '', // String  — Nomor ijazah/STTB asal (jika pindahan)
    tanggal_diterima: '', // String  — Tanggal resmi diterima
  },

  // — STATUS & KONDISI —
  status_aktif:       true,   // Boolean  — true = aktif, false = sudah keluar/lulus
  kondisi_sosekbud:   '',     // String   — Dari KONDISI_SOSEKBUD
  penerima_bantuan:   [],     // Array<String>  — "KIP", "PIP", "BSM", dll
  catatan_kesehatan:  '',     // String   — Riwayat sakit / alergi
  prestasi_akademik:  [],     // Array<String>  — Prestasi yang pernah diraih
  prestasi_non_akademik: [],  // Array<String>  — Kejuaraan, lomba, dll

  dibuat_pada:  null,         // Date
  diubah_pada:  null,         // Date
};

// ── 2. MUTASI MURID ──────────────────────────────────────────

export const skemaMutasiMurid = {
  id_mutasi:            '',   // String
  id_sekolah:           '',   // String
  id_murid:             '',   // String  — Referensi ke buku induk (jika sudah ada)
  nama_murid:           '',   // String
  nisn:                 '',   // String
  jenis_mutasi:         '',   // String  — "masuk" | "keluar"
  tanggal_mutasi:       '',   // String  — "YYYY-MM-DD"
  kelas_yang_dituju:    '',   // String  — Kelas tujuan (untuk mutasi masuk)
  kelas_asal:           '',   // String  — Kelas asal (untuk mutasi keluar)
  alasan_mutasi:        '',   // String  — Alasan kepindahan
  sekolah_asal_tujuan:  '',   // String  — Sekolah asal (masuk) / tujuan (keluar)
  nomor_surat:          '',   // String  — Nomor surat mutasi resmi
  dokumen_pendukung:    [],   // Array<String>  — URL file dokumen
  catatan:              '',   // String  — Keterangan tambahan
  diproses_oleh:        '',   // String  — ID guru / operator yang memproses
  dibuat_pada:          null, // Date
};

// ── 3. TATA RUANG KELAS ──────────────────────────────────────

export const skemaTataRuang = {
  id_tata_ruang:      '',     // String
  id_sekolah:         '',     // String
  id_rombel:          '',     // String
  nama_kelas:         '',     // String
  tahun_pelajaran:    '',     // String
  semester:           '',     // String
  berlaku_mulai:      '',     // String  — "YYYY-MM-DD"

  // — STRUKTUR ORGANISASI KELAS —
  struktur_organisasi: {
    ketua_kelas:        { id_murid: '', nama: '' }, // Object
    wakil_ketua:        { id_murid: '', nama: '' }, // Object
    sekretaris:         { id_murid: '', nama: '' }, // Object
    bendahara:          { id_murid: '', nama: '' }, // Object
    seksi_kebersihan:   [{ id_murid: '', nama: '' }], // Array<Object>
    seksi_keamanan:     [{ id_murid: '', nama: '' }], // Array<Object>
    seksi_kesenian:     [{ id_murid: '', nama: '' }], // Array<Object>
    seksi_olahraga:     [{ id_murid: '', nama: '' }], // Array<Object>
    piket_lainnya:      [], // Array<Object> — Jabatan tambahan bebas
  },

  // — DENAH DUDUK —
  // Layout grid: baris (row) dan kolom (col), dimulai dari 1
  jumlah_baris:       0,      // Number  — Jumlah baris kursi
  jumlah_kolom:       0,      // Number  — Jumlah kolom kursi
  denah_duduk: [
    {
      baris:    0,  // Number  — Posisi baris (1 = paling depan)
      kolom:    0,  // Number  — Posisi kolom (1 = paling kiri)
      id_murid: '', // String  — ID murid yang duduk di posisi ini (kosong = bangku kosong)
      nama:     '', // String  — Nama murid
      keterangan: '', // String — cth: "Murid berkebutuhan khusus"
    }
  ],

  // — POSISI FASILITAS —
  posisi_papan_tulis: '', // String  — "Depan" | "Belakang" | "Samping Kiri"
  posisi_meja_guru:   '', // String
  catatan_denah:      '', // String  — Alasan penyusunan tempat duduk

  dibuat_pada:  null, // Date
  diubah_pada:  null, // Date
};

// ── 4. KESEPAKATAN KELAS ─────────────────────────────────────

export const skemaKesepakatanKelas = {
  id_kesepakatan:     '',     // String
  id_sekolah:         '',     // String
  id_rombel:          '',     // String
  nama_kelas:         '',     // String
  tahun_pelajaran:    '',     // String
  tanggal_dibuat:     '',     // String  — Tanggal kesepakatan disepakati bersama
  proses_pembuatan:   '',     // String  — Deskripsi bagaimana aturan ini dibuat bersama

  // — DAFTAR ATURAN / KESEPAKATAN —
  daftar_aturan: [
    {
      no_urut:              0,  // Number
      aturan:               '', // String  — Narasi aturan yang disepakati
      kategori:             '', // String  — "Kebersihan" | "Disiplin" | "Sopan Santun" | dst
      konsekuensi_positif:  '', // String  — Reward jika dipatuhi
      konsekuensi_negatif:  '', // String  — Tindak lanjut jika dilanggar
    }
  ],

  // — HAK MURID —
  hak_murid: [], // Array<String>  — Hak-hak yang juga disepakati murid

  // — TANDA TANGAN DIGITAL (opsional) —
  disetujui_murid:    true,   // Boolean  — Apakah sudah disetujui semua murid
  disetujui_guru:     true,   // Boolean
  diketahui_kepsek:   '',     // String   — Nama kepala sekolah
  catatan:            '',     // String

  dibuat_pada:  null, // Date
  diubah_pada:  null, // Date
};
