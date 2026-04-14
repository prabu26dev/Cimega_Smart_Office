window.BendaharaModules = window.BendaharaModules || {};

window.BendaharaModules['pelaporan_closing'] = {
  id: 'pelaporan_closing',
  title: 'Pelaporan & Closing Bulanan',
  icon: '🗂️',
  desc: 'Penyusunan Berita Acara Pemeriksaan Kas, penutupan saldo bulanan, LRA, dan panduan pengarsipan fisik Ordner SPJ.',
  items: [
    {
      id: 'berita_acara_kas',
      nama: 'BAPK & Register Penutupan Kas',
      icon: '🔐',
      components: [
        { id: 'saldo_komparasi', label: 'Komparasi Saldo BKU, Brankas (Tunai), Giro (Bank), & Pajak', type: 'textarea' },
        { id: 'selisih_kas', label: 'Catatan Selisih Angka (Misal Jasa Giro/Pajak Bank) & Penjelasan', type: 'textarea' },
        { id: 'opname_uang_fisik', label: 'Register Opname Logam/Lertas Fisik Brankas Bulanan', type: 'textarea' }
      ],
      ai_prompt: "Sebagai Ahli Tata Usaha dan Auditor Independen, buatlah Berita Acara Pemeriksaan Kas (BAPK) dan Penutupan Kas yang mengikat secara administratif.\n\nFokus Audit Tutup Buku:\n1. UJI SILANG KAS (CROSS-CHECK): Cocokkan dan tulis kesimpulan apakah angka gabungan Bank+Brankas riil sesuai sempurna (sama nilai) dengan angka di BKU (Aplikasi Arkas) ini: {{saldo_komparasi}}.\n2. PENJELASAN SELISIH: Jika hasil akhir tidak \"Nol Selisih\" akibat jasa bunga bank atau biaya admin, buat justifikasi tulisan resmi mengapa angka tsb tidak sama berdasarkan: {{selisih_kas}}.\n3. OPNAME BRANKAS: Laporkan inventarisasi lembaran uang pecahan ratusan ribu hingga koin rupiah sesuai daftar brankas berikut per akhir bulan berjalan: {{opname_uang_fisik}}."
    },
    {
      id: 'laporan_realisasi_anggaran',
      nama: 'Laporan Realisasi Anggaran (LRA)',
      icon: '📉',
      components: [
        { id: 'pagu_awal', label: 'Pagu Anggaran Awal Tahun', type: 'textarea' },
        { id: 'realisasi_serap', label: 'Tabel Realisasi Penggunaan & Persentase Serapan Dana', type: 'textarea' },
        { id: 'sisa_silpa', label: 'Sisa Pagu Terakhir (SILPA Kas/Bank)', type: 'textarea' }
      ],
      ai_prompt: "Anda ditugaskan sebagai Pengawas Manajerial Tingkat Dinas.\n\nTolong buat Laporan Realisasi Anggaran (LRA) bulanan komprehensif:\nTabulasikan sisa plafon awal tahun dana sekolah: {{pagu_awal}} dikurangi akumulatif daya serap riil pembelanjaan ini: {{realisasi_serap}}.\nBeri penilaian/opini apakah daya serap sekolah ini terlalu lemot atau terlalu boros merujuk pada sisa SILPA hari ini: {{sisa_silpa}} untuk kemudian diserahkan langsung kepada Kepala Sekolah sebagai rekomendasi percepatan belajar."
    },
    {
      id: 'pengarsipan_ordner',
      nama: 'Lembar Sampul Pengarsipan (Ordner SPJ)',
      icon: '📂',
      components: [
        { id: 'identitas_bulan', label: 'Identitas Pembukuan: Bulan, Tahun, Kepala Sekolah, & Bendahara', type: 'textarea' },
        { id: 'indeks_pembatas', label: 'Indeks Tatanan Divider/Pembatas Jenis Transaksi Kwitansi', type: 'textarea' }
      ],
      ai_prompt: "Sebagai Pegawai Arsiparis Handal, desain Cover Identitas Ordner Lemari Penyimpanan SPJ Bulanan.\n\nRancang *Front-Cover Ordner* estetik dan resmi berisi nama lembaga/Bulan Pembukuan berdasar ini: {{identitas_bulan}} serta buatkan Daftar Isi atau *Index Log* penyusunan bukti SPJ kronologis (ATK, Honor, dll) sebagai penuntun lembar pembatas (Divider) dari inputan: {{indeks_pembatas}} agar kalau ada Sidak BPK/Inspektorat tidak memakan waktu mencarinya."
    }
  ]
};
