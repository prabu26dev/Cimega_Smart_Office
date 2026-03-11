# 🏛️ CIMEGA Smart Office v1.0
> **Sistem Administrasi Desktop Mutakhir dengan Antarmuka Futuristik**

![Theme](https://img.shields.io/badge/UI_Theme-Dark_Carbon_%2B_Neon-00e5ff?style=for-the-badge)
![Tech](https://img.shields.io/badge/Powered_By-Electron.js_%26_Firebase-blue?style=for-the-badge)

**CIMEGA Smart Office** adalah platform *Smart Desktop* yang dirancang untuk meredefinisi manajemen administrasi sekolah. Dibangun dengan estetika *Cyberpunk/Dark Carbon*, aplikasi ini menyajikan animasi visual agresif dipadukan dengan performa database awan *Real-time*.

---

## ⚡ Fitur Unggulan Sistem

### 1. 👑 Super Admin Dashboard
Panel kendali terpusat dengan kemampuan:
* **Manajemen Multi-Role:** Kontrol penuh atas akun Admin, Kepala Sekolah, dan Guru beserta masa aktif (Expired Date) lisensinya.
* **Manajemen Sekolah:** Kelola data multi-sekolah dalam satu pintu.
* **Push Update & Broadcast:** Kirim notifikasi *real-time* dan paksa pembaruan aplikasi (Force Update) ke seluruh perangkat pengguna.
* **Log Aktivitas:** Pantau setiap pergerakan dan modifikasi data secara mendetail.

### 2. 📂 Bank Konten Dinamis Terpusat
Sistem manajemen dokumen yang mencakup 7 pilar pendidikan:
* Administrasi Guru & Pembelajaran
* Administrasi Kepala Sekolah
* Kurikulum Operasional (KOSP)
* Administrasi Umum
* Keuangan & BOS
* Evaluasi & Pelaporan
* Perpustakaan

### 3. 🎵 Persistent Audio Engine
Pemutar musik terintegrasi di *Main Process* Electron. Memutar mahakarya **Kang Prabu** (*Mars SDN Cimega, Duhai Pemilik Jiwa*, dll) tanpa terputus (*seamless*) meski pengguna berpindah-pindah menu navigasi.

---

## 🛠️ Arsitektur Teknologi
* **Framework:** `Electron.js` (Desktop Engine)
* **Frontend UI:** HTML5/CSS3 Native dengan font `Orbitron` & `Exo 2`
* **Backend & Database:** `Firebase Firestore` (Cloud Database)
* **Inter-Process Communication (IPC):** Isolasi context (*Context Bridge*) untuk keamanan tingkat tinggi.

---

## 🚀 Panduan Instalasi & Setup

### Tahap 1: Persiapan Lingkungan
1. Clone repositori ini:
   ```bash
   git clone [https://github.com/prabu26dev/Cimega_Smart_Office.git](https://github.com/prabu26dev/Cimega_Smart_Office.git)