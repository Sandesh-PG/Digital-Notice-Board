import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
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
  const authorRole = notice?.author?.role;

  const canEdit = user && (user.role === "teacher" || user.role === "admin");

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
    <article className="mb-4 rounded-2xl border border-slate-200/80 bg-white/95 p-5 shadow-[0_12px_35px_-28px_rgba(15,23,42,0.9)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-26px_rgba(6,95,70,0.45)]">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold leading-snug text-slate-800 sm:text-xl">{notice?.title}</h2>
          <div className="mt-1 flex items-center gap-2">
            <p className="text-xs font-medium text-slate-500 sm:text-sm">Posted by {notice?.author?.name || "Unknown"}</p>
            {authorRole && (
              <span className="rounded-full border border-cyan-200 bg-cyan-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-cyan-700">
                {authorRole}
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
                className="flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100 focus:ring-2 focus:ring-emerald-300"
                aria-label="Edit notice"
              >
                <Pencil size={14} />
                Edit
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-100 focus:ring-2 focus:ring-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Delete notice"
              >
                <Trash2 size={14} />
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </>
          )}
          {notice?.pinned && (
            <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-amber-700">
              Pinned
            </span>
          )}
        </div>
      </div>
      <p className="mb-4 text-sm leading-relaxed text-slate-600 sm:text-base">{notice?.description}</p>
      <div className="flex flex-wrap items-center gap-2 text-xs font-medium sm:text-sm">
        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-emerald-700">
          {notice?.category || "General"}
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
    expiryDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  }),
  onDelete: PropTypes.func,
};

export default NoticeCard;