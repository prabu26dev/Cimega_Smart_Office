window.GpkModules = window.GpkModules || {};

window.GpkModules['perencanaan_ppi'] = {
  id: 'perencanaan_ppi',
  title: 'Perencanaan PPI & IEP',
  icon: '🎯',
  desc: 'Penyusunan kurikulum turunan: Program Pembelajaran Individual (PPI) dan Matriks Layanan GPK.',
  items: [
    {
      id: 'dokumen_ppi_iep',
      nama: 'Program Pembelajaran Individual (PPI)',
      icon: '🛡️',
      components: [
        { id: 'tujuan_target_ppi', label: 'Tujuan Jangka Panjang (Tahun) & Jangka Pendek (Semester)', type: 'textarea' },
        { id: 'penyesuaian_materi', label: 'Modifikasi / Omisi Kurikulum & Kriteria Ketuntasan Minimal', type: 'textarea' },
        { id: 'strategi_khusus', label: 'Strategi Pembelajaran Khusus (Metode / Media Bantu)', type: 'textarea' }
      ],
      ai_prompt: "Berperanlah sebagai Pakar Penyusun Kurikulum Inklusi (IEP Planner). Formulasikan Dokumen Program Pembelajaran Individual (PPI) ini agar rasional dan dapat dicapai si ABK.\n\nFokus Perancangan Dokumen PPI:\n1. MAPPING TARGET: Buat narasi pencapaian target mikro dan makro si anak dari harapan/draf ini: {{tujuan_target_ppi}} yang difokuskan pada peningkatan *Life Skill* atau akademik ringan.\n2. CURRICULUM MODIFICATION: Buatkan rumusan diskresi KKM (Kriteria Ketuntasan Minimal) yang adil berdasar teori substitusi/omisi rujukan ini: {{penyesuaian_materi}} agar anak tidak depresi dikejar target kurikulum kelas reguler.\n3. TEKNIK INSTRUKSIONAL: Jelaskan kebutuhan intervensi strategis dengan metode/medium seperti apa yang harus dipakai guru (contoh ABA, Flashcard, dll) berdasar: {{strategi_khusus}}."
    },
    {
      id: 'matriks_layanan',
      nama: 'Matriks Layanan Intervensi (Jadwal)',
      icon: '🗓️',
      components: [
        { id: 'jadwal_pushin', label: 'Jadwal Layanan Push-in (GPK masuk ke Kelas Reguler)', type: 'textarea' },
        { id: 'jadwal_pullout', label: 'Jadwal Layanan Pull-out (Tarik ke Ruang Sumber/Inklusi)', type: 'textarea' }
      ],
      ai_prompt: "Sebagai Koordinator Bimbingan Khusus (Master Profiler). Rangkai Matriks Jadwal Pelayanan Inklusi Anda.\n\nPenugasan Logistik Eksekusi:\nRangkai tabel waktu dan beban kerja Anda saat berbaur dengan anak normal di kelas utama (pendampingan inklusif murni) lewat data: {{jadwal_pushin}}.\nLalu susun argumentasi logis/alasan mengapa anak ini harus dicabut ke Ruang Inklusi untuk jadwal *Pull-Out / Therapy Sesssion* eksklusif Anda berdasar jadwal draf ini: {{jadwal_pullout}}."
    }
  ]
};
