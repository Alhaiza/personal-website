/**
 * DEFINISI TIPE DATA (TYPES)
 *
 * Interface TypeScript adalah "kontrak" bentuk data. Setiap field di sini
 * punya pasangan: (1) input di dashboard admin, (2) tampilan di halaman publik.
 * Field yang tidak punya pasangan sengaja dibuang agar tidak ada "field hantu".
 */

// Satu proyek di portofolio
export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  tags: string[];
  imageUrl: string;
  projectUrl?: string; // tautan demo langsung
  githubUrl?: string; // tautan repositori
  featured?: boolean; // true = tampil di carousel "Featured Projects" pada Home
}

// Satu sertifikasi
export interface CertificationItem {
  id: string;
  title: string;
  issuer?: string;
  description?: string;
  credentialUrl?: string; // tautan verifikasi kredensial
  imageUrl?: string; // thumbnail sertifikat
  featured?: boolean; // true = tampil di sidebar Certifications pada Home (dibatasi limit)
}

// Satu posisi pada timeline pengalaman kerja
export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
  current?: boolean; // true = pekerjaan saat ini (Present job)
}

// Daftar ikon bawaan atau fallback untuk skill
export type SkillIconType = "react" | "typescript" | "nodejs" | "tailwind" | "mongodb" | "git" | "custom";

export interface SkillItem {
  id: string;
  name: string;
  iconType?: SkillIconType;
  svgCode: string; // Wajib: markup SVG (<svg ...>...</svg>)
  featured?: boolean; // true = tampil di banner skills pada Home (dibatasi maksimal limit)
}

// Profil yang tampil di Hero. Urutan skill/proyek mengikuti urutan array-nya.
export interface UserProfile {
  name: string;
  // Judul besar di Hero. Setiap kata tampil di baris baru (contoh: "SOFTWARE DEVELOPER").
  role: string;
  bio: string;
  codeSnippet: {
    language: string;
    code: string;
  };
}

// Teks & aset global yang dipakai di banyak halaman
export interface SiteSettings {
  profileImageUrl: string; // foto profil di Hero
  resumeUrl: string; // berkas resume (Hero & Experience)
  brandName: string; // Navbar & Footer
  footerText: string; // teks copyright di Footer
  ctaHeadline: string; // judul kotak CTA (baris baru dihormati)
  ctaBadge: string; // stiker "AVAILABLE NOW"
}

// Informasi kontak & tautan sosial (SATU-SATUNYA sumber tautan sosial di seluruh situs)
export interface ContactSettings {
  email: string;
  location: string;
  github: string;
  linkedin: string;
  twitter: string;
  customEmailLink: string; // tautan untuk ikon email, contoh: mailto:nama@email.com
}

/**
 * Seluruh isi situs dalam satu objek.
 * Disimpan di Context (dan localStorage) sehingga dashboard admin dan halaman publik
 * membaca/menulis ke tempat yang SAMA.
 */
export interface SiteContent {
  settings: SiteSettings;
  profile: UserProfile;
  contact: ContactSettings;
  skills: SkillItem[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
  experiences: ExperienceItem[];
}

// Pesan dari formulir kontak pengunjung (tersimpan di Firestore, koleksi `messages`)
export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "unread" | "read" | "archived";
  createdAt?: string | number | Date;
}
