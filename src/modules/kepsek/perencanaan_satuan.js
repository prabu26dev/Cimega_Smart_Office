window.KepsekModules = window.KepsekModules || {};

window.KepsekModules['perencanaan_satuan'] = {
  id: 'perencanaan_satuan',
  title: 'Perencanaan Satuan Pendidikan',
  icon: '🎯',
  desc: 'Dokumen "kompas" sekolah. Memastikan perencanaan sekolah kontekstual.',
  items: [
    {
      id: 'kosp',
      nama: 'Kurikulum Operasional (KOSP)',
      icon: '📑',
      components: [
        { id: 'karakteristik', label: 'Analisis Karakteristik (Lingkungan, Sosial, Budaya)', type: 'textarea' },
        { id: 'visi_misi', label: 'Visi, Misi, dan Tujuan Sekolah (Orientasi Profil Lulusan 8 Dimensi)', type: 'textarea' },
        { id: 'pengorganisasian', label: 'Pengorganisasian Pembelajaran (Intrakurikuler & Ekstrakurikuler)', type: 'textarea' },
        { id: 'rencana', label: 'Rencana Pembelajaran', type: 'textarea' },
        { id: 'evaluasi', label: 'Pendampingan, Evaluasi, dan Pengembangan Profesional', type: 'textarea' }
      ],
      ai_prompt: "Anda adalah Konsultan Manajemen Pendidikan Ahli. Tugas Anda adalah mengembangkan draf resmi Kurikulum Operasional Satuan Pendidikan (KOSP) yang komprehensif, akademis, dan terstruktur sesuai standar Kurikulum Merdeka. Gunakan data berikut sebagai dasar utama dokumen:\n\n1. BAB I: KARAKTERISTIK SEKOLAH\nUraikan secara naratif kondisi yang diberikan ini: {{karakteristik}}\n\n2. BAB II: VISI, MISI, DAN TUJUAN\nJabarkan visi dan misi berikut serta hubungkan secara implisit dengan 8 Dimensi Profil Pelajar Pancasila: {{visi_misi}}\n\n3. BAB III: PENGORGANISASIAN PEMBELAJARAN\nSusun ulang secara profesional tata letak jam intrakurikuler dan kokurikuler berdasarkan data ini: {{pengorganisasian}}\n\n4. BAB IV: RENCANA PEMBELAJARAN\nIntegrasikan pendekatan pembelajaran berdiferensiasi ke dalam gambaran luas berdasarkan: {{rencana}}\n\n5. BAB V: EVALUASI & PENGEMBANGAN PROFESIONAL\nSusun standar SOP evaluasi yang merefleksi kebutuhan ini: {{evaluasi}}\n\nHasilkan dokumen final dengan hierarki Markdown yang jelas, rapi, dan menggunakan gaya bahasa formal kedinasan tingkat tinggi. Jangan menggunakan placeholder, buatlah langsung skenario nyatanya."
    },
    {
      id: 'pbd',
      nama: 'Perencanaan Berbasis Data (PBD)',
      icon: '📊',
      components: [
        { id: 'rkt', label: 'Lembar Kerja Rencana Kerja Tahunan (RKT)', type: 'textarea' },
        { id: 'rapor', label: 'Analisis Rapor Pendidikan', type: 'textarea' },
        { id: 'rkas', label: 'Rencana Kerja dan Anggaran Sekolah (RKAS)', type: 'textarea' },
        { id: 'refleksi', label: 'Dokumen Refleksi dan Benahi', type: 'textarea' }
      ],
      ai_prompt: "Bertindaklah sebagai Auditor Perencanaan Pendidikan. Saya membutuhkan penyusunan Laporan Perencanaan Berbasis Data (PBD) untuk landasan RKAS tahun ajaran berjalan. \n\nInstruksi Struktur Dokumen:\n1. RINGKASAN EKSEKUTIF RAPOR PENDIDIKAN\nBuatkan paragraf analisis tajam berdasarkan data rapor berikut: {{rapor}}.\n2. REFLEKSI & AKAR MASALAH\nBerdasarkan langkah pembenahan berikut, uraikan analisis mendalam mengenai mengapa masalah di poin 1 terjadi: {{refleksi}}.\n3. PENYELARASAN DENGAN RKT\nIntegrasikan peta kerja dari RKT ini: {{rkt}}.\n4. PROYEKSI ANGGARAN (RKAS)\nFormulasikan justifikasi rasional secara deskriptif mengenai alokasi RKAS berikut dan hubungkan kembali ke pembenahan mutu rapor pendidikan sekolah: {{rkas}}.\n\nSajikan output ini dengan tabel Markdown apabila memungkinkan, poin bullet yang sistematis, dan gaya bahasa teknokratik tata usaha negara."
    }
  ]
};
