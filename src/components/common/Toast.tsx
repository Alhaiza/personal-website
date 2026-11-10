import { useState, type ReactNode, type FC } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { ToastContext, type ToastMessage, type ToastType } from "./toastContext";

/**
 * Komponen ToastProvider (Neo-Brutalism Toast Notification System)
 * 
 * Fitur:
 * 1. Global Context: Memungkinkan komponen mana pun (form dashboard, tombol hapus, dll.)
 *    memanggil notifikasi dengan satu baris: `toast.success("Data berhasil disimpan!")`.
 * 2. Gaya Neo-Brutalism: Menggunakan garis tepi hitam tebal (`border-2 border-black`),
 *    bayangan keras (`shadow-neo-lg`), warna kontras (Lime `#bef264` untuk sukses, Pink `#fb7185` untuk error).
 * 3. Otomatis Menghilang (Auto-dismiss): Notifikasi otomatis terhapus setelah 4 detik,
 *    atau dapat ditutup manual menggunakan tombol silang (X).
 * 4. Posisi Ergonomis: Mengambang di sudut kanan bawah (`bottom-6 right-6 z-50`).
 */
export const ToastProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Fungsi internal untuk menghapus toast berdasarkan ID
  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Fungsi utama untuk memicu toast
  const showToast = (message: string, type: ToastType = "success", title?: string) => {
    const id = crypto.randomUUID();
    const newToast: ToastMessage = { id, type, title, message };

    setToasts((prev) => [...prev, newToast]);

    // Timer penghitung mundur agar toast hilang otomatis setelah 4 detik
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const success = (message: string, title?: string) => showToast(message, "success", title || "SUCCESS!");
  const error = (message: string, title?: string) => showToast(message, "error", title || "ERROR!");
  const info = (message: string, title?: string) => showToast(message, "info", title || "INFO");

  return (
    <ToastContext.Provider value={{ showToast, success, error, info }}>
      {children}

      {/* Wadah Mengambang Toast di Pojok Kanan Bawah */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        {toasts.map((toast) => {
          // Penentuan warna latar dan ikon sesuai tipe notifikasi
          const bgStyle =
            toast.type === "success"
              ? "bg-[#bef264] text-black"
              : toast.type === "error"
              ? "bg-[#fb7185] text-black"
              : "bg-[#60a5fa] text-black";

          const IconComponent =
            toast.type === "success"
              ? CheckCircle2
              : toast.type === "error"
              ? AlertCircle
              : Info;

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto border-2 border-black p-4 shadow-neo-lg flex items-start gap-3 transition-all duration-200 animate-in slide-in-from-bottom-5 ${bgStyle}`}
              role="alert"
            >
              <IconComponent className="w-5 h-5 shrink-0 mt-0.5 stroke-[2.5]" />

              <div className="flex-1 min-w-0">
                {toast.title && (
                  <h4 className="font-mono text-xs font-black uppercase tracking-wider mb-0.5">
                    {toast.title}
                  </h4>
                )}
                <p className="font-mono text-xs leading-relaxed font-bold break-words">
                  {toast.message}
                </p>
              </div>

              {/* Tombol Tutup Manual */}
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="p-1 border border-black bg-white hover:bg-neutral-100 shadow-neo-sm active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer shrink-0"
                aria-label="Tutup notifikasi"
              >
                <X className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};
