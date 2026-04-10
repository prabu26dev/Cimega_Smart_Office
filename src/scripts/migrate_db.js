const admin = require('firebase-admin');
const path = require('path');

// Mengambil kunci dari root folder
const serviceAccount = require(path.join(process.cwd(), 'serviceAccountKey.json'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const DEFAULT_ID = "NPSN_MIGRATE_2026";
const EXPIRY = new Date();
EXPIRY.setFullYear(EXPIRY.getFullYear() + 1);

async function startMigration() {
  console.log("🚀 Memulai sinkronisasi data ke Multi-Tenant SaaS...");

  // Koleksi yang akan diproses (termasuk 'konten' dari screenshot Anda)
  const collections = ["users", "students", "perencanaan", "konten", "spj", "bku", "chats"];

  try {
    for (const colName of collections) {
      console.log(`\nMemeriksa koleksi: [${colName}]`);
      const snapshot = await db.collection(colName).get();

      if (snapshot.empty) {
        console.log(`- Koleksi ini kosong.`);
        continue;
      }

      const batch = db.batch();
      let count = 0;

      snapshot.forEach((doc) => {
        const data = doc.data();
        const updates = {};

        // Injeksi school_id
        if (!data.school_id) {
          updates.school_id = DEFAULT_ID;
        }

        // Injeksi expiredDate untuk akun
        if (colName === "users" && !data.expiredDate) {
          updates.expiredDate = admin.firestore.Timestamp.fromDate(EXPIRY);
          updates.status_akun = "Aktif";
        }

        // Tandai konten lama sebagai 'Global' agar tidak hilang bagi sekolah lain
        if (colName === "konten" && data.isGlobal === undefined) {
          updates.isGlobal = true;
        }

        if (Object.keys(updates).length > 0) {
          batch.update(doc.ref, {
            ...updates,
            migratedAt: admin.firestore.Timestamp.now()
          });
          count++;
        }
      });

      if (count > 0) {
        await batch.commit();
        console.log(`✅ Berhasil memperbarui ${count} data.`);
      }
    }
    console.log("\n✨ SEMUA DATA TELAH DIPERBARUI! Firestore Anda kini siap digunakan.");
    process.exit(0);
  } catch (e) {
    console.error("❌ ERROR:", e.message);
    process.exit(1);
  }
}

startMigration();