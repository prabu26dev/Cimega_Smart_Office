# 🚀 PANDUAN SISTEM UPDATE OTOMATIS
## Cimega Smart Office

---

## CARA KERJA SISTEM UPDATE

```
Admin klik "Push Update" di panel admin
              ↓
Firebase diupdate: versi baru, URL download, wajib/opsional
              ↓
Setiap 30 menit, laptop guru cek Firebase
              ↓
Versi berbeda → popup muncul di laptop guru
              ↓
Guru klik "Update Sekarang"
              ↓
File .exe diunduh otomatis (ada progress bar)
              ↓
Guru klik "Install Sekarang"
              ↓
Installer berjalan, app lama ditutup otomatis
              ↓
App versi baru terbuka ✅
```

---

## SETUP AWAL (SEKALI SAJA)

### Langkah 1 — Buat Akun & Repo GitHub
1. Buka https://github.com dan daftar/login
2. Klik tombol **New repository**
3. Nama repo: `cimega-smart-office`
4. Set **Public** (gratis unlimited)
5. Klik **Create repository**

### Langkah 2 — Edit package.json
Buka `package.json`, cari bagian `"publish"`:
```json
"publish": {
  "provider": "github",
  "owner": "GANTI_DENGAN_USERNAME_GITHUB_ANDA",
  "repo":  "cimega-smart-office"
}
```
Ganti `GANTI_DENGAN_USERNAME_GITHUB_ANDA` dengan username GitHub Anda.

### Langkah 3 — Edit .env
Tambahkan baris berikut ke file `.env`:
```
GITHUB_OWNER=username_github_anda
GITHUB_REPO=cimega-smart-office
```

### Langkah 4 — Tambahkan di Firebase (Firestore)
Di collection `appConfig`, document `version`, tambahkan field:
```
githubOwner: "username_github_anda"
githubRepo:  "cimega-smart-office"
```

### Langkah 5 — Install dependensi
Buka terminal di folder project, jalankan:
```
npm install
```

---

## CARA INTEGRASI DI HALAMAN (dashboard.html & admin.html)

Tambahkan 2 baris ini di setiap halaman, SEBELUM `</body>`:

```html
<!-- Setelah <script src="../../shared/music.js"></script> -->
<script src="../../shared/updater.js"></script>
```

Lalu di dalam fungsi `initApp()`, setelah `db` siap, tambahkan:
```javascript
// Inisialisasi updater
await CimegaUpdater.init({
  owner: 'username_github_anda',
  repo:  'cimega-smart-office',
});
// Mulai cek update otomatis
CimegaUpdater.startChecking(db);
```

**Contoh di dashboard.html** — cari bagian ini:
```javascript
async function initApp() {
  try {
    CimegaMusic.init('../../../assets_music/');
    // ... kode firebase ...
    db = getFirestore(fbApp);
    window._fb = { ... };

    // ← TAMBAHKAN DI SINI:
    await CimegaUpdater.init({ owner:'username_anda', repo:'cimega-smart-office' });
    CimegaUpdater.startChecking(db);

    setupUser();
    // ... sisa kode ...
```

---

## CARA MERILIS UPDATE BARU

### Langkah 1 — Update versi di package.json
```json
{
  "version": "1.1.0"  ← ganti versi
}
```

### Langkah 2 — Build .exe
```bash
npm run build:win
```
File .exe akan ada di folder `dist/`

### Langkah 3 — Upload ke GitHub Releases
1. Buka repo GitHub Anda
2. Klik **Releases** → **Create a new release**
3. Tag: `v1.1.0`
4. Title: `Cimega Smart Office v1.1.0`
5. Upload file `.exe` dari folder `dist/`
6. Tulis catatan update (changelog)
7. Klik **Publish release**

### Langkah 4 — Push update dari Admin Panel
1. Login sebagai admin
2. Buka menu **Update Aplikasi**
3. Isi:
   - Versi baru: `1.1.0`
   - URL Download: *(otomatis dari GitHub, atau paste URL .exe)*
   - Tipe: Wajib atau Opsional
   - Catatan update
4. Klik **Push Update ke Semua Pengguna**

### Hasil:
- Semua laptop guru akan dapat popup update dalam 30 menit
- Jika "Wajib": tombol "Nanti" tidak muncul
- Jika "Opsional": guru bisa skip dulu

---

## CATATAN PENTING

| Hal | Keterangan |
|-----|------------|
| Update data (guru/sekolah) | Otomatis real-time via Firebase, TIDAK perlu .exe baru |
| Update tampilan/fitur | Perlu build .exe baru + GitHub Release |
| Update konten dokumen | Otomatis via Firebase (admin edit di panel) |
| Ukuran .exe | ~80-150 MB tergantung aset |
| GitHub storage | Gratis hingga 2GB per release |

---

## TROUBLESHOOTING

**Popup tidak muncul:**
- Pastikan `CimegaUpdater.startChecking(db)` dipanggil setelah db siap
- Cek koneksi internet
- Pastikan versi di Firestore berbeda dengan versi di package.json

**Download gagal:**
- Cek URL download di Firebase sudah benar
- Coba buka URL download manual di browser

**Install gagal:**
- Jalankan sebagai Administrator
- Matikan antivirus sementara (installer baru kadang diblok)
