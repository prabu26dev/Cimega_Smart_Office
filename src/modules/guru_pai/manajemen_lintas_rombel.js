window.GuruPaiModules = window.GuruPaiModules || {};

window.GuruPaiModules['manajemen_lintas_rombel'] = {
  id: 'manajemen_lintas_rombel',
  title: 'Manajemen Lintas Kelas',
  icon: '📋',
  desc: 'Pusat organisasi agenda KBM harian, dan absen mengajar spesifik mapel agama lintas rombongan belajar.',
  items: [
    {
      id: 'jurnal_lintas_kelas',
      nama: 'Jurnal Mengajar Harian Lintas Kelas',
      icon: '📓',
      components: [
        { id: 'jadwal_kelas', label: 'Waktu/Jam Ke-, Kelas Tertentu (Misal 4A, 5B)', type: 'textarea' },
        { id: 'elemen_materi', label: 'Elemen Materi yang Diajarkan', type: 'textarea' },
        { id: 'absensi_kejadian', label: 'Jumlah Hadir/Absen & Catatan Kejadian (Kendalikan KBM)', type: 'textarea' }
      ],
      ai_prompt: "Sebagai Administrator Mapel Khusus Lintas Kelas, saya memerlukan kompilasi Jurnal Harian Guru PAI yang tersusun kaku untuk diinspeksi oleh Pengawas/Kepala Sekolah.\n\nTolong proses catatan raw (mentah) ini menjadi Jurnal Formal:\n1. AGENDA MENGAJAR: Tata data berikut menjadi tabel/format kronologis yang jelas memisahkan perpindahan antarkelas: {{jadwal_kelas}}.\n2. MUATAN KURIKULUM: Sebutkan materi fokus berlandaskan input: {{elemen_materi}}.\n3. OBSERVASI KLINIK KELAS: Rangkum kejadian penting (seperti anak kehilangan fokus, insiden adab) dan absensi: {{absensi_kejadian}} dalam bahasa laporan profesional."
    },
    {
      id: 'presensi_mapel',
      nama: 'Presensi / Daftar Hadir Mapel PAI',
      icon: '✅',
      components: [
        { id: 'daftar_siswa', label: 'Daftar Nama Siswa Terpisah Tiap Kelas/Rombel', type: 'textarea' },
        { id: 'absen_khusus', label: 'Ceklis Kehadiran Jam Agama & Kendala', type: 'textarea' }
      ],
      ai_prompt: "Anda adalah Guru Pengawas Kehadiran. Buat Format Daftar Kehadiran (Rekap Harian) khusus untuk Mata Pelajaran PAI agar guru wali kelas (Homeroom) juga bisa melihat.\n\nInstruksi Tulis:\nPisahkan nama-nama laporan ini per rombongan belajar (Rombel): {{daftar_siswa}}.\nSajikan rekapitulasi tingkat ketidakhadiran spesifik di jam pelajaran agama (apakah ada indikasi siswa sengaja membolos jam agama?): {{absen_khusus}}."
    }
  ]
};
