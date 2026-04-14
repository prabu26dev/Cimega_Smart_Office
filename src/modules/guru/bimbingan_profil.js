window.GuruModules = window.GuruModules || {};

window.GuruModules['bimbingan_profil'] = {
  id: 'bimbingan_profil',
  title: 'Bimbingan & Profil Siswa',
  icon: '🚸',
  desc: 'Pusat rekam jejak psikologis, layanan BK dasar, dan catatan kepribadian anak.',
  items: [
    {
      id: 'profil_belajar',
      nama: 'Profil Belajar & Diagnostik',
      icon: '🆔',
      components: [
        { id: 'gaya_belajar', label: 'Peta Gaya Belajar (Visual, Auditori, Kinestetik)', type: 'textarea' },
        { id: 'minat_bakat', label: 'Pemetaan Potensi Minat & Bakat', type: 'textarea' },
        { id: 'kondisi_keluarga', label: 'Analisis Dukungan dan Kondisi Keluarga', type: 'textarea' }
      ],
      ai_prompt: "Bertindaklah sebagai Konselor Pendidikan / Guru BP Ahli. Satukan data mentah survei awal tahun anak didik saya menjadi Laporan Komprehensif Profil Belajar Siswa yang akan menjadi dasar kurikulum saya.\n\nInstruksi Pemrosesan Laporan:\n1. ASESMEN GAYA BELAJAR: Analisis kecenderungan gaya dominan di kelas ini berdasarkan input: {{gaya_belajar}}.\n2. PEMETAAN POTENSI: Rekomendasikan wadah ekskul atau intervensi bakat berlandaskan data: {{minat_bakat}}.\n3. LATAR BELAKANG KELUARGA: Uraikan sensitivitas pedagogis terkait pola asuh atau keterbatasan logistik dari laporan pemicu ini: {{kondisi_keluarga}}.\n\nHasilkan dokumen dengan format konseling empiris yang menjaga kerahasiaan namun dapat ditindaklanjuti (actionable)."
    },
    {
      id: 'catatan_anekdotal',
      nama: 'Buku Catatan Anekdotal',
      icon: '📝',
      components: [
        { id: 'kronologis', label: 'Hari/Tanggal, Nama Siswa, Kronologis Peristiwa', type: 'textarea' },
        { id: 'kasus', label: 'Deskripsi Pelanggaran / Perilaku Menonjol Positif', type: 'textarea' },
        { id: 'restitusi', label: 'Tindakan Penanganan (Segitiga Restitusi)', type: 'textarea' }
      ],
      ai_prompt: "Sebagai Ahli Disiplin Positif (pendekatan Disiplin Restitusi), formulasikan ulang insiden siswa berikut menjadi Catatan Anekdotal yang masuk akal dan adil secara psikologis.\n\nFakta Kejadian: {{kronologis}}.\nPerincian Peristiwa: Soroti latar emosi dan obyektivitas dari deskripsi asli ini: {{kasus}}.\nLangkah Restitusi Dialogis: Terjemahkan penanganan spontan ini menuju paradigma Segitiga Restitusi (Menstabilkan Identitas -> Validasi Tindakan Salah -> Menanyakan Keyakinan): {{restitusi}}.\n\nGunakan gaya penulisan dokumentasi perilaku resmi (behavioral log file)."
    },
    {
      id: 'komunikasi_ortu',
      nama: 'Buku Penghubung (Komunikasi Wali)',
      icon: '💌',
      components: [
        { id: 'pesan_guru', label: 'Pemberitahuan/Peringatan Akademik dari Guru', type: 'textarea' },
        { id: 'tanggapan', label: 'Catatan/Tanggapan Orang Tua (Jika ada)', type: 'textarea' },
        { id: 'tindak_lanjut', label: 'Rencana Pertemuan / Tindak Lanjut Berdua', type: 'textarea' }
      ],
      ai_prompt: "Berperanlah sebagai Pakar Mediasi Sekolah Keluarga. Susunlah Skrip Laporan Buku Penghubung Fisik (Surat Panggilan/Pemberitahuan ke Orang Tua) yang tidak menyinggung namun transparan.\n\nDraft Paragraf Utama dari Guru: Permulus penyampaian fakta ini: {{pesan_guru}} menjadi surat yang memberdayakan wali murid.\nLampirkan tanggapan wali sebelumnya sebagai rekam jejak: {{tanggapan}}.\nSusun ajakan tindak lanjut/pertemuan konseling yang bersahabat: {{tindak_lanjut}}.\n\nHasilkan draf berbentuk surat (Dear Bapak/Ibu Wali dari...) yang elegan dan hangat."
    }
  ]
};
