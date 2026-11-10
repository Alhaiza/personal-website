import { useState, type FC } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { NeoButton } from "../common/NeoButton";
import type { ProjectItem, CertificationItem } from "../../types";

/**
 * ProjectsAndCertifications Component
 * 
 * Slices the 2-column section:
 * - Left (70%): FEATURED PROJECTS
 *   - Header with VIEW ALL PROJECTS button and carousel arrows < >
 *   - Project Card with high-contrast illustrated graphic, tags, and VIEW DETAILS button
 *   - Carousel indicators (dots)
 * - Right (30%): CERTIFICATIONS
 *   - Lime background (#bef264)
 *   - 3 Stacked Certification cards with hard shadows (Cert 1, Cert 2, Cert 3)
 *   - VIEW ALL CERTIFICATIONS bottom button
 */

interface ProjectsAndCertificationsProps {
  projects: ProjectItem[];
  certifications: CertificationItem[];
}

export const ProjectsAndCertifications: FC<ProjectsAndCertificationsProps> = ({
  projects,
  certifications,
}) => {
  // State to handle project carousel index
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? projects.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === projects.length - 1 ? 0 : prev + 1));
  };

  const currentProject = projects[currentIndex] || projects[0];

  return (
    <section id="projects" className="w-full grid grid-cols-1 lg:grid-cols-12 border-b-2 border-black">
      {/* ================= LEFT: FEATURED PROJECTS ================= */}
      <div className="lg:col-span-8 bg-white p-6 sm:p-10 border-b-2 lg:border-b-0 lg:border-r-2 border-black flex flex-col justify-between">
        <div>
          {/* Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-black">
              FEATURED PROJECTS
            </h2>

            <div className="flex items-center gap-3">
              <NeoButton size="sm" variant="white" href="#all-projects">
                <span>VIEW ALL PROJECTS</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
              </NeoButton>

              {/* Prev / Next Carousel Controls */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="w-8 h-8 bg-[#fb7185] border-2 border-black flex items-center justify-center hover:bg-[#f43f5e] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
                  aria-label="Previous project"
                >
                  <ChevronLeft className="w-4 h-4 stroke-[3]" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="w-8 h-8 bg-[#fb7185] border-2 border-black flex items-center justify-center hover:bg-[#f43f5e] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
                  aria-label="Next project"
                >
                  <ChevronRight className="w-4 h-4 stroke-[3]" />
                </button>
              </div>
            </div>
          </div>

          {/* Project Showcase Card */}
          <div className="border-2 border-black p-4 sm:p-6 bg-white shadow-neo">
            {/* Illustrated / Graphic Banner Container */}
            <div className="border-2 border-black bg-[#fb7185] p-3 sm:p-4 mb-6">
              <div className="border-2 border-black bg-white overflow-hidden relative aspect-[16/9] flex items-center justify-center">
                {/* Neo-brutalist weather illustration mimicking the design */}
                <div className="relative w-full h-full bg-[#fef08a] flex items-center justify-center overflow-hidden">
                  {/* Sun */}
                  <div className="absolute top-4 left-12 w-24 h-24 rounded-full bg-[#f97316] border-4 border-black" />
                  
                  {/* Cloud Graphic */}
                  <div className="relative z-10 bg-[#60a5fa] border-4 border-black rounded-3xl p-6 flex items-center justify-center shadow-neo">
                    <span className="font-mono text-3xl sm:text-5xl font-black tracking-tighter text-black">
                      24°C
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Project Details */}
            <h3 className="text-xl font-black tracking-tight text-black uppercase mb-2">
              {currentProject.title}
            </h3>

            <p className="font-mono text-xs sm:text-sm text-neutral-700 leading-relaxed mb-6">
              {currentProject.description}
            </p>

            {/* Tag Pills */}
            <div className="flex flex-wrap gap-2 mb-6">
              {currentProject.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 text-[11px] font-mono font-bold bg-white border border-black shadow-neo-sm"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Bottom Button */}
            <NeoButton size="sm" variant="white" href={currentProject.detailsUrl || "#"}>
              <span>VIEW DETAILS</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
            </NeoButton>
          </div>
        </div>

        {/* Carousel Pagination Dots */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {projects.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={`w-2.5 h-2.5 rounded-full border border-black transition-all ${
                idx === currentIndex ? "bg-black w-3 h-3" : "bg-white"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* ================= RIGHT: CERTIFICATIONS ================= */}
      <div id="certifications" className="lg:col-span-4 bg-[#bef264] p-6 sm:p-8 flex flex-col justify-between">
        <div>
          <h2 className="text-lg font-black uppercase tracking-tight text-black mb-6">
            CERTIFICATIONS
          </h2>

          {/* Vertical Stack of Cert Cards */}
          <div className="space-y-4">
            {certifications.map((cert) => (
              <div
                key={cert.id}
                className="bg-neutral-200 border-2 border-black p-6 sm:p-8 text-center shadow-neo hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-neo-lg transition-all cursor-pointer"
              >
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-black">
                  {cert.title}
                </h3>
                {cert.issuer && (
                  <p className="font-mono text-xs text-neutral-600 mt-1">
                    {cert.issuer}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom View All Link */}
        <div className="mt-8">
          <NeoButton size="sm" variant="white" className="w-full" href="#all-certifications">
            <span>VIEW ALL CERTIFICATIONS</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
          </NeoButton>
        </div>
      </div>
    </section>
  );
};

