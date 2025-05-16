# **PRODUCT REQUIREMENT DOCUMENT (PRD)**

# **Sistem ERP PT. Sarana Mudah Raya (Samudra Paket)**

**Versi Dokumen:** 1.0\
&#x20;**Tanggal:** 5 Mei 2025\
&#x20;**Status:** Draft\
&#x20;**Disusun oleh:** Product Manager & Business Analyst
==========================================================

## **Daftar Isi**

# 1. [Pendahuluan](https://claude.ai/chat/60287ffb-c396-4389-97bc-4c2289ccd480#1-pendahuluan)

2. [Visi Produk dan Tujuan Bisnis](https://claude.ai/chat/60287ffb-c396-4389-97bc-4c2289ccd480#2-visi-produk-dan-tujuan-bisnis)

3. [Gambaran Umum Produk](https://claude.ai/chat/60287ffb-c396-4389-97bc-4c2289ccd480#3-gambaran-umum-produk)

4. [Persona Pengguna](https://claude.ai/chat/60287ffb-c396-4389-97bc-4c2289ccd480#4-persona-pengguna)

5. [Kebutuhan Fungsional](https://claude.ai/chat/60287ffb-c396-4389-97bc-4c2289ccd480#5-kebutuhan-fungsional)

6. [Alur Kerja Utama](https://claude.ai/chat/60287ffb-c396-4389-97bc-4c2289ccd480#6-alur-kerja-utama)

7. [Spesifikasi Fitur dan Prioritas](https://claude.ai/chat/60287ffb-c396-4389-97bc-4c2289ccd480#7-spesifikasi-fitur-dan-prioritas)

8. [Kebutuhan Non-Fungsional](https://claude.ai/chat/60287ffb-c396-4389-97bc-4c2289ccd480#8-kebutuhan-non-fungsional)

9. [Integrasi Sistem](https://claude.ai/chat/60287ffb-c396-4389-97bc-4c2289ccd480#9-integrasi-sistem)

10. [Kriteria Penerimaan](https://claude.ai/chat/60287ffb-c396-4389-97bc-4c2289ccd480#10-kriteria-penerimaan)

11. [Asumsi, Batasan, dan Risiko](https://claude.ai/chat/60287ffb-c396-4389-97bc-4c2289ccd480#11-asumsi-batasan-dan-risiko)

12. [Timeline dan Roadmap](https://claude.ai/chat/60287ffb-c396-4389-97bc-4c2289ccd480#12-timeline-dan-roadmap)

13. [Lampiran](https://claude.ai/chat/60287ffb-c396-4389-97bc-4c2289ccd480#13-lampiran)

## **1. Pendahuluan**

### **1.1 Latar Belakang**

# PT. Sarana Mudah Raya (Samudra Paket) adalah perusahaan logistik dan pengiriman barang yang beroperasi secara luas di Indonesia, terutama di Pulau Jawa dengan jaringan mitra forwarder yang menjangkau hingga ke Sulawesi, Kalimantan, dan Papua. Saat ini, perusahaan menghadapi tantangan dalam mengintegrasikan seluruh proses bisnisnya yang masih dilakukan dengan cara semi-manual menggunakan spreadsheet dan dokumen fisik.Saat ini perusahaan mengalami beberapa permasalahan operasional:\* Kesulitan dalam mengintegrasikan data antar departemen dan cabang

- Ketidakmampuan melacak pengiriman secara real-time

- Inefisiensi dalam manajemen kendaraan dan rute

- Pengelolaan keuangan dan piutang yang rumit, terutama untuk metode pembayaran CAD (Cash After Delivery)

- Kesulitan dalam mengkonsolidasikan data dan laporan dari berbagai cabang

- Ketidakefisienan dalam pengelolaan sumber daya manusia dan operasional

### **1.2 Ruang Lingkup Dokumen**

# Dokumen PRD ini menjelaskan secara komprehensif kebutuhan bisnis dan fungsionalitas yang diperlukan dalam sistem ERP terintegrasi untuk PT. Sarana Mudah Raya. Dokumen ini akan menjadi acuan utama bagi seluruh tim pengembangan termasuk tim desain, developer, dan QA dalam membangun sistem sesuai dengan kebutuhan pengguna.Ruang lingkup dalam dokumen ini mencakup:\* Platform aplikasi web untuk manajemen dan administrasi

- Aplikasi mobile untuk operasional lapangan

- Modul-modul utama sistem ERP

- Alur kerja dan integrasi antar modul

- Kebutuhan pengguna berdasarkan peran

### **1.3 Definisi dan Istilah**

# | | |

| :---------------: | :-------------------------------------------------------------------------------------------------: |
| **Istilah** | **Definisi** |
| STT | Surat Tanda Terima, dokumen resmi yang dikeluarkan sebagai bukti penerimaan barang untuk pengiriman |
| Pickup | Proses pengambilan barang dari lokasi pengirim |
| Langsir | Proses pengiriman barang dari gudang ke alamat penerima |
| Colly | Satuan ukuran berat barang dalam pengiriman |
| Muat | Proses memasukkan barang ke dalam kendaraan pengangkut |
| DMB | Daftar Muat Barang, dokumen yang berisi daftar barang yang dimuat dalam satu kendaraan |
| KBH | Kiriman Barang Harian, laporan harian tentang barang yang dikirim |
| CASH | Metode pembayaran di muka saat pengiriman barang |
| COD | Cash On Delivery, metode pembayaran di tempat tujuan saat barang diterima |
| CAD | Cash After Delivery, metode pembayaran setelah barang diterima dengan tempo tertentu (kontra bon) |
| Debt Collector | Petugas yang bertugas menagih pembayaran CAD |
| Forwarder/Penerus | Mitra logistik yang meneruskan pengiriman ke daerah yang tidak terjangkau oleh cabang perusahaan |
| RBAC | Role-Based Access Control, sistem pengaturan hak akses berdasarkan peran pengguna |
| ERP | Enterprise Resource Planning, sistem terintegrasi untuk mengelola seluruh proses bisnis perusahaan |
| Retur | Pengembalian barang yang tidak dapat dikirim atau ditolak oleh penerima |

## **2. Visi Produk dan Tujuan Bisnis**

### **2.1 Visi Produk**

# Mengembangkan sistem ERP terpadu yang menghubungkan dan mengoptimalkan seluruh proses bisnis PT. Sarana Mudah Raya, dari pengambilan barang, pemrosesan di cabang, pengiriman antar cabang, pengiriman ke penerima, hingga pengelolaan keuangan dan pelaporan, dengan tujuan meningkatkan efisiensi operasional, visibilitas real-time, dan pengambilan keputusan berbasis data.

### **2.2 Tujuan Bisnis**

# 1. **Peningkatan Efisiensi Operasional**

- Mengurangi waktu proses dokumentasi hingga 50% melalui digitalisasi

- Mengoptimalkan rute pengiriman untuk mengurangi biaya bahan bakar hingga 20%

- Meningkatkan utilisasi armada kendaraan hingga 30%

2. **Peningkatan Visibilitas dan Transparansi**

   - Menyediakan pelacakan real-time untuk semua pengiriman

   - Memberikan visibility ke seluruh proses bisnis bagi manajemen

   - Memungkinkan pelanggan melacak status pengiriman mereka

3. **Optimasi Keuangan**

   - Mempercepat siklus penagihan dengan pengurangan umur piutang hingga 30%

   - Mengurangi kesalahan penagihan dan pembayaran hingga 90%

   - Meningkatkan akurasi laporan keuangan dengan sistem yang terintegrasi

4. **Peningkatan Pengalaman Pelanggan**

   - Meningkatkan ketepatan waktu pengiriman hingga 95%

   - Mengurangi waktu respons untuk penanganan keluhan pelanggan

   - Memberikan informasi yang lebih akurat dan tepat waktu kepada pelanggan

5. **Skalabilitas Bisnis**

   - Mendukung pertumbuhan jumlah cabang dan volume pengiriman

   - Memfasilitasi ekspansi ke area layanan baru

   - Meningkatkan kapasitas untuk mengelola kemitraan forwarder

### **2.3 Key Performance Indicators (KPIs)**

# 1. **KPI Operasional**

- Tingkat ketepatan pengiriman: 95% sesuai jadwal

- Waktu proses dokumentasi: pengurangan 50%

- Utilisasi kendaraan: minimal 85%

- Tingkat kesalahan pengiriman: kurang dari 1%

2. **KPI Keuangan**

   - Umur piutang rata-rata: pengurangan 30%

   - Tingkat ketepatan pembayaran CAD: peningkatan hingga 90%

   - Biaya operasional per pengiriman: pengurangan 15-20%

   - Pendapatan per truk: minimal Rp 4 juta (Jatim) dan Rp 3,75 juta (Jateng)

3. **KPI Customer**

   - Tingkat kepuasan pelanggan: minimal 90%

   - First-time resolution rate untuk keluhan: minimal 85%

   - Net Promoter Score (NPS): minimal 40

4. **KPI Sistem**

   - Ketersediaan sistem (uptime): 99.5%

   - Waktu respons aplikasi web: maksimal 3 detik

   - Waktu respons aplikasi mobile: maksimal 2 detik

## **3. Gambaran Umum Produk**

# Sistem ERP Samudra Paket akan menjadi solusi komprehensif yang menghubungkan semua aspek operasional bisnis logistik dan pengiriman. Sistem ini terdiri dari:

### **3.1 Komponen Utama**

# 1. **Aplikasi Web**

- Dashboard untuk manajemen dan monitoring

- Sistem administrasi untuk pengelolaan data master dan transaksi

- Sistem keuangan dan akuntansi

- Sistem pelaporan dan analitik

2. **Aplikasi Mobile**

   - Aplikasi untuk operasional lapangan (Checker, Supir, Kepala Gudang)

   - Modul pengambilan barang dengan validasi lokasi

   - Modul pelacakan pengiriman

   - Modul pembongkaran dan lansir

3. **Backend System**

   - Database terpusat untuk penyimpanan data

   - API untuk integrasi antar modul dan dengan sistem eksternal

   - Business logic untuk otomatisasi proses bisnis

   - Security framework untuk pengelolaan akses dan keamanan data

### **3.2 Modul-Modul Utama**

# 1. **Modul Autentikasi dan Manajemen Pengguna**

- Pengelolaan akses dan izin (RBAC)

- Manajemen pengguna dan profil

- Keamanan dan audit trail

2. **Modul Manajemen Cabang & Divisi**

   - Pengelolaan struktur organisasi

   - Manajemen area layanan

   - Manajemen Mitra Forwarder/Penerus yang berupa daftar Forwarder

3. **Modul Operasional**

   - Pengambilan Barang (Pickup)

   - Penjualan dan Pembuatan Resi

   - Pengelolaan Muat & Langsir

   - Manajemen Retur

   - Manajemen Armada Kendaraan

4. **Modul Keuangan**

   - Pengelolaan Kas dan Bank

   - Penagihan dan Manajemen Piutang

   - Akuntansi dan Pembukuan

   - Manajemen Aset

5. **Modul HRD**

   - Manajemen Karyawan

   - Pengelolaan Kehadiran

   - Penggajian dan Kompensasi

6. **Modul Pelaporan**

   - Dashboard Eksekutif

   - Laporan Operasional

   - Laporan Keuangan

   - Laporan Pelanggan

   - Laporan Kinerja

7. **Modul Pelacakan dan Monitoring**

   - Tracking pengiriman real-time

   - Monitoring kendaraan secara real-time untuk mendeteksi lokasi supir menggunakan aplikasi mobile nya dan dapat dilihat posisi secara real-time di website

   - Notifikasi dan alert

### **3.3 Nilai Unik Produk**

# Sistem ERP Samudra Paket memiliki keunggulan dibandingkan solusi lain di pasaran:1) **Disesuaikan dengan Proses Bisnis Spesifik**

- Dirancang khusus untuk mengakomodasi alur kerja unik PT. Sarana Mudah Raya

- Mendukung model bisnis pengiriman dengan berbagai metode pembayaran (CASH, COD, CAD)

- Mengintegrasikan proses pickup, pengiriman antar cabang, dan lansir dalam satu sistem

2. **Pendekatan Mobile-First untuk Operasional Lapangan**

   - Aplikasi mobile yang dapat bekerja dalam kondisi konektivitas terbatas (offline-first)

   - Optimasi untuk perangkat mobile dengan spesifikasi menengah ke bawah

   - Integrasi dengan kamera untuk dokumentasi dan barcode scanning

3. **Integrasi Penuh Operasional dan Keuangan**

   - Mencakup seluruh siklus dari operasional hingga keuangan

   - Otomatisasi pembukuan dari transaksi operasional

   - Manajemen piutang terintegrasi dengan operasional pengiriman

4. **Skalabilitas Multi-Cabang**

   - Dirancang untuk mendukung operasi multi-cabang

   - Konsolidasi data dari berbagai cabang

   - Kemampuan untuk mengelola area layanan yang berbeda per cabang

## **4. Persona Pengguna**

### **4.1 Manajemen Pusat**

#### **Direktur Utama/Owner**

# - **Karakteristik**: Berfokus pada kinerja keseluruhan bisnis dan pertumbuhan strategis

- **Goals**:

  - Memiliki visibilitas ke seluruh aspek bisnis

  - Mengambil keputusan strategis berdasarkan data

  - Mengawasi kinerja seluruh cabang dan departemen

- **Pain Points**:

  - Kesulitan mendapatkan informasi terpadu dari berbagai cabang

  - Laporan yang tidak tepat waktu dan tidak konsisten

  - Kurangnya metrik kinerja yang terukur

- **Kebutuhan**:

  - Dashboard eksekutif yang komprehensif

  - Laporan konsolidasi real-time

  - Analitik prediktif untuk forecasting

#### **Manager Departemen**

# - **Karakteristik**: Berfokus pada efisiensi departemen yang dipimpin

- **Goals**:

  - Mengoptimalkan kinerja departemen

  - Mencapai target KPI departemen

  - Efisiensi penggunaan sumber daya

- **Pain Points**:

  - Terlalu banyak koordinasi manual antar departemen

  - Kurangnya visibilitas ke proses bisnis end-to-end

  - Kesulitan dalam perencanaan dan alokasi sumber daya

- **Kebutuhan**:

  - Dashboard departemen dengan metrik kinerja

  - Tools untuk perencanaan dan alokasi sumber daya

  - Kemampuan untuk menganalisis bottleneck proses

### **4.2 Operasional Cabang**

#### **Kepala Cabang**

# - **Karakteristik**: Bertanggung jawab atas seluruh operasional cabang

- **Goals**:

  - Memastikan operasional cabang berjalan efisien

  - Mencapai target pendapatan dan profitabilitas cabang

  - Mengelola hubungan dengan pelanggan utama

- **Pain Points**:

  - Kesulitan memantau status seluruh pengiriman

  - Kurangnya visibilitas ke kinerja tim

  - Kesulitan dalam koordinasi dengan cabang lain

- **Kebutuhan**:

  - Dashboard operasional cabang real-time

  - Kemampuan untuk men-track kinerja tim

  - Tools untuk koordinasi dengan cabang lain

#### **Kepala Gudang**

# - **Karakteristik**: Mengelola operasional gudang dan logistik

- **Goals**:

  - Mengoptimalkan penggunaan space gudang

  - Memastikan pengiriman tepat waktu

  - Mengelola tim operasional efektif

- **Pain Points**:

  - Proses dokumentasi manual yang memakan waktu

  - Kesulitan melacak status barang di gudang

  - Koordinasi tim pickup dan lansir yang tidak efisien

- **Kebutuhan**:

  - Dashboard operasional gudang

  - Sistem penugasan digital untuk tim

  - Manajemen inventori barang

### **4.3 Staf Operasional**

#### **Checker**

# - **Karakteristik**: Memeriksa dan memvalidasi barang yang masuk dan keluar

- **Goals**:

  - Memverifikasi barang secara cepat dan akurat

  - Mendokumentasikan kondisi barang

  - Mengalokasikan barang ke truk dengan optimal

- **Pain Points**:

  - Proses dokumentasi manual yang memakan waktu

  - Kesalahan dalam pencatatan berat dan dimensi

  - Kesulitan melacak barang yang telah diterima

- **Kebutuhan**:

  - Aplikasi mobile untuk verifikasi barang

  - Integrasi dengan alat timbang dan pengukur

  - Kemampuan untuk mendokumentasikan barang dengan foto

#### **Supir (Pickup, Langsir, Antar Cabang)**

# - **Karakteristik**: Mengantar barang ke tujuan

- **Goals**:

  - Menyelesaikan pengiriman tepat waktu

  - Mengoptimalkan rute pengiriman

  - Mendokumentasikan penerimaan barang

- **Pain Points**:

  - Navigasi manual ke alamat yang tidak familiar

  - Dokumentasi penerimaan barang secara manual

  - Kesulitan dalam komunikasi saat masalah terjadi

- **Kebutuhan**:

  - Aplikasi mobile dengan navigasi GPS

  - Digital proof of delivery

  - Kemampuan untuk melaporkan masalah secara real-time

### **4.4 Staf Administrasi**

#### **Staff Penjualan**

# - **Karakteristik**: Membuat resi dan menangani transaksi penjualan

- **Goals**:

  - Proses pembuatan resi yang cepat dan akurat

  - Memberikan estimasi biaya yang tepat

  - Menyediakan informasi status pengiriman ke pelanggan

- **Pain Points**:

  - Proses input data manual yang memakan waktu

  - Kesalahan dalam penghitungan biaya

  - Kesulitan melacak status pengiriman

- **Kebutuhan**:

  - Sistem pembuatan resi digital yang efisien

  - Kalkulasi otomatis biaya pengiriman

  - Akses ke informasi tracking untuk pelanggan

#### **Kasir**

# - **Karakteristik**: Mengelola transaksi keuangan harian

- **Goals**:

  - Memproses pembayaran dengan cepat dan akurat

  - Rekonsiliasi kas harian

  - Mengelola pengeluaran operasional

- **Pain Points**:

  - Rekonsiliasi manual yang memakan waktu

  - Kesulitan melacak pembayaran vs resi

  - Pengelolaan berbagai metode pembayaran

- **Kebutuhan**:

  - Sistem kasir terintegrasi dengan pembuatan resi

  - Rekonsiliasi otomatis

  - Manajemen pengeluaran operasional

#### **Debt Collector**

# - **Karakteristik**: Menagih pembayaran dari pelanggan CAD

- **Goals**:

  - Mengoptimalkan rute penagihan

  - Mendokumentasikan hasil penagihan

  - Meningkatkan tingkat penagihan sukses

- **Pain Points**:

  - Lack of updated customer payment information

  - Inefficient routing for multiple collections

  - Manual reconciliation of collected payments

- **Kebutuhan**:

  - Mobile app with optimized collection routes

  - Digital documentation of collection results

  - Real-time reconciliation of payments

## **5. Kebutuhan Fungsional**

### **5.1 Modul Autentikasi dan Manajemen Pengguna**

# 1. **Autentikasi**

- Login dengan username/email dan password

- Multi-faktor autentikasi untuk akun sensitif

- Session management dengan timeout otomatis

- Password reset via email

2. **Manajemen Pengguna**

   - Pembuatan dan pengelolaan akun pengguna

   - Profil pengguna dengan informasi dasar

   - Pengaturan status pengguna (aktif/non-aktif)

   - Pengelolaan hak akses berdasarkan peran (RBAC)

3. **Audit**

   - Log aktivitas pengguna

   - Pelacakan perubahan data sensitif

   - Laporan audit untuk kepatuhan

### **5.2 Modul Manajemen Cabang & Divisi**

# 1. **Manajemen Cabang**

- Pembuatan dan pengelolaan data cabang

- Definisi area layanan per cabang

- Struktur hierarki cabang (pusat, regional, cabang)

- Alokasi sumber daya per cabang

2. **Manajemen Divisi**

   - Pembuatan dan pengelolaan divisi

   - Penentuan struktur organisasi

   - Visualisasi struktur organisasi

3. **Manajemen Mitra Forwarder**

   - Pendaftaran dan pengelolaan mitra forwarder

   - Definisi area layanan forwarder

   - Pengaturan tarif forwarder

   - Routing otomatis ke forwarder berdasarkan tujuan

### **5.3 Modul Operasional**

#### **5.3.1 Pengambilan Barang (Pickup)**

# 1. **Permintaan Pickup**

- Registrasi permintaan pickup dari pelanggan

- Validasi area layanan

- Penjadwalan pickup

- Notifikasi ke tim pickup

2. **Penugasan Pickup**

   - Alokasi tugas kepada tim pickup

   - Optimasi rute untuk multiple pickup

   - Monitoring status pickup

3. **Eksekusi Pickup**

   - Navigasi ke lokasi pickup

   - Verifikasi dan dokumentasi barang

   - Form pengambilan digital

   - Konfirmasi pengambilan dengan tanda tangan digital

#### **5.3.2 Penjualan dan Pembuatan Resi**

# 1. **Manajemen Pelanggan**

- Database pelanggan terintegrasi

- Riwayat transaksi pelanggan

- Segmentasi pelanggan

2. **Pembuatan Resi/STT**

   - Input data pengiriman

   - Kalkulasi otomatis biaya berdasarkan berat, jarak, dan layanan

   - Pemilihan metode pembayaran (CASH, COD, CAD)

   - Pembuatan dan pencetakan resi

3. **Pengelolaan Metode Pembayaran**

   - Proses pembayaran CASH

   - Pencatatan pembayaran COD

   - Pengelolaan piutang CAD

   - Integrasi dengan modul keuangan

#### **5.3.3 Muat & Langsir**

# 1. **Manajemen Pemuatan**

- Alokasi barang ke truk

- Optimasi pemuatan berdasarkan tujuan dan kapasitas

- Form muat digital

- Verifikasi barang yang dimuat

2. **Pengiriman Antar Cabang**

   - Manajemen omzet per truk

   - Koordinasi antar cabang untuk konsolidasi muatan

   - Dokumen pengiriman digital

   - Tracking perjalanan truk

3. **Penerimaan di Cabang Tujuan**

   - Verifikasi barang yang diterima

   - Pemeriksaan kesesuaian dengan dokumen

   - Penyelesaian masalah ketidaksesuaian

   - Alokasi untuk lansir

4. **Lansir ke Penerima**

   - Optimasi rute lansir

   - Dokumen lansir digital

   - Konfirmasi penerimaan dengan tanda tangan digital

   - Proses COD

#### **5.3.4 Manajemen Retur**

# 1. **Pencatatan Retur**

- Alasan retur

- Dokumentasi kondisi barang

- Notifikasi ke pengirim

2. **Penanganan Barang Retur**

   - Penyimpanan barang retur

   - Penyelesaian retur (pengiriman ulang, pengembalian ke pengirim)

   - Pelaporan retur

#### **5.3.5 Manajemen Armada Kendaraan**

# 1. **Data Kendaraan**

- Database armada kendaraan

- Riwayat pemeliharaan

- Status kendaraan

2. **Pemeliharaan Kendaraan**

   - Jadwal pemeliharaan rutin

   - Pencatatan pemeliharaan

   - Alert untuk jadwal pemeliharaan

3. **Penugasan Kendaraan**

   - Alokasi kendaraan untuk tugas

   - Monitoring penggunaan kendaraan

   - Laporan utilisasi kendaraan

### **5.4 Modul Keuangan**

#### **5.4.1 Pengelolaan Kas dan Bank**

# 1. **Manajemen Kas**

- Pencatatan kas masuk dan keluar

- Rekonsiliasi kas harian

- Laporan kas

2. **Manajemen Bank**

   - Pencatatan transaksi bank

   - Rekonsiliasi bank dengan meng-import mutasi bank

   - Multiple akun bank

#### **5.4.2 Penagihan dan Manajemen Piutang**

# 1. **Manajemen Piutang**

- Pencatatan piutang CAD

- Kategorisasi piutang berdasarkan umur

- Alert piutang jatuh tempo

2. **Penagihan**

   - Penjadwalan penagihan

   - Optimasi rute penagihan

   - Pencatatan hasil penagihan

   - Bukti pembayaran digital

#### **5.4.3 Akuntansi dan Pembukuan**

# 1. **Jurnal dan Buku Besar**

- Chart of accounts

- Jurnal otomatis dari transaksi

- Posting ke buku besar

- Tutup buku periodik

2. **Laporan Keuangan**

   - Neraca

   - Laporan laba rugi

   - Laporan arus kas

   - Laporan konsolidasi

3. **Manajemen Aset**

   - Pencatatan aset

   - Depresiasi otomatis

   - Laporan aset

### **5.5 Modul HRD**

# 1. **Manajemen Karyawan**

- Database karyawan lengkap

- Riwayat jabatan

- Dokumen karyawan

2. **Pengelolaan Kehadiran**

   - Pencatatan kehadiran

   - Manajemen izin dan cuti

   - Laporan kehadiran

3. **Penggajian dan Kompensasi**

   - Struktur gaji per posisi

   - Kalkulasi gaji berdasarkan kehadiran dan kinerja

   - Slip gaji digital

   - Piutang Karyawan yang mana karyawan diperbolehkan hutang dengan Syarat dan Ketentuan tertentu.

### **5.6 Modul Pelaporan**

# 1. **Dashboard**

- Dashboard eksekutif

- Dashboard operasional

- Dashboard keuangan

- Dashboard pelanggan

- Dashboard HR

2. **Laporan Operasional**

   - Laporan pengiriman harian

   - Laporan performa cabang

   - Laporan utilitas kendaraan

   - Laporan retur

3. **Laporan Keuangan**

   - Laporan pendapatan

   - Laporan biaya

   - Laporan piutang

   - Laporan profitabilitas

4. **Laporan Pelanggan**

   - Laporan aktivitas pelanggan

   - Laporan profitabilitas pelanggan

   - Laporan perilaku pembayaran

### **5.7 Modul Pelacakan dan Monitoring**

# 1. **Tracking Pengiriman**

- Pelacakan status pengiriman real-time

- Timeline pengiriman

- Estimasi waktu pengiriman

2. **Monitoring Armada**

   - Lokasi kendaraan real-time

   - Monitoring rute

   - Alert deviasi rute

3. **Notifikasi dan Alert**

   - Notifikasi perubahan status

   - Alert masalah pengiriman

   - Alert SLA

## **6. Alur Kerja Utama**

### **6.1 Alur Pengambilan dan Pengiriman Barang**

# 1. Customer Service menerima permintaan pickup dari pelanggan2. Sistem memvalidasi area layanan3. Kepala Gudang menugaskan tim pickup4. Tim pickup menerima tugas melalui aplikasi mobile5. Tim pickup menuju lokasi pelanggan6. Tim pickup memverifikasi dan mendokumentasikan barang7. Tim pickup mengisi form pengambilan digital8. Tim pickup kembali ke cabang9. Checker menerima dan memverifikasi barang10. Checker menimbang dan mengukur barang11. Staff Penjualan membuat resi/STT12. Pembayaran diproses (CASH) atau dicatat (COD/CAD)13. Checker mengalokasikan barang ke truk14. Team muat memuat barang ke truk15. Sistem menghitung omzet per truk16. Jika omzet mencukupi, Kepala Gudang dan Kepala Cabang menyetujui keberangkatan17. Staff Administrasi membuat dokumen pengiriman18. Kasir mengeluarkan biaya pengiriman19. Truk berangkat ke cabang tujuan20. Truk tiba di cabang tujuan21. Staff Lansir memverifikasi dokumen22. Checker cabang tujuan memverifikasi barang23. Team bongkar menurunkan barang24. Checker mengalokasikan barang untuk lansir25. Tim lansir mengantarkan barang ke penerima26. Penerima memverifikasi dan menerima barang27. Jika COD, tim lansir menerima pembayaran28. Tim lansir kembali ke cabang29. Staff Lansir memperbarui status pengiriman

### **6.2 Alur Penagihan CAD**

# 1. Staff Administrasi mengidentifikasi tagihan CAD yang jatuh tempo2. Kepala Administrasi membuat jadwal penagihan3. Debt Collector menerima daftar tagihan melalui aplikasi mobile4. Sistem mengoptimalkan rute penagihan5. Debt Collector mengunjungi pelanggan6. Debt Collector mencatat hasil kunjungan7. Jika pembayaran diterima, Debt Collector mencatat pembayaran8. Jika tidak, Debt Collector mencatat alasan dan janji bayar9. Debt Collector kembali ke cabang10. Kasir memverifikasi dan mencatat pembayaran yang diterima11. Staff Administrasi memperbarui status piutang12. Sistem menghasilkan laporan hasil penagihan

### **6.3 Alur Keuangan**

# 1. Transaksi operasional dicatat (penjualan, biaya, dll)2. Sistem membuat jurnal otomatis3. Kasir memverifikasi transaksi kas4. Staff Administrasi memverifikasi transaksi bank5. Sistem memposting ke buku besar6. Kepala Administrasi memvalidasi jurnal7. Sistem menghasilkan laporan keuangan8. Manager Keuangan menganalisis laporan9. Direktur Utama meninjau laporan konsolidasi

## **7. Spesifikasi Fitur dan Prioritas**

### **7.1 Must-Have (Harus Ada)**

#### **Modul Autentikasi dan Manajemen Pengguna**

# - Login/logout secure

- Role-Based Access Control (RBAC)

- Manajemen pengguna dasar

#### **Modul Manajemen Cabang & Divisi**

# - Pembuatan dan pengelolaan cabang

- Definisi area layanan

- Struktur organisasi dasar

#### **Modul Pengambilan Barang**

# - Registrasi permintaan pickup

- Penugasan tim pickup

- Form pengambilan digital

#### **Modul Penjualan dan Pembuatan Resi**

# - Database pelanggan

- Pembuatan resi digital

- Kalkulasi biaya otomatis

- Pilihan metode pembayaran

#### **Modul Muat & Langsir**

# - Alokasi barang ke truk

- Dokumen pengiriman digital

- Verifikasi penerimaan barang

#### **Modul Keuangan Dasar**

# - Pencatatan kas masuk dan keluar

- Pencatatan piutang CAD

- Jurnal otomatis dasar

#### **Modul Pelacakan**

# - Status pengiriman real-time

- Timeline pengiriman

### **7.2 Should-Have (Sebaiknya Ada)**

#### **Modul Autentikasi dan Manajemen Pengguna**

# - Multi-faktor autentikasi

- Audit log detail

#### **Modul Manajemen Cabang & Divisi**

# - Daftar Mitra Forwarder

- Visualisasi struktur organisasi

#### **Modul Pengambilan Barang**

# - Optimasi rute pickup

- Dokumentasi foto barang

#### **Modul Penjualan dan Pembuatan Resi**

# - Riwayat transaksi pelanggan

- Integrasi dengan printer termal

#### **Modul Muat & Langsir**

# - Optimasi pemuatan truk

- Optimasi rute lansir

- Tanda tangan digital penerima

#### **Modul Penagihan**

# - Optimasi rute penagihan

- Dokumentasi hasil penagihan

#### **Modul Keuangan**

# - Laporan keuangan standar

- Rekonsiliasi kas dan bank

- Manajemen multiple akun bank

#### **Modul Pelaporan**

# - Dashboard operasional

- Dashboard keuangan dasar

- Laporan standar

### **7.3 Nice-to-Have (Bagus Jika Ada)**

#### **Modul Autentikasi dan Manajemen Pengguna**

# - Single sign-on

#### **Modul Manajemen Cabang & Divisi**

# - Analytics performa cabang

- Benchmarking antar cabang

#### **Modul Operasional**

# - Prediksi volume pengiriman

- Optimasi dinamis rute

- Integrasi dengan timbangan digital

#### **Modul Keuangan**

# - Forecasting keuangan

- Advanced analytics profitabilitas

- Integrasi dengan sistem pajak

#### **Modul HRD**

# - Evaluasi kinerja digital

- Manajemen pelatihan

- Employee self-service

#### **Modul Pelaporan**

# - Dashboard custom

- Analytics prediktif

- Export berbagai format

#### **Modul Pelacakan dan Monitoring**

# - Geofencing

- Monitoring kondisi kendaraan

- Integrasi sensor IoT

## **8. Kebutuhan Non-Fungsional**

### **8.1 Performa**

# - Waktu respons aplikasi web maksimal 3 detik untuk 95% transaksi

- Waktu respons aplikasi mobile maksimal 2 detik untuk 95% transaksi

- Throughput minimal 100 transaksi per detik pada jam sibuk

- Mendukung minimal 500 pengguna aktif secara bersamaan

- Query database harus selesai dalam waktu kurang dari 1 detik untuk 95% query

### **8.2 Keamanan**

# - Autentikasi multi-faktor untuk akses sensitif

- Enkripsi data sensitif dalam penyimpanan dan transmisi

- Audit trail untuk semua aktivitas pengguna penting

- Proteksi terhadap serangan umum (SQL injection, XSS, CSRF)

- Timeout sesi otomatis setelah 30 menit tidak aktif

- Kebijakan password yang kuat (minimal 8 karakter, kombinasi huruf, angka, dan simbol)

### **8.3 Keandalan**

# - Uptime sistem minimal 99.5% (tidak termasuk maintenance terjadwal)

- Mean Time to Recovery (MTTR) kurang dari 2 jam untuk insiden kritis

- Backup otomatis setiap 24 jam dengan retention 30 hari

- Recovery Time Objective (RTO) kurang dari 4 jam

- Recovery Point Objective (RPO) kurang dari 1 jam

### **8.4 Kompatibilitas**

# - Aplikasi web kompatibel dengan Chrome, Firefox, Safari, Edge (versi terbaru dan 2 versi sebelumnya)

- Aplikasi mobile kompatibel dengan Android 9.0+ dan iOS 13.0+

- Aplikasi web responsif untuk desktop, tablet, dan mobile

- Mendukung pencetakan ke berbagai jenis printer standar

- Ekspor data ke format standar (Excel, CSV, PDF)

### **8.5 Skalabilitas**

# - Mendukung penambahan cabang baru tanpa degradasi performa

- Mendukung pertumbuhan volume transaksi hingga 100% per tahun

- Mendukung pertumbuhan jumlah pengguna hingga 50% per tahun

- Mendukung pertumbuhan volume data hingga 100% per tahun

### **8.6 Usability**

# - Antarmuka pengguna intuitif dan mudah digunakan

- Konsistensi UI/UX di seluruh aplikasi

- Kemampuan untuk menyelesaikan tugas umum dengan minimal langkah

- Bantuan kontekstual untuk fungsi kompleks

- Pesan error yang jelas dengan petunjuk pemulihan

- Aksesibilitas sesuai standar WCAG 2.1 level AA

- Mendukung lokalisasi minimal untuk Bahasa Indonesia dan Inggris

### **8.7 Operabilitas**

# - Sistem manajemen konfigurasi terpusat

- Kemampuan untuk upgrade sistem tanpa downtime

- Monitoring proaktif untuk deteksi dini masalah

- Log yang komprehensif untuk troubleshooting

- Self-healing untuk komponen yang gagal

## **9. Integrasi Sistem**

### **9.1 Integrasi dengan Sistem Eksternal**

#### **9.1.1 Payment Gateway**

# - Integrasi dengan payment gateway untuk pembayaran elektronik (Midtrans, Xendit, atau Doku) (Opsional)

- Support untuk berbagai metode pembayaran (transfer bank, e-wallet, kartu kredit)

- Callback untuk notifikasi pembayaran

- Rekonsiliasi otomatis pembayaran

#### **9.1.2 Maps dan Routing Service**

# - Integrasi dengan Google Maps API atau Mapbox

- Geocoding dan reverse geocoding

- Optimasi rute

- Visualisasi tracking

#### **9.1.3 WhatsApp/Email Gateway**

# - Integrasi dengan WhatsApp untuk notifikasi

- Integrasi dengan penyedia layanan email untuk komunikasi

- Template management untuk komunikasi standar

#### **9.1.4 Sistem Forwarder/Mitra (Opsional)**

# - API integration dengan sistem mitra

- Pertukaran data pengiriman

- Update status dari sistem mitra

### **9.2 Integrasi Internal**

#### **9.2.1 Integrasi Aplikasi Web dan Mobile**

# - Sinkronisasi data real-time

- Offline mode dengan sinkronisasi saat online

- Konsistensi pengalaman pengguna

#### **9.2.2 Integrasi Operasional dan Keuangan**

# - Pembukuan otomatis dari transaksi operasional

- Rekonsiliasi otomatis pembayaran dengan pengiriman

- Analitik profitabilitas per pengiriman

#### **9.2.3 Integrasi Perangkat**

# - Integrasi dengan printer termal untuk cetak resi

- Integrasi dengan barcode scanner

- Integrasi potensial dengan timbangan digital

## **10. Kriteria Penerimaan**

### **10.1 Kriteria Penerimaan Fungsional**

#### **10.1.1 Modul Autentikasi dan Manajemen Pengguna**

# - Pengguna dapat login dengan kredensial valid dan ditolak dengan kredensial tidak valid

- Sistem menerapkan RBAC dengan benar sesuai peran pengguna

- Audit trail mencatat semua aktivitas yang relevan dengan keamanan

#### **10.1.2 Modul Pengambilan Barang**

# - Customer Service dapat membuat permintaan pickup dan sistem memvalidasi area layanan

- Kepala Gudang dapat menugaskan tim pickup dan tim menerima notifikasi

- Tim pickup dapat mengisi form digital dan mendokumentasikan barang dengan foto

- Sistem mencatat dengan benar semua data pengambilan barang

#### **10.1.3 Modul Penjualan dan Pembuatan Resi**

# - Staff Penjualan dapat membuat resi digital dengan cepat dan akurat

- Sistem menghitung biaya pengiriman dengan benar berdasarkan berat, jarak, dan layanan

- Resi dapat dicetak dengan format standar

- Sistem mencatat dengan benar metode pembayaran dan status pembayaran

#### **10.1.4 Modul Muat & Langsir**

# - Checker dapat mengalokasikan barang ke truk dengan efisien

- Sistem menghitung omzet per truk dengan benar

- Tim lansir dapat mengoptimalkan rute pengiriman

- Penerima dapat mengkonfirmasi penerimaan dengan tanda tangan digital

#### **10.1.5 Modul Keuangan**

# - Sistem mencatat semua transaksi keuangan dengan benar

- Jurnal dibuat secara otomatis dari transaksi operasional

- Laporan keuangan menunjukkan data yang akurat dan konsisten

- Piutang CAD dapat dikelola dan ditagih dengan efektif

#### **10.1.6 Modul Pelacakan**

# - Status pengiriman diperbarui secara real-time

- Pelanggan dapat melacak pengiriman dengan nomor resi

- Timeline pengiriman menunjukkan semua milestone penting

### **10.2 Kriteria Penerimaan Non-Fungsional**

#### **10.2.1 Performa**

# - Sistem memenuhi semua metrik performa yang ditetapkan

- Load testing menunjukkan sistem dapat menangani beban puncak

- Responsif pada berbagai perangkat dan kondisi jaringan

#### **10.2.2 Keamanan**

# - Penetration testing tidak menunjukkan kerentanan kritis

- Enkripsi data sensitif berfungsi dengan benar

- Kontrol akses mencegah akses tidak sah ke data dan fungsi

#### **10.2.3 Keandalan**

# - Sistem memenuhi target uptime dalam pengujian extended

- Backup dan recovery berfungsi sesuai spesifikasi

- Sistem mendegradasi dengan graceful saat terjadi kegagalan parsial

#### **10.2.4 Usability**

# - Usability testing menunjukkan pengguna dapat menyelesaikan tugas tanpa kesulitan

- System memenuhi standar aksesibilitas yang ditetapkan

- Konsistensi UI/UX di seluruh aplikasi

## **11. Asumsi, Batasan, dan Risiko**

### **11.1 Asumsi**

# 1. **Infrastruktur**

- Seluruh cabang memiliki akses internet yang memadai untuk mengakses sistem

- Staf operasional memiliki akses ke perangkat mobile yang kompatibel

- Infrastruktur TI dasar (komputer, jaringan, printer) sudah tersedia di setiap cabang

2. **Organisasi**

   - Manajemen dan staf PT. Sarana Mudah Raya akan memberikan dukungan penuh selama pengembangan

   - SOP yang ada sudah terdokumentasi dengan baik dan dapat menjadi dasar pengembangan sistem

   - Staf perusahaan memiliki kemampuan dasar komputer dan dapat menerima pelatihan

3. **Data**

   - Data master (cabang, divisi, pegawai) sudah tersedia dan akurat

   - Data operasional dari sistem lama dapat dimigrasikan dengan effort yang wajar

   - Struktur data di seluruh cabang konsisten dan dapat distandarisasi

### **11.2 Batasan**

# 1. **Batasan Teknis**

- Aplikasi web dikembangkan menggunakan Next.js dan React dengan JavaScript

- Aplikasi mobile dikembangkan menggunakan React Native (Expo) dengan TypeScript

- Backend dikembangkan menggunakan Node.js dengan Express.js dengan JavaScript

- Database menggunakan MongoDB dengan Mongoose ORM dan pendekatan Embedded Document

- Sistem harus dapat beroperasi pada koneksi internet dengan kecepatan minimal 1 Mbps

2. **Batasan Bisnis**

   - Budget pengembangan terbatas sesuai dengan estimasi awal

   - Timeline pengembangan 8 bulan harus dipenuhi

   - Sistem harus mendukung model bisnis dan proses yang ada tanpa perubahan signifikan

3. **Batasan Regulasi**

   - Sistem harus mematuhi regulasi perpajakan Indonesia

   - Sistem harus mematuhi regulasi perlindungan data pribadi

   - Dokumentasi finansial harus memenuhi standar akuntansi yang berlaku

### **11.3 Risiko**

# | | | | | |

| :----: | :---------------------------------------------------: | :--------: | :--------------: | :-----------------------------------------------------------------------------------------------------------: |
| **No** | **Risiko** | **Dampak** | **Probabilitas** | **Strategi Mitigasi** |
| 1 | Resistensi pengguna terhadap sistem baru | Tinggi | Sedang | - Keterlibatan pengguna sejak awal.- Program pelatihan komprehensif.- Pendampingan intensif saat implementasi |
| 2 | Konektivitas internet tidak stabil di beberapa cabang | Tinggi | Tinggi | - Fitur offline mode di aplikasi mobile.- Caching data untuk operasi dasar.- Optimasi bandwidth aplikasi |
| 3 | Kualitas data dari sistem lama tidak konsisten | Sedang | Tinggi | - Analisis dan pembersihan data awal.- Validasi data sebelum migrasi.- Migrasi bertahap |
| 4 | Scope creep selama pengembangan | Tinggi | Sedang | - Proses manajemen perubahan ketat.- Prioritas kebutuhan yang jelas.- Time-boxed development |
| 5 | Integrasi dengan sistem eksternal bermasalah | Sedang | Sedang | - Proof of concept awal.- Pengujian integrasi menyeluruh.- Fallback manual untuk proses kritis |
| 6 | Performa sistem tidak memenuhi ekspektasi | Tinggi | Rendah | - Load testing sejak awal.- Monitoring performa ongoing.- Desain arsitektur yang scalable |
| 7 | Keamanan data terancam | Tinggi | Rendah | - Penerapan best practice keamanan.- Penetration testing rutin.- Training awareness keamanan |
| 8 | Timeline implementasi tertunda | Tinggi | Sedang | - Manajemen proyek agile.- Buffer waktu untuk setiap fase.- Identifikasi dependencies awal |

## **12. Timeline dan Roadmap**

### **12.1 Timeline Pengembangan**

# Total durasi pengembangan direncanakan 8 bulan dengan pembagian fase berikut:

#### **Fase 1: Foundation (Bulan 1-2)**

# - Setup infrastruktur dan environment

- Implementasi Modul Autentikasi & Otorisasi

- Implementasi Modul Manajemen Cabang & Divisi

- Implementasi Modul Manajemen Pegawai dasar

#### **Fase 2: Operasional Inti (Bulan 3-4)**

# - Implementasi Modul Pengambilan Barang

- Implementasi Modul Penjualan & Pembuatan Resi

- Implementasi Modul Muat & Langsir (bagian 1)

- Implementasi Modul Muat & Langsir (bagian 2) & Tracking dasar

#### **Fase 3: Keuangan dan Pelaporan (Bulan 5-6)**

# - Implementasi Modul Keuangan (Kas & Bank)

- Implementasi Modul Keuangan (Akuntansi)

- Implementasi Modul Penagihan

- Implementasi Dashboard & Pelaporan

#### **Fase 4: Mobile Apps (Bulan 7)**

# - Implementasi Mobile Apps untuk Checker & Supir

- Implementasi Mobile Apps untuk Debt Collector & Integrasi

#### **Fase 5: Optimasi dan Penyempurnaan (Bulan 8)**

# - Implementasi Modul Retur & Penyempurnaan

- Finalisasi, Performance Tuning & Go-Live

### **12.2 Roadmap Pengembangan Masa Depan**

# Setelah implementasi awal, roadmap pengembangan masa depan meliputi:

#### **Tahun 1, Kuartal 1-2**

# - Integrasi dengan sistem accounting eksternal

- Pengembangan API untuk integrasi partner

- Pengembangan portal pelanggan untuk pelacakan mandiri

#### **Tahun 1, Kuartal 3-4**

# - Implementasi sistem BI (Business Intelligence)

- Pengembangan modul customer service dan ticketing

- Optimasi algoritma rute dengan machine learning

#### **Tahun 2, Kuartal 1-2**

# - Implementasi IoT untuk tracking kendaraan

- Pengembangan analitik prediktif untuk forecasting volume

- Integrasi dengan marketplace dan e-commerce

#### **Tahun 2, Kuartal 3-4**

# - Implementasi blockchain untuk proof of delivery

- Pengembangan fitur chatbot untuk customer service

- Ekspansi ke platform mobile untuk pelanggan

## **13. Lampiran**

### **13.1 Glossary**

# Daftar istilah dan definisi yang digunakan dalam dokumen ini tersedia di bagian 1.3.

### **13.2 Referensi**

# 1. Dokumen Alur Kerja PT. Sarana Mudah Raya

2. Struktur Organisasi PT. Sarana Mudah Raya

3. Job Description untuk seluruh posisi di PT. Sarana Mudah Raya

4. Laporan Keuangan Cabang dan Pusat PT. Sarana Mudah Raya

5. SDLC (Software Development Life Cycle) untuk Sistem ERP Samudra Paket

### **13.3 Approval**

# | | | | |

| :------: | :-----------------: | :--------------: | :---------: |
| **Nama** | **Jabatan** | **Tanda Tangan** | **Tanggal** |
| \[Nama] | Direktur Utama | | |
| \[Nama] | Product Manager | | |
| \[Nama] | Business Analyst | | |
| \[Nama] | Manager Keuangan | | |
| \[Nama] | Manager Operasional | | |
