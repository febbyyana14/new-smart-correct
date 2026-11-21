# PRODUCT REQUIREMENTS DOCUMENT (PRD)
## SmartCorrect: AI-Powered Exam Grading & Psychometric Item Analysis Platform

---

### 1. Judul & Ringkasan Eksekutif

* **Nama Produk:** SmartCorrect
* **Versi Dokumen:** 1.0 (Final Architecture & Commercial SaaS Edition)
* **Basis Platform:** Google Apps Script (Backend REST / SPA API), Google Sheets (Database Engine Relasional), Google Drive (Storage Engine), & Modern Client-Side Web Application.
* **Model Bisnis:** B2B / B2C EdTech SaaS berbasis Lisensi Berjangka via Token Aktivasi Server-Side.
* **Ringkasan Eksekutif:**  
  SmartCorrect adalah aplikasi web evaluasi ujian berbasis kecerdasan visual yang dirancang khusus untuk memangkas beban koreksi guru hingga 90%. Aplikasi memungkinkan guru memindai lembar jawaban tulisan tangan (huruf A/B/C/D pada kertas biasa/bergaris) secara instan menggunakan kamera smartphone maupun lembar LJK *bubble sheet*. Dilengkapi mesin deteksi berindikator keyakinan (*Confidence Score*), antrean verifikasi cerdas (*Review Queue*), impor kunci jawaban kilat (Excel/CSV), analisis butir soal psikometrik mendalam, ekspor multi-format (Excel multi-sheet, PDF siap cetak, Google Sheets), serta sistem keamanan lisensi token aktivasi multi-tenant yang siap dikomersialkan.

---

### 2. Tujuan Produk & Nilai Bisnis

1. **Efisiensi Waktu Guru:** Mengoreksi 30–40 lembar jawaban siswa dalam hitungan menit tanpa perlu membeli pemindai OMR (*Optical Mark Reader*) khusus yang mahal.
2. **Fleksibilitas Ujian Nyata di Lapangan:** Mendukung lembar jawaban kertas biasa tulisan tangan siswa tanpa mewajibkan sekolah mencetak LJK khusus, dengan jumlah soal dinamis (1–N soal) dan bobot nilai fleksibel.
3. **Akurasi & Integritas Nilai:** Menghilangkan bias salah koreksi melalui mekanisme penandaan otomatis pada jawaban meragukan/buram untuk diverifikasi manual oleh guru (*Human-in-the-loop*).
4. **Wawasan Pedagogis (Psychometric Insights):** Mengubah data mentah hasil ujian menjadi analisis diagnostik butir soal (daya pembeda, tingkat kesukaran, dan efektivitas pengecoh/distraktor) guna meningkatkan kualitas evaluasi pembelajaran.
5. **Komersialisasi Mandiri (SaaS Ready):** Memberikan pemilik aplikasi kendali penuh atas monetisasi lisensi berbayar melalui token berdurasi (1, 3, 6, 12 bulan) dan batas kuota klaim yang terproteksi ketat di sisi server.

---

### 3. Pengguna Target & Matriks Hak Akses (RBAC)

Sistem menerapkan model isolasi data ketat (*Row-Level Security & Multi-Tenancy*):

| Role / Peran | Deskripsi Pengguna | Hak Akses Utama |
| :--- | :--- | :--- |
| **Super Admin** (Owner Aplikasi) | Pemilik/Pengelola Utama Aplikasi SmartCorrect | • Manajemen penuh seluruh data sistem (Global Access).<br>• Generate token aktivasi otomatis / input manual.<br>• Kelola masa berlaku, kuota pemakaian, dan status token.<br>• Aktivasi/perpanjangan lisensi guru secara manual.<br>• Pengaturan *White-labeling* (nama aplikasi, logo, warna identitas).<br>• Audit log & monitoring kuota eksekusi Google Apps Script. |
| **Guru** (Lisensi Aktif) | Guru mata pelajaran, wali kelas, atau akademisi berlisensi aktif | • Ruang kerja terisolasi (*hanya dapat melihat data miliknya*).<br>• Kelola bank siswa, kelas, mata pelajaran, dan paket ujian.<br>• Buat kunci jawaban manual atau impor via Excel/CSV.<br>• Pemindaian lembar jawaban via kamera HP / unggah berkas.<br>• Akses *Review Queue* untuk memvalidasi jawaban meragukan.<br>• Laporan analisis butir soal lengkap & ekspor Excel/PDF.<br>• Akses profil dan informasi status masa berlaku lisensi. |
| **Guru** (Lisensi Kedaluwarsa / Tamu) | Pengguna baru belum aktivasi atau lisensi habis masa aktif | • Terkunci dari fitur utama (kamera, koreksi, upload, impor).<br>• Akses read-only ke data historis yang pernah dibuat.<br>• Halaman input token aktivasi perpanjangan lisensi. |

