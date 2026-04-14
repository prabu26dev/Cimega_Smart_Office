window.EkskulModules = window.EkskulModules || {};

window.EkskulModules['bank_prestasi'] = {
  id: 'bank_prestasi',
  title: 'Penilaian & Bank Prestasi',
  icon: '🏆',
  desc: 'Rubrik penilaian sikap kinerja, penyusunan database anak berbakat (Talent Pool), hingga Format Rapor Ekskul akhir semester.',
  items: [
    {
      id: 'rubrik_karakter_ekskul',
      nama: 'Buku Penilaian Keterampilan & Karakter',
      icon: '📏',
      components: [
        { id: 'observasi_teknis', label: 'Ceklis Teknis (Penguasaan Materi Inti Ekskul)', type: 'textarea' },
        { id: 'observasi_sikap', label: 'Ceklis Karakter (Sportivitas, Kepemimpinan, Kolaborasi)', type: 'textarea' }
      ],
      ai_prompt: "Sebagai Ahli Asesmen Kualitatif Cimega. Format nilai non-angka ini menjadi predikat kompetensi yang layak dipajang di Rapor.\n\nInstruksi Konversi Predikat:\n1. ASPEK HARD-SKILL: Rumuskan secara naratif apakah keahlian anak mengeksekusi instruksi: {{observasi_teknis}} pantas mendapat predikat Sangat Baik (A), Baik (B) atau Cukup (C).\n2. ASPEK SOFT-SKILL (KARAKTER): Puji dan evaluasi kebesaran hati (sportivitas) atau inisiatif kolaborasinya bersama tim berdasar rekaman kejadian ini: {{observasi_sikap}}. Hindari memvonis gagal untuk karakter bawaan, gunakan bahasa 'Membutuhkan Motivasi'."
    },
    {
      id: 'talent_mapping_prestasi',
      nama: 'Bank Data Prestasi (Talent Mapping)',
      icon: '🥇',
      components: [
        { id: 'identitas_unggulan', label: 'Nama Siswa Berbakat & Spesifikasi Keahliannya', type: 'textarea' },
        { id: 'riwayat_kompetisi', label: 'Riwayat Kejuaraan (Medali/Piagam FLS2N/O2SN)', type: 'textarea' }
      ],
      ai_prompt: "Tugas Anda adalah membedah dan mengarsip Dokumen Talent Scouting (Pemandu Bakat) tingkat Sekolah Dasar.\n\nTugas Peringkat Talenta:\n1. SPESIALISASI ATLET/SENIMAN: Klasifikasikan data siswa unggulan ini beserta peran terkuatnya (Misal: Udin / Kiper Utama Futsal) dari input mental: {{identitas_unggulan}}.\n2. CURRICULUM VITAE PRESTASI: Susun rekam jejak kemenangan mereka di tingkat kecamatan hingga provinsi menjadi resume yang siap diajukan untuk pendaftaran lomba bergengsi selanjutnya berdasarkan: {{riwayat_kompetisi}}."
    },
    {
      id: 'rapor_ekstrakurikuler',
      nama: 'Format Rapor Ekstrakurikuler',
      icon: '📜',
      components: [
        { id: 'predikat_kinerja', label: 'Predikat Akhir Kinerja Semester (Misal: Sangat Baik)', type: 'textarea' },
        { id: 'narasi_rapor_ekskul', label: 'Penyusunan Narasi Deskriptif Deskripsi Karakter Rapor Utama', type: 'textarea' }
      ],
      ai_prompt: "Berperanlah sebagai Penulis Narasi Rapot Pusat. Singkat seluruh riwayat keringat siswa selama enam bulan ini menjadi dua kalimat emas untuk e-Rapor Induk Sekolah.\n\nTemplate Penyimpulan:\nSambungkan skor kualitatif formalnya: {{predikat_kinerja}} dengan paragraf pujian lugas tapi mengena seputar pengasahan Dimensi Profil Pelajar Pancasila berdasar aktivitas spesifik ini: {{narasi_rapor_ekskul}}. (Contoh: 'Ananda memiliki daya juang Sangat Baik dalam pertunjukan teater, terbukti selalu mandiri menghafal naskahnya')."
    }
  ]
};
