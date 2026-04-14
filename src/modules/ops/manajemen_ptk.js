window.OpsModules = window.OpsModules || {};

window.OpsModules['manajemen_ptk'] = {
  id: 'manajemen_ptk',
  title: 'Manajemen Data PTK',
  icon: '👨‍🏫',
  desc: 'Pangkalan sinkronisasi Dapodik Kepegawaian, pencairan Tunjangan Sertifikasi, KGB, dan Verval PTK.',
  items: [
    {
      id: 'dapodik_ptk',
      nama: 'Profil PTK Dapodik',
      icon: '🆔',
      components: [
        { id: 'identitas_nik', label: 'NIK, NUPTK, & Status Kepegawaian (PNS/PPPK/Honor)', type: 'textarea' },
        { id: 'riwayat_pendidikan', label: 'Riwayat Pendidikan Formal (Strata Terakhir)', type: 'textarea' },
        { id: 'riwayat_sk', label: 'Riwayat SK Pengangkatan (Awal s.d. Akhir)', type: 'textarea' }
      ],
      ai_prompt: "Tugas Anda adalah sebagai Analis Sumber Daya Manusia (HR Admin Dapodik). Format ulang coretan data profil Guru/Tendik ini menjadi riwayat portofolio riil.\n\nTugas Verifikasi Arsip:\n1. VALIDASI NIP/NUPTK: Tata identitas awal ini agar tidak terjadi kesalahan sinkronisasi (invalid) di database BKN: {{identitas_nik}}.\n2. LINIERITAS IJAZAH: Rincikan gelar formal yang dimasukkan: {{riwayat_pendidikan}} untuk menentukan kelayakan profesi.\n3. HISTORI SK PENUGASAN: Rangkai riwayat pengangkatan pegawai yang sah untuk keperluan pendataan masa kerja (pemberkasan) dari rekam ini: {{riwayat_sk}}."
    },
    {
      id: 'info_gtk_simpkb',
      nama: 'Info GTK & Tunjangan SIMPKB',
      icon: '💵',
      components: [
        { id: 'beban_mengajar', label: 'Sinkronisasi Beban Jam Mengajar (Syarat Sertifikasi)', type: 'textarea' },
        { id: 'berkala_pangkat', label: 'Riwayat Kenaikan Gaji Berkala (KGB) & Kepangkatan', type: 'textarea' },
        { id: 'aktivitas_belajar', label: 'Status Keaktifan di Komunitas Belajar (PMM/SIMPKB)', type: 'textarea' }
      ],
      ai_prompt: "Berperanlah sebagai Petugas Pencairan Tunjangan Profesi (Sertifikasi Pusat). Cek kelayakan dan kriteria pencairan guru berlandaskan regulasi SIMPKB.\n\nInstruksi Ceklis (Threshold):\n1. LINIERITAS 24 JAM: Hitung dan laporkan apakah rasio tatap muka 24 Jam guru ini telah terpenuhi (*Valid/Invalid*) demi pencairan tunjangan, silakan merujuk pada: {{beban_mengajar}}.\n2. UPDATE KEPANGKATAN: Gubah catatan kenaikan pangkat berkala (KGB) ini menjadi ringkasan yang legal secara administratif birokrasi: {{berkala_pangkat}}.\n3. KONTRIBUSI PROFESIONAL: Buat pernyataan pemenuhan syarat pengembangan keprofesian dari keterlibatan guru tsb di forum: {{aktivitas_belajar}}."
    },
    {
      id: 'verval_ptk',
      nama: 'Verval Anomali PTK (Dukcapil)',
      icon: '🛠️',
      components: [
        { id: 'anomali_data', label: 'Laporan Data Tidak Sinkron (Anomali NIK/Nama dengan Dukcapil)', type: 'textarea' },
        { id: 'lampiran_dukung', label: 'Syarat Lampiran Perbaikan (Kartu Keluarga/KTP Asli)', type: 'textarea' }
      ],
      ai_prompt: "Sebagai Admin Helpdesk PUSDATIN. Buat draf pengajuan *Ticket* (Surat Permohonan Perbaikan Perubahan Data) yang bersifat memaksa dan segera kepada kementerian.\n\nFokus Trouble-Shooting:\nJabarkan keluhan *Residu* / ketidaksesuaian basis data Dukcapil terhadap record di Dapodik: {{anomali_data}}.\nTulis kalimat pernyataan jaminan bahwa data yang diajukan sekolah ini otentik karena telah didukung oleh lampiran kenegaraan berupa: {{lampiran_dukung}}."
    }
  ]
};
