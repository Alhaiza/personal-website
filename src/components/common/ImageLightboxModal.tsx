import { useEffect, type FC } from "react";
import { X, ZoomIn, ExternalLink } from "lucide-react";

/**
 * Komponen ImageLightboxModal (Neo-Brutalism Image Preview Lightbox)
 * 
 * Menampilkan pratinjau resolusi penuh dari gambar proyek saat diklik.
 * Fitur:
 * - Menutup dengan tombol X, klik backdrop, atau menekan tombol ESC keyboard.
 * - Desain Neo-Brutalisme dengan border hitam tegas, bayangan keras, dan label nama proyek.
 */

interface ImageLightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title: string;
  projectUrl?: string;
}

export const ImageLightboxModal: FC<ImageLightboxModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  title,
  projectUrl,
}) => {
  // Tangani penekanan tombol ESC untuk menutup modal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    // Kunci scroll body saat modal terbuka
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !imageUrl) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Preview ${title}`}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-10 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 cursor-zoom-out"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-5xl w-full max-h-[92vh] flex flex-col bg-white border-4 border-black shadow-neo-lg text-black font-sans cursor-default animate-in zoom-in-95 duration-200 overflow-hidden"
      >
        {/* Header Bar Lightbox */}
        <div className="flex items-center justify-between gap-3 px-4 py-3 bg-[#bef264] border-b-2 border-black">
          <div className="flex items-center gap-2 min-w-0">
            <ZoomIn className="w-4 h-4 shrink-0 text-black stroke-[3]" />
            <h3 className="font-black text-xs sm:text-sm uppercase tracking-wider truncate">
              {title}
            </h3>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {projectUrl && (
              <a
                href={projectUrl}
                target="_blank"
                rel="noreferrer"
                className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-neutral-100 border border-black text-[11px] font-mono font-bold uppercase shadow-neo-sm"
              >
                <span>OPEN DEMO</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}

            <button
              type="button"
              onClick={onClose}
              aria-label="Close preview"
              className="p-1 border-2 border-black bg-white hover:bg-[#fb7185] active:translate-x-0.5 active:translate-y-0.5 shadow-neo-sm transition cursor-pointer"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Gambar Resolusi Penuh */}
        <div className="relative flex-1 bg-neutral-900 overflow-auto p-2 sm:p-4 flex items-center justify-center min-h-[300px]">
          <img
            src={imageUrl}
            alt={title}
            className="max-w-full max-h-[75vh] w-auto h-auto object-contain border-2 border-black shadow-neo bg-white"
          />
        </div>

        {/* Footer Bar Keterangan */}
        <div className="px-4 py-2 bg-neutral-100 border-t-2 border-black flex items-center justify-between text-[11px] font-mono text-neutral-600">
          <span className="truncate">Click outside or press <strong>ESC</strong> to close</span>
          <span className="hidden sm:inline font-bold uppercase text-black">High-Resolution Preview</span>
        </div>
      </div>
    </div>
  );
};
