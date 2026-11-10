import type { FC } from "react";
import { HeroSection } from "../components/home/HeroSection";
import { SkillsBanner } from "../components/home/SkillsBanner";
import { ProjectsAndCertifications } from "../components/home/ProjectsAndCertifications";
import { ExperienceAndCta } from "../components/home/ExperienceAndCta";

/**
 * Komponen Halaman Beranda (`/`)
 * 
 * Sepenuhnya dinamis menggunakan data dari `SiteContentContext`.
 * Komponen anak (HeroSection, SkillsBanner, ProjectsAndCertifications, ExperienceAndCta)
 * langsung membaca data terpusat secara konsisten.
 */

export const Home: FC = () => {
  return (
    <>
      <HeroSection />
      <SkillsBanner />
      <ProjectsAndCertifications />
      <ExperienceAndCta />
    </>
  );
};