---

### 4. Arsitektur Data & Integrasi Ekosistem Google Workspace

Seluruh data tersimpan secara relasional dan aman di Google Sheets dengan snapshotting untuk audit:

#### A. Skema Google Sheets

1. **`Users` (Manajemen Akun & Lisensi):**
   * Kolom: `id_user`, `email_google`, `nama_lengkap`, `no_wa`, `role` (`Super Admin`/`Guru`), `status_akun` (`Pending Token`/`Active`/`Expired`/`Suspended`), `tgl_aktivasi`, `tgl_kedaluwarsa_lisensi`, `id_token_terakhir`, `created_at`.
2. **`Tokens_Lisensi` (Bank Token Super Admin):**
   * Kolom: `id_token`, `kode_token`, `tipe_lisensi` (`Trial`/`1 Bulan`/`3 Bulan`/`6 Bulan`/`1 Tahun`/`Sekolah Promo`), `durasi_hari`, `max_usage`, `used_count`, `status` (`Active`/`Exhausted`/`Expired`/`Revoked`), `catatan_admin`, `created_at`.
3. **`Token_Logs` (Jejak Audit Aktivasi):**
   * Kolom: `id_log`, `id_token`, `id_user_pengklaim`, `tgl_klaim`, `perpanjangan_dari_tgl`, `perpanjangan_sampai_tgl`.
4. **`Siswa`:**
   * Kolom: `id_siswa`, `nis_nisn`, `nama_siswa`, `kelas`, `id_guru_pemilik`.
5. **`Mata_Pelajaran`:**
   * Kolom: `id_mapel`, `nama_mapel`, `kode_mapel`, `id_guru_pemilik`.
6. **`Paket_Ujian`:**
   * Kolom: `id_ujian`, `nama_ujian`, `id_mapel`, `id_guru_pemilik`, `kelas_target`, `jumlah_soal`, `opsi_pilihan` (A-D / A-E), `skema_bobot` (`sama` / `custom`), `tgl_ujian`, `status_ujian`.
7. **`Kunci_Jawaban_Snapshot` (Immutable Audit Trail):**
   * Kolom: `id_snapshot`, `id_ujian`, `kunci_jawaban_json`, `timestamp_kunci`.  
   *(Catatan: Kunci di-snapshot saat sesi koreksi dimulai agar perubahan kunci di kemudian hari tidak mengubah nilai masa lalu).*
8. **`Hasil_Koreksi`:**
   * Kolom: `id_hasil`, `id_ujian`, `id_snapshot`, `id_siswa`, `total_skor`, `total_benar`, `total_salah`, `total_kosong`, `perlu_verifikasi` (`TRUE`/`FALSE`), `status_koreksi` (`Verified`/`Needs Review`), `url_foto_lembar`, `diperiksa_pada`.
9. **`Detail_Jawaban_Siswa` (Data Granular untuk Analisis Butir Soal):**
   * Kolom: `id_detail`, `id_hasil`, `no_soal`, `jawaban_terdeteksi`, `tingkat_keyakinan` (0–100%), `status_item` (`Benar`/`Salah`/`Ragu`), `jawaban_final_verifikasi`.
10. **`Pengaturan_Sistem`:**
    * Kolom: `app_name`, `logo_url`, `favicon_url`, `brand_color`, `confidence_threshold` (default: 80%).

#### B. Integrasi Google Drive
* Struktur Hirarki Berkas:  
  `Drive Root / SmartCorrect / {id_guru_pemilik} / {id_ujian} / {id_siswa}_{timestamp}.jpg`
* Proteksi: Akses berkas dibatasi sesuai kepemilikan guru terkait.

---

### 5. Persyaratan Fungsional

