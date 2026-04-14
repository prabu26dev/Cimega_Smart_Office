window.EkskulModules = window.EkskulModules || {};

window.EkskulModules['pelaporan_event'] = {
  id: 'pelaporan_event',
  title: 'Manajemen Event & Pelaporan',
  icon: '⛺',
  desc: 'Arsip pengajuan Proposal Anggaran pencairan dana (Event Khusus) dan LPJ Semesteran Ekskul.',
  items: [
    {
      id: 'proposal_event',
      nama: 'Proposal Kegiatan Khusus (Event)',
      icon: '📄',
      components: [
        { id: 'latar_tujuan_panitia', label: 'Latar Belakang, Tujuan Acara, & Susunan Panitia', type: 'textarea' },
        { id: 'rundown_kegiatan', label: 'Jadwal / Rundown Acara (Persami/Ujian Tingkat)', type: 'textarea' },
        { id: 'rab_anggaran', label: 'Rencana Anggaran Biaya (RAB) Kas Sekolah/Mandiri', type: 'textarea' }
      ],
      ai_prompt: "Sebagai Ahli Proposal Event Organizer. Gubah draf kegiatan lapangan ekskul ini menjadi proposal pencairan dana BOS yang meyakinkan bagi Kepala Sekolah & Bendahara.\n\nKerangka Akademis Proposal:\n1. JUSTIFIKASI KEGIATAN: Bungkus kemeriahan acara (misal: Kemah Persami) menggunakan bahasa formal tujuan perkemahan ini dalam mendidik kepemimpinan anak dari draf: {{latar_tujuan_panitia}}.\n2. MANAJEMEN WAKTU: Ubah coretan jadwal acak menjadi susunan *Rundown* yang disiplin dan presisi: {{rundown_kegiatan}}.\n3. AUDIT KEUANGAN (RAB): Susun tabel akuntansi pengajuan dana belanja bahan/konsumsi agar tidak dicoret oleh bendahara atau dianggap pemborosan berdasar angka-angka masuk akal: {{rab_anggaran}}."
    },
    {
      id: 'lpj_ekskul_semester',
      nama: 'Laporan Pertanggungjawaban (LPJ)',
      icon: '📁',
      components: [
        { id: 'ringkasan_eksekutif', label: 'Executive Summary Ketercapaian Target Eskul', type: 'textarea' },
        { id: 'penggunaan_buku_kas', label: 'Rekap Serapan Penggunaan Dana Sekolah (Terima vs Nota)', type: 'textarea' },
        { id: 'bukti_dokumentasi', label: 'Penjelasan/Caption Lampiran Dokumentasi Fisik Geotagging', type: 'textarea' }
      ],
      ai_prompt: "Anda ditugaskan sebagai Auditor internal Ekstrakurikuler. Rangkum keringat pelatih 6 bulan ini menjadi Lembar Pertanggungjawaban (LPJ) Final Semester.\n\nFokus Validitas LPJ:\n1. EXECUTIVE SUMMARY: Rangkum dan buktikan apakah target kemenangan lomba atau perombakan keterampilan teknis di awal tahun tercapai berdasar: {{ringkasan_eksekutif}}.\n2. NERACA BIAYA: Laporkan bahwa setiap Rp1 yang disumbangkan sekolah telah digunakan dan diganti ke dalam bentuk kwitansi sah/nota tanpa diselewengkan merujuk data: {{penggunaan_buku_kas}}.\n3. ARSIP VISUAL: Buatkan deskripsi formal (caption pelaporan) pada setiap lembar foto anak berlatih agar foto tersebut legal dan tidak bisa dibantah (Geotagging-Proof) berbekal informasi ini: {{bukti_dokumentasi}}."
    }
  ]
};
