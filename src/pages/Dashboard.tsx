import { useState, useEffect, type FC, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ContactSettingsForm } from "../components/admin/ContactSettingsForm";
import { SkillsManager } from "../components/admin/SkillsManager";
import { SiteSettingsForm } from "../components/admin/SiteSettingsForm";
import { AdminSidebar } from "../components/admin/AdminSidebar";
import { isAdminTab, type AdminTab } from "../components/admin/adminTabs";
import {
  Mail,
  LogOut,
  Plus,
  Trash2,
  ExternalLink,
  Save,
  CheckCircle2,
  AlertCircle,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { NeoButton } from "../components/common/NeoButton";
import {
  getProfileData,
  updateProfileData,
  getProjects,
  createProject,
  deleteProject,
  getCertifications,
  createCertification,
  deleteCertification,
  getExperiences,
  createExperience,
  deleteExperience,
  getContactMessages,
  deleteContactMessage,
} from "../services/firestoreService";
import type {
  UserProfile,
  ProjectItem,
  CertificationItem,
  ExperienceItem,
  ContactMessage,
} from "../types";
import { mockProfile, mockSkills } from "../data/mockData";

/**
 * Admin Dashboard Component (`/dashboard`)
 * 
 * Features:
 * - Tabbed navigation matching Neo-Brutalist design language.
 * - Profile Settings: Live editor for bio, title, name, and social links.
 * - Projects Manager: Full Firestore CRUD operations (add new projects, view list, delete).
 * - Certifications Manager: Add & delete credentials.
 * - Experiences Manager: Manage work career timeline.
 * - Messages Inbox: Read contact form submissions received from visitors.
 * - Secure Logout: Destroys Firebase session and redirects to `/login`.
 */

export const Dashboard: FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Tab aktif diambil dari URL (`/dashboard/:tab`), sehingga setiap tab punya alamat sendiri
  // dan tetap aktif saat halaman di-refresh. Jika parameter tidak valid, pakai "profile".
  // `isAdminTab` memastikan nilai dari URL adalah tab yang valid (daftar tab ada di adminTabs.ts).
  const { tab } = useParams<{ tab: string }>();
  const activeTab: AdminTab = isAdminTab(tab) ? tab : "profile";
  // Berpindah tab = berpindah URL. "profile" memakai URL dasar `/dashboard`.
  const setActiveTab = (next: AdminTab) =>
    navigate(next === "profile" ? "/dashboard" : `/dashboard/${next}`);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Skills dikelola di komponen sendiri (state lokal), jadi lencana memakai jumlah data awal.
  const skillCount = mockSkills.length;

  // Status banners
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Firestore Data State
  const [profile, setProfile] = useState<UserProfile>(mockProfile);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [certifications, setCertifications] = useState<CertificationItem[]>([]);
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  // Form states for adding items
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    tags: "React, Tailwind, TypeScript",
    imageUrl: "https://images.unsplash.com/photo-1592210454359-9043f067919b?w=800&auto=format&fit=crop&q=80",
    projectUrl: "",
    githubUrl: "",
    featured: false, // true = tampil di carousel "Featured Projects" pada Home
  });

  const [newCert, setNewCert] = useState({
    title: "",
    issuer: "",
    credentialUrl: "",
  });

  const [newExp, setNewExp] = useState({
    role: "",
    company: "",
    period: "2024 - PRESENT",
    description: "",
  });

  // Fetch initial data from Firestore
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      const [profData, projData, certData, expData, msgData] = await Promise.all([
        getProfileData(),
        getProjects(),
        getCertifications(),
        getExperiences(),
        getContactMessages(),
      ]);

      if (profData) setProfile(profData);
      setProjects(projData);
      setCertifications(certData);
      setExperiences(expData);
      setMessages(msgData);
    } catch {
      // In case Firestore collections are empty initially, fallback gracefully
    }
  };

  const showNotification = (text: string, type: "success" | "error" = "success") => {
    setFeedback({ type, text });
    setTimeout(() => setFeedback(null), 4000);
  };

  // Sign out handler
  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  // Profile Save Handler
  const handleSaveProfile = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await updateProfileData(profile);
      showNotification("Profile updated successfully in Firestore!");
    } catch (err: unknown) {
      showNotification((err as Error).message || "Failed to update profile", "error");
    }
  };

  // Project Add Handler
  const handleAddProject = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await createProject({
        title: newProject.title,
        description: newProject.description,
        tags: newProject.tags.split(",").map((t) => t.trim()),
        imageUrl: newProject.imageUrl,
        projectUrl: newProject.projectUrl,
        githubUrl: newProject.githubUrl,
        featured: newProject.featured,
        order: projects.length + 1,
      });
      showNotification("New project created in Firestore!");
      setNewProject({
        title: "",
        description: "",
        tags: "React, Tailwind, TypeScript",
        imageUrl: "",
        projectUrl: "",
        githubUrl: "",
        featured: false,
      });
      const updated = await getProjects();
      setProjects(updated);
    } catch (err: unknown) {
      showNotification((err as Error).message || "Failed to add project", "error");
    }
  };

  // Project Delete Handler
  const handleDeleteProject = async (id?: string) => {
    if (!id || !confirm("Are you sure you want to delete this project?")) return;
    try {
      await deleteProject(id);
      setProjects(projects.filter((p) => p.id !== id));
      showNotification("Project deleted successfully.");
    } catch (err: unknown) {
      showNotification((err as Error).message || "Failed to delete project", "error");
    }
  };

  // Certification Add & Delete
  const handleAddCert = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await createCertification({
        title: newCert.title,
        issuer: newCert.issuer,
        credentialUrl: newCert.credentialUrl,
        order: certifications.length + 1,
      });
      showNotification("Certification added!");
      setNewCert({ title: "", issuer: "", credentialUrl: "" });
      const updated = await getCertifications();
      setCertifications(updated);
    } catch (err: unknown) {
      showNotification((err as Error).message || "Failed to add cert", "error");
    }
  };

  const handleDeleteCert = async (id?: string) => {
    if (!id || !confirm("Delete this certification?")) return;
    try {
      await deleteCertification(id);
      setCertifications(certifications.filter((c) => c.id !== id));
      showNotification("Certification removed.");
    } catch (err: unknown) {
      showNotification((err as Error).message || "Failed to delete cert", "error");
    }
  };

  // Experience Add & Delete
  const handleAddExp = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await createExperience({
        role: newExp.role,
        company: newExp.company,
        period: newExp.period,
        description: newExp.description,
        order: experiences.length + 1,
      });
      showNotification("Experience entry added!");
      setNewExp({ role: "", company: "", period: "", description: "" });
      const updated = await getExperiences();
      setExperiences(updated);
    } catch (err: unknown) {
      showNotification((err as Error).message || "Failed to add experience", "error");
    }
  };

  const handleDeleteExp = async (id?: string) => {
    if (!id || !confirm("Delete this experience?")) return;
    try {
      await deleteExperience(id);
      setExperiences(experiences.filter((e) => e.id !== id));
      showNotification("Experience removed.");
    } catch (err: unknown) {
      showNotification((err as Error).message || "Failed to delete experience", "error");
    }
  };

  // Message Delete Handler
  const handleDeleteMsg = async (id?: string) => {
    if (!id || !confirm("Delete this message?")) return;
    try {
      await deleteContactMessage(id);
      setMessages(messages.filter((m) => m.id !== id));
      showNotification("Message deleted.");
    } catch (err: unknown) {
      showNotification((err as Error).message || "Failed to delete message", "error");
    }
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
              Signed in as: <strong className="text-black">{user?.email}</strong>
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

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden p-1.5 border-2 border-black bg-white shadow-neo-sm"
              aria-label="Toggle Dashboard Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area with Sidebar Layout */}
      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col md:flex-row border-x-2 border-black bg-white shadow-neo-lg my-0 sm:my-6">
        {/* Sidebar bergrup (KONTEN / HALAMAN / KOTAK MASUK). Di mobile disembunyikan sampai tombol menu ditekan. */}
        <AdminSidebar
          activeTab={activeTab}
          onSelect={(next) => {
            setActiveTab(next);
            setMobileMenuOpen(false); // tutup menu mobile setelah memilih
          }}
          counts={{
            skills: skillCount,
            projects: projects.length,
            certifications: certifications.length,
            experiences: experiences.length,
            messages: messages.length,
          }}
          className={mobileMenuOpen ? "block" : "hidden md:block"}
        />

        {/* Dynamic Tab Panel */}
        <main className="flex-1 p-6 sm:p-10 bg-neutral-50 min-h-[500px]">
          {/* Notification Feedback Toast */}
          {feedback && (
            <div
              className={`mb-6 p-4 border-2 border-black shadow-neo flex items-center gap-3 font-mono text-xs font-bold ${
                feedback.type === "success" ? "bg-[#bef264]" : "bg-[#fb7185]"
              }`}
            >
              {feedback.type === "success" ? (
                <CheckCircle2 className="w-5 h-5 text-black stroke-[2.5]" />
              ) : (
                <AlertCircle className="w-5 h-5 text-black stroke-[2.5]" />
              )}
              <span>{feedback.text}</span>
            </div>
          )}

          {/* Panel baru. Setiap panel hanya dirender saat tab-nya aktif (conditional rendering). */}
          {activeTab === "contact" && <ContactSettingsForm />}
          {activeTab === "skills" && <SkillsManager />}
          {activeTab === "settings" && <SiteSettingsForm />}

          {/* TAB 1: PROFILE INFO */}
          {activeTab === "profile" && (
            <div>
              <div className="pb-6 mb-8 border-b-2 border-black">
                <h2 className="text-2xl font-black uppercase tracking-tight text-black">
                  EDIT PROFILE INFO
                </h2>
                <p className="font-mono text-xs text-neutral-600 mt-1">
                  Manage headline, bio, and social coordinates saved in the Firestore `profile/general` document.
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
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full border-2 border-black p-3 font-mono text-xs focus:bg-neutral-50 focus:outline-none shadow-neo-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider mb-2">
                    PROFESSIONAL TITLE / HEADLINE
                  </label>
                  <input
                    type="text"
                    required
                    value={profile.role}
                    onChange={(e) => setProfile({ ...profile, role: e.target.value })}
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
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
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
                    value={profile.codeSnippet?.code || ""}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        codeSnippet: { language: "typescript", code: e.target.value },
                      })
                    }
                    className="w-full border-2 border-black p-3 font-mono text-xs bg-neutral-900 text-green-400 focus:outline-none shadow-neo-sm resize-none"
                  />
                </div>

                {/* Tautan sosial TIDAK diedit di sini lagi, supaya hanya ada satu sumber data. */}
                <p className="font-mono text-[11px] text-neutral-600 bg-neutral-100 border-2 border-dashed border-black p-3">
                  Email, lokasi & tautan sosial media dikelola di menu <strong>CONTACT &amp; SOCIAL</strong>.
                </p>

                <NeoButton type="submit" variant="lime" size="md">
                  <Save className="w-4 h-4 stroke-[2.5]" />
                  <span>SAVE CHANGES TO FIRESTORE</span>
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
                  Create, view, and delete project showcase documents from the `projects` collection.
                </p>
              </div>

              {/* Add New Project Form */}
              <form onSubmit={handleAddProject} className="bg-white border-2 border-black p-6 sm:p-8 shadow-neo max-w-2xl">
                <h3 className="text-sm font-black uppercase tracking-wider mb-6 flex items-center gap-2">
                  <Plus className="w-4 h-4 stroke-[3]" /> ADD NEW PROJECT DOCUMENT
                </h3>

                <div className="space-y-4">
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
                      TAGS (COMMA SEPARATED)
                    </label>
                    <input
                      type="text"
                      placeholder="React, TypeScript, Tailwind, Firebase"
                      value={newProject.tags}
                      onChange={(e) => setNewProject({ ...newProject, tags: e.target.value })}
                      className="w-full border-2 border-black p-2.5 font-mono text-xs shadow-neo-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider mb-1">
                      COVER IMAGE URL
                    </label>
                    <input
                      type="url"
                      required
                      value={newProject.imageUrl}
                      onChange={(e) => setNewProject({ ...newProject, imageUrl: e.target.value })}
                      className="w-full border-2 border-black p-2.5 font-mono text-xs shadow-neo-sm"
                    />
                  </div>

                  {/* Dua URL opsional berdampingan di tablet ke atas */}
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

                  {/* Toggle "Featured": checkbox bertipe boolean. Nilainya diambil dari `e.target.checked`, bukan `value`. */}
                  <label
                    htmlFor="project-featured"
                    className="flex items-center gap-3 p-3 border-2 border-black bg-neutral-50 shadow-neo-sm cursor-pointer select-none"
                  >
                    <input
                      id="project-featured"
                      type="checkbox"
                      checked={newProject.featured}
                      onChange={(e) => setNewProject({ ...newProject, featured: e.target.checked })}
                      className="w-5 h-5 accent-black cursor-pointer"
                    />
                    <span className="text-xs font-black uppercase tracking-wider">
                      FEATURED <span className="font-mono font-normal normal-case text-neutral-600">(tampil di carousel Home)</span>
                    </span>
                  </label>

                  <NeoButton type="submit" variant="purple" size="md">
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>CREATE PROJECT DOCUMENT</span>
                  </NeoButton>
                </div>
              </form>

              {/* Projects List */}
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider mb-4">
                  EXISTING PROJECTS ({projects.length})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {projects.map((proj) => (
                    <div key={proj.id} className="bg-white border-2 border-black p-4 shadow-neo flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-black text-sm uppercase text-black">{proj.title}</h4>
                          {proj.featured && (
                            <span className="shrink-0 px-2 py-0.5 bg-[#bef264] border border-black text-[10px] font-black uppercase">
                              FEATURED
                            </span>
                          )}
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
                          onClick={() => handleDeleteProject(proj.id)}
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
                  Manage credential documents stored in the `certifications` Firestore collection.
                </p>
              </div>

              {/* Form */}
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
                <NeoButton type="submit" variant="lime" size="sm">
                  <span>ADD CERTIFICATE</span>
                </NeoButton>
              </form>

              {/* List */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {certifications.map((c) => (
                  <div key={c.id} className="bg-[#bef264] border-2 border-black p-4 shadow-neo flex flex-col justify-between">
                    <div>
                      <h4 className="font-black text-lg text-black">{c.title}</h4>
                      <p className="font-mono text-xs text-neutral-800">{c.issuer}</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-black flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleDeleteCert(c.id)}
                        className="px-2.5 py-1 bg-white border border-black text-xs font-bold shadow-neo-sm hover:bg-neutral-100 cursor-pointer"
                      >
                        DELETE
                      </button>
                    </div>
                  </div>
                ))}
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
                  Manage timeline positions stored in the `experiences` Firestore collection.
                </p>
              </div>

              {/* Form */}
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
                  <span>ADD TO TIMELINE</span>
                </NeoButton>
              </form>

              {/* List */}
              <div className="space-y-4">
                {experiences.map((exp) => (
                  <div key={exp.id} className="bg-white border-2 border-black p-4 shadow-neo flex items-start justify-between">
                    <div>
                      <h4 className="font-black text-sm uppercase text-black">{exp.role} • {exp.company}</h4>
                      <p className="font-mono text-xs text-neutral-500 font-bold">{exp.period}</p>
                      <p className="font-mono text-xs text-neutral-700 mt-1 max-w-xl">{exp.description}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteExp(exp.id)}
                      className="px-2.5 py-1 bg-[#fb7185] border border-black text-xs font-bold shadow-neo-sm hover:bg-[#f43f5e] cursor-pointer"
                    >
                      DELETE
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: MESSAGES INBOX */}
          {activeTab === "messages" && (
            <div>
              <div className="pb-6 mb-8 border-b-2 border-black">
                <h2 className="text-2xl font-black uppercase tracking-tight text-black">
                  INQUIRY INBOX ({messages.length})
                </h2>
                <p className="font-mono text-xs text-neutral-600 mt-1">
                  Submissions sent from the public `/contact` form and saved into the `messages` collection.
                </p>
              </div>

              {messages.length === 0 ? (
                <div className="bg-white border-2 border-black p-10 text-center shadow-neo">
                  <Mail className="w-10 h-10 mx-auto mb-3 text-neutral-400 stroke-1" />
                  <p className="font-mono text-xs text-neutral-600 font-bold uppercase">
                    NO MESSAGES RECEIVED YET.
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
                          onClick={() => handleDeleteMsg(msg.id)}
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
    </div>
  );
};

