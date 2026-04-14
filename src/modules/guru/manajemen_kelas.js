window.GuruModules = window.GuruModules || {};

window.GuruModules['manajemen_kelas'] = {
  id: 'manajemen_kelas',
  title: 'Manajemen Tata Kelola Kelas',
  icon: '📋',
  desc: 'Tugas operasional keseharian, jurnal mengajar, dan data ruang kelas.',
  items: [
    {
      id: 'buku_presensi',
      nama: 'Buku Presensi Kehadiran',
      icon: '✅',
      components: [
        { id: 'rekap_harian', label: 'Rekap Kehadiran (Sakit, Izin, Alpa)', type: 'textarea' },
        { id: 'persentase', label: 'Persentase Kehadiran Bulanan', type: 'textarea' },
        { id: 'keterangan', label: 'Keterangan Khusus / Isu Ketidakhadiran', type: 'textarea' }
      ],
      ai_prompt: "Sebagai Admin Kelas / Wali Kelas, buatlah rekapitulasi pelaporan presensi kehadiran bulanan.\n\nData yang harus diproses:\n1. Distribusi Absensi harian: {{rekap_harian}}\n2. Kalkulasi Metrik Persentase: {{persentase}}\n3. Isu Spesifik/Troubleshooting: Jabarkan keterangan khusus ketidakhadiran siswa berikut lalu tulis rencana tindak penjemputan/hubungi wali murid: {{keterangan}}.\n\nSusun layaknya Laporan Eksekutif Presensi kepada Kepala Sekolah."
    },
    {
      id: 'jurnal_mengajar',
      nama: 'Jurnal Mengajar Harian (Agenda)',
      icon: '📓',
      components: [
        { id: 'jam_topik', label: 'Hari/Tgl, Jam Ke-, Topik yang dibahas', type: 'textarea' },
        { id: 'siswa_absen', label: 'Daftar Siswa Tidak Hadir', type: 'textarea' },
        { id: 'catatan_kejadian', label: 'Catatan Kejadian Kelas (Hambatan/Antusiasme)', type: 'textarea' }
      ],
      ai_prompt: "Tulis ulang catatan kasar ini menjadi Rangkuman Jurnal Mengajar Harian Guru Profesional yang memenuhi standar administrasi pemeriksaan pengawas.\n\nInformasi Pelaksanaan: {{jam_topik}}.\nSiswa Tidak Hadir di jam ini: {{siswa_absen}}.\nEvaluasi Reflektif Kejadian Kelas: Pengejawantahan dari hambatan maupun antusiasme siswa saat KBM berlangsung berdasarkan poin ini: {{catatan_kejadian}}.\n\nTulis dalam format Jurnal terstruktur dengan bahasa baku pedagogik."
    },
    {
      id: 'papan_data',
      nama: 'Papan Data & Kelengkapan Kelas',
      icon: '📌',
      components: [
        { id: 'denah_roster', label: 'Roster / Jadwal Pelajaran & Rotasi Denah', type: 'textarea' },
        { id: 'struktur_piket', label: 'Struktur Organisasi Kelas & Jadwal Piket', type: 'textarea' },
        { id: 'kesepakatan', label: 'Dokumen Kesepakatan Kelas (Class Rules)', type: 'textarea' }
      ],
      ai_prompt: "Anda adalah Wali Kelas yang inovatif. Bantu saya meramu dan merapikan komponen kelengkapan ruang kelas fisik agar menjadi desain draf dokumen siap pajang.\n\n1. Aturan Penjadwalan & Tata Letak: {{denah_roster}}.\n2. Pembagian Tugas Kepengurusan: {{struktur_piket}}.\n3. Kontrak Belajar Akomodatif: Susun draf Poster Kesepakatan Kelas menggunakan gaya bahasa anak (student-friendly) yang bermuatan disiplin positif dari ide dasar ini: {{kesepakatan}}."
    }
  ]
};
