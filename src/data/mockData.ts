import type { SiteContent } from "../types";

/**
 * DATA CADANGAN (MOCK DATA)
 *
 * Berfungsi sebagai NILAI AWAL isi situs. Aplikasi memakai data ini hanya jika
 * belum ada data tersimpan di browser (localStorage) atau data tersebut rusak.
 * Setelah admin menyimpan perubahan, yang dipakai adalah data hasil edit admin.
 */

export const mockSiteContent: SiteContent = {
  settings: {
    profileImageUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80",
    resumeUrl: "/resume.pdf",
    brandName: "JOSHUA DEV",
    footerText: "© 2026 Joshua Lapitan. All rights reserved.",
    ctaHeadline: "LET'S BUILD\nSOMETHING\nAMAZING\nTOGETHER.",
    ctaBadge: "AVAILABLE NOW",
  },

  profile: {
    name: "Joshua",
    role: "SOFTWARE DEVELOPER",
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
  },

  contact: {
    email: "joshua@example.com",
    location: "Jakarta / Remote Worldwide",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
    customEmailLink: "mailto:joshua@example.com",
  },

  skills: [
    { id: "s1", name: "React", iconType: "react" },
    { id: "s2", name: "TypeScript", iconType: "typescript" },
    { id: "s3", name: "Node.js", iconType: "nodejs" },
    { id: "s4", name: "Tailwind CSS", iconType: "tailwind" },
    { id: "s5", name: "MongoDB", iconType: "mongodb" },
    { id: "s6", name: "Git", iconType: "git" },
  ],

  projects: [
    {
      id: "weatherly",
      title: "WEATHERLY",
      description: "A weather app with real-time data, beautiful charts and forecasts.",
      tags: ["React", "TypeScript", "API"],
      imageUrl: "https://images.unsplash.com/photo-1592210454359-9043f067919b?w=800&auto=format&fit=crop&q=80",
      projectUrl: "https://example.com/weatherly",
      githubUrl: "https://github.com/example/weatherly",
      featured: true,
    },
    {
      id: "taskmaster",
      title: "TASKMASTER",
      description: "Collaborative kanban task management with real-time sync and metrics.",
      tags: ["React", "Firebase", "Tailwind"],
      imageUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80",
      projectUrl: "https://example.com/taskmaster",
      githubUrl: "https://github.com/example/taskmaster",
      featured: true,
    },
    {
      id: "portfolio",
      title: "PORTFOLIO SITE",
      description: "This very website: a neo-brutalist portfolio with a hidden admin dashboard.",
      tags: ["React", "Tailwind", "Firebase"],
      imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80",
      githubUrl: "https://github.com/example/portfolio",
      featured: false,
    },
  ],

  certifications: [
    {
      id: "c1",
      title: "Cert 1",
      issuer: "AWS Certified Developer",
      description: "Menunjukkan keahlian membangun dan men-deploy aplikasi di cloud.",
      credentialUrl: "https://example.com/verify/aws",
    },
    {
      id: "c2",
      title: "Cert 2",
      issuer: "Meta Frontend Specialist",
      description: "Menunjukkan keahlian pengembangan antarmuka modern dengan React.",
      credentialUrl: "https://example.com/verify/meta",
    },
    {
      id: "c3",
      title: "Cert 3",
      issuer: "Google Cloud Associate",
      description: "Menunjukkan pemahaman layanan inti Google Cloud.",
    },
  ],

  experiences: [
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
  ],
};
