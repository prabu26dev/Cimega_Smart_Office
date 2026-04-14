window.BendaharaModules = window.BendaharaModules || {};

window.BendaharaModules['pembukuan_kas'] = {
  id: 'pembukuan_kas',
  title: 'Pembukuan Kas (Ledger)',
  icon: '📒',
  desc: 'Pangkalan Buku Kas Umum (BKU), Buku Kas Tunai, Buku Bank, dan Rincian Objek Belanja.',
  items: [
    {
      id: 'buku_kas_umum',
      nama: 'Buku Kas Umum (BKU)',
      icon: '📘',
      components: [
        { id: 'identitas_transaksi', label: 'Tanggal, Nomor Bukti (SPJ), & Uraian Transaksi', type: 'textarea' },
        { id: 'debit_kredit', label: 'Aliran Dana (Penerimaan/Debit & Pengeluaran/Kredit)', type: 'textarea' },
        { id: 'saldo_akhir', label: 'Saldo Akhir Berjalan Rekonsiliasi (Manual)', type: 'textarea' }
      ],
      ai_prompt: "Berperanlah sebagai Akuntan Publik Tersertifikasi (CPA). Validasi dan susun baris entri Ledger Konsolidasi (Buku Kas Umum) ini agar siap cetak.\n\nTugas Pembukuan Kronologis:\n1. STANDARISASI URAIAN: Perbaiki redaksi uraian mentah ini: {{identitas_transaksi}} menjadi gaya bahasa akuntansi pemerintah baku.\n2. BALANCING (KESEIMBANGAN): Teliti alur lalu lintas uang dari: {{debit_kredit}} dan tunjukkan perhitungan *Running Balance* terhadap Saldo Akhir ini: {{saldo_akhir}}. Berikan peringatan Keras jika terjadi defisit fiskal (Saldo Minus/Overdraft)."
    },
    {
      id: 'buku_pembantu_tunai_bank',
      nama: 'Buku Pembantu Kas Tunai & Bank',
      icon: '🏦',
      components: [
        { id: 'jenis_ledger', label: 'Pilih: Buku Tunai (Brankas) ATAU Buku Bank (Giro)', type: 'textarea' },
        { id: 'mutasi_pembantu', label: 'Rincian Mutasi (Masuk/Keluar) Spesifik Jenis Ledger', type: 'textarea' },
        { id: 'rekonsiliasi_bank', label: 'Catatan Rekonsiliasi (Cek Kesesuaian dgn Rekening Koran Bank)', type: 'textarea' }
      ],
      ai_prompt: "Berperanlah sebagai Auditor Bank Internal. Rapikan catatan Buku Pembantu (Sub-Ledger) ini agar uang fisik dan bank *match* 100%.\n\nInstruksi Jurnal:\nBerdasarkan jenis penyimpanan: {{jenis_ledger}}, urutkan log mutasi keuangannya secara rapi: {{mutasi_pembantu}}.\nJika ini adalah Buku Bank, buatlah laporan komparasi validasi (Bank Reconciliation) terhadap selisih yang mungkin terjadi (seperti potongan administrasi atau bunga bank) berdasar keterangan ini: {{rekonsiliasi_bank}}."
    },
    {
      id: 'buku_rincian_objek',
      nama: 'Buku Pembantu Rincian Objek',
      icon: '📦',
      components: [
        { id: 'kategori_belanja', label: 'Kategori: Belanja Pegawai / Barang Jasa / Modal Aset', type: 'textarea' },
        { id: 'rekapitulasi_akun', label: 'Rincian Pengeluaran per Akun Belanja (Misal ATK / Honor)', type: 'textarea' },
        { id: 'sisa_pagu_objek', label: 'Sisa Pagu/Anggaran Khusus Objek Belanja Tersebut', type: 'textarea' }
      ],
      ai_prompt: "Sebagai Staff Financial Controller, pecah akun buku besar (BKU) menjadi Buku Pembantu Rincian Objek spesifik.\n\nTugas Pengklasifikasian Anggaran:\nPastikan alokasi biaya pengeluaran ini: {{rekapitulasi_akun}} diklasifikasikan dengan tepat pada posnya yang absolut: {{kategori_belanja}}.\nBerikan peringatan Dini (Early Warning System) dalam narasi Anda apabila sisa pagu anggaran (budget threshold) sudah menipis: {{sisa_pagu_objek}}."
    }
  ]
};
