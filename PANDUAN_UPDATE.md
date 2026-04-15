# 🚀 PANDUAN SISTEM UPDATE OTOMATIS
## Cimega Smart Office v2.0

> Sistem pembaruan aplikasi berbasis **GitHub Releases** yang mendistribusikan versi terbaru
> ke seluruh perangkat pengguna secara otomatis — tanpa intervensi teknis dari guru.

---

## 📋 Daftar Isi

1. [Cara Kerja Sistem](#cara-kerja-sistem)
2. [Setup Awal (Sekali Saja)](#setup-awal-sekali-saja)
3. [Merilis Update Baru](#merilis-update-baru)
4. [Push Update dari Admin Panel](#push-update-dari-admin-panel)
5. [Tabel Referensi Cepat](#tabel-referensi-cepat)
6. [Troubleshooting](#troubleshooting)

---

## 🔄 Cara Kerja Sistem

```
Admin klik "Push Update ke Pengguna" di Admin Panel
              ↓
Firebase Firestore diperbarui:
  • versi baru (misal: 2.1.0)
  • URL download file .exe dari GitHub Releases
  • tipe: wajib / opsional
  • catatan pembaruan (changelog)
              ↓
Setiap 30 menit, aplikasi pengguna memeriksa Firestore secara otomatis
              ↓
Versi berbeda terdeteksi → Popup notifikasi muncul di layar pengguna
              ↓
Pengguna klik "Update Sekarang"
              ↓
File .exe diunduh otomatis (progress bar tersedia)
              ↓
Pengguna klik "Install Sekarang"
              ↓
Installer berjalan · Aplikasi lama ditutup otomatis · Versi baru aktif ✅
```

> **Catatan:** Jika tipe update adalah **Wajib (Mandatory)**, tombol *"Nanti"* tidak akan
> muncul — pengguna wajib melakukan pembaruan sebelum dapat menggunakan aplikasi.

---

## ⚙️ Setup Awal (Sekali Saja)

### Langkah 1 — Buat Repository GitHub

1. Buka [github.com](https://github.com) dan login ke akun Anda
2. Klik tombol **New repository**
3. Nama repository: `Cimega_Smart_Office`
4. Visibilitas: **Public** (gratis, tanpa batas)
5. Klik **Create repository**

---

### Langkah 2 — Konfigurasi `package.json`

Buka `package.json`, temukan blok `"publish"` dan sesuaikan:

```json
"publish": {
  "provider": "github",
  "owner": "prabu26dev",
  "repo": "Cimega_Smart_Office"
}
```

> Ganti `prabu26dev` dengan **username GitHub** Anda yang sebenarnya.

---

### Langkah 3 — Konfigurasi File `.env`

Tambahkan baris berikut di file `.env` (buat jika belum ada):

```env
# ── GitHub Auto-Updater ─────────────────────────
GITHUB_OWNER=prabu26dev
GITHUB_REPO=Cimega_Smart_Office
```

---

### Langkah 4 — Konfigurasi Firestore

Di **Firebase Console → Firestore Database**, buat atau perbarui dokumen:

```
Koleksi  : appConfig
Dokumen  : version
Field    : {
  "currentVersion"  : "2.0.0",
  "downloadUrl"     : "",
  "updateType"      : "optional",
  "changelog"       : "Versi awal.",
  "githubOwner"     : "prabu26dev",
  "githubRepo"      : "Cimega_Smart_Office",
  "updatedAt"       : <server timestamp>
}
```

---

### Langkah 5 — Install Dependensi

```bash
npm install --legacy-peer-deps
```

---

### Langkah 6 — Verifikasi Integrasi

Auto-Updater sudah terintegrasi secara otomatis di `admin.html` dan `dashboard.html`.
Sistem menggunakan **IPC Bridge v5.0** yang mengekspos fungsi berikut via `preload.js`:

| Fungsi (cimegaAPI / cimegaConfig) | IPC Channel | Keterangan |
|---|---|---|
| `checkGithubUpdate(opts)` | `check-github-update` | Cek versi terbaru di GitHub Releases |
| `downloadUpdate(opts)` | `download-update` | Unduh file installer |
| `installUpdate(opts)` | `install-update` | Jalankan installer & tutup app |
| `onDownloadProgress(cb)` | `update-download-progress` | Listener progress unduhan |
| `removeDownloadListener()` | — | Bersihkan listener setelah selesai |

> ⚠️ Sebelum v2.0, fungsi-fungsi ini **tidak di-expose** di `preload.js`, menyebabkan
> fitur updater tidak berfungsi. Hal ini sudah diperbaiki di versi sekarang.

---

## 📦 Merilis Update Baru

### Langkah 1 — Naikkan Versi di `package.json`

```json
{
  "version": "2.1.0"
}
```

### Langkah 2 — Build Installer Windows

```bash
npm run build:win
```

File installer akan tersedia di folder `dist/` dengan ekstensi `.exe`.

### Langkah 3 — Upload ke GitHub Releases

1. Buka repository GitHub Anda
2. Klik **Releases** → **Draft a new release**
3. **Tag version:** `v2.1.0`
4. **Release title:** `Cimega Smart Office v2.1.0`
5. Klik **Attach binaries** dan upload file `.exe` dari folder `dist/`
6. Tulis **Release Notes** (changelog fitur baru, bug fix)
7. Klik **Publish release**

> GitHub akan meng-generate URL permanen untuk file installer Anda.
> Format URL: `https://github.com/{owner}/{repo}/releases/download/v2.1.0/Cimega-Smart-Office-Setup-2.1.0.exe`

---

## 📡 Push Update dari Admin Panel

Setelah GitHub Release dipublikasikan, distribusikan ke semua pengguna:

1. Login ke **Admin Panel** (`admin.html`)
2. Buka menu **Update Aplikasi** di sidebar kiri
3. Isi form pembaruan:

| Field | Contoh Isian |
|---|---|
| **Versi Baru** | `2.1.0` |
| **URL Download** | URL file `.exe` dari GitHub Releases |
| **Tipe Update** | `mandatory` (wajib) atau `optional` (opsional) |
| **Catatan Update** | Ringkasan fitur baru & perbaikan |

4. Klik **🚀 Push Update ke Semua Pengguna**

### Hasil yang Diharapkan

```
✅ Firestore "appConfig/version" diperbarui
✅ Notifikasi otomatis terkirim ke semua perangkat aktif
✅ Popup update muncul di layar pengguna dalam ≤ 30 menit
✅ Riwayat update tersimpan di koleksi "updateHistory"
```

---

## 📊 Tabel Referensi Cepat

| Jenis Perubahan | Perlu Build `.exe` Baru? | Cara Distribusi |
|---|---|---|
| Data guru / sekolah baru | ❌ Tidak | Otomatis real-time via Firestore |
| Tambah / edit konten dokumen | ❌ Tidak | Admin Panel → Sinkron |
| Tambah template AI baru | ❌ Tidak | Admin Panel → Template AI → Sinkron |
| Tambah / hapus musik BGM | ❌ Tidak | Admin Panel → Kelola Musik → Upload + Sinkron |
| Perbaikan bug / fitur baru | ✅ Ya | Build .exe → GitHub Release → Push Update |
| Perubahan desain UI | ✅ Ya | Build .exe → GitHub Release → Push Update |

| Informasi | Keterangan |
|---|---|
| Interval pengecekan update | Setiap **30 menit** secara otomatis |
| Ukuran file installer | ~80–200 MB (tergantung aset musik) |
| Penyimpanan GitHub Releases | Gratis hingga **2 GB** per release |
| OS yang didukung | Windows 10 / 11 (64-bit) |
| Update tipe `mandatory` | Pengguna **wajib** update, tombol *"Nanti"* tidak muncul |
| Update tipe `optional` | Pengguna dapat menunda, muncul kembali sesi berikutnya |

---

## 🔧 Troubleshooting

### ❌ Popup update tidak muncul di perangkat pengguna

**Kemungkinan penyebab & solusi:**

- Pastikan field `currentVersion` di Firestore `appConfig/version` **berbeda** dengan versi di `package.json` perangkat pengguna
- Periksa koneksi internet aktif di perangkat pengguna
- Pastikan `CimegaUpdater.startChecking(db)` dipanggil setelah `db` (Firestore instance) berhasil diinisialisasi
- Cek bahwa `checkGithubUpdate`, `downloadUpdate`, dan `installUpdate` sudah ter-expose di `preload.js` (bridge IPC v5.0)

---

### ❌ Unduhan file installer gagal / berhenti di tengah

**Kemungkinan penyebab & solusi:**

- Verifikasi URL download di Firestore mengacu ke file yang benar dan sudah **Published** (bukan Draft)
- Buka URL download secara manual di browser untuk memastikan file dapat diakses
- Periksa apakah GitHub repository berstatus **Public** — file dari private repo tidak dapat diunduh tanpa token

---

### ❌ Installer tidak mau berjalan / diblokir sistem

**Kemungkinan penyebab & solusi:**

- Jalankan installer sebagai **Administrator** (klik kanan → *Run as Administrator*)
- Nonaktifkan sementara antivirus selama proses instalasi (program baru yang belum memiliki sertifikat Code Signing dapat memicu false positive)
- Jika muncul SmartScreen Windows, klik **More info → Run anyway**

---

### ❌ Tombol "Push Update" di Admin Panel tidak merespons

**Kemungkinan penyebab & solusi:**

- Pastikan akun yang login memiliki role `admin`
- Pastikan Firestore Rules sudah diperbarui ke versi v2.0 (file `firestore.rules.txt`)
- Periksa Console browser (F12) untuk pesan error lebih detail

---

<div align="center">

**© 2026 Cimega Dev — SDN Cimega**

*Sistem Update Otomatis · Cimega Smart Office v2.0*

</div>
