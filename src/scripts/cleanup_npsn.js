/**
 * =============================================================
 * CIMEGA SMART OFFICE — Database NPSN Cleanup Script
 * DESKRIPSI: Skrip ini akan mengosongkan school_id yang menggunakan
 *           ID migrasi 'NPSN_MIGRATE_2026' di Firestore.
 * =============================================================
 */

const admin = require('firebase-admin');

// 1. Inisialisasi Firebase Admin
// Pastikan file serviceAccountKey.json ada di root aplikasi
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function cleanupNPSN() {
  console.log('🚀 Memulai pembersihan NPSN_MIGRATE_2026...');
  
  const collections = ['users', 'sekolah'];
  let totalFixed = 0;

  for (const colName of collections) {
    console.log(`\n🔍 Memeriksa koleksi: ${colName}...`);
    const snap = await db.collection(colName)
      .where('school_id', '==', 'NPSN_MIGRATE_2026')
      .get();

    if (snap.empty) {
      console.log(`✅ Koleksi ${colName} bersih.`);
      continue;
    }

    const batch = db.batch();
    snap.forEach(doc => {
      console.log(`📍 Menghapus ID migrasi di dokumen: ${doc.id}`);
      batch.update(doc.ref, { school_id: '' });
      totalFixed++;
    });

    await batch.commit();
    console.log(`✅ Berhasil memperbaiki ${snap.size} dokumen di ${colName}.`);
  }

  console.log(`\n✨ SELESAI! Total ${totalFixed} dokumen telah dibersihkan.`);
  process.exit(0);
}

cleanupNPSN().catch(err => {
  console.error('❌ Terjadi kesalahan:', err);
  process.exit(1);
});
