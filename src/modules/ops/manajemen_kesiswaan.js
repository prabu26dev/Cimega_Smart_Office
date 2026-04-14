window.OpsModules = window.OpsModules || {};

window.OpsModules['manajemen_kesiswaan'] = {
  id: 'manajemen_kesiswaan',
  title: 'Manajemen Data Peserta Didik',
  icon: '👨‍🎓',
  desc: 'Sub-portal tarik data siswa PPDB, pelulusan, Verval PD (NISN/Dukcapil), dan pencairan dana PIP.',
  items: [
    {
      id: 'verval_pd_nisn',
      nama: 'Verval PD & Penerbitan NISN',
      icon: '🎫',
      components: [
        { id: 'pengajuan_nisn', label: 'Pengajuan NISN Baru (Jalur TK/Pindahan)', type: 'textarea' },
        { id: 'perbaikan_identitas', label: 'Perbaikan Typo Identitas (Sinkron KK/Akte)', type: 'textarea' },
        { id: 'kasus_ganda', label: 'Laporan Identitas Ganda (Double Record)', type: 'textarea' }
      ],
      ai_prompt: "Sebagai Admin Kependudukan Pelajar Nasional. Rapikan proses Verifikasi Validasi Peserta Didik (Verval PD) agar tak terjadi kesalahan fatal di Ijazah akhir anak.\n\nInstruksi Entry:\n1. SUBMISI PENOMORAN INDUK: Format permohonan agar pusat menerbitkan NISN berdasar riwayat masuk anak ini: {{pengajuan_nisn}}.\n2. KOREKSI ANOMALI EJAAN: Buatkan resume pengajuan perubahan Nama/Tempat Lahir yang bermasalah merujuk pada Akte Kelahiran: {{perbaikan_identitas}}.\n3. MERGE / HAPUS GANDA: Tulislah justifikasi kuat terkait siswa yang identitasnya ganda di server untuk ditarik atau dihapus permanen salah satunya: {{kasus_ganda}}."
    },
    {
      id: 'mutasi_lulusan',
      nama: 'Mutasi, Pindah Tugas, & Pelulusan',
      icon: '🚪',
      components: [
        { id: 'tarik_data_ppdb', label: 'Penarikan Data Siswa Baru (PPDB / Jalur PAUD)', type: 'textarea' },
        { id: 'surat_pindah', label: 'Pemrosesan Surat Pindah Keluar Keluar/Masuk (Suket)', type: 'textarea' },
        { id: 'eksekusi_lulus', label: 'Data Registrasi Pelulusan Klasikal Siswa Kelas 6', type: 'textarea' }
      ],
      ai_prompt: "Bertindaklah sebagai Panitia Penerimaan & Pelepasan Siswa. Susun administrasi legal perpindahan penduduk usia sekolah ini.\n\nFokus Dokumen Mutasi:\n1. INTEGRASI PPDB: Buat narasi berita acara telah rampungnya penarikan data mentah siswa dari TK asal ke database SD kita: {{tarik_data_ppdb}}.\n2. SURAT KETERANGAN PINDAH (MUTASI): Susun draf formal Surat Rekomendasi Pindah Sekolah (baik keluar maupun log tarikan masuk) yang sah di mata Hukum Pendidikan: {{surat_pindah}}.\n3. LEGALISIR PELULUSAN: Format ketukan palu serah terima memori data akademik siswa tingkat akhir yang telah lulus untuk disuntikkan ke jenjang SMP: {{eksekusi_lulus}}."
    },
    {
      id: 'manajemen_pip',
      nama: 'Manajemen SIPINTAR & PIP',
      icon: '💳',
      components: [
        { id: 'status_kesejahteraan', label: 'Penandaan Kesejahteraan (Input Kartu KIP/PKH)', type: 'textarea' },
        { id: 'nominasi_penerima', label: 'Usulan Nominasi Penerima Bantuan Sosial PIP', type: 'textarea' },
        { id: 'konfirmasi_cair', label: 'Rekapitulasi Sukses Aktivasi & Pencairan Dana Bank', type: 'textarea' }
      ],
      ai_prompt: "Tugas Anda adalah sebagai Supervisor Bantuan Jaring Pengaman Sosial (KIP/PIP). Kawal aliran dana bantuan anak miskin ini agar tepat sasaran tanpa penyelewengan.\n\nTugas Verifikasi Dana:\n1. SKRINING KELAYAKAN: Analisis sah/tidaknya pengajuan calon nominasi PIP berdasar kelengkapan bukti PKH/Jamkesmas siswa ini: {{status_kesejahteraan}}.\n2. DAFTAR USULAN: Format tabel panjang list anak usulan penerima dana prioritas tahap tahun ini: {{nominasi_penerima}}.\n3. BERITA ACARA PENCAIRAN: Buat laporan pencairan ke Bank Rakyat/Penyalur yang menyatakan buku tabungan telah diaktivasi dan dana utuh telah mendarat di tangan wali murid: {{konfirmasi_cair}}."
    }
  ]
};
