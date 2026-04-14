window.TuModules = window.TuModules || {};

window.TuModules['kesiswaan_fisik_mutasi'] = {
  id: 'kesiswaan_fisik_mutasi',
  title: 'Kesiswaan & Mutasi Fisik',
  icon: '👨‍🎓',
  desc: 'Benteng pertahanan hukum terakhir sekolah: Buku Induk Siswa, Buku Klaper Abjad, Buku Mutasi Fisik, dan Legalisir Ijazah.',
  items: [
    {
      id: 'buku_induk_siswa',
      nama: 'Buku Induk & Klaper Siswa',
      icon: '📖',
      components: [
        { id: 'biodata_besar', label: 'Biodata Valid Buku Besar (NIS, NISN, Ortu, Foto)', type: 'textarea' },
        { id: 'indeks_klaper', label: 'Indeks Klaper Abjad (Penuntun Pencarian Cepat A-Z)', type: 'textarea' },
        { id: 'riwayat_kelulusan', label: 'Data Ijazah, Nilai Akhir, & Cap 3 Jari Bukti Serah Terima', type: 'textarea' }
      ],
      ai_prompt: "Sebagai Ahli Administrasi dan Arsiparis (Record Keeper) Lembaga Pendidikan. Tata struktur buku induk agar aman dari kerugian hukum seumur hidup.\n\nTugas Verifikasi Arsip Permanen:\n1. DATA UTAMA: Rangkum form pendaftaran kosong menjadi data solid untuk ditulis ke dalam buku raksasa sekolah, dari informasi raw ini: {{biodata_besar}}.\n2. MESIN PENCARI MANUAL: Sortir dan buatkan tata laksana penyusunan alfabetis layaknya kamus telpon (Klaper) dari deretan nama acak berikut: {{indeks_klaper}}.\n3. OTOTISASI PENYERAHAN: Desain draf penyerahan sertifikat perpisahan mutlak berisi nomor ijazah dan pengingat stempel 3 jari berdasar rekaman: {{riwayat_kelulusan}}."
    },
    {
      id: 'mutasi_legalisir',
      nama: 'Buku Mutasi & Legalisir Ijazah',
      icon: '🏛️',
      components: [
        { id: 'riwayat_mutasi', label: 'Bulan/Tahun, Siswa Keluar/Masuk, & Alasan Identitas Pindah', type: 'textarea' },
        { id: 'register_legalisir', label: 'Tgl Legalisir, Nama Alumni, No Seri Ijazah, & Jumlah Lembar', type: 'textarea' }
      ],
      ai_prompt: "Berperanlah sebagai Petugas Loket Pelayanan Pendidikan. Rangkum keluar-masuknya masyarakat sekolah agar sah secara fisik.\n\nTugas Administrasi Loket: \n1. MUTASI MANUAL: Buat tabel surat pengantar resmi mengenai mobilitas pencabutan dokumen pindahan siswa akibat rotasi kerja orang tua/kematian/dsb dari catatan kasar: {{riwayat_mutasi}}.\n2. LOG LEGALISIR ASLI: Susun buku catatan perlindungan keaslian dokumen (Anti-pemalsuan ijazah) saat alumni datang mengecap kertas berdasar input antrian ini: {{register_legalisir}}."
    }
  ]
};
