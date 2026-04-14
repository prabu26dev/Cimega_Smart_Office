window.PustakawanModules = window.PustakawanModules || {};

window.PustakawanModules['pelaporan_penyiangan'] = {
  id: 'pelaporan_penyiangan',
  title: 'Stock Opname & Pelaporan',
  icon: '📦',
  desc: 'Pusat Audit Buku Tahunan (Stock Opname), Penyiangan Buku Kusam (Weeding), dan LPJ Kepala Perpustakaan.',
  items: [
    {
      id: 'stock_opname',
      nama: 'Berita Acara Stock Opname (Cacah Ulang)',
      icon: '🧾',
      components: [
        { id: 'data_awal_akhir', label: 'Data Matematis Jumlah Buku Masuk vs Buku Fisik Saat Ini (Akhir)', type: 'textarea' },
        { id: 'selisih_hilang', label: 'Laporan Jumlah Angka Kehilangan (Gap / Selisih Buku)', type: 'textarea' }
      ],
      ai_prompt: "Sebagai Ahli Akuntansi Aset Pendidikan. Legalisasikan proses penghitungan manual (Cacah Ulang) perpustakaan akhir tahun ini ke dalam secarik Berita Acara sah.\n\nTugas Kehakiman Aset:\n1. NERACA BUKU: Formulasikan tabel hitung/narasi bahwa buku masuk berjumlah sekian ratus, dan buku ter-rak sekian ratus berdasar data murni ini: {{data_awal_akhir}}.\n2. BERITA ACARA KEHILANGAN TAHUNAN: Atasi kasus ketidakseimbangan rak (Missing Item) dengan menyusun draf serah terima dokumen cacat (Pemakluman batas kehilangan akibat *human error*) dari selisih angka ini: {{selisih_hilang}}, yang ditandatangani oleh Kepsek dan Pustakawan."
    },
    {
      id: 'penyiangan_weeding',
      nama: 'Register Penyiangan Buku (Weeding)',
      icon: '🍂',
      components: [
        { id: 'daftar_buku_rusak', label: 'Daftar Buku Berjamur / Rusak Fisik Total', type: 'textarea' },
        { id: 'buku_kadaluarsa', label: 'Daftar Kurikulum/Buku Informasi yang Sudah Usang (Menyesatkan)', type: 'textarea' }
      ],
      ai_prompt: "Anda ditugaskan membersihkan 'Hutan' Literasi yang sudah layu dengan teknik *Penyiangan (Weeding)*.\n\nTugas Penggudangan (Pemusnahan Terarah):\nRangkai Berita Acara Tarik Buku (Withdrawal) berupa daftar usulan pemusnahan massal atas bangkai literatur ini: {{daftar_buku_rusak}}.\nSertakan argumen justifikasi akademis (Misal: Karena buku lama ini membicarakan Kurikulum Tingkat Satuan Pendidikan (KTSP) 2006, maka dapat menganggu konsep guru di Kurikulum Kekinian) atas pengafkiran daftar literatur usang hasil input: {{buku_kadaluarsa}} ini."
    },
    {
      id: 'evaluasi_tahunan',
      nama: 'Laporan Evaluasi Tahunan Perpustakaan',
      icon: '📊',
      components: [
        { id: 'statistik_kunjungan', label: 'Rekap Statistik Puncak (Bulan/Kelas) Kunjungan Anak', type: 'textarea' },
        { id: 'serapan_anggaran', label: 'Status Laporan Belanja Penyerapan Anggaran BOS (Jika Ada)', type: 'textarea' }
      ],
      ai_prompt: "Berperanlah sebagai Kepala Administrator Perpustakaan Daerah. Sunting Lembar Laporan Pertanggungjawaban (LPJ) Akhir Tahun ini agar Kepala Sekolah tidak meremehkan jasa staf Pustakawan.\n\nFokus Presentasi LPJ Akhir:\n1. HIGHLIGHT TRAFFIC: Konstruksikan paragraf naratif unjuk gigi memamerkan letak puncak kepadatan pengunjung perpustakaan kita dari matriks ini: {{statistik_kunjungan}}.\n2. TRANSPARANSI DERAJAT KEPATUHAN KEUANGAN BUKU: Deklarasikan jaminan integritas bahwa uang negara untuk beli koleksi sains sukses terealisasi 100% dan terinventaris di Induk sesuai rincian pembelanjaan: {{serapan_anggaran}}."
    }
  ]
};
