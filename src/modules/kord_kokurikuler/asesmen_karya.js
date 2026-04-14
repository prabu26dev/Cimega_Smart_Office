window.KordKokuModules = window.KordKokuModules || {};

window.KordKokuModules['asesmen_karya'] = {
  id: 'asesmen_karya',
  title: 'Asesmen, Evaluasi & Karya',
  icon: '🎨',
  desc: 'Pangkalan rubrik penilaian karakter P5, galeri showcase panen karya, dan narasi akhir Rapor Proyek.',
  items: [
    {
      id: 'rubrik_observasi',
      nama: 'Instrumen Rubrik (Template Fasilitator)',
      icon: '📏',
      components: [
        { id: 'dimensi_fokus', label: 'Dimensi Target (Kolaborasi, Kreativitas, Kritis, dll)', type: 'textarea' },
        { id: 'indikator_perilaku', label: 'Indikator Perilaku yang Dapat Diamati (Observable)', type: 'textarea' },
        { id: 'skala_kategori', label: 'Tebaran Skala Kategori (Mulai Berkembang hingga Sangat Berkembang)', type: 'textarea' }
      ],
      ai_prompt: "Tugas Anda adalah sebagai Peneliti Perilaku Psikologi Anak. Rumuskan desain form 'Instrumen Rubrik Asesmen P5' yang akan dicetak sebagai modal penilaian fasilitator di lapangan.\n\nStruktur Matriks:\n1. TENTUKAN FOKUS: Terjemahkan kedalaman Dimensi ini sesuai jenjang umurnya: {{dimensi_fokus}}.\n2. RUMUSKAN BUKTI KONKRET: Jangan gunakan bahasa abstrak. Berikan percontohan aksi nyata siswa di lapangan yang membuktikan mereka punya karakter tersebut berdasar: {{indikator_perilaku}}.\n3. RENTANG SKALA AFEKTIF: Formulasikan perbedaan sikap seorang anak mulai dari fase (MB) pasif hingga fase (SB) yang mampu memimpin temannya sesuai ide ini: {{skala_kategori}}."
    },
    {
      id: 'galeri_showcase',
      nama: 'Manajemen Portofolio & Panen Karya',
      icon: '📸',
      components: [
        { id: 'katalog_tema', label: 'Daftar Tema / Stan Kelas saat Panen Karya', type: 'textarea' },
        { id: 'arsip_digital', label: 'Log Penyimpanan Aset Digital/Fisik (Link G-Drive / Gudang)', type: 'textarea' },
        { id: 'kurasi_karya', label: 'Kurasi Narasi Pembuatan Karya Unggulan (Proses di balik layar)', type: 'textarea' }
      ],
      ai_prompt: "Berperanlah sebagai Kurator Pameran Seni dan Arsip Digital Sekolah. Susun Panduan Tata Letak dan Selebrasi Panen Karya Kokurikuler (Showcase).\n\nInstruksi Manajemen Pameran:\nTATA RUANG BOOTH: Lakukan plotting denah pamernya beradasar variasi kekayaan artefak proyek ini: {{katalog_tema}}.\nINVENTARIS BIG DATA: Rapikan dan pastikan jejak URL arsip memori anak tidak hilang di kemudian hari, tata berdasarkan: {{arsip_digital}}.\nDESKRIPSI CAPTION: Gubah deskripsi teknis pembuatan karya ini menjadi \"Label Storytelling\" yang memukau para tamu undangan pameran membedah filosofi di balik keringat anak-anak: {{kurasi_karya}}."
    },
    {
      id: 'laporan_akhir_narasi',
      nama: 'Buku Laporan Akhir Narasi Karakter',
      icon: '📂',
      components: [
        { id: 'rekap_skor', label: 'Kompilasi Ceklis Hasil Observasi Seluruh Fasilitator', type: 'textarea' },
        { id: 'deskripsi_holistik', label: 'Deskripsi Holistik Pertumbuhan Kelas/Angkatan', type: 'textarea' },
        { id: 'penyerahan_walas', label: 'Berita Acara Penyerahan Data ke Wali Kelas', type: 'textarea' }
      ],
      ai_prompt: "Sebagai Kepala Biro Asesmen Nasional, kompilasikan semua tumpukan kertas rubrik P5 sekolah ini menjadi Dokumen Laporan Narasi Akhir Profil Pelajar Pancasila.\n\nFokus Draf Laporan Narasi:\n1. BIG DATA AFEKTIF: Ubah tabel metrik statistik kasar P5 ini menjadi generalisasi kemampuan psikomotor perilaku anak tingkat makro sekolah: {{rekap_skor}}.\n2. CERITA PERUBAHAN (THEORY OF CHANGE): Buktikan kesuksesan proyek berharga ini melalui narasi haru bagaimana sebuah angkatan belajar empati dan gotong royong berdasarkan ide krisis/solusi ini: {{deskripsi_holistik}}.\n3. HANDOVER PROTOCOL: Tulis surat pengantar serah terima laporan ini untuk didetailkan dan diinput satu persatu ke e-Rapor oleh wali kelas: {{penyerahan_walas}}."
    }
  ]
};
