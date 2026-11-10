import type { FC } from "react";
import { ArrowLeft } from "lucide-react";
import { NeoButton } from "../components/common/NeoButton";

/**
 * Komponen NotFound (Halaman 404)
 * 
 * Menangani rute liar / tidak terdaftar (`path="*"`) sehingga pengunjung tidak melihat
 * layar kosong atau error putih saat salah mengetik alamat URL.
 */

export const NotFound: FC = () => {
  return (
    <div className="w-full bg-[#fb7185] p-12 flex-1 flex flex-col items-center justify-center text-center">
      <div className="bg-white border-2 border-black p-8 sm:p-12 shadow-neo-lg max-w-lg w-full">
        <span className="font-mono text-5xl sm:text-7xl font-black text-black block mb-4">
          404
        </span>
        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black mb-2">
          HALAMAN TIDAK DITEMUKAN
        </h1>
        <p className="font-mono text-xs sm:text-sm text-neutral-600 mb-8">
          Halaman yang Anda tuju tidak tersedia atau telah dipindahkan ke alamat lain.
        </p>

        <NeoButton to="/" variant="lime" size="md">
          <ArrowLeft className="w-4 h-4 stroke-[3]" />
          <span>KEMBALI KE BERANDA</span>
        </NeoButton>
      </div>
    </div>
  );
};
