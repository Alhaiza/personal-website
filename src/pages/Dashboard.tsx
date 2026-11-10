import { useState, type FC, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { useAuth } from "../context/authContext";
import { useSiteContent } from "../context/siteContentContext";
import { NeoButton } from "../components/common/NeoButton";
import { ContactSettingsForm } from "../components/admin/ContactSettingsForm";
import { SkillsManager } from "../components/admin/SkillsManager";
import { SiteSettingsForm } from "../components/admin/SiteSettingsForm";
import { AdminSidebar } from "../components/admin/AdminSidebar";
import { AssetInput } from "../components/admin/AssetInput";
import { isAdminTab, type AdminTab } from "../components/admin/adminTabs";
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
 * Terintegrasi penuh dengan `SiteContentContext` (dan dipersistensikan ke localStorage):
 * - Profile Info: Live editor untuk nama, role (SOFTWARE DEVELOPER di Hero), bio, dan kode snippet.
 * - Projects Manager: CRUD proyek dengan cover image, tag, status featured, live demo URL, dan repo URL.
 * - Certifications Manager: Tambah & hapus sertifikasi lengkap dengan thumbnail & tautan verifikasi.
 * - Experience Manager: Kelola rekam jejak karier.
 * - Skills Manager: Kelola teknologi, ikon, dan urutan.
 * - General Settings: Kelola brand, footer, CTA headline, badge, foto profil, dan URL resume.
 * - Contact & Social: Kelola email, alamat/lokasi, dan semua tautan sosial media.
 * - Messages: Inbox pesan kontak dari pengunjung.
 */

export const Dashboard: FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const { content, updateContent } = useSiteContent();

  const { tab } = useParams<{ tab: string }>();
  const activeTab: AdminTab = isAdminTab(tab) ? tab : "profile";

  const setActiveTab = (next: AdminTab) =>
    navigate(next === "profile" ? "/dashboard" : `/dashboard/${next}`);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // State lokal formulir profil
  const [profileForm, setProfileForm] = useState<UserProfile>(content.profile);

  // State lokal tambah proyek baru
  const [newProject, setNewProject] = useState<Omit<ProjectItem, "id">>({
    title: "",
    description: "",
    tags: ["React", "TypeScript", "Tailwind"],
    imageUrl: "https://images.unsplash.com/photo-1592210454359-9043f067919b?w=800&auto=format&fit=crop&q=80",
    projectUrl: "",
    githubUrl: "",
    featured: true,
  });
  const [tagsInput, setTagsInput] = useState("React, TypeScript, Tailwind");

  // State lokal tambah sertifikasi baru
  const [newCert, setNewCert] = useState<Omit<CertificationItem, "id">>({
    title: "",
    issuer: "",
    description: "",
    credentialUrl: "",
    imageUrl: "",
  });

  // State lokal tambah pengalaman baru
  const [newExp, setNewExp] = useState<Omit<ExperienceItem, "id">>({
    role: "",
    company: "",
    period: "2024 - PRESENT",
    description: "",
  });

  // State pesan kontak
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  const showNotification = (text: string, type: "success" | "error" = "success") => {
    setFeedback({ type, text });
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  // Simpan Profile
  const handleSaveProfile = (e: FormEvent) => {
    e.preventDefault();
    updateContent({ profile: profileForm });
    showNotification("Profil berhasil diperbarui dan langsung tampil di Hero!");
  };

  // Tambah Proyek
  const handleAddProject = (e: FormEvent) => {
    e.preventDefault();
    if (!newProject.title.trim()) return;

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
    showNotification("Proyek baru berhasil ditambahkan!");

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
  };

  // Hapus Proyek
  const handleDeleteProject = (id: string) => {
    if (!confirm("Hapus proyek ini dari portofolio?")) return;
    updateContent({ projects: content.projects.filter((p) => p.id !== id) });
    showNotification("Proyek berhasil dihapus.");
  };

  // Tambah Sertifikasi
  const handleAddCert = (e: FormEvent) => {
    e.preventDefault();
    if (!newCert.title.trim()) return;

    const cert: CertificationItem = {
      id: crypto.randomUUID(),
      ...newCert,
    };

    updateContent({ certifications: [...content.certifications, cert] });
    showNotification("Sertifikasi baru berhasil ditambahkan!");

    setNewCert({
      title: "",
      issuer: "",
      description: "",
      credentialUrl: "",
      imageUrl: "",
    });
  };

  // Hapus Sertifikasi
  const handleDeleteCert = (id: string) => {
    if (!confirm("Hapus sertifikasi ini?")) return;
    updateContent({ certifications: content.certifications.filter((c) => c.id !== id) });
    showNotification("Sertifikasi berhasil dihapus.");
  };

  // Tambah Pengalaman
  const handleAddExp = (e: FormEvent) => {
    e.preventDefault();
    if (!newExp.role.trim() || !newExp.company.trim()) return;

    const exp: ExperienceItem = {
      id: crypto.randomUUID(),
      ...newExp,
    };

    updateContent({ experiences: [exp, ...content.experiences] });
    showNotification("Pengalaman baru berhasil ditambahkan!");

    setNewExp({
      role: "",
      company: "",
      period: "2024 - PRESENT",
      description: "",
    });
  };

  // Hapus Pengalaman
  const handleDeleteExp = (id: string) => {
    if (!confirm("Hapus riwayat pengalaman ini?")) return;
    updateContent({ experiences: content.experiences.filter((e) => e.id !== id) });
    showNotification("Pengalaman berhasil dihapus.");
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

          {/* TAB 1: PROFILE INFO */}
          {activeTab === "profile" && (
            <div>
              <div className="pb-6 mb-8 border-b-2 border-black">
                <h2 className="text-2xl font-black uppercase tracking-tight text-black">
                  EDIT PROFILE INFO
                </h2>
                <p className="font-mono text-xs text-neutral-600 mt-1">
                  Atur sapaan nama, judul profesi di Hero, dan bio ringkas yang tampil di publik.
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
                  <span>SIMPAN PERUBAHAN PROFIL</span>
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
                  Kelola kartu portofolio proyek lengkap dengan cover image, tag, tautan live demo, GitHub repo, dan toggle featured.
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
                  required
                  value={newProject.imageUrl}
                  onChange={(value) => setNewProject({ ...newProject, imageUrl: value })}
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
                    FEATURED PROJECT <span className="font-mono font-normal normal-case text-neutral-600">(Tampilkan di carousel Home)</span>
                  </span>
                </label>

                <NeoButton type="submit" variant="purple" size="md">
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>TAMBAH PROYEK</span>
                </NeoButton>
              </form>

              {/* Daftar Proyek */}
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider mb-4">
                  EXISTING PROJECTS ({content.projects.length})
                </h3>
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
                  Kelola sertifikasi lengkap dengan nama, penerbit, deskripsi, thumbnail, dan link verifikasi badge.
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
                  value={newCert.imageUrl || ""}
                  onChange={(value) => setNewCert({ ...newCert, imageUrl: value })}
                  placeholder="https://... atau /sertifikat.jpg"
                />
                <NeoButton type="submit" variant="lime" size="sm">
                  <span>TAMBAH SERTIFIKASI</span>
                </NeoButton>
              </form>

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
                      <h4 className="font-black text-lg text-black">{c.title}</h4>
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
                  Kelola riwayat karier yang tampil di timeline halaman utama dan /experience.
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
                  Pesan yang dikirimkan pengunjung dari halaman publik /contact.
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
                          onClick={() => setMessages(messages.filter((m) => m.id !== msg.id))}
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
