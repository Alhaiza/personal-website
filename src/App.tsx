import type { FC } from "react";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { HeroSection } from "./components/home/HeroSection";
import { SkillsBanner } from "./components/home/SkillsBanner";
import { ProjectsAndCertifications } from "./components/home/ProjectsAndCertifications";
import { ExperienceAndCta } from "./components/home/ExperienceAndCta";

// Import structured mock data matching our TypeScript interfaces
import {
  mockProfile,
  mockSkills,
  mockProjects,
  mockCertifications,
  mockExperiences,
} from "./data/mockData";

/**
 * App Root Component
 * 
 * Orchestrates the full-page layout:
 * 1. Background wrapping container with high-contrast borders
 * 2. Sticky Neo-Brutalist Navbar
 * 3. Hero Section (Split portrait & bio)
 * 4. Skills Banner (Horizontal marquee-style tech stack list)
 * 5. Projects & Certifications (Interactive project showcase + certification stack)
 * 6. Career Experience Timeline & Call to Action
 * 7. Footer
 */

const App: FC = () => {
  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col justify-between selection:bg-[#bef264] selection:text-black">
      {/* Outer Border Wrapper to maintain the crisp neo-brutalist framed border */}
      <div className="w-full max-w-7xl mx-auto border-x-2 border-black bg-white flex flex-col my-0 sm:my-6 shadow-neo-lg">
        {/* Top Navigation */}
        <Navbar />

        {/* Main Content Sections */}
        <main className="flex-1 flex flex-col">
          {/* 1. Hero */}
          <HeroSection profile={mockProfile} />

          {/* 2. Skills Banner */}
          <SkillsBanner skills={mockSkills} />

          {/* 3. Featured Projects & Certifications */}
          <ProjectsAndCertifications
            projects={mockProjects}
            certifications={mockCertifications}
          />

          {/* 4. Experience Timeline & Contact CTA */}
          <ExperienceAndCta experiences={mockExperiences} />
        </main>

        {/* Bottom Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default App;