#### A. Sistem Lisensi & Token Aktivasi (SaaS Engine)
* **Server-Side Token Validation:** Setiap aksi penting memvalidasi tanggal aktif lisensi guru di `Users`. Jika kedaluwarsa, server mengembalikan error 403 License Expired.
* **Panel Generator Token Super Admin:**
  * Opsi 1: Input manual kode kustom (misal: `GURUPROMO2026`).
  * Opsi 2: Tombol `[Generate Token]` yang menghasilkan kode unik alfanumerik acak anti-bentrok (misal: `SC-9X2F-7B1A`).
  * Konfigurasi durasi (hari) dan kuota klaim pemakaian (1x pakai atau multi-user).
  * Pengelolaan status (Revoke/Aktifkan kembali) dan perpanjangan manual lisensi akun guru.

#### B. Modul Impor Kunci Jawaban (Prioritas Inti MVP)
* **Format yang Didukung:** Excel (`.xlsx`) dan `CSV` sebagai fitur utama, input manual, serta opsi Word (`.docx`) sebagai alternatif.
* **Template Siap Unduh:** Aplikasi menyediakan tombol *Download Template Excel* dengan kolom baku: `Nomor Soal`, `Kunci Jawaban` (A/B/C/D), `Bobot Soal` (opsional).
* **Alur Validasi & Pratinjau Interaktif:**
  * Parsing file langsung di browser (*Client-Side Sheet Parser*).
  * Menampilkan pratinjau tabel interaktif sebelum data disimpan.
  * *Real-Time Anomaly Detection:* Mendeteksi dan memberi highlight merah jika ada nomor ganda, nomor terlewat/kosong, atau huruf di luar opsi (misal huruf F/angka).
  * *Inline Editing:* Guru dapat memperbaiki nilai langsung pada tabel pratinjau.
  * Penyimpanan snapshot kunci secara otomatis saat konfirmasi.

#### C. Mesin Pemindaian & Deteksi Jawaban (Visual AI & Confidence Score)
* **Dukungan Lembar Jawaban:**
  * Lembar Tulisan Tangan Kertas Biasa (Huruf A/B/C/D yang ditulis tangan oleh siswa pada kertas bergaris/HVS).
  * Lembar LJK *Bubble Sheet* opsional untuk akurasi tinggi.
* **Confidence Scoring & Review Queue:**
  * Setiap pembacaan karakter menghasilkan skor keyakinan (0–100%).
  * Jika skor < threshold (misal < 80%) atau karakter ambigu (misal coretan/buram), sistem otomatis menandai lembar sebagai `Needs Review`.
  * Guru membuka menu *Review Queue* yang menampilkan foto potongan lembar (*crop view*) bersanding dengan kolom konfirmasi 1-klik.

#### D. Modul Analisis Butir Soal (Psychometrics)
* **Ranking Performa Soal:** Daftar soal paling banyak dijawab benar, paling banyak salah, dan paling sering dikosongkan.
* **Distribusi Opsi (Distractor Analysis):** Menampilkan persentase sebaran siswa yang memilih A, B, C, atau D pada setiap butir soal untuk mengevaluasi efektivitas pengecoh.
* **Tingkat Kesukaran Soal:** Klasifikasi otomatis butir soal ke dalam kategori *Mudah* ($P > 0.70$), *Sedang* ($0.30 \le P \le 0.70$), dan *Sukar* ($P < 0.30$).

---

### 6. Batasan Teknis & Mitigasi Kuota Google Apps Script

1. **Limit Waktu Eksekusi 6 Menit:**
   * Proses unggah massal (batch 30–40 lembar) tidak diproses dalam 1 siklus eksekusi panjang.
   * Digunakan teknik *Asynchronous Queue/Chunking* dari sisi frontend (klien memproses dan mengirimkan per 3–5 lembar berurutan dengan indikator progress bar).
2. **Optimasi Pembacaan Sheets (Zero-Lag RTT):**
   * Menggunakan pola pembacaan batch array (`getValues()` / `setValues()`) sekali panggil.
   * Memanfaatkan `CacheService` untuk menyimpan data statis (daftar kelas, mapel, pengaturan sistem) sehingga tidak membebani kuota API Sheets.
3. **Payload Data Gambar:**
   * Kompresi gambar sisi klien di browser HP guru sebelum diunggah (resolusi optimal ~1280px-1920px JPEG kualitas 80%) untuk menghemat kuota upload Google Drive dan mempercepat analisis visual.
