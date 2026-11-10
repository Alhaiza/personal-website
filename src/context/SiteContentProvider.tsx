import { useEffect, useRef, useState, type FC, type ReactNode } from "react";
import { mockSiteContent } from "../data/mockData";
import type {
  CertificationItem,
  ContactSettings,
  ExperienceItem,
  ProjectItem,
  SiteContent,
  SiteSettings,
  SkillItem,
  UserProfile,
} from "../types";
import { SiteContentContext } from "./siteContentContext";

/**
 * Komponen SiteContentProvider
 *
 * Menyimpan SELURUH isi situs di state React DAN di `localStorage` browser:
 * - State        : membuat komponen otomatis tampil ulang saat isi berubah.
 * - localStorage : data tidak hilang saat refresh, dan terbaca juga oleh tab lain.
 * - Event `storage`: jika admin menyimpan di satu tab, tab publik yang sudah terbuka ikut ter-update.
 *
 * CATATAN: ini pengganti sementara. Saat Firestore siap, cukup ganti cara membaca
 * (`readStoredContent`) dan menyimpan (`persist`). Komponen yang memakai
 * `useSiteContent()` tidak perlu diubah sama sekali.
 */

const STORAGE_KEY = "site-content";
// Kunci lama (versi sebelumnya hanya menyimpan pengaturan). Dibaca sekali agar data lama tidak hilang.
const LEGACY_KEY = "site-settings";

// Bentuk data yang mungkin tersimpan: semua bagian opsional karena bisa saja belum ada / sebagian.
interface StoredContent {
  settings?: Partial<SiteSettings>;
  profile?: Partial<UserProfile>;
  contact?: Partial<ContactSettings>;
  skills?: SkillItem[];
  projects?: ProjectItem[];
  certifications?: CertificationItem[];
  experiences?: ExperienceItem[];
}

/**
 * Membaca data tersimpan lalu menggabungkannya dengan data cadangan:
 * - Objek (settings, profile, contact): digabung per field, jadi field baru yang belum
 *   tersimpan tetap punya nilai bawaan.
 * - Array (skills, projects, dst.): dipakai apa adanya jika berupa array, kalau tidak pakai cadangan.
 */
const readStoredContent = (): SiteContent => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const legacy = localStorage.getItem(LEGACY_KEY);
    if (!raw && !legacy) return mockSiteContent;

    const stored: StoredContent = raw
      ? (JSON.parse(raw) as StoredContent)
      : { settings: JSON.parse(legacy as string) as Partial<SiteSettings> };

    return {
      settings: { ...mockSiteContent.settings, ...stored.settings },
      profile: { ...mockSiteContent.profile, ...stored.profile },
      contact: { ...mockSiteContent.contact, ...stored.contact },
      skills: Array.isArray(stored.skills) ? stored.skills : mockSiteContent.skills,
      projects: Array.isArray(stored.projects) ? stored.projects : mockSiteContent.projects,
      certifications: Array.isArray(stored.certifications)
        ? stored.certifications
        : mockSiteContent.certifications,
      experiences: Array.isArray(stored.experiences) ? stored.experiences : mockSiteContent.experiences,
    };
  } catch {
    return mockSiteContent; // JSON rusak atau localStorage diblokir
  }
};

const persist = (content: SiteContent) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
  } catch {
    // Abaikan jika penyimpanan penuh/diblokir; state tetap berlaku selama sesi
  }
};

export const SiteContentProvider: FC<{ children: ReactNode }> = ({ children }) => {
  // Fungsi di useState dijalankan SEKALI saja saat pertama dirender (lazy initial state)
  const [content, setContent] = useState<SiteContent>(readStoredContent);

  // useRef menyimpan nilai terbaru tanpa memicu render ulang. Dipakai agar dua pembaruan
  // beruntun tidak saling menimpa (menghindari "stale closure").
  const contentRef = useRef<SiteContent>(content);

  // Mendengarkan perubahan localStorage dari TAB LAIN
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return;
      const next = readStoredContent();
      contentRef.current = next;
      setContent(next);
    };
    window.addEventListener("storage", handleStorage);
    // Cleanup: lepaskan pendengar saat komponen dilepas agar tidak bocor memori
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const updateContent = (patch: Partial<SiteContent>) => {
    // Salin objek lama + timpa bagian yang berubah (state TIDAK boleh diubah langsung / mutasi)
    const next = { ...contentRef.current, ...patch };
    contentRef.current = next;
    setContent(next);
    persist(next);
  };

  return (
    <SiteContentContext.Provider value={{ content, updateContent }}>
      {children}
    </SiteContentContext.Provider>
  );
};

