window.GuruPjokModules = window.GuruPjokModules || {};

window.GuruPjokModules['manajemen_lapangan'] = {
  id: 'manajemen_lapangan',
  title: 'Manajemen Lapangan & Inventaris',
  icon: '🏟️',
  desc: 'Pusat tata kelola aset olahraga yang mudah rusak (consumable), kehadiran spesifik PJOK, dan cuaca lapangan.',
  items: [
    {
      id: 'inventaris_olahraga',
      nama: 'Buku Inventaris & Peminjaman Alat',
      icon: '🎾',
      components: [
        { id: 'daftar_aset', label: 'Daftar Alat Konsumabel (Bola, Net, Matras, Kun, dll) & Kondisinya', type: 'textarea' },
        { id: 'log_peminjaman', label: 'Log Aktivitas Peminjaman per Siswa/Rombel', type: 'textarea' },
        { id: 'laporan_kerusakan', label: 'Laporan Kerusakan / Kehilangan Barang', type: 'textarea' }
      ],
      ai_prompt: "Sebagai Staff Gudang Perlengkapan Olahraga Nasional, format ringkasan data inventaris kasar ini menjadi Laporan Mutasi Barang yang logis untuk dipertanggungjawabkan kepada Kepala Sekolah.\n\nTugas Pelaporan Aset:\n1. BUKU INDUK BARANG: Rekapitulasi kondisi kelayakan dan jenis penumpukan inventaris dari sumber ini: {{daftar_aset}}.\n2. LALU LINTAS PEMAKAIAN: Buat ringkasan tingkat frekuensi peminjaman aset ini menindikasikan alat mana yang paling populer dan butuh perawatan ekstra: {{log_peminjaman}}.\n3. BERITA ACARA KEHILANGAN/RUSAK: Tulis draf berita acara penggantian atau serah terima barang pecah belah olahraga ini berdasar keterangan: {{laporan_kerusakan}}."
    },
    {
      id: 'jurnal_lapangan',
      nama: 'Jurnal Mengajar Harian Lapangan',
      icon: '📓',
      components: [
        { id: 'jadwal_materi', label: 'Waktu/Jam, Kelas, & Ruang Lingkup Materi Praktik/Teori', type: 'textarea' },
        { id: 'kondisi_cuaca', label: 'Catatan Cuaca & Status Area Lapangan (Gedung/Outdoor)', type: 'textarea' },
        { id: 'insiden_medis', label: 'Catatan Insiden KBM (Siswa Pingsan/Cedera)', type: 'textarea' }
      ],
      ai_prompt: "Anda ditugaskan sebagai Komandan Regu Instruktur Lapangan. Konversi catatan serabutan ini menjadi Log Jurnal Harian Pelatih yang tegas.\n\nInstruksi Struktur Militeristik-Olaharaga:\nLAPORAN AGENDA: Susun urutan pergerakan KBM antar rombel beserta muatan latihannya: {{jadwal_materi}}.\nANALISIS MEDAN (RISK EVALUATION): Uraikan status tantangan keselamatan akibat cuaca atau medan lapangan yang harus diantisipasi instruktur sebelum mulai berdasar ini: {{kondisi_cuaca}}.\nREKAM MEDIK DARURAT (INCIDENT LOG): Laporkan kejadian cedera, penanganan pertama (P3K) yang dikerahkan, serta status siswa terkini: {{insiden_medis}}."
    },
    {
      id: 'presensi_lintas_kelas',
      nama: 'Presensi / Daftar Hadir PJOK',
      icon: '✅',
      components: [
        { id: 'daftar_siswa', label: 'Nama Siswa berdasarkan Kelompok/Kelas', type: 'textarea' },
        { id: 'absen_medis', label: 'Keterangan Hadir Khusus PJOK (Termasuk Sakit/Alasan Medis tidak Ikut Praktik)', type: 'textarea' }
      ],
      ai_prompt: "Anda bertugas sebagai Admin Ketertiban Jasmani.\nBuat Laporan Presensi Ceklis Harian spesifik jam PJOK berdasarkan nama ini: {{daftar_siswa}}.\nSoroti list anak-anak yang menggunakan justifikasi medis untuk menghindari jam kegiatan fisik; buatkan catatan khusus kepada wali kelas mengklarifikasi kewajaran frekuensi dispensasi medis siswa bersangkutan: {{absen_medis}}."
    }
  ]
};
