window.FasilitatorP5Modules = window.FasilitatorP5Modules || {};

window.FasilitatorP5Modules['asesmen_karakter'] = {
  id: 'asesmen_karakter',
  title: 'Asesmen Karakter & Observasi',
  icon: '🔍',
  desc: 'Pusat perekaman jantung data kualitatif proyek: Anecdotal Record, Rubrik Kinerja Formatif, dan Self-Reflection.',
  items: [
    {
      id: 'catatan_anekdotal',
      nama: 'Lembar Catatan Anekdotal (Anecdotal Record)',
      icon: '✍️',
      components: [
        { id: 'kejadian_spontan', label: 'Deskripsi Peristiwa Lapangan (Perilaku Positif/Negatif Spontan)', type: 'textarea' },
        { id: 'korelasi_dimensi', label: 'Kaitan dengan 8 Dimensi Lulusan', type: 'textarea' }
      ],
      ai_prompt: "Tugas Anda adalah sebagai Analis Psikologi Anak (Fasilitator P5). Ubah coret-coretan raw saya mengenai kejadian lapangan spontan ini menjadi Lembar Catatan Anekdotal Berkualitas.\n\nInstruksi Framing Tingkah Laku:\n1. NARRASI OBYEKTIF: Hindari penghakiman berlebih. Tulislah ulang perbuatan anak tersebut (Misal merebut barang atau membantu teman) menjadi deskripsi perilaku faktual: {{kejadian_spontan}}.\n2. PEMETAAN DIMENSI KARAKTER TEPAT GUNA: Identifikasi perbuatan di atas, cacat atau keunggulan mana dari salah satu/dua opsi 8 Dimensi Pelajar (contoh: Gotong Royong / Empati Lintas Batas) dan uraikan justifikasinya dari ide ini: {{korelasi_dimensi}}."
    },
    {
      id: 'rubrik_formatif',
      nama: 'Rubrik Observasi Kinerja Proyek',
      icon: '📏',
      components: [
        { id: 'indikator_amalan', label: 'Indikator Pengamatan Harian (Pencarian Info, Respon Kritik, Daya Juang)', type: 'textarea' },
        { id: 'progres_sikap', label: 'Ceklis Perkembangan (MB, BSH, SB)', type: 'textarea' }
      ],
      ai_prompt: "Anda adalah Panitia Asesmen Mutu Belajar. Transkripsikan nilai frekuensi perbuatan yang terekam menjadi Jurnal Pertumbuhan Karakter Berjalan.\n\nOlahan Data Rubrik:\nBerangkat dari matriks kompetensi tak terlihat (soft skills/daya juang) ini: {{indikator_amalan}}, formulasikan narasi konversi kualitatif dari skor angka ini (MB, SB, dst): {{progres_sikap}}. Hindari penggunaan bahasa negatif absolut, pakaikan eufemisme 'belum konsisten' atau 'masih butuh bimbingan'."
    },
    {
      id: 'refleksi_teman',
      nama: 'Lembar Refleksi & Peer Assessment',
      icon: '👥',
      components: [
        { id: 'refleksi_diri', label: 'Hasil Refleksi Diri Siswa (Tantangan Terbesar & Solusi)', type: 'textarea' },
        { id: 'penilaian_teman', label: 'Hasil Penilaian Antar Teman (Siapa yang paling berkontribusi)', type: 'textarea' }
      ],
      ai_prompt: "Sebagai Fasilitator Demokratis, Anda perlu menyimpulkan umpan balik anonim dan reflektif yang dilakukan oleh siswa mandiri.\n\nAnalisis Kuadran Interaksi: \n1. TINGKAT OVERTHINKING/CHALLENGES: Rangkum apa sebenarnya hambatan nalar mental yang dirasakan anak-anak di usia mereka melalui jurnal refleksi ini: {{refleksi_diri}}.\n2. VALIDASI SOSIAL REKAN SEBAYA: Simpulkan dari data cross-check ini siapa yang nyatanya memikul beban kerja (the backpacker) dan siapa yang pasif berdasar: {{penilaian_teman}}."
    }
  ]
};
