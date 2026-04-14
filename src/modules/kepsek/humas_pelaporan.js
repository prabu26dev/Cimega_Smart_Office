window.KepsekModules = window.KepsekModules || {};

window.KepsekModules['humas_pelaporan'] = {
  id: 'humas_pelaporan',
  title: 'Humas & Pelaporan',
  icon: '🤝',
  desc: 'Legalitas hubungan eksternal sekolah dan penyampaian Laporan Pertanggungjawaban.',
  items: [
    {
      id: 'admin_kemitraan',
      nama: 'Administrasi Kemitraan (MoU)',
      icon: '🤝',
      components: [
        { id: 'komite', label: 'Program Sinergi dan Peran Komite Sekolah', type: 'textarea' },
        { id: 'mou_luar', label: 'Ruang Lingkup Kerja Sama Pihak Luar (Puskesmas/Polsek/DUDI)', type: 'textarea' }
      ],
      ai_prompt: "Sebagai Ahli Hubungan Eksternal Institusi Pendidikan, Anda ditugaskan merancang draf dasar Memorandum of Understanding (MoU) atau Surat Perjanjian Kerja Sama Mutlak.\n\nTolong bagi draf ini ke dalam dua bagian besar:\n1. KEMITRAAN KOMITE SEKOLAH\nBerdasarkan gagasan ini: {{komite}}, susunlah lembar kesepahaman operasional antara Kepala Sekolah dan Ketua Komite perihal dukungan terhadap inovasi sekolah.\n2. MoU PIHAK EKSTERNAL\nDengan menggunakan parameter kerangka kerja sama ini: {{mou_luar}}, buatkan draf MoU legal yang mencakup: Pihak Pertama (Sekolah), Pihak Kedua, Hak dan Kewajiban, serta Masa Berlaku Perjanjian.\n\nTulislah dengan laras bahasa hukum positif Indonesia yang baku, kaku, dan mengikat secara formal tanpa menyisakan multitafsir."
    },
    {
      id: 'lpj',
      nama: 'Laporan Pertanggungjawaban (LPJ)',
      icon: '📑',
      components: [
        { id: 'bos', label: 'Ringkasan Capaian dan Realisasi Dana BOS', type: 'textarea' },
        { id: 'eds', label: 'Sorotan/Temuan Evaluasi Diri Sekolah (EDS)', type: 'textarea' },
        { id: 'akip', label: 'Laporan Akuntabilitas Kinerja (Keberhasilan Program Bantuan)', type: 'textarea' }
      ],
      ai_prompt: "Tugas Anda adalah merumuskan Laporan Pertanggungjawaban (LPJ) Tahunan Tingkat Satuan Pendidikan (berperan layaknya Akuntan Publik/Auditor Internal Pemerintah).\n\nInstruksi Struktur Pelaporan:\n1. REALISASI DANA BOSP\nSusun redaksi pelaporan naratif mengenai serapan dana berdasarkan summary ini: {{bos}}, tegaskan kepatuhannya terhadap juknis BOS/BOSP.\n2. EVALUASI DIRI SEKOLAH\nTerjemahkan temuan evaluasi kasar ini: {{eds}}, menjadi matriks/laporan naratif terkait kendala, tantangan, dan capaian mutu standar nasional pendidikan (SNP).\n3. AKUNTABILITAS KINERJA (AKIP)\nRingkas secara formal keberhasilan/dampak program-program sektoral ini: {{akip}} terhadap kualitas institusi.\n\nHindarkan gaya penulisan puitis atau opini; bersikaplah sangat objektif, transparan, dan berdasarkan fakta audit administrasi negara."
    }
  ]
};
