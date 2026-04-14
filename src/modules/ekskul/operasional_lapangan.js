window.EkskulModules = window.EkskulModules || {};

window.EkskulModules['operasional_lapangan'] = {
  id: 'operasional_lapangan',
  title: 'Operasional & Lapangan',
  icon: '🏟️',
  desc: 'Pusat jurnal aktual lapangan harian, pelaporan SOP Keselamatan, dan jejak inventaris/peminjaman alat sekolah.',
  items: [
    {
      id: 'jurnal_latihan_lapangan',
      nama: 'Jurnal Kegiatan Latihan (Logbook)',
      icon: '📓',
      components: [
        { id: 'realisasi_materi', label: 'Materi Aktual Hari Ini (Beda dengan Silabus karena cuaca/dll)', type: 'textarea' },
        { id: 'catatan_insiden', label: 'Catatan Perkembangan Khusus atau Insiden Lapangan', type: 'textarea' }
      ],
      ai_prompt: "Sebagai Pelatih Kepala di Lapangan. Rangkum dinamika latihan hari ini secara faktual.\n\nTugas Logbook Pelatihan:\n1. DEVIASI SILABUS: Buat laporan deskriptif mengenai materi aktual yang dieksekusi hari ini dan mengapa itu bermanuver (Misal pindah ruang kelas karena badai) berdasar input: {{realisasi_materi}}.\n2. CATATAN SITUASIONAL: Laporkan jika ada insiden kecil (cedera ringan atau ada siswa yang berkelahi) serta penanganannya, atau sebaliknya, catat unjuk bakat siswa yang mencolok mata Anda hari ini dari data: {{catatan_insiden}}."
    },
    {
      id: 'buku_inventaris_alat',
      nama: 'Buku Inventaris & Peminjaman Alat',
      icon: '⚽',
      components: [
        { id: 'daftar_aset_ekskul', label: 'Aset Sekolah untuk Ekskul (Tenda, Kompas, Bola, Kanvas)', type: 'textarea' },
        { id: 'log_peminjaman', label: 'Log Keluar-Masuk Alat & Kondisi Barang (Rusak/Hilang)', type: 'textarea' }
      ],
      ai_prompt: "Anda ditugaskan sebagai Quartermaster (Bagian Logistik & Peralatan). Evaluasi kerugian dan stok aset.\n\nInstruksi Audit Aset:\nCocokkan kuantitas dan nilai umur fungsional barang berdasar daftar alat ini: {{daftar_aset_ekskul}}.\nEvaluasi tingkat kelalaian peminjam (Siswa) atas laporan barang rusak/kempes/hilang dari log pengembalian: {{log_peminjaman}}, dan buatkan rekomendasi pengadaan/pembelian alat baru ke bendahara untuk bulan depan."
    },
    {
      id: 'sop_keselamatan_lapangan',
      nama: 'Manajemen Keselamatan (SOP)',
      icon: '🛡️',
      components: [
        { id: 'protokol_pemanasan', label: 'Standar Pemanasan & Pengecekan Kotak P3K', type: 'textarea' },
        { id: 'pengawasan_kelompok', label: 'Sistem Pembagian Kelompok Kerja (Agar Terpantau Mudanya)', type: 'textarea' }
      ],
      ai_prompt: "Berperanlah sebagai Petugas Keselamatan (Safety Officer) Ekstrakurikuler. Susun Prosedur Operasi Standar (SOP) Manajemen Risiko (Risk Management).\n\nPeraturan Keselamatan Mengikat:\n1. STANDAR PRA-LATIHAN: Susun wajib poin-poin peregangan otot dan status kotak obat: {{protokol_pemanasan}} sebelum anak diizinkan memegang bola/alat.\n2. RENTANG KENDALI (SPAN OF CONTROL): Buat skema pemecahan kerumunan (Misal 1 kapten mengawasi 5 anggota) agar saat berada di alam bebas tidak ada anak yang tertinggal, merujuk usulan ini: {{pengawasan_kelompok}}."
    }
  ]
};
