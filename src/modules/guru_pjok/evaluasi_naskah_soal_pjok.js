window.GuruPjokModules = window.GuruPjokModules || {};

window.GuruPjokModules['evaluasi_naskah_soal_pjok'] = {
  id: 'evaluasi_naskah_soal_pjok',
  title: 'Naskah Soal & Ujian Lapangan',
  icon: '🏟️',
  desc: 'Sentra Pembuatan Soal Tulis Kesehatan (HOTS), Rubrik Penilaian Praktik/Kinestetik, & SOP Ujian.',
  items: [
    {
      id: 'prates_kisi_kisi_pjok',
      nama: 'Pemetaan Teori & Kisi-Kisi Praktik',
      icon: '🗺️',
      components: [
        { id: 'pemetaan_ujian_jasmani', label: 'Proporsi Bobot Ujian Praktik (Lapangan) vs Tulis (Teori Kesehatan)', type: 'textarea' },
        { id: 'kisi_tulis_kesehatan', label: 'Kisi-Kisi Soal Tulis (Berdasar Indikator HOTS)', type: 'textarea' },
        { id: 'kisi_praktik_biomekanik', label: 'Kisi-Kisi Praktik Lapangan (Fase Awal, Pelaksanaan, Fase Akhir)', type: 'textarea' }
      ],
      ai_prompt: "Sebagai Ahli Evaluasi Pendidikan Olahraga. Matangkan struktur pra-tes (Kisi-kisi) ini agar memadukan unsur Biomekanika dan Kesehatan.\n\nInstruksi Penyusunan:\n1. KALIBRASI BOBOT: Pastikan usulan proporsi praktik/kognitif dari masukan: {{pemetaan_ujian_jasmani}} cukup logis menurut porsi kurikulum PJOK.\n2. KOGNITIF (HOTS) KESEHATAN: Desain indikator soal taktis berdasar: {{kisi_tulis_kesehatan}} yang mendorong analitika siswa dalam memecahkan skenario cedera/gizi buruk.\n3. KINETIK/PRAKTIK: Bagi indikator gerakan: {{kisi_praktik_biomekanik}} secara sistematis menjadi 3 fase mutlak (Sikap Awal -> Kontak Inti -> Sikap Akhir) agar penilai tahu detail mana yang dinilai."
    },
    {
      id: 'instrumen_soal_rubrik_pjok',
      nama: 'Bank Stimulus Taktik & Naskah Praktik',
      icon: '📄',
      components: [
        { id: 'stimulus_taktik_kesehatan', label: 'Bank Stimulus (Ilustrasi Sudut Gerak, Infografis Gizi Kantin)', type: 'textarea' },
        { id: 'draft_pertanyaan_teori', label: 'Kartu Soal Tulis (HOTS) beserta Distraktor', type: 'textarea' },
        { id: 'rubrik_observasi_gerak', label: 'Rubrik Skoring Praktik & Lembar Penilaian Fairplay (Afektif)', type: 'textarea' }
      ],
      ai_prompt: "Berperanlah sebagai Dosen Penjaskes. Rancang instrumen validitas untuk tes kelenturan fungsi nalar dan otot.\n\nFokus Naskah Instrumen:\n1. ILUSTRASI TAKTIKAL: Kembangkan ide dasar dari: {{stimulus_taktik_kesehatan}} menjadi Skenario Taktik Strategi (Misalnya disajikan kasus formasi serang sepakbola) yang memaksa siswa berpikir kritis menjawab: {{draft_pertanyaan_teori}}.\n2. RUBRIK UNJUK KERJA: Ciptakan level penilaian berjenjang yang tegas (Penilaian 4-3-2-1) atas presisi dan akurasi gerak murid saat mengeksekusi instruksi ini: {{rubrik_observasi_gerak}}."
    },
    {
      id: 'validasi_keamanan_alat',
      nama: 'Lembar Verifikasi Keselamatan (SOP)',
      icon: '🛡️',
      components: [
        { id: 'validasi_alat_fasilitas', label: 'Verifikasi Modifikasi Alat (Tolak Peluru dgn Bola Kasti Pasir)', type: 'textarea' },
        { id: 'validasi_resiko_cedera', label: 'Verifikasi Tingkat Bahaya Skenario Praktik', type: 'textarea' }
      ],
      ai_prompt: "Tugas Anda adalah sebagai Komite Manajemen Risiko Sekolah (Safety Officer). Siswa SD dilarang keras cedera di bawah pengawasan Anda.\n\nTugas Sensor Keamanan:\n1. MODIFIKASI ERGONOMIS: Setujui atau ubah rancangan ujian penggunaan alat ini: {{validasi_alat_fasilitas}} jika dinilai menabrak standar keamanan persendian tulang anak usia SD.\n2. MITIGASI KECELAKAAN: Tetapkan prosedur pencegahan kecelakaan dasar bila ada ujian berisiko dari draf: {{validasi_resiko_cedera}}."
    },
    {
      id: 'administrasi_pelaksanaan_lapangan',
      nama: 'Administrasi Lapangan & Berita Acara',
      icon: '📋',
      components: [
        { id: 'sop_pemanasan', label: 'SOP Pemanasan (Warming Up) & Konfirmasi Rekam Medis (Asma/Flu)', type: 'textarea' },
        { id: 'absen_beritaacara_cedera', label: 'Daftar Hadir Lapangan & Berita Acara Kendala/Cedera Harian', type: 'textarea' }
      ],
      ai_prompt: "Sebagai Wasit / Pengawas Ujian Praktik Lapangan. Anda memegang kendali atas ketertiban dan keselamatan kelas.\n\nTugas Pengawasan Ujian:\nBahas urgensi tata laksana pemanasan dan tanya-jawab riwayat medis sebelum bel mulai dibunyikan sesuai standar di: {{sop_pemanasan}}.\nFormatkan pelaporan kecelakaan fiktif/aktual (Berita Acara) yang mendokumentasikan log penanganan cepat P3K atas cedera anak dan konsekuensi penundaan skor berbekal informasi: {{absen_beritaacara_cedera}}."
    },
    {
      id: 'pascates_analisis_kinestetik',
      nama: 'Analisis Motorik & Talent Scouting',
      icon: '📈',
      components: [
        { id: 'analisis_kognitif', label: 'Data Kesukaran Soal Tulis (Teori Pola Sehat/Narkoba)', type: 'textarea' },
        { id: 'rekap_hambatan_motorik', label: 'Ringkasan Hambatan Motorik Kelas (Misal: 60% salah bertumpu)', type: 'textarea' },
        { id: 'remedial_alat_o2sn', label: 'Modifikasi Jarak (Remedial) & Daftar Bakat Kinestetik (O2SN)', type: 'textarea' }
      ],
      ai_prompt: "Anda ditugaskan sebagai Ilmuwan Keolahragaan & Pemandu Bakat (Scout). Data pasca-tes ini mengungkap kesehatan fisik jangka panjang penerus bangsa.\n\nInstruksi Bedah Data Fisik:\n1. EVALUASI LITERASI KESEHATAN: Bongkar letak masalah pemahaman kesehatan (teori) murid jika banyak yang gagal merujuk pada: {{analisis_kognitif}}.\n2. HAMBATAN BIOMEKANIK: Susun laporan kualitatif terkait kesalahan gerakan massal (kesulitan koordinasi) yang dominan dan paling sering muncul di kelas dari keluhan: {{rekap_hambatan_motorik}}.\n3. MODIFIKASI KLINIS & PRESTASI: Untuk siswa yang lemah ototnya, kurangi beban alat tanpa menyakitinya sebagai langkah intervensi Remidi. Dan nominasikan anak yang paling gesit dari daftar ini: {{remedial_alat_o2sn}} untuk dipromosikan ke Pusat Latihan O2SN sekolah."
    }
  ]
};
