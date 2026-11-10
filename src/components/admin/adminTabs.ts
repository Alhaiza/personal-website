/**
 * Konfigurasi tab dashboard admin (satu sumber kebenaran).
 *
 * Dipisah ke file sendiri supaya Dashboard (yang membaca URL) dan AdminSidebar
 * (yang menggambar menu) memakai daftar yang SAMA. Jika kelak ingin menambah tab,
 * cukup tambahkan di sini lalu buat komponen panelnya.
 */

// Semua nama tab yang valid. `as const` membuat TypeScript tahu nilai pastinya (bukan sekadar string).
export const ADMIN_TABS = [
  "profile",
  "skills",
  "projects",
  "certifications",
  "experiences",
  "contact",
  "settings",
  "messages",
] as const;

// Tipe gabungan: "profile" | "skills" | ... diturunkan otomatis dari array di atas.
export type AdminTab = (typeof ADMIN_TABS)[number];

// Fungsi pembantu: memastikan nilai dari URL benar-benar tab yang valid (type guard).
export const isAdminTab = (value: string | undefined): value is AdminTab =>
  ADMIN_TABS.includes(value as AdminTab);
