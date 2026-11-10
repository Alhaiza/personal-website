import type { UserProfile, SkillItem, ProjectItem, CertificationItem, ExperienceItem } from "../types";

/**
 * DATA TIRUAN (MOCK DATA)
 * 
 * Menyediakan data awal yang realistis sesuai desain UI.
 * Memisahkan pengerjaan tampilan (UI) dari backend (seperti Firestore),
 * sehingga Anda bisa langsung menguji tampilan, teks, dan tata letak responsif.
 */

export const mockProfile: UserProfile = {
  name: "Joshua",
  role: "SOFTWARE\nDEVELOPER",
  bio: "I build scalable web applications and turn ideas into impactful products with clean, efficient code.",
  codeSnippet: {
    language: "typescript",
    code: `> const developer = {
    code: 'TypeScript',
    build: 'React',
    deploy: 'Vercel',
    passion: 'Solving problems'
  }`,
  },
  socialLinks: {
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
    email: "mailto:joshua@example.com",
  },
};

export const mockSkills: SkillItem[] = [
  { id: "1", name: "React", iconType: "react" },
  { id: "2", name: "TypeScript", iconType: "typescript" },
  { id: "3", name: "Node.js", iconType: "nodejs" },
  { id: "4", name: "Tailwind CSS", iconType: "tailwind" },
  { id: "5", name: "MongoDB", iconType: "mongodb" },
  { id: "6", name: "Git", iconType: "git" },
];

export const mockProjects: ProjectItem[] = [
  {
    id: "weatherly",
    title: "WEATHERLY",
    description: "A weather app with real-time data, beautiful charts and forecasts.",
    tags: ["React", "TypeScript", "API"],
    imageUrl: "https://images.unsplash.com/photo-1592210454359-9043f067919b?w=800&auto=format&fit=crop&q=80",
    projectUrl: "#",
    detailsUrl: "#",
  },
  {
    id: "taskmaster",
    title: "TASKMASTER",
    description: "Collaborative kanban task management with real-time sync and metrics.",
    tags: ["React", "Firebase", "Tailwind"],
    imageUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80",
    projectUrl: "#",
    detailsUrl: "#",
  },
];

export const mockCertifications: CertificationItem[] = [
  { id: "c1", title: "Cert 1", issuer: "AWS Certified Developer" },
  { id: "c2", title: "Cert 2", issuer: "Meta Frontend Specialist" },
  { id: "c3", title: "Cert 3", issuer: "Google Cloud Associate" },
];

export const mockExperiences: ExperienceItem[] = [
  {
    id: "e1",
    role: "SENIOR FRONTEND DEVELOPER",
    company: "TECHNOVA INC.",
    period: "2022 - PRESENT",
    description: "Lead the frontend development of a high-traffic SaaS platform used by over 50,000 active users.",
  },
  {
    id: "e2",
    role: "WEB DEVELOPER",
    company: "CREATIVE STUDIO",
    period: "2019 - 2022",
    description: "Built interactive marketing websites and internal tools for various high-profile clients.",
  },
  {
    id: "e3",
    role: "JUNIOR DEVELOPER",
    company: "STARTUP HUB",
    period: "2018 - 2019",
    description: "Assisted in building MVP applications for early-stage startups in rapid-iteration cycles.",
  },
];
