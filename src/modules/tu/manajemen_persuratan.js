window.TuModules = window.TuModules || {};

window.TuModules['manajemen_persuratan'] = {
  id: 'manajemen_persuratan',
  title: 'Persuratan & Korespondensi',
  icon: '✉️',
  desc: 'Pusat lalu lintas pencatatan Agenda Surat Masuk/Keluar, Ekspedisi, dan Lembar Disposisi Kepala Sekolah.',
  items: [
    {
      id: 'agenda_masuk_keluar',
      nama: 'Buku Agenda Surat Masuk & Keluar',
      icon: '📖',
      components: [
        { id: 'identitas_surat', label: 'Tgl Terima/Buat, Nomor Urut & Kode Klasifikasi Dinas', type: 'textarea' },
        { id: 'asal_tujuan', label: 'Instansi Pengirim (Masuk) / Instansi Tujuan (Keluar)', type: 'textarea' },
        { id: 'perihal_keterangan', label: 'Perihal Singkat Isi Surat & Keterangan Lampiran', type: 'textarea' }
      ],
      ai_prompt: "Sebagai Sekretaris Eksekutif (Ahli Kearsipan), verifikasi dan standarisasi entri log persuratan ini.\n\nTugas Verifikasi Agenda Surat:\n1. KODE KLASIFIKASI: Perbaiki dan sesuaikan penomoran acak/kode surat ini: {{identitas_surat}} agar selaras dengan tata naskah dinas resmi.\n2. PEMETAAN TRAFFIC: Rangkum dan jelaskan dengan kalimat utuh siapa dan apa maksud dari lalu lintas korespondensi asimbolis asal/tujuan ini: {{asal_tujuan}}.\n3. ABSTRAKSI: Buat abstrak elegan (Intisari) dari uraian perihal panjang lebar surat tersebut berdasarkan ini: {{perihal_keterangan}} sehingga Kepsek bisa membacanya dalam 5 detik."
    },
    {
      id: 'lembar_disposisi',
      nama: 'Lembar Disposisi Kepsek',
      icon: '📌',
      components: [
        { id: 'nomor_indeks', label: 'Nomor Surat Terkait & Tanggal Penyelesaian', type: 'textarea' },
        { id: 'instruksi_kepsek', label: 'Tindak Lanjut / Instruksi Khusus Kepala Sekolah', type: 'textarea' },
        { id: 'penerima_tugas', label: 'Ditujukan Kepada (Guru/Staf Spesifik yang Bertugas)', type: 'textarea' }
      ],
      ai_prompt: "Berperanlah sebagai Staf Pribadi Pimpinan. Terjemahkan perintah lisan/cepat atasan ke dalam Lembar Instruksi Disposisi Hukum.\n\nAlur Perintah:\nKonversikan memo mentah ini: {{instruksi_kepsek}} menjadi kalimat komando direktif resmi (misal 'Mohon ditindaklanjuti', 'Harap diarsipkan') yang mengikat secara administratif nomor indeks ini: {{nomor_indeks}}.\nPeringatkan penerima disposisi: {{penerima_tugas}} mengenai tenggat waktu penyelesaian tugas merujuk kepada urgency surat."
    },
    {
      id: 'ekspedisi_pengarsipan',
      nama: 'Buku Ekspedisi & Filing System',
      icon: '🗂️',
      components: [
        { id: 'buku_ekspedisi', label: 'Draf Pengiriman (Tgl, No Surat, Tujuan, TTD Penerima)', type: 'textarea' },
        { id: 'label_ordner', label: 'Klasifikasi Label Ordner (SK, Undangan, Edaran)', type: 'textarea' }
      ],
      ai_prompt: "Anda ditugaskan merapikan manajemen logistik kurir pengiriman dokumen.\n\nTugas Kearsipan Fisik:\n1. BUKTI TANDA TERIMA: Rancang tabel *Delivery Order* log Book Ekspedisi yang menunjukkan bahwa surat kita telah sah mendarat di instansi yang dituju berdasar input: {{buku_ekspedisi}}.\n2. LABELLING BANTEX: Beri saran nama indeks spesifik untuk rak Ordner/Bantex secara estetik dan kronologis mengurutkan dokumen berdasar kumpulan draf tak teratur ini: {{label_ordner}}."
    }
  ]
};
