import { createContext, useContext } from "react";

/**
 * Tipe Data Notifikasi Toast
 */
export type ToastType = "success" | "error" | "info";

export interface ToastMessage {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
}

export interface ToastContextType {
  showToast: (message: string, type?: ToastType, title?: string) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

/**
 * Hook Pembantu: `useToast`
 * 
 * Digunakan untuk menampilkan feedback visual Toast bergaya Neo-Brutalism.
 * ```tsx
 * const toast = useToast();
 * toast.success("Perubahan berhasil disimpan!");
 * toast.error("Gagal terhubung ke database.");
 * ```
 */
export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast harus digunakan di dalam <ToastProvider>");
  }
  return context;
};

