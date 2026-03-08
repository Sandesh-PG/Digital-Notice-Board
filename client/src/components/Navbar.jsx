import { Bell, Search, UserCircle2 } from "lucide-react";

function Navbar() {
  return (
    <header className="border-b border-slate-200/70 bg-white/70 px-4 py-4 backdrop-blur-sm sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-lg">
          <Search
            size={18}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search notices, events, categories..."
            className="w-full rounded-2xl border border-slate-200 bg-white/90 py-2.5 pl-11 pr-4 text-sm text-slate-700 shadow-sm outline-none transition focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100"
          />
        </div>

        <div className="flex items-center gap-3 self-end md:self-auto">
          <button
            type="button"
            className="relative rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 transition hover:-translate-y-0.5 hover:border-emerald-300 hover:text-emerald-700"
            aria-label="Notifications"
          >
            <Bell size={18} />
            <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-amber-400" />
          </button>
          <button
            type="button"
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-slate-700 transition hover:-translate-y-0.5 hover:border-emerald-300"
            aria-label="Profile"
          >
            <UserCircle2 size={18} />
            <span className="hidden text-sm font-medium sm:inline">Admin</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;