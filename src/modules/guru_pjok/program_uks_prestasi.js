window.GuruPjokModules = window.GuruPjokModules || {};

window.GuruPjokModules['program_uks_prestasi'] = {
  id: 'program_uks_prestasi',
  title: 'Program UKS & Prestasi (Ekskul)',
  icon: '🏆',
  desc: 'Pangkalan manajemen operasional tim UKS tingkat sekolah, rekam prestasi kompetisi (O2SN), dan bina olahraga spesifik.',
  items: [
    {
      id: 'admin_uks',
      nama: 'Administrasi Unit Kesehatan Sekolah (UKS)',
      icon: '🏥',
      components: [
        { id: 'jadwal_piketr', label: 'Bagan Struktur UKS & Jadwal Piket Dokter Kecil', type: 'textarea' },
        { id: 'pasien_p3k', label: 'Buku Catatan Pasien UKS (Tindakan P3K yang Diberikan)', type: 'textarea' },
        { id: 'bias_imunisasi', label: 'Laporan Sinkronisasi Program BIAS dari Puskesmas', type: 'textarea' }
      ],
      ai_prompt: "Berperanlah sebagai Kepala Administrator Unit Pelayanan Kesehatan Sekolah. Tolong konversi dokumentasi klinis ini menjadi Laporan Pertanggungjawaban Bulanan UKS yang representatif.\n\nFokus Dokumen Pelaporan:\n1. AGENDA KEPEGAWAIAN KESEHATAN: Deskripsikan kesiapan kader kesehatan cilik berdasar rotasi ini: {{jadwal_piketr}}.\n2. LOG BUKU MEDIS: Ubah coretan rekam jejak P3K (sakit perut, asma ringan, luka di lutut) menjadi tabel atau narasi laporan penanganan asuhan pertama: {{pasien_p3k}}.\n3. KERJASAMA PUSKESMAS: Buatkan draf Berita Acara Pelaksanaan Imunisasi Massal berlandaskan kesimpulan berikut: {{bias_imunisasi}}."
    },
    {
      id: 'bina_ekskul',
      nama: 'Program Pembinaan Olahraga Pilihan',
      icon: '⚽',
      components: [
        { id: 'silabus_ekskul', label: 'Silabus Latihan Spesifik (Futsal, Bulu Tangkis, Pencak Silat, dsb)', type: 'textarea' },
        { id: 'absensi_atlet', label: 'Daftar Presensi Peserta Ekstrakurikuler', type: 'textarea' },
        { id: 'jurnal_latihan', label: 'Jurnal Agenda Kegiatan Latihan Mingguan', type: 'textarea' }
      ],
      ai_prompt: "Anda adalah Pelatih Kepala Nasional dari cabang olahraga spesifik. Bantu saya yang bertindak sebagai pembina ekskul merestrukturisasi masterplan pengembangan atlet usia dini sekolah.\n\nSusun:\n1. KURIKULUM LATIHAN TERPADU (PERIODISASI): Kembangkan ide kasar silabus berikut menjadi tahapan latihan bermutu (teknik dasar - taktik - fisik - uji coba): {{silabus_ekskul}}.\n2. RETENSI PESERTA: Lakukan kalkulasi persentase dan rangkum tingkat kedisiplinan peserta berlatih: {{absensi_atlet}}.\n3. LOG BOOK PELATIH: Transkripsikan jurnal ini menjadi laporan perkembangan skill individual tiap minggu yang elegan: {{jurnal_latihan}}."
    },
    {
      id: 'prestasi_o2sn',
      nama: 'Bank Data Prestasi & Persiapan O2SN',
      icon: '🥇',
      components: [
        { id: 'profil_bakat', label: 'Data Tabulasi Profil Siswa Berbakat Olahraga', type: 'textarea' },
        { id: 'riwayat_juara', label: 'Riwayat Pendataan Kejuaraan/Piagam Cabang Olahraga', type: 'textarea' }
      ],
      ai_prompt: "Sebagai Ahli Scouting Talent Atlet Republik Indonesia (Pencari Bakat), ciptakan Dokumen Pemetaan Potensi Olahraga Unggulan Sekolah untuk persiapan O2SN.\n\nInstruksi Scouting Laporan:\n1. MANAJEMEN TALENTA: Rangkum rekam antropometri, insting bermain (game sense), dan level disiplin calon atlet pilar sekolah kita: {{profil_bakat}}.\n2. KLAIM PRESTIGIOSITAS: Gubah pangkalan data piala/piagam berikut menjadi Paragraf Prestasi Hebat (*Bragging Paragraph*) sebagai bahan pamflet PPDB atau laporan pengawas: {{riwayat_juara}}."
    }
  ]
};
