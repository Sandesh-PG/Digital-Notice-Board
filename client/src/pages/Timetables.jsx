import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, ChevronLeft, Filter } from "lucide-react";
import api from "../services/api";

const DEPARTMENTS = ["CSE", "ECE", "ME", "CE", "EEE", "IT", "AIDS", "AIML"];
const SECTIONS = ["A", "B", "C"];
const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const DAY_LABELS = { monday: "Mon", tuesday: "Tue", wednesday: "Wed", thursday: "Thu", friday: "Fri", saturday: "Sat" };
const DAY_FULL = { monday: "Monday", tuesday: "Tuesday", wednesday: "Wednesday", thursday: "Thursday", friday: "Friday", saturday: "Saturday" };

function Timetables() {
  const navigate = useNavigate();
  const [department, setDepartment] = useState("");
  const [semester, setSemester] = useState("");
  const [section, setSection] = useState("");
  const [timetable, setTimetable] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeDay, setActiveDay] = useState("monday");

  const handleFetch = async () => {
    if (!department || !semester || !section) {
      setError("Please select department, semester and section.");
      return;
    }
    setError("");
    setLoading(true);
    setTimetable(null);
    try {
      const res = await api.get("/timetables", {
        params: { department, semester, section },
      });
      const data = res?.data?.data;
      if (!data || data.length === 0) {
        setError("No timetable found for the selected filters.");
      } else {
        setTimetable(data[0]);
        setActiveDay("monday");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to fetch timetable.");
    } finally {
      setLoading(false);
    }
  };

  const activeDays = timetable
    ? (timetable.includeSaturday ? [...Object.keys(DAY_LABELS)] : Object.keys(DAY_LABELS).filter(d => d !== "saturday"))
    : [];

  return (
    <div className="mx-auto max-w-5xl">
      {/* Page header */}
      <div className="mb-6 flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
        >
          <ChevronLeft size={15} />
          <span className="hidden sm:inline">Back</span>
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Timetables</h1>
          <p className="text-sm text-slate-500">View your class schedule</p>
        </div>
      </div>

      {/* Filter card */}
      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <Filter size={14} className="text-emerald-600" />
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Filter Timetable</h2>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Department</label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
            >
              <option value="">Select</option>
              {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Semester</label>
            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
            >
              <option value="">Select</option>
              {SEMESTERS.map((s) => <option key={s} value={s}>Sem {s}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Section</label>
            <select
              value={section}
              onChange={(e) => setSection(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
            >
              <option value="">Select</option>
              {SECTIONS.map((s) => <option key={s} value={s}>Section {s}</option>)}
            </select>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          {error && <p className="text-xs text-red-500">{error}</p>}
          <button
            type="button"
            onClick={handleFetch}
            disabled={loading}
            className="ml-auto rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
          >
            {loading ? "Fetching..." : "View Timetable →"}
          </button>
        </div>
      </div>

      {/* Timetable display */}
      {timetable && (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100">
                <Calendar size={16} className="text-emerald-700" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">
                  {timetable.department} · Sem {timetable.semester} · Section {timetable.section}
                </p>
                <p className="text-xs text-slate-400">{timetable.academicYear} · Created by {timetable.createdBy?.name}</p>
              </div>
            </div>
          </div>

          {/* ── DESKTOP: full table ── */}
          <div className="hidden overflow-x-auto p-4 md:block">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className="w-20 bg-slate-50 px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 rounded-xl">Day</th>
                  {timetable.timeSlots.map((slot, idx) => (
                    <th key={idx} className="min-w-[110px] px-2 py-2">
                      <div className="rounded-lg bg-slate-50 px-2 py-2 text-center text-xs font-semibold text-slate-600">
                        {slot || `Slot ${idx + 1}`}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {activeDays.map((day, dayIdx) => (
                  <tr key={day} className={dayIdx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                    <td className="px-3 py-2">
                      <span className={`inline-block rounded-lg px-2.5 py-1 text-xs font-bold uppercase tracking-wide ${
                        day === "saturday" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
                      }`}>
                        {DAY_LABELS[day]}
                      </span>
                    </td>
                    {timetable.timeSlots.map((_, idx) => {
                      const value = timetable.schedule[day]?.[idx] ?? "-";
                      const isFree = value === "-" || value === "";
                      return (
                        <td key={idx} className="px-1 py-1.5">
                          <div className={`rounded-lg px-2 py-2 text-center text-xs font-semibold ${
                            isFree
                              ? "text-slate-300"
                              : "border border-emerald-100 bg-emerald-50 text-emerald-800"
                          }`}>
                            {value || "-"}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── MOBILE: day tabs ── */}
          <div className="md:hidden">
            <div className="flex overflow-x-auto border-b border-slate-100 px-3 pt-3">
              {activeDays.map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => setActiveDay(day)}
                  className={`shrink-0 rounded-t-lg px-3 py-2 text-xs font-bold uppercase tracking-wide transition ${
                    activeDay === day
                      ? "border-b-2 border-emerald-500 text-emerald-700"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {DAY_LABELS[day]}
                </button>
              ))}
            </div>
            <div className="p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">{DAY_FULL[activeDay]}</p>
              <div className="space-y-2">
                {timetable.timeSlots.map((slot, idx) => {
                  const value = timetable.schedule[activeDay]?.[idx] ?? "-";
                  const isFree = value === "-" || value === "";
                  return (
                    <div key={idx} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5">
                      <span className="w-28 shrink-0 text-xs font-semibold text-slate-500">{slot || `Slot ${idx + 1}`}</span>
                      <span className={`flex-1 rounded-lg px-2 py-1.5 text-center text-xs font-semibold ${
                        isFree ? "text-slate-300" : "border border-emerald-100 bg-emerald-50 text-emerald-800"
                      }`}>
                        {value || "-"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Timetables;