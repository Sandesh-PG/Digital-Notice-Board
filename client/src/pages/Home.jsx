import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import API from "../services/api";
import NoticeCard from "../components/NoticeCard";

function Home() {
  const navigate = useNavigate();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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

  const fetchNotices = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await API.get("/notices");
      setNotices(Array.isArray(res?.data?.data) ? res.data.data : []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to fetch notices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleDeleteNotice = async () => {
    await fetchNotices();
  };

  const pinnedCount = notices.filter((notice) => notice?.pinned).length;

  return (
    <div className="w-full max-w-none">
      <section className="mb-6 rounded-3xl border border-slate-200/80 bg-linear-to-r from-white via-emerald-50 to-cyan-50 p-5 shadow-[0_12px_36px_-30px_rgba(15,23,42,0.9)] sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Overview</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-800">Digital Notice Board</h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
              Track announcements, events, placements, and timetable updates in one clean feed.
            </p>
          </div>
          
          {user && (user.role === "teacher" || user.role === "admin") && (
            <button
              type="button"
              onClick={() => navigate("/dashboard/create-notice")}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 hover:-translate-y-0.5 focus:ring-4 focus:ring-emerald-200"
            >
              <Plus size={18} />
              Create Notice
            </button>
          )}
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:max-w-md">
          <div className="rounded-2xl border border-emerald-200 bg-white px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-slate-500">Total Notices</p>
            <p className="mt-1 text-2xl font-semibold text-slate-800">{notices.length}</p>
          </div>
          <div className="rounded-2xl border border-amber-200 bg-white px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-slate-500">Pinned</p>
            <p className="mt-1 text-2xl font-semibold text-slate-800">{pinnedCount}</p>
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
        <p className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-600">No notices available.</p>
      )}

      {notices.map((notice) => (
        <NoticeCard key={notice._id} notice={notice} onDelete={handleDeleteNotice} />
      ))}
    </div>
  );
}

export default Home;