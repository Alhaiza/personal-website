# Personal Portfolio & Admin CMS (Neo-Brutalism)

Website portofolio pribadi modern dan interaktif dengan desain khas **Neo-Brutalism** (garis tepi hitam tebal, bayangan keras, dan kontras warna cerah). Dilengkapi dengan **Admin Dashboard / CMS Rahasia** yang terintegrasi langsung dengan **Google Firebase (Authentication & Cloud Firestore)** untuk mengelola seluruh konten website secara dinamis dan *real-time*.

---

## 🚀 Fitur Utama

- **Desain Neo-Brutalism**: Tampilan antarmuka taktil, tajam, dan estetis menggunakan Tailwind CSS.
- **100% Dinamis**: Seluruh konten (Hero, Profile, Keahlian/Skills, Riwayat Proyek, Sertifikasi Kompetensi, dan Pengalaman Karier) dikontrol langsung dari Admin Dashboard.
- **Admin Dashboard Terproteksi**: Rute admin rahasia (`/dashboard`) yang dilindungi otentikasi Firebase Authentication.
- **Sistem Notifikasi & Dialog Kustom**: Notifikasi Toast instan dan dialog konfirmasi modal bertema Neo-Brutalism untuk feedback aksi CRUD.
- **Alur Unggah Aset Lokal Cerdas**: Mendukung pengunggahan berkas media lokal ke `public/uploads/` dengan pembersihan otomatis (*auto-cleanup*) berkas lama saat ditimpa atau dihapus.
- **Pesan Masuk Pengunjung (Inbox)**: Pengunjung dapat mengirim pesan lewat form `/contact` dan langsung masuk ke tab Inbox admin dashboard.

---

## 📋 Prasyarat (Yang Perlu Disiapkan)

Sebelum memulai instalasi, pastikan lingkungan komputer Anda telah terpasang:

1. **Node.js**: Versi `18.x` atau lebih baru (disarankan versi LTS terbaru).
2. **Package Manager**: Disarankan menggunakan **pnpm** (`npm install -g pnpm`), atau bisa menggunakan `npm` / `yarn`.
3. **Proyek Firebase**:
   - Buat proyek baru di [Firebase Console](https://console.firebase.google.com/).
   - Aktifkan **Authentication** (Email/Password).
   - Aktifkan **Cloud Firestore Database** (Mode test atau production).
   - Buat Web App pada proyek Firebase tersebut untuk mendapatkan konfigurasi API Keys.

---

## 🛠️ Panduan Instalasi & Pengaturan

### 1. Klon Repositori
```bash
git clone https://github.com/username-anda/personal-website.git
cd personal-website
```

### 2. Pasang Dependensi
Jalankan perintah berikut untuk mengunduh semua library yang diperlukan:
```bash
pnpm install
```
*(Atau `npm install` jika menggunakan npm)*

### 3. Konfigurasi Environment Variables (`.env`)
Salin berkas template `.env.example` menjadi `.env.local` atau `.env`:
```bash
cp .env.example .env
```

Buka berkas `.env` dan lengkapi dengan kredensial proyek Firebase Anda:
```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

---

## 💻 Daftar Perintah yang Tersedia (Available Commands)

Gunakan perintah-perintah berikut selama pengembangan:

| Perintah | Deskripsi |
| :--- | :--- |
| `pnpm dev` | Menjalankan server pengembangan lokal (Vite Dev Server) di `http://localhost:5173`. |
| `pnpm run build` | Melakukan kompilasi TypeScript dan mem-bundle kode untuk rilis produksi ke folder `dist/`. |
| `pnpm preview` | Menjalankan preview lokal dari hasil build produksi yang ada di folder `dist/`. |
| `pnpm run lint` | Menjalankan ESLint untuk memeriksa kualitas kode, standar sintaks, dan aturan React Fast Refresh. |
| `firebase deploy` | Mendeploy seluruh aplikasi web dan aturan keamanan Firestore ke Firebase Hosting. |
| `firebase deploy --only firestore:rules` | Hanya mendeploy aturan keamanan Cloud Firestore (`firestore.rules`). |

---

## 📂 Struktur Direktori Proyek

```text
personal-website/
├── public/                 # Berkas publik statis & direktori unggahan lokal (/uploads)
├── src/
│   ├── components/         # Komponen UI (Navbar, Footer, Layout, Toast, Modal)
│   │   ├── admin/          # Komponen khusus panel Admin CMS
│   │   └── common/         # Komponen reusable (NeoButton, ConfirmModal, Toast)
│   ├── context/            # React Context (Auth State & Dynamic Site Content)
│   ├── lib/                # Inisialisasi Firebase App SDK
│   ├── pages/              # Halaman publik (Home, Projects, Skills, Contact) & Admin (Login, Dashboard)
│   ├── services/           # Service layer Firestore CRUD & Storage Upload
│   └── types/              # Definisi tipe data TypeScript terpusat
├── firestore.rules         # Aturan keamanan database Cloud Firestore
├── storage.rules           # Aturan keamanan Cloud Storage
├── vite.config.ts          # Konfigurasi bundler Vite & plugin upload lokal
└── tailwind.config.js      # Konfigurasi tema dan gaya Neo-Brutalism
```

---

## 🔒 Keamanan & Praktik Terbaik

- **Tanpa Kunci Rahasia di Git**: Berkas `.env` asli telah dikecualikan di dalam `.gitignore` sehingga tidak akan pernah terunggah ke repositori publik.
- **Aturan Akses Firestore**: Pembacaan data portofolio terbuka untuk umum, sedangkan operasi tambah/edit/hapus (*write*) dikunci hanya untuk pengguna yang telah terautentikasi melalui Firebase Auth.

---

## 📄 Lisensi

Proyek ini dibuat untuk keperluan portofolio pribadi. Anda bebas menggunakannya sebagai referensi atau template dasar pengembangan website Anda.
