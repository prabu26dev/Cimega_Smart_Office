window.TuModules = window.TuModules || {};

window.TuModules['manajemen_inventaris'] = {
  id: 'manajemen_inventaris',
  title: 'Logistik & Inventaris Gudang',
  icon: '📦',
  desc: 'Pangkalan data Kartu Stok barang habis pakai (ATK/Kertas) dan Kartu Inventaris Ruangan (KIR).',
  items: [
    {
      id: 'penerimaan_stok_barang',
      nama: 'Buku Penerimaan & Stok Barang',
      icon: '🛒',
      components: [
        { id: 'barang_masuk', label: 'Tgl Masuk, Asal Barang (Toko/Bantuan BOS), & Jumlah', type: 'textarea' },
        { id: 'pengeluaran_sisa', label: 'Nama Peminta Barang, Tgl Keluar, & Kalkulasi Sisa Stok', type: 'textarea' }
      ],
      ai_prompt: "Sebagai Staff Logistik/Gudang. Rapikan catatan coretan mutasi inventaris barang habis pakai ini.\n\nTugas Inventory Control:\n1. BUKU PENERIMAAN: Tata rapi keterangan asal mula barang ini agar cocok jika kelak diperiksa sinkronisasinya dengan SPJ Bendahara BKU: {{barang_masuk}}.\n2. KARTU KENDALI PENGELUARAN (STOK BARANG): Buat daftar hitam/putih (log book) pergerakan barang yang diminta oleh guru bersangkutan: {{pengeluaran_sisa}} lalu hitungkan secara nalar sisa stok barang (contoh: Masuk 10 rim HVS, keluar 2 rim, sisa 8 rim)."
    },
    {
      id: 'kartu_inventaris_ruangan',
      nama: 'Kartu Inventaris Ruangan (KIR)',
      icon: '🪑',
      components: [
        { id: 'nama_lokasi', label: 'Identitas Ruangan (Misal: Ruang Kelas 1 / Ruang Kepsek)', type: 'textarea' },
        { id: 'aset_ruangan', label: 'Daftar Aset Permanen (Meja, Lemari, Laptop, Pigura)', type: 'textarea' }
      ],
      ai_prompt: "Anda ditugaskan sebagai Aset Manajemen Sekolah tingkat daerah. Buatkan draf cetak Kartu Inventaris Ruangan (KIR) untuk ditempel di tembok.\n\nTugas Tagging Barang: \nSusun tabel rapi form Kartu KIR untuk lokasi: {{nama_lokasi}}.\nRincikan baris demi baris detail barang berdasar draf: {{aset_ruangan}}, dan berikan peringatan untuk menambahkan Nomor Kode Barang Daerah (KIB) pada setiap aset berwujud tersebut."
    }
  ]
};
