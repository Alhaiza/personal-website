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
    {
      id: "s1",
      name: "React",
      iconType: "react",
      svgCode: `<svg viewBox="-11.5 -10.23174 23 20.46348" fill="currentColor"><circle cx="0" cy="0" r="2.05"/><g stroke="currentColor" stroke-width="1" fill="none"><ellipse rx="11" ry="4.2"/><ellipse rx="11" ry="4.2" transform="rotate(60)"/><ellipse rx="11" ry="4.2" transform="rotate(120)"/></g></svg>`,
    },
    {
      id: "s2",
      name: "TypeScript",
      iconType: "typescript",
      svgCode: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.027-.819.08a1.69 1.69 0 0 0-.66.262c-.18.13-.319.303-.417.519-.098.216-.147.477-.147.783 0 .348.077.637.23.867.153.23.364.428.633.593.269.165.59.313.963.444.373.131.78.267 1.22.408.572.184 1.077.404 1.515.66.438.256.804.562 1.098.918.294.356.51.767.649 1.233.139.466.208.997.208 1.593 0 .76-.137 1.436-.411 2.029a4.267 4.267 0 0 1-1.154 1.503c-.496.385-1.111.673-1.846.865a8.777 8.777 0 0 1-2.316.288c-.696 0-1.393-.064-2.091-.192a8.55 8.55 0 0 1-1.84-.572v-2.61c.64.398 1.314.707 2.022.926.708.219 1.405.328 2.091.328.618 0 1.127-.087 1.527-.26.4-.173.705-.398.915-.674.21-.276.315-.595.315-.957 0-.394-.092-.72-.276-.979a2.766 2.766 0 0 0-.743-.687 6.47 6.47 0 0 0-1.074-.509c-.432-.158-.902-.329-1.41-.513-.564-.204-1.058-.444-1.482-.72a3.81 3.81 0 0 1-1.066-.99 4.148 4.148 0 0 1-.617-1.312 5.568 5.568 0 0 1-.194-1.547c0-.733.135-1.383.404-1.95.27-.567.65-1.042 1.141-1.425.492-.383 1.085-.671 1.78-.865.696-.194 1.479-.291 2.35-.291zm-10.274.225v2.308H5.067v10.38h-2.85V12.283H0V9.975h8.214z"/></svg>`,
    },
    {
      id: "s3",
      name: "Node.js",
      iconType: "nodejs",
      svgCode: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0L1.6 6v12L12 24l10.4-6V6L12 0zm0 2.3l8.4 4.85v9.7L12 21.7 3.6 16.85v-9.7L12 2.3z"/></svg>`,
    },
    {
      id: "s4",
      name: "Tailwind CSS",
      iconType: "tailwind",
      svgCode: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z"/></svg>`,
    },
    {
      id: "s5",
      name: "PostgreSQL",
      iconType: "mongodb",
      svgCode: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z"/></svg>`,
    },
    {
      id: "s6",
      name: "Git",
      iconType: "git",
      svgCode: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M2.6 10.59L8.38 4.8a1.69 1.69 0 0 1 2.4 0l1.9 1.9-2.38 2.39a1.69 1.69 0 0 0-.48 1.48L7.8 12.59a1.69 1.69 0 1 0 1.2 1.19l1.9-1.9a1.69 1.69 0 0 0 1.48-.48l2.39-2.38 4.63 4.63a1.69 1.69 0 0 1 0 2.4l-5.78 5.79a1.69 1.69 0 0 1-2.4 0L2.6 13a1.69 1.69 0 0 1 0-2.41z"/></svg>`,
    },
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
