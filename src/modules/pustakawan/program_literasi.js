window.PustakawanModules = window.PustakawanModules || {};

window.PustakawanModules['program_literasi'] = {
  id: 'program_literasi',
  title: 'Program Inklusif Literasi (Deep Learning)',
  icon: '💡',
  desc: 'Rekaman kampanye harian GLS (Gerakan Literasi Sekolah), Katalog Tematik bantuan, dan Pemilihan Duta Baca.',
  items: [
    {
      id: 'logbook_gls',
      nama: 'Jurnal Gerakan Literasi Sekolah (GLS)',
      icon: '📖',
      components: [
        { id: 'aktivitas_harian_gls', label: 'Jadwal 15 Menit Pagi, Kelas Sasaran, & Hasil Resume Anak', type: 'textarea' },
        { id: 'evaluasi_minat', label: 'Evaluasi Minat / Hambatan Membaca Pagi di Kelas', type: 'textarea' }
      ],
      ai_prompt: "Sebagai Pegiat Budaya Literasi Nasional. Rangkum keringat Anda membumikan budaya baca pagi.\n\nFokus Kampanye Literasi (GLS):\n1. LOG HARIAN: Buat paragraf pelaporan singkat namun membara (menginspirasi) mengenai bagaimana jalannya waktu emas 15 menit kegiatan membaca anak pagi ini berbekal catatan: {{aktivitas_harian_gls}}.\n2. ANALISIS DEVIASI: Terangkan jujur apakah anak mengantuk atau bosan saat sesi GLS pagi ini: {{evaluasi_minat}} dan temukan *problem-solving* taktis."
    },
    {
      id: 'database_referensi_proyek',
      nama: 'Katalog Tematik Bantuan Belajar (Kokurikuler)',
      icon: '🔍',
      components: [
        { id: 'tema_P5_kelas', label: 'Proyek Apa yang Sedang Dikerjakan Guru Kelas/Fasil? (Misal: Ekosistem Hijau)', type: 'textarea' },
        { id: 'kurasi_referensi', label: 'Pemilahan Referensi Penunjang Proyek dari Stok Perpustakaan', type: 'textarea' }
      ],
      ai_prompt: "Berperanlah sebagai 'Knowledge Navigator' (Mitra Strategis Guru). Modul ini membuktikan bahwa Pustakawan bukan sekadar penjaga laci.\n\nTugas Dukungan Riset P5:\n1. ANALISIS KEBUTUHAN PROYEK: Ekstrak tema yang sedang diobrak-abrik kelas bersangkutan: {{tema_P5_kelas}}.\n2. PEMBUATAN BUNDEL LITERATUR (BOOK-KIT): Ciptakan sebuah senarai Katalog Tematik (Daftar Pustaka Berjalan). Susun daftar referensi yang relevan secara tajam dari stok koleksi kita ini: {{kurasi_referensi}} lalu buat format Surat Jalan (Cover Letter) resmi agar kumpulan buku ini bisa diantar ke ruang kelas yang dituju besok pagi."
    },
    {
      id: 'penghargaan_literasi',
      nama: 'Buku Apresiasi & Penghargaan',
      icon: '🏆',
      components: [
        { id: 'nominasi_pembaca', label: 'Daftar Nominasi "Raja/Ratu Baca Bulan Ini"', type: 'textarea' },
        { id: 'reward_sertifikat', label: 'Draft Pembuatan Ucapan Selamat / Isi Sertifikat Lomba Baca', type: 'textarea' }
      ],
      ai_prompt: "Tugas Anda adalah memicu kompetisi positif (Gamification) melalui apresiasi membaca.\n\nTugas Pengumuman Nominasi: \nBuat format surat pengumuman formal di mading perpustakaan yang mengokohkan nama para juara peraih pinjaman terbanyak bulan ini dari input nominasi: {{nominasi_pembaca}}.\nBuatkan pula narasi teks (Bukan sekadar 'Selamat') yang membesarkan hati (Pujian Intelektual) untuk di-copy paste ke dalam kolom desain sertifikat berdasar gagasan apresiatif ini: {{reward_sertifikat}}."
    }
  ]
};
