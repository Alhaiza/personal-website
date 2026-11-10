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
      skills: Array.isArray(parsed.skills) ? parsed.skills : mockSiteContent.skills,
      projects: Array.isArray(parsed.projects) ? parsed.projects : mockSiteContent.projects,
      certifications: Array.isArray(parsed.certifications) ? parsed.certifications : mockSiteContent.certifications,
      experiences: Array.isArray(parsed.experiences) ? parsed.experiences : mockSiteContent.experiences,
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

  // Simpan data ke Firestore dan sinkronkan state lokal secara asinkron
  const updateContent = async (patch: Partial<SiteContent>): Promise<void> => {
    const next: SiteContent = { ...contentRef.current, ...patch };
    contentRef.current = next;
    setContent(next);
    persistCache(next);

    const promises: Promise<void>[] = [];

    // Kirim sinkronisasi spesifik ke Cloud Firestore
    if (patch.settings) {
      promises.push(updateSiteSettings(patch.settings));
    }
    if (patch.profile) {
      promises.push(updateProfileData(patch.profile));
    }
    if (patch.contact) {
      promises.push(updateContactSettings(patch.contact));
    }
    if (patch.projects) {
      patch.projects.forEach((p) => promises.push(saveProject(p)));
    }
    if (patch.certifications) {
      patch.certifications.forEach((c) => promises.push(saveCertification(c)));
    }
    if (patch.experiences) {
      patch.experiences.forEach((exp) => promises.push(saveExperience(exp)));
    }
    if (patch.skills) {
      patch.skills.forEach((s) => promises.push(saveSkill(s)));
    }

    try {
      await Promise.all(promises);
    } catch (err: unknown) {
      console.error("Gagal sinkronisasi data ke Cloud Firestore:", err);
      throw err;
    }
  };

  return (
    <SiteContentContext.Provider value={{ content, updateContent }}>
      {children}
    </SiteContentContext.Provider>
  );
};
