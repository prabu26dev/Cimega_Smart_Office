async function runCimegaDeepMigration() {
  console.log("🚀 Memulai Migrasi Deep Database Cimega...");

  const { collection, getDocs, writeBatch, doc, Timestamp, query, where } = window._fb;
  if (!db || !window._fb) {
    console.error("Firebase belum terinisialisasi!");
    return;
  }

  const DEFAULT_ID = "NPSN_MIGRATE";
  const EXPIRY = new Date();
  EXPIRY.setFullYear(EXPIRY.getFullYear() + 1);

  // Daftar koleksi yang wajib memiliki school_id
  const targetCollections = ["users", "students", "perencanaan", "asesmen", "bku", "spj", "supervisi"];

  try {
    for (const colName of targetCollections) {
      console.log(`Memproses koleksi: ${colName}...`);
      const snap = await getDocs(collection(db, colName));
      const batch = writeBatch(db);
      let count = 0;

      snap.forEach((d) => {
        const data = d.data();
        const updates = {};

        // Tambahkan school_id jika absen
        if (!data.school_id) {
          updates.school_id = DEFAULT_ID;
        }

        // Khusus User: Tambahkan Masa Aktif
        if (colName === "users" && !data.expiredDate) {
          updates.expiredDate = Timestamp.fromDate(EXPIRY);
          updates.status_akun = "Aktif";
        }

        if (Object.keys(updates).length > 0) {
          batch.update(doc(db, colName, d.id), {
            ...updates,
            updatedAt: Timestamp.now()
          });
          count++;
        }
      });

      if (count > 0) {
        await batch.commit();
        console.log(`✅ ${colName}: Berhasil update ${count} dokumen.`);
      }
    }

    alert("Migrasi Selesai! Seluruh data peran telah diberi label sekolah default.");
  } catch (e) {
    console.error("❌ Gagal:", e);
    alert("Migrasi Gagal: " + e.message);
  }
}