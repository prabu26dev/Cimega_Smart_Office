'use strict';
// ================================================================
// CIMEGA SMART OFFICE v2.0 — src/scripts/migrate_db.js
//
// Skrip migrasi & normalisasi Firestore untuk arsitektur Multi-Tenant
// Kurikulum Merdeka 2025/2026 dengan 12 Role.
//
// CARA PAKAI:
//   Simulasi (tidak menulis):    DRY_RUN=true node src/scripts/migrate_db.js
//   Jalankan sungguhan:          node src/scripts/migrate_db.js
//   Koleksi spesifik saja:       COL=users node src/scripts/migrate_db.js
//
// YANG DILAKUKAN:
//   - Injeksi field 'school_id' ke semua dokumen yang belum punya
//   - Normalisasi 'role' user ke 12 role yang valid
//   - Tambah 'roles' array (untuk multi-role) jika belum ada
//   - Set 'status' & 'expiredDate' untuk akun user baru
//   - Normalisasi 'status' app_music ke 'active'
//   - Set 'dibaca: false' default pada notifications yang belum ada
//   - Hapus field usang (isGlobal) dari koleksi konten
//
// KEAMANAN:
//   - Project ID guard: abort jika bukan project yang benar
//   - Koleksi whitelist: hanya memproses koleksi yang terdaftar
//   - DRY_RUN mode: lihat perubahan sebelum menulis
//   - Batch commit: semua perubahan per koleksi atomik
// ================================================================

const admin = require('firebase-admin');
const path  = require('path');
const fs    = require('fs');

// ── Konfigurasi ──────────────────────────────────────────────────
const TARGET_PROJECT_ID = 'cimega-smart-office'; // ← Sesuaikan jika berbeda
const DEFAULT_SCHOOL_ID = 'NPSN_MIGRATE_2026';   // Fallback school_id untuk data lama
const DRY_RUN           = process.env.DRY_RUN === 'true';
const TARGET_COL        = process.env.COL || null; // Opsional: filter 1 koleksi saja

// 12 role valid di sistem Cimega v2.0
const VALID_ROLES = new Set([
  'admin', 'guru', 'guru_pai', 'guru_pjok', 'kepsek',
  'bendahara', 'ops', 'tu', 'gpk', 'ekskul',
  'koordinator', 'fasilitator', 'pustakawan'
]);

// Expired date default: 1 tahun dari sekarang
const EXPIRY = new Date();
EXPIRY.setFullYear(EXPIRY.getFullYear() + 1);

