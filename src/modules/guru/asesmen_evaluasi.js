window.GuruModules = window.GuruModules || {};

window.GuruModules['asesmen_evaluasi'] = {
  id: 'asesmen_evaluasi',
  title: 'Asesmen & Evaluasi',
  icon: '📈',
  desc: 'Perekaman jejak akademik dan karakter formatif-sumatif.',
  items: [
    {
      id: 'daftar_nilai',
      nama: 'Buku Daftar Nilai (Intrakurikuler)',
      icon: '📘',
      components: [
        { id: 'diagnostik', label: 'Hasil Asesmen Awal (Diagnostik Siswa Klasikal)', type: 'textarea' },
        { id: 'formatif', label: 'Rekap Nilai Formatif (Proses Belajar)', type: 'textarea' },
        { id: 'sumatif', label: 'Nilai Sumatif (Akhir Lingkup Materi)', type: 'textarea' },
        { id: 'kompetensi', label: 'Catatan Kualitatif Penguasaan Kompetensi', type: 'textarea' }
      ],
      ai_prompt: "Anda adalah Guru Pengolah Data Akademik. Saya membutuhkan Deskripsi Rapor/Narasi Penilaian Harian untuk diisikan ke buku Daftar Nilai Intrakurikuler.\n\nInstruksi Pemrosesan:\n1. DIAGNOSIS AWAL: Rangkum pemetaan awal kelas ini: {{diagnostik}}.\n2. RATING FORMATIF: Analisis kecenderungan kemajuan siswa berdasarkan nilai observasi formatif: {{formatif}}.\n3. CAPAIAN SUMATIF: Evaluasi tingkat ketuntasan nilai akhir: {{sumatif}}.\n4. NARASI INTERVENSI: Susun draf paragraf umpan balik (feedback) kompetensi akademik yang dikuasai vs yang butuh remedial/pengayaan berdasarkan: {{kompetensi}}.\n\nGunakan gaya bahasa evaluasi pendidikan pedagogik."
    },
    {
      id: 'observasi_kokurikuler',
      nama: 'Lembar Observasi Karakter (Kokurikuler)',
      icon: '🔍',
      components: [
        { id: 'profil_indikator', label: 'Indikator Profil Lulusan / Elemen P5 Terpilih', type: 'textarea' },
        { id: 'skala', label: 'Ceklis Skala Perkembangan Mayoritas Kelas', type: 'textarea' },
        { id: 'catatan_kolaborasi', label: 'Catatan Deskriptif Perilaku & Kolaborasi Siswa', type: 'textarea' }
      ],
      ai_prompt: "Sebagai Fasilitator P5 Berpengalaman, konversi catatan lapangan saya menjadi Laporan Rapor Karakter Proyek secara kualitatif.\n\n1. INDIKATOR PROFIL: Hubungkan tujuan ini: {{profil_indikator}}.\n2. SKALA PERKEMBANGAN: Uraikan maknanya secara nalar dari nilai ceklis berikut (misal: MB, BSH, SB): {{skala}}.\n3. DESKRIPSI ANTEKOD: Buat paragraf deskripsi naratif otentik menceritakan perubahan perilaku kolaborasi siswa di lapangan berdasarkan: {{catatan_kolaborasi}}.\n\nOutput tidak boleh kaku, harus mencerahkan (insightful) bagi wali murid yang membacanya."
    },
    {
      id: 'buku_rapor',
      nama: 'Buku Rapor Siswa Terpadu',
      icon: '📂',
      components: [
        { id: 'nilai_angka', label: 'Tabel/Rekap Nilai Angka Mapel', type: 'textarea' },
        { id: 'narasi_akademik', label: 'Narasi/Deskripsi Capaian Kompetensi Akademik', type: 'textarea' },
        { id: 'narasi_karakter', label: 'Narasi Pertumbuhan Karakter Terintegrasi', type: 'textarea' },
        { id: 'kehadiran', label: 'Rekapitulasi Kehadiran & Ekstrakurikuler', type: 'textarea' }
      ],
      ai_prompt: "Anda bertugas sebagai Wali Kelas di akhir semester. Rangkum seluruh input nilai di bawah menjadi Deskripsi Buku Rapor Siswa yang final, komprehensif, dan siap cetak.\n\nKompilasi Data Mentah:\n- Kuantitatif: {{nilai_angka}}\n- Kualitatif Akademik: {{narasi_akademik}}\n- Kualitatif Karakter (P5): {{narasi_karakter}}\n- Kehadiran & Ekskul: {{kehadiran}}\n\nTugas Utama: Formulasikan dan poles narasi catatan wali kelas yang menyentuh hati (heartwarming) tanpa menutupi area yang butuh perbaikan untuk ditandatangani Kepala Sekolah. Tulis dalam struktur yang rapi (Pendahuluan, Sorotan Akademik, Sorotan Karakter, Kesimpulan Wali Kelas)."
    }
  ]
};
