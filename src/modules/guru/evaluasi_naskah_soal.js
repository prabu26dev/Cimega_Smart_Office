window.GuruModules = window.GuruModules || {};

window.GuruModules['evaluasi_naskah_soal'] = {
  id: 'evaluasi_naskah_soal',
  title: 'Naskah Soal & Bank Evaluasi',
  icon: '📝',
  desc: 'Pusat pembuatan instrumen ujian: Kisi-kisi, Naskah Soal Deep Learning, Validasi, hingga Analisis Butir Soal.',
  items: [
    {
      id: 'prates_kisi_kisi',
      nama: 'Pemetaan & Kisi-Kisi Ujian',
      icon: '🗺️',
      components: [
        { id: 'pemetaan_tp', label: 'Daftar Tujuan Pembelajaran & Persentase Tes (Lingkup/Semester)', type: 'textarea' },
        { id: 'indikator_level', label: 'Indikator Soal (ABCD) & Komposisi Level Kognitif (Minimal 40% L3/HOTS)', type: 'textarea' },
        { id: 'bentuk_bobot', label: 'Bentuk Soal (PG, Isian, Uraian) & Bobot Skor Per Soal', type: 'textarea' }
      ],
      ai_prompt: "Sebagai Pakar Evaluasi Pendidikan Dasar. Terjemahkan draf mentah ini menjadi Kisi-Kisi Cetak Biru Ujian yang memenuhi standar Deep Learning.\n\nInstruksi Kisi-Kisi:\n1. ANALISIS KOGNITIF: Pastikan narasi Indikator ABC (Audience, Behavior, Condition) yang Anda cetak menuntut penalaran, bukan sebatas hapalan, merujuk usulan: {{indikator_level}}.\n2. DISTRIBUSI BOBOT: Rangkai matriks adil sebaran bentuk soal dan bobot kemerataan nilainya berdasar referensi ini: {{bentuk_bobot}} sedemikian rupa agar adil dengan tingkat kesulitan TP yang diuji di: {{pemetaan_tp}}."
    },
    {
      id: 'instrumen_soal_rubrik',
      nama: 'Bank Stimulus, Naskah Soal & Rubrik',
      icon: '📄',
      components: [
        { id: 'bank_stimulus', label: 'Draf Stimulus Soal (Artikel, Infografis, Tabel, Kasus Fiktif) + Sitasi', type: 'textarea' },
        { id: 'draft_pertanyaan', label: 'Kartu Soal Utama & Pilihan Pengecoh / Distraktor (Khusus PG)', type: 'textarea' },
        { id: 'rubrik_analitik', label: 'Buku Kunci Jawaban & Rubrik Penskoran Berjenjang (Skor 0-4)', type: 'textarea' }
      ],
      ai_prompt: "Posisikan spesialisasi Anda sebagai Reviewer Soal HOTS tingkat SD. Komponensasi uji evaluasi ini menjadi set intrumen yang valid secara epistemologi.\n\nFokus Naskah Ujian:\n1. KONSTRUKSI STIMULUS: Tata penggalan artikel stimulus ini menjadi paragraf bacaan yang kaya literasi (Deep Text) tanpa memuat SARA berdasarkan: {{bank_stimulus}}.\n2. ANALISIS DISTRAKTOR: Beri koreksi teoretis jika rancangan soal dan pengecoh (pilihan jawaban) yang ditulis pada: {{draft_pertanyaan}} tidak homogen atau terkesan asal-asalan mencampur jawaban ganjil.\n3. RUBRIK SKORING: Kembangkan pedoman penskoran yang berjenjang (Analisis Skor 0-4) yang jelas untuk soal uraian/esai berdasarkan masukan kunci ini: {{rubrik_analitik}}."
    },
    {
      id: 'validasi_telaah_soal',
      nama: 'Lembar Telaah / Validasi QC Tes',
      icon: '🔎',
      components: [
        { id: 'telaah_materi', label: 'Inspeksi Aspek Materi (Kesesuaian Indikator dengan Soal)', type: 'textarea' },
        { id: 'telaah_konstruksi_bahasa', label: 'Inspeksi Konstruksi Pilihan/Gambar & Kesopanan Bahasa (EYD)', type: 'textarea' }
      ],
      ai_prompt: "Berperanlah sebagai Quality Control (QC) Asesmen Sekolah. Lakukan *Proof-reading* kritis terhadap draf soal guru.\n\nTugas Telaah/Verifikasi:\n1. KESALAHAN METODOLOGI: Tarik catatan merah/koreksi apakah ada perntanyaan yang ambigu secara materi dari temuan: {{telaah_materi}}.\n2. PEMBEDAHAN LINGUISTIK: Temukan kesalahan tata bahasa atau kalimat tanya ganda yang tidak sesuai tingkat pemahaman usia anak SD berdasarkan draf: {{telaah_konstruksi_bahasa}}."
    },
    {
      id: 'administrasi_pelaksanaan_tes',
      nama: 'Administrasi Ruang Ujian (Sumatif)',
      icon: '📐',
      components: [
        { id: 'absen_beritaacara', label: 'Daftar Hadir & Berita Acara Ujian (Catatan Kejadian Penting)', type: 'textarea' },
        { id: 'tatatertib_kesepakatan', label: 'Tata Tertib / Pakta Kesepakatan Larangan Curang di Kelas', type: 'textarea' }
      ],
      ai_prompt: "Sebagai Pengawas Silang Ujian Nasional. Rapikan format administrasi meja fisik agar ujian tampak formal dan mengikat secara prosedural.\n\nTugas Kepengawasan Ruang:\nSajikan format Laporan Berita Acara sah yang merangkum keseluruhan absen dan kondisi insidensial (contoh: anak sakit saat ujian/revisi soal) bersumber pada: {{absen_beritaacara}}.\nTata kalimat peraturan: {{tatatertib_kesepakatan}} menjadi diksi *Do* and *Donts* yang mudah dihafal murid sebelum menundukkan kepala."
    },
    {
      id: 'pascates_analisis_tindakan',
      nama: 'Analisis Butir & Tindak Lanjut',
      icon: '📈',
      components: [
        { id: 'analisis_kuantitatif', label: 'Matriks Data Kuantitatif (Daya Serap, Kesukaran, Daya Beda)', type: 'textarea' },
        { id: 'rekapitulasi_kualitatif', label: 'Rekap Kualitatif (TP mana yang tuntas/Gagal Klasikal)', type: 'textarea' },
        { id: 'buku_remedial_pengayaan', label: 'Rencana Remedial (Bimbingan Spesifik) & Pengayaan Materi', type: 'textarea' }
      ],
      ai_prompt: "Anda ditugaskan sebagai Ilmuwan Data Pendidikan. Tugas terberat Pendidik adalah mengolah raw data ujian menjadi keputusan *Tindak Lanjut*.\n\nInstruksi Bedah Data Post-Mortem:\n1. FORENSIK ANGKA: Tafsirkan daya beda dan persentase kesulitan klasikal dari matriks statistik mentah ini: {{analisis_kuantitatif}}.\n2. EKSTRAKSI KEGAGALAN: Susun paragraf narasi kesimpulan memaparkan TP / Modul mana persisnya yang gagal diajarkan oleh guru berdasarkan tren: {{rekapitulasi_kualitatif}}.\n3. MANAJEMEN PENYELAMATAN (RTL): Susun matriks program Remedial khusus bagi mereka yang tak mencapai KKTP tanpa menghukum, dan buat saran penugasan 'Mendalam' (*Enrichment*) bagi kelompok *fast learners* dari draf ini: {{buku_remedial_pengayaan}} agar mereka tak bosan."
    }
  ]
};
