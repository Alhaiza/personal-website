/**
 * DEFINISI TIPE DATA (TYPES)
 * 
 * Interface TypeScript berfungsi sebagai kontrak bentuk data.
 * Memastikan setiap komponen menerima properti (props) yang tepat
 * tanpa ada nilai yang kurang atau salah tipe.
 */

// Tipe data untuk item keahlian di banner horizontal
export interface SkillItem {
  id: string;
  name: string;
  // Menentukan jenis ikon teknologi yang akan dirender
  iconType: "react" | "typescript" | "nodejs" | "tailwind" | "mongodb" | "git";
}

// Tipe data untuk kartu proyek
export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  tags: string[];
  imageUrl: string;
  projectUrl?: string;
  detailsUrl?: string;
}

// Tipe data untuk kartu sertifikasi
export interface CertificationItem {
  id: string;
  title: string;
  issuer?: string;
  date?: string;
  credentialUrl?: string;
}

// Tipe data untuk riwayat pengalaman kerja (timeline)
export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
}

// Tipe data untuk informasi profil pengguna dan tautan sosial media
export interface UserProfile {
  name: string;
  role: string;
  bio: string;
  codeSnippet: {
    language: string;
    code: string;
  };
  socialLinks: {
    github: string;
    linkedin: string;
    twitter: string;
    email: string;
  };
}
