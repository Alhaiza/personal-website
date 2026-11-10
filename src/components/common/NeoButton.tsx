import type { FC, ButtonHTMLAttributes, ReactNode } from "react";

/**
 * NeoButton Component
 * 
 * Implements the signature Neo-Brutalist button design:
 * - High contrast border (border-2 border-black)
 * - Hard bottom-right shadow (shadow-neo)
 * - Push-down tactile click animation (active:translate-x-0.5 active:translate-y-0.5 active:shadow-none)
 * - Uppercase bold typography
 */

export interface NeoButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "lime" | "purple" | "white" | "pink";
  size?: "sm" | "md" | "lg";
  className?: string;
  href?: string;
}

export const NeoButton: FC<NeoButtonProps> = ({
  children,
  variant = "white",
  size = "md",
  className = "",
  href,
  ...props
}) => {
  // Variant colors matched from the Figma/UI design
  const variantStyles = {
    lime: "bg-[#bef264] text-black hover:bg-[#a3e635]",
    purple: "bg-[#6366f1] text-white hover:bg-[#4f46e5]",
    white: "bg-white text-black hover:bg-neutral-50",
    pink: "bg-[#fb7185] text-black hover:bg-[#f43f5e]",
  };

  // Size padding adjustments
  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs font-bold",
    md: "px-5 py-2.5 text-xs font-black tracking-wider uppercase",
    lg: "px-7 py-3.5 text-sm font-black tracking-wider uppercase",
  };

  // Base Neo-Brutalist interactive classes
  const baseClasses = `
    inline-flex items-center justify-center gap-2
    border-2 border-black
    shadow-neo
    transition-all duration-100
    hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-neo-lg
    active:translate-x-0.5 active:translate-y-0.5 active:shadow-none
    cursor-pointer select-none
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${className}
  `.trim();

  // If an `href` prop is provided, render as an anchor link <a>, otherwise a standard <button>
  if (href) {
    return (
      <a href={href} className={baseClasses}>
        {children}
      </a>
    );
  }

  return (
    <button className={baseClasses} {...props}>
      {children}
    </button>
  );
};

