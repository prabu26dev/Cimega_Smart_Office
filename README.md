<div align="center">

# 🏛️ CIMEGA SMART OFFICE
### Platform Administrasi Sekolah Cerdas — Generasi Berikutnya

![Version](https://img.shields.io/badge/Versi-2.0.0_STABLE-00e5ff?style=for-the-badge&logo=electron)
![Electron](https://img.shields.io/badge/Electron.js-Desktop_Engine-2b2d42?style=for-the-badge&logo=electron&logoColor=47848f)
![Firebase](https://img.shields.io/badge/Firebase-Firestore_%26_Auth-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![Supabase](https://img.shields.io/badge/Supabase-Storage_Engine-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![AI](https://img.shields.io/badge/Gemini_2.5_Flash-AI_Assistant-8B5CF6?style=for-the-badge&logo=google&logoColor=white)
![License](https://img.shields.io/badge/Lisensi-MIT_Proprietary-gold?style=for-the-badge)

> *"Satu platform. Dua belas peran. Satu visi — sekolah tanpa batas administrasi."*

</div>

---

## 🌟 Tentang Cimega Smart Office

**Cimega Smart Office** adalah platform administrasi berbasis *desktop* yang dirancang khusus untuk ekosistem pendidikan dasar (SD) tingkat Kurikulum Merdeka (Deep Learning) 2025/2026. Dibangun di atas fondasi **Electron.js**, aplikasi ini menghadirkan pengalaman kerja yang terasa seperti perangkat lunak enterprise kelas dunia — langsung di meja guru dan kepala sekolah Anda.

Lebih dari sekadar aplikasi dokumen biasa, Cimega Smart Office adalah **sistem terpadu** yang mengintegrasikan kecerdasan buatan (*AI Gemini 2.5 Flash*), basis data awan *real-time* (Firebase Firestore), penyimpanan media skala besar (Supabase Storage), dan manajemen peran berbasis akses (*Role-Based Access Control* — RBAC) dalam satu antarmuka yang elegan dan responsif.

---

## ⚡ Fitur Unggulan

### 👑 1. Super Admin Command Center
Panel kendali terpusat dengan otoritas penuh atas seluruh ekosistem:

| Fitur | Deskripsi |
|---|---|
| **Manajemen 12 Role** | Kontrol akses granular untuk: Guru Kelas, Guru PAI, Guru PJOK, Kepala Sekolah, Bendahara, Operator Sekolah, Tata Usaha, GPK/Inklusi, Pembina Ekskul, Koordinator Kokurikuler, Fasilitator, Pustakawan |
| **Kelola Multi-Sekolah** | Manajemen institusi, NPSN, kepsek, dan kunci keamanan sekolah |
| **Push Update Otomatis** | Distribusi pembaruan aplikasi via GitHub Releases ke seluruh perangkat |
| **Log Aktivitas Real-time** | Rekam jejak setiap tindakan admin secara mendetail |
| **Pengawasan Dokumen Global** | Pantau dokumen seluruh sekolah dari satu panel |

### 📚 2. Bank Administrasi — 80 Kategori, 12 Role

Sistem konten paling komprehensif untuk SD Kurikulum Merdeka:

| Role | Jumlah Kategori | Fokus Administrasi |
|---|---|---|
| Kepala Sekolah | 5 | KOSP, PBD, SDM, Sarpras, Humas |
| Guru Kelas | 10 | Perencanaan, Asesmen, Jurnal, Rapor, e-Kinerja + Pra/Pasca Tes |
| Guru PAI | 10 | CP PAI, BTQ, Akhlak, PHBI, Sanlat, PMM |
| Guru PJOK | 10 | CP PJOK, TKJI, UKS, Ekskul Olahraga, PMM |
| Koordinator Kokurikuler | 5 | Grand Design, Monitoring, LPJ |
| Fasilitator Kokurikuler | 5 | Logbook, Asesmen Karakter, Portofolio |
| Bendahara | 5 | Budgeting, Kas, SPJ, Pajak, Closing |
| Operator Sekolah | 5 | Dapodik, PTK, Kesiswaan, e-Rapor |
| Tata Usaha | 5 | Persuratan, Kepegawaian, Mutasi, Inventaris |
| GPK / Inklusi | 5 | Identifikasi, PPI, Rapor Inklusi |
| Pembina Ekskul | 5 | Program Kerja, Keanggotaan, Prestasi |
| Pustakawan | 5 | Katalogisasi, Sirkulasi, Literasi |

### 🤖 3. Asisten AI Cimega — Powered by Gemini 2.5 Flash

Chatbot AI yang kontekstual per peran, tersedia langsung di sidebar setiap halaman:
- **System Prompt Cerdas:** Setiap role mendapatkan konteks AI yang berbeda (guru mendapatkan prompt pedagogi, bendahara mendapatkan konteks akuntansi)
- **Quick Actions:** Tombol pintasan tugas yang paling sering dibutuhkan per peran
- **Generator Dokumen:** Hasilkan draft dokumen administrasi profesional dalam hitungan detik
- **Endpoint:** Express SSE Server via `ai_generator_service.js` (port 3001)

### 🎵 4. Persistent Audio Engine (BGM Cimega)

Sistem musik latar yang tidak pernah terputus:
- Dijalankan di **Main Process Electron** — musik tetap mengalir saat navigasi antar menu
- **Hybrid Playlist:** File lokal `assets_music/` + Supabase cloud (setelah sinkronisasi)
- **Upload Musik:** Tambah lagu langsung ke aplikasi lokal tanpa koneksi cloud
- **Sinkron Musik:** Distribusikan playlist ke Firestore + Supabase + semua akun user dengan satu klik
- **Fisher-Yates Shuffle:** Algoritma acak berkualitas untuk variasi pemutaran

### 🔄 5. Sistem Sinkronisasi Terpusat (Master Sync)

Admin cukup menekan **satu tombol** — seluruh ekosistem diperbarui secara atomik:
- Sinkronisasi **80 kategori** administrasi + **80 template AI** ke Firestore
- Distribusi otomatis ke **semua akun user** berdasarkan role masing-masing
- **Sinkron Musik:** Push playlist audio ke Supabase Storage + Firestore `app_music`
- Tidak ada konflik data — sistem `localFile` key memastikan idempotency

### ☁️ 6. Cimega Cloud Drive

Penyimpanan dokumen terintegrasi berbasis **Supabase Storage**:
- Upload, preview, dan berbagi dokumen antar guru satu sekolah
- Terisolasi per institusi — privasi data terjaga
- Dapat diawasi secara global oleh Super Admin

### 🔒 7. Keamanan Berlapis

| Layer | Implementasi |
|---|---|
| **Firestore Rules** | 16 koleksi terlindungi dengan RBAC per role (v2.0) |
| **Context Bridge** | `preload.js` memisahkan Node.js process dari renderer (sandboxing) |
| **Env Protection** | `.env` tidak pernah di-expose ke renderer secara langsung |
| **UI Hardening** | Klik kanan dinonaktifkan, DevTools diblokir, menu bar disembunyikan |
| **School Key** | Setiap sekolah memiliki `school_secret_key` + `emergency_backup_key` |

---

## 🏗️ Arsitektur Teknologi

```
┌─────────────────────────────────────────────────────┐
│                  CIMEGA SMART OFFICE                │
│                  Electron.js Desktop                │
├──────────────┬──────────────────────────────────────┤
│  Main Process│  Renderer Process (HTML/CSS/JS)      │
│  ──────────  │  ─────────────────────────────────   │
│  BGM Engine  │  Admin Panel      Dashboard          │
│  IPC Handlers│  Login Page       Role Pages (12x)   │
│  File System │  AI Chatbot       Cloud Drive        │
│  Auto-Updater│  Kelola Musik     Updater Widget      │
├──────────────┴──────────────────────────────────────┤
│                  IPC Bridge (preload.js v5.0)        │
│  cimegaConfig (Firebase + Supabase credentials)     │
│  cimegaAPI (Music + AI + Updater + File IPC)        │
└─────────────────────────────────────────────────────┘
         │                    │                  │
    Firebase              Supabase           GitHub
    Firestore             Storage            Releases
    Auth                  Tables             (Updates)
         │                    │
    Gemini AI           Express SSE
    (via .env key)      Port 3001
```

---

## 🛠️ Stack Teknologi

| Komponen | Teknologi | Versi |
|---|---|---|
| Desktop Runtime | Electron.js | Latest |
| UI Engine | HTML5 + Vanilla JS + CSS3 | - |
| Tipografi | Google Fonts (Orbitron, Exo 2) | CDN |
| Cloud DB | Firebase Firestore | v12.10.0 |
| Storage | Supabase Storage | Client-JS |
| AI Engine | Google Gemini 2.5 Flash | @google/generative-ai ^0.21.0 |
| AI Server | Express.js SSE | v5.2.1 |
| CORS | cors | ^2.8.6 |
| Build Tool | electron-builder | Latest |

---

## 🚀 Panduan Instalasi & Setup

### Prasyarat

Pastikan sistem Anda telah terinstal:
- [Node.js](https://nodejs.org/) versi 18 atau lebih tinggi
- [Git](https://git-scm.com/)
- Akun **Firebase** (Firestore + Storage)
- Akun **Supabase** (Storage + Database)
- API Key **Google Gemini** dari [Google AI Studio](https://aistudio.google.com/apikey)

---

### Langkah 1 — Clone Repository

```bash
git clone https://github.com/prabu26dev/Cimega_Smart_Office.git
cd Cimega_Smart_Office
```

### Langkah 2 — Install Dependensi

```bash
npm install --legacy-peer-deps
```

### Langkah 3 — Konfigurasi Environment

Buat file `.env` di root project (salin dari `.env.example`):

```env
# ─── Firebase Configuration ───────────────────────
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=123456789
FIREBASE_APP_ID=1:123456789:web:abcdef

# ─── Supabase Configuration ───────────────────────
SUPABASE_URL=https://your_project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key

# ─── Google Gemini AI ─────────────────────────────
GEMINI_API_KEY=your_gemini_api_key

# ─── App Info ─────────────────────────────────────
APP_VERSION=2.0.0
APP_NAME=Cimega Smart Office

# ─── GitHub (untuk Auto-Updater) ──────────────────
GITHUB_OWNER=prabu26dev
GITHUB_REPO=Cimega_Smart_Office
```

### Langkah 4 — Setup Firestore Rules

Buka **Firebase Console → Firestore → Rules**, salin isi file `firestore.rules.txt` dan klik **Publish**.

### Langkah 5 — Jalankan Aplikasi

```bash
# Mode development
npm start

# Build installer Windows (.exe)
npm run build:win
```

---

## 📁 Struktur Project

```
Cimega_Smart_Office/
├── 📄 main.js                    # Main Process Electron
├── 📄 preload.js                 # IPC Bridge (v5.0 STABLE)
├── 📄 package.json               # Dependensi & Build Config
├── 📄 firestore.rules.txt        # Rules Firestore v2.0 (16 koleksi, 12 role)
├── 📄 .env                       # Konfigurasi rahasia (JANGAN di-commit!)
├── 📁 assets_music/              # File audio BGM lokal
├── 📁 src/
│   ├── 📁 pages/
│   │   ├── 📁 admin/
│   │   │   ├── admin.html        # Admin Command Center
│   │   │   ├── admin_master_data.js # 80 Kategori + 80 Template AI (SSoT)
│   │   │   ├── data_master.js    # UI Sinkronisasi Sekolah & User
│   │   │   ├── oversight.js      # Pengawasan Dokumen Global
│   │   │   └── cloud_drive.js    # Cimega Cloud Drive
│   │   ├── 📁 dashboard/         # Dashboard per Role (12x)
│   │   └── 📁 login/             # Halaman Login
│   ├── 📁 shared/
│   │   ├── ai_chatbot.js         # AI Assistant (12 Role Context)
│   │   ├── ai_helper.js          # IPC Bridge ke Gemini
│   │   ├── music.js              # BGM Widget (v4.1 Sync Fix)
│   │   ├── chat.js               # Fitur Chat E2E
│   │   ├── sharing.js            # Berbagi Dokumen
│   │   ├── printer.js            # Cetak Dokumen
│   │   ├── crypto_helper.js      # Enkripsi Data
│   │   ├── updater.js            # Auto-Updater Widget
│   │   └── utils.js              # Utilitas Umum
│   └── 📁 services/
│       ├── ai_generator_service.js # Express SSE Server (Port 3001)
│       └── seeder_service.js     # Seeder Musik Default
└── 📁 assets/                    # Ikon, Logo, Aset Visual
```

---

## 👥 Role yang Didukung

Cimega Smart Office mendukung **12 peran** dengan konten administrasi dan konteks AI yang berbeda untuk setiap peran:

```
guru         →  Guru Kelas
guru_pai     →  Guru Pendidikan Agama Islam
guru_pjok    →  Guru Pendidikan Jasmani & Kesehatan
kepsek       →  Kepala Sekolah
bendahara    →  Bendahara Sekolah
ops          →  Operator Sekolah (Dapodik)
tu           →  Tata Usaha
gpk          →  Guru Pembimbing Khusus / Koordinator Inklusi
ekskul       →  Pembina Ekstrakurikuler
koordinator  →  Koordinator Kokurikuler
fasilitator  →  Fasilitator Kokurikuler
pustakawan   →  Pustakawan Sekolah
```

---

## 🔐 Keamanan & Privasi

> ⚠️ **PERHATIAN PENTING:** File `.env` mengandung kunci rahasia. **JANGAN PERNAH** meng-commit file `.env` ke repository publik. Pastikan `.env` ada di dalam `.gitignore`.

- Semua konfigurasi sensitif disimpan di `.env` dan hanya dibaca oleh `main.js` / `preload.js` di level Node.js
- Firebase credentials tidak pernah di-hardcode di source code renderer
- Firestore Security Rules memastikan setiap user hanya dapat mengakses data sesuai perannya

---

## 📝 Changelog

### v2.0.0 (April 2026) — *Major Release*
- ✅ Ekspansi ke **12 role** dari sebelumnya 4 role
- ✅ **80 kategori** administrasi lengkap untuk Kurikulum Merdeka Deep Learning
- ✅ **80 AI Prompt Template** dengan komponen dokumen yang terstruktur
- ✅ Arsitektur Kelola Musik: **Local-First + Cloud Sync** (tombol Upload Musik & Sinkron Musik)
- ✅ Firestore Rules v2.0: **16 koleksi** terlindungi, RBAC 12 role
- ✅ IPC Bridge v5.0: tambah bridge Gemini AI + Auto-Updater (sebelumnya tidak berfungsi)
- ✅ Pembersihan dependensi: hapus 4 package tidak terpakai (React, electron-log, dll)
- ✅ Perbaikan bug kritis: `oversight.js` & `cloud_drive.js` tidak ter-load di admin.html
- ✅ AI Chatbot context diperluas ke **12 role** dengan quick actions kontekstual

### v1.0.0 (Januari 2026) — *Initial Release*
- Rilis pertama dengan 4 role dasar
- Fitur BGM, Cloud Drive, AI Generator

---

## 🤝 Kontribusi & Dukungan

Dikembangkan dengan ❤️ oleh tim **Cimega Dev** untuk para pendidik SDN Cimega.

Untuk pertanyaan teknis, laporan bug, atau permintaan fitur, silakan hubungi tim pengembang melalui channel resmi sekolah.

---

<div align="center">

**© 2026 Cimega Dev — SDN Cimega · All Rights Reserved**

*"Membangun generasi cerdas dimulai dari administrasi yang cerdas."*

</div>