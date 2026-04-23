# Panduan AI Cimega Smart Office (AGENTS.md)

File ini ditujukan untuk **AI Assistant** agar langsung mengenali struktur dan aturan baku proyek **Cimega Smart Office** tanpa perlu membaca ulang seluruh direktori dari awal setiap kali memulai percakapan baru. Hal ini bertujuan untuk menghemat *token/credit* dan mempercepat *response time*.

## 1. Arsitektur Proyek
Proyek ini sedang dalam masa transisi menuju arsitektur modern:
- **Teknologi Utama**: Vanilla JS/HTML (saat ini) → React + Vite (transisi).
- **Desktop Wrapper**: Electron.
- **Backend & Database**: Firebase Firestore & Firebase Auth.

## 2. Struktur Direktori Utama (`src/`)
Jangan menebak-nebak struktur folder. Semua *source code* berada di dalam `src/`:

- **`src/assets/`**: Penyimpanan statis seperti gambar, musik, dan font.
  - Gambar/Logo: `../../assets/assets_images/` (dari dalam HTML `src/pages/`)
  - Musik BGM: `../../assets/assets_music/`
- **`src/features/`**: Komponen spesifik berdasarkan fitur/domain (misal: `admin`, `dashboard`, `auth`). Menggantikan folder `modules/` yang lama.
- **`src/pages/`**: File HTML (Vanilla) yang menjadi *view* saat ini (contoh: `src/pages/login/login.html`).
- **`src/services/`**: Layanan terpusat (API, Firebase, integrasi AI, musik).
  - **`src/services/electron/`**: Script utama Electron (`main.js`, `preload.js`).
  - **`src/services/api/`**: File konfigurasi Firebase (`serviceAccountKey.json`).
  - **`src/services/document_service.js`**: Fitur Document Generator (PDF via pdfmake, Word via docx, Excel via exceljs) lengkap dengan offline fonts (Arial & Times New Roman).
- **`src/utils/`**: Helper scripts, backup, uploaders, dsb (menggantikan folder `scripts/`).

*Lihat `public/daftar_struktur.txt` untuk peta tree direktori secara utuh tanpa `node_modules`.*

## 3. Aturan Resolusi Path (PENTING)
- Jika Anda mengedit file HTML di dalam `src/pages/nama_halaman/` dan ingin memanggil logo, path-nya adalah: `../../assets/assets_images/Logo SDN Cimega.png`
- File *entry point* Electron bukan di root, melainkan di `src/services/electron/main.js`. (Lihat file `package.json` bagian `"main"`).
- Tidak ada folder bernama `modules/`, `scripts/`, atau `shared/` lagi di *root*. Semuanya sudah dipindahkan ke dalam `src/features/`, `src/utils/`, dan `src/services/`.

## 4. Cara Menjalankan Aplikasi
- **Membuka Desktop App (Electron)**: `npm start`
- **Build Installer (Windows)**: `npm run build:win`

## 5. Instruksi Tindakan AI
Setiap kali mendapat perintah (terutama yang berkaitan dengan perubahan UI, penambahan aset, atau refaktor kode):
1. Rujuk struktur direktori di atas.
2. JANGAN menggunakan pencarian membabi-buta (*brute force file lookup*) yang boros memori jika Anda sudah bisa menyimpulkan letak file dari panduan di atas.
3. Hindari memodifikasi direktori `.git/`, `.idea/`, dan `node_modules/`.
4. Jika membuat komponen *React* baru, tempatkan di `src/components/`. Jika menambahkan halaman *React*, letakkan di `src/pages/`.
