import type { FC } from "react";
import { HeroSection } from "../components/home/HeroSection";
import { SkillsBanner } from "../components/home/SkillsBanner";
import { ProjectsAndCertifications } from "../components/home/ProjectsAndCertifications";
import { ExperienceAndCta } from "../components/home/ExperienceAndCta";

import {
  mockProfile,
  mockSkills,
  mockProjects,
  mockCertifications,
  mockExperiences,
} from "../data/mockData";

/**
 * Komponen Halaman Beranda (`/`)
 * 
 * Merender pengalaman lengkap landing page portofolio yang memadukan:
 * 1. HeroSection berisi bio & kartu kode
 * 2. SkillsBanner berisi ikhtisar teknologi yang dikuasai
 * 3. Carousel proyek unggulan & pratinjau sertifikasi
 * 4. Timeline pengalaman kerja & ajakan kontak (CTA)
 */

export const Home: FC = () => {
  return (
    <>
      <HeroSection profile={mockProfile} />
      <SkillsBanner skills={mockSkills} />
      <ProjectsAndCertifications
        projects={mockProjects}
        certifications={mockCertifications}
      />
      <ExperienceAndCta experiences={mockExperiences} />
    </>
  );
};
