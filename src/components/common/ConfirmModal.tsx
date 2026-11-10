import type { FC, ReactNode } from "react";
import { AlertTriangle, X } from "lucide-react";
import { NeoButton } from "./NeoButton";

/**
 * Komponen ConfirmModal (Neo-Brutalism Modal Dialog)
 * 
 * Menggantikan dialog bawaan browser `window.confirm()` yang terlihat kuno.
 * Fitur:
 * - Backdrop semi-transparan dengan efek blur halus.
 * - Bingkai tebal `border-2 border-black` dan bayangan keras khas Neo-Brutalisme.
 * - Opsi konfirmasi tindakan berbahaya (Delete) dengan tombol warna merah/pink dan tombol batal.
 */

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  icon?: ReactNode;
}

export const ConfirmModal: FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = "YA, HAPUS SEKARANG",
  cancelLabel = "BATALKAN",
  onConfirm,
  onCancel,
  icon,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white border-2 border-black p-6 sm:p-8 shadow-neo-lg text-black font-sans">
        {/* Tombol Tutup Silang di Kanan Atas */}
        <button
          type="button"
          onClick={onCancel}
          className="absolute top-4 right-4 p-1.5 border-2 border-black bg-white hover:bg-neutral-100 shadow-neo-sm active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer"
          aria-label="Tutup dialog"
        >
          <X className="w-4 h-4 stroke-[3]" />
        </button>

        {/* Ikon Peringatan */}
        <div className="w-12 h-12 bg-[#fb7185] border-2 border-black flex items-center justify-center mb-5 shadow-neo-sm">
          {icon || <AlertTriangle className="w-6 h-6 text-black stroke-[2.5]" />}
        </div>

        {/* Judul & Pesan Penjelasan */}
        <h3 className="font-mono text-lg font-black uppercase tracking-tight mb-2">
          {title}
        </h3>
        <p className="font-mono text-xs text-neutral-700 leading-relaxed mb-8">
          {message}
        </p>

        {/* Tombol Aksi Batal & Konfirmasi */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-4 border-t-2 border-dashed border-neutral-300">
          <NeoButton
            type="button"
            variant="white"
            size="sm"
            onClick={onCancel}
            className="w-full sm:w-auto"
          >
            <span>{cancelLabel}</span>
          </NeoButton>

          <NeoButton
            type="button"
            variant="pink"
            size="sm"
            onClick={onConfirm}
            className="w-full sm:w-auto"
          >
            <span>{confirmLabel}</span>
          </NeoButton>
        </div>
      </div>
    </div>
  );
};

