window.GuruPjokModules = window.GuruPjokModules || {};

window.GuruPjokModules['perencanaan_pjok'] = {
  id: 'perencanaan_pjok',
  title: 'Perencanaan PJOK Lintas Ruang',
  icon: '🏀',
  desc: 'Peta pembelajaran gerak jasmani yang berfokus pada manajemen keselamatan (risk) dan diferensiasi motorik.',
  items: [
    {
      id: 'analisis_cp_atp',
      nama: 'Analisis CP & ATP PJOK',
      icon: '🎯',
      components: [
        { id: 'elemen_pjok', label: 'Pemetaan Elemen Keterampilan, Pengetahuan, dan Internalisasi Nilai Gerak', type: 'textarea' },
        { id: 'tp_fase', label: 'Rumusan Tujuan Pembelajaran (TP) Berdasarkan Fase Perkembangan Fisik Anak', type: 'textarea' },
        { id: 'alur_atp', label: 'Alur Tujuan Pembelajaran Lintas Semester', type: 'textarea' }
      ],
      ai_prompt: "Anda adalah Pengembang Kurikulum Pendidikan Jasmani, Olahraga, dan Kesehatan (PJOK) Ahli. Secara komprehensif, telaah dan kembangkan rancangan dokumen Analisis Capaian Pembelajaran (CP) dan ATP ini.\n\nFokus Penjabaran Taktis:\n1. INTERNALISASI ELEMEN: Konversikan rumusan elemen gerak berikut menjadi narasi pembelajaran tidak sekadar fisik namun memuat muatan kognitif strategi bermain: {{elemen_pjok}}.\n2. RUMUSAN TP (HOTS DAN MOTORIK): Sempurnakan draf Tujuan Pembelajaran (TP) ini: {{tp_fase}}. Pastikan TP ini mendeskripsikan \"pemahaman melalui gerak\" (deep motor skill learning) sesuai level kematangan usianya.\n3. ALUR SEMESTRAL (ATP): Buat tabulasi Alur Tujuan Pembelajaran berkelanjutan dari input ini: {{alur_atp}}."
    },
    {
      id: 'modul_ajar_pjok',
      nama: 'Modul Ajar PJOK Berdiferensiasi & Manajemen Risiko',
      icon: '📖',
      components: [
        { id: 'identitas', label: 'Identitas Modul (Kelas/Semester/Durasi)', type: 'textarea' },
        { id: 'keselamatan', label: 'Manajemen Keselamatan (SOP Pemanasan & Pendinginan Khusus)', type: 'textarea' },
        { id: 'diferensiasi', label: 'Skenario Diferensiasi Praktik (Modifikasi Alat untuk Limitasi Fisik/Anak Inklusi)', type: 'textarea' },
        { id: 'praktik_asesmen', label: 'Tahapan Praktik Inti & Instrumen Asesmen', type: 'textarea' }
      ],
      ai_prompt: "Sebagai Ahli Pedagogik Olahraga dan Trainer Keselamatan (Safety Officer) Sekolah, formulasikan draf rancangan Modul Ajar PJOK Lengkap.\n\nStruktur Penulisan Mandatori:\n1. LATAR BELAKANG: {{identitas}}.\n2. PROTOKOL KESELAMATAN KETAT (SOP): Susun paragraf instruksional bagaimana alur pemanasan dan pencegahan cedera wajib dilakukan di lapangan berdasar ide ini: {{keselamatan}}.\n3. SKENARIO INKLUSIF BERDIFERENSIASI: Deskripsikan rencana jenius mengenai bagaimana memodifikasi peraturan, alat, atau durasi permainan agar siswa yang kurang mampu secara motorik tetap bisa mencapai tujuan pembelajaran: {{diferensiasi}}.\n4. KBM & ASESMEN: Tulis Rencana Tatap Muka Praktik Inti dan cara asesmen yang adil (fairplay) dari parameter ini: {{praktik_asesmen}}."
    },
    {
      id: 'kokurikuler_kesehatan',
      nama: 'Perencanaan Kokurikuler Kesehatan & Olahraga',
      icon: '🍎',
      components: [
        { id: 'desain_proyek', label: 'Desain Kampanye (Misal: Senam Kreasi, Kampanye Jajan Sehat Kantin)', type: 'textarea' },
        { id: 'alur_pelaksanaan', label: 'Alur Eksekusi Kegiatan Lapangan / Pameran', type: 'textarea' },
        { id: 'target_karakter', label: 'Target Karakter Profil Lulusan (Dimensi Kolaborasi & Mandiri)', type: 'textarea' }
      ],
      ai_prompt: "Berperanlah sebagai Ketua Koordinator Proyek Penguatan Profil Pelajar Pancasila (P5) Bidang Gaya Hidup Berkelanjutan dan Kesehatan Jasmani.\n\nBuat Konsep Proyek Kokurikuler Hebat:\n1. IDE KAMPANYE MASSAL: Kembangkan rasional dan kemenarikan ide utama ini menjadi aktivitas yang asik bagi siswa SD: {{desain_proyek}}.\n2. RUNDOWN ALUR EKSPLORASI: Susun tahap Pengenalan, Kontekstualisasi, Aksi, dan Tindak Lanjut dari ringkasan ini: {{alur_pelaksanaan}}.\n3. PARAMETER BUDI PEKERTI: Jelaskan apa indikator anak telah mencapai kemandirian fisik atau dapat berkolaborasi dalam tim dari sudut pandang ini: {{target_karakter}}."
    }
  ]
};
