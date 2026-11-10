import { createContext, useContext } from "react";
import type { SiteContent } from "../types";

/**
 * Konteks isi situs (bagian "definisi").
 *
 * Context adalah "papan pengumuman" yang bisa dibaca komponen mana pun di dalam
 * <SiteContentProvider>, tanpa mengoper props berlapis-lapis (prop drilling).
 * Halaman publik MEMBACA `content`, dashboard admin MENULIS lewat `updateContent`.
 * Karena keduanya memakai data yang sama, perubahan di admin langsung terlihat di publik.
 *
 * File ini dipisah dari komponen Provider agar lolos aturan lint
 * `react-refresh/only-export-components` (satu file = komponen saja, atau non-komponen saja).
 */
export interface SiteContentContextType {
  content: SiteContent;
  /**
   * Memperbarui satu atau beberapa bagian isi situs sekaligus.
   * Contoh: updateContent({ projects: [...] }) hanya mengganti daftar proyek,
   * bagian lain tidak tersentuh.
   */
  updateContent: (patch: Partial<SiteContent>) => void;
}

export const SiteContentContext = createContext<SiteContentContextType | undefined>(undefined);

// Hook kustom: cara singkat & aman untuk membaca konteks di komponen mana pun.
export const useSiteContent = (): SiteContentContextType => {
  const context = useContext(SiteContentContext);
  if (!context) {
    throw new Error("useSiteContent harus dipakai di dalam <SiteContentProvider>");
  }
  return context;
};

