'use strict';
// ================================================================
// CIMEGA SMART OFFICE — src/scripts/hash_passwords.js
//
// Skrip SATU KALI: Migrasi password plaintext di Firestore
// koleksi 'users' menjadi SHA-256 hash.
//
// CARA PAKAI:
//   1. Pastikan sudah ada serviceAccountKey.json di root folder
//   2. Jalankan: node src/scripts/hash_passwords.js
//   3. Atau simulasi: DRY_RUN=true node src/scripts/hash_passwords.js
//
// KEAMANAN:
//   - Hanya memproses password yang belum di-hash (bukan 64 hex chars)
//   - Menggunakan Node.js native crypto (SHA-256, tidak perlu library)
//   - DRY_RUN mode untuk verifikasi sebelum menulis
// ================================================================
const admin  = require('firebase-admin');
const crypto = require('crypto');
const path   = require('path');
const fs     = require('fs');

const TARGET_PROJECT_ID = 'cimega-smart-office';
const DRY_RUN           = process.env.DRY_RUN === 'true';

if (DRY_RUN) {
  console.log('\n🟡 DRY RUN MODE — tidak ada yang ditulis ke Firestore\n');
} else {
  console.log('\n⚠️  LIVE MODE — password AKAN diupdate ke SHA-256 hash\n');
}

// ── Load & validasi serviceAccountKey ─────────────────────────
const keyPath = path.resolve(process.cwd(), 'serviceAccountKey.json');
if (!fs.existsSync(keyPath)) {
  console.error('❌ serviceAccountKey.json tidak ditemukan.');
  process.exit(1);
}
const serviceAccount = JSON.parse(fs.readFileSync(keyPath, 'utf-8'));
if (serviceAccount.project_id !== TARGET_PROJECT_ID) {
  console.error(`❌ ABORT: Project ID salah! Got: ${serviceAccount.project_id}`);
  process.exit(1);
}

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

// ── SHA-256 via Node.js crypto ─────────────────────────────────
function sha256(text) {
  return crypto.createHash('sha256').update(text, 'utf8').digest('hex');
}

// ── Deteksi apakah string adalah SHA-256 hash ──────────────────
function isHashed(str) {
  return typeof str === 'string' && /^[a-f0-9]{64}$/.test(str);
}

async function hashPasswords() {
  console.log('🔐 Memulai migrasi password → SHA-256...\n');

  const snapshot = await db.collection('users').get();

  if (snapshot.empty) {
    console.log('Koleksi users kosong.');
    process.exit(0);
  }

  let total    = 0;
  let skipped  = 0;
  let migrated = 0;
  let failed   = 0;

  const batch = db.batch();

  snapshot.forEach((doc) => {
    total++;
    const data = doc.data();

    if (!data.password) {
      console.log(`  [SKIP] ${doc.id} — tidak ada field password`);
      skipped++;
      return;
    }

    if (isHashed(data.password)) {
      console.log(`  [SKIP] ${doc.id} — sudah di-hash ✅`);
      skipped++;
      return;
    }

    // Password masih plaintext — hash sekarang
    const hashed = sha256(data.password);
    console.log(`  [HASH] ${doc.id} (${data.username || '?'}) — plaintext → sha256`);

    if (!DRY_RUN) {
      try {
        batch.update(doc.ref, {
          password:    hashed,
          passwordV:   2,          // versi hash (untuk upgrade ke bcrypt nanti)
          hashedAt:    admin.firestore.Timestamp.now(),
        });
        migrated++;
      } catch (e) {
        console.error(`  ❌ Gagal hash ${doc.id}: ${e.message}`);
        failed++;
      }
    } else {
      migrated++;
    }
  });

  if (!DRY_RUN && migrated > 0) {
    await batch.commit();
  }

  console.log(`\n${'─'.repeat(50)}`);
  console.log(`📊 HASIL MIGRASI PASSWORD`);
  console.log(`   Total user   : ${total}`);
  console.log(`   Di-hash baru : ${migrated}${DRY_RUN ? ' (simulasi)' : ''}`);
  console.log(`   Dilewati     : ${skipped} (sudah hash / kosong)`);
  console.log(`   Gagal        : ${failed}`);
  console.log(`${'─'.repeat(50)}`);

  if (DRY_RUN) {
    console.log('\n   Jalankan tanpa DRY_RUN=true untuk menerapkan perubahan.');
  } else {
    console.log('\n✅ Semua password berhasil dimigrasi ke SHA-256.');
    console.log('   Login page sudah mendukung hash ini secara otomatis.');
  }

  process.exit(0);
}

hashPasswords().catch((e) => {
  console.error('❌ Fatal error:', e.message);
  process.exit(1);
});
