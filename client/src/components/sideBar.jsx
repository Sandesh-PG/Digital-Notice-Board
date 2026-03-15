import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home, Calendar, Megaphone, Briefcase, PartyPopper,
  CalendarDays, LogOut, PanelLeftClose, PanelLeftOpen, Settings,
} from "lucide-react";
import PropTypes from "prop-types";

const navItems = [
  { label: "Dashboard",     icon: Home,       category: "",             path: "/dashboard",                teacherPath: null, studentPath: null },
  { label: "Announcements", icon: Megaphone,  category: "announcement", path: null,                        teacherPath: null, studentPath: null },
  { label: "Timetables",    icon: Calendar,   category: "timetable",    path: null,                        teacherPath: "/dashboard/create-timetable", studentPath: "/dashboard/timetables" },
  { label: "Placements",    icon: Briefcase,  category: "placement",    path: null,                        teacherPath: null, studentPath: null },
  { label: "Events",        icon: PartyPopper,category: "event",        path: null,                        teacherPath: null, studentPath: null },
];

function Sidebar({ selectedCategory, onCategorySelect, isSidebarOpen, setIsSidebarOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [user] = useState(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;
    try { return JSON.parse(userStr); }
    catch { return null; }
  });

  const avatarInitial = user?.name?.charAt(0)?.toUpperCase() || "U";
  const isTeacherOrAdmin = user?.role === "teacher" || user?.role === "admin";

  const getItemPath = (item) => {
    if (item.teacherPath || item.studentPath) {
      return isTeacherOrAdmin ? item.teacherPath : item.studentPath;
    }
    return item.path;
  };

  const handleNavItemClick = (item) => {
    const resolvedPath = getItemPath(item);
    if (resolvedPath) {
      onCategorySelect("");
      navigate(resolvedPath);
    } else {
      onCategorySelect(item.category);
      navigate("/dashboard");
    }
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <>
      {/* ── Mobile backdrop ── */}
      {isSidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
          aria-label="Close sidebar overlay"
        />
      )}

      {/* ── Collapsed strip: hamburger only (desktop) ── */}
      {!isSidebarOpen && (
        <div className="fixed left-0 top-0 z-40 hidden h-full w-14 flex-col items-center border-r border-white/10 bg-slate-900 pt-4 md:flex">
          <button
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-300/30 bg-emerald-300/10 text-emerald-100 transition hover:border-emerald-200/60 hover:bg-emerald-300/20"
            aria-label="Open sidebar"
          >
            <PanelLeftOpen size={16} />
          </button>
        </div>
      )}

      {/* ── Mobile: hamburger button ── */}
      {!isSidebarOpen && (
        <button
          type="button"
          onClick={() => setIsSidebarOpen(true)}
          className="fixed left-3 top-3 z-50 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-300/30 bg-slate-900 text-emerald-100 transition hover:bg-slate-800 md:hidden"
          aria-label="Open sidebar"
        >
          <PanelLeftOpen size={16} />
        </button>
      )}

      {/* ── Full sidebar ── */}
      <aside
        className={`fixed left-0 top-0 z-40 flex h-full w-64 flex-col border-r border-white/10 bg-slate-900 text-slate-100 transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="shrink-0 px-3 pt-4">
          <div className="rounded-2xl border border-emerald-300/20 bg-gradient-to-r from-emerald-400/15 via-cyan-300/10 to-transparent px-3 py-3">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-[0.22em] text-emerald-200/80">RIT Hub</p>
                <h1 className="mt-0.5 text-lg font-semibold leading-tight text-white">Notice Board</h1>
              </div>
              <button
                type="button"
                onClick={() => setIsSidebarOpen(false)}
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-emerald-300/30 bg-emerald-300/10 text-emerald-100 transition hover:border-emerald-200/60 hover:bg-emerald-300/20"
                aria-label="Collapse sidebar"
              >
                <PanelLeftClose size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="mt-5 shrink-0 px-3">
          <div className="grid grid-cols-1 gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const resolvedPath = getItemPath(item);

              let isActive = false;
              if (resolvedPath && resolvedPath !== "/dashboard") {
                isActive = location.pathname === resolvedPath;
              } else if (item.label === "Dashboard") {
                isActive = location.pathname === "/dashboard" && selectedCategory === "";
              } else {
                isActive = location.pathname === "/dashboard" && selectedCategory === item.category;
              }

              return (
                <button
                  type="button"
                  key={item.label}
                  onClick={() => handleNavItemClick(item)}
                  className={`group relative flex h-10 w-full items-center gap-3 rounded-xl border px-3 text-sm transition ${
                    isActive
                      ? "border-emerald-300/60 bg-emerald-300/15 text-emerald-100"
                      : "border-slate-700/70 bg-slate-800/50 text-slate-300 hover:border-emerald-300/40 hover:text-emerald-100"
                  }`}
                >
                  <span className={`absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full transition-all ${isActive ? "bg-emerald-300" : "bg-transparent"}`} />
                  <Icon size={18} className={`shrink-0 ${isActive ? "text-emerald-200" : "text-slate-400 group-hover:text-emerald-200"}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Daily Digest */}
        <div className="mx-3 mt-4 shrink-0 rounded-xl border border-slate-700/70 bg-slate-800/60 p-3">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Today</p>
            <CalendarDays size={15} className="text-emerald-200" />
          </div>
          <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-emerald-200/90">Daily Digest</p>
          <p className="mt-1 text-sm text-slate-200">Stay updated with latest announcement, placement, and event highlights.</p>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* User + Settings + Logout */}
        <div className="shrink-0 px-3 pb-4">
          <div className="rounded-xl border border-slate-700/70 bg-slate-800/60 p-3">
            <div className="flex items-center gap-3">
              <div className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-emerald-300/40 bg-emerald-400/20 text-sm font-semibold text-emerald-100">
                {avatarInitial}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-100">{user?.name || "User"}</p>
                <p className="truncate text-xs uppercase tracking-wide text-slate-400">{user?.role || "Member"}</p>
              </div>
            </div>
            <Link
              to="/dashboard/settings"
              onClick={() => { if (window.innerWidth < 768) setIsSidebarOpen(false); }}
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-600/80 bg-slate-700/40 py-2 text-xs font-semibold uppercase tracking-wide text-slate-200 transition hover:border-emerald-300/40 hover:text-emerald-100"
            >
              <Settings size={14} />
              <span>Settings</span>
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-red-500/40 bg-red-500/10 py-2 text-xs font-semibold uppercase tracking-wide text-red-300 transition hover:border-red-400/60 hover:bg-red-500/20 hover:text-red-200"
            >
              <LogOut size={14} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

Sidebar.propTypes = {
  selectedCategory: PropTypes.string.isRequired,
  onCategorySelect: PropTypes.func.isRequired,
  isSidebarOpen: PropTypes.bool.isRequired,
  setIsSidebarOpen: PropTypes.func.isRequired,
};

export default Sidebar;