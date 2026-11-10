/**
 * TYPES DEFINITIONS
 * 
 * TypeScript interfaces act as contracts for our data objects.
 * They guarantee that every component receives the exact expected props
 * without runtime bugs or missing values.
 */

// Skill item for the horizontal skill banner
export interface SkillItem {
  id: string;
  name: string;
  // Category or icon name identifier
  iconType: "react" | "typescript" | "nodejs" | "tailwind" | "mongodb" | "git";
}

// Project card data structure
export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  tags: string[];
  imageUrl: string;
  projectUrl?: string;
  detailsUrl?: string;
}

// Certification card data structure
export interface CertificationItem {
  id: string;
  title: string;
  issuer?: string;
  date?: string;
  credentialUrl?: string;
}

// Career timeline / experience item
export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
}

// Global user profile settings & social links
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

