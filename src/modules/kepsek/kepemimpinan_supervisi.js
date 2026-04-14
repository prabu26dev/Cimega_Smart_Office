window.KepsekModules = window.KepsekModules || {};

window.KepsekModules['kepemimpinan_supervisi'] = {
  id: 'kepemimpinan_supervisi',
  title: 'Kepemimpinan Pembelajaran',
  icon: '👨‍🏫',
  desc: 'Kepala Sekolah sebagai mentor guru bagi peningkatan kualitas pembelajaran.',
  items: [
    {
      id: 'supervisi_akademik',
      nama: 'Program Supervisi Akademik',
      icon: '📝',
      components: [
        { id: 'jadwal', label: 'Identitas Guru & Jadwal Supervisi', type: 'text' },
        { id: 'observasi', label: 'Hasil Instrumen Observasi (Fokus: Deep Learning & Keterlibatan Anak)', type: 'textarea' },
        { id: 'catatan', label: 'Catatan Rapat Pra-Observasi dan Pasca-Observasi', type: 'textarea' },
        { id: 'rtl', label: 'Rencana Tindak Lanjut (RTL) & Rekomendasi Pelatihan', type: 'textarea' }
      ],
      ai_prompt: "Bertindaklah sebagai Supervisor Akademik Profesional tingkat Kementerian Pendidikan. Anda ditugaskan menyusun Dokumen Laporan Supervisi Akademik Guru yang bermutu tinggi dan humanis.\n\nStruktur Laporan yang diminta:\n1. IDENTITAS GURU DAN PELAKSANAAN\nBuat pendahuluan formal berdasarkan informasi ini: {{jadwal}}.\n2. HASIL OBSERVASI PEMBELAJARAN\nJabarkan secara deskriptif hasil observasi berikut (terutama menyoroti deep learning dan student wellbeing): {{observasi}}.\n3. HASIL DISKUSI PRA DAN PASCA OBSERVASI\nKonversikan catatan kasar diskusi ini menjadi paragraf naratif profesional yang merefleksikan proses mentoring: {{catatan}}.\n4. RENCANA TINDAK LANJUT (RTL)\nBerdasarkan semua data di atas, rumuskan langkah konkret RTL dan rekomendasi pelatihan spesifik: {{rtl}}.\n\nHasilkan dengan gaya penulisan koaching (coaching mindset), suportif, namun tetap tegas dan akuntabel."
    },
    {
      id: 'pantau_kokurikuler',
      nama: 'Pemantauan Pembelajaran Kokurikuler',
      icon: '🌱',
      components: [
        { id: 'sk_kord', label: 'Ketetapan Koordinator & Fasilitator Kokurikuler (Nama dan Tugas)', type: 'textarea' },
        { id: 'pemetaan', label: 'Dokumen Pemetaan Proyek (Dimensi Profil Lulusan)', type: 'textarea' },
        { id: 'observasi', label: 'Lembar Observasi Perkembangan Karakter Lintas Proyek', type: 'textarea' }
      ],
      ai_prompt: "Sebagai Ahli Manajemen Pendidikan Proyek Kokurikuler, susun Laporan Pemantauan Pelaksanaan Proyek Kokurikuler (seperti P5 tingkat makro sekolah).\n\nInstruksi Struktur:\n1. SKEMA KEPANITIAAN: Buat ringkasan tugas fasilitator berdasarkan data ini: {{sk_kord}}.\n2. PEMETAAN DIMENSI PROFIL PELAJAR: Rincikan dengan jelas bagaimana proyek dirancang memukul dimensi profil sasaran: {{pemetaan}}.\n3. EVALUASI PERKEMBANGAN KARAKTER: Buatkan analisis evaluatif dan naratif dari hasil observasi lapangan: {{observasi}}.\n\nDokumen ini akan ditunjukkan kepada pengawas pembina, sehingga buatlah seinformatif mungkin dengan tata bahasa logis dan berdasar bukti."
    }
  ]
};
