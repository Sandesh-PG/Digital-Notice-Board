import { useState, useEffect } from "react";
import { Bell } from "lucide-react";

function Navbar() {
  const [user] = useState(() => {
    try { return JSON.parse(localStorage.getItem("user")); }
    catch { return null; }
  });
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const firstName = user?.name?.split(" ")[0] || "there";
  const dateStr = now.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">

        {/* Left — greeting */}
        <div>
          <p className="text-lg font-semibold text-slate-800">
            {greeting}, {firstName} 👋
          </p>
          <p className="text-xs text-slate-400">{dateStr}</p>
        </div>

        {/* Right — bell */}
        <button
          type="button"
          className="relative rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 transition hover:-translate-y-0.5 hover:border-emerald-300 hover:text-emerald-700"
          aria-label="Notifications"
        >
          <Bell size={16} />
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
//     <header className="sticky top-0 z-50 flex items-center justify-end border-b border-slate-200 bg-white px-4 py-3 sm:px-6">
//       <button
//         type="button"
//         className="relative rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 transition hover:-translate-y-0.5 hover:border-emerald-300 hover:text-emerald-700"
//         aria-label="Notifications"
//       >
//         <Bell size={17} />
//         <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-amber-400" />
//       </button>
//     </header>
//   );
// }

// export default Navbar;