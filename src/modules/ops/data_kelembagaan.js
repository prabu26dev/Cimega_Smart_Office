window.OpsModules = window.OpsModules || {};

window.OpsModules['data_kelembagaan'] = {
  id: 'data_kelembagaan',
  title: 'Kelembagaan & Sarpras',
  icon: '🏛️',
  desc: 'Pangkalan data profil sekolah (Aplikasi Induk Dapodik) dan status bangunan (Verval Sarpras).',
  items: [
    {
      id: 'dapodik_induk',
      nama: 'Profil Induk (Dapodik)',
      icon: '🏢',
      components: [
        { id: 'data_npsn_izin', label: 'NPSN & Legalitas SK Izin Operasional', type: 'textarea' },
        { id: 'koordinat_geografis', label: 'Pemetaan Lintang/Bujur & Titik Koordinat', type: 'textarea' },
        { id: 'utilitas_pusat', label: 'Daya Listrik, Penyedia Internet, & Bandwidth', type: 'textarea' }
      ],
      ai_prompt: "Bertindaklah sebagai Verifikator Data Pokok Pendidikan (Pusdatin). Rangkai dan validasi Dokumen Profil Identitas Induk Sekolah ini agar siap sinkronisasi ke server kementerian.\n\nFokus Sinkronisasi:\n1. LEGALITAS OPERASIONAL: Buktikan eksistensi hukum sekolah berdasar data ini: {{data_npsn_izin}}.\n2. PEMETAAN SPASIAL MAPS: Rapikan koordinat spasial sekolah untuk keperluan zonasi radius PPDB berdasar input: {{koordinat_geografis}}.\n3. INFRASTRUKTUR TEKNOLOGI: Uraikan kesanggupan listrik/internet sekolah: {{utilitas_pusat}} sebagai data justifikasi apakah sekolah ini laik menyelenggarakan ujian digital (ANBK) secara mandiri."
    },
    {
      id: 'verval_sarpras',
      nama: 'Verval Sarana Prasarana',
      icon: '🚧',
      components: [
        { id: 'status_lahan_bangunan', label: 'Status Kepemilikan Lahan & Kondisi Bangunan Utama', type: 'textarea' },
        { id: 'rincian_ruang', label: 'Ketersediaan Ruang Kelas & Toilet (Sanitasi)', type: 'textarea' },
        { id: 'laporan_rusak', label: 'Rincian Aset Rusak Berat/Ringan (Syarat Pengajuan DAK)', type: 'textarea' }
      ],
      ai_prompt: "Anda ditugaskan sebagai Surveyor Aset Dinas Pendidikan. Olah data mentah ini menjadi Laporan Verifikasi dan Validasi (Verval) Sarpras berdaya tawar tinggi untuk pencairan Dana Alokasi Khusus (DAK) Fisik.\n\nInstruksi Laporan Survei:\nTinjau legalitas lahan bangunannya secara de jure berdasar input: {{status_lahan_bangunan}}.\nAnalisis rasio ketersediaan sanitasi dan tampungan siswa per kelas berdasarkan: {{rincian_ruang}}.\nBuat paragraf Justifikasi Kebutuhan Mendesak terhadap plafon/gedung yang butuh rehabilitasi total atau pengadaan akibat rusak berat berdasarkan temuan lapangan ini: {{laporan_rusak}}."
    }
  ]
};
