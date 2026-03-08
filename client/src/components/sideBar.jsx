import { Home, Calendar, Megaphone, Briefcase, PartyPopper } from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: Home, active: true },
  { label: "Announcements", icon: Megaphone },
  { label: "Timetables", icon: Calendar },
  { label: "Placements", icon: Briefcase },
  { label: "Events", icon: PartyPopper },
];

function Sidebar() {
  return (
    <aside className="w-full border-b border-white/25 bg-slate-900 px-4 py-4 text-slate-100 md:w-72 md:border-b-0 md:border-r md:border-white/10 md:px-5 md:py-6">
      <div className="rounded-2xl border border-emerald-300/20 bg-linear-to-r from-emerald-400/15 via-cyan-300/10 to-transparent px-4 py-3">
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-emerald-200/80">
          Campus Hub
        </p>
        <h1 className="mt-1 text-2xl font-semibold leading-tight text-white">Notice Board</h1>
      </div>

      <nav className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 md:mt-8 md:grid-cols-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              type="button"
              key={item.label}
              className={`group flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm transition ${
                item.active
                  ? "border-emerald-300/60 bg-emerald-300/15 text-emerald-100"
                  : "border-slate-700/70 bg-slate-800/50 text-slate-300 hover:border-emerald-300/40 hover:text-emerald-100"
              }`}
            >
              <Icon
                size={17}
                className={item.active ? "text-emerald-200" : "text-slate-400 group-hover:text-emerald-200"}
              />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-4 hidden rounded-xl border border-slate-700/70 bg-slate-800/60 p-3 md:block">
        <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Today</p>
        <p className="mt-1 text-sm text-slate-200">Stay updated with latest academic and placement announcements.</p>
      </div>
    </aside>
  );
}

export default Sidebar;