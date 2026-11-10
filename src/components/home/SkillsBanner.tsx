import type { FC } from "react";
import { ArrowRight } from "lucide-react";
import type { SkillItem } from "../../types";

/**
 * SkillsBanner Component
 * 
 * Displays the horizontal skills strip below the hero:
 * - Purple left badge: "SKILLS ->"
 * - Clean grid with icons and skill names (React, TypeScript, Node.js, Tailwind CSS, MongoDB, Git)
 * - Separated by solid black 2px borders
 */

interface SkillsBannerProps {
  skills: SkillItem[];
}

export const SkillsBanner: FC<SkillsBannerProps> = ({ skills }) => {
  return (
    <section id="skills" className="w-full bg-white border-b-2 border-black flex flex-col sm:flex-row items-stretch">
      {/* Left Purple Badge */}
      <div className="bg-[#6366f1] text-white border-b-2 sm:border-b-0 sm:border-r-2 border-black px-6 py-4 flex items-center justify-between sm:justify-center gap-3 select-none">
        <span className="font-black text-sm uppercase tracking-wider">SKILLS</span>
        <ArrowRight className="w-4 h-4 stroke-[3]" />
      </div>

      {/* Right List of Tech Stack Badges */}
      <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 divide-y-2 sm:divide-y-0 sm:divide-x-2 divide-black">
        {skills.map((skill) => (
          <div
            key={skill.id}
            className="flex flex-col items-center justify-center p-4 hover:bg-neutral-50 transition-colors group cursor-default"
          >
            {/* Minimal SVG Badges for Tech Icons */}
            <div className="w-8 h-8 mb-2 flex items-center justify-center text-black group-hover:scale-110 transition-transform">
              {skill.iconType === "react" && (
                <svg className="w-7 h-7" viewBox="-11.5 -10.23174 23 20.46348">
                  <circle cx="0" cy="0" r="2.05" fill="currentColor"/>
                  <g stroke="currentColor" strokeWidth="1" fill="none">
                    <ellipse rx="11" ry="4.2"/>
                    <ellipse rx="11" ry="4.2" transform="rotate(60)"/>
                    <ellipse rx="11" ry="4.2" transform="rotate(120)"/>
                  </g>
                </svg>
              )}

              {skill.iconType === "typescript" && (
                <div className="w-6 h-6 bg-black text-white rounded-xs font-mono font-black text-xs flex items-center justify-center">
                  TS
                </div>
              )}

              {skill.iconType === "nodejs" && (
                <div className="border border-black rounded px-1 font-mono text-[10px] font-bold">
                  JS
                </div>
              )}

              {skill.iconType === "tailwind" && (
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z"/>
                </svg>
              )}

              {skill.iconType === "mongodb" && (
                <div className="w-5 h-7 border-2 border-black rounded-full flex items-center justify-center font-mono text-[9px] font-black">
                  M
                </div>
              )}

              {skill.iconType === "git" && (
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M2.6 10.59L8.38 4.8a1.69 1.69 0 0 1 2.4 0l1.9 1.9-2.38 2.39a1.69 1.69 0 0 0-.48 1.48L7.8 12.59a1.69 1.69 0 1 0 1.2 1.19l1.9-1.9a1.69 1.69 0 0 0 1.48-.48l2.39-2.38 4.63 4.63a1.69 1.69 0 0 1 0 2.4l-5.78 5.79a1.69 1.69 0 0 1-2.4 0L2.6 13a1.69 1.69 0 0 1 0-2.41z"/>
                </svg>
              )}
            </div>

            {/* Label */}
            <span className="font-mono text-xs font-bold text-black tracking-tight">
              {skill.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

