window.FasilitatorP5Modules = window.FasilitatorP5Modules || {};

window.FasilitatorP5Modules['pelaporan_fasilitator'] = {
  id: 'pelaporan_fasilitator',
  title: 'Pelaporan & Sinkronisasi Data',
  icon: '✉️',
  desc: 'Penyusunan e-Rapor P5 tingkat siswa berupa narasi komprehensif, untuk disetor kepada Wali Kelas.',
  items: [
    {
      id: 'narasi_capaian',
      nama: 'Draf Narasi Capaian Karakter Siswa',
      icon: '📝',
      components: [
        { id: 'kompilasi_anekdotal', label: 'Kompilasi Jurnal Anekdotal & Rubrik Formatif', type: 'textarea' },
        { id: 'kekuatan_dimensi', label: 'Kekuatan Utama dari 8 Dimensi (Highlight)', type: 'textarea' },
        { id: 'area_pengembangan', label: 'Area Perilaku yang Masih Perlu Dikembangkan', type: 'textarea' }
      ],
      ai_prompt: "Sebagai Ahli Bahasa Asesmen Pedagogik, tugas final Anda adalah meracik rapot kualitatif individual untuk diserahkan kepada Wali Kelas.\n\nPenyusunan Deskripsi Rapor P5:\n1. NARRATIVE SUMMATION: Masukkan seluruh coretan kasar penilaian anak sepanjang semester ini: {{kompilasi_anekdotal}}.\n2. APRESIASI KEKUATAN: Berlandaskan kompilasi di atas, buatkan satu paragraf pujian elegan yang menyorot *breakthrough* positif terbesar siswa pada pilar dimensi profil lulusannya: {{kekuatan_dimensi}}.\n3. SARAN MEMBANGUN (CONSTRUCTIVE FEEDBACK): Tuliskan dengan saksama tanpa melukai harga diri anak/ortu terkait apa yang masih harus diasah lagi (misal: keberanian presentasi, atau kontrol emosi saat adu pendapat): {{area_pengembangan}}."
    },
    {
      id: 'umpan_balik_evaluasi',
      nama: 'Lembar Evaluasi & Umpan Balik',
      icon: '📢',
      components: [
        { id: 'kritik_tema', label: 'Kritik Konstruktif terhadap Tema Proyek Asli', type: 'textarea' },
        { id: 'kecukupan_sumber', label: 'Tanggapan Terkait Fasilitas Sekolah & Anggaran', type: 'textarea' },
        { id: 'rekomendasi_siklus', label: 'Saran Perbaikan Sistem untuk Koordinator', type: 'textarea' }
      ],
      ai_prompt: "Berperanlah sebagai Advokat/Perwakilan Suara Para Guru Lapangan. Susun Laporan Temuan Lapangna dan Evaluasi Top-Down yang akan dinaikkan ke meja Koordinator P5.\n\nKerangka Kritik Logis (Umpan Balik):\n1. TINJAUAN KURIKULUM: Berikan argumen apakah kerumitan Silabus Makro dari koordinator tahun ini sesuai atau malah memberatkan nalar anak berdasar ide: {{kritik_tema}}.\n2. TUNTUTAN ANGGARAN & ASET: Komplain atau apresiasi kinerja tim logistik tingkat pusat untuk memastikan ketersediaan suplai kardus/cat/media ke lapak pameran: {{kecukupan_sumber}}.\n3. CALL TO ACTION: Rangkai rekomendasi strategis/saran perbaikan tata tertib manajemen yang Anda rasa diperlukan koordinator pusat untuk siklus berikutnya: {{rekomendasi_siklus}}."
    }
  ]
};
