window.PustakawanModules = window.PustakawanModules || {};

window.PustakawanModules['sirkulasi_layanan'] = {
  id: 'sirkulasi_layanan',
  title: 'Sirkulasi & Logbook Pengguna',
  icon: '🔄',
  desc: 'Pusat operasional harian: Pendaftaran Anggota, Jurnal Peminjaman/Pengembalian, dan Buku Tamu Perpustakaan.',
  items: [
    {
      id: 'keanggotaan_pemustaka',
      nama: 'Database Keanggotaan',
      icon: '🪪',
      components: [
        { id: 'identitas_anggota', label: 'NISN / NIP, Nama Lengkap, & Kelas', type: 'textarea' },
        { id: 'status_blokir', label: 'Status Kartu (Aktif / Diblokir sementara karena denda)', type: 'textarea' }
      ],
      ai_prompt: "Sebagai Petugas Front-Desk Registrasi. Tata lalu lintas pengguna layanan peminjaman ini.\n\nInstruksi Akun Pemustaka:\nFormat identitas *raw* ini: {{identitas_anggota}} menjadi format ID Card Perpustakaan yang siap cetak.\nBila ada status blokir (black-list) pada input: {{status_blokir}}, bangun sebuah kalimat peringatan gantung hak pinjam yang humanis agar anak tidak ketakutan masuk perpustakaan lagi."
    },
    {
      id: 'jurnal_sirkulasi',
      nama: 'Logbook Sirkulasi (Pinjam-Kembali)',
      icon: '📤',
      components: [
        { id: 'log_transaksi', label: 'Tgl Transaksi, Tgl Kembali Berdasar Sistem, Judul Buku', type: 'textarea' },
        { id: 'status_denda', label: 'Catatan Keterlambatan Pengembalian / Kesepakatan Denda (Uang/Ganti Buku baru)', type: 'textarea' }
      ],
      ai_prompt: "Berperanlah sebagai Penegak Aturan Sirkulasi. Validasi durasi pinjam-kembali buku aset negara.\n\nTugas Verifikasi Log:\n1. PENCATATAN AKURAT: Format coretan transaksi pinjaman ini: {{log_transaksi}} menjadi log tabel memanjang yang rapi.\n2. NEGOSIASI DENDA: Susun berita acara/perjanjian pelunasan ganti rugi (apabila buku hilang atau sangat terlambat) yang mendidik dan membebani moral positif bukan finansial berdasar keluhan ini: {{status_denda}}."
    },
    {
      id: 'buku_tamu_statistik',
      nama: 'Buku Tamu Kunjungan Harian',
      icon: '🚪',
      components: [
        { id: 'tamu_harian', label: 'Daftar Kunjungan Hari Ini (Nama, Kelas, Alasan Kunjung)', type: 'textarea' },
        { id: 'tren_bacaan', label: 'Buku/Topik yang Sedang Laris Dicari Anak (Trending Topic)', type: 'textarea' }
      ],
      ai_prompt: "Sebagai Ahli Analitik Data Pengguna (User-Experience). Cerna daftar pengunjung (Traffic) harian ini.\n\nTugas Laporan Statistik:\nRangkum dominasi jumlah dan alasan absen masuk siswa (apakah buat tidur, buat ngerjakan tugas, atau baca mandiri) dari draf buku tamu siang ini: {{tamu_harian}}.\nKeluarkan kesimpulan prediktif *Trending Buku* masa kini dari perilaku baca mereka merujuk input: {{tren_bacaan}} lalu sarankan judul/jenis buku apa yang harus segera dibeli Kepsek bulan depan agar keramaian (traffic) perpustakaan kita tidak sepi."
    }
  ]
};
