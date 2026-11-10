import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
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
  UserProfile,
  ContactMessage,
} from "../types";

/**
 * Firestore CRUD Service Layer
 * 
 * Provides clean, decoupled helper functions for interacting with Cloud Firestore:
 * - `getDocs`: Fetches an entire collection.
 * - `addDoc`: Creates a new document with an auto-generated ID.
 * - `setDoc`: Creates or replaces a document with a specific ID.
 * - `updateDoc`: Updates specific fields without overwriting the entire document.
 * - `deleteDoc`: Deletes a document by ID.
 */

// ================= 1. PROFILE MANAGEMENT =================
export const getProfileData = async (): Promise<UserProfile | null> => {
  const docRef = doc(db, "profile", "general");
  const snap = await getDoc(docRef);
  if (snap.exists()) {
    return snap.data() as UserProfile;
  }
  return null;
};

export const updateProfileData = async (data: UserProfile): Promise<void> => {
  const docRef = doc(db, "profile", "general");
  await setDoc(docRef, { ...data, updatedAt: serverTimestamp() }, { merge: true });
};

// ================= 2. PROJECTS CRUD =================
export const getProjects = async (): Promise<ProjectItem[]> => {
  const q = query(collection(db, "projects"), orderBy("order", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<ProjectItem, "id">),
  }));
};

export const createProject = async (project: Omit<ProjectItem, "id">): Promise<string> => {
  const ref = await addDoc(collection(db, "projects"), {
    ...project,
    createdAt: serverTimestamp(),
  });
  return ref.id;
};

export const updateProject = async (id: string, project: Partial<ProjectItem>): Promise<void> => {
  const docRef = doc(db, "projects", id);
  await updateDoc(docRef, { ...project, updatedAt: serverTimestamp() });
};

export const deleteProject = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, "projects", id));
};

// ================= 3. CERTIFICATIONS CRUD =================
export const getCertifications = async (): Promise<CertificationItem[]> => {
  const q = query(collection(db, "certifications"), orderBy("order", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<CertificationItem, "id">),
  }));
};

export const createCertification = async (cert: Omit<CertificationItem, "id">): Promise<string> => {
  const ref = await addDoc(collection(db, "certifications"), {
    ...cert,
    createdAt: serverTimestamp(),
  });
  return ref.id;
};

export const deleteCertification = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, "certifications", id));
};

// ================= 4. EXPERIENCES CRUD =================
export const getExperiences = async (): Promise<ExperienceItem[]> => {
  const q = query(collection(db, "experiences"), orderBy("order", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<ExperienceItem, "id">),
  }));
};

export const createExperience = async (exp: Omit<ExperienceItem, "id">): Promise<string> => {
  const ref = await addDoc(collection(db, "experiences"), {
    ...exp,
    createdAt: serverTimestamp(),
  });
  return ref.id;
};

export const deleteExperience = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, "experiences", id));
};

// ================= 5. CONTACT MESSAGES =================
export const getContactMessages = async (): Promise<ContactMessage[]> => {
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
};

export const deleteContactMessage = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, "messages", id));
};

