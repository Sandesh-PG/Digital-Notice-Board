import { useCallback, useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Bell, CalendarDays, Pin, Plus, Search, Sparkles } from "lucide-react";
import { getNotices } from "../services/api";
import NoticeCard from "../components/NoticeCard";

function Home() {
  const navigate = useNavigate();
  const { selectedCategory } = useOutletContext();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch (error) {
        console.error("Failed to parse user", error);
      }
    }
  }, []);

  const fetchNotices = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const now = new Date();
      let startDate;
      let endDate;

      if (dateFilter === "today") {
        const startOfDay = new Date(now);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(now);
        endOfDay.setHours(23, 59, 59, 999);
        startDate = startOfDay.toISOString();
        endDate = endOfDay.toISOString();
      }

      if (dateFilter === "thisWeek") {
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);
        startDate = startOfWeek.toISOString();
        endDate = endOfWeek.toISOString();
      }

      if (dateFilter === "thisMonth") {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        startOfMonth.setHours(0, 0, 0, 0);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        endOfMonth.setHours(23, 59, 59, 999);
        startDate = startOfMonth.toISOString();
        endDate = endOfMonth.toISOString();
      }

      const res = await getNotices({
        category: selectedCategory,
        search: searchQuery,
        startDate,
        endDate,
      });
      setNotices(Array.isArray(res?.data?.data) ? res.data.data : []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to fetch notices");
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchQuery, dateFilter]);

  useEffect(() => {
    fetchNotices();
  }, [fetchNotices]);

  const handleDeleteNotice = async () => {
    await fetchNotices();
  };

  const pinnedCount = notices.filter((notice) => notice?.pinned).length;
  const upcomingEventsCount = notices.filter((notice) => notice?.category === "event").length;
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const newThisWeekCount = notices.filter((notice) => {
    if (!notice?.createdAt) return false;
    return new Date(notice.createdAt) >= oneWeekAgo;
  }).length;
  const announcementCount = notices.filter((notice) => notice?.category === "announcement").length;

  const stats = [
    {
      label: "Total Notices",
      value: notices.length,
      icon: Bell,
      tone: "border-emerald-200/80 bg-emerald-50/70 text-emerald-700",
    },
    {
      label: "Pinned",
      value: pinnedCount,
      icon: Pin,
      tone: "border-amber-200/80 bg-amber-50/70 text-amber-700",
    },
    {
      label: "Upcoming Events",
      value: upcomingEventsCount,
      icon: CalendarDays,
      tone: "border-cyan-200/80 bg-cyan-50/70 text-cyan-700",
    },
    {
      label: "New This Week",
      value: newThisWeekCount,
      icon: Sparkles,
      tone: "border-violet-200/80 bg-violet-50/70 text-violet-700",
    },
  ];

  return (
    <div className="w-full max-w-none">
      <section className="relative z-0 mb-8 overflow-hidden rounded-3xl border border-slate-200/80 bg-linear-to-r from-white via-emerald-50 to-cyan-50 p-6 shadow-[0_12px_36px_-30px_rgba(15,23,42,0.9)] sm:p-8">
        <div className="pointer-events-none absolute -right-20 -top-16 h-52 w-52 rounded-full bg-cyan-200/25 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 bottom-2 h-40 w-40 rounded-full bg-emerald-300/20 blur-3xl" />
        <div className="relative">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Overview</p>
              <h2 className="mt-2 text-3xl font-bold text-slate-800">Digital Notice Board</h2>
              <p className="mt-4 max-w-2xl text-sm font-normal leading-6 text-slate-600 sm:text-base">
                Track announcements, events, placements, and timetable updates in one clean feed.
              </p>
              <p className="mt-2 text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
                Announcements active: {announcementCount}
              </p>
            </div>

            {user && (user.role === "teacher" || user.role === "admin") && (
              <button
                type="button"
                onClick={() => navigate("/dashboard/create-notice")}
                title="Create Notice"
                className="flex items-center gap-2 rounded-xl bg-emerald-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-200 sm:px-4"
              >
                <Plus size={18} />
                <span className="hidden sm:inline">Create Notice</span>
              </button>
            )}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className={`rounded-2xl border px-4 py-4 shadow-[0_12px_24px_-26px_rgba(15,23,42,0.9)] backdrop-blur-sm ${stat.tone}`}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{stat.label}</p>
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/70 bg-white/70">
                      <Icon size={16} className="text-slate-700" />
                    </span>
                  </div>
                  <p className="mt-2 text-2xl font-bold text-slate-800">{stat.value}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mb-6 rounded-2xl border border-slate-200/80 bg-white px-4 py-4 shadow-[0_10px_24px_-24px_rgba(15,23,42,0.9)] sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="relative max-w-xl flex-1">
            <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search notices by title or description..."
              className="w-full rounded-2xl border border-slate-300/80 bg-white py-3 pl-11 pr-4 text-sm font-medium text-slate-700 shadow-sm outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100"
            />
          </div>
          <div className="w-full lg:w-56">
            <select
              value={dateFilter}
              onChange={(event) => setDateFilter(event.target.value)}
              className="w-full rounded-2xl border border-slate-300/80 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm outline-none transition focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100"
            >
              <option value="all">All</option>
              <option value="today">Today</option>
              <option value="thisWeek">This Week</option>
              <option value="thisMonth">This Month</option>
            </select>
          </div>
        </div>
      </section>

      {loading && (
        <p className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
          Loading notices...
        </p>
      )}
      {error && <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">{error}</p>}

      {!loading && !error && notices.length === 0 && (
        <p className="mb-8 rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-600">No notices available.</p>
      )}

      <div className="space-y-4">
        {notices.map((notice) => (
          <NoticeCard key={notice._id} notice={notice} onDelete={handleDeleteNotice} />
        ))}
      </div>
    </div>
  );
}

export default Home;