window.GpkModules = window.GpkModules || {};

window.GpkModules['rapor_inklusi'] = {
  id: 'rapor_inklusi',
  title: 'Evaluasi & Rapor Inklusi',
  icon: '📊',
  desc: 'Sub-sistem penyusunan bukti kemampuan life-skill mandiri dan Laporan (Rapor Intrakurikuler yang di-modifikasi) khusus ABK.',
  items: [
    {
      id: 'portofolio_modifikasi',
      nama: 'Portofolio Worksheet Modifikasi',
      icon: '📁',
      components: [
        { id: 'deskripsi_worksheet', label: 'Catatan Rangkuman Lembar Kerja Tersederhanakan (Menulis/Berhitung)', type: 'textarea' },
        { id: 'pencapaian_lifeskill', label: 'Dokumentasi Kesuksesan Fisik Life-Skill (Misal: Pasang Kancing, Tali Sepatu)', type: 'textarea' }
      ],
      ai_prompt: "Sebagai Kurator Pameran dan Pendidik Inklusi. Tarik konklusi dan hargai sekecil apa pun progres akademis dan motorik yang telah dicapai ABK semester ini.\n\nFokus Valorisasi Progres:\n1. NARRATIVE BUKTI KERJA: Deskripsikan makna luar biasa di balik coretan sederhana siswa pada lembar kerja merujuk pada: {{deskripsi_worksheet}}.\n2. BINA DIRI (KEMANDIRIAN): Berikan pujian apresiatif formal atas *breakthrough* kemampuan memandirikan diri seperti terlampir dalam rekaman/catatan ini: {{pencapaian_lifeskill}} sebagai bagian vital dimensi *Kemandirian* Profil Pelajar Pancasila."
    },
    {
      id: 'rapor_deskriptif_ppi',
      nama: 'Laporan Progres PPI (Rapor Deskriptif)',
      icon: '📜',
      components: [
        { id: 'progres_kognitif', label: 'Evaluasi Narasi Akademik & Kognitif (Memori/Fokus Belajar)', type: 'textarea' },
        { id: 'progres_motorik_emosi', label: 'Evaluasi Motorik, Kemampuan Komunikasi, & Pengelolaan Emosi', type: 'textarea' },
        { id: 'kesimpulan_ppi', label: 'Apakah Target Pendek/Semester PPI tercapai? (Lanjut / Revisi)', type: 'textarea' }
      ],
      ai_prompt: "Berperanlah sebagai Penilai Akhir Asesmen Diagnostik Bawaan (Lead GPK). Gubah nilai huruf kaku menjadi Rapot Intrakurikuler Naratif (Rapor Inklusi) seutuhnya.\n\nInstruksi Rapor Terpisah:\n1. CAPAIAN INTELEKTUAL: Ubah draf progres ini menjadi pujian pertumbuhan nalar dan fokus kognitif: {{progres_kognitif}}.\n2. CAPAIAN KENDALI DIRI: Evaluasi kemahiran bicaranya dan ketahanan emosinya (Apakah tantrumnya berkurang secara statistik?): {{progres_motorik_emosi}}.\n3. RENCANA TINDAK LANJUT BERIKUTNYA (RTL): Simpulkan nasib dokumen PPI yang dipakai semester ini, apakah kurikulum individunya dilanjutkan atau harus diturunkan targetnya merujuk opini ini: {{kesimpulan_ppi}}."
    }
  ]
};
