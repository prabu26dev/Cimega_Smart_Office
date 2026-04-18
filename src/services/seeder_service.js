/**
 * =============================================================
 * CIMEGA SMART OFFICE — Firestore Seeder Service
 * DESKRIPSI: Seed data awal ke Firestore saat pertama kali app dijalankan.
 *
 * CATATAN v1 (2025):
 * - Template administrasi TIDAK lagi di-seed dari sini.
 *   Template dikelola penuh dari Admin Panel → tombol SINKRON TEMPLATE AI
 *   yang mendorong 75 template dari admin_master_data.js ke Firestore.
 * - Seeder ini hanya bertugas memastikan playlist musik default tersedia
 *   agar Background Music (BGM) bisa langsung berjalan saat pertama install.
 * =============================================================
 */

const admin = require('firebase-admin');

async function seedInitialTemplates(db) {
  // ── SEED DATA INTI ──
  // Template dan kategori sekarang dikelola penuh melalui Admin Panel.
  // Seeder ini dikosongkan untuk memastikan kondisi "Clean Slate".

  // ── SEED MUSIK DEFAULT (Hanya jika koleksi app_music kosong) ──
  try {
    const musicRef = db.collection('app_music');
    const musicSnap = await musicRef.limit(1).get();
    if (!musicSnap.empty) return; // Sudah ada data, tidak perlu seed

    const songs = [
      {
        title: 'Himne SDN Cimega',
        audioUrl: 'assets_music/Kang Prabu - Himne SDN Cimega.mp3',
        status: 'active',
      },
      {
        title: 'Mars SDN Cimega',
        audioUrl: 'assets_music/Kang Prabu - Mars SDN Cimega.mp3',
        status: 'active',
      },
    ];

    const musicBatch = db.batch();
    songs.forEach(song => {
      const ref = musicRef.doc();
      musicBatch.set(ref, {
        ...song,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    });

    await musicBatch.commit();
    console.log('[Seeder] Playlist default ditambahkan ke Firestore.');

  } catch (err) {
    console.warn('[Seeder] Musik gagal (non-fatal):', err.message);
  }
}

module.exports = { seedInitialTemplates };
