window.GuruPjokModules = window.GuruPjokModules || {};

window.GuruPjokModules['asesmen_jasmani'] = {
  id: 'asesmen_jasmani',
  title: 'Asesmen Praktik & Karakter',
  icon: '📊',
  desc: 'Rekam nilai perpaduan motorik kasar, kognitif strategi olahraga, kualifikasi TKJI, dan sportivitas lapangan.',
  items: [
    {
      id: 'nilai_keterampilan',
      nama: 'Format Penilaian Keterampilan Gerak (Psikomotorik)',
      icon: '🤸',
      components: [
        { id: 'rubrik_praktik', label: 'Rubrik Observasi Praktik Olahraga Spesifik', type: 'textarea' },
        { id: 'tingkat_penguasaan', label: 'Tingkat Penguasaan Motorik (Awal, Berkembang, Mahir)', type: 'textarea' },
        { id: 'catatan_remedial', label: 'Catatan Rencana Remedial / Penguatan Otot', type: 'textarea' }
      ],
      ai_prompt: "Sebagai Akuntan Kebugaran Fisik (Assessor PJOK), buat Draf Laporan Daftar Nilai Psikomotorik Jasmani yang valid.\n\nDapur Data:\n- INDIKATOR GERAK: Berdasarkan jenis olahraga yang dirubrikasi ini: {{rubrik_praktik}}.\n- ANALISIS KUALITATIF MOTORIK: Ubah label angka rentang ini menjadi narasi kemampuan jasmani murni: {{tingkat_penguasaan}}.\n- PRESKRIPSI LATIHAN (REMEDIAL): Rancang saran pelatihan otot dasar di rumah (home workout) atau saran keselamatan dari data ini: {{catatan_remedial}}."
    },
    {
      id: 'nilai_kognitif',
      nama: 'Daftar Nilai Pengetahuan Teori',
      icon: '🧠',
      components: [
        { id: 'teori_olahraga', label: 'Nilai Formatif/Sumatif Aturan Main & Strategi', type: 'textarea' },
        { id: 'teori_kesehatan', label: 'Nilai Teori Kesehatan (Bahaya Rokok, Gizi, Kebersihan Tubuh)', type: 'textarea' },
        { id: 'deskripsi_rapor', label: 'Draft Deskripsi Rapor Gabungan Kognitif', type: 'textarea' }
      ],
      ai_prompt: "Anda adalah Guru Ilmu Faal dan Teori Olahraga. Konsolidasikan nilai kognitif keilmuan PJOK ini ke dalam format Deskripsi Buku Pengetahuan (Cognitive Ledger) yang resmi.\n\nFokus Analisis Laporan:\n1. PEMAHAMAN ATURAN PERMAINAN: Evaluasi penguasaan teori taktik berbasis ini: {{teori_olahraga}}.\n2. LITERASI KESEHATAN ANAK: Rangkum ketercapaian dan empati siswa terkait materi vital kesehatan (UKS/Gizi) ini: {{teori_kesehatan}}.\n3. FINALISASI DESKRIPSI RAPOR: Buatkan paragraf evaluasi deskriptif wali studi bidang yang formal dan humanis untuk diinput ke DAPODIK: {{deskripsi_rapor}}."
    },
    {
      id: 'kebugaran_tkji',
      nama: 'Buku Catatan Kebugaran (TKJI)',
      icon: '💪',
      components: [
        { id: 'data_antropometri', label: 'Data Tinggi Badan (TB), Berat Badan (BB), & Indeks Massa Tubuh (IMT)', type: 'textarea' },
        { id: 'hasil_tes_tkji', label: 'Hasil Tes Ketahanan (Lari, Push-Up/Sit-Up, Kelenturan)', type: 'textarea' },
        { id: 'rekomendasi_gizi', label: 'Catatan Khusus Pertumbuhan / Rekomendasi Gizi', type: 'textarea' }
      ],
      ai_prompt: "Anda berkapasitas sebagai Dokter Muda / Ahli Kinesiologi Sekolah (Pelaksana TKJI). Buatkan narasi Eksekutif Pemantauan Pertumbuhan Anatomi Anak.\n\nInstruksi Struktur Medis-Asesmen:\nTulis analisis kalkulasi rasio pertumbuhan kesehatan (Stunting/Obesitas/Normal) berdasarkan rekap TB/BB/IMT berikut: {{data_antropometri}}.\nKonversikan angka ketahanan fisik kasar ini menjadi analisis tingkat kebugaran kardiovaskular dan otot: {{hasil_tes_tkji}}.\nRumuskan rekomendasi perbaikan diet & gaya hidup sehat berdasarkan masalah yang terbaca: {{rekomendasi_gizi}}."
    },
    {
      id: 'observasi_sportivitas',
      nama: 'Lembar Observasi Sportivitas (Afektif P5)',
      icon: '🤝',
      components: [
        { id: 'indikator_fairplay', label: 'Indikator Sportivitas (Kerjasama, Menerima Kekalahan, Taat Wasit)', type: 'textarea' },
        { id: 'skala_afektif', label: 'Skala Frekuensi Perilaku Baik dalam Pertandingan', type: 'textarea' },
        { id: 'insiden_bentrokan', label: 'Jurnal Kasus Khusus (Perselisihan Lapangan / Solidaritas Tinggi)', type: 'textarea' }
      ],
      ai_prompt: "Sebagai Wasit Profesional dan Ahli Psikologi Olahraga. Anda ditugaskan melaporkan Jurnal Observasi Perilaku Moral Olahraga (Fairplay Record) milik siswa.\n\nSikapi dan rangkum pilar-pilar sikap tanding positif ini: {{indikator_fairplay}} dan terjemahkan frekuensinya ke laporan formal: {{skala_afektif}}.\nApabila terdapat kasus tabrakan ego, pelanggaran keras berujung konflik, ATAU momen solidaritas saling tolong yang terekam, urai dengan kacamata pembina karakter: {{insiden_bentrokan}}."
    }
  ]
};
