export interface ProjectItem {
  id?: string;
  title: string;
  description: string;
  tags: string[];
  imageUrl: string;
  projectUrl?: string;
  githubUrl?: string;
  detailsUrl?: string;
  featured?: boolean;
  order?: number;
}

export interface CertificationItem {
  id?: string;
  title: string;
  issuer?: string;
  date?: string;
  credentialUrl?: string;
  order?: number;
}

export interface ExperienceItem {
  id?: string;
  role: string;
  company: string;
  period: string;
  description: string;
  order?: number;
}

// Daftar ikon yang tersedia untuk skill (sesuai ikon yang bisa dirender di SkillsBanner)
export type SkillIconType = "react" | "typescript" | "nodejs" | "tailwind" | "mongodb" | "git";

export interface SkillItem {
  id: string;
  name: string;
  iconType: SkillIconType;
  order?: number;
}

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

// Teks & aset global yang sebelumnya tertulis langsung di kode (hardcode)
export interface SiteSettings {
  brandName: string;
  footerText: string;
  ctaHeadline: string;
  ctaBadge: string;
  resumeUrl: string;
}

// Pengaturan kontak & sosial media yang dikelola dari menu "Contact Settings"
export interface ContactSettings {
  email: string;
  location: string;
  github: string;
  linkedin: string;
  twitter: string;
  customEmailLink: string;
}

export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "unread" | "read" | "archived";
  createdAt?: string | number | Date;
}
