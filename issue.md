# 📋 Project Roadmap & Planning: Aplikasi Kost (Backend API)

Dokumen ini berisi panduan tingkat tinggi (*high-level planning*) untuk pengembangan backend sistem manajemen kos-kosan (**apk_kost**). Dokumen ini dirancang sebagai acuan kerja bagi programmer atau AI model untuk mengeksekusi fitur secara bertahap dan terstruktur.

---

## 🛠️ Stack & Lingkungan Kerja
- **Runtime**: [Bun](https://bun.sh/)
- **Framework Web**: [ElysiaJS](https://elysiajs.com/)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Database**: PostgreSQL (driver: `postgres.js`)
- **Tooling Database**: `drizzle-kit`

---

## 🏛️ Struktur Proyek (Modular / Feature-Based)
Gunakan pendekatan modular agar mudah dikembangkan dan diuji secara independen:

```text
apk_kost/
├── src/
│   ├── db/
│   │   ├── index.ts          # Inisialisasi koneksi DB (Drizzle)
│   │   └── schema.ts         # Definisi tabel PostgreSQL
│   ├── modules/              # Modul fitur (controller, service, dto)
│   │   ├── auth/             # Autentikasi & manajemen user
│   │   ├── rooms/            # Manajemen kamar & fasilitas
│   │   ├── tenants/          # Data penyewa
│   │   ├── leases/           # Kontrak sewa & penempatan kamar
│   │   ├── payments/         # Tagihan & riwayat pembayaran
│   │   └── reports/          # Ringkasan statistik & dashboard
│   ├── common/               # Middleware, helper, standard response
│   └── index.ts              # Entry point aplikasi Elysia
├── drizzle.config.ts         # Konfigurasi Drizzle Kit
├── package.json
└── tsconfig.json
```

---

## 🗄️ Gambaran Entitas & Relasi Data (High-Level)
Entitas utama yang perlu dimodelkan pada Drizzle Schema:

1. **Users**: Akun pengguna sistem (Owner/Admin, Staff, Penyewa).
2. **Rooms (Kamar)**: Nomor/nama kamar, tipe kamar, tarif sewa, status kamar (Tersedia, Terisi, Perbaikan).
3. **Tenants (Penyewa)**: Profil penyewa, nomor telepon, identitas (KTP/identitas diri), kontak darurat.
4. **Leases (Kontrak Sewa)**: Hubungan antara Penyewa dan Kamar, tanggal mulai sewa, durasi/periode sewa (bulanan/tahunan), nilai sewa disepakati, status kontrak (Aktif, Selesai, Dibatalkan).
5. **Invoices / Payments (Tagihan & Pembayaran)**: Tagihan sewa reguler & biaya tambahan (listrik, air, kebersihan), tanggal jatuh tempo, status pembayaran (Unpaid, Pending, Paid, Overdue).

---

## 🎯 Tahapan Pengerjaan (Milestones)

### Phase 1: Database Setup & Core Schema
- [ ] Tentukan dan implementasikan definisi tabel pada `src/db/schema.ts` (Users, Rooms, Tenants, Leases, Payments).
- [ ] Buat dan uji relasi antar tabel (One-to-Many antara Kamar/Penyewa dengan Kontrak dan Tagihan).
- [ ] Konfigurasi migrasi/sinkronisasi skema menggunakan `drizzle-kit push` atau `drizzle-kit generate`.

### Phase 2: Autentikasi & Otorisasi
- [ ] Implementasikan endpoint registrasi dan login dengan hashing password yang aman.
- [ ] Terapkan middleware JWT dan kontrol akses berbasis peran (*Role-Based Access Control*):
  - **Admin / Owner**: Akses penuh ke seluruh data & laporan keuangan.
  - **Staff / Penjaga**: Akses operasional harian (cek status kamar, konfirmasi pembayaran).
  - **Tenant / Penyewa**: Hanya dapat melihat data kamar miliknya dan status tagihan.

### Phase 3: Manajemen Master Data (Kamar & Penyewa)
- [ ] **Modul Kamar**:
  - CRUD data kamar dan tipe/fasilitas.
  - Filter pencarian kamar berdasarkan status ketersediaan dan kisaran harga.
- [ ] **Modul Penyewa**:
  - CRUD data profil penyewa.
  - Riwayat kamar yang pernah disewa oleh penyewa terkait.

### Phase 4: Manajemen Sewa & Pembayaran (Core Business Logic)
- [ ] **Modul Sewa (Leases)**:
  - Alur *check-in* penyewa baru ke kamar yang berstatus kosong (otomatis ubah status kamar menjadi *Terisi*).
  - Perpanjangan sewa atau *check-out* penyewa (kembalikan status kamar menjadi *Tersedia*).
- [ ] **Modul Tagihan & Pembayaran**:
  - Pembuatan tagihan berkala (otomatis atau terjadwal sesuai jatuh tempo kontrak).
  - Endpoint konfirmasi pembayaran dan update status tagihan menjadi lunas.
  - Riwayat log pembayaran untuk audit.

### Phase 5: Laporan & Dashboard Pemilik
- [ ] Endpoint statistik ringkas (*dashboard metrics*):
  - Persentase okupansi kamar (jumlah terisi vs total kamar).
  - Total pendapatan bulan berjalan.
  - Daftar penyewa yang mendekati jatuh tempo atau menunggak pembayaran.

---

## 📌 Standar Teknis & Best Practices untuk Pelaksana
1. **Validasi Input**: Manfaatkan fitur skema validasi bawaan Elysia (`t.Object`, `t.String`, dll) pada setiap route handler.
2. **Format Response Konsisten**: Gunakan format respons terstandar untuk API, contoh:
   ```json
   {
     "success": true,
     "message": "Deskripsi aksi",
     "data": {}
   }
   ```
3. **Error Handling**: Tangani error secara terpusat (menggunakan `onError` di Elysia) agar respons error tidak membocorkan informasi internal stack trace database.
4. **Environment Variables**: Simpan konfigurasi kredensial (koneksi database, JWT secret, port) di `.env` dan gunakan `.env.example` sebagai referensi.

---

## ⚡ Perintah Penting
- Menjalankan server dev: `bun run dev`
- Type checking: `bun run typecheck`
- Push skema DB langsung: `bun run db:push`
- Buka Drizzle Studio: `bun run db:studio`
