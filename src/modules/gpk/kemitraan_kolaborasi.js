window.GpkModules = window.GpkModules || {};

window.GpkModules['kemitraan_kolaborasi'] = {
  id: 'kemitraan_kolaborasi',
  title: 'Kemitraan Lintas Pihak (MoU)',
  icon: '🤝',
  desc: 'Pangkalan sinkronisasi Buku Penghubung Inklusi (Komunikasi Ortu), Notulensi Rapat Kasus (Case Conference), dan Direktori Rujukan Khusus.',
  items: [
    {
      id: 'buku_penghubung_ortu',
      nama: 'Buku Komunikasi (Penghubung) Inklusi',
      icon: '📬',
      components: [
        { id: 'catatan_pola_asuh', label: 'Sinkronisasi Pola Asuh Rumah vs Sekolah (Diet/Screen Time)', type: 'textarea' },
        { id: 'pesan_harian_ortu', label: 'Pesan / Keluhan Harian Balasan dari Wali Murid', type: 'textarea' }
      ],
      ai_prompt: "Sebagai Ahli Pendampingan Keluarga (Family Counselor). Jadilah fasilitator obrolan penengah agar perlakuan terhadap ABK konsisten 24 Jam!\n\nJurnal Jaringan Ekosistem Terkecil: \n1. PENYELARASAN METODE: Tulis teguran halus namun logis tentang pentingnya orang tua menyamakan metode hukuman/hadiah atau pematuhan diet yang GPK kerjakan di sekolah dengan rutinitas di rumah menggunakan: {{catatan_pola_asuh}}.\n2. TANGGAPAN SIMPATIK: Berikan balasan surat yang meredam emosi wali murid serta memberi penjelasaan akademik atas kelelahan/keluhan yang disuarakan ortu melalui draf ini: {{pesan_harian_ortu}} agar tetap percaya pada sistem sekolah."
    },
    {
      id: 'case_conference',
      nama: 'Notulensi Rapat Kasus (Case Conference)',
      icon: '👥',
      components: [
        { id: 'identifikasi_krisis', label: 'Tantangan/Kemacetan Karakter Ekstrem Siswa (Pokok Bahasan)', type: 'textarea' },
        { id: 'solusi_lintas_ahli', label: 'Solusi / RTL Kesepakatan Bersama (Ahli, Ortu, Walas, Kepsek)', type: 'textarea' }
      ],
      ai_prompt: "Anda ditugaskan sebagai Pimpinan Sidang Pembahasan Krisis ABK. Susun Notulensi Rapat Luar Biasa (Case Conference) Sekolah.\n\nFormulir Sidang (Case Solving):\n1. LAPORAN MANDUNG (STAGNATION): Jelaskan masalah darurat (apakah ada perilaku *self-harm*/perundungan) yang memaksa digelarnya rapat mendadak berdasar draf: {{identifikasi_krisis}}.\n2. KEPUTUSAN GABUNGAN: Ringkas secara sah (*Legally Binding*) apa komitmen tindak lanjut/sanksi/kesepakatan penanganan baru yang harus dikerjakan bareng-bareng antara sekolah dan psikiater sesuai persetujuan: {{solusi_lintas_ahli}}."
    },
    {
      id: 'direktori_rujukan',
      nama: 'Database Rujukan/Mitra Profesional',
      icon: '🏥',
      components: [
        { id: 'kontak_darurat', label: 'Kontak Klinik Tungbang / Psikiater Anak / Terapis Wicara', type: 'textarea' },
        { id: 'mou_eksternal', label: 'Status Hubungan / Kesepakatan (MoU) Rujukan Resmi', type: 'textarea' }
      ],
      ai_prompt: "Sebagai Spesialis Jaringan Kemitraan Pemerintah. Buatkan Kartu Direktori (Indeks Telepon) Darurat Rumah Sakit.\n\nRancang tabel rujukan eksternal tenaga ahli (Psikiater, Orthopedagog, dsb) secara profesional beserta kontak cepatnya dari list acak: {{kontak_darurat}}.\nSusun draf narasi permohonan Perjanjian Kerjasama Baru untuk merajut kemitraan (MoU) gratis atau bersubsidi dengan klinik-klinik tersebut berlandaskan info: {{mou_eksternal}} untuk meringankan beban orang tua."
    }
  ]
};
