import type { FC } from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

/**
 * Komponen RootLayout
 * 
 * Apa fungsi `<Outlet />`?
 * Di React Router, `<Outlet />` bertindak sebagai tempat penampung (slot) dinamis
 * di mana komponen halaman anak (seperti Home, Projects, Certifications, atau Contact) akan dirender.
 * 
 * Manfaat menggunakan Root Layout:
 * - UI Tetap Persisten: Navbar dan Footer tetap terpasang dan tidak di-render ulang saat berganti rute.
 * - Penataan Terpusat: Bingkai tepi, ukuran maksimum kontainer, dan background halaman hanya perlu diatur sekali di sini.
 */

export const RootLayout: FC = () => {
  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col justify-between selection:bg-[#bef264] selection:text-black">
      {/* Kontainer Bingkai Gaya Neo-Brutalism */}
      <div className="w-full max-w-7xl mx-auto border-x-2 border-black bg-white flex flex-col my-0 sm:my-6 shadow-neo-lg flex-1">
        {/* Navigasi Atas yang Persisten */}
        <Navbar />

        {/* Slot Konten Halaman Dinamis */}
        <main className="flex-1 flex flex-col">
          <Outlet />
        </main>

        {/* Footer Bawah yang Persisten */}
        <Footer />
      </div>
    </div>
  );
};
