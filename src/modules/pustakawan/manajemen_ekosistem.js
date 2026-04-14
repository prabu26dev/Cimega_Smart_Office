window.PustakawanModules = window.PustakawanModules || {};

window.PustakawanModules['manajemen_ekosistem'] = {
  id: 'manajemen_ekosistem',
  title: 'Ekosistem Literasi',
  icon: '🌱',
  desc: 'Pangkalan penyusunan Program Kerja Tahunan, Regulasi Tata Tertib, dan Rekrutmen Duta Literasi Cilik.',
  items: [
    {
      id: 'proker_perpustakaan',
      nama: 'Program Kerja & RAB Perpustakaan',
      icon: '🏛️',
      components: [
        { id: 'visi_target_buku', label: 'Visi Misi & Target Penambahan Koleksi Tahunan', type: 'textarea' },
        { id: 'program_gls', label: 'Rencana Program Gerakan Literasi Sekolah (GLS)', type: 'textarea' },
        { id: 'rab_literasi', label: 'RAB (Rencana Anggaran Biaya) Pengajuan ke BOS', type: 'textarea' }
      ],
      ai_prompt: "Sebagai Kepala Perpustakaan (Knowledge Manager). Rancang Program Kerja Tahunan yang membuktikan literasi itu tidak membosankan.\n\nDesain Manajerial Literasi:\n1. ACARA LITERASI (GLS): Formulasikan kampanye Gerakan Literasi Sekolah (GLS) yang interaktif berdasar ide mentah: {{program_gls}} agar anak mau ke perpustakaan tanpa dipaksa.\n2. ADVOKASI ANGGARAN: Buat justifikasi birokratis yang kuat kepada Kepsek dan Bendahara BOS mengapa kita butuh dana sebesar ini: {{rab_literasi}} untuk membeli target buku baru seperti ide di: {{visi_target_buku}} agar anggaran tidak dicoret."
    },
    {
      id: 'regulasi_tatatertib',
      nama: 'Regulasi & Tata Tertib',
      icon: '📜',
      components: [
        { id: 'aturan_peminjaman', label: 'Batas Maksimal Buku, Durasi, & Jam Operasional', type: 'textarea' },
        { id: 'sanksi_kerusakan', label: 'SOP Sanksi / Ganti Rugi jika Buku Rusak/Hilang', type: 'textarea' }
      ],
      ai_prompt: "Tugas Anda adalah memodernisasi aturan lama perpustakaan menjadi regulasi yang tegas namun humanis.\n\nInstruksi Regulasi: \n1. SIRKULASI: Tulis ulang aturan peminjaman dari input kasar: {{aturan_peminjaman}} dengan tata bahasa resmi (Contoh: 'Pemustaka memiliki hak...').\n2. MITIGASI KEHILANGAN (SOP): Susun tata laksana sanksi adil berdasar: {{sanksi_kerusakan}} yang menuntut tanggung jawab (misal anak disuruh menyumbang buku serupa, alih-alih membayar pakai uang cash) agar dimensi Kemandirian Profil Lulusan tercapai."
    },
    {
      id: 'struktur_duta_literasi',
      nama: 'Struktur Organisasi & Duta Literasi',
      icon: '🎖️',
      components: [
        { id: 'sk_struktur', label: 'Susunan Staf Teknis / Pustakawan Pembantu', type: 'textarea' },
        { id: 'database_duta', label: 'Database Siswa Kader/Duta Literasi (Pustakawan Cilik)', type: 'textarea' }
      ],
      ai_prompt: "Berperanlah sebagai HRD Perpustakaan. Kelola sumber daya manusia Anda, termasuk merekrut kader siswa!\n\nManajemen Organisasi:\n1. STRUKTURAL KABINET: Rangkai SK pengesahan tugas internal tim teknis kepustakaan berdasar: {{sk_struktur}}.\n2. PELIMPAHAN WEWENANG: Rancang Surat Keputusan/Piagam resmi penunjukan Pustakawan Cilik dari daftar siswa terpilih ini: {{database_duta}} sebagai apresiasi atas dedikasi mereka membantu menyusun buku di rak."
    }
  ]
};
