import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import type {
  ProjectItem,
  CertificationItem,
  ExperienceItem,
  SkillItem,
  UserProfile,
  SiteSettings,
  ContactSettings,
  ContactMessage,
  SiteContent,
} from "../types";
import { mockSiteContent } from "../data/mockData";

/**
 * Lapisan Layanan Cloud Firestore (Firestore CRUD Service Layer)
 * 
 * Modul ini menangani komunikasi langsung ke Google Cloud Firestore:
 * - Pembacaan seluruh isi situs (`fetchFullSiteContent`)
 * - Penyimpanan dan pembaruan dokumen tunggal (settings, profile, contact)
 * - Pengelolaan data koleksi (projects, certifications, experiences, skills, messages)
 * 
 * Semua fungsi dirancang aman dengan fallback ke `mockSiteContent`
 * jika koleksi Firestore masih kosong atau perangkat sedang offline.
 */

// ================= 1. PENGATURAN UMUM (settings/general) =================
export const getSiteSettings = async (): Promise<SiteSettings> => {
  try {
    const snap = await getDoc(doc(db, "settings", "general"));
    if (snap.exists()) {
      return { ...mockSiteContent.settings, ...(snap.data() as Partial<SiteSettings>) };
    }
  } catch (err) {
    console.warn("Gagal memuat settings dari Firestore, memakai fallback:", err);
  }
  return mockSiteContent.settings;
};

export const updateSiteSettings = async (data: SiteSettings): Promise<void> => {
  const docRef = doc(db, "settings", "general");
  await setDoc(docRef, { ...data, updatedAt: serverTimestamp() }, { merge: true });
};

// ================= 2. PROFIL PENGGUNA (profile/general) =================
export const getProfileData = async (): Promise<UserProfile> => {
  try {
    const snap = await getDoc(doc(db, "profile", "general"));
    if (snap.exists()) {
      return { ...mockSiteContent.profile, ...(snap.data() as Partial<UserProfile>) };
    }
  } catch (err) {
    console.warn("Gagal memuat profile dari Firestore, memakai fallback:", err);
  }
  return mockSiteContent.profile;
};

export const updateProfileData = async (data: UserProfile): Promise<void> => {
  const docRef = doc(db, "profile", "general");
  await setDoc(docRef, { ...data, updatedAt: serverTimestamp() }, { merge: true });
};

// ================= 3. KONTAK & SOSIAL MEDIA (contact/general) =================
export const getContactSettings = async (): Promise<ContactSettings> => {
  try {
    const snap = await getDoc(doc(db, "contact", "general"));
    if (snap.exists()) {
      return { ...mockSiteContent.contact, ...(snap.data() as Partial<ContactSettings>) };
    }
  } catch (err) {
    console.warn("Gagal memuat contact dari Firestore, memakai fallback:", err);
  }
  return mockSiteContent.contact;
};

export const updateContactSettings = async (data: ContactSettings): Promise<void> => {
  const docRef = doc(db, "contact", "general");
  await setDoc(docRef, { ...data, updatedAt: serverTimestamp() }, { merge: true });
};

// ================= 4. KEAHLIAN TEKNOLOGI (skills) =================
export const getSkills = async (): Promise<SkillItem[]> => {
  try {
    const snap = await getDocs(collection(db, "skills"));
    if (!snap.empty) {
      return snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<SkillItem, "id">),
      }));
    }
  } catch (err) {
    console.warn("Gagal memuat skills dari Firestore, memakai fallback:", err);
  }
  return mockSiteContent.skills;
};

export const saveSkill = async (skill: SkillItem): Promise<void> => {
  const docRef = doc(db, "skills", skill.id);
  await setDoc(docRef, {
    name: skill.name,
    iconType: skill.iconType || "custom",
    svgCode: skill.svgCode || "",
    featured: Boolean(skill.featured),
    updatedAt: serverTimestamp(),
  });
};

export const deleteSkill = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, "skills", id));
};

// ================= 5. PROYEK PORTOFOLIO (projects) =================
export const getProjects = async (): Promise<ProjectItem[]> => {
  try {
    const snap = await getDocs(collection(db, "projects"));
    if (!snap.empty) {
      return snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<ProjectItem, "id">),
      }));
    }
  } catch (err) {
    console.warn("Gagal memuat projects dari Firestore, memakai fallback:", err);
  }
  return mockSiteContent.projects;
};

export const saveProject = async (project: ProjectItem): Promise<void> => {
  const docRef = doc(db, "projects", project.id);
  await setDoc(docRef, {
    title: project.title,
    description: project.description,
    tags: project.tags,
    imageUrl: project.imageUrl,
    projectUrl: project.projectUrl || "",
    githubUrl: project.githubUrl || "",
    featured: Boolean(project.featured),
    updatedAt: serverTimestamp(),
  });
};

export const deleteProject = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, "projects", id));
};

// ================= 6. SERTIFIKASI (certifications) =================
export const getCertifications = async (): Promise<CertificationItem[]> => {
  try {
    const snap = await getDocs(collection(db, "certifications"));
    if (!snap.empty) {
      return snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<CertificationItem, "id">),
      }));
    }
  } catch (err) {
    console.warn("Gagal memuat certifications dari Firestore, memakai fallback:", err);
  }
  return mockSiteContent.certifications;
};

export const saveCertification = async (cert: CertificationItem): Promise<void> => {
  const docRef = doc(db, "certifications", cert.id);
  await setDoc(docRef, {
    title: cert.title,
    issuer: cert.issuer || "",
    description: cert.description || "",
    credentialUrl: cert.credentialUrl || "",
    imageUrl: cert.imageUrl || "",
    featured: Boolean(cert.featured),
    updatedAt: serverTimestamp(),
  });
};

export const deleteCertification = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, "certifications", id));
};

// ================= 7. PENGALAMAN KARIER (experiences) =================
export const getExperiences = async (): Promise<ExperienceItem[]> => {
  try {
    const snap = await getDocs(collection(db, "experiences"));
    if (!snap.empty) {
      return snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<ExperienceItem, "id">),
      }));
    }
  } catch (err) {
    console.warn("Gagal memuat experiences dari Firestore, memakai fallback:", err);
  }
  return mockSiteContent.experiences;
};

export const saveExperience = async (exp: ExperienceItem): Promise<void> => {
  const docRef = doc(db, "experiences", exp.id);
  await setDoc(docRef, {
    role: exp.role,
    company: exp.company,
    period: exp.period,
    description: exp.description,
    updatedAt: serverTimestamp(),
  });
};

export const deleteExperience = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, "experiences", id));
};

// ================= 8. INBOX PESAN KONTAK (messages) =================
export const getContactMessages = async (): Promise<ContactMessage[]> => {
  try {
    const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        name: data.name || "",
        email: data.email || "",
        subject: data.subject || "",
        message: data.message || "",
        status: data.status || "unread",
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toLocaleString() : "Recently",
      };
    });
  } catch (err) {
    console.warn("Gagal memuat messages dari Firestore:", err);
    return [];
  }
};

export const deleteContactMessage = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, "messages", id));
};

// ================= 9. FETCH SEMUA KONTEN SEKALIGUS =================
export const fetchFullSiteContent = async (): Promise<SiteContent> => {
  const [settings, profile, contact, skills, projects, certifications, experiences] =
    await Promise.all([
      getSiteSettings(),
      getProfileData(),
      getContactSettings(),
      getSkills(),
      getProjects(),
      getCertifications(),
      getExperiences(),
    ]);

  return {
    settings,
    profile,
    contact,
    skills,
    projects,
    certifications,
    experiences,
  };
};
