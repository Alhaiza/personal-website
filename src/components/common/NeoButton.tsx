import type { FC, ButtonHTMLAttributes, ReactNode } from "react";

/**
 * Komponen NeoButton
 * 
 * Mengimplementasikan gaya tombol Neo-Brutalism:
 * - Garis tepi hitam tegas (border-2 border-black)
 * - Bayangan keras di sudut kanan-bawah (shadow-neo)
 * - Efek tekan interaktif saat diklik (active:translate-x-0.5 active:translate-y-0.5 active:shadow-none)
 * - Huruf kapital tebal (uppercase font-black)
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
  // Pilihan warna tombol yang diambil langsung dari desain UI Figma
  const variantStyles = {
    lime: "bg-[#bef264] text-black hover:bg-[#a3e635]",
    purple: "bg-[#6366f1] text-white hover:bg-[#4f46e5]",
    white: "bg-white text-black hover:bg-neutral-50",
    pink: "bg-[#fb7185] text-black hover:bg-[#f43f5e]",
  };

  // Pilihan ukuran padding dan ukuran font tombol
  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs font-bold",
    md: "px-5 py-2.5 text-xs font-black tracking-wider uppercase",
    lg: "px-7 py-3.5 text-sm font-black tracking-wider uppercase",
  };

  // Kumpulan class Tailwind utama untuk efek Neo-Brutalist
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

  // Jika properti `href` diberikan, render elemen sebagai tag tautan <a>, jika tidak render sebagai <button>
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
