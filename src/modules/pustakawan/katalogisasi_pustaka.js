window.PustakawanModules = window.PustakawanModules || {};

window.PustakawanModules['katalogisasi_pustaka'] = {
  id: 'katalogisasi_pustaka',
  title: 'Katalogisasi & Inventaris',
  icon: '📚',
  desc: 'Engine utama Pustakawan: Buku Induk Register, Klasifikasi DDC (Dewey), dan Pembuatan Kelengkapan Fisik (Barcode/Label).',
  items: [
    {
      id: 'buku_induk_perpustakaan',
      nama: 'Buku Induk Perpustakaan',
      icon: '📖',
      components: [
        { id: 'identitas_buku', label: 'Judul Lengkap, Pengarang, Penerbit, Tahun Terbit', type: 'textarea' },
        { id: 'asal_eksemplar', label: 'Asal Sumber (Dana BOS/Sumbangan Ortu) & Harga Riil', type: 'textarea' }
      ],
      ai_prompt: "Sebagai Arsiparis Inti (Cataloger). Standarisasikan data buku yang baru datang (Unboxing) dari gudang ini ke format inventaris nasional.\n\nFokus Katalog Utama:\n1. VALIDASI METADATA: Susun rapi deretan bibliografi acak ini: {{identitas_buku}} agar seragam (Contoh: 'Pengarang, Tahun. Judul. Kota: Penerbit').\n2. AUDIT SUMBER ASET: Rangkum rekapitulasi nilai barang/buku tersebut merujuk pada: {{asal_eksemplar}}; tandai dengan tegas mana yang merupakan aset negara (Dana BOS) dan mana yang hibah sukarela."
    },
    {
      id: 'klasifikasi_ddc',
      nama: 'Sistem Klasifikasi / Penomoran DDC',
      icon: '🗂️',
      components: [
        { id: 'deskripsi_konten_buku', label: 'Ketik intisari buku ini tentang apa (Hewan/Sihir/Agama/Sejarah)', type: 'textarea' },
        { id: 'penetapan_nomor', label: 'Nomor DDC Manual (Jika sudah tahu klasifikasinya)', type: 'textarea' }
      ],
      ai_prompt: "Anda adalah Mesin Pakar Klasifikasi (Dewey Decimal Classification). Berikan pedoman taksonomi yang akurat agar buku ini tidak nyasar di rak yang salah!\n\nTugas Tagging Taksonomi: \nBaca sinopsis abstrak buku ini: {{deskripsi_konten_buku}}. Lalu, vonis dan putuskan buku ini berhak masuk ke seri angka DDC berapa (Misal: 500-an untuk Sains Alam / 800-an untuk Sastra Fiksi), komparasikan dengan angka usulan petugas ini: {{penetapan_nomor}}."
    },
    {
      id: 'kelengkapan_fisik_cetak',
      nama: 'Label Punggung & Barcode',
      icon: '🏷️',
      components: [
        { id: 'call_number', label: 'Call Number Singkat (Misal: 500 / PEN / z)', type: 'textarea' },
        { id: 'data_barcode', label: 'Nomor Register Urut untuk Barcode / ISBN', type: 'textarea' }
      ],
      ai_prompt: "Sebagai Petugas Pemroses Teknis. Siapkan draf stiker/label yang akan ditempelkan di fisik buku.\n\nTugas Labeling:\nBuatkan format Call Number (Nomor Panggil Rak) yang estetik secara vertikal berdasarkan kode: {{call_number}}.\nFormat tulisan peringatan legal di bawah area letak Barcode Scan menggunakan kode: {{data_barcode}} (Misal: 'Milik Perpustakaan SD X, Tidak Untuk Diperjualbelikan')."
    }
  ]
};
