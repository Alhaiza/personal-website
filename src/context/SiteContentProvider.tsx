import { useEffect, useRef, useState, type FC, type ReactNode } from "react";
import { mockSiteContent } from "../data/mockData";
import {
  fetchFullSiteContent,
  updateSiteSettings,
  updateProfileData,
  updateContactSettings,
  saveProject,
  saveCertification,
  saveExperience,
  saveSkill,
} from "../services/firestoreService";
import type { SiteContent } from "../types";
import { SiteContentContext } from "./siteContentContext";

/**
 * Komponen SiteContentProvider (Terintegrasi Cloud Firestore)
 * 
 * Mekanisme Kerja:
 * 1. Initial State: Memulai render awal dengan `mockSiteContent` (tanpa loading screen yang mengganggu).
 * 2. Asynchronous Fetch: `useEffect` memanggil `fetchFullSiteContent()` dari Cloud Firestore di background
 *    dan memperbarui state secara halus ketika data telah diterima.
 * 3. Cache & Sync: Menyimpan backup data ke `localStorage` agar situs tetap instan dan tahan offline.
 * 4. Realtime Firestore Writes: Fungsi `updateContent` menyimpan pembaruan ke Firestore secara spesifik
 *    per dokumen/koleksi (settings, profile, contact, projects, certs, experiences, skills).
 */

const STORAGE_KEY = "site-content";

const readCachedContent = (): SiteContent => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return mockSiteContent;
    const parsed = JSON.parse(raw);
    return {
      settings: { ...mockSiteContent.settings, ...parsed.settings },
      profile: { ...mockSiteContent.profile, ...parsed.profile },
      contact: { ...mockSiteContent.contact, ...parsed.contact },
      skills: Array.isArray(parsed.skills) && parsed.skills.length > 0 ? parsed.skills : mockSiteContent.skills,
      projects: Array.isArray(parsed.projects) && parsed.projects.length > 0 ? parsed.projects : mockSiteContent.projects,
      certifications: Array.isArray(parsed.certifications) && parsed.certifications.length > 0 ? parsed.certifications : mockSiteContent.certifications,
      experiences: Array.isArray(parsed.experiences) && parsed.experiences.length > 0 ? parsed.experiences : mockSiteContent.experiences,
    };
  } catch {
    return mockSiteContent;
  }
};

const persistCache = (data: SiteContent) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Abaikan jika localStorage dibatasi
  }
};

export const SiteContentProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<SiteContent>(readCachedContent);
  const contentRef = useRef<SiteContent>(content);

  // Ambil data terbaru langsung dari Cloud Firestore saat aplikasi dimuat
  useEffect(() => {
    let isMounted = true;

    fetchFullSiteContent()
      .then((liveData) => {
        if (!isMounted) return;
        contentRef.current = liveData;
        setContent(liveData);
        persistCache(liveData);
      })
      .catch((err) => {
        console.warn("Menggunakan cache lokal karena Firestore offline:", err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Simpan data ke Firestore dan sinkronkan state lokal
  const updateContent = (patch: Partial<SiteContent>) => {
    const next: SiteContent = { ...contentRef.current, ...patch };
    contentRef.current = next;
    setContent(next);
    persistCache(next);

    // Kirim sinkronisasi spesifik ke Cloud Firestore
    if (patch.settings) {
      updateSiteSettings(patch.settings).catch((e) => console.error("Gagal sinkron settings ke Firestore:", e));
    }
    if (patch.profile) {
      updateProfileData(patch.profile).catch((e) => console.error("Gagal sinkron profile ke Firestore:", e));
    }
    if (patch.contact) {
      updateContactSettings(patch.contact).catch((e) => console.error("Gagal sinkron contact ke Firestore:", e));
    }
    if (patch.projects) {
      patch.projects.forEach((p) => saveProject(p).catch((e) => console.error("Gagal simpan project:", e)));
    }
    if (patch.certifications) {
      patch.certifications.forEach((c) => saveCertification(c).catch((e) => console.error("Gagal simpan cert:", e)));
    }
    if (patch.experiences) {
      patch.experiences.forEach((exp) => saveExperience(exp).catch((e) => console.error("Gagal simpan exp:", e)));
    }
    if (patch.skills) {
      patch.skills.forEach((s) => saveSkill(s).catch((e) => console.error("Gagal simpan skill:", e)));
    }
  };

  return (
    <SiteContentContext.Provider value={{ content, updateContent }}>
      {children}
    </SiteContentContext.Provider>
  );
};
