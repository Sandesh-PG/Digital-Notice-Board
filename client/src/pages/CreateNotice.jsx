import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function CreateNotice() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "announcement",
    pinned: false,
    expiryDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await API.post("/notices", {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        pinned: formData.pinned,
        expiryDate: formData.expiryDate || undefined,
      });

      setSuccess(response?.data?.message || "Notice created successfully!");
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        category: "announcement",
        pinned: false,
        expiryDate: "",
      });

      // Redirect to dashboard after 1.5 seconds
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create notice. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 rounded-3xl border border-slate-200/80 bg-linear-to-r from-white via-emerald-50 to-cyan-50 p-5 shadow-[0_12px_36px_-30px_rgba(15,23,42,0.9)] sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">New Notice</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-800">Create Notice</h1>
        <p className="mt-2 text-sm text-slate-600 sm:text-base">
          Add a new announcement, event, or update for students and teachers.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_12px_36px_-30px_rgba(15,23,42,0.9)] sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="title" className="mb-1.5 block text-sm font-semibold text-slate-700">
              Title{" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
              placeholder="Enter notice title"
            />
          </div>

          <div>
            <label htmlFor="description" className="mb-1.5 block text-sm font-semibold text-slate-700">
              Description{" "}
              <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={6}
              className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
              placeholder="Enter detailed description of the notice"
            />
          </div>

          <div>
            <label htmlFor="category" className="mb-1.5 block text-sm font-semibold text-slate-700">
              Category{" "}
              <span className="text-red-500">*</span>
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
            >
              <option value="announcement">Announcements</option>
              <option value="timetable">Timetables</option>
              <option value="placement">Placements</option>
              <option value="event">Events</option>
            </select>
          </div>

          <div>
            <label htmlFor="expiryDate" className="mb-1.5 block text-sm font-semibold text-slate-700">
              Expiry Date
            </label>
            <input
              id="expiryDate"
              name="expiryDate"
              type="date"
              value={formData.expiryDate}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
            />
            <p className="mt-1.5 text-xs text-slate-500">Leave empty if notice has no expiry date</p>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <input
              id="pinned"
              name="pinned"
              type="checkbox"
              checked={formData.pinned}
              onChange={handleChange}
              className="h-4 w-4 cursor-pointer rounded border-slate-300 text-emerald-600 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-0"
            />
            <label htmlFor="pinned" className="cursor-pointer text-sm font-medium text-slate-700">
              Pin this notice to the top
            </label>
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {success}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-200 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Creating..." : "Create Notice"}
            </button>
            <button
              type="button"
              onClick={() => {
                setFormData({
                  title: "",
                  description: "",
                  category: "announcement",
                  pinned: false,
                  expiryDate: "",
                });
                setError("");
                setSuccess("");
              }}
              className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:ring-4 focus:ring-slate-200"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateNotice;
