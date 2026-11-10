import { useState, useEffect, type FC, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Mail,
  LogOut,
  Plus,
  Trash2,
  ExternalLink,
  Save,
  Menu,
  X,
  Star,
} from "lucide-react";
import { useAuth } from "../context/authContext";
import { useSiteContent } from "../context/siteContentContext";
import { useToast } from "../components/common/toastContext";
import { ConfirmModal } from "../components/common/ConfirmModal";
import { NeoButton } from "../components/common/NeoButton";
import { ContactSettingsForm } from "../components/admin/ContactSettingsForm";
import { SkillsManager } from "../components/admin/SkillsManager";
import { SiteSettingsForm } from "../components/admin/SiteSettingsForm";
import { AdminSidebar } from "../components/admin/AdminSidebar";
import { AssetInput } from "../components/admin/AssetInput";
import { isAdminTab, type AdminTab } from "../components/admin/adminTabs";
import {
  deleteProject,
  deleteCertification,
  deleteExperience,
  getContactMessages,
  deleteContactMessage,
} from "../services/firestoreService";
import { deleteFileLocally } from "../services/storageService";
import type {
  UserProfile,
  ProjectItem,
  CertificationItem,
  ExperienceItem,
  ContactMessage,
} from "../types";

/**
 * Komponen Admin Dashboard (`/dashboard`)
 * 
 * Terintegrasi penuh dengan Cloud Firestore melalui `SiteContentContext` & `firestoreService`:
 * - Pembaruan profile, project, certs, experience, skills, dan settings tersimpan langsung ke Firestore
 * - Inbox pesan membaca data langsung dari koleksi `messages` Firestore
 */

