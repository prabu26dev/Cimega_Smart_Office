window.TuModules = window.TuModules || {};

window.TuModules['layanan_tamu_hubmas'] = {
  id: 'layanan_tamu_hubmas',
  title: 'Layanan Tamu & Hubmas',
  icon: '🤝',
  desc: 'Pusat resepsionis pencatatan tamu reguler, tamu pembinaan dinas (khusus), dan manajemen visual papan statistik.',
  items: [
    {
      id: 'buku_tamu',
      nama: 'Buku Tamu (Umum & Khusus Dinas)',
      icon: '📒',
      components: [
        { id: 'tamu_umum', label: 'Tgl, Nama Tamu (Wali Murid/Sales), & Maksud Tujuan', type: 'textarea' },
        { id: 'tamu_dinas', label: 'Tamu Khusus (Pengawas/Inspektorat) & Catatan Pembinaan', type: 'textarea' }
      ],
      ai_prompt: "Tugas Anda adalah sebagai Resepsionis Eksekutif dan Humas Lembaga. Rapikan log tamu hari ini menjadi *Buku Tamu* yang pantas dilaporkan ke atasan.\n\nFokus Buku Tamu:\n1. FILTER TAMU UMUM: Tarik dan rangkum secara rapi alasan sekuler kunjungan wali murid atau marketing ke sekolah dari coretan ini: {{tamu_umum}}.\n2. CATATAN KEDINASAN: Ini urusan VVIP. Konversikan celoteh saran dari para Petinggi Dinas/Asesor/Polisi yang datang inspeksi menjadi kalimat instruksi formal pada memo pembinaan: {{tamu_dinas}}."
    },
    {
      id: 'papan_statistik',
      nama: 'Papan Visual Board Statistik',
      icon: '📊',
      components: [
        { id: 'keadaan_guru', label: 'Update Keadaan Guru & Jabatan Administratif', type: 'textarea' },
        { id: 'keadaan_siswa', label: 'Rekap Keadaan Siswa per Rombel (L/P)', type: 'textarea' },
        { id: 'bagan_organisasi', label: 'Pembaruan Struktur Organisasi Inti Komite & Sekolah', type: 'textarea' }
      ],
      ai_prompt: "Sebagai Ahli Visualisasi Data (Data Center Admin). Siapkan rancangan draf cetak besar untuk pembuatan Papan Informasi Sekolah/Visual Board.\n\nOlah Data Display Publik: \n1. TABEL KEKUATAN MANPOWER: Buatkan ringkasan kekuatan pegawai berbasis PNS/PPPK dari rincian kasar ini: {{keadaan_guru}}.\n2. TABEL DEMOGRAFI MURID: Jumlahkan dan susun secara hierarkis daftar populasi Laki/Perempuan mulai dari jenjang terendah hingga kelas akhir berdasarkan: {{keadaan_siswa}}.\n3. BAGAN SUSUNAN KABINET: Siapkan format skema turun temurun hierarki antara Kepala Sekolah, Komite, hingga penjaga lapang berdasarkan data mentah: {{bagan_organisasi}}."
    }
  ]
};