4. **Validasi Prototipe Mandiri:**
   * Sebelum membekukan arsitektur visi, disediakan skrip prototipe uji coba dengan foto lembar tulisan tangan nyata untuk mengukur baseline akurasi dan ketahanan pencahayaan.

---

### 7. Spesifikasi Tampilan & Antarmuka (UI/UX)

* **Tema Desain:** Modern Clean Dashboard bernuansa *Professional EdTech*.
* **Palet Warna:**
  * Warna Utama (*Primary*): Smart Blue (`#1E40AF` / `#2563EB`)
  * Warna Aksen (*Accent*): Energetic Orange (`#F97316`)
  * Warna Latar (*Background*): Pure White (`#FFFFFF`) & Soft Slate Gray (`#F8FAFC`)
  * Warna Teks & Kontras: Dark Navy (`#0F172A`)
  * Dukungan: **Light Mode & Dark Mode** dengan toggle instan.
* **Desain Responsif & Tata Letak:**
  * **Desktop / Laptop:** Sidebar navigasi kiri yang dapat di-minimize, kartu statistik ringkas (*KPI cards*), grafik interaktif, dan tabel data luas.
  * **Tablet & Smartphone:** Navigasi bawah (*bottom bar*) atau hamburger menu ramah jempol (*thumb-friendly*), tombol shutter kamera terapung (*floating action button*), dan kartu daftar adaptif.
* **Kustomisasi Identitas (White-Labeling):**
  * Super Admin dapat mengunggah logo, favicon, mengubah nama aplikasi, dan menentukan aksen warna institusi dari panel pengaturan.
* **Spesifikasi Modul Pelaporan & Ekspor:**
  * **Excel (.xlsx - Multi Sheet):**
    * Sheet 1: Rekap Nilai Siswa (Nama, NISN, Benar, Salah, Kosong, Skor Akhir).
    * Sheet 2: Detail Jawaban Siswa per Butir Soal.
    * Sheet 3: Analisis Butir Soal & Distribusi Pilihan A/B/C/D.
    * Sheet 4: Daftar Jawaban Memerlukan Verifikasi.
  * **PDF Resmi Siap Cetak:** Format rapi dilengkapi kop sekolah/guru, tabel nilai terstruktur, tanggal terbit, dan tanda tangan digital/verifikasi cetak.
  * **Google Sheets:** Opsi ekspor langsung ke Google Drive guru 1-klik.
  * **Fitur Filter & Interaksi:** Pencarian instan, filter kelas/mapel, pengurutan nilai tertinggi-terendah, serta dialog cetak langsung dari browser.

---

### 8. Rencana Tahapan Pengembangan (Roadmap)

```text
[Fase 1: Prototipe OCR Tulisan Tangan & Validasi Akurasi]
  │ Menguji foto nyata tulisan tangan siswa pada kertas biasa.
  ▼
[Fase 2: Skema Database Sheets & Sistem Lisensi Token Super Admin]
  │ Membangun tabel, RBAC, generator token, dan proteksi server-side.
  ▼
[Fase 3: Core Exam Engine & Impor Kunci Excel/CSV]
  │ Penentuan soal dinamis, bobot fleksibel, dan parser kunci interaktif.
  ▼
[Fase 4: Alur Koreksi Kamera HP & Review Queue]
  │ Pemindaian, penilaian berindikator keyakinan, dan perbaikan manual.
  ▼
[Fase 5: Psychometrics & Multi-Format Reporting (Excel, PDF, Sheets)]
  │ Analisis butir soal, dashboard visual, dan generator berkas laporan.
  ▼
[Fase 6: Polish UI/UX, Dark Mode, & Deployment Web App]
```

---

🎨 **Tahapan Khusus: Penentuan Visual UI/UX**
1. Unggah Referensi: Silakan unggah referensi tangkapan layar, warna, dan gaya antarmuka yang diinginkan.
2. Jika Belum Ada Referensi Visual:
   - Salin seluruh teks dokumen PRD Final di atas.
   - Buka Google Stitch, lalu tempelkan teks PRD ke dalamnya.
   - Unduh hasil pratinjau desain visual yang dihasilkan oleh Google Stitch.
   - Unggah gambar hasil desain tersebut ke percakapan ini untuk diimplementasikan ke dalam kode HTML/CSS.