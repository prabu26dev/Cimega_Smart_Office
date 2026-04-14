window.EkskulModules = window.EkskulModules || {};

window.EkskulModules['manajemen_keanggotaan'] = {
  id: 'manajemen_keanggotaan',
  title: 'Keanggotaan & Kehadiran',
  icon: '👥',
  desc: 'Pangkalan data anggota peserta, riwayat medis pendaftaran, buku presensi harian, dan izin orang tua.',
  items: [
    {
      id: 'form_pendaftaran',
      nama: 'Form Pendaftaran & Izin Medis',
      icon: '📝',
      components: [
        { id: 'biodata_kontak', label: 'Biodata Siswa & Kontak Darurat Wali Murid', type: 'textarea' },
        { id: 'riwayat_medis', label: 'Catatan Riwayat Medis / Alergi (Wajib untuk Fisik)', type: 'textarea' },
        { id: 'persetujuan_ortu', label: 'Klausul Persetujuan & Pelepasan Tanggung Jawab Luar Jam', type: 'textarea' }
      ],
      ai_prompt: "Sebagai Admin Kesiswaan Ekstrakurikuler. Rangkai form biodata pendaftar ini menjadi sebuah Pakta Integritas dan *Waiver* (Surat Izin) legal.\n\nTugas Formatting: \n1. RESUME IDENTITAS DARURAT: Rekap biodata dan kontak keluarga dari data: {{biodata_kontak}}.\n2. SCREENING KESEHATAN: Tulis tebal/garis bawahi peringatan keras mengenai riwayat asma/jantung/alergi siswa berdasar aduan: {{riwayat_medis}} agar pelatih berhati-hati.\n3. LEGALITAS LATIHAN SORE: Susun kalimat persetujuan tertulis yang membebaskan sekolah dari tuntutan wajar jika terjadi kecelakaan kecil saat latihan, dari draf: {{persetujuan_ortu}}."
    },
    {
      id: 'buku_induk_ekskul',
      nama: 'Buku Induk Anggota Ekskul',
      icon: '📖',
      components: [
        { id: 'daftar_anggota', label: 'Daftar Nama Anggota, Kelas, & Status Keaktifan', type: 'textarea' },
        { id: 'manajemen_jabatan', label: 'Jabatan Organisasi (Ketua Regu/Kapten/Bendahara)', type: 'textarea' }
      ],
      ai_prompt: "Tugas Anda adalah memetakan hierarki organisasi (Organization Chart) internal siswa.\n\nStruktur Keanggotaan:\nKompilasikan daftar nama anggota aktif berdasarkan draf ini: {{daftar_anggota}}.\nBerikan analisis singkat apakah pembagian jabatan struktural kapten/ketua dari daftar ini: {{manajemen_jabatan}} mampu menunjang pengasahan dimensi Kepemimpinan (Leadership) dan pemerataan tanggung jawab."
    },
    {
      id: 'presensi_latihan',
      nama: 'Buku Presensi Latihan Rutin',
      icon: '✅',
      components: [
        { id: 'rekap_hadir', label: 'Rekap Kehadiran Latihan (Masuk/Izin/Sakit/Alpa)', type: 'textarea' },
        { id: 'persentase_bulanan', label: 'Kalkulasi Persentase Kehadiran Bulanan', type: 'textarea' }
      ],
      ai_prompt: "Sebagai Pelatih Kedisiplinan. Valuasi komitmen siswa lewat jejak absensinya.\n\nAnalisis Komitmen: \nEvaluasi data titik hilang/bolos atau konsistensi kehadiran mereka dari catatan: {{rekap_hadir}}.\nBuat kesimpulan tegas apakah siswa yang berada di bawah ambang batas (contoh dari input persentase: {{persentase_bulanan}}) masih layak untuk diikutkan dalam perlombaan bulan depan atau harus di-skors."
    }
  ]
};
