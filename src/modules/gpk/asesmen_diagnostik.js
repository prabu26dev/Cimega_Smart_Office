window.GpkModules = window.GpkModules || {};

window.GpkModules['asesmen_diagnostik'] = {
  id: 'asesmen_diagnostik',
  title: 'Asesmen & Identifikasi ABK',
  icon: '🩺',
  desc: 'Pangkalan data klinis: Instrumen Skrining Awal, Hasil Diagnosa Psikolog, dan Mapping Profile Gaya Belajar Anak.',
  items: [
    {
      id: 'skrining_awal',
      nama: 'Instrumen Skrining Gejala Awal',
      icon: '📋',
      components: [
        { id: 'gejala_motorik_kognitif', label: 'Indikator Motorik & Kognitif (Ceklis Kepsek/Ortu)', type: 'textarea' },
        { id: 'gejala_sosial_emosi', label: 'Indikator Sosial, Emosi, Penglihatan/Pendengaran', type: 'textarea' }
      ],
      ai_prompt: "Sebagai Ahli Inklusi Pendidikan Khusus (Orthopedagogik). Ekstrak lembar ceklis acak ini menjadi hipotesis skrining awal yang formal.\n\nFokus Observasi Dini:\n1. GEJALA FISIK & AKADEMIK: Terjemahkan keluhan wali kelas dari: {{gejala_motorik_kognitif}} menjadi potensi hambatan medis/belajar.\n2. GEJALA SENSORI EMOSI: Gambarkan anomali sosial dari data ini: {{gejala_sosial_emosi}} dan berikan opini apakah anak ini murni kurang disiplin, atau membutuhkan rujukan profesional (referral) ke psikiater anak."
    },
    {
      id: 'hasil_profesional',
      nama: 'Arsip Hasil Asesmen Profesional (Medis)',
      icon: '🏥',
      components: [
        { id: 'diagnosa_resmi', label: 'Diagnosa Klinis (Skor IQ, Jenis Hambatan)', type: 'textarea' },
        { id: 'rekomendasi_ahli', label: 'Rekomendasi Ahli Terapis / Psikolog', type: 'textarea' }
      ],
      ai_prompt: "Bertindaklah sebagai Jembatan Medis ke Pedagogik. Terjemahkan vonis medis dokter ini agar mudah dipahami oleh guru biasa.\n\nInstruksi Translasi Rekam Medis:\n1. BAHASA GURU: Ubah bahasa *Diagnostic and Statistical Manual* (DSM/IQ) yang rumit dari: {{diagnosa_resmi}} menjadi penjelasan ramah guru tentang apa sebenarnya kesulitan anak ini.\n2. RENCANA AKSI (ACTION PLAN): Ubah rekomendasi abstrak terapis dari: {{rekomendasi_ahli}} menjadi target belajar konkret yang bisa dipraktikkan langsung di kelas (Contoh: Butuh duduk di depan, atau butuh media gambar)."
    },
    {
      id: 'mapping_profile',
      nama: 'Profil Belajar Anak (Mapping Profile)',
      icon: '🧩',
      components: [
        { id: 'baseline_kemampuan', label: 'Baseline (Kelebihan & Kekurangan Akademik/Fisik)', type: 'textarea' },
        { id: 'trigger_tantrum', label: 'Pemicu Emosi (Trigger Tantrum) & Reinforcer Positif', type: 'textarea' }
      ],
      ai_prompt: "Sebagai Terapis Perilaku Kognitif. Susun *Student Mapping Profile* yang holistik tanpa berpusat pada kekurangannya saja!\n\nPenyusunan Profil Anak:\n1. PENDEKATAN KEKUATAN (STRENGTH-BASED): Rangkai draf catatan: {{baseline_kemampuan}} dengan menonjolkan potensi *superpower* anak (visual, bakat mekanik) sebagai pengimbangnya.\n2. NAVIGASI EMOSI: Berikan peringatan keras dan solusi menghadapi ledakan tantrum si anak di kelas, mengacu pada data pemicu (suara keras/dll) dan tuliskan apa *reward* favoritnya (reinforcer) dari input: {{trigger_tantrum}}."
    }
  ]
};
