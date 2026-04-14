window.FasilitatorP5Modules = window.FasilitatorP5Modules || {};

window.FasilitatorP5Modules['eksekusi_lapangan'] = {
  id: 'eksekusi_lapangan',
  title: 'Eksekusi Lapangan & Logbook',
  icon: '📋',
  desc: 'Pusat jurnal log kegiatan harian fasilitator lapangan dan lembar kendali keselamatan/etika siswa.',
  items: [
    {
      id: 'jurnal_harian_fasilitator',
      nama: 'Jurnal Logbook Fasilitator (Harian)',
      icon: '📓',
      components: [
        { id: 'jadwal_fase', label: 'Waktu & Fase Proyek (Misal: Tahap Riset / Tahap Aksi)', type: 'textarea' },
        { id: 'presensi_target', label: 'Rekap Kehadiran Khusus & Target Harian Kelompok', type: 'textarea' },
        { id: 'keterangan_lapangan', label: 'Catatan Kendala Lapangan (Field Notes) & Intervensi', type: 'textarea' }
      ],
      ai_prompt: "Berperanlah sebagai Fasilitator Lapangan Ahli. Tolong restrukturisasi serpihan catatan lapangan ini menjadi Jurnal Eksekusi (Field Logbook) harian yang formal.\n\nKerangka Jurnal Pelaksanaan:\n1. IDENTITAS & AGENDA: Format jadwal dan tahapan proyek hari ini: {{jadwal_fase}}.\n2. ASESMEN DISIPLIN WAKTU: Kaitkan masalah absensi atau keterlambatan anak dengan target mandek hari itu berdasarkan data ini: {{presensi_target}}.\n3. CATATAN KENDALA KLINIS: Susun log peristiwa ketika kinerja kelompok buntu, dan dokumentasikan 'intervensi senyap' apa yang Anda berikan tanpa merusak kemandirian mereka: {{keterangan_lapangan}}."
    },
    {
      id: 'sop_keselamatan',
      nama: 'Kendali Keselamatan & Etika (SOP)',
      icon: '🛡️',
      components: [
        { id: 'alat_pelindung', label: 'Checklist Kelengkapan Keselamatan/Pelindung', type: 'textarea' },
        { id: 'batas_area', label: 'Batas Area Kegiatan Observasi (Outdoor)', type: 'textarea' },
        { id: 'kesepakatan_etika', label: 'Kesepakatan Etika Survei / Adab Lingkungan', type: 'textarea' }
      ],
      ai_prompt: "Anda ditugaskan sebagai Komandan Keamanan Lapangan Sekolah. Susun Panduan Tegas Manajemen Risiko (Risk Management) kegiatan outdoor/lapangan tim.\n\nPeraturan Mengikat Siswa:\n1. AUDIT PERANGKAT: Buat instruksi wajib pakai berlapis terhadap alat pelindung kotor/bahaya (sarung tangan, topi, jas) berdasar ceklis: {{alat_pelindung}}.\n2. PEMETAAN ZONASI RAMBU LAUT/DARAT: Tulis peringatan garis batas merah area observasi yang terlarang dimasuki siswa: {{batas_area}}.\n3. ADAB VISITOR: Ubah draf kasual ini menjadi Pakta Integritas (Janji Etika Lisan) siswa terkait menjaga ketertiban/menjaga kebersihan dari: {{kesepakatan_etika}}."
    }
  ]
};
