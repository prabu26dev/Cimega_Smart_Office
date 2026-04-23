# Cimega Smart Office

Platform Administrasi Sekolah Cerdas — Kurikulum Merdeka 2025/2026.
Proyek ini sedang dalam masa transisi arsitektur dari Vanilla JS/HTML menuju React + Vite, dibungkus sebagai aplikasi desktop menggunakan **Electron**.

## Fitur Utama
- **Desktop Wrapper**: Electron.js untuk akses *native* dan performa tinggi di Windows.
- **Backend & Database**: Firebase Firestore, Firebase Auth, dan sinkronisasi ke Supabase.
- **AI Asisten**: Terintegrasi dengan Gemini AI untuk bantuan cerdas.
- **Global Cyberpunk Modal System**: UI/UX kustom berbasis *Glassmorphism* & *Beveled Corners* yang sepenuhnya *offline* (bebas dari alert bawaan OS).
- **Document Generator**: Ekspor PDF, Word, dan Excel otomatis menggunakan `pdfmake`, `docx`, dan `exceljs` dengan dukungan font administrasi standar secara *offline*.

## Struktur Direktori Utama (`src/`)
- `src/assets/`: Aset statis (Gambar, Musik, dan Font Lokal).
- `src/features/`: Logika spesifik per modul (Dashboard, Admin, dll).
- `src/pages/`: Antarmuka HTML utama.
- `src/services/`: Layanan terpusat (API, Firebase, integrasi AI, Document Generator, dll).
  - `electron/`: Script *entry point* Electron (`main.js`, `preload.js`).
- `src/utils/`: Script bantuan, *formatter*, dan *CyberDialog system*.

## Persyaratan Sistem & Instalasi

### 1. Kredensial Firebase
Pastikan Anda memiliki file `serviceAccountKey.json` yang ditempatkan di dalam `src/services/api/` (file ini diabaikan oleh Git demi keamanan).

### 2. Font Offline Administrasi
Untuk menggunakan fitur **Document Generator** secara *offline*, pastikan Anda menyalin font standar (Arial & Times New Roman) dari sistem operasi Anda (misal: `C:\Windows\Fonts\`) ke dalam folder `src/assets/fonts/`.

### 3. Cara Menjalankan
1. Instal dependensi:
   ```bash
   npm install
   ```
2. Jalankan aplikasi (Development):
   ```bash
   npm start
   ```
3. Build Installer (Windows):
   ```bash
   npm run build:win
   ```

## Catatan Kontribusi & Keamanan
Mohon jangan mengunggah file kredensial (`.env`, `*.json` service accounts) atau file binary berukuran besar (seperti `.mp3` di `assets_music` atau font berlisensi) ke repositori publik ini. Aturan ini sudah dikonfigurasi dalam `.gitignore`.
