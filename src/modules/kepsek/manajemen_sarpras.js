window.KepsekModules = window.KepsekModules || {};

window.KepsekModules['manajemen_sarpras'] = {
  id: 'manajemen_sarpras',
  title: 'Manj. Operasional & Sarpras',
  icon: '🏢',
  desc: 'Pengecekan fasilitas aman serta administrasi pengelolaan kesiswaan makro.',
  items: [
    {
      id: 'admin_sarpras',
      nama: 'Administrasi Sarpras & Inventaris',
      icon: '📦',
      components: [
        { id: 'buku_inventaris', label: 'Ringkasan Buku Inventaris (Tanah, Bangunan, Aset Digital)', type: 'textarea' },
        { id: 'kebutuhan', label: 'Analisis Kebutuhan & Proposal Pengajuan (DAK/BOS)', type: 'textarea' },
        { id: 'penghapusan', label: 'Justifikasi Penghapusan Barang Milik Daerah (Rusak Berat)', type: 'textarea' }
      ],
      ai_prompt: "Tugas Anda adalah sebagai Manajer Aset Negara (Pejabat Pembuat Komitmen). Saya perlu menghasilkan Dokumen Pertanggungjawaban Manajemen Sarana Prasarana Sekolah Tingkat Makro.\n\nKerjakan berdasarkan data mentah berikut:\n1. UPDATE INVENTARIS: Buat paragraf laporan formal mengenai kondisi mutakhir aset sekolah (Tanah, Bangunan, Fasilitas): {{buku_inventaris}}.\n2. PROPOSAL PENGAJUAN (DAK): Rangkum argumentasi teknis mengapa sekolah sangat membutuhkan sarana berikut untuk mendukung kurikulum: {{kebutuhan}}.\n3. BERITA ACARA PENGHAPUSAN: Susun poin-poin justifikasi legal dan teknis mengapa aset berikut harus diputihkan/dihapus dari daftar Barang Milik Daerah: {{penghapusan}}.\n\nFormat laporan harus menggunakan struktur penulisan audit tata graha (Housekeeping Audit) kepemerintahan yang rigid."
    },
    {
      id: 'admin_kesiswaan',
      nama: 'Administrasi Kesiswaan (Makro)',
      icon: '🎓',
      components: [
        { id: 'ppdb', label: 'Metrik & Evaluasi Afirmasi/Zonasi PPDB', type: 'textarea' },
        { id: 'buku_induk', label: 'Laporan Sinkronisasi Buku Induk/Dapodik', type: 'textarea' },
        { id: 'mutasi', label: 'Data Pergerakan Siswa (Mutasi Keluar/Masuk/Lulus)', type: 'textarea' },
        { id: 'kehadiran', label: 'Isu Strategis Kehadiran & Angka Putus Sekolah', type: 'textarea' }
      ],
      ai_prompt: "Sebagai Ahli Manajemen Supervisi Kesiswaan, tolong buatkan ringkasan Laporan Penyelenggaraan Kesiswaan Tingkat Satuan Pendidikan.\n\nInstruksi Struktur Dokumen:\n1. PENERIMAAN PESERTA DIDIK BARU (PPDB): Analisis hasil rekrutmen zonasi/afirmasi dari data ini: {{ppdb}}.\n2. VALIDITAS DATA POKOK: Jelaskan status sinkronisasi antara Buku Induk Fisik dan Dapodik: {{buku_induk}}.\n3. DINAMIKA PERPUTARAN SISWA: Laporkan angka mutasi dan kelulusan tahun ajaran ini secara profesional: {{mutasi}}.\n4. KETAHANAN SISWA (STUDENT RETENTION): Buat analisis singkat mengenai tingkat kehadiran dan intervensi Kepala Sekolah terkait risiko putus sekolah: {{kehadiran}}.\n\nGunakan bullet points, tonjolkan data sebagai landasan (Evidence-Based), dan tutup dengan kesimpulan kesiswaan."
    }
  ]
};
