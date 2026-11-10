import type { FC, ButtonHTMLAttributes, ReactNode } from "react";
import { Link } from "react-router-dom";

/**
 * Komponen NeoButton
 * 
 * Mendukung navigasi SPA internal (`to="/projects"`)
 * maupun tautan eksternal/berkas unduhan (`href="https://..."` atau `href="/resume.pdf"`).
 * 
 * Mengapa dibuat seperti ini:
 * - Saat prop `to` diberikan, komponen memakai `<Link>` dari React Router agar browser tidak melakukan reload halaman penuh.
 * - Saat prop `href` diberikan, komponen beralih ke tag standar `<a>` untuk berkas luar atau unduhan.
 * - Jika keduanya tidak ada, komponen akan dirender sebagai elemen `<button>` interaktif biasa.
 */

export interface NeoButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "lime" | "purple" | "white" | "pink";
  size?: "sm" | "md" | "lg";
  className?: string;
  href?: string;
  to?: string; // Target rute internal React Router SPA
}

export const NeoButton: FC<NeoButtonProps> = ({
  children,
  variant = "white",
  size = "md",
  className = "",
  href,
  to,
  ...props
}) => {
  // Pilihan warna sesuai desain UI Neo-Brutalism
  const variantStyles = {
    lime: "bg-[#bef264] text-black hover:bg-[#a3e635]",
    purple: "bg-[#6366f1] text-white hover:bg-[#4f46e5]",
    white: "bg-white text-black hover:bg-neutral-50",
    pink: "bg-[#fb7185] text-black hover:bg-[#f43f5e]",
  };

  // Pilihan ukuran tombol
  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs font-bold",
    md: "px-5 py-2.5 text-xs font-black tracking-wider uppercase",
    lg: "px-7 py-3.5 text-sm font-black tracking-wider uppercase",
  };

  // Class dasar Tailwind untuk efek fisik taktil & hard shadow
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

  // 1. Navigasi SPA internal menggunakan Link dari react-router-dom
  if (to) {
    return (
      <Link to={to} className={baseClasses}>
        {children}
      </Link>
    );
  }

  // 2. Tautan eksternal atau unduhan file menggunakan tag anchor <a>
  if (href) {
    return (
      <a href={href} className={baseClasses}>
        {children}
      </a>
    );
  }

  // 3. Tombol aksi biasa
  return (
    <button className={baseClasses} {...props}>
      {children}
    </button>
  );
};
