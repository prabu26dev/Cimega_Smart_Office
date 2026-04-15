// src/firebase/config.js
//
// ⚠️  FILE INI HANYA UNTUK REFERENSI ARSITEKTUR — TIDAK DIGUNAKAN SAAT RUNTIME
//
// Aplikasi Cimega Smart Office menggunakan arsitektur Electron dengan IPC Bridge
// (preload.js) untuk mengambil konfigurasi Firebase secara aman dari .env.
//
// Firebase diinisialisasi di setiap halaman (renderer) menggunakan:
//   const firebaseConfig = window.cimegaConfig?.firebase
//                        || await window.cimegaAPI?.getFirebaseConfig();
//
// JANGAN hardcode API key di sini. Gunakan .env dan preload.js.
// Lihat: preload.js → window.cimegaConfig.firebase
//
// ─────────────────────────────────────────────────────────────────
// Contoh penggunaan di halaman HTML (renderer):
//
//   const { initializeApp } = await import('firebase-app.js');
//   const { getFirestore } = await import('firebase-firestore.js');
//   const firebaseConfig = window.cimegaConfig?.firebase;
//   const app = initializeApp(firebaseConfig);
//   const db  = getFirestore(app);
//
// ─────────────────────────────────────────────────────────────────
// Untuk setup Firebase baru:
//   1. Buka Firebase Console → Project Settings → Web App
//   2. Salin konfigurasi ke file .env (BUKAN file ini)
//   3. Pastikan .env ada di .gitignore ✅