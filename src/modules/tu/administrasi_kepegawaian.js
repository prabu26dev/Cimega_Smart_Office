window.TuModules = window.TuModules || {};

window.TuModules['administrasi_kepegawaian'] = {
  id: 'administrasi_kepegawaian',
  title: 'Administrasi Pegawai (HR)',
  icon: '🧑‍💼',
  desc: 'Lemari brankas catatan kepangkatan DUK, File Personel Rekam Jejak Guru, Presensi Fisik, dan Mutasi Pegawai.',
  items: [
    {
      id: 'buku_induk_duk',
      nama: 'Buku Induk Pegawai & DUK',
      icon: '🆔',
      components: [
        { id: 'identitas_dasar', label: 'NIP/NIY, NUPTK, Nama, Tempat/Tanggal Lahir', type: 'textarea' },
        { id: 'pangkat_jabatan', label: 'Pangkat, Golongan Ruang, & Jabatan (Kepsek/Guru)', type: 'textarea' },
        { id: 'tmt_pendidikan', label: 'TMT CPNS/PNS & Riwayat Pendidikan Terakhir', type: 'textarea' }
      ],
      ai_prompt: "Sebagai Pegawai BKD (Badan Kepegawaian Daerah). Pastikan Buku Induk Pegawai & Daftar Urut Kepangkatan (DUK) ini tercatat rapi tanpa celah hukum.\n\nTugas Kompilasi Personel:\n1. DATA DASAR: Susun keakuratan identitas pegawai sesuai standar BKN dari draf inputan ini: {{identitas_dasar}}.\n2. URUTAN STRUKTURAL: Buatkan hierarki (List DUK) formatur kepangkatan berdasarkan masa ruang golongan dan tanggung jawab: {{pangkat_jabatan}}.\n3. LEGALITAS MASA KERJA: Verifikasi silang secara administratif rentang waktu dari ijazah ke Terhitung Mulai Tanggal (TMT) pengangkatan awal: {{tmt_pendidikan}} untuk menghindari kesalahan hitung uang pensiun kelak."
    },
    {
      id: 'file_personal_presensi',
      nama: 'Personal Folder & Presensi Fisik',
      icon: '📂',
      components: [
        { id: 'kelengkapan_map', label: 'Ceklis Isi Map (Ijazah, KK, SK KGB, Sertifikat, Karpeg)', type: 'textarea' },
        { id: 'rekap_kehadiran', label: 'Rekap Presensi Manual (Jam Datang/Pulang, Sakit/Alpa)', type: 'textarea' },
        { id: 'riwayat_cuti', label: 'Catatan Cuti, Sakit Berkelanjutan, atau Pindah Tugas', type: 'textarea' }
      ],
      ai_prompt: "Bertindaklah layaknya Manager HRD Korporat. Rapikan *Personal Record* dan disiplin pegawai setiap bulannya.\n\nTugas Kontrol Kedisiplinan:\n1. AUDIT BERKAS: Tulis surat/nota laporan kekurangan dokumen legalisir mana yang belum dilengkapi sang guru/pegawai dari dalam map-nya berdasar draf: {{kelengkapan_map}}.\n2. EVALUASI WAKTU KERJA: Tarik kesimpulan deskriptif dari tingkat bolos/alpa guru berdasarkan data rekap absensi tanda tangan basah mereka: {{rekap_kehadiran}}.\n3. LOG ABSENSI RESMI: Klasifikasikan dan buat surat tembusan persetujuan atas pengajuan hak resesi/cuti hamil dll yang mereka gunakan berdasar: {{riwayat_cuti}} agar Tunjangan mereka tidak sembarangan dipotong negara."
    }
  ]
};
