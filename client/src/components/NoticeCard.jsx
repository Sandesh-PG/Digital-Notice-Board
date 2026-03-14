import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bookmark, Clock3, Pencil, Trash2 } from "lucide-react";
import PropTypes from "prop-types";
import API from "../services/api";

const NoticeCard = ({ notice, onDelete }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const expiryText = notice?.expiryDate
    ? new Date(notice.expiryDate).toLocaleDateString(undefined, {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : null;
  const postedAtText = notice?.createdAt
    ? new Date(notice.createdAt).toLocaleDateString(undefined, {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : null;
  const authorRole = notice?.author?.role;
  const category = notice?.category || "announcement";

  const canEdit = user && (user.role === "teacher" || user.role === "admin");

  const getCategoryClasses = (value) => {
    switch (value) {
      case "event":
        return "border-blue-200 bg-blue-50 text-blue-700";
      case "placement":
        return "border-orange-200 bg-orange-50 text-orange-700";
      case "timetable":
        return "border-violet-200 bg-violet-50 text-violet-700";
      case "announcement":
      default:
        return "border-emerald-200 bg-emerald-50 text-emerald-700";
    }
  };

  const formatCategoryLabel = (value) => {
    switch (value) {
      case "announcement":
        return "Announcement";
      case "timetable":
        return "Timetable";
      case "placement":
        return "Placement";
      case "event":
        return "Event";
      default:
        return value;
    }
  };

  const handleEdit = () => {
    navigate(`/edit-notice/${notice._id}`);
  };

  const handleDelete = async () => {
    const confirmed = globalThis.confirm(
      `Are you sure you want to delete "${notice.title}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setIsDeleting(true);
      await API.delete(`/notices/${notice._id}`);
      if (onDelete) {
        onDelete(notice._id);
      }
    } catch (error) {
      console.error("Failed to delete notice", error);
      alert(error?.response?.data?.message || "Failed to delete notice. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <article className="rounded-2xl border border-slate-200/80 bg-white/95 p-6 shadow-[0_10px_24px_-22px_rgba(15,23,42,0.95)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_34px_-22px_rgba(15,23,42,0.35)]">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold leading-snug text-slate-800 sm:text-xl">{notice?.title}</h2>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <p className="text-xs font-medium text-slate-500 sm:text-sm">Posted by {notice?.author?.name || "Unknown"}</p>
            {authorRole && (
              <span className="rounded-full border border-cyan-200 bg-cyan-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-cyan-700">
                {authorRole}
              </span>
            )}
            {postedAtText && (
              <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-600">
                <Clock3 size={11} />
                {postedAtText}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {canEdit && (
            <>
              <button
                type="button"
                onClick={handleEdit}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700 focus:ring-2 focus:ring-emerald-200"
                aria-label="Edit notice"
              >
                <Pencil size={14} />
                Edit
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-red-300 hover:text-red-700 focus:ring-2 focus:ring-red-200 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Delete notice"
              >
                <Trash2 size={14} />
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </>
          )}
          {notice?.pinned && (
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-amber-700">
              <Bookmark size={12} />
              Pinned
            </span>
          )}
        </div>
      </div>
      <p className="mb-4 text-sm font-normal leading-7 text-slate-600 sm:text-base">{notice?.description}</p>
      <div className="flex flex-wrap items-center gap-2 text-xs font-medium sm:text-sm">
        <span className={`rounded-full border px-2.5 py-1 ${getCategoryClasses(category)}`}>
          {formatCategoryLabel(category)}
        </span>
        {expiryText && (
          <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-slate-600">
            Expires {expiryText}
          </span>
        )}
      </div>
    </article>
  );
};

NoticeCard.propTypes = {
  notice: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    author: PropTypes.shape({
      name: PropTypes.string,
      role: PropTypes.string,
    }),
    category: PropTypes.string,
    pinned: PropTypes.bool,
    createdAt: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    expiryDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  }),
  onDelete: PropTypes.func,
};

export default NoticeCard;