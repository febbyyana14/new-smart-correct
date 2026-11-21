# Panduan Lengkap Deployment SmartCorrect
## Backend Google Apps Script + Frontend GitHub Pages

Panduan langkah-demi-langkah ini disusun secara ramah bagi pemula untuk meluncurkan aplikasi web **SmartCorrect** secara penuh (Full-Stack).

---

### 📋 Struktur Berkas Proyek

Pastikan struktur folder lokal Anda rapi seperti ini:

```text
2. SMART CORECT/
├── index.html               # Frontend Utama (SPA Multi-Page dalam 1 File)
├── css/
│   └── style.css            # Styling visual, animasi scanner, dan PDF print
├── js/
│   ├── config.js            # Konfigurasi URL Web App Google Apps Script
│   └── app.js               # Logika frontend, SheetJS, kamera, router 0ms
├── backend/
│   ├── Kode.gs              # REST API JSON murni + Script Properties + CacheX
│   └── Migrasi.gs           # Utilitas migrasi & sinkronisasi data antar-sheet
├── prd/                     # Dokumen PRD, Wireframe & Prompt UI/UX
└── DEPLOYMENT_GUIDE.md      # Panduan ini
```

---

## 🚀 TAHAP 1: Setup Backend Google Apps Script

1. **Buka Google Apps Script:**
   * Kunjungi [https://script.google.com](https://script.google.com) dan pastikan login dengan akun Google Anda.
   * Klik tombol **+ Proyek baru** (New Project).
   * Beri nama proyek di kiri atas: `SmartCorrect_Backend_API`.

2. **Salin Kode Backend:**
   * Buka file default `Kode.gs` di editor Apps Script, hapus semua kode bawaan, lalu salin dan tempelkan seluruh isi file [Kode.gs](file:///e:/WEBSITE/ANTIGRATIVY/2.%20SMART%20CORECT/backend/Kode.gs).
   * Buat file skrip kedua dengan klik tanda **+** di sebelah *Files* → pilih **Script** → beri nama `Migrasi.gs`.
   * Salin seluruh isi file [Migrasi.gs](file:///e:/WEBSITE/ANTIGRATIVY/2.%20SMART%20CORECT/backend/Migrasi.gs) ke dalamnya.
   * Klik ikon **Save** (Ctrl + S).

3. **Jalankan Setup Otomatis Lingkungan (Sekali Saja):**
   * Pada bilah atas editor Apps Script, pilih fungsi `setupAppEnvironment` dari dropdown fungsi.
   * Klik **Jalankan** (Run).
   * Google akan meminta izin (*Authorization Required*):
     * Klik **Review Permissions** (Tinjau Izin).
     * Pilih akun Google Anda.
     * Klik **Advanced** (Lanjutan) → klik **Go to SmartCorrect_Backend_API (unsafe)**.
     * Klik **Allow** (Izinkan).
   * Buka **Execution log** (Log eksekusi) di bagian bawah. Anda akan melihat:
     * ✅ URL Database Google Sheets yang otomatis dibuatkan.
     * 📁 URL Folder Google Drive untuk berkas foto lembar jawaban.
     * 🔐 Username & Password darurat Super Admin. Catat kredensial ini!

4. **Deploy sebagai Web App REST API:**
   * Di pojok kanan atas editor, klik tombol biru **Deploy** → **New deployment** (Penerapan baru).
   * Klik ikon gerigi ⚙️ di sebelah *Select type* → pilih **Web app**.
   * Isi konfigurasi berikut:
     * **Description:** `SmartCorrect Production v1`
     * **Execute as:** `Me (email Anda)` *(Wajib)*
     * **Who has access:** `Anyone` *(Wajib, agar frontend GitHub Pages dapat mengakses API)*
   * Klik **Deploy**.
   * Salin **Web app URL** yang berakhiran `/exec` (misal: `https://script.google.com/macros/s/AKfycb.../exec`).

5. **Hubungkan URL ke Frontend:**
   * Buka berkas lokal [js/config.js](file:///e:/WEBSITE/ANTIGRATIVY/2.%20SMART%20CORECT/js/config.js).
   * Gantikan string URL pada baris `const GAS_URL = '...';` dengan URL Web App yang baru saja Anda salin.
   * Simpan file `js/config.js`.

---

## 🌐 TAHAP 2: Deploy Frontend ke GitHub Pages

Frontend SmartCorrect dibangun sebagai aplikasi web statis murni yang bebas biaya hosting di GitHub Pages.

1. **Buka Terminal di Folder Proyek:**
   Buka terminal (PowerShell, Command Prompt, atau Git Bash) dan arahkan ke folder ini:
   ```bash
   cd "e:\WEBSITE\ANTIGRATIVY\2. SMART CORECT"
   ```

2. **Inisialisasi Git Lokal:**
   ```bash
   git init
   git add .
   git commit -m "Inisialisasi SmartCorrect Full-Stack"
   git branch -M main
   ```

3. **Buat Repositori Baru di GitHub:**
   * Buka [https://github.com/new](https://github.com/new).
   * Isi nama repositori (contoh: `smart-correct`).
   * Pastikan memilih opsi **Public**.
   * **JANGAN** centang "Add a README file" atau `.gitignore`.
   * Klik **Create repository**.

4. **Hubungkan & Kirim (Push) ke GitHub:**
   Ganti `USERNAME` dengan username GitHub Anda:
   ```bash
   git remote add origin https://github.com/USERNAME/smart-correct.git
   git push -u origin main
   ```
   *(Jika terminal meminta password, gunakan **GitHub Personal Access Token (PAT)** Anda, bukan password akun biasa).*

5. **Aktifkan GitHub Pages:**
   * Buka repositori Anda di GitHub.
   * Klik tab **Settings** → menu **Pages** di bilah kiri.
   * Pada bagian **Build and deployment**:
     * **Source:** `Deploy from a branch`
     * **Branch:** Pilih `main` dan folder `/ (root)`
     * Klik **Save**.
   * Centang opsi **Enforce HTTPS**.
   * Tunggu 1–2 menit, lalu refresh halaman sampai muncul tautan hijau:
     `Your site is live at https://USERNAME.github.io/smart-correct/`

---

## 🎯 Verifikasi & Uji Coba Fitur Utama

1. **Aktivasi Lisensi Awal:**
   * Buka situs web Anda di browser atau HP.
   * Klik tombol **Token Lisensi** di pojok kanan atas.
   * Masukkan nama, email Google, dan kode token demo awal: `SC-DEMO-2026`.
   * Klik **Aktifkan Lisensi**. Akun Anda langsung aktif selama 30 hari!
2. **Koreksi Tulisan Tangan & LJK:**
   * Buka menu **Pindai & Unggah Lembar**.
   * Buka kamera HP atau unggah foto kertas lembar jawaban siswa.
   * Jika ada tulisan tangan yang samar/ragu (Confidence < 80%), sistem otomatis memindahkannya ke **Antrean Verifikasi** untuk dicek manual 1-klik berdampingan dengan foto aslinya.
3. **Impor & Ekspor Excel:**
   * Unduh template di menu **Impor Kunci Jawaban**.
   * Ekspor laporan lengkap 4-Sheet di menu **Unduh Laporan & Arsip**.