// ── Koleksi yang diizinkan dimigrasi ────────────────────────────
// Key   = nama koleksi Firestore
// Value = fungsi migrator(data, docId) → {} delta update | null (skip)
const COLLECTION_MIGRATORS = {

  // ────────── USERS ──────────────────────────────────────────────
  users: (data) => {
    const updates = {};

    // Injeksi school_id
    if (!data.school_id) updates.school_id = DEFAULT_SCHOOL_ID;

    // Normalisasi role ke 12 role valid
    if (data.role && !VALID_ROLES.has(data.role)) {
      // Mapping role lama → baru
      const ROLE_MAP = {
        'operator': 'ops',
        'bendaharaSekolah': 'bendahara',
        'tatausaha': 'tu',
        'penjagaPerpustakaan': 'pustakawan',
        'pembimbing': 'gpk',
        'penduluanEkskul': 'ekskul',
      };
      updates.role = ROLE_MAP[data.role] || 'guru'; // default ke guru jika tidak dikenal
    }

    // Pastikan field 'roles' array ada (untuk multi-role support)
    const currentRole = updates.role || data.role;
    if (!data.roles || !Array.isArray(data.roles) || data.roles.length === 0) {
      updates.roles = currentRole ? [currentRole] : ['guru'];
    }

    // Injeksi expiredDate & status_akun
    if (data.role !== 'admin') {
      if (!data.expiredDate) {
        updates.expiredDate = admin.firestore.Timestamp.fromDate(EXPIRY);
      }
      if (!data.status_akun) {
        updates.status_akun = 'Aktif';
      }
      if (!data.status) {
        updates.status = 'aktif';
      }
    }

    // Field usang: hapus status_akun duplikat jika ada keduanya
    // (sistem baru pakai 'status' saja, tapi kita keep 'status_akun' untuk kompatibilitas)

    return Object.keys(updates).length > 0 ? updates : null;
  },

  // ────────── SEKOLAH ────────────────────────────────────────────
  sekolah: (data) => {
    const updates = {};

    if (!data.status) updates.status = 'aktif';

    // Pastikan field kunci ada
    if (!data.school_secret_key) {
      // Generate key placeholder — admin harus generate ulang dari panel
      updates.school_secret_key = '';
    }

    return Object.keys(updates).length > 0 ? updates : null;
  },

  // ────────── KONTEN ─────────────────────────────────────────────
  konten: (data) => {
    const updates = {};

    if (!data.school_id) updates.school_id = DEFAULT_SCHOOL_ID;
    if (!data.status)    updates.status    = 'aktif';

    // Hapus field usang dari arsitektur lama
    if ('isGlobal' in data) {
      // Firestore Admin SDK menggunakan FieldValue.delete() untuk hapus field
      updates.isGlobal = admin.firestore.FieldValue.delete();
    }

    return Object.keys(updates).length > 0 ? updates : null;
  },

  // ────────── KATEGORI ───────────────────────────────────────────
  kategori: (data) => {
    const updates = {};

    if (!data.school_id) updates.school_id = DEFAULT_SCHOOL_ID;

    // Validasi role kategori
    if (data.role && !VALID_ROLES.has(data.role)) {
      updates.role = 'guru'; // fallback
    }

    return Object.keys(updates).length > 0 ? updates : null;
  },

  // ────────── APP_MUSIC ──────────────────────────────────────────
  app_music: (data) => {
    const updates = {};

    if (!data.status)     updates.status    = 'active';
    if (!data.localFile && data.audioUrl) {
      // Ekstrak nama file dari URL sebagai referensi
      try {
        const segments = data.audioUrl.split('/');
        const rawName  = decodeURIComponent(segments[segments.length - 1]);
        // Hapus prefix timestamp jika ada (format: 1234567890_filename.mp3)
        updates.localFile = rawName.replace(/^\d+_/, '');
      } catch (_) { /* skip jika URL tidak bisa diparsing */ }
    }

    return Object.keys(updates).length > 0 ? updates : null;
  },

  // ────────── NOTIFICATIONS ──────────────────────────────────────
  notifications: (data) => {
    const updates = {};

    if (data.dibaca === undefined) updates.dibaca = false;
    if (!data.type) updates.type = 'info';

    return Object.keys(updates).length > 0 ? updates : null;
  },

  // ────────── ADMIN_TEMPLATES ────────────────────────────────────
  admin_templates: (data) => {
    const updates = {};

    // Pastikan structure komponen ada
    if (!data.components && data.template) {
      updates.components = []; // admin bisa isi via panel
    }
    if (!data.role && data.roles && data.roles.length > 0) {
      updates.role = data.roles[0]; // ambil role pertama sebagai primary
    }

    return Object.keys(updates).length > 0 ? updates : null;
  },

  // ────────── CHATS ──────────────────────────────────────────────
  chats: (data) => {
    const updates = {};
    if (!data.school_id) updates.school_id = DEFAULT_SCHOOL_ID;
    return Object.keys(updates).length > 0 ? updates : null;
  },

  // ────────── ADMIN LOG ──────────────────────────────────────────
  adminLog: (data) => {
    // adminLog adalah append-only — tidak perlu migrasi field
    return null;
  },

  // ────────── UPDATE HISTORY ─────────────────────────────────────
  updateHistory: (data) => {
    const updates = {};
    if (!data.status) updates.status = 'released';
    return Object.keys(updates).length > 0 ? updates : null;
  },
};

// ── Helper: Header separator ─────────────────────────────────────
const SEP = '─'.repeat(60);

