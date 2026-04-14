window.KordKokuModules = window.KordKokuModules || {};

window.KordKokuModules['desain_program'] = {
  id: 'desain_program',
  title: 'Perencanaan & Desain Program',
  icon: '🏗️',
  desc: 'Dokumen makro pemetaan proyek P5 agar terstruktur, lintas-fase, dan selaras dengan 8 Dimensi Lulusan.',
  items: [
    {
      id: 'pemetaan_dimensi',
      nama: 'Pemetaan 8 Dimensi Profil Lulusan',
      icon: '🧩',
      components: [
        { id: 'fase_kelas', label: 'Daftar Jenjang/Fase Kelas (Misal Fase A, B, C)', type: 'textarea' },
        { id: 'target_dimensi', label: 'Fokus 8 Dimensi (Keimanan, Mandiri, Kolaborasi, dll)', type: 'textarea' },
        { id: 'matriks_hubungan', label: 'Gagasan Awal Hubungan Proyek dengan Dimensi', type: 'textarea' }
      ],
      ai_prompt: "Sebagai Chief of Project Officer (Koordinator Kokurikuler) tingkat Sekolah Dasar, rumuskan Matriks Pemetaan Dimensi Profil Lulusan yang berkesinambungan antar jenjang.\n\nFokus Penjabaran Arsitektur Proyek:\n1. KONTINUITAS KELAS: Berdasarkan jenjang ini: {{fase_kelas}}, pastikan beban proyek tidak saling tumpang tindih.\n2. DISTRIBUSI KARAKTER: Alokasikan dan jelaskan irisan dimensi (contoh: kreativitas & kolaborasi) yang adil berdasarkan data ini: {{target_dimensi}}.\n3. INTEGRASI MATRIKS: Transformasikan gagasan acak ini: {{matriks_hubungan}} menjadi format tabel/deskripsi sistematis yang siap dipresentasikan di rapat komite sekolah."
    },
    {
      id: 'silabus_proyek',
      nama: 'Silabus / Desain Proyek Grand Design',
      icon: '📐',
      components: [
        { id: 'tema_besar', label: 'Tema Kontekstual Sekolah & Topik per Kelas', type: 'textarea' },
        { id: 'alur_pelaksanaan', label: 'Alur Eksekusi (Eksplorasi - Perencanaan - Aksi - Selebrasi)', type: 'textarea' },
        { id: 'kebutuhan_sumber', label: 'Estimasi Kebutuhan Sumber Daya & Costing', type: 'textarea' }
      ],
      ai_prompt: "Anda ditugaskan mendesain Dokumen Induk (Grand Design) Kurikulum Proyek Sekolah (Silabus Kokurikuler).\n\nInstruksi Penyusunan:\n1. TEMA & TOPIK MENDALAM: Rangkum ide abstrak ini: {{tema_besar}} menjadi judul-judul proyek yang seksi dan relevan bagi anak SD (misal: 'Pahlawan Nol Sampah').\n2. ALUR TAHAPAN KONKRET: Rincikan fase \"Kenali, Selidiki, Lakukan, Genapi/Selebrasi\" agar fasilitator mudah paham arahnya: {{alur_pelaksanaan}}.\n3. MANAJEMEN SUMBER DAYA: Hitung rasionalisasi logistik dan pembiayaan proyek berdasar ide ini, usahakan konsep Low Budget High Impact: {{kebutuhan_sumber}}."
    },
    {
      id: 'master_schedule',
      nama: 'Penjadwalan Kokurikuler (Master Schedule)',
      icon: '📅',
      components: [
        { id: 'sistem_waktu', label: 'Sistem Alokasi Waktu (Blok / Reguler / Terintegrasi)', type: 'textarea' },
        { id: 'timeline_kasar', label: 'Tanggal Penting (Kickoff, Pameran, Evaluasi)', type: 'textarea' }
      ],
      ai_prompt: "Anda adalah Project Manager Ahli. Buatkan Rencana Penetapan Jadwal Utama (Master Schedule) Pelaksanaan Kokurikuler.\n\nArahan Skedul:\nRasionalkan mengapa sistem penanggalan yang dipilih sekolah ini ideal diimplementasikan: {{sistem_waktu}}.\nUbah coretan tanggal penting ini: {{timeline_kasar}} menjadi Laporan Timeline Proyek berformat daftar periksa (checklist/milestones) profesional."
    }
  ]
};
