window.KordKokuModules = window.KordKokuModules || {};

window.KordKokuModules['manajemen_fasilitator'] = {
  id: 'manajemen_fasilitator',
  title: 'Manajemen Fasilitator',
  icon: '👥',
  desc: 'Pangkalan orkestrasi SK tim fasilitator, log rapat bimbingan, dan formulasi SOP proyek.',
  items: [
    {
      id: 'admin_sk_tim',
      nama: 'SK & Pembagian Tugas Tim',
      icon: '📜',
      components: [
        { id: 'daftar_fasilitas', label: 'Daftar Nama Guru Fasilitator & Kelas Dampingan', type: 'textarea' },
        { id: 'rincian_beban', label: 'Rincian Beban Kerja (Penilai, Dokumentasi, dsb)', type: 'textarea' }
      ],
      ai_prompt: "Berperanlah sebagai HRD Proyek Pendidikan. Konsolidasikan draf pembagian tugas ini menjadi Surat Keputusan (SK) Tim Fasilitator Kokurikuler yang mengikat secara formal.\n\nStruktur Regulasi:\n1. KONSIDERAN TUGAS: Jabarkan rasionalitas pembentukan tim sebagai amanat Kurikulum Merdeka.\n2. DISTRIBUSI KELAS: Tata ulang plotting guru-guru tangguh ini ke dalam kelompok kelasnya: {{daftar_fasilitas}}.\n3. URAIAN FUNGSI SPESIFIK (JOB DESK): Rincikan tanggung jawab masing-masing divisi (siapa koordinator, absen, pubdekdok) dari cikal bakal ini: {{rincian_beban}}."
    },
    {
      id: 'buku_kendali_rapat',
      nama: 'Buku Kendali & Notulensi Rapat',
      icon: '📝',
      components: [
        { id: 'agenda_briefing', label: 'Hari/Tanggal, Agenda Rapat (Persiapan/Evaluasi Kendala)', type: 'textarea' },
        { id: 'kehadiran_fasilitator', label: 'Tingkat Kehadiran Guru Fasilitator', type: 'textarea' },
        { id: 'kesepakatan', label: 'Tindak Lanjut & Kesepakatan Solusi Lapangan', type: 'textarea' }
      ],
      ai_prompt: "Sebagai Sekretaris Eksekutif (Notulis Rapat), buahkan Laporan Notulensi Koordinasi Evaluasi Proyek yang efektif tanpa bertele-tele.\n\nAnalisis Notulensi:\nFormat agenda rapat dan keluhan awal ini: {{agenda_briefing}}.\nLaporkan angka persentase kehadiran panitia untuk mengukur tingkat komitmen tim: {{kehadiran_fasilitator}}.\nSintesiskan perdebatan dan keluhan atas solusi yang diraih serta siapa yang ditunjuk untuk menyelesaikannya pada hari berikutnya (Action Items): {{kesepakatan}}."
    },
    {
      id: 'modul_sop_fasilitator',
      nama: 'Modul Panduan Fasilitator (SOP)',
      icon: '📘',
      components: [
        { id: 'skenario_dampingan', label: 'Skenario Arahan Pendampingan Siswa', type: 'textarea' },
        { id: 'pertanyaan_pemantik', label: 'Library Pertanyaan Pemantik (Deep Learning)', type: 'textarea' },
        { id: 'batasan_guru', label: 'Batasan Intervensi Guru vs Kemandirian Anak', type: 'textarea' }
      ],
      ai_prompt: "Anda ditugasi sebagai Instruktur Guru Penggerak. Ciptakan Panduan Standar Operasional (SOP) Manajemen Kelas Khusus Proyek agar guru di lapangan memiliki visi yang sama.\n\nKerangka SOP Pedagogik:\n1. SKENARIO PENGAMATAN: Berikan pedoman bagaimana fasilitator berkeliling memantau kelompok bukan menceramahi, berdasarkan gaya ini: {{skenario_dampingan}}.\n2. KATALOG PEMANTIK NALAR: Tata draf pertanyaan pemancing eksplorasi ini agar memancing HOTS tinggi di benak siswa: {{pertanyaan_pemantik}}.\n3. BATASAN ZONA NYAMAN: Tegaskan dengan diplomatis batas tipis antara \"membantu siswa\" dan \"mengerjakan tugas siswa\" berlandaskan: {{batasan_guru}}."
    }
  ]
};
