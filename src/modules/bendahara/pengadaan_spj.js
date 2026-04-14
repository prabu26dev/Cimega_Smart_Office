window.BendaharaModules = window.BendaharaModules || {};

window.BendaharaModules['pengadaan_spj'] = {
  id: 'pengadaan_spj',
  title: 'Pengadaan & SPJ',
  icon: '🧾',
  desc: 'Pusat otentikasi Surat Pertanggungjawaban (SPJ) baik via SIPLah, slip kwitansi manual, dan rekap honor.',
  items: [
    {
      id: 'admin_pengadaan',
      nama: 'Administrasi Barang Jasa (SIPLah)',
      icon: '🛒',
      components: [
        { id: 'dokumen_po', label: 'Detail Pesanan (PO) & ID SIPLah/Toko', type: 'textarea' },
        { id: 'bukti_bayar', label: 'Bukti Transfer Bank & No Faktur/Invoice Resmi', type: 'textarea' },
        { id: 'berita_acara_barang', label: 'Berita Acara Terima/Periksa Barang (BAST/BAPB)', type: 'textarea' }
      ],
      ai_prompt: "Sebagai Pejabat Pengadaan Barang Pemerintah (Procurement Officer), validasi dan rumuskan Berkas Kelengkapan Mutasi Barang Jasa.\n\nKerangka SPJ Pengadaan:\n1. BUKTI PEMESANAN & FAKTUR: Kompilasikan detail merchant/SIPLah ini: {{dokumen_po}} bersama dengan bukti lunas ini: {{bukti_bayar}}.\n2. BERITA ACARA SERAH TERIMA (BAST): Susun draf BAST resmi dan Berita Acara Pemeriksaan Barang yang menyatakan inspeksi fisik barang telah dihitung lengkap dan bebas cacat berdasar keterangan ini: {{berita_acara_barang}}."
    },
    {
      id: 'kwitansi_internal',
      nama: 'Dokumen Kwitansi / Nota Internal',
      icon: '💵',
      components: [
        { id: 'info_kwitansi', label: 'Tgl, No Kwitansi, & Nominal (Angka/Terbilang)', type: 'textarea' },
        { id: 'uraian_bayar', label: 'Uraian Tujuan Pembayaran & Kepada Siapa', type: 'textarea' },
        { id: 'otorisasi_tanda', label: 'Kolom Tanda Tangan (Penerima, Lunas Bendahara, Setuju Kepsek)', type: 'textarea' }
      ],
      ai_prompt: "Anda adalah Spesialis Kearsipan Keuangan. Bentuk data sporadis ini menjadi format Layout Kwitansi Standar Pemeriksaan Inspektorat.\n\nInstruksi Layout:\n1. IDENTITAS SAH: Tulis rapi nomor seri pembayaran, dan ubah nominal mutlak ini menjadi ejaan terbilang abjad yang bebas ralat (typo-proof): {{info_kwitansi}}.\n2. URAIAN SPESIFIK: Jabarkan secara rinci narasi transaksinya dan dibayar kepada pihak: {{uraian_bayar}}.\n3. LEGALISASI (OTORISASI): Tata alur posisi tanda tangan keabsahan (termasuk peletakan materai jika perlu) berdasar input nama-nama ini: {{otorisasi_tanda}}."
    },
    {
      id: 'honor_belanja_pegawai',
      nama: 'Administrasi Honorarium Pegawai',
      icon: '👥',
      components: [
        { id: 'syarat_cair', label: 'Bukti Terselesaikannya Tugas / Daftar Hadir', type: 'textarea' },
        { id: 'rekap_penerimaan', label: 'Nama, Nominal Kotor, Gaji Bersih, & No. Rekening', type: 'textarea' }
      ],
      ai_prompt: "Sebagai Staff Penggajian (Payroll Admin), buat Tanda Terima Pembayaran Honorarium (GTT/PTT /Kepanitiaan).\n\nSkema Pelaporan Gaji:\nValidasi kelayakan bayar mereka berlandaskan kinerja terlampir (Misal: kehadiran panitia P5 penuh 3 hari): {{syarat_cair}}.\nBuatkan Tabel Daftar Penerimaan Gaji (Pay Slip summary) memuat Nama/Rekening, dan Total yang ditransfer (Take Home Pay) dari list gaji kotor/bersih ini: {{rekap_penerimaan}}."
    }
  ]
};
