/**
 * =============================================================
 * CIMEGA SMART OFFICE — Firestore Seeder Service
 * DESKRIPSI: Memindahkan data statis ke Firestore (admin_templates)
 * =============================================================
 */

const admin = require('firebase-admin');

async function seedInitialTemplates(db) {
  const templatesRef = db.collection('admin_templates');
  const snapshot = await templatesRef.limit(1).get();

  if (!snapshot.empty) {
    console.log('ℹ️ Firestore Seeder: admin_templates sudah terisi.');
    return;
  }

  console.log('🚀 Firestore Seeder: Memulai seeding data template default...');

  const defaultTemplates = [
    // ── GURU ──────────────────────────────────────────────────
    {
      role: 'guru',
      kategori: 'perencanaan',
      nama: 'Modul Ajar / RPP+',
      icon: '📑',
      components: [
        { id: 'mapel', label: 'Matapelajaran', type: 'text' },
        { id: 'materi', label: 'Materi Pokok', type: 'text' },
        { id: 'fase', label: 'Fase', type: 'select', options: ['Fase A', 'Fase B', 'Fase C'] }
      ],
      ai_prompt: "Buatkan Modul Ajar Kurikulum Merdeka untuk mata pelajaran {{mapel}} materi {{materi}} pada fase {{fase}}.",
      adminType: 'modul-ajar'
    },
    {
      role: 'guru',
      kategori: 'penilaian',
      nama: 'Bank Soal & Naskah Ujian',
      icon: '🏦',
      components: [
        { id: 'mapel', label: 'Matapelajaran', type: 'text' },
        { id: 'jumlah', label: 'Jumlah Soal', type: 'number' },
        { id: 'kesulitan', label: 'Tingkat Kesulitan', type: 'select', options: ['Mudah', 'Sedang', 'HOTS'] }
      ],
      ai_prompt: "Buatkan bank soal berjumlah {{jumlah}} soal untuk mata pelajaran {{mapel}} dengan tingkat kesulitan {{kesulitan}}.",
      adminType: 'bank-soal'
    },
    // ── KEPSEK ────────────────────────────────────────────────
    {
      role: 'kepsek',
      kategori: 'perencanaan_manajemen',
      nama: 'Kurikulum (KOSP)',
      icon: '🎯',
      components: [
        { id: 'tahun', label: 'Tahun Ajaran', type: 'text' },
        { id: 'sekolah', label: 'Nama Sekolah', type: 'text' }
      ],
      ai_prompt: "Buat draf KOSP untuk {{sekolah}} tahun ajaran {{tahun}}.",
      adminType: 'kosp'
    },
    // ── BENDAHARA ──────────────────────────────────────────────
    {
      role: 'bendahara',
      kategori: 'perencanaan_anggaran',
      nama: 'e-RKAS (Rencana)',
      icon: '📑',
      components: [
        { id: 'pagu', label: 'Total Pagu Dana', type: 'number' },
        { id: 'prioritas', label: 'Kegiatan Prioritas', type: 'text' }
      ],
      ai_prompt: "Susun rencana RKAS dengan total dana {{pagu}} dengan fokus utama pada {{prioritas}}.",
      adminType: 'rkas-bendahara'
    },
    // ── OPS ───────────────────────────────────────────────────
    {
      role: 'ops',
      kategori: 'tata_usaha',
      nama: 'Agenda Surat M/K',
      icon: '📔',
      components: [
        { id: 'jenis', label: 'Jenis Surat', type: 'select', options: ['Masuk', 'Keluar'] },
        { id: 'perihal', label: 'Perihal', type: 'text' }
      ],
      ai_prompt: "Buat draf surat {{jenis}} dengan perihal {{perihal}} sesuai format dinas sekolah.",
      adminType: 'agenda-surat'
    }
  ];

  const batch = db.batch();
  defaultTemplates.forEach(tmp => {
    const ref = templatesRef.doc(`${tmp.role}_${tmp.adminType}`);
    batch.set(ref, { ...tmp, updatedAt: admin.firestore.FieldValue.serverTimestamp() });
  });

  await batch.commit();
  console.log('✅ Firestore Seeder: Selesai memindahkan 5 data template utama.');

  // Seed default music if empty
  const musicRef = db.collection('app_music');
  const musicSnap = await musicRef.limit(1).get();
  if (musicSnap.empty) {
     const musicBatch = db.batch();
     const songs = [
       { title: 'Himne SDN Cimega', audioUrl: 'assets_music/Kang Prabu - Himne SDN Cimega.mp3', status: 'active' },
       { title: 'Mars SDN Cimega', audioUrl: 'assets_music/Kang Prabu - Mars SDN Cimega.mp3', status: 'active' }
     ];
     songs.forEach(s => {
       const ref = musicRef.doc();
       musicBatch.set(ref, { ...s, createdAt: admin.firestore.FieldValue.serverTimestamp() });
     });
     await musicBatch.commit();
     console.log('✅ Firestore Seeder: Selesai seeding playlist default.');
  }
}

module.exports = { seedInitialTemplates };