export const Dashboard: FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const { content, updateContent } = useSiteContent();
  const toast = useToast();

  const { tab } = useParams<{ tab: string }>();
  const activeTab: AdminTab = isAdminTab(tab) ? tab : "profile";

  const setActiveTab = (next: AdminTab) =>
    navigate(next === "profile" ? "/dashboard" : `/dashboard/${next}`);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // State untuk Neo-Brutalism Confirm Modal (menggantikan window.confirm)
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const closeConfirmModal = () => {
    setConfirmModal((prev) => ({ ...prev, isOpen: false }));
  };

  // State lokal formulir profil
  const [profileForm, setProfileForm] = useState<UserProfile>(content.profile);

  // =========================================================================
  // CHEATSHEET & PEMBELAJARAN: LIMIT KUOTA FEATURED PROJECTS
  // =========================================================================
  // Batas maksimal proyek unggulan (Featured Projects di Carousel Home)
  const PROJECT_FEATURED_LIMIT = 4;
  const featuredProjectsCount = content.projects.filter((p) => p.featured).length;
  const isProjectFeaturedLimitReached = featuredProjectsCount >= PROJECT_FEATURED_LIMIT;

  // State lokal tambah proyek baru
  const [newProject, setNewProject] = useState<Omit<ProjectItem, "id">>({
    title: "",
    description: "",
    tags: ["React", "TypeScript", "Tailwind"],
    imageUrl: "https://images.unsplash.com/photo-1592210454359-9043f067919b?w=800&auto=format&fit=crop&q=80",
    projectUrl: "",
    githubUrl: "",
    featured: false,
  });
  const [tagsInput, setTagsInput] = useState("React, TypeScript, Tailwind");
  const [uploadingProjectImage, setUploadingProjectImage] = useState(false);

  // =========================================================================
  // CHEATSHEET & PEMBELAJARAN: LIMIT KUOTA FEATURED CERTIFICATIONS
  // =========================================================================
  // Batas maksimal sertifikasi unggulan (Featured Certifications di Home)
  const CERT_FEATURED_LIMIT = 3;
  const featuredCertsCount = content.certifications.filter((c) => c.featured).length;
  const isCertFeaturedLimitReached = featuredCertsCount >= CERT_FEATURED_LIMIT;

  // State lokal tambah sertifikasi baru
  const [newCert, setNewCert] = useState<Omit<CertificationItem, "id">>({
    title: "",
    issuer: "",
    description: "",
    credentialUrl: "",
    imageUrl: "",
    featured: false,
  });
  const [uploadingCertImage, setUploadingCertImage] = useState(false);

  // State lokal tambah pengalaman baru
  const [newExp, setNewExp] = useState<Omit<ExperienceItem, "id">>({
    role: "",
    company: "",
    period: "2024 - PRESENT",
    description: "",
  });

  // State pesan kontak dari Firestore
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  // Muat pesan kontak dari Firestore saat admin membuka dashboard
  useEffect(() => {
    let isMounted = true;
    getContactMessages()
      .then((data) => {
        if (isMounted) setMessages(data);
      })
      .catch((err: unknown) => {
        toast.error((err as Error).message || "Gagal memuat pesan kontak", "GAGAL MEMUAT");
      });
    return () => {
      isMounted = false;
    };
  }, [toast]);

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  // Simpan Profile ke Firestore
  const handleSaveProfile = (e: FormEvent) => {
    e.preventDefault();
    try {
      updateContent({ profile: profileForm });
      toast.success("Profil berhasil diperbarui dan tersimpan di Cloud Firestore!");
    } catch (err: unknown) {
      toast.error((err as Error).message || "Gagal menyimpan data profil");
    }
  };

  // =========================================================================
  // CHEATSHEET & PEMBELAJARAN: FORM HANDLER & FIRESTORE SYNC PROYEK
  // =========================================================================
  // Tambah Proyek ke Firestore
  const handleAddProject = (e: FormEvent) => {
    e.preventDefault();
    if (uploadingProjectImage) {
      toast.error("Tunggu hingga gambar thumbnail selesai diunggah ke cloud.", "SEDANG MENGUNGGAH");
      return;
    }
    if (!newProject.title.trim()) return;

    // VALIDASI KUOTA LIMIT FEATURED PROYEK
    if (newProject.featured && isProjectFeaturedLimitReached) {
      toast.error(
        `Batas maksimal proyek featured (${PROJECT_FEATURED_LIMIT}) sudah tercapai! Hapus status featured dari proyek lain terlebih dahulu.`,
        "LIMIT FEATURED TERCAPAI"
      );
      return;
    }

    try {
      const parsedTags = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      const project: ProjectItem = {
        id: crypto.randomUUID(),
        ...newProject,
        tags: parsedTags,
      };

      updateContent({ projects: [project, ...content.projects] });
      toast.success("Proyek baru berhasil dibuat dan disimpan di Firestore!");

      setNewProject({
        title: "",
        description: "",
        tags: ["React"],
        imageUrl: "",
        projectUrl: "",
        githubUrl: "",
        featured: false,
      });
      setTagsInput("");
    } catch (err: unknown) {
      toast.error((err as Error).message || "Gagal menambahkan proyek");
    }
  };

  // =========================================================================
  // CHEATSHEET & PEMBELAJARAN: TOGGLE STATUS FEATURED PROYEK
  // =========================================================================
  const handleToggleProjectFeatured = (proj: ProjectItem) => {
    const willBeFeatured = !proj.featured;

    // Tolak jika ingin menambah featured tapi kuota sudah penuh
    if (willBeFeatured && isProjectFeaturedLimitReached) {
      toast.error(
        `Maksimal ${PROJECT_FEATURED_LIMIT} proyek featured! Hilangkan status featured dari proyek lain sebelum mencentang proyek ini.`,
        "LIMIT TERCAPAI"
      );
      return;
    }

    try {
      const updated = content.projects.map((p) =>
        p.id === proj.id ? { ...p, featured: willBeFeatured } : p
      );
      updateContent({ projects: updated });
      if (willBeFeatured) {
        toast.success(`Proyek "${proj.title}" ditandai sebagai Featured (${content.projects.filter(p => p.id === proj.id || p.featured).length}/${PROJECT_FEATURED_LIMIT})!`);
      } else {
        toast.info(`Status Featured untuk proyek "${proj.title}" dinonaktifkan.`);
      }
    } catch (err: unknown) {
      toast.error((err as Error).message || "Gagal mengubah status featured proyek");
    }
  };

  // =========================================================================
  // CHEATSHEET & PEMBELAJARAN: PENGHAPUSAN AMAN DOKUMEN & BERKAS PROYEK
  // =========================================================================
  const handleDeleteProject = (id: string, title?: string, imageUrl?: string) => {
    setConfirmModal({
      isOpen: true,
      title: "HAPUS PROYEK?",
      message: `Apakah Anda yakin ingin menghapus proyek "${title || "ini"}" dari portofolio dan Cloud Firestore? Data tidak dapat dikembalikan.`,
      onConfirm: async () => {
        closeConfirmModal();
        try {
          // 1. Hapus dokumen langsung dari koleksi 'projects' Cloud Firestore
          await deleteProject(id);
          // 2. Hapus berkas gambar fisik lokal jika disimpan di /uploads/
          if (imageUrl) {
            await deleteFileLocally(imageUrl);
          }
          // 3. Perbarui state lokal dan cache
          updateContent({ projects: content.projects.filter((p) => p.id !== id) });
          toast.success("Proyek dan berkas medianya berhasil dihapus.");
        } catch (err: unknown) {
          toast.error((err as Error).message || "Gagal menghapus proyek");
        }
      },
    });
  };

  // =========================================================================
  // CHEATSHEET & PEMBELAJARAN: FORM HANDLER & FIRESTORE SYNC SERTIFIKASI
  // =========================================================================
  const handleAddCert = (e: FormEvent) => {
    e.preventDefault();
    if (uploadingCertImage) {
      toast.error("Tunggu hingga gambar sertifikat selesai diunggah ke cloud.", "SEDANG MENGUNGGAH");
      return;
    }
    if (!newCert.title.trim()) return;

    // VALIDASI KUOTA LIMIT FEATURED SERTIFIKASI
    if (newCert.featured && isCertFeaturedLimitReached) {
      toast.error(
        `Batas maksimal sertifikasi featured (${CERT_FEATURED_LIMIT}) sudah tercapai! Hapus status featured dari sertifikasi lain terlebih dahulu.`,
        "LIMIT FEATURED TERCAPAI"
      );
      return;
    }

    try {
      const cert: CertificationItem = {
        id: crypto.randomUUID(),
        ...newCert,
      };

      updateContent({ certifications: [...content.certifications, cert] });
      toast.success("Sertifikasi baru berhasil disimpan di Firestore!");

      setNewCert({
        title: "",
        issuer: "",
        description: "",
        credentialUrl: "",
        imageUrl: "",
        featured: false,
      });
    } catch (err: unknown) {
      toast.error((err as Error).message || "Gagal menambahkan sertifikasi");
    }
  };

  // =========================================================================
  // CHEATSHEET & PEMBELAJARAN: TOGGLE STATUS FEATURED SERTIFIKASI
  // =========================================================================
  const handleToggleCertFeatured = (cert: CertificationItem) => {
    const willBeFeatured = !cert.featured;

    // Tolak jika ingin menambah featured tapi kuota sudah penuh
    if (willBeFeatured && isCertFeaturedLimitReached) {
      toast.error(
        `Maksimal ${CERT_FEATURED_LIMIT} sertifikasi featured! Hilangkan status featured dari sertifikasi lain sebelum mencentang sertifikasi ini.`,
        "LIMIT TERCAPAI"
      );
      return;
    }

    try {
      const updated = content.certifications.map((c) =>
        c.id === cert.id ? { ...c, featured: willBeFeatured } : c
      );
      updateContent({ certifications: updated });
      if (willBeFeatured) {
        toast.success(`Sertifikasi "${cert.title}" ditandai sebagai Featured (${content.certifications.filter(c => c.id === cert.id || c.featured).length}/${CERT_FEATURED_LIMIT})!`);
      } else {
        toast.info(`Status Featured untuk sertifikasi "${cert.title}" dinonaktifkan.`);
      }
    } catch (err: unknown) {
      toast.error((err as Error).message || "Gagal mengubah status featured sertifikasi");
    }
  };

  // =========================================================================
  // CHEATSHEET & PEMBELAJARAN: PENGHAPUSAN DOKUMEN & BERKAS SERTIFIKASI
  // =========================================================================
  const handleDeleteCert = (id: string, title?: string, imageUrl?: string) => {
    setConfirmModal({
      isOpen: true,
      title: "HAPUS SERTIFIKASI?",
      message: `Apakah Anda yakin ingin menghapus sertifikasi "${title || "ini"}" dari Cloud Firestore?`,
      onConfirm: async () => {
        closeConfirmModal();
        try {
          // 1. Hapus dokumen fisik langsung dari koleksi 'certifications' Cloud Firestore
          await deleteCertification(id);
          // 2. Hapus berkas gambar fisik lokal jika disimpan di /uploads/
          if (imageUrl) {
            await deleteFileLocally(imageUrl);
          }
          // 3. Perbarui state lokal dan cache
          updateContent({ certifications: content.certifications.filter((c) => c.id !== id) });
          toast.success("Sertifikasi dan berkas medianya berhasil dihapus.");
        } catch (err: unknown) {
          toast.error((err as Error).message || "Gagal menghapus sertifikasi");
        }
      },
    });
  };

  // Tambah Pengalaman ke Firestore
  const handleAddExp = (e: FormEvent) => {
    e.preventDefault();
    if (!newExp.role.trim() || !newExp.company.trim()) return;

    try {
      const exp: ExperienceItem = {
        id: crypto.randomUUID(),
        ...newExp,
      };

      updateContent({ experiences: [exp, ...content.experiences] });
      toast.success("Pengalaman baru berhasil disimpan di Firestore!");

      setNewExp({
        role: "",
        company: "",
        period: "2024 - PRESENT",
        description: "",
      });
    } catch (err: unknown) {
      toast.error((err as Error).message || "Gagal menambahkan pengalaman");
    }
  };

  // Hapus Pengalaman dari Firestore menggunakan Custom Neo-Brutalism Modal
  const handleDeleteExp = (id: string, role?: string) => {
    setConfirmModal({
      isOpen: true,
      title: "HAPUS PENGALAMAN?",
      message: `Apakah Anda yakin ingin menghapus riwayat karier "${role || "posisi ini"}" dari Cloud Firestore?`,
      onConfirm: async () => {
        closeConfirmModal();
        try {
          await deleteExperience(id);
          updateContent({ experiences: content.experiences.filter((e) => e.id !== id) });
          toast.success("Pengalaman berhasil dihapus dari Cloud Firestore.");
        } catch (err: unknown) {
          toast.error((err as Error).message || "Gagal menghapus pengalaman");
        }
      },
    });
  };

  // Hapus Pesan Kontak dari Firestore menggunakan Custom Neo-Brutalism Modal
  const handleDeleteMsg = (id?: string, sender?: string) => {
    if (!id) return;
    setConfirmModal({
      isOpen: true,
      title: "HAPUS PESAN MASUK?",
      message: `Hapus pesan dari "${sender || "pengunjung"}" dari database inbox?`,
      onConfirm: async () => {
        closeConfirmModal();
        try {
          await deleteContactMessage(id);
          setMessages(messages.filter((m) => m.id !== id));
          toast.success("Pesan berhasil dihapus dari database.");
        } catch (err: unknown) {
          toast.error((err as Error).message || "Gagal menghapus pesan");
        }
      },
    });
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col font-sans selection:bg-[#bef264] selection:text-black">
      {/* Top Admin Bar */}
      <header className="bg-white border-b-2 border-black sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-[#bef264] border-2 border-black px-3 py-1 font-mono text-xs font-black uppercase tracking-wider shadow-neo-sm">
              ADMIN CMS
            </div>
            <span className="font-mono text-xs text-neutral-500 hidden sm:inline">
              Signed in as: <strong className="text-black">{user?.email || "Admin"}</strong>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 border-2 border-black bg-white hover:bg-neutral-50 text-xs font-black uppercase tracking-wider shadow-neo-sm transition"
            >
              <span>VIEW SITE</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border-2 border-black bg-[#fb7185] hover:bg-[#f43f5e] text-xs font-black uppercase tracking-wider shadow-neo-sm transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>LOGOUT</span>
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden p-1.5 border-2 border-black bg-white shadow-neo-sm cursor-pointer"
              aria-label="Toggle Dashboard Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container Layout */}
      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col md:flex-row border-x-2 border-black bg-white shadow-neo-lg my-0 sm:my-6">
        {/* Sidebar Navigasi Terkelompok */}
        <AdminSidebar
          activeTab={activeTab}
          onSelect={(next) => {
            setActiveTab(next);
            setMobileMenuOpen(false);
          }}
          counts={{
            skills: content.skills.length,
            projects: content.projects.length,
            certifications: content.certifications.length,
            experiences: content.experiences.length,
            messages: messages.length,
          }}
          className={mobileMenuOpen ? "block" : "hidden md:block"}
        />

        {/* Dynamic Tab Panel */}
        <main className="flex-1 p-6 sm:p-10 bg-neutral-50 min-h-[500px]">

          {/* TAB 1: PROFILE INFO */}
          {activeTab === "profile" && (
            <div>
              <div className="pb-6 mb-8 border-b-2 border-black">
                <h2 className="text-2xl font-black uppercase tracking-tight text-black">
                  EDIT PROFILE INFO
                </h2>
                <p className="font-mono text-xs text-neutral-600 mt-1">
                  Atur sapaan nama, judul profesi di Hero, dan bio ringkas yang disimpan ke Cloud Firestore.
                </p>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-6 max-w-2xl bg-white border-2 border-black p-6 sm:p-8 shadow-neo">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider mb-2">
                    DISPLAY NAME
                  </label>
                  <input
                    type="text"
                    required
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full border-2 border-black p-3 font-mono text-xs focus:bg-neutral-50 focus:outline-none shadow-neo-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider mb-1">
                    PROFESSIONAL TITLE / HEADLINE (HERO BANNER)
                  </label>
                  <p className="font-mono text-[11px] text-neutral-500 mb-2">
                    Teks ini tampil sebagai judul besar di Hero section (misal: "SOFTWARE DEVELOPER" atau "FULLSTACK ENGINEER").
                  </p>
                  <input
                    type="text"
                    required
                    value={profileForm.role}
                    onChange={(e) => setProfileForm({ ...profileForm, role: e.target.value })}
                    className="w-full border-2 border-black p-3 font-mono text-xs focus:bg-neutral-50 focus:outline-none shadow-neo-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider mb-2">
                    BIOGRAPHY
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={profileForm.bio}
                    onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                    className="w-full border-2 border-black p-3 font-mono text-xs focus:bg-neutral-50 focus:outline-none shadow-neo-sm resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider mb-2">
                    PORTFOLIO CODE SNIPPET (HERO CARD)
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={profileForm.codeSnippet?.code || ""}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        codeSnippet: { language: "typescript", code: e.target.value },
                      })
                    }
                    className="w-full border-2 border-black p-3 font-mono text-xs bg-neutral-900 text-green-400 focus:outline-none shadow-neo-sm resize-none"
                  />
                </div>

                <p className="font-mono text-[11px] text-neutral-600 bg-neutral-100 border-2 border-dashed border-black p-3">
                  Email, lokasi & tautan sosial media dikelola di menu <strong>CONTACT &amp; SOCIAL</strong>.
                  Foto profil &amp; file resume dikelola di menu <strong>GENERAL SETTINGS</strong>.
                </p>

                <NeoButton type="submit" variant="lime" size="md">
                  <Save className="w-4 h-4 stroke-[2.5]" />
                  <span>SIMPAN KE FIRESTORE</span>
                </NeoButton>
              </form>
            </div>
          )}

          {/* TAB 2: PROJECTS CRUD */}
          {activeTab === "projects" && (
            <div className="space-y-10">
              <div className="pb-6 border-b-2 border-black">
                <h2 className="text-2xl font-black uppercase tracking-tight text-black">
                  PROJECTS MANAGER
                </h2>
                <p className="font-mono text-xs text-neutral-600 mt-1">
                  Kelola kartu portofolio proyek yang disinkronkan ke koleksi `projects` Cloud Firestore.
                </p>
              </div>

              {/* Form Tambah Proyek */}
              <form onSubmit={handleAddProject} className="bg-white border-2 border-black p-6 sm:p-8 shadow-neo max-w-2xl space-y-5">
                <h3 className="text-sm font-black uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Plus className="w-4 h-4 stroke-[3]" /> ADD NEW PROJECT
                </h3>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider mb-1">
                    PROJECT TITLE
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Weatherly Dashboard"
                    value={newProject.title}
                    onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                    className="w-full border-2 border-black p-2.5 font-mono text-xs shadow-neo-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider mb-1">
                    DESCRIPTION
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Short summary of features..."
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    className="w-full border-2 border-black p-2.5 font-mono text-xs shadow-neo-sm resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider mb-1">
                    TAGS (PISAHKAN DENGAN KOMA)
                  </label>
                  <input
                    type="text"
                    placeholder="React, TypeScript, Tailwind, Firebase"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    className="w-full border-2 border-black p-2.5 font-mono text-xs shadow-neo-sm"
                  />
                </div>

                <AssetInput
                  id="project-image"
                  label="COVER IMAGE URL"
                  hint="Thumbnail yang tampil di kartu proyek dan carousel Home"
                  kind="image"
                  folder="projects"
                  required
                  value={newProject.imageUrl}
                  onChange={(value) => setNewProject({ ...newProject, imageUrl: value })}
                  onUploadingChange={setUploadingProjectImage}
                  placeholder="https://... atau /gambar-proyek.jpg"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="project-url" className="block text-xs font-black uppercase tracking-wider mb-1">
                      LIVE DEMO URL
                    </label>
                    <input
                      id="project-url"
                      type="url"
                      placeholder="https://proyek-anda.com"
                      value={newProject.projectUrl}
                      onChange={(e) => setNewProject({ ...newProject, projectUrl: e.target.value })}
                      className="w-full border-2 border-black p-2.5 font-mono text-xs shadow-neo-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="project-github" className="block text-xs font-black uppercase tracking-wider mb-1">
                      GITHUB REPO URL
                    </label>
                    <input
                      id="project-github"
                      type="url"
                      placeholder="https://github.com/user/repo"
                      value={newProject.githubUrl}
                      onChange={(e) => setNewProject({ ...newProject, githubUrl: e.target.value })}
                      className="w-full border-2 border-black p-2.5 font-mono text-xs shadow-neo-sm"
                    />
                  </div>
                </div>

                <label
                  htmlFor="project-featured"
                  className={`flex items-start gap-3 p-3.5 border-2 border-black shadow-neo-sm select-none transition-colors ${
                    isProjectFeaturedLimitReached && !newProject.featured
                      ? "bg-neutral-100 opacity-60 cursor-not-allowed"
                      : "bg-neutral-50 hover:bg-[#bef264]/20 cursor-pointer"
                  }`}
                >
                  <input
                    id="project-featured"
                    type="checkbox"
                    checked={newProject.featured}
                    disabled={isProjectFeaturedLimitReached && !newProject.featured}
                    onChange={(e) => {
                      if (e.target.checked && isProjectFeaturedLimitReached) {
                        toast.error(
                          `Batas maksimal proyek featured (${PROJECT_FEATURED_LIMIT}) sudah tercapai!`,
                          "LIMIT PENUH"
                        );
                        return;
                      }
                      setNewProject({ ...newProject, featured: e.target.checked });
                    }}
                    className="w-5 h-5 accent-black cursor-pointer disabled:cursor-not-allowed mt-0.5"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black uppercase tracking-wider">
                        FEATURED PROJECT (TAMPILKAN DI CAROUSEL HOME)
                      </span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 border border-black font-black uppercase ${
                        isProjectFeaturedLimitReached ? "bg-[#fb7185] text-black" : "bg-[#bef264] text-black"
                      }`}>
                        {featuredProjectsCount}/{PROJECT_FEATURED_LIMIT} TERPAKAI
                      </span>
                    </div>
                    <p className="font-mono text-[11px] text-neutral-600 mt-0.5">
                      {isProjectFeaturedLimitReached && !newProject.featured
                        ? `Limit maksimal ${PROJECT_FEATURED_LIMIT} proyek unggulan telah tercapai. Hapus status featured pada proyek lain sebelum memilih proyek ini.`
                        : `Proyek dengan centang featured akan diprioritaskan tampil di carousel Home (maksimal ${PROJECT_FEATURED_LIMIT} proyek).`}
                    </p>
                  </div>
                </label>

                <NeoButton
                  type="submit"
                  variant="purple"
                  size="md"
                  disabled={uploadingProjectImage}
                  className={uploadingProjectImage ? "opacity-50 cursor-not-allowed" : ""}
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>{uploadingProjectImage ? "MENGUNGGAH GAMBAR..." : "TAMBAH PROYEK"}</span>
                </NeoButton>
              </form>

              {/* Daftar Proyek */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                  <h3 className="text-sm font-black uppercase tracking-wider">
                    EXISTING PROJECTS ({content.projects.length})
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono font-bold uppercase text-neutral-600">
                      FEATURED DI CAROUSEL:
                    </span>
                    <span className={`text-xs font-mono font-black px-2 py-0.5 border border-black ${
                      isProjectFeaturedLimitReached ? "bg-[#fb7185] text-black" : "bg-[#bef264] text-black"
                    }`}>
                      {featuredProjectsCount} / {PROJECT_FEATURED_LIMIT} MAKSIMAL
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {content.projects.map((proj) => (
                    <div key={proj.id} className="bg-white border-2 border-black p-4 shadow-neo flex flex-col justify-between">
                      <div>
                        {proj.imageUrl && (
                          <img
                            src={proj.imageUrl}
                            alt={`Thumbnail ${proj.title}`}
                            className="w-full aspect-video object-cover border-2 border-black mb-3"
                            loading="lazy"
                          />
                        )}
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-black text-sm uppercase text-black">{proj.title}</h4>
                          <button
                            type="button"
                            onClick={() => handleToggleProjectFeatured(proj)}
                            disabled={isProjectFeaturedLimitReached && !proj.featured}
                            title={
                              isProjectFeaturedLimitReached && !proj.featured
                                ? `Limit featured (${PROJECT_FEATURED_LIMIT}) sudah tercapai!`
                                : proj.featured
                                ? "Hapus dari Featured"
                                : "Jadikan Featured"
                            }
                            className={`shrink-0 px-2 py-1 border border-black text-[10px] font-black uppercase flex items-center gap-1 transition-all ${
                              proj.featured
                                ? "bg-[#bef264] text-black hover:bg-neutral-200 cursor-pointer shadow-neo-sm"
                                : isProjectFeaturedLimitReached
                                ? "bg-neutral-100 text-neutral-400 opacity-50 cursor-not-allowed border-neutral-300"
                                : "bg-white text-neutral-600 hover:bg-[#bef264] hover:text-black cursor-pointer shadow-neo-sm"
                            }`}
                          >
                            <Star className={`w-3 h-3 ${proj.featured ? "fill-black" : ""}`} />
                            <span>{proj.featured ? "FEATURED" : "+ FEATURE"}</span>
                          </button>
                        </div>
                        <p className="font-mono text-xs text-neutral-600 line-clamp-2 mt-1">{proj.description}</p>
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {proj.tags.map((t) => (
                            <span key={t} className="text-[10px] font-mono px-2 py-0.5 border border-black bg-neutral-100">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="mt-4 pt-3 border-t border-black flex justify-end">
                        <button
                          type="button"
                          onClick={() => handleDeleteProject(proj.id, proj.title, proj.imageUrl)}
                          className="px-3 py-1 bg-[#fb7185] hover:bg-[#f43f5e] border border-black text-xs font-black tracking-wider uppercase flex items-center gap-1.5 shadow-neo-sm cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>DELETE</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CERTIFICATIONS */}
          {activeTab === "certifications" && (
            <div className="space-y-10">
              <div className="pb-6 border-b-2 border-black">
                <h2 className="text-2xl font-black uppercase tracking-tight text-black">
                  CERTIFICATIONS MANAGER
                </h2>
                <p className="font-mono text-xs text-neutral-600 mt-1">
                  Kelola sertifikasi yang disinkronkan ke koleksi `certifications` Cloud Firestore.
                </p>
              </div>

              <form onSubmit={handleAddCert} className="bg-white border-2 border-black p-6 shadow-neo max-w-xl space-y-4">
                <h3 className="text-sm font-black uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Plus className="w-4 h-4 stroke-[3]" /> ADD CERTIFICATION
                </h3>
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider mb-1">CERTIFICATE NAME</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AWS Solutions Architect"
                    value={newCert.title}
                    onChange={(e) => setNewCert({ ...newCert, title: e.target.value })}
                    className="w-full border-2 border-black p-2.5 font-mono text-xs shadow-neo-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider mb-1">ISSUER</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Amazon Web Services"
                    value={newCert.issuer}
                    onChange={(e) => setNewCert({ ...newCert, issuer: e.target.value })}
                    className="w-full border-2 border-black p-2.5 font-mono text-xs shadow-neo-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider mb-1">DESCRIPTION</label>
                  <textarea
                    rows={2}
                    placeholder="Keterangan singkat materi atau kompetensi..."
                    value={newCert.description}
                    onChange={(e) => setNewCert({ ...newCert, description: e.target.value })}
                    className="w-full border-2 border-black p-2.5 font-mono text-xs shadow-neo-sm resize-none"
                  />
                </div>
                <div>
                  <label htmlFor="cert-url" className="block text-xs font-black uppercase tracking-wider mb-1">
                    CREDENTIAL VERIFICATION URL
                  </label>
                  <input
                    id="cert-url"
                    type="url"
                    placeholder="https://verify.example.com/abc123"
                    value={newCert.credentialUrl}
                    onChange={(e) => setNewCert({ ...newCert, credentialUrl: e.target.value })}
                    className="w-full border-2 border-black p-2.5 font-mono text-xs shadow-neo-sm"
                  />
                </div>
                <AssetInput
                  id="cert-image"
                  label="CERTIFICATE IMAGE URL"
                  hint="Thumbnail sertifikat (opsional)"
                  kind="image"
                  folder="certifications"
                  value={newCert.imageUrl || ""}
                  onChange={(value) => setNewCert({ ...newCert, imageUrl: value })}
                  onUploadingChange={setUploadingCertImage}
                  placeholder="https://... atau /sertifikat.jpg"
                />

                <label
                  htmlFor="cert-featured"
                  className={`flex items-start gap-3 p-3.5 border-2 border-black shadow-neo-sm select-none transition-colors ${
                    isCertFeaturedLimitReached && !newCert.featured
                      ? "bg-neutral-100 opacity-60 cursor-not-allowed"
                      : "bg-neutral-50 hover:bg-[#bef264]/20 cursor-pointer"
                  }`}
                >
                  <input
                    id="cert-featured"
                    type="checkbox"
                    checked={newCert.featured}
                    disabled={isCertFeaturedLimitReached && !newCert.featured}
                    onChange={(e) => {
                      if (e.target.checked && isCertFeaturedLimitReached) {
                        toast.error(
                          `Batas maksimal sertifikasi featured (${CERT_FEATURED_LIMIT}) sudah tercapai!`,
                          "LIMIT PENUH"
                        );
                        return;
                      }
                      setNewCert({ ...newCert, featured: e.target.checked });
                    }}
                    className="w-5 h-5 accent-black cursor-pointer disabled:cursor-not-allowed mt-0.5"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black uppercase tracking-wider">
                        FEATURED CERTIFICATION (TAMPILKAN DI HOME)
                      </span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 border border-black font-black uppercase ${
                        isCertFeaturedLimitReached ? "bg-[#fb7185] text-black" : "bg-[#bef264] text-black"
                      }`}>
                        {featuredCertsCount}/{CERT_FEATURED_LIMIT} TERPAKAI
                      </span>
                    </div>
                    <p className="font-mono text-[11px] text-neutral-600 mt-0.5">
                      {isCertFeaturedLimitReached && !newCert.featured
                        ? `Limit maksimal ${CERT_FEATURED_LIMIT} sertifikasi unggulan telah tercapai. Hapus status featured pada sertifikasi lain sebelum memilih sertifikasi ini.`
                        : `Sertifikasi dengan centang featured akan diprioritaskan tampil di halaman Home (maksimal ${CERT_FEATURED_LIMIT} sertifikasi).`}
                    </p>
                  </div>
                </label>

                <NeoButton
                  type="submit"
                  variant="lime"
                  size="sm"
                  disabled={uploadingCertImage}
                  className={uploadingCertImage ? "opacity-50 cursor-not-allowed" : ""}
                >
                  <span>{uploadingCertImage ? "MENGUNGGAH GAMBAR..." : "TAMBAH SERTIFIKASI"}</span>
                </NeoButton>
              </form>

              {/* Daftar Sertifikasi */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                  <h3 className="text-sm font-black uppercase tracking-wider">
                    EXISTING CERTIFICATIONS ({content.certifications.length})
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono font-bold uppercase text-neutral-600">
                      FEATURED DI HOME:
                    </span>
                    <span className={`text-xs font-mono font-black px-2 py-0.5 border border-black ${
                      isCertFeaturedLimitReached ? "bg-[#fb7185] text-black" : "bg-[#bef264] text-black"
                    }`}>
                      {featuredCertsCount} / {CERT_FEATURED_LIMIT} MAKSIMAL
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {content.certifications.map((c) => (
                    <div key={c.id} className="bg-[#bef264] border-2 border-black p-4 shadow-neo flex flex-col justify-between">
                      <div>
                        {c.imageUrl && (
                          <img
                            src={c.imageUrl}
                            alt={`Thumbnail ${c.title}`}
                            className="w-full aspect-video object-cover border-2 border-black mb-3 bg-white"
                            loading="lazy"
                          />
                        )}
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-black text-lg text-black">{c.title}</h4>
                          <button
                            type="button"
                            onClick={() => handleToggleCertFeatured(c)}
                            disabled={isCertFeaturedLimitReached && !c.featured}
                            title={
                              isCertFeaturedLimitReached && !c.featured
                                ? `Limit featured (${CERT_FEATURED_LIMIT}) sudah tercapai!`
                                : c.featured
                                ? "Hapus dari Featured"
                                : "Jadikan Featured"
                            }
                            className={`shrink-0 px-2 py-1 border border-black text-[10px] font-black uppercase flex items-center gap-1 transition-all ${
                              c.featured
                                ? "bg-black text-white hover:bg-neutral-800 cursor-pointer shadow-neo-sm"
                                : isCertFeaturedLimitReached
                                ? "bg-neutral-200 text-neutral-400 opacity-50 cursor-not-allowed border-neutral-400"
                                : "bg-white text-black hover:bg-black hover:text-white cursor-pointer shadow-neo-sm"
                            }`}
                          >
                            <Star className={`w-3 h-3 ${c.featured ? "fill-white text-white" : "text-black"}`} />
                            <span>{c.featured ? "FEATURED" : "+ FEATURE"}</span>
                          </button>
                        </div>
                        <p className="font-mono text-xs text-neutral-800">{c.issuer}</p>
                        {c.credentialUrl && (
                          <a
                            href={c.credentialUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 mt-2 text-[11px] font-mono underline font-bold"
                          >
                            <span>VERIFY LINK</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                      <div className="mt-4 pt-3 border-t border-black flex justify-end">
                        <button
                          type="button"
                          onClick={() => handleDeleteCert(c.id, c.title, c.imageUrl)}
                          className="px-2.5 py-1 bg-white border border-black text-xs font-bold shadow-neo-sm hover:bg-neutral-100 cursor-pointer"
                        >
                          DELETE
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: EXPERIENCES */}
          {activeTab === "experiences" && (
            <div className="space-y-10">
              <div className="pb-6 border-b-2 border-black">
                <h2 className="text-2xl font-black uppercase tracking-tight text-black">
                  CAREER EXPERIENCES MANAGER
                </h2>
                <p className="font-mono text-xs text-neutral-600 mt-1">
                  Kelola riwayat karier yang disinkronkan ke koleksi `experiences` Cloud Firestore.
                </p>
              </div>

              <form onSubmit={handleAddExp} className="bg-white border-2 border-black p-6 shadow-neo max-w-xl space-y-4">
                <h3 className="text-sm font-black uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Plus className="w-4 h-4 stroke-[3]" /> ADD TIMELINE POSITION
                </h3>
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider mb-1">ROLE / TITLE</label>
                  <input
                    type="text"
                    required
                    placeholder="Senior Frontend Developer"
                    value={newExp.role}
                    onChange={(e) => setNewExp({ ...newExp, role: e.target.value })}
                    className="w-full border-2 border-black p-2.5 font-mono text-xs shadow-neo-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider mb-1">COMPANY</label>
                  <input
                    type="text"
                    required
                    placeholder="Tech Corp Inc."
                    value={newExp.company}
                    onChange={(e) => setNewExp({ ...newExp, company: e.target.value })}
                    className="w-full border-2 border-black p-2.5 font-mono text-xs shadow-neo-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider mb-1">PERIOD</label>
                  <input
                    type="text"
                    required
                    placeholder="2022 - PRESENT"
                    value={newExp.period}
                    onChange={(e) => setNewExp({ ...newExp, period: e.target.value })}
                    className="w-full border-2 border-black p-2.5 font-mono text-xs shadow-neo-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider mb-1">DESCRIPTION</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Main responsibilities..."
                    value={newExp.description}
                    onChange={(e) => setNewExp({ ...newExp, description: e.target.value })}
                    className="w-full border-2 border-black p-2.5 font-mono text-xs shadow-neo-sm resize-none"
                  />
                </div>
                <NeoButton type="submit" variant="purple" size="sm">
                  <span>TAMBAH RIWAYAT KARIER</span>
                </NeoButton>
              </form>

              <div className="space-y-4">
                {content.experiences.map((exp) => (
                  <div key={exp.id} className="bg-white border-2 border-black p-4 shadow-neo flex items-start justify-between">
                    <div>
                      <h4 className="font-black text-sm uppercase text-black">{exp.role} • {exp.company}</h4>
                      <p className="font-mono text-xs text-neutral-500 font-bold">{exp.period}</p>
                      <p className="font-mono text-xs text-neutral-700 mt-1 max-w-xl">{exp.description}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteExp(exp.id, exp.role)}
                      className="px-2.5 py-1 bg-[#fb7185] border border-black text-xs font-bold shadow-neo-sm hover:bg-[#f43f5e] cursor-pointer"
                    >
                      DELETE
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: SKILLS */}
          {activeTab === "skills" && <SkillsManager />}

          {/* TAB 6: GENERAL SETTINGS */}
          {activeTab === "settings" && <SiteSettingsForm />}

          {/* TAB 7: CONTACT & SOCIAL */}
          {activeTab === "contact" && <ContactSettingsForm />}

          {/* TAB 8: MESSAGES INBOX */}
          {activeTab === "messages" && (
            <div>
              <div className="pb-6 mb-8 border-b-2 border-black">
                <h2 className="text-2xl font-black uppercase tracking-tight text-black">
                  INQUIRY INBOX ({messages.length})
                </h2>
                <p className="font-mono text-xs text-neutral-600 mt-1">
                  Pesan yang dikirimkan pengunjung dari halaman publik /contact yang tersimpan di Cloud Firestore.
                </p>
              </div>

              {messages.length === 0 ? (
                <div className="bg-white border-2 border-black p-10 text-center shadow-neo">
                  <Mail className="w-10 h-10 mx-auto mb-3 text-neutral-400 stroke-1" />
                  <p className="font-mono text-xs text-neutral-600 font-bold uppercase">
                    BELUM ADA PESAN MASUK.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div key={msg.id} className="bg-white border-2 border-black p-6 shadow-neo flex flex-col justify-between">
                      <div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                          <h4 className="font-black text-sm uppercase text-black">{msg.subject}</h4>
                          <span className="font-mono text-[11px] text-neutral-500">{String(msg.createdAt)}</span>
                        </div>
                        <p className="font-mono text-xs font-bold text-neutral-700 mb-3">
                          From: {msg.name} ({msg.email})
                        </p>
                        <p className="font-mono text-xs text-neutral-800 leading-relaxed bg-neutral-50 p-3 border border-black">
                          {msg.message}
                        </p>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <button
                          type="button"
                          onClick={() => handleDeleteMsg(msg.id, msg.name)}
                          className="px-3 py-1 bg-[#fb7185] hover:bg-[#f43f5e] border border-black text-xs font-black uppercase shadow-neo-sm cursor-pointer"
                        >
                          DELETE INQUIRY
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Neo-Brutalism Confirmation Modal untuk Aksi Hapus */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={closeConfirmModal}
      />
    </div>
  );
};
