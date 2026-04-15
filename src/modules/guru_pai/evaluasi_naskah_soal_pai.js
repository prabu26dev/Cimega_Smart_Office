window.GuruPaiModules = window.GuruPaiModules || {};

window.GuruPaiModules['evaluasi_naskah_soal_pai'] = {
  id: 'evaluasi_naskah_soal_pai',
  title: 'Naskah Soal & Evaluasi Praktik',
  icon: '📿',
  desc: 'Pusat pembuatan instrumen Kognitif Terpadu (HOTS) dan pencetakan Lembar Observasi Praktik (Wudhu/Shalat/BTQ).',
  items: [
    {
      id: 'prates_perencanaan_pai',
      nama: 'Pemetaan TP & Kisi-Kisi Ganda',
      icon: '🗺️',
      components: [
        { id: 'pemetaan_5elemen', label: 'Beban Ujian per 5 Elemen (Al-Qur\'an, Aqidah, Fikih, Akhlak, SPI)', type: 'textarea' },
        { id: 'kisi_kognitif', label: 'Kisi-Kisi Tertulis (Indikator Soal & Dominasi HOTS)', type: 'textarea' },
        { id: 'kisi_praktik', label: 'Kisi-Kisi Praktik (Indikator Unjuk Kerja Ibadah Kasat Mata)', type: 'textarea' }
      ],
      ai_prompt: "Sebagai Ahli Evaluasi Pendidikan Agama Islam. Pecah beban ujian ini agar tidak murni hafalan.\n\nFokus Kisi-Kisi Ganda:\n1. PEMETAAN SEIMBANG: Valuasi proporsi elemen pada draf: {{pemetaan_5elemen}} untuk menentukan mana yang harus diuji di kertas dan mana yang mutlak harus dipraktikkan.\n2. KISI-KISI KOGNITIF (HOTS): Ubah rumusan indikator tertulis dari draf: {{kisi_kognitif}} menjadi level L3 (Misal: Siswa disuruh menganalisis kisah teladan kenabian, bukan menghafal tanggal lahir Nabi).\n3. KISI-KISI PRAKTIK: Rangkai instruksi terukur untuk uji unjuk kerja observasi gerakan berdasarkan: {{kisi_praktik}}."
    },
    {
      id: 'instrumen_soal_observasi',
      nama: 'Bank Stimulus & Lembar Observasi Praktik',
      icon: '📜',
      components: [
        { id: 'stimulus_dilema_moral', label: 'Bank Stimulus (Kisah Hikmah, Ayat Al-Qur\'an, Dilema Moral Aktual)', type: 'textarea' },
        { id: 'kartu_soal_tertulis', label: 'Kartu Soal Kognitif (Pertanyaan terbuka / Pengecoh)', type: 'textarea' },
        { id: 'rubrik_praktik_btq', label: 'Rubrik Detail Praktik (Makhrijul Huruf, Tuma\'ninah, Niat)', type: 'textarea' }
      ],
      ai_prompt: "Berperanlah sebagai Penulis Soal Agama Berwawasan Kontekstual. Hindari ujian yang mencetak generasi dogmatis buta.\n\nTugas Konstruksi Instrumen:\n1. STUDI KASUS MORAL: Gubah ide pemicu dari: {{stimulus_dilema_moral}} menjadi studi kasus akhlak kehidupan nyata (Contoh: Menemukan uang di area sekolah) sebagai stimulus naskah soal berbasis *Deep Learning*.\n2. VALIDASI KARTU SOAL: Telaah tingkat kesulitan dan objektivitas abstraksi pilihan ganda pada: {{kartu_soal_tertulis}}.\n3. MATRIKS OBSERVASI: Bangun Rubrik Skoring absolut untuk ujian praktik Ibadah/BTQ berdasar poin-poin: {{rubrik_praktik_btq}} agar subjek penguji tidak bias dalam menilai tingkat kelancaran bacaan Al-Qur'an anak."
    },
    {
      id: 'validasi_telaah_sara',
      nama: 'Lembar Telaah / Sensor Soal (KKG PAI)',
      icon: '🔎',
      components: [
        { id: 'telaah_bebas_radikalisme', label: 'Inspeksi Bias Mazhab & Radikalisme pada Stimulus Soal', type: 'textarea' },
        { id: 'telaah_kesesuaian_usia', label: 'Inspeksi Kesesuaian Bahasa & Tingkat Materi Usia SD', type: 'textarea' }
      ],
      ai_prompt: "Tugas Anda adalah sebagai Tim Filter KKG (Kelompok Kerja Guru PAI). Lakukan Quality Control ketat.\n\nInstruksi Sensor Moderasi Beragama:\n1. MODERASI & TOLERANSI: Lakukan pemindaian ekstrem terhadap kemungkinan lolosnya butir soal/bacaan yang membahayakan doktrin Pancasila atau mendiskreditkan mazhab lain merujuk: {{telaah_bebas_radikalisme}}.\n2. RAMAH ANAK: Sederhanakan bahasa teologis tingkat tinggi agar sesuai dengan kapasitas logika anak Sekolah Dasar berdasar draf: {{telaah_kesesuaian_usia}}."
    },
    {
      id: 'administrasi_lintas_kelas',
      nama: 'Administrasi Ujian Lintas Rombel',
      icon: '📂',
      components: [
        { id: 'jadwal_praktik_tulis', label: 'Pecahan Jadwal Ujian per Kelas (Praktik & Tulis)', type: 'textarea' },
        { id: 'berita_acara_insiden', label: 'Berita Acara Kejadian Khusus (Anak Gagal Praktik/Titipan Remidi)', type: 'textarea' }
      ],
      ai_prompt: "Sebagai Koordinator Ujian Lintas Kelas. Tata pergerakan logistik ratusan murid Anda.\n\nPenugasan Organisasi Meja:\nSusun format kalender matriks rotasi antar kelas A dan B pada pengawasan Ujian Praktik/Tulis berdasar draf mentah: {{jadwal_praktik_tulis}}.\nRumuskan laporan hukum (Berita Acara) untuk mencatatkan kronologi murid yang sama sekali masih buta huruf Hijaiyah sehingga harus diikutkan kelas BTQ tambahan, dari input kasuistik: {{berita_acara_insiden}}."
    },
    {
      id: 'pascates_analisis_ibadah',
      nama: 'Analisis Kuantitatif & Progres Ibadah',
      icon: '📈',
      components: [
        { id: 'analisis_dayaserap', label: 'Matriks Ketuntasan Soal Tertulis (Kognitif)', type: 'textarea' },
        { id: 'rekapitulasi_ibadah', label: 'Pemetaan Ketuntasan Praktik Wudhu/Shalat', type: 'textarea' },
        { id: 'intervensi_btq_hafalan', label: 'Rencana Praktik Ulang & Tutor Sebaya (Enrichment)', type: 'textarea' }
      ],
      ai_prompt: "Anda ditugaskan sebagai Evaluator Internal Kemenag. Data ini menentukan di mana kegagalan dakwah pengajaran berada.\n\nInstruksi Post-Mortem Pendidikan Agama:\n1. DIAGNOSA TEORI: Tarik kesimpulan mengapa TP Hukum Tajwid di soal teori banyak yang merah berdasar data daya serap: {{analisis_dayaserap}}.\n2. PEMETAAN PERILAKU: Buat narasi Rapor terkait proporsi kelas yang sukses menjalankan rukuk dengan *tuma'ninah* dari laporan praktik ini: {{rekapitulasi_ibadah}}.\n3. RTL (Rencana Tindak Lanjut): Rancang intervensi yang tidak membebani moral (seperti Remedial Ulang Shalat secara *privat* agar anak tidak malu ditertawakan kelas), serta jadikan anak cerdas sebagai Tutor Sebaya berdasar arahan intervensi/pengayaan ini: {{intervensi_btq_hafalan}}."
    }
  ]
};
