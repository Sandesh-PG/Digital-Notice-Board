import { Bell, Search } from "lucide-react";

function Navbar({ isSidebarOpen }) {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/75 backdrop-blur-sm">
      <div className="flex items-center gap-3 px-4 py-3 sm:px-6">

        {/* Search — left padding on mobile to clear floating hamburger */}
        <div className={`flex-1 transition-all duration-300 ${!isSidebarOpen ? "pl-10 md:pl-0" : ""}`}>
          <div className="relative rounded-2xl border border-slate-300/80 bg-white/95 shadow-[0_8px_20px_-18px_rgba(15,23,42,0.9)] transition focus-within:border-emerald-300 focus-within:ring-4 focus-within:ring-emerald-100">
            <Search
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search notices, events, categories..."
              className="w-full rounded-2xl border border-transparent bg-transparent py-2.5 pl-10 pr-4 text-sm font-medium text-slate-700 outline-none placeholder:font-normal placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Notification bell */}
        <button
          type="button"
          className="relative shrink-0 rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 transition hover:-translate-y-0.5 hover:border-emerald-300 hover:text-emerald-700"
          aria-label="Notifications"
        >
          <Bell size={17} />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-amber-400" />
        </button>

      </div>
    </header>
  );
}

export default Navbar;

// import { Bell } from "lucide-react";

// function Navbar() {
//   return (
//     <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/75 backdrop-blur-sm">
//       <div className="flex items-center justify-end px-4 py-3 sm:px-6">
//         <button
//           type="button"
//           className="relative shrink-0 rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 transition hover:-translate-y-0.5 hover:border-emerald-300 hover:text-emerald-700"
//           aria-label="Notifications"
//         >
//           <Bell size={17} />
//           <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-amber-400" />
//         </button>
//       </div>
//     </header>
//   );
// }

// export default Navbar;