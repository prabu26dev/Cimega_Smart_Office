window.GpkModules = window.GpkModules || {};

window.GpkModules['pemantauan_perilaku'] = {
  id: 'pemantauan_perilaku',
  title: 'Pemantauan Perilaku Khusus',
  icon: '👁️',
  desc: 'Pangkalan observasi respon harian, Tracker ABC (Antecedent-Behavior-Consequence) untuk Tantrum, dan Rekam Medis Obat.',
  items: [
    {
      id: 'jurnal_logbook_gpk',
      nama: 'Jurnal Pendampingan Khusus & Logbook',
      icon: '📓',
      components: [
        { id: 'target_rutinitas', label: 'Hari/Tgl, Lokasi (Pull/Push), & Target Materi Hari Ini', type: 'textarea' },
        { id: 'respons_evaluasi', label: 'Respons Siswa (Fokus/Tantrum/Pasif) & Evaluasi Tindakan', type: 'textarea' }
      ],
      ai_prompt: "Berperanlah sebagai Shadow Teacher Ahli. Ubah tulisan coretan evaluasi harian ini menjadi Jurnal Harian Logbook GPK.\n\nTugas Pelaporan:\nSusun naratif log kegiatan Anda saat menargetkan materi/instruksi hari ini: {{target_rutinitas}}.\nGambarkan secara deskriptif suasana kebatinan dan interaksi si ABK (Apakah respons mereka menolak belajar, asik sendiri, dll) beserta langkah evakuasi penanganan Anda: {{respons_evaluasi}}."
    },
    {
      id: 'behavioral_tracker',
      nama: 'Tracker Perilaku A-B-C (Modifikasi Emosi)',
      icon: '📈',
      components: [
        { id: 'anteseden_pemicu', label: 'Antecedent (A) - Apa peristiwa yang memicu perilaku negatif?', type: 'textarea' },
        { id: 'behavior_perilaku', label: 'Behavior (B) - Seperti apa intensitas perilakunya (Menangis/Memukul)?', type: 'textarea' },
        { id: 'consequence_akibat', label: 'Consequence (C) - Apa reaksi guru atau teman (dihukum/dilindungi)?', type: 'textarea' }
      ],
      ai_prompt: "Sebagai Behavioral Analyst Tersertifikasi (BCBA), bedah pola amukan (Tantrum) ini memakai metode ABC.\n\nInstruksi Bedah Kasus: \n1. FORENSIK PEMICU (A): Telusuri fakta kronologisnya, apa yang terjadi 5 detik sebelum siswa mengamuk (misal direbut mainannya) berdasarkan input: {{anteseden_pemicu}}.\n2. ANATOMI PERILAKU (B): Jabarkan manifestasi fisiknya (apakah dia teriak histeris/lempar barang) dan level keparahannya dari data: {{behavior_perilaku}}.\n3. HASIL TINDAKAN (C): Skoring seberapa tepat reaksi Anda/Guru Kelas (Apakah malah memarahi, atau mengabaikannya) dari: {{consequence_akibat}} guna merancang rujukan modifikasi perilaku agar besok pemicu A tidak membuahkan B."
    },
    {
      id: 'lembar_kendali_obat',
      nama: 'Lembar Kendali Obat & Terapi (Medis)',
      icon: '💊',
      components: [
        { id: 'konsumsi_obat', label: 'Jadwal & Dosis Konsumsi Obat Penunjang (Misal Ritalin)', type: 'textarea' },
        { id: 'persetujuan_ortu', label: 'Informasi Persetujuan Orang Tua & Kondisi Efek Samping Obat', type: 'textarea' }
      ],
      ai_prompt: "Tugas Anda adalah Perawat/School Nurse. Tata rapi format surat pemberian/pengawasan obat medis ABK untuk mencegah malpraktik dosis di sekolah.\n\nTugas Kontrol Medis:\nCatat administrasi rutinitas jam dan takaran/dosis asupan medis yang diresepkan Psikiater berdasarkan data: {{konsumsi_obat}}.\nBuat klausul lepas tuntutan (Disclaimer) yang menyatakan bahwa Anda mencekokkan obat ini saat jam sekolah atas rekomendasi penuh/surat izin resmi dari wali murid dengan log bukti draf: {{persetujuan_ortu}} yang memuat catatan alergi."
    }
  ]
};