// ── Main migration function ──────────────────────────────────────
async function startMigration() {
  console.log('\n' + SEP);
  console.log('  CIMEGA SMART OFFICE v2.0 — Firestore Migration Script');
  console.log(SEP);
  console.log(`  Target Project : ${TARGET_PROJECT_ID}`);
  console.log(`  Mode           : ${DRY_RUN ? '🟡 DRY RUN (simulasi)' : '🔴 LIVE (menulis ke Firestore)'}`);
  console.log(`  Filter Koleksi : ${TARGET_COL || 'semua'}`);
  console.log(SEP + '\n');

  const collectionsToRun = TARGET_COL
    ? (COLLECTION_MIGRATORS[TARGET_COL] ? [TARGET_COL] : [])
    : Object.keys(COLLECTION_MIGRATORS);

  if (collectionsToRun.length === 0) {
    console.error(`❌ Koleksi '${TARGET_COL}' tidak ada dalam whitelist migrator.`);
    process.exit(1);
  }

  const summary = {};
  let totalUpdated = 0;
  let totalSkipped = 0;
  let totalFailed  = 0;

  try {
    for (const colName of collectionsToRun) {
      console.log(`\n📂 Koleksi: [${colName}]`);

      const snapshot = await db.collection(colName).orderBy(admin.firestore.FieldPath.documentId()).get();

      if (snapshot.empty) {
        console.log(`   - Kosong, dilewati.`);
        summary[colName] = { updated: 0, skipped: 0, failed: 0 };
        continue;
      }

      const migrateFn = COLLECTION_MIGRATORS[colName];
      const batch     = db.batch();
      let updated = 0;
      let skipped = 0;
      let failed  = 0;

      snapshot.forEach((doc) => {
        try {
          const delta = migrateFn(doc.data(), doc.id);

          if (!delta || Object.keys(delta).length === 0) {
            skipped++;
            return;
          }

          const fullUpdate = {
            ...delta,
            migratedAt: admin.firestore.Timestamp.now(),
            migratedBy: 'migrate_db_v2',
          };

          if (DRY_RUN) {
            console.log(`   [DRY] ${doc.id}:`, delta);
          } else {
            batch.update(doc.ref, fullUpdate);
          }
          updated++;
        } catch (docErr) {
          console.error(`   ❌ Error dok ${doc.id}: ${docErr.message}`);
          failed++;
        }
      });

      if (!DRY_RUN && updated > 0) {
        await batch.commit();
      }

      summary[colName] = { updated, skipped, failed };
      totalUpdated += updated;
      totalSkipped += skipped;
      totalFailed  += failed;

      const modeLabel = DRY_RUN ? '(simulasi) ' : '';
      console.log(`   ✅ Diperbarui  : ${updated} dokumen ${modeLabel}`);
      console.log(`   ⏭  Dilewati    : ${skipped} dokumen (tidak perlu update)`);
      if (failed > 0) console.log(`   ❌ Gagal       : ${failed} dokumen`);
    }

    // ── Ringkasan ──────────────────────────────────────────────
    console.log('\n' + SEP);
    console.log('  RINGKASAN MIGRASI');
    console.log(SEP);
    console.log(`  Total diperbarui : ${totalUpdated}${DRY_RUN ? ' (simulasi)' : ''}`);
    console.log(`  Total dilewati   : ${totalSkipped}`);
    console.log(`  Total gagal      : ${totalFailed}`);
    console.log(SEP);
    console.log('\n  Detail per koleksi:');
    for (const [col, stat] of Object.entries(summary)) {
      console.log(`    ${col.padEnd(20)} updated:${stat.updated}  skipped:${stat.skipped}  failed:${stat.failed}`);
    }

    if (DRY_RUN) {
      console.log('\n🟡 DRY RUN selesai. Tidak ada yang ditulis.');
      console.log('   Jalankan tanpa DRY_RUN=true untuk menerapkan perubahan.\n');
    } else {
      console.log('\n✅ Migrasi Firestore selesai.\n');
    }

    process.exit(totalFailed > 0 ? 1 : 0);
  } catch (e) {
    console.error('\n❌ FATAL ERROR:', e.message);
    process.exit(1);
  }
}

// ── Load & validasi serviceAccountKey ───────────────────────────
const keyPath = path.resolve(process.cwd(), 'serviceAccountKey.json');
if (!fs.existsSync(keyPath)) {
  console.error('❌ serviceAccountKey.json tidak ditemukan.');
  console.error('   Jalankan dari root folder project: node src/scripts/migrate_db.js');
  process.exit(1);
}

let serviceAccount;
try {
  serviceAccount = JSON.parse(fs.readFileSync(keyPath, 'utf-8'));
} catch (e) {
  console.error('❌ Gagal membaca serviceAccountKey.json:', e.message);
  process.exit(1);
}

if (serviceAccount.project_id !== TARGET_PROJECT_ID) {
  console.error(`❌ ABORT: Project ID tidak cocok!`);
  console.error(`   Expected : ${TARGET_PROJECT_ID}`);
  console.error(`   Got      : ${serviceAccount.project_id}`);
  process.exit(1);
}

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

// ── Run ──────────────────────────────────────────────────────────
startMigration().catch((e) => {
  console.error('❌ Unhandled error:', e.message);
  process.exit(1);
});