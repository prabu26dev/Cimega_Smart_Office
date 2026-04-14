window.OpsModules = window.OpsModules || {};

window.OpsModules['asesmen_digital'] = {
  id: 'asesmen_digital',
  title: 'Asesmen (ANBK) & Ekosistem Digital',
  icon: '💻',
  desc: 'Pangkalan kendali utama infrastruktur digital sekolah (ANBK tingkat pusat, domain Belajar.id, dan Verval TIK).',
  items: [
    {
      id: 'sistem_anbk',
      nama: 'Sistem Bio-AN & ANBK',
      icon: '🌐',
      components: [
        { id: 'sampling_peserta', label: 'Tarik Daftar Peserta Sampling (Utama & Cadangan)', type: 'textarea' },
        { id: 'sesi_gelombang', label: 'Pengaturan Sesi/Shift & Gelombang Ujian', type: 'textarea' },
        { id: 'kartu_proktor', label: 'Persiapan Cetak Kartu Login (Siswa, Pengawas, & Proktor)', type: 'textarea' }
      ],
      ai_prompt: "Berperanlah sebagai Proktor Utama Nasional Kementrian Pendidikan (Pelaksana ANBK). Tata administrasi ujian berskala besar agar zero-error saat pelaksanaan.\n\nFokus Persiapan UN Digital:\n1. DATA SAMPLING: Ceklis dan buatlah surat verifikasi daftar siswa acak pilihan pusat ini: {{sampling_peserta}} yang akan mewakili sekolah.\n2. LALU LINTAS BANDWIDTH: Atur kepadatan *traffic* internet dan klien komputer dengan meracik pergantian sesi pagi/siang berdasarkan draf ini: {{sesi_gelombang}}.\n3. CREDENTIAL DISTRIBUSI: Rancang berita acara validasi pencetakan dan penyegelan kartu login/token kerahasiaan sebelum hari H: {{kartu_proktor}}."
    },
    {
      id: 'verval_tik',
      nama: 'Verval TIK Infrastruktur',
      icon: '🖥️',
      components: [
        { id: 'kesiapan_komputer', label: 'Kesiapan Klien Hardware (Jumlah Laptop/PC & Spesifikasi)', type: 'textarea' },
        { id: 'status_server', label: 'Status Penyelenggaraan (Mandiri / Menumpang ke SMP/SMA)', type: 'textarea' }
      ],
      ai_prompt: "Sebagai IT Auditor Infrastruktur Sekolah. Evaluasi kecukupan peralatan TIK sekolah berlandaskan batas standar minimum ANBK.\n\nInstruksi Audit HW/SW:\n1. NERACA PERANGKAT KERAS: Rekap rasio 1:3 (Komputer banding Siswa) dari spesifikasi ram/prosesor klien berikut: {{kesiapan_komputer}}.\n2. MODE PELAKSANAAN: Berikan pendapat tegas (*Feasible/Not Feasible*) apakah sekolah bisa ujian mandiri full online, ataukah terpaksa harus numpang di sekolah lain (semi-online) berdasar realita: {{status_server}}."
    },
    {
      id: 'akun_belajar_id',
      nama: 'Manajemen Domain Belajar.id',
      icon: '☁️',
      components: [
        { id: 'pengajuan_domain', label: 'Pengajuan Buat Akun Google Workspace Belajar.id (Warga Baru)', type: 'textarea' },
        { id: 'reset_pass', label: 'Layanan Reset Password & Handle Akun Terkunci', type: 'textarea' },
        { id: 'sync_pmm', label: 'Laporan Aksesibilitas Guru ke PMM (Platform Merdeka Mengajar)', type: 'textarea' }
      ],
      ai_prompt: "Anda ditugaskan sebagai Super Admin Workspace (Belajar.id) Tingkat Sekolah. Rapikan keluhan otentikasi login kependidikan ini.\n\nTugas Sinkronisasi *Cloud Auth*:\nPROSES PROVISIONING: Buat usulan akun *bulk deployment* ke Pusdatin bagi daftar individu ini: {{pengajuan_domain}}.\nTROUBLE TICKET RESOLUTION: Log layanan permintaan penggantian kata sandi email dari entri aduan: {{reset_pass}}.\nCOMPLIANCE (Kepatuhan): Buat progres pelaporan bahwa 100% guru sekolah ini bisa login ke platform kementrian dari input status: {{sync_pmm}} terkait log aktivitas mereka di PMM."
    }
  ]
};
