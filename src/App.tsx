import type { FC } from "react";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { HeroSection } from "./components/home/HeroSection";
import { SkillsBanner } from "./components/home/SkillsBanner";
import { ProjectsAndCertifications } from "./components/home/ProjectsAndCertifications";
import { ExperienceAndCta } from "./components/home/ExperienceAndCta";

// Impor data tiruan yang sesuai dengan interface TypeScript
import {
  mockProfile,
  mockSkills,
  mockProjects,
  mockCertifications,
  mockExperiences,
} from "./data/mockData";

/**
 * Komponen Utama (Root App)
 * 
 * Mengatur tata letak halaman secara keseluruhan:
 * 1. Kontainer pembungkus dengan bingkai garis tepi kontras (Neo-Brutalist)
 * 2. Navigasi atas yang menempel (Sticky Navbar)
 * 3. Hero Section (Foto profil & bio)
 * 4. Skills Banner (Daftar teknologi horizontal)
 * 5. Projects & Certifications (Carousel proyek & tumpukan sertifikasi)
 * 6. Experience Timeline & Kontak CTA
 * 7. Footer bawah
 */

const App: FC = () => {
  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col justify-between selection:bg-[#bef264] selection:text-black">
      {/* Pembungkus luar untuk menjaga bingkai khas Neo-Brutalism */}
      <div className="w-full max-w-7xl mx-auto border-x-2 border-black bg-white flex flex-col my-0 sm:my-6 shadow-neo-lg">
        {/* Navigasi Atas */}
        <Navbar />

        {/* Bagian Konten Utama */}
        <main className="flex-1 flex flex-col">
          {/* 1. Hero */}
          <HeroSection profile={mockProfile} />

          {/* 2. Banner Keahlian */}
          <SkillsBanner skills={mockSkills} />

          {/* 3. Proyek Pilihan & Sertifikasi */}
          <ProjectsAndCertifications
            projects={mockProjects}
            certifications={mockCertifications}
          />

          {/* 4. Timeline Pengalaman & Ajakan Kerjasama */}
          <ExperienceAndCta experiences={mockExperiences} />
        </main>

        {/* Footer Bawah */}
        <Footer />
      </div>
    </div>
  );
};

export default App;
