import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Search, UserCircle2, LogOut, User as UserIcon, ChevronDown } from "lucide-react";

function Navbar() {
  const navigate = useNavigate();
  const [user] = useState(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        console.error("Failed to parse user from localStorage", error);
        return null;
      }
    }
    return null;
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const getRoleBadgeStyles = (role) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "teacher":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "student":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

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

          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-700 transition hover:-translate-y-0.5 hover:border-emerald-300"
              aria-label="Profile"
            >
              <UserCircle2 size={18} />
              {user && (
                <div className="hidden items-center gap-2 sm:flex">
                  <span className="text-sm font-medium">{user.name}</span>
                  <span
                    className={`rounded-full border px-2 py-0.5 text-xs font-semibold uppercase ${getRoleBadgeStyles(user.role)}`}
                  >
                    {user.role}
                  </span>
                </div>
              )}
              <ChevronDown size={14} className="text-slate-500" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-slate-200 bg-white shadow-lg">
                {user && (
                  <div className="border-b border-slate-200 px-4 py-3">
                    <p className="text-sm font-semibold text-slate-800">{user.name}</p>
                    <p className="text-xs text-slate-500">{user.email}</p>
                    <span
                      className={`mt-2 inline-block rounded-full border px-2 py-0.5 text-xs font-semibold uppercase ${getRoleBadgeStyles(user.role)}`}
                    >
                      {user.role}
                    </span>
                  </div>
                )}
                <div className="py-1">
                  <button
                    type="button"
                    onClick={() => {
                      setDropdownOpen(false);
                      // Add profile navigation if needed
                    }}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-slate-700 transition hover:bg-slate-50"
                  >
                    <UserIcon size={16} />
                    Profile
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-red-600 transition hover:bg-red-50"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;